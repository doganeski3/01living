import { NextResponse } from 'next/server';
import { mollieClient } from '@/lib/mollie';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import * as z from 'zod';

// Server-side validation schema for full security
const checkoutSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    quantity: z.number().min(1),
    variantId: z.string().optional().nullable(),
  })).min(1),
  customer: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    street: z.string().min(1),
    houseNumber: z.string().min(1),
    addition: z.string().optional().nullable(),
    postalCode: z.string().min(1),
    city: z.string().min(1),
    country: z.literal('Nederland', { errorMap: () => ({ message: 'Alleen levering in Nederland is mogelijk.' }) }),
    billingSameAsShipping: z.boolean(),
    billingStreet: z.string().optional().nullable(),
    billingHouseNumber: z.string().optional().nullable(),
    billingAddition: z.string().optional().nullable(),
    billingPostalCode: z.string().optional().nullable(),
    billingCity: z.string().optional().nullable(),
    companyName: z.string().optional().nullable(),
    vatNumber: z.string().optional().nullable(),
  }),
  locale: z.enum(['nl', 'en']),
});

export async function POST(req: Request) {
  let currentOrderNumber = '';
  try {
    const rawBody = await req.json();
    
    // 1. Strict Server-Side Validation
    const validation = checkoutSchema.safeParse(rawBody);
    if (!validation.success) {
      console.error('[Checkout] Validation Failed:', validation.error.format());
      return NextResponse.json({ 
        error: 'Ongeldige gegevens verstrekt', 
        details: validation.error.format() 
      }, { status: 400 });
    }

    const { items, customer, locale } = validation.data;

    // 2. Session / User Check
    const session = await getServerSession(authOptions);
    const user = session?.user?.email ? await prisma.user.findUnique({ where: { email: session.user.email } }) : null;

    // 3. Product Verification & Price Calculation
    let totalAmount = 0;
    const dbItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({ 
        where: { id: item.id },
        include: { variants: true }
      });
      
      if (!product) {
        return NextResponse.json({ error: `Product niet gevonden: ${item.id}` }, { status: 404 });
      }

      // 3.1. STRICT STOCK CHECK
      if (item.variantId) {
        const variant = product.variants.find(v => v.id === item.variantId);
        if (!variant || variant.stock < item.quantity) {
          return NextResponse.json({ 
            error: locale === 'nl' ? `Onvoldoende voorraad: ${product.nameNl}` : `Insufficient stock: ${product.nameEn}` 
          }, { status: 400 });
        }
      } else if (product.stock < item.quantity) {
        return NextResponse.json({ 
          error: locale === 'nl' ? `Onvoldoende voorraad: ${product.nameNl}` : `Insufficient stock: ${product.nameEn}` 
        }, { status: 400 });
      }

      let price = product.price;
      let variantName = null;

      if (item.variantId) {
        const variant = product.variants.find(v => v.id === item.variantId);
        if (variant) {
          price = variant.price;
          const parts = [];
          if (variant.colorNl) parts.push(`Kleur: ${variant.colorNl}`);
          if (variant.sizeNl) parts.push(`Afmeting: ${variant.sizeNl}`);
          if (variant.nameNl) parts.push(variant.nameNl);
          variantName = parts.join(' - ') || 'Standaard Variant';
        }
      }
      
      totalAmount += price * item.quantity;
      dbItems.push({
        productId: product.id,
        productName: product.nameNl,
        variantId: item.variantId || null,
        variantName: variantName,
        quantity: item.quantity,
        price: price
      });
    }

    // 4. Fetch Site Settings for Shipping & Fees
    const settings = await prisma.settings.findUnique({
      where: { id: 'site-settings' }
    });

    const freeThreshold = settings?.freeShippingThreshold || 0;
    const standardShipping = settings?.shippingFee || 0;
    const shippingAmount = totalAmount >= freeThreshold && freeThreshold > 0 ? 0 : standardShipping;
    
    const finalTotal = totalAmount + shippingAmount;

    // 5. Create Order Transactionally
    currentOrderNumber = `01L-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;
    const host = req.headers.get('host') || 'localhost:3000';
    const protocol = req.headers.get('x-forwarded-proto') || 'http';
    const baseUrl = `${protocol}://${host}`;
    
    const redirectUrl = `${baseUrl}/${locale}/checkout/confirmation?orderId=${currentOrderNumber}`;
    const webhookUrl = `${baseUrl}/api/webhooks/mollie`;

    const order = await prisma.$transaction(async (tx) => {
      return await tx.order.create({
        data: {
          orderNumber: currentOrderNumber,
          userId: user?.id || null,
          customerName: `${customer.firstName} ${customer.lastName}`,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          street: customer.street,
          houseNumber: customer.houseNumber,
          addition: customer.addition || '',
          postalCode: customer.postalCode,
          city: customer.city,
          country: customer.country,
          billingSameAsShipping: customer.billingSameAsShipping,
          billingStreet: customer.billingSameAsShipping ? customer.street : (customer.billingStreet || null),
          billingHouseNumber: customer.billingSameAsShipping ? customer.houseNumber : (customer.billingHouseNumber || null),
          billingAddition: customer.billingSameAsShipping ? customer.addition : (customer.billingAddition || null),
          billingPostalCode: customer.billingSameAsShipping ? customer.postalCode : (customer.billingPostalCode || null),
          billingCity: customer.billingSameAsShipping ? customer.city : (customer.billingCity || null),
          companyName: customer.companyName || '',
          vatNumber: customer.vatNumber || '',
          totalAmount: finalTotal,
          status: 'pending',
          locale: locale,
          items: {
            create: dbItems
          }
        }
      });
    });

    // 6. Payment Gateway Integration (Orders API for Klarna/Cards)
    if (!mollieClient) {
      return NextResponse.json({ checkoutUrl: redirectUrl, orderId: currentOrderNumber });
    }

    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');

    // Prepare Order Lines for Mollie
    // Prepare Mollie Locale
    const mollieLocale = locale === 'nl' ? 'nl_NL' : 'en_NL';

    // Ultimate Phone Formatting (+31 format)
    let formattedPhone = customer.phone.replace(/\s+/g, ''); // Remove spaces
    if (formattedPhone.startsWith('00')) formattedPhone = '+' + formattedPhone.slice(2);
    if (formattedPhone.startsWith('0')) formattedPhone = '+31' + formattedPhone.slice(1);
    if (!formattedPhone.startsWith('+')) formattedPhone = '+31' + formattedPhone;

    // Prepare Order Lines with precise VAT
    let totalVatAmount = 0;
    const lines = dbItems.map((item, index) => {
      const totalLineAmount = item.price * item.quantity;
      // Precision VAT calculation
      const vatAmount = Number((totalLineAmount * 21 / 121).toFixed(2));
      totalVatAmount += vatAmount;
      
      return {
        type: 'physical',
        name: item.variantName ? `${item.productName} (${item.variantName})` : item.productName,
        quantity: item.quantity,
        unitPrice: { currency: 'EUR', value: item.price.toFixed(2) },
        totalAmount: { currency: 'EUR', value: totalLineAmount.toFixed(2) },
        vatRate: '21.00',
        vatAmount: { currency: 'EUR', value: vatAmount.toFixed(2) }
      };
    });

    if (shippingAmount > 0) {
      const shippingVat = Number((shippingAmount * 21 / 121).toFixed(2));
      totalVatAmount += shippingVat;
      lines.push({
        type: 'shipping_fee',
        name: 'Verzendkosten',
        quantity: 1,
        unitPrice: { currency: 'EUR', value: shippingAmount.toFixed(2) },
        totalAmount: { currency: 'EUR', value: shippingAmount.toFixed(2) },
        vatRate: '21.00',
        vatAmount: { currency: 'EUR', value: shippingVat.toFixed(2) }
      } as any);
    }

    const mollieOrder = await mollieClient.orders.create({
      amount: { currency: 'EUR', value: finalTotal.toFixed(2) },
      orderNumber: currentOrderNumber,
      lines: lines,
      locale: mollieLocale as any,
      billingAddress: {
        givenName: customer.firstName,
        familyName: customer.lastName,
        email: customer.email,
        phone: formattedPhone,
        streetAndNumber: `${customer.billingStreet || customer.street} ${customer.billingHouseNumber || customer.houseNumber}`,
        postalCode: customer.billingPostalCode || customer.postalCode,
        city: customer.billingCity || customer.city,
        country: 'NL',
      },
      shippingAddress: {
        givenName: customer.firstName,
        familyName: customer.lastName,
        email: customer.email,
        phone: formattedPhone,
        streetAndNumber: `${customer.street} ${customer.houseNumber}`,
        postalCode: customer.postalCode,
        city: customer.city,
        country: 'NL',
      },
      redirectUrl: redirectUrl,
      ...(isLocalhost ? {} : { webhookUrl: webhookUrl }),
      metadata: { orderId: order.id, orderNumber: currentOrderNumber },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { molliePaymentId: mollieOrder.id }
    });

    return NextResponse.json({ checkoutUrl: mollieOrder.getCheckoutUrl(), orderId: currentOrderNumber });

  } catch (error: any) {
    console.error('[Checkout] Fatal Error:', error);
    
    // Detailed error logging for Mollie
    if (error?.message) {
      console.error('[Checkout] Error Message:', error.message);
    }
    
    // Cleanup: If order was created but Mollie failed, delete the order
    if (currentOrderNumber) {
      try {
        await prisma.order.deleteMany({
          where: { orderNumber: currentOrderNumber }
        });
        console.log(`[Checkout] Cleaned up failed order: ${currentOrderNumber}`);
      } catch (cleanupError) {
        console.error('[Checkout] Cleanup failed:', cleanupError);
      }
    }

    return NextResponse.json({ 
      error: error?.message || 'Er is bir sistemfout opgetreden',
      details: error?.details || null
    }, { status: 500 });
  }
}
