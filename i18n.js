// Two languages, one document. Brand names, URLs, and data stay shared.
const pageCopy = {
  es: {
    skip: 'Ir al contenido',
    work: 'Lo que estoy construyendo',
    allProjects: 'Todos los proyectos',
    voceroDescription: 'Flujos de voz para operaciones reales.',
    hackathons: 'Hecho en hackathons',
    githubCode: 'Código en GitHub',
    activity: 'Detrás de los proyectos',
    activityAside: 'Actividad pública',
    now: 'Actualmente',
    education: 'En el camino',
    photos: 'Fuera de la pantalla',
    allPhotos: 'Más fotografías',
    photosIntro: 'Lugares, luces y detalles que me hacen frenar un momento.',
    contactPrompt: '¿Tenés algo en mente?',
    letsTalk: 'Hablemos.',
    saveCV: 'Guardar CV',
    tools: 'Herramientas con las que trabajo',
    photoAmeyoko: 'Luces de Ameyoko',
    photoBlossoms: 'Osaka, Japón',
    photoBellagio: 'Bellagio, Italia',
    aceleraDates: '2025 — hoy',
    relyDates: '2023 — hoy',
    aceleraRole: 'Cofundador · AI Product Engineer',
    relyRole: 'Cofundador · Lead Engineer',
    aceleraDescription:
      'De la primera conversación a un producto en uso. Software a medida, herramientas con IA y Atrae.',
    relyDescription: 'Crear y gestionar una empresa en EE. UU.',
    graduated: 'Graduado en 2026',
    degree: 'Ingeniería Informática.',
    languages: 'Español nativo · Inglés C1 Advanced',
    toolSystems: 'Sistemas',
    toolIntegrations: 'Integraciones',
    toolDelivery: 'Entrega',
    toolInterfaces: 'TypeScript, React, Next.js, HTML y CSS',
    relyNote: 'CoFounder',
    atraeDescription: 'De una idea de cliente a una lista de prospectos.',
    atraeNote: 'Acelera · En desarrollo',
    kyotoDescription: 'Un paseo entre torii. Una exploración en 3D.',
    kyotoNote: 'Experimento · Próximamente',
    faroDescription: 'Datos públicos que se pueden investigar.',
    faroNote: 'Primer puesto · Hack@Latam',
    vueltitoDescription: 'Pequeñas donaciones, desde cada compra.',
    vueltitoNote: 'Primer puesto · Hackathon',
    yieldosDescription: 'Controles de seguridad para agentes de código.',
    yieldosNote: 'Platanus Hack 26',
    contactNav: 'Contacto y perfiles',
    footerNav: 'Más de Nacho',
    activityLink: 'Actividad de GitHub y Tokscale',
    activityTitle: 'Actividad',
    pexelsProfile: 'Pexels — mis fotografías',
    closePhoto: 'Cerrar foto',
    emailCopy: 'Copiar dirección de email',
    portraitAlt: 'Nacho entre luces rojas',
    photoAmeyokoAlt:
      'Carteles luminosos del mercado Ameyoko, fotografiados por Nacho Estevo',
    photoBlossomsAlt:
      'Flores rosadas contra el cielo azul, fotografiadas por Nacho Estevo',
    photoBellagioAlt:
      'Torre de ladrillo rojo entre árboles en Bellagio, fotografiada por Nacho Estevo',
    relyAlt: 'Landing de Rely y vista de su panel para empresas',
    atraeAlt: 'Interfaz de Atrae para buscar empresas y contactos',
    kyotoAlt: 'Escena 3D de Fushimi Inari, entre árboles y puertas torii',
    faroAlt: 'Faro: mapa e investigación de obras públicas',
    vueltitoAlt: 'Vueltito: microdonaciones desde el checkout',
    yieldosAlt: 'YieldOS: controles de seguridad para agentes de código',
    bio0: '\n            Soy ingeniero de software. Construyo productos web y herramientas con IA, con\n            la misma atención a cómo funcionan y a cómo se sienten.\n          ',
    bio1: '\n            Cofundé <a href="https://acelera.agency">Acelera</a> y\n            <a href="https://rely.business">Rely</a>. Entre proyectos, hackathons y\n            experimentos, también encuentro tiempo para la fotografía. Acá hay un poco de\n            todo eso.\n          ',
    copied: 'Mail copiado',
    copyFailed: 'Seleccioná el mail para copiarlo manualmente.',
    darkMode: 'Activar modo oscuro',
    lightMode: 'Activar modo claro',
    avatarOther: 'Ver mi avatar de GitHub',
    avatarPhoto: 'Ver mi foto',
    githubAvatarAlt: 'Mi avatar de GitHub: un conejo ilustrado',
    title: 'Ignacio Estevo',
    description:
      'Nacho Estevo. Software, productos e IA desde Buenos Aires. Cofundador de Acelera y Rely. Proyectos, actividad y algunas fotos.',
    musaDescription: 'Otra forma de sentir la música.',
    musaNote: 'Premio especial · Musicathon 2026',
    musaAlt: 'MUSA, accesibilidad musical con letras, visuales y vibraciones',
  },
  en: {
    skip: 'Skip to content',
    work: 'What I’m building',
    allProjects: 'All projects',
    voceroDescription: 'Voice workflows for real operations.',
    hackathons: 'Built at hackathons',
    githubCode: 'Code on GitHub',
    activity: 'Behind the projects',
    activityAside: 'Public activity',
    now: 'Currently',
    education: 'Along the way',
    photos: 'Away from the screen',
    allPhotos: 'More photographs',
    photosIntro: 'Places, light, and details that make me pause.',
    contactPrompt: 'Have something in mind?',
    letsTalk: 'Let’s talk.',
    saveCV: 'Save CV',
    tools: 'Tools I work with',
    photoAmeyoko: 'Lights of Ameyoko',
    photoBlossoms: 'Osaka, Japan',
    photoBellagio: 'Bellagio, Italy',
    aceleraDates: '2025 — present',
    relyDates: '2023 — present',
    aceleraRole: 'Co-Founder · AI Product Engineer',
    relyRole: 'Co-Founder · Lead Engineer',
    aceleraDescription:
      'From the first conversation to a product people use. Custom software, AI tools, and Atrae.',
    relyDescription: 'Form and manage a U.S. company.',
    graduated: 'Graduated in 2026',
    degree: 'Software Engineering.',
    languages: 'Native Spanish · C1 Advanced English',
    toolSystems: 'Systems',
    toolIntegrations: 'Integrations',
    toolDelivery: 'Delivery',
    toolInterfaces: 'TypeScript, React, Next.js, HTML & CSS',
    relyNote: 'CoFounder',
    atraeDescription: 'From an ideal client to a focused prospect list.',
    atraeNote: 'Acelera · In development',
    kyotoDescription: 'A walk among torii gates. An exploration in 3D.',
    kyotoNote: 'Experiment · Coming soon',
    faroDescription: 'Public data you can investigate.',
    faroNote: 'First place · Hack@Latam',
    vueltitoDescription: 'Small donations, with every purchase.',
    vueltitoNote: 'First place · Hackathon',
    yieldosDescription: 'Security controls for coding agents.',
    yieldosNote: 'Platanus Hack 26',
    contactNav: 'Contact and profiles',
    footerNav: 'More from Nacho',
    activityLink: 'GitHub and Tokscale activity',
    activityTitle: 'Activity',
    pexelsProfile: 'Pexels — my photographs',
    closePhoto: 'Close photo',
    emailCopy: 'Copy email address',
    portraitAlt: 'Nacho among red lights',
    photoAmeyokoAlt: 'Neon signs at Ameyoko market, photographed by Nacho Estevo',
    photoBlossomsAlt: 'Pink blossoms against a blue sky, photographed by Nacho Estevo',
    photoBellagioAlt:
      'A red brick tower among trees in Bellagio, photographed by Nacho Estevo',
    relyAlt: 'Rely’s landing page and company dashboard preview',
    atraeAlt: 'Atrae’s interface for finding companies and contacts',
    kyotoAlt: 'A 3D Fushimi Inari scene with trees and torii gates',
    faroAlt: 'Faro: public works map and research',
    vueltitoAlt: 'Vueltito: microdonations at checkout',
    yieldosAlt: 'YieldOS: security controls for coding agents',
    bio0: 'I’m a software engineer. I build web products and AI tools, with the same attention to how they work and how they feel.',
    bio1: 'I co-founded <a href="https://acelera.agency">Acelera</a> and <a href="https://rely.business">Rely</a>. Between projects, hackathons, and experiments, I also make time for photography. Here’s a bit of all of that.',
    copied: 'Email copied',
    copyFailed: 'Select the email to copy it manually.',
    darkMode: 'Switch to dark mode',
    lightMode: 'Switch to light mode',
    avatarOther: 'See my GitHub avatar',
    avatarPhoto: 'See my photo',
    githubAvatarAlt: 'My GitHub avatar: an illustrated rabbit',
    title: 'Ignacio Estevo',
    description:
      'Nacho Estevo. Software, products, and AI from Buenos Aires. Co-founder of Acelera and Rely. Projects, activity, and photographs.',
    musaDescription: 'Another way to feel the music.',
    musaNote: 'Special prize · Musicathon 2026',
    musaAlt: 'MUSA: music accessibility through lyrics, visuals, and haptics',
  },
};
(() => {
  let language = 'es';
  try {
    if (localStorage.getItem('nacho-cv-language') === 'en') language = 'en';
  } catch {}
  const toggle = document.querySelector('[data-language-toggle]');
  function t(key) {
    return pageCopy[language][key] || pageCopy.es[key] || key;
  }
  function setLanguage(next, persist = true) {
    language = next === 'en' ? 'en' : 'es';
    document.documentElement.lang = language;
    document.querySelectorAll('[data-i18n]').forEach(element => {
      element.textContent = t(element.dataset.i18n);
    });
    // Only this file's fixed, authored copy contains markup. Never insert fetched data here.
    document.querySelectorAll('[data-i18n-html]').forEach(element => {
      element.innerHTML = t(element.dataset.i18nHtml);
    });
    for (const attribute of ['aria-label', 'alt', 'title']) {
      document.querySelectorAll(`[data-i18n-${attribute}]`).forEach(element => {
        element.setAttribute(
          attribute,
          t(element.getAttribute(`data-i18n-${attribute}`))
        );
      });
    }
    toggle.textContent = language === 'es' ? 'EN' : 'ES';
    toggle.lang = language === 'es' ? 'en' : 'es';
    toggle.setAttribute(
      'aria-label',
      language === 'es' ? 'Read in English' : 'Leer en español'
    );
    toggle.title = toggle.getAttribute('aria-label');
    document.title = t('title');
    document.querySelector('meta[name="description"]').content = t('description');
    document.querySelector('meta[property="og:title"]').content = t('title');
    document.querySelector('meta[property="og:description"]').content = t('description');
    if (persist) {
      try {
        localStorage.setItem('nacho-cv-language', language);
      } catch {}
    }
    document.dispatchEvent(
      new CustomEvent('cv:languagechange', { detail: { language } })
    );
  }
  window.cvI18n = {
    t,
    setLanguage,
    get language() {
      return language;
    },
  };
  toggle.hidden = false;
  toggle.addEventListener('click', () => setLanguage(language === 'es' ? 'en' : 'es'));
  setLanguage(language, false);
})();
