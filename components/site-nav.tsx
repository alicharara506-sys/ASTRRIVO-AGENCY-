'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Section anchors on the home page; Contact is a route of its own. */
const links = [
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'impact', label: 'Impact' },
  { id: 'work', label: 'Work' },
  { id: 'process', label: 'Process' },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const [lifted, setLifted] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const onHome = pathname === '/';
  // Anchors have to be absolute once the visitor is off the home page.
  const anchor = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: '-20% 0px -60% 0px' },
    );
    if (onHome) document.querySelectorAll('main section[id]').forEach((section) => observer.observe(section));

    const onScroll = () => setLifted(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, [onHome]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) {
        setOpen(false);
        menuButton.current?.focus();
      }
    };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [open]);

  return (
    <>
      <a
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-full focus:bg-nebula focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-starlight"
        href="#main"
      >
        Skip to content
      </a>

      <header
        className={cn(
          'fixed inset-x-0 top-0 z-40 transition-all duration-500',
          lifted ? 'border-b border-white/10 bg-void/80 backdrop-blur-xl' : 'border-b border-transparent',
        )}
      >
        <div className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
          <Link href="/" className="group flex items-baseline gap-1 text-xl font-black tracking-[-0.06em] text-starlight sm:text-2xl" aria-label="ASTRIVO home">
            ASTRIVO
            <span aria-hidden="true" className="text-sm text-nebula-soft transition-transform duration-500 group-hover:rotate-180">
              ✦
            </span>
          </Link>

          <nav
            id="main-navigation"
            aria-label="Main navigation"
            className={cn(
              'absolute inset-x-0 top-[72px] flex-col gap-1 border-b border-white/10 bg-void/95 px-5 pb-6 backdrop-blur-xl md:static md:flex md:flex-row md:items-center md:gap-1 md:border-0 md:bg-transparent md:px-0 md:pb-0 md:backdrop-blur-none',
              open ? 'flex' : 'hidden',
            )}
          >
            {links.map((link) => (
              <Link
                key={link.id}
                href={anchor(link.id)}
                onClick={() => setOpen(false)}
                aria-current={onHome && active === link.id ? 'location' : undefined}
                className={cn(
                  'relative rounded-full px-4 py-2.5 text-sm transition-colors duration-300 hover:text-starlight',
                  active === link.id ? 'text-starlight' : 'text-haze',
                )}
              >
                {onHome && active === link.id && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-full border border-nebula/30 bg-nebula/10"
                  />
                )}
                <span className="relative">{link.label}</span>
              </Link>
            ))}

            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              aria-current={pathname === '/contact' ? 'page' : undefined}
              className={cn(
                'relative rounded-full px-4 py-2.5 text-sm transition-colors duration-300 hover:text-starlight',
                pathname === '/contact' ? 'text-starlight' : 'text-haze',
              )}
            >
              {pathname === '/contact' && (
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full border border-nebula/30 bg-nebula/10"
                />
              )}
              <span className="relative">Contact</span>
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="hidden items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-starlight backdrop-blur-md transition-all duration-300 hover:border-plasma/50 hover:bg-plasma/10 sm:inline-flex"
            >
              Start a mission <ArrowUpRight size={15} />
            </Link>
            <button
              ref={menuButton}
              type="button"
              aria-controls="main-navigation"
              aria-expanded={open}
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen(!open)}
              className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-starlight md:hidden"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
