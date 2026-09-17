// Delivery variants preserve the original composition and source files.
export const siteImages = {
  portrait: { src: '/ani-3180-web.jpg', stem: '/ani-portrait', width: 1279, height: 1919, widths: [320, 640, 960] },
  back: { src: '/landscape/aragats-back.webp', stem: '/landscape/aragats-back', width: 1400, height: 470, widths: [480, 800, 1400] },
  middle: { src: '/landscape/aragats-middle.webp', stem: '/landscape/aragats-middle', width: 1400, height: 467, widths: [480, 800, 1400] },
  front: { src: '/landscape/aragats-front.webp', stem: '/landscape/aragats-front', width: 1400, height: 467, widths: [480, 800, 1400] },
};

export function siteImagePreviews(key) {
  const image = siteImages[key];
  return image.widths.map(width => ({ src: `${image.stem}-display-${width}.webp`, width }));
}

export function siteImageSrcSet(key, basePath = '') {
  return siteImagePreviews(key).map(image => `${basePath}${image.src} ${image.width}w`).join(', ');
}
