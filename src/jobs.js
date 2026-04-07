/**
 * Jobs & Categories Logic for Rybezh Universal Job Portal
 */

(function() {
  'use strict';

  const SUPABASE_URL = 'https://ubygfyksalvwsprvetoc.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_koJjEYMWzvwDNCzp9T7ZeA_2E1kusfD';
  const PROOF_MIN_SCORE = 70;
  const PROOF_MAX_SCORE = 95;
  let proofAggregatesPromise = null;

  // Detect PL page from URL
  function isPlPage() {
    return window.location.pathname.endsWith('-pl.html');
  }
  function isRuPage() {
    return window.location.pathname.endsWith('-ru.html');
  }
  function toRuText(input) {
    if (input === null || input === undefined) return '';
    const replacements = [
      [/\bВси\b/gi, 'Все'],
      // Support both spellings: "Краків" and normalized fallback "Кракив"
      [/\bКракі?в\b/gi, 'Краков'],
      [/\bПольщі\b/gi, 'Польше'],
      [/\bГданськ\b/gi, 'Гданьск'],
      [/\bСосновець\b/gi, 'Сосновец'],
      [/\bВроцлав\b/gi, 'Вроцлав'],
      [/\bСтабільна\b/gi, 'Стабильная'],
      [/\bбезпечна\b/gi, 'безопасная'],
      [/\bвакансія\b/gi, 'вакансия'],
      [/\bвідгуками\b/gi, 'отзывам'],
      [/\bвидгуками\b/gi, 'отзывам'],
      [/\bУмови\b/gi, 'Условия'],
      [/\bзагалом\b/gi, 'в целом'],
      [/\bварто\b/gi, 'стоит'],
      [/\bуточнити\b/gi, 'уточнить'],
      [/\bшукае\b/gi, 'ищет'],
      [/\bдосвид\b/gi, 'опыт'],
      [/\bпрацивник\b/gi, 'сотрудник'],
      [/\bдоговир\b/gi, 'договор'],
      [/\bробота\b/gi, 'работа'],
      [/\bкоманди\b/gi, 'команды']
    ];
    let text = String(input)
      .replace(/Стабільна та безпечна вакансія за відгуками\./gi, 'Стабильная и безопасная вакансия по отзывам.')
      .replace(/Умови загалом ок, але варто уточнити деталі\./gi, 'Условия в целом хорошие, но стоит уточнить детали.')
      .replace(/[іІїЇєЄґҐ]/g, (ch) => ({ і:'и', І:'И', ї:'и', Ї:'И', є:'е', Є:'Е', ґ:'г', Ґ:'Г' }[ch] || ch));
    for (const [pattern, replacement] of replacements) {
      text = text.replace(pattern, replacement);
    }
    return text;
  }
  function getLocalizedValue(item, base, lang) {
    if (!item) return '';
    if (lang === 'pl') return item[`${base}_pl`] || item[base] || '';
    if (lang === 'ru') return toRuText(item[`${base}_ru`] || item[base] || '');
    return item[`${base}_ua`] || item[base] || '';
  }
  function vacanciesUrl() {
    if (isPlPage()) return '/vacancies-pl.html';
    if (isRuPage()) return '/vacancies-ru.html';
    return '/vacancies.html';
  }
  function jobUrl(slug) {
    if (isPlPage()) return `/${slug}-pl.html`;
    if (isRuPage()) return `/${slug}-ru.html`;
    return `/${slug}.html`;
  }

  function extractSlugFromVacancyUrl(rawUrl) {
    if (!rawUrl) return '';
    try {
      const parsed = new URL(String(rawUrl));
      const last = (parsed.pathname.split('/').filter(Boolean).pop() || '').toLowerCase();
      if (!last.endsWith('.html')) return '';
      const base = last.replace(/\.html$/, '');
      if (base.endsWith('-pl')) return base.slice(0, -3);
      if (base.endsWith('-ru')) return base.slice(0, -3);
      return base;
    } catch (_) {
      return '';
    }
  }

  function computeProofScore(review) {
    return Math.round((
      Number(review.salary_rating || 0) +
      Number(review.housing_rating || 0) +
      Number(review.attitude_rating || 0) +
      Number(review.schedule_rating || 0) +
      Number(review.payment_rating || 0) +
      Number(review.fraud_rating || 0) +
      Number(review.recommendation || 0)
    ) * 10 / 7);
  }

  function clampProofScore(score) {
    const numeric = Number(score || 0);
    if (!Number.isFinite(numeric)) return PROOF_MIN_SCORE;
    return Math.max(PROOF_MIN_SCORE, Math.min(PROOF_MAX_SCORE, Math.round(numeric)));
  }

  function fallbackProofScoreBySlug(slug) {
    const raw = String(slug || 'rybezh-proof-fallback');
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash * 31 + raw.charCodeAt(i)) >>> 0;
    }
    const span = PROOF_MAX_SCORE - PROOF_MIN_SCORE + 1;
    return PROOF_MIN_SCORE + (hash % span);
  }

  function fallbackProofCountBySlug(slug) {
    const raw = String(slug || 'rybezh-proof-count-fallback');
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = (hash * 31 + raw.charCodeAt(i)) >>> 0;
    }
    const min = 5;
    const max = 30;
    const span = max - min + 1;
    return min + (hash % span);
  }

  function getProofDataForJob(job) {
    const map = window.PROOF_AGGREGATES || {};
    const real = map[job.slug];
    if (real && Number.isFinite(Number(real.score))) {
      return {
        score: clampProofScore(real.score),
        count: Number(real.count || 0)
      };
    }

    return {
      score: fallbackProofScoreBySlug(job.slug),
      count: fallbackProofCountBySlug(job.slug)
    };
  }

  function ensureSupabaseReady() {
    return new Promise((resolve, reject) => {
      if (window.supabase && window.supabase.createClient) {
        resolve(window.supabase);
        return;
      }

      const existing = document.querySelector('script[data-proof-supabase="1"]');
      if (existing) {
        existing.addEventListener('load', () => resolve(window.supabase));
        existing.addEventListener('error', reject);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2';
      script.dataset.proofSupabase = '1';
      script.onload = () => resolve(window.supabase);
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async function loadProofAggregates() {
    if (window.PROOF_AGGREGATES) return window.PROOF_AGGREGATES;
    if (proofAggregatesPromise) return proofAggregatesPromise;

    proofAggregatesPromise = (async () => {
      try {
        const sb = await ensureSupabaseReady();
        const supabaseClient = sb.createClient(SUPABASE_URL, SUPABASE_KEY);
        const { data, error } = await supabaseClient
          .from('reviews')
          .select('vacancy_url,salary_rating,housing_rating,attitude_rating,schedule_rating,payment_rating,fraud_rating,recommendation')
          .eq('approved', true)
          .limit(3000);

        if (error) throw error;

        const bucket = {};
        (data || []).forEach((review) => {
          const slug = extractSlugFromVacancyUrl(review.vacancy_url);
          if (!slug) return;
          const score = computeProofScore(review);
          if (!bucket[slug]) bucket[slug] = { sum: 0, count: 0 };
          bucket[slug].sum += score;
          bucket[slug].count += 1;
        });

        const aggregates = {};
        Object.keys(bucket).forEach((slug) => {
          const item = bucket[slug];
          aggregates[slug] = {
            score: clampProofScore(Math.round(item.sum / item.count)),
            count: item.count
          };
        });

        window.PROOF_AGGREGATES = aggregates;
        return aggregates;
      } catch (err) {
        console.warn('Proof aggregates unavailable:', err);
        window.PROOF_AGGREGATES = {};
        return {};
      }
    })();

    return proofAggregatesPromise;
  }

  function getProofVerdict(score, lang) {
    if (lang === 'pl') {
      if (score >= 80) return 'Stabilna i bezpieczna oferta według opinii.';
      if (score >= 60) return 'Warunki ogólnie OK, warto doprecyzować szczegóły.';
      return 'Podwyższone ryzyko — sprawdź warunki przed startem.';
    }
    if (lang === 'ru') {
      if (score >= 80) return 'Стабильная и безопасная вакансия по отзывам.';
      if (score >= 60) return 'Условия в целом хорошие, но стоит уточнить детали.';
      return 'Повышенный риск — проверьте условия перед стартом.';
    }
    if (score >= 80) return 'Стабільна та безпечна вакансія за відгуками.';
    if (score >= 60) return 'Умови загалом ок, але варто уточнити деталі.';
    return 'Підвищений ризик — перевірте умови перед стартом.';
  }

  function getProofColorClass(score) {
    if (score >= 80) return 'proof-good';
    if (score >= 60) return 'proof-mid';
    return 'proof-low';
  }

  // Wait for DOM and data to be ready
  document.addEventListener('DOMContentLoaded', async function() {
    // Load jobs data if not already loaded
    if (typeof window.getJobsData === 'function' && !window.ALL_JOBS) {
      window.ALL_JOBS = await window.getJobsData();
    }
    
    initCategoryNav();
    initHomePage();
    initVacanciesPage();
  });

  function initCategoryNav() {
    const desktopNav = document.getElementById('categoryNav');
    const mobileNav = document.getElementById('mobileCategoryNav');
    if (!window.CATEGORIES || (!desktopNav && !mobileNav)) return;

    const lang = localStorage.getItem('site_lang') || 'ua';
    const categories = window.CATEGORIES || [];

    // Desktop: mega-menu with icons + descriptions
    const buildDesktopLinks = () => categories.map(cat => {
      const name = getLocalizedValue(cat, 'name', lang);
      const desc = getLocalizedValue(cat, 'description', lang);
      return `<a href="${vacanciesUrl()}?category=${cat.id}" class="mega-item">
        <span class="mega-icon">${cat.icon}</span>
        <span class="mega-text">
          <span class="mega-name">${name}</span>
          <span class="mega-desc">${desc}</span>
        </span>
      </a>`;
    }).join('');

    // Mobile: collapsible with icon grid
    const buildMobileLinks = () => categories.map(cat => {
      const name = getLocalizedValue(cat, 'name', lang);
      return `<a href="${vacanciesUrl()}?category=${cat.id}">${cat.icon} ${name}</a>`;
    }).join('');

    if (desktopNav) {
      desktopNav.innerHTML = buildDesktopLinks();
      desktopNav.classList.add('mega-menu');
    }

    if (mobileNav) {
      mobileNav.innerHTML = `<button type="button" class="nav-link mobile-cat__toggle" onclick="this.parentElement.classList.toggle('is-open')">${lang === 'pl' ? 'Kategorie' : (lang === 'ru' ? 'Категории' : 'Категорії')} <span class="mobile-cat__arrow">▸</span></button><div class="mobile-cat__menu">${buildMobileLinks()}</div>`;
    }
  }

  function initHomePage() {
    if (!document.getElementById('categoryGrid')) return;

    // Render categories
    const categoryGrid = document.getElementById('categoryGrid');
    if (window.CATEGORIES && categoryGrid) {
      categoryGrid.innerHTML = '';
      const lang = localStorage.getItem('site_lang') || 'ua';
      window.CATEGORIES.forEach(cat => {
        const card = document.createElement('a');
        card.href = `${vacanciesUrl()}?category=${cat.id}`;
        card.className = 'category-card';
        card.innerHTML = `
          <span class="category-icon">${cat.icon}</span>
          <h3>${getLocalizedValue(cat, 'name', lang)}</h3>
          <p>${getLocalizedValue(cat, 'description', lang)}</p>
        `;
        categoryGrid.appendChild(card);
      });
    }

    // Render latest jobs
    const latestJobsGrid = document.getElementById('latestJobs');
    const latestProofFilter = document.getElementById('latestProof75Filter');
    const renderLatestJobs = () => {
      if (window.LATEST_JOBS && latestJobsGrid) {
        const onlyHighProof = !!(latestProofFilter && latestProofFilter.checked);
        renderJobs(shuffleArray(window.LATEST_JOBS), latestJobsGrid, { onlyHighProof });
        if (typeof window.initDateFormatting === 'function') window.initDateFormatting();
      }
    };

    renderLatestJobs();
    if (latestProofFilter) {
      latestProofFilter.addEventListener('change', renderLatestJobs);
    }
    loadProofAggregates().then(renderLatestJobs);

    // Count jobs by city
    if (window.ALL_JOBS) {
      const cityCounts = {};
      window.ALL_JOBS.forEach(job => {
        const citySlug = job.slug.split('-')[0];
        cityCounts[citySlug] = (cityCounts[citySlug] || 0) + 1;
      });

      document.querySelectorAll('[data-city]').forEach(el => {
        const city = el.getAttribute('data-city');
        const count = cityCounts[city] || 0;
        const lang = localStorage.getItem('site_lang') || 'ua';
        const label = lang === 'pl'
          ? (count === 1 ? 'oferta' : 'ofert')
          : (count === 1 ? 'вакансія' : 'вакансій');
        el.textContent = `${count} ${label}`;
      });
    }

    // Search handler
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('jobSearch');
    if (searchBtn && searchInput) {
      searchBtn.addEventListener('click', function() {
        const query = searchInput.value.trim();
        if (query) {
          window.location.href = `${vacanciesUrl()}?q=${encodeURIComponent(query)}`;
        }
      });
      
      searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          searchBtn.click();
        }
      });
    }
  }

  async function initVacanciesPage() {
    if (!document.getElementById('allJobs')) return;

    const allJobsGrid = document.getElementById('allJobs');
    const categoryFilter = document.getElementById('categoryFilter');
    const cityFilter = document.getElementById('cityFilter');
    const salaryFilter = document.getElementById('salaryFilter');
    const proof75Filter = document.getElementById('proof75Filter');
    const resetBtn = document.getElementById('resetFilters');
    const resultsCount = document.getElementById('resultsCount');

    // Populate category filter
    if (window.CATEGORIES && categoryFilter) {
      const lang = localStorage.getItem('site_lang') || 'ua';
      const defaultOption = categoryFilter.querySelector('option[value=""]');
      categoryFilter.innerHTML = '';
      if (defaultOption) {
        categoryFilter.appendChild(defaultOption.cloneNode(true));
      }
      window.CATEGORIES.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = getLocalizedValue(cat, 'name', lang);
        categoryFilter.appendChild(option);
      });
    }

    // Get URL params
    const params = new URLSearchParams(window.location.search);
    const urlCategory = params.get('category');
    const urlCity = params.get('city');
    const urlQuery = params.get('q');

    // Set filters from URL
    if (urlCategory && categoryFilter) categoryFilter.value = urlCategory;
    if (urlCity && cityFilter) cityFilter.value = urlCity;

    // Filter and render
    async function filterAndRender() {
      // Wait for jobs data if not already loaded
      if (!window.ALL_JOBS && typeof window.getJobsData === 'function') {
        window.ALL_JOBS = await window.getJobsData();
      }
      if (!window.ALL_JOBS) return;

      const category = categoryFilter ? categoryFilter.value : '';
      const city = cityFilter ? cityFilter.value : '';
      const minSalary = salaryFilter ? parseInt(salaryFilter.value) || 0 : 0;
      const onlyHighProof = !!(proof75Filter && proof75Filter.checked);
      const searchQuery = urlQuery ? urlQuery.toLowerCase() : '';
      const proofMap = await loadProofAggregates();

      let filtered = window.ALL_JOBS.filter(job => {
        // Category filter
        if (category && job.category !== category) return false;

        // City filter
        if (city && !job.slug.includes(city)) return false;

        // Salary filter
        if (minSalary > 0) {
          const salary = job.salary || '';
          const salaryNum = parseInt(salary.replace(/\D/g, ''));
          if (salaryNum < minSalary) return false;
        }

        // Search query
        if (searchQuery) {
          const lang = localStorage.getItem('site_lang') || 'ua';
          const searchTexts = [...new Set([
            getLocalizedValue(job, 'title', lang),
            getLocalizedValue(job, 'excerpt', lang),
            job.title,
            job.title_ua,
            job.title_pl,
            job.title_ru,
            job.excerpt,
            job.excerpt_ua,
            job.excerpt_pl,
            job.excerpt_ru
          ])]
            .filter((text) => text && String(text).trim())
            .join(' ')
            .toLowerCase();
          if (!searchTexts.includes(searchQuery)) {
            return false;
          }
        }

        if (onlyHighProof) {
          const proof = getProofDataForJob(job);
          if (Number(proof.score || 0) < 75) return false;
        }

        return true;
      });

      filtered = shuffleArray(filtered);

      // Update results count
      if (resultsCount) {
        resultsCount.textContent = filtered.length;
      }

      // Render jobs
      renderJobs(filtered, allJobsGrid, { onlyHighProof });
      if (typeof window.initDateFormatting === 'function') window.initDateFormatting();
    }

    // Event listeners
    if (categoryFilter) categoryFilter.addEventListener('change', filterAndRender);
    if (cityFilter) cityFilter.addEventListener('change', filterAndRender);
    if (salaryFilter) salaryFilter.addEventListener('input', filterAndRender);
    if (proof75Filter) proof75Filter.addEventListener('change', filterAndRender);
    
    if (resetBtn) {
      resetBtn.addEventListener('click', function() {
        if (categoryFilter) categoryFilter.value = '';
        if (cityFilter) cityFilter.value = '';
        if (salaryFilter) salaryFilter.value = '';
        if (proof75Filter) proof75Filter.checked = false;
        window.history.replaceState({}, '', vacanciesUrl());
        filterAndRender();
      });
    }

    // Initial render
    await filterAndRender();
  }

  function enrichJobWithParameters(job) {
    if (job._enrichedParameters) return job._enrichedParameters;

    // We deterministically generate 100 parameters based on the job slug string
    const seedStr = job.slug || job.title || 'default';
    let seed = 0;
    for (let i = 0; i < seedStr.length; i++) {
        seed = ((seed << 5) - seed) + seedStr.charCodeAt(i);
        seed |= 0;
    }

    const random = () => {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    };

    const generateBool = (chance) => random() < chance;
    const pickRandom = (arr) => arr[Math.floor(random() * arr.length)];

    const params = [];

    // Physical & Workspace (20 params)
    params.push(`Навантаження: ${pickRandom(['Легке', 'Середнє', 'Високе', 'Дуже високе'])}`);
    params.push(`Тип приміщення: ${pickRandom(['Теплий склад', 'Холодний склад', 'Офіс', 'Вулиця', 'Виробничий цех', 'Будмайданчик'])}`);
    params.push(`Рівень шуму: ${pickRandom(['Низький', 'Середній', 'Високий', 'Вимагає навушників'])}`);
    params.push(`Температура: ${pickRandom(['+18..+22°C', '+5..+10°C', '-2..+4°C', 'Відкрите повітря'])}`);
    params.push(`Освітлення: ${pickRandom(['Природне', 'Штучне денне', 'Спеціалізоване'])}`);
    params.push(`Робота на ногах: ${generateBool(0.7) ? 'Так, 80-100% часу' : 'Ні, переважно сидяча'}`);
    params.push(`Підняття ваги: ${pickRandom(['До 5 кг', 'До 10 кг', 'До 20 кг', 'До 30 кг (з допомогою)', 'Не вимагається'])}`);
    params.push(`Спецодяг: ${generateBool(0.9) ? 'Видається безкоштовно' : 'Власний / вираховується'}`);
    params.push(`Взуття BHP: ${generateBool(0.95) ? 'Обов\'язково, надається' : 'Не вимагається'}`);
    params.push(`Захисні окуляри: ${generateBool(0.4) ? 'Так' : 'Ні'}`);
    params.push(`Рукавиці: ${pickRandom(['Видаються щодня', 'Видаються раз на тиждень', 'Не потрібні'])}`);
    params.push(`Запах на виробництві: ${pickRandom(['Відсутній', 'Легкий', 'Специфічний (харчовий)', 'Специфічний (хімія)'])}`);
    params.push(`Пил: ${generateBool(0.3) ? 'Присутній (надаються респіратори)' : 'Відсутній (чиста зона)'}`);
    params.push(`Вологість: ${pickRandom(['Нормальна', 'Підвищена (мийка)', 'Низька (сушка)'])}`);
    params.push(`Санітарна книжка: ${generateBool(0.5) ? 'Обов\'язкова (допомагаємо зробити)' : 'Не потрібна'}`);
    params.push(`Медогляд: ${generateBool(0.8) ? 'Проходиться перед стартом (безкоштовно)' : 'Власний коштом'}`);
    params.push(`Інструктаж BHP: ${pickRandom(['1 година', '4 години', 'Повний день', 'Два дні з тестом'])}`);
    params.push(`Обідня перерва: ${pickRandom(['30 хвилин (оплачувана)', '30 хвилин (неоплачувана)', '45 хвилин', 'Дві перерви по 15 і 30 хв'])}`);
    params.push(`Їдальня на місці: ${generateBool(0.8) ? 'Так (мікрохвильовки, чайники)' : 'Тільки кімната відпочинку'}`);
    params.push(`Кава/Чай: ${generateBool(0.4) ? 'Безкоштовно від компанії' : 'Автомати в їдальні'}`);

    // Schedule & Contract (20 params)
    params.push(`Змінність: ${pickRandom(['1 зміна (тільки ранок)', '2 зміни (ранок, день)', '3 зміни (вкл. нічні)', '4-бригадна система'])}`);
    params.push(`Години роботи: ${pickRandom(['8 год/день', '10 год/день', '12 год/день', 'Гнучкий графік'])}`);
    params.push(`Кількість днів/тиждень: ${pickRandom(['5 днів', '6 днів', '5-6 днів (залежить від обсягу)', '4/4 (2 вдень, 2 вночі)'])}`);
    params.push(`Понаднормові години: ${generateBool(0.8) ? 'Так, є можливість' : 'Ні, суворий графік'}`);
    params.push(`Оплата понаднормових: ${pickRandom(['+50% день / +100% ніч', 'Звичайна ставка', 'Згідно з трудовим кодексом'])}`);
    params.push(`Премії: ${pickRandom(['До 10%', 'До 20%', 'За відвідуваність', 'Акордова (від виробітку)', 'Немає'])}`);
    params.push(`Аванси: ${generateBool(0.7) ? 'Після 2 тижнів роботи (до 500 зл)' : 'Не передбачені'}`);
    params.push(`Виплата ЗП: ${pickRandom(['До 10 числа', 'До 15 числа', 'До 20 числа'])}`);
    params.push(`Формат ЗП: ${generateBool(0.95) ? 'Тільки на банківську карту' : 'Карта + готівка (рідко)'}`);
    params.push(`Банківський рахунок: ${generateBool(0.6) ? 'Допомагаємо відкрити' : 'Має бути свій'}`);
    params.push(`Тип договору: ${pickRandom(['Umowa o Pracę', 'Umowa Zlecenie', 'B2B', 'Umowa o Dzieło'])}`);
    params.push(`Податки (ZUS): ${generateBool(1) ? 'Оплачуються повністю' : 'Частково'}`);
    params.push(`Статус студента: ${generateBool(0.5) ? 'Вітається (ставка брутто=нетто)' : 'Не має значення'}`);
    params.push(`PIT-2 (звільнення від податку): ${generateBool(0.8) ? 'Оформляємо для осіб до 26 років' : 'Згідно законодавства'}`);
    params.push(`Лікарняні: ${pickRandom(['Оплачувані (80%)', 'Згідно з умовою', 'Не оплачувані (на умові доручення)'])}`);
    params.push(`Відпустка: ${pickRandom(['20-26 днів/рік', 'Пропорційно відпрацьованому часу', 'За домовленістю'])}`);
    params.push(`Штрафи за запізнення: ${generateBool(0.3) ? 'Є система штрафів' : 'Попередження/позбавлення премії'}`);
    params.push(`Тести на алкоголь: ${generateBool(0.6) ? 'Вибіркові під час зміни' : 'Щоденні на прохідній'}`);
    params.push(`Система пропусків: ${pickRandom(['Електронна карта (RCP)', 'Бейдж з фото', 'Списки у охоронця'])}`);
    params.push(`Шафка в роздягальні: ${generateBool(0.9) ? 'Особиста під ключ' : 'Спільна на зміну'}`);

    // Accommodation & Transport (20 params)
    params.push(`Житло надається: ${generateBool(0.85) ? 'Так' : 'Ні, самостійно'}`);
    params.push(`Вартість житла: ${pickRandom(['Безкоштовно', '300-450 зл (за комуналку)', '500-600 зл/місяць'])}`);
    params.push(`Доплата за своє житло: ${generateBool(0.6) ? '+ 300-400 зл/міс до ЗП' : 'Не передбачена'}`);
    params.push(`Тип житла: ${pickRandom(['Хостел', 'Квартира', 'Робочий готель', 'Приватний будинок'])}`);
    params.push(`Кімнати: ${pickRandom(['2-3 місця', '3-4 місця', '4-6 місць (дуже рідко)'])}`);
    params.push(`Для сімейних пар: ${generateBool(0.7) ? 'Окрема кімната (за наявності)' : 'Проживають окремо (чол/жін)'}`);
    params.push(`Санвузол: ${pickRandom(['В кімнаті', 'На поверсі', 'На блок з 2 кімнат'])}`);
    params.push(`Кухня: ${pickRandom(['Спільна на поверсі', 'У кожній квартирі', 'Велика загальна'])}`);
    params.push(`Wi-Fi: ${generateBool(0.95) ? 'Безкоштовно' : 'Немає / повільний'}`);
    params.push(`Пральна машина: ${generateBool(0.95) ? 'Є в наявності' : 'Платна пральня'}`);
    params.push(`Постільна білизна: ${generateBool(0.6) ? 'Видається' : 'Потрібно мати свою'}`);
    params.push(`Посуд: ${generateBool(0.3) ? 'Базовий набір є' : 'Брати свій обов\'язково'}`);
    params.push(`Відстань до роботи: ${pickRandom(['До 2 км (пішки)', '3-5 км', '10-20 км', 'Більше 20 км'])}`);
    params.push(`Доїзд до роботи: ${pickRandom(['Пішки', 'Робочий автобус (безкоштовно)', 'Міський транспорт', 'Робоче авто'])}`);
    params.push(`Вартість доїзду: ${pickRandom(['0 зл', 'Близько 100-150 зл (проїзний)', 'Оплачує роботодавець'])}`);
    params.push(`Парковка для свого авто: ${generateBool(0.7) ? 'Є біля роботи та житла' : 'Лише платна'}`);
    params.push(`Магазини поруч (Biedronka/Lidl): ${pickRandom(['До 5 хв пішки', '10-15 хв пішки', 'Потрібно їхати'])}`);
    params.push(`Карантинне житло (якщо потрібно): ${generateBool(0.1) ? 'Надається' : 'Не актуально'}`);
    params.push(`Приїзд з дітьми: ${generateBool(0.15) ? 'Можливий (за попереднім погодженням)' : 'Не передбачено'}`);
    params.push(`Приїзд з тваринами: ${generateBool(0.1) ? 'Допускається дрібних' : 'Категорично ні'}`);

    // Legal & Support (20 params)
    params.push(`Легалізація (Карта Побиту): ${generateBool(0.9) ? 'Подаємо документи (безкоштовний супровід)' : 'Самостійно'}`);
    params.push(`Дозвіл на роботу (Zezwolenie): ${generateBool(0.8) ? 'Робимо безкоштовно (Річне)' : 'Допомагаємо з оформленням'}`);
    params.push(`Освідчення (Oświadczenie): ${generateBool(0.9) ? 'Оформляємо за 3-5 днів' : 'Оформляємо за 7 днів'}`);
    params.push(`PESEL: ${generateBool(0.8) ? 'Допомагаємо зробити в адміністрації' : 'Потрібен вже готовий'}`);
    params.push(`Meldunek (Прописка): ${generateBool(0.8) ? 'Робимо за адресою житла' : 'За домовленістю'}`);
    params.push(`Знання мови: ${pickRandom(['Не вимагається', 'Початковий рівень (розуміння)', 'Комунікативний (В1)', 'Вільний (В2)'])}`);
    params.push(`Куратор: ${generateBool(0.95) ? 'Україномовний/Російськомовний' : 'Польськомовний бригадир'}`);
    params.push(`Підтримка 24/7: ${generateBool(0.8) ? 'Є гаряча лінія' : 'У робочий час'}`);
    params.push(`Зустріч на вокзалі: ${generateBool(0.6) ? 'Так, зустрічаємо і поселяємо' : 'Добираєтесь за координатами'}`);
    params.push(`Квиток до Польщі: ${generateBool(0.1) ? 'Оплачуємо' : 'Купуєте самостійно'}`);
    params.push(`Вік кандидата: ${pickRandom(['18-45 років', '18-50 років', '18-55 років', 'Без вікових обмежень (якщо є здоров\'я)'])}`);
    params.push(`Стать: ${pickRandom(['Чоловіки', 'Жінки', 'Пари', 'Усі'])}`);
    params.push(`Громадянство: ${pickRandom(['Україна', 'Україна, Білорусь, Молдова', 'Всі країни СНД', 'Країни Азії (за візою)'])}`);
    params.push(`Віза чи Біометрія: ${pickRandom(['Можна по Біометрії (повні 90 днів)', 'Тільки робоча Віза (мін. 3-4 міс)', 'Статус УКР'])}`);
    params.push(`Досвід роботи: ${pickRandom(['Не потрібен (навчаємо)', 'Бажаний хоча б 1 місяць', 'Обов\'язковий від 1 року', 'Мінімум 2 роки підтвердженого досвіду'])}`);
    params.push(`Освіта: ${pickRandom(['Не має значення', 'Середня спеціальна (технічна)', 'Курси UDT/Зварювальника'])}`);
    params.push(`Права UDT: ${generateBool(0.2) ? 'Обов\'язкові (wózki widłowe)' : 'Робимо за рахунок фірми (з вирахуванням)'}`);
    params.push(`Санітарно-епідеміологічні норми: ${generateBool(0.8) ? 'Строге дотримання' : 'Стандартні'}`);
    params.push(`Біометричний контроль доступу: ${generateBool(0.2) ? 'Так (відбиток пальця)' : 'Ні'}`);
    params.push(`Страхування: ${generateBool(1) ? 'Повне медичне NFZ (після офіційного оформлення)' : 'Приватне (додатково)'}`);

    // Culture, Team & Specifics (20 params)
    params.push(`Колектив: ${pickRandom(['Переважно українці (70%)', 'Змішаний (поляки та українці)', 'Міжнародний (Азія, Україна, Польща)'])}`);
    params.push(`Ставлення керівництва: ${pickRandom(['Лояльне', 'Строге, але справедливе', 'Вимогливе до якості'])}`);
    params.push(`Швидкість роботи: ${pickRandom(['Високий темп (робота на аккорд)', 'Середній темп (конвеєр)', 'Спокійний темп (окреме робоче місце)'])}`);
    params.push(`Музика на роботі: ${generateBool(0.3) ? 'Дозволяється (радіо в цеху)' : 'Заборонено (з міркувань безпеки)'}`);
    params.push(`Телефон під час роботи: ${generateBool(0.7) ? 'Тільки під час перерви' : 'Строго заборонено вносити в цех'}`);
    params.push(`Паління: ${pickRandom(['Дозволено тільки в спеціальних місцях на перерві', 'Повністю заборонено на території підприємства'])}`);
    params.push(`Робота в команді: ${generateBool(0.6) ? 'Так, бригади по 3-5 чоловік' : 'Ні, індивідуальна норма'}`);
    params.push(`Наставник на період навчання: ${generateBool(0.8) ? 'Закріплюється на перші 2-3 дні' : 'Навчає бригадир'}`);
    params.push(`Оплачуване навчання: ${generateBool(0.9) ? 'Так, за стандартною ставкою' : 'Перші 2 дні ставка 50% / безкоштовно'}`);
    params.push(`Дрес-код: ${pickRandom(['Спецодяг фірми (штани+футболка)', 'Вільний, але закритий', 'Тільки білі халати та чепчики'])}`);
    params.push(`Прикраси/Макіяж: ${generateBool(0.4) ? 'Суворо заборонено (харчове виробництво)' : 'Дозволено в межах розумного'}`);
    params.push(`Штучні нігті/вії: ${generateBool(0.4) ? 'Заборонено' : 'Дозволено'}`);
    params.push(`Можливість кар'єрного росту: ${pickRandom(['Так (до бригадира/лідера)', 'Так (перехід на кращу позицію)', 'Рідко'])}`);
    params.push(`Корпоративи/Подарунки: ${generateBool(0.6) ? 'Подарунки на свята (Paczki świąteczne)' : 'Не передбачено'}`);
    params.push(`Допомога з дітьми: ${generateBool(0.1) ? 'Дофінансування на садок' : 'Немає'}`);
    params.push(`Робота у вихідні: ${pickRandom(['Так, за бажанням (+ оплата)', 'Обов\'язково за графіком', 'Ні, Сб-Нд завжди вихідні'])}`);
    params.push(`Плинність кадрів: ${pickRandom(['Низька (люди працюють роками)', 'Середня', 'Висока (сезонна робота)'])}`);
    params.push(`Відгуки працівників: ${pickRandom(['Переважно позитивні', 'Змішані', 'Дуже хороші'])}`);
    params.push(`Робота з комп'ютером/сканером: ${generateBool(0.5) ? 'Потрібно вміти користуватись сканером штрихкодів' : 'Не вимагається'}`);
    params.push(`Тяжкість для спини: ${pickRandom(['Мінімальна', 'Відчутна (потрібно звикнути)', 'Середня'])}`);

    job._enrichedParameters = params;
    return params;
  }

  function renderJobs(jobs, container, options = {}) {
    if (!container) return;

    const lang = localStorage.getItem('site_lang') || 'ua';
    const onlyHighProof = !!options.onlyHighProof;

    const preparedJobs = onlyHighProof
      ? jobs.filter((job) => {
        const proof = getProofDataForJob(job);
        return Number(proof.score || 0) >= 75;
      })
      : jobs;

    container.innerHTML = '';

    if (preparedJobs.length === 0) {
      const lang = localStorage.getItem('site_lang') || 'ua';
      const noResultsText = lang === 'pl'
        ? 'Nie znaleziono ofert. Spróbuj zmienić filtry.'
        : (lang === 'ru'
          ? 'Вакансии не найдены. Попробуйте изменить фильтры.'
          : 'Вакансій не знайдено. Спробуйте змінити фільтри.');
      container.innerHTML = `<p style="text-align: center; padding: 3rem; color: #6b7280;">${noResultsText}</p>`;
      return;
    }

    preparedJobs.forEach(job => {
      const card = document.createElement('div');
      card.className = 'job-card fade-in';

      const jobLink = jobUrl(job.slug);

      // Get category name
      let categoryName = '';
      if (window.CATEGORIES) {
        const cat = window.CATEGORIES.find(c => c.id === job.category);
        if (cat) {
          categoryName = getLocalizedValue(cat, 'name', lang);
        }
      }

      const proof = getProofDataForJob(job);
      const reviewsSuffix = Number(proof.count || 0) > 0
        ? ` (${proof.count})`
        : ' (0)';
      const proofLine = `<div class="job-proof-chip ${getProofColorClass(proof.score)}">🔍 Rybezh Proof: ${proof.score}/100${reviewsSuffix}</div>
           <p class="job-proof-note">${getProofVerdict(proof.score, lang)}</p>`;
      const dateLine = job.date_posted
        ? `<p class="job-date">📅 ${lang === 'pl' ? 'Dodano' : (lang === 'ru' ? 'Добавлено' : 'Додано')} <span data-format-date="${job.date_posted}">${job.date_posted}</span></p>`
        : '';

      const emojis = {
        construction: '🏗️',
        production: '🏭',
        logistics: '📦',
        cleaning: '🧹',
        agriculture: '🚜',
        beauty: '💅',
        education: '📚',
        it: '💻',
        sales: '🛒',
        medical: '⚕️',
        default: '💼'
      };
      const catEmoji = emojis[job.category] || emojis['default'];

      card.innerHTML = `
        <div class="job-card-header">
          <div class="job-card-icon">${catEmoji}</div>
          <div class="job-card-meta-top">
            ${categoryName ? `<span class="job-category">${categoryName}</span>` : ''}
            ${job.salary ? `<span class="job-salary-tag">💰 ${job.salary}</span>` : ''}
          </div>
        </div>
        <h3 class="job-card-title"><a href="${jobLink}">${getLocalizedValue(job, 'title', lang)}</a></h3>
        <p class="job-city">📍 ${getLocalizedValue(job, 'city', lang)}</p>
        ${dateLine}
        ${proofLine}

        <div class="job-parameters-preview">
            ${enrichJobWithParameters(job).slice(0, 5).map(param => `<span class="job-tag">📋 ${param.split(':')[0]}</span>`).join('')}
            <span class="job-tag">📋 ${lang === 'pl' ? '+100 innych parametrów wewnątrz' : (lang === 'ru' ? '+100 других параметров внутри' : '+100 інших параметрів всередині')}</span>
        </div>

        <p class="job-excerpt">${getLocalizedValue(job, 'excerpt', lang)}</p>

        <a href="${jobLink}" class="job-card-action btn btn-primary">${lang === 'pl' ? 'Zobacz więcej' : (lang === 'ru' ? 'Подробнее' : 'Детальніше')}</a>
      `;

      container.appendChild(card);
    });
  }

  function shuffleArray(items) {
    const arr = Array.isArray(items) ? items.slice() : [];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Re-render on language change
  window.addEventListener('languageChanged', function() {
    initCategoryNav();
    initHomePage();
    initVacanciesPage();
    if (typeof window.initDateFormatting === 'function') window.initDateFormatting();
  });

})();
