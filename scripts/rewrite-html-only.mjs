#!/usr/bin/env node
/**
 * Framer Runtime Preservation — HTML-Only URL Rewriter
 *
 * Key insight: JS files use relative imports (./chunk-*.mjs) and new URL()
 * with full base URLs. Rewriting URLs in JS breaks the URL constructor.
 *
 * Solution: Mirror the CDN path structure locally and ONLY replace the domain
 * in HTML files. JS files are served untouched from mirrored paths.
 */

import { readFile, writeFile, readdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const SITE_DIR = join(import.meta.dirname, '..', 'site');

// In HTML only: strip the CDN domain, keeping the path (which we serve locally)
// framerusercontent.com/sites/... → /sites/...
// framerusercontent.com/images/... → /images/...
// framerusercontent.com/modules/... → /modules/...
// framerusercontent.com/assets/... → /assets/...
const HTML_REWRITES = [
  // Strip the domain, keep the path
  [/https:\/\/framerusercontent\.com/g, ''],
  // events.framer.com script → local
  [/https:\/\/events\.framer\.com\/script\?v=2/g, '/framer-events.js'],
  // Remove edit.framer.com reference
  [/https:\/\/edit\.framer\.com\/init\.mjs/g, ''],
  // Remove scale-down-to query params from image URLs
  [/(\/images\/[^"'\s,)]+)\?scale-down-to=\d+/g, '$1'],
];

// CSS to inject
const INJECT_CSS = `
<style id="clone-fixes">
/* Hide Framer branding */
#__framer-badge-container{display:none!important;height:0!important;overflow:hidden!important}
[data-framer-name="Smart Adaptive Overlay"]{display:none!important;height:0!important}
</style>`;

// SPA router disabler (homepage only)
const SPA_ROUTER_FIX = `
<script id="nav-fix">
document.addEventListener('click', function(e) {
  var a = e.target.closest('a[href]');
  if (!a) return;
  var href = a.getAttribute('href');
  if (!href) return;
  if (href.startsWith('#')) {
    e.preventDefault();
    e.stopImmediatePropagation();
    var target = document.querySelector(href);
    if (target) target.scrollIntoView({ behavior: 'smooth' });
    return;
  }
  if (href.startsWith('/') || href.startsWith(location.origin)) {
    e.preventDefault();
    e.stopImmediatePropagation();
    var path = href.replace(location.origin, '');
    if (path === '/' || path === '') { window.location.href = '/'; return; }
    if (path.startsWith('/blog/') && path.split('/').length > 2) {
      window.location.href = path + '.html'; return;
    }
    if (path.startsWith('/legal/')) {
      window.location.href = path + '.html'; return;
    }
    window.location.href = path + '.html';
  }
}, true);
</script>`;

async function rewriteHtmlFile(filepath, isHomepage) {
  let html = await readFile(filepath, 'utf-8');
  const filename = filepath.split('/').pop();

  // Apply HTML-only URL rewrites
  for (const [pattern, replacement] of HTML_REWRITES) {
    html = html.replace(pattern, replacement);
  }

  // Remove Framer generator meta tag
  html = html.replace(/<meta\s+name="generator"\s+content="Framer[^"]*"\s*\/?>/gi, '');

  // Remove "Made in Framer" text
  html = html.replace(/Made in Framer/g, '');
  html = html.replace(/Create a free website with Framer/g, '');

  // Remove edit.framer.com script tag (empty after rewrite)
  html = html.replace(/<script[^>]*src=""[^>]*><\/script>/gi, '');

  // Inject CSS fixes before </head>
  html = html.replace('</head>', INJECT_CSS + '\n</head>');

  // Homepage: add SPA router fix
  if (isHomepage) {
    html = html.replace('</head>', SPA_ROUTER_FIX + '\n</head>');
  }

  await writeFile(filepath, html, 'utf-8');
  console.log(`  ${filename} (${isHomepage ? 'homepage' : 'sub-page'})`);
}

async function main() {
  console.log('=== HTML-Only Rewriter ===\n');

  // Re-download fresh HTML
  console.log('Re-downloading all pages fresh...');
  const pages = [
    ['https://agent.framer.wiki/', 'index.html', true],
    ['https://agent.framer.wiki/pricing', 'pricing.html', false],
    ['https://agent.framer.wiki/contact', 'contact.html', false],
    ['https://agent.framer.wiki/blog', 'blog.html', false],
    ['https://agent.framer.wiki/changelog', 'changelog.html', false],
    ['https://agent.framer.wiki/waitlist', 'waitlist.html', false],
    ['https://agent.framer.wiki/404', '404.html', false],
    ['https://agent.framer.wiki/blog/building-smarter-workflows-with-ai-agents', 'blog/building-smarter-workflows-with-ai-agents.html', false],
    ['https://agent.framer.wiki/blog/why-multi-agent-systems-are-the-future', 'blog/why-multi-agent-systems-are-the-future.html', false],
    ['https://agent.framer.wiki/blog/how-to-automate-tasks-in-under-5-minutes', 'blog/how-to-automate-tasks-in-under-5-minutes.html', false],
    ['https://agent.framer.wiki/legal/privacy-policy', 'legal/privacy-policy.html', false],
    ['https://agent.framer.wiki/legal/cookie-policy', 'legal/cookie-policy.html', false],
  ];

  // Download fresh
  await Promise.all(pages.map(async ([url, file]) => {
    const resp = await fetch(url);
    const html = await resp.text();
    await writeFile(join(SITE_DIR, file), html, 'utf-8');
  }));
  console.log('  All 12 pages downloaded fresh\n');

  // Rewrite HTML only
  console.log('Rewriting HTML files...');
  for (const [, file, isHomepage] of pages) {
    await rewriteHtmlFile(join(SITE_DIR, file), isHomepage);
  }

  console.log('\nJS files: NOT touched (served from mirrored CDN paths)');
  console.log('\n=== Done ===');
}

main().catch(console.error);
