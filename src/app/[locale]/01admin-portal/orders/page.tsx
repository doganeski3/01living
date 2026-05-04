import { prisma } from "@/lib/prisma";
import OrdersTable from "./OrdersTable";

interface Props {
  searchParams: {
    page?: string;
    search?: string;
    status?: string;
  };
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || "";
  const status = searchParams.status || "all";
  const pageSize = 10; // Her sayfada 10 sipariş

  // Filtreleme koşulları
  const where = {
    status: status === "all" ? { not: 'pending' } : status,
    OR: search ? [
      { orderNumber: { contains: search, mode: 'insensitive' as const } },
      { customerName: { contains: search, mode: 'insensitive' as const } },
      { customerEmail: { contains: search, mode: 'insensitive' as const } },
    ] : undefined
  };

  // Verileri çek (Sayfalanmış)
  const [orders, totalCount] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { items: true },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.order.count({ where })
  ]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-heading text-primary-anthracite uppercase tracking-[0.2em]">Bestellingen</h1>
          <p className="text-[10px] text-primary-anthracite/40 font-serif italic mt-1">Beheer ve volg alle klantbestellingen.</p>
        </div>
        <div className="bg-accent-oak/5 border border-accent-oak/10 px-6 py-2 rounded-2xl hidden md:block">
           <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-accent-oak">Totaal: {totalCount}</p>
        </div>
      </div>

      <OrdersTable 
        initialOrders={JSON.parse(JSON.stringify(orders))} 
        currentPage={page}
        totalPages={totalPages}
        currentSearch={search}
        currentStatus={status}
      />
    </div>
  );
}
