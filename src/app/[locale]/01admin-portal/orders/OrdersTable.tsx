'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import StatusSelect from './StatusSelect';
import OrderActions from './OrderActions';
import { 
  Search as SearchIcon, 
  Filter as FilterIcon, 
  User as UserIcon, 
  Package as PackageIcon, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  CreditCard,
  Truck
} from 'lucide-react';

interface Props {
  initialOrders: any[];
  currentPage: number;
  totalPages: number;
  currentSearch: string;
  currentStatus: string;
}

export default function OrdersTable({ initialOrders, currentPage, totalPages, currentSearch, currentStatus }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchTerm, setSearchTerm] = useState(currentSearch);

  const updateParams = (newParams: Record<string, string | number>) => {
    const params = new URLSearchParams(window.location.search);
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === 'all' || value === '') {
        params.delete(key);
      } else {
        params.set(key, value.toString());
      }
    });
    if (!newParams.page) params.set('page', '1');
    
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateParams({ search: searchTerm, page: 1 });
  };

  const renderPaymentBadge = (order: any) => {
    const status = order.status;
    const isPaid = status === 'paid' || status === 'shipped' || status === 'delivered';
    const isPending = status === 'pending';
    const isCancelled = status === 'cancelled';

    if (isPaid) {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 shadow-sm">
          <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
          <div className="text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider block leading-tight">
              Betaald & Goedgekeurd
            </span>
            <span className="text-[8px] font-mono text-emerald-600/75 block">
              {order.molliePaymentId ? `Mollie: ${order.molliePaymentId.slice(0, 10)}...` : 'iDEAL / Kaart'}
            </span>
          </div>
        </div>
      );
    }

    if (isPending) {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 shadow-sm">
          <Clock size={13} className="text-amber-600 shrink-0 animate-pulse" />
          <div className="text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider block leading-tight">
              Wacht op Betaling
            </span>
            <span className="text-[8px] font-mono text-amber-600/75 block">
              Niet voltooid
            </span>
          </div>
        </div>
      );
    }

    if (isCancelled) {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 shadow-sm">
          <AlertCircle size={13} className="text-red-600 shrink-0" />
          <div className="text-left">
            <span className="text-[10px] font-bold uppercase tracking-wider block leading-tight">
              Geannuleerd / Mislukt
            </span>
            <span className="text-[8px] font-mono text-red-600/75 block">
              Geen betaling
            </span>
          </div>
        </div>
      );
    }

    return (
      <span className="text-[10px] font-mono text-gray-500 uppercase">{status}</span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white px-6 py-4 rounded-[1.5rem] shadow-sm border border-gray-100">
        <form onSubmit={handleSearch} className="relative w-full md:w-80 group">
           <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-anthracite/20 group-focus-within:text-accent-oak transition-colors" size={16} />
           <input 
             type="text" 
             placeholder="Zoek ordernummer, klant, e-mail..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full bg-primary-ivory/50 border-none py-2.5 pl-12 pr-6 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-accent-oak/20 transition-all placeholder:text-primary-anthracite/20"
           />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
           <div className="flex items-center gap-2 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100">
              <FilterIcon size={14} className="text-primary-anthracite/40" />
              <select 
                value={currentStatus}
                onChange={(e) => updateParams({ status: e.target.value, page: 1 })}
                className="bg-transparent text-[10px] uppercase tracking-widest font-bold focus:outline-none cursor-pointer"
              >
                <option value="all">Alle Statussen</option>
                <option value="paid">Betaald / Goedgekeurd</option>
                <option value="pending">In afwachting</option>
                <option value="shipped">Verzonden (Onderweg)</option>
                <option value="delivered">Bezorgd</option>
                <option value="cancelled">Geannuleerd</option>
              </select>
           </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-[9px] uppercase tracking-[0.2em] text-primary-anthracite/40 font-bold">
                <th className="px-6 py-4">Order</th>
                <th className="px-6 py-4">Klant</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Totaal</th>
                <th className="px-6 py-4">Betaling & Goedkeuring</th>
                <th className="px-6 py-4">Bestelstatus</th>
                <th className="px-6 py-4 text-right">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {initialOrders.map((order) => (
                <tr key={order.id} className="group hover:bg-primary-ivory/10 transition-colors">
                  {/* Order Number & Date */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-primary-anthracite/20 group-hover:text-accent-oak transition-colors">
                          <PackageIcon size={16} />
                       </div>
                       <div>
                          <p className="font-heading text-sm uppercase tracking-widest text-primary-anthracite">
                            #{order.orderNumber.split('-').slice(1).join('-') || order.orderNumber}
                          </p>
                          <p className="text-[8px] text-primary-anthracite/40 uppercase font-bold">
                            {new Date(order.createdAt).toLocaleDateString('nl-NL')} - {new Date(order.createdAt).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                       </div>
                    </div>
                  </td>

                  {/* Customer Info */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 bg-accent-oak/5 rounded-full flex items-center justify-center text-accent-oak">
                          <UserIcon size={14} />
                       </div>
                       <div>
                          <p className="font-bold text-xs text-primary-anthracite">{order.customerName}</p>
                          <p className="text-[9px] text-primary-anthracite/40">{order.customerEmail}</p>
                       </div>
                    </div>
                  </td>

                  {/* Items Count */}
                  <td className="px-6 py-4">
                    <p className="text-[10px] font-bold text-primary-anthracite">{order.items?.length || 0} st.</p>
                  </td>

                  {/* Total Amount */}
                  <td className="px-6 py-4">
                    <span className="font-heading text-sm font-bold text-primary-anthracite">
                      €{order.totalAmount.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </td>

                  {/* Payment & Approval Status Badge */}
                  <td className="px-6 py-4">
                    {renderPaymentBadge(order)}
                  </td>

                  {/* Order Status Dropdown Selector */}
                  <td className="px-6 py-4">
                    <StatusSelect orderId={order.id} currentStatus={order.status} />
                  </td>

                  {/* Action Buttons (Details, Delete) */}
                  <td className="px-6 py-4 text-right">
                    <OrderActions order={order} />
                  </td>
                </tr>
              ))}

              {initialOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <p className="text-[9px] font-bold text-primary-anthracite/40 uppercase tracking-widest">Geen bestellingen gevonden</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="px-8 py-6 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
          <p className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/30">
            Pagina {currentPage} van {totalPages || 1}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateParams({ page: currentPage - 1 })}
              disabled={currentPage <= 1}
              className="p-2 rounded-xl border border-gray-200 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => updateParams({ page: currentPage + 1 })}
              disabled={currentPage >= totalPages}
              className="p-2 rounded-xl border border-gray-200 hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
