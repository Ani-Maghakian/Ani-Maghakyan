/* Native, reversible scroll motion. Content remains visible without JavaScript. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const hero = document.querySelector('.landscape-hero');
  const stage = document.querySelector('.landscape-stage');
  const back = document.querySelector('.landscape-back');
  const middle = document.querySelector('.landscape-middle');
  const front = document.querySelector('.landscape-front');
  const clamp = value => Math.max(0, Math.min(1, value));
  const texts = [...document.querySelectorAll('main h2,.section-heading p,.featured-copy h3,.writing-preview h3,.prose>p,.prose>h3,.bio-lead,.author-intro p:not(.eyebrow):not(.roles),.writing-preview blockquote,.writing-entry blockquote')];
  const images = [...document.querySelectorAll('.author-intro img,.featured-poster,.hero-media img,.catalog-poster')];
  const cards = [...document.querySelectorAll('.writing-preview article,.book-card,.source-grid li,.service-card')];
  const targets = [...texts, ...images, ...cards];
  const active = new Set(targets);
  const originalBackground = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#101211';
  let queued = false;
  texts.forEach(el => el.classList.add('scroll-text'));
  images.forEach(el => el.classList.add('scroll-image'));
  cards.forEach(el => el.classList.add('scroll-card'));
  function draw() {
    queued = false;
    const still = reduced.matches;
    const height = Math.max(1, innerHeight);
    // Read all geometry before changing styles to avoid layout thrashing.
    const frames = [...active].map(el => ({el, top:el.getBoundingClientRect().top}));
    const progress = hero ? clamp(-hero.getBoundingClientRect().top / Math.max(1, hero.offsetHeight)) : 0;
    const stageHeight = stage ? stage.offsetHeight : 0;
    const pageProgress = clamp(scrollY / Math.max(1, document.documentElement.scrollHeight - height));
    if (hero && stage && back && middle && front) {
      back.style.transform = still ? 'none' : `translate3d(0,${progress * stageHeight * .62}px,0)`;
      middle.style.transform = still ? 'none' : `translate3d(0,${progress * stageHeight * .24}px,0)`;
      front.style.transform = still ? 'none' : `scale(${1 + progress * .18})`;
    }
    for (const {el, top} of frames) {
      const isText = el.classList.contains('scroll-text');
      const p = still ? 1 : clamp((height * (isText ? .82 : .94) - top) / (height * (isText ? .47 : .49)));
      el.style.setProperty('--reveal', p.toFixed(4));
      if (el.classList.contains('scroll-image')) {
        // Posters expand to their full original frame; portraits settle from a close-up.
        const portrait = !!el.closest('.author-intro');
        el.style.setProperty('--image-scale', String(portrait ? 1 + (1-p)*.08 : .96 + p*.04));
        el.style.setProperty('--image-inset', `${(1-p)*10}%`);
      }
    }
    // Dusk charcoal -> muted forest -> plum charcoal, all within the existing palette.
    const stops = [[16,18,17],[23,31,28],[29,24,29]];
    const segment = Math.min(1, Math.floor(pageProgress * 2));
    const mix = pageProgress * 2 - segment;
    const rgb = stops[segment].map((value,i) => Math.round(value+(stops[segment+1][i]-value)*mix));
    document.documentElement.style.setProperty('--bg', still ? originalBackground : `rgb(${rgb.join(',')})`);
  }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(draw); } }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) active.add(entry.target);
        else active.delete(entry.target);
      }
      schedule();
    }, {rootMargin:'160px 0px'});
    targets.forEach(el => observer.observe(el));
  }
  addEventListener('scroll', schedule, {passive:true});
  addEventListener('resize', schedule, {passive:true});
  addEventListener('pageshow', schedule);
  addEventListener('load', schedule);
  reduced.addEventListener('change', () => {
    targets.forEach(el => active.add(el));
    schedule();
  });
  if ('ResizeObserver' in window) new ResizeObserver(schedule).observe(document.body);
  draw();
})();
