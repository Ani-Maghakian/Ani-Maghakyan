import sharp from 'sharp';
import { resolve } from 'node:path';
import { originalProjectPosters, posterPreviews } from '../lib/project-posters.mjs';

// Delivery encodings only: retain the supplied originals for full-size viewing.
for (const [slug, original] of Object.entries(originalProjectPosters)) {
  for (const preview of posterPreviews(slug)) {
    await sharp(resolve('public', original.src.slice(1)))
      .resize({ width: preview.width, withoutEnlargement: true })
      .webp({ quality: 86, effort: 6 })
      .toFile(resolve('public', preview.src.slice(1)));
  }
}
console.log('Prepared responsive encodings for six original project posters.');
