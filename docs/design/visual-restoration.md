# Original design restored

The user clarified that the previous visual design should remain, with the new wordmark and targeted audit fixes only. The visual baseline is commit `52ad108`.

Restored the landscape hero, original fonts, glass controls, navigation, author introduction, section order and original project inquiry. Added the supplied wordmark to the existing headers without rewriting homepage copy.

Retained native Button defaults and accessible default sizing, removal of six stylesheets that were never loaded, and the six newly published book URLs with their sitemap and structured-data relationships. All 183 URLs remain available.

The logo wraps the unchanged supplied JPEG with a single SVG alpha conversion. It no longer uses a nested filtered luminance mask. This improves the rendering path but does not create vector outlines; extreme magnification is still limited by the raster source. The saved Canva design was inspected without changes and also contains a raster wordmark.

Validation: full static build, 57 automated checks and live browser inspection. Physical-device and Lighthouse results are not claimed.

## Studio copy and vector logo update

The user subsequently requested the studio-first hero copy and Ani's founder role within the restored landscape design. This content is localized in `homeHero`; the original visual layout remains. Homepage metadata describes the studio and retains the Person/Organization founder relationship.

The JPEG was traced with Adobe Illustrator vectorization. The current logo files contain native vector paths only, without embedded images, masks or filters. White background regions were excluded and the original traced path data retained for the dark and ivory variants. The header logo URL is versioned to invalidate the earlier bitmap wrapper. This supersedes the raster limitation described above.
