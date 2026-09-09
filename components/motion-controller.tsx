'use client';
import { useEffect, useState } from 'react';
import { Pause, Play } from 'lucide-react';

export function MotionController() {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => { document.documentElement.dataset.motion = paused || reduce.matches || document.hidden ? 'paused' : 'running'; };
    sync(); reduce.addEventListener('change', sync); document.addEventListener('visibilitychange', sync);
    const observer = new IntersectionObserver(entries => { entries.forEach(entry => { (entry.target as HTMLElement).dataset.inView = String(entry.isIntersecting); }); });
    document.querySelectorAll('[data-motion-scene]').forEach(element => observer.observe(element));
    return () => { reduce.removeEventListener('change', sync); document.removeEventListener('visibilitychange', sync); observer.disconnect(); };
  }, [paused]);
  return <button className="motion-toggle" onClick={() => setPaused(!paused)} aria-pressed={paused} aria-label={paused ? 'Resume motion' : 'Pause motion'}>{paused ? <Play size={14} /> : <Pause size={14} />}<span>{paused ? 'Motion paused' : 'Pause motion'}</span></button>;
}
