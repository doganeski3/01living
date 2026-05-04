import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { CheckCircle, Clock, XCircle, ArrowRight, ShoppingBag } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { notFound } from 'next/navigation';

interface Props {
  params: { locale: string };
  searchParams: { orderId?: string };
}

export default async function ConfirmationPage({ params: { locale }, searchParams }: Props) {
  const orderId = searchParams.orderId;

  if (!orderId) notFound();

  const order = await prisma.order.findUnique({
    where: { orderNumber: orderId },
    include: { items: true }
  });

  if (!order) notFound();

  const isPaid = order.status === 'paid' || order.status === 'shipped' || order.status === 'delivered';
  const isPending = order.status === 'pending';
  const isFailed = order.status === 'failed' || order.status === 'cancelled';

  return (
    <main className="min-h-screen bg-primary-ivory">
      <Navbar />
      
      <div className="pt-40 pb-32 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-20 space-y-6">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white shadow-sm mb-8 animate-in zoom-in duration-1000">
              {isPaid && <CheckCircle size={40} strokeWidth={1} className="text-accent-oak" />}
              {isPending && <Clock size={40} strokeWidth={1} className="text-yellow-600" />}
              {isFailed && <XCircle size={40} strokeWidth={1} className="text-red-400" />}
            </div>
            
            <h1 className="text-5xl md:text-7xl font-heading text-primary-anthracite leading-tight tracking-tight">
              {isPaid ? 'Uitmuntende Keuze.' : isPending ? 'Bijna Klaar.' : 'Even Geduld.'}
            </h1>
            
            <p className="text-xl md:text-2xl font-serif italic text-primary-anthracite/60 max-w-2xl mx-auto leading-relaxed">
              {isPaid 
                ? `Bedankt voor uw bestelling, ${order.customerName.split(' ')[0]}. Uw interieur staat op het punt te transformeren.`
                : isPending 
                ? 'Uw betaling wordt momenteel verwerkt door onze bank. We sturen u direct een bericht zodra het is afgerond.'
                : 'Helaas is de betaling niet gelukt. We hebben uw bestelling bewaard zodat u het opnieuw kunt proberen.'
              }
            </p>
          </div>

          {/* Details Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="md:col-span-2 bg-white p-12 rounded-[3rem] shadow-sm border border-primary-anthracite/5 space-y-12">
               {/* Order Items Summary */}
               <div className="space-y-6">
                 <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent-oak">Uw Selectie</p>
                 <div className="divide-y divide-gray-50">
                    {order.items.map((item) => (
                      <div key={item.id} className="py-4 flex justify-between items-center">
                        <div>
                          <p className="font-bold text-sm text-primary-anthracite uppercase tracking-widest">{item.productName}</p>
                          <p className="text-[10px] text-primary-anthracite/40 uppercase tracking-widest">{item.variantName || 'Standaard Configuatie'} x {item.quantity}</p>
                        </div>
                        <p className="font-heading text-sm">€{item.price.toLocaleString('nl-NL')}</p>
                      </div>
                    ))}
                 </div>
                 <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                    <p className="text-sm font-bold uppercase tracking-widest">Totaal Bedrag</p>
                    <p className="text-2xl font-heading">€{order.totalAmount.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</p>
                 </div>
               </div>
            </div>

            <div className="space-y-8">
              <div className="bg-primary-anthracite text-primary-ivory p-10 rounded-[2.5rem] shadow-2xl space-y-6 h-full">
                <p className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-40">Verzending</p>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="font-bold text-sm">{order.customerName}</p>
                    <p className="text-xs opacity-60 leading-relaxed font-light">
                      {order.street} {order.houseNumber}{order.addition}<br />
                      {order.postalCode} {order.city}<br />
                      {order.country}
                    </p>
                  </div>
                  
                  <div className="pt-6 border-t border-white/10 space-y-4">
                    <div className="flex justify-between items-center text-[10px] uppercase tracking-widest font-bold">
                      <span className="opacity-40 text-white">Order ID</span>
                      <span>#{order.orderNumber}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <Link
              href={`/${locale}/collecties`}
              className="w-full md:w-auto px-16 py-6 bg-accent-oak text-white rounded-full uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-primary-anthracite transition-all shadow-xl text-center"
            >
              Verder Winkelen
            </Link>
            
            <Link
              href={`/${locale}/account`}
              className="group flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] font-bold text-primary-anthracite/40 hover:text-primary-anthracite transition-all"
            >
              Mijn Bestellingen <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
