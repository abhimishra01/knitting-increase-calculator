// ONE config file. Change values here; every page reads from it.
// Keep this file plain (no type-only syntax): scripts/deploy.mjs imports it directly.
export default {
  name: 'Knitting Increase Calculator',                 // shown in header, title, footer
  domain: 'knittingincreasecalculator.com',            // no https://, no www. Used for canonical, sitemap, robots
  cloudflareProject: 'knitting-increase-calculator',    // Cloudflare Pages project name (used by npm run deploy)
  keyword: 'knitting increase calculator',            // main keyword: goes in the H1 and title
  keywords: ['knitting increase evenly calculator', 'crochet increase calculator', 'increase evenly across a row', 'decrease evenly calculator', 'evenly spaced increases', 'knitting decrease calculator', 'M1 and K2tog spacing'], // supporting keywords
  titleOverride: 'Knitting and Crochet Increase Evenly Calculator', // home page <title>, under 60 characters
  tagline: 'Free, private, no sign-up',  // short line used in the title after the keyword
  description:
    'Increase or decrease evenly across a row, for knitting or crochet. Enter your stitches and how many to add or remove. Get the exact pattern line, flat or in the round, plus a picture of your row.',
  email: 'hello@knittingincreasecalculator.com',       // contact email (shown on Contact and Privacy pages)
  ga4: '',                            // GA4 measurement ID, e.g. 'G-XXXXXXXXXX'. Empty = Google Analytics off
  adsense: '',                        // AdSense publisher ID, e.g. 'ca-pub-1234567890123456'. Empty = ads off
  brand: '#9c2a55',                   // brand color (hex)
  locale: 'en-US',                    // BCP 47 language tag
  ogImage: '/og.png',                        // e.g. '/og.png' (1200x630 file in public/). Empty = no image
  category: 'LifestyleApplication',   // schema.org applicationCategory
  owner: 'Knitting Increase Calculator',                // name used in legal pages (person or business)
};
