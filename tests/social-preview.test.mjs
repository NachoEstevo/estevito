import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../social-preview.js', import.meta.url), 'utf8');
function setup({ fail = false } = {}) {
  const events = new Map();
  const attributes = new Set();
  const requests = [];
  const images = ['ameyoko', 'blossoms', 'bellagio'].map(name => ({
    dataset: { src: `./assets/photo-${name}.webp` },
    set src(value) { requests.push(value); },
    decode: () => fail ? Promise.reject(new Error('Offline')) : Promise.resolve(),
  }));
  const preview = {
    querySelectorAll: () => images,
    getBoundingClientRect: () => ({ width: 330 }),
    style: { setProperty() {} },
  };
  const link = {
    querySelector: () => preview,
    getBoundingClientRect: () => ({ left: 100, width: 36 }),
    addEventListener: (name, handler) => events.set(name, handler),
    setAttribute: name => attributes.add(name),
    removeAttribute: name => attributes.delete(name),
    hasAttribute: name => attributes.has(name),
    matches: () => true,
  };
  vm.runInNewContext(source, {
    document: { querySelector: () => link, addEventListener() {} },
    window: { addEventListener() {} },
    innerWidth: 390,
  });
  return { events, attributes, requests };
}
const settle = () => new Promise(resolve => setImmediate(resolve));

test('decorative Pexels images do not request bytes on initial page load', () => {
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const fan = html.match(/<span class="pexels-preview"[\s\S]*?<\/a>/)[0];
  assert.equal((fan.match(/\sdata-src=/g) || []).length, 3);
  assert.equal((fan.match(/\ssrc=/g) || []).length, 0);
  assert.deepEqual(setup().requests, []);
});

test('hover requests each image once and reveals only after decoding', async () => {
  const { events, attributes, requests } = setup();
  events.get('pointerenter')();
  assert.equal(requests.length, 3);
  assert.equal(attributes.has('data-preview-ready'), false);
  await settle();
  assert.equal(attributes.has('data-preview-ready'), true);
  events.get('pointerenter')();
  events.get('focus')();
  assert.equal(requests.length, 3);
});

test('keyboard focus loads the fan, including with failed image requests', async () => {
  const { events, attributes, requests } = setup({ fail: true });
  events.get('focus')();
  await settle();
  assert.equal(requests.length, 3);
  assert.equal(attributes.has('data-preview-ready'), true);
});
