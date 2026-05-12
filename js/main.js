// AuraPal main JS — theme, scroll header, reveal, lang toggle, app tabs, form
(function () {
  'use strict';

  // ---- Theme ----
  const root = document.documentElement;
  const themeBtn = document.querySelector('[data-theme-toggle]');
  const sunIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>';
  const moonIcon = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  let theme = matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  root.setAttribute('data-theme', theme);
  if (themeBtn) {
    const render = () => {
      themeBtn.innerHTML = theme === 'dark' ? sunIcon : moonIcon;
      themeBtn.setAttribute('aria-label', '切换到' + (theme === 'dark' ? '浅色' : '深色') + '模式');
    };
    render();
    themeBtn.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', theme);
      render();
    });
  }

  // ---- Scroll header ----
  const header = document.querySelector('.site-header');
  if (header) {
    let lastY = 0;
    const onScroll = () => {
      const y = window.scrollY;
      header.classList.toggle('is-scrolled', y > 8);
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ---- Reveal on scroll ----
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -80px 0px' }
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-visible'));
  }

  // ---- Mobile nav ----
  const mobBtn = document.querySelector('.nav-mobile-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (mobBtn && navLinks) {
    mobBtn.addEventListener('click', () => {
      const open = navLinks.classList.toggle('is-open');
      mobBtn.setAttribute('aria-expanded', open);
    });
  }

  // ---- Language toggle ----
  const langBtn = document.querySelector('[data-lang-toggle]');
  const setLang = (lang) => {
    document.documentElement.setAttribute('lang', lang === 'en' ? 'en' : 'zh-CN');
    document.documentElement.setAttribute('data-lang', lang);
    document.querySelectorAll('[data-zh], [data-en]').forEach((el) => {
      const txt = el.getAttribute('data-' + lang);
      if (txt !== null) el.textContent = txt;
    });
    document.querySelectorAll('[data-zh-html], [data-en-html]').forEach((el) => {
      const html = el.getAttribute('data-' + lang + '-html');
      if (html !== null) el.innerHTML = html;
    });
    document.querySelectorAll('input[data-zh-ph], input[data-en-ph], textarea[data-zh-ph], textarea[data-en-ph]').forEach((el) => {
      const ph = el.getAttribute('data-' + lang + '-ph');
      if (ph !== null) el.setAttribute('placeholder', ph);
    });
    if (langBtn) {
      langBtn.querySelector('.lang-label').textContent = lang === 'en' ? '中' : 'EN';
    }
  };
  let currentLang = 'zh';
  setLang(currentLang);
  if (langBtn) {
    langBtn.addEventListener('click', () => {
      currentLang = currentLang === 'zh' ? 'en' : 'zh';
      setLang(currentLang);
    });
  }

  // ---- App tabs ----
  const tabs = document.querySelectorAll('.app-tab');
  if (tabs.length) {
    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        tabs.forEach((t) => t.setAttribute('aria-selected', t === tab));
        document.querySelectorAll('.app-panel').forEach((p) => {
          p.classList.toggle('is-active', p.dataset.panel === target);
        });
      });
    });
  }

  // ---- Hero carousel ----
  const carousel = document.querySelector('[data-carousel]');
  if (carousel) {
    const slides = carousel.querySelectorAll('.hero-slide');
    const dots = carousel.querySelectorAll('.hero-dot');
    const prevBtn = carousel.querySelector('.hero-arrow--prev');
    const nextBtn = carousel.querySelector('.hero-arrow--next');
    let idx = 0;
    let timer;

    const show = (i) => {
      idx = (i + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle('is-active', k === idx));
      dots.forEach((d, k) => d.classList.toggle('is-active', k === idx));
    };
    const next = () => show(idx + 1);
    const prev = () => show(idx - 1);
    const restart = () => {
      clearInterval(timer);
      timer = setInterval(next, 4500);
    };

    nextBtn && nextBtn.addEventListener('click', () => { next(); restart(); });
    prevBtn && prevBtn.addEventListener('click', () => { prev(); restart(); });
    dots.forEach((d, k) => d.addEventListener('click', () => { show(k); restart(); }));

    // pause on hover
    carousel.addEventListener('mouseenter', () => clearInterval(timer));
    carousel.addEventListener('mouseleave', restart);

    restart();
  }

  // ---- Contact form ----
  const form = document.querySelector('.form-card form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.closest('.form-card').classList.add('is-submitted');
    });
  }
})();
