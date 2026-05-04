'use server';

import { prisma } from "@/lib/prisma";
import { mollieClient } from "@/lib/mollie";
import { revalidatePath } from "next/cache";
import { adjustStock } from "@/lib/stock";
import { sendOrderStatusEmail, sendOrderEmails } from "@/lib/mail";

export async function updateOrderStatus(orderId: string, status: string, trackingCode?: string, shippingCarrier?: string) {
  console.log(`[Order Action] Updating status for Order ID: ${orderId} to: ${status}`);
  try {
    const order = await prisma.order.findUnique({ 
      where: { id: orderId } 
    });

    if (!order) {
      console.error(`[Order Action] Order NOT FOUND: ${orderId}`);
      return { success: false, error: "Bestelling niet gevonden." };
    }

    // 1. REFUND LOGIC: If moving from 'paid' to 'cancelled', trigger refund.
    if (status === 'cancelled' && order.status === 'paid') {
      if (order.molliePaymentId && mollieClient) {
        try {
          await mollieClient.paymentRefunds.create({
            paymentId: order.molliePaymentId,
            amount: {
              currency: 'EUR',
              value: order.totalAmount.toFixed(2)
            },
            description: `Refund voor bestelling #${order.orderNumber}`
          });
          console.log(`[Mollie] Refund successful for order ${order.orderNumber}`);
        } catch (mollieError) {
          console.error("Mollie Refund Error:", mollieError);
          return { success: false, error: "Fout bij het aanvragen van Mollie refund." };
        }
      }
    }

    // 2. STOCK LOGIC
    if (status === 'paid' || status === 'shipped' || status === 'delivered') {
      // If moving to a "processed" status, deduct stock if not already done
      await adjustStock(orderId, 'deduct');
    } else if (status === 'cancelled') {
      // If moving to cancelled, restore stock if it was previously deducted
      await adjustStock(orderId, 'restore');
    }

    // 3. UPDATE DATABASE STATUS
    await prisma.order.update({
      where: { id: orderId },
      data: { 
        status,
        ...(trackingCode && { trackingCode }),
        ...(shippingCarrier && { shippingCarrier }),
      }
    });

    // 4. SEND NOTIFICATION EMAIL
    if (status === 'paid') {
      try {
        await sendOrderEmails({
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          totalAmount: order.totalAmount,
          locale: order.locale || 'nl'
        });
      } catch (emailError) {
        console.error("Failed to send manual confirmation email:", emailError);
      }
    } else if (status === 'shipped' || status === 'delivered' || status === 'cancelled') {
      try {
        await sendOrderStatusEmail(
          {
            orderNumber: order.orderNumber,
            customerName: order.customerName,
            customerEmail: order.customerEmail,
            totalAmount: order.totalAmount,
            locale: order.locale || 'nl'
          },
          status as 'shipped' | 'delivered' | 'cancelled',
          trackingCode,
          shippingCarrier
        );
      } catch (emailError) {
        console.error("Failed to send status email:", emailError);
      }
    }

    revalidatePath('/01admin-portal/orders');
    revalidatePath('/account');
    return { success: true };

  } catch (error) {
    console.error("Order update error:", error);
    return { success: false, error: "Er is een fout opgetreden bij het bijwerken." };
  }
}

export async function deleteOrder(orderId: string) {
  try {
    // If deleting a paid order that hasn't been cancelled, maybe we should restore stock?
    // Usually admin should cancel first. But let's be safe.
    await adjustStock(orderId, 'restore');
    
    await prisma.order.delete({
      where: { id: orderId }
    });
    revalidatePath('/01admin-portal/orders');
    return { success: true };
  } catch (error) {
    console.error("Order deletion error:", error);
    return { success: false, error: "Fout bij het verwijderen van bestelling." };
  }
}

export async function bulkDeleteOrders(orderIds: string[]) {
  try {
    for (const id of orderIds) {
      await adjustStock(id, 'restore');
    }
    
    await prisma.order.deleteMany({
      where: { id: { in: orderIds } }
    });
    revalidatePath('/01admin-portal/orders');
    return { success: true };
  } catch (error) {
    console.error("Bulk order deletion error:", error);
    return { success: false, error: "Fout bij het verwijderen van bestellingen." };
  }
}
