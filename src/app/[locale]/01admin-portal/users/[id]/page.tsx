import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, User as UserIcon, Mail, MapPin, Phone, CreditCard, ShoppingBag, Calendar, Shield } from "lucide-react";

export default async function UserDetailPage({ params: { locale, id } }: { params: { locale: string, id: string } }) {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: 'desc' },
        take: 10
      }
    }
  });

  if (!user) notFound();

  const totalSpent = user.orders.reduce((acc, order) => acc + order.totalAmount, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href={`/${locale}/01admin-portal/users`}
            className="p-3 bg-white border border-gray-100 rounded-2xl text-primary-anthracite/40 hover:text-accent-oak transition-all shadow-sm"
          >
            <ChevronLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-heading text-primary-anthracite uppercase tracking-widest">{user.name || 'Onbekende Klant'}</h1>
            <p className="text-[10px] text-primary-anthracite/40 font-bold uppercase tracking-[0.2em] mt-1">Klant ID: {user.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-white px-6 py-3 rounded-2xl border border-gray-100 shadow-sm">
             <p className="text-[9px] uppercase tracking-widest font-bold text-primary-anthracite/30 mb-1">Totaal Besteld</p>
             <p className="text-xl font-heading text-primary-anthracite">€{totalSpent.toLocaleString('nl-NL')}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
             <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-accent-oak/5 rounded-full flex items-center justify-center text-accent-oak mb-6 shadow-inner">
                   <UserIcon size={40} />
                </div>
                <h3 className="text-xl font-heading text-primary-anthracite">{user.name}</h3>
                <div className="flex items-center gap-2 mt-2 px-3 py-1 bg-gray-50 rounded-full border border-gray-100">
                  <Shield size={12} className="text-accent-oak" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary-anthracite/60">{user.role}</span>
                </div>
             </div>

             <div className="space-y-6 pt-8 border-t border-gray-50">
                <div className="flex items-center gap-4 group">
                   <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-primary-anthracite/20 group-hover:text-accent-oak transition-colors">
                      <Mail size={18} />
                   </div>
                   <div>
                      <p className="text-[9px] uppercase tracking-widest font-bold text-primary-anthracite/30">E-mailadres</p>
                      <p className="text-xs font-bold text-primary-anthracite">{user.email}</p>
                   </div>
                </div>

                <div className="flex items-center gap-4 group">
                   <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-primary-anthracite/20 group-hover:text-accent-oak transition-colors">
                      <Phone size={18} />
                   </div>
                   <div>
                      <p className="text-[9px] uppercase tracking-widest font-bold text-primary-anthracite/30">Telefoon</p>
                      <p className="text-xs font-bold text-primary-anthracite">{user.phone || 'Geen telefoonnummer'}</p>
                   </div>
                </div>

                <div className="flex items-center gap-4 group">
                   <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-primary-anthracite/20 group-hover:text-accent-oak transition-colors">
                      <Calendar size={18} />
                   </div>
                   <div>
                      <p className="text-[9px] uppercase tracking-widest font-bold text-primary-anthracite/30">Klant sinds</p>
                      <p className="text-xs font-bold text-primary-anthracite">{new Date(user.createdAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Billing Info Card */}
          <div className="bg-primary-anthracite p-8 rounded-[2.5rem] text-primary-ivory shadow-2xl space-y-6">
             <div className="flex items-center gap-3 mb-2">
                <MapPin size={20} className="text-accent-oak" />
                <h3 className="font-heading text-lg uppercase tracking-widest">Factuurgegevens</h3>
             </div>
             <div className="space-y-4 text-sm opacity-80 font-serif italic">
                {user.companyName && <p className="font-sans not-italic font-bold text-accent-oak mb-2">{user.companyName}</p>}
                <p>{user.street} {user.houseNumber} {user.addition}</p>
                <p>{user.postalCode} {user.city}</p>
                <p>{user.country}</p>
                {user.vatNumber && (
                   <div className="pt-4 border-t border-white/10 mt-4">
                      <p className="text-[10px] uppercase font-bold tracking-widest opacity-50">BTW Nummer</p>
                      <p className="font-sans not-italic font-bold">{user.vatNumber}</p>
                   </div>
                )}
             </div>
          </div>
        </div>

        {/* Orders & Activity */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                   <ShoppingBag size={20} className="text-accent-oak" />
                   <h3 className="font-heading text-xl text-primary-anthracite uppercase tracking-widest">Bestelgeschiedenis</h3>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary-anthracite/30">{user.orders.length} Sipariş</span>
             </div>

             <div className="space-y-4">
                {user.orders.map((order) => (
                  <Link 
                    key={order.id}
                    href={`/${locale}/01admin-portal/orders`}
                    className="flex items-center justify-between p-6 rounded-3xl border border-gray-50 hover:border-accent-oak/20 hover:bg-accent-oak/5 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-primary-anthracite/20 group-hover:text-accent-oak transition-colors">
                          <CreditCard size={20} />
                       </div>
                       <div>
                          <p className="text-sm font-bold text-primary-anthracite uppercase tracking-widest">#{order.orderNumber.split('-').slice(1).join('-')}</p>
                          <p className="text-[10px] text-primary-anthracite/40">{new Date(order.createdAt).toLocaleDateString('nl-NL')}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className="font-heading text-lg text-primary-anthracite">€{order.totalAmount.toLocaleString('nl-NL')}</p>
                       <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${
                         order.status === 'paid' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'
                       }`}>
                         {order.status}
                       </span>
                    </div>
                  </Link>
                ))}

                {user.orders.length === 0 && (
                  <div className="py-20 text-center space-y-4">
                     <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-primary-anthracite/10">
                        <ShoppingBag size={32} />
                     </div>
                     <p className="text-xs font-serif italic text-primary-anthracite/40">Deze klant heeft nog geen bestellingen geplaatst.</p>
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
