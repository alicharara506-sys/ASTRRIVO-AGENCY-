'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

type Sparkle = {
  id: number;
  x: number;
  y: number;
  size: number;
  dx: number;
  dy: number;
  color: string;
  delay: number;
};

/**
 * Floating stat card, ported from aisaige-web-v2's `SparkleCard`.
 *
 * Hovering does two things: a blurred light travels the card's perimeter along
 * a CSS motion path, and eight sparkles burst from random points and drift
 * outward. The border is a 1px accent-tinted padding ring rather than a
 * `border`, which is what gives it that lit edge.
 */
export function SparkleCard({ accentRgb, children }: { accentRgb: string; children: ReactNode }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const sweepRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const reduce = useReducedMotion();

  // The sweep path has to match the card's measured box.
  useEffect(() => {
    const element = cardRef.current;
    if (!element) return;
    const apply = () => {
      const { offsetWidth: w, offsetHeight: h } = element;
      element.style.setProperty('--sweep-path', `path('M 0 0 H ${w} V ${h} H 0 V 0')`);
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const element = sweepRef.current;
    if (!hovered || reduce) {
      element?.style.setProperty('offset-distance', '0%');
      return;
    }

    let start: number | null = null;
    let frame = 0;
    const LOOP_MS = 1800;

    const tick = (timestamp: number) => {
      if (start === null) start = timestamp;
      const percent = (((timestamp - start) % LOOP_MS) / LOOP_MS) * 100;
      element?.style.setProperty('offset-distance', `${percent}%`);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [hovered, reduce]);

  const onEnter = () => {
    setHovered(true);
    if (reduce) return;
    setSparkles(
      Array.from({ length: 8 }, (_, index) => ({
        id: Date.now() + index,
        x: 8 + Math.random() * 84,
        y: 8 + Math.random() * 84,
        size: 1.5 + Math.random() * 2.5,
        dx: (Math.random() - 0.5) * 38,
        dy: (Math.random() - 0.5) * 38,
        color: Math.random() > 0.42 ? `rgba(${accentRgb},1)` : 'rgba(249,250,251,0.9)',
        delay: Math.random() * 0.28,
      })),
    );
  };

  const onLeave = () => {
    setHovered(false);
    window.setTimeout(() => setSparkles([]), 900);
  };

  return (
    <div
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      className="relative overflow-hidden rounded-xl p-px"
      style={{
        background: `rgba(${accentRgb}, 0.22)`,
        boxShadow: `0 8px 32px rgba(0,0,0,0.55), 0 0 50px rgba(${accentRgb},0.06)`,
      }}
    >
      <div
        ref={cardRef}
        className="relative flex min-w-[168px] items-center gap-3 overflow-hidden rounded-[11px] px-4 py-3"
        style={{
          background: 'rgba(11,15,25,0.82)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        {/* Light travelling the perimeter */}
        <div
          ref={sweepRef}
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-0 size-24"
          style={{
            offsetPath: 'var(--sweep-path)',
            offsetDistance: '0%',
            background: `radial-gradient(ellipse at center, rgba(${accentRgb},0.85) 0%, transparent 65%)`,
            filter: 'blur(5px)',
            opacity: hovered && !reduce ? 1 : 0,
            transition: 'opacity 0.28s ease',
            zIndex: 1,
          }}
        />

        <AnimatePresence>
          {sparkles.map((sparkle) => (
            <motion.div
              key={sparkle.id}
              aria-hidden="true"
              className="pointer-events-none absolute z-20 rounded-full"
              style={{
                left: `${sparkle.x}%`,
                top: `${sparkle.y}%`,
                width: sparkle.size,
                height: sparkle.size,
                background: sparkle.color,
                boxShadow: `0 0 ${sparkle.size * 2.5}px ${sparkle.color}`,
              }}
              initial={{ scale: 0, opacity: 1, x: 0, y: 0 }}
              animate={{ scale: [0, 1.6, 0], opacity: [1, 0.85, 0], x: sparkle.dx, y: sparkle.dy }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.75, delay: sparkle.delay, ease: [0.23, 1, 0.32, 1] }}
            />
          ))}
        </AnimatePresence>

        <div className="relative z-10 flex w-full items-center gap-3">{children}</div>
      </div>
    </div>
  );
}
