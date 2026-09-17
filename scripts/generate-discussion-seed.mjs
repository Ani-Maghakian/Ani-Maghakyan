import { projects } from './seo-page-data.mjs';

const slugs = [...new Set(projects.map((project) => project.slug))].sort();
if (!slugs.length || slugs.some((slug) => !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))) {
  throw new Error('The authoritative project slugs must be valid and non-empty.');
}
console.log('-- Generated from scripts/seo-page-data.mjs; rerun after adding a project.');
console.log('insert into public.discussion_projects(slug) values');
console.log(slugs.map((slug) => `  ('${slug}')`).join(',\n') + '\non conflict(slug) do nothing;');
