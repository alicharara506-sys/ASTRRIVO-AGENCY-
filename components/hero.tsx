'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, Orbit, Sparkles } from 'lucide-react';
import { CelestialOrb } from '@/components/cosmic/celestial-orb';
import { SparkleCard } from '@/components/cosmic/sparkle-card';
import { GridSpotlight } from '@/components/cosmic/grid-spotlight';
import { InfiniteSlider } from '@/components/cosmic/infinite-slider';
import { serviceModelStats } from '@/lib/services';

const disciplineStrip = ['Brand', 'Digital', 'Technology', 'AI', 'Analytics'];

/**
 * The slider duplicates whatever it is given, so one copy has to be wider than
 * the viewport on its own — five short words are not. Four passes measures out
 * to roughly 3700px of track, which clears any realistic display.
 *
 * Marquee speed is `track width / duration`. At ~3700px over 300s that is about
 * 12.5px/s, matching aisaige's LogoCarousel (~3840px over 300s). If you change
 * the pass count, scale the `duration` prop with it to hold that speed.
 */
const marqueeItems = Array.from({ length: 4 }, () => disciplineStrip).flat();

export function Hero() {
  const reduce = useReducedMotion();
  const rise = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24 },
    animate: reduce ? undefined : { opacity: 1, y: 0 },
    transition: { duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <section id="home" aria-labelledby="hero-title" className="relative isolate overflow-hidden pt-32 sm:pt-40 lg:pt-44">
      <GridSpotlight />

      {/* Ambient depth wash — pure paint, no filter, so it costs nothing to composite. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_62%_54%_at_78%_16%,rgba(139,92,246,0.12),transparent_64%),radial-gradient(ellipse_58%_48%_at_16%_74%,rgba(6,182,212,0.12),transparent_62%)]"
      />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div className="relative z-10 text-center lg:text-left">
          <motion.p
            {...rise(0)}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[11px] font-semibold tracking-[0.18em] text-haze backdrop-blur-md"
          >
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-plasma opacity-70" />
              <span className="relative inline-flex size-1.5 rounded-full bg-plasma-soft" />
            </span>
            A CREATIVE TECHNOLOGY AGENCY
          </motion.p>

          <motion.h1
            {...rise(0.08)}
            id="hero-title"
            className="relative mt-7 text-[clamp(3rem,9vw,6.5rem)] leading-[0.92] font-semibold tracking-[-0.045em] text-starlight"
          >
            {/* Soft beam that lifts the headline off the flat void. */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -inset-x-8 -inset-y-10 -z-10 bg-[radial-gradient(ellipse_58%_62%_at_34%_52%,rgba(139,92,246,0.2),transparent_70%)] blur-2xl"
            />
            Ideas into
            <br />
            <span className="relative inline-block">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -z-10 scale-125 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.22),transparent_68%)] blur-xl"
              />
              <span className="text-cosmic">orbit.</span>
              <Sparkles
                aria-hidden="true"
                className="absolute -top-2 -right-8 size-6 text-plasma-soft animate-float sm:-right-10 sm:size-7"
              />
            </span>
          </motion.h1>

          <motion.p {...rise(0.16)} className="mx-auto mt-7 max-w-xl text-base text-haze sm:text-lg lg:mx-0">
            We combine brand, digital, technology, AI, and analytics to help ambitious businesses build what’s next.
          </motion.p>

          <motion.div {...rise(0.24)} className="mt-10 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <a
              href="#contact"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-nebula px-7 py-3.5 text-sm font-semibold text-starlight glow-violet transition-transform duration-300 hover:scale-[1.03] active:scale-100"
            >
              <span
                aria-hidden="true"
                className="absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.32),transparent)] transition-transform duration-700 group-hover:translate-x-full"
              />
              <span className="relative">Start a mission</span>
              <ArrowUpRight size={17} className="relative transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href="#services"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-starlight backdrop-blur-md transition-all duration-300 hover:border-plasma/50 hover:bg-plasma/10"
            >
              Explore the orbit <ArrowDown size={16} />
            </a>
          </motion.div>

          <motion.p {...rise(0.32)} className="mt-9 flex items-center justify-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-haze/70 lg:justify-start">
            <span className="text-nebula-soft">+</span> BIG IDEAS. REAL-WORLD IMPACT.
          </motion.p>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.9 }}
          animate={reduce ? undefined : { opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <CelestialOrb />

          {/* Floating stat cards. Decorative: the orb is aria-hidden and the
              discipline count is announced properly in the Services section. */}
          <motion.div
            aria-hidden="true"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.7 }}
            className="absolute top-[10%] right-[1%] sm:right-[3%]"
          >
            <motion.div
              animate={reduce ? undefined : { y: [-5, 5, -5] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <SparkleCard accentRgb="34,211,238">
                <div
                  className="flex size-7 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: 'rgba(34,211,238,0.14)' }}
                >
                  <Sparkles className="size-3.5 text-plasma-soft" />
                </div>
                <div>
                  <p className="mb-0.5 text-[10px] leading-none font-medium tracking-wide text-white/40 uppercase">
                    Neural core
                  </p>
                  <div className="flex items-center gap-1.5">
                    <motion.span
                      className="inline-block size-1.5 shrink-0 rounded-full"
                      style={{ background: '#22d3ee', boxShadow: '0 0 8px rgba(34,211,238,0.7)' }}
                      animate={reduce ? undefined : { opacity: [0.5, 1, 0.5], scale: [0.85, 1.1, 0.85] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    />
                    <p className="text-sm leading-none font-semibold text-white/90">Active</p>
                  </div>
                </div>
              </SparkleCard>
            </motion.div>
          </motion.div>

          <motion.div
            aria-hidden="true"
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.7 }}
            className="absolute bottom-[12%] left-[1%] sm:left-[2%]"
          >
            <motion.div
              animate={reduce ? undefined : { y: [5, -5, 5] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1.4 }}
            >
              <SparkleCard accentRgb="139,92,246">
                <div
                  className="flex size-7 shrink-0 items-center justify-center rounded-lg"
                  style={{ background: 'rgba(139,92,246,0.15)' }}
                >
                  <Orbit className="size-3.5 text-nebula-soft" />
                </div>
                <div>
                  <p className="mb-0.5 text-[10px] leading-none font-medium tracking-wide text-white/40 uppercase">
                    Disciplines
                  </p>
                  <p className="text-sm leading-none font-semibold text-white/90">
                    {serviceModelStats.disciplines} in orbit
                  </p>
                </div>
              </SparkleCard>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Discipline marquee — seamless loop, slows to a near stop on hover. */}
      <div
        aria-hidden="true"
        className="relative mt-16 border-y border-white/10 bg-white/[0.03] py-4 backdrop-blur-sm"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 7%, black 93%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 7%, black 93%, transparent)',
        }}
      >
        <InfiniteSlider duration={300} durationOnHover={100000} gap={56} className="w-full">
          {marqueeItems.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="group flex shrink-0 items-center gap-10 sm:gap-14"
            >
              <span className="text-[11px] font-semibold tracking-[0.24em] text-haze/55 transition-colors duration-500 group-hover:text-starlight sm:text-xs">
                {item.toUpperCase()}
              </span>
              <span className="text-nebula-soft/40 transition-colors duration-500 group-hover:text-nebula-soft">
                ✦
              </span>
            </span>
          ))}
        </InfiniteSlider>
      </div>
    </section>
  );
}
