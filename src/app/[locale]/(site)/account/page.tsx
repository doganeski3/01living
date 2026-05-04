import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ShoppingBag, Package, MapPin, Calendar, CreditCard, Truck } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

export default async function AccountPage() {
  const session = await getServerSession(authOptions);
  const locale = await getLocale();
  const t = await getTranslations("Account");

  if (!session?.user?.email) {
    redirect(`/${locale}/login`);
  }
  
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      orders: {
        where: {
          status: { not: 'pending' }
        },
        orderBy: { createdAt: "desc" },
        include: { items: true }
      }
    }
  });

  if (!user) return null;

  const getStatusLabel = (s: string) => {
    switch (s) {
      case 'pending': return t('status.pending');
      case 'paid': return t('status.paid');
      case 'shipped': return t('status.shipped');
      case 'delivered': return t('status.delivered');
      case 'cancelled': return t('status.cancelled');
      default: return s;
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <header>
        <h2 className="text-3xl font-heading text-primary-anthracite uppercase tracking-widest mb-2">{t("orderHistory")}</h2>
        <p className="text-primary-anthracite/50 font-serif italic">{t("orderHistorySubtitle")}</p>
      </header>
      
      <div className="space-y-10">
        {user.orders.map((order) => (
          <div key={order.id} className="bg-white rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-500 group">
            {/* Order Header */}
            <div className="bg-gray-50/50 p-8 md:p-10 border-b border-gray-100 flex flex-wrap items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                 <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-accent-oak shadow-sm">
                    <Package size={24} />
                 </div>
                 <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary-anthracite/40 mb-1">{t("orderNumber")}</p>
                    <p className="font-heading text-xl uppercase tracking-widest text-primary-anthracite">#{order.orderNumber}</p>
                 </div>
              </div>

              <div className="flex flex-wrap items-center gap-12">
                 <div className="hidden sm:block">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary-anthracite/40 mb-1">{t("orderDate")}</p>
                    <div className="flex items-center gap-2 text-sm font-medium">
                       <Calendar size={14} className="text-accent-oak" />
                       {new Date(order.createdAt).toLocaleDateString(locale === 'nl' ? 'nl-NL' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </div>
                 </div>
                 <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary-anthracite/40 mb-1">{t("orderStatus")}</p>
                    <span className={`inline-block text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full font-bold shadow-sm ${
                      order.status === 'paid' ? 'bg-green-500 text-white' : 
                      order.status === 'pending' ? 'bg-yellow-500 text-white' : 
                      order.status === 'delivered' ? 'bg-emerald-500 text-white' :
                      order.status === 'shipped' ? 'bg-blue-500 text-white' :
                      'bg-gray-400 text-white'
                    }`}>
                      {getStatusLabel(order.status)}
                    </span>
                 </div>
              </div>
            </div>
            
            {/* Order Body */}
            <div className="p-8 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Products List */}
              <div className="lg:col-span-2 space-y-6">
                 <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary-anthracite/30 flex items-center gap-3">
                   <Package size={14} /> {t("orderItems")}
                 </h3>
                 <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-5 bg-primary-ivory/30 rounded-2xl border border-gray-50 group/item hover:border-accent-oak/20 transition-colors">
                         <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center font-bold text-xs text-accent-oak shadow-sm">
                               {item.quantity}x
                            </div>
                            <div>
                               <p className="text-sm font-bold text-primary-anthracite">{(item as { productName?: string }).productName || (locale === 'nl' ? 'Luxe Meubel' : 'Luxury Furniture')}</p>
                               {(item as { variantName?: string }).variantName && (
                                 <p className="text-[10px] text-accent-oak font-bold uppercase mt-0.5 tracking-wider italic">
                                   Variant: {(item as { variantName?: string }).variantName}
                                 </p>
                               )}
                               <p className="text-[10px] text-primary-anthracite/40 uppercase font-bold mt-0.5">{t('articleNr')}: #{item.productId.slice(-6)}</p>
                            </div>
                         </div>
                         <p className="font-heading text-primary-anthracite">€{item.price.toLocaleString(locale === 'nl' ? 'nl-NL' : 'en-US')}</p>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Delivery Details */}
              <div className="space-y-8">
                 <section className="space-y-4">
                    <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary-anthracite/30 flex items-center gap-3">
                      <MapPin size={14} /> {t('orderAddress')}
                    </h3>
                    <div className="text-sm font-medium text-primary-anthracite/70 space-y-1">
                       <p className="text-primary-anthracite font-bold">{order.street} {order.houseNumber}{order.addition}</p>
                       <p>{order.postalCode} {order.city}</p>
                       <p className="text-[10px] uppercase tracking-widest font-bold text-accent-oak pt-2">{order.country}</p>
                    </div>
                 </section>

                 {order.status === 'shipped' && order.trackingCode && (
                   <section className="pt-8 border-t border-gray-50 space-y-4">
                     <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-accent-oak flex items-center gap-3">
                       <Truck size={14} /> {t("orderTracking")}
                     </h3>
                     <div className="bg-accent-oak/5 p-4 rounded-2xl border border-accent-oak/10">
                       <p className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40 mb-1">{order.shippingCarrier || t("orderTrackingCarrier")}</p>
                       <p className="text-sm font-bold text-primary-anthracite flex items-center justify-between">
                         {order.trackingCode}
                         <a 
                           href={
                             order.shippingCarrier === 'PostNL' ? `https://joy.postnl.nl/track-and-trace/${order.trackingCode}/NL/${order.postalCode}` :
                             order.shippingCarrier === 'DHL' ? `https://www.dhlparcel.nl/nl/consument/track-en-trace?tc=${order.trackingCode}` :
                             `#`
                           } 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-[10px] text-accent-oak hover:underline"
                         >
                           {t("orderTrackingLink")}
                         </a>
                       </p>
                     </div>
                   </section>
                 )}

                 <section className="pt-8 border-t border-gray-50 space-y-4">
                    <div className="flex justify-between items-end">
                       <div className="space-y-1">
                          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-primary-anthracite/30">{t("orderTotal")}</p>
                          <div className="flex items-center gap-2 text-primary-anthracite/40">
                             <CreditCard size={14} />
                             <span className="text-[10px] uppercase font-bold tracking-widest">iDEAL / Mollie</span>
                          </div>
                       </div>
                       <p className="text-3xl font-heading text-primary-anthracite">€{order.totalAmount.toLocaleString(locale === 'nl' ? 'nl-NL' : 'en-US')}</p>
                    </div>
                 </section>
              </div>
            </div>
          </div>
        ))}

        {user.orders.length === 0 && (
          <div className="text-center py-24 bg-white rounded-[3rem] border border-gray-100 space-y-8">
            <div className="w-24 h-24 bg-primary-ivory rounded-full flex items-center justify-center mx-auto text-primary-anthracite/10">
               <ShoppingBag size={48} strokeWidth={1} />
            </div>
            <div className="space-y-2">
               <p className="text-xl font-heading text-primary-anthracite uppercase tracking-widest">{t("noOrders")}</p>
               <p className="text-primary-anthracite/40 font-serif italic">{t("noOrdersSubtitle")}</p>
            </div>
            <Link href={`/${locale}/collecties`} className="inline-block bg-primary-anthracite text-primary-ivory px-12 py-5 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-accent-oak transition-all shadow-xl">
              {t("viewCollection")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
