#!/usr/bin/env node
/**
 * Framer Runtime Preservation — URL Rewriter & Fix Injector
 *
 * 1. Rewrites all framerusercontent.com URLs to local /assets/ paths in HTML and JS
 * 2. Injects SPA router disabler (homepage only)
 * 3. Injects SSR content visibility fix (all pages)
 * 4. Removes Framer branding
 * 5. Injects runtime URL interceptor
 * 6. Injects Lenis scroll fallback CSS
 * 7. Removes Framer editor bar script
 */

import { readFile, writeFile, readdir } from 'fs/promises';
import { join, extname } from 'path';
import { existsSync } from 'fs';

const SITE_DIR = join(import.meta.dirname, '..', 'site');

// URL rewriting rules
const URL_REWRITES = [
  // Site JS chunks
  [/https:\/\/framerusercontent\.com\/sites\/3PPoHtucgA33jxTXH6vaN4\//g, '/assets/js/'],
  // Module JS — need to map each module path
  [/https:\/\/framerusercontent\.com\/modules\/([^/]+)\/([^/]+)\//g, '/assets/modules/$2/'],
  // Images
  [/https:\/\/framerusercontent\.com\/images\//g, '/assets/images/'],
  // Font assets
  [/https:\/\/framerusercontent\.com\/assets\//g, '/assets/fonts/'],
  // Google Fonts (more specific replacements needed per font family)
  [/https:\/\/fonts\.gstatic\.com\/s\/geist\/v3\//g, '/assets/fonts/google/v3/'],
  [/https:\/\/fonts\.gstatic\.com\/s\/plusjakartasans\/v8\//g, '/assets/fonts/google/v8/'],
  // Framer events script
  [/https:\/\/events\.framer\.com\/script\?v=2/g, '/assets/js/framer-events.js'],
  // Remove query params from image URLs (scale-down-to, etc.)
  [/\/assets\/images\/([^"'\s,)]+)\?scale-down-to=\d+/g, '/assets/images/$1'],
];

// CSS to inject — SSR content visibility + Lenis fallback + Framer branding hide
const INJECT_CSS = `
<style id="clone-fixes">
/* Force SSR content visible (Framer hides #main until JS hydrates) */
#main{display:block!important;opacity:1!important;visibility:visible!important}
#main>div,#main>section,#main>header,#main>footer,#main>nav,#main>article{display:block!important;opacity:1!important;visibility:visible!important}
#main>style{display:none!important}

/* Lenis scroll fallback */
html.lenis, html.lenis body { height: auto; overflow: visible }

/* Hide Framer branding */
#__framer-badge-container{display:none!important}
[data-framer-name="Smart Adaptive Overlay"]{display:none!important;height:0!important}
</style>`;

// Runtime URL interceptor — catches dynamically constructed framerusercontent URLs
const RUNTIME_INTERCEPTOR = `
<script id="url-interceptor">
(function() {
  // Intercept fetch
  var origFetch = window.fetch;
  window.fetch = function(url, opts) {
    if (typeof url === 'string' && url.includes('framerusercontent.com/images/')) {
      url = url.replace(/https:\\/\\/framerusercontent\\.com\\/images\\//g, '/assets/images/');
      url = url.replace(/\\?scale-down-to=\\d+/, '');
    }
    return origFetch.call(this, url, opts);
  };

  // Intercept img.src setter
  var origSrcDesc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, 'src');
  if (origSrcDesc && origSrcDesc.set) {
    Object.defineProperty(HTMLImageElement.prototype, 'src', {
      get: origSrcDesc.get,
      set: function(val) {
        if (typeof val === 'string' && val.includes('framerusercontent.com/images/')) {
          val = val.replace(/https:\\/\\/framerusercontent\\.com\\/images\\//g, '/assets/images/');
          val = val.replace(/\\?scale-down-to=\\d+/, '');
        }
        return origSrcDesc.set.call(this, val);
      },
      configurable: true
    });
  }

  // Intercept setAttribute
  var origSetAttr = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function(name, val) {
    if ((name === 'src' || name === 'srcset' || name === 'href') && typeof val === 'string' && val.includes('framerusercontent.com')) {
      val = val.replace(/https:\\/\\/framerusercontent\\.com\\/images\\//g, '/assets/images/');
      val = val.replace(/https:\\/\\/framerusercontent\\.com\\/assets\\//g, '/assets/fonts/');
      val = val.replace(/\\?scale-down-to=\\d+/g, '');
    }
    return origSetAttr.call(this, name, val);
  };
})();
</script>`;

// SPA router disabler — only for homepage
const SPA_ROUTER_DISABLER = `
<script id="spa-router-disabler">
(function() {
  // Capture-phase click interceptor to prevent Framer's SPA router
  document.addEventListener('click', function(e) {
    var anchor = e.target.closest('a[href]');
    if (!anchor) return;
    var href = anchor.getAttribute('href');
    if (!href) return;

    // Anchor links — smooth scroll
    if (href.startsWith('#')) {
      e.preventDefault();
      e.stopImmediatePropagation();
      var target = document.querySelector(href);
      if (target) target.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Internal page links — native navigation
    if (href.startsWith('/') || href.startsWith(location.origin)) {
      e.preventDefault();
      e.stopImmediatePropagation();
      // Map Framer routes to static HTML files
      var path = href.replace(location.origin, '');
      if (path === '/' || path === '') {
        window.location.href = '/';
      } else if (path.startsWith('/blog/') && path.split('/').length > 2) {
        // Blog detail: /blog/slug -> /blog/slug.html
        window.location.href = path + '.html';
      } else if (path.startsWith('/legal/')) {
        // Legal pages: /legal/privacy-policy -> /legal/privacy-policy.html
        window.location.href = path + '.html';
      } else {
        // Root pages: /pricing -> /pricing.html
        window.location.href = path + '.html';
      }
      return;
    }
  }, true); // capture phase — fires before Framer's handler

  // Periodic scroll lock cleanup
  setInterval(function() {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.documentElement.style.position = '';
    document.body.style.position = '';
  }, 500);
})();
</script>`;

async function rewriteHtmlFile(filepath, isHomepage, isNested) {
  let html = await readFile(filepath, 'utf-8');
  const filename = filepath.split('/').pop();

  // Apply URL rewrites
  for (const [pattern, replacement] of URL_REWRITES) {
    html = html.replace(pattern, replacement);
  }

  // For nested pages (blog/*, legal/*), ensure absolute paths
  if (isNested) {
    // Fix any remaining relative asset paths
    html = html.replace(/,assets\//g, ',/assets/');
    html = html.replace(/ assets\//g, ' /assets/');
    html = html.replace(/url\(assets\//g, 'url(/assets/');
    html = html.replace(/href="assets\//g, 'href="/assets/');
    html = html.replace(/src="assets\//g, 'src="/assets/');
    html = html.replace(/srcset="assets\//g, 'srcset="/assets/');
  }

  // Remove Framer generator meta tag
  html = html.replace(/<meta\s+name="generator"\s+content="Framer[^"]*"\s*\/?>/gi, '');

  // Remove Framer editor bar script
  html = html.replace(/<script[^>]*>[\s\S]*?localStorage\.get\("__framer_force_showing_editorbar_since"\)[\s\S]*?<\/script>/gi, '');

  // Remove "Made in Framer" and "Create a free website with Framer" text
  html = html.replace(/Made in Framer/g, '');
  html = html.replace(/Create a free website with Framer/g, '');

  // Remove edit.framer.com script reference
  html = html.replace(/<script[^>]*src="https:\/\/edit\.framer\.com[^"]*"[^>]*><\/script>/gi, '');
  html = html.replace(/<script[^>]*src="\/assets\/js\/framer-init\.mjs"[^>]*><\/script>/gi, '');

  // Inject CSS fixes before </head>
  html = html.replace('</head>', INJECT_CSS + '\n</head>');

  // Inject runtime URL interceptor at top of <head> (before any other scripts)
  html = html.replace('<head>', '<head>\n' + RUNTIME_INTERCEPTOR);

  // For homepage only: inject SPA router disabler
  if (isHomepage) {
    html = html.replace(RUNTIME_INTERCEPTOR, RUNTIME_INTERCEPTOR + '\n' + SPA_ROUTER_DISABLER);
  } else {
    // For sub-pages: remove ALL <script> tags (they're static HTML+CSS, no JS needed)
    // EXCEPT our injected scripts
    html = html.replace(/<script(?![^>]*id="(url-interceptor|spa-router-disabler|clone-fixes)")[^>]*>[\s\S]*?<\/script>/gi, '');
  }

  // Remove #__framer-badge-container element entirely
  html = html.replace(/<div[^>]*id="__framer-badge-container"[^>]*>[\s\S]*?<\/div>/gi, '');

  await writeFile(filepath, html, 'utf-8');
  console.log(`  Rewritten: ${filename} (${isHomepage ? 'homepage' : isNested ? 'nested' : 'root'})`);
}

async function rewriteJsFile(filepath) {
  let js = await readFile(filepath, 'utf-8');
  const filename = filepath.split('/').pop();

  // Apply URL rewrites to JS files
  for (const [pattern, replacement] of URL_REWRITES) {
    js = js.replace(pattern, replacement);
  }

  await writeFile(filepath, js, 'utf-8');
}

async function processJsFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  let count = 0;
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      count += await processJsFiles(fullPath);
    } else if (entry.name.endsWith('.mjs') || entry.name.endsWith('.js')) {
      await rewriteJsFile(fullPath);
      count++;
    }
  }
  return count;
}

async function main() {
  console.log('=== URL Rewriter & Fix Injector ===\n');

  // 1. Rewrite HTML files
  console.log('Rewriting HTML files...');

  // Homepage
  await rewriteHtmlFile(join(SITE_DIR, 'index.html'), true, false);

  // Root-level pages
  const rootPages = ['pricing', 'contact', 'blog', 'changelog', 'waitlist', '404'];
  for (const page of rootPages) {
    const filepath = join(SITE_DIR, `${page}.html`);
    if (existsSync(filepath)) {
      await rewriteHtmlFile(filepath, false, false);
    }
  }

  // Nested pages — blog details
  const blogDir = join(SITE_DIR, 'blog');
  if (existsSync(blogDir)) {
    const blogFiles = await readdir(blogDir);
    for (const file of blogFiles) {
      if (file.endsWith('.html')) {
        await rewriteHtmlFile(join(blogDir, file), false, true);
      }
    }
  }

  // Nested pages — legal
  const legalDir = join(SITE_DIR, 'legal');
  if (existsSync(legalDir)) {
    const legalFiles = await readdir(legalDir);
    for (const file of legalFiles) {
      if (file.endsWith('.html')) {
        await rewriteHtmlFile(join(legalDir, file), false, true);
      }
    }
  }

  // 2. Rewrite JS files
  console.log('\nRewriting JS files...');
  const jsDir = join(SITE_DIR, 'assets', 'js');
  const modulesDir = join(SITE_DIR, 'assets', 'modules');

  let jsCount = 0;
  if (existsSync(jsDir)) jsCount += await processJsFiles(jsDir);
  if (existsSync(modulesDir)) jsCount += await processJsFiles(modulesDir);
  console.log(`  Rewritten ${jsCount} JS files`);

  console.log('\n=== Done ===');
}

main().catch(console.error);
