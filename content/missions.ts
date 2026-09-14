/**
 * Placeholder case studies. `metric.value` stays '—' until a client has
 * approved a real, verifiable figure — the label describes what will be
 * measured, never a number we have not earned.
 */
export const missions = [
  {
    id: '01',
    type: 'BRAND + DIGITAL',
    title: 'From a first idea\nto a distinct identity.',
    tags: ['Strategy', 'Identity', 'Digital'],
    color: 'coral',
    note: 'A space for a brand transformation.',
    icon: 'brand',
    summary:
      'This slot is reserved for a brand and digital transformation story. It will document the starting position, the identity system we built, and what measurably changed for the client.',
    metric: { value: '—', label: 'Identity system adoption' },
  },
  {
    id: '02',
    type: 'TECHNOLOGY + AI',
    title: 'From disconnected tools\nto a smarter system.',
    tags: ['UI/UX', 'Web Apps', 'Automation'],
    color: 'cyan',
    note: 'A space for a digital product story.',
    icon: 'technology',
    summary:
      'This slot is reserved for a connected product and automation story. It will document the tools that were replaced, the system we built around them, and the outcome we recorded.',
    metric: { value: '—', label: 'Manual steps removed' },
  },
  {
    id: '03',
    type: 'ANALYTICS + GROWTH',
    title: 'From scattered signals\nto a clear next move.',
    tags: ['Dashboards', 'Insights', 'Growth'],
    color: 'mint',
    note: 'A space for a data-led decision.',
    icon: 'analytics',
    summary:
      'This slot is reserved for a data and growth story. It will document the signals that were missing, the reporting we put in place, and the decisions it unlocked.',
    metric: { value: '—', label: 'Time to a confident decision' },
  },
];

export const reportFields = [
  ['Mission brief', 'Add the verified client objective and agreed scope.'],
  ['Starting challenge', 'Describe the original business problem using client-approved context.'],
  ['Direction', 'Explain the strategic decision and why it was chosen.'],
  ['What was created', 'Add the actual deliverables, with approved visuals or links.'],
  ['Result', 'Add documented outcomes only. No project results are available yet.'],
  ['Next opportunity', 'Describe an evidence-backed next step agreed with the client.'],
];
