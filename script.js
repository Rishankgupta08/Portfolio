/* ─── Service Worker Registration (outside DOMContentLoaded) ─── */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('[SW] Registered:', reg.scope))
      .catch(err => console.log('[SW] Failed:', err));
  });
}

/* ─── EmailJS Initialization ─── */
if (typeof emailjs !== 'undefined') {
  emailjs.init('TeTkBfazej3pN5vTwY');
}

/* ════════════════════════════════════════
   DOM READY
════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {

  /* ─── Element References ─── */
  const scrollProgressBar = document.getElementById('scrollProgress');
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  const heroName = document.getElementById('heroName');
  const openModalBtns = document.querySelectorAll('#openContactModal');
  const modalOverlay = document.getElementById('contactModal');
  const modalClose = document.getElementById('modalClose');
  const contactForm = document.getElementById('contactForm');
  const formSubmitBtn = document.getElementById('formSubmitBtn');
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyToast = document.getElementById('copyToast');

  /* ════════════════════════════════════
     1. SCROLL PROGRESS BAR
  ════════════════════════════════════ */
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgressBar) scrollProgressBar.style.width = scrollPct + '%';
  }

  /* ════════════════════════════════════
     2. NAVBAR SCROLL STATE
  ════════════════════════════════════ */
  function updateNavbar() {
    if (!navbar) return;
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  /* ════════════════════════════════════
     3. COMBINED SCROLL HANDLER
  ════════════════════════════════════ */
  window.addEventListener('scroll', () => {
    updateScrollProgress();
    updateNavbar();
  }, { passive: true });

  // Init
  updateScrollProgress();
  updateNavbar();

  /* ════════════════════════════════════
     4. CUSTOM CURSOR (desktop only)
  ════════════════════════════════════ */
  if (window.matchMedia('(hover: hover) and (min-width: 769px)').matches) {
    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let animID = null;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorDot) {
        cursorDot.style.left = mouseX + 'px';
        cursorDot.style.top = mouseY + 'px';
      }
    });

    function lerp(a, b, t) { return a + (b - a) * t; }

    function animateCursorRing() {
      ringX = lerp(ringX, mouseX, 0.15);
      ringY = lerp(ringY, mouseY, 0.15);
      if (cursorRing) {
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top = ringY + 'px';
      }
      animID = requestAnimationFrame(animateCursorRing);
    }
    animateCursorRing();

    // Expand ring on hoverable elements
    const hoverables = document.querySelectorAll(
      'a, button, .tech-chip, .algo-chip, .platform-card, .project-card, ' +
      '.stat-chip, .identity-chip, .step-img-card'
    );

    hoverables.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ════════════════════════════════════
     5. HERO NAME REVEAL ANIMATION
  ════════════════════════════════════ */
  // Simple, reliable: just let CSS animate the whole name element
  // (No span-splitting — it breaks -webkit-background-clip: text gradient)
  if (heroName) {
    heroName.style.opacity = '0';
    heroName.style.transform = 'translateY(20px)';
    heroName.style.transition = 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)';
    // Small delay so other hero elements animate first
    setTimeout(() => {
      heroName.style.opacity = '1';
      heroName.style.transform = 'translateY(0)';
    }, 200);
  }

  /* ════════════════════════════════════
     6. MOBILE MENU TOGGLE
  ════════════════════════════════════ */
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
      // Keyboard accessibility: make links focusable only when menu is open
      mobileNavLinks.forEach(link => {
        link.tabIndex = isOpen ? 0 : -1;
      });
    });

    // Close on link click
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        // Restore tabindex
        mobileNavLinks.forEach(l => { l.tabIndex = -1; });
      });
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    });
  }

  /* ════════════════════════════════════
     7. INTERSECTION OBSERVER — fade-up
  ════════════════════════════════════ */
  const fadeUpObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = entry.target.parentElement
          ? [...entry.target.parentElement.children].filter(c => c.classList.contains('fade-up'))
          : [];
        const sibIdx = siblings.indexOf(entry.target);
        const delay = sibIdx >= 0 ? sibIdx * 0.1 : 0;

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay * 1000);

        fadeUpObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -32px 0px'
  });

  document.querySelectorAll('.fade-up').forEach(el => {
    fadeUpObserver.observe(el);
  });

  /* ════════════════════════════════════
     8. ACTIVE NAV LINK TRACKING
  ════════════════════════════════════ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (activeLink) activeLink.classList.add('active');
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => sectionObserver.observe(s));

  /* ════════════════════════════════════
     9. 3D ROTATING SHAPE (Canvas)
  ════════════════════════════════════ */
  const canvas = document.getElementById('shapeCanvas');
  if (canvas && canvas.getContext) {
    const ctx = canvas.getContext('2d');
    const cw = canvas.width;
    const ch = canvas.height;
    let angle = 0;

    // Low-poly pyramid vertices (centered, scaled)
    const apex = [0, -180, 0];
    const base1 = [-140, 180, -100];
    const base2 = [140, 180, -100];
    const base3 = [0, 180, 140];

    function project3D(x, y, z, rotY) {
      const cos = Math.cos(rotY), sin = Math.sin(rotY);
      const rx = x * cos - z * sin;
      const rz = x * sin + z * cos;
      const fov = 700;
      const d = fov / (fov + rz + 300);
      return [rx * d + cw / 2, y * d + ch / 2 - 40];
    }

    function drawFace(pts, colorTop, colorBottom, alpha) {
      const projected = pts.map(([x, y, z]) => project3D(x, y, z, angle));
      ctx.beginPath();
      ctx.moveTo(projected[0][0], projected[0][1]);
      projected.slice(1).forEach(([px, py]) => ctx.lineTo(px, py));
      ctx.closePath();

      const grad = ctx.createLinearGradient(
        projected[0][0], projected[0][1],
        projected[pts.length - 1][0], projected[pts.length - 1][1]
      );
      grad.addColorStop(0, colorTop + alpha + ')');
      grad.addColorStop(1, colorBottom + alpha + ')');
      ctx.fillStyle = grad;
      ctx.fill();

      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    function drawShape() {
      ctx.clearRect(0, 0, cw, ch);

      // 4 triangular faces
      drawFace([apex, base1, base2], 'rgba(255,107,53,', 'rgba(123,110,246,', '0.7');
      drawFace([apex, base2, base3], 'rgba(123,110,246,', 'rgba(255,107,53,', '0.65');
      drawFace([apex, base3, base1], 'rgba(255,107,53,', 'rgba(123,110,246,', '0.55');
      // Base
      drawFace([base1, base2, base3], 'rgba(255,107,53,', 'rgba(255,107,53,', '0.25');

      angle += 0.004; // ~0.23 deg/frame
      requestAnimationFrame(drawShape);
    }

    drawShape();
  }

  /* ════════════════════════════════════
     10. HERO PARALLAX EFFECT
  ════════════════════════════════════ */
  const heroBg = document.getElementById('heroBg');
  if (heroBg && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      heroBg.style.transform = `translateY(${scrollY * 0.4}px)`;
    }, { passive: true });
  }

  /* ════════════════════════════════════
     12. CONTACT MODAL
  ════════════════════════════════════ */
  function openModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.add('open');
    modalOverlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // Focus first input
    setTimeout(() => {
      const firstInput = modalOverlay.querySelector('input, textarea');
      if (firstInput) firstInput.focus();
    }, 400);
  }

  function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    modalOverlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (openModalBtns.length > 0) openModalBtns.forEach(btn => btn.addEventListener('click', openModal));
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay?.classList.contains('open')) closeModal();
  });

  /* ════════════════════════════════════
     13. EMAILJS FORM SUBMIT
  ════════════════════════════════════ */
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Simple inline validation
      const name = document.getElementById('cf-name');
      const email = document.getElementById('cf-email');
      const message = document.getElementById('cf-message');
      let valid = true;

      [name, email, message].forEach(field => {
        field.style.borderColor = '';
        if (!field.value.trim()) {
          field.style.borderColor = '#EF4444';
          valid = false;
        }
      });

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email.value.trim() && !emailRegex.test(email.value.trim())) {
        email.style.borderColor = '#EF4444';
        valid = false;
      }

      if (!valid) return;

      const originalText = formSubmitBtn.textContent;
      formSubmitBtn.textContent = 'Sending...';
      formSubmitBtn.disabled = true;

      try {
        if (typeof emailjs !== 'undefined') {
          await emailjs.sendForm(
            'service_qazi1g2',
            'template_p2z8qyg',
            contactForm,
            'TeTkBfazej3pN5vTwY'
          );
        } else {
          // Simulate for demo
          await new Promise(r => setTimeout(r, 1000));
        }

        formSubmitBtn.textContent = 'Message Sent ✓';
        formSubmitBtn.style.background = '#15803D';
        contactForm.reset();

        setTimeout(() => {
          closeModal();
          formSubmitBtn.textContent = originalText;
          formSubmitBtn.style.background = '';
          formSubmitBtn.disabled = false;
        }, 2500);

      } catch (err) {
        formSubmitBtn.textContent = 'Error — Try Again';
        formSubmitBtn.style.background = '#991B1B';
        console.error('[EmailJS]', err);

        setTimeout(() => {
          formSubmitBtn.textContent = originalText;
          formSubmitBtn.style.background = '';
          formSubmitBtn.disabled = false;
        }, 3000);
      }
    });
  }

  /* ════════════════════════════════════
     14. COPY EMAIL TO CLIPBOARD
  ════════════════════════════════════ */
  if (copyEmailBtn && copyToast) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = 'rishankgupta567@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
      } catch {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = email;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }

      copyToast.classList.add('show');
      setTimeout(() => copyToast.classList.remove('show'), 2000);
    });
  }

  /* ════════════════════════════════════
     15. RESUME DOWNLOAD HANDLER
  ════════════════════════════════════ */
  const resumeBtn = document.getElementById('resumeBtn');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', (e) => {
      // If actual resume PDF exists at /resume.pdf, remove the preventDefault below
      // and let the link's href handle it. Otherwise show a toast.
      const btn = e.currentTarget;
      const original = btn.textContent;
      btn.textContent = 'Resume coming soon!';
      setTimeout(() => btn.textContent = original, 2000);
    });
  }

  /* ════════════════════════════════════
     16. CONSOLE EASTER EGG
  ════════════════════════════════════ */
  console.log(`%c
  ██████╗ ██╗███████╗██╗  ██╗ █████╗ ███╗   ██╗██╗  ██╗
  ██╔══██╗██║██╔════╝██║  ██║██╔══██╗████╗  ██║██║ ██╔╝
  ██████╔╝██║███████╗███████║███████║██╔██╗ ██║█████╔╝ 
  ██╔══██╗██║╚════██║██╔══██║██╔══██║██║╚██╗██║██╔═██╗ 
  ██║  ██║██║███████║██║  ██║██║  ██║██║ ╚████║██║  ██╗
  ╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝
  `, 'color: #FF6B35; font-family: monospace;');

  console.log('%c👋 Hey recruiter/dev! Welcome to the source.', 'color: #9CA3AF; font-size: 14px;');
  console.log('%c🚀 GitHub: https://github.com/Rishankgupta08', 'color: #7B6EF6; font-size: 13px;');
  console.log('%c💼 LinkedIn: https://linkedin.com/in/rishank-gupta-a54486323', 'color: #7B6EF6; font-size: 13px;');
  console.log('%c🧩 LeetCode: https://leetcode.com/u/rishankgupta567/', 'color: #FF6B35; font-size: 13px;');


  /* ================================================
     18. SELECTED WORKS — TWO-PANEL INTERFACE
  ================================================ */
  (() => {
    const PROJECTS = [
      {
        id: 'moae', name: 'MOAE', year: '2025', accent: '#FF6B35',
        statusDot: '#22C55E', type: 'AI Orchestration',
        tags: ['AI', 'live'],
        badge: '<span class="sw-badge sw-badge-progress"><span class="sw-pulse-dot"></span>In Progress</span>',
        desc: 'Multi-Agent AI Orchestration Engine — real-time task delegation across specialized agents with Spring Boot+HTML+CSS+JavaScript.',
        metrics: [{ num: 3, suffix: '', label: 'AI Agents' }, { num: 70, suffix: '%', label: 'Uptime' }, { num: 3, suffix: 'x', label: 'Faster' }],
        techTags: ['Spring Boot', 'HTML', 'CSS', 'JavaScript', 'Ollama', 'Agentic AI'],
        liveUrl: '#', githubUrl: 'https://github.com/Rishankgupta08/Autonomous-Multi-Agent-Orchestration-System',
        buildingChip: true,
        screens: [
          { label: 'Dashboard', img: 'img/moae/Screenshot 2026-04-21 113523.png', color: 'linear-gradient(135deg,#1a0a00 0%,#2d1206 100%)', accent: '#FF6B35' },
          { label: 'Agent View', img: 'img/moae/Screenshot 2026-04-21 113648.png', color: 'linear-gradient(135deg,#0d0d1a 0%,#1a0d2e 100%)', accent: '#7B6EF6' },
          { label: 'Logs', img: 'img/moae/Screenshot 2026-04-21 113723.png', color: 'linear-gradient(135deg,#001a0d 0%,#002d1a 100%)', accent: '#22C55E' }
        ]
      },
      {
        id: 'monastery360', name: 'Monastery360', year: '2025', accent: '#F59E0B',
        statusDot: '#7B6EF6', type: 'Full-Stack',
        tags: ['fullstack', 'live'],
        badge: '<span class="sw-badge sw-badge-live">Live ↗</span>',
        desc: 'Virtual tour platform for monasteries — immersive 360° experiences with booking & event management.',
        metrics: [{ num: 360, suffix: '°', label: 'Virtual Tour' }, { num: 12, suffix: '+', label: 'Locations' }, { num: 100, suffix: '+', label: 'Visitors' }],
        techTags: ['Java', 'Spring Boot', 'React.js', 'Firebase', 'Tailwind CSS', 'three.js'],
        liveUrl: 'https://monastery360-haritage.vercel.app/', githubUrl: 'https://github.com/Rishankgupta08/Monastery360',
        buildingChip: false,
        screens: [
          { label: 'Home', img: 'img/monestary360/home_page.png', color: 'linear-gradient(135deg,#1a1400 0%,#2d2206 100%)', accent: '#F59E0B' },
          { label: 'Tour', img: 'img/monestary360/Screenshot 2026-04-20 215149.png', color: 'linear-gradient(135deg,#0d0d1a 0%,#1a1028 100%)', accent: '#7B6EF6' },
          { label: 'Booking', img: 'img/monestary360/Screenshot 2026-04-20 215203.png', color: 'linear-gradient(135deg,#001a0d 0%,#001f10 100%)', accent: '#22C55E' }
        ]
      },
      {
        id: 'typeverse', name: 'TypeVerse', year: '2024', accent: '#00D4D4',
        statusDot: '#7B6EF6', type: 'Full-Stack',
        tags: ['fullstack', 'live'],
        badge: '<span class="sw-badge sw-badge-live">Live ↗</span>',
        desc: 'Competitive typing platform with real-time races, global leaderboards, and detailed WPM analytics.',
        metrics: [{ num: 120, suffix: '+', label: 'WPM Record' }, { num: 20, suffix: '+', label: 'Users' }, { num: 10, suffix: 'K', label: 'Races' }],
        techTags: ['React', 'Socket.io', 'Node.js', 'PostgreSQL', 'Redis'],
        liveUrl: 'https://typeversee.vercel.app/', githubUrl: 'https://github.com/Rishankgupta08/TypeVerse',
        buildingChip: false,
        screens: [
          { label: 'Race', img: 'img/typeverse/Screenshot 2026-04-21 114109.png', color: 'linear-gradient(135deg,#001a1a 0%,#002d2d 100%)', accent: '#00D4D4' },
          { label: 'Stats', img: 'img/typeverse/Screenshot 2026-04-21 114128.png', color: 'linear-gradient(135deg,#0a001a 0%,#160028 100%)', accent: '#7B6EF6' },
          { label: 'Board', img: 'img/typeverse/Screenshot 2026-04-21 114154.png', color: 'linear-gradient(135deg,#001a0d 0%,#002010 100%)', accent: '#22C55E' }
        ]
      },
      {
        id: 'foodbridge', name: 'FoodBridge AI', year: '2024', accent: '#FF6B35',
        statusDot: '#6B7280', type: 'Full-Stack',
        tags: ['ai', 'fullstack'],
        badge: '<span class="sw-badge sw-badge-year">2024</span>',
        desc: 'AI-powered food surplus redistribution platform connecting restaurants with NGOs in real time.',
        metrics: [{ num: 50, suffix: '+', label: 'Meals' }, { num: 5, suffix: '+', label: 'Partners' }, { num: 70, suffix: '%', label: 'Match Rate' }],
        techTags: ['React', 'Sprng Boot ', 'Maven', 'Vite', 'PostgreSQL', 'Docker'],
        liveUrl: null, githubUrl: 'https://github.com/Rishankgupta08/AI-powered-Food-Surplus-and-Redistribution-System',
        buildingChip: false,
        screens: [
          { label: 'Dashboard', color: 'linear-gradient(135deg,#1a0a00 0%,#2a1000 100%)', accent: '#FF6B35' },
          { label: 'AI Match', color: 'linear-gradient(135deg,#001a0d 0%,#002010 100%)', accent: '#22C55E' }
        ]
      },
      {
        id: 'airport', name: 'Airport Management System', year: '2023', accent: '#7B6EF6',
        statusDot: '#6B7280', type: 'Backend',
        tags: ['backend'],
        badge: '<span class="sw-badge sw-badge-year">2023</span>',
        desc: 'Full airport management system with flight scheduling, gate allocation, and passenger tracking built in Java.',
        metrics: [{ num: 10, suffix: '+', label: 'Flights/Day' }, { num: 60, suffix: '%', label: 'Reliability' }, { num: 10, suffix: 'ms', label: 'Latency' }],
        techTags: ['Java', 'Spring Boot', 'SQL Server', 'REST API', 'Swagger'],
        liveUrl: null, githubUrl: 'https://github.com/Rishankgupta08/AirportManagementSystem',
        buildingChip: false,
        screens: [
          { label: 'Flights', img: 'img/airport.png', color: 'linear-gradient(135deg,#0a001a 0%,#14003a 100%)', accent: '#7B6EF6' },
          { label: 'Gates', color: 'linear-gradient(135deg,#001a1a 0%,#002424 100%)', accent: '#00D4D4' }
        ]
      },
      {
        id: 'tasktracker', name: 'Task Tracker', year: '2023', accent: '#22C55E',
        statusDot: '#6B7280', type: 'Full-Stack',
        tags: ['fullstack'],
        badge: '<span class="sw-badge sw-badge-year">2023</span>',
        desc: 'Collaborative task management with drag-and-drop boards, real-time updates, and team analytics.',
        metrics: [{ num: 200, suffix: '+', label: 'Tasks/Day' }, { num: 5, suffix: '+', label: 'Teams' }, { num: 40, suffix: '%', label: 'Productivity ↑' }],
        techTags: ['React', 'Spring Boot', 'FireBase', 'JWT'],
        liveUrl: null, githubUrl: 'https://github.com/Rishankgupta08/Task-Tracker',
        buildingChip: false,
        screens: [
          { label: 'Board', img: 'img/tasktracker.png', color: 'linear-gradient(135deg,#001a0d 0%,#002a14 100%)', accent: '#22C55E' },
          { label: 'Stats', color: 'linear-gradient(135deg,#0d0d1a 0%,#1a1a2e 100%)', accent: '#7B6EF6' }
        ]
      }
    ];

    /* DOM refs */
    const navList = document.getElementById('swNavList');
    const preview = document.getElementById('swPreview');
    const counter = document.getElementById('swCounter');
    const progressFill = document.getElementById('swProgressFill');
    const autoLabel = document.getElementById('swAutoLabel');
    const kbHint = document.getElementById('swKbHint');
    const timerBar = document.getElementById('swTimerBar');
    const buildChip = document.getElementById('swBuildingChip');
    const tooltip = document.getElementById('swTooltip');
    const ttPreview = document.getElementById('swTooltipPreview');
    const ttName = document.getElementById('swTooltipName');
    const ttMeta = document.getElementById('swTooltipMeta');

    /* Lightbox DOM refs */
    const lbOverlay = document.getElementById('lbOverlay');
    const lbTrack = document.getElementById('lbTrack');
    const lbDots = document.getElementById('lbDots');
    const lbCounter = document.getElementById('lbCounter');
    const lbProjName = document.getElementById('lbProjectName');
    const lbPrev = document.getElementById('lbPrev');
    const lbNext = document.getElementById('lbNext');
    const lbClose = document.getElementById('lbClose');
    const lbViewport = document.getElementById('lbViewport');

    /* Lightbox state */
    let lbProject = null;
    let lbSlide = 0;
    let lbOpen = false;
    let swipeStartX = 0;

    if (!navList || !preview) return;

    let activeIndex = 0;
    let currentFilter = 'all';
    let timerHandle = null;
    let timerPct = 0;
    const AUTO_DURATION = 10000;
    const TIMER_INTERVAL = 80;

    /* ── Colour helpers ── */
    function screenHTML(sc) {
      if (sc.img) {
        return `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;background:#111;">
          <img src="${sc.img}" alt="${sc.label}" loading="lazy" style="width:100%;height:100%;object-fit:cover;object-position:top center;" />
        </div>`;
      }
      return `<div style="width:100%;height:100%;background:${sc.color};display:flex;align-items:center;justify-content:center;position:relative;">
        <div style="position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 18px,rgba(255,255,255,0.025) 18px,rgba(255,255,255,0.025) 19px)"></div>
        <span style="font-family:var(--font-mono);font-size:10px;color:${sc.accent};opacity:0.7;position:relative;z-index:1;">${sc.label}</span>
      </div>`;
    }

    /* ── Build nav ── */
    function buildNav() {
      navList.innerHTML = '';
      PROJECTS.forEach((p, i) => {
        const li = document.createElement('li');
        li.className = 'sw-nav-item' + (i === activeIndex ? ' active' : '');
        if (currentFilter !== 'all' && !p.tags.includes(currentFilter)) li.classList.add('dimmed');
        li.style.setProperty('--sw-accent', p.accent);
        li.setAttribute('data-index', i);
        li.setAttribute('tabindex', '0');
        li.setAttribute('role', 'button');
        li.setAttribute('aria-label', p.name + ' project');
        li.innerHTML = `
          <div class="sw-nav-accent-bar"></div>
          <div class="sw-nav-name">${p.name}</div>
          <div class="sw-nav-meta">
            <span class="sw-nav-year">${p.year}</span>
            <span class="sw-nav-dot" style="background:${p.statusDot}"></span>
            <span class="sw-nav-type">${p.type}</span>
          </div>
          <span class="sw-nav-chevron" aria-hidden="true">›</span>`;
        li.addEventListener('click', () => selectProject(i, true));
        li.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectProject(i, true); } });
        li.addEventListener('mouseenter', () => showTooltip(li, p));
        li.addEventListener('mouseleave', () => hideTooltip());
        navList.appendChild(li);
      });
    }

    /* ── Build preview ── */
    function buildPreview(p) {
      const sc = p.screens[0];
      const slideNum = p.screens.length;
      const counterText = slideNum > 1 ? `1 / ${slideNum}` : '';

      const metrics = p.metrics.map(m =>
        `<div class="sw-metric">
          <span class="sw-metric-num" data-target="${m.num}" data-suffix="${m.suffix}">0${m.suffix}</span>
          <span class="sw-metric-label">${m.label}</span>
        </div>`).join('');

      const tags = p.techTags.map(t => `<span class="sw-tag">${t}</span>`).join('');
      const links = (p.liveUrl ? `<a class="sw-link" href="${p.liveUrl}" target="_blank" rel="noopener">Live <span class="sw-link-arrow">↗</span></a>` : '')
        + `<a class="sw-link sw-link-dim" href="${p.githubUrl}" target="_blank" rel="noopener">GitHub</a>`;

      preview.innerHTML = `<div class="sw-preview-content">
        <div class="sw-info">
          <div class="sw-badges"><span class="sw-badge sw-badge-year">${p.year}</span>${p.badge}</div>
          <div class="sw-title" style="color:${p.accent}">${p.name}</div>
          <div class="sw-desc">${p.desc}</div>
        </div>
        <div class="sw-screenshots">
          <div class="sw-browser" data-project="${p.id}" tabindex="0" role="button" aria-label="Open gallery for ${p.name}">
            <div class="sw-browser-bar">
              <div class="sw-traffic">
                <span class="sw-dot-r"></span>
                <span class="sw-dot-y"></span>
                <span class="sw-dot-g"></span>
              </div>
              <div class="sw-url-bar"></div>
              <div class="sw-browser-bar-right">
                <span class="browser-label">${sc.label}</span>
                ${slideNum > 1 ? `<span class="browser-counter" id="mainBrowserCounter">▶ ${counterText}</span>` : ''}
              </div>
            </div>
            <div class="sw-screen">${screenHTML(sc)}</div>
          </div>
        </div>
        <div class="sw-metrics">${metrics}</div>
        <div class="sw-bottom-bar"><div class="sw-tags">${tags}</div><div class="sw-links">${links}</div></div>
      </div>`;

      /* count-up */
      preview.querySelectorAll('.sw-metric-num').forEach(el => {
        const target = +el.dataset.target, suffix = el.dataset.suffix;
        let cur = 0, steps = 30;
        const inc = target / steps;
        const t = setInterval(() => {
          cur = Math.min(cur + inc, target);
          el.textContent = Math.round(cur) + suffix;
          if (cur >= target) clearInterval(t);
        }, 30);
      });

      /* wire click/keyboard on the single browser card */
      setTimeout(() => {
        const card = preview.querySelector('.sw-browser');
        if (card) {
          card.addEventListener('click', () => openLightbox(p, 0));
          card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(p, 0); } });
        }
      }, 220);
    }

    /* ── Select project ── */
    function selectProject(idx, userAction = false) {
      activeIndex = idx;
      buildNav();
      const p = PROJECTS[idx];

      /* fade out → update → fade in */
      const old = preview.querySelector('.sw-preview-content');
      if (old) {
        old.classList.add('fade-out');
        setTimeout(() => buildPreview(p), 180);
      } else {
        buildPreview(p);
      }

      /* chip */
      if (buildChip) buildChip.classList.toggle('visible', !!p.buildingChip);

      /* footer */
      const pad = n => String(n).padStart(2, '0');
      if (counter) counter.textContent = `${pad(idx + 1)} / ${pad(PROJECTS.length)}`;
      if (progressFill) progressFill.style.width = ((idx + 1) / PROJECTS.length * 100) + '%';
      if (progressFill) progressFill.style.background = p.accent;

      if (userAction) resetTimer();
    }

    /* ── Timer ── */
    function startTimer() {
      stopTimer();
      timerPct = 0;
      if (timerBar) timerBar.style.width = '0%';
      timerHandle = setInterval(() => {
        timerPct += (TIMER_INTERVAL / AUTO_DURATION) * 100;
        if (timerBar) timerBar.style.width = timerPct + '%';
        if (timerPct >= 100) {
          timerPct = 0;
          const visibleIndices = PROJECTS.map((p, i) => i)
            .filter(i => currentFilter === 'all' || PROJECTS[i].tags.includes(currentFilter));
          const cur = visibleIndices.indexOf(activeIndex);
          const next = visibleIndices[(cur + 1) % visibleIndices.length];
          selectProject(next);
        }
      }, TIMER_INTERVAL);
    }

    function stopTimer() { if (timerHandle) { clearInterval(timerHandle); timerHandle = null; } }
    function resetTimer() { startTimer(); }

    /* ── Filters ── */
    document.querySelectorAll('.sw-filter').forEach(btn => {
      btn.addEventListener('click', () => {
        currentFilter = btn.dataset.filter;
        document.querySelectorAll('.sw-filter').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
        btn.classList.add('active'); btn.setAttribute('aria-selected', 'true');
        const first = PROJECTS.findIndex(p => currentFilter === 'all' || p.tags.includes(currentFilter));
        if (first >= 0) selectProject(first, true);
      });
    });

    /* ── Keyboard ── */
    document.addEventListener('keydown', e => {
      if (!document.getElementById('swPanel')) return;
      if (e.key === 'Escape') { closeLightbox(); return; }

      /* When lightbox is open, arrows navigate slides */
      if (lbOpen) {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); lbGoTo(lbSlide + 1); return; }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); lbGoTo(lbSlide - 1); return; }
        return;
      }

      const visible = PROJECTS.map((p, i) => i).filter(i => currentFilter === 'all' || PROJECTS[i].tags.includes(currentFilter));
      const cur = visible.indexOf(activeIndex);
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        selectProject(visible[(cur + 1) % visible.length], true);
        if (kbHint) { kbHint.classList.add('highlight'); setTimeout(() => kbHint.classList.remove('highlight'), 600); }
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        selectProject(visible[(cur - 1 + visible.length) % visible.length], true);
        if (kbHint) { kbHint.classList.add('highlight'); setTimeout(() => kbHint.classList.remove('highlight'), 600); }
      }
    });

    /* ── Lightbox ── */
    function buildLightboxSlides(p) {
      if (!lbTrack) return;
      const N = p.screens.length;

      // Track is N times wider than the viewport (percentage-based)
      lbTrack.style.width = (N * 100) + '%';

      lbTrack.innerHTML = p.screens.map(sc => `
        <div class="lb-slide">
          <div class="lb-browser">
            <div class="lb-browser-bar">
              <div class="lb-traffic">
                <span class="sw-dot-r" style="width:6px;height:6px;border-radius:50%;display:inline-block"></span>
                <span class="sw-dot-y" style="width:6px;height:6px;border-radius:50%;display:inline-block"></span>
                <span class="sw-dot-g" style="width:6px;height:6px;border-radius:50%;display:inline-block"></span>
              </div>
              <div class="lb-url-bar"></div>
              <span class="lb-page-label">${sc.label}</span>
            </div>
            <div class="lb-content">${screenHTML(sc)}</div>
          </div>
        </div>`).join('');

      // Each slide = 100/N % of the track = 100% of the viewport
      const slides = lbTrack.querySelectorAll('.lb-slide');
      slides.forEach(s => {
        s.style.width = (100 / N) + '%';
      });
    }

    function lbGoTo(idx) {
      if (!lbProject) return;
      lbSlide = Math.max(0, Math.min(idx, lbProject.screens.length - 1));
      const N = lbProject.screens.length;
      // Translate by -(slideIndex * 100/N)% of track width
      // e.g. 3 slides: track is 300% wide, each slide is 33.33% of track
      // slide 0: translateX(0%), slide 1: translateX(-33.33%), slide 2: translateX(-66.66%)
      if (lbTrack) lbTrack.style.transform = `translateX(-${lbSlide * (100 / N)}%)`;

      /* update dots */
      if (lbDots) lbDots.querySelectorAll('.lb-dot').forEach((d, i) => d.classList.toggle('active', i === lbSlide));
      /* update counter */
      const pad = n => String(n).padStart(2, '0');
      if (lbCounter) lbCounter.textContent = `${pad(lbSlide + 1)} / ${pad(N)}`;
      /* update arrow states */
      if (lbPrev) lbPrev.disabled = lbSlide === 0;
      if (lbNext) lbNext.disabled = lbSlide === N - 1;
      /* sync main browser bar counter */
      const mainCtr = document.getElementById('mainBrowserCounter');
      if (mainCtr) mainCtr.textContent = `▶ ${pad(lbSlide + 1)} / ${pad(N)}`;
    }

    function openLightbox(p, startSlide = 0) {
      if (!lbOverlay || !p.screens.length) return;
      lbProject = p;
      lbSlide = startSlide;
      if (lbProjName) lbProjName.textContent = p.name;

      /* build slides */
      buildLightboxSlides(p);

      /* build dots */
      if (lbDots) {
        lbDots.innerHTML = p.screens.map((_, i) =>
          `<button class="lb-dot${i === startSlide ? ' active' : ''}" data-idx="${i}" aria-label="Slide ${i + 1}"></button>`
        ).join('');
        lbDots.querySelectorAll('.lb-dot').forEach(d => {
          d.addEventListener('click', () => lbGoTo(+d.dataset.idx));
        });
      }

      lbOverlay.classList.add('open');
      lbOverlay.setAttribute('aria-hidden', 'false');
      lbGoTo(startSlide);
      lbOpen = true;
      stopTimer();
    }

    function closeLightbox() {
      if (!lbOverlay) return;
      lbOverlay.classList.remove('open');
      lbOverlay.setAttribute('aria-hidden', 'true');
      lbOpen = false;
      lbProject = null;
      startTimer();
    }

    /* Lightbox controls */
    if (lbClose) lbClose.addEventListener('click', closeLightbox);
    if (lbOverlay) lbOverlay.addEventListener('click', e => { if (e.target === lbOverlay) closeLightbox(); });
    if (lbPrev) lbPrev.addEventListener('click', () => lbGoTo(lbSlide - 1));
    if (lbNext) lbNext.addEventListener('click', () => lbGoTo(lbSlide + 1));

    /* Touch swipe support */
    if (lbViewport) {
      lbViewport.addEventListener('touchstart', e => { swipeStartX = e.touches[0].clientX; }, { passive: true });
      lbViewport.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - swipeStartX;
        if (Math.abs(dx) > 40) lbGoTo(dx < 0 ? lbSlide + 1 : lbSlide - 1);
      }, { passive: true });
    }

    /* ── Tooltip ── */
    function showTooltip(el, p) {
      if (!tooltip) return;
      const sc = p.screens[0];
      if (ttPreview) ttPreview.innerHTML = `<div style="height:70px">${screenHTML(sc)}</div>`;
      if (ttName) ttName.textContent = p.name;
      if (ttMeta) ttMeta.textContent = p.year + ' · ' + p.type;
      const rect = el.getBoundingClientRect();
      tooltip.style.top = rect.top + 'px';
      tooltip.style.left = rect.right + 8 + 'px';
      tooltip.classList.add('visible');
    }

    function hideTooltip() { if (tooltip) tooltip.classList.remove('visible'); }

    /* ── Intersection Observer (start timer when visible) ── */
    const swPanel = document.getElementById('swPanel');
    if (swPanel && 'IntersectionObserver' in window) {
      new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) startTimer(); else stopTimer();
      }, { threshold: 0.3 }).observe(swPanel);
    } else {
      startTimer();
    }

    /* ── Init ── */
    selectProject(0);

  })();

  /* ================================================
     17. MARQUEE PAUSE ON HOVER
  ================================================ */
  const marqueeStrip = document.querySelector('.marquee-strip');
  const marqueeTrackGroups = document.querySelectorAll('.marquee-group');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (marqueeStrip && marqueeTrackGroups.length && !reducedMotion) {
    marqueeStrip.addEventListener('mouseenter', () => {
      marqueeTrackGroups.forEach(g => { g.style.animationPlayState = 'paused'; });
    });
    marqueeStrip.addEventListener('mouseleave', () => {
      marqueeTrackGroups.forEach(g => { g.style.animationPlayState = 'running'; });
    });
    let mPaused = false;
    marqueeStrip.addEventListener('touchstart', () => {
      mPaused = !mPaused;
      marqueeTrackGroups.forEach(g => {
        g.style.animationPlayState = mPaused ? 'paused' : 'running';
      });
    }, { passive: true });
  }

}); // end DOMContentLoaded