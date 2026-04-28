
let mainSeed = 12345;
function mainRandom() {
  mainSeed = (mainSeed * 9301 + 49297) % 233280;
  return mainSeed / 233280;
}
  /**
 * Rybezh Site - Main JavaScript
 * Features: i18n, Cookie Banner, Dark Theme, Scroll to Top, Animations
 */

(function() {
  'use strict';

  const GSA_URL = 'https://script.google.com/macros/s/AKfycbyZIupzVZo3q5UDGVSBzEaw1vdKFJcaEyTh5iuMgBECdd7VWE4Hq7cZ1WNL6V6Jy1FdMg/exec';
  const GEO_URL = 'https://ipapi.co/json/';

  // ============================================
  // 1. TRANSLATIONS (i18n)
  // ============================================

  // Get current language

  function getLang() {
    const p = window.location.pathname;
    if (p.endsWith('-pl.html')) return 'pl';
    if (p.endsWith('-ru.html')) return 'ru';
    if (p.endsWith('-en.html')) return 'en';
    return 'ua';
  }





  function initCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept-btn');
    
    if (!banner) return;

    // Check if already accepted
    if (localStorage.getItem('cookiesAccepted') === 'true' || localStorage.getItem('cookie_accepted') === 'true') {
      banner.hidden = true;
      return;
    }

    // Show banner
    banner.hidden = false;

    // Accept cookies
    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookiesAccepted', 'true');
        localStorage.setItem('cookie_accepted', 'true');
        banner.hidden = true;
        banner.style.animation = 'slideDown 0.3s ease-out';
      });
    }
  }

  // ============================================
  // 3. DARK THEME
  // ============================================
  function initTheme() {
    // Create theme toggle button if not exists
    let themeBtn = document.getElementById('theme-toggle');
    if (!themeBtn) {
      themeBtn = document.createElement('button');
      themeBtn.id = 'theme-toggle';
      themeBtn.className = 'theme-toggle';
      themeBtn.setAttribute('aria-label', 'Toggle theme');
      themeBtn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
      
      // Insert after language buttons
      const headerLang = document.querySelector('.header-lang');
      if (headerLang) {
        headerLang.parentNode.insertBefore(themeBtn, headerLang.nextSibling);
      }
    }

    // Get saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    // Toggle theme
    themeBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    const btn = document.getElementById('theme-toggle');
    if (!btn) return;
    
    if (theme === 'dark') {
      btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    } else {
      btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
    }
  }

  // ============================================
  // 4. SCROLL TO TOP BUTTON
  // ============================================
  function initScrollToTop() {
    // Create button
    const scrollBtn = document.createElement('button');
    scrollBtn.id = 'scroll-top';
    scrollBtn.className = 'scroll-top-btn';
    scrollBtn.setAttribute('aria-label', 'Scroll to top');
    scrollBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>';
    document.body.appendChild(scrollBtn);

    // Show/hide on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    });

    // Scroll to top on click
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ============================================
  // 5. SCROLL ANIMATIONS
  // ============================================
  function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.job-card, .apply-card, .card, .blog-card');
    
    if (!('IntersectionObserver' in window)) {
      animatedElements.forEach(el => {
        el.classList.remove('animate-ready');
        el.classList.add('animate-in');
      });
      // Also handle fade-in elements
      document.querySelectorAll('.fade-in').forEach(el => el.classList.add('is-visible'));
      return;
    }

    if (animatedElements.length) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

      animatedElements.forEach(el => {
        el.classList.add('animate-ready');
        observer.observe(el);
      });
    }

    // Fade-in observer for homepage sections
    const fadeEls = document.querySelectorAll('.fade-in');
    if (fadeEls.length) {
      const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
      fadeEls.forEach(el => fadeObserver.observe(el));
    }
  }

  // ============================================
  // 6. SMOOTH SCROLL FOR ANCHOR LINKS
  // ============================================
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ============================================
  // 7. MOBILE MENU IMPROVEMENTS
  // ============================================
  function initMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileToggle = document.querySelector('.mobile-toggle');
    
    if (!mobileMenu || !mobileToggle) return;

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (mobileMenu.classList.contains('is-open') && 
          !mobileMenu.contains(e.target) && 
          !mobileToggle.contains(e.target)) {
        mobileMenu.classList.remove('is-open');
      }
    });

    // Close menu when clicking a link
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('is-open');
      });
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        mobileMenu.classList.remove('is-open');
      }
    });
  }

  // ============================================
  // 8. FORM ENHANCEMENTS
  // ============================================
  function initFormEnhancements() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
      // Real-time validation
      form.querySelectorAll('input[required], textarea[required]').forEach(input => {
        input.addEventListener('blur', () => {
          validateField(input);
        });
        
        input.addEventListener('input', () => {
          if (input.classList.contains('error')) {
            validateField(input);
          }
        });
      });
    });
  }

  function validateField(field) {
    const isValid = field.checkValidity();
    field.classList.toggle('error', !isValid);
    field.classList.toggle('valid', isValid && field.value.trim() !== '');
    return isValid;
  }

  // ============================================
  // 9. LOADING STATE
  // ============================================
  function initPageLoad() {
    document.body.classList.add('loaded');
  }

  // ============================================
  // 10. TELEGRAM LINK TRACKING
  // ============================================
  function initTelegramTracking() {
    document.querySelectorAll('a[href*="t.me"]').forEach(link => {
      link.addEventListener('click', () => {
        if (typeof gtag === 'function') {
          gtag('event', 'click', {
            'event_category': 'outbound',
            'event_label': 'telegram',
            'transport_type': 'beacon'
          });
        }
      });
    });
  }

  // ============================================
  // 13. EARNINGS CALCULATOR (Extended)
  // ============================================
  function initCalculator() {
    const hInput = document.getElementById('calc-hours');
    const rInput = document.getElementById('calc-rate');
    const hVal = document.getElementById('val-hours');
    const rVal = document.getElementById('val-rate');
    const totalEarn = document.getElementById('total-earn');
    const totalTax = document.getElementById('total-tax');
    const totalNet = document.getElementById('total-net');

    if (!hInput || !rInput || !hVal || !rVal || !totalEarn) return;

    const fmt = (n) => Math.round(n).toLocaleString('pl-PL');

    const calc = () => {
      const h = Number(hInput.value || 0);
      const r = Number(rInput.value || 0);
      hVal.textContent = String(h);
      rVal.textContent = String(r);
      const gross = h * r * (52 / 12); // avg weeks per month

      // Get contract type
      const contractEl = document.querySelector('input[name="contract"]:checked');
      const contract = contractEl ? contractEl.value : 'zlecenie';

      let tax = 0;
      if (contract === 'zlecenie') {
        // ~13.5% tax for zlecenie (simplified)
        tax = gross * 0.135;
      } else if (contract === 'uop') {
        // ~23% for UoP (ZUS + tax)
        tax = gross * 0.23;
      } else if (contract === 'b2b') {
        // ~19% flat + ZUS ~1400
        tax = gross * 0.19;
        if (gross > 2000) tax = Math.max(tax, 1400);
      }

      const net = gross - tax;

      totalEarn.textContent = fmt(gross);
      if (totalTax) totalTax.textContent = fmt(tax);
      if (totalNet) totalNet.textContent = fmt(net);
    };

    hInput.addEventListener('input', calc);
    rInput.addEventListener('input', calc);

    // Contract type radio listeners
    document.querySelectorAll('input[name="contract"]').forEach(radio => {
      radio.addEventListener('change', calc);
    });

    calc();
  }

  // ============================================
  // 11. DATE FORMATTING
  // ============================================
  function initDateFormatting() {
    const lang = getLang();
    const locale = lang === 'pl' ? 'pl-PL' : (lang === 'ru' ? 'ru-RU' : 'uk-UA');
    
    document.querySelectorAll('[data-format-date]').forEach(el => {
      const dateStr = el.getAttribute('data-format-date');
      if (!dateStr) return;
      
      try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return;
        
        const formatted = date.toLocaleDateString(locale, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        
        el.textContent = formatted;
      } catch (e) {
        console.warn('Date formatting failed:', e);
      }
    });
  }

  function initImageFallbacks() {
    const fallbackSrc = '/og-image.svg';
    const IMAGE_LOAD_TIMEOUT_MS = 1200;
    document.querySelectorAll('img').forEach((img) => {
      if (img.dataset.fallbackInit === '1') return;
      img.dataset.fallbackInit = '1';
      const applyFallback = function() {
        if (this.getAttribute('src') === fallbackSrc) return;
        this.onerror = null;
        this.src = fallbackSrc;
      };
      let delayedCheckId = null;
      const clearDelayedCheck = () => {
        if (delayedCheckId) {
          clearTimeout(delayedCheckId);
          delayedCheckId = null;
        }
      };
      img.addEventListener('error', function() {
        clearDelayedCheck();
        applyFallback.call(this);
      });
      img.addEventListener('load', clearDelayedCheck);
      if (img.complete && !img.naturalWidth) {
        applyFallback.call(img);
      } else {
        delayedCheckId = setTimeout(() => {
          if (img.complete && !img.naturalWidth) {
            applyFallback.call(img);
          }
          delayedCheckId = null;
        }, IMAGE_LOAD_TIMEOUT_MS);
      }
    });
  }

  // ============================================
  // 12. NEWSLETTER FORM
  // ============================================
  function initNewsletter() {
    document.querySelectorAll('.footer-newsletter-form').forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('button');
        const input = form.querySelector('input');
        const email = input.value.trim();
        if (!email) return;

        const originalContent = btn.innerHTML;
        
        btn.disabled = true;
        btn.innerHTML = '<div class="spinner" style="width:16px;height:16px;border-width:2px"></div>';
        
        try {
          let city = '';
          try {
            const geoRes = await fetch(GEO_URL, { cache: 'no-store' });
            if (geoRes.ok) {
              const geo = await geoRes.json();
              city = geo && geo.city ? String(geo.city) : '';
            }
          } catch (geoErr) {
            console.warn('Geo lookup failed', geoErr);
          }

          const formData = new FormData();
          formData.append('contact', email);
          formData.append('start', new Date().toISOString());
          formData.append('city', city);
          formData.append('message', 'suscription');
          formData.append('type', 'newsletter');
          formData.append('ts', new Date().toISOString());

          await fetch(GSA_URL, { method: 'POST', mode: 'no-cors', body: formData });

          btn.innerHTML = '✓';
          input.value = '';
          input.placeholder = translations['footer.newsletter.success'][getLang()] || 'Thanks!';
        } catch (err) {
          console.error(err);
          btn.innerHTML = '✕';
        } finally {
          setTimeout(() => {
            btn.disabled = false;
            btn.innerHTML = originalContent;
            input.placeholder = translations['footer.newsletter.placeholder'][getLang()] || 'Email';
          }, 3000);
        }
      });
    });
  }

  // ============================================
  // 12. RENT FORM
  // ============================================
  function initRentForm() {
    const form = document.getElementById('rent-form');
    if (!form) return;

    // Use the specific endpoint for the rent form as requested
    const RENT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxRfKEqTZEYfoAssL_0SuhgijULCRKwPlwqYQCn28mm_F1GR6KACFUAdhWXQWlI3Uwj/exec';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nameInput = form.querySelector('#rentName');
      const phoneInput = form.querySelector('#rentPhone');
      const vehicleSelect = form.querySelector('#rentVehicle');
      const status = document.getElementById('rent-form-msg');
      const button = form.querySelector('button[type="submit"]');

      const name = nameInput ? nameInput.value.trim() : '';
      const phone = phoneInput ? phoneInput.value.trim() : '';
      const vehicle = vehicleSelect ? vehicleSelect.value : '';
      const currentLang = getLang();

      if (!name || !phone || !vehicle) {
        if (status) {
          status.style.color = '#ef4444';
          status.textContent = currentLang === 'pl' ? 'Uzupełnij wszystkie pola.' : (currentLang === 'ru' ? 'Заполните все поля.' : 'Заповніть усі поля.');
        }
        return;
      }

      if (button) button.disabled = true;
      if (status) {
        status.style.color = '#64748b';
        status.textContent = currentLang === 'pl' ? 'Wysyłanie...' : (currentLang === 'ru' ? 'Отправляем...' : 'Надсилаємо...');
      }

      try {
        const payload = {
          name: name,
          phone: phone,
          transport: vehicle
        };

        // Fetch requires no-cors for unauthenticated Google Apps Script web apps POSTs
        await fetch(RENT_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });

        if (status) {
          status.style.color = '#10b981';
          status.textContent = currentLang === 'pl' ? 'Dziękujemy! Skontaktujemy się wkrótce.' : (currentLang === 'ru' ? 'Спасибо! Ваша заявка принята.' : 'Дякуємо! Ваша заявка прийнята.');
        }
        form.reset();
      } catch (err) {
        console.error(err);
        if (status) {
          status.style.color = '#ef4444';
          status.textContent = currentLang === 'pl' ? 'Błąd wysyłki. Spróbuj ponownie.' : (currentLang === 'ru' ? 'Ошибка отправки. Попробуйте ещё раз.' : 'Помилка відправки. Спробуйте ще раз.');
        }
      } finally {
        if (button) button.disabled = false;
      }
    });
  }

  // ============================================
  // 13. CONTACT FORM
  // ============================================
  function initContactForm() {
    const forms = document.querySelectorAll('.js-contact-form');
    if (!forms.length) return;

    forms.forEach(form => {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const nameInput = form.querySelector('[name="name"]');
        const contactInput = form.querySelector('[name="contact"]');
        const messageInput = form.querySelector('[name="message"]');
        const status = form.querySelector('.form-message');
        const button = form.querySelector('button[type="submit"]');

        const name = nameInput ? nameInput.value.trim() : '';
        const contact = contactInput ? contactInput.value.trim() : '';
        const message = messageInput ? messageInput.value.trim() : '';
        const currentLang = getLang();

        if (!name || !contact) {
          if (status) status.textContent = currentLang === 'pl' ? 'Uzupełnij imię i kontakt.' : (currentLang === 'ru' ? 'Заполните имя и контакт.' : 'Заповніть імʼя та контакт.');
          return;
        }

        if (button) button.disabled = true;
        if (status) status.textContent = currentLang === 'pl' ? 'Wysyłanie...' : (currentLang === 'ru' ? 'Отправляем...' : 'Надсилаємо...');

        try {
          let city = '';
          try {
            const geoRes = await fetch(GEO_URL, { cache: 'no-store' });
            if (geoRes.ok) {
              const geo = await geoRes.json();
              city = geo && geo.city ? String(geo.city) : '';
            }
          } catch (geoErr) {
            console.warn('Geo lookup failed', geoErr);
          }

          const formData = new FormData();
          formData.append('name', name);
          formData.append('contact', contact);
          formData.append('message', message || '-');
          formData.append('type', 'contact');
          formData.append('city', city);
          formData.append('page', window.location.href);
          formData.append('lang', currentLang);
          formData.append('ts', new Date().toISOString());

          await fetch(GSA_URL, { method: 'POST', mode: 'no-cors', body: formData });

          if (status) status.textContent = currentLang === 'pl' ? 'Dziękujemy! Skontaktujemy się wkrótce.' : (currentLang === 'ru' ? 'Спасибо! Мы свяжемся с вами в ближайшее время.' : 'Дякуємо! Ми відповімо найближчим часом.');
          if (nameInput) nameInput.value = '';
          if (contactInput) contactInput.value = '';
          if (messageInput) messageInput.value = '';
        } catch (err) {
          console.error(err);
          if (status) status.textContent = currentLang === 'pl' ? 'Błąd wysyłki. Spróbuj ponownie.' : (currentLang === 'ru' ? 'Ошибка отправки. Попробуйте ещё раз.' : 'Помилка відправки. Спробуйте ще раз.');
        } finally {
          if (button) button.disabled = false;
        }
      });
    });
  }

  // ============================================
  // 13. COMMENT THREADS (BLOG POSTS)
  // ============================================

  // ============================================
  // 14. LIVE ACTIVITY (BLOG POSTS)
  // ============================================
  function initLiveActivity() {
    const activity = document.querySelector('.js-live-activity');
    const toastStack = document.querySelector('.js-live-toasts');
    if (!activity || !toastStack) return;

    const labels = {
      ua: {
        statusPool: [
          'Користувач з Польщі читає цю сторінку',
          'Хтось з Кракова переглядає статтю',
          'Читач з Лодзі щойно відкрив пост',
          'Хтось з Вроцлава зберіг вакансію'
        ],
        toastPool: [
          'Хтось завантажив шаблон CV 2 хв тому',
          'Новий коментар від Марини • 3 хв тому',
          'Користувач з Гданська зберіг статтю',
          'Запит на консультацію • щойно'
        ]
      },
      pl: {
        statusPool: [
          'Użytkownik z Polski czyta tę stronę',
          'Ktoś z Krakowa właśnie otworzył artykuł',
          'Czytelnik z Łodzi przegląda post',
          'Ktoś z Wrocławia zapisał ofertę'
        ],
        toastPool: [
          'Ktoś pobrał szablon CV 2 min temu',
          'Nowy komentarz od Mariny • 3 min temu',
          'Użytkownik z Gdańska zapisał artykuł',
          'Zapytanie o konsultację • przed chwilą'
        ]
      }
    };

    const setLabels = () => {
      const lang = getLang();
      const labelEl = activity.querySelector('.live-label');
      const suffixEl = activity.querySelector('.live-suffix');
      const label = activity.getAttribute(`data-label-${lang}`) || activity.getAttribute('data-label-ua') || '';
      const suffix = activity.getAttribute(`data-suffix-${lang}`) || activity.getAttribute('data-suffix-ua') || '';
      if (labelEl) labelEl.textContent = label;
      if (suffixEl) suffixEl.textContent = suffix;
    };

    const countEl = activity.querySelector('[data-live-count]');
    const statusEl = activity.querySelector('[data-live-status]');

    const updateCount = () => {
      const base = 14 + Math.floor(mainRandom() * 38);
      if (countEl) countEl.textContent = String(base);
    };

    const updateStatus = () => {
      const lang = getLang();
      const pool = (labels[lang] || labels.ua).statusPool;
      if (statusEl) statusEl.textContent = pool[Math.floor(mainRandom() * pool.length)];
    };

    const pushToast = () => {
      const lang = getLang();
      const pool = (labels[lang] || labels.ua).toastPool;
      const toast = document.createElement('div');
      toast.className = 'live-toast';
      toast.textContent = pool[Math.floor(mainRandom() * pool.length)];
      toastStack.appendChild(toast);
      setTimeout(() => toast.classList.add('visible'), 50);
      setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 600);
      }, 5200);
    };

    setLabels();
    updateCount();
    updateStatus();
    pushToast();

    const statusTimer = setInterval(updateStatus, 9000 + mainRandom() * 7000);
    const countTimer = setInterval(updateCount, 12000 + mainRandom() * 9000);
    const toastTimer = setInterval(pushToast, 14000 + mainRandom() * 10000);

    window.addEventListener('languageChanged', () => {
      setLabels();
      updateStatus();
    });

    window.addEventListener('beforeunload', () => {
      clearInterval(statusTimer);
      clearInterval(countTimer);
      clearInterval(toastTimer);
    });
  }

  // ============================================
  // INITIALIZE ALL
  // ============================================
  function init() {

    initCookieBanner();
    initTheme();
    initScrollToTop();
    initScrollAnimations();
    initSmoothScroll();
    initMobileMenu();
    initFormEnhancements();
    initPageLoad();
    initTelegramTracking();
    initDateFormatting();
    initImageFallbacks();
    initNewsletter();
    initContactForm();
    initRentForm();
    initCalculator();

    // Disabled: synthetic "live activity" widget can look deceptive to users/search engines.
    // initLiveActivity();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose to global scope
  window.applyTranslations = applyTranslations;
  window.initDateFormatting = initDateFormatting;


})();

