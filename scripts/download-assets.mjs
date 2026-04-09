#!/usr/bin/env node
/**
 * Framer Runtime Preservation — Asset Downloader
 * Downloads ALL JS chunks, images, fonts, and favicons from the Framer site
 */

import { writeFile, mkdir } from 'fs/promises';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const SITE_DIR = join(import.meta.dirname, '..', 'site');
const CONCURRENCY = 8;

// All JS chunks from the Framer runtime
const JS_CHUNKS = [
  "https://framerusercontent.com/sites/3PPoHtucgA33jxTXH6vaN4/script_main.AY2VVHBC.mjs",
  "https://framerusercontent.com/sites/3PPoHtucgA33jxTXH6vaN4/chunk-ZLF52EXM.mjs",
  "https://framerusercontent.com/sites/3PPoHtucgA33jxTXH6vaN4/chunk-Z3WDH27T.mjs",
  "https://framerusercontent.com/sites/3PPoHtucgA33jxTXH6vaN4/chunk-R35JCWPO.mjs",
  "https://framerusercontent.com/sites/3PPoHtucgA33jxTXH6vaN4/chunk-A3IIQ6X3.mjs",
  "https://framerusercontent.com/sites/3PPoHtucgA33jxTXH6vaN4/chunk-HZL4YIMB.mjs",
  "https://framerusercontent.com/sites/3PPoHtucgA33jxTXH6vaN4/chunk-K5YMOHR3.mjs",
  "https://framerusercontent.com/sites/3PPoHtucgA33jxTXH6vaN4/chunk-2LDU4BSP.mjs",
  "https://framerusercontent.com/sites/3PPoHtucgA33jxTXH6vaN4/chunk-YBNUERNP.mjs",
  "https://framerusercontent.com/sites/3PPoHtucgA33jxTXH6vaN4/chunk-WAMP3RAW.mjs",
  "https://framerusercontent.com/sites/3PPoHtucgA33jxTXH6vaN4/chunk-TWMEDAMY.mjs",
  "https://framerusercontent.com/sites/3PPoHtucgA33jxTXH6vaN4/chunk-42U43NKG.mjs",
  "https://framerusercontent.com/sites/3PPoHtucgA33jxTXH6vaN4/4eDP-zY4X5CKsZzGKQd77UPSt6mYerDcq-tLq8TMG8o.4HXECYV6.mjs",
  "https://framerusercontent.com/sites/3PPoHtucgA33jxTXH6vaN4/chunk-GHVHA4FJ.mjs",
  "https://framerusercontent.com/sites/3PPoHtucgA33jxTXH6vaN4/chunk-VGDRZKTA.mjs",
  "https://framerusercontent.com/sites/3PPoHtucgA33jxTXH6vaN4/chunk-PEOUGFNI.mjs",
  "https://framerusercontent.com/sites/3PPoHtucgA33jxTXH6vaN4/chunk-572I736L.mjs",
  "https://framerusercontent.com/sites/3PPoHtucgA33jxTXH6vaN4/chunk-RO2PXBJG.mjs",
  "https://framerusercontent.com/sites/3PPoHtucgA33jxTXH6vaN4/chunk-ZZ7RAWHU.mjs",
  "https://framerusercontent.com/sites/3PPoHtucgA33jxTXH6vaN4/chunk-UJFEWGJ3.mjs",
  "https://framerusercontent.com/sites/3PPoHtucgA33jxTXH6vaN4/chunk-4O4ZNYKN.mjs",
  "https://framerusercontent.com/sites/3PPoHtucgA33jxTXH6vaN4/chunk-MQLXL66T.mjs",
  "https://framerusercontent.com/sites/3PPoHtucgA33jxTXH6vaN4/PX9hIOIVM-KI52PKV6.mjs",
  "https://framerusercontent.com/sites/3PPoHtucgA33jxTXH6vaN4/XSSgd25YdXtZhUH66dxvjOLcReE5cGbsjv3pvyOQmrE.ITGAKDO6.mjs",
  "https://framerusercontent.com/sites/3PPoHtucgA33jxTXH6vaN4/AOpV6H1tAzh8mR5xNHREZP6k1TlYoaWMkp_kwFmdQ8g.RVLTQWJK.mjs",
  "https://framerusercontent.com/sites/3PPoHtucgA33jxTXH6vaN4/chunk-2WDRLR65.mjs",
  "https://framerusercontent.com/sites/3PPoHtucgA33jxTXH6vaN4/tFD5HSWyycxFx50QkvkC3Ydjd-tdVaFISR1MdUApOEw.CM7BXV5S.mjs",
  "https://framerusercontent.com/sites/3PPoHtucgA33jxTXH6vaN4/chunk-IU2NEFJV.mjs",
  "https://framerusercontent.com/sites/3PPoHtucgA33jxTXH6vaN4/chunk-RQZLUS3F.mjs",
];

