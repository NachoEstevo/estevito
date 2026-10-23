import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const styles = ['styles.css', 'activity.css', 'projects.css', 'awards.css',
  'social-preview.css', 'vendor/transitions/ui-generation.css',
  'vendor/transitions/text-image-generation.css', 'generative.css', 'refinements.css'];

await Promise.all([
  build({ absWorkingDir: root, entryPoints: ['generative.js'], outfile: 'generative.min.js',
    bundle: true, minify: true, format: 'esm', target: 'es2022', legalComments: 'eof' }),
  build({ absWorkingDir: root, stdin: { contents: styles.map(path => `@import './${path}';`).join('\n'),
    loader: 'css', resolveDir: root }, outfile: 'site.min.css', bundle: true,
    minify: true, external: ['./assets/*'], legalComments: 'eof' }),
]);
