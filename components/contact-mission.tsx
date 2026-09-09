'use client';

import { useEffect, useState, type SubmitEvent } from 'react';
import { ArrowUpRight, Check, Copy, Radio } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Astro } from '@/components/astro';
import { disciplines } from '@/lib/services';
import { hasContactEndpoint, siteConfig } from '@/lib/site-config';
import { deliveryState } from '@/lib/contact-contract';

export function ContactMission() {
  const [interests, setInterests] = useState<string[]>([]);
  const [mission, setMission] = useState('');
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    const receive = (event: Event) => {
      const detail = (event as CustomEvent<{ discipline: string; service: string }>).detail;
      setInterests(previous => previous.includes(detail.discipline) ? previous : [...previous, detail.discipline]);
      setMission(previous => previous || detail.service);
      setStatus('');
    };
    window.addEventListener('astrivo:mission', receive);
    return () => window.removeEventListener('astrivo:mission', receive);
  }, []);
  async function submit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus('');
    if (!hasContactEndpoint) { setStatus('Your mission hasn’t been sent. Online inquiries are not open yet. Your details are still here; use “Copy project brief” to save them.'); return; }
    const data = Object.fromEntries(new FormData(event.currentTarget));
    setSending(true);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(siteConfig.contactEndpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, interests }), signal: controller.signal, credentials: 'omit' });
      if (!response.ok) throw new Error('Delivery failed');
      const result: unknown = await response.json();
      const state = deliveryState(result);
      if (!state) throw new Error('Unconfirmed delivery');
      setStatus(state === 'delivered' ? 'Your mission brief has been delivered. Thank you for sharing what you want to build.' : 'Your mission brief has been received and queued for delivery.');
    } catch { setStatus('We couldn’t confirm receipt. Your details are still here. Please try again or copy your brief.'); }
    finally { window.clearTimeout(timeout); setSending(false); }
  }
  async function copyBrief() {
    const form = document.querySelector<HTMLFormElement>('#mission-form');
    if (!form) return;
    const values = Object.fromEntries([...new FormData(form)].map(([key, value]) => [key, typeof value === 'string' ? value : '']));
    const text = `ASTRIVO — Project brief\nName: ${values.name || ''}\nCompany: ${values.company || ''}\nEmail: ${values.email || ''}\nMission: ${mission}\nServices: ${interests.join(', ')}\n\n${values.details || ''}`;
    try { await navigator.clipboard.writeText(text); setCopied(true); setStatus('Project brief copied to your clipboard. Nothing has been sent.'); }
    catch { setStatus('Clipboard access is unavailable. You can select and copy the details in the form; nothing has been sent.'); }
  }
  return <section id="contact" className="contact-section section" aria-labelledby="contact-title"><div className="container contact-grid">
    <div className="contact-story"><p className="eyebrow section-label">05 / YOUR NEXT CHAPTER</p><h2 id="contact-title">Ready to enter<br />a <span>new orbit?</span></h2><p>Big ambition, early idea, or a challenge you can’t quite name. Let’s find the right next move.</p><div className="contact-astro"><Astro pose={-10} /><div><span className="eyebrow">ASTRO, ON COMMS</span><p>Every great mission<br />starts with a hello.</p></div></div><div className="contact-signal"><Radio size={16} /><span>Explore what’s next.</span></div></div>
    <form id="mission-form" className="mission-form" onSubmit={submit} onChange={() => setCopied(false)}>
      <div className="form-heading"><h3>Tell us about your mission.</h3><span>YOUR FIRST STEP</span></div>
      <div className="form-row"><label htmlFor="mission-name">Your name <span>*</span><input id="mission-name" name="name" autoComplete="name" placeholder="How should we call you?" required maxLength={120} /></label><label htmlFor="mission-company">Company / Brand<input id="mission-company" name="company" autoComplete="organization" placeholder="Your business name" maxLength={160} /></label></div>
      <label htmlFor="mission-email">Email address <span>*</span><input type="email" id="mission-email" name="email" autoComplete="email" placeholder="Your email address" required maxLength={254} /></label>
      <label htmlFor="mission-title">What do you want to build? <span>*</span><input id="mission-title" name="mission" value={mission} onChange={event => setMission(event.target.value)} placeholder="A new brand, a better website, a smarter workflow…" required maxLength={240} /></label>
      <fieldset><legend>I’m interested in</legend><div className="interest-options">{disciplines.map(discipline => <label key={discipline.slug} className={interests.includes(discipline.name) ? 'interest-label is-selected' : 'interest-label'}><Checkbox checked={interests.includes(discipline.name)} onCheckedChange={checked => { setInterests(previous => checked ? [...previous, discipline.name] : previous.filter(item => item !== discipline.name)); setCopied(false); }} aria-label={discipline.name} />{discipline.name}</label>)}</div></fieldset>
      <label htmlFor="mission-details">A little more about your project<textarea id="mission-details" name="details" rows={3} maxLength={5000} placeholder="Where are you now, and where would you like to go?" /></label>
      {!hasContactEndpoint && <p className="form-notice">Online inquiries are not open yet. You can prepare and copy your brief here; it will not be sent.</p>}
      <div className="form-actions"><button className="button button-primary" type="submit" disabled={sending}>{sending ? 'Sending your mission…' : 'Start the mission'}<ArrowUpRight size={18} /></button><button className="copy-brief" type="button" onClick={copyBrief}>{copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Brief copied' : 'Copy project brief'}</button></div>
      <output className="form-status" aria-live="polite">{status}</output>
      <noscript><p>JavaScript is needed to prepare this form. Online inquiries are not yet configured; no details will be sent.</p><style>{'#mission-form button{display:none}'}</style></noscript>
    </form>
  </div></section>;
}