// Module JS files (icon components, etc.)
const MODULE_JS = [
  "https://framerusercontent.com/modules/e4iRU4jfXUfUnqx5j9im/FEeis1FSphsCmAXgl7yo/List.js",
  "https://framerusercontent.com/modules/AZde9EKhHYqNbfSI9q7K/uCa6Grcnl7veTgu5M02V/Lightning.js",
  "https://framerusercontent.com/modules/YaDAVMZgSfaPBdYt5l8M/lQw4fwY3JSkhCgJ8Pkhm/HandsClapping.js",
  "https://framerusercontent.com/modules/K71kRXofeRwLK2p6gYq5/WWkfaLgKqkHzAbs8ENlP/UserSwitch.js",
  "https://framerusercontent.com/modules/dYJz48ytzciWUN656R8s/MmkYyiMeMe6tzT9hnowm/GitPullRequest.js",
  "https://framerusercontent.com/modules/H9IIxBH9YNUcBnac5g9z/DXJLXEeOAOIfEDbCmlvS/ArrowsIn.js",
  "https://framerusercontent.com/modules/G3wZthqssPCjKLgneDkU/M2ffrt7tO3ITX9ckHvvi/Brain.js",
  "https://framerusercontent.com/modules/m68GGkZuAX3zQsJldEIA/SnS5nl20oO6tJFrbn2CJ/SmileySticker.js",
  "https://framerusercontent.com/modules/mfcx0vhi1sVINhtIi0C2/KYhKkIixoHXJMjunWASV/Scan.js",
  "https://framerusercontent.com/modules/foj6ODUa5Dq1CmROvYHP/ny2hP2racA5lfiGNovWE/SlidersHorizontal.js",
  "https://framerusercontent.com/modules/WdnqBlrpvZrDZDJ1UvaI/qNJ5dxZfaBixce3gjxU0/RocketLaunch.js",
  "https://framerusercontent.com/modules/6sFvwT7mKbGw5XZhSoJb/KGw8KtfohXu9VUyfVGiE/DotsSix.js",
  "https://framerusercontent.com/modules/f9fSui6BOOUiVWFOMzjo/AWU87ZKKRS75S2kHfW68/CursorClick.js",
  "https://framerusercontent.com/modules/UNPG3iwXt5YFeGPtdi5q/lKaDyVE0x2GxE7FzUOn3/Plus.js",
  "https://framerusercontent.com/modules/tee6kHv8jFWGQMdGb2Xd/IIR9IOACnkgXg7a65Wib/LinkedinLogo.js",
  "https://framerusercontent.com/modules/1ZkvldSvzWBNrFZf8aH8/sHjGZ67L04PXTqKUbxnu/XLogo.js",
  "https://framerusercontent.com/modules/R3qWcIUXr6Onkl147jz5/IemqcReO263P7jVSAnEP/GithubLogo.js",
  "https://framerusercontent.com/modules/sEWy5nP42pmqm27189zM/htULztSvMZR3DXvz7ZuO/StackOverflowLogo.js",
  "https://framerusercontent.com/modules/Ziam9Pfi1sUKxEevobXl/EuVICo25NHVWN9yzJ9KU/DotOutline.js",
  "https://framerusercontent.com/modules/4DdaUvaccgEgxMd5tHRL/hWGATDnHlzpAXNQv6svp/CaretRight.js",
  "https://framerusercontent.com/modules/aiEbwYcxgRL9dJc8WPo9/fVgK1u0LeJ20mqdxBTGI/PlugsConnected.js",
];

