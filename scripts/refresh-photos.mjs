// Run with PEXELS_API_KEY in the process environment. Only public photo metadata is written.
import { readFile, writeFile } from 'node:fs/promises';
const key = process.env.PEXELS_API_KEY;
if (!key) throw new Error('Set PEXELS_API_KEY before refreshing photos');
const ids = [
  39729580, 13203424, 36940515, 36958107, 36958106, 33259732, 36920213, 36958103,
  36958102,
];
const existing = JSON.parse(
  await readFile(new URL('../data/photos.json', import.meta.url), 'utf8')
);
const captions = new Map(existing.photos.map(photo => [photo.id, photo.caption]));
const localPhotos = new Map(
  existing.photos
    .filter(photo => photo.src.startsWith('./assets/'))
    .map(photo => [photo.id, photo])
);
const photos = [];
for (const id of ids) {
  const response = await fetch(`https://api.pexels.com/v1/photos/${id}`, {
    headers: { Authorization: key },
    signal: AbortSignal.timeout(12000),
  });
  if (!response.ok) throw new Error(`Pexels request failed (${response.status})`);
  const photo = await response.json();
  if (!photo.photographer_url?.includes('@nachoestevo'))
    throw new Error('Unexpected photo owner');
  photos.push({
    id: photo.id,
    src: localPhotos.get(photo.id)?.src || photo.src.medium,
    full: localPhotos.get(photo.id)?.full || photo.src.large2x,
    url: photo.url,
    alt: photo.alt,
    caption: captions.get(photo.id),
    author: photo.photographer,
    width: photo.width,
    height: photo.height,
  });
}
await writeFile(
  new URL('../data/photos.json', import.meta.url),
  JSON.stringify({ profile: 'https://www.pexels.com/@nachoestevo/', photos }, null, 2) +
    '\n'
);
console.log(`Saved ${photos.length} verified photos; no credentials in output`);
