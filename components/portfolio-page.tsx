import type { ReactNode } from "react";
import {
  copy,
  locales,
  projects,
  siteLinks,
  sourceLinks,
  updatedIso,
  type Locale,
  type ProjectKind,
} from "@/lib/content";
import { basePath } from "@/lib/seo";
import { interfaceCopy, sectionLinks, resultLabel, publicContactEmail } from "@/lib/site-copy.mjs";

type Filter = "all" | ProjectKind;

function padded(value: number) {
  return String(value).padStart(2, "0");
}

function projectPageHref(locale: Locale, slug?: string) {
  if (!slug) return null;
  const localeRoot = `${basePath}${locales[locale].href}`;
  return `${localeRoot}${localeRoot.endsWith("/") ? "" : "/"}projects/${slug}/`;
}

function posterSource(poster?: string) {
  if (!poster) return null;
  return poster.startsWith("/") ? `${basePath}${poster}` : poster;
}

function ExternalLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a className={`external-link ${className}`} href={href} target="_blank" rel="noopener noreferrer">
      <span>{children}</span>
      <span aria-hidden="true">↗</span>
    </a>
  );
}

function interactionScript(locale: Locale) {
  const labels = Object.fromEntries(
    Array.from({ length: projects.length + 1 }, (_, count) => [count, resultLabel(count, locale)]),
  );

  const source = `(() => {
    const resultLabels = ${JSON.stringify(labels)};
    const headerOffset = () => (document.querySelector('.site-header')?.getBoundingClientRect().height || 64) + 28;
    function stableAnchorJump(targetId) {
      const target = document.getElementById(targetId);
      if (!target) return;
      const top = targetId === 'top' ? 0 : Math.max(0, window.scrollY + target.getBoundingClientRect().top - headerOffset());
      window.history.pushState(null, '', '#' + targetId);
      window.scrollTo({ top, left: 0, behavior: "auto" });
    }

    document.addEventListener('click', (event) => {
      const anchor = event.target.closest?.('a[href^="#"]');
      if (anchor) {
        const id = decodeURIComponent(anchor.getAttribute('href').slice(1));
        if (id && document.getElementById(id)) {
          event.preventDefault();
          stableAnchorJump(id);
        }
      }

      const filterButton = event.target.closest?.('[data-filmography-filter]');
      if (filterButton) {
        document.querySelectorAll('[data-filmography-filter]').forEach((button) => {
          const active = button === filterButton;
          button.dataset.active = String(active);
          button.setAttribute('aria-pressed', String(active));
        });
        applyFilmography();
      }

      const clear = event.target.closest?.('[data-clear-search]');
      if (clear) {
        const input = document.querySelector('[data-filmography-search]');
        if (input) {
          input.value = '';
          input.focus();
          applyFilmography();
        }
      }

      const scrollButton = event.target.closest?.('[data-featured-direction]');
      if (scrollButton) {
        const grid = document.getElementById('featured-projects');
        if (grid) {
          const direction = Number(scrollButton.dataset.featuredDirection || 0);
          const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
          grid.scrollBy({ left: direction * grid.clientWidth * .9, behavior });
        }
      }

      const menuLink = event.target.closest?.('.mobile-menu nav a');
      if (menuLink) menuLink.closest('details')?.removeAttribute('open');
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      const menu = document.querySelector('.mobile-menu[open]');
      if (!menu) return;
      menu.removeAttribute('open');
      menu.querySelector('summary')?.focus();
    });

    const searchInput = document.querySelector('[data-filmography-search]');
    searchInput?.addEventListener('input', applyFilmography, { passive: true });

    function applyFilmography() {
      const input = document.querySelector('[data-filmography-search]');
      const query = (input?.value || '').trim().toLocaleLowerCase(${JSON.stringify(locale)});
      const active = document.querySelector('[data-filmography-filter][data-active="true"]');
      const kind = active?.dataset.filmographyFilter || 'all';
      let visible = 0;

      document.querySelectorAll('[data-project-row]').forEach((row) => {
        const matchesKind = kind === 'all' || row.dataset.kind === kind;
        const matchesQuery = !query || (row.dataset.search || '').includes(query);
        const show = matchesKind && matchesQuery;
        row.hidden = !show;
        if (show) visible += 1;
      });

      const count = document.querySelector('[data-result-count]');
      if (count) count.textContent = resultLabels[visible] || String(visible);
      const empty = document.querySelector('[data-empty-state]');
      if (empty) empty.hidden = visible !== 0;
      const clear = document.querySelector('[data-clear-search]');
      if (clear) clear.hidden = !input?.value;
    }
  })();`;

  return source.replace(/</g, "\\u003c");
}

