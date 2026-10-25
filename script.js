/**
 * ============================================================================
 * ISHU GAUTAM — PORTFOLIO JAVASCRIPT
 * Features:
 * - Fluid Data Pipeline Particle Canvas
 * - Dynamic Role Typing Effect
 * - Modern Dark / Light Mode Toggle (Modern Web Guidance compliant)
 * - Scroll Progress Indicator
 * - Smooth Cursor Glow Follower
 * - Mobile Navigation Menu with ARIA states
 * - ScrollSpy Active Link Tracking & Scroll Reveal
 * - Button Ripple Effects
 * - Form Validation & Submission Handler (:user-invalid sync)
 * - Back to Top Action & Dynamic Year
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. Dynamic Footer Year
  // --------------------------------------------------------------------------
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // --------------------------------------------------------------------------
  // 2. Dark / Light Theme Controller
  // --------------------------------------------------------------------------
  const themeToggle = document.getElementById('themeToggle');
  const colorSchemeMeta = document.querySelector('meta[name="color-scheme"]');

  const getPreferredTheme = () => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const applyTheme = (theme) => {
    document.body.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    if (colorSchemeMeta) {
      colorSchemeMeta.content = theme;
    }
    localStorage.setItem('theme', theme);
    if (themeToggle) {
      themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }
  };

  // Initialize theme
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.body.getAttribute('data-theme') || 'dark';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  }

  // Listen to OS theme changes if user hasn't explicitly set preference
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // --------------------------------------------------------------------------
  // 3. Scroll Progress Indicator & Navbar Blur on Scroll
  // --------------------------------------------------------------------------
  const scrollProgress = document.getElementById('scrollProgress');
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  const handleScroll = () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    if (scrollProgress) {
      scrollProgress.style.width = `${progress}%`;
    }

    if (navbar) {
      if (scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    if (backToTop) {
      if (scrollY > 400) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --------------------------------------------------------------------------
  // 4. Mobile Navigation Drawer
  // --------------------------------------------------------------------------
  const navBurger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');

  if (navBurger && navLinks) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !navLinks.classList.contains('open');
      navBurger.classList.toggle('open', isOpen);
      navLinks.classList.toggle('open', isOpen);
      navBurger.setAttribute('aria-expanded', String(isOpen));
    };

    navBurger.addEventListener('click', () => toggleMenu());

    // Close menu when clicking nav links
    navLinks.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !navbar.contains(e.target)) {
        toggleMenu(false);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 5. ScrollSpy (Active Section Link Highlighting)
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');
  const navLinkItems = document.querySelectorAll('.nav-link');

  const scrollSpyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinkItems.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  });

  sections.forEach((section) => scrollSpyObserver.observe(section));

  // --------------------------------------------------------------------------
  // 6. Typing Effect in Hero
  // --------------------------------------------------------------------------
  const typedRoleEl = document.getElementById('typedRole');
  if (typedRoleEl) {
    const roles = [
      'Aspiring Data Analyst',
      'BCA (AI & Data Science) Student',
      'Python & SQL Problem Solver',
      'Exploratory Data Analysis Enthusiast',
      'Dashboard & Insights Builder'
    ];

    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    const typeRole = () => {
      const currentRole = roles[roleIdx];

      if (isDeleting) {
        typedRoleEl.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
        typingSpeed = 45;
      } else {
        typedRoleEl.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
        typingSpeed = 90;
      }

      if (!isDeleting && charIdx === currentRole.length) {
        typingSpeed = 2200; // Pause at end of text
        isDeleting = true;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        typingSpeed = 400; // Pause before typing new word
      }

      setTimeout(typeRole, typingSpeed);
    };

    typeRole();
  }

  // --------------------------------------------------------------------------
  // 7. Cursor Glow Follower
  // --------------------------------------------------------------------------
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = -500;
    let mouseY = -500;
    let currentX = -500;
    let currentY = -500;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const animateCursor = () => {
      currentX += (mouseX - currentX) * 0.12;
      currentY += (mouseY - currentY) * 0.12;
      cursorGlow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(animateCursor);
    };

    animateCursor();
  } else if (cursorGlow) {
    cursorGlow.style.display = 'none';
  }

  // --------------------------------------------------------------------------
  // 8. Scroll Reveal Animations
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  });

  revealElements.forEach((el) => revealObserver.observe(el));

  // --------------------------------------------------------------------------
  // 9. Interactive Button Ripple Effect
  // --------------------------------------------------------------------------
  const rippleButtons = document.querySelectorAll('.ripple');
  rippleButtons.forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const circle = document.createElement('span');
      circle.classList.add('ripple-circle');
      const rect = this.getBoundingClientRect();
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;

      const existingRipple = this.querySelector('.ripple-circle');
      if (existingRipple) {
        existingRipple.remove();
      }

      this.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    });
  });

  // --------------------------------------------------------------------------
  // 10. Neural Data Pipeline Canvas Animation
  // --------------------------------------------------------------------------
  const canvas = document.getElementById('pipelineCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let particles = [];
    let animationId = null;
    let isTabVisible = true;

    const resizeCanvas = () => {
      width = canvas.parentElement.offsetWidth || window.innerWidth;
      height = canvas.parentElement.offsetHeight || window.innerHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      initParticles();
    };

    const initParticles = () => {
      particles = [];
      const count = Math.min(Math.floor((width * height) / 14000), 55);
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.65,
          vy: (Math.random() - 0.5) * 0.65,
          radius: Math.random() * 2.5 + 1.2,
          color: Math.random() > 0.5 ? '#38bdf8' : '#818cf8'
        });
      }
    };

    // Mouse interaction with particles
    let mouse = { x: null, y: null, radius: 140 };
    const heroSection = document.getElementById('home');
    if (heroSection) {
      heroSection.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
      });
      heroSection.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
      });
    }

    const drawParticles = () => {
      if (!isTabVisible) return;
      ctx.clearRect(0, 0, width, height);

      const isDark = document.body.getAttribute('data-theme') !== 'light';
      const lineColor = isDark ? 'rgba(56, 189, 248, 0.12)' : 'rgba(99, 102, 241, 0.1)';

      // Draw connecting lines between particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < 130) {
            ctx.beginPath();
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 1 - dist / 130;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw dynamic mouse links & apply repulsion
      if (mouse.x !== null && mouse.y !== null) {
        particles.forEach((p) => {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius && dist > 0) {
            ctx.beginPath();
            ctx.strokeStyle = isDark
              ? `rgba(56, 189, 248, ${0.45 * (1 - dist / mouse.radius)})`
              : `rgba(99, 102, 241, ${0.4 * (1 - dist / mouse.radius)})`;
            ctx.lineWidth = 1.2;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();

            // Repulsion physics
            const force = (mouse.radius - dist) / mouse.radius;
            p.x -= (dx / dist) * force * 1.5;
            p.y -= (dy / dist) * force * 1.5;
          }
        });
      }

      // Draw particle nodes
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationId = requestAnimationFrame(drawParticles);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    drawParticles();

    document.addEventListener('visibilitychange', () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        drawParticles();
      } else if (animationId) {
        cancelAnimationFrame(animationId);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 11. Accessible Form Interaction & Submission
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  const submitBtn = document.getElementById('formSubmitBtn');

  // Modern Web Guidance: Sync aria-invalid with CSS :user-invalid state
  const syncAria = (el) => {
    if (el && typeof el.matches === 'function') {
      el.setAttribute('aria-invalid', el.matches(':user-invalid') ? 'true' : 'false');
    }
  };

  document.addEventListener('blur', (e) => syncAria(e.target), true);
  document.addEventListener('input', (e) => {
    if (e.target.hasAttribute && e.target.hasAttribute('aria-invalid')) {
      syncAria(e.target);
    }
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const originalBtnText = submitBtn ? submitBtn.innerHTML : 'Send Message';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="btn-label">Sending...</span>';
      }

      if (formStatus) {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
      }

      // Simulate sending or trigger EmailJS if configured
      setTimeout(() => {
        if (formStatus) {
          formStatus.textContent = '✓ Thank you! Your message has been received. Ishu will get back to you shortly.';
          formStatus.className = 'form-status success';
        }
        contactForm.reset();
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }

        setTimeout(() => {
          if (formStatus) {
            formStatus.textContent = '';
            formStatus.className = 'form-status';
          }
        }, 6000);
      }, 900);
    });
  }

  // --------------------------------------------------------------------------
  // 12. 3D Card Perspective Tilt & Dynamic Glare
  // --------------------------------------------------------------------------
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;

  if (!prefersReducedMotion && isFinePointer) {
    const tiltCards = document.querySelectorAll('.glass-card');

    tiltCards.forEach((card) => {
      // Ensure glare overlay exists
      if (!card.querySelector('.card-glare')) {
        const glare = document.createElement('div');
        glare.className = 'card-glare';
        card.appendChild(glare);
      }

      let rect = null;

      card.addEventListener('mouseenter', () => {
        rect = card.getBoundingClientRect();
        card.style.transition = 'transform 0.15s ease-out, box-shadow 0.3s ease';
      });

      card.addEventListener('mousemove', (e) => {
        if (!rect) rect = card.getBoundingClientRect();
        const clientX = e.clientX;
        const clientY = e.clientY;

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        const percentX = (x / rect.width) * 100;
        const percentY = (y / rect.height) * 100;

        card.style.setProperty('--mouse-x', `${percentX}%`);
        card.style.setProperty('--mouse-y', `${percentY}%`);

        // Subtle Apple-like tilt (max ~7 degrees)
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateY = ((x - centerX) / centerX) * 6.5;
        const rotateX = -((y - centerY) / centerY) * 6.5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-5px)`;
      });

      card.addEventListener('mouseleave', () => {
        rect = null;
        card.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.5s ease';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    });
  }

  // --------------------------------------------------------------------------
  // 13. Animated Stat Numbers Count-Up
  // --------------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length > 0) {
    const animateCount = (el) => {
      const target = parseInt(el.getAttribute('data-target'), 10);
      if (isNaN(target)) return;

      const duration = 1800; // ms
      const startTime = performance.now();
      const startVal = 0;

      const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic: 1 - Math.pow(1 - progress, 3)
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const currentVal = Math.floor(startVal + (target - startVal) * easeOut);

        el.textContent = currentVal.toLocaleString();

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toLocaleString();
        }
      };

      requestAnimationFrame(step);
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          statNumbers.forEach((num) => animateCount(num));
          observer.disconnect();
        }
      });
    }, { threshold: 0.35 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
      statsObserver.observe(heroStats);
    }
  }

  // --------------------------------------------------------------------------
  // 14. Magnetic Micro-interactions
  // --------------------------------------------------------------------------
  if (!prefersReducedMotion && isFinePointer) {
    const magneticElements = document.querySelectorAll('.btn-primary, .theme-toggle, .social-icon');

    magneticElements.forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);

        el.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
      });

      el.addEventListener('mouseleave', () => {
        el.style.transition = 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)';
        el.style.transform = 'translate(0px, 0px)';
        setTimeout(() => {
          el.style.transition = '';
        }, 400);
      });
    });
  }

  // --------------------------------------------------------------------------
  // 15. Resume Frame Tab Toggle (Preview Image vs PDF Embed)
  // --------------------------------------------------------------------------
  const tabPreviewBtn = document.getElementById('tabPreviewBtn');
  const tabPdfBtn = document.getElementById('tabPdfBtn');
  const resumePreviewPane = document.getElementById('resumePreviewPane');
  const resumePdfPane = document.getElementById('resumePdfPane');

  if (tabPreviewBtn && tabPdfBtn && resumePreviewPane && resumePdfPane) {
    tabPreviewBtn.addEventListener('click', () => {
      tabPreviewBtn.classList.add('active');
      tabPreviewBtn.setAttribute('aria-pressed', 'true');
      tabPdfBtn.classList.remove('active');
      tabPdfBtn.setAttribute('aria-pressed', 'false');
      resumePreviewPane.style.display = 'flex';
      resumePdfPane.style.display = 'none';
    });

    tabPdfBtn.addEventListener('click', () => {
      tabPdfBtn.classList.add('active');
      tabPdfBtn.setAttribute('aria-pressed', 'true');
      tabPreviewBtn.classList.remove('active');
      tabPreviewBtn.setAttribute('aria-pressed', 'false');
      resumePreviewPane.style.display = 'none';
      resumePdfPane.style.display = 'block';
    });
  }
});