// --- Floating Chatbot Initialization ---
document.addEventListener('DOMContentLoaded', () => {
  const apiKey = 'AIzaSyBoYwebJJvyB6MHzieLzBaXrOkggnsipX8';
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent`;

  // Create UI Container
  const container = document.createElement('div');
  container.id = 'chatbot-container';

  // Create FAB
  const fab = document.createElement('button');
  fab.id = 'chatbot-fab';
  fab.setAttribute('aria-label', 'Chat with AI');
  fab.innerHTML = `<svg viewBox="0 0 24 24"><path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>`;
  container.appendChild(fab);

  // Create Chat Window
  const chatWindow = document.createElement('div');
  chatWindow.id = 'chatbot-window';

  const header = document.createElement('div');
  header.id = 'chatbot-header';
  header.innerHTML = `<span>AI Assistant</span><button id="chatbot-close" aria-label="Close">&times;</button>`;
  chatWindow.appendChild(header);

  const messagesArea = document.createElement('div');
  messagesArea.id = 'chatbot-messages';
  chatWindow.appendChild(messagesArea);

  const inputArea = document.createElement('div');
  inputArea.id = 'chatbot-input-area';

  const inputField = document.createElement('input');
  inputField.id = 'chatbot-input';
  inputField.type = 'text';
  inputField.placeholder = 'Type a message...';

  const sendButton = document.createElement('button');
  sendButton.id = 'chatbot-send';
  sendButton.textContent = 'Send';

  inputArea.appendChild(inputField);
  inputArea.appendChild(sendButton);
  chatWindow.appendChild(inputArea);

  container.appendChild(chatWindow);
  document.body.appendChild(container);

  // Toggle Chat Window
  fab.addEventListener('click', () => {
    chatWindow.classList.toggle('is-open');
    if (chatWindow.classList.contains('is-open')) {
      inputField.focus();
    }
  });

  document.getElementById('chatbot-close').addEventListener('click', () => {
    chatWindow.classList.remove('is-open');
  });

  // Append message to UI
  function appendMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chatbot-message ${sender}`;
    msgDiv.textContent = text;
    messagesArea.appendChild(msgDiv);
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }

  // Handle Send
  async function sendMessage() {
    const text = inputField.value.trim();
    if (!text) return;

    appendMessage(text, 'user');
    inputField.value = '';
    sendButton.disabled = true;

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': apiKey
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: text }] }]
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      const botText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that.";
      appendMessage(botText, 'bot');
    } catch (err) {
      console.error('Chatbot API Error:', err);
      appendMessage("Error communicating with AI. Please try again later.", 'bot');
    } finally {
      sendButton.disabled = false;
      inputField.focus();
    }
  }

  sendButton.addEventListener('click', sendMessage);
  inputField.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
  });
});
