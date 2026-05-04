import { prisma } from "@/lib/prisma";
import OrdersTable from "../orders/OrdersTable";

export default async function AbandonedOrdersPage() {
  const orders = await prisma.order.findMany({
    where: {
      status: 'pending'
    },
    orderBy: { createdAt: 'desc' },
    include: {
      items: true
    }
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading text-primary-anthracite uppercase tracking-[0.2em]">In afwachting</h1>
          <p className="text-[10px] text-primary-anthracite/40 font-serif italic mt-1">Bestellingen waarvan de betaling nog niet is voltooid of in afwachting is.</p>
        </div>
        <div className="bg-red-50 border border-red-100 px-6 py-2 rounded-2xl hidden md:block">
           <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-red-500">In afwachting: {orders.length}</p>
        </div>
      </div>

      <OrdersTable initialOrders={JSON.parse(JSON.stringify(orders))} />
    </div>
  );
}
