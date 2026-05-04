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

  // Extract top 2 unique categories for the featured section and prepend 'All Products'
  const dynamicCategories = Array.from(new Set(allProducts.map(p => p.category[locale as 'en' | 'nl'])))
    .slice(0, 2)
    .map(catName => ({
      name: catName,
      image: allProducts.find(p => p.category[locale as 'en' | 'nl'] === catName)?.images[0] || ''
    }));

  const categories = [
    { name: 'all', image: '/collections_hero.png' }, // 'all' will be handled by the component
    ...dynamicCategories
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
