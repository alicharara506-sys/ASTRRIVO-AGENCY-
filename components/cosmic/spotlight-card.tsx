'use client';

import { useRef, useState, type HTMLAttributes, type PointerEvent, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type SpotlightCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  /** Centre colour of the cursor-tracking spotlight. */
  glow?: string;
};

/**
 * Glassmorphic surface with a radial spotlight that follows the cursor.
 * Position is written straight to CSS custom properties so cursor movement
 * never triggers a React render.
 */
export function SpotlightCard({ children, className, glow = 'rgba(139,92,246,0.22)', ...props }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
    node.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerEnter={() => setActive(true)}
      onPointerLeave={() => setActive(false)}
      className={cn(
        'group relative isolate overflow-hidden rounded-2xl border border-white/10 bg-white/5',
        'backdrop-blur-md transition-[border-color,box-shadow,transform] duration-300',
        'hover:border-nebula/40 hover:shadow-[0_18px_60px_-24px_rgba(139,92,246,0.75)]',
        className,
      )}
      {...props}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px -z-10 transition-opacity duration-300"
        style={{
          opacity: active ? 1 : 0,
          background: `radial-gradient(420px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${glow}, transparent 62%)`,
        }}
      />
      {children}
    </div>
  );
}
