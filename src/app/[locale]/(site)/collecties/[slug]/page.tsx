import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';

import Navbar from '@/components/Navbar';
import ProductDetailClient from './ProductDetailClient';

type Props = {
  params: { locale: string; slug: string };
};

import { getProductBySlug, getProducts } from '@/lib/products';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params: { locale, slug } }: Props) {
  const product = await getProductBySlug(slug);
  const t = await getTranslations({ locale, namespace: 'ProductDetail' });
  if (!product) return { title: '01 Living' };
  const name = product.name[locale as 'nl' | 'en'];
  return {
    title: `${name} | 01 Living`,
    description: t('metaDescription'),
  };
}

export default async function ProductDetailPage({ params: { slug } }: Props) {
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <main className="bg-primary-ivory min-h-screen">
      <Navbar />
      <ProductDetailClient product={product} />
    </main>
  );
}
