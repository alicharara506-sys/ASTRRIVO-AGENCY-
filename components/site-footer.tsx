import Link from 'next/link';
import { ArrowUpRight, Mail } from 'lucide-react';
import { disciplines } from '@/lib/services';
import { siteConfig } from '@/lib/site-config';

const explore = [
  { href: '/#about', label: 'About' },
  { href: '/#impact', label: 'Impact' },
  { href: '/#work', label: 'Work' },
  { href: '/#process', label: 'Process' },
];

const company = [
  { href: '/contact', label: 'Start a mission' },
  { href: '/contact', label: 'Contact' },
];

const hasEmail = siteConfig.contactEmail.includes('@');

function FooterLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="group flex items-center text-sm text-haze transition-all duration-300 hover:text-starlight"
    >
      <span className="-ml-4 mr-2 text-plasma-soft opacity-0 transition-all duration-300 group-hover:ml-0 group-hover:opacity-100">
        →
      </span>
      {label}
    </Link>
  );
}

function ColumnLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-5 text-[11px] font-semibold tracking-[0.2em] text-nebula-soft/50 uppercase md:mb-6 md:text-[10px]">
      {children}
    </p>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative z-20 overflow-hidden border-t border-white/5 bg-void-2">
      {/* Light crossing the top edge */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px overflow-hidden">
        <span
          className="animate-footer-comet absolute top-0 bottom-0 w-[400px]"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.8), transparent)',
            boxShadow: '0 0 20px rgba(34,211,238,0.5)',
          }}
        />
      </div>

      {/* Glow wandering behind the content */}
      <div
        aria-hidden="true"
        className="animate-footer-orb pointer-events-none absolute top-0 bottom-0 z-0 my-auto hidden size-[600px] rounded-full mix-blend-screen md:block"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Planetary glow rising from the bottom edge */}
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/2 z-0 h-[300px] w-full max-w-5xl -translate-x-1/2">
        <div className="absolute inset-0 rounded-[100%] bg-nebula/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/2 h-[100px] w-[60%] -translate-x-1/2 rounded-[100%] bg-plasma/10 blur-[80px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 py-12 sm:px-8 md:py-20 lg:py-24">
        <div className="flex flex-col justify-between gap-16 lg:flex-row lg:gap-8">
          {/* Brand */}
          <div className="w-full pr-0 lg:w-4/12 lg:pr-12">
            <Link href="/" className="group mb-6 inline-flex items-baseline gap-1">
              <span className="text-2xl font-black tracking-[-0.06em] text-starlight">ASTRIVO</span>
              <span
                aria-hidden="true"
                className="text-sm text-nebula-soft transition-transform duration-500 group-hover:rotate-180"
              >
                ✦
              </span>
            </Link>

            <p className="mb-8 text-sm leading-relaxed text-haze">
              A creative technology agency combining brand, digital, technology, AI, and analytics. Ideas into orbit.
            </p>

            <div className="flex flex-col gap-4">
              {hasEmail ? (
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="group flex items-center gap-3 text-sm text-haze transition-colors duration-300 hover:text-plasma-soft"
                >
                  <span className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all duration-300 group-hover:border-plasma/30 group-hover:bg-plasma/10">
                    <Mail className="size-3.5 text-nebula-soft transition-colors group-hover:text-plasma-soft" />
                  </span>
                  {siteConfig.contactEmail}
                </a>
              ) : (
                /* No verified address is configured yet, so point at the form. */
                <Link
                  href="/contact"
                  className="group flex items-center gap-3 text-sm text-haze transition-colors duration-300 hover:text-plasma-soft"
                >
                  <span className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all duration-300 group-hover:border-plasma/30 group-hover:bg-plasma/10">
                    <Mail className="size-3.5 text-nebula-soft transition-colors group-hover:text-plasma-soft" />
                  </span>
                  Send us a project brief
                </Link>
              )}

              {siteConfig.socialProfiles.map((profile) => (
                <a
                  key={profile.url}
                  href={profile.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 text-sm text-haze transition-colors duration-300 hover:text-plasma-soft"
                >
                  <span className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all duration-300 group-hover:border-plasma/30 group-hover:bg-plasma/10">
                    <ArrowUpRight className="size-3.5 text-nebula-soft transition-colors group-hover:text-plasma-soft" />
                  </span>
                  {profile.name}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="grid w-full grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-8 md:grid-cols-3 lg:w-7/12">
            <div className="flex flex-col">
              <ColumnLabel>Disciplines</ColumnLabel>
              <ul className="flex flex-col gap-3.5">
                {disciplines.map((discipline) => (
                  <li key={discipline.slug}>
                    <FooterLink href="/#services" label={discipline.name} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col">
              <ColumnLabel>Explore</ColumnLabel>
              <ul className="flex flex-col gap-3.5">
                {explore.map((link) => (
                  <li key={link.label}>
                    <FooterLink {...link} />
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 flex flex-col border-t border-white/5 pt-8 md:col-span-1 md:border-none md:pt-0">
              <ColumnLabel>Company</ColumnLabel>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-3.5 md:flex md:flex-col">
                {company.map((link) => (
                  <li key={link.label}>
                    <FooterLink {...link} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="relative z-10 mt-16 flex flex-col-reverse items-center justify-between gap-6 border-t border-white/5 pt-8 md:mt-24 md:flex-row">
          <p className="text-center text-xs tracking-wide text-haze/60 md:text-left">
            © {new Date().getFullYear()} ASTRIVO. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 md:justify-end md:gap-8">
            <Link
              href="/privacy-policy"
              className="text-xs tracking-wider text-haze/50 uppercase transition-colors duration-300 hover:text-plasma-soft"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-of-service"
              className="text-xs tracking-wider text-haze/50 uppercase transition-colors duration-300 hover:text-plasma-soft"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