// All images (from DOM + network performance entries)
const IMAGES = [
  "https://framerusercontent.com/images/eZbnTBB4KblwMdFBajxNbPBhog.jpg",
  "https://framerusercontent.com/images/YgWRrtG93V1McwqDupyqVXTGkI.jpg",
  "https://framerusercontent.com/images/3rgOEHVe5mM8J6C2xWdS08EI4.png",
  "https://framerusercontent.com/images/XPxwo6N9K8yltJAsNqWlztlsA.png",
  "https://framerusercontent.com/images/sqw7nifq8S0UF5pSA3rJ5hv2k.png",
  "https://framerusercontent.com/images/k3DYExJloLpyuH8vw9JInbj0oZw.jpg",
  "https://framerusercontent.com/images/s3HxTxIdMTiELxUawIHiiQXns.jpg",
  "https://framerusercontent.com/images/bsYrA5VP3dzTDKZa4lskR00r4.jpg",
  "https://framerusercontent.com/images/XC4O6lN2uqvVyMpafT5uIZs7g.jpg",
  "https://framerusercontent.com/images/gAUQNWE2ieb3AkWbl2BVydSZ4.jpg",
  "https://framerusercontent.com/images/AawZ16AmWxoj9aQ3SRqUcz8jY2Q.jpg",
  "https://framerusercontent.com/images/LHlGAle7flIiScgLeQ08uifC0Y.jpg",
  "https://framerusercontent.com/images/tZNhsS3z1h21O8MBufIOJ5kxZhU.jpg",
  "https://framerusercontent.com/images/NmmZmhaMmjtZLxZWuvUzUpQFoY.jpg",
  "https://framerusercontent.com/images/E3vzjdpFuSWiVeurdyPGMrSWk.png",
  "https://framerusercontent.com/images/mo2Pbj2hqScYdc4e7VO88ooki4.png",
  "https://framerusercontent.com/images/FVjwWr85ut7DBy7LiAzsJoNMlLM.png",
  "https://framerusercontent.com/images/dlhgx3fMLQZlK7XF8F8pg5OGE.png",
  "https://framerusercontent.com/images/GsvGVDjt9Og2l8MpVzjNi5xbrS0.png",
  "https://framerusercontent.com/images/OrlifnTlYPRMLyxn1o7nUVu4IB8.png",
  "https://framerusercontent.com/images/qT2RDznEpOrJtcHZv3nDznB7QOk.jpg",
  "https://framerusercontent.com/images/lTKrFGv3E8wzq6LqHhJddpV1vE.jpg",
  "https://framerusercontent.com/images/6NveBVCzvNa67ChHcDODa017M.jpg",
  "https://framerusercontent.com/images/05knyzw0rUgULM6deRVbL10UAw.jpg",
  "https://framerusercontent.com/images/6xHEJdY0oIyqlQjGm0IcaDZoNwg.png",
  "https://framerusercontent.com/images/VnGF1oQqX1poiXheBo2UcV25x0.png",
  "https://framerusercontent.com/images/i0Kkhim9JtWdlb5ssQ6h8Nq1A8.png",
  "https://framerusercontent.com/images/yyPffzdLGbBAW9c6jtg9nfkEcf4.png",
  "https://framerusercontent.com/images/1XGuZRp1j1nHUJjGnfWDlld6c.png",
  "https://framerusercontent.com/images/vNpRxywaxh8PX6CfUU4M3OFbnc.png",
  "https://framerusercontent.com/images/WVUPQQBwJeyznwFa7fAylcQlofs.jpg",
  "https://framerusercontent.com/images/7uzX8mmXLLg62cg2wYR9szGPrw.png",
  "https://framerusercontent.com/images/0lXFBbIJGCYBrVEJGP360nFZpWQ.png",
  "https://framerusercontent.com/images/uo7pBe82cUPeLRAPENo3SMdk.png",
  "https://framerusercontent.com/images/jC7KwluILkhO0KHxk6qWEttOxhE.png",
  "https://framerusercontent.com/images/Z97wHoPR4AM16uZklAdSwB6nJ6A.jpg",
  "https://framerusercontent.com/images/x9G5jXfdPxE5I5HJgcvxyjtJudc.png",
  "https://framerusercontent.com/images/uXlN676xpS6K44HuJ2TIBzyRbg.png",
  // Favicons + OG image
  "https://framerusercontent.com/images/jODyg5107cBRtNMvEe3bfgZxgc.svg",
  "https://framerusercontent.com/images/hU1CVKVawIzzNcEWB9dNLWo6RXU.svg",
  "https://framerusercontent.com/images/ytjoZFEC0xDShplUOsDcyG9yE.png",
  "https://framerusercontent.com/images/5jUwhi6XYrX1nKV1ssFTNOPk0.png",
];

