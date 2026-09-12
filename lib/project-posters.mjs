// Owner-supplied artwork: original uploads and unaltered images extracted from supplied PDFs.
export const originalProjectPosters = {
  'se-la-vi': { src: '/posters/se-la-vi-original.png', width: 1920, height: 1080 },
  'life-after-war': { src: '/posters/life-after-war-original.jpg', width: 1080, height: 1920 },
  'mi-gexecik-or': { src: '/posters/mi-gexecik-or-original.jpg', width: 1080, height: 608 },
  'blockade': { src: '/posters/blockade-original.jpg', width: 1447, height: 2048 },
  'mtmtik-prptik': { src: '/posters/mtmtik-prptik-original.jpg', width: 1365, height: 2048 },
  'dear-sahmi': { src: '/posters/dear-sahmi-original.jpg', width: 1920, height: 1080 },
  'hotel-grand': { src: '/posters/hotel-grand-original.jpg', width: 2598, height: 1299 },
  'paper-dream': { src: '/posters/paper-dream-original.jpg', width: 2598, height: 1299 },
  'elens-diary': { src: '/posters/elens-diary-original.jpg', width: 2598, height: 1299 },
  'special-class': { src: '/posters/special-class-original.jpg', width: 2598, height: 1299 },
  'forest-cottage': { src: '/posters/forest-cottage-original.jpg', width: 2598, height: 1299 },
  'summer-of-84': { src: '/posters/summer-of-84-original.png', width: 751, height: 1001 },
  'if-i-danced-again': { src: '/posters/if-i-danced-again-original.jpg', width: 1170, height: 728 },
  'addiction': { src: '/posters/addiction-original.jpg', width: 1280, height: 719 },
  'white-shirt': { src: '/posters/white-shirt-original.jpg', width: 2048, height: 1152 },
};

export function posterPreviews(slug) {
  const poster = originalProjectPosters[slug];
  return [640, Math.min(1280, poster.width)].map((width) => ({
    src: `/posters/${slug}-display-${width}.webp`, width,
  }));
}

export function posterSrcSet(slug, basePath = '') {
  return posterPreviews(slug).map((image) => `${basePath}${image.src} ${image.width}w`).join(', ');
}

// Identify season-specific artwork without changing the series-level project credit.
export const posterNotes = {
  'special-class': { hy: '2-րդ եթերաշրջանի պաստառ', en: 'Season 2 artwork', ru: 'Афиша второго сезона' },
  'hotel-grand': { hy: '3-րդ եթերաշրջանի պաստառ', en: 'Season 3 artwork', ru: 'Афиша третьего сезона' },
};
