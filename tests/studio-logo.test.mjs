import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { JSDOM } from 'jsdom';
import { homeHero } from '../lib/site-copy.mjs';

test('web wordmarks contain scalable paths with no bitmap rendering layers', () => {
  for (const variant of ['dark', 'light']) {
    const svg = readFileSync(`public/brand/maghakian-scripts-${variant}.svg`, 'utf8');
    const doc = new JSDOM(svg, {contentType:'image/svg+xml'}).window.document;
    assert.ok(doc.querySelectorAll('path').length > 0);
    assert.equal(doc.querySelectorAll('image,filter,mask,foreignObject').length, 0);
    assert.ok(!svg.includes('base64'));
  }
});

test('the original landscape layout presents the studio and its founder in every language', () => {
  for (const locale of ['hy', 'en', 'ru']) {
    const prefix = locale === 'hy' ? '' : `${locale}/`;
    const doc = new JSDOM(readFileSync(`dist/client/${prefix}index.html`, 'utf8')).window.document;
    assert.equal(doc.querySelector('.landscape-hero h1').textContent, homeHero[locale].heading);
    assert.ok(doc.querySelector('.landscape-hero').textContent.includes(homeHero[locale].intro));
    assert.ok(doc.querySelector('.author-intro').textContent.includes(homeHero[locale].founderRole));
    assert.ok(doc.querySelector('.wordmark img').getAttribute('src').endsWith('?v=vector-1'));
    assert.equal(doc.querySelectorAll('.landscape-layer').length, 3);
  }
});
