# BEHAVIORS.md — Agentix Framer Template

## Framework
- **Platform**: Framer 5b26096
- **Strategy**: Runtime Preservation (preserve Framer JS engine + DOM)
- **URL**: https://agent.framer.wiki/

## Scroll Behaviors

### Header/Nav
- NAV element with `data-framer-name="Desktop"`, position: relative (not sticky/fixed at scroll 0)
- The header is contained within a sticky wrapper managed by Framer's runtime
- Background: transparent at top, likely gets backdrop effect on scroll (managed by Framer JS)

### Hero Screenshot Parallax
- `(Replace 2608x1855 Image) Screenshot` — 1,289 scroll mutations across y:0-4600
- Heavy scroll-driven transform/parallax effect managed by framer-motion

### Integration Arms Animation
- Arms 0-8 animated radially at scroll positions 3600-5200
- Each arm has ~200 mutations — rotation/transform animations triggered by scroll
- This is the Integration Section's logo orbit animation

### Blog Collection Entrance
- 194 mutations at scroll 5200-6200
- Scroll-triggered entrance animation for blog cards

### Tab Switching (How it Works)
- LI/UL mutations at scroll 1000 — tab indicator switching
- 3 tabs: "Choose Agents" (01), "Connect Tools" (02), "Automate Tasks" (03)
- Click-driven tab system with content panels

## Initial Opacity States
- Blurred Green Circle elements: opacity 0.3-0.6 (decorative, intentional)
- Body text elements (Body Small, Body Large, Paragraph): opacity 0.7 (intentional subdued text)
- Divider: opacity 0.1
- NO elements start at opacity 0 that animate to 1 — no scroll-reveal fade-ins detected

## Active Animations (at page load)
- **Marquee ticker**: UL element, duration 35,840ms, linear, infinite — logo strip scroll
- **Text animation**: P element, duration 3,000ms, linear — likely hero text typing/rolling effect
- **Entrance animations**: ~16 DIV elements with 1,375ms ease-out animations (one-shot entrance effects)

## Hover States
- Buttons have rolling text hover effect (`.rolling-text-inner-*` class names visible)
- Blog cards likely have hover scale/shadow effects (managed by framer-motion)

## Interactive Elements
- **How it Works tabs**: 3 clickable tab buttons switching content panels
- **FAQ accordion**: FAQ Section at y:7383 with expandable questions
- **CTA buttons**: Multiple "Request early access", "Explore Agents", "Book a Demo", etc.
- **Blog cards**: Linked to individual blog post pages

## Marquee/Infinite Animations
- **Logo Ticker**: Infinite horizontal scroll of partner/integration logos
- Contains 8 unique logos (Logo 1, Logo2-5, Logo8-10) repeated 4x for seamless loop
- Duration: 35,840ms linear infinite

## Assets Summary
- 0 Lottie animations
- 0 Canvas/WebGL elements
- 51 images from framerusercontent.com
- Font: Geist (400, 500, 600, 700) via Google Fonts
