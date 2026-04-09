# Agentix Framer Template Clone

## Source
- **URL**: https://agent.framer.wiki/
- **Framework**: Framer 5b26096
- **Build strategy**: Runtime Preservation (Framer JS engine preserved intact)
- **Live deploy URL**: https://agentix-framer-template.netlify.app/

## Tech Stack
- Static HTML + Framer JS runtime (no build step)
- Fonts: Geist (400-700), Plus Jakarta Sans via Google Fonts + 42 Framer custom fonts
- 51 JS chunks from Framer CDN (downloaded locally)
- 21 module scripts (icon components)
- Deploy: Netlify static hosting

## Discovered Pages
1. `/` — Homepage (hero, how it works, features, integration, bento cards, blog, testimonials, FAQ, CTA)
2. `/pricing` — Pricing cards (Free/Pro/Enterprise), comparison table, FAQ
3. `/contact` — Contact form, contact cards, FAQ
4. `/blog` — Blog listing with 3 posts
5. `/blog/:slug` — Blog detail (3 posts, CMS template)
6. `/changelog` — Timeline-style changelog
7. `/waitlist` — Standalone waitlist signup form
8. `/legal/privacy-policy` — Privacy policy
9. `/legal/cookie-policy` — Cookie policy
10. `/404` — Error page

## Clone Discipline Rules
- All HTML captured via `curl -sL` from Framer's SSR output
- All assets downloaded from framerusercontent.com (images, JS, fonts)
- URLs rewritten from CDN to local `/assets/` paths in ALL files (HTML + JS)
- Runtime URL interceptor injected to catch dynamically-constructed URLs
- SPA router disabled on homepage (Framer's `preventDefault` blocks native nav)
- SSR content forced visible on sub-pages (`#main{display:block!important}`)
- Framer branding removed (badge container, Smart Adaptive Overlay, editor bar)
- NO SPA catch-all redirect rule — breaks static asset serving
- Nested pages use absolute paths (`/assets/...` not `assets/...`)
- Text content verbatim from source DOM — never paraphrased

## Research Artifacts
- `docs/research/BEHAVIORS.md` — Animation inventory, scroll mutations, interaction models
- `docs/research/PAGE_TOPOLOGY.md` — Section-by-section page map
- `docs/research/PAGES.md` — All discovered pages with section counts
- `docs/design-references/` — Full-page screenshots (desktop + mobile)

## Project Structure
```
site/                    # Netlify publish directory
  index.html             # Homepage (with Framer JS runtime)
  pricing.html           # Pricing page
  contact.html           # Contact page
  blog.html              # Blog listing
  changelog.html         # Changelog
  waitlist.html          # Waitlist (standalone)
  404.html               # Error page
  blog/                  # Blog detail pages
  legal/                 # Legal pages
  assets/
    images/              # All images from framerusercontent.com
    js/                  # Framer JS chunks + runtime
    modules/             # Framer module scripts (icon components)
    fonts/               # Custom fonts + Google Fonts
  _redirects             # Netlify clean URL routing
netlify.toml             # Netlify build config
scripts/
  download-assets.mjs    # Asset downloader
  rewrite-urls.mjs       # URL rewriter + fix injector
```
