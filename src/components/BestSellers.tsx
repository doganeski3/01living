'use client';

import { useLocale, useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import Link from 'next/link';
import { Product } from '@/lib/products';

export default function BestSellers({ products }: { products: Product[] }) {
  const t = useTranslations('Home.bestSellers');
  const locale = useLocale() as 'nl' | 'en';

  return (
    <section className="py-32 bg-[#F7F5F2]">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-accent-oak font-semibold block mb-3">
              {t('badge')}
            </span>
            <h2 className="text-4xl md:text-5xl font-heading text-primary-anthracite">
              {t('title')}
            </h2>
          </div>
          <Link
            href={`/${locale}/collecties`}
            className="text-sm uppercase tracking-widest text-primary-anthracite border-b border-primary-anthracite pb-1 hover:text-accent-oak hover:border-accent-oak transition-colors self-start md:self-auto"
          >
            {t('viewAll')}
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
