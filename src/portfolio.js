(function () {
  const toggle = document.querySelector('.nav-toggle');
  const panel = document.getElementById('mobile-nav');
  if (!toggle || !panel) return;

  function setOpen(open) {
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    panel.hidden = !open;
  }

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });

  window.matchMedia('(min-width: 760px)').addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
})();
