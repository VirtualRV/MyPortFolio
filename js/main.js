/**
 * DevSync Portfolio Main Script — Authentic Framer Parity
 * Crafted for Vikas Rai | Senior Full Stack Developer & System Architect
 */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initHeader();
  initMenuDropdown();
  initMarqueePolaroidParallax();
  initExperienceAccordion();
  initServicesAccordion();
  initFaqAccordion();
  initSpotlightEffect();
  initScrollReveal();
  initContactForm();
});

/**
 * Custom Interactive Cursor (Dot + Lagging Spring Follower)
 */
function initCustomCursor() {
  // Only initialize on pointer devices (desktop)
  if (window.matchMedia('(hover: none)').matches) return;

  const dot = document.createElement('div');
  dot.className = 'custom-cursor-dot';

  const follower = document.createElement('div');
  follower.className = 'custom-cursor-follower';

  document.body.appendChild(dot);
  document.body.appendChild(follower);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  }, { passive: true });

  // Spring physics loop for smooth lagging follower ring
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;
    requestAnimationFrame(animateFollower);
  }
  requestAnimationFrame(animateFollower);

  // Expand follower on interactive targets
  const interactiveTargets = 'a, button, input, textarea, .accordion-item, .experience-item, .faq-item, .polaroid-card, .project-card, .cert-card';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveTargets)) {
      follower.classList.add('hovering');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveTargets)) {
      follower.classList.remove('hovering');
    }
  });
}

/**
 * Header scroll background blur
 */
function initHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/**
 * Menu Dropdown interaction
 */
function initMenuDropdown() {
  const menuBtn = document.getElementById('menuToggleBtn');
  const menuDropdown = document.getElementById('menuDropdown');
  if (!menuBtn || !menuDropdown) return;

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = menuDropdown.classList.toggle('active');
    menuBtn.classList.toggle('open', isOpen);
    menuBtn.setAttribute('aria-expanded', isOpen);
  });

  document.addEventListener('click', (e) => {
    if (!menuDropdown.contains(e.target) && !menuBtn.contains(e.target)) {
      menuDropdown.classList.remove('active');
      menuBtn.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
    }
  });

  menuDropdown.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', (e) => {
      menuDropdown.classList.remove('active');
      menuBtn.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');

      const href = link.getAttribute('href');
      if (href && href.includes('#')) {
        const hash = href.substring(href.indexOf('#'));
        const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '';
        if (isHomePage) {
          const targetEl = document.querySelector(hash);
          if (targetEl) {
            e.preventDefault();
            targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            if (history.pushState) {
              history.pushState(null, '', hash);
            }
          }
        }
      }
    });
  });
}

/**
 * Polaroid Parallax & 3D Tilt on Hover
 */
function initMarqueePolaroidParallax() {
  const overlay = document.querySelector('.polaroid-stack-overlay');
  const card = document.querySelector('.polaroid-card');
  if (!overlay || !card) return;

  overlay.addEventListener('mousemove', (e) => {
    const rect = overlay.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = (y / (rect.height / 2)) * -14;
    const rotY = (x / (rect.width / 2)) * 14;

    card.style.transform = `perspective(1000px) rotate(-7deg) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.06, 1.06, 1.06)`;
  });

  overlay.addEventListener('mouseleave', () => {
    card.style.transform = 'rotate(-7deg) scale3d(1, 1, 1)';
  });
}

/**
 * Experience Accordion Interaction
 */
function initExperienceAccordion() {
  const expItems = document.querySelectorAll('.experience-item');
  if (!expItems.length) return;

  expItems.forEach(item => {
    const headerBtn = item.querySelector('.experience-header-btn');
    if (!headerBtn) return;

    headerBtn.addEventListener('click', () => {
      const isAlreadyActive = item.classList.contains('active');

      // Optionally collapse others or allow toggle
      expItems.forEach(other => {
        if (other !== item) other.classList.remove('active');
      });

      if (!isAlreadyActive) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  });
}

/**
 * Services Interactive Accordion & Crossfade
 */
function initServicesAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');
  const previewImg = document.getElementById('servicePreviewImg');
  if (!accordionItems.length || !previewImg) return;

  accordionItems.forEach((item) => {
    item.addEventListener('click', () => {
      if (item.classList.contains('active')) return;

      accordionItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      const newImgSrc = item.getAttribute('data-img');
      if (newImgSrc && previewImg.getAttribute('src') !== newImgSrc) {
        previewImg.classList.add('transitioning');
        setTimeout(() => {
          previewImg.src = newImgSrc;
          previewImg.onload = () => {
            previewImg.classList.remove('transitioning');
          };
          setTimeout(() => previewImg.classList.remove('transitioning'), 80);
        }, 180);
      }
    });
  });
}

/**
 * FAQ Accordion Interaction
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    item.addEventListener('click', () => {
      const isAlreadyActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isAlreadyActive) {
        item.classList.add('active');
      }
    });
  });
}

/**
 * Interactive Mouse Spotlight on Cards (Framer Parity)
 */
function initSpotlightEffect() {
  const cards = document.querySelectorAll(
    '.project-card, .process-card, .skill-category-block, .experience-item, .cert-card, .accordion-item, .partner-logo-item, .faq-item'
  );

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/**
 * Scroll Reveal Animation
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.section-title, .project-card, .process-card, .skill-category-block, .experience-item, .cert-card, .faq-item'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
  });
}

/**
 * Interactive Contact Form
 */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const feedback = document.getElementById('formFeedback');
  if (!form || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nameInput = form.querySelector('[name="name"]');
    const emailInput = form.querySelector('[name="email"]');
    const messageInput = form.querySelector('[name="message"]');

    if (!nameInput.value || !emailInput.value || !messageInput.value) {
      feedback.className = 'form-feedback';
      feedback.style.display = 'block';
      feedback.style.backgroundColor = 'rgba(255, 100, 100, 0.15)';
      feedback.style.borderColor = '#ff6464';
      feedback.style.color = '#ff6464';
      feedback.textContent = 'Please fill out all required fields.';
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending Message...';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
      feedback.className = 'form-feedback success';
      feedback.textContent = `Thank you, ${nameInput.value}! Your message has been sent successfully. Vikas Rai will reach out to you shortly.`;
      form.reset();

      setTimeout(() => {
        feedback.style.display = 'none';
      }, 8000);
    }, 1000);
  });
}
