import { services, serviceCopy } from '../lib/services.mjs';
import { localizedPath } from './seo-page-data.mjs';

const esc = (value) => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');

// Shared fragments keep service discovery and inquiry instructions consistent.
export function serviceLinks(locale, basePath, slugs, heading = 'related') {
  const selected = slugs.map((slug) => {
    const service = services.find((item) => item.slug === slug);
    if (!service) throw new Error(`Unknown service link: ${slug}`);
    return service;
  });
  if (!selected.length) return '';
  return `<section class="related service-links"><h2>${esc(serviceCopy[locale][heading])}</h2><div class="related-grid">${selected.map((service) => `<a data-track="view_service" data-service="${esc(service.slug)}" href="${esc(`${basePath}/${localizedPath(locale, `services/${service.slug}`)}/`)}"><strong>${esc(service.names[locale])}</strong><small>${esc(service.descriptions[locale])}</small></a>`).join('')}</div></section>`;
}

export function inquiryBrief(locale) {
  const text = serviceCopy[locale];
  return `<h2>${esc(text.brief)}</h2><ul>${text.briefItems.map((item) => `<li>${esc(item)}</li>`).join('')}</ul><p>${esc(text.scope)}</p>`;
}
