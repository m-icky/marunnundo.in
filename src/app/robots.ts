import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/owner/', '/api/'],
    },
    sitemap: 'https://marunnundo.in/sitemap.xml',
  };
}
