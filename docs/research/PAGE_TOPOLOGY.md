# PAGE_TOPOLOGY.md — Homepage

**Source**: https://agent.framer.wiki/
**Page height**: 9,333px
**Total Framer named elements**: 582
**Total mutations on scroll**: 16,405

## Top-Level Structure
- `#main` > DIV (9,333px full page wrapper) > 6 children
- Header is a NAV element (data-framer-name="Desktop")

## Sections (top to bottom)

### 1. Header / Navigation
- **Y position**: 0
- **Height**: ~80px
- **Framer name**: "Desktop" (NAV)
- **Interaction model**: Static + sticky on scroll (Framer-managed)
- **Content**: Logo "V1.0", nav links (Home, Features, Integrations, Pricing), CTA "Request early access"

### 2. Hero Section
- **Y position**: 80
- **Height**: 707px
- **Framer name**: "Hero Section"
- **Interaction model**: Scroll-driven parallax on screenshot image
- **Content**: Badge "AGENT AI", heading, subheading, 2 CTA buttons, large product screenshot
- **Key child elements**: Hero Wrapper, Content Wrapper, Hero Text Wrapper, Heading Wrapper, Hero Image Wrapper
- **Decorative**: 3x "Blurred Green Circle" elements (gradient blobs)

### 3. How it Works Section
- **Y position**: 889
- **Height**: 767px
- **Framer name**: "How it Works Section"
- **Interaction model**: Click-driven tab switching
- **Content**: Section tag "EASY ONBOARDING", heading "How it works?", 3 tabs with content panels
- **Tabs**: "Choose Agents" (01), "Connect Tools" (02), "Automate Tasks" (03)
- **Each tab panel**: Title, description, image

### 4. Core Value Features Section
- **Y position**: 1,656
- **Height**: 706px
- **Framer name**: "Core Value Features Section"
- **Interaction model**: Static
- **Content**: Section heading, 3 feature cards with icons and descriptions

### 5. Duo Features Section
- **Y position**: 2,362
- **Height**: 1,260px
- **Framer name**: "Duo Features Section"
- **Interaction model**: Static
- **Content**: 2 side-by-side feature blocks, each with image + text content
- **Key children**: "Content Section Bottom Wrapper", "Content Section Top Wrapper"

### 6. Single Feature Section
- **Y position**: 3,622
- **Height**: 576px
- **Framer name**: "Single Feature Section"
- **Interaction model**: Static
- **Content**: Feature with image + text, decorative green circle

### 7. Integration Section
- **Y position**: 4,198
- **Height**: 677px
- **Framer name**: "Integration Section"
- **Interaction model**: Scroll-driven arm rotation animation
- **Content**: Header, orbital/radial logo animation with Arms 0-8
- **Key children**: "Integration Wrapper", "Logo Animation Wrapper"

### 8. Bento Cards Section
- **Y position**: 4,875
- **Height**: 711px
- **Framer name**: "Bento Cards Section"
- **Interaction model**: Static (may have hover effects)
- **Content**: Grid of bento-style feature cards
- **Key children**: "Cards Wrapper", "Modal", "List", "Card 4 Wrapper"

### 9. Blog Section
- **Y position**: 5,586
- **Height**: 844px
- **Framer name**: "Blog Section"
- **Interaction model**: Scroll-driven entrance animation
- **Content**: Blog heading, 3 blog cards from CMS collection
- **Key children**: "Blog Wrapper", "Blog Collection List", "Blog Card Single" (x3)
- **Each card**: Cover image with progressive blur gradient, title, category, read time

### 10. Testimonial Section
- **Y position**: 6,430
- **Height**: 953px
- **Framer name**: "Testimonial Section"
- **Interaction model**: Static/scroll
- **Content**: Testimonial cards, background gradient image
- **Background**: "Blaze19" gradient blue background image

### 11. FAQ Section
- **Y position**: 7,383
- **Height**: 953px
- **Framer name**: "FAQ Section"
- **Interaction model**: Click-driven accordion
- **Content**: FAQ heading, expandable question items
- **Key children**: "FAQ Wrapper", "Questions Wrapper"

### 12. CTA / Footer Section
- **Y position**: ~8,337
- **Height**: 594px
- **Framer name**: "Desktop" (footer nav)
- **Interaction model**: Static
- **Content**: CTA block, footer nav with page links, logo ticker marquee

## Logo Ticker (within footer/CTA)
- Infinite horizontal scroll marquee
- 8 unique logos repeated 4x
- Duration: 35,840ms linear
