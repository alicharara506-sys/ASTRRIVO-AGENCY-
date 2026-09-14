'use client';

import { useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Card with a travelling conic-gradient border, adapted from aisaige-web-v2's
 * `GradientCard`. The border lives in CSS (see `.cosmic-card` in globals.css)
 * so the pause and reduced-motion rules catch it; this component adds the
 * pointer-tracked 3D tilt and the lift on hover.
 */
export function CosmicCard({
  accent,
  children,
  className,
}: {
  accent: string;
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const reduce = useReducedMotion();

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();

    // Written straight to the node so the spotlight tracks without re-rendering.
    node.style.setProperty('--x', `${event.clientX - rect.left}px`);
    node.style.setProperty('--y', `${event.clientY - rect.top}px`);

    if (reduce) return;
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    setTilt({ x: -(y / rect.height) * 6, y: (x / rect.width) * 6 });
  };

  const reset = () => setTilt({ x: 0, y: 0 });

  return (
    <motion.div
      ref={ref}
      className={cn('cosmic-card group h-full', className)}
      style={{ '--card-accent': accent, transformStyle: 'preserve-3d' } as CSSProperties}
      animate={reduce ? undefined : { rotateX: tilt.x, rotateY: tilt.y }}
      whileHover={reduce ? undefined : { y: -8, scale: 1.015 }}
      transition={{
        rotateX: { type: 'spring', stiffness: 280, damping: 22 },
        rotateY: { type: 'spring', stiffness: 280, damping: 22 },
        y: { type: 'spring', stiffness: 340, damping: 30 },
        scale: { type: 'spring', stiffness: 340, damping: 30 },
      }}
      onPointerMove={onPointerMove}
      onPointerLeave={reset}
    >
      {/* Specular streak; the animation itself is defined in globals.css. */}
      <span
        aria-hidden="true"
        className="card-sweep pointer-events-none absolute inset-y-0 left-0 z-0 w-1/3 bg-gradient-to-r from-transparent via-white/12 to-transparent"
      />
      {children}
    </motion.div>
  );
}
