// Work shown on /work and the home page: client builds, workshops we've run,
// and photos from live sessions. Images live in /public/images/work.
//
// This content started on daarongonzalez.com and is worded here as company
// work. Edit it in this file; the personal site keeps its own copy in Sanity.

export interface Project {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  image: string;
  imageAlt: string;
  /** Show on the home page. */
  featured: boolean;
  /** With a case study, the project gets its own page at /work/[slug]. */
  caseStudy?: {
    intro: string;
    heroImage: string;
    heroAlt: string;
    problem: string;
    solution: string;
    gallery: { src: string; caption: string }[];
    results: { value: string; label: string }[];
  };
}

export interface Workshop {
  title: string;
  /** Small line above the title: format, host or place in a series. */
  eyebrow: string;
  description?: string;
  image: string;
  /** Width ÷ height of the image, so the frame never crops it. */
  ratio: number;
  /** Recording, sign-up or recap page. Without one, the card isn't a link. */
  url?: string;
  featured: boolean;
}

export interface SessionPhoto {
  caption: string;
  alt: string;
  image: string;
  orientation: 'portrait' | 'landscape';
  featured: boolean;
}

export const projects: Project[] = [
  {
    slug: 'rapidschema',
    title: 'RapidSchema',
    summary: "Custom search tooling that keeps a large online store's product data accurate across thousands of pages.",
    tags: ['Design', 'Development'],
    image: '/images/work/project-rapidschema-thumb.webp',
    imageAlt: 'RapidSchema dashboard',
    featured: true,
    caseStudy: {
      intro: 'A custom tool we designed and built for a large e-commerce platform. It manages the structured data search engines read on every product page, so the SEO team no longer does it by hand.',
      heroImage: '/images/work/project-rapidschema-hero.webp',
      heroAlt: 'RapidSchema home screen',
      problem: 'Product data for search engines was managed by hand across a huge catalog. It was slow, easy to get wrong, and could not keep up as new products were added.',
      solution: 'One dashboard that writes, checks and publishes that data on its own. The SEO team reviews the results instead of typing them.',
      gallery: [
        { src: '/images/work/project-rapidschema-schema-editor.webp', caption: 'The editor, where the team reviews and adjusts product data' },
      ],
      results: [
        { value: '92%', label: 'Faster turnaround' },
        { value: '10k+', label: 'Product pages covered' },
        { value: '0', label: 'Manual errors since launch' },
      ],
    },
  },
  {
    slug: 'socialscouter',
    title: 'SocialScouter',
    summary: 'An analytics platform for short-form video, with scheduled reports and connections to the tools teams already use.',
    tags: ['Design', 'Development'],
    image: '/images/work/project-socialscouter-thumb.webp',
    imageAlt: 'SocialScouter analytics dashboard',
    featured: true,
  },
  {
    slug: 'arvori',
    title: 'Arvori',
    summary: 'An AI-assisted platform that helps agencies manage clients, accounts and sales in one place.',
    tags: ['Content system', 'Membership'],
    image: '/images/work/project-arvori-thumb.webp',
    imageAlt: 'Arvori client management screen',
    featured: true,
  },
];

const SESSION_RATIO = 1024 / 366;
const SERIES_RATIO = 2000 / 866;

export const workshops: Workshop[] = [
  {
    title: 'Building and Deploying your First Product with Claude Code',
    eyebrow: 'Live workshop · Stack community',
    image: '/images/work/workshop-first-product-claude-code.webp',
    ratio: SESSION_RATIO,
    featured: true,
  },
  {
    title: 'Introduction to Claude Skills',
    eyebrow: 'Live workshop · Stack community',
    image: '/images/work/workshop-claude-skills.webp',
    ratio: SESSION_RATIO,
    featured: true,
  },
  {
    title: 'Intermediate Development with Claude Code',
    eyebrow: 'Live workshop · Stack community',
    image: '/images/work/workshop-intermediate-claude-code.webp',
    ratio: SESSION_RATIO,
    featured: false,
  },
  {
    title: 'Getting Started with Claude Cowork',
    eyebrow: 'Live workshop · Stack community',
    image: '/images/work/workshop-claude-cowork.webp',
    ratio: SESSION_RATIO,
    featured: false,
  },
];

/** Four-part build series, January 2025. Shown as its own group on /work. */
export const series = {
  title: 'The Build Series',
  blurb: 'Four live sessions that take a team from a rough idea to a launched product.',
  parts: [
    {
      title: 'Visualizing and Writing',
      eyebrow: 'Part 1 · Jan 10, 2025',
      description: 'Practice explaining your idea clearly, then map out what you will build.',
      image: '/images/work/workshop-skill-1-visualizing-and-writing.webp',
      ratio: SERIES_RATIO,
      featured: false,
    },
    {
      title: 'Brand and Design',
      eyebrow: 'Part 2 · Jan 17, 2025',
      description: 'Use Figma to practice hierarchy, color, layout, and build a simple design system.',
      image: '/images/work/workshop-skill-2-brand-and-design.webp',
      ratio: SERIES_RATIO,
      featured: false,
    },
    {
      title: 'Data and Development',
      eyebrow: 'Part 3 · Jan 24, 2025',
      description: 'Turn designs into code, pick a proven setup, save your work safely, and plan a database.',
      image: '/images/work/workshop-skill-3-data-and-development.webp',
      ratio: SERIES_RATIO,
      featured: false,
    },
    {
      title: 'Secure and Deploy',
      eyebrow: 'Part 4 · Jan 31, 2025',
      description: 'Understand hosting costs, run a security checklist, and put your product online.',
      image: '/images/work/workshop-skill-4-secure-and-deploy.webp',
      ratio: SERIES_RATIO,
      featured: false,
    },
  ] satisfies Workshop[],
};

export const sessionPhotos: SessionPhoto[] = [
  {
    caption: 'Live session at Silicon Slopes, Utah',
    alt: 'An Apostrophe instructor presenting from a laptop on the Silicon Slopes stage',
    image: '/images/work/photo-silicon-slopes-stage.webp',
    orientation: 'portrait',
    featured: true,
  },
  {
    caption: '“Making Your Content Go Further with AI” · Pluralsight Author Summit',
    alt: 'An Apostrophe instructor giving a talk on AI to a full room at the Pluralsight Author Summit',
    image: '/images/work/photo-pluralsight-author-summit.webp',
    orientation: 'landscape',
    featured: true,
  },
  {
    caption: 'Walking a room through a live demo at Silicon Slopes',
    alt: 'An Apostrophe instructor teaching from the desk on the Silicon Slopes stage',
    image: '/images/work/photo-silicon-slopes-desk.webp',
    orientation: 'portrait',
    featured: false,
  },
];
