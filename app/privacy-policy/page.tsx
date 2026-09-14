import type { Metadata } from 'next';
import Link from 'next/link';
import { Entity, Fill, LegalPage, Section } from '@/components/legal-page';
import { legalConfig, siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  ...(siteConfig.canonicalOrigin ? { alternates: { canonical: '/privacy-policy' } } : {}),
  title: 'Privacy Policy — ASTRIVO',
  description: 'How ASTRIVO collects, uses, shares, and protects your personal information.',
  robots: { index: false },
};

const email = siteConfig.contactEmail.includes('@') ? siteConfig.contactEmail : null;

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="This policy explains what information ASTRIVO collects when you visit this website or send us a project brief, how that information is used, and the choices you have."
    >
      <p>
        <Entity /> (“ASTRIVO”, “we”, “our”, or “us”) is a creative technology agency working across brand, digital,
        technology, AI, and analytics. This policy covers our own website and the enquiries we receive through it. By
        using this website you agree to it.
      </p>

      <Section index={1} title="Scope and Our Role">
        <p>
          This policy applies to ASTRIVO’s own website and business activities — website visitors, prospective and
          current clients, and anyone who contacts us.
        </p>
        <p>
          When we deliver work for a client, any personal data inside that client’s own systems remains under the
          client’s control and is governed by their privacy policy and our written agreement with them. We process that
          data only to provide the agreed services.
        </p>
      </Section>

      <Section index={2} title="Information We Collect">
        <p>We collect only what you choose to send us:</p>
        <ul>
          <li>
            <strong>Enquiry details.</strong> The name, email address, company name, project description, and
            discipline interests you enter in the contact form.
          </li>
          <li>
            <strong>Direct correspondence.</strong> Anything you include if you email us or reply to us.
          </li>
          <li>
            <strong>Server logs.</strong> Our hosting provider, <Fill>{legalConfig.hostingProvider || 'hosting provider'}</Fill>,
            records standard request data such as IP address, user agent, and timestamps. We do not combine these logs
            with enquiry details.
          </li>
        </ul>
        <p>
          We do not run advertising trackers, behavioural analytics, or third-party embeds on this website, and we do
          not buy contact data.
        </p>
      </Section>

      <Section index={3} title="Cookies and Local Storage">
        <p>
          <strong>This website sets no cookies.</strong> It uses one item of browser session storage: when you choose a
          service in the orbit and continue to the contact page, the discipline and service names are stored briefly so
          the form can prefill, then deleted as soon as the form reads them. That data never leaves your browser.
        </p>
        <p>Fonts are served from this site’s own domain, so loading a page makes no request to a third-party font host.</p>
      </Section>

      <Section index={4} title="How We Use Your Information">
        <p>We use enquiry details to:</p>
        <ul>
          <li>reply to you and discuss the project you described;</li>
          <li>prepare proposals, scopes, and agreements;</li>
          <li>deliver and support work you engage us for; and</li>
          <li>meet legal, accounting, and record-keeping obligations.</li>
        </ul>
        <p>We do not sell your information, and we do not use it for automated decision-making or profiling.</p>
      </Section>

      <Section index={5} title="How We Share Information">
        <p>We share personal information only with:</p>
        <ul>
          <li>
            <strong>Service providers</strong> who help us operate — hosting, email, and the endpoint that receives form
            submissions — acting on our instructions under contract.
          </li>
          <li>
            <strong>Professional advisers</strong> such as accountants or lawyers, where necessary.
          </li>
          <li>
            <strong>Authorities</strong>, where we are legally required to do so.
          </li>
        </ul>
        <p>We do not share your information with advertisers or data brokers.</p>
      </Section>

      <Section index={6} title="Data Retention">
        <p>
          We keep enquiry details for <Fill>{legalConfig.retentionPeriod || 'retention period'}</Fill> from our last
          contact with you, unless you ask us to delete them sooner or we are required to keep them longer. Records
          relating to paid engagements are kept for the period required by law.
        </p>
      </Section>

      <Section index={7} title="Your Rights">
        <p>
          Depending on where you live, you may have the right to request access to the personal information we hold
          about you, ask us to correct or delete it, object to or restrict how we use it, or request a copy in a
          portable format. Exercising these rights is free and will not affect how we treat you.
        </p>
        <p>To make a request, contact us using the details in section 11.</p>
      </Section>

      <Section index={8} title="Data Security">
        <p>
          The site is served over HTTPS and form submissions are transmitted encrypted. We limit access to enquiry
          details to the people who need them. No method of transmission or storage is completely secure, so we cannot
          guarantee absolute security.
        </p>
      </Section>

      <Section index={9} title="Children’s Privacy">
        <p>
          This website is intended for businesses. We do not knowingly collect personal information from children. If
          you believe a child has provided us with information, contact us and we will delete it.
        </p>
      </Section>

      <Section index={10} title="Changes to This Policy">
        <p>
          We may update this policy as our practices or the law change. The effective date at the top of this page shows
          when it was last revised, and material changes will be signalled on this page.
        </p>
      </Section>

      <Section index={11} title="Contact Us">
        <p>
          Questions about this policy, or about the information we hold, can be sent to{' '}
          {email ? (
            <a className="text-plasma-soft hover:underline" href={`mailto:${email}`}>
              {email}
            </a>
          ) : (
            <Fill>contact email</Fill>
          )}{' '}
          or through the <Link className="text-plasma-soft hover:underline" href="/contact">contact form</Link>.
        </p>
      </Section>
    </LegalPage>
  );
}
