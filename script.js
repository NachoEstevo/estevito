// Progressive interactions. Project details and activity own their separate modules.
(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const t = key => window.cvI18n.t(key);
  const themeButton = document.querySelector('[data-theme-toggle]');
  const runningAnimations = new Set();
  let activeThemeTransition;
  let themeChanging = false;
  function animate(element, keyframes, options) {
    if (reducedMotion.matches || typeof element.animate !== 'function') return;
    const animation = element.animate(keyframes, options);
    runningAnimations.add(animation);
    animation.finished.catch(() => {}).finally(() => runningAnimations.delete(animation));
    return animation;
  }

  const email = document.querySelector('[data-copy-email]');
  const toast = document.querySelector('.toast');
  const toastText = toast.querySelector('[data-toast-text]');
  let toastTimer;
  let toastKey;
  function showToast(key) {
    clearTimeout(toastTimer);
    toastKey = key;
    toastText.textContent = '';
    requestAnimationFrame(() => {
      toastText.textContent = t(key);
      toast.classList.add('is-visible');
    });
    toastTimer = setTimeout(() => {
      toast.classList.remove('is-visible');
      toastKey = null;
    }, 2600);
  }
  function selectEmail() {
    const range = document.createRange();
    range.selectNodeContents(email);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
  email.addEventListener('click', async event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    try {
      if (!navigator.clipboard?.writeText) throw Error('Clipboard unavailable');
      await navigator.clipboard.writeText('igestevo@gmail.com');
      showToast('copied');
    } catch {
      selectEmail();
      // Keep a real manual fallback rather than reporting success when permission was denied.
      showToast('copyFailed');
    }
  });

  function syncThemeLabel() {
    const label = t(root.dataset.theme === 'dark' ? 'lightMode' : 'darkMode');
    themeButton.setAttribute('aria-label', label);
    themeButton.title = label;
    themeButton.setAttribute('aria-pressed', String(root.dataset.theme === 'dark'));
  }
  function setTheme(theme, persist = false) {
    root.dataset.theme = theme;
    syncThemeLabel();
    document.querySelector('meta[name="theme-color"]').content =
      theme === 'dark' ? '#171917' : '#fafaf9';
    if (persist) {
      try {
        localStorage.setItem('nacho-cv-theme', theme);
      } catch {}
    }
    document.dispatchEvent(new CustomEvent('cv:themechange', { detail: { theme } }));
  }
  let savedTheme;
  try {
    savedTheme = localStorage.getItem('nacho-cv-theme');
  } catch {}
  setTheme(savedTheme === 'dark' ? 'dark' : 'light');
  themeButton.hidden = false;
  themeButton.addEventListener('click', async () => {
    if (themeChanging) return;
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    if (reducedMotion.matches || !document.startViewTransition) {
      setTheme(nextTheme, true);
      return;
    }
    themeChanging = true;
    const softMask =
      'registerProperty' in CSS &&
      CSS.supports('mask-image', 'linear-gradient(120deg, #000, transparent)');
    root.dataset.themeReveal = softMask ? 'develop' : 'fade';
    root.style.setProperty(
      '--theme-sweep-angle',
      nextTheme === 'dark' ? '135deg' : '315deg'
    );
    try {
      activeThemeTransition = document.startViewTransition(() =>
        setTheme(nextTheme, true)
      );
      await activeThemeTransition.ready;
      const keyframes = softMask
        ? { '--theme-progress': ['-18%', '118%'] }
        : { opacity: [0, 1] };
      animate(root, keyframes, {
        duration: softMask ? 1450 : 450,
        easing: 'cubic-bezier(.4, 0, .2, 1)',
        fill: 'forwards',
        pseudoElement: '::view-transition-new(root)',
      });
      await activeThemeTransition.finished;
    } catch {
      // A hidden document or unsupported animation can skip the transition; the choice still applies.
      activeThemeTransition?.skipTransition();
      setTheme(nextTheme, true);
    } finally {
      delete root.dataset.themeReveal;
      activeThemeTransition = null;
      themeChanging = false;
    }
  });

  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          entry.target
            .querySelectorAll('.award-sticker')
            .forEach(sticker => {
              // Hand transform ownership to the float only after arrival ends.
              sticker.addEventListener('animationend', () => sticker.classList.add('is-settled'), { once: true });
              sticker.classList.add('is-revealed');
            });
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll('.project-grid').forEach(grid => observer.observe(grid));
    reducedMotion.addEventListener('change', () => {
      if (reducedMotion.matches) observer.disconnect();
    });
  }
  reducedMotion.addEventListener('change', () => {
    if (!reducedMotion.matches) return;
    runningAnimations.forEach(animation => animation.cancel());
    activeThemeTransition?.skipTransition();
  });

  const avatarButton = document.querySelector('[data-avatar]');
  const avatarImage = avatarButton.querySelector('img');
  let avatarIsPortrait = true;
  function syncAvatar() {
    avatarImage.alt = t(avatarIsPortrait ? 'portraitAlt' : 'githubAvatarAlt');
    avatarButton.setAttribute(
      'aria-label',
      t(avatarIsPortrait ? 'avatarOther' : 'avatarPhoto')
    );
    avatarButton.title = avatarButton.getAttribute('aria-label');
  }
  syncAvatar();
  avatarButton.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    avatarIsPortrait = !avatarIsPortrait;
    avatarImage.src = avatarIsPortrait
      ? './assets/portrait.webp'
      : './assets/avatar.webp';
    syncAvatar();
    animate(
      avatarImage,
      [
        { opacity: 0.3, transform: 'scale(.92)' },
        { opacity: 1, transform: 'scale(1)' },
      ],
      { duration: 300, easing: 'cubic-bezier(.22, 1, .36, 1)' }
    );
  });
  const photoDialog = document.querySelector('.photo-dialog');
  let activePhotoLink;
  let photoStories;
  let storiesRequest;
  const storyPanel = photoDialog.querySelector('.photo-story');
  function syncStory() {
    const id = activePhotoLink?.dataset.story;
    storyPanel.hidden = !id;
    photoDialog.querySelector('figcaption').hidden = Boolean(id);
    photoDialog.setAttribute('aria-labelledby', id ? 'photo-story-title' : 'photo-caption');
    if (id) {
      const stamp = storyPanel.querySelector('.postcard-mark');
      const source = activePhotoLink.dataset.stamp;
      if (stamp.getAttribute('src') !== source) stamp.setAttribute('src', source);
    }
    photoDialog.classList.toggle('photo-dialog--story', Boolean(id));
    const body = storyPanel.querySelector('.photo-story-body');
    body.replaceChildren();
    if (!id) return;
    const lang = document.documentElement.lang === 'en' ? 'en' : 'es';
    const story = photoStories?.[id]?.[lang];
    storyPanel.querySelector('h2').textContent = story?.title || t('photoStoryHeading');
    const paragraphs = story?.paragraphs || [];
    for (const text of paragraphs.length ? paragraphs : [t('photoStoryPending')]) {
      const paragraph = document.createElement('p');
      paragraph.textContent = text;
      body.append(paragraph);
    }
  }
  function loadStories() {
    if (photoStories || storiesRequest) return;
    storiesRequest = fetch('./data/photo-stories.json', { signal: AbortSignal.timeout(6000) })
      .then(response => { if (!response.ok) throw new Error('Stories unavailable'); return response.json(); })
      .then(data => { photoStories = data; syncStory(); })
      .catch(() => {})
      .finally(() => { storiesRequest = null; });
  }
  function syncPhoto() {
    if (!activePhotoLink) return;
    syncStory();
    photoDialog.querySelector('img').alt = activePhotoLink.querySelector('img').alt;
    photoDialog.querySelector('figcaption').textContent = activePhotoLink
      .closest('figure')
      .querySelector('figcaption').textContent;
  }
  if (typeof photoDialog.showModal === 'function') {
    document.addEventListener('click', event => {
      const link = event.target.closest('[data-photo]');
      if (!link) return;
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      activePhotoLink = link;
      if (link.dataset.story) loadStories();
      photoDialog.querySelector('img').src = link.href;
      syncPhoto();
      photoDialog.showModal();
      animate(
        photoDialog,
        [
          { opacity: 0, transform: 'translateY(6px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ],
        { duration: 240, easing: 'cubic-bezier(.22, 1, .36, 1)' }
      );
    });
    photoDialog.addEventListener('click', event => {
      const bounds = photoDialog.getBoundingClientRect();
      if (
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom
      )
        photoDialog.close();
    });
  }
  document.addEventListener('cv:languagechange', () => {
    syncThemeLabel();
    syncAvatar();
    syncPhoto();
    if (toastKey) toastText.textContent = t(toastKey);
  });
})();
