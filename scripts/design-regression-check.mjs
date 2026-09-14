import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { JSDOM } from 'jsdom';
const base = 'dist/client';
const urls = [...readFileSync(`${base}/sitemap.xml`, 'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
const prefix = new URL(urls[0]).pathname;
for (const url of urls) {
  const tail = new URL(url).pathname.slice(prefix.length);
  const html = readFileSync(`${base}/${tail}index.html`, 'utf8');
  const document = new JSDOM(html).window.document;
  assert(document.querySelector('link[href$="/site-theme.css"]'), url);
  assert(document.querySelector('script[src$="/design-interactions.js"]'), url);
  assert(!document.querySelector('link[href$="/inner-pages.css"]'), url);
  for (const el of document.querySelectorAll('img[src^="/"]')) {
    const source = el.getAttribute('src').replace(prefix, '');
    assert(existsSync(`${base}/${source}`), `${url}: ${source}`);
  }
}
for (const height of [160, 389]) {
  const dom = new JSDOM('<section class="landscape-hero"><div class="landscape-stage"><img class="landscape-back"><img class="landscape-middle"><img class="landscape-front"></div></section>', {runScripts:'outside-only'});
  const w = dom.window;
  const media = {matches:false,addEventListener(){}};
  w.matchMedia = () => media;
  w.ResizeObserver = class {observe(){}};
  w.requestAnimationFrame = fn => fn();
  const hero = w.document.querySelector('.landscape-hero');
  hero.getBoundingClientRect = () => ({top:-350});
  Object.defineProperty(hero,'offsetHeight',{value:700});
  Object.defineProperty(w.document.querySelector('.landscape-stage'),'offsetHeight',{value:height});
  w.eval(readFileSync('public/design-interactions.js','utf8'));
  assert.equal(w.document.querySelector('.landscape-back').style.transform,`translate3d(0,${height*.31}px,0)`);
  assert.equal(w.document.querySelector('.landscape-front').style.transform,'scale(1.09)');
  media.matches = true;
  w.dispatchEvent(new w.Event('scroll'));
  assert.equal(w.document.querySelector('.landscape-back').style.transform,'none');
  w.close();
}
console.log(`Verified shared theme, motion script and local images on ${urls.length} pages; desktop/mobile parallax and reduced-motion behavior.`);
