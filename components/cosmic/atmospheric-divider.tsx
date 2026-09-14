import { cn } from '@/lib/utils';

/**
 * Section divider ported from aisaige-web-v2's `AtmosphericDivider`: a faint
 * horizon line, a deep-space bloom that anchors the two sections together, a
 * slow scanning light, and a node at the centre.
 *
 * Pure CSS, so it needs no client boundary and the reduced-motion and
 * data-motion rules in globals.css cover it automatically.
 */
export function AtmosphericDivider({
  color = 'violet',
  delay = 0,
  className,
}: {
  color?: 'violet' | 'cyan' | 'silver';
  /** Seconds, so neighbouring dividers do not scan in lockstep. */
  delay?: number;
  className?: string;
}) {
  const base = color === 'violet' ? '#8b5cf6' : color === 'cyan' ? '#22d3ee' : '#8492a6';

  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none relative z-10 flex h-24 w-full items-center justify-center md:h-32', className)}
    >
      <div className="absolute h-px w-full max-w-5xl bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div
        className="absolute h-[60px] w-[60vw] max-w-3xl rounded-[100%] opacity-15 blur-[40px] mix-blend-screen md:h-20"
        style={{ background: base }}
      />

      <div className="absolute h-px w-full max-w-5xl overflow-hidden">
        <div
          className="animate-divider-scan absolute top-0 bottom-0 w-[200px]"
          style={{
            background: `linear-gradient(90deg, transparent, ${base}, transparent)`,
            boxShadow: `0 0 20px ${base}`,
            animationDelay: `${delay}s`,
          }}
        />
      </div>

      <div
        className="z-10 size-1 rounded-full opacity-50 md:size-1.5"
        style={{ background: base, boxShadow: `0 0 10px ${base}` }}
      />
    </div>
  );
}
