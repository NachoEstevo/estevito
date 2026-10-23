(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const english = () => document.documentElement.lang === 'en';
  async function expand(region, open) {
    region.getAnimations().forEach(animation => animation.cancel());
    if (open) region.hidden = false;
    if (!reduced.matches) {
      const height = region.scrollHeight;
      const animation = region.animate(
        open
          ? [
              { height: '0px', opacity: 0 },
              { height: `${height}px`, opacity: 1 },
            ]
          : [
              { height: `${height}px`, opacity: 1 },
              { height: '0px', opacity: 0 },
            ],
        { duration: 460, easing: 'cubic-bezier(.22,1,.36,1)' }
      );
      await animation.finished.catch(() => {});
    }
    region.hidden = !open;
  }
  const projectsButton = document.querySelector('[data-i18n="allProjects"]');
  const projectsRegion = document.querySelector('#more-projects');
  const mobileProjects = matchMedia('(max-width: 600px)');
  const featuredGrid = projectsRegion.previousElementSibling;
  const aceleraCard = projectsRegion.querySelector('[data-project="acelera"]').closest('.project');
  const aceleraPosition = document.createComment('Acelera desktop position');
  aceleraCard.before(aceleraPosition);
  function placeAcelera() {
    if (mobileProjects.matches) featuredGrid.append(aceleraCard);
    else aceleraPosition.after(aceleraCard);
  }
  placeAcelera();
  mobileProjects.addEventListener('change', async () => {
    await window.cvProjects?.close();
    placeAcelera();
  });
  let projectsOpen = false,
    busyProjects = false;
  const hackathonSection = document.querySelector(
    '[aria-labelledby="experiments-heading"]'
  );
  const additionalCards = [...hackathonSection.querySelectorAll('.project')].map(card => {
    const marker = document.createComment('project position');
    card.before(marker);
    return { card, marker };
  });
  projectsButton.setAttribute('role', 'button');
  projectsButton.setAttribute('aria-controls', projectsRegion.id);
  projectsButton.setAttribute('aria-expanded', 'false');
  projectsButton.href = '#more-projects';
  function labels() {
    projectsButton.textContent = projectsOpen
      ? english()
        ? 'Fewer projects'
        : 'Menos proyectos'
      : english()
      ? 'All projects'
      : 'Todos los proyectos';
    document.querySelector('#photos-heading').textContent = photosOpen
      ? english()
        ? 'Photography'
        : 'Fotografía'
      : english()
      ? 'Away from the screen'
      : 'Fuera de la pantalla';
    photosButton.textContent = photosOpen
      ? english()
        ? 'Back to CV'
        : 'Volver al CV'
      : english()
      ? 'More photographs'
      : 'Más fotografías';
  }
  projectsButton.addEventListener('click', async event => {
    event.preventDefault();
    if (busyProjects) return;
    busyProjects = true;
    try {
      document.dispatchEvent(new Event('cv:interaction'));
      await window.cvProjects?.close();
      projectsOpen = !projectsOpen;
      if (projectsOpen) {
        projectsRegion.style.visibility = 'hidden';
        additionalCards.forEach(({ card }) =>
          projectsRegion.querySelector('.project-grid').append(card)
        );
        const vocero = projectsRegion.querySelector('[data-project="vocero"]').closest('.project');
        projectsRegion.querySelector('.project-grid').append(vocero);
        hackathonSection.hidden = true;
      } else {
        additionalCards.forEach(({ card, marker }) => marker.after(card));
        hackathonSection.hidden = false;
      }
      projectsButton.setAttribute('aria-expanded', String(projectsOpen));
      labels();
      await expand(projectsRegion, projectsOpen);
      if (projectsOpen) {
        await Promise.all(
          [...projectsRegion.querySelectorAll('img')].map(
            image => ((image.loading = 'eager'), image.decode().catch(() => {}))
          )
        );
        // Same task: the runtime hides content before the browser can paint it.
        projectsRegion.style.visibility = '';
        document.dispatchEvent(
          new CustomEvent('cv:generate', { detail: { element: projectsRegion } })
        );
      }
    } finally {
      projectsRegion.style.visibility = '';
      busyProjects = false;
    }
  });

  const photosButton = document.querySelector('[data-i18n="allPhotos"]');
  const photosRegion = document.createElement('div');
  photosRegion.id = 'more-photos';
  photosRegion.className = 'expand-region';
  photosRegion.hidden = true;
  document.querySelector('.photos-section').append(photosRegion);
  photosButton.setAttribute('role', 'button');
  photosButton.setAttribute('aria-controls', photosRegion.id);
  photosButton.setAttribute('aria-expanded', 'false');
  photosButton.href = '#more-photos';
  let photosOpen = false,
    loaded = false,
    busyPhotos = false;
  let returnScroll = 0;
  async function photographyMode(open) {
    document.dispatchEvent(new Event('cv:interaction'));
    const root = document.documentElement;
    const figures = [...document.querySelectorAll('.photo-strip figure')];
    if (open) returnScroll = window.scrollY;
    const change = () => {
      root.classList.toggle('photography-mode', open);
      photosRegion.hidden = !open;
      window.scrollTo({ top: open ? 0 : returnScroll, behavior: 'instant' });
    };
    if (document.startViewTransition && !reduced.matches) {
      figures.forEach(
        (figure, i) => (figure.style.viewTransitionName = `gallery-photo-${i}`)
      );
      root.dataset.galleryTransition = '';
      try {
        await document.startViewTransition(change).finished;
      } catch {
        change();
      } finally {
        figures.forEach(figure => (figure.style.viewTransitionName = ''));
        delete root.dataset.galleryTransition;
      }
    } else {
      change();
      if (!reduced.matches)
        await document
          .querySelector('.photos-section')
          .animate(
            [
              { opacity: 0, transform: 'translateY(12px)' },
              { opacity: 1, transform: 'none' },
            ],
            { duration: 400, easing: 'cubic-bezier(.22,1,.36,1)' }
          )
          .finished.catch(() => {});
    }
    photosButton.focus({ preventScroll: true });
  }
  photosButton.addEventListener('click', async event => {
    event.preventDefault();
    if (busyPhotos) return;
    busyPhotos = true;
    photosButton.setAttribute('aria-busy', 'true');
    try {
      if (!loaded) {
        const response = await fetch('./data/photos.json', {
          signal: AbortSignal.timeout(6000),
        });
        if (!response.ok) throw new Error('Photos unavailable');
        const data = await response.json();
        const grid = document.createElement('div');
        grid.className = 'extra-photos';
        for (const photo of data.photos) {
          const figure = document.createElement('figure');
          const link = document.createElement('a');
          link.className = 'photo-link';
          link.dataset.photo = '';
          link.href = photo.full;
          const img = document.createElement('img');
          img.src = photo.src;
          img.alt = photo.alt;
          img.width = photo.width;
          img.height = photo.height;
          img.loading = 'lazy';
          img.decoding = 'async';
          const caption = document.createElement('figcaption');
          caption.dataset.captionEs = photo.caption?.es || 'Fotografía';
          caption.dataset.captionEn = photo.caption?.en || 'Photograph';
          caption.textContent = english()
            ? caption.dataset.captionEn
            : caption.dataset.captionEs;
          img.alt = caption.textContent;
          link.append(img);
          figure.append(link, caption);
          grid.append(figure);
        }
        const attribution = document.createElement('a');
        attribution.href = data.profile;
        attribution.className = 'photo-credit';
        attribution.textContent = 'Ignacio Estevo · Pexels';
        photosRegion.replaceChildren(grid, attribution);
        loaded = true;
      }
      photosOpen = !photosOpen;
      photosButton.setAttribute('aria-expanded', String(photosOpen));
      labels();
      await photographyMode(photosOpen);
    } catch {
      photosRegion.hidden = false;
      photosRegion.textContent = english()
        ? 'Could not load photographs. Try again.'
        : 'No se pudieron cargar las fotos. Volvé a intentar.';
    } finally {
      busyPhotos = false;
      photosButton.removeAttribute('aria-busy');
    }
  });
  [projectsButton, photosButton].forEach(button =>
    button.addEventListener('keydown', event => {
      if (event.key === ' ') {
        event.preventDefault();
        button.click();
      }
    })
  );
  document.addEventListener('cv:languagechange', () => {
    labels();
    photosRegion.querySelectorAll('figcaption').forEach(caption => {
      caption.textContent = english()
        ? caption.dataset.captionEn
        : caption.dataset.captionEs;
      caption.closest('figure').querySelector('img').alt = caption.textContent;
    });
  });
})();
