'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

interface FeaturedProps {
  categories: {
    name: string;
    image: string;
  }[];
}

export default function Featured({ categories }: FeaturedProps) {
  const tCollecties = useTranslations('Collecties');
  const tHome = useTranslations('Home');
  const locale = useLocale();

  return (
    <section className="py-32 px-6 bg-primary-ivory">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h2 className="text-3xl md:text-5xl font-heading text-primary-anthracite mb-4">
            {tHome('featuredTitle')}
          </h2>
          <div className="w-16 h-px bg-accent-oak mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <Link 
                href={`/${locale}/collecties?category=${category.name}`} 
                className={`group block relative overflow-hidden h-[500px] rounded-2xl shadow-xl ${category.name === 'all' ? 'bg-primary-anthracite' : 'bg-white'}`}
              >
                <Image
                  src={category.image}
                  alt={category.name === 'all' ? tCollecties('allProducts') : category.name}
                  fill
                  className={`object-cover transition-transform duration-1000 group-hover:scale-110 ${category.name === 'all' ? 'opacity-60 group-hover:opacity-40' : 'brightness-[0.85] group-hover:brightness-[0.7]'}`}
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                  <h3 className="text-3xl font-heading uppercase tracking-[0.3em] mb-4 transform transition-transform duration-500 group-hover:scale-110 text-center">
                    {category.name === 'all' ? tCollecties('allProducts') : category.name}
                  </h3>
                  <div className="h-[1px] w-12 bg-white/40 group-hover:w-24 transition-all duration-500" />
                  <p className="mt-4 text-[10px] uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    Bekijk Collectie
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