export function PortfolioPage({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const ui = interfaceCopy[locale];
  const localeRoot = `${basePath}${locales[locale].href}`;
  const contactEmail = publicContactEmail(process.env.NEXT_PUBLIC_CONTACT_EMAIL);
  const featured = projects
    .filter((project) => project.featuredRank)
    .sort((a, b) => (a.featuredRank ?? 0) - (b.featuredRank ?? 0));
  const filters = Object.keys(t.filters) as Filter[];

  return (
    <div className="site-shell" id="top" lang={locale === "hy" ? "hy-AM" : locale}>
      <div className="scroll-progress" aria-hidden="true" />
      <div className="archive-binding" aria-hidden="true">
        <span className="binding-line" />
        <span className="binding-eyelet" />
        <span className="binding-knot" />
      </div>

      <a className="skip-link" href="#main-content">{ui.skip}</a>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label={t.title}>
          <span>A.</span> MAGHAKYAN
        </a>

        <nav className="primary-nav" aria-label={t.primaryNavLabel}>
          <a href="#selected">{t.nav.work}</a>
          <a href="#filmography">{t.nav.filmography}</a>
          <a href={`${localeRoot}services/`}>{sectionLinks.find((item) => item.slug === "services")?.labels[locale] ?? "Services"}</a>
          <a href="#about">{t.nav.about}</a>
          <a href="#sources">{t.nav.sources}</a>
          <a href="#contact">{t.nav.contact}</a>
        </nav>

        <nav className="language-nav" aria-label={t.languageNavLabel}>
          {(Object.keys(locales) as Locale[]).map((code) => (
            <a
              key={code}
              href={`${basePath}${locales[code].href}`}
              hrefLang={locales[code].hrefLang}
              aria-label={locales[code].label}
              aria-current={code === locale ? "page" : undefined}
            >
              {locales[code].short}
            </a>
          ))}
        </nav>

        <details className="mobile-menu">
          <summary aria-label={ui.menu}><span aria-hidden="true">☰</span></summary>
          <nav aria-label={t.primaryNavLabel}>
            <a href="#selected">{t.nav.work}</a>
            <a href="#filmography">{t.nav.filmography}</a>
            <a href="#contact">{ui.collaborate}</a>
            {sectionLinks.filter((item) => item.slug !== "projects" && item.slug !== "work-with-ani").map((item) => (
              <a key={item.slug} href={`${localeRoot}${item.slug}/`}>{item.labels[locale]}</a>
            ))}
          </nav>
        </details>
      </header>

      <main id="main-content">
        <section className="hero section-frame" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="script-note" aria-hidden="true">
              <span>FADE IN:</span>
              <span>INT. WRITER&apos;S ROOM — DAY</span>
              <span>A story waits on paper.</span>
            </div>
            <p className="eyebrow">{t.eyebrow}</p>
            <h1 id="hero-title">{t.title}</h1>
            <p className="name-aliases">{t.aliases}</p>
            <p className="hero-statement">{t.hero}</p>
            <p className="roles">{t.roles}</p>
            <p className="hero-intro">{ui.shortIntro}</p>

            <div className="hero-actions">
              <a className="primary-action" href="#selected">{ui.work}<span aria-hidden="true">↘</span></a>
              <a className="secondary-action" href="#contact">{ui.collaborate}</a>
            </div>
          </div>

          <figure className="hero-art">
            <a className="hero-art-crop" href="#selected" aria-label={`${t.selectedTitle}: ${t.title}`}>
              <picture>
                <img
                  src={`${basePath}/ani-3180-web.jpg`}
                  alt={t.imageAlt}
                  width="1200"
                  height="1799"
                  fetchPriority="high"
                  decoding="async"
                />
              </picture>
            </a>
            <figcaption>PORTFOLIO · 2026</figcaption>
            <span className="edge-number" aria-hidden="true">01 / 11</span>
          </figure>

          <div className="archive-flap" aria-hidden="true"><span>A WRITER&apos;S ARCHIVE</span></div>
          <div className="hero-scroll" aria-hidden="true"><span>SCROLL</span><i /></div>
        </section>

        <section className="stats-strip section-frame" aria-label={ui.statistics}>
          {t.stats.map((stat, index) => (
            <div className="stat" key={stat.label}>
              <span className="stat-index">{padded(index + 1)}</span>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </section>

        <section className="section-block section-frame" id="selected" aria-labelledby="selected-title">
          <div className="section-heading">
            <p className="eyebrow">{t.selectedKicker}</p>
            <div><h2 id="selected-title">{t.selectedTitle}</h2><p>{t.selectedIntro}</p></div>
          </div>

          <div className="featured-grid" id="featured-projects">
            {featured.map((project, index) => {
              const internalHref = projectPageHref(locale, project.seoSlug) ?? `#project-${project.id}`;
              const posterSrc = posterSource(project.poster);
              return (
                <article className={`featured-card tone-${(index % 4) + 1}`} key={project.id}>
                  {posterSrc && (
                    <a className="featured-poster-link" href={internalHref} data-track="view_project" data-project={project.seoSlug} aria-label={`${ui.details}: ${project.title[locale]}`}>
                      <span className="featured-poster-backdrop" aria-hidden="true" style={{ backgroundImage: `url("${posterSrc}")` }} />
                      <span className="poster-fallback" aria-hidden="true">{project.title[locale]}</span>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img className="featured-poster" src={posterSrc} alt={`${project.title[locale]} — ${project.year}`} loading="lazy" decoding="async" width="640" height="400" />
                      <span className="featured-play" aria-hidden="true">↗</span>
                    </a>
                  )}
                  <div className="featured-meta"><span>{padded(index + 1)}</span><span>{project.year}</span></div>
                  <div className="featured-copy">
                    <h3><a className="project-title-link" data-track="view_project" data-project={project.seoSlug} href={internalHref}>{project.title[locale]}</a></h3>
                    <p>{project.featuredDetail?.[locale] ?? project.credit[locale]}</p>
                    {project.watchUrl && (
                      <a className="project-watch" data-track="watch_project" data-project={project.seoSlug} href={project.watchUrl} target="_blank" rel="noopener noreferrer">
                        <span aria-hidden="true">▶</span><span>{project.watchKind === "youtube" ? t.watchYoutube : t.openProject}</span><span aria-hidden="true">↗</span>
                      </a>
                    )}
                  </div>
                  <span className="format-mark">{t.filters[project.kind].toUpperCase()}</span>
                  <span className="card-stamp" aria-hidden="true">FILE · {padded(project.id)}</span>
                </article>
              );
            })}
          </div>

          <div className="featured-scroll-controls">
            <button type="button" data-featured-direction="-1" aria-controls="featured-projects" aria-label={locale === "hy" ? "Նախորդ աշխատանքները" : locale === "ru" ? "Предыдущие работы" : "Previous works"}>‹</button>
            <button type="button" data-featured-direction="1" aria-controls="featured-projects" aria-label={locale === "hy" ? "Հաջորդ աշխատանքները" : locale === "ru" ? "Следующие работы" : "Next works"}>›</button>
          </div>
          <span className="section-tab" aria-hidden="true">02 / 07</span>
        </section>

        <section className="archive-section section-frame" id="filmography" aria-labelledby="archive-title">
          <div className="section-heading archive-heading">
            <p className="eyebrow">{t.archiveKicker}</p>
            <div><h2 id="archive-title">{t.archiveTitle}</h2><p>{t.archiveIntro}</p></div>
          </div>

          <div className="archive-controls">
            <label className="search-field">
              <span className="sr-only">{t.search}</span>
              <span aria-hidden="true">⌕</span>
              <input data-filmography-search type="search" placeholder={t.search} autoComplete="off" />
              <button hidden data-clear-search className="clear-search" type="button" aria-label={ui.clear}>×</button>
            </label>

            <div className="filter-row" role="group" aria-label={ui.format}>
              {filters.map((item) => (
                <button key={item} type="button" className="filter-button" data-filmography-filter={item} data-active={item === "all" ? "true" : "false"} aria-pressed={item === "all"}>
                  {t.filters[item]}
                </button>
              ))}
            </div>
          </div>

          <p className="result-count" aria-live="polite" data-result-count>{resultLabel(projects.length, locale)}</p>

          <div className="filmography-table-wrap">
            <table className="filmography-table">
              <thead><tr><th scope="col">{t.table.number}</th><th scope="col">{t.table.project}</th><th scope="col">{t.table.year}</th><th scope="col">{t.table.format}</th></tr></thead>
              <tbody>
                {projects.map((project) => {
                  const internalHref = projectPageHref(locale, project.seoSlug);
                  const searchable = [project.title.hy, project.title.en, project.title.ru, project.year, project.credit.hy, project.credit.en, project.credit.ru].join(" ").toLocaleLowerCase(locale);
                  return (
                    <tr id={`project-${project.id}`} key={project.id} data-project-row data-kind={project.kind} data-search={searchable}>
                      <td data-label={t.table.number}>{padded(project.id)}</td>
                      <th data-label={t.table.project} scope="row">
                        <span className="project-title-cell">
                          {internalHref ? <a className="project-title-link" data-track="view_project" data-project={project.seoSlug} href={internalHref}>{project.title[locale]}</a> : <span>{project.title[locale]}</span>}
                          {project.watchUrl && (
                            <a className="project-watch-mini" data-track="watch_project" data-project={project.seoSlug} href={project.watchUrl} target="_blank" rel="noopener noreferrer" aria-label={`${t.watchProject}: ${project.title[locale]}`} title={t.watchProject}><span aria-hidden="true">▶</span></a>
                          )}
                        </span>
                      </th>
                      <td data-label={t.table.year}>{project.year}</td>
                      <td data-label={t.table.format}>{project.credit[locale]}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p hidden className="empty-state" data-empty-state>{t.noResults}</p>
          </div>
          <span className="section-tab" aria-hidden="true">03 / 07</span>
        </section>

        <section className="about-section section-frame" id="about" aria-labelledby="about-title">
          <div className="about-intro">
            <p className="eyebrow">{t.aboutKicker}</p><h2 id="about-title">{t.aboutTitle}</h2><p className="bio-lead">{t.bio}</p><p className="bio-note">{t.philosophy}</p>
          </div>
          <div className="about-columns">
            <article><span className="column-number">01</span><h3>{t.educationTitle}</h3><ul>{t.education.map((item) => <li key={item}>{item}</li>)}</ul></article>
            <article><span className="column-number">02</span><h3>{t.practiceTitle}</h3><ul>{t.practice.map((item) => <li key={item}>{item}</li>)}</ul></article>
            <article><span className="column-number">03</span><h3>{t.booksTitle}</h3><ul>{t.books.map((item, index) => <li key={item}><a href={`${localeRoot}books/#${index === 0 ? "temporary-stop" : "topsy-turvy"}`}>{item}</a></li>)}</ul></article>
          </div>
          <span className="section-tab" aria-hidden="true">04 / 07</span>
        </section>

        <section className="sources-section section-frame" id="sources" aria-labelledby="sources-title">
          <div className="section-heading"><p className="eyebrow">{t.sourcesKicker}</p><div><h2 id="sources-title">{t.sourcesTitle}</h2><p>{t.sourcesIntro}</p></div></div>
          <ol className="source-grid">
            {sourceLinks.map((source) => (
              <li key={source.id}><span className="source-number">{padded(source.id)}</span><div><span className="source-kind">{source.kind[locale]}</span><h3>{source.label}</h3><p>{source.note[locale]}</p></div><ExternalLink href={source.href}>{t.visitSource}</ExternalLink></li>
            ))}
          </ol>
          <p className="source-method">{t.sourcesMethod}</p><span className="section-tab" aria-hidden="true">05 / 07</span>
        </section>

        <section className="faq-section section-frame" aria-labelledby="faq-title">
          <div className="section-heading"><p className="eyebrow">{t.faqKicker}</p><div><h2 id="faq-title">{t.faqTitle}</h2></div></div>
          <div className="faq-list">
            {t.faqs.map((item, index) => <details key={item.q}><summary><span>{padded(index + 1)}</span><strong>{item.q}</strong><i aria-hidden="true" /></summary><p>{item.a}</p></details>)}
          </div>
          <span className="section-tab" aria-hidden="true">06 / 07</span>
        </section>

        <section className="contact-section section-frame" id="contact" aria-labelledby="contact-title">
          <p className="eyebrow">{t.contactKicker}</p><h2 id="contact-title">{t.contactTitle}</h2><p>{t.contactText}</p><p className="contact-hint">{ui.contactHint}</p>
          <div className="contact-actions">
            {contactEmail && <a className="contact-button" data-track="contact_email" href={`mailto:${contactEmail}`}>{ui.email}<span aria-hidden="true">↗</span></a>}
            <a className={contactEmail ? "secondary-action" : "contact-button"} data-track="contact_instagram" href={siteLinks.instagram} target="_blank" rel="noopener noreferrer">{ui.instagram}<span aria-hidden="true">↗</span></a>
          </div>
          <span className="contact-edge" aria-hidden="true">07 / 07</span>
        </section>
      </main>

      <footer className="site-footer section-frame">
        <div><strong>A. MAGHAKYAN</strong><span>{t.roles}</span></div>
        <div className="footer-sources"><span>{t.sources}</span><ExternalLink href={siteLinks.imdb}>IMDb</ExternalLink><ExternalLink href={siteLinks.personalInstagram}>Instagram</ExternalLink><ExternalLink href={siteLinks.instagram}>Maghakian Scripts</ExternalLink></div>
        <div className="footer-meta"><time dateTime={updatedIso}>{t.updated}</time><a href="#top">{t.backTop} ↑</a></div>
        <nav className="footer-hubs" data-seo-hub="ani" aria-label={ui.explore}><strong>{ui.explore}</strong>{sectionLinks.map((item) => <a key={item.slug} href={`${localeRoot}${item.slug}/`}>{item.labels[locale]}</a>)}</nav>
      </footer>

      <script dangerouslySetInnerHTML={{ __html: interactionScript(locale) }} />
    </div>
  );
}
