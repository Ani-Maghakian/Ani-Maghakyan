import { services, serviceCopy } from '../lib/services.mjs';
import { localizedPath } from './seo-page-data.mjs';
import { conversionCopy } from '../lib/conversion-copy.mjs';

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
  const text = conversionCopy[locale];
  return `<h2>${esc(text.brief)}</h2><ul>${text.briefItems.map((item) => `<li>${esc(item)}</li>`).join('')}</ul><p>${esc(text.scope)}</p>`;
}

export function projectInquiry(locale, basePath, project) {
  const text = conversionCopy[locale];
  const href = `${basePath}/${localizedPath(locale, 'work-with-ani')}/?project=${encodeURIComponent(project.slug)}`;
  return `<section class="related project-inquiry" aria-labelledby="project-inquiry-heading"><h2 id="project-inquiry-heading">${esc(text.projectHeading)}</h2><p>${esc(['series', 'film'].includes(project.kind) ? text.projectText : text.stageText)}</p><div class="cta"><a data-track="view_contact" data-project="${esc(project.slug)}" data-source="project" href="${esc(href)}">${esc(text.projectCta)}</a></div></section>`;
}

export function bookPurchaseLinks(book, locale) {
  if (!book.retailers?.length) return '';
  const text = conversionCopy[locale];
  return `<section class="book-purchase" aria-labelledby="buy-${esc(book.slug)}"><h3 id="buy-${esc(book.slug)}">${esc(text.buy)}</h3><p>${esc(text.retailerNote)}</p><div class="cta">${book.retailers.map((retailer, index) => `<a${index ? ' class="secondary"' : ''} data-track="book_retailer_click" data-book="${esc(book.slug)}" data-edition="${retailer.edition}" data-retailer="${esc(retailer.name)}" href="${esc(retailer.url)}" target="_blank" rel="noopener noreferrer">${esc(text[retailer.labelKey])}</a>`).join('')}</div></section>`;
}

