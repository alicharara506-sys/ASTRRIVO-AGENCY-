import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '@/components/cosmic/reveal';

/**
 * Closing call to action. The form itself lives at /contact — this section's
 * only job is to make the next step obvious.
 */
export function PortalCta() {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate overflow-hidden py-28 sm:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="animate-portal absolute top-1/2 left-1/2 size-[clamp(340px,62vw,820px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.28),rgba(6,182,212,0.12)_46%,transparent_72%)] blur-2xl" />

      </div>

      <Reveal header className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <span className="inline-block text-[11px] font-bold tracking-[0.3em] text-nebula-soft uppercase">
          Your Next Chapter
        </span>

        <h2
          id="contact-title"
          className="mt-6 text-[clamp(2.75rem,6.5vw,5rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-starlight"
        >
          Ready to enter
          <br />
          <span className="text-cosmic">a new orbit?</span>
        </h2>

        <p className="mx-auto mt-7 max-w-xl text-base text-haze sm:text-lg">
          Big ambition, early idea, or a challenge you can’t quite name. Tell us where you are, and we’ll find the right
          next move together.
        </p>

        <Link
          href="/contact"
          className="group relative mt-11 inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-nebula px-9 py-4 text-sm font-semibold text-starlight glow-violet transition-transform duration-300 hover:scale-[1.04] active:scale-100"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent,rgba(255,255,255,0.35),transparent)] transition-transform duration-700 group-hover:translate-x-full"
          />
          <span className="relative">Start a mission</span>
          <ArrowRight size={17} className="relative transition-transform duration-300 group-hover:translate-x-1" />
        </Link>

        <p className="mt-6 text-xs text-haze/60">It takes a minute. No pitch deck required.</p>
      </Reveal>
    </section>
  );
}
