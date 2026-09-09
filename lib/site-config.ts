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
