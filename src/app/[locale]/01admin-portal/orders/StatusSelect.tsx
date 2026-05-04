'use client';

import { useState } from 'react';
import { updateOrderStatus } from '@/app/actions/orders';
import { Loader2, AlertCircle, X, CheckCircle2, Truck, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StatusSelect({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(currentStatus);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);
  const [trackingCode, setTrackingCode] = useState('');
  const [shippingCarrier, setShippingCarrier] = useState('PostNL');

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === status) return;
    setPendingStatus(newStatus);
  };

  const confirmChange = async () => {
    if (!pendingStatus) return;
    
    setLoading(true);
    const targetStatus = pendingStatus;
    setPendingStatus(null);

    const result = await updateOrderStatus(
      orderId, 
      targetStatus, 
      targetStatus === 'shipped' ? trackingCode : undefined, 
      targetStatus === 'shipped' ? shippingCarrier : undefined
    );
    if (result.success) {
      setStatus(targetStatus);
    } else {
      alert(result.error);
    }
    setLoading(false);
  };

  const getStatusColor = (s: string) => {
    switch (s) {
      case 'paid': return 'bg-green-500 text-white shadow-lg shadow-green-500/20';
      case 'pending': return 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/20';
      case 'shipped': return 'bg-blue-600 text-white shadow-lg shadow-blue-600/20';
      case 'delivered': return 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20';
      case 'cancelled': return 'bg-red-500 text-white shadow-lg shadow-red-500/20';
      default: return 'bg-gray-500 text-white shadow-lg shadow-gray-500/20';
    }
  };

  const getStatusLabel = (s: string) => {
    switch (s) {
      case 'pending': return 'In afwachting';
      case 'paid': return 'Betaald';
      case 'shipped': return 'Onderweg';
      case 'delivered': return 'Bezorgd';
      case 'cancelled': return 'Geannuleerd';
      default: return s;
    }
  };

  return (
    <div className="relative flex items-center gap-3">
      <div className="relative group">
        <select
          value={status}
          disabled={loading}
          onChange={(e) => handleStatusChange(e.target.value)}
          className={`text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full font-bold appearance-none cursor-pointer focus:outline-none transition-all duration-300 hover:scale-105 active:scale-95 pr-8 ${getStatusColor(status)} ${loading ? 'opacity-50' : ''}`}
        >
          <option value="pending" className="bg-white text-primary-anthracite italic">In afwachting</option>
          <option value="paid" className="bg-white text-primary-anthracite">Betaald</option>
          <option value="shipped" className="bg-white text-primary-anthracite">Verzonden</option>
          <option value="delivered" className="bg-white text-primary-anthracite">Afgeleverd</option>
          <option value="cancelled" className="bg-white text-primary-anthracite">Geannuleerd</option>
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity">
          <svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1.5L4 4.5L7 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      
      {loading && <Loader2 size={14} className="animate-spin text-accent-oak" />}

      {/* Custom Confirmation Modal */}
      <AnimatePresence>
        {pendingStatus && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPendingStatus(null)}
              className="absolute inset-0 bg-primary-anthracite/40 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 overflow-hidden"
            >
              {/* Decorative Background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-oak/5 rounded-full -mr-16 -mt-16 blur-3xl" />
              
              <div className="relative z-10 space-y-8">
                <div className="flex items-center justify-between">
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                     pendingStatus === 'cancelled' ? 'bg-red-50 text-red-500' : 
                     pendingStatus === 'shipped' ? 'bg-blue-50 text-blue-500' : 
                     pendingStatus === 'delivered' ? 'bg-emerald-50 text-emerald-500' :
                     'bg-accent-oak/10 text-accent-oak'
                   }`}>
                      {pendingStatus === 'shipped' ? <Truck size={24} /> : 
                       pendingStatus === 'delivered' ? <CheckCircle size={24} /> :
                       <AlertCircle size={24} />}
                   </div>
                   <button 
                     onClick={() => setPendingStatus(null)}
                     className="text-primary-anthracite/20 hover:text-primary-anthracite transition-colors"
                   >
                     <X size={20} />
                   </button>
                </div>

                <div className="space-y-3">
                   <h3 className="text-xl font-heading text-primary-anthracite uppercase tracking-widest">Status Wijzigen?</h3>
                   <div className="text-sm text-primary-anthracite/60 font-medium leading-relaxed">
                     Weet u zeker kiest u voor <span className={`font-bold underline decoration-2 underline-offset-4 ${
                       pendingStatus === 'shipped' ? 'text-blue-600 decoration-blue-200' : 
                       pendingStatus === 'delivered' ? 'text-emerald-600 decoration-emerald-200' :
                       pendingStatus === 'paid' ? 'text-green-600 decoration-green-200' :
                       'text-primary-anthracite decoration-accent-oak/30'
                     }`}>&quot;{getStatusLabel(pendingStatus).toUpperCase()}&quot;</span>?
                     
                     {pendingStatus === 'cancelled' && (
                       <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold leading-normal flex gap-3 items-start border border-red-100">
                         <AlertCircle size={16} className="shrink-0" />
                         <span>⚠️ LET OP: Dit start automatisch een terugbetaling (refund) via Mollie.</span>
                       </div>
                     )}

                     {pendingStatus === 'shipped' && (
                       <div className="mt-4 p-4 bg-blue-50 text-blue-600 rounded-2xl text-xs font-bold leading-normal flex flex-col gap-3 border border-blue-100">
                         <div className="flex gap-3 items-start">
                           <Truck size={16} className="shrink-0" />
                           <span>Voer de verzendgegevens in om een bevestigingsmail naar de klant te sturen.</span>
                         </div>
                         <div className="flex flex-col gap-2 mt-2">
                           <label className="text-[10px] uppercase tracking-widest text-blue-800/60">Vervoerder</label>
                           <select 
                             value={shippingCarrier} 
                             onChange={e => setShippingCarrier(e.target.value)}
                             className="px-3 py-2 rounded-xl border border-blue-200 bg-white text-primary-anthracite focus:outline-none"
                           >
                             <option value="PostNL">PostNL</option>
                             <option value="DHL">DHL</option>
                             <option value="DPD">DPD</option>
                             <option value="UPS">UPS</option>
                             <option value="Eigen Vervoer">Eigen Vervoer</option>
                           </select>
                         </div>
                         <div className="flex flex-col gap-2 mt-2">
                           <label className="text-[10px] uppercase tracking-widest text-blue-800/60">Tracking Code (Optioneel)</label>
                           <input 
                             type="text" 
                             placeholder="Bijv. 3S..." 
                             value={trackingCode}
                             onChange={e => setTrackingCode(e.target.value)}
                             className="px-3 py-2 rounded-xl border border-blue-200 bg-white text-primary-anthracite focus:outline-none placeholder:text-blue-200"
                           />
                         </div>
                       </div>
                     )}

                     {pendingStatus === 'delivered' && (
                       <div className="mt-4 p-4 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-bold leading-normal flex gap-3 items-start border border-emerald-100">
                         <CheckCircle size={16} className="shrink-0" />
                         <span>De bestelling is succesvol gemarkeerd als afgeleverd.</span>
                       </div>
                     )}
                   </div>
                </div>

                <div className="flex gap-4 pt-4">
                   <button 
                     onClick={() => setPendingStatus(null)}
                     className="flex-1 py-4 rounded-2xl text-[10px] uppercase tracking-widest font-bold text-primary-anthracite/40 bg-gray-50 hover:bg-gray-100 transition-all"
                   >
                     Annuleren
                   </button>
                   <button 
                     onClick={confirmChange}
                     className={`flex-1 py-4 rounded-2xl text-[10px] uppercase tracking-widest font-bold text-white transition-all shadow-xl flex items-center justify-center gap-2 ${
                       pendingStatus === 'cancelled' ? 'bg-red-500 hover:bg-red-600' : 
                       pendingStatus === 'shipped' ? 'bg-blue-600 hover:bg-blue-700' :
                       pendingStatus === 'delivered' ? 'bg-emerald-600 hover:bg-emerald-700' :
                       'bg-primary-anthracite hover:bg-accent-oak'
                     }`}
                   >
                     <CheckCircle2 size={14} /> Bevestigen
                   </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
