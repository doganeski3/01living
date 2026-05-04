'use client';

import { motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

export default function Marquee() {
  const t = useTranslations('Marquee');
  const tags = t.raw('tags') as string[];

  return (
    <div className="bg-primary-anthracite py-5 overflow-hidden border-y border-primary-anthracite">
      <motion.div
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, duration: 25, ease: 'linear' }}
        className="flex whitespace-nowrap"
      >
        {[...tags, ...tags].map((tag, i) => (
          <span key={i} className="inline-flex items-center mx-8 text-primary-ivory/80 text-xs uppercase tracking-[0.2em] font-sans">
            {tag}
            <span className="mx-8 text-accent-oak">◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}
