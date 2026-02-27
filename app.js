/* ============================================================
   PORTFOLIO — app.js
   GSAP + ScrollSmoother + ScrollTrigger + Custom Cursor
   ============================================================ */

/* ---------- Register GSAP plugins ---------- */
const _plugins = [ScrollTrigger, TextPlugin, Flip];
if (typeof ScrollSmoother !== 'undefined') _plugins.push(ScrollSmoother);
gsap.registerPlugin(..._plugins);



/* ---------- Device detection ---------- */
const IS_TOUCH = window.matchMedia('(pointer: coarse)').matches;


/* ============================================================
   1. LOADING SCREEN
   ============================================================ */
function initLoader() {
  const loader = document.getElementById('loader');
  document.body.style.overflow = 'hidden';

  const tl = gsap.timeline({
    onComplete: () => {
      loader.classList.add('split');
      gsap.delayedCall(1.0, () => {
        loader.style.pointerEvents = 'none';
        document.body.style.overflow = '';
        loader.style.display = 'none';
        initSite();
      });
    }
  });

  tl.to({}, { duration: 1.2 }); // hold for 1.2s
}





/* ============================================================
   2. CUSTOM CURSOR
   ============================================================ */
function initCursor() {
    if (IS_TOUCH) return;
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.08, ease: 'none' });
  });

  // Smooth ring follow
  function animRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    gsap.set(ring, { x: ringX, y: ringY });
    requestAnimationFrame(animRing);
  }
  animRing();

  // Hover interactions
  const hoverEls = document.querySelectorAll('a, button, .nav-btn, .project-card, .skill-tag, .contact-link-item, .dropdown-link');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));
}

/* ============================================================
   3. NAV BUTTON GLOW (cursor-following)
   ============================================================ */
function initNavGlow() {
    if (IS_TOUCH) return;
  document.querySelectorAll('.nav-btn').forEach(btn => {
    const glow = btn.querySelector('.btn-glow');
    if (!glow) return;
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      glow.style.left = (e.clientX - r.left) + 'px';
      glow.style.top  = (e.clientY - r.top)  + 'px';
    });
  });
}


/* ============================================================
   4. PROJECT CARD GLOW (cursor-following)
   ============================================================ */
function initCardGlow() {
  
  if (IS_TOUCH) return;

  document.querySelectorAll('.project-card').forEach(card => {
    const glow = card.querySelector('.card-glow');
    if (!glow) return;
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      glow.style.left = (e.clientX - r.left) + 'px';
      glow.style.top  = (e.clientY - r.top)  + 'px';
    });
  });
}

/* ============================================================
   5. TEXT SPLIT UTILITY
   ============================================================ */
function splitText(el, unit = 'chars') {
  if (!el) return [];
  const text = el.textContent;
  el.innerHTML = '';
  const units = unit === 'words' ? text.split(' ') : text.split('');
  const spans = units.map((u, i) => {
    const span = document.createElement('span');
    span.classList.add(unit === 'words' ? 'word' : 'char');
    span.textContent = u === ' ' ? '\u00A0' : u;
    span.style.display = 'inline-block';
    el.appendChild(span);
    if (unit === 'words' && i < units.length - 1) {
      el.appendChild(document.createTextNode(' '));
    }
    return span;
  });
  return spans;
}

/* ============================================================
   6. HERO ANIMATIONS
   ============================================================ */
function initHero() {
  const eyebrow = document.querySelector('.hero-eyebrow');
  const titleEl = document.querySelector('.hero-title');
  const sub     = document.querySelector('.hero-sub');
  const cta     = document.querySelector('.hero-cta');
  const scroll  = document.querySelector('.hero-scroll-indicator');

  const chars = splitText(titleEl, 'chars');

  // Starting states
  gsap.set(chars, { y: '110%', rotateX: -90, opacity: 0 });
  gsap.set([eyebrow, sub, cta], { y: 20, opacity: 0 });

  const tl = gsap.timeline({ delay: 0.3 }); // shorter delay

  tl.set([titleEl, eyebrow, sub, cta, scroll], { visibility: 'visible' })

    .to(eyebrow, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power3.out'
    })

    .to(chars, {
      y: '0%',
      rotateX: 0,
      opacity: 1,
      duration: 0.5,
      stagger: 0.015, // faster letter wave
      ease: 'back.out(1.2)'
    }, '-=0.2')

    .to(sub, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power3.out'
    }, '-=0.3')

    .to(cta, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power3.out'
    }, '-=0.3')

    .to(scroll, {
      opacity: 1,
      duration: 0.4
    }, '-=0.2');




  // Show nav
  //gsap.to('#nav', { opacity: 1, duration: 0.8, delay: 1.0 });
}



