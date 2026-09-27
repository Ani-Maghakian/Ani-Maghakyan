import sharp from 'sharp';
import { resolve } from 'node:path';
import { originalProjectPosters, posterPreviews } from '../lib/project-posters.mjs';
import { siteImages, siteImagePreviews } from '../lib/site-images.mjs';
import { archivePosters } from '../lib/archive-posters.mjs';

// Delivery encodings only: retain the supplied originals for full-size viewing.
for (const [slug, original] of Object.entries(originalProjectPosters)) {
  for (const preview of posterPreviews(slug)) {
    await sharp(resolve('public', original.src.slice(1)))
      .resize({ width: preview.width, withoutEnlargement: true })
      .webp({ quality: 86, effort: 6 })
      .toFile(resolve('public', preview.src.slice(1)));
  }
}
console.log(`Prepared responsive encodings for ${Object.keys(originalProjectPosters).length} supplied project posters.`);

// Archive cards display at 76–112 CSS pixels. Never send the full poster
// (or decode it twice for the blurred echo) just to paint a small mobile card.
for (const [slug, source] of Object.entries(archivePosters)) {
  await sharp(resolve('public', source.slice(1)))
    .resize({ width: 320, withoutEnlargement: true })
    .webp({ quality: 73, effort: 5 })
    .toFile(resolve('public', 'posters', `${slug}-archive-320.webp`));
}
console.log(`Prepared compact archive artwork for ${Object.keys(archivePosters).length} projects.`);

// Selected cards are 4:3 on phones. A fixed 800px rendition avoids Safari
// choosing a 1280px+ source at 3x density for each of the 16 cards.
const featuredSlugs = [
  'elens-diary', 'elens-diary-2', 'paper-dream', 'summer-of-84',
  'dear-sahmi', 'se-la-vi', 'white-shirt', 'blockade',
  'special-class', 'special-class-2', 'hotel-grand', 'hotel-grand-2',
  'hotel-grand-3', 'addiction', 'forest-cottage', 'if-i-danced-again',
];
for (const slug of featuredSlugs) {
  const source = archivePosters[slug];
  if (!source) throw new Error(`Missing selected artwork: ${slug}`);
  await sharp(resolve('public', source.slice(1)))
    .resize({ width: 800, withoutEnlargement: true })
    .webp({ quality: 78, effort: 5 })
    .toFile(resolve('public', 'posters', `${slug}-featured-800.webp`));
}
console.log(`Prepared selected artwork for ${featuredSlugs.length} cards.`);

for (const [key, original] of Object.entries(siteImages)) {
  for (const preview of siteImagePreviews(key)) {
    await sharp(resolve('public', original.src.slice(1)))
      .resize({ width: preview.width, withoutEnlargement: true })
      .webp({ quality: 82, effort: 6 })
      .toFile(resolve('public', preview.src.slice(1)));
  }
}
console.log('Prepared responsive portrait and landscape encodings.');
