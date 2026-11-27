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
  /** Call it out with the Rare Frame card. */
  spotlight?: boolean;
  /** With a case study, the project gets its own page at /work/[slug]. */
  caseStudy?: {
    intro: string;
    heroImage: string;
    heroAlt: string;
    problem: string;
    solution: string;
    gallery: { src: string; caption: string }[];
    results: { value: string; label: string }[];
    /** Context line above the title, e.g. host · place · date. Replaces "Case study · tags". */
    eyebrow?: string;
    /** Short line under the title. */
    subtitle?: string;
    /**
     * Extra story sections, shown after the results. Each body item is a
     * paragraph (string), a short bullet list (string[]), or a source note
     * that links out ({ text, href }).
     */
    sections?: { label: string; body: (string | string[] | { text: string; href: string })[] }[];
    /** Heading over the gallery. Defaults to "Screens". */
    galleryTitle?: string;
    /** Photos from the room, shown as a strip before the gallery. */
    photos?: { src: string; alt: string; caption?: string; orientation: 'portrait' | 'landscape' }[];
    /** Small print under the results. */
    resultsNote?: string;
    /** Replaces the default closing call to action. */
    cta?: { heading: string; body: string };
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
  /** Call it out with the Rare Frame card. */
  spotlight?: boolean;
}

export interface SessionPhoto {
  caption: string;
  alt: string;
  image: string;
  orientation: 'portrait' | 'landscape';
  featured: boolean;
  /** Call it out with the Rare Frame card. */
  spotlight?: boolean;
}