// Font files (from @font-face declarations)
const FONTS = [
  // Google Fonts - Geist
  "https://fonts.gstatic.com/s/geist/v3/gyByhwUxId8gMEwYGFWfOw.woff2",
  "https://fonts.gstatic.com/s/geist/v3/gyByhwUxId8gMEwSGFWfOw.woff2",
  "https://fonts.gstatic.com/s/geist/v3/gyByhwUxId8gMEwcGFU.woff2",
  // Plus Jakarta Sans
  "https://fonts.gstatic.com/s/plusjakartasans/v8/LDIoaomQNQcsA88c7O9yZ4KMCoOg4Ko70yyygA.woff2",
  "https://fonts.gstatic.com/s/plusjakartasans/v8/LDIoaomQNQcsA88c7O9yZ4KMCoOg4Ko50yyygA.woff2",
  "https://fonts.gstatic.com/s/plusjakartasans/v8/LDIoaomQNQcsA88c7O9yZ4KMCoOg4Ko40yyygA.woff2",
  "https://fonts.gstatic.com/s/plusjakartasans/v8/LDIoaomQNQcsA88c7O9yZ4KMCoOg4Ko20yw.woff2",
  // Geist variable
  "https://fonts.gstatic.com/s/geist/v3/gyBhhwUxId8gMGYQMKR3pzfaWI_RNeQInpna-1Q.woff2",
  "https://fonts.gstatic.com/s/geist/v3/gyBhhwUxId8gMGYQMKR3pzfaWI_RNeQIlJna-1Q.woff2",
  "https://fonts.gstatic.com/s/geist/v3/gyBhhwUxId8gMGYQMKR3pzfaWI_RNeQImpna.woff2",
  // Framer custom fonts (Phosphor icons, etc.)
  "https://framerusercontent.com/assets/5vvr9Vy74if2I6bQbJvbw7SY1pQ.woff2",
  "https://framerusercontent.com/assets/EOr0mi4hNtlgWNn9if640EZzXCo.woff2",
  "https://framerusercontent.com/assets/Y9k9QrlZAqio88Klkmbd8VoMQc.woff2",
  "https://framerusercontent.com/assets/OYrD2tBIBPvoJXiIHnLoOXnY9M.woff2",
  "https://framerusercontent.com/assets/JeYwfuaPfZHQhEG8U5gtPDZ7WQ.woff2",
  "https://framerusercontent.com/assets/vQyevYAyHtARFwPqUzQGpnDs.woff2",
  "https://framerusercontent.com/assets/b6Y37FthZeALduNqHicBT6FutY.woff2",
  "https://framerusercontent.com/assets/DpPBYI0sL4fYLgAkX8KXOPVt7c.woff2",
  "https://framerusercontent.com/assets/4RAEQdEOrcnDkhHiiCbJOw92Lk.woff2",
  "https://framerusercontent.com/assets/1K3W8DizY3v4emK8Mb08YHxTbs.woff2",
  "https://framerusercontent.com/assets/tUSCtfYVM1I1IchuyCwz9gDdQ.woff2",
  "https://framerusercontent.com/assets/VgYFWiwsAC5OYxAycRXXvhze58.woff2",
  "https://framerusercontent.com/assets/DXD0Q7LSl7HEvDzucnyLnGBHM.woff2",
  "https://framerusercontent.com/assets/GIryZETIX4IFypco5pYZONKhJIo.woff2",
  "https://framerusercontent.com/assets/H89BbHkbHDzlxZzxi8uPzTsp90.woff2",
  "https://framerusercontent.com/assets/u6gJwDuwB143kpNK1T1MDKDWkMc.woff2",
  "https://framerusercontent.com/assets/43sJ6MfOPh1LCJt46OvyDuSbA6o.woff2",
  "https://framerusercontent.com/assets/wccHG0r4gBDAIRhfHiOlq6oEkqw.woff2",
  "https://framerusercontent.com/assets/WZ367JPwf9bRW6LdTHN8rXgSjw.woff2",
  "https://framerusercontent.com/assets/QxmhnWTzLtyjIiZcfaLIJ8EFBXU.woff2",
  "https://framerusercontent.com/assets/2A4Xx7CngadFGlVV4xrO06OBHY.woff2",
  "https://framerusercontent.com/assets/CfMzU8w2e7tHgF4T4rATMPuWosA.woff2",
  "https://framerusercontent.com/assets/867QObYax8ANsfX4TGEVU9YiCM.woff2",
  "https://framerusercontent.com/assets/Oyn2ZbENFdnW7mt2Lzjk1h9Zb9k.woff2",
  "https://framerusercontent.com/assets/cdAe8hgZ1cMyLu9g005pAW3xMo.woff2",
  "https://framerusercontent.com/assets/DOfvtmE1UplCq161m6Hj8CSQYg.woff2",
  "https://framerusercontent.com/assets/vFzuJY0c65av44uhEKB6vyjFMg.woff2",
  "https://framerusercontent.com/assets/tKtBcDnBMevsEEJKdNGhhkLzYo.woff2",
  "https://framerusercontent.com/assets/05KsVHGDmqXSBXM4yRZ65P8i0s.woff2",
  "https://framerusercontent.com/assets/ky8ovPukK4dJ1Pxq74qGhOqCYI.woff2",
  "https://framerusercontent.com/assets/vvNSqIj42qeQ2bvCRBIWKHscrc.woff2",
  "https://framerusercontent.com/assets/3ZmXbBKToJifDV9gwcifVd1tEY.woff2",
  "https://framerusercontent.com/assets/FNfhX3dt4ChuLJq2PwdlxHO7PU.woff2",
  "https://framerusercontent.com/assets/g0c8vEViiXNlKAgI4Ymmk3Ig.woff2",
  "https://framerusercontent.com/assets/efTfQcBJ53kM2pB1hezSZ3RDUFs.woff2",
  "https://framerusercontent.com/assets/hyOgCu0Xnghbimh0pE8QTvtt2AU.woff2",
  "https://framerusercontent.com/assets/NeGmSOXrPBfEFIy5YZeHq17LEDA.woff2",
  "https://framerusercontent.com/assets/oYaAX5himiTPYuN8vLWnqBbfD2s.woff2",
  "https://framerusercontent.com/assets/lEJLP4R0yuCaMCjSXYHtJw72M.woff2",
  "https://framerusercontent.com/assets/cRJyLNuTJR5jbyKzGi33wU9cqIQ.woff2",
  "https://framerusercontent.com/assets/1ZFS7N918ojhhd0nQWdj3jz4w.woff2",
  "https://framerusercontent.com/assets/A0Wcc7NgXMjUuFdquHDrIZpzZw0.woff2",
];

