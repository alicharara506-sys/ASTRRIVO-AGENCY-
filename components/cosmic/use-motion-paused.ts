'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks the `data-motion` flag the footer's MotionController writes to <html>.
 *
 * CSS animations get paused by a rule in globals.css, but JS-driven ones
 * (framer-motion loops, requestAnimationFrame) have to opt in — this is how
 * they do it.
 */
export function useMotionPaused() {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setPaused(root.dataset.motion === 'paused');
    // Deferred so it is not a synchronous setState inside the effect body.
    const raf = requestAnimationFrame(sync);
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ['data-motion'] });
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return paused;
}
