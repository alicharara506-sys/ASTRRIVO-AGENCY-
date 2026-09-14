'use client';

import { useRouter } from 'next/navigation';
import { BrainCircuit, ChartNoAxesCombined, Code2, Palette, Radio, Waypoints } from 'lucide-react';
import { OrbitalSystem, type OrbitalNode } from '@/components/cosmic/orbital-system';
import { Planet } from '@/components/cosmic/planet';
import { Reveal } from '@/components/cosmic/reveal';
import { stages } from '@/content/flight-plan';
import { disciplineThemes, disciplines, discussService } from '@/lib/services';

const icons = [Palette, Radio, Code2, BrainCircuit, ChartNoAxesCombined];

/**
 * Nodes are laid out in pairs — ring = index % 3, phase = floor(index / 3) — so
 * the list has to be six long for every track to carry two. The sixth is the
 * flight plan, which is the published process every discipline runs through
 * rather than a sixth service line.
 */
const orbitalNodes: OrbitalNode[] = [
  ...disciplines.map((discipline, index) => ({
    id: discipline.slug,
    title: discipline.name,
    tagline: disciplineThemes[index].promise,
    content: discipline.intro,
    cue: disciplineThemes[index].cue,
    icon: icons[index],
    accent: disciplineThemes[index].accent,
    services: discipline.services,
  })),
  {
    id: 'process',
    title: 'Process',
    tagline: 'Give ideas a flight plan.',
    content:
      'However far you are, the route is the same seven stages. It is how a discipline turns into a delivered piece of work, and how we decide what comes after launch.',
    cue: 'Every mission needs a flight plan.',
    icon: Waypoints,
    accent: '#8b5cf6',
    ctaLabel: 'See the full flight plan',
    itemsLabel: 'stages',
    services: stages.map((stage) => ({ slug: stage.slug, name: stage.title, description: stage.copy })),
  },
];

export function ServicesOrbit() {
  const router = useRouter();

  /** Hands the chosen discipline and service to the contact form, then jumps to it. */
  const discuss = (nodeSlug: string, serviceSlug: string) => {
    if (nodeSlug === 'process') {
      document.getElementById('process')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const discipline = disciplines.find((item) => item.slug === nodeSlug);
    const service = discipline?.services.find((item) => item.slug === serviceSlug);
    if (discipline && service) discussService(discipline, service);
    router.push('/contact');
  };

  return (
    <section id="services" aria-labelledby="services-title" className="relative py-24 sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <Reveal header className="mx-auto mb-16 max-w-3xl text-center">
          <span className="inline-block text-[11px] font-bold tracking-[0.3em] text-nebula-soft uppercase">
            Our Connected Universe
          </span>
          <h2
            id="services-title"
            className="mt-5 text-[clamp(2.25rem,5vw,4rem)] leading-[1.08] font-semibold tracking-[-0.035em] text-starlight"
          >
            Choose your <span className="text-cosmic">planet.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-haze">
            Five disciplines and the flight plan that connects them. Select a planet to see everything it covers — all 26
            services live in the orbit.
          </p>
        </Reveal>

        <OrbitalSystem nodes={orbitalNodes} onDiscuss={discuss}>
          <Planet className="size-full" />
        </OrbitalSystem>

        <noscript>
          <div className="mt-10 space-y-8">
            {disciplines.map((item) => (
              <div key={item.slug}>
                <h3 className="text-xl font-semibold text-starlight">{item.name}</h3>
                {item.services.map((entry) => (
                  <details key={entry.slug} className="mt-2 rounded-xl border border-white/10 p-4">
                    <summary className="cursor-pointer text-starlight">{entry.name}</summary>
                    <p className="mt-2 text-sm text-haze">{entry.description}</p>
                    <p className="mt-2 text-sm text-haze">{entry.problem}</p>
                    <ul className="mt-2 list-disc pl-5 text-sm text-haze">
                      {entry.deliverables.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                    <p className="mt-2 text-sm text-haze">{entry.outcomes}</p>
                  </details>
                ))}
              </div>
            ))}
          </div>
        </noscript>
      </div>
    </section>
  );
}
