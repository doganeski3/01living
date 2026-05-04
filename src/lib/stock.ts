import { prisma } from "./prisma";

/**
 * Adjusts the stock of products in an order.
 * @param orderId The ID of the order
 * @param type 'deduct' to decrease stock, 'restore' to increase stock
 */
export async function adjustStock(orderId: string, type: 'deduct' | 'restore') {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true }
  });

  if (!order) return;

  // Prevent double deduction or double restoration
  if (type === 'deduct' && order.stockAdjusted) return;
  if (type === 'restore' && !order.stockAdjusted) return;

  console.log(`[Stock] ${type === 'deduct' ? 'Deducting' : 'Restoring'} stock for order ${order.orderNumber}`);

  for (const item of order.items) {
    try {
      // 1. Adjust main product stock
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            [type === 'deduct' ? 'decrement' : 'increment']: item.quantity
          }
        }
      });

      // 2. Adjust variant stock if exists
      if (item.variantId) {
        await prisma.productVariant.update({
          where: { id: item.variantId },
          data: {
            stock: {
              [type === 'deduct' ? 'decrement' : 'increment']: item.quantity
            }
          }
        });
      }
    } catch (err) {
      console.error(`[Stock] Failed to adjust stock for item ${item.id}:`, err);
    }
  }

  // Mark the order as adjusted
  await prisma.order.update({
    where: { id: orderId },
    data: { stockAdjusted: type === 'deduct' }
  });
}
