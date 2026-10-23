import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const root = new URL('../', import.meta.url);
const read = path => readFileSync(new URL(path, root), 'utf8');

test('local markup assets and stylesheet references resolve', () => {
  const html = read('index.html');
  for (const [, path] of html.matchAll(/(?:src|href|data-src)="(\.\/[^"?#]+)(?:[?#][^"]*)?"/g)) {
    assert.ok(existsSync(new URL(path, root)), path);
  }
  assert.match(html, /<title>Ignacio Estevo<\/title>/);
  assert.doesNotMatch(html, /class="dialog-close"|class="toolkit"/);
});

test('replacement gallery photos have optimized local files and bilingual captions', () => {
  const photos = JSON.parse(read('data/photos.json')).photos;
  assert.equal(new Set(photos.map(photo => photo.id)).size, photos.length);
  for (const photo of photos) {
    assert.ok(photo.caption.es && photo.caption.en);
    assert.ok(photo.width > 0 && photo.height > 0);
    assert.doesNotMatch(photo.caption.es, /Ignacio Estevo/);
  }
  for (const id of [36940515, 36920213, 33259732]) {
    const photo = photos.find(photo => photo.id === id);
    assert.ok(photo, `missing ${id}`);
    assert.match(photo.src, /^\.\/assets\/photos\//);
    assert.ok(statSync(fileURLToPath(new URL(photo.src, root))).size < 80_000);
    assert.ok(statSync(fileURLToPath(new URL(photo.full, root))).size < 350_000);
    assert.notEqual(photo.src, photo.full);
  }
  for (const oldId of [36958112, 36958104, 36958105]) {
    assert.ok(!photos.some(photo => photo.id === oldId));
  }
});

test('profile media stays within the combined 50 KB budget', () => {
  let total = 0;
  for (const network of ['x', 'linkedin']) {
    for (const kind of ['avatar', 'banner']) {
      total += statSync(new URL(`assets/social/${network}-${kind}.webp`, root)).size;
    }
  }
  assert.ok(total < 50_000);
});

test('responsive project sources exist and retain originals for the reader', () => {
  const html = read('index.html');
  const sets = [...html.matchAll(/srcset="([^"]+)"/g)];
  assert.equal(sets.length, 9);
  for (const [, set] of sets) {
    const sources = set.split(',').map(candidate => candidate.trim().split(/\s+/)[0]);
    assert.equal(sources.length, 2);
    assert.match(sources[0], /-thumb\.webp$/);
    assert.doesNotMatch(sources[1], /-thumb\.webp$/);
    for (const source of sources) assert.ok(existsSync(new URL(source, root)), source);
    assert.ok(statSync(new URL(sources[0], root)).size < statSync(new URL(sources[1], root)).size);
  }
  assert.match(html, /href="\.\/assets\/photo-bellagio.webp"/);
  assert.match(html, /src="\.\/assets\/photo-bellagio-thumb.webp"/);
});
