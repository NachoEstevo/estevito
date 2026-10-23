import { generate } from './vendor/transitions/ui-generation.js';

// Original upstream runtime: auto traces text/images; ui builds controls and charts.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const active = new Set();
const visible = new Set();
const played = new WeakSet();
let stopped = reduced.matches;
let settle;
const cancelActive = () => [...active].forEach(run => run.cancel());
const finish = () => {
  stopped = true;
  clearTimeout(settle);
  observer.disconnect();
  visible.clear();
  cancelActive();
};
async function build(el) {
  if (stopped || played.has(el)) return;
  played.add(el);
  await Promise.all(
    [...el.querySelectorAll('img')]
      .filter(img => img.hasAttribute('src') && img.getClientRects().length > 0)
      .map(img => img.decode().catch(() => {}))
  );
  if (stopped || !visible.has(el) || !el.isConnected) {
    played.delete(el);
    return;
  }
  const variant = el.matches('.activity-section,.footer,.contact-links,.page-tools')
    ? 'ui'
    : 'auto';
  const run = generate(el, { variant, mode: 'skeleton', fadeStagger: null, display: 22 });
  active.add(run);
  run.finished.finally(() => active.delete(run));
  observer.unobserve(el);
  visible.delete(el);
}
function schedule() {
  clearTimeout(settle);
  settle = setTimeout(() => visible.forEach(build), 140);
}
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) visible.add(target);
      else visible.delete(target);
    });
    schedule();
  },
  { threshold: 0.08 }
);
document.addEventListener('pointerdown', cancelActive);
document.addEventListener('cv:interaction', cancelActive);
document.addEventListener('cv:generate', event => {
  if (reduced.matches || !event.detail?.element) return;
  const el = event.detail.element;
  const run = generate(el, {
    variant: 'auto',
    mode: 'skeleton',
    fadeStagger: null,
    display: 22,
  });
  active.add(run);
  run.finished.finally(() => active.delete(run));
});
document.addEventListener('focusin', cancelActive);
document.addEventListener('cv:languagechange', finish);
window.addEventListener('resize', finish, { once: true });
window.addEventListener('beforeprint', finish);
window.addEventListener(
  'scroll',
  () => {
    cancelActive();
    schedule();
  },
  { passive: true }
);
reduced.addEventListener('change', () => {
  if (reduced.matches) finish();
});
await document.fonts.ready;
if (!stopped) {
  document
    .querySelectorAll('.identity,.intro-copy,.section,.footer,.contact-links,.page-tools')
    .forEach(el => {
      // Only the initial viewport plus a small scroll buffer, never the lower page.
      if (el.getBoundingClientRect().top + scrollY < innerHeight * 1.4)
        observer.observe(el);
    });
}
