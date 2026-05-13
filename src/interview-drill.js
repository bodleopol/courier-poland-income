(function () {
  'use strict';

  const root = document.querySelector('[data-interview-drill]');
  if (!root) return;

  const lang = document.documentElement.getAttribute('lang') || 'uk';
  const mcBank = window.INTERVIEW_MCQ?.[lang] || null;
  const openBank = window.INTERVIEW_BANK?.[lang] || null;
  if (!mcBank && !openBank) return;

  const SIZE = window.INTERVIEW_BANK_SIZE || 10000;
  const BATCH = window.INTERVIEW_BATCH_SIZE || 4;
  const maxPage = Math.floor((SIZE - 1) / BATCH);

  const ui = {
    notes: 'Нотатки до відповіді', empty: 'За поточним фільтром питань немає. Спробуйте іншу тему або випадковий пакет.', score: 'Результат тесту',
    all: 'Усі теми', comm: 'Комунікація', exec: 'Виконання', tech: 'Техніка/якість'
  };

  const el = {
    learn: document.querySelector('[data-iv-learn]'), track: root.querySelector('[data-iv-track]'), mode: root.querySelector('[data-iv-mode]'),
    specialty: root.querySelector('[data-iv-specialty]'), prev: root.querySelector('[data-iv-prev]'), next: root.querySelector('[data-iv-next]'),
    jump: root.querySelector('[data-iv-jump]'), jumpBtn: root.querySelector('[data-iv-jump-btn]'), random: root.querySelector('[data-iv-random]'),
    prog: root.querySelector('[data-iv-progress]'), list: root.querySelector('[data-iv-list]'), copy: root.querySelector('[data-iv-copy]')
  };

  const topicSelect = document.createElement('select');
  topicSelect.className = 'interview-drill__select';
  [['all', ui.all], ['comm', ui.comm], ['exec', ui.exec], ['tech', ui.tech]].forEach(([v, t]) => { const o = document.createElement('option'); o.value = v; o.textContent = t; topicSelect.appendChild(o); });
  const topicWrap = document.createElement('div'); topicWrap.className = 'interview-drill__field'; topicWrap.innerHTML = '<label class="interview-drill__label">Фільтр теми</label>'; topicWrap.appendChild(topicSelect);
  root.querySelector('.interview-drill__toolbar')?.appendChild(topicWrap);

  let page = Math.max(0, (Number(new URLSearchParams(location.search).get('p')) || 1) - 1);
  let track = 0;
  let mode = mcBank ? 'mcq' : 'open';
  let specialtyId = mcBank?.specialties?.[0]?.id || '';
  let topic = 'all';
  let scoreOk = 0;
  let scoreTotal = 0;
  let streak = 0;
  let bestStreak = 0;

  const scoreEl = document.createElement('p'); scoreEl.className = 'interview-drill__progress'; root.insertBefore(scoreEl, el.prog.nextSibling);

  const sp = new URLSearchParams(location.search);
  const startTopic = sp.get('topic');
  if (startTopic && ['all','comm','exec','tech'].includes(startTopic)) topic = startTopic;
  const startMode = sp.get('mode');
  if (startMode && ['mcq','open'].includes(startMode)) mode = startMode;
  const startSpec = sp.get('spec');
  if (startSpec) specialtyId = startSpec;
  const startTrack = Number(sp.get('track')); if (!Number.isNaN(startTrack) && startTrack >= 0 && startTrack <= 7) track = startTrack;


  function mix32(a, b, c) { let x = (Math.imul(a, 374761393) + Math.imul(b, 668265263) + Math.imul(c, 1442695041)) >>> 0; x = (x ^ (x >>> 13)) >>> 0; x = Math.imul(x, 1274126177) >>> 0; return (x ^ (x >>> 16)) >>> 0; }
  function mcqQuestion(specId, idx) {
    const si = Math.max(0, mcBank.specialties.findIndex((s) => s.id === specId));
    const row = mcBank.catalog[mix32(idx, si, 0) % mcBank.catalog.length];
    const stem = row.stem.replace(/\{s\}/g, mcBank.specialties[si]?.label || '');
    const correct = row.correct.replace(/\{s\}/g, mcBank.specialties[si]?.label || '');
    const wrongs = row.wrongs.map((w) => w.replace(/\{s\}/g, mcBank.specialties[si]?.label || '')).slice(0, 4);
    const correctPos = mix32(idx, si, 999) % 5;
    const options = [];
    for (let i = 0, j = 0; i < 5; i += 1) options.push(i === correctPos ? correct : wrongs[j++]);
    return { stem, correctPos, options };
  }

  function openQuestion(idx, roleShift) {
    if (!openBank) return mcqQuestion(specialtyId, idx).stem;
    const R = openBank.roles.length; const nSit = openBank.orgs.length * openBank.stressors.length; const C = openBank.competencies.length; const L = openBank.lenses.length;
    let t = idx; const ir0 = t % R; t = Math.floor(t / R); const isit = t % nSit; t = Math.floor(t / nSit); const ic = t % C; t = Math.floor(t / C); const il = t % L;
    const ir = (ir0 + roleShift) % R; const o = openBank.orgs[isit % openBank.orgs.length]; const z = openBank.stressors[Math.floor(isit / openBank.orgs.length) % openBank.stressors.length];
    const situation = openBank.situationTpl.replace('{org}', o).replace('{stress}', z);
    return openBank.lenses[il].replace(/\{role\}/g, openBank.roles[ir]).replace(/\{situation\}/g, situation).replace(/\{competency\}/g, openBank.competencies[ic]).replace(/\{horizon\}/g, openBank.horizons[idx % openBank.horizons.length]);
  }

  function passTopic(text) { const low = text.toLowerCase(); if (topic === 'all') return true; const map = { comm: ['stakeholder', 'комун', 'communication', 'конфлікт', 'client'], exec: ['roadmap', 'delivery', 'backlog', 'пріоритет', 'deadline'], tech: ['incident', 'security', 'latency', 'slo', 'test', 'quality'] }; return map[topic].some((k) => low.includes(k)); }

  function render() {
    if (!el.list) return;
    el.list.innerHTML = '';
    let visible = 0;
    for (let k = 0; k < BATCH; k += 1) {
      const idx = page * BATCH + k; if (idx >= SIZE) break;
      const qObj = mode === 'mcq' ? mcqQuestion(specialtyId, idx) : null;
      const text = qObj ? qObj.stem : openQuestion(idx, track);
      if (!passTopic(text)) continue;
      visible += 1;
      const li = document.createElement('li'); li.className = 'interview-drill__item'; li.innerHTML = `<p class="interview-drill__q">${text}</p>`;
      if (qObj) {
        const box = document.createElement('div'); box.className = 'interview-drill__mcq';
        const fb = document.createElement('p'); fb.className = 'interview-drill__mcq-feedback'; fb.hidden = true;
        qObj.options.forEach((opt, oi) => { const row = document.createElement('label'); row.className = 'interview-drill__mcq-row'; row.innerHTML = `<input type="radio" name="q-${idx}"> ${opt}`; row.querySelector('input').addEventListener('change', () => { scoreTotal += 1; if (oi === qObj.correctPos) { scoreOk += 1; streak += 1; bestStreak = Math.max(bestStreak, streak); } else { streak = 0; } const pct = scoreTotal ? Math.round((scoreOk / scoreTotal) * 100) : 0; scoreEl.textContent = `${ui.score}: ${scoreOk}/${scoreTotal} (${pct}%) · streak ${streak} / best ${bestStreak}`; fb.hidden = false; fb.textContent = oi === qObj.correctPos ? '✅ Вірно' : '❌ Кращий варіант позначено як еталонний.'; }); box.appendChild(row); });
        li.appendChild(box); li.appendChild(fb);
      }
      const ta = document.createElement('textarea'); ta.className = 'interview-drill__notes'; ta.rows = 3; ta.placeholder = `${ui.notes} #${idx + 1}`;
      const key = `iv-note-${lang}-${mode}-${specialtyId}-${idx}`; ta.value = localStorage.getItem(key) || ''; ta.addEventListener('input', () => localStorage.setItem(key, ta.value)); li.appendChild(ta);
      el.list.appendChild(li);
    }
    if (!visible) { const empty = document.createElement('li'); empty.className = 'interview-drill__item'; empty.textContent = ui.empty; el.list.appendChild(empty); }
    if (el.prog) el.prog.textContent = `Пакет ${page + 1} / ${maxPage + 1}`;
    if (el.jump) el.jump.value = String(page + 1);
    if (el.prev) el.prev.disabled = page <= 0;
    if (el.next) el.next.disabled = page >= maxPage;
    if (el.learn) el.learn.innerHTML = mode === 'mcq' ? '<p><strong>MCQ:</strong> обирайте відповідь з конкретними діями, метриками, ризиками.</p>' : '<p><strong>Open:</strong> відповідайте у структурі STAR (Situation → Task → Action → Result).</p>';
  }

  el.prev?.addEventListener('click', () => { page = Math.max(0, page - 1); render(); });
  el.next?.addEventListener('click', () => { page = Math.min(maxPage, page + 1); render(); });
  el.jumpBtn?.addEventListener('click', () => { const v = Number(el.jump?.value); if (v >= 1 && v <= maxPage + 1) { page = v - 1; render(); } });
  el.random?.addEventListener('click', () => { page = Math.floor(Math.random() * (maxPage + 1)); render(); });
  topicSelect.value = topic;
  topicSelect.addEventListener('change', () => { topic = topicSelect.value; render(); });
  el.copy?.addEventListener('click', async () => { const u = new URL(location.href); u.searchParams.set('p', String(page + 1)); u.searchParams.set('topic', topic); u.searchParams.set('mode', mode); if (specialtyId) u.searchParams.set('spec', specialtyId); u.searchParams.set('track', String(track)); await navigator.clipboard.writeText(u.toString()); el.copy.textContent = 'Скопійовано'; setTimeout(() => { el.copy.textContent = 'Копіювати пакет'; }, 1200); });

  if (el.track) { el.track.innerHTML = ''; for (let i = 0; i < 8; i += 1) { const o = document.createElement('option'); o.value = String(i); o.textContent = `Зсув +${i}`; el.track.appendChild(o); } el.track.value = String(track); el.track.addEventListener('change', () => { track = Number(el.track.value) || 0; render(); }); }
  if (mcBank && el.mode) { el.mode.innerHTML = '<option value="mcq">MCQ</option><option value="open">Open</option>'; el.mode.value = mode; el.mode.addEventListener('change', () => { mode = el.mode.value; render(); }); }
  if (mcBank && el.specialty) { el.specialty.innerHTML = mcBank.specialties.map((s) => `<option value="${s.id}">${s.label}</option>`).join(''); if (specialtyId) el.specialty.value = specialtyId; el.specialty.addEventListener('change', () => { specialtyId = el.specialty.value; render(); }); }
  if (el.random) el.random.textContent = 'Випадковий пакет';

  render();
})();
