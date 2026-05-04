'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Trash2, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  loading?: boolean;
}

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, title, description, loading }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-primary-anthracite/40 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden"
          >
            {/* Header Decor */}
            <div className="absolute top-0 left-0 w-full h-1 bg-red-500/20" />
            
            <div className="p-8 md:p-10">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 shadow-sm">
                  <AlertTriangle size={28} />
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-gray-50 rounded-full transition-colors text-gray-400"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 mb-10">
                <h3 className="text-2xl font-heading text-primary-anthracite uppercase tracking-widest">{title}</h3>
                <p className="text-sm text-primary-anthracite/60 leading-relaxed font-serif italic">
                  {description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 py-4 rounded-2xl text-[10px] uppercase tracking-[0.3em] font-bold text-primary-anthracite/40 hover:text-primary-anthracite hover:bg-gray-50 transition-all border border-gray-100 disabled:opacity-50"
                >
                  Annuleren
                </button>
                <button 
                  onClick={onConfirm}
                  disabled={loading}
                  className="flex-1 py-4 bg-red-500 hover:bg-red-600 text-white rounded-2xl text-[10px] uppercase tracking-[0.3em] font-bold shadow-xl shadow-red-500/20 flex items-center justify-center gap-3 transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  Verwijderen
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
