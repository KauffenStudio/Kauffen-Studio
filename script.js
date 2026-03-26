/* ============================================================
   KAUFFEN STUDIO — script.js
   Lenis · GSAP + ScrollTrigger · Carousel · i18n
   Creative cursor · Scramble · Magnetic · Parallax · Counter
   ============================================================ */

/* ── Language state (needs to be early for initIntro) ───── */
let currentLang = localStorage.getItem('ks-lang') || 'en';

/* ── Intro sequence ──────────────────────────────────────── */
function initIntro(onComplete) {
  const intro   = document.getElementById('intro');
  const msgEl   = document.getElementById('introMsg');
  const barFill = document.getElementById('introBarFill');
  const counter = document.getElementById('introCounter');

  // Bail out if elements missing or GSAP not loaded
  if (!intro || !msgEl || typeof gsap === 'undefined') {
    intro?.remove();
    document.body.classList.remove('intro-active');
    onComplete?.();
    return;
  }

  const msgs = currentLang === 'pt'
    ? ['Olá.', 'Criamos a web.', 'Estratégia. Design. Código.', 'Kauffen Studio.']
    : ['Hello.', 'We design the web.', 'Strategy. Design. Code.', 'Kauffen Studio.'];

  document.body.classList.add('intro-active');

  let finished = false;
  let timers   = [];

  const finish = (instant) => {
    if (finished) return;
    finished = true;
    timers.forEach(t => clearTimeout(t));
    gsap.killTweensOf(msgEl);
    if (barFill) gsap.killTweensOf(barFill);
    document.removeEventListener('keydown', onSkip);

    const done = () => {
      if (intro.parentNode) intro.remove();
      document.body.classList.remove('intro-active');
      onComplete?.();
    };

    if (instant) {
      done();
    } else {
      gsap.to(intro, { yPercent: -100, duration: .9, ease: 'power4.inOut', onComplete: done });
    }
  };

  const onSkip = () => finish(true);
  intro.addEventListener('click',    () => finish(true), { once: true });
  document.addEventListener('keydown', onSkip,           { once: true });
  timers.push(setTimeout(() => finish(true), 10000)); // hard safety cap

  // Step-by-step: set text → slide in → hold → slide out → next
  let step = 0;

  const HOLD = [600, 750, 750, 1200]; // ms hold per message
  const IN   = [620, 620, 620, 780];  // ms slide-in per message
  const OUT  = 300;                   // ms slide-out

  const showStep = () => {
    if (finished || step >= msgs.length) { finish(false); return; }

    const i      = step;
    const text   = msgs[i];
    const isLast = i === msgs.length - 1;

    if (counter) counter.textContent = `0${i + 1} — 0${msgs.length}`;
    msgEl.classList.toggle('intro-msg--final', isLast);
    msgEl.textContent = text;

    // Position below clip area, then animate up
    gsap.set(msgEl,  { y: 120 });
    gsap.to(msgEl, {
      y: 0, duration: IN[i] / 1000, ease: 'power4.out',
      onComplete: () => {
        const t = setTimeout(() => {
          if (finished) return;
          if (isLast) {
            finish(false);
          } else {
            gsap.to(msgEl, {
              y: -120, duration: OUT / 1000, ease: 'power4.in',
              onComplete: () => { step++; showStep(); },
            });
          }
        }, HOLD[i]);
        timers.push(t);
      },
    });
  };

  // Progress bar fill over approximate total duration
  const totalMs = HOLD.reduce((a, b) => a + b, 0) + IN.reduce((a, b) => a + b, 0) + OUT * 3;
  if (barFill) gsap.to(barFill, { width: '100%', duration: totalMs / 1000, ease: 'none' });

  showStep();
}

