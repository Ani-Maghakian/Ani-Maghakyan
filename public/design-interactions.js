// Lightweight progress and a single shared menu behavior. No scroll-driven image crops.
(() => {
  const progress = document.querySelector('.scroll-progress');
  let queued = false;
  const update = () => {
    queued = false;
    if (progress) progress.style.width = `${Math.min(100, 100 * scrollY / Math.max(1, document.documentElement.scrollHeight-innerHeight))}%`;
  };
  const schedule = () => { if (!queued) { queued=true; requestAnimationFrame(update); } };
  if (progress) { addEventListener('scroll', schedule, {passive:true}); addEventListener('resize', schedule, {passive:true}); update(); }
  document.querySelectorAll('.mobile-menu').forEach(menu => {
    menu.addEventListener('keydown', event => { if(event.key==='Escape'){menu.open=false;menu.querySelector('summary').focus();} });
    menu.addEventListener('click', event => {if(event.target.closest('a'))menu.open=false;});
    document.addEventListener('click',event=>{if(!menu.contains(event.target))menu.open=false;});
  });
})();
