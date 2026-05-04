'use client';

import { useCart } from '@/store/useCart';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, Trash2, MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function CartDrawer() {
  const t = useTranslations('Cart');
  const locale = useLocale() as 'nl' | 'en';
  const { items, removeItem, updateQuantity, getTotalPrice, isOpen, setIsOpen } = useCart();
  const { data: session } = useSession();
  const totalPrice = getTotalPrice();
  const onClose = () => setIsOpen(false);
  
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const formattedTotal = new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(totalPrice);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-[150] backdrop-blur-sm"
          />

          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: 'easeInOut' }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-primary-ivory shadow-2xl z-[150] flex flex-col"
          >
            <div className="flex items-center justify-between p-6 border-b border-primary-anthracite/10">
              <h2 className="text-2xl font-heading text-primary-anthracite">{t('title')}</h2>
              <button onClick={onClose} className="text-primary-anthracite/60 hover:text-primary-anthracite transition-colors">
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-primary-anthracite/60">
                  <p className="text-lg font-sans mb-6">{t('empty')}</p>
                  <button 
                    onClick={onClose}
                    className="border-b border-primary-anthracite pb-1 text-primary-anthracite hover:text-accent-oak hover:border-accent-oak transition-colors uppercase tracking-widest text-sm"
                  >
                    {t('continueShopping')}
                  </button>
                </div>
              ) : (
                <div className="space-y-8">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.selectedVariantId || 'base'}`} className="flex gap-4 group">
                      <div className="relative w-24 h-32 bg-gray-100 flex-shrink-0 overflow-hidden">
                        <Image
                          src={item.images[0]}
                          alt={item.name[locale]}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="text-sm font-heading font-semibold text-primary-anthracite pr-4">
                              {item.name[locale]}
                            </h3>
                            <button 
                              onClick={() => removeItem(item.id, item.selectedVariantId)}
                              className="text-primary-anthracite/40 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} strokeWidth={1.5} />
                            </button>
                          </div>
                          <div className="flex flex-col gap-0.5 mt-1">
                            {item.selectedColor?.[locale] && (
                              <p className="text-[9px] uppercase tracking-widest font-bold text-accent-oak">
                                {locale === 'nl' ? 'Kleur' : 'Color'}: {item.selectedColor[locale]}
                              </p>
                            )}
                            {item.selectedSize?.[locale] && (
                              <p className="text-[9px] uppercase tracking-widest font-bold text-accent-oak">
                                {locale === 'nl' ? 'Afmeting' : 'Size'}: {item.selectedSize[locale]}
                              </p>
                            )}
                            {item.selectedVariantName?.[locale] && (
                              <p className="text-[9px] uppercase tracking-widest font-bold text-accent-oak">
                                {item.selectedVariantName[locale]}
                              </p>
                            )}
                          </div>
                          <p className="text-primary-anthracite/70 text-sm mt-1">
                            {new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(item.price)}
                          </p>
                        </div>
                        
                        <div className="flex items-center border border-primary-anthracite/20 w-fit">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.selectedVariantId)}
                            className="px-3 py-1 text-primary-anthracite hover:bg-primary-anthracite/5 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 text-sm font-sans">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.selectedVariantId)}
                            className="px-3 py-1 text-primary-anthracite hover:bg-primary-anthracite/5 transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-primary-anthracite/10 bg-primary-ivory">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-heading text-primary-anthracite">{t('total')}</span>
                  <span className="text-lg font-semibold text-primary-anthracite">{formattedTotal}</span>
                </div>

                {/* Compact Premium Showroom Notice */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-6 p-4 bg-accent-oak/5 border border-accent-oak/10 rounded-2xl flex items-center gap-4 group hover:bg-accent-oak/10 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent-oak/10 flex items-center justify-center text-accent-oak flex-shrink-0">
                    <MapPin size={18} strokeWidth={1.5} />
                  </div>
                  
                  <div className="flex-1 space-y-0.5 text-left">
                    <p className="text-[9px] text-accent-oak uppercase tracking-widest font-bold">
                      Showroom Service
                    </p>
                    <p className="text-[10px] text-primary-anthracite/70 leading-snug">
                      {t('showroomNotice')}
                    </p>
                  </div>

                  <Link
                    href={`/${locale}/contact`}
                    onClick={onClose}
                    className="text-[9px] uppercase tracking-widest font-bold text-primary-anthracite border-b border-primary-anthracite/20 hover:border-accent-oak hover:text-accent-oak transition-all whitespace-nowrap pb-0.5"
                  >
                    {t('showroomCTA')}
                  </Link>
                </motion.div>
                
                {/* NL Only Notice */}
                <div className="mb-6 flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-accent-oak rounded-full animate-pulse" />
                    <span className="text-[8px] uppercase tracking-[0.2em] font-bold text-primary-anthracite/40">Bezorging</span>
                  </div>
                  <span className="text-[9px] font-bold text-accent-oak uppercase tracking-widest border-b border-accent-oak/20 pb-0.5">Alleen Nederland</span>
                </div>

                <Link
                  href={session ? `/${locale}/checkout` : `/${locale}/login?callbackUrl=/${locale}/checkout`}
                  onClick={onClose}
                  className="w-full bg-primary-anthracite text-primary-ivory py-5 uppercase tracking-widest text-sm font-semibold hover:bg-accent-oak transition-all block text-center shadow-2xl relative overflow-hidden group"
                >
                  <span className="relative z-10">{t('checkout')}</span>
                  <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
