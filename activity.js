// Public aggregates are refreshed before publication. The browser only requests local data.
(() => {
  const DAY = 86_400_000;
  const panels = ['github', 'tokscale'];
  let snapshot;
  let loading = true;
  const copy = {
    es: {
      unavailable: 'Actividad no disponible',
      profile: 'Podés consultar el perfil público.',
      loading: 'Cargando actividad pública…',
      contributions: 'contribuciones',
      annualContributions: 'contribuciones en el último año',
      weekdays: ['Lun', 'Mié', 'Vie'],
      calendarScroll: 'Calendario anual. Deslizá horizontalmente para recorrer el año.',
      tokens: 'tokens',
      allTime: 'en total',
      saved: 'Datos guardados',
      billionTokens: 'mil millones de tokens',
      millionTokens: 'millones de tokens',
      recordedTokens: 'tokens registrados',
      active: 'días activos',
      less: 'Menos',
      more: 'Más',
      range: 'del',
      until: 'al',
    },
    en: {
      unavailable: 'Activity unavailable',
      profile: 'You can visit the public profile.',
      loading: 'Loading public activity…',
      contributions: 'contributions',
      annualContributions: 'contributions in the last year',
      weekdays: ['Mon', 'Wed', 'Fri'],
      calendarScroll: 'Annual calendar. Scroll horizontally to explore the year.',
      tokens: 'tokens',
      allTime: 'in total',
      saved: 'Saved data',
      billionTokens: 'billion tokens',
      millionTokens: 'million tokens',
      recordedTokens: 'recorded tokens',
      active: 'active days',
      less: 'Less',
      more: 'More',
      range: 'from',
      until: 'to',
    },
  };
  const setText = (panel, selector, value) => {
    const target = panel.querySelector(selector);
    if (target) target.textContent = value;
  };
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  function formatting() {
    const language = document.documentElement.lang.startsWith('en') ? 'en' : 'es';
    const locale = language === 'en' ? 'en-US' : 'es-AR';
    return {
      t: copy[language],
      number: new Intl.NumberFormat(locale),
      decimal: new Intl.NumberFormat(locale, {
        maximumFractionDigits: 1,
      }),
      fullDate: new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      }),
      month: new Intl.DateTimeFormat(locale, { month: 'short', timeZone: 'UTC' }),
    };
  }
  function validSnapshot(source, name) {
    if (
      source?.status !== 'ready' ||
      !Array.isArray(source.days) ||
      !Number.isFinite(Date.parse(source.fetchedAt)) ||
      !Number.isSafeInteger(source.total) ||
      source.total < 0
    )
      return false;
    const start = Date.parse(`${source.period?.start}T00:00:00Z`);
    const end = Date.parse(`${source.period?.end}T00:00:00Z`);
    const length = source.days.length;
    if (!Number.isFinite(start) || end - start !== (length - 1) * DAY) return false;
    if (length < 365 || length > 371 || new Date(start).getUTCDay() !== 0) return false;
    if (source.metric !== (name === 'github' ? 'contributions' : 'tokens')) return false;
    if (
      name === 'tokscale' &&
      (!Number.isSafeInteger(source.lifetimeTotal) ||
        source.lifetimeTotal < source.total ||
        !Number.isSafeInteger(source.cacheTokens) ||
        source.cacheTokens < 0 ||
        source.cacheTokens > source.total)
    )
      return false;
    return (
      source.days.every(
        (day, i) =>
          day.date === new Date(start + i * DAY).toISOString().slice(0, 10) &&
          Number.isSafeInteger(day.count) &&
          day.count >= 0 &&
          Number.isInteger(day.level) &&
          day.level >= 0 &&
          day.level <= 4 &&
          (day.count === 0) === (day.level === 0)
      ) && source.days.reduce((total, day) => total + day.count, 0) === source.total
    );
  }
  function renderGrid(target, source, unit, format) {
    if (!target) return;
    const { t, fullDate: date, month, number } = format;
    const first = new Date(`${source.days[0].date}T00:00:00Z`);
    const last = new Date(`${source.period.end}T00:00:00Z`);
    const padding = first.getUTCDay();
    const weeks = Math.ceil((padding + source.days.length) / 7);
    const cells = element('div', 'heatmap-cells');
    cells.setAttribute('aria-hidden', 'true');
    const labels = element('div', 'heatmap-months');
    labels.setAttribute('aria-hidden', 'true');
    let lastMonth = '';
    for (let i = 0; i < weeks * 7; i++) {
      const cell = element('span', 'heatmap-day');
      const day = source.days[i - padding];
      if (!day) {
        cell.classList.add('heatmap-day--empty');
      } else {
        cell.dataset.level = day.level;
        cell.dataset.date = day.date;
        const dayDate = new Date(`${day.date}T00:00:00Z`);
        cell.title = `${date.format(dayDate)}: ${number.format(day.count)} ${unit}`;
        const label = month.format(dayDate);
        if (label !== lastMonth && i % 7 === 0) {
          const text = element('span', 'heatmap-month', label);
          text.style.gridColumn = String(Math.floor(i / 7) + 1);
          labels.append(text);
          lastMonth = label;
        }
      }
      cells.append(cell);
    }
    const legend = element('div', 'heatmap-legend');
    legend.setAttribute('aria-hidden', 'true');
    legend.append(element('span', '', t.less));
    for (let level = 0; level <= 4; level++) {
      const swatch = element('span', 'heatmap-day');
      swatch.dataset.level = level;
      legend.append(swatch);
    }
    legend.append(element('span', '', t.more));
    target.style.setProperty('--heatmap-weeks', String(weeks));
    target.setAttribute('role', 'group');
    const accessibleDate = format.fullDate;
    target.setAttribute(
      'aria-label',
      `${number.format(source.total)} ${unit}, ${t.range} ${accessibleDate.format(
        first
      )} ${t.until} ${accessibleDate.format(last)}. ${
        source.days.filter(day => day.count > 0).length
      } ${t.active}.`
    );
    const weekdays = element('div', 'heatmap-weekdays');
    weekdays.setAttribute('aria-hidden', 'true');
    for (const [i, label] of t.weekdays.entries()) {
      const day = element('span', '', label);
      day.style.gridRow = String(i * 2 + 2);
      weekdays.append(day);
    }
    const calendar = element('div', 'heatmap-calendar');
    calendar.append(labels, weekdays, cells);
    const scroll = element('div', 'heatmap-scroll');
    scroll.tabIndex = 0;
    scroll.setAttribute('role', 'group');
    scroll.setAttribute('aria-label', t.calendarScroll);
    scroll.append(calendar);
    target.replaceChildren(scroll, legend);
    scroll.scrollLeft = scroll.scrollWidth;
  }
  function render(name, source, format) {
    const panel = document.querySelector(`[data-${name}-activity]`);
    if (!panel) return;
    const { t, number, decimal } = format;
    const status = panel.querySelector(`[data-${name}-status]`);
    panel.removeAttribute('aria-busy');
    if (!validSnapshot(source, name)) {
      panel.dataset.state = 'unavailable';
      setText(panel, `[data-${name}-summary]`, t.unavailable);
      status.hidden = false;
      status.textContent = t.profile;
      setText(panel, `[data-${name}-grid]`, '');
      panel.querySelector(`[data-${name}-summary]`)?.removeAttribute('title');
      panel.querySelector(`[data-${name}-grid]`)?.removeAttribute('aria-label');
      return;
    }
    const stale =
      Boolean(source.refreshFailedAt) ||
      Date.now() - Date.parse(source.fetchedAt) > 7 * DAY;
    panel.dataset.state = stale ? 'stale' : 'ready';
    status.hidden = !stale;
    status.textContent = stale ? t.saved : '';
    const github = name === 'github';
    // Tokscale's profile headline is lifetime usage; the calendar keeps its own annual total.
    const total = github ? source.total : source.lifetimeTotal;
    let value = number.format(total);
    let visibleUnit = github ? t.annualContributions : t.tokens;
    if (!github && total >= 1_000_000) {
      const billion = total >= 1_000_000_000;
      value = decimal.format(total / (billion ? 1_000_000_000 : 1_000_000));
      visibleUnit = billion ? t.billionTokens : t.millionTokens;
    }
    if (!github) visibleUnit += ` ${t.allTime}`;
    const summary = panel.querySelector(`[data-${name}-summary]`);
    if (summary) {
      summary.replaceChildren(
        element('strong', 'activity-value', value),
        ' ',
        element('span', 'activity-unit', visibleUnit)
      );
      summary.title = `${number.format(total)} ${
        github ? t.contributions : t.tokens + ' ' + t.allTime
      }`;
    }
    renderGrid(
      panel.querySelector(`[data-${name}-grid]`),
      source,
      github ? t.contributions : t.recordedTokens,
      format
    );
  }
  function renderAll() {
    const format = formatting();
    const githubLink = document.querySelector('[data-github-activity] h3 a');
    if (githubLink && !githubLink.querySelector('img')) {
      const mark = element('img', 'activity-github-mark');
      mark.src = './assets/brand/github.svg';
      mark.width = mark.height = 17;
      mark.alt = '';
      githubLink.prepend(mark);
    }
    for (const name of panels) {
      if (loading) {
        const panel = document.querySelector(`[data-${name}-activity]`);
        if (!panel) continue;
        panel.setAttribute('aria-busy', 'true');
        panel.dataset.state = 'loading';
        panel.querySelector(`[data-${name}-status]`).hidden = false;
        setText(panel, `[data-${name}-status]`, format.t.loading);
      } else render(name, snapshot?.schemaVersion === 1 ? snapshot[name] : null, format);
    }
  }
  document.addEventListener('cv:languagechange', renderAll);
  const syncTheme = () => {
    const mark = document.querySelector('.activity-github-mark');
    if (mark)
      mark.src = `./assets/brand/github${
        document.documentElement.dataset.theme === 'dark' ? '-light' : ''
      }.svg`;
  };
  document.addEventListener('cv:themechange', syncTheme);
  renderAll();
  syncTheme();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);
  fetch('./data/activity.json', { credentials: 'omit', signal: controller.signal })
    .then(response => {
      if (!response.ok) throw new Error('Activity unavailable');
      return response.json();
    })
    .then(data => {
      snapshot = data;
      document.dispatchEvent(new CustomEvent('cv:activitydata', { detail: data }));
    })
    .catch(() => {
      snapshot = null;
    })
    .finally(() => {
      clearTimeout(timeout);
      loading = false;
      renderAll();
    });
})();
