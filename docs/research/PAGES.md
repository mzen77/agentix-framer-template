# PAGES.md — Agentix Framer Template

## Build Strategy: Runtime Preservation (Framer)
Each page is captured as static HTML with Framer's JS runtime preserved intact.

## Pages to Clone

### 1. Homepage `/`
- **URL**: https://agent.framer.wiki/
- **Screenshot**: `homepage-desktop-1440-*.png`, `homepage-mobile-390-*.png`
- **Page height**: 9,333px
- **Unique sections**: 12 (Hero, How it Works, Core Value Features, Duo Features, Single Feature, Integration, Bento Cards, Blog, Testimonial, FAQ, CTA/Footer, Logo Ticker)
- **Topology**: `PAGE_TOPOLOGY.md`

### 2. Pricing `/pricing`
- **URL**: https://agent.framer.wiki/pricing
- **Screenshot**: `pricing-desktop-*.png`
- **Page height**: 4,003px
- **Unique sections**: 5 (Pricing Cards [Free/Pro/Enterprise], Partner Section, Price Comparison, FAQ, CTA/Footer)

### 3. Contact `/contact`
- **URL**: https://agent.framer.wiki/contact
- **Screenshot**: `contact-desktop-*.png`
- **Page height**: 3,077px
- **Unique sections**: 4 (Contact Form + Cloud Image, Contact Cards, FAQ, CTA/Footer)

### 4. Blog Listing `/blog`
- **URL**: https://agent.framer.wiki/blog
- **Screenshot**: `blog-desktop-*.png`
- **Page height**: 2,253px
- **Unique sections**: 3 (Blog Header + Collection List, CTA, Footer)

### 5. Blog Detail (CMS template) `/blog/:slug`
- **URLs**:
  - https://agent.framer.wiki/blog/building-smarter-workflows-with-ai-agents
  - https://agent.framer.wiki/blog/why-multi-agent-systems-are-the-future
  - https://agent.framer.wiki/blog/how-to-automate-tasks-in-under-5-minutes
- **Screenshots**: `blog-detail-desktop-*.png`, `blog-detail-2-desktop-*.png`, `blog-detail-3-desktop-*.png`
- **Page height**: ~4,912px
- **Unique sections**: 4 (Blog Detail Header + Cover + Content, Related Blog Cards, CTA, Footer)
- **Note**: CMS-driven template — each post has unique content but same layout

### 6. Changelog `/changelog`
- **URL**: https://agent.framer.wiki/changelog
- **Screenshot**: `changelog-desktop-*.png`
- **Page height**: 3,905px
- **Unique sections**: 3 (Changelog Header + Timeline CMS, CTA, Footer)

### 7. Waitlist `/waitlist`
- **URL**: https://agent.framer.wiki/waitlist
- **Screenshot**: `waitlist-desktop-*.png`
- **Page height**: 900px (single viewport)
- **Unique sections**: 1 (Waitlist form with background effects — standalone page, no header/footer)

### 8. Privacy Policy `/legal/privacy-policy`
- **URL**: https://agent.framer.wiki/legal/privacy-policy
- **Screenshot**: `privacy-policy-desktop-*.png`
- **Unique sections**: 3 (Legal Header + Content, CTA, Footer)
- **Note**: Nested path — needs absolute asset paths

### 9. Cookie Policy `/legal/cookie-policy`
- **URL**: https://agent.framer.wiki/legal/cookie-policy
- **Screenshot**: `cookie-policy-desktop-*.png`
- **Unique sections**: 3 (Legal Header + Content, CTA, Footer)
- **Note**: Nested path — needs absolute asset paths

### 10. 404 Page
- **URL**: https://agent.framer.wiki/404
- **Screenshot**: `404-desktop-*.png`
- **Unique sections**: 1 (Error page — standalone)

## Shared Components (appear on most pages)
- **Header/Nav**: "Desktop" nav element — appears on all pages except Waitlist and 404
- **CTA Section**: "Desktop" CTA wrapper with product screenshot — appears on all pages except Homepage (has its own CTA), Waitlist, and 404
- **Footer**: "Web" footer with logo, nav links, copyright — appears on all pages with CTA

## Total Unique Section Count
- Homepage: 12
- Pricing: 5
- Contact: 4
- Blog Listing: 3
- Blog Detail: 4
- Changelog: 3
- Waitlist: 1
- Privacy Policy: 3
- Cookie Policy: 3
- 404: 1
- **Total: ~39 sections** (many shared: Header, CTA, Footer reduce unique builds)

## Placeholder Pages
None — all nav/footer links resolve to real pages.
