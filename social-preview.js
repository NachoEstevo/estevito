// Keep the decorative fan inside the viewport; the anchor always opens the profile.
(() => {
  const link = document.querySelector('.pexels-link');
  const preview = link?.querySelector('.pexels-preview');
  if (!preview) return;
  function positionPreview() {
    const bounds = link.getBoundingClientRect();
    const width = preview.getBoundingClientRect().width;
    const origin = bounds.left + bounds.width / 2;
    const center = Math.max(
      width / 2 + 16,
      Math.min(innerWidth - width / 2 - 16, origin)
    );
    preview.style.setProperty('--preview-shift', `${center - origin}px`);
  }
  let loading;
  function loadPreview() {
    if (loading) return loading;
    loading = Promise.all(
      [...preview.querySelectorAll('img[data-src]')].map(async image => {
        image.src = image.dataset.src;
        delete image.dataset.src;
        try {
          await image.decode();
        } catch {
          // A failed decorative image must never block the profile link.
        }
      })
    ).then(() => link.setAttribute('data-preview-ready', ''));
    return loading;
  }
  function resetPreview() {
    link.removeAttribute('data-preview-dismissed');
    positionPreview();
    loadPreview();
  }
  link.addEventListener('pointerenter', resetPreview);
  link.addEventListener('focus', resetPreview);
  document.addEventListener(
    'keydown',
    event => {
      if (
        event.key !== 'Escape' ||
        !link.matches(':hover, :focus-visible') ||
        link.hasAttribute('data-preview-dismissed')
      )
        return;
      link.setAttribute('data-preview-dismissed', '');
      event.preventDefault();
      event.stopPropagation();
    },
    true
  );
  window.addEventListener('resize', positionPreview);
  document.addEventListener('cv:languagechange', positionPreview);
  positionPreview();
})();
