import { Scan, Compass, PenTool, Code2, Rocket, Activity, MoveUpRight } from 'lucide-react';
const stages = [
  { title: 'Scan', copy: 'Understand the business and the problem.', icon: Scan },
  { title: 'Plot', copy: 'Define the direction.', icon: Compass },
  { title: 'Design', copy: 'Shape the idea and experience.', icon: PenTool },
  { title: 'Build', copy: 'Create the working system.', icon: Code2 },
  { title: 'Launch', copy: 'Put it into use.', icon: Rocket },
  { title: 'Measure', copy: 'Read the signals.', icon: Activity },
  { title: 'Grow', copy: 'Improve the next move.', icon: MoveUpRight },
];
export function FlightPlan() {
  return <section id="process" className="process-section section" aria-labelledby="process-title"><div className="container"><div className="section-heading"><div><p className="eyebrow section-label">04 / THE FLIGHT PLAN</p><h2 id="process-title">Every mission needs<br />a flight plan.</h2></div><p>A clear direction. Room to explore.<br />And a reason behind every next move.</p></div><ol className="flight-path">{stages.map((stage, index) => <li key={stage.title}><div className="flight-checkpoint"><stage.icon size={22} strokeWidth={1.4} /><span>0{index + 1}</span></div><h3>{stage.title}</h3><p>{stage.copy}</p></li>)}</ol><div className="process-note"><span>✦</span><p>Launch is a milestone.<br /><strong>Progress keeps going.</strong></p><span className="process-direction">DIRECTION → MOMENTUM → ORBIT → GROWTH</span></div></div></section>;
}
