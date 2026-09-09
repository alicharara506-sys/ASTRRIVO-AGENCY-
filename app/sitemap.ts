import { siteConfig } from '@/lib/site-config';
export default function sitemap() {
  return siteConfig.canonicalOrigin ? [{ url: siteConfig.canonicalOrigin, changeFrequency: 'monthly' as const, priority: 1 }] : [];
}