/* ── i18n ─────────────────────────────────────────────────── */
const STRINGS = {
  en: {
    'nav.work':     'Work',
    'nav.services': 'Services',
    'nav.about':    'About',
    'nav.contact':  'Contact',
    'hero.tag':     'Web Design & Development Studio',
    'hero.l1':      'We design &',
    'hero.l2':      'build digital',
    'hero.l3':      'experiences.',
    'hero.sub':     'Custom websites, hosting & privacy<br>for every kind of brand.',
    'hero.scroll':  'Scroll',
    'work.label':   'Selected Work',
    'work.title':   'Projects',
    'work.visit':   'Visit Site ↗',
    'work.p1.desc': 'Brand & Portfolio Website',
    'work.p2.desc': 'Car Wash Service Platform',
    'work.p3.desc': 'Technical Contractor Website',
    'svc.label':    'What We Do',
    'svc.title':    'Services',
    'svc.s1.name':  'Web Design',
    'svc.s1.desc':  'Custom UI/UX design crafted around your brand identity — unique, intentional and built to engage.',
    'svc.s2.name':  'Web Development',
    'svc.s2.desc':  'Full-stack development — clean code, fast performance, and pixel-perfect across every device.',
    'svc.s3.name':  'Hosting & Deployment',
    'svc.s3.desc':  'Managed hosting with fast CDN delivery, zero-downtime deployments and ongoing maintenance.',
    'svc.s4.name':  'Privacy & Security',
    'svc.s4.desc':  'SSL, GDPR compliance, data protection and security monitoring to keep your users safe.',
    'about.label':  'The Studio',
    'about.l1':     'A boutique studio',
    'about.l2':     'crafting high-performance',
    'about.l3':     'websites for every brand.',
    'about.body':   'Every project is built from scratch — no templates, no shortcuts. We combine strategy, design and engineering into digital experiences that look great and convert.',
    'about.stat1':  'Live Projects',
    'about.stat2':  'Custom Builds',
    'about.stat3':  'Core Services',
    'contact.label':'Get in Touch',
    'contact.l1':   "Let's work",
    'contact.l2':   'together.',
    'footer.tag':   'Crafted with precision.',
  },
  pt: {
    'nav.work':     'Trabalhos',
    'nav.services': 'Serviços',
    'nav.about':    'Sobre',
    'nav.contact':  'Contacto',
    'hero.tag':     'Estúdio de Design & Desenvolvimento Web',
    'hero.l1':      'Criamos &',
    'hero.l2':      'construímos',
    'hero.l3':      'experiências digitais.',
    'hero.sub':     'Websites, alojamento & privacidade<br>para todo o tipo de marca.',
    'hero.scroll':  'Rolar',
    'work.label':   'Trabalhos Selecionados',
    'work.title':   'Projetos',
    'work.visit':   'Ver Site ↗',
    'work.p1.desc': 'Website de Marca & Portfólio',
    'work.p2.desc': 'Plataforma de Serviço de Lavagem',
    'work.p3.desc': 'Website de Empreiteiro Técnico',
    'svc.label':    'O Que Fazemos',
    'svc.title':    'Serviços',
    'svc.s1.name':  'Web Design',
    'svc.s1.desc':  'Design UI/UX personalizado em torno da identidade da sua marca — único, intencional e feito para envolver.',
    'svc.s2.name':  'Desenvolvimento Web',
    'svc.s2.desc':  'Desenvolvimento full-stack — código limpo, alta performance, e perfeito em todos os dispositivos.',
    'svc.s3.name':  'Alojamento & Publicação',
    'svc.s3.desc':  'Alojamento gerido com entrega CDN rápida, publicações sem interrupção e manutenção contínua.',
    'svc.s4.name':  'Privacidade & Segurança',
    'svc.s4.desc':  'SSL, conformidade RGPD, proteção de dados e monitorização de segurança.',
    'about.label':  'O Estúdio',
    'about.l1':     'Um estúdio boutique',
    'about.l2':     'a criar websites de alta performance',
    'about.l3':     'para todo o tipo de marca.',
    'about.body':   'Cada projeto é construído de raiz — sem templates, sem atalhos. Combinamos estratégia, design e engenharia em experiências digitais que convertem.',
    'about.stat1':  'Projetos Ativos',
    'about.stat2':  'Builds Personalizados',
    'about.stat3':  'Serviços Principais',
    'contact.label':'Fale Connosco',
    'contact.l1':   'Vamos trabalhar',
    'contact.l2':   'juntos.',
    'footer.tag':   'Feito com precisão.',
  }
};

