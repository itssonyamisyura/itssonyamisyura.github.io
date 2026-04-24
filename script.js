'use strict';

/* ─── NAVBAR: scroll shadow + active link ─── */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('[data-nav]');
  const sections = Array.from(document.querySelectorAll('section[id]'));

  // Scrolled shadow
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    highlightActiveLink();
  };

  // Highlight nav link matching visible section
  function highlightActiveLink() {
    const mid = window.innerHeight / 2;
    let current = sections[0].id;

    sections.forEach((sec) => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= mid) current = sec.id;
    });

    navLinks.forEach((a) => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ─── MOBILE BURGER MENU ─── */
(function initBurger() {
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('navLinks');

  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach((a) => {
    a.addEventListener('click', () => {
      burger.classList.remove('open');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ─── SCROLL REVEAL ─── */
(function initReveal() {
  const items = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    // Fallback: show everything immediately
    items.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Stagger siblings inside same parent
          const siblings = Array.from(
            entry.target.parentElement.querySelectorAll(
              '.reveal:not(.visible)',
            ),
          );
          const idx = siblings.indexOf(entry.target);
          const delay = Math.min(idx * 80, 320); // max 320ms stagger

          setTimeout(() => {
            entry.target.classList.add('visible');
          }, delay);

          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
  );

  items.forEach((el) => observer.observe(el));
})();

/* ─── SMOOTH SCROLL (older browser fallback) ─── */
(function initSmoothScroll() {
  if (CSS.supports('scroll-behavior', 'smooth')) return;

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
})();

/* ─── CURSOR TRAIL (desktop only) ─── */
(function initCursorTrail() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip touch

  const dot = document.createElement('div');
  dot.style.cssText = `
    position: fixed;
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #C0572A;
    pointer-events: none;
    z-index: 9999;
    transform: translate(-50%, -50%);
    transition: opacity 0.3s;
    mix-blend-mode: multiply;
  `;
  document.body.appendChild(dot);

  let mx = -100,
    my = -100;
  let cx = -100,
    cy = -100;
  let raf;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
  });

  function animate() {
    // Lerp for smooth lag
    cx += (mx - cx) * 0.18;
    cy += (my - cy) * 0.18;
    dot.style.left = `${cx}px`;
    dot.style.top = `${cy}px`;
    raf = requestAnimationFrame(animate);
  }
  animate();
})();

/* ─── TYPED HERO SUBTITLE (optional subtle effect) ─── */
(function initHeroTyping() {
  const tag = document.querySelector('.hero-tag');
  if (!tag) return;

  const text = tag.textContent.trim();
  tag.textContent = '';

  // Reveal hero-tag text char by char after a short delay
  let i = 0;
  const prefix = document.createElement('span');
  prefix.style.cssText = `
    display: inline-block;
    width: 28px; height: 1px;
    background: #C0572A;
    vertical-align: middle;
    margin-right: 0.6rem;
  `;
  tag.appendChild(prefix);

  const textNode = document.createTextNode('');
  tag.appendChild(textNode);

  setTimeout(() => {
    const interval = setInterval(() => {
      textNode.nodeValue += text[i++];
      if (i >= text.length) clearInterval(interval);
    }, 55);
  }, 800);
})();
