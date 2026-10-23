# Verification

## Automated checks

`npm test` checks public activity normalization, failed-source handling, lazy photo previews, local asset references, image budgets and gallery metadata.

During development, isolated DOM checks also covered project open/close, photo lightbox dismissal, bilingual captions, four social profile cards, theme persistence, reduced motion and scroll placement inside the View Transition update. These simulate browser APIs and do not establish visual smoothness.

## Mobile acceptance — pending visual verification

The responsive CSS was inspected, but the local preview could not be inspected with browser automation because access was blocked by browser URL policy. **Mobile rendering is not certified by the unit tests.**

Check at 320, 390 and 430 CSS px widths, in both themes:

- No horizontal page overflow; activity calendars scroll within their own panels.
- Open each project: original image aligns near the top while expanding; close and Escape restore the card.
- More projects: no content flash before Generative, no duplicated cards.
- Photography: enter/leave gallery, open a photo, tap outside to dismiss; no close button.
- Updated bamboo/Nara/Bellagio images load; captions switch with ES/EN.
- Header links and controls remain reachable; hover previews are not required for navigation on touch.
- With reduced motion enabled, content and controls stay usable without animation.
- Rotate to landscape and check lightbox bounds and the photography heading.

No Lighthouse score, physical-device pass, production deployment or cross-browser pass is claimed.
