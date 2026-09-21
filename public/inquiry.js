// Local preparation only. Sending is an explicit action in the visitor's email app.
(() => {
  const root = document.querySelector('[data-inquiry]');
  if (!root) return;
  const t = JSON.parse(root.dataset.copy);
  const form = root.querySelector('form');
  const review = root.querySelector('.inquiry-review');
  const preview = root.querySelector('.brief-preview');
  const status = root.querySelector('.inquiry-status');
  const email = root.dataset.email;
  let brief = '';
  form.hidden = false;
  form.addEventListener('submit', event => {
    event.preventDefault();
    let firstInvalid;
    for (const field of form.querySelectorAll('input,select,textarea')) {
      const missing = field.required && !field.value.trim();
      const invalid = missing || !field.validity.valid;
      field.setAttribute('aria-invalid', String(invalid));
      root.querySelector(`#error-${field.name}`).textContent = invalid ? (field.validity.typeMismatch ? t.invalidEmail : t.required) : '';
      if (invalid && !firstInvalid) firstInvalid = field;
    }
    if (firstInvalid) { firstInvalid.focus(); return; }
    const values = new FormData(form);
    brief = ['Maghakian Scripts', ...['name','email','type','brief','company','stage','timeline','budget'].filter(key => String(values.get(key)||'').trim()).map(key => `${t[key]}: ${String(values.get(key)).trim()}`)].join('\n\n');
    preview.textContent = brief;
    root.querySelector('[data-send-brief]').href = `mailto:${email}?subject=${encodeURIComponent(t.subject)}&body=${encodeURIComponent(brief)}`;
    form.hidden = true;
    review.hidden = false;
    status.textContent = '';
    review.querySelector('h2').focus();
  });
  root.querySelector('[data-edit-brief]').addEventListener('click', () => {
    review.hidden = true;
    form.hidden = false;
    form.querySelector('input').focus();
  });
  root.querySelector('[data-copy-brief]').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(brief); status.textContent = t.copied; }
    catch { status.textContent = t.copyFailed; }
  });
  root.querySelector('[data-download-brief]').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([brief], {type:'text/plain;charset=utf-8'}));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Maghakian-Scripts-project-brief.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
})();