/* ============================================================
   7. HERO SCROLL → CARD EFFECT
   ============================================================ */
function initHeroCard(smoother) {
  const heroWrap = document.querySelector('.hero-image-wrap');
  const heroImg  = document.querySelector('.hero-image-wrap img');

  ScrollTrigger.create({
    trigger: '#hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    onUpdate: self => {
      const p = self.progress;
      const inset  = gsap.utils.interpolate(0, 50, p);
      const radius = gsap.utils.interpolate(0, 28, p);
      const blur   = gsap.utils.interpolate(0, 8, p);
      const bright = gsap.utils.interpolate(1, 0.6, p);
      heroWrap.style.inset        = `${inset}px`;
      heroWrap.style.borderRadius = `${radius}px`;
      if (heroImg) {
        heroImg.style.filter = `blur(${blur}px) brightness(${bright})`;
      }
    }
  });
}

/* ============================================================
   8. MARQUEE (auto-plays via CSS, just ensure doubled)
   ============================================================ */
function initMarquee() {
  document.querySelectorAll('.marquee-track').forEach(track => {
    const clone = track.cloneNode(true);
    track.parentElement.appendChild(clone);
    // Already doubled in HTML, but ensure seamless
  });
}

/* ============================================================
   9. ABOUT SECTION ANIMATIONS
   ============================================================ */
function initAbout() {
  const titleEl = document.querySelector('#about .section-title');
  const label   = document.querySelector('#about .section-label');
  const chars   = splitText(titleEl, 'chars');

  // Flip letter entrance
  gsap.fromTo(label,
    { opacity: 0, x: -20 },
    { opacity: 1, x: 0, duration: 0.6,
      scrollTrigger: { trigger: '#about', start: 'top 70%' }
    });

  gsap.fromTo(chars,
    { rotateY: 90, opacity: 0 },
    { rotateY: 0,  opacity: 1, stagger: 0.04, duration: 0.7, ease: 'back.out(1.4)',
      scrollTrigger: { trigger: '#about', start: 'top 65%' }
    });

  gsap.fromTo('.about-text',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, stagger: 0.15, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '#about', start: 'top 60%' }
    });

  gsap.fromTo('.about-skills',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.about-skills', start: 'top 80%' }
    });

  gsap.fromTo('.about-right',
    { opacity: 0, x: 60 },
    { opacity: 1, x: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.about-right', start: 'top 70%' }
    });
}

/* ============================================================
   10. PROJECTS SECTION ANIMATIONS
   ============================================================ */
function initProjects() {
  const titleEl = document.querySelector('#projects .section-title');
  const label   = document.querySelector('#projects .section-label');
  const chars   = splitText(titleEl, 'chars');

  gsap.fromTo(label,
    { opacity: 0, x: -20 },
    { opacity: 1, x: 0, duration: 0.6,
      scrollTrigger: { trigger: '#projects', start: 'top 70%' }
    });

  // Flip letter entrance
  gsap.fromTo(chars,
    { y: '100%', rotateX: -90, opacity: 0 },
    { y: '0%',   rotateX: 0,   opacity: 1, stagger: 0.035, duration: 0.8, ease: 'back.out(1.6)',
      scrollTrigger: { trigger: '#projects', start: 'top 65%' }
    });

  // Cards stagger in
  gsap.fromTo('.project-card',
    { opacity: 0, y: 60, scale: 0.96 },
    { opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.projects-grid', start: 'top 75%' }
    });
}

/* ============================================================
   11. CONTACT SECTION ANIMATIONS
   ============================================================ */
function initContact() {
  const titleEl = document.querySelector('#contact .section-title');
  const label   = document.querySelector('#contact .section-label');
  const chars   = splitText(titleEl, 'chars');

  gsap.fromTo(label,
    { opacity: 0, x: -20 },
    { opacity: 1, x: 0, duration: 0.6,
      scrollTrigger: { trigger: '#contact', start: 'top 70%' }
    });

  gsap.fromTo(chars,
    { rotateY: -90, opacity: 0, transformOrigin: '50% 50% -20px' },
    { rotateY: 0,   opacity: 1, stagger: 0.04, duration: 0.8, ease: 'back.out(1.4)',
      scrollTrigger: { trigger: '#contact', start: 'top 65%' }
    });

  gsap.fromTo('.contact-big-text',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '.contact-big-text', start: 'top 80%' }
    });

  gsap.fromTo('.contact-links',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.contact-links', start: 'top 80%' }
    });

  gsap.fromTo('.contact-right',
    { opacity: 0, x: 50 },
    { opacity: 1, x: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.contact-right', start: 'top 75%' }
    });
}

