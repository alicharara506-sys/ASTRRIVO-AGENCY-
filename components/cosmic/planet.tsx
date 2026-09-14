'use client';

import { useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/** Meridian angles, evenly spaced round the polar axis. */
const MERIDIANS = [0, 30, 60, 90, 120, 150];
const MERIDIANS_COMPACT = [0, 45, 90, 135];

/**
 * Latitudes as a fraction of the radius. A ring at height `h` on a unit sphere
 * has radius sqrt(1 - h^2) — that relationship is what makes the wireframe read
 * as a sphere rather than a stack of hoops.
 */
const toLatitudes = (offsets: number[]) =>
  offsets.map((offset) => ({ offset, radius: Math.sqrt(1 - offset * offset) }));

const LATITUDES = toLatitudes([-0.66, -0.35, 0, 0.35, 0.66]);
const LATITUDES_COMPACT = toLatitudes([-0.5, 0, 0.5]);

/**
 * Lit sphere with a wireframe turning on its polar axis. Meridians rotate with
 * the planet; latitudes are symmetric about the axis, so they hold still.
 *
 * `compact` thins the wireframe and tightens the glow for small sizes, where
 * the full line count turns to mush.
 */
export function Planet({ className, compact = false }: { className?: string; compact?: boolean }) {
  const reduce = useReducedMotion();
  const meridians = compact ? MERIDIANS_COMPACT : MERIDIANS;
  const latitudes = compact ? LATITUDES_COMPACT : LATITUDES;

  return (
    <div aria-hidden="true" className={cn('relative', className)}>
      {/* Lit body. Carries the drop-shadow stack, so nothing 3D lives inside. */}
      <div
        className="absolute inset-0 overflow-hidden rounded-full"
        style={{
          background:
            'radial-gradient(circle at 32% 26%, #ffffff 0%, #f5f3ff 8%, #c4b5fd 24%, #8b5cf6 44%, #5b21b6 62%, #2a1065 80%, #05060f 100%)',
          filter: compact
            ? 'drop-shadow(0 0 14px rgba(139,92,246,0.6)) drop-shadow(0 0 32px rgba(139,92,246,0.25))'
            : 'drop-shadow(0 0 38px rgba(139,92,246,0.55)) drop-shadow(0 0 88px rgba(34,211,238,0.2)) drop-shadow(0 0 150px rgba(139,92,246,0.14))',
        }}
      />

      {/* Wireframe, clipped to the disc. */}
      <div className="absolute inset-0 overflow-hidden rounded-full">
        <div
          className="absolute inset-0"
          style={{ transformStyle: 'preserve-3d', transform: 'rotateX(-16deg) rotateZ(12deg)' }}
        >
          <div
            className={reduce ? 'absolute inset-0' : 'animate-globe-spin absolute inset-0'}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {meridians.map((angle) => (
              <span
                key={`m${angle}`}
                className="absolute inset-0 rounded-full border"
                style={{ borderColor: 'rgba(248,250,252,0.68)', transform: `rotateY(${angle}deg)` }}
              />
            ))}
            {latitudes.map(({ offset, radius }) => (
              <span
                key={`l${offset}`}
                className="absolute inset-0 rounded-full border"
                style={{
                  borderColor: 'rgba(233,228,255,0.54)',
                  transform: `translateY(${-offset * 50}%) rotateX(90deg) scale(${radius})`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Specular highlight */}
      <div
        className="absolute top-[13%] left-[19%] size-[30%] rounded-full opacity-95"
        style={{
          background: 'radial-gradient(circle, #ffffff, rgba(255,255,255,0.55) 40%, transparent 72%)',
          filter: compact ? 'blur(2px)' : 'blur(4px)',
        }}
      />

      {/* Terminator — above the wireframe, so the lines fall into night. */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle at 34% 28%, transparent 24%, rgba(3,7,18,0.6) 56%, rgba(3,7,18,0.97) 86%)',
        }}
      />

      {/* Rim light */}
      <div className="absolute inset-0 rounded-full ring-1 ring-white/40 ring-inset" />
    </div>
  );
}
