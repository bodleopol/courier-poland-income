// Engagement and SEO improvement helpers

export function getLastUpdated() {
  return new Date().toISOString().slice(0, 10);
}

export function buildSimilarJobs(currentJob, allJobs, limit = 3) {
  const sameCat = allJobs.filter(j => 
    j.slug !== currentJob.slug && j.category === currentJob.category
  ).slice(0, limit);
  
  if (sameCat.length >= limit) return sameCat;
  
  const sameCity = allJobs.filter(j => 
    j.slug !== currentJob.slug && 
    j.city === currentJob.city && 
    !sameCat.includes(j)
  ).slice(0, limit - sameCat.length);
  
  return [...sameCat, ...sameCity].slice(0, limit);
}

export function buildBreadcrumbs(job, lang) {
  const labels = {
    ua: { 
      home: 'Головна', 
      vacancies: 'Вакансії', 
      category: getCategoryName(job.category, 'ua'),
      city: job.city 
    },
    pl: { 
      home: 'Strona główna', 
      vacancies: 'Oferty pracy', 
      category: getCategoryName(job.category, 'pl'),
      city: job.city 
    }
  };
  const l = labels[lang] || labels.ua;
  
  return `
    <nav class="breadcrumbs" aria-label="breadcrumb">
      <ol>
        <li><a href="/">${escapeHtml(l.home)}</a></li>
        <li><a href="/vacancies.html">${escapeHtml(l.vacancies)}</a></li>
        <li><a href="/vacancies.html?category=${escapeHtml(job.category)}">${escapeHtml(l.category)}</a></li>
        <li>${escapeHtml(job.title)}</li>
      </ol>
    </nav>
  `;
}

export function buildEngagementMeta(job, lang) {
  const lastUpdated = getLastUpdated();
  const contractType = job.contract || '';
  
  const labels = {
    ua: {
      updated: 'Оновлено',
      contract: 'Тип договору'
    },
    pl: {
      updated: 'Zaktualizowano',
      contract: 'Typ umowy'
    }
  };
  const l = labels[lang] || labels.ua;
  
  return `
    <div class="job-meta-cards">
      <div class="job-meta-card">
        <span class="icon">📅</span>
        <div>
          <div class="label">${l.updated}</div>
          <div class="value" data-format-date="${lastUpdated}">${lastUpdated}</div>
        </div>
      </div>
      ${contractType ? `<div class="job-meta-card">
        <span class="icon">📋</span>
        <div>
          <div class="label">${l.contract}</div>
          <div class="value">${escapeHtml(contractType)}</div>
        </div>
      </div>` : ''}
    </div>
  `;
}

export function buildSimilarJobsSection(similarJobs, lang) {
  if (!similarJobs || similarJobs.length === 0) return '';
  
  const title = lang === 'pl' ? 'Podobne oferty' : 'Схожі вакансії';
  
  const cards = similarJobs.map(job => {
    const jobTitle = lang === 'pl' ? (job.title_pl || job.title) : job.title;
    const salary = job.salary || (lang === 'pl' ? 'Do uzgodnienia' : 'За домовленістю');
    
    return `
      <a href="/${job.slug}.html" class="similar-job-card">
        <h4>${escapeHtml(jobTitle)}</h4>
        <div class="job-location">📍 ${escapeHtml(job.city)}</div>
        <div class="job-salary">💰 ${escapeHtml(salary)}</div>
      </a>
    `;
  }).join('');
  
  return `
    <section class="similar-jobs-section">
      <h2>${title}</h2>
      <div class="similar-jobs-grid">${cards}</div>
    </section>
  `;
}

export const CATEGORY_SPECIFIC_SECTIONS = {
  it: {
    ua: {
      title: 'Технології та команда',
      items: ['Стек технологій', 'Розмір команди', 'Code review процес', 'Можливості росту']
    },
    pl: {
      title: 'Technologie i zespół',
      items: ['Stack technologiczny', 'Wielkość zespołu', 'Proces code review', 'Możliwości rozwoju']
    }
  },
  construction: {
    ua: {
      title: 'Безпека та сертифікати',
      items: ['Обов\'язкові сертифікати безпеки', 'Навчання з техніки безпеки', 'Спецодяг та засоби захисту', 'Висотні роботи (якщо є)']
    },
    pl: {
      title: 'Bezpieczeństwo i certyfikaty',
      items: ['Wymagane certyfikaty BHP', 'Szkolenia bezpieczeństwa', 'Odzież i środki ochronne', 'Prace na wysokości (jeśli dotyczy)']
    }
  },
  hospitality: {
    ua: {
      title: 'Графік та чайові',
      items: ['Змінність графіка', 'Контакт з клієнтами', 'Політика чайових', 'Святкові надбавки']
    },
    pl: {
      title: 'Grafik i napiwki',
      items: ['Zmienność grafiku', 'Kontakt z klientem', 'Polityka napiwków', 'Dodatki świąteczne']
    }
  },
  healthcare: {
    ua: {
      title: 'Ліцензії та практика',
      items: ['Визнання дипломів', 'Ліцензія/реєстрація', 'Тип пацієнтів', 'Супервізія']
    },
    pl: {
      title: 'Licencje i praktyka',
      items: ['Nostryfikacja dyplomów', 'Licencja/rejestracja', 'Typ pacjentów', 'Superwizja']
    }
  }
};

export function buildCategorySection(job, lang) {
  const catData = CATEGORY_SPECIFIC_SECTIONS[job.category];
  if (!catData) return '';
  
  const data = catData[lang] || catData.ua;
  const items = data.items.map(item => `<li>${escapeHtml(item)}</li>`).join('');
  
  return `
    <div class="job-section category-specific">
      <h3>${escapeHtml(data.title)}</h3>
      <ul>${items}</ul>
    </div>
  `;
}

// Helper functions
function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function getCategoryName(categorySlug, lang) {
  const names = {
    it: { ua: 'IT', pl: 'IT' },
    construction: { ua: 'Будівництво', pl: 'Budownictwo' },
    hospitality: { ua: 'Готелі та ресторани', pl: 'Hotelarstwo' },
    healthcare: { ua: 'Медицина', pl: 'Medycyna' },
    logistics: { ua: 'Логістика', pl: 'Logistyka' },
    production: { ua: 'Виробництво', pl: 'Produkcja' }
  };
  return names[categorySlug]?.[lang] || categorySlug;
}
