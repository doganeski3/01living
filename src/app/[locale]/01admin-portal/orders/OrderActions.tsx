'use client';

import { useState } from 'react';
import { Trash2, Eye, X, Package, User, CreditCard, Building2, Truck, Printer } from 'lucide-react';
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteOrder(order.id);
      if (result.success) {
        setIsDeleteModalOpen(false);
      } else {
        alert(result.error);
        setIsDeleting(false);
      }
    } catch (error) {
      alert('Bestelling silinirken bir hata oluştu.');
      setIsDeleting(false);
    }
  };

  const handleSimulatePayment = async () => {
    setIsSimulating(true);
    const result = await updateOrderStatus(order.id, 'paid');
    if (result.success) {
      alert('Bestelling succesvol bevestigd (Simulatie)');
    } else {
      alert(result.error);
    }
    setIsSimulating(false);
  };

  const handleSimulateCancel = async () => {
    setIsSimulating(true);
    const result = await updateOrderStatus(order.id, 'cancelled');
    if (result.success) {
      alert('Bestelling succesvol geannuleerd (Simulatie)');
    } else {
      alert(result.error);
    }
    setIsSimulating(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        {order.status === 'pending' && (
          <>
            <button 
              onClick={handleSimulatePayment}
              disabled={isSimulating}
              className="text-[9px] uppercase tracking-widest font-bold bg-green-50 hover:bg-green-100 text-green-700 px-3 py-2 rounded-lg transition-all border border-green-100"
            >
              {isSimulating ? '...' : 'TEST BETALING'}
            </button>
            <button 
              onClick={handleSimulateCancel}
              disabled={isSimulating}
              className="text-[9px] uppercase tracking-widest font-bold bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg transition-all border border-red-100"
            >
              {isSimulating ? '...' : 'TEST ANNULEREN'}
            </button>
          </>
        )}
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
                {/* Left Side: Order Info & Status */}
                <div className="w-full md:w-80 bg-white p-12 border-r border-gray-100 shrink-0">
                  <button 
                    onClick={() => setShowDetails(false)}
                    className="md:hidden absolute top-8 right-8 text-primary-anthracite/40"
                  >
                    <X size={24} />
                  </button>

                  <div className="space-y-12">
                    <div>
                      <p className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent-oak mb-3">Bestelling</p>
                      <h2 className="text-3xl font-heading text-primary-anthracite uppercase tracking-widest">#{order.orderNumber}</h2>
                      <p className="text-xs text-primary-anthracite/40 font-bold uppercase mt-2">
                        {new Date(order.createdAt).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' })} om {new Date(order.createdAt).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="flex flex-col gap-4">
                      <button 
                        onClick={handlePrint}
                        className="w-full text-[10px] uppercase tracking-widest font-bold bg-primary-anthracite text-primary-ivory px-6 py-4 rounded-2xl transition-all flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
                      >
                        <Printer size={16} /> Factuur Afdrukken
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div className="p-4 rounded-2xl bg-primary-anthracite text-primary-ivory">
                        <p className="text-[10px] uppercase tracking-widest font-bold opacity-40 mb-1">Totaalbedrag</p>
                        <p className="text-2xl font-heading">€{order.totalAmount.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side: Detailed Sections */}
                <div className="flex-1 p-12 space-y-16">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Customer Information */}
                    <div className="space-y-10">
                      <section className="space-y-6">
                        <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary-anthracite flex items-center gap-3">
                          <User size={16} className="text-accent-oak" /> Persoonlijke Gegevens
                        </h3>
                        <div className="space-y-2">
                          <p className="text-xl font-heading text-primary-anthracite">{order.customerName}</p>
                          <p className="text-sm text-primary-anthracite/60 font-medium">{order.customerEmail}</p>
                          <p className="text-sm text-primary-anthracite/60 font-medium">{order.customerPhone || 'Geen telefoonnummer'}</p>
                        </div>
                      </section>

                      <section className="space-y-6">
                        <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary-anthracite flex items-center gap-3">
                          <Truck size={16} className="text-accent-oak" /> Bezorgadres
                        </h3>
                        <div className="bg-white/50 p-6 rounded-3xl border border-gray-100 space-y-1">
                          <p className="text-lg font-heading text-primary-anthracite">{order.street} {order.houseNumber}{order.addition}</p>
                          <p className="text-sm text-primary-anthracite/60 font-medium">{order.postalCode} {order.city}</p>
                          <p className="text-xs uppercase tracking-widest font-bold text-accent-oak pt-2">{order.country}</p>
                        </div>
                      </section>
                    </div>

                    {/* Billing & Business */}
                    <div className="space-y-10">
                      <section className="space-y-6">
                        <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary-anthracite flex items-center gap-3">
                          <Building2 size={16} className="text-accent-oak" /> Factuurgegevens
                        </h3>
                        <div className="bg-white/50 p-6 rounded-3xl border border-gray-100">
                          {order.billingSameAsShipping ? (
                            <p className="text-xs text-primary-anthracite/40 italic font-medium">Zelfde als bezorgadres</p>
                          ) : (
                            <div className="space-y-1">
                              <p className="text-sm font-bold">{order.billingStreet} {order.billingHouseNumber}{order.billingAddition}</p>
                              <p className="text-sm text-primary-anthracite/60">{order.billingPostalCode} {order.billingCity}</p>
                            </div>
                          )}
                          
                          {(order.companyName || order.vatNumber) && (
                            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                               {order.companyName && (
                                 <div>
                                   <p className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/30">Bedrijf</p>
                                   <p className="text-sm font-bold">{order.companyName}</p>
                                 </div>
                               )}
                               {order.vatNumber && (
                                 <div>
                                   <p className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/30">BTW</p>
                                   <p className="text-sm font-bold">{order.vatNumber}</p>
                                 </div>
                               )}
                            </div>
                          )}
                        </div>
                      </section>

                      <section className="space-y-6">
                        <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary-anthracite flex items-center gap-3">
                          <CreditCard size={16} className="text-accent-oak" /> Betaalmethode
                        </h3>
                        <div className="bg-white/50 p-6 rounded-3xl border border-gray-100 flex items-center gap-4">
                          <div className="w-10 h-10 bg-accent-oak/10 rounded-full flex items-center justify-center text-accent-oak">
                            <CreditCard size={20} />
                          </div>
                          <div>
                            <p className="text-sm font-bold">iDEAL / Creditcard</p>
                            <p className="text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/30">via Mollie</p>
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>

                  {/* Items Table */}
                  <section className="space-y-8">
                    <h3 className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary-anthracite flex items-center gap-3">
                      <Package size={16} className="text-accent-oak" /> Bestelde Producten
                    </h3>
                    <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gray-50 border-b border-gray-100 text-[10px] uppercase tracking-widest text-primary-anthracite/40 font-bold">
                            <th className="px-8 py-4">Product</th>
                            <th className="px-8 py-4">Aantal</th>
                            <th className="px-8 py-4 text-right">Prijs</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {order.items && order.items.length > 0 ? (
                            order.items.map((item) => (
                              <tr key={item.id} className="text-sm">
                                <td className="px-8 py-4">
                                  <p className="font-bold text-primary-anthracite">{item.productName || 'Luxe Product'}</p>
                                  {item.variantName && (
                                    <p className="text-[10px] text-accent-oak font-bold uppercase mt-1 tracking-wider italic">
                                      Variant: {item.variantName}
                                    </p>
                                  )}
                                  <p className="text-[10px] text-primary-anthracite/30 uppercase font-bold mt-1">ID: #{item.productId.slice(-8)}</p>
                                </td>
                                <td className="px-8 py-4 font-medium">{item.quantity}x</td>
                                <td className="px-8 py-4 text-right font-bold">€{item.price.toLocaleString('nl-NL', { minimumFractionDigits: 2 })}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={3} className="px-8 py-10 text-center text-xs text-primary-anthracite/40 italic">
                                Geen artikelen gevonden voor buze bestelling.
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
