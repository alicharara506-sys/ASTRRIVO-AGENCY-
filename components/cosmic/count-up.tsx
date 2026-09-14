'use client';

import { useEffect, useRef, useState } from 'react';

type CountUpProps = { to: number; duration?: number; suffix?: string };

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/** Counts from 0 to `to` the first time it scrolls into view. */
export function CountUp({ to, duration = 1600, suffix = '' }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let raf = 0;
    let start = 0;

    // Reduced motion: land on the final value, but never setState synchronously
    // inside the effect body.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      raf = requestAnimationFrame(() => setValue(to));
      return () => cancelAnimationFrame(raf);
    }

    const run = (now: number) => {
      if (!start) start = now;
      const progress = Math.min(1, (now - start) / duration);
      setValue(Math.round(easeOut(progress) * to));
      if (progress < 1) raf = requestAnimationFrame(run);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.disconnect();
          raf = requestAnimationFrame(run);
        }
      },
      { threshold: 0.4 },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}
