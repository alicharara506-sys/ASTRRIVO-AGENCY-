import content from '@/content/services.json';
import { MISSION_HANDOFF_KEY } from '@/lib/mission-handoff';

export type Service = (typeof content.disciplines)[number]['services'][number];
export type Discipline = (typeof content.disciplines)[number];

export const disciplines: Discipline[] = content.disciplines;

export type DisciplineTheme = {
  /** Accent hex, kept inside the violet → cyan cosmic spectrum. */
  accent: string;
  glow: string;
  promise: string;
  cue: string;
  /** Placement on the decorative orbit ring, in degrees. */
  angle: number;
  ring: 0 | 1;
};

/**
 * Colours are grouped by orbit ring, not by taste: nodes 0 & 3 share the level
 * silver ring, 1 & 4 the cyan ring, 2 & 5 the violet one. The ring gradients are
 * drawn straight from these, so changing one here re-tints its track.
 */
export const disciplineThemes: DisciplineTheme[] = [
  { accent: '#f8fafc', glow: 'rgba(248,250,252,0.22)', promise: 'Give ideas identity.', cue: 'Let’s find your voice.', angle: 198, ring: 0 },
  { accent: '#22d3ee', glow: 'rgba(34,211,238,0.22)', promise: 'Give ideas reach.', cue: 'Ready to make some waves?', angle: 262, ring: 1 },
  { accent: '#a78bfa', glow: 'rgba(167,139,250,0.22)', promise: 'Give ideas form.', cue: 'Let’s build something useful.', angle: 330, ring: 0 },
  { accent: '#8492a6', glow: 'rgba(132,146,166,0.24)', promise: 'Give ideas intelligence.', cue: 'A little curiosity goes a long way.', angle: 42, ring: 1 },
  { accent: '#06b6d4', glow: 'rgba(6,182,212,0.22)', promise: 'Give ideas direction.', cue: 'Follow the signals.', angle: 110, ring: 0 },
];

/**
 * Stashes the chosen discipline and service so the contact page can prefill
 * itself. Session storage rather than a custom event, because the form now
 * lives on its own route.
 */
export function discussService(discipline: Discipline, service: Service) {
  try {
    sessionStorage.setItem(
      MISSION_HANDOFF_KEY,
      JSON.stringify({ discipline: discipline.name, service: service.name }),
    );
  } catch {
    // Private browsing or blocked storage: the form simply opens empty.
  }
}

/** Honest, verifiable counts derived from the published service model. */
export const serviceModelStats = {
  disciplines: disciplines.length,
  services: disciplines.reduce((total, discipline) => total + discipline.services.length, 0),
};
