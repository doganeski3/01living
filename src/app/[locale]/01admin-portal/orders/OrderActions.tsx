'use client';

import { useState } from 'react';
import { 
  Trash2, 
  Eye, 
  X, 
  Package, 
  User, 
  CreditCard, 
  Building2, 
  Truck, 
  Printer, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { deleteOrder, updateOrderStatus } from '@/app/actions/orders';
import { motion, AnimatePresence } from 'framer-motion';
import DeleteConfirmModal from '@/components/admin/DeleteConfirmModal';
import OrderInvoice from '@/components/admin/OrderInvoice';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  variantId: string | null;
  variantName: string | null;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string | null;
  street: string;
  houseNumber: string;
  addition: string | null;
  postalCode: string;
  city: string;
  country: string;
  totalAmount: number;
  status: string;
  molliePaymentId?: string | null;
  trackingCode?: string | null;
  shippingCarrier?: string | null;
  companyName: string | null;
  vatNumber: string | null;
  billingSameAsShipping: boolean;
  billingStreet: string | null;
  billingHouseNumber: string | null;
  billingAddition: string | null;
  billingPostalCode: string | null;
  billingCity: string | null;
  items: OrderItem[];
  createdAt: string;
}

export default function OrderActions({ order }: { order: Order }) {
  const [currentStatus, setCurrentStatus] = useState(order.status);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteOrder(order.id);
      if (result.success) {
        setIsDeleteModalOpen(false);
        setShowDetails(false);
      } else {
        alert(result.error);
        setIsDeleting(false);
      }
    } catch (error) {
      alert('Er is een fout opgetreden bij het verwijderen van de bestelling.');
      setIsDeleting(false);
    }
  };

  const handleQuickStatus = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const result = await updateOrderStatus(order.id, newStatus);
      if (result.success) {
        setCurrentStatus(newStatus);
      } else {
        alert(result.error);
      }
    } catch (err) {
      alert('Fout bij status update');
    }
    setIsUpdating(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const isPaid = currentStatus === 'paid' || currentStatus === 'shipped' || currentStatus === 'delivered';
  const isPending = currentStatus === 'pending';
  const isCancelled = currentStatus === 'cancelled';

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        <button 
          onClick={() => setShowDetails(true)}
          className="text-[10px] uppercase tracking-widest font-bold bg-gray-50 hover:bg-gray-100 text-primary-anthracite px-4 py-2 rounded-lg transition-all flex items-center gap-2"
        >
          <Eye size={14} /> Details
        </button>
        <DeleteConfirmModal 
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDelete}
          loading={isDeleting}
          title="Bestelling Verwijderen"
          description={`Weet u zeker dat u bestelling #${order.orderNumber} wilt verwijderen? Deze actie kan niet ongedaan worden gemaakt.`}
        />
        <button 
          onClick={() => setIsDeleteModalOpen(true)}
          disabled={isDeleting}
          className="p-2 text-primary-anthracite/20 hover:text-red-500 transition-colors disabled:opacity-50"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <AnimatePresence>
        {showDetails && (
          <>
            {/* Modal Dialog */}
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowDetails(false)}
                className="absolute inset-0 bg-primary-anthracite/60 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 30 }}
                className="relative bg-primary-ivory w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-[3rem] shadow-2xl flex flex-col md:flex-row custom-scrollbar"
              >
                {/* Left Side: Order Info & Payment Status Summary */}
                <div className="w-full md:w-80 bg-white p-10 border-r border-gray-100 shrink-0 flex flex-col justify-between">
                  <div>
                    <button 
                      onClick={() => setShowDetails(false)}
                      className="md:hidden absolute top-8 right-8 text-primary-anthracite/40"
                    >
                      <X size={24} />
                    </button>

                    <div className="space-y-8">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent-oak mb-2">Bestelling</p>
                        <h2 className="text-2xl font-heading text-primary-anthracite uppercase tracking-widest">#{order.orderNumber}</h2>
                        <p className="text-xs text-primary-anthracite/40 font-bold uppercase mt-1">
                          {new Date(order.createdAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })} om {new Date(order.createdAt).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>

                      {/* Payment Status Card */}
                      <div className="p-5 rounded-2xl border border-gray-100 bg-gray-50/50 space-y-3">
                        <p className="text-[9px] uppercase tracking-[0.25em] font-bold text-primary-anthracite/40">Betaling & Goedkeuring</p>
                        
                        {isPaid && (
                          <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200">
                            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider">Betaald & Goedgekeurd</p>
                              <p className="text-[9px] text-emerald-600/80">Transactie succesvol afgerond</p>
                            </div>
                          </div>
                        )}

                        {isPending && (
                          <div className="flex items-center gap-2 text-amber-700 bg-amber-50 px-3 py-2 rounded-xl border border-amber-200">
                            <Clock size={16} className="text-amber-600 shrink-0 animate-pulse" />
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider">In Afwachting</p>
                              <p className="text-[9px] text-amber-600/80">Betaling nog niet ontvangen</p>
                            </div>
                          </div>
                        )}

                        {isCancelled && (
                          <div className="flex items-center gap-2 text-red-700 bg-red-50 px-3 py-2 rounded-xl border border-red-200">
                            <AlertCircle size={16} className="text-red-600 shrink-0" />
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider">Geannuleerd</p>
                              <p className="text-[9px] text-red-600/80">Bestelling afgebroken</p>
                            </div>
                          </div>
                        )}

                        {order.molliePaymentId && (
                          <div className="pt-2 border-t border-gray-200/50">
                            <p className="text-[8px] uppercase tracking-widest text-primary-anthracite/40 font-bold">Mollie ID</p>
                            <p className="text-[10px] font-mono font-bold text-primary-anthracite">{order.molliePaymentId}</p>
                          </div>
                        )}
                      </div>

                      {/* Total Amount Box */}
                      <div className="p-5 rounded-2xl bg-primary-anthracite text-primary-ivory">
                        <p className="text-[9px] uppercase tracking-widest font-bold opacity-40 mb-1">Totaalbedrag (Incl. BTW)</p>
                        <p className="text-3xl font-heading">€{order.totalAmount.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                      </div>

                      {/* Quick Status Modifiers */}
                      <div className="space-y-2 pt-2">
                        <p className="text-[9px] uppercase tracking-[0.2em] font-bold text-primary-anthracite/40">Status Wijzigen</p>
                        <div className="grid grid-cols-2 gap-2">
                          {currentStatus !== 'paid' && (
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => handleQuickStatus('paid')}
                              className="text-[9px] uppercase font-bold tracking-wider py-2 px-3 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors border border-emerald-200"
                            >
                              ✓ Goedkeuren
                            </button>
                          )}
                          {currentStatus !== 'shipped' && (
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => handleQuickStatus('shipped')}
                              className="text-[9px] uppercase font-bold tracking-wider py-2 px-3 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors border border-blue-200"
                            >
                              🚚 Verzenden
                            </button>
                          )}
                          {currentStatus !== 'delivered' && (
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => handleQuickStatus('delivered')}
                              className="text-[9px] uppercase font-bold tracking-wider py-2 px-3 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 transition-colors border border-purple-200"
                            >
                              📦 Bezorgd
                            </button>
                          )}
                          {currentStatus !== 'cancelled' && (
                            <button
                              type="button"
                              disabled={isUpdating}
                              onClick={() => handleQuickStatus('cancelled')}
                              className="text-[9px] uppercase font-bold tracking-wider py-2 px-3 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-colors border border-red-200"
                            >
                              ✕ Annuleren
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button 
                      onClick={handlePrint}
                      className="w-full text-[10px] uppercase tracking-widest font-bold bg-primary-anthracite text-primary-ivory px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-3 hover:bg-accent-oak shadow-md"
                    >
                      <Printer size={16} /> Factuur Afdrukken
                    </button>
                  </div>
                </div>

                {/* Right Side: Detailed Sections */}
                <div className="flex-1 p-10 md:p-12 space-y-12">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Customer Information */}
                    <div className="space-y-8">
                      <section className="space-y-4">
                        <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary-anthracite flex items-center gap-3">
                          <User size={16} className="text-accent-oak" /> Persoonlijke Gegevens
                        </h3>
                        <div className="bg-white/80 p-5 rounded-2xl border border-gray-100 space-y-1">
                          <p className="text-base font-heading text-primary-anthracite">{order.customerName}</p>
                          <p className="text-xs text-primary-anthracite/60 font-medium">{order.customerEmail}</p>
                          <p className="text-xs text-primary-anthracite/60 font-medium">{order.customerPhone || 'Geen telefoonnummer'}</p>
                        </div>
                      </section>

                      <section className="space-y-4">
                        <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary-anthracite flex items-center gap-3">
                          <Truck size={16} className="text-accent-oak" /> Bezorgadres
                        </h3>
                        <div className="bg-white/80 p-5 rounded-2xl border border-gray-100 space-y-1">
                          <p className="text-sm font-heading text-primary-anthracite">{order.street} {order.houseNumber}{order.addition}</p>
                          <p className="text-xs text-primary-anthracite/60 font-medium">{order.postalCode} {order.city}</p>
                          <p className="text-[10px] uppercase tracking-widest font-bold text-accent-oak pt-1">{order.country}</p>
                        </div>
                      </section>
                    </div>

                    {/* Billing & Business */}
                    <div className="space-y-8">
                      <section className="space-y-4">
                        <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary-anthracite flex items-center gap-3">
                          <Building2 size={16} className="text-accent-oak" /> Factuurgegevens
                        </h3>
                        <div className="bg-white/80 p-5 rounded-2xl border border-gray-100">
                          {order.billingSameAsShipping ? (
                            <p className="text-xs text-primary-anthracite/40 italic font-medium">Zelfde als bezorgadres</p>
                          ) : (
                            <div className="space-y-1">
                              <p className="text-sm font-bold">{order.billingStreet} {order.billingHouseNumber}{order.billingAddition}</p>
                              <p className="text-xs text-primary-anthracite/60">{order.billingPostalCode} {order.billingCity}</p>
                            </div>
                          )}
                          
                          {(order.companyName || order.vatNumber) && (
                            <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
                               {order.companyName && (
                                 <div>
                                   <p className="text-[9px] uppercase tracking-widest font-bold text-primary-anthracite/30">Bedrijfsnaam</p>
                                   <p className="text-xs font-bold">{order.companyName}</p>
                                 </div>
                               )}
                               {order.vatNumber && (
                                 <div>
                                   <p className="text-[9px] uppercase tracking-widest font-bold text-primary-anthracite/30">BTW-Nummer</p>
                                   <p className="text-xs font-bold">{order.vatNumber}</p>
                                 </div>
                               )}
                            </div>
                          )}
                        </div>
                      </section>

                      <section className="space-y-4">
                        <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary-anthracite flex items-center gap-3">
                          <CreditCard size={16} className="text-accent-oak" /> Betaalmethode & Verificatie
                        </h3>
                        <div className="bg-white/80 p-5 rounded-2xl border border-gray-100 flex items-center gap-4">
                          <div className="w-10 h-10 bg-accent-oak/10 rounded-full flex items-center justify-center text-accent-oak shrink-0">
                            <ShieldCheck size={20} />
                          </div>
                          <div>
                            <p className="text-xs font-bold">iDEAL / Creditcard / Bancontact</p>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-emerald-600">Beveiligd via Mollie Payments</p>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>

                  {/* Items Table */}
                  <section className="space-y-4">
                    <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary-anthracite flex items-center gap-3">
                      <Package size={16} className="text-accent-oak" /> Bestelde Producten ({order.items?.length || 0})
                    </h3>
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gray-50/70 border-b border-gray-100 text-[9px] uppercase tracking-widest text-primary-anthracite/40 font-bold">
                            <th className="px-6 py-3.5">Product</th>
                            <th className="px-6 py-3.5">Aantal</th>
                            <th className="px-6 py-3.5 text-right">Prijs</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {order.items && order.items.length > 0 ? (
                            order.items.map((item) => (
                              <tr key={item.id} className="text-xs">
                                <td className="px-6 py-3.5">
                                  <p className="font-bold text-primary-anthracite">{item.productName || 'Luxe Product'}</p>
                                  {item.variantName && (
                                    <p className="text-[10px] text-accent-oak font-bold uppercase mt-0.5 tracking-wider italic">
                                      Variant: {item.variantName}
                                    </p>
                                  )}
                                </td>
                                <td className="px-6 py-3.5 font-medium">{item.quantity}x</td>
                                <td className="px-6 py-3.5 text-right font-bold text-primary-anthracite">
                                  €{item.price.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={3} className="px-6 py-8 text-center text-xs text-primary-anthracite/40 italic">
                                Geen artikelen gevonden voor deze bestelling.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>
              </motion.div>
            </div>
            <OrderInvoice order={order} />
          </>
        )}
      </AnimatePresence>
    </>
  );
}
