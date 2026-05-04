'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

export default function BrandStory() {
  const t = useTranslations('Home.brandStory');
  const locale = useLocale();
  const sections = t.raw('sections') as { title: string; text: string }[];

  const IMAGES = [
    'https://images.unsplash.com/photo-1581539250439-c96689b516dd?auto=format&fit=crop&q=80&w=1200',
    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=1200'
  ];

  return (
    <section className="py-32 bg-primary-ivory">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-24 max-w-xl"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-accent-oak font-semibold block mb-4">
            {t('badge')}
          </span>
          <h2 className="text-4xl md:text-5xl font-heading text-primary-anthracite leading-tight">
            {t('title')}
          </h2>
        </motion.div>

        {/* Zig-zag sections */}
        {sections.map((s, i) => (
          <div
            key={i}
            className={`flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-16 mb-32 last:mb-0`}
          >
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="w-full lg:w-1/2 relative aspect-[4/3] overflow-hidden"
            >
              <Image src={IMAGES[i]} alt={s.title} fill className="object-cover" />
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-80px' }}
              className="w-full lg:w-1/2 space-y-6"
            >
              <h3 className="text-3xl font-heading text-primary-anthracite leading-snug">
                {s.title}
              </h3>
              <div className="w-12 h-px bg-accent-oak" />
              <p className="text-primary-anthracite/70 font-sans leading-relaxed text-lg">
                {s.text}
              </p>
            </motion.div>
          </div>
        ))}

        {/* CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center pt-8"
        >
          <Link
            href={`/${locale}/over-ons`}
            className="border border-primary-anthracite text-primary-anthracite px-10 py-4 uppercase tracking-widest text-sm hover:bg-primary-anthracite hover:text-primary-ivory transition-colors duration-300 inline-block"
          >
            {t('cta')}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
