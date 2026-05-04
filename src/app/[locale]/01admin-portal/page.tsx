import { prisma } from '@/lib/prisma';
import { 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Package,
  ArrowUpRight,
  AlertTriangle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import SalesChart from '@/components/admin/SalesChart';

export default async function AdminDashboard({ searchParams }: { searchParams: { range?: string } }) {
  const rangeDays = parseInt(searchParams?.range || '30');
  const [
    totalOrders, 
    totalProducts, 
    paidOrders,
    lowStockProducts,
    totalUsers,
    abandonedOrders
  ] = await Promise.all([
    prisma.order.count({ where: { status: { not: 'pending' } } }),
    prisma.product.count({ where: { isArchived: false } }),
    prisma.order.findMany({ where: { status: 'paid' } }),
    prisma.product.count({ where: { stock: { lt: 5 }, isArchived: false } }),
    prisma.user.count({ where: { role: 'USER' } }),
    prisma.order.count({ where: { status: 'pending' } }),
  ]);

  const totalRevenue = paidOrders.reduce((acc, order) => acc + order.totalAmount, 0);
  const recentOrders = await prisma.order.findMany({
    where: { status: { not: 'pending' } },
    orderBy: { createdAt: 'desc' },
    take: 5,
  });

  // Calculate sales for dynamic range
  const rangeDate = new Date();
  rangeDate.setDate(rangeDate.getDate() - rangeDays);

  const salesInRange = await prisma.order.findMany({
    where: {
      status: 'paid',
      createdAt: { gte: rangeDate }
    },
    select: {
      createdAt: true,
      totalAmount: true
    }
  });

  // Group sales by day
  const dailySalesMap = new Map();
  for (let i = rangeDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
    dailySalesMap.set(dateStr, 0);
  }

  salesInRange.forEach(order => {
    const dateStr = order.createdAt.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' });
    if (dailySalesMap.has(dateStr)) {
      dailySalesMap.set(dateStr, dailySalesMap.get(dateStr) + order.totalAmount);
    }
  });

  const chartData = Array.from(dailySalesMap.entries()).map(([date, amount]) => ({
    date,
    amount
  }));

  const stats = [
    { label: 'Totale Omzet', value: `€${totalRevenue.toLocaleString('nl-NL')}`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Bestellingen', value: totalOrders, icon: ShoppingBag, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'In afwachting', value: abandonedOrders, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Producten', value: totalProducts, icon: Package, color: 'text-accent-oak', bg: 'bg-orange-50' },
  ];

  // Fetch top selling products
  const topSellingItems = await prisma.orderItem.groupBy({
    by: ['productId', 'productName'],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take: 5
  });

  return (
    <div className="space-y-12 pb-20">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-heading text-primary-anthracite mb-2">Dashboard Overzicht</h1>
          <p className="text-primary-anthracite/50 text-sm italic font-serif">Beheer uw onderneming met één oogopslag.</p>
        </div>
        <div className="text-right hidden sm:block">
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-xs uppercase tracking-widest font-bold text-primary-anthracite">Systeem Operationeel</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex items-center gap-6 group hover:border-accent-oak/30 transition-all duration-500">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-primary-anthracite/40 mb-1 font-bold">{stat.label}</p>
              <p className="text-2xl font-heading text-primary-anthracite">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
           <div className="flex items-center justify-between mb-8">
               <div>
                 <h2 className="text-xl font-heading text-primary-anthracite uppercase tracking-widest">Omzet Trend</h2>
                 <p className="text-xs text-primary-anthracite/40 mt-1">Laatste {rangeDays} dagen overzicht</p>
               </div>
               <div className="flex gap-2">
                 <Link href="?range=7" scroll={false} className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${rangeDays === 7 ? 'bg-primary-anthracite text-white' : 'bg-gray-50 text-primary-anthracite/60 hover:bg-gray-100'}`}>7 Dagen</Link>
                 <Link href="?range=30" scroll={false} className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${rangeDays === 30 ? 'bg-primary-anthracite text-white' : 'bg-gray-50 text-primary-anthracite/60 hover:bg-gray-100'}`}>30 Dagen</Link>
                 <Link href="?range=365" scroll={false} className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold transition-all ${rangeDays === 365 ? 'bg-primary-anthracite text-white' : 'bg-gray-50 text-primary-anthracite/60 hover:bg-gray-100'}`}>1 Jaar</Link>
               </div>
            </div>
           <SalesChart data={chartData} />
        </div>

        {/* Store Health / Quick Alerts */}
        <div className="space-y-6">
           <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-sm font-heading uppercase tracking-widest text-primary-anthracite border-b border-gray-50 pb-4">Winkel Status</h3>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${lowStockProducts > 0 ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                        {lowStockProducts > 0 ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-primary-anthracite/60">Voorraad Status</span>
                   </div>
                   <span className={`text-xs font-bold ${lowStockProducts > 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {lowStockProducts} kritiek
                   </span>
                </div>

                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center">
                        <ShoppingBag size={16} />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-primary-anthracite/60">Systeem</span>
                   </div>
                   <span className="text-xs font-bold text-blue-500">Actief</span>
                </div>
              </div>

              <div className="pt-4">
                <Link href="/nl/01admin-portal/products" className="block w-full bg-primary-anthracite text-white text-center py-4 rounded-xl text-[10px] uppercase tracking-widest font-bold hover:bg-accent-oak transition-all shadow-lg">
                  Voorraad Beheren
                </Link>
              </div>
           </div>

           <div className="bg-accent-oak/5 p-8 rounded-3xl border border-accent-oak/10">
              <h3 className="text-xs uppercase tracking-widest font-bold text-accent-oak mb-4 italic font-serif">Winkelnotitie</h3>
              <p className="text-sm text-primary-anthracite/70 leading-relaxed">
                Er zijn momenteel {abandonedOrders} bestellingen die wachten op betaling. U kunt deze volgen in het tabblad "In afwachting".
              </p>
           </div>
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-heading text-primary-anthracite uppercase tracking-widest">Populairste Producten</h2>
            <p className="text-xs text-primary-anthracite/40 mt-1">Populaire Items (Top 5)</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-primary-anthracite/40 font-bold">Product ID</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-primary-anthracite/40 font-bold">Productnaam</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-primary-anthracite/40 font-bold text-right">Verkocht (Stuks)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topSellingItems.map((item) => (
                <tr key={item.productId} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-8 py-5 text-[10px] text-primary-anthracite/50 font-medium">#{item.productId.slice(-8)}</td>
                  <td className="px-8 py-5 text-sm font-bold text-primary-anthracite">{item.productName}</td>
                  <td className="px-8 py-5 text-right font-heading text-lg text-accent-oak">{item._sum.quantity}</td>
                </tr>
              ))}
              {topSellingItems.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-8 py-16 text-center text-primary-anthracite/40 text-xs font-bold uppercase tracking-widest">
                    Geen verkoopdata beschikbaar.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-heading text-primary-anthracite uppercase tracking-widest">Recente Bestellingen</h2>
            <p className="text-xs text-primary-anthracite/40 mt-1">Laatste 5 transacties</p>
          </div>
          <Link href="/nl/01admin-portal/orders" className="text-xs uppercase tracking-widest font-bold text-accent-oak flex items-center gap-2 hover:gap-3 transition-all">
            Alle Bestellingen <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-primary-anthracite/40 font-bold">Bestelling</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-primary-anthracite/40 font-bold">Klant</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-primary-anthracite/40 font-bold">Totaal</th>
                <th className="px-8 py-5 text-[10px] uppercase tracking-widest text-primary-anthracite/40 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-primary-anthracite">#{order.orderNumber}</p>
                    <p className="text-[10px] text-primary-anthracite/40 uppercase font-medium">
                      {new Date(order.createdAt).toLocaleDateString('nl-NL', { day: '2-digit', month: 'short' })}
                    </p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm text-primary-anthracite font-medium">{order.customerName}</p>
                    <p className="text-[10px] text-primary-anthracite/40">{order.customerEmail}</p>
                  </td>
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-primary-anthracite">€{order.totalAmount.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</p>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full font-bold ${
                      order.status === 'paid' ? 'bg-green-100 text-green-700' : 
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentOrders.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-16 text-center text-primary-anthracite/40 text-xs font-bold uppercase tracking-widest">
                    Nog geen bestellingen gevonden.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
