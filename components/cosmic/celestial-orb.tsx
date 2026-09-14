'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { Planet } from '@/components/cosmic/planet';
import { disciplineThemes, disciplines } from '@/lib/services';

/**
 * Hero centrepiece, built on the orbit system in aisaige-web-v2's
 * `ai-saige-hero`: breathing ring faces, rotating nodes carrying layered
 * glows, and a core that floats and pulses under a stack of drop-shadows.
 * Tilt follows the pointer through springs so the motion stays smooth without
 * re-rendering on every mouse event.
 */

/** Sizes are percentages of the container so the whole system scales as one. */
const ORBITS = [
  { size: 100, rgb: '139,92,246', opacity: 0.32, duration: 30, dir: 1, dot: 9, glow: 9, delay: 0 },
  { size: 78, rgb: '34,211,238', opacity: 0.28, duration: 38, dir: -1, dot: 7, glow: 8, delay: 0.9 },
  { size: 56, rgb: '248,250,252', opacity: 0.2, duration: 22, dir: 1, dot: 5, glow: 6, delay: 1.8 },
];

export function CelestialOrb() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 90, damping: 18, mass: 0.6 });
  const sy = useSpring(py, { stiffness: 90, damping: 18, mass: 0.6 });

  const rotateY = useTransform(sx, [-0.5, 0.5], [14, -14]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [-12, 12]);

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const reset = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
      aria-hidden="true"
      className="relative mx-auto aspect-square w-full max-w-[min(92vw,560px)] select-none"
      style={{ perspective: '1200px' }}
    >
      <motion.div
        className="absolute inset-0"
        style={reduce ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
      >
        {/* Breathing bloom behind the whole system */}
        <motion.div
          className="absolute inset-[6%] rounded-full"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(139,92,246,0.4) 0%, rgba(34,211,238,0.14) 42%, transparent 70%)',
            filter: 'blur(28px)',
          }}
          animate={reduce ? undefined : { opacity: [0.55, 0.9, 0.55], scale: [1, 1.1, 1] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Orbit rings */}
        {ORBITS.map((orbit, index) => (
          <div
            key={index}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ width: `${orbit.size}%`, height: `${orbit.size}%` }}
          >
            {/* Ring face, breathing on its own offset */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                border: `1px solid rgba(${orbit.rgb},${orbit.opacity})`,
                boxShadow: `0 0 ${index === 0 ? 30 : 18}px rgba(${orbit.rgb},${orbit.opacity * 0.55}), inset 0 0 ${index === 0 ? 16 : 9}px rgba(${orbit.rgb},${orbit.opacity * 0.2})`,
              }}
              animate={reduce ? undefined : { opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 5 + index * 1.8, repeat: Infinity, ease: 'easeInOut', delay: orbit.delay }}
            />

            {/* Node riding the ring, with a three-layer glow */}
            <motion.div
              className="absolute inset-0"
              animate={reduce ? undefined : { rotate: 360 * orbit.dir }}
              transition={{ duration: orbit.duration, repeat: Infinity, ease: 'linear' }}
            >
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: orbit.dot,
                  height: orbit.dot,
                  background: `rgb(${orbit.rgb})`,
                  boxShadow: `0 0 ${orbit.glow}px rgb(${orbit.rgb}), 0 0 ${orbit.glow * 2}px rgba(${orbit.rgb},0.5), 0 0 ${orbit.glow * 3.5}px rgba(${orbit.rgb},0.2)`,
                }}
              />
            </motion.div>
          </div>
        ))}

        {/* Core */}
        <div className="absolute top-1/2 left-1/2 size-[32%] -translate-x-1/2 -translate-y-1/2">
          {/* Glow underlay, breathing slightly out of phase with the bloom */}
          <motion.div
            className="absolute inset-[-55%] rounded-full"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(139,92,246,0.45) 0%, rgba(139,92,246,0.18) 42%, transparent 70%)',
              filter: 'blur(20px)',
            }}
            animate={reduce ? undefined : { opacity: [0.55, 0.85, 0.55], scale: [1, 1.12, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />

          <motion.div
            className="relative size-full"
            animate={reduce ? undefined : { y: [-6, 6, -6], scale: [1, 1.03, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Planet className="size-full" />
          </motion.div>
        </div>

        {/* Discipline markers */}
        {disciplines.map((discipline, index) => {
          const theme = disciplineThemes[index];
          const radius = theme.ring === 0 ? 46 : 38;
          const x = 50 + Math.cos((theme.angle * Math.PI) / 180) * radius;
          const y = 50 + Math.sin((theme.angle * Math.PI) / 180) * radius * 0.62;
          return (
            <motion.div
              key={discipline.slug}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${x}%`, top: `${y}%` }}
              animate={reduce ? undefined : { y: [-5, 5, -5], opacity: [0.65, 1, 0.65] }}
              transition={{ duration: 6 + index * 0.7, repeat: Infinity, ease: 'easeInOut', delay: index * 0.5 }}
            >
              <span
                className="block size-1.5 rounded-full"
                style={{
                  backgroundColor: theme.accent,
                  boxShadow: `0 0 6px ${theme.accent}, 0 0 14px ${theme.glow}, 0 0 26px ${theme.glow}`,
                }}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
