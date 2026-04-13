(function() {
  let jobs = [];
  let currentIndex = 0;
  let cart = [];

  const container = document.getElementById('tinderCardsContainer');
  const noMoreCards = document.getElementById('tinderNoMoreCards');
  const btnNope = document.getElementById('tinderBtnNope');
  const btnLike = document.getElementById('tinderBtnLike');
  const cartList = document.getElementById('tinderCartList');
  const cartCount = document.getElementById('tinderCartCount');
  const cartEmpty = document.getElementById('tinderCartEmpty');
  const applyAllBtn = document.getElementById('tinderApplyAllBtn');

  // Helper to get localized field based on site lang
  function getLocalizedValue(job, field, lang) {
    if (!job) return '';
    if (lang === 'ua' && field === 'title') return job.title_ua || job.title || '';
    if (lang === 'ua' && field === 'excerpt') return job.excerpt_ua || job.excerpt || '';
    if (lang === 'ua' && field === 'city') return job.city_ua || job.city || '';
    if (lang === 'ua' && field === 'company') return job.company_ua || job.company || '';

    if (lang === 'pl' && field === 'title') return job.title_pl || job.title || '';
    if (lang === 'pl' && field === 'excerpt') return job.excerpt_pl || job.excerpt || '';
    if (lang === 'pl' && field === 'city') return job.city_pl || job.city || '';
    if (lang === 'pl' && field === 'company') return job.company_pl || job.company || '';

    if (lang === 'ru' && field === 'title') return job.title_ru || job.title || '';
    if (lang === 'ru' && field === 'excerpt') return job.excerpt_ru || job.excerpt || '';
    if (lang === 'ru' && field === 'city') return job.city_ru || job.city || '';
    if (lang === 'ru' && field === 'company') return job.company_ru || job.company || '';

    if (lang === 'en' && field === 'title') return job.title_en || job.title || '';
    if (lang === 'en' && field === 'excerpt') return job.excerpt_en || job.excerpt || '';
    if (lang === 'en' && field === 'city') return job.city_en || job.city || '';
    if (lang === 'en' && field === 'company') return job.company_en || job.company || '';

    return job[field] || '';
  }

  // Load cart from localStorage
  function loadCart() {
    try {
      const saved = localStorage.getItem('tinder_cart');
      if (saved) {
        cart = JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load cart', e);
      cart = [];
    }
    renderCart();
  }

  // Save cart to localStorage
  function saveCart() {
    localStorage.setItem('tinder_cart', JSON.stringify(cart));
    renderCart();
  }

  // Render the cart sidebar
  function renderCart() {
    if (!cartList) return;

    cartCount.textContent = cart.length;

    if (cart.length === 0) {
      cartEmpty.style.display = 'block';
      applyAllBtn.disabled = true;
      // Clear other items
      Array.from(cartList.children).forEach(child => {
        if (child !== cartEmpty) child.remove();
      });
      return;
    }

    cartEmpty.style.display = 'none';
    applyAllBtn.disabled = false;

    // Clear list (except empty state which is hidden)
    Array.from(cartList.children).forEach(child => {
      if (child !== cartEmpty) child.remove();
    });

    const lang = localStorage.getItem('site_lang') || 'ua';

    cart.forEach((job, index) => {
      const item = document.createElement('div');
      item.className = 'tinder-cart-item';

      const title = getLocalizedValue(job, 'title', lang);
      const city = getLocalizedValue(job, 'city', lang);

      item.innerHTML = `
        <div class="tinder-cart-item-info">
          <div class="tinder-cart-item-title">${title}</div>
          <div class="tinder-cart-item-city">${city}</div>
        </div>
        <button class="tinder-cart-item-remove" data-slug="${job.slug}">×</button>
      `;

      cartList.appendChild(item);
    });

    // Add remove listeners
    document.querySelectorAll('.tinder-cart-item-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const slug = e.target.getAttribute('data-slug');
        cart = cart.filter(j => j.slug !== slug);
        saveCart();
      });
    });
  }

  // Shuffle array utility
  function shuffleArray(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Load jobs data
  async function loadJobs() {
    let rawJobs = [];
    if (window.ALL_JOBS && window.ALL_JOBS.length > 0) {
      rawJobs = window.ALL_JOBS;
    } else {
      try {
        const res = await fetch('/jobs-data.json');
        rawJobs = await res.json();
      } catch (e) {
        console.error('Failed to load jobs', e);
      }
    }

    // Filter out jobs already in cart
    const cartSlugs = cart.map(j => j.slug);
    jobs = rawJobs.filter(j => !cartSlugs.includes(j.slug));

    // Shuffle jobs for Tinder-like experience
    jobs = shuffleArray(jobs);

    renderCards();
  }

  function renderCards() {
    if (!container) return;

    // Remove existing cards
    const existingCards = document.querySelectorAll('.tinder-card');
    existingCards.forEach(c => c.remove());

    const lang = localStorage.getItem('site_lang') || 'ua';

    // We render up to 3 cards for a stack effect, starting from currentIndex
    // Backwards loop so the currentIndex is on top (highest z-index)
    const maxCards = Math.min(jobs.length - currentIndex, 3);

    if (maxCards <= 0) {
      noMoreCards.style.display = 'flex';
      btnLike.disabled = true;
      btnNope.disabled = true;
      return;
    }

    noMoreCards.style.display = 'none';
    btnLike.disabled = false;
    btnNope.disabled = false;

    for (let i = maxCards - 1; i >= 0; i--) {
      const jobIndex = currentIndex + i;
      const job = jobs[jobIndex];

      const card = document.createElement('div');
      card.className = 'tinder-card';
      // Stack effect styling
      const scale = 1 - (i * 0.05);
      const translateY = i * 15;
      card.style.transform = `scale(${scale}) translateY(${translateY}px)`;
      card.style.zIndex = maxCards - i;

      if (i === 0) {
        // Only top card is draggable
        card.id = 'tinderCurrentCard';
        initDragAndDrop(card, job);
      }

      // Card Content
      const title = getLocalizedValue(job, 'title', lang);
      const city = getLocalizedValue(job, 'city', lang);
      const company = getLocalizedValue(job, 'company', lang);
      const excerpt = getLocalizedValue(job, 'excerpt', lang);

      card.innerHTML = `
        <div class="tinder-badge like">LIKE</div>
        <div class="tinder-badge nope">NOPE</div>
        <div class="tinder-card-content">
          ${job.category ? `<div class="tinder-card-category">${job.category}</div>` : ''}
          <div class="tinder-card-title">${title}</div>
          ${job.salary ? `<div class="tinder-card-salary">💰 ${job.salary}</div>` : ''}
          ${company ? `<div class="tinder-card-detail">🏢 ${company}</div>` : ''}
          <div class="tinder-card-detail">📍 ${city}</div>
          <div class="tinder-card-excerpt">${excerpt}</div>
        </div>
      `;

      container.appendChild(card);
    }
  }

  function handleSwipe(card, job, direction) {
    // direction: 1 for right (like), -1 for left (nope)

    // Animate out
    const x = direction * (window.innerWidth);
    card.style.transform = `translate(${x}px, 0) rotate(${direction * 30}deg)`;
    card.style.opacity = '0';

    setTimeout(() => {
      if (direction === 1) {
        // Add to cart
        cart.push(job);
        saveCart();
      }

      currentIndex++;
      renderCards();
    }, 300);
  }

  function initDragAndDrop(card, job) {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;

    const badgeLike = card.querySelector('.tinder-badge.like');
    const badgeNope = card.querySelector('.tinder-badge.nope');

    function onMove(clientX, clientY) {
      if (!isDragging) return;

      currentX = clientX - startX;
      currentY = clientY - startY;

      const rotate = currentX * 0.05;
      card.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotate}deg)`;

      // Opacity of badges
      const opacity = Math.min(Math.abs(currentX) / 100, 1);
      if (currentX > 0) {
        badgeLike.style.opacity = opacity;
        badgeNope.style.opacity = 0;
      } else {
        badgeNope.style.opacity = opacity;
        badgeLike.style.opacity = 0;
      }
    }

    function onEnd() {
      if (!isDragging) return;
      isDragging = false;
      card.style.transition = 'transform 0.3s ease, opacity 0.3s ease';

      // Threshold for swipe
      const threshold = 100;
      if (currentX > threshold) {
        handleSwipe(card, job, 1);
      } else if (currentX < -threshold) {
        handleSwipe(card, job, -1);
      } else {
        // Reset position
        card.style.transform = 'scale(1) translateY(0px)';
        badgeLike.style.opacity = 0;
        badgeNope.style.opacity = 0;
      }
    }

    // Touch events
    card.addEventListener('touchstart', (e) => {
      isDragging = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      card.style.transition = 'none'; // remove transition for smooth drag
    });

    card.addEventListener('touchmove', (e) => {
      // prevent scrolling while dragging
      e.preventDefault();
      onMove(e.touches[0].clientX, e.touches[0].clientY);
    });

    card.addEventListener('touchend', onEnd);

    // Mouse events
    card.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      card.style.transition = 'none';
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) onMove(e.clientX, e.clientY);
    });

    document.addEventListener('mouseup', onEnd);
  }

  // Init
  document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    loadJobs();

    if (btnNope) {
      btnNope.addEventListener('click', () => {
        const card = document.getElementById('tinderCurrentCard');
        if (card && jobs[currentIndex]) handleSwipe(card, jobs[currentIndex], -1);
      });
    }

    if (btnLike) {
      btnLike.addEventListener('click', () => {
        const card = document.getElementById('tinderCurrentCard');
        if (card && jobs[currentIndex]) handleSwipe(card, jobs[currentIndex], 1);
      });
    }

    if (applyAllBtn) {
      applyAllBtn.addEventListener('click', () => {
        if (cart.length === 0) return;

        // Pass slugs via URL param
        const slugs = cart.map(j => j.slug).join(',');
        window.location.href = `/respond.html?jobs=${encodeURIComponent(slugs)}`;
      });
    }
  });

})();
