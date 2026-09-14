import { Compass, MoveUpRight, Orbit, type LucideIcon } from 'lucide-react';
import { Reveal } from '@/components/cosmic/reveal';

/**
 * Each principle restates copy that already appears elsewhere on the site —
 * the connected-universe promise, "start where you are", and "launch is a
 * milestone" — so nothing new is claimed here.
 */
const principles: { icon: LucideIcon; title: string; copy: string; accent: string }[] = [
  {
    icon: Orbit,
    title: 'One connected orbit',
    copy: 'Strategy, creativity, and technology sit in the same room instead of passing work down a line. One team, one direction, no handoff gaps.',
    accent: '#a78bfa',
  },
  {
    icon: Compass,
    title: 'Start where you are',
    copy: 'You do not need the whole plan before you begin. We meet the business at its real starting point and plot the route from there.',
    accent: '#8b5cf6',
  },
  {
    icon: MoveUpRight,
    title: 'Built to keep moving',
    copy: 'Launch is a milestone, not the finish line. What we build is made to be measured, maintained, and moved forward after it ships.',
    accent: '#22d3ee',
  },
];

export function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="relative py-24 sm:py-32">
      <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        <Reveal header className="mx-auto max-w-3xl text-center">
          <span className="inline-block text-[11px] font-bold tracking-[0.3em] text-nebula-soft uppercase">
            The ASTRIVO Way
          </span>
          <h2
            id="about-title"
            className="mt-5 text-[clamp(2.25rem,5vw,4rem)] leading-[1.08] font-semibold tracking-[-0.035em] text-starlight"
          >
            Every business has
            <br />
            somewhere <span className="text-cosmic">new to go.</span>
          </h2>
          <p className="mt-7 text-lg text-starlight/85">That next step deserves more than a good idea.</p>
          <p className="mx-auto mt-4 max-w-2xl text-haze">
            We bring strategy, creativity, and technology into the same orbit. From finding your voice to building the
            systems behind your growth, we turn possibility into something useful.
          </p>
        </Reveal>

        {/* Data matrix — a vertical stream per principle, with a comet running it. */}
        <div className="mt-20 grid gap-x-10 gap-y-16 pl-6 md:grid-cols-3">
          {principles.map((principle, index) => (
            <Reveal key={principle.title} delay={index * 0.12} className="group relative">
              {/* Structural anchor */}
              <span
                aria-hidden="true"
                className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent transition-colors duration-500 group-hover:via-nebula/40"
              />

              {/* Comet */}
              <span aria-hidden="true" className="absolute top-0 bottom-0 -left-px w-[3px] overflow-hidden">
                <span
                  className="animate-comet block h-full w-full"
                  style={{
                    background: `linear-gradient(to bottom, transparent 0%, ${principle.accent} 9%, #22d3ee 13%, transparent 26%)`,
                    animationDelay: `${index * 1.4}s`,
                  }}
                />
              </span>

              {/* Node */}
              <span
                aria-hidden="true"
                className="absolute top-4 -left-[22px] inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-void-2/90 backdrop-blur-xl transition-all duration-500 group-hover:border-nebula/50 group-hover:shadow-[0_0_30px_-6px_rgba(139,92,246,0.85)]"
                style={{ color: principle.accent }}
              >
                <principle.icon size={19} strokeWidth={1.5} />
              </span>

              <div className="relative pt-5 pr-2 pb-6 pl-11">
                {/* Keeps the copy legible where it crosses a bright patch of starfield. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-void-2/40 opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-100"
                />
                <h3 className="text-xl font-semibold tracking-tight text-starlight transition-colors duration-300 group-hover:text-nebula-soft">
                  {principle.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-haze transition-colors duration-500 group-hover:text-starlight/80">
                  {principle.copy}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
