import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Radio } from 'lucide-react';
import { Reveal } from '@/components/cosmic/reveal';
import { MissionForm } from '@/components/mission-form';
import { Planet } from '@/components/cosmic/planet';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  ...(siteConfig.canonicalOrigin ? { alternates: { canonical: '/contact' } } : {}),
  title: 'Start a mission — ASTRIVO',
  description:
    'Tell ASTRIVO about your project. Brand, digital, technology, AI, and analytics for businesses building what comes next.',
};

export default function ContactPage() {
  return (
    <main id="main" className="relative isolate">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[60vh]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(139,92,246,0.18),transparent_65%)]" />
      </div>

      <div className="mx-auto w-full max-w-6xl px-5 pt-32 pb-24 sm:px-8 sm:pt-40 sm:pb-32">
        <Reveal>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.16em] text-haze uppercase transition-colors hover:text-starlight"
          >
            <ArrowLeft size={13} /> Back to ASTRIVO
          </Link>
        </Reveal>

        <div className="mt-10 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <Reveal header>
            <span className="inline-block text-[11px] font-bold tracking-[0.3em] text-nebula-soft uppercase">
              Start a mission
            </span>
            <h1 className="mt-5 text-[clamp(2.5rem,5.5vw,4.25rem)] leading-[1.02] font-semibold tracking-[-0.04em] text-starlight">
              Let’s plot
              <br />
              <span className="text-cosmic">the route.</span>
            </h1>
            <p className="mt-7 max-w-sm text-haze">
              Big ambition, early idea, or a challenge you can’t quite name. Tell us where you are and we’ll work out
              the next move together.
            </p>

            <div className="mt-10 flex items-center gap-4 rounded-2xl border border-white/10 bg-void-2/60 p-5">
              <Planet compact className="size-12 shrink-0 animate-float" />
              <div>
                <p className="text-[10px] font-bold tracking-[0.2em] text-plasma-soft uppercase">Astro, on comms</p>
                <p className="mt-1 text-sm text-starlight/90">
                  Every great mission
                  <br />
                  starts with a hello.
                </p>
              </div>
            </div>

            <p className="mt-6 flex items-center gap-3 text-sm text-haze">
              {/* Rings broadcasting outward, staggered so one is always mid-flight. */}
              <span className="relative inline-flex size-4 shrink-0 items-center justify-center text-plasma-soft">
                <span
                  aria-hidden="true"
                  className="animate-signal-ring absolute inset-0 rounded-full border border-current"
                />
                <span
                  aria-hidden="true"
                  className="animate-signal-ring absolute inset-0 rounded-full border border-current [animation-delay:0.8s]"
                />
                <span
                  aria-hidden="true"
                  className="animate-signal-ring absolute inset-0 rounded-full border border-current [animation-delay:1.6s]"
                />
                <Radio size={16} className="relative" />
              </span>
              Explore what’s next.
            </p>
          </Reveal>

          <Reveal delay={0.12}>
            <MissionForm />
          </Reveal>
        </div>
      </div>
    </main>
  );
}
