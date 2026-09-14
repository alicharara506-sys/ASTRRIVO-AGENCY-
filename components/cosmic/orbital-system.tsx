'use client';

import { useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useAnimationFrame, useMotionValue, useReducedMotion, useTransform, type MotionValue } from 'framer-motion';
import { ArrowLeft, ArrowRight, ChevronDown, X, type LucideIcon } from 'lucide-react';
import { useMotionPaused } from '@/components/cosmic/use-motion-paused';

export type OrbitalService = {
  slug: string;
  name: string;
  description: string;
  /** Present on services; absent on lighter entries such as process stages. */
  problem?: string;
  deliverables?: string[];
  outcomes?: string;
};

export type OrbitalNode = {
  id: string;
  title: string;
  tagline: string;
  content: string;
  /** The in-character line shown alongside the summary. */
  cue: string;
  icon: LucideIcon;
  accent: string;
  services: OrbitalService[];
  /** Wording for the detail view's primary action. */
  ctaLabel?: string;
  /** Heading above the chip list. */
  itemsLabel?: string;
};

type OrbitalSystemProps = {
  nodes: OrbitalNode[];
  /** Fired by a card's primary action: hand the brief to the contact form. */
  onDiscuss: (nodeId: string, serviceSlug: string) => void;
  /** Rendered inside the core at the centre of the system. */
  children?: ReactNode;
};

/**
 * Three tilted tracks, each carrying two nodes on opposite phases. A ring is
 * tinted by the pair riding it, so nodes and their track always match.
 */
const RINGS = [
  { tilt: 0, duration: 40 },
  { tilt: 60, duration: 55 },
  { tilt: -60, duration: 45 },
];

const ORBIT_RX = 390;
const ORBIT_RY = 140;

// ─── One orbiting node ──────────────────────────────────────────────────────

