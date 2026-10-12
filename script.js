/* ============================================
   Portfolio Site — Vanilla JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const contactForm = document.getElementById('contactForm');
  const yearSpan = document.getElementById('year');
  const heroTagline = document.getElementById('heroTagline');

  // ==========================================
  // Dynamic Year
  // ==========================================
  yearSpan.textContent = new Date().getFullYear();

  // ==========================================
  // Typing Effect for Hero Tagline
  // ==========================================
  const taglineText = "I turn ideas into clean, interactive web experiences.";
  let charIndex = 0;

  function typeTagline() {
    if (charIndex < taglineText.length) {
      heroTagline.textContent += taglineText.charAt(charIndex);
      charIndex++;
      setTimeout(typeTagline, 40);
    }
  }

  // Start typing after a short delay
  setTimeout(typeTagline, 600);

  // ==========================================
  // Mobile Navigation Toggle
  // ==========================================
  navToggle.addEventListener('click', () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', !isExpanded);
    navMenu.classList.toggle('is-open');
    document.body.style.overflow = !isExpanded ? 'hidden' : '';
  });

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.setAttribute('aria-expanded', 'false');
      navMenu.classList.remove('is-open');
      document.body.style.overflow = '';
    });
  });

  // ==========================================
  // Active Nav Link on Scroll
  // ==========================================
  const sections = document.querySelectorAll('section, header');

  function updateActiveLink() {
    let current = '';
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink();

  // ==========================================
  // Navbar background on scroll
  // ==========================================
  function handleNavbarScroll() {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll);

  // ==========================================
  // Intersection Observer — Reveal on Scroll
  // ==========================================
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        // Optionally unobserve after reveal:
        // revealObserver.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -50px 0px',
    threshold: 0.1
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ==========================================
  // Contact Form Validation & Submission
  // ==========================================
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contactName');
      const emailInput = document.getElementById('contactEmail');
      const messageInput = document.getElementById('contactMessage');
      const submitBtn = document.getElementById('submitBtn');
      const formSuccess = document.getElementById('formSuccess');
      const formErrorBanner = document.getElementById('formErrorBanner');
      const honeyInput = contactForm.querySelector('input[name="_honey"]');

      // Check honeypot (bots fill this field, humans do not)
      if (honeyInput && honeyInput.value.trim() !== '') {
        // Silently simulate success for bots
        contactForm.reset();
        if (formSuccess) formSuccess.classList.add('is-visible');
        return;
      }

      // Reset errors & status
      [nameInput, emailInput, messageInput].forEach(input => {
        if (input && input.parentElement) input.parentElement.classList.remove('error');
      });
      if (formSuccess) formSuccess.classList.remove('is-visible');
      if (formErrorBanner) formErrorBanner.style.display = 'none';

      let isValid = true;

      // Validate name
      if (!nameInput || nameInput.value.trim().length < 2) {
        if (nameInput && nameInput.parentElement) nameInput.parentElement.classList.add('error');
        isValid = false;
      }

      // Validate email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailInput || !emailRegex.test(emailInput.value.trim())) {
        if (emailInput && emailInput.parentElement) emailInput.parentElement.classList.add('error');
        isValid = false;
      }

      // Validate message
      if (!messageInput || messageInput.value.trim().length < 10) {
        if (messageInput && messageInput.parentElement) messageInput.parentElement.classList.add('error');
        isValid = false;
      }

      if (!isValid) return;

      // Indicate submission in progress
      const originalBtnText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          contactForm.reset();
          if (formSuccess) formSuccess.classList.add('is-visible');
        } else {
          throw new Error('Server returned ' + response.status);
        }
      } catch (err) {
        if (formErrorBanner) {
          formErrorBanner.style.display = 'block';
        } else {
          alert('Unable to send your message right now. Please reach out directly to peter.nonihub@gmail.com.');
        }
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  }

  // Real-time error clearing
  ['contactName', 'contactEmail', 'contactMessage'].forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener('input', () => {
      input.parentElement.classList.remove('error');
    });
  });
});