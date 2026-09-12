// Lightweight progressive enhancement for the static portfolio homepage.
// The full portfolio, navigation and filmography remain usable/crawlable without this file.
(() => {
  const language = document.documentElement.lang || 'en';
  const locale = language.startsWith('hy') ? 'hy' : language.startsWith('ru') ? 'ru' : 'en';
  const label = (n) => {
    if (locale === 'hy') return `${n} արդյունք`;
    if (locale === 'en') return `${n} ${n === 1 ? 'result' : 'results'}`;
    const a = n % 10;
    const b = n % 100;
    const word = a === 1 && b !== 11
      ? 'результат'
      : a >= 2 && a <= 4 && (b < 12 || b > 14)
        ? 'результата'
        : 'результатов';
    return `${n} ${word}`;
  };

  const rows = [...document.querySelectorAll('.filmography-table tbody tr[id^="project-"]')];
  const buttons = [...document.querySelectorAll('.filter-button[data-filter]')];
  const input = document.querySelector('.search-field input[type="search"]');
  const count = document.querySelector('.result-count');
  const clear = document.querySelector('[data-clear-search]');
  const empty = document.querySelector('[data-empty-state]');
  let active = 'all';

  const apply = () => {
    const q = (input?.value || '').trim().toLocaleLowerCase(language);
    let visible = 0;
    for (const row of rows) {
      const text = (row.dataset.search || row.textContent || '').toLocaleLowerCase(language);
      const show = (active === 'all' || row.dataset.kind === active) && (!q || text.includes(q));
      row.hidden = !show;
      if (show) visible += 1;
    }
    if (count) count.textContent = label(visible);
    if (empty) empty.hidden = visible !== 0;
    if (clear) clear.hidden = !input?.value;
    for (const button of buttons) {
      const on = button.dataset.filter === active;
      button.dataset.active = String(on);
      button.setAttribute('aria-pressed', String(on));
    }
  };

  input?.addEventListener('input', apply, { passive: true });
  clear?.addEventListener('click', () => {
    if (!input) return;
    input.value = '';
    input.focus();
    apply();
  });
  for (const button of buttons) {
    button.addEventListener('click', () => {
      active = button.dataset.filter || 'all';
      apply();
    });
  }

  document.addEventListener('click', (event) => {
    const anchor = event.target.closest?.('a[href^="#"]');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.getElementById(decodeURIComponent(href.slice(1)));
    if (!target) return;
    event.preventDefault();
    const header = document.querySelector('.site-header');
    const offset = (header?.getBoundingClientRect().height || 64) + 28;
    const top = href === '#top'
      ? 0
      : Math.max(0, window.scrollY + target.getBoundingClientRect().top - offset);
    history.pushState(null, '', href);
    window.scrollTo({ top, left: 0, behavior: 'auto' });
    anchor.closest('details')?.removeAttribute('open');
  });

  document.querySelector('.mobile-menu')?.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      event.currentTarget.open = false;
      event.currentTarget.querySelector('summary')?.focus();
    }
  });

  document.querySelectorAll('.featured-poster').forEach((image) => {
    const showFallback = () => { image.hidden = true; };
    image.addEventListener('error', showFallback, { once: true });
    if (image.complete && !image.naturalWidth) showFallback();
  });
  apply();

  const grid = document.getElementById('featured-projects');
  document.querySelectorAll('.featured-scroll-controls button').forEach((button, index) => {
    button.addEventListener('click', () => {
      if (!grid) return;
      grid.scrollBy({
        left: (index === 0 ? -1 : 1) * grid.clientWidth * .9,
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      });
    });
  });
})();
