'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

export default function VisitShowroom() {
  const t = useTranslations('Home.visitShowroom');
  const locale = useLocale();

  return (
    <section className="py-32 bg-primary-anthracite text-primary-ivory">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-xs uppercase tracking-[0.3em] text-accent-oak font-semibold block mb-4">
              {t('badge')}
            </span>
            <h2 className="text-4xl md:text-6xl font-heading mb-8 leading-tight">
              {t('title')}
            </h2>
            <p className="text-primary-ivory/70 font-sans text-lg mb-12 max-w-lg leading-relaxed">
              {t('desc')}
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
              <div>
                <h3 className="text-accent-oak uppercase tracking-widest text-xs font-bold mb-2">Den Haag</h3>
                <p className="text-sm text-primary-ivory/60 italic">Showroom & Studio</p>
              </div>
              <div>
                <h3 className="text-accent-oak uppercase tracking-widest text-xs font-bold mb-2">Schiedam</h3>
                <p className="text-sm text-primary-ivory/60 italic">Warehouse & Outlet</p>
              </div>
            </div>

            <Link
              href={`/${locale}/contact`}
              className="inline-block border border-primary-ivory text-primary-ivory px-10 py-4 uppercase tracking-widest text-sm font-semibold hover:bg-primary-ivory hover:text-primary-anthracite transition-all duration-300"
            >
              {t('cta')}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="relative aspect-[4/5] lg:aspect-square overflow-hidden"
          >
            <Image
              src="/images/showroom_visit.png"
              alt="Showroom"
              fill
              className="object-cover transition-all duration-700 hover:scale-105"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
