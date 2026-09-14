'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { ChartNoAxesCombined, Fingerprint, Layers3, type LucideIcon } from 'lucide-react';
import { missions } from '@/content/missions';
import { cn } from '@/lib/utils';

const icons: LucideIcon[] = [Fingerprint, Layers3, ChartNoAxesCombined];
const accents = ['#a78bfa', '#22d3ee', '#f8fafc'];

/** Per-column drift and standing offset — what keeps the row from reading flat. */
const yRanges: [string, string][] = [
  ['-7%', '4%'],
  ['7%', '-5%'],
  ['-5%', '5%'],
];
const standingOffset = ['lg:mt-10', '', 'lg:mt-10'];

type Mission = (typeof missions)[number];

// ─── Card ───────────────────────────────────────────────────────────────────

function MissionCard({
  mission,
  index,
  contentFilter,
}: {
  mission: Mission;
  index: number;
  contentFilter?: MotionValue<string>;
}) {
  const accent = accents[index];
  const Icon = icons[index];

  return (
    <div
      className="mission-card group relative h-full overflow-hidden rounded-2xl p-6 transition-all duration-300"
      style={{
        background: 'rgba(11,15,25,0.72)',
        border: `1px solid ${accent}2e`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.45), 0 0 50px ${accent}10`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Hover ring, faded in over the resting border. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ border: `1px solid ${accent}73`, boxShadow: `0 0 0 1px ${accent}2e, 0 12px 50px ${accent}2e` }}
      />

      {/* Ghosted mark that lifts on hover. */}
      <Icon
        aria-hidden="true"
        size={132}
        strokeWidth={0.5}
        className="pointer-events-none absolute -top-6 -right-6 opacity-[0.07] transition-all duration-500 group-hover:scale-110 group-hover:opacity-[0.2]"
        style={{ color: accent }}
      />

      <motion.div style={contentFilter ? { filter: contentFilter } : undefined} className="relative flex h-full flex-col">
        <div className="flex items-center gap-2.5">
          <span className="relative flex size-1.5" style={{ color: accent }}>
            <span
              aria-hidden="true"
              className="absolute inline-flex size-full rounded-full bg-current opacity-0 transition-opacity duration-300 group-hover:animate-ping group-hover:opacity-60"
            />
            <span className="status-dot relative inline-flex size-1.5 rounded-full bg-current" />
          </span>
          <span className="text-[10px] font-bold tracking-[0.18em] uppercase" style={{ color: accent }}>
            {mission.type}
          </span>
          <span className="ml-auto font-mono text-[11px] text-white/30">{mission.id}</span>
        </div>

        <h3 className="mt-5 text-xl leading-snug font-semibold whitespace-pre-line text-white/95">{mission.title}</h3>

        <p className="mt-3 text-sm leading-relaxed text-white/55">{mission.summary}</p>

        <div className="mt-5 mb-7 flex flex-wrap gap-1.5">
          {mission.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border px-2.5 py-0.5 text-[10px] text-white/70"
              style={{ borderColor: `${accent}38`, background: `${accent}12` }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* The outcome slot names what will be measured; the chip explains why
            there is no figure yet. Swap `metric.value` off '—' in
            content/missions.ts and the real number renders above the chip. */}
        <div className="relative mt-auto pt-5" style={{ color: accent }}>
          <span aria-hidden="true" className="absolute top-0 left-0 h-px w-full bg-white/10" />
          <span aria-hidden="true" className="metric-rail absolute top-0 left-0 h-px w-8 bg-current" />

          <p className="metric-label text-[11px] font-semibold tracking-[0.14em] text-white/45 uppercase">
            {mission.metric.label}
          </p>

          {mission.metric.value !== '—' && (
            <p className="mt-2 text-3xl leading-none font-semibold text-current">{mission.metric.value}</p>
          )}

          <p className="mt-3 inline-block rounded-full border border-amber-400/25 bg-amber-400/10 px-2.5 py-0.5 text-[9px] font-bold tracking-[0.12em] text-amber-200/90 uppercase">
            Awaiting verified client data
          </p>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Header ─────────────────────────────────────────────────────────────────

function Heading({ compact = false }: { compact?: boolean }) {
  return (
    <div className="mx-auto max-w-3xl px-6 text-center">
      <span className="inline-block text-[11px] font-bold tracking-[0.3em] text-nebula-soft uppercase">
        Mission Reports
      </span>
      <h2
        id="work-title"
        className={cn(
          'mt-5 leading-[1.08] font-semibold tracking-[-0.035em] text-starlight',
          compact ? 'text-3xl' : 'text-[clamp(2.25rem,5vw,4rem)]',
        )}
      >
        Missions <span className="text-cosmic">completed.</span>
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-sm text-haze">
        The space for our work. Case studies are in preparation — every report below is a clearly marked placeholder,
        with no client claims or invented results.
      </p>
    </div>
  );
}

// ─── Section ────────────────────────────────────────────────────────────────

export function Showcase() {
  const stageRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start start', 'end end'] });
  const spring = { stiffness: 60, damping: 22 };

  // The outer cards fan toward the viewer, easing to near-flat as you scroll in.
  const tiltLeft = useSpring(useTransform(scrollYProgress, [0.05, 0.55], reduce ? [0, 0] : [8, 3]), spring);
  const tiltRight = useSpring(useTransform(scrollYProgress, [0.05, 0.55], reduce ? [0, 0] : [-8, -3]), spring);
  const scale = useSpring(useTransform(scrollYProgress, [0.45, 0.9], [1.06, 1], { clamp: true }), spring);

  // Content resolves out of soft focus rather than simply appearing.
  const blur = useSpring(useTransform(scrollYProgress, [0.05, 0.45], reduce ? [0, 0] : [2, 0]), spring);
  const contentFilter = useTransform(blur, (value) => `blur(${value}px)`);

  const y0 = useTransform(scrollYProgress, [0.45, 1], yRanges[0]);
  const y1 = useTransform(scrollYProgress, [0.45, 1], yRanges[1]);
  const y2 = useTransform(scrollYProgress, [0.45, 1], yRanges[2]);
  const columnY = [y0, y1, y2];
  const tilts = [tiltLeft, undefined, tiltRight];

  return (
    <section id="work" aria-labelledby="work-title" className="relative">
      {/* Mobile: the same cards, stacked, with none of the scroll choreography. */}
      <div className="px-5 py-24 lg:hidden">
        <Heading compact />
        <div className="mx-auto mt-10 grid max-w-md gap-4">
          {missions.map((mission, index) => (
            <MissionCard key={mission.id} mission={mission} index={index} />
          ))}
        </div>
      </div>

      {/* Desktop: a sticky stage the cards fan into as it passes. */}
      <div ref={stageRef} className="hidden h-[160vh] lg:block">
        <div className="sticky top-0 isolate flex h-screen w-full flex-col items-center justify-center gap-9 overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_90%_55%_at_50%_50%,rgba(139,92,246,0.12),transparent_68%)]"
          />

          <Heading />

          <motion.div
            style={{ scale, transformPerspective: 1400, transformStyle: 'preserve-3d' }}
            className="mx-auto flex w-full max-w-6xl flex-row items-stretch justify-center gap-5 px-8"
          >
            {missions.map((mission, index) => (
              <motion.div
                key={mission.id}
                style={{ y: columnY[index], rotateY: tilts[index] }}
                className={cn('relative z-10 flex-1 hover:z-30', standingOffset[index])}
              >
                <MissionCard mission={mission} index={index} contentFilter={contentFilter} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