const SLIDE_DATA = [
  { num: '01 —', name: 'Anna Capocchi', cat_en: 'Brand & Portfolio Website',    cat_pt: 'Website de Marca & Portfólio',    url: 'https://annacapocchi.com' },
  { num: '02 —', name: 'JetWash 24',    cat_en: 'Car Wash Service Platform',    cat_pt: 'Plataforma de Serviço de Lavagem', url: 'https://jetwash24.com'    },
  { num: '03 —', name: 'iStarTec',      cat_en: 'Technical Contractor Website', cat_pt: 'Website de Empreiteiro Técnico',   url: 'https://istartec.co'     },
];

function applyLang(lang) {
  currentLang = lang;
  localStorage.setItem('ks-lang', lang);

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const val = STRINGS[lang]?.[el.dataset.i18n];
    if (val !== undefined) el.innerHTML = val;
  });

  const catEl = document.getElementById('scCat');
  if (catEl) {
    const d = SLIDE_DATA[carousel ? carousel.current : 0];
    catEl.textContent = lang === 'pt' ? d.cat_pt : d.cat_en;
  }

  ['langPill', 'langPillFt'].forEach(id => {
    document.getElementById(id)?.classList.toggle('pt', lang === 'pt');
  });

  document.querySelectorAll('.lang-opt').forEach(opt => {
    opt.classList.toggle('active', opt.dataset.lang === lang);
  });
}

function initLang() {
  // onclick="applyLang(...)" in HTML handles the actual toggling.
  // This just applies the saved language on page load.
  applyLang(currentLang);
}

/* ── Lenis ────────────────────────────────────────────────── */
let lenis;

function initLenis() {
  lenis = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  gsap.registerPlugin(ScrollTrigger);
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(time => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ── Scroll progress ─────────────────────────────────────── */
function initScrollBar() {
  const bar = document.getElementById('scrollBar');
  if (!bar) return;
  lenis.on('scroll', ({ progress }) => { bar.style.width = `${progress * 100}%`; });
}

/* ── Nav ─────────────────────────────────────────────────── */
function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  ScrollTrigger.create({
    start: 'top -60',
    onUpdate: self => nav.classList.toggle('solid', self.progress > 0),
  });
}

/* ── Mobile menu ─────────────────────────────────────────── */
function initMobileMenu() {
  const burger = document.getElementById('burger');
  const menu   = document.getElementById('mobileMenu');
  if (!burger || !menu) return;
  let open = false;

  const openMenu = () => {
    open = true;
    menu.classList.add('open');
    burger.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    menu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lenis.stop();
  };
  const closeMenu = () => {
    open = false;
    menu.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lenis.start();
  };

  burger.addEventListener('click', () => (open ? closeMenu() : openMenu()));
  menu.querySelectorAll('.mob-link').forEach(l => l.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) closeMenu(); });
}

/* ── Smooth anchors ──────────────────────────────────────── */
function initAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -80, duration: 1.4 });
    });
  });
}

