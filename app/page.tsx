import { Hero } from '@/components/hero';
import { About } from '@/components/about';
import { AtmosphericDivider } from '@/components/cosmic/atmospheric-divider';
import { ServicesOrbit } from '@/components/services-orbit';
import { ImpactStats } from '@/components/impact-stats';
import { Showcase } from '@/components/showcase';
import { FlightPlan } from '@/components/flight-plan';
import { PortalCta } from '@/components/portal-cta';

export default function Home() {
  return (
    <main id="main">
      <Hero />
      <About />
      <AtmosphericDivider color="violet" />
      <ServicesOrbit />
      <AtmosphericDivider color="cyan" delay={1.4} />
      <ImpactStats />
      <AtmosphericDivider color="silver" delay={2.8} />
      <Showcase />
      <AtmosphericDivider color="violet" delay={0.7} />
      <FlightPlan />
      <AtmosphericDivider color="cyan" delay={2.1} />
      <PortalCta />
    </main>
  );
}
