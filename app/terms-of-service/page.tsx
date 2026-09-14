import type { Metadata } from 'next';
import Link from 'next/link';
import { Entity, Fill, LegalPage, Section } from '@/components/legal-page';
import { legalConfig, siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  ...(siteConfig.canonicalOrigin ? { alternates: { canonical: '/terms-of-service' } } : {}),
  title: 'Terms of Service — ASTRIVO',
  description: 'The terms that govern use of the ASTRIVO website and any engagement with us.',
  robots: { index: false },
};

const email = siteConfig.contactEmail.includes('@') ? siteConfig.contactEmail : null;

export default function TermsOfServicePage() {
  return (
    <LegalPage
      title="Terms of Service"
      intro="These terms govern your use of this website. Paid work is governed by a separate written agreement, which takes precedence over anything here."
    >
      <p>
        This website is operated by <Entity /> (“ASTRIVO”, “we”, “our”, or “us”). By accessing or using it you agree to
        these terms. If you do not agree, please do not use the site.
      </p>

      <Section index={1} title="Use of the Website">
        <p>
          You may browse this site and submit an enquiry for legitimate business purposes. You agree not to misuse it —
          including attempting to gain unauthorised access, disrupting its operation, scraping it at a scale that
          degrades service, or using it to send unlawful or abusive content.
        </p>
      </Section>

      <Section index={2} title="Enquiries Are Not a Contract">
        <p>
          Submitting the contact form starts a conversation; it does not create a client relationship, reserve capacity,
          or oblige either of us to proceed. Nothing on this site is an offer capable of acceptance.
        </p>
      </Section>

      <Section index={3} title="Client Engagements">
        <p>
          Paid work is governed by a separate written agreement covering scope, deliverables, timelines, fees, and
          ownership. Where that agreement conflicts with these terms, the agreement prevails for that engagement.
        </p>
      </Section>

      <Section index={4} title="Intellectual Property">
        <p>
          The content of this website — including copy, design, graphics, and code — belongs to ASTRIVO or its licensors
          and is protected by intellectual property law. You may not copy, republish, or create derivative works from it
          without our written permission, beyond what the law permits.
        </p>
        <p>Ownership of work produced for a client is determined by that client’s written agreement, not by these terms.</p>
      </Section>

      <Section index={5} title="Case Studies and Examples">
        <p>
          Any work shown on this site is published with the relevant client’s permission. Sections that are marked as
          placeholders are exactly that — they describe the structure of a future case study and make no claim about
          results achieved.
        </p>
      </Section>

      <Section index={6} title="AI-Assisted Work">
        <p>
          Some of our services involve AI systems. Where AI forms part of an engagement, the agreement for that
          engagement sets out how it is used, what data it may process, and what review applies. AI output can be
          inaccurate and is always subject to human review before delivery.
        </p>
      </Section>

      <Section index={7} title="No Professional Advice">
        <p>
          Content on this site is general information about our services. It is not legal, financial, or other
          professional advice, and you should not act on it without advice appropriate to your circumstances.
        </p>
      </Section>

      <Section index={8} title="Third-Party Links">
        <p>
          This site may link to services we do not control. We are not responsible for their content or practices, and a
          link is not an endorsement. Their own terms and privacy policies apply.
        </p>
      </Section>

      <Section index={9} title="Availability and Disclaimers">
        <p>
          This website is provided “as is” and “as available”. We do not warrant that it will be uninterrupted,
          error-free, or free of harmful components, and we may change or withdraw any part of it at any time. To the
          fullest extent permitted by law, we disclaim all implied warranties.
        </p>
      </Section>

      <Section index={10} title="Limitation of Liability">
        <p>
          To the fullest extent permitted by law, ASTRIVO is not liable for indirect, incidental, special, or
          consequential losses, or for lost profits, revenue, or data, arising from your use of this website. Nothing in
          these terms excludes liability that cannot lawfully be excluded.
        </p>
      </Section>

      <Section index={11} title="Privacy">
        <p>
          Our handling of personal information is described in the{' '}
          <Link className="text-plasma-soft hover:underline" href="/privacy-policy">
            Privacy Policy
          </Link>
          , which forms part of these terms.
        </p>
      </Section>

      <Section index={12} title="Governing Law">
        <p>
          These terms are governed by the laws of{' '}
          <Fill>{legalConfig.jurisdiction || 'governing jurisdiction'}</Fill>, and the courts of that jurisdiction have
          exclusive jurisdiction over any dispute, without regard to conflict-of-law rules.
        </p>
      </Section>

      <Section index={13} title="Changes to These Terms">
        <p>
          We may revise these terms from time to time. The effective date at the top of this page shows when they were
          last changed, and continuing to use the site after a change means you accept the revised terms.
        </p>
      </Section>

      <Section index={14} title="Contact Us">
        <p>
          Questions about these terms can be sent to{' '}
          {email ? (
            <a className="text-plasma-soft hover:underline" href={`mailto:${email}`}>
              {email}
            </a>
          ) : (
            <Fill>contact email</Fill>
          )}{' '}
          or through the{' '}
          <Link className="text-plasma-soft hover:underline" href="/contact">
            contact form
          </Link>
          .
        </p>
      </Section>
    </LegalPage>
  );
}
