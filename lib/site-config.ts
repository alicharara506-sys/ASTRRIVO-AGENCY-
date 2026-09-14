/** Replace these values only with verified business details. No secrets belong here. */
export const siteConfig = {
  name: 'ASTRIVO',
  contactEmail: 'CONTACT_EMAIL_NOT_CONFIGURED',
  // A verified HTTPS endpoint accepting JSON. It must return { delivered: true }
  // only after delivery, or { accepted: true } when durably queued.
  contactEndpoint: '',
  canonicalOrigin: '',
  socialProfiles: [] as { name: string; url: string }[],
};

export const hasContactEndpoint = siteConfig.contactEndpoint.startsWith('https://');

/**
 * Facts the legal pages need that only ASTRIVO can supply. Until every field is
 * filled, both documents render a notice saying they are not yet in force —
 * placeholder legal text must never read as a binding policy.
 */
export const legalConfig = {
  /** Registered legal entity, e.g. 'ASTRIVO Ltd'. */
  entityName: '',
  /** Governing law, e.g. 'England and Wales'. */
  jurisdiction: '',
  /** ISO date the documents take effect, e.g. '2026-09-14'. */
  effectiveDate: '',
  /** How long enquiry details are kept, e.g. '24 months'. */
  retentionPeriod: '',
  /** Who serves the site, e.g. 'Vercel Inc.'. */
  hostingProvider: '',
};

export const legalIsComplete = Object.values(legalConfig).every((value) => value.trim().length > 0);
