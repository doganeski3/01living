'use client';

import { Product } from '@/lib/products';
import { useCart } from '@/store/useCart';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const locale = useLocale() as 'nl' | 'en';

  const formattedPrice = new Intl.NumberFormat(locale === 'en' ? 'en-US' : 'nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(product.price);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative w-full flex flex-col bg-primary-ivory"
    >
      {/* Image Container */}
      <Link href={`/${locale}/collecties/${product.slug}`} className="relative aspect-[3/4] w-full bg-white overflow-hidden block rounded-[2px]">
        {/* Default Image */}
        <div className="relative h-full w-full overflow-hidden">
          <Image
            src={product.images[0]}
            alt={product.name[locale]}
            fill
            className="object-cover transition-all duration-700 ease-in-out group-hover:scale-105"
          />
          
          {/* Second Image on Hover */}
          {product.images.length > 1 && (
            <Image
              src={product.images[1]}
              alt={`${product.name[locale]} hover`}
              fill
              className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-in-out group-hover:scale-105"
            />
          )}
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-700" />

        {/* Category Tag */}
        <div className="absolute top-4 left-4">
           <span className="text-[9px] uppercase tracking-[0.2em] font-bold bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-full text-primary-anthracite shadow-sm">
             {product.category[locale]}
           </span>
        </div>
      </Link>

      {/* Info */}
      <Link href={`/${locale}/collecties/${product.slug}`} className="pt-4 pb-2 flex flex-col items-start">
        <div className="flex flex-col w-full gap-1">
          <h3 className="text-sm font-heading text-primary-anthracite group-hover:text-accent-oak transition-colors leading-tight uppercase tracking-wide truncate w-full">
            {product.name[locale]}
          </h3>
          {product.category[locale] !== 'Showroom' && (
            <p className="text-primary-anthracite font-bold tracking-tight text-xs">{formattedPrice}</p>
          )}
        </div>
         <div className="mt-2 flex items-center gap-2">
            <div className="w-4 h-[1px] bg-accent-oak/30" />
            <p className="text-[9px] text-primary-anthracite/40 uppercase tracking-widest font-bold">
              {product.category[locale] === 'Showroom' ? (locale === 'en' ? 'Showroom' : 'Showroom') : (locale === 'en' ? 'Discover' : 'Ontdek')}
            </p>
         </div>
      </Link>
    </motion.div>
  );
}
