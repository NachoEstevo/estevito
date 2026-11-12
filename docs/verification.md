# Verification

## Automated checks

`npm test` checks public activity normalization, failed-source handling, lazy photo previews, local asset references, image budgets and gallery metadata.

During development, isolated DOM checks also covered project open/close, photo lightbox dismissal, bilingual captions, four social profile cards, theme persistence, reduced motion and scroll placement inside the View Transition update. These simulate browser APIs and do not establish visual smoothness.

## Local performance pass — October 23, 2026

The production desktop Lighthouse baseline was 79 performance / 100 accessibility / 100 best practices / 100 SEO, with 460 ms TBT and 609 KiB transferred. This is the baseline before these local optimizations, not a score for the changed version.

Project thumbnails now have responsive candidates. Opening a project requests and decodes its original image before the morph. Photo lightbox originals have not been recompressed. Small avatars and marks have separate high-quality thumbnails. Generative uses detached copies of immutable SVG geometry for measurement, avoiding live-layout flushes during tracing; its phases, duration, image sampling and visual effect are unchanged. Award entrance and floating animations run sequentially.

`npm ci && npm run build` regenerates `site.min.css` and `generative.min.js` using a pinned development-only esbuild. The static site still needs no runtime dependencies or application server. Edit the original CSS/JS files, then regenerate; CI checks that the committed outputs match their sources. The upstream Transitions.dev license remains in `vendor/transitions/LICENSE.txt`.

## Loading and project motion pass — November 11, 2026

The seven deferred interaction scripts now ship as one minified `site.min.js` (about 81 KB of source in seven requests, 53 KB in one before transfer compression). `site.js` is the entry and keeps the original order; edit the individual sources and run `npm run build`. CI also checks `site.min.js` against its sources. `/assets/*` is served with a one-day browser cache plus stale-while-revalidate; a replaced asset that keeps its file name can therefore take up to a day to reach a returning visitor. Social hover cards render, and request `data/social.json` and their images, after the page has loaded and the main thread is idle, or on the first hover or focus. Hidden hover cards are no longer re-measured on every scroll event.

Opening a project no longer waits on the network: the original image is requested on hover, focus or press, and the click waits at most 150 ms before the morph starts with the thumbnail. The morph runs 520 ms opening and 400 ms closing on one shared curve; the copy enters after the image is under way and leaves first; the close button answers during the morph; a double click leaves the reader open.

Measured in headless Chrome 157 at 1280 × 900 with 120 ms added latency and about 4 Mbps down. Click to first animated frame: 813 ms cold and 489 ms after hovering on the published site, against about 200 ms cold and 63 ms after hovering locally. These are single runs on one machine, the local server adds no real network distance, and frame pacing in headless Chrome is not evidence of smoothness on a phone. Escape mid-morph, close-button click mid-morph, double click, and open/close at 390 × 844 ended in the expected state with no console errors. No Lighthouse run, Safari, Firefox or physical-device pass was made.

## Mobile acceptance — local Chromium

Browser access was available for this pass. Checked responsive widths of 320, 390 and 430 CSS px, plus 844 × 390 landscape: no horizontal document overflow, project expansion and close, seven additional projects, nine gallery photographs, postcard scrolling and outside-click/Escape dismissal, dark mode and ES/EN. The project hero aligned 24 px below the top on expansion. The lightbox stayed within the landscape viewport and scrolled internally. No JavaScript warnings or errors were observed in the checked flows.

These are desktop Chromium viewport checks, not a physical iPhone/Android or Safari certification. The local server does not reproduce production compression or network throttling. A new production Lighthouse/mobile performance score remains pending publication; do not infer it from unit tests or file-size savings.

Remaining broader acceptance checklist:

Check at 320, 390 and 430 CSS px widths, in both themes:

- No horizontal page overflow; activity calendars scroll within their own panels.
- Open each project: original image aligns near the top while expanding; close and Escape restore the card.
- More projects: no content flash before Generative, no duplicated cards.
- Photography: enter/leave gallery, open a photo, tap outside to dismiss; no close button.
- Updated bamboo/Nara/Bellagio images load; captions switch with ES/EN.
- Header links and controls remain reachable; hover previews are not required for navigation on touch.
- With reduced motion enabled, content and controls stay usable without animation.
- Rotate to landscape and check lightbox bounds and the photography heading.

No post-change Lighthouse score, physical-device pass, production deployment or cross-browser pass is claimed.
