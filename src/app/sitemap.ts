import { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://01living.nl';
  const locales = ['nl', 'en'] as const;

  const sitemapEntries: MetadataRoute.Sitemap = [];

  // 1. Core Shared Pages (Same slug for both locales)
  const sharedPages = [
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

  sharedPages.forEach(({ path, priority, changeFrequency }) => {
    locales.forEach((locale) => {
      sitemapEntries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency,
        priority,
        alternates: {
          languages: {
            nl: `${baseUrl}/nl${path}`,
            en: `${baseUrl}/en${path}`,
            'x-default': `${baseUrl}/nl${path}`,
          },
        },
      });
    });
  });

  // 2. Localized Custom Orders Page
  const customOrdersMapping = {
    nl: `${baseUrl}/nl/speciale-bestellingen`,
    en: `${baseUrl}/en/custom-orders`,
  };

  locales.forEach((locale) => {
    sitemapEntries.push({
      url: customOrdersMapping[locale],
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
      alternates: {
        languages: {
          ...customOrdersMapping,
          'x-default': customOrdersMapping.nl,
        },
      },
    });
  });

  // 3. Localized Return & Cancellation Policy Page
  const returnPolicyMapping = {
    nl: `${baseUrl}/nl/retour-en-annulering`,
    en: `${baseUrl}/en/return-and-cancellation-policy`,
  };

  locales.forEach((locale) => {
    sitemapEntries.push({
      url: returnPolicyMapping[locale],
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
      alternates: {
        languages: {
          ...returnPolicyMapping,
          'x-default': returnPolicyMapping.nl,
        },
      },
    });
  });

  // 4. Dynamic Products with Alternates
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

    products.forEach((product) => {
      locales.forEach((locale) => {
        sitemapEntries.push({
          url: `${baseUrl}/${locale}/collecties/${product.slug}`,
          lastModified: product.updatedAt,
          changeFrequency: 'weekly',
          priority: 0.7,
          alternates: {
            languages: {
              nl: `${baseUrl}/nl/collecties/${product.slug}`,
              en: `${baseUrl}/en/collecties/${product.slug}`,
              'x-default': `${baseUrl}/nl/collecties/${product.slug}`,
            },
          },
        });
      });
    });
  } catch (error) {
    console.error('[SITEMAP] Error fetching products for sitemap:', error);
  }

  return sitemapEntries;
}
