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
  function vacanciesUrl() {
    return isPlPage() ? '/vacancies-pl.html' : '/vacancies.html';
  }
  function jobUrl(slug) {
    return isPlPage() ? `/${slug}-pl.html` : `/${slug}.html`;
  }

  function extractSlugFromVacancyUrl(rawUrl) {
    if (!rawUrl) return '';
    try {
      const parsed = new URL(String(rawUrl));
      const last = (parsed.pathname.split('/').filter(Boolean).pop() || '').toLowerCase();
      if (!last.endsWith('.html')) return '';
      const base = last.replace(/\.html$/, '');
      return base.endsWith('-pl') ? base.slice(0, -3) : base;
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
    const isPl = lang === 'pl';
    if (score >= 80) return isPl ? 'Stabilna i bezpieczna oferta według opinii.' : 'Стабільна та безпечна вакансія за відгуками.';
    if (score >= 60) return isPl ? 'Warunki ogólnie OK, warto doprecyzować szczegóły.' : 'Умови загалом ок, але варто уточнити деталі.';
    return isPl ? 'Podwyższone ryzyko — sprawdź warunki przed startem.' : 'Підвищений ризик — перевірте умови перед стартом.';
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
      const name = lang === 'pl' ? cat.name_pl : cat.name_ua;
      const desc = lang === 'pl' ? cat.description_pl : cat.description_ua;
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
      const name = lang === 'pl' ? cat.name_pl : cat.name_ua;
      return `<a href="${vacanciesUrl()}?category=${cat.id}">${cat.icon} ${name}</a>`;
    }).join('');

    if (desktopNav) {
      desktopNav.innerHTML = buildDesktopLinks();
      desktopNav.classList.add('mega-menu');
    }

    if (mobileNav) {
      mobileNav.innerHTML = `<button type="button" class="nav-link mobile-cat__toggle" onclick="this.parentElement.classList.toggle('is-open')">${lang === 'pl' ? 'Kategorie' : 'Категорії'} <span class="mobile-cat__arrow">▸</span></button><div class="mobile-cat__menu">${buildMobileLinks()}</div>`;
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
          <h3>${lang === 'pl' ? cat.name_pl : cat.name_ua}</h3>
          <p>${lang === 'pl' ? cat.description_pl : cat.description_ua}</p>
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
        option.textContent = lang === 'pl' ? cat.name_pl : cat.name_ua;
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
          const title = (lang === 'pl' ? job.title_pl : job.title).toLowerCase();
          const excerpt = (lang === 'pl' ? job.excerpt_pl : job.excerpt).toLowerCase();
          if (!title.includes(searchQuery) && !excerpt.includes(searchQuery)) {
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
        : 'Вакансій не знайдено. Спробуйте змінити фільтри.';
      container.innerHTML = `<p style="text-align: center; padding: 3rem; color: #6b7280;">${noResultsText}</p>`;
      return;
    }

    preparedJobs.forEach(job => {
      const card = document.createElement('a');
      card.href = jobUrl(job.slug);
      card.className = 'job-card';

      // Get category name
      let categoryName = '';
      if (window.CATEGORIES) {
        const cat = window.CATEGORIES.find(c => c.id === job.category);
        if (cat) {
          categoryName = lang === 'pl' ? cat.name_pl : cat.name_ua;
        }
      }

      const proof = getProofDataForJob(job);
      const reviewsSuffix = Number(proof.count || 0) > 0
        ? ` (${proof.count})`
        : ' (0)';
      const proofLine = `<div class="job-proof-chip ${getProofColorClass(proof.score)}">🔍 Rybezh Proof: ${proof.score}/100${reviewsSuffix}</div>
           <p class="job-proof-note">${getProofVerdict(proof.score, lang)}</p>`;

      card.innerHTML = `
        ${categoryName ? `<span class="job-category">${categoryName}</span>` : ''}
        <h3>${lang === 'pl' ? (job.title_pl || job.title) : job.title}</h3>
        <p class="job-city">📍 ${lang === 'pl' ? (job.city_pl || job.city) : job.city}</p>
        ${job.salary ? `<p class="job-salary">💰 ${job.salary}</p>` : ''}
        ${proofLine}
        <p class="job-excerpt">${lang === 'pl' ? (job.excerpt_pl || job.excerpt) : job.excerpt}</p>
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
  });

})();
