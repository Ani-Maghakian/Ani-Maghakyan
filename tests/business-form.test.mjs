import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';
import { businessForm, businessFormCopy } from '../scripts/business-form.mjs';
const handler = readFileSync('public/business-form.js', 'utf8');
const analytics = readFileSync('public/analytics.js', 'utf8');
function fixture(ok) {
  const dom = new JSDOM(businessForm('hy'), { url: 'https://www.maghakianscripts.com/work-with-ani/', runScripts: 'outside-only' });
  const { window: w } = dom;
  let requests = 0;
  w.fetch = async () => { requests++; return { ok }; };
  const f = w.document.querySelector('form');
  f.elements.company.value = 'Infrastructure test';
  f.elements['contact-person'].value = 'Test contact';
  f.elements.email.value = 'test@example.com';
  f.elements.service.value = 'showrunning';
  f.elements['business-description'].value = 'Format: TV. Episodes: 10. Deadline: 2027.';
  w.eval(analytics);
  w.eval(handler);
  return { w, f, dom, requests: () => requests };
}
const submit = async (w, f) => { f.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true })); await new Promise(resolve => setTimeout(resolve, 0)); };
const leads = w => w.dataLayer.filter(args => args[0] === 'event' && args[1] === 'generate_lead');
test('every locale requires policy acceptance and has no upload field', () => {
  for (const locale of ['hy', 'en', 'ru']) {
    const dom = new JSDOM(businessForm(locale));
    const doc = dom.window.document;
    assert.equal(doc.querySelectorAll('input[type=file]').length, 0);
    assert.ok(doc.querySelector('[name=policy-accepted]').required);
    assert.ok(doc.querySelector('[name=company]').required);
    assert.equal(doc.querySelector('textarea').maxLength, 1200);
    assert.equal(doc.querySelector('h2').textContent, businessFormCopy[locale].title);
    dom.window.close();
  }
  assert.doesNotMatch(businessFormCopy.hy.warning, /ավտոմատ ջնջ/);
});
test('unchecked policy prevents a request and a lead event', async () => {
  const x = fixture(true);
  await submit(x.w, x.f);
  assert.equal(x.requests(), 0);
  assert.equal(leads(x.w).length, 0);
  x.dom.window.close();
});
test('failed submission preserves fields, permits retry and emits no lead', async () => {
  const x = fixture(false);
  x.f.elements['policy-accepted'].checked = true;
  await submit(x.w, x.f);
  assert.equal(x.requests(), 1);
  assert.equal(leads(x.w).length, 0);
  assert.equal(x.f.querySelector('button').disabled, false);
  assert.equal(x.f.elements.company.value, 'Infrastructure test');
  assert.equal(x.f.querySelector('[role=status]').textContent, businessFormCopy.hy.error);
  x.dom.window.close();
});
test('successful submission emits one lead without personal or message content', async () => {
  const x = fixture(true);
  x.f.elements['policy-accepted'].checked = true;
  await submit(x.w, x.f);
  await submit(x.w, x.f);
  assert.equal(x.requests(), 1);
  assert.equal(leads(x.w).length, 1);
  assert.deepEqual(Object.keys(leads(x.w)[0][2]).sort(), ['form_name', 'page_path', 'transport_type']);
  assert.equal(x.f.elements.company.value, '');
  assert.equal(x.f.querySelector('[role=status]').textContent, businessFormCopy.hy.success);
  x.dom.window.close();
});
