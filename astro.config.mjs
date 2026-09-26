import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://apostrophesoftware.com',
  // Lets pages style the components they pass a class to (e.g. PageIntro).
  scopedStyleStrategy: 'class',
});