/* ── Hero reveal ─────────────────────────────────────────── */
function initHeroReveal() {
  gsap.set('.hero-title .clip-inner', { y: '110%' });
  gsap.set('.hero-tag',       { opacity: 0, y: 12 });
  gsap.set('.hero-sub',       { opacity: 0, y: 14 });
  gsap.set('.hero-scroll-cue',{ opacity: 0 });
  gsap.set('.hero-bg-mark',   { scale: .82, opacity: 0 });

  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
  tl.to('.hero-tag',              { opacity: 1, y: 0, duration: .7 }, .05);
  tl.to('.hero-title .clip-inner',{ y: 0, duration: 1.1, stagger: .13 }, .18);
  tl.to('.hero-sub',              { opacity: 1, y: 0, duration: .8 }, .88);
  tl.to('.hero-scroll-cue',       { opacity: 1, duration: .6 }, 1.05);
  tl.to('.hero-bg-mark',          { scale: 1, opacity: .04, duration: 1.6, ease: 'power2.out' }, .1);
}

/* ── ScrollTrigger reveals ───────────────────────────────── */
function initReveal() {
  // Showcase
  gsap.set('.showcase-title .clip-inner', { y: '110%' });
  gsap.to('.showcase-title .clip-inner', {
    y: 0, duration: 1, ease: 'power4.out',
    scrollTrigger: { trigger: '.showcase-top', start: 'top 82%' }
  });
  gsap.fromTo('.showcase-label .eyebrow', { opacity: 0, y: 10 }, {
    opacity: 1, y: 0, duration: .7,
    scrollTrigger: { trigger: '.showcase-top', start: 'top 85%' }
  });

  // Services
  gsap.set('.services-title .clip-inner', { y: '110%' });
  gsap.to('.services-title .clip-inner', {
    y: 0, duration: 1, ease: 'power4.out',
    scrollTrigger: { trigger: '.services-head', start: 'top 82%' }
  });
  gsap.fromTo('.svc', { y: 28, opacity: 0 }, {
    y: 0, opacity: 1, duration: .7, stagger: .1, ease: 'power3.out',
    scrollTrigger: { trigger: '.svc-list', start: 'top 80%' }
  });

  // About
  gsap.set('.about-statement .clip-inner', { y: '110%' });
  gsap.fromTo('.about-left .eyebrow', { opacity: 0, y: 10 }, {
    opacity: 1, y: 0, duration: .7,
    scrollTrigger: { trigger: '.about', start: 'top 80%' }
  });
  gsap.to('.about-statement .clip-inner', {
    y: 0, duration: 1, ease: 'power4.out', stagger: .12,
    scrollTrigger: { trigger: '.about-statement', start: 'top 82%' }
  });
  gsap.fromTo('.about-body', { opacity: 0, y: 14 }, {
    opacity: 1, y: 0, duration: .8,
    scrollTrigger: { trigger: '.about-body', start: 'top 85%' }
  });
  gsap.fromTo('.stat', { opacity: 0, y: 22 }, {
    opacity: 1, y: 0, duration: .8, stagger: .14, ease: 'power3.out',
    scrollTrigger: { trigger: '.about-right', start: 'top 82%' }
  });

  // Contact
  gsap.set('.contact-title .clip-inner', { y: '110%' });
  gsap.fromTo('.contact-inner .eyebrow', { opacity: 0, y: 10 }, {
    opacity: 1, y: 0, duration: .7,
    scrollTrigger: { trigger: '.contact', start: 'top 80%' }
  });
  gsap.to('.contact-title .clip-inner', {
    y: 0, duration: 1.1, ease: 'power4.out', stagger: .14,
    scrollTrigger: { trigger: '.contact-title', start: 'top 82%' }
  });
  gsap.fromTo('.channel', { opacity: 0, y: 24 }, {
    opacity: 1, y: 0, duration: .7, stagger: .1,
    scrollTrigger: { trigger: '.channels', start: 'top 85%' }
  });
}

