/* Shared motion: native scroll, bounded parallax, and non-hiding reveals. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const hero = document.querySelector('.landscape-hero');
  const stage = document.querySelector('.landscape-stage');
  const back = document.querySelector('.landscape-back');
  const middle = document.querySelector('.landscape-middle');
  const front = document.querySelector('.landscape-front');
  let queued = false;
  function draw() {
    queued = false;
    if (!hero || !stage || !back || !middle || !front) return;
    const progress = Math.max(0, Math.min(1, -hero.getBoundingClientRect().top / Math.max(1, hero.offsetHeight)));
    back.style.transform = reduced.matches ? 'none' : `translate3d(0,${progress * stage.offsetHeight * .62}px,0)`;
    middle.style.transform = reduced.matches ? 'none' : `translate3d(0,${progress * stage.offsetHeight * .24}px,0)`;
    front.style.transform = reduced.matches ? 'none' : `scale(${1 + progress * .18})`;
  }
  function schedule() { if (!queued) { queued = true; requestAnimationFrame(draw); } }
  if (hero) {
    addEventListener('scroll', schedule, { passive: true });
    addEventListener('resize', schedule, { passive: true });
    new ResizeObserver(schedule).observe(hero);
    reduced.addEventListener('change', schedule);
    draw();
  }
  if (!reduced.matches && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.remove('reveal-pending');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .08 });
    document.querySelectorAll('.featured-card,.writing-entry,.writing-preview article,.book-card,.related-grid>a,.project-grid>a,.source-grid li').forEach(element => {
      if (element.getBoundingClientRect().top < innerHeight) return;
      element.classList.add('reveal-ready', 'reveal-pending');
      observer.observe(element);
    });
  }
})();
