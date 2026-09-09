import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { siteConfig } from '@/lib/site-config';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  ...(siteConfig.canonicalOrigin ? { metadataBase: new URL(siteConfig.canonicalOrigin), alternates: { canonical: '/' } } : {}),
  title: 'ASTRIVO — Ideas into orbit.',
  description: 'ASTRIVO is a creative technology agency combining brand, digital, technology, AI, and analytics to help ambitious businesses build what comes next.',
  openGraph: { title: 'ASTRIVO — Ideas into orbit.', description: 'Brand. Digital. Technology. AI. Analytics. Explore what’s next with ASTRIVO.', type: 'website', siteName: 'ASTRIVO' },
  twitter: { card: 'summary', title: 'ASTRIVO — Ideas into orbit.', description: 'A creative technology agency for your next chapter.' },
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark`}
      >
        {children}
        <noscript><style>{'@media(max-width:767px){.main-nav{display:flex;position:static;flex-wrap:wrap;flex-direction:row;font-size:12px;padding:0;box-shadow:none;border:0;gap:12px}.nav-inner{height:auto;min-height:76px;flex-wrap:wrap;padding-block:16px}.menu-toggle,.nav-cta{display:none}.main-nav a{font-size:13px;min-height:44px}}.orbit-system{display:none}'}</style></noscript>
      </body>
    </html>
  );
}
