'use client';

import { useTranslations, useLocale } from 'next-intl';
import Navbar from "@/components/Navbar";
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Cookiebeleid() {
  const t = useTranslations('Legal');
  const locale = useLocale();
  const sections = t.raw('cookies.sections') as { title: string; content: string }[];

  return (
    <main className="min-h-screen bg-primary-ivory">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-6 py-32 lg:py-48">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-16"
        >
          {/* Header */}
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-4xl md:text-6xl font-heading text-primary-anthracite uppercase tracking-[0.2em] leading-tight">
              {t('cookies.title')}
            </h1>
            <div className="flex flex-col lg:flex-row lg:items-center gap-4 text-primary-anthracite/50 italic font-serif text-sm">
              <span>{t('lastUpdated')}</span>
              <span className="hidden lg:block">•</span>
              <span>01 Living — Timeless Design</span>
            </div>
          </div>

          <div className="w-20 h-px bg-accent-oak mx-auto lg:mx-0"></div>

          {/* Intro */}
          <p className="text-xl font-serif italic text-primary-anthracite/80 leading-relaxed lg:max-w-3xl">
            {t('cookies.intro')}
          </p>

          {/* Content Sections */}
          <div className="space-y-16 pt-8">
            {sections.map((section, idx) => (
              <motion.section 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="group"
              >
                <h2 className="text-lg font-bold text-primary-anthracite uppercase tracking-[0.2em] mb-6 group-hover:text-accent-oak transition-colors duration-300">
                  {section.title}
                </h2>
                <p className="text-primary-anthracite/70 leading-relaxed font-sans text-base lg:text-lg">
                  {section.content}
                </p>
              </motion.section>
            ))}
          </div>

          <div className="pt-16 border-t border-primary-anthracite/10">
            <p className="text-primary-anthracite/60 font-serif italic text-sm text-center">
              {t('contactSupport')}
            </p>
            <div className="mt-8 text-center">
              <Link 
                href={`/${locale}/contact`}
                className="inline-block border-b border-primary-anthracite pb-1 text-xs uppercase tracking-widest font-bold text-primary-anthracite hover:text-accent-oak hover:border-accent-oak transition-all"
              >
                {locale === 'en' ? 'Get in Touch' : 'Neem Contact Op'}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
