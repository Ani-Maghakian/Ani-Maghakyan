import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, existsSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { studioCopy } from '../lib/studio.mjs';
import { books } from '../lib/books.mjs';

const read = path => readFileSync(`dist/client/${path}index.html`, 'utf8');
const inquiryScript = readFileSync('public/inquiry.js', 'utf8');

for (const locale of ['hy','en','ru']) {
  const prefix = locale === 'hy' ? '' : `${locale}/`;
  test(`${locale}: studio identity, localized navigation and book URLs survive export`, () => {
    for (const tail of ['', 'services/', 'work-with-ani/', 'projects/paper-dream/', ...books.map(b=>`books/${b.slug}/`)]) {
      const doc = new JSDOM(read(`${prefix}${tail}`)).window.document;
      const brand = doc.querySelector('header .brand');
      assert.equal(brand.querySelector('img').alt,'Maghakian Scripts');
      assert.ok(brand.href.endsWith(`/Ani-Maghakyan/${prefix}`));
      assert.ok(doc.querySelector('header').textContent.includes(studioCopy[locale].start));
      assert.equal(doc.querySelectorAll('.mobile-language-options a').length,3);
      assert.equal(doc.querySelectorAll('h1').length,1);
      assert.equal(doc.querySelector('html').lang,locale === 'hy' ? 'hy-AM' : locale);
      assert.ok(doc.querySelector('link[rel=canonical]').href.endsWith(`${prefix}${tail}`));
    }
    for (const book of books) assert.ok(existsSync(`dist/client/${prefix}books/${book.slug}/index.html`));
  });
  test(`${locale}: inquiry validates, escapes user content and preserves it when editing`, () => {
    const dom = new JSDOM(read(`${prefix}work-with-ani/`), {runScripts:'outside-only',url:'https://example.com'});
    const w=dom.window, d=w.document;
    const form=d.querySelector('[data-inquiry] form');
    assert.equal(form.hidden,true,'No-JS fallback must not submit private fields through GET');
    w.eval(inquiryScript);
    assert.equal(form.hidden,false);
    form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
    assert.equal(d.activeElement.name,'name');
    assert.equal(d.querySelector('.inquiry-review').hidden,true);
    d.querySelector('[name=name]').value='Example Producer';
    d.querySelector('[name=email]').value='producer@example.com';
    d.querySelector('[name=type]').selectedIndex=1;
    d.querySelector('[name=brief]').value='<img src=x onerror=alert(1)>\nA film about returning home.';
    form.dispatchEvent(new w.Event('submit',{bubbles:true,cancelable:true}));
    assert.equal(d.querySelector('.inquiry-review').hidden,false);
    assert.equal(d.querySelector('.brief-preview img'),null);
    const url=new URL(d.querySelector('[data-send-brief]').href);
    assert.equal(url.protocol,'mailto:');
    assert.ok(url.searchParams.get('body').includes('<img src=x onerror=alert(1)>'));
    d.querySelector('[data-edit-brief]').click();
    assert.equal(form.hidden,false);
    assert.equal(d.querySelector('[name=email]').value,'producer@example.com');
    w.close();
  });
}
