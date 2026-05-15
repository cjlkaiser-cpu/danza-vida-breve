// ─────────────────────────────────────────────────────────────────────────────
// Score Player — Tab "Partitura"
// Comparte #refVideo con el reproductor principal de app.js.
// Accede a globals de app.js: pointA, pointB, loopActive, seekRefVideo,
//   updateABTimeline, showNotification, formatTime, PASAJES
// Depende de: ANNOTATIONS_DATA (annotations-data.js)
// ─────────────────────────────────────────────────────────────────────────────
(function () {
  'use strict';

  // ── estado ──────────────────────────────────────────────────────────────────
  let active        = false;
  let curPage       = 0;      // 0-based
  let loopDefine    = 0;      // 0=off 1=esperando-A 2=esperando-B
  let loopAIdx      = null;   // índice en ANNOTATIONS_DATA
  let loopBIdx      = null;
  let rafId         = null;
  let seekDragging  = false;
  let seekWasPlay   = false;
  let initialized   = false;

  // ── DOM (asignados en init) ──────────────────────────────────────────────────
  let img, wrapper, hl;

  // ── constantes highlight ─────────────────────────────────────────────────────
  const HL_H   = 0.13;  // altura del recuadro (fracción de imagen)
  const HL_TOP = 0.01;  // offset hacia arriba desde el punto de click
  const Y_THR  = 0.07;  // umbral mismo-sistema (fila)

  // ── helpers DOM ─────────────────────────────────────────────────────────────
  function $(id) { return document.getElementById(id); }

  function audio() { return $('refVideo'); }

  // Convierte coordenadas 0-1 (fracción de imagen) a píxeles dentro del wrapper
  function imgToWrapper(x, y, w, h) {
    const ir = img.getBoundingClientRect();
    const wr = wrapper.getBoundingClientRect();
    const ox = ir.left - wr.left, oy = ir.top - wr.top;
    return {
      left:   (ox + x * ir.width)  + 'px',
      top:    (oy + y * ir.height) + 'px',
      width:  (w * ir.width)       + 'px',
      height: (h * ir.height)      + 'px',
    };
  }

  // ── anotaciones ─────────────────────────────────────────────────────────────
  function pageAnnots(pageN) {
    return ANNOTATIONS_DATA
      .filter(a => a.page === pageN)
      .sort((a, b) => a.time - b.time);
  }

  function pageFirstTime(pageN) {
    const pa = pageAnnots(pageN);
    if (pa.length) return pa[0].time;
    // fallback: startTime del pasaje correspondiente
    return (typeof PASAJES !== 'undefined' && PASAJES[pageN - 1])
      ? (PASAJES[pageN - 1].startTime ?? 0) : 0;
  }

  function pageForTime(t) {
    let idx = 0;
    for (let i = 0; i < 14; i++) {
      if (pageFirstTime(i + 1) <= t) idx = i;
    }
    return idx;
  }

  function sectionForPage(pageN) {
    if (typeof PASAJES === 'undefined') return '';
    const sec = PASAJES[pageN - 1]?.seccion;
    return ({ apertura: 'Apertura', desarrollo: 'Desarrollo',
              climax: 'Clímax', coda: 'Coda' })[sec] ?? '';
  }

  // ── página ──────────────────────────────────────────────────────────────────
  function showPage(idx) {
    curPage = Math.max(0, Math.min(idx, 13));
    const n = curPage + 1;
    img.src = `img/danza_page-${String(n).padStart(2, '0')}.png`;
    $('spPageInfo').textContent   = `${n} / 14`;
    $('spPrevPage').disabled      = curPage === 0;
    $('spNextPage').disabled      = curPage === 13;
    hideHL();
    renderMarkers();
  }

  // ── highlight ────────────────────────────────────────────────────────────────
  function hideHL() { hl.style.display = 'none'; }

  function updateHL(t) {
    const pa = pageAnnots(curPage + 1);
    if (!pa.length) { hideHL(); return; }

    let active = null;
    for (const a of pa) { if (a.time <= t) active = a; }
    if (!active) { hideHL(); return; }

    const nextA = pa[pa.indexOf(active) + 1];
    const w = (nextA && Math.abs(nextA.y - active.y) < Y_THR)
      ? Math.max(nextA.x - active.x, 0.04)
      : Math.max(0.95 - active.x, 0.04);

    Object.assign(hl.style, {
      display: 'block',
      ...imgToWrapper(active.x, active.y - HL_TOP, w, HL_H),
    });
  }

  // ── marcadores de loop ───────────────────────────────────────────────────────
  function renderMarkers() {
    wrapper.querySelectorAll('.sp-marker').forEach(e => e.remove());
    const pageN = curPage + 1;

    [[loopAIdx, 'sp-marker-a'], [loopBIdx, 'sp-marker-b']].forEach(([idx, cls]) => {
      if (idx === null) return;
      const a = ANNOTATIONS_DATA[idx];
      if (!a || a.page !== pageN) return;
      const el = document.createElement('div');
      el.className = 'sp-marker ' + cls;
      // pa: siguiente anotación en la misma página para calcular ancho
      const pa = pageAnnots(pageN);
      const ai = pa.findIndex(p => p === a);
      const next = pa[ai + 1];
      const w = (next && Math.abs(next.y - a.y) < Y_THR)
        ? Math.max(next.x - a.x, 0.04) : Math.max(0.95 - a.x, 0.04);
      Object.assign(el.style, imgToWrapper(a.x, a.y - HL_TOP, w, HL_H));
      wrapper.appendChild(el);
    });
  }

  // ── click en partitura ───────────────────────────────────────────────────────
  function handleScoreClick(e) {
    // ignorar si el gesto es de scroll táctil
    if (e.pointerType === 'touch' && e.type === 'pointerdown') {
      // Defer to pointerup to distinguish tap from scroll
      return;
    }
    processClick(e);
  }

  function handleScoreTap(e) {
    // Para touch usamos pointerup
    processClick(e);
  }

  function processClick(e) {
    const r = img.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top)  / r.height;
    if (x < 0 || x > 1 || y < 0 || y > 1) return;

    const pageN = curPage + 1;
    const pa = ANNOTATIONS_DATA.filter(a => a.page === pageN);
    if (!pa.length) return;

    // Compás más cercano al click (x pesado más que y)
    let best = null, bestD = Infinity;
    for (const a of pa) {
      const d = Math.hypot((a.x - x) * 1.5, a.y - y);
      if (d < bestD) { bestD = d; best = a; }
    }
    if (!best || bestD > 0.3) return;

    const gIdx = ANNOTATIONS_DATA.indexOf(best);

    if (loopDefine === 1) {
      // Fijar punto A
      loopAIdx = gIdx; loopBIdx = null; loopDefine = 2;
      updateLoopUI(); renderMarkers();
      seekRefVideo(best.time);
      showNotification(`A → cc. ${gIdx + 1}`, 'success');

    } else if (loopDefine === 2) {
      // Fijar punto B
      if (gIdx === loopAIdx) return; // mismo compás: ignorar
      const [aI, bI] = gIdx > loopAIdx ? [loopAIdx, gIdx] : [gIdx, loopAIdx];
      loopAIdx = aI; loopBIdx = bI; loopDefine = 0;
      activateLoop();
      renderMarkers();
      showNotification(`Loop cc.${aI + 1} – cc.${bI + 1}`, 'success');

    } else {
      // Modo normal: saltar al compás
      seekRefVideo(best.time);
      // No cambiar página manualmente — el tick lo hace si está sonando
      // Si está parado, mostramos la página correcta
      const aud = audio();
      if (aud?.paused) showPage(pageForTime(best.time));
    }
  }

  // ── loop ─────────────────────────────────────────────────────────────────────
  function activateLoop() {
    pointA = ANNOTATIONS_DATA[loopAIdx].time;
    pointB = ANNOTATIONS_DATA[loopBIdx].time;
    loopActive = true;
    updateABTimeline?.();
    const lb = $('loopBtn');
    if (lb) { lb.classList.add('active'); lb.textContent = '↩ Loop ON'; }
    seekRefVideo(pointA);
    updateLoopUI();
  }

  function clearLoop() {
    loopAIdx = null; loopBIdx = null; loopDefine = 0;
    loopActive = false; pointB = null;
    updateABTimeline?.();
    const lb = $('loopBtn');
    if (lb) { lb.classList.remove('active'); lb.textContent = '↩ Loop'; }
    updateLoopUI();
    renderMarkers();
  }

  function updateLoopUI() {
    const btn    = $('spLoopBtn');
    const status = $('spLoopStatus');
    if (loopDefine === 1) {
      btn.textContent = '● A…'; btn.classList.add('active');
      status.textContent = 'click en compás inicial';
    } else if (loopDefine === 2) {
      btn.textContent = '● B…'; btn.classList.add('active');
      status.textContent = `A=cc.${loopAIdx + 1} · click en compás final`;
    } else {
      btn.textContent = '⟳ Loop'; btn.classList.remove('active');
      status.textContent = (loopAIdx !== null && loopBIdx !== null)
        ? `cc.${loopAIdx + 1}–${loopBIdx + 1}` : '';
    }
  }

  // ── seekbar ──────────────────────────────────────────────────────────────────
  function doSeek(e) {
    const aud = audio();
    if (!aud?.duration) return;
    const r = $('spSeekWrap').getBoundingClientRect();
    const t = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * aud.duration;
    aud.currentTime = t;
    showPage(pageForTime(t));
  }

  // ── RAF tick ─────────────────────────────────────────────────────────────────
  function tick() {
    if (!active) return;
    rafId = requestAnimationFrame(tick);

    const aud = audio();
    if (!aud?.duration) return;

    const t   = aud.currentTime;
    const pct = (t / aud.duration) * 100;

    $('spSeekFill').style.width  = pct + '%';
    $('spSeekThumb').style.left  = pct + '%';
    $('spTimeDisplay').textContent = (typeof formatTime === 'function')
      ? formatTime(t) : fmtTime(t);

    // Auto-avance de página solo si está sonando
    if (!aud.paused) {
      const pi = pageForTime(t);
      if (pi !== curPage) showPage(pi);
    }

    updateHL(t);

    // Número de compás
    let mIdx = -1;
    for (let i = 0; i < ANNOTATIONS_DATA.length; i++) {
      if (ANNOTATIONS_DATA[i].time <= t) mIdx = i; else break;
    }
    if (mIdx >= 0) {
      const sec = sectionForPage(ANNOTATIONS_DATA[mIdx].page);
      $('spMeasureInfo').textContent = `cc. ${mIdx + 1}${sec ? '  ·  ' + sec : ''}`;
    }
  }

  function fmtTime(s) {
    return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  }

  // ── init ─────────────────────────────────────────────────────────────────────
  function init() {
    img     = $('spImg');
    wrapper = $('spWrapper');
    hl      = $('spHL');

    showPage(0);

    // Click en partitura — touch usa pointerup para distinguir tap/scroll
    img.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'touch') processClick(e);
    });
    img.addEventListener('pointerup', e => {
      if (e.pointerType === 'touch') processClick(e);
    });

    // Navegación de página
    $('spPrevPage').addEventListener('click', () => showPage(curPage - 1));
    $('spNextPage').addEventListener('click', () => showPage(curPage + 1));

    // Loop
    $('spLoopBtn').addEventListener('click', () => {
      loopDefine = loopDefine === 0 ? 1 : 0;
      updateLoopUI();
    });
    $('spClearLoop').addEventListener('click', clearLoop);

    // Seekbar (pointer capture para drag fuera del elemento)
    const seekWrap = $('spSeekWrap');
    seekWrap.addEventListener('pointerdown', e => {
      const aud = audio();
      if (!aud?.duration) return;
      seekWasPlay = !aud.paused;
      if (seekWasPlay) aud.pause();
      seekDragging = true;
      seekWrap.setPointerCapture(e.pointerId);
      doSeek(e);
    });
    seekWrap.addEventListener('pointermove', e => { if (seekDragging) doSeek(e); });
    seekWrap.addEventListener('pointerup', () => {
      if (seekDragging) {
        seekDragging = false;
        if (seekWasPlay) audio()?.play();
      }
    });

    // Resize: reposicionar overlays
    window.addEventListener('resize', () => {
      if (active) { renderMarkers(); hideHL(); }
    });

    initialized = true;
  }

  // ── Auto-init (scripts cargan después del DOM) ───────────────────────────────
  init();
  active = true;
  rafId = requestAnimationFrame(tick);
})();
