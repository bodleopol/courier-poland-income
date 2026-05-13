(function () {
  'use strict';

  const root = document.querySelector('[data-interview-drill]');
  if (!root || !window.INTERVIEW_BANK) return;

  const lang = document.documentElement.getAttribute('lang') || 'uk';
  const BANK = window.INTERVIEW_BANK[lang];
  if (!BANK) return;
  const MC = window.INTERVIEW_MCQ?.[lang] || null;

  const SIZE = window.INTERVIEW_BANK_SIZE || 10000;
  const BATCH = window.INTERVIEW_BATCH_SIZE || 4;
  const maxPage = Math.floor((SIZE - 1) / BATCH);

  const ui = {
    notes: lang === 'uk' ? 'Нотатки до відповіді' : 'Notes',
    empty: lang === 'uk' ? 'За поточними фільтрами у цьому пакеті немає питань. Спробуйте інший фільтр або натисніть «Випадковий пакет».' : 'No questions in this batch for selected filters.',
    score: lang === 'uk' ? 'Результат тесту' : 'Score',
    all: lang === 'uk' ? 'Усі теми' : 'All topics',
    comm: lang === 'uk' ? 'Комунікація' : 'Communication',
    exec: lang === 'uk' ? 'Виконання' : 'Execution',
    tech: lang === 'uk' ? 'Техніка/якість' : 'Tech/quality'
  };

  const el = {
    learn: document.querySelector('[data-iv-learn]'),
    track: root.querySelector('[data-iv-track]'),
    mode: root.querySelector('[data-iv-mode]'),
    specialty: root.querySelector('[data-iv-specialty]'),
    prev: root.querySelector('[data-iv-prev]'),
    next: root.querySelector('[data-iv-next]'),
    jump: root.querySelector('[data-iv-jump]'),
    jumpBtn: root.querySelector('[data-iv-jump-btn]'),
    random: root.querySelector('[data-iv-random]'),
    prog: root.querySelector('[data-iv-progress]'),
    list: root.querySelector('[data-iv-list]'),
    copy: root.querySelector('[data-iv-copy]'),
    context: root.querySelector('[data-iv-context]')
  };

  const topicSelect = document.createElement('select');
  topicSelect.className = 'interview-drill__select';
  [['all', ui.all], ['comm', ui.comm], ['exec', ui.exec], ['tech', ui.tech]].forEach(([v, t]) => {
    const o = document.createElement('option'); o.value = v; o.textContent = t; topicSelect.appendChild(o);
  });
  const topicWrap = document.createElement('div');
  topicWrap.className = 'interview-drill__field';
  topicWrap.innerHTML = `<label class="interview-drill__label">${lang === 'uk' ? 'Фільтр теми' : 'Topic filter'}</label>`;
  topicWrap.appendChild(topicSelect);
  root.querySelector('.interview-drill__toolbar')?.appendChild(topicWrap);

  let page = 0;
  let track = 0;
  let mode = 'open';
  let specialtyId = MC?.specialties?.[0]?.id || '';
  let topic = 'all';
  let scoreOk = 0;
  let scoreTotal = 0;

  const scoreEl = document.createElement('p');
  scoreEl.className = 'interview-drill__progress';
  root.insertBefore(scoreEl, el.prog.nextSibling);

  function mix32(a, b, c) {
    let x = (Math.imul(a, 374761393) + Math.imul(b, 668265263) + Math.imul(c, 1442695041)) >>> 0;
    x = (x ^ (x >>> 13)) >>> 0;
    x = Math.imul(x, 1274126177) >>> 0;
    return (x ^ (x >>> 16)) >>> 0;
  }
  function situationFor(si) {
    const o = BANK.orgs[si % BANK.orgs.length];
    const z = BANK.stressors[Math.floor(si / BANK.orgs.length) % BANK.stressors.length];
    return BANK.situationTpl.replace('{org}', o).replace('{stress}', z);
  }
  function questionAt(idx, roleShift) {
    const R = BANK.roles.length;
    const nSit = BANK.orgs.length * BANK.stressors.length;
    const C = BANK.competencies.length;
    const L = BANK.lenses.length;
    let t = idx;
    const ir0 = t % R; t = Math.floor(t / R);
    const isit = t % nSit; t = Math.floor(t / nSit);
    const ic = t % C; t = Math.floor(t / C);
    const il = t % L;
    const ir = (ir0 + roleShift) % R;
    return BANK.lenses[il]
      .replace(/\{role\}/g, BANK.roles[ir])
      .replace(/\{situation\}/g, situationFor(isit))
      .replace(/\{competency\}/g, BANK.competencies[ic])
      .replace(/\{horizon\}/g, BANK.horizons[idx % BANK.horizons.length]);
  }
  function mcqQuestion(specId, idx) {
    const si = Math.max(0, MC.specialties.findIndex((s) => s.id === specId));
    const row = MC.catalog[mix32(idx, si, 0) % MC.catalog.length];
    const stem = row.stem.replace(/\{s\}/g, MC.specialties[si]?.label || '');
    const correct = row.correct.replace(/\{s\}/g, MC.specialties[si]?.label || '');
    const wrongs = row.wrongs.map((w) => w.replace(/\{s\}/g, MC.specialties[si]?.label || '')).slice(0, 4);
    const correctPos = mix32(idx, si, 999) % 5;
    const options = [];
    for (let i = 0, j = 0; i < 5; i += 1) options.push(i === correctPos ? correct : wrongs[j++]);
    return { stem, correctPos, options };
  }

  function passTopic(text) {
    if (topic === 'all') return true;
    const low = text.toLowerCase();
    const map = {
      comm: ['stakeholder', 'комун', 'communication', 'конфлікт', 'client'],
      exec: ['roadmap', 'delivery', 'backlog', 'пріоритет', 'deadline'],
      tech: ['incident', 'security', 'latency', 'slo', 'test', 'quality']
    };
    return map[topic].some((k) => low.includes(k));
  }

  function render() {
    el.list.innerHTML = '';
    let visible = 0;
    for (let k = 0; k < BATCH; k += 1) {
      const idx = page * BATCH + k;
      if (idx >= SIZE) break;
      const qObj = mode === 'mcq' && MC ? mcqQuestion(specialtyId, idx) : null;
      const text = qObj ? qObj.stem : questionAt(idx, track);
      if (!passTopic(text)) continue;
      visible += 1;

      const li = document.createElement('li'); li.className = 'interview-drill__item';
      const p = document.createElement('p'); p.className = 'interview-drill__q'; p.textContent = text;
      li.appendChild(p);

      if (qObj) {
        const box = document.createElement('div'); box.className = 'interview-drill__mcq';
        const fb = document.createElement('p'); fb.className = 'interview-drill__mcq-feedback'; fb.hidden = true;
        qObj.options.forEach((opt, oi) => {
          const row = document.createElement('label'); row.className = 'interview-drill__mcq-row';
          const input = document.createElement('input'); input.type = 'radio'; input.name = `q-${idx}`;
          input.addEventListener('change', () => {
            scoreTotal += 1;
            if (oi === qObj.correctPos) scoreOk += 1;
            scoreEl.textContent = `${ui.score}: ${scoreOk}/${scoreTotal}`;
            fb.hidden = false;
            fb.textContent = oi === qObj.correctPos ? '✅' : `❌ ${lang === 'uk' ? 'Кращий варіант позначений нижче.' : 'Best answer highlighted below.'}`;
          });
          row.appendChild(input);
          row.append(` ${opt}`);
          box.appendChild(row);
        });
        li.appendChild(box);
        li.appendChild(fb);
      }

      const ta = document.createElement('textarea');
      ta.className = 'interview-drill__notes'; ta.rows = 3; ta.placeholder = `${ui.notes} #${idx + 1}`;
      const key = `iv-note-${lang}-${mode}-${specialtyId}-${idx}`;
      ta.value = localStorage.getItem(key) || '';
      ta.addEventListener('input', () => localStorage.setItem(key, ta.value));
      li.appendChild(ta);
      el.list.appendChild(li);
    }

    if (!visible) {
      const empty = document.createElement('li');
      empty.className = 'interview-drill__item';
      empty.textContent = ui.empty;
      el.list.appendChild(empty);
    }

    el.prog.textContent = `Пакет ${page + 1} / ${maxPage + 1}`;
    if (el.jump) el.jump.value = String(page + 1);
    if (el.prev) el.prev.disabled = page <= 0;
    if (el.next) el.next.disabled = page >= maxPage;

    if (el.learn) el.learn.innerHTML = mode === 'mcq'
      ? '<p><strong>MCQ-підхід:</strong> обирайте варіант з ризиками, метриками та планом дій.</p>'
      : '<p><strong>STAR-підхід:</strong> Situation → Task → Action → Result.</p>';
  }

  el.prev?.addEventListener('click', () => { page = Math.max(0, page - 1); render(); });
  el.next?.addEventListener('click', () => { page = Math.min(maxPage, page + 1); render(); });
  el.jumpBtn?.addEventListener('click', () => { const v = Number(el.jump.value); if (v >= 1 && v <= maxPage + 1) { page = v - 1; render(); } });
  el.random?.addEventListener('click', () => { page = Math.floor(Math.random() * (maxPage + 1)); render(); });
  topicSelect.addEventListener('change', () => { topic = topicSelect.value; render(); });

  if (el.track) { el.track.innerHTML = ''; for (let i = 0; i < 8; i += 1) { const o = document.createElement('option'); o.value = String(i); o.textContent = `Зсув +${i}`; el.track.appendChild(o); } el.track.addEventListener('change', () => { track = Number(el.track.value) || 0; render(); }); }
  if (MC && el.mode) { el.mode.innerHTML = '<option value="open">Open</option><option value="mcq">MCQ</option>'; el.mode.addEventListener('change', () => { mode = el.mode.value; render(); }); }
  if (MC && el.specialty) { el.specialty.innerHTML = MC.specialties.map((s) => `<option value="${s.id}">${s.label}</option>`).join(''); el.specialty.addEventListener('change', () => { specialtyId = el.specialty.value; render(); }); }

  render();
})();
