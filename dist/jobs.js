/**
 * Jobs & Categories Logic for Rybezh Universal Job Portal
 */

(function() {
  'use strict';

  // Wait for DOM and data to be ready
  document.addEventListener('DOMContentLoaded', function() {
    initHomePage();
    initVacanciesPage();
  });

  function initHomePage() {
    if (!document.getElementById('categoryGrid')) return;

    // Render categories
    const categoryGrid = document.getElementById('categoryGrid');
    if (window.CATEGORIES && categoryGrid) {
      categoryGrid.innerHTML = '';
      const lang = localStorage.getItem('site_lang') || 'ua';
      window.CATEGORIES.forEach(cat => {
        const card = document.createElement('a');
        card.href = `/vacancies.html?category=${cat.id}`;
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
    if (window.LATEST_JOBS && latestJobsGrid) {
      renderJobs(window.LATEST_JOBS, latestJobsGrid);
    }

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
        el.textContent = `${count} ${count === 1 ? 'вакансія' : 'вакансій'}`;
      });
    }

    // Search handler
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('jobSearch');
    if (searchBtn && searchInput) {
      searchBtn.addEventListener('click', function() {
        const query = searchInput.value.trim();
        if (query) {
          window.location.href = `/vacancies.html?q=${encodeURIComponent(query)}`;
        }
      });
      
      searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          searchBtn.click();
        }
      });
    }
  }

  function initVacanciesPage() {
    if (!document.getElementById('allJobs')) return;

    const allJobsGrid = document.getElementById('allJobs');
    const categoryFilter = document.getElementById('categoryFilter');
    const cityFilter = document.getElementById('cityFilter');
    const salaryFilter = document.getElementById('salaryFilter');
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
    function filterAndRender() {
      if (!window.ALL_JOBS) return;

      const category = categoryFilter ? categoryFilter.value : '';
      const city = cityFilter ? cityFilter.value : '';
      const minSalary = salaryFilter ? parseInt(salaryFilter.value) || 0 : 0;
      const searchQuery = urlQuery ? urlQuery.toLowerCase() : '';

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

        return true;
      });

      // Update results count
      if (resultsCount) {
        resultsCount.textContent = filtered.length;
      }

      // Render jobs
      renderJobs(filtered, allJobsGrid);
    }

    // Event listeners
    if (categoryFilter) categoryFilter.addEventListener('change', filterAndRender);
    if (cityFilter) cityFilter.addEventListener('change', filterAndRender);
    if (salaryFilter) salaryFilter.addEventListener('input', filterAndRender);
    
    if (resetBtn) {
      resetBtn.addEventListener('click', function() {
        if (categoryFilter) categoryFilter.value = '';
        if (cityFilter) cityFilter.value = '';
        if (salaryFilter) salaryFilter.value = '';
        window.history.replaceState({}, '', '/vacancies.html');
        filterAndRender();
      });
    }

    // Initial render
    filterAndRender();
  }

  function renderJobs(jobs, container) {
    if (!container) return;

    const lang = localStorage.getItem('site_lang') || 'ua';
    container.innerHTML = '';

    if (jobs.length === 0) {
      container.innerHTML = '<p style="text-align: center; padding: 3rem; color: #6b7280;">Вакансій не знайдено. Спробуйте змінити фільтри.</p>';
      return;
    }

    jobs.forEach(job => {
      const card = document.createElement('a');
      card.href = `/${job.slug}.html`;
      card.className = 'job-card';

      // Get category name
      let categoryName = '';
      if (window.CATEGORIES) {
        const cat = window.CATEGORIES.find(c => c.id === job.category);
        if (cat) {
          categoryName = lang === 'pl' ? cat.name_pl : cat.name_ua;
        }
      }

      card.innerHTML = `
        ${categoryName ? `<span class="job-category">${categoryName}</span>` : ''}
        <h3>${lang === 'pl' ? (job.title_pl || job.title) : job.title}</h3>
        <p class="job-city">📍 ${lang === 'pl' ? (job.city_pl || job.city) : job.city}</p>
        ${job.salary ? `<p class="job-salary">💰 ${job.salary}</p>` : ''}
        <p class="job-excerpt">${lang === 'pl' ? (job.excerpt_pl || job.excerpt) : job.excerpt}</p>
      `;

      container.appendChild(card);
    });
  }

  // Re-render on language change
  window.addEventListener('languageChanged', function() {
    initHomePage();
    initVacanciesPage();
  });

})();
