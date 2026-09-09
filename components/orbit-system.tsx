'use client';

import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Orbit, RotateCcw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Astro, PlanetArt } from '@/components/astro';
import { disciplines, discussService, planetThemes } from '@/lib/services';

export function OrbitSystem() {
  const [active, setActive] = useState(0);
  const [focused, setFocused] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const [satellite, setSatellite] = useState(disciplines[0].services[0].slug);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const current = disciplines[active];
  const theme = planetThemes[active];
  const choose = (index: number, focusButton = false) => {
    const next = (index + disciplines.length) % disciplines.length;
    setActive(next); setFocused(true); setSatellite(disciplines[next].services[0].slug);
    if (focusButton) buttons.current[next]?.focus();
  };
  const keyNavigate = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      choose(event.key === 'Home' ? 0 : event.key === 'End' ? 4 : index + (['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1), true);
    }
  };
  return <section className="orbit-section section" id="services" aria-labelledby="orbit-title">
    <div className="container">
      <div className="section-heading"><div><p className="eyebrow section-label">02 / OUR CONNECTED UNIVERSE</p><h2 id="orbit-title">Choose your planet.</h2></div><p>Five disciplines. One shared direction.<br />Start where you are. Explore what’s next.</p></div>
      <div className={`orbit-system ${focused ? 'is-focused' : ''}`} style={{ '--planet-color': theme.color } as CSSProperties}>
        <div className="orbit-toolbar"><span><Orbit size={15} /> THE ASTRIVO ORBIT</span>{focused ? <button onClick={() => { setFocused(false); buttons.current[active]?.focus(); }}><RotateCcw size={14} /> Back to overview</button> : <span className="orbit-instruction">SELECT A PLANET TO EXPLORE <ArrowUpRight size={14} /></span>}</div>
        <div className="orbital-map" data-motion-scene="true"
          onTouchStart={event => { touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }; }}
          onTouchEnd={event => { const start = touchStart.current; if (!start) return; const dx = event.changedTouches[0].clientX - start.x; const dy = event.changedTouches[0].clientY - start.y; if (Math.abs(dx) > 65 && Math.abs(dx) > Math.abs(dy) * 1.5) choose(active + (dx < 0 ? 1 : -1)); touchStart.current = null; }}>
          <svg className="orbit-lines" viewBox="0 0 1200 540" fill="none" aria-hidden="true"><ellipse cx="600" cy="273" rx="510" ry="149" transform="rotate(-12 600 273)" /><ellipse cx="600" cy="273" rx="340" ry="209" transform="rotate(15 600 273)" /><ellipse cx="600" cy="273" rx="545" ry="220" transform="rotate(10 600 273)" /><path d="M64 310Q550 600 1130 200" strokeDasharray="3 8" /></svg>
          <div className="orbit-center" aria-hidden="true"><span>✦</span><small>ONE CONNECTED<br />UNIVERSE</small></div>
          {disciplines.map((discipline, index) => <button key={discipline.slug} ref={element => { buttons.current[index] = element; }} className={`planet-control planet-${discipline.slug} ${active === index ? 'is-active' : ''}`} aria-pressed={focused && active === index} aria-controls="planet-detail" onClick={() => choose(index)} onKeyDown={event => keyNavigate(event, index)} onMouseEnter={() => setHover(index)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(index)} onBlur={() => setHover(null)} style={{ '--x': `${planetThemes[index].x}%`, '--y': `${planetThemes[index].y}%`, '--planet-size': `${planetThemes[index].size}px`, '--planet-color': planetThemes[index].color } as CSSProperties}>
            <PlanetArt crop={planetThemes[index].crop} />
            <span className="planet-label"><span className="planet-number">0{index + 1}</span>{discipline.name}<ArrowUpRight size={14} /></span><small className="planet-tagline">{planetThemes[index].promise}</small>
          </button>)}
          <div className={`orbit-astro pose-${hover ?? active}`} style={{ '--astro-x': `${hover === null ? 72 : planetThemes[hover].x}%` } as CSSProperties}><Astro pose={planetThemes[hover ?? active].pose} /><span>YOUR NAVIGATOR, ASTRO</span></div>
        </div>
        <div className="mobile-planet-navigation"><button aria-label="Previous planet" onClick={() => choose(active - 1)}><ChevronLeft /></button><span><strong>{current.name}</strong><small>0{active + 1} / 05</small></span><button aria-label="Next planet" onClick={() => choose(active + 1)}><ChevronRight /></button></div>
        <div className="orbit-index" aria-label="Discipline shortcuts">{disciplines.map((discipline, index) => <button key={discipline.slug} onClick={() => choose(index)} aria-pressed={active === index && focused} style={{ '--planet-color': planetThemes[index].color } as CSSProperties}><span />{discipline.name}</button>)}</div>
        <div id="planet-detail" className="planet-detail" aria-live="polite">
          {focused ? <>
            <div className="discipline-intro"><div><p className="eyebrow">PLANET 0{active + 1} / {current.name.toUpperCase()}</p><h3>{theme.promise}</h3><p>{current.intro}</p></div><div className="astro-message"><span>ASTRO SAYS</span><p>“{theme.cue}”</p></div></div>
            <Tabs value={satellite} onValueChange={value => setSatellite(String(value))} className="service-tabs">
              <TabsList className="service-moons" aria-label={`${current.name} services`}>{current.services.map(service => <TabsTrigger key={service.slug} value={service.slug} className="service-moon"><span aria-hidden="true" />{service.name}</TabsTrigger>)}</TabsList>
              {current.services.map(service => <TabsContent key={service.slug} value={service.slug} className="service-content">
                <div className="service-title"><span className="eyebrow">EXPLORE / {service.name.toUpperCase()}</span><h4>{service.name}</h4><p>{service.description}</p><a className="button button-primary" href="#contact" onClick={() => discussService(current, service)}>Discuss this mission <ArrowUpRight size={17} /></a></div>
                <dl className="service-facts"><div><dt>THE PROBLEM IT SOLVES</dt><dd>{service.problem}</dd></div><div><dt>WHAT WE CREATE</dt><dd><ul>{service.deliverables.map(item => <li key={item}>{item}</li>)}</ul></dd></div><div><dt>WHAT IT CAN IMPROVE</dt><dd>{service.outcomes}</dd></div></dl>
              </TabsContent>)}
            </Tabs>
            <div className="next-planet"><button onClick={() => choose(active - 1)}><ArrowLeft size={16} /> {disciplines[(active + 4) % 5].name}</button><span>EVERY PLANET IS PART OF THE BIGGER PICTURE.</span><button onClick={() => choose(active + 1)}>{disciplines[(active + 1) % 5].name} <ArrowRight size={16} /></button></div>
          </> : <div className="orbit-overview"><div><h3>Different strengths.<br /><em>Stronger together.</em></h3><p>A brand people recognize. Experiences they want to use. Systems that help your business move forward.</p></div><button className="button button-quiet" onClick={() => choose(active)}>Explore {current.name} <ArrowUpRight size={17} /></button></div>}
        </div>
      </div>
      <noscript><div className="service-fallback"><h3>Explore every service</h3>{disciplines.map(discipline => <div key={discipline.slug}><h3>{discipline.name}</h3>{discipline.services.map(service => <details key={service.slug}><summary>{service.name}</summary><p>{service.description}</p><h4>The problem it solves</h4><p>{service.problem}</p><h4>What we create</h4><ul>{service.deliverables.map(item => <li key={item}>{item}</li>)}</ul><h4>What it can improve</h4><p>{service.outcomes}</p><a href="#contact">Discuss this mission →</a></details>)}</div>)}</div></noscript>
    </div>
  </section>;
}
