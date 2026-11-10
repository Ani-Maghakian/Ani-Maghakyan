// Production-only GA4. Do not send query strings, email addresses or form text.
(() => {
  if (!['www.maghakianscripts.com', 'maghakianscripts.com'].includes(location.hostname)) return;
  const measurementId = 'G-G9C0EQTK8K';
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  gtag('js', new Date());
  gtag('config', measurementId, {
    page_location: location.origin + location.pathname,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    transport_type: 'beacon',
  });
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
  document.head.append(script);
  document.addEventListener('business-inquiry:submitted', () => {
    gtag('event', 'generate_lead', {
      page_path: location.pathname,
      form_name: 'business-inquiry',
      transport_type: 'beacon',
    });
  });
  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[data-track]');
    if (!link) return;
    const name = link.dataset.track;
    if (!['view_contact', 'book_retailer_click', 'contact_email', 'contact_instagram'].includes(name)) return;
    const params = { page_path: location.pathname, transport_type: 'beacon' };
    for (const key of ['service', 'project', 'source', 'book', 'edition', 'retailer']) {
      if (link.dataset[key]) params[key] = link.dataset[key];
    }
    if (name.startsWith('contact_')) params.contact_method = name.slice(8);
    gtag('event', name === 'book_retailer_click' ? name : 'view_contact', params);
  });
})();
