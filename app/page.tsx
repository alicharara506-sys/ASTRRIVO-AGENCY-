import { ArrowDown, ArrowUpRight, Sparkles } from 'lucide-react';
import { SpaceNavigation } from '@/components/space-navigation';
import { OrbitSystem } from '@/components/orbit-system';
import { MissionReports } from '@/components/mission-reports';
import { FlightPlan } from '@/components/flight-plan';
import { ContactMission } from '@/components/contact-mission';
import { MotionController } from '@/components/motion-controller';

export default function Home() {
  return <>
    <SpaceNavigation />
    <main id="main">
      <section className="hero" id="home" aria-labelledby="hero-title" data-motion-scene="true">
        <div className="hero-atmosphere" aria-hidden="true" />
        <picture><source media="(max-width: 767px)" srcSet="/assets/universe-mobile.webp" /><img className="hero-art" src="/assets/universe.webp" width="1536" height="1024" alt="Astro, our friendly astronaut navigator, floats among five colorful service planets in a connected universe." fetchPriority="high" /></picture>
        <div className="hero-shade" aria-hidden="true" />
        <div className="container hero-inner">
          <p className="eyebrow"><span className="status-dot" /> A CREATIVE TECHNOLOGY AGENCY</p>
          <h1 id="hero-title">Ideas into<br /><span>orbit.</span><Sparkles className="headline-spark" aria-hidden="true" /></h1>
          <p className="hero-copy">We combine brand, digital, technology, AI, and analytics to help ambitious businesses build what’s next.</p>
          <div className="hero-actions"><a className="button button-primary" href="#contact">Start a mission <ArrowUpRight size={18} /></a><a className="button button-quiet" href="#services">Explore the orbit <ArrowDown size={17} /></a></div>
          <div className="hero-caption"><span className="tiny-cross">+</span> BIG IDEAS. REAL-WORLD IMPACT.</div>
        </div>
        <div className="container hero-bottom"><span>YOUR NEXT CHAPTER STARTS HERE</span><a href="#about">Scroll to explore <ArrowDown size={14} /></a></div>
        <div className="hero-greeting"><span /> MEET ASTRO. YOUR NEXT-MOVE NAVIGATOR.</div>
      </section>
      <div className="discipline-strip"><div className="container"><span>BRAND <i>✦</i></span><span>DIGITAL <i>✦</i></span><span>TECHNOLOGY <i>✦</i></span><span>AI <i>✦</i></span><span>ANALYTICS <i>✦</i></span></div></div>
      <section className="container section about" id="about"><div><p className="eyebrow section-label">01 / THE ASTRIVO WAY</p><h2>Every business has<br />somewhere <em>new to go.</em></h2></div><div className="about-copy"><p>That next step deserves more than a good idea.</p><p>We bring strategy, creativity, and technology into the same orbit. From finding your voice to building the systems behind your growth, we turn possibility into something useful.</p><a href="#services" className="text-link">Meet your next move <ArrowUpRight size={18} /></a></div></section>
      <OrbitSystem />
      <MissionReports />
      <FlightPlan />
      <ContactMission />
    </main>
    <footer className="container footer"><div className="footer-brand"><a href="#home" className="wordmark">ASTRIVO<span>✦</span></a><p>Ideas into orbit.</p></div><span className="footer-middle">Brand + Digital + Technology + AI + Analytics</span><div className="footer-end"><MotionController /><a href="#home">Back to top <ArrowUpRight size={14} /></a></div><div className="bottom-signoff"><span>© {new Date().getFullYear()} ASTRIVO. All rights reserved.</span><span>BUILT FOR WHAT COMES NEXT.</span></div></footer>
  </>;
}