/* ── Creative cursor: dot + lagging ring ─────────────────── */
function initCursor() {
  const dot   = document.getElementById('cursorDot');
  const ring  = document.getElementById('cursorRing');
  const label = document.getElementById('cursorLabel');
  if (!dot || !ring) return;

  if (window.matchMedia('(pointer: coarse)').matches) {
    dot.style.display = ring.style.display = 'none';
    return;
  }

  // GSAP owns centering — xPercent/yPercent shift origin to element center
  // so that setting x/y to mouse coords places the center at the cursor
  gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -200, y: -200 });

  let mx = -200, my = -200;
  let rx = -200, ry = -200;
  let pmx = -200, pmy = -200;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  document.addEventListener('mousedown', () => ring.classList.add('pressing'));
  document.addEventListener('mouseup',   () => ring.classList.remove('pressing'));

  document.querySelectorAll('a, button, [data-cursor], .svc, .lang-toggle, .sc-dot').forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (label) label.textContent = el.dataset.cursor || '';
      ring.classList.add('expanded');
      dot.classList.add('hidden');
    });
    el.addEventListener('mouseleave', () => {
      if (label) label.textContent = '';
      ring.classList.remove('expanded');
      dot.classList.remove('hidden');
    });
  });

  gsap.ticker.add(() => {
    // Dot follows exactly
    gsap.set(dot, { x: mx, y: my });

    // Ring lerps
    rx += (mx - rx) * 0.11;
    ry += (my - ry) * 0.11;

    // Velocity-based squash/stretch
    const vx      = mx - pmx;
    const vy      = my - pmy;
    pmx = mx; pmy = my;

    const speed   = Math.sqrt(vx * vx + vy * vy);
    const angle   = Math.atan2(vy, vx) * (180 / Math.PI);
    const stretch = Math.min(speed * 0.045, 0.55);

    if (!ring.classList.contains('expanded') && !ring.classList.contains('pressing')) {
      gsap.set(ring, { x: rx, y: ry, rotation: angle, scaleX: 1 + stretch, scaleY: 1 - stretch * 0.5 });
    } else {
      gsap.set(ring, { x: rx, y: ry, rotation: 0, scaleX: 1, scaleY: 1 });
    }
  });
}

/* ── Stats counter ───────────────────────────────────────── */
function initStatsCounter() {
  document.querySelectorAll('.stat-val').forEach(el => {
    const raw    = el.textContent.trim();
    const hasPlus = raw.startsWith('+');
    const hasPct  = raw.endsWith('%');
    const num     = parseInt(raw.replace(/\D/g, ''), 10);
    if (isNaN(num)) return;

    const counter = { val: 0 };
    el.textContent = (hasPlus ? '+' : '') + '0' + (hasPct ? '%' : '');

    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          val: num,
          duration: 1.6,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = (hasPlus ? '+' : '') + Math.round(counter.val) + (hasPct ? '%' : '');
          },
        });
      },
    });
  });
}

/* ── Parallax: hero bg mark on scroll ───────────────────── */
function initParallax() {
  gsap.to('.hero-bg-mark', {
    y: -140,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    },
  });
}

/* ── Magnetic buttons ────────────────────────────────────── */
function initMagnetic() {
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const dx = (e.clientX - (rect.left + rect.width  / 2)) * 0.38;
      const dy = (e.clientY - (rect.top  + rect.height / 2)) * 0.38;
      gsap.to(el, { x: dx, y: dy, duration: .4, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: .6, ease: 'elastic.out(1, 0.5)' });
    });
  });
}

/* ── Text scramble on service names ─────────────────────── */
function initScramble() {
  const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

  document.querySelectorAll('.svc-name').forEach(el => {
    const original = el.textContent;
    let frame;

    const scramble = () => {
      const start = performance.now();
      const dur   = 480;

      const tick = now => {
        const progress = Math.min((now - start) / dur, 1);
        el.textContent = [...original].map((ch, i) => {
          if (ch === ' ' || ch === '&') return ch;
          if (i < progress * original.length * 1.4) return ch;
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        }).join('');
        if (progress < 1) frame = requestAnimationFrame(tick);
        else el.textContent = original;
      };

      cancelAnimationFrame(frame);
      requestAnimationFrame(tick);
    };

    el.closest('.svc')?.addEventListener('mouseenter', scramble);
  });
}

