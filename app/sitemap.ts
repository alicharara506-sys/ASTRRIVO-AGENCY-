import { siteConfig } from '@/lib/site-config';

export default function sitemap() {
  if (!siteConfig.canonicalOrigin) return [];
  return [
    { url: siteConfig.canonicalOrigin, changeFrequency: 'monthly' as const, priority: 1 },
    { url: `${siteConfig.canonicalOrigin}/contact`, changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${siteConfig.canonicalOrigin}/privacy-policy`, changeFrequency: 'yearly' as const, priority: 0.2 },
    { url: `${siteConfig.canonicalOrigin}/terms-of-service`, changeFrequency: 'yearly' as const, priority: 0.2 },
  ];
}
