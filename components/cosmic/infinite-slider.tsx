'use client';

import { animate, motion, useMotionValue, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useMotionPaused } from '@/components/cosmic/use-motion-paused';
import { cn } from '@/lib/utils';

type InfiniteSliderProps = {
  children: ReactNode;
  /** Pixel gap between items. Also the width of the seam when the track wraps. */
  gap?: number;
  /** Seconds for one full cycle. */
  duration?: number;
  /** Seconds per cycle while hovered. A large value eases the strip to a near stop. */
  durationOnHover?: number;
  reverse?: boolean;
  className?: string;
};

/**
 * Seamless marquee, ported from aisaige-web-v2's `InfiniteSlider`.
 *
 * The track renders `children` twice and translates by exactly one copy's width
 * (measured width + one gap, halved), so the moment it resets, copy two sits
 * precisely where copy one started — no gap, no jump. A CSS `translate(-50%)`
 * cannot do this reliably because the trailing edge has no gap after it.
 *
 * Note: the caller must supply enough items that ONE copy is wider than the
 * viewport. Otherwise the wrap is still seamless but you see empty track.
 *
 * Differences from the original: measurement uses a ResizeObserver instead of
 * adding `react-use-measure`, and the hover catch-up divides by the real travel
 * distance (`contentSize / 2`) so releasing a hover resumes at the same speed
 * rather than briefly running at double.
 */
export function InfiniteSlider({
  children,
  gap = 16,
  duration = 25,
  durationOnHover,
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const [currentDuration, setCurrentDuration] = useState(duration);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [cycle, setCycle] = useState(0);
  const [width, setWidth] = useState(0);

  const trackRef = useRef<HTMLDivElement>(null);
  const translation = useMotionValue(0);
  const reduce = useReducedMotion();
  const paused = useMotionPaused();

  // Re-measure on resize, font load, or content change.
  useEffect(() => {
    const node = trackRef.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduce || paused || width === 0) return;

    const contentSize = width + gap;
    const travel = contentSize / 2;
    const from = reverse ? -travel : 0;
    const to = reverse ? 0 : -travel;

    // Hover changed the speed: ease from wherever we are to the cycle end at the
    // new rate, then hand back to the seamless loop below.
    if (isTransitioning) {
      const controls = animate(translation, [translation.get(), to], {
        ease: 'linear',
        duration: currentDuration * Math.abs((translation.get() - to) / travel),
        onComplete: () => {
          setIsTransitioning(false);
          setCycle((previous) => previous + 1);
        },
      });
      return () => controls.stop();
    }

    const controls = animate(translation, [from, to], {
      ease: 'linear',
      duration: currentDuration,
      repeat: Infinity,
      repeatType: 'loop',
      repeatDelay: 0,
      onRepeat: () => translation.set(from),
    });
    return () => controls.stop();
  }, [cycle, translation, currentDuration, width, gap, isTransitioning, reverse, reduce, paused]);

  const hoverProps =
    durationOnHover && !reduce
      ? {
          onHoverStart: () => {
            setIsTransitioning(true);
            setCurrentDuration(durationOnHover);
          },
          onHoverEnd: () => {
            setIsTransitioning(true);
            setCurrentDuration(duration);
          },
        }
      : {};

  return (
    <div className={cn('overflow-hidden', className)}>
      <motion.div
        ref={trackRef}
        className="flex w-max flex-row items-center"
        style={{ x: translation, gap: `${gap}px` }}
        {...hoverProps}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