export const projects: Project[] = [
  {
    slug: 'decisions-api',
    title: 'Getting Started with the Decisions API',
    summary: 'A Codex Community talk at Leland HQ in Lehi on the OpenAI Decisions API, and the portfolio grader we built with it.',
    tags: ['Workshop', 'Codex', 'Decisions API'],
    image: '/images/work/project-decisions-api-thumb.webp',
    imageAlt: 'Title card reading "Getting Started with the Decisions API"',
    featured: true,
    spotlight: true,
    caseStudy: {
      eyebrow: 'Codex Community · Leland HQ, Lehi, UT · November 2026',
      subtitle: 'Using decision models for better token usage and output',
      intro: "D'Aaron Gonzalez, founder of Apostrophe Software, hosted a Codex Community event at Leland HQ in Lehi on the OpenAI Decisions API. He led it as AI Instructor for Leland's AI Builder Program, and walked the room through a working tool we built with Codex to grade learner portfolios.",
      heroImage: '/images/work/project-decisions-api-hero.webp',
      heroAlt: 'Title card reading "Getting Started with the Decisions API" for the Codex Community event',
      problem: 'Many teams pay for large, general-purpose AI models to make the same small decisions again and again: is this listing allowed, where does this ticket go, does this work meet the bar. Those calls should be predictable, repeatable and cheap. Too often they are slow, and priced like open-ended writing.',
      solution: "Builders Review, a portfolio grader we built with Codex for Leland's AI Builder Program. It checks every learner portfolio against the same four requirements in about a second, and hands anything uncertain to a person.",
      results: [
        { value: '0.9s', label: 'To grade one portfolio' },
        { value: '10.5s', label: 'For a full run, capture included' },
        { value: '~1 hr', label: 'Of manual review per cohort, 2–3 times a week, now automated' },
        { value: '100', label: 'Portfolios per batch' },
      ],
      resultsNote: 'Timings from one real run: 9.6 seconds to capture the portfolio, 0.9 seconds for the Decisions API to grade it.',
      sections: [
        {
          label: 'A simpler way to decide',
          body: [
            'The Decisions API turns a judgment into a short list of questions. Write one question per criterion, send the evidence (page text, screenshots or both), and get a typed answer back: yes or no, a category, or a score. Each answer comes with a probability, so you know how sure it is.',
            [
              '$0.10 per million input tokens. A token is a small piece of text, about three-quarters of a word.',
              'No charge for output tokens. The answers themselves are free.',
              'No training run. You write questions, not datasets.',
              'No servers to run or maintain.',
            ],
          ],
        },
        {
          label: 'How the big teams did it',
          body: [
            'Airbnb built a custom classifier to screen listings against its pricing and payment transparency policy. It runs thousands of times a minute, and each answer has to come back within 200 milliseconds. They built it the traditional way:',
            [
              'Labeled hundreds of thousands of examples',
              'Fine-tuned a small model on them',
              'Tested it on 10,000 held-out examples it had never seen',
              'Served it on their own GPUs',
              'Tuned it to answer in under 200 milliseconds',
            ],
            'It paid off. Quality rose from 0.563 to 0.902 F1, a standard accuracy score where 1.0 is perfect. The typical answer came back in about 35 milliseconds, against about 900 for the top general-purpose models, often called frontier models. That wait between asking and getting an answer is called latency. At high volume, thousands of requests a minute, it cost about 1% as much to run.',
            'There is a catch. Airbnb also found that at low volume, under roughly 15 to 30 requests a minute, a frontier model with a good prompt is cheaper. Fine-tuning only pays off with high volume, tight speed limits and lots of labeled data.',
            'Their benchmark found something else worth knowing. Decision models, which return a probability instead of writing out an answer, were the most accurate ready-made option they tested that answered in under 100 milliseconds. You can also tune them with a threshold: how sure the model must be before it says yes. (The decision model in their test came from a different provider, not OpenAI.)',
            'Most businesses make their repeated decisions at lower volume, like Leland’s weekly grading. That is exactly where a few well-written questions beat a months-long training project. With the Decisions API, a few prompts and a few rounds of testing captured most of the value.',
            {
              text: 'Source: “Frontier quality at 1% of the cost: a production benchmark of LLM classifiers,” Clay Gibson and Adel Elmalaha, Airbnb Engineering & Data Science. Airbnb’s numbers for one task, not a Decisions API benchmark.',
              href: 'https://airbnb.tech/ai-ml/frontier-quality-at-1-of-the-cost-a-production-benchmark-of-llm-classifiers/',
            },
          ],
        },
        {
          label: 'How Builders Review works',
          body: [
            'Leland’s instructors reviewed every learner portfolio by hand against the same four checks. All four are required. A strong result on one can’t make up for a missing one.',
            [
              'Hosted: a real website anyone can reach',
              'Branding: visible effort and character',
              'Required builds: evidence for every build',
              'How I use AI: concrete examples, not just enthusiasm',
            ],
            'Builders Review does that first pass for them. A browser captures each portfolio as screenshots and page text, and one Decisions API call answers 12 rubric questions. Each portfolio lands in one of three groups:',
            [
              'Pass: every check is clearly met',
              'Team review: anything uncertain goes to a person',
              'Redo required: at least one check is clearly missing',
            ],
            'It handles batches of up to 100 portfolios, exports results to CSV, and runs on its own every Friday as a scheduled Codex task.',
          ],
        },
        {
          label: 'Who was in the room',
          body: [
            'Builders early in their journey: people starting to ship software and new to thinking about speed, token use and cost. For most of them, this was a first step into decision models.',
          ],
        },
        {
          label: 'Your first step',
          body: [
            'The takeaway works for any business, not just a classroom:',
            [
              'Pick a judgment your team makes every week.',
              'Write one question per criterion.',
              'Check it against 20 cases you’ve already graded.',
              'When it gets one wrong, fix the questions, not the model.',
            ],
          ],
        },
      ],
      photos: [
        {
          src: '/images/work/photo-leland-codex-group.webp',
          alt: 'Attendees of the Codex Community event gathered for a group photo at Leland HQ',
          caption: 'The Codex Community crowd at Leland HQ',
          orientation: 'portrait',
        },
        {
          src: '/images/work/photo-leland-codex-opening.webp',
          alt: "D'Aaron Gonzalez presenting the opening slide to a seated audience",
          caption: 'Opening the talk: classifiers without the training pipeline',
          orientation: 'landscape',
        },
        {
          src: '/images/work/photo-leland-codex-evidence.webp',
          alt: "D'Aaron Gonzalez pointing to a slide about a single Decisions API call",
          caption: 'One evidence bundle, twelve answers',
          orientation: 'portrait',
        },
        {
          src: '/images/work/photo-leland-codex-airbnb.webp',
          alt: "D'Aaron Gonzalez explaining how Airbnb built its policy classifier",
          caption: 'How Airbnb built one policy classifier',
          orientation: 'landscape',
        },
        {
          src: '/images/work/photo-leland-codex-answers.webp',
          alt: "D'Aaron Gonzalez presenting the three kinds of answer the Decisions API returns",
          caption: 'Three shapes of answer',
          orientation: 'landscape',
        },
      ],
      galleryTitle: 'From the talk',
      gallery: [
        { src: '/images/work/project-decisions-api-slide-1.webp', caption: 'Classifiers without the training pipeline' },
        { src: '/images/work/project-decisions-api-slide-3.webp', caption: 'The job: evidence in, a defined answer out' },
        { src: '/images/work/project-decisions-api-slide-4.webp', caption: 'How Airbnb built one policy classifier, start to finish' },
        { src: '/images/work/project-decisions-api-slide-5.webp', caption: 'The same job with the Decisions API: write questions instead' },
        { src: '/images/work/project-decisions-api-slide-6.webp', caption: 'Three shapes of answer: yes or no, a category, or a score' },
        { src: '/images/work/project-decisions-api-slide-7.webp', caption: 'One bundle of evidence, twelve answers in a single call' },
        { src: '/images/work/project-decisions-api-slide-9.webp', caption: 'The four checks every portfolio must pass' },
        { src: '/images/work/project-decisions-api-slide-10.webp', caption: 'The browser captures the portfolio, the Decisions API judges it' },
        { src: '/images/work/project-decisions-api-slide-13.webp', caption: 'Anything uncertain goes to a person' },
      ],
      cta: {
        heading: 'Have a decision your team makes every week?',
        body: 'Thirty minutes. Tell us the call your team keeps making by hand, and we’ll show you whether a decision model can make it faster and cheaper.',
      },
    },
  },
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
    spotlight: true,
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
    caption: 'Codex Community at Leland HQ, Lehi, Utah',
    alt: 'Attendees of the Codex Community event on the Decisions API gathered for a group photo at Leland HQ',
    image: '/images/work/photo-leland-codex-group.webp',
    orientation: 'portrait',
    featured: true,
  },
  {
    caption: '“Getting Started with the Decisions API” · Codex Community, Leland HQ',
    alt: "D'Aaron Gonzalez, founder of Apostrophe Software, presenting the opening slide to a seated audience at Leland HQ",
    image: '/images/work/photo-leland-codex-opening.webp',
    orientation: 'landscape',
    featured: true,
  },
  {
    caption: 'One evidence bundle, twelve answers · Leland HQ',
    alt: "D'Aaron Gonzalez pointing to a slide about a single Decisions API call while the audience follows along",
    image: '/images/work/photo-leland-codex-evidence.webp',
    orientation: 'portrait',
    featured: false,
  },
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
    spotlight: true,
  },
  {
    caption: 'Walking a room through a live demo at Silicon Slopes',
    alt: 'An Apostrophe instructor teaching from the desk on the Silicon Slopes stage',
    image: '/images/work/photo-silicon-slopes-desk.webp',
    orientation: 'portrait',
    featured: false,
  },
];
