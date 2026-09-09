import { siteConfig } from '@/lib/site-config';
export default function robots() {
  return { rules: { userAgent: '*', allow: '/' }, ...(siteConfig.canonicalOrigin ? { sitemap: `${siteConfig.canonicalOrigin}/sitemap.xml` } : {}) };
}
