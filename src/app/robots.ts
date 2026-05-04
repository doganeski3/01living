import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://01living.nl';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/',
        '/*/account/',
        '/*/checkout/',
        '/*/login/',
        '/*/register/',
        '/*/admin/',
        '/*/01admin-portal/',
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
