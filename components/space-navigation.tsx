'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
const links = ['About', 'Services', 'Work', 'Process', 'Contact'];
export function SpaceNavigation() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const menuButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
    }, { rootMargin: '-20% 0px -60% 0px' });
    document.querySelectorAll('main section[id]').forEach(section => observer.observe(section));
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === 'Escape' && open) { setOpen(false); menuButton.current?.focus(); } };
    window.addEventListener('keydown', close);
    return () => window.removeEventListener('keydown', close);
  }, [open]);
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <header className="site-header"><div className="container nav-inner">
      <a href="#home" className="wordmark" aria-label="ASTRIVO home">ASTRIVO<span aria-hidden="true">✦</span></a>
      <nav id="main-navigation" aria-label="Main navigation" className={open ? 'main-nav is-open' : 'main-nav'}>
        {links.map(link => <a key={link} href={`#${link.toLowerCase()}`} aria-current={active === link.toLowerCase() ? 'location' : undefined} onClick={() => setOpen(false)}>{link}</a>)}
      </nav>
      <a href="#contact" className="button nav-cta" onClick={() => setOpen(false)}>Start a mission <ArrowUpRight size={16} /></a>
      <button ref={menuButton} className="menu-toggle" type="button" aria-controls="main-navigation" aria-expanded={open} aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</button>
    </div></header>
  </>;
}
