// Owner-supplied artwork: original uploads and unaltered images extracted from supplied PDFs.
export const originalProjectPosters = {
  'the-stranger': { src: '/posters/the-stranger-submitted.webp', width: 942, height: 493 },
  'elens-diary': { src: '/posters/elens-diary-submitted.webp', width: 788, height: 550 },
  'elens-diary-2': { src: '/posters/elens-diary-2-submitted.webp', width: 640, height: 360 },
  'together': { src: '/posters/together-submitted.webp', width: 1262, height: 1582 },
  'toy': { src: '/posters/toy-submitted.webp', width: 703, height: 461 },
  'forest-cottage': { src: '/posters/forest-cottage-submitted.webp', width: 1080, height: 608 },
  'fragments': { src: '/posters/fragments-submitted.webp', width: 1080, height: 566 },
  'hold-my-hand': { src: '/posters/hold-my-hand-submitted.webp', width: 1248, height: 874 },
  'we-are-two-sisters': { src: '/posters/we-are-two-sisters-submitted.webp', width: 1273, height: 1234 },
  'special-class': { src: '/posters/special-class-submitted.webp', width: 1080, height: 655 },
  'special-class-2': { src: '/posters/special-class-2-submitted.webp', width: 1080, height: 755 },
  'live-with-me': { src: '/posters/live-with-me-submitted.webp', width: 1284, height: 693 },
  'stay-with-me': { src: '/posters/stay-with-me-submitted.webp', width: 1284, height: 689 },
  '4-dreams': { src: '/posters/4-dreams-submitted.webp', width: 1266, height: 838 },
  'forest-cottage-2': { src: '/posters/forest-cottage-2-submitted.webp', width: 1080, height: 566 },
  'hotel-grand': { src: '/posters/hotel-grand-submitted.webp', width: 1080, height: 720 },
  'hotel-grand-2': { src: '/posters/hotel-grand-2-submitted.webp', width: 1080, height: 690 },
  'hotel-grand-3': { src: '/posters/hotel-grand-3-submitted.webp', width: 1080, height: 671 },
  'looking-for-a-bride': { src: '/posters/looking-for-a-bride-submitted.webp', width: 1246, height: 670 },
  'against-each-other': { src: '/posters/against-each-other-submitted.webp', width: 1536, height: 1024 },
  'los-khnamakhos': { src: '/posters/los-khnamakhos-submitted.webp', width: 1080, height: 1350 },
  'sos-angeles': { src: '/posters/sos-angeles-submitted.webp', width: 1080, height: 1350 },
  'appsos': { src: '/posters/appsos-submitted.webp', width: 1080, height: 1080 },
  'solved-cases': { src: '/posters/solved-cases-submitted.webp', width: 1080, height: 720 },
  'sosindz': { src: '/posters/sosindz-submitted.webp', width: 864, height: 1080 },
  'after-you': { src: '/posters/after-you-submitted.webp', width: 1024, height: 576 },
  'soskali': { src: '/posters/soskali-submitted.webp', width: 1200, height: 1600 },
  'colonel-sos': { src: '/posters/colonel-sos-submitted.webp', width: 1280, height: 720 },
  'oke-2': { src: '/posters/oke-2-submitted.webp', width: 1282, height: 1600 },
  'operation-sos': { src: '/posters/operation-sos-submitted.webp', width: 1223, height: 1600 },
  'sos-911': { src: '/posters/sos-911-submitted.webp', width: 1193, height: 1536 },
  'se-la-vi': { src: '/posters/se-la-vi-original.png', width: 1920, height: 1080 },
  'life-after-war': { src: '/posters/life-after-war-original.jpg', width: 1080, height: 1920 },
  'mi-gexecik-or': { src: '/posters/mi-gexecik-or-original.jpg', width: 1080, height: 608 },
  'blockade': { src: '/posters/blockade-original.jpg', width: 1447, height: 2048 },
  'mtmtik-prptik': { src: '/posters/mtmtik-prptik-original.jpg', width: 1365, height: 2048 },
  'dear-sahmi': { src: '/posters/dear-sahmi-original.jpg', width: 1920, height: 1080 },
  'paper-dream': { src: '/posters/paper-dream-original.jpg', width: 2598, height: 1299 },
  'summer-of-84': { src: '/posters/summer-of-84-original.png', width: 751, height: 1001 },
  'if-i-danced-again': { src: '/posters/if-i-danced-again-original.jpg', width: 1170, height: 728 },
  'addiction': { src: '/posters/addiction-original.jpg', width: 1280, height: 719 },
  'white-shirt': { src: '/posters/white-shirt-original.jpg', width: 2048, height: 1152 },
};

export function posterPreviews(slug) {
  const poster = originalProjectPosters[slug];
  return [...new Set([320, 480, 640, 960, 1280].map(width => Math.min(width, poster.width)))].map((width) => ({
    src: `/posters/${slug}-display-${width}.webp`, width,
  }));
}

export function posterSrcSet(slug, basePath = '') {
  return posterPreviews(slug).map((image) => `${basePath}${image.src} ${image.width}w`).join(', ');
}

// Identify season-specific artwork without changing the series-level project credit.
export const posterNotes = {
  'special-class': { hy: '1-ին եթերաշրջանի պաստառ', en: 'Season 1 artwork', ru: 'Афиша первого сезона' },
  'hotel-grand': { hy: '1-ին եթերաշրջանի պաստառ', en: 'Season 1 artwork', ru: 'Афиша первого сезона' },
};