function OrbitNode({
  node,
  index,
  time,
  isActive,
  hasActiveNode,
  onClick,
  onHoverStart,
  onHoverEnd,
}: {
  node: OrbitalNode;
  index: number;
  time: MotionValue<number>;
  isActive: boolean;
  hasActiveNode: boolean;
  onClick: () => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const ring = RINGS[index % 3];
  const phase = Math.floor(index / 3) * Math.PI;

  // Position is derived from the shared clock, so nothing rotates the DOM and
  // nothing has to counter-rotate to stay upright.
  const xOffset = useTransform(time, (t) => {
    const angle = t + phase;
    const rawX = ORBIT_RX * Math.cos(angle);
    const rawY = ORBIT_RY * Math.sin(angle);
    const rad = (ring.tilt * Math.PI) / 180;
    return rawX * Math.cos(rad) - rawY * Math.sin(rad);
  });

  const yOffset = useTransform(time, (t) => {
    const angle = t + phase;
    const rawX = ORBIT_RX * Math.cos(angle);
    const rawY = ORBIT_RY * Math.sin(angle);
    const rad = (ring.tilt * Math.PI) / 180;
    return rawX * Math.sin(rad) + rawY * Math.cos(rad);
  });

  // Nodes swelling as they come toward the viewer is what sells the depth.
  const scale = useTransform(time, (t) => 1 + (Math.sin(t + phase) * 0.25));
  const zIndex = useTransform(time, (t) => (Math.sin(t + phase) > 0 ? 30 : 10));

  // Container is 800x800 and the node box is 80x80, so 360 centres it.
  const x = useTransform(xOffset, (value) => value + 360);
  const y = useTransform(yOffset, (value) => value + 360);

  const { icon: Icon, accent } = node;

  return (
    <motion.div
      className="absolute flex size-20 cursor-pointer items-center justify-center"
      style={{ left: 0, top: 0, x, y, scale, zIndex, opacity: isActive ? 0 : 1 }}
      onPointerEnter={() => {
        setHovered(true);
        onHoverStart();
      }}
      onPointerLeave={() => {
        setHovered(false);
        onHoverEnd();
      }}
      onClick={onClick}
    >
      <motion.div
        className="relative flex size-14 items-center justify-center rounded-full transition-all duration-300"
        animate={{ scale: hovered ? 1.15 : 1 }}
        style={{
          background: 'rgba(3, 7, 18, 0.85)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: `1px solid ${hovered ? accent : `${accent}55`}`,
          boxShadow: hovered
            ? `0 0 30px ${accent}aa, inset 0 1px 2px rgba(255,255,255,0.4), inset 0 -4px 20px ${accent}66`
            : `0 0 20px ${accent}66, inset 0 1px 1px rgba(255,255,255,0.15)`,
        }}
      >
        <Icon size={20} style={{ color: hovered ? '#fff' : accent, filter: `drop-shadow(0 0 8px ${accent})` }} />

        <span
          className="absolute -bottom-8 rounded-full px-3 py-1 text-[11px] font-bold tracking-[0.2em] whitespace-nowrap uppercase transition-opacity duration-300"
          style={{
            color: hovered ? '#fff' : accent,
            opacity: hasActiveNode ? 0 : 1,
            // Keeps the label readable where it crosses an orbit track.
            background:
              'radial-gradient(circle, rgba(3,7,18,0.85) 0%, rgba(3,7,18,0.4) 60%, transparent 100%)',
            textShadow: `0 0 12px ${accent}`,
          }}
        >
          {node.title}
        </span>
      </motion.div>
    </motion.div>
  );
}

// ─── Expanded detail card ───────────────────────────────────────────────────

function ActiveCard({
  node,
  onDiscuss,
  onClose,
}: {
  node: OrbitalNode;
  onDiscuss: (serviceSlug: string) => void;
  onClose: () => void;
}) {
  const { accent, icon: Icon } = node;
  const [openService, setOpenService] = useState<string | null>(null);
  const service = node.services.find((item) => item.slug === openService) ?? null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center"
      >
        <div
          className="h-[120%] w-[120%] rounded-full mix-blend-screen"
          style={{
            background: `radial-gradient(circle at center, rgba(3,7,18,0.95) 20%, ${accent}22 50%, transparent 70%)`,
            filter: 'blur(40px)',
          }}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 15 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        className="relative z-50 max-h-[640px] w-[92%] max-w-2xl overflow-x-hidden overflow-y-auto rounded-3xl p-8"
        style={{
          background: 'linear-gradient(180deg, rgba(17,24,39,0.9) 0%, rgba(3,7,18,0.97) 100%)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          border: `1px solid ${accent}55`,
          borderTopColor: 'rgba(255,255,255,0.25)',
          boxShadow: `0 30px 80px rgba(0,0,0,0.9), 0 0 50px ${accent}22`,
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label={`Close ${node.title}`}
          className="absolute top-5 right-5 z-10 flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/40 shadow-md transition-all hover:border-white/30 hover:bg-white/10 hover:text-white"
        >
          <X size={16} />
        </button>

        <div className="mb-7 flex items-center gap-5">
          <div
            className="relative flex size-16 shrink-0 items-center justify-center rounded-full"
            style={{
              background: 'rgba(3, 7, 18, 0.9)',
              border: `1.5px solid ${accent}`,
              boxShadow: `0 0 30px ${accent}88, inset 0 1px 2px rgba(255,255,255,0.5), inset 0 -5px 20px ${accent}55`,
            }}
          >
            <Icon size={26} color="#fff" style={{ filter: 'drop-shadow(0 0 10px #fff)' }} />
          </div>

          <div className="pr-10">
            <span
              className="mb-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[9px] font-black tracking-widest uppercase"
              style={{
                background: `linear-gradient(90deg, ${accent}22, transparent)`,
                color: accent,
                border: `1px solid ${accent}66`,
                textShadow: `0 0 10px ${accent}`,
              }}
            >
              <span className="size-1.5 rounded-full" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
              {node.title}
            </span>
            <h3 className="text-[22px] leading-tight font-bold tracking-tight text-white drop-shadow-lg">
              {node.tagline}
            </h3>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {service ? (
            <motion.div
              key={service.slug}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.25 }}
            >
              <button
                type="button"
                onClick={() => setOpenService(null)}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.14em] text-white/50 uppercase transition-colors hover:text-white"
              >
                <ArrowLeft size={13} /> All {node.services.length} {node.title.toLowerCase()} {node.itemsLabel ?? 'services'}
              </button>

              <h4 className="mt-5 text-xl font-semibold text-white">{service.name}</h4>
              <p className="mt-2 text-[15px] leading-relaxed text-white/70">{service.description}</p>

              {service.problem && service.deliverables && service.outcomes && (
                <dl className="mt-6 grid gap-5 border-t border-white/10 pt-6 sm:grid-cols-3">
                  <div>
                    <dt className="text-[10px] font-bold tracking-[0.16em] text-white/40 uppercase">The problem it solves</dt>
                    <dd className="mt-2 text-[13px] leading-relaxed text-white/75">{service.problem}</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-bold tracking-[0.16em] text-white/40 uppercase">What we create</dt>
                    <dd className="mt-2">
                      <ul className="space-y-1.5 text-[13px] leading-relaxed text-white/75">
                        {service.deliverables.map((item) => (
                          <li key={item} className="flex gap-2">
                            <span aria-hidden="true" style={{ color: accent }}>
                              ✦
                            </span>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] font-bold tracking-[0.16em] text-white/40 uppercase">What it can improve</dt>
                    <dd className="mt-2 text-[13px] leading-relaxed text-white/75">{service.outcomes}</dd>
                  </div>
                </dl>
              )}

              <button
                type="button"
                onClick={() => onDiscuss(service.slug)}
                className="group relative mt-7 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl py-4 text-[14px] font-bold tracking-wide uppercase transition-all duration-300"
                style={{ background: accent, color: '#03070f', boxShadow: `0 0 30px ${accent}66` }}
              >
                <span className="absolute inset-0 bg-white/20 opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="relative">{node.ctaLabel ?? `Discuss ${service.name}`}</span>
                <ArrowRight className="relative size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="overview"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-[15px] leading-relaxed text-white/70">{node.content}</p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-void/50 p-4">
                <p className="text-[10px] font-bold tracking-[0.2em] uppercase" style={{ color: accent }}>
                  Astro says
                </p>
                <p className="mt-1.5 text-sm text-white/85">“{node.cue}”</p>
              </div>

              <p className="mt-7 text-[10px] font-bold tracking-[0.2em] text-white/40 uppercase">
                {node.services.length} {node.itemsLabel ?? 'services'} in this orbit
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {node.services.map((item) => (
                  <button
                    key={item.slug}
                    type="button"
                    onClick={() => setOpenService(item.slug)}
                    className="group inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium text-white/80 transition-all duration-300 hover:text-white"
                    style={{ borderColor: `${accent}44`, background: `${accent}12` }}
                  >
                    {item.name}
                    <ArrowRight size={11} className="opacity-40 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:opacity-90" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

// ─── System ─────────────────────────────────────────────────────────────────

export function OrbitalSystem({ nodes, onDiscuss, children }: OrbitalSystemProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  // Refs, not state: hover must not re-render the tree on every pointer move.
  const systemHover = useRef(false);
  const nodeHover = useRef(false);

  const time = useMotionValue(0);
  const reduce = useReducedMotion();
  const motionPaused = useMotionPaused();

  useAnimationFrame((_, delta) => {
    if (reduce || motionPaused || nodeHover.current) return;
    const speed = systemHover.current || activeId ? 0.0001 : 0.0003;
    time.set(time.get() + delta * speed);
  });

  const activeNode = nodes.find((node) => node.id === activeId);

  return (
    <>
      {/* Touch-friendly fallback: the orbit needs hover and room to breathe. */}
      <div className="mx-auto max-w-lg space-y-3 md:hidden">
        {nodes.map((node) => (
          <details key={node.id} className="group rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <summary className="flex cursor-pointer items-center gap-3 list-none">
              <node.icon size={18} style={{ color: node.accent }} />
              <span className="flex-1">
                <span className="block text-sm font-semibold text-white/90">{node.title}</span>
                <span className="block text-[11px] text-white/50">{node.tagline}</span>
              </span>
              <ChevronDown size={15} className="text-white/40 transition-transform group-open:rotate-180" />
            </summary>
            <p className="mt-4 text-[13px] leading-relaxed text-white/65">{node.content}</p>
            <ul className="mt-4 space-y-3 border-t border-white/10 pt-4">
              {node.services.map((service) => (
                <li key={service.slug}>
                  <p className="text-[13px] font-semibold text-white/90">{service.name}</p>
                  <p className="mt-1 text-[12px] leading-relaxed text-white/55">{service.description}</p>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => onDiscuss(node.id, node.services[0].slug)}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-[13px] font-bold tracking-wide uppercase"
              style={{ background: node.accent, color: '#03070f' }}
            >
              {node.ctaLabel ?? `Discuss ${node.title}`} <ArrowRight size={14} />
            </button>
          </details>
        ))}
      </div>

      <div className="relative hidden h-[750px] w-full items-center justify-center md:flex">
        {activeId && (
          <button
            type="button"
            aria-label="Close overview"
            className="absolute inset-0 z-40 cursor-pointer bg-transparent"
            onClick={() => setActiveId(null)}
          />
        )}

        <div
          className="relative flex size-[800px] scale-[0.45] items-center justify-center transition-transform duration-500 sm:scale-[0.7] md:scale-100"
          onPointerEnter={() => {
            systemHover.current = true;
          }}
          onPointerLeave={() => {
            systemHover.current = false;
            nodeHover.current = false;
          }}
        >
          {/* Core */}
          <div className="pointer-events-none absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
            <div className="relative flex size-36 items-center justify-center">
              <motion.div
                className="absolute inset-0 rounded-full opacity-30 mix-blend-screen"
                style={{
                  background:
                    'conic-gradient(from 0deg, transparent, rgba(167,139,250,0.6), rgba(34,211,238,0.5), rgba(139,92,246,0.6), transparent)',
                  filter: 'blur(15px)',
                }}
                animate={reduce ? undefined : { rotate: 360, scale: [1, 1.05, 1] }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              />

              <div className="relative z-10 size-24 md:size-28">{children}</div>
            </div>
          </div>

          {/* Orbit tracks */}
          <svg aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 h-full w-full">
            <defs>
              {RINGS.map((_, ringIndex) => {
                const a = nodes[ringIndex]?.accent ?? '#8b5cf6';
                const b = nodes[ringIndex + 3]?.accent ?? a;
                return (
                  <linearGradient key={ringIndex} id={`astrivo-ring-${ringIndex}`} x1="0%" y1="50%" x2="100%" y2="50%">
                    <stop offset="0%" stopColor={b} />
                    <stop offset="100%" stopColor={a} />
                  </linearGradient>
                );
              })}
            </defs>
            <g transform="translate(400, 400)">
              {RINGS.map((ring, ringIndex) => (
                <g key={ring.tilt} transform={`rotate(${ring.tilt})`}>
                  <ellipse
                    cx="0"
                    cy="0"
                    rx={ORBIT_RX}
                    ry={ORBIT_RY}
                    stroke={`url(#astrivo-ring-${ringIndex})`}
                    strokeWidth="6"
                    fill="none"
                    opacity="0.25"
                    style={{ filter: 'blur(8px)' }}
                  />
                  <ellipse
                    cx="0"
                    cy="0"
                    rx={ORBIT_RX}
                    ry={ORBIT_RY}
                    stroke={`url(#astrivo-ring-${ringIndex})`}
                    strokeWidth="0.5"
                    fill="none"
                    opacity="0.5"
                  />
                  <motion.ellipse
                    cx="0"
                    cy="0"
                    rx={ORBIT_RX}
                    ry={ORBIT_RY}
                    stroke={`url(#astrivo-ring-${ringIndex})`}
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="20 180"
                    opacity="1"
                    animate={reduce ? undefined : { strokeDashoffset: [0, -1000] }}
                    transition={{ duration: ring.duration, repeat: Infinity, ease: 'linear' }}
                  />
                </g>
              ))}
            </g>
          </svg>

          {nodes.map((node, index) => (
            <OrbitNode
              key={node.id}
              node={node}
              index={index}
              time={time}
              isActive={activeId === node.id}
              hasActiveNode={activeId !== null}
              onClick={() => setActiveId(node.id)}
              onHoverStart={() => {
                nodeHover.current = true;
              }}
              onHoverEnd={() => {
                nodeHover.current = false;
              }}
            />
          ))}

          <AnimatePresence>
            {activeNode && (
              <div className="pointer-events-none absolute top-1/2 left-1/2 z-50 flex h-full w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                <div className="pointer-events-auto flex w-full items-center justify-center">
                  <ActiveCard
                    node={activeNode}
                    onDiscuss={(serviceSlug) => {
                      onDiscuss(activeNode.id, serviceSlug);
                      setActiveId(null);
                    }}
                    onClose={() => setActiveId(null)}
                  />
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