/* ── Marquee responds to scroll velocity ─────────────────── */
function initMarqueeVelocity() {
  const tracks = document.querySelectorAll('.marquee-track');
  let base = [30, 22]; // default durations

  lenis.on('scroll', ({ velocity }) => {
    const v = Math.abs(velocity || 0);
    tracks.forEach((track, i) => {
      const speed = Math.max(base[i] - v * 1.8, 6);
      track.style.animationDuration = `${speed}s`;
    });
  });
}

/* ── Carousel ────────────────────────────────────────────── */
const IFRAME_W   = 1440;
const IFRAME_H   = 8000;
const SCROLL_DUR = 4;
const PAUSE_BOT  = 900;
const PAUSE_TOP  = 300;

let carousel;

class Carousel {
  constructor() {
    this.track   = document.getElementById('carouselTrack');
    this.slides  = Array.from(document.querySelectorAll('.c-slide'));
    this.dots    = Array.from(document.querySelectorAll('.sc-dot'));
    this.current = 0;
    this.locked  = false;
    this.paused  = false;

    this.states = this.slides.map((slide, idx) => ({
      idx,
      screen:        slide.querySelector('[data-screen]'),
      iframe:        slide.querySelector('[data-iframe]'),
      fallback:      slide.querySelector('[data-fallback]'),
      loaded:        false,
      fallbackShown: false,
      tween:         null,
      fallbackTimer: null,
      progress:      0,
    }));

    this.init();
  }

  init() {
    this.states.forEach(s => this._scaleIframe(s));
    window.addEventListener('resize', () => this.states.forEach(s => this._scaleIframe(s)));
    this.states.forEach(s => this._watchFallback(s));

    document.getElementById('scPrev')?.addEventListener('click', () => this.prev());
    document.getElementById('scNext')?.addEventListener('click', () => this.next());
    this.dots.forEach(dot => {
      dot.addEventListener('click', () => this.goTo(parseInt(dot.dataset.goto)));
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.paused = true;
        this._killTween(this.current);
      } else {
        this.paused = false;
        this._startCycle(this.current);
      }
    });

