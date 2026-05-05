import { getTranslations } from 'next-intl/server';
import { Suspense } from 'react';
import CollectiesClient from './CollectiesClient';

import { getProducts } from '@/lib/products';
import { prisma } from '@/lib/prisma';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'Collecties' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

export default async function Collecties() {
  const [products, categories] = await Promise.all([
    getProducts(),
    prisma.category.findMany({ orderBy: { order: 'asc' } })
  ]);
  
  return (
    <Suspense fallback={<div className="min-h-screen bg-primary-ivory pt-40 flex items-center justify-center"><span className="text-primary-anthracite/40 font-heading text-2xl">Laden...</span></div>}>
      <CollectiesClient 
        initialProducts={products} 
        dbCategories={JSON.parse(JSON.stringify(categories))}
      />
    </Suspense>
  );
}
