import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../generative.js', import.meta.url), 'utf8').replace(/^import[^\n]+\n/, '');
async function start({ reduced = false, expired = false } = {}) {
  const events = new Map(), pending = new Set(), classes = new Set(['gen-boot']);
  let generated = 0, cancelled = 0;
  const el = { style: {}, isConnected: true, querySelectorAll: () => [], matches: () => false,
    getBoundingClientRect: () => ({ top: 20 }),
    setAttribute: name => pending.add(name), removeAttribute: name => pending.delete(name) };
  const context = {
    document: {
      fonts: { ready: Promise.resolve() }, documentElement: { classList: { remove: name => classes.delete(name) } },
      querySelectorAll: selector => selector === '[data-gen-pending]' ? (pending.size ? [el] : []) : [el],
      querySelector: () => pending.size ? el : null,
      addEventListener: (name, fn) => events.set(name, fn),
    },
    window: { cvBootExpired: expired, addEventListener: (name, fn) => events.set(name, fn) },
    matchMedia: () => ({ matches: reduced, addEventListener() {} }), clearTimeout() {}, scrollY: 0, innerHeight: 800,
    generate(target) {
      assert.ok(pending.has('data-gen-pending'), 'the real content stays hidden until generate takes over');
      target.style.opacity = '0'; generated++;
      return { cancel() { cancelled++; }, finished: new Promise(() => {}) };
    },
  };
  await vm.runInNewContext(`(async () => { ${source} })()`, context);
  await Promise.resolve();
  return { events, pending, classes, generated, cancelled: () => cancelled };
}

test('initial generation hands off hidden content and interaction reveals pending content safely', async () => {
  const run = await start();
  assert.equal(run.generated, 1);
  assert.equal(run.pending.size, 0);
  assert.equal(run.classes.has('gen-boot'), false);
  run.events.get('pointerdown')();
  assert.equal(run.cancelled(), 1);
});

test('reduced motion and an expired boot never hide and redraw the page', async () => {
  for (const options of [{ reduced: true }, { expired: true }]) {
    const run = await start(options);
    assert.equal(run.generated, 0);
    assert.equal(run.pending.size, 0);
    assert.equal(run.classes.size, 0);
  }
});
