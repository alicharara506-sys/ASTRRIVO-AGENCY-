'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion';
import { Layers, Orbit, Satellite, Waypoints } from 'lucide-react';
import { CountUp } from '@/components/cosmic/count-up';
import { CosmicCard } from '@/components/cosmic/cosmic-card';
import { Reveal } from '@/components/cosmic/reveal';
import { serviceModelStats } from '@/lib/services';
import { stages } from '@/content/flight-plan';

/**
 * Every figure here is counted from what is actually published on this site —
 * the service model and the flight plan. No client outcomes are claimed,
 * because none have been verified for publication yet.
 *
 * `drift` is each column's scroll parallax range; the staggered values are what
 * stop the row reading as one flat block.
 */
const metrics = [
  {
    value: serviceModelStats.disciplines,
    label: 'Disciplines in orbit',
    note: 'Brand, Digital, Technology, AI, Analytics.',
    icon: Orbit,
    accent: '#f8fafc',
    drift: ['-7%', '4%'],
    lift: '',
  },
  {
    value: serviceModelStats.services,
    label: 'Services mapped end to end',
    note: 'Each with a problem, deliverables, and outcome.',
    icon: Layers,
    accent: '#a78bfa',
    drift: ['6%', '-5%'],
    lift: 'lg:mt-10',
  },
  {
    value: stages.length,
    label: 'Stages in every flight plan',
    note: 'Scan through Grow, on every mission.',
    icon: Waypoints,
    accent: '#22d3ee',
    drift: ['-5%', '5%'],
    lift: '',
  },
  {
    value: 1,
    label: 'Connected universe',
    note: 'One team, one direction, no handoff gaps.',
    icon: Satellite,
    accent: '#8492a6',
    drift: ['8%', '-4%'],
    lift: 'lg:mt-14',
  },
];

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

function MetricCard({ metric, index }: { metric: (typeof metrics)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // Each column drifts at its own rate as the section passes through the viewport.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const drift = useSpring(useTransform(scrollYProgress, [0, 1], metric.drift), {
    stiffness: 60,
    damping: 22,
  });

  const Icon = metric.icon;

  return (
    <motion.div ref={ref} variants={cardVariants} className={metric.lift}>
      <motion.div style={reduce ? undefined : { y: drift }}>
        <CosmicCard accent={metric.accent}>
          <div className="relative z-10 flex h-full flex-col p-7 [transform-style:preserve-3d]">
            {/* Lifted off the surface so it parallaxes against the card tilt. */}
            <span className="mb-6 block w-fit [transform:translateZ(34px)]">
              <span
                className="icon-orb relative inline-flex size-11 items-center justify-center rounded-full border-2"
                style={{ backgroundColor: `${metric.accent}1a`, borderColor: `${metric.accent}66` }}
              >
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full border-2 opacity-0 group-hover:animate-icon-halo"
                  style={{ borderColor: metric.accent }}
                />
                <Icon size={19} strokeWidth={1.9} style={{ color: metric.accent }} />
              </span>
            </span>

            <p
              className="stat-number text-[clamp(2.75rem,5vw,4rem)] leading-none font-semibold tracking-[-0.05em] tabular-nums [transform:translateZ(18px)]"
              style={{ color: metric.accent, textShadow: `0 0 42px ${metric.accent}59` }}
            >
              <CountUp to={metric.value} duration={1400 + index * 220} />
            </p>

            <p className="mt-4 text-[15px] font-medium text-white/90">{metric.label}</p>

            <p className="mt-auto border-t border-white/5 pt-4 text-xs leading-relaxed text-white/50">
              {metric.note}
            </p>
          </div>
        </CosmicCard>
      </motion.div>
    </motion.div>
  );
}

export function ImpactStats() {
  return (
    <section id="impact" aria-labelledby="impact-title" className="relative isolate py-24 sm:py-28">
      {/* Bloom that lifts the row off the void, matching the section accents. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_90%_55%_at_50%_60%,rgba(139,92,246,0.12),transparent_68%)]"
      />

      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <Reveal header className="mx-auto mb-16 max-w-3xl text-center">
          <span className="inline-block text-[11px] font-bold tracking-[0.3em] text-plasma-soft uppercase">Signals</span>
          <h2
            id="impact-title"
            className="mt-5 text-[clamp(2.25rem,5vw,4rem)] leading-[1.08] font-semibold tracking-[-0.035em] text-starlight"
          >
            The shape of <span className="text-cosmic">what we do.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-haze">
            These numbers describe our published service model, not client results. Verified outcomes will appear here
            once case studies are approved.
          </p>
        </Reveal>

        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid gap-5 [perspective:1400px] sm:grid-cols-2 lg:grid-cols-4"
        >
          {metrics.map((metric, index) => (
            <MetricCard key={metric.label} metric={metric} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
