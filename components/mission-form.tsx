'use client';

import { useEffect, useState, type SubmitEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { disciplines } from '@/lib/services';
import { hasContactEndpoint, siteConfig } from '@/lib/site-config';
import { deliveryState } from '@/lib/contact-contract';
import { MISSION_HANDOFF_KEY } from '@/lib/mission-handoff';
import { cn } from '@/lib/utils';

const field =
  'mt-2 w-full rounded-xl border border-white/10 bg-void-2/70 px-4 py-3 text-sm text-starlight placeholder:text-haze/50 backdrop-blur-md transition-colors duration-300 focus:border-nebula/60 focus:outline-none';

export function MissionForm() {
  const [interests, setInterests] = useState<string[]>([]);
  const [mission, setMission] = useState('');
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);

  // Picks up whatever the visitor clicked in the services orbit before landing here.
  useEffect(() => {
    let handoff: { discipline?: string; service?: string } | null = null;
    try {
      const raw = sessionStorage.getItem(MISSION_HANDOFF_KEY);
      if (raw) {
        handoff = JSON.parse(raw) as { discipline?: string; service?: string };
        sessionStorage.removeItem(MISSION_HANDOFF_KEY);
      }
    } catch {
      handoff = null;
    }
    if (!handoff) return;

    const raf = requestAnimationFrame(() => {
      if (handoff.discipline) setInterests([handoff.discipline]);
      if (handoff.service) setMission(handoff.service);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('');
    if (!hasContactEndpoint) {
      setStatus(
        'Your mission hasn’t been sent — online inquiries are not open yet, so nothing was transmitted. Your details are still here in the form.',
      );
      return;
    }
    const data = Object.fromEntries(new FormData(event.currentTarget));
    setSending(true);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(siteConfig.contactEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, interests }),
        signal: controller.signal,
        credentials: 'omit',
      });
      if (!response.ok) throw new Error('Delivery failed');
      const result: unknown = await response.json();
      const state = deliveryState(result);
      if (!state) throw new Error('Unconfirmed delivery');
      setStatus(
        state === 'delivered'
          ? 'Your mission brief has been delivered. Thank you for sharing what you want to build.'
          : 'Your mission brief has been received and queued for delivery.',
      );
    } catch {
      setStatus('We couldn’t confirm receipt. Your details are still here — please try again in a moment.');
    } finally {
      window.clearTimeout(timeout);
      setSending(false);
    }
  }

  return (
    <form
      id="mission-form"
      onSubmit={submit}
      className="ring-cosmic rounded-3xl border border-white/10 bg-void/60 p-6 backdrop-blur-xl sm:p-9"
    >
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="text-xl font-semibold text-starlight">Tell us about your mission.</h2>
        <span className="font-mono text-[10px] tracking-[0.16em] text-haze/60">YOUR FIRST STEP</span>
      </div>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <label htmlFor="mission-name" className="block text-sm text-haze">
          Your name <span className="text-nebula-soft">*</span>
          <input id="mission-name" name="name" autoComplete="name" placeholder="How should we call you?" required maxLength={120} className={field} />
        </label>
        <label htmlFor="mission-company" className="block text-sm text-haze">
          Company / Brand
          <input id="mission-company" name="company" autoComplete="organization" placeholder="Your business name" maxLength={160} className={field} />
        </label>
      </div>

      <label htmlFor="mission-email" className="mt-5 block text-sm text-haze">
        Email address <span className="text-nebula-soft">*</span>
        <input type="email" id="mission-email" name="email" autoComplete="email" placeholder="Your email address" required maxLength={254} className={field} />
      </label>

      <label htmlFor="mission-title" className="mt-5 block text-sm text-haze">
        What do you want to build? <span className="text-nebula-soft">*</span>
        <input
          id="mission-title"
          name="mission"
          value={mission}
          onChange={(event) => setMission(event.target.value)}
          placeholder="A new brand, a better website, a smarter workflow…"
          required
          maxLength={240}
          className={field}
        />
      </label>

      <fieldset className="mt-6">
        <legend className="text-sm text-haze">I’m interested in</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {disciplines.map((discipline) => {
            const selected = interests.includes(discipline.name);
            return (
              <button
                key={discipline.slug}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  setInterests((previous) =>
                    selected ? previous.filter((item) => item !== discipline.name) : [...previous, discipline.name],
                  );
                }}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-xs font-medium transition-all duration-300',
                  selected
                    ? 'border-nebula/60 bg-nebula/20 text-starlight'
                    : 'border-white/12 bg-white/5 text-haze hover:border-white/25 hover:text-starlight',
                )}
              >
                {discipline.name}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label htmlFor="mission-details" className="mt-6 block text-sm text-haze">
        A little more about your project
        <textarea
          id="mission-details"
          name="details"
          rows={4}
          maxLength={5000}
          placeholder="Where are you now, and where would you like to go?"
          className={cn(field, 'resize-y')}
        />
      </label>

      {!hasContactEndpoint && (
        <p className="mt-6 rounded-xl border border-amber-400/25 bg-amber-400/10 p-3 text-xs text-amber-100/90">
          Online inquiries are not open yet. This form will not send until a verified endpoint is configured.
        </p>
      )}

      <div className="mt-7 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={sending}
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-nebula px-6 py-3 text-sm font-semibold text-starlight glow-violet transition-transform duration-300 hover:scale-[1.03] disabled:opacity-60 disabled:hover:scale-100"
        >
          {sending ? 'Sending your mission…' : 'Start the mission'}
          <ArrowUpRight size={16} />
        </button>
      </div>

      <output aria-live="polite" className="mt-4 block text-sm text-plasma-soft empty:hidden">
        {status}
      </output>

      <noscript>
        <p className="mt-4 text-xs text-haze">
          JavaScript is needed to prepare this form. Online inquiries are not yet configured; no details will be sent.
        </p>
        <style>{'#mission-form button{display:none}'}</style>
      </noscript>
    </form>
  );
}
