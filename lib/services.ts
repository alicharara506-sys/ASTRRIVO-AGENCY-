import content from '@/content/services.json';

export type Service = typeof content.disciplines[number]['services'][number];
export type Discipline = typeof content.disciplines[number];
export const disciplines: Discipline[] = content.disciplines;
export const planetThemes = [
  { color: '#ff885c', promise: 'Give ideas identity.', cue: 'Let’s find your voice.', x: 16, y: 55, size: 146, crop: [739, 642, 289, 289], pose: -12 },
  { color: '#ba96ff', promise: 'Give ideas reach.', cue: 'Ready to make some waves?', x: 36, y: 25, size: 132, crop: [1224, 100, 224, 224], pose: 9 },
  { color: '#43dbea', promise: 'Give ideas form.', cue: 'Let’s build something useful.', x: 64, y: 38, size: 166, crop: [1303, 400, 205, 205], pose: -5 },
  { color: '#74e9bd', promise: 'Give ideas intelligence.', cue: 'A little curiosity goes a long way.', x: 83, y: 66, size: 110, crop: [777, 164, 117, 117], pose: 15 },
  { color: '#ffd84d', promise: 'Give ideas direction.', cue: 'Follow the signals.', x: 43, y: 78, size: 102, crop: [1256, 733, 127, 127], pose: -18 },
];

export function discussService(discipline: Discipline, service: Service) {
  window.dispatchEvent(new CustomEvent('astrivo:mission', { detail: { discipline: discipline.name, service: service.name } }));
}
