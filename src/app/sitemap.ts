import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://01living.nl';
  const locales = ['nl', 'en'];
  
  const pages = [
    '',
    '/collecties',
    '/over-ons',
    '/contact',
    '/showroom',
    '/algemene-voorwaarden',
    '/privacybeleid',
    '/verzending-en-retour',
    '/cookiebeleid',
  ];

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 1. Static Pages for each locale
  locales.forEach((locale) => {
    pages.forEach((page) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === '' ? 'daily' : 'weekly',
        priority: page === '' ? 1.0 : 0.8,
      });
    });

    // Add localized return policy
    sitemapEntries.push({
      url: locale === 'en' 
        ? `${baseUrl}/en/return-and-cancellation-policy`
        : `${baseUrl}/nl/retour-en-annulering`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    });

    // Add localized custom orders
    sitemapEntries.push({
      url: locale === 'en' 
        ? `${baseUrl}/en/custom-orders`
        : `${baseUrl}/nl/speciale-bestellingen`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    });
  });

  // 2. Dynamic Product Pages for each locale
  try {
    const products = await prisma.product.findMany({
      where: {
        isArchived: false,
      },
      select: {
        slug: true,
        updatedAt: true,
      }
    });

    locales.forEach((locale) => {
      products.forEach((product) => {
        sitemapEntries.push({
          url: `${baseUrl}/${locale}/collecties/${product.slug}`,
          lastModified: product.updatedAt,
          changeFrequency: 'weekly',
          priority: 0.6,
        });
      });
    });
  } catch (error) {
    console.error('Error generating dynamic sitemap entries:', error);
  }

  return sitemapEntries;
}
