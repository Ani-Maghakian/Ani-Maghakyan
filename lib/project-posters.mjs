// Original project artwork supplied by the owner on 7 September 2026.
export const originalProjectPosters = {
  'se-la-vi': { src: '/posters/se-la-vi-original.png', width: 1920, height: 1080 },
  'life-after-war': { src: '/posters/life-after-war-original.jpg', width: 1080, height: 1920 },
  'mi-gexecik-or': { src: '/posters/mi-gexecik-or-original.jpg', width: 1080, height: 608 },
  'blockade': { src: '/posters/blockade-original.jpg', width: 1447, height: 2048 },
  'mtmtik-prptik': { src: '/posters/mtmtik-prptik-original.jpg', width: 1365, height: 2048 },
  'dear-sahmi': { src: '/posters/dear-sahmi-original.jpg', width: 1920, height: 1080 },
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