/* ============================================================
   12. SECTION BLUR ON SCROLL TRANSITION
   ============================================================ */
function initScrollBlur() {
  document.querySelectorAll('.section').forEach(sec => {
    ScrollTrigger.create({
      trigger: sec,
      start: 'bottom 90%',
      end: 'bottom 20%',
      scrub: true,
      onUpdate: self => {
        const p = self.progress;
        const b = gsap.utils.interpolate(0, 6, p);
        // Blur only outgoing section content
        gsap.set(sec.querySelector('.section-title, .section-label'), { filter: `blur(${b * 0.3}px)` });
      }
    });
  });
}

/* ============================================================
   13. PARALLAX BACKGROUNDS
   ============================================================ */
function initParallax() {
  gsap.utils.toArray('.section').forEach(sec => {
    const bg = sec.querySelector('.hero-bg, .section-bg');
    if (!bg) return;
    gsap.to(bg, {
      y: '20%',
      ease: 'none',
      scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });
}

/* ============================================================
   14. SMOOTH SCROLLER — JS-based smooth scroll fallback
   ============================================================ */
function initSmoother() {
  const content = document.getElementById('smooth-content');
  const wrapper = document.getElementById('smooth-wrapper');

  const SCROLL_SPEED = IS_TOUCH ? 2 : 1.2; // wheel speed
  const TOUCH_SPEED  = 2.5;                // touch drag speed

  let currentY = 0;
  let targetY  = 0;
  let ease     = 0.1;
  let raf;

  function tick() {
    currentY += (targetY - currentY) * ease;
    if (Math.abs(targetY - currentY) < 0.05) currentY = targetY;
    content.style.transform = `translateY(${-currentY}px)`;
    ScrollTrigger.update();
    raf = requestAnimationFrame(tick);
  }

  /* -----------------------------
     Wheel scrolling on wrapper only
  ----------------------------- */
wrapper.addEventListener('wheel', e => {
  e.preventDefault();
  targetY = Math.max(0, Math.min(targetY + e.deltaY * SCROLL_SPEED, content.scrollHeight - window.innerHeight));
}, { passive: false });

  /* -----------------------------
     Touch support
  ----------------------------- */
  let touchStartY = 0;
  wrapper.addEventListener('touchstart', e => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  wrapper.addEventListener('touchmove', e => {
    const touchY = e.touches[0].clientY;
    const dy = touchStartY - touchY; // positive if swipe up
    touchStartY = touchY;
    targetY = Math.max(0, Math.min(targetY + dy * TOUCH_SPEED, content.scrollHeight - window.innerHeight));
    e.preventDefault(); // prevent native jump
  }, { passive: false });

  /* -----------------------------
     Custom scroll event for nav links
  ----------------------------- */
  window.addEventListener('_smoothSetTarget', e => {
    targetY = Math.max(0, Math.min(e.detail.y, content.scrollHeight - window.innerHeight));
  });

  /* -----------------------------
     ScrollTrigger proxy
  ----------------------------- */
  ScrollTrigger.scrollerProxy(wrapper, {
    scrollTop(v) {
      if (arguments.length) { targetY = v; currentY = v; }
      return currentY;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
    pinType: 'transform'
  });

  ScrollTrigger.addEventListener('refresh', () => { currentY = 0; targetY = 0; });
  ScrollTrigger.defaults({ scroller: wrapper });

  tick();
  return { scrollTo: (y) => { targetY = y; } };
}


/* ============================================================
   15. NAV SMOOTH SCROLL LINKS
   ============================================================ */
function initNavLinks() {
  document.querySelectorAll('[data-scroll-to]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault(); // only blocks this click, not global scrolling
      const target = document.querySelector(btn.dataset.scrollTo);
      if (!target) return;
      // Dispatch a custom event for smoother
      const y = target.offsetTop;
      window.dispatchEvent(new CustomEvent('_smoothSetTarget', { detail: { y } }));
    });
  });
}

/* ============================================================
   16. SECTION SNAP (IntersectionObserver fallback)
   ============================================================ */
function initSnapScroll() {
  // CSS scroll-snap is handled via smooth-content styles
}

/* ============================================================
   INIT — runs after loader
   ============================================================ */
function initSite() {
  const smoother = initSmoother();
  initHero();
  initHeroCard(smoother);
  initAbout();
  initProjects();
  initContact();
  initNavGlow();
  initCardGlow();
  initNavLinks();
  initMarquee();
  initScrollBlur();
  initParallax();

  // Refresh ScrollTrigger after smoother init
  gsap.delayedCall(0.3, () => ScrollTrigger.refresh());
}

/* ============================================================
   BOOT
   ============================================================ */
window.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initLoader();
});
