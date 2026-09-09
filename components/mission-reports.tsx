'use client';
import { ArrowUpRight, ArrowRight, Fingerprint, Layers3, ChartNoAxesCombined } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { missions, reportFields } from '@/content/missions';

const icons = [Fingerprint, Layers3, ChartNoAxesCombined];
export function MissionReports() {
  return <section id="work" className="container section missions-section" aria-labelledby="missions-title"><div className="section-heading"><div><p className="eyebrow section-label">03 / MISSION REPORTS</p><h2 id="missions-title">Missions completed.</h2></div><p>The space for our work.<br />Real stories will land here soon.</p></div>
    <p className="work-disclosure">Our case studies are being prepared. The reports below are clearly marked content placeholders, with no client claims or invented results.</p>
    <div className="mission-list">{missions.map((mission, index) => { const Icon = icons[index]; return <Dialog key={mission.id}><article className={`mission-report mission-${mission.color}`}>
      <div className="mission-visual" aria-hidden="true"><span className="mission-visual-number">{mission.id}</span><Icon strokeWidth={.8} /><span className="mission-visual-caption">{mission.type}</span></div>
      <div className="mission-copy"><p className="eyebrow">MISSION {mission.id} / {mission.type}</p><h3>{mission.title}</h3><div className="mission-tags">{mission.tags.map(tag => <span key={tag}>{tag}</span>)}</div><p className="placeholder-label">PROJECT PLACEHOLDER — REPLACE WITH REAL CASE STUDY</p></div>
      <DialogTrigger className="report-open" aria-label={`Open mission report ${mission.id}`}><ArrowUpRight size={24} /><span>View report</span></DialogTrigger>
    </article><DialogContent className="mission-dialog"><DialogTitle>Mission report {mission.id}</DialogTitle><DialogDescription>PROJECT PLACEHOLDER — REPLACE WITH REAL CASE STUDY</DialogDescription><p className="report-intro">{mission.note} This is the report structure for a future verified case study.</p><dl>{reportFields.map(([name, value]) => <div key={name}><dt>{name}</dt><dd>{value}</dd></div>)}</dl></DialogContent></Dialog>; })}</div>
    <a className="text-link mission-end" href="#contact">Let’s make your next chapter worth sharing <ArrowRight size={18} /></a>
  </section>;
}
