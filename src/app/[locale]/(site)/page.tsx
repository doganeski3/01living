import { getTranslations } from 'next-intl/server';
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Featured from "@/components/Featured";
import Marquee from "@/components/Marquee";
import BestSellers from "@/components/BestSellers";
import BrandStory from "@/components/BrandStory";
import VisitShowroom from "@/components/VisitShowroom";
import EditorialSection from "@/components/EditorialSection";

import { getProducts } from '@/lib/products';
import { prisma } from '@/lib/prisma';

export async function generateMetadata({params: {locale}}: {params: {locale: string}}) {
  const t = await getTranslations({locale, namespace: 'Home'});
 
  return {
    title: t('metaTitle'),
    description: t('metaDescription')
  };
}

export default async function Home({ params: { locale } }: { params: { locale: string } }) {
  const allProducts = await getProducts();
  const bestSellers = allProducts.slice(0, 4);

  // Fetch categories from DB to get custom images and names
  const dbCategories = await prisma.category.findMany({
    orderBy: { order: 'asc' }
  });

  const getCatData = (slug: string, fallbackName: string) => {
    const cat = dbCategories.find(c => c.slug === slug);
    if (cat) return { name: locale === 'nl' ? cat.nameNl : cat.nameEn, image: cat.image || '' };
    // Fallback to product images if not in Category table
    const product = allProducts.find(p => p.category[locale as 'en' | 'nl'].toLowerCase() === fallbackName.toLowerCase());
    return { name: fallbackName, image: product?.images[0] || '' };
  };

  const categories = [
    { name: 'all', image: dbCategories.find(c => c.slug === 'all-products')?.image || '/collections_hero.png' },
    getCatData('showroom', 'Showroom'),
    getCatData('fauteuil', 'Fauteuil')
  ];

  return (
    <main className="min-h-screen bg-primary-ivory">
      <Navbar />
      
      {/* 1. Hero Section */}
      <Hero />
      
      {/* 2. Marquee Ticker */}
      <Marquee />
      
      {/* 3. Bestsellers Products */}
      <BestSellers products={bestSellers} />

      {/* 4. Editorial Highlight */}
      <EditorialSection />
      
      {/* 5. Category Spotlight */}
      <Featured categories={categories} />
      
      {/* 6. Brand Story (Zig-zag) */}
      <BrandStory />
      
      {/* 7. Showroom CTA */}
      <VisitShowroom />
    </main>
  );
}
