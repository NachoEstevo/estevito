<div align="center">

# Ignacio Estevo

**Projects, code, and a few things away from the screen.**

A small personal website built with HTML, CSS and JavaScript.

[GitHub](https://github.com/NachoEstevo) · [LinkedIn](https://www.linkedin.com/in/ignacio-estevo/) · [Photography](https://www.pexels.com/@nachoestevo/) · [X](https://x.com/Nachoestevo)

<img src="assets/photos/36940515-thumb.webp" width="26%" alt="A path through a bamboo forest" />
<img src="assets/photos/33259732-thumb.webp" width="26%" alt="A sailboat on Lake Como, Bellagio" />
<img src="assets/photos/36920213-thumb.webp" width="26%" alt="A deer in Nara, Japan" />

</div>

## The site

An editorial CV with expandable project stories, a photography gallery and small glimpses of what I am building. Spanish and English, light and dark, all in one document.

- **Projects** expand from their original image, with scroll and layout coordinated through View Transitions.
- **Photography** becomes a wider gallery in the same page. Full-size photographs load on demand.
- **Activity** uses saved public GitHub and Tokscale data; visiting the site does not call their APIs.
- **Motion** includes a progressive page reveal and a soft diagonal theme transition, with reduced-motion alternatives.
- **Contact** includes email copying and profile previews with local, compressed images.

No framework, build step, runtime package dependencies or analytics scripts.

## Run locally

Requires **Node.js 22+**. No install step is needed for the website or unit tests.

```sh
git clone https://github.com/NachoEstevo/estevito.git
cd estevito
npm start
```

Open **http://127.0.0.1:4320**. Set `PORT` to use another port.

```sh
npm test
```

## Make it yours

| File | Purpose |
| --- | --- |
| `index.html` | Document structure and content without JavaScript |
| `i18n.js` | Spanish and English copy |
| `projects.js` | Project stories and inline reader |
| `expansions.js` | More projects and photography mode |
| `styles.css`, `refinements.css` | Layout, responsive styles and visual details |
| `data/photos.json` | Photographs, source links and bilingual captions |
| `data/activity.json`, `data/social.json` | Public activity snapshots |
| `assets/` | Optimized images and brand marks |
| `vendor/transitions/` | Attributed Generative runtime and its license |

## Images and performance

The three newest photographs have separate WebP thumbnails (37–75 KB) and larger lightbox versions (184–331 KB). The gallery is created on request and its images use lazy loading. The four X/LinkedIn profile images total about 47 KB. Browser-native APIs handle transitions; the initial Generative effect is limited to the first viewport and a small buffer.

Image sizes are file sizes, not measured network or Lighthouse scores. See [verification notes](docs/verification.md) for what has and has not been checked.

## Refresh public data

```sh
npm run refresh:activity
npm run refresh:social
```

Photo metadata refresh is optional and needs `PEXELS_API_KEY` in the shell environment:

```sh
npm run refresh:photos
```

The key stays outside browser code. Curated captions and local optimized photo paths survive metadata refreshes. Credentials and `.env` files are excluded from Git.

## Hosting

Publish the repository root to a static host. There is no build command or application server to deploy. Paths are relative, so the site can also be hosted under a repository subpath. The canonical metadata targets `cv.nachoestevo.com`; DNS and production hosting are configured separately.

## Credits and rights

Photography by [Ignacio Estevo](https://www.pexels.com/@nachoestevo/). Individual source links are retained in `data/photos.json`. Project imagery and brand marks identify their respective projects and organizations.

Generative uses [Transitions.dev](https://transitions.dev/) by Jakub Antalik. Its original license is retained in [`vendor/transitions/LICENSE.txt`](vendor/transitions/LICENSE.txt). The layout was inspired by [Mauro Proto](https://www.mauroproto.com/).

This public repository does not grant a blanket reuse license for its personal photographs, branding or third-party assets. See [credits](docs/credits.md).
