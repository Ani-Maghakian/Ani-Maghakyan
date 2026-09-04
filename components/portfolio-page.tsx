"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Play, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

function ExternalLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a className={`external-link ${className}`} href={href} target="_blank" rel="noopener">
      <span>{children}</span>
      <ArrowUpRight aria-hidden="true" />
    </a>
  );
}

export function PortfolioPage({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    document.documentElement.lang = locale === "hy" ? "hy-AM" : locale;
  }, [locale]);

  const filteredProjects = useMemo(() => {
    const normalized = deferredQuery.trim().toLocaleLowerCase(locale);

    return projects.filter((project) => {
      const matchesKind = filter === "all" || project.kind === filter;
      if (!matchesKind) return false;
      if (!normalized) return true;

      const searchable = [
        project.title.hy,
        project.title.en,
        project.title.ru,
        project.year,
        project.credit.hy,
        project.credit.en,
        project.credit.ru,
      ]
        .join(" ")
        .toLocaleLowerCase(locale);

      return searchable.includes(normalized);
    });
  }, [deferredQuery, filter, locale]);

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

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label={t.title}>
          <span>A.</span> MAGHAKYAN
        </a>

        <nav className="primary-nav" aria-label={t.primaryNavLabel}>
          <a href="#selected">{t.nav.work}</a>
          <a href="#filmography">{t.nav.filmography}</a>
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
      </header>

      <main>
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
            <p className="hero-intro">{t.intro}</p>

            <div className="hero-actions">
              <Button asChild className="primary-action">
                <a href="#filmography">
                  {t.explore}
                  <ArrowDownRight aria-hidden="true" />
                </a>
              </Button>
              <ExternalLink href={siteLinks.imdb}>{t.imdb}</ExternalLink>
            </div>
          </div>

          <figure className="hero-art">
            <a className="hero-art-crop" href="#selected" aria-label={`${t.selectedTitle}: ${t.title}`}>
              <picture>
                <source srcSet={`${basePath}/hero.webp`} type="image/webp" />
                {/* A direct fallback keeps the static GitHub Pages export independent of an image server. */}
                <img
                  src={`${basePath}/og.png`}
                  alt={t.imageAlt}
                  width="1200"
                  height="630"
                  fetchPriority="high"
                  decoding="async"
                />
              </picture>
            </a>
            <figcaption>PORTFOLIO · 2026</figcaption>
            <span className="edge-number" aria-hidden="true">01 / 07</span>
          </figure>

          <div className="archive-flap" aria-hidden="true">
            <span>A WRITER&apos;S ARCHIVE</span>
          </div>

          <div className="hero-scroll" aria-hidden="true">
            <span>SCROLL</span>
            <i />
          </div>
        </section>

        <section className="stats-strip section-frame" aria-label="Career statistics">
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
            <div>
              <h2 id="selected-title">{t.selectedTitle}</h2>
              <p>{t.selectedIntro}</p>
            </div>
          </div>

          <div className="featured-grid">
            {featured.map((project, index) => {
              const internalHref = projectPageHref(locale, project.seoSlug) ?? `#project-${project.id}`;
              const posterSrc = posterSource(project.poster);

              return (
                <article className={`featured-card tone-${(index % 4) + 1}`} key={project.id}>
                  {posterSrc && (
                    <a
                      className="featured-poster-link"
                      href={project.watchUrl ?? internalHref}
                      target={project.watchUrl ? "_blank" : undefined}
                      rel={project.watchUrl ? "noopener" : undefined}
                      aria-label={`${project.title[locale]} — ${project.watchKind === "youtube" ? t.watchYoutube : t.openProject}`}
                    >
                      <span
                        className="featured-poster-backdrop"
                        aria-hidden="true"
                        style={{ backgroundImage: `url("${posterSrc}")` }}
                      />
                      <img
                        className="featured-poster"
                        src={posterSrc}
                        alt={`${project.title[locale]} — ${project.year}`}
                        loading="lazy"
                        decoding="async"
                      />
                      {project.watchUrl && (
                        <span className="featured-play" aria-hidden="true">
                          <Play />
                        </span>
                      )}
                    </a>
                  )}
                  <div className="featured-meta">
                    <span>{padded(index + 1)}</span>
                    <span>{project.year}</span>
                  </div>
                  <div className="featured-copy">
                    <h3>
                      <a className="project-title-link" href={internalHref}>
                        {project.title[locale]}
                      </a>
                    </h3>
                    <p>{project.featuredDetail?.[locale] ?? project.credit[locale]}</p>
                    {project.watchUrl && (
                      <a className="project-watch" href={project.watchUrl} target="_blank" rel="noopener">
                        <Play aria-hidden="true" />
                        <span>{project.watchKind === "youtube" ? t.watchYoutube : t.openProject}</span>
                        <ArrowUpRight aria-hidden="true" />
                      </a>
                    )}
                  </div>
                  <span className="format-mark">{t.filters[project.kind].toUpperCase()}</span>
                  <span className="card-stamp" aria-hidden="true">FILE · {padded(project.id)}</span>
                </article>
              );
            })}
          </div>
          <span className="section-tab" aria-hidden="true">02 / 07</span>
        </section>

        <section className="archive-section section-frame" id="filmography" aria-labelledby="archive-title">
          <div className="section-heading archive-heading">
            <p className="eyebrow">{t.archiveKicker}</p>
            <div>
              <h2 id="archive-title">{t.archiveTitle}</h2>
              <p>{t.archiveIntro}</p>
            </div>
          </div>

          <div className="archive-controls">
            <label className="search-field">
              <span className="sr-only">{t.search}</span>
              <Search aria-hidden="true" />
              <Input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={t.search}
                autoComplete="off"
              />
            </label>

            <div className="filter-row" role="group" aria-label="Project format">
              {filters.map((item) => (
                <Button
                  key={item}
                  type="button"
                  variant="ghost"
                  className="filter-button"
                  data-active={filter === item}
                  aria-pressed={filter === item}
                  onClick={() => setFilter(item)}
                >
                  {t.filters[item]}
                </Button>
              ))}
            </div>
          </div>

          <p className="result-count" aria-live="polite">
            {padded(filteredProjects.length)} {t.results}
          </p>

          <div className="filmography-table-wrap">
            <table className="filmography-table">
              <thead>
                <tr>
                  <th scope="col">{t.table.number}</th>
                  <th scope="col">{t.table.project}</th>
                  <th scope="col">{t.table.year}</th>
                  <th scope="col">{t.table.format}</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => {
                  const internalHref = projectPageHref(locale, project.seoSlug);

                  return (
                    <tr id={`project-${project.id}`} key={project.id}>
                      <td data-label={t.table.number}>{padded(project.id)}</td>
                      <th data-label={t.table.project} scope="row">
                        <span className="project-title-cell">
                          {internalHref ? (
                            <a className="project-title-link" href={internalHref}>
                              {project.title[locale]}
                            </a>
                          ) : (
                            <span>{project.title[locale]}</span>
                          )}
                          {project.watchUrl && (
                            <a
                              className="project-watch-mini"
                              href={project.watchUrl}
                              target="_blank"
                              rel="noopener"
                              aria-label={`${t.watchProject}: ${project.title[locale]}`}
                              title={t.watchProject}
                            >
                              <Play aria-hidden="true" />
                            </a>
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

            {filteredProjects.length === 0 && <p className="empty-state">{t.noResults}</p>}
          </div>
          <span className="section-tab" aria-hidden="true">03 / 07</span>
        </section>

        <section className="about-section section-frame" id="about" aria-labelledby="about-title">
          <div className="about-intro">
            <p className="eyebrow">{t.aboutKicker}</p>
            <h2 id="about-title">{t.aboutTitle}</h2>
            <p className="bio-lead">{t.bio}</p>
            <p className="bio-note">{t.philosophy}</p>
          </div>

          <div className="about-columns">
            <article>
              <span className="column-number">01</span>
              <h3>{t.educationTitle}</h3>
              <ul>
                {t.education.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
            <article>
              <span className="column-number">02</span>
              <h3>{t.practiceTitle}</h3>
              <ul>
                {t.practice.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
            <article>
              <span className="column-number">03</span>
              <h3>{t.booksTitle}</h3>
              <ul>
                {t.books.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </article>
          </div>
          <span className="section-tab" aria-hidden="true">04 / 07</span>
        </section>

        <section className="sources-section section-frame" id="sources" aria-labelledby="sources-title">
          <div className="section-heading">
            <p className="eyebrow">{t.sourcesKicker}</p>
            <div>
              <h2 id="sources-title">{t.sourcesTitle}</h2>
              <p>{t.sourcesIntro}</p>
            </div>
          </div>

          <ol className="source-grid">
            {sourceLinks.map((source) => (
              <li key={source.id}>
                <span className="source-number">{padded(source.id)}</span>
                <div>
                  <span className="source-kind">{source.kind[locale]}</span>
                  <h3>{source.label}</h3>
                  <p>{source.note[locale]}</p>
                </div>
                <ExternalLink href={source.href}>{t.visitSource}</ExternalLink>
              </li>
            ))}
          </ol>

          <p className="source-method">{t.sourcesMethod}</p>
          <span className="section-tab" aria-hidden="true">05 / 07</span>
        </section>

        <section className="faq-section section-frame" aria-labelledby="faq-title">
          <div className="section-heading">
            <p className="eyebrow">{t.faqKicker}</p>
            <div>
              <h2 id="faq-title">{t.faqTitle}</h2>
            </div>
          </div>

          <div className="faq-list">
            {t.faqs.map((item, index) => (
              <details key={item.q}>
                <summary>
                  <span>{padded(index + 1)}</span>
                  <strong>{item.q}</strong>
                  <i aria-hidden="true" />
                </summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
          <span className="section-tab" aria-hidden="true">06 / 07</span>
        </section>

        <section className="contact-section section-frame" id="contact" aria-labelledby="contact-title">
          <p className="eyebrow">{t.contactKicker}</p>
          <h2 id="contact-title">{t.contactTitle}</h2>
          <p>{t.contactText}</p>
          <Button asChild className="contact-button">
            <a href={siteLinks.instagram} target="_blank" rel="noopener">
              {t.contactButton}
              <ArrowUpRight aria-hidden="true" />
            </a>
          </Button>
          <span className="contact-edge" aria-hidden="true">07 / 07</span>
        </section>
      </main>

      <footer className="site-footer section-frame">
        <div>
          <strong>A. MAGHAKYAN</strong>
          <span>{t.roles}</span>
        </div>
        <div className="footer-sources">
          <span>{t.sources}</span>
          <ExternalLink href={siteLinks.imdb}>IMDb</ExternalLink>
          <ExternalLink href={siteLinks.personalInstagram}>Instagram</ExternalLink>
          <ExternalLink href={siteLinks.instagram}>Maghakian Scripts</ExternalLink>
        </div>
        <div className="footer-meta">
          <time dateTime={updatedIso}>{t.updated}</time>
          <a href="#top">{t.backTop} ↑</a>
        </div>
      </footer>
    </div>
  );
}
