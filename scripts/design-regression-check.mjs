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
  assert([...document.querySelectorAll('link[href]')].some((el) => new URL(el.href, url).pathname.endsWith('/site-theme.css')), url);
  assert([...document.querySelectorAll('script[src]')].some((el) => new URL(el.src, url).pathname.endsWith('/design-interactions.js')), url);
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

// Verify reversibility and the live reduced-motion preference on non-home pages.
{
  const dom = new JSDOM('<main><h2>Հայերեն Русский English</h2><figure class="hero-media"><img alt="Original poster"></figure></main>', {runScripts:'outside-only'});
  const w = dom.window;
  let preferenceChanged;
  const media = {matches:false,addEventListener(_event, callback){preferenceChanged=callback;}};
  w.matchMedia = () => media;
  w.ResizeObserver = class {observe(){}};
  w.requestAnimationFrame = fn => fn();
  Object.defineProperty(w,'innerHeight',{value:800});
  const heading = w.document.querySelector('h2');
  const poster = w.document.querySelector('img');
  let top = 750;
  heading.getBoundingClientRect = poster.getBoundingClientRect = () => ({top});
  w.eval(readFileSync('public/design-interactions.js','utf8'));
  const initial = Number(heading.style.getPropertyValue('--reveal'));
  assert(initial < .1);
  top = 500;
  w.dispatchEvent(new w.Event('scroll'));
  const middleProgress = Number(heading.style.getPropertyValue('--reveal'));
  assert(middleProgress > initial && middleProgress < 1);
  assert(middleProgress < Number(poster.style.getPropertyValue('--reveal')), 'Text illumination should finish later than image reveal');
  top = 240;
  w.dispatchEvent(new w.Event('scroll'));
  assert.equal(heading.style.getPropertyValue('--reveal'),'1.0000');
  assert.equal(poster.style.getPropertyValue('--image-inset'),'0%');
  assert.equal(poster.style.getPropertyValue('--image-scale'),'1');
  top = 750;
  w.dispatchEvent(new w.Event('scroll'));
  assert.equal(Number(heading.style.getPropertyValue('--reveal')),initial);
  media.matches = true;
  preferenceChanged();
  assert.equal(heading.style.getPropertyValue('--reveal'),'1.0000');
  assert.equal(poster.style.getPropertyValue('--image-inset'),'0%');
  assert.equal(w.document.documentElement.style.getPropertyValue('--bg'),'#101211');
  assert.equal(heading.textContent,'Հայերեն Русский English');
  w.close();
}
console.log('Verified progressive/reversible text and image reveals, intact multilingual text, full poster framing, and live reduced-motion reset on inner pages.');
