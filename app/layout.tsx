import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/lib/site-config';
import { GalaxyCanvas } from '@/components/galaxy-canvas';
import { SiteNav } from '@/components/site-nav';
import { SiteFooter } from '@/components/site-footer';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  ...(siteConfig.canonicalOrigin
    ? { metadataBase: new URL(siteConfig.canonicalOrigin), alternates: { canonical: '/' } }
    : {}),
  title: 'ASTRIVO — Ideas into orbit.',
  description:
    'ASTRIVO is a creative technology agency combining brand, digital, technology, AI, and analytics to help ambitious businesses build what comes next.',
  openGraph: {
    title: 'ASTRIVO — Ideas into orbit.',
    description: 'Brand. Digital. Technology. AI. Analytics. Explore what’s next with ASTRIVO.',
    type: 'website',
    siteName: 'ASTRIVO',
  },
  twitter: {
    card: 'summary',
    title: 'ASTRIVO — Ideas into orbit.',
    description: 'A creative technology agency for your next chapter.',
  },
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/*
          vinext's client shims read Next's build-time flags off `process.env`.
          The production build folds those away, but Vite's dev dependency
          pre-bundler does not, so a client-side navigation throws
          "process is not defined". A classic inline script runs before every
          deferred module script, so this stands the global up in time; reads
          then resolve to undefined, exactly as the production build evaluates
          them. Remove once vinext defines these in dev.
        */}
        <script dangerouslySetInnerHTML={{ __html: 'globalThis.process||={env:{}};' }} />
        <GalaxyCanvas />
        <SiteNav />
        {children}
        <SiteFooter />
        <noscript>
          <style>
            {'@media(max-width:767px){#main-navigation{display:flex!important;position:static;flex-direction:row;flex-wrap:wrap;background:transparent;border:0;padding:0}}'}
          </style>
        </noscript>
      </body>
    </html>
  );
}
