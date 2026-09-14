import type { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Reveal } from '@/components/cosmic/reveal';
import { legalConfig, legalIsComplete } from '@/lib/site-config';

/** A fact ASTRIVO still has to supply, shown inline so it cannot be missed. */
export function Fill({ children }: { children: ReactNode }) {
  return (
    <span className="rounded border border-amber-400/30 bg-amber-400/10 px-1.5 py-0.5 font-mono text-[0.85em] text-amber-200/90">
      [{children}]
    </span>
  );
}

export function Entity() {
  return legalConfig.entityName ? <>{legalConfig.entityName}</> : <Fill>legal entity name</Fill>;
}

export function Section({ index, title, children }: { index: number; title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-starlight">
        {index}. {title}
      </h2>
      {children}
    </section>
  );
}

export function LegalPage({ title, intro, children }: { title: string; intro: string; children: ReactNode }) {
  const effective = legalConfig.effectiveDate || null;

  return (
    <main id="main" className="relative isolate">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[50vh]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(139,92,246,0.14),transparent_65%)]" />
      </div>

      <div className="mx-auto w-full max-w-3xl px-5 pt-32 pb-24 sm:px-8 sm:pt-40 sm:pb-32">
        <Reveal>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-[0.16em] text-haze uppercase transition-colors hover:text-starlight"
          >
            <ArrowLeft size={13} /> Back to ASTRIVO
          </Link>
        </Reveal>

        <Reveal header className="mt-10">
          <h1 className="text-4xl font-semibold tracking-tight text-starlight sm:text-5xl">{title}</h1>
          <p className="mt-4 text-sm text-haze">
            {effective ? (
              <>
                Effective {effective} · Last updated {effective}
              </>
            ) : (
              <>
                Effective date <Fill>to be set</Fill>
              </>
            )}
          </p>
        </Reveal>

        {!legalIsComplete && (
          <Reveal delay={0.08}>
            <div className="mt-10 rounded-2xl border border-amber-400/25 bg-amber-400/10 p-5">
              <p className="text-[10px] font-bold tracking-[0.14em] text-amber-200/90 uppercase">Draft — not yet in force</p>
              <p className="mt-2 text-sm leading-relaxed text-amber-100/80">
                This document is a working draft. Every highlighted field below still needs a verified answer from
                ASTRIVO, and it should be reviewed by a qualified adviser before publication. Until then nothing here is
                binding.
              </p>
            </div>
          </Reveal>
        )}

        <Reveal delay={0.12}>
          <div className="prose-legal mt-12 space-y-10 text-base leading-relaxed text-haze">
            <p>{intro}</p>
            {children}
          </div>
        </Reveal>
      </div>
    </main>
  );
}
