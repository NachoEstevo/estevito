// Small, independent project reader. The HTML links remain useful without JavaScript.
// Content is based on src/data/projects.js and the portfolio's project case studies.
(() => {
  const projects = {
    vocero: {
      title: 'Vocero',
      url: 'mailto:igestevo@gmail.com',
      es: {
        role: 'Founder',
        summary: 'Flujos de voz para operaciones reales.',
        paragraphs: [
          'Una plataforma privada para explorar agentes de voz, transferencias a personas, integraciones y control operativo.',
          'El trabajo reúne flujos de llamadas, salud de integraciones y herramientas para revisar qué necesita un equipo antes de poner una automatización en uso.',
        ],
        focus: 'Agentes de voz · Integraciones · Operaciones',
        action: 'Conversar sobre Vocero',
      },
      en: {
        role: 'Founder',
        summary: 'Voice workflows for real operations.',
        paragraphs: [
          'A private platform exploring voice agents, human handoff, integrations, and operational control.',
          'The work brings together call flows, integration health, and tools for reviewing what a team needs before putting automation into use.',
        ],
        focus: 'Voice agents · Integrations · Operations',
        action: 'Ask about Vocero',
      },
    },
    rely: {
      title: 'Rely',
      url: 'https://rely.business',
      es: {
        role: 'CoFounder',
        summary: 'Crear una empresa es el primer paso.',
        paragraphs: [
          'Rely acompaña a quienes crean y gestionan una empresa en Estados Unidos. Reúne el proceso de apertura, los documentos de la compañía y los próximos pasos en una plataforma en español.',
          'Como cofundador, trabajo en las decisiones de producto, las interfaces y los sistemas detrás de la plataforma. Desde la web pública y el onboarding hasta la información de la empresa, el foco está en que cada persona entienda qué está listo y qué sigue.',
        ],
        focus: 'Onboarding · Gestión documental · Interfaces de producto',
        caption: 'Web pública de Rely. El panel utiliza datos de una empresa de ejemplo.',
        action: 'Visitar Rely',
      },
      en: {
        role: 'CoFounder',
        summary: 'Starting a company is the first step.',
        paragraphs: [
          'Rely helps founders form and manage a company in the United States. It brings formation, company documents and next steps together in a Spanish-language platform.',
          'As co-founder, I work on product decisions, interfaces and the systems behind the platform. From the public website and onboarding to company information, the focus is helping people understand what is ready and what comes next.',
        ],
        focus: 'Onboarding · Document management · Product interfaces',
        caption: 'Rely’s public website. The dashboard uses illustrative company data.',
        action: 'Visit Rely',
      },
    },
    atrae: {
      title: 'Atrae',
      url: 'https://atrae.app',
      es: {
        role: 'Acelera · Producto, diseño e ingeniería',
        summary: 'De un cliente ideal a una búsqueda concreta.',
        paragraphs: [
          'Estamos construyendo Atrae para agencias y equipos comerciales. Una conversación ayuda a definir qué empresas buscan; la investigación, los contactos y las listas guardadas conviven en un mismo espacio.',
          'Trabajo en la dirección de producto, el diseño de la interfaz y los flujos de búsqueda y enriquecimiento. La experiencia distingue los datos disponibles, los verificados y los que todavía faltan. El producto está en desarrollo.',
        ],
        focus: 'Agentes de IA · Búsqueda B2B · Flujos de datos',
        caption: 'Landing y espacio de trabajo mostrados en el sitio público de Atrae.',
        action: 'Visitar Atrae',
      },
      en: {
        role: 'Acelera · Product, design & engineering',
        summary: 'From an ideal client to a focused search.',
        paragraphs: [
          'We are building Atrae for agencies and sales teams. A conversation helps define the companies they want to reach; research, contacts and saved lists live in one workspace.',
          'I work on product direction, interface design, and search and enrichment workflows. The experience distinguishes available data, verified information and missing fields. The product is in development.',
        ],
        focus: 'AI agents · B2B search · Data workflows',
        caption: 'Landing and product workspace shown on Atrae’s public website.',
        action: 'Visit Atrae',
      },
    },
    kyoto: {
      title: 'Kyoto',
      url: 'https://kyoto.nachoestevo.com',
      es: {
        role: 'Experimento personal · Próximamente',
        summary: 'Una pausa entre puertas torii.',
        paragraphs: [
          'Una exploración interactiva en 3D inspirada en Fushimi Inari. Una escena para recorrer entre árboles y puertas torii, con tiempo para mirar sus detalles.',
          'Es un espacio personal para experimentar con escenas 3D y la sensación de recorrer un lugar desde el navegador. El sitio público todavía está en preparación.',
        ],
        focus: '3D interactivo · Experiencia en el navegador',
        caption: 'Una vista de la escena de Fushimi Inari.',
        action: 'Dirección del proyecto',
        status: 'Próximamente en kyoto.nachoestevo.com',
      },
      en: {
        role: 'Personal experiment · Coming soon',
        summary: 'A quiet moment among the torii.',
        paragraphs: [
          'An interactive 3D exploration inspired by Fushimi Inari. A scene to walk through trees and torii gates, with time to notice the details.',
          'A personal space to experiment with 3D scenes and the feeling of exploring a place in the browser. The public website is still in preparation.',
        ],
        focus: 'Interactive 3D · Browser experience',
        caption: 'A view of the Fushimi Inari scene.',
        action: 'Project address',
        status: 'Coming soon to kyoto.nachoestevo.com',
      },
    },
    faro: {
      title: 'Faro',
      url: 'https://faro-argentina.vercel.app/',
      es: {
        role: 'Producto, sistemas de datos e investigación',
        summary: 'Hacer legible la evidencia pública.',
        paragraphs: [
          'Faro organiza registros oficiales de obras y gasto público en mapas y fichas que se pueden investigar. Cada caso reúne fuentes, datos y límites de verificación para que una persona pueda seguir el rastro.',
          'Trabajé en la estructura de datos, los flujos de búsqueda y filtros, la interacción con el mapa y el lenguaje del producto. La interfaz ayuda a revisar la evidencia y a entender qué necesita una comprobación adicional.',
        ],
        focus: 'Datos públicos · Mapas · Trazabilidad de fuentes',
        caption: 'El mapa y explorador de obras públicas de Faro.',
        action: 'Explorar Faro',
      },
      en: {
        role: 'Product, data systems & investigation',
        summary: 'Making public evidence legible.',
        paragraphs: [
          'Faro organizes official public-works and spending records into maps and searchable case files. Each case brings together sources, data and verification limits so a person can follow the evidence.',
          'I worked on data structure, search and filtering flows, map interaction and product language. The interface helps people inspect the evidence and understand what still needs an additional check.',
        ],
        focus: 'Public data · Maps · Source traceability',
        caption: 'Faro’s public-works map and explorer.',
        action: 'Explore Faro',
      },
    },
    vueltito: {
      title: 'Vueltito',
      url: 'https://vueltito.vercel.app/',
      es: {
        role: 'Ingeniería de producto · Experiencia de pagos',
        summary: 'Pequeñas contribuciones, visibles desde el checkout.',
        paragraphs: [
          'Vueltito propone sumar una microdonación al momento de comprar. La contribución se muestra antes del pago, con el consentimiento del comprador y una ONG verificada como destino.',
          'Mi trabajo combina ingeniería de producto y experiencia de pagos. El proyecto conecta el checkout con un registro auditable de las contribuciones, pensado para acompañar su posterior conciliación.',
        ],
        focus: 'Integración con comercios · Consentimiento · Registro de aportes',
        caption: 'La propuesta de microdonaciones de Vueltito.',
        action: 'Conocer Vueltito',
      },
      en: {
        role: 'Product engineering · Payments experience',
        summary: 'Small contributions, visible at checkout.',
        paragraphs: [
          'Vueltito brings a microdonation into the purchase flow. The contribution is shown before payment, with the buyer’s consent and a verified NGO as its destination.',
          'My work combines product engineering and payments experience. The project connects checkout with an auditable contribution ledger, designed to support later reconciliation.',
        ],
        focus: 'Commerce integration · Consent · Contribution ledger',
        caption: 'Vueltito’s microdonation experience.',
        action: 'Discover Vueltito',
      },
    },
    musa: {
      title: 'MUSA',
      url: 'https://musa-landing-vercel.vercel.app',
      es: {
        role: 'Proyecto en equipo · Musicathon 2026',
        summary: 'Música que también se puede leer y sentir.',
        paragraphs: [
          'MUSA es un prototipo de accesibilidad musical. Explora cómo transformar letras sincronizadas y la estructura de una canción en una experiencia visual, legible y táctil.',
          'Lo construimos en equipo con Mauro Proto usando React Native y Expo. El proyecto combina letras de Musixmatch, análisis de pistas con LALAL.AI y respuesta háptica. Recibió el Premio Especial LALAL.AI en Musicathon 2026.',
        ],
        focus: 'React Native · Expo · Accesibilidad · Respuesta háptica',
        caption: 'MUSA, un experimento de accesibilidad musical.',
        action: 'Ver el proyecto',
      },
      en: {
        role: 'Team project · Musicathon 2026',
        summary: 'Music you can also read and feel.',
        paragraphs: [
          'MUSA is a music-accessibility prototype. It explores how synchronized lyrics and song structure can become a visual, readable and tactile experience.',
          'Built together with Mauro Proto using React Native and Expo, the project combines Musixmatch lyrics, LALAL.AI track analysis and haptic feedback. It received the LALAL.AI Special Prize at Musicathon 2026.',
        ],
        focus: 'React Native · Expo · Accessibility · Haptic feedback',
        caption: 'MUSA, an experiment in music accessibility.',
        action: 'View the project',
      },
    },
    yieldos: {
      title: 'YieldOS',
      url: 'https://github.com/platanus-hack/platanus-hack-26-ar-team-10',
      es: {
        role: 'Platanus Hack 26 · Herramientas para agentes',
        summary: 'Un contrato antes de una acción riesgosa.',
        paragraphs: [
          'YieldOS explora una capa de seguridad entre los agentes de código y el proyecto. Políticas ejecutables y contratos de validación controlan acciones como instalar dependencias, leer credenciales o crear commits.',
          'Durante Platanus Hack 26 trabajé en la arquitectura de producto y en cómo explicar sus límites de seguridad. La propuesta reúne eventos auditables y evidencia de corrección para entender por qué una acción está bloqueada.',
        ],
        focus: 'Seguridad de agentes · Políticas ejecutables · Auditoría',
        caption: 'YieldOS, construido durante Platanus Hack 26.',
        action: 'Ver el repositorio',
      },
      en: {
        role: 'Platanus Hack 26 · Agent tooling',
        summary: 'A contract before a risky action.',
        paragraphs: [
          'YieldOS explores a security layer between coding agents and project work. Executable policies and validation contracts gate actions such as installing dependencies, reading credentials or creating commits.',
          'During Platanus Hack 26, I worked on product architecture and how to explain its safety boundaries. The proposal brings together auditable events and proof-of-fix evidence to explain why an action is blocked.',
        ],
        focus: 'Agent safety · Executable policies · Auditing',
        caption: 'YieldOS, built during Platanus Hack 26.',
        action: 'View the repository',
      },
    },
  };
  const links = [...document.querySelectorAll('.project-link[data-project]')].filter(
    link => projects[link.dataset.project]
  );
  if (!links.length) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const panel = document.createElement('section');
  panel.id = 'project-details';
  panel.className = 'project-detail';
  panel.setAttribute('aria-labelledby', 'project-detail-title');
  panel.hidden = true;
  links[0].closest('.project-grid').after(panel);
  let activeId = null;
  let sourceLink = null;
  let revision = 0;
  let animations = [];
  let focusAfterHistory = false;

  const language = () => (document.documentElement.lang === 'en' ? 'en' : 'es');
  const makeElement = (tag, className, text) => {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  };
  const stopAnimations = () => {
    animations.forEach(animation => animation.cancel());
    animations = [];
  };
  function animate(element, frames, duration) {
    if (reducedMotion.matches || typeof element.animate !== 'function') {
      return Promise.resolve();
    }
    const animation = element.animate(frames, {
      duration,
      easing: 'cubic-bezier(.22, 1, .36, 1)',
    });
    animations.push(animation);
    return animation.finished.catch(() => {});
  }
  function renderContent(id) {
    const project = projects[id];
    const copy = project[language()];
    const content = makeElement('div', 'project-detail-content');
    const header = makeElement('div', 'project-detail-header');
    const heading = makeElement('h3', null, project.title);
    heading.id = 'project-detail-title';
    heading.tabIndex = -1;
    const close = makeElement('button', 'project-detail-close');
    close.type = 'button';
    close.setAttribute(
      'aria-label',
      language() === 'en'
        ? `Close ${project.title} details`
        : `Cerrar detalle de ${project.title}`
    );
    const closeMark = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    closeMark.setAttribute('viewBox', '0 0 24 24');
    closeMark.setAttribute('aria-hidden', 'true');
    closeMark.setAttribute('focusable', 'false');
    const closeLines = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    closeLines.setAttribute('d', 'M6 6L18 18M18 6L6 18');
    closeMark.append(closeLines);
    close.append(closeMark);
    close.addEventListener('click', requestClose);
    header.append(heading, close);

    const body = makeElement('div', 'project-detail-body');
    body.append(makeElement('p', 'project-detail-summary', copy.summary));
    copy.paragraphs.forEach(paragraph => body.append(makeElement('p', null, paragraph)));
    const external = makeElement('a', 'project-detail-external', copy.action);
    external.href = project.url;
    const actions = makeElement('div', 'project-detail-actions');
    actions.append(external);
    if (copy.status)
      actions.append(makeElement('span', 'project-detail-status', copy.status));
    content.append(
      header,
      makeElement('p', 'project-detail-role', copy.role),
      body,
      makeElement('p', 'project-detail-focus', copy.focus),
      actions
    );
    panel.replaceChildren(content);
    return { content, heading };
  }

  let layoutTransition;
  async function morph(change, image) {
    stopAnimations();
    if (layoutTransition) {
      const previous = layoutTransition;
      previous.skipTransition();
      await previous.finished.catch(() => {});
    }
    const before = image?.getBoundingClientRect();
    if (
      document.startViewTransition &&
      !reducedMotion.matches &&
      !document.documentElement.hasAttribute('data-theme-reveal')
    ) {
      document.documentElement.dataset.projectMorph = '';
      const siblings = [
        ...document.querySelectorAll('.page > .section, .page > .footer'),
      ].filter(section => !section.contains(image));
      siblings.forEach(
        (section, index) => (section.style.viewTransitionName = `project-flow-${index}`)
      );
      image.style.viewTransitionName = 'selected-project';
      const transition = document.startViewTransition(change);
      layoutTransition = transition;
      try {
        await transition.finished;
      } catch {
      } finally {
        image.style.viewTransitionName = '';
        siblings.forEach(section => (section.style.viewTransitionName = ''));
        delete document.documentElement.dataset.projectMorph;
        if (layoutTransition === transition) layoutTransition = null;
      }
    } else {
      change();
      const after = image?.getBoundingClientRect();
      if (before && after?.width)
        await animate(
          image,
          [
            {
              transformOrigin: 'top left',
              transform: `translate(${before.x - after.x}px, ${
                before.y - after.y
              }px) scale(${before.width / after.width}, ${before.height / after.height})`,
            },
            { transformOrigin: 'top left', transform: 'none' },
          ],
          450
        );
    }
  }
  function resetCard() {
    sourceLink?.closest('.project')?.classList.remove('project--open');
    sourceLink?.closest('.project-grid')?.classList.remove('project-grid--reading');
  }
  async function showProject(id, { focus = false, scroll = false } = {}) {
    if (id === activeId) return;
    const nextLink = links.find(link => link.dataset.project === id);
    if (!nextLink) return;
    const currentRevision = ++revision;
    document.dispatchEvent(new Event('cv:interaction'));
    const image = nextLink.querySelector('.project-image');
    panel.setAttribute('aria-busy', 'true');
    await morph(() => {
      resetCard();
      activeId = id;
      sourceLink = nextLink;
      links.forEach(link =>
        link.setAttribute('aria-expanded', String(link === sourceLink))
      );
      const card = sourceLink.closest('.project');
      card.classList.add('project--open');
      card.closest('.project-grid').classList.add('project-grid--reading');
      card.append(panel);
      panel.hidden = false;
      renderContent(id);
      if (scroll) {
        // Include the final scroll position in the new View Transition snapshot.
        // The browser interpolates position and size together in one animation.
        window.scrollTo({
          top: Math.max(0, window.scrollY + image.getBoundingClientRect().top - 24),
          behavior: 'instant',
        });
      }
    }, image);
    if (currentRevision !== revision) return;
    panel.removeAttribute('aria-busy');
    const heading = panel.querySelector('h3');
    if (focus) heading.focus({ preventScroll: true });
  }
  let closing = false;
  async function closeProject({ focus = false } = {}) {
    if (!activeId || closing) return;
    closing = true;
    ++revision;
    const link = sourceLink;
    try {
      await morph(() => {
        panel.hidden = true;
        resetCard();
        activeId = null;
        links.forEach(item => item.setAttribute('aria-expanded', 'false'));
      }, link.querySelector('.project-image'));
      if (focus) link.focus({ preventScroll: true });
    } finally {
      closing = false;
    }
  }

  window.cvProjects = {
    close: async () => {
      if (!activeId) return;
      history.replaceState(null, '', `${location.pathname}${location.search}`);
      await closeProject();
    },
  };
  function requestClose() {
    // Close in this frame: history.back can restore scroll and dispatch both
    // popstate and hashchange, cancelling the shared-image transition twice.
    const state = { ...history.state };
    delete state.cvProject;
    history.replaceState(state, '', `${location.pathname}${location.search}`);
    closeProject({ focus: true });
  }
  function syncFromHash() {
    const id = location.hash.replace(/^#project-/, '');
    if (projects[id]) showProject(id, { scroll: true, focus: focusAfterHistory });
    else
      closeProject({
        focus: focusAfterHistory || panel.contains(document.activeElement),
      });
    focusAfterHistory = false;
  }
  links.forEach(link => {
    link.setAttribute('href', `#project-${link.dataset.project}`);
    link.setAttribute('aria-controls', panel.id);
    link.setAttribute('aria-expanded', 'false');
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      const id = link.dataset.project;
      if (activeId === id) return requestClose();
      // Only one history entry per open reader. Back closes it to the previous section.
      const method = activeId && history.state?.cvProject ? 'replaceState' : 'pushState';
      history[method]({ ...history.state, cvProject: true }, '', `#project-${id}`);
      showProject(id, { focus: true, scroll: true });
    });
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || !activeId || document.querySelector('dialog[open]'))
      return;
    event.preventDefault();
    requestClose();
  });
  document.addEventListener('cv:languagechange', () => {
    if (!activeId) return;
    const focusedClass = panel.contains(document.activeElement)
      ? document.activeElement.className
      : null;
    renderContent(activeId);
    if (focusedClass === 'project-detail-close')
      panel.querySelector('.project-detail-close').focus({ preventScroll: true });
  });
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) stopAnimations();
  });
  window.addEventListener('hashchange', syncFromHash);
  window.addEventListener('popstate', syncFromHash);
  syncFromHash();
})();
