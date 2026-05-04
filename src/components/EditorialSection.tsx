'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

export default function EditorialSection() {
  const t = useTranslations('Home.editorial');

  return (
    <section className="py-32 bg-primary-ivory overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="relative">
          {/* Background Text Overlay */}
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-[0.03]">
             <span className="text-[20vw] font-heading font-bold whitespace-nowrap">
                01 LIVING 01 LIVING
             </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="lg:col-span-7 relative aspect-[16/9] bg-gray-100 overflow-hidden"
            >
              <Image 
                src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=1600"
                alt="Editorial"
                fill
                className="object-cover"
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="lg:col-span-5 space-y-8 relative z-10"
            >
              <h2 className="text-4xl md:text-6xl font-heading text-primary-anthracite leading-[1.1]">
                {t('title')}
              </h2>
              <p className="text-primary-anthracite/70 font-sans text-lg leading-relaxed">
                {t('desc')}
              </p>
              <div className="w-20 h-px bg-accent-oak"></div>
              <p className="text-sm uppercase tracking-[0.2em] font-semibold text-primary-anthracite/40">
                {t('label')}
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
