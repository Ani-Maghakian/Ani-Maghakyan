// Progressive enhancement: navigation and project pages also work without JS.
document.querySelectorAll('.hero-media img').forEach((image) => {
  const showFallback = () => { image.hidden = true; };
  image.addEventListener('error', showFallback);
  if (image.complete && image.naturalWidth === 0) showFallback();
});

document.querySelectorAll('.mobile-menu').forEach((menu) => {
  menu.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      menu.open = false;
      menu.querySelector('summary').focus();
    }
  });
  menu.addEventListener('click', (event) => {
    if (event.target.closest('a')) menu.open = false;
  });
  document.addEventListener('click', (event) => {
    if (!menu.contains(event.target)) menu.open = false;
  });
});
