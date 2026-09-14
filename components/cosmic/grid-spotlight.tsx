'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useMotionPaused } from '@/components/cosmic/use-motion-paused';

const CELL = 64;
const LINE_FAINT = 'rgba(255,255,255,0.035)';
const LINE_LIT = 'rgba(167,139,250,0.4)';
/** How far the grid plane drifts toward the pointer, in px. */
const DRIFT = 22;
/** Lerp factor — lower trails further behind the cursor. */
const EASE = 0.055;

const grid = (color: string) =>
  `linear-gradient(to right, ${color} 1px, transparent 1px), linear-gradient(to bottom, ${color} 1px, transparent 1px)`;

/**
 * Blueprint grid that lights up around the cursor and drifts toward it.
 *
 * Four values are written straight to the node, never through React: `--x`/`--y`
 * track the pointer exactly (so the spotlight stays responsive), while
 * `--gx`/`--gy` ease toward it on a lerp so the grid trails smoothly behind.
 *
 * The drift moves `background-position`, not `transform`. Translating a
 * promoted layer whose children carry masks made the browser re-rasterise it
 * mid-move, which showed as a hard-edged rectangle of grid. Shifting the
 * background keeps every element and every mask stationary, so there is nothing
 * to re-composite — and the spotlight mask then needs no offset correction.
 */
export function GridSpotlight() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const paused = useMotionPaused();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame = 0;

    const tick = () => {
      current.x += (target.x - current.x) * EASE;
      current.y += (target.y - current.y) * EASE;
      node.style.setProperty('--gx', `${current.x.toFixed(2)}px`);
      node.style.setProperty('--gy', `${current.y.toFixed(2)}px`);

      // Idle once it has caught up; a pointer move restarts the loop.
      if (Math.abs(target.x - current.x) < 0.1 && Math.abs(target.y - current.y) < 0.1) {
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      const rect = node.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      node.style.setProperty('--x', `${x}px`);
      node.style.setProperty('--y', `${y}px`);

      if (reduce || paused) return;
      target.x = (x / rect.width - 0.5) * DRIFT * 2;
      target.y = (y / rect.height - 0.5) * DRIFT * 2;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [reduce, paused]);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* Vignette so the lines dissolve at the edges instead of hard-clipping. */}
      <div
        className="absolute inset-0"
        style={{
          maskImage: 'radial-gradient(ellipse 85% 75% at 50% 45%, #000 30%, transparent 85%)',
          WebkitMaskImage: 'radial-gradient(ellipse 85% 75% at 50% 45%, #000 30%, transparent 85%)',
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: grid(LINE_FAINT),
            backgroundSize: `${CELL}px ${CELL}px`,
            backgroundPosition: 'var(--gx, 0px) var(--gy, 0px)',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: grid(LINE_LIT),
            backgroundSize: `${CELL}px ${CELL}px`,
            backgroundPosition: 'var(--gx, 0px) var(--gy, 0px)',
            maskImage: 'radial-gradient(circle 340px at var(--x, 50%) var(--y, 30%), #000 0%, transparent 72%)',
            WebkitMaskImage: 'radial-gradient(circle 340px at var(--x, 50%) var(--y, 30%), #000 0%, transparent 72%)',
          }}
        />
      </div>

      {/* Bloom, pinned to the cursor. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle 520px at var(--x, 50%) var(--y, 30%), rgba(139,92,246,0.15) 0%, rgba(34,211,238,0.06) 45%, transparent 68%)',
        }}
      />
    </div>
  );
}
