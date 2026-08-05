import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://longevityfarma.ro'; // Replace with actual domain later

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/account/', '/checkout/', '/api/'], // Pages not to be indexed
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