    this._activate(0, true);
  }

  goTo(idx) {
    if (idx === this.current || this.locked) return;
    this.locked = true;
    this._killTween(this.current);
    this._activate(idx);
    setTimeout(() => { this.locked = false; }, 900);
  }

  next() { this.goTo((this.current + 1) % this.slides.length); }
  prev() { this.goTo((this.current - 1 + this.slides.length) % this.slides.length); }

  _activate(idx, immediate = false) {
    this.current = idx;
    this.track.style.transition = immediate ? 'none' : 'transform .85s cubic-bezier(0.76, 0, 0.24, 1)';
    this.track.style.transform  = `translateX(-${idx * 100}%)`;
    this._resetIframe(this.states[idx]);
    this._updateUI(idx);

    // Start fallback timer only for the now-active slide
    const s = this.states[idx];
    if (!s.fallbackShown && !s.loaded) {
      clearTimeout(s.fallbackTimer);
      s.fallbackTimer = setTimeout(() => {
        if (!s.loaded && idx === this.current) this._showFallback(s);
      }, 5000);
    }

    if (!this.paused) setTimeout(() => this._startCycle(idx), PAUSE_TOP);
  }

  _startCycle(idx) {
    if (idx !== this.current || this.paused) return;
    const s = this.states[idx];

    if (s.fallbackShown) {
      s.tween = setTimeout(() => { if (idx === this.current && !this.paused) this.next(); }, 3500);
      return;
    }

    const { scale, maxTY } = this._getGeometry(s);
    if (maxTY <= 0) {
      s.tween = setTimeout(() => { if (idx === this.current) this.next(); }, 4000);
      return;
    }

    const proxy = { ty: 0 };
    s.tween = gsap.to(proxy, {
      ty: maxTY,
      duration: SCROLL_DUR,
      ease: 'power1.inOut',
      onUpdate: () => {
        s.iframe.style.transform = `scale(${scale}) translateY(${-proxy.ty}px)`;
      },
      onComplete: () => {
        s.tween = setTimeout(() => {
          if (idx === this.current && !this.paused) this.next();
        }, PAUSE_BOT);
      },
    });
  }

  _killTween(idx) {
    const s = this.states[idx];
    if (!s) return;
    clearTimeout(s.fallbackTimer);
    s.fallbackTimer = null;
    if (typeof s.tween === 'number') clearTimeout(s.tween);
    else s.tween?.kill?.();
    s.tween = null;
  }

  _resetIframe(s) {
    const { scale } = this._getGeometry(s);
    s.iframe.style.transform = `scale(${scale}) translateY(0px)`;
    s.progress = 0;
  }

  _scaleIframe(s) {
    if (!s.screen || !s.iframe) return;
    const { scale } = this._getGeometry(s);
    s.iframe.style.width  = `${IFRAME_W}px`;
    s.iframe.style.height = `${IFRAME_H}px`;
    s.iframe.style.transformOrigin = 'top left';
    s.iframe.style.transform = `scale(${scale}) translateY(0px)`;
  }

  _getGeometry(s) {
    const containerW = s.screen?.offsetWidth  || 0;
    const containerH = s.screen?.offsetHeight || 0;
    const scale      = containerW / IFRAME_W;
    const visibleH   = scale > 0 ? containerH / scale : 0;
    const maxTY      = Math.max(0, IFRAME_H - visibleH);
    return { scale, maxTY };
  }

  _showFallback(s) {
    if (s.fallbackShown) return;
    s.fallbackShown = true;
    s.iframe.style.display = 'none';
    s.fallback?.classList.add('show');
  }

  _watchFallback(s) {
    if (!s.iframe) return;
    s.iframe.addEventListener('load', () => {
      try {
        const doc  = s.iframe.contentDocument;
        const text = (doc?.body?.innerText || '').toLowerCase();
        if (text.length === 0 || /frame|refused|blocked|embedding/i.test(text)) {
          this._showFallback(s);
        } else {
          s.loaded = true;
        }
      } catch (_) {
        // SecurityError = cross-origin content loaded successfully
        s.loaded = true;
      }
    });
    // Fallback timer is started per-activation in _activate(), not globally here
  }

  _updateUI(idx) {
    const d = SLIDE_DATA[idx];
    const cur = document.getElementById('scCur');
    if (cur) cur.textContent = String(idx + 1).padStart(2, '0');

    const infoEl = document.querySelector('.sc-info');
    if (infoEl) {
      gsap.to(infoEl, {
        opacity: 0, y: -8, duration: .2,
        onComplete: () => {
          document.getElementById('scNum').textContent  = d.num;
          document.getElementById('scName').textContent = d.name;
          const catEl = document.getElementById('scCat');
          if (catEl) catEl.textContent = currentLang === 'pt' ? d.cat_pt : d.cat_en;
          const visitEl = document.getElementById('scVisit');
          if (visitEl) { visitEl.href = d.url; visitEl.textContent = STRINGS[currentLang]['work.visit']; }
          gsap.fromTo(infoEl, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: .35 });
        },
      });
    }

    this.dots.forEach((dot, i) => dot.classList.toggle('active', i === idx));
  }
}

/* ── Boot ────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initLang();
  initScrollBar();
  initNav();
  initMobileMenu();
  initAnchors();
  initReveal();
  initCursor();
  initStatsCounter();
  initParallax();
  initMagnetic();
  initScramble();
  initMarqueeVelocity();
  carousel = new Carousel();

  // Intro plays first; hero animates in once the panel slides away
  initIntro(() => initHeroReveal());
});
