// Site-wide settings. Change the booking and newsletter targets here.
export const SITE = {
  name: 'Apostrophe Software',
  domain: 'apostrophesoftware.com',
  url: 'https://apostrophesoftware.com',
  // Placeholder until a booking page (Calendly, Cal.com, etc.) is chosen.
  bookingUrl: 'mailto:hello@apostrophesoftware.com?subject=Book%20a%20demo',
  contactUrl: 'mailto:hello@apostrophesoftware.com',
  // Placeholder until a newsletter provider is chosen.
  newsletterUrl: 'mailto:hello@apostrophesoftware.com?subject=Subscribe%20to%20the%20weekly%20note',
};

export const NAV = [
  { label: 'Services', href: '/#services', key: 'services' },
  { label: 'About', href: '/about', key: 'about' },
  { label: 'Events', href: '/events', key: 'events' },
  { label: 'Blog', href: '/blog', key: 'blog' },
] as const;

// Launch state: these sections show "Coming Soon" until switched on.
export const FEATURES = {
  eventsList: false,
  teamGrid: false,
  blogPosts: false,
};
