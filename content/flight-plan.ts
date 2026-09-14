import { Activity, Code2, Compass, MoveUpRight, PenTool, Rocket, Scan, type LucideIcon } from 'lucide-react';

/** The seven mission stages, shared by the Process section and the orbit. */
export const stages: { slug: string; title: string; copy: string; icon: LucideIcon }[] = [
  { slug: 'scan', title: 'Scan', copy: 'Understand the business and the problem.', icon: Scan },
  { slug: 'plot', title: 'Plot', copy: 'Define the direction.', icon: Compass },
  { slug: 'design', title: 'Design', copy: 'Shape the idea and experience.', icon: PenTool },
  { slug: 'build', title: 'Build', copy: 'Create the working system.', icon: Code2 },
  { slug: 'launch', title: 'Launch', copy: 'Put it into use.', icon: Rocket },
  { slug: 'measure', title: 'Measure', copy: 'Read the signals.', icon: Activity },
  { slug: 'grow', title: 'Grow', copy: 'Improve the next move.', icon: MoveUpRight },
];
