'use client';

import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

export default function Hero() {
  const t = useTranslations('Hero');
  const locale = useLocale();

  return (
    <section className="relative h-screen flex items-end overflow-hidden">
      {/* Background Image */}
      <Image
        src="/images/hero-bg.png"
        alt="01 Living Hero"
        fill
        className="object-cover object-center"
        priority
      />
      {/* Gradient overlay — balanced for text legibility on light/dark images */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10 z-10" />

      {/* Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 pb-24">


        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="text-5xl md:text-7xl xl:text-8xl font-heading font-medium text-primary-ivory mb-8 leading-[1.05] max-w-4xl drop-shadow-sm"
        >
          {t('title')}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg text-primary-ivory/70 mb-10 font-sans max-w-md"
        >
          {t('subtitle')}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href={`/${locale}/collecties`}
            className="bg-primary-ivory text-primary-anthracite px-8 py-4 uppercase tracking-widest text-sm font-semibold hover:bg-accent-oak hover:text-primary-ivory transition-colors duration-300 inline-block text-center"
          >
            {t('cta')}
          </Link>
          <Link
            href={`/${locale}/over-ons`}
            className="border border-primary-ivory/40 text-primary-ivory px-8 py-4 uppercase tracking-widest text-sm font-semibold hover:border-primary-ivory transition-colors duration-300 inline-block text-center"
          >
            {t('ourStory')}
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 right-8 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-primary-ivory/40 text-[10px] uppercase tracking-[0.2em] rotate-90 origin-center">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="w-px h-12 bg-gradient-to-b from-primary-ivory/40 to-transparent"
        />
      </motion.div>
    </section>
  );
}
