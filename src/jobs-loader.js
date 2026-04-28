// Lazy loading for jobs data - fixes 2.86MB index.html problem
(function() {
  'use strict';
  
  let allJobs = [];
  let isDataLoaded = false;
  let loadPromise = null;

  async function loadJobsData() {
    if (isDataLoaded) return allJobs;
    
    // Prevent multiple simultaneous fetches
    if (loadPromise) return loadPromise;
    
    loadPromise = (async () => {
      try {
        const response = await fetch('/jobs-data.json', {
          cache: 'default',
          headers: { 'Accept': 'application/json' }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        allJobs = await response.json();
        
        if (!Array.isArray(allJobs)) {
          console.warn('Jobs data is not an array, resetting to empty');
          allJobs = [];
        }
        
        isDataLoaded = true;
        return allJobs;
      } catch (error) {
        console.error('Failed to load jobs data:', error);
        loadPromise = null; // Allow retry on failure
        return [];
      }
    })();
    
    return loadPromise;
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