// Other scripts
const OTHER_SCRIPTS = [
  "https://events.framer.com/script?v=2",
  "https://edit.framer.com/init.mjs",
];

function urlToLocalPath(url) {
  const u = new URL(url);

  // framerusercontent.com images
  if (u.hostname === 'framerusercontent.com' && u.pathname.startsWith('/images/')) {
    const filename = u.pathname.split('/').pop().split('?')[0];
    return join('assets', 'images', filename);
  }

  // framerusercontent.com site JS chunks
  if (u.hostname === 'framerusercontent.com' && u.pathname.includes('/sites/')) {
    const filename = u.pathname.split('/').pop();
    return join('assets', 'js', filename);
  }

  // framerusercontent.com module JS
  if (u.hostname === 'framerusercontent.com' && u.pathname.includes('/modules/')) {
    const parts = u.pathname.split('/');
    const filename = parts.pop();
    const moduleId = parts[parts.length - 1];
    return join('assets', 'modules', moduleId, filename);
  }

  // framerusercontent.com font assets
  if (u.hostname === 'framerusercontent.com' && u.pathname.startsWith('/assets/')) {
    const filename = u.pathname.split('/').pop();
    return join('assets', 'fonts', filename);
  }

  // Google Fonts
  if (u.hostname === 'fonts.gstatic.com') {
    const pathParts = u.pathname.split('/');
    const filename = pathParts.pop();
    const fontFamily = pathParts[pathParts.length - 2];
    return join('assets', 'fonts', 'google', fontFamily, filename);
  }

  // events.framer.com
  if (u.hostname === 'events.framer.com') {
    return join('assets', 'js', 'framer-events.js');
  }

  // edit.framer.com
  if (u.hostname === 'edit.framer.com') {
    return join('assets', 'js', 'framer-init.mjs');
  }

  // Fallback
  const filename = u.pathname.split('/').pop() || 'index';
  return join('assets', 'other', filename);
}

