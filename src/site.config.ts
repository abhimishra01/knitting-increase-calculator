// ONE config file. Change values here; every page reads from it.
// Keep this file plain (no type-only syntax): scripts/deploy.mjs imports it directly.
// SITE_MODE=bingemind builds the public copy at bingemind.com/<slug>/.
const bingemind = process.env.SITE_MODE === 'bingemind';
export default {
  name: 'Knitting Increase Calculator',                 // shown in header, title, footer
  domain: 'bingemind.com/knitting-increase-calculator',   // canonical host + path, no https://. Sites live at bingemind.com/<slug>/            // no https://, no www. Used for canonical, sitemap, robots
  cloudflareProject: 'knitting-increase-calculator',    // Cloudflare Pages project name (used by npm run deploy)
  keyword: 'knitting increase calculator',            // main keyword: goes in the H1 and title
  keywords: ['knitting increase evenly calculator', 'crochet increase calculator', 'increase evenly across a row', 'decrease evenly calculator', 'evenly spaced increases', 'knitting decrease calculator', 'M1 and K2tog spacing'], // supporting keywords
  titleOverride: 'Knitting Increase Calculator: Increase Evenly Across a Row', // home page <title>, under 60 characters
  tagline: 'Free, private, no sign-up',  // short line used in the title after the keyword
  description:
    'Increase or decrease evenly across a row in knitting or crochet. Enter stitches and how many to add or remove. Get the exact pattern, flat or in the round.',
  email: 'hello@knittingincreasecalculator.com',
  // Bingemind build (SITE_MODE=bingemind): owner is Bingemind, contact goes to the Bingemind contact section (no invented email).
  bingemind,
  contactHref: bingemind ? 'https://bingemind.com/#contact' : 'mailto:' + 'hello@knittingincreasecalculator.com',
  contactLabel: bingemind ? 'bingemind.com/#contact' : 'hello@knittingincreasecalculator.com',
  contactLead: bingemind ? 'Contact:' : 'Email:',       // contact email (shown on Contact and Privacy pages)
  ga4: '',                            // GA4 measurement ID, e.g. 'G-XXXXXXXXXX'. Empty = Google Analytics off
  adsense: '',                        // AdSense publisher ID, e.g. 'ca-pub-1234567890123456'. Empty = ads off
  brand: '#7e22ce',                   // brand color (hex)
  skin: 'clay',                       // look: minimal, swiss, clay or retro
  locale: 'en-US',                    // BCP 47 language tag
  ogImage: '/og.png',                        // e.g. '/og.png' (1200x630 file in public/). Empty = no image
  category: 'LifestyleApplication',   // schema.org applicationCategory
  owner: bingemind ? 'Bingemind (Abhishek Mishra)' : 'Knitting Increase Calculator',                // name used in legal pages (person or business)
};
