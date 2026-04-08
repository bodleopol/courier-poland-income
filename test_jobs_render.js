import fs from 'fs';
const jobsSrc = fs.readFileSync('dist/jobs.js', 'utf8');

const jobsData = [
  {
    "title": "Тестова вакансія",
    "slug": "test-vacancy",
    "date_posted": "2026-03-28T19:08:12.173Z",
    "salary_range": "5000-8000 PLN",
    "city": "Warszawa",
    "country": "Poland"
  }
];

// Provide some DOM stubs
global.window = {
  location: { pathname: '/index.html' },
  LATEST_JOBS: jobsData,
  addEventListener: () => {},
  CATEGORIES: []
};
global.document = {
  getElementById: (id) => {
    if (id === 'latestJobs') return { innerHTML: '', appendChild: (c) => { console.log('Appended', c); } };
    if (id === 'categoryGrid') return null;
    return null;
  },
  createElement: (tag) => {
    return {
      classList: { add: () => {} },
      appendChild: () => {},
      querySelector: () => ({ innerHTML: '' })
    };
  },
  addEventListener: () => {}
};
global.localStorage = { getItem: () => 'ua', setItem: () => {} };
global.console = console;

try {
  eval(jobsSrc);
  console.log('Script loaded successfully');

  // Can't directly access renderJobs because it's inside an IIFE.
  // We'll see if there's any immediate error.
} catch(e) {
  console.error(e);
}
