(() => {
  let data, activity;
  const en = () => document.documentElement.lang === 'en';
  const usd = value =>
    new Intl.NumberFormat(en() ? 'en-US' : 'es-AR', {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'code',
      maximumFractionDigits: 2,
    }).format(value);
  const popovers = [];
  function popover(link, kind) {
    if (!link) return;
    const wrap = document.createElement('span');
    wrap.className = 'social-detail-wrap';
    link.before(wrap);
    wrap.append(link);
    const panel = document.createElement('span');
    panel.className = 'social-popover';
    panel.dataset.kind = kind;
    panel.setAttribute('role', 'group');
    wrap.append(panel);
    function position() {
      const rect = wrap.getBoundingClientRect();
      const width = panel.offsetWidth;
      panel.style.left = `${Math.max(
        8,
        Math.min(rect.left + rect.width / 2 - width / 2, document.documentElement.clientWidth - width - 8)
      )}px`;
      const height = panel.offsetHeight;
      const above = rect.top >= height + 8;
      panel.style.top = `${above ? rect.top - height + 2 : rect.bottom - 2}px`;
      panel.dataset.side = above ? 'above' : 'below';
      panel.style.setProperty(
        '--dock-x',
        `${rect.left + rect.width / 2 - parseFloat(panel.style.left)}px`
      );
    }
    wrap.addEventListener('pointerenter', position);
    wrap.addEventListener('focusin', position);
    popovers.push({ panel, kind, link, position });
  }
  popover(
    document.querySelector('.contact-links a[href="https://github.com/NachoEstevo"]'),
    'github'
  );
  popover(document.querySelector('.contact-links .tokens-link'), 'tokscale');
  popover(document.querySelector('.contact-links a[href*="linkedin.com"]'), 'linkedin');
  popover(
    document.querySelector('.contact-links a[href="https://x.com/Nachoestevo"]'),
    'x'
  );
  function render() {
    for (const { panel, kind, link: profileLink, position } of popovers) {
      const profile = kind === 'linkedin' || kind === 'x';
      if (!profile && !data) continue;
      panel.replaceChildren();
      const header = document.createElement('div');
      header.className = 'social-card-header';
      const avatar = document.createElement('img');
      avatar.src = profile
        ? `./assets/social/${kind}-avatar.webp`
        : './assets/avatar.webp';
      avatar.decoding = 'async';
      avatar.alt = '';
      avatar.width = 40;
      avatar.height = 40;
      const identity = document.createElement('div');
      const title = document.createElement('strong');
      title.textContent = profile
        ? 'Ignacio Estevo'
        : kind === 'github'
        ? 'GitHub'
        : 'Tokscale';
      const handle = document.createElement('small');
      handle.textContent =
        kind === 'linkedin'
          ? 'LinkedIn · Ignacio Estevo'
          : kind === 'x'
          ? 'X · @Nachoestevo'
          : '@NachoEstevo';
      identity.append(title, handle);
      header.append(avatar, identity);
      if (profile) {
        const cover = document.createElement('img');
        cover.className = 'social-profile-cover';
        cover.src = `./assets/social/${kind}-banner.webp`;
        cover.alt = '';
        cover.width = 720;
        cover.height = kind === 'x' ? 240 : 180;
        cover.decoding = 'async';
        cover.setAttribute('aria-hidden', 'true');
        panel.append(cover);
      }
      panel.append(header);
      if (profile) {
        const bio = document.createElement('p');
        bio.className = 'social-profile-copy';
        bio.textContent =
          kind === 'x'
            ? 'a bit of everything'
            : en()
            ? 'Software engineer · CoFounder at Acelera & Rely.'
            : 'Ingeniero informático · CoFounder de Acelera y Rely.';
        const action = document.createElement('a');
        action.href = profileLink.href;
        action.textContent = en()
          ? `View on ${kind === 'x' ? 'X' : 'LinkedIn'}`
          : `Ver perfil en ${kind === 'x' ? 'X' : 'LinkedIn'}`;
        panel.append(bio, action);
        position();
        continue;
      }
      const metric = document.createElement('div');
      metric.className = 'social-card-metric';
      const count = document.createElement('strong');
      const label = document.createElement('span');
      const source = activity?.[kind];
      count.textContent =
        kind === 'github'
          ? source
            ? new Intl.NumberFormat(en() ? 'en-US' : 'es-AR').format(source.total)
            : '—'
          : new Intl.NumberFormat(en() ? 'en-US' : 'es-AR', {
              notation: 'compact',
              maximumFractionDigits: 1,
            }).format(data.tokenTotal);
      label.textContent =
        kind === 'github'
          ? en()
            ? 'contributions in the last year'
            : 'contribuciones en el último año'
          : en()
          ? 'tokens in total'
          : 'tokens en total';
      metric.append(count, label);
      panel.append(metric);
      if (source?.days?.length) {
        const grid = document.createElement('div');
        grid.className = 'social-card-calendar';
        grid.setAttribute('role', 'img');
        grid.setAttribute(
          'aria-label',
          en() ? 'Activity over the last 20 weeks' : 'Actividad de las últimas 20 semanas'
        );
        source.days.slice(-140).forEach(day => {
          const cell = document.createElement('span');
          cell.dataset.level = day.level;
          grid.append(cell);
        });
        panel.append(grid);
      }
      if (kind === 'github')
        for (const commit of data.commits.slice(0, 3)) {
          const link = document.createElement('a');
          link.href = commit.url;
          link.textContent = commit.message;
          const meta = document.createElement('small');
          meta.textContent = `${commit.repo.replace(
            'NachoEstevo/',
            ''
          )} · ${commit.sha.slice(0, 7)}`;
          link.append(meta);
          panel.append(link);
        }
      else {
        const cost = document.createElement('p');
        cost.textContent = `${usd(data.costUSD)} · ${
          en() ? 'reported cost' : 'costo reportado'
        }`;
        cost.className = 'social-card-cost';
        panel.append(cost);
      }
    }
    if (!data) return;
    const panel = document.querySelector('[data-tokscale-activity]');
    let cost = panel.querySelector('.activity-cost');
    if (!cost) {
      cost = document.createElement('p');
      cost.className = 'activity-cost';
      panel.querySelector('.activity-heading').after(cost);
    }
    cost.textContent = `${usd(data.costUSD)} · ${
      en() ? 'total cost reported by Tokscale' : 'costo total reportado por Tokscale'
    }`;
  }
  const tip = document.createElement('div');
  tip.className = 'activity-tooltip';
  tip.hidden = true;
  document.body.append(tip);
  document.addEventListener('pointerover', event => {
    const cell = event.target.closest('.heatmap-day[data-date]');
    if (!cell) return;
    if (cell.title) {
      cell.dataset.tooltip = cell.title;
      cell.removeAttribute('title');
    }
    let text = cell.dataset.tooltip || '';
    if (cell.closest('[data-tokscale-activity]') && data) {
      const day = data.dailyCosts.find(d => d.date === cell.dataset.date);
      if (day && Number.isFinite(day.costUSD)) text += ` · ${usd(day.costUSD)}`;
    }
    tip.textContent = text;
    tip.hidden = false;
    const r = cell.getBoundingClientRect();
    tip.style.left = `${Math.max(
      8,
      Math.min(r.left, innerWidth - tip.offsetWidth - 8)
    )}px`;
    tip.style.top = `${Math.max(8, r.top - tip.offsetHeight - 9)}px`;
  });
  document.addEventListener('pointerout', event => {
    if (event.target.closest('.heatmap-day')) tip.hidden = true;
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') tip.hidden = true;
  });
  window.addEventListener('scroll', () => (tip.hidden = true), { passive: true });
  document.addEventListener('cv:languagechange', render);
  document.addEventListener('cv:activitydata', event => {
    activity = event.detail;
    render();
  });
  window.addEventListener('resize', () => popovers.forEach(({ position }) => position()));
  window.addEventListener(
    'scroll',
    () => popovers.forEach(({ position }) => position()),
    { passive: true }
  );
  render();
  fetch('./data/social.json', { signal: AbortSignal.timeout(6000) })
    .then(r => {
      if (!r.ok) throw new Error('Unavailable');
      return r.json();
    })
    .then(value => {
      data = value;
      render();
    })
    .catch(() => {
      popovers
        .filter(({ kind }) => kind === 'github' || kind === 'tokscale')
        .forEach(({ panel }) => panel.remove());
    });
})();
