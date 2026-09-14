'use client';

import { useEffect, useState } from 'react';
import { Pause, Play } from 'lucide-react';

/**
 * Sets `data-motion` on <html>, which the stylesheet and the galaxy canvas both
 * read. Honours the OS reduced-motion setting and pauses on a hidden tab.
 */
export function MotionController() {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      document.documentElement.dataset.motion =
        paused || reduce.matches || document.hidden ? 'paused' : 'running';
    };
    sync();
    reduce.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    return () => {
      reduce.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, [paused]);

  return (
    <button
      type="button"
      onClick={() => setPaused(!paused)}
      aria-pressed={paused}
      aria-label={paused ? 'Resume motion' : 'Pause motion'}
      className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-4 py-2 text-xs text-haze backdrop-blur-md transition-colors duration-300 hover:border-nebula/50 hover:text-starlight"
    >
      {paused ? <Play size={13} /> : <Pause size={13} />}
      {paused ? 'Motion paused' : 'Pause motion'}
    </button>
  );
}
