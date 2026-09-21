// Progressive enhancement: navigation and project pages also work without JS.
document.querySelectorAll('.hero-media img').forEach((image) => {
  const showFallback = () => { image.hidden = true; };
  image.addEventListener('error', showFallback);
  if (image.complete && image.naturalWidth === 0) showFallback();
});

// Keep the full media archive readable and linked when JavaScript is unavailable.
document.querySelectorAll('.press-archive').forEach((archive) => {
  const controls = archive.querySelector('.archive-search-controls');
  const form = archive.querySelector('.archive-search');
  const input = archive.querySelector('.archive-search-input');
  const clear = archive.querySelector('.archive-search-clear');
  const count = archive.querySelector('.archive-result-count');
  const empty = archive.querySelector('.archive-empty');
  if (!controls || !form || !input || !clear || !count || !empty) return;

  const normalize = (value) => value.normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();
  const entries = [...archive.querySelectorAll('.media-entry')].map((element) => ({ element, text: normalize(element.dataset.archiveSearch || element.textContent) }));
  const groups = [...archive.querySelectorAll('.media-group')];
  const update = () => {
    const query = normalize(input.value);
    const terms = query ? query.split(/\s+/u) : [];
    let visible = 0;
    entries.forEach(({ element, text }) => {
      element.hidden = !terms.every((term) => text.includes(term));
      if (!element.hidden) visible += 1;
    });
    groups.forEach((group) => {
      group.hidden = ![...group.querySelectorAll('.media-entry')].some((entry) => !entry.hidden);
    });
    count.textContent = count.dataset.resultTemplate.replace('{count}', String(visible)).replace('{total}', String(entries.length));
    empty.hidden = visible > 0;
    clear.hidden = input.value.length === 0;
  };
  input.addEventListener('input', update);
  // Some browsers fire search rather than input for the native search-field clear.
  input.addEventListener('search', update);
  form.addEventListener('submit', (event) => event.preventDefault());
  clear.addEventListener('click', () => {
    input.value = '';
    update();
    input.focus();
  });
  archive.querySelectorAll('.archive-nav a').forEach((link) => {
    link.addEventListener('click', () => {
      if (input.value) {
        input.value = '';
        update();
      }
    });
  });
  update();
  controls.hidden = false;
});