async function downloadFile(url, localPath) {
  const fullPath = join(SITE_DIR, localPath);
  const dir = dirname(fullPath);

  if (!existsSync(dir)) {
    await mkdir(dir, { recursive: true });
  }

  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      console.error(`  FAIL ${resp.status}: ${url}`);
      return { url, localPath, status: 'failed', code: resp.status };
    }
    const buffer = Buffer.from(await resp.arrayBuffer());
    await writeFile(fullPath, buffer);
    return { url, localPath, status: 'ok', size: buffer.length };
  } catch (err) {
    console.error(`  ERROR: ${url} — ${err.message}`);
    return { url, localPath, status: 'error', error: err.message };
  }
}

async function downloadBatch(items, label) {
  console.log(`\nDownloading ${items.length} ${label}...`);
  const results = [];

  for (let i = 0; i < items.length; i += CONCURRENCY) {
    const batch = items.slice(i, i + CONCURRENCY);
    const batchResults = await Promise.all(
      batch.map(url => {
        const localPath = urlToLocalPath(url);
        return downloadFile(url, localPath);
      })
    );
    results.push(...batchResults);
    const done = Math.min(i + CONCURRENCY, items.length);
    process.stdout.write(`  ${done}/${items.length}\r`);
  }

  const ok = results.filter(r => r.status === 'ok').length;
  const failed = results.filter(r => r.status !== 'ok').length;
  console.log(`  Done: ${ok} ok, ${failed} failed`);
  return results;
}

async function main() {
  console.log('=== Framer Asset Downloader ===');
  console.log(`Site dir: ${SITE_DIR}`);

  const allResults = [];

  allResults.push(...await downloadBatch(JS_CHUNKS, 'JS chunks'));
  allResults.push(...await downloadBatch(MODULE_JS, 'module scripts'));
  allResults.push(...await downloadBatch(IMAGES, 'images'));
  allResults.push(...await downloadBatch(FONTS, 'fonts'));
  allResults.push(...await downloadBatch(OTHER_SCRIPTS, 'other scripts'));

  const totalOk = allResults.filter(r => r.status === 'ok').length;
  const totalFailed = allResults.filter(r => r.status !== 'ok').length;
  const totalSize = allResults.filter(r => r.status === 'ok').reduce((s, r) => s + r.size, 0);

  console.log(`\n=== Summary ===`);
  console.log(`Total: ${allResults.length} files`);
  console.log(`OK: ${totalOk}`);
  console.log(`Failed: ${totalFailed}`);
  console.log(`Total size: ${(totalSize / 1024 / 1024).toFixed(1)} MB`);

  if (totalFailed > 0) {
    console.log('\nFailed downloads:');
    allResults.filter(r => r.status !== 'ok').forEach(r => {
      console.log(`  ${r.url} -> ${r.status} ${r.code || r.error || ''}`);
    });
  }
}

main().catch(console.error);
