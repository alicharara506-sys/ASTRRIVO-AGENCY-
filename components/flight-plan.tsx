'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Reveal } from '@/components/cosmic/reveal';
import { stages } from '@/content/flight-plan';
import { cn } from '@/lib/utils';

const REST = '#a78bfa';
const LIT = '#22d3ee';

/**
 * Flight plan, built on aisaige-web-v2's `Pipeline`: node orbs on a connected
 * track that cascade alight in sequence the first time the section scrolls into
 * view, with signal packets chasing down the connectors between them.
 */
export function FlightPlan() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const reduce = useReducedMotion();

  const [hovered, setHovered] = useState<number | null>(null);
  const [cascade, setCascade] = useState<number | null>(null);

  // One pass down the chain on first sight, then it hands over to hover.
  useEffect(() => {
    if (!inView || reduce) return;
    let interval: ReturnType<typeof setInterval>;
    const start = setTimeout(() => {
      let current = 0;
      setCascade(current);
      interval = setInterval(() => {
        current += 1;
        if (current < stages.length) setCascade(current);
        else {
          setCascade(null);
          clearInterval(interval);
        }
      }, 350);
    }, 400);

    return () => {
      clearTimeout(start);
      clearInterval(interval);
    };
  }, [inView, reduce]);

  return (
    <section id="process" aria-labelledby="process-title" className="relative bg-void-2/30 py-24 backdrop-blur-sm sm:py-32">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8">
        <Reveal header className="mx-auto mb-16 max-w-3xl text-center">
          <span className="inline-flex items-center justify-center gap-2.5 text-[11px] font-bold tracking-[0.3em] text-plasma-soft uppercase">
            <span aria-hidden="true" className="inline-block h-px w-3.5 bg-plasma-soft/80" />
            The Flight Plan
          </span>
          <h2
            id="process-title"
            className="mt-5 text-[clamp(2.25rem,5vw,4rem)] leading-[1.08] font-semibold tracking-[-0.035em] text-starlight"
          >
            Every mission needs <span className="text-cosmic">a flight plan.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-lg text-haze">
            A clear direction. Room to explore. And a reason behind every next move.
          </p>
        </Reveal>

        <div
          ref={ref}
          className="hide-scrollbar relative flex flex-col items-center overflow-x-hidden overflow-y-hidden pt-4 pb-8 md:flex-row md:items-start md:justify-center md:overflow-x-auto"
        >
          {stages.map((stage, index) => {
            const lit = hovered === index || cascade === index;
            const Icon = stage.icon;

            return (
              <div key={stage.slug} className="relative flex shrink-0 flex-col items-center md:flex-row md:items-start">
                <motion.div
                  onPointerEnter={() => setHovered(index)}
                  onPointerLeave={() => setHovered(null)}
                  className="relative flex w-[210px] cursor-default flex-col items-center gap-2 md:w-[118px] md:gap-5"
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  animate={inView && !reduce ? { opacity: 1, y: 0 } : undefined}
                  transition={{ delay: 0.2 + index * 0.15, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                >
                  {/* Node orb */}
                  <div
                    className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300"
                    style={{
                      background: lit ? `${LIT}26` : 'rgba(11,15,25,0.8)',
                      border: `1px solid ${lit ? `${LIT}99` : `${REST}66`}`,
                      boxShadow: lit
                        ? `0 0 30px ${LIT}4d, inset 0 0 15px ${LIT}33`
                        : `0 0 20px ${REST}26, inset 0 0 10px ${REST}1a`,
                      color: lit ? LIT : REST,
                    }}
                  >
                    {/* Dashed ring: outer span scales, inner one spins. */}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'pointer-events-none absolute inset-[-6px] transition-transform duration-300',
                        lit && 'scale-110',
                      )}
                    >
                      <span
                        className="animate-orbit-slow absolute inset-0 rounded-full border border-dashed transition-colors duration-300 [animation-duration:15s]"
                        style={{ borderColor: lit ? `${LIT}66` : `${REST}33` }}
                      />
                    </span>

                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-0 rounded-full transition-opacity duration-300"
                      style={{
                        opacity: lit ? 1 : 0,
                        background: `radial-gradient(circle at 50% 50%, ${LIT}33, transparent 70%)`,
                      }}
                    />

                    <span
                      className="relative z-10 flex items-center gap-1 transition-transform duration-300"
                      style={{ transform: lit ? 'scale(1.15)' : 'scale(1)' }}
                    >
                      <Icon size={21} strokeWidth={1.5} />
                    </span>
                  </div>

                  {/* Node text */}
                  <div
                    className="w-full rounded-xl px-2 py-3 text-center transition-all duration-300"
                    style={{
                      background: lit ? 'rgba(255,255,255,0.03)' : 'transparent',
                      border: `1px solid ${lit ? 'rgba(255,255,255,0.06)' : 'transparent'}`,
                    }}
                  >
                    <span className="mb-1 block font-mono text-[10px] text-white/30">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <strong
                      className="mb-1 block text-[13px] font-bold tracking-[0.02em] transition-colors duration-300"
                      style={{ color: lit ? '#ffffff' : '#f9fafb' }}
                    >
                      {stage.title}
                    </strong>
                    <span
                      className="block text-[11px] leading-[1.4] transition-colors duration-300"
                      style={{ color: lit ? 'rgba(255,255,255,0.7)' : '#9ca3af' }}
                    >
                      {stage.copy}
                    </span>
                  </div>
                </motion.div>

                {/* Connector */}
                {index < stages.length - 1 && (
                  <>
                    <div className="relative z-0 hidden h-14 w-[56px] shrink-0 items-center md:flex">
                      <div className="absolute right-0 left-0 h-[1.5px] bg-white/5" />
                      <motion.div
                        className="absolute right-0 left-0 h-[1.5px]"
                        style={{ background: `${REST}33` }}
                        initial={reduce ? false : { scaleX: 0, transformOrigin: 'left' }}
                        animate={inView && !reduce ? { scaleX: 1 } : undefined}
                        transition={{ delay: 0.4 + index * 0.15, duration: 0.6, ease: 'easeOut' }}
                      />
                      <div className="absolute right-0 left-0 h-[1.5px] overflow-hidden">
                        <span
                          className="animate-pipeline-pulse absolute top-0 bottom-0 w-[30px]"
                          style={{
                            background: `linear-gradient(90deg, transparent, ${LIT}, ${REST})`,
                            boxShadow: `0 0 10px ${LIT}`,
                            animationDelay: `${index * (2.5 / stages.length)}s`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="relative z-0 my-2 flex h-10 w-14 shrink-0 justify-center md:hidden">
                      <div className="absolute top-0 bottom-0 w-[1.5px] bg-white/5" />
                      <div className="absolute top-0 bottom-0 w-[1.5px] overflow-hidden">
                        <span
                          className="animate-pipeline-pulse-y absolute right-0 left-0 h-[30px]"
                          style={{
                            background: `linear-gradient(180deg, transparent, ${LIT}, ${REST})`,
                            boxShadow: `0 0 10px ${LIT}`,
                            animationDelay: `${index * (2.5 / stages.length)}s`,
                          }}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
