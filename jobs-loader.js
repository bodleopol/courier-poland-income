// Lazy loading for jobs data - fixes 2.86MB index.html problem
(function() {
  let allJobs = [];
  let isDataLoaded = false;

  async function loadJobsData() {
    if (isDataLoaded) return allJobs;
    
    try {
      const response = await fetch('/jobs-data.json');
      allJobs = await response.json();
      isDataLoaded = true;
      return allJobs;
    } catch (error) {
      console.error('Failed to load jobs data:', error);
      return [];
    }
  }

  // Initialize jobs display
  async function initJobs() {
    const jobs = await loadJobsData();
    if (window.initializeVacancyDisplay) {
      window.initializeVacancyDisplay(jobs);
    }
    if (window.updateCityCounts) {
      window.updateCityCounts(jobs);
    }
  }

  // Auto-init when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initJobs);
  } else {
    initJobs();
  }

  window.getJobsData = loadJobsData;
})();
