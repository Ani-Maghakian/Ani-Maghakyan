# Original design restored

The user clarified that the previous visual design should remain, with the new wordmark and targeted audit fixes only. The visual baseline is commit `52ad108`.

Restored the landscape hero, original fonts, glass controls, navigation, author introduction, section order and original project inquiry. Added the supplied wordmark to the existing headers without rewriting homepage copy.

Retained native Button defaults and accessible default sizing, removal of six stylesheets that were never loaded, and the six newly published book URLs with their sitemap and structured-data relationships. All 183 URLs remain available.

The logo wraps the unchanged supplied JPEG with a single SVG alpha conversion. It no longer uses a nested filtered luminance mask. This improves the rendering path but does not create vector outlines; extreme magnification is still limited by the raster source. The saved Canva design was inspected without changes and also contains a raster wordmark.

Validation: full static build, 57 automated checks and live browser inspection. Physical-device and Lighthouse results are not claimed.
