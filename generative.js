import { generate } from './vendor/transitions/ui-generation.js';

// Original upstream runtime: auto traces text/images; ui builds controls and charts.
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const active = new Set();
const played = new WeakSet();
let stopped = reduced.matches || Boolean(window.cvBootExpired);
const cancelActive = () => [...active].forEach(run => run.cancel());
const revealPending = () => {
  document.documentElement.classList.remove('gen-boot');
  document.querySelectorAll('[data-gen-pending]').forEach(el => el.removeAttribute('data-gen-pending'));
};
const clearBootTimer = () => {
  if (!document.querySelector('[data-gen-pending]')) clearTimeout(window.cvBootTimer);
};
const finish = () => {
  stopped = true;
  cancelActive();
  revealPending();
  clearBootTimer();
};
async function build(el) {
  if (stopped || played.has(el)) return;
  played.add(el);
  await Promise.all(
    [...el.querySelectorAll('img')]
      .filter(img => img.hasAttribute('src') && img.getClientRects().length > 0)
      .map(img => img.decode().catch(() => {}))
  );
  if (stopped || !el.isConnected) {
    played.delete(el);
    el.removeAttribute('data-gen-pending');
    clearBootTimer();
    return;
  }
  const variant = el.matches('.activity-section,.footer,.contact-links,.page-tools')
    ? 'ui'
    : 'auto';
  const run = generate(el, { variant, mode: 'skeleton', fadeStagger: null, display: 22 });
  // generate() synchronously sets inline opacity to zero before the pending mask goes.
  el.removeAttribute('data-gen-pending');
  clearBootTimer();
  active.add(run);
  run.finished.finally(() => active.delete(run));
}
document.addEventListener('pointerdown', finish);
document.addEventListener('cv:interaction', cancelActive);
document.addEventListener('cv:generate', event => {
  if (reduced.matches || !event.detail?.element) return;
  const el = event.detail.element;
  const run = generate(el, {
    variant: 'auto',
    parent: event.detail.parent,
    mode: 'skeleton',
    fadeStagger: null,
    display: 22,
  });
  active.add(run);
  run.finished.finally(() => active.delete(run));
});
document.addEventListener('focusin', finish);
document.addEventListener('cv:boot-timeout', finish);
document.addEventListener('cv:languagechange', finish);
window.addEventListener('resize', finish, { once: true });
window.addEventListener('beforeprint', finish);
window.addEventListener(
  'scroll',
  () => {
    finish();
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
      if (el.getBoundingClientRect().top + scrollY < innerHeight * 1.4) {
        el.setAttribute('data-gen-pending', '');
        build(el);
      }
    });
}
document.documentElement.classList.remove('gen-boot');
clearBootTimer();
