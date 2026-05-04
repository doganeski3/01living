import { NextResponse } from 'next/server';
import { mollieClient } from '@/lib/mollie';
import { prisma } from '@/lib/prisma';
import { sendOrderEmails } from '@/lib/mail';
import { adjustStock } from '@/lib/stock';

export async function POST(req: Request) {
  try {
    const text = await req.text();
    const params = new URLSearchParams(text);
    const id = params.get('id');

    if (!id) {
      return NextResponse.json({ error: 'No ID provided' }, { status: 400 });
    }

    if (!mollieClient) {
      console.log('MOCK MODE: Webhook received for', id);
      return NextResponse.json({ received: true });
    }

    let mollieObject: any;
    const isOrder = id.startsWith('ord_');

    if (isOrder) {
      mollieObject = await mollieClient.orders.get(id);
    } else {
      mollieObject = await mollieClient.payments.get(id);
    }
    
    // Update order status in DB
    let newStatus = 'pending';
    const status = mollieObject.status;

    if (status === 'paid' || status === 'authorized' || status === 'completed') {
      newStatus = 'paid';
    } else if (status === 'canceled') {
      newStatus = 'cancelled';
    } else if (status === 'failed') {
      newStatus = 'failed';
    } else if (status === 'expired') {
      newStatus = 'expired';
    }

    const order = await prisma.order.findUnique({
      where: { molliePaymentId: id }
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // STOCK ADJUSTMENT
    if (newStatus === 'paid') {
      await adjustStock(order.id, 'deduct');
    } else if (newStatus === 'cancelled') {
      await adjustStock(order.id, 'restore');
    }

    // Send emails ONLY if status is changing to 'paid' and it wasn't already paid
    const isFirstTimePaid = newStatus === 'paid' && order.status !== 'paid';

    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: { status: newStatus }
    });

    if (isFirstTimePaid) {
      await sendOrderEmails({
        orderNumber: updatedOrder.orderNumber,
        customerName: updatedOrder.customerName,
        customerEmail: updatedOrder.customerEmail,
        totalAmount: updatedOrder.totalAmount,
        locale: updatedOrder.locale || 'nl'
      });
    }

    console.log(`Order updated for ${id}. Status: ${newStatus} (${status})`);
    
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Mollie Webhook Error:', error);
    return NextResponse.json({ error: 'Webhook Error' }, { status: 500 });
  }
}
