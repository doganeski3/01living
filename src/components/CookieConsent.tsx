'use client';

import { useState, useEffect } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const t = useTranslations('Legal.cookies.banner');
  const locale = useLocale();

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
          className="fixed bottom-8 right-8 z-[999] w-[calc(100%-4rem)] max-w-[400px]"
        >
          <div className="bg-white/80 backdrop-blur-2xl border border-primary-anthracite/5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 md:p-10 rounded-sm overflow-hidden relative group">
            {/* Elegant side accent */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-oak" />
            
            <div className="space-y-8">
              <div className="space-y-4">
                <h4 className="text-[10px] uppercase tracking-[0.4em] font-bold text-accent-oak">
                  Cookie Policy
                </h4>
                <div className="text-sm text-primary-anthracite/70 leading-relaxed font-sans italic pr-4">
                  {t.rich('text', {
                    link: (chunks) => (
                      <Link 
                        href={`/${locale}/cookiebeleid`}
                        className="text-primary-anthracite underline underline-offset-4 hover:text-accent-oak transition-colors font-semibold not-italic"
                      >
                        {t('link')}
                      </Link>
                    )
                  })}
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <button
                  onClick={handleAccept}
                  className="bg-primary-anthracite text-primary-ivory px-10 py-4 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-accent-oak transition-all duration-500 shadow-lg"
                >
                  {t('accept')}
                </button>
                <Link 
                  href={`/${locale}/cookiebeleid`}
                  className="text-[10px] uppercase tracking-[0.2em] font-bold text-primary-anthracite/40 hover:text-primary-anthracite transition-colors border-b border-transparent hover:border-primary-anthracite"
                >
                  Details
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
