import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://01living.nl';
  const locales = ['nl', 'en'] as const;

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 1. Core Shared Pages for both locales
  const pages = [
    { path: '', priority: 1.0, changeFrequency: 'daily' as const },
    { path: '/collecties', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/showroom', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/b2b-fulfillment', priority: 0.9, changeFrequency: 'weekly' as const },
    { path: '/over-ons', priority: 0.7, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.8, changeFrequency: 'weekly' as const },
    { path: '/verzending-en-retour', priority: 0.5, changeFrequency: 'monthly' as const },
    { path: '/algemene-voorwaarden', priority: 0.4, changeFrequency: 'monthly' as const },
    { path: '/privacybeleid', priority: 0.4, changeFrequency: 'monthly' as const },
    { path: '/cookiebeleid', priority: 0.4, changeFrequency: 'monthly' as const },
  ];

  locales.forEach((locale) => {
    pages.forEach((page) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
      });
    });

    // Localized Return & Cancellation Policy
    sitemapEntries.push({
      url: locale === 'en'
        ? `${baseUrl}/en/return-and-cancellation-policy`
        : `${baseUrl}/nl/retour-en-annulering`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    });

    // Localized Custom Orders
    sitemapEntries.push({
      url: locale === 'en'
        ? `${baseUrl}/en/custom-orders`
        : `${baseUrl}/nl/speciale-bestellingen`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
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
      },
    });

    locales.forEach((locale) => {
      products.forEach((product) => {
        sitemapEntries.push({
          url: `${baseUrl}/${locale}/collecties/${product.slug}`,
          lastModified: product.updatedAt,
          changeFrequency: 'weekly',
          priority: 0.7,
        });
      });
    });
  } catch (error) {
    console.error('[SITEMAP] Error fetching products for sitemap:', error);
  }

  return sitemapEntries;
}
