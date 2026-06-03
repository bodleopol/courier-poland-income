(function () {
  const toggle = document.querySelector('.nav-toggle');
  const panel = document.getElementById('mobile-nav');
  if (!toggle || !panel) return;

  const openLabel = 'Відкрити меню';
  const closeLabel = 'Закрити меню';

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? closeLabel : openLabel);
    panel.hidden = !open;
  }

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('click', (event) => {
    if (panel.hidden) return;
    if (panel.contains(event.target) || toggle.contains(event.target)) return;
    setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });

  const desktopQuery = window.matchMedia('(min-width: 820px)');
  const closeOnDesktop = (event) => {
    if (event.matches) setOpen(false);
  };

  if (desktopQuery.addEventListener) {
    desktopQuery.addEventListener('change', closeOnDesktop);
  } else if (desktopQuery.addListener) {
    desktopQuery.addListener(closeOnDesktop);
  }
})();
