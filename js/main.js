/* finnish website. Creator: Nishan */
(function () {
  'use strict';
  var CS = document.currentScript; window.FN_onlang = window.FN_onlang || [];
  var CFG = window.FINNISH_CONFIG || { links: {}, prices: {}, fallback: ['US', 'International', 'USD', 5], trialDays: 5 };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- toast ---------- */
  var toastEl = $('#toast'), toastT = 0;
  function toast(msg) {
    if (!toastEl) return; toastEl.textContent = tr(msg); toastEl.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('on'); }, 2400);
  }


  /* ---------- language (client-side translation; dictionaries load on demand from js/i18n/) ---------- */
  var LANGS_OK = ['en', 'hi', 'fr', 'es', 'de', 'ja', 'zh', 'ar'], curLang = 'en';
  var BASE_JS = (CS && CS.src) ? CS.src.replace(/main\.js.*$/, '') : 'js/';
  var AT = ['aria-label', 'title', 'alt', 'data-t', 'data-d'];
  function dict() { return (window.FN_I18N || {})[curLang] || null; }
  function tr(s) { var d = dict(); return (d && d[s]) || s; }
  function applyLang() {
    var d = dict(), w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        var p = n.parentNode; if (!p || /^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/.test(p.nodeName) || (p.closest && p.closest('[data-notr]'))) return NodeFilter.FILTER_REJECT;
        return n.nodeValue.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    }), list = [], n;
    while ((n = w.nextNode())) list.push(n);
    list.forEach(function (t) {
      if (t.__o === undefined) t.__o = t.nodeValue;
      var key = t.__o.trim(), v = d && d[key];
      t.nodeValue = v ? t.__o.replace(key, function () { return v; }) : t.__o;
    });
    $$('[aria-label],[title],[alt],[data-t],[data-d]').forEach(function (el) {
      AT.forEach(function (a) {
        if (!el.hasAttribute(a)) return; var k = '__o_' + a;
        if (el[k] === undefined) el[k] = el.getAttribute(a);
        el.setAttribute(a, (d && d[el[k]]) || el[k]);
      });
    });
    if (document.__ot === undefined) document.__ot = document.title;
    document.title = (d && d[document.__ot]) || document.__ot;
  }
  function setLang(code, save) {
    if (LANGS_OK.indexOf(code) < 0) code = 'en';
    var h = document.documentElement;
    function go() {
      curLang = code; h.lang = code; h.dir = code === 'ar' ? 'rtl' : 'ltr';
      applyLang();
      $$('.lgm button').forEach(function (b) { b.setAttribute('aria-checked', b.getAttribute('data-lang') === code ? 'true' : 'false'); });
      var lc = $('.lgc'); if (lc) lc.textContent = code.toUpperCase();
      if (save) { try { localStorage.setItem('fn-lang', code); } catch (e) { } }
      window.FN_onlang.forEach(function (f) { try { f(); } catch (e) { } });
      h.classList.remove('i18n-wait');
    }
    if (code === 'en' || (window.FN_I18N && window.FN_I18N[code])) return go();
    var sc = document.createElement('script'); sc.src = BASE_JS + 'i18n/' + code + '.js';
    sc.onload = go; sc.onerror = function () { h.classList.remove('i18n-wait'); toast('Could not load that language'); };
    document.head.appendChild(sc);
  }
  var lgBtn = $('#lgBtn'), lgMenu = $('#lgMenu');
  if (lgBtn && lgMenu) {
    var lgOpen = false;
    var lgPlace = function () {
      var r = lgBtn.getBoundingClientRect(); lgMenu.style.top = (r.bottom + 8) + 'px';
      if (r.left + r.width / 2 < window.innerWidth / 2) { lgMenu.style.left = Math.max(8, r.left) + 'px'; lgMenu.style.right = 'auto'; }
      else { lgMenu.style.right = Math.max(8, window.innerWidth - r.right) + 'px'; lgMenu.style.left = 'auto'; }
    };
    var lgShut = function (focus) { if (!lgOpen) return; lgOpen = false; lgMenu.hidden = true; lgBtn.setAttribute('aria-expanded', 'false'); if (focus) lgBtn.focus(); };
    lgBtn.addEventListener('click', function (e) {
      e.stopPropagation(); if (lgOpen) return lgShut();
      lgOpen = true; lgMenu.hidden = false; lgPlace(); lgBtn.setAttribute('aria-expanded', 'true');
      var cur = lgMenu.querySelector('[aria-checked=true]'); if (cur) cur.focus();
    });
    lgMenu.addEventListener('click', function (e) {
      var b = e.target.closest('[data-lang]'); if (!b) return; setLang(b.getAttribute('data-lang'), true); lgShut(true);
    });
    lgMenu.addEventListener('keydown', function (e) {
      var items = $$('button', lgMenu), i = items.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); items[(i + 1) % items.length].focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); items[(i - 1 + items.length) % items.length].focus(); }
      else if (e.key === 'Escape') { e.stopPropagation(); lgShut(true); }
      else if (e.key === 'Tab') lgShut();
    });
    document.addEventListener('click', function (e) { if (lgOpen && !lgMenu.contains(e.target)) lgShut(); });
    window.addEventListener('scroll', function () { lgShut(); }, { passive: true });
    window.addEventListener('resize', function () { lgShut(); });
  }
  (function () { var sv = ''; try { sv = localStorage.getItem('fn-lang') || ''; } catch (e) { } if (sv && sv !== 'en') setLang(sv, false); else document.documentElement.classList.remove('i18n-wait'); })();

  /* ---------- release details (edit the values in js/config.js) ---------- */
  var relBox = $('.rel');
  function fillRel() {
    var R = CFG.release; if (!R || !relBox) return; var k = relBox.getAttribute('data-k');
    $$('[data-rel]').forEach(function (el) {
      var f = el.getAttribute('data-rel'), v = null;
      if (f === 'version') v = R.version;
      else if (f === 'date') { try { v = new Date(R.date + 'T00:00:00').toLocaleDateString(curLang === 'zh' ? 'zh-CN' : curLang, { year: 'numeric', month: 'long', day: 'numeric' }); } catch (e) { v = R.date; } }
      else if (f === 'size') v = (R.sizes || {})[k];
      else if (f === 'req') v = tr((R.requirements || {})[k] || '');
      else if (f === 'ui') v = tr(R.interface || '');
      else if (f === 'trial') v = tr((CFG.trialDays || 5) + ' days');
      if (v) el.textContent = v;
    });
  }
  window.FN_onlang.push(fillRel); fillRel();

  /* ---------- keyboard-shortcut tabs (Help Centre) ---------- */
  var ktabs = $$('.ktabs button');
  if (ktabs.length) {
    var pickOs = function (os) {
      ktabs.forEach(function (b) { b.setAttribute('aria-selected', b.getAttribute('data-os') === os ? 'true' : 'false'); });
      $$('.kpanel').forEach(function (p) { p.hidden = p.getAttribute('data-os-panel') !== os; });
    };
    ktabs.forEach(function (b) { b.addEventListener('click', function () { pickOs(b.getAttribute('data-os')); }); });
    var ua = navigator.userAgent || '';
    pickOs(/Android|iPhone|iPad/.test(ua) ? 'windows' : /Mac/.test(ua) ? 'mac' : /Linux|X11/.test(ua) ? 'linux' : 'windows');
  }

  /* ---------- web app: service worker and install button ---------- */
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', function () { navigator.serviceWorker.register(BASE_JS.replace(/js\/$/, '') + 'sw.js').catch(function () { }); });
  }
  var inst = $('#pwaInstall'), instEv = null;
  if (inst) {
    window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); instEv = e; inst.hidden = false; });
    inst.addEventListener('click', function () { if (!instEv) return; instEv.prompt(); instEv = null; inst.hidden = true; });
    window.addEventListener('appinstalled', function () { inst.hidden = true; });
  }

  /* ---------- download links (set in js/config.js) ---------- */
  $$('[data-dl]').forEach(function (a) {
    var key = a.getAttribute('data-dl'), url = (CFG.links || {})[key];
    if (url) { a.href = url; a.setAttribute('rel', 'noopener'); }
    else if (key !== 'scroll') {
      a.href = '#download';
      a.addEventListener('click', function (e) { e.preventDefault(); toast('Download link coming soon'); });
    }
  });

  /* ---------- soft, springy download button ---------- */
  function springButton(btn) {
    var st = { px: 0, py: 0, sc: 1, gx: 50, gy: 26, vx: 0, vy: 0, vs: 0, vgx: 0, vgy: 0 };
    var tg = { px: 0, py: 0, sc: 1, gx: 50, gy: 26 };
    var down = false, over = false, raf = 0, K = 0.1, D = 0.80;
    function tick() {
      var keys = [['px', 'vx'], ['py', 'vy'], ['sc', 'vs'], ['gx', 'vgx'], ['gy', 'vgy']], busy = false;
      keys.forEach(function (k) {
        var a = k[0], v = k[1];
        st[v] = (st[v] + (tg[a] - st[a]) * K) * D; st[a] += st[v];
        if (Math.abs(st[v]) > 0.002 || Math.abs(tg[a] - st[a]) > 0.002) busy = true;
      });
      btn.style.setProperty('--px', st.px.toFixed(2) + 'px'); btn.style.setProperty('--py', st.py.toFixed(2) + 'px');
      btn.style.setProperty('--sc', st.sc.toFixed(4));
      btn.style.setProperty('--gx', st.gx.toFixed(1) + '%'); btn.style.setProperty('--gy', st.gy.toFixed(1) + '%');
      raf = busy ? requestAnimationFrame(tick) : 0;
    }
    function go() { if (!raf) raf = requestAnimationFrame(tick); }
    function aim(e) {
      var r = btn.getBoundingClientRect();
      var nx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - .5) * 2));
      var ny = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - .5) * 2));
      var amp = down ? 1.7 : 1;
      tg.px = nx * 4.2 * amp; tg.py = ny * 3 * amp + (down ? 1.6 : 0); tg.gx = 50 + nx * 34; tg.gy = 28 + ny * 24;
    }
    function rest() { tg.px = 0; tg.py = 0; tg.gx = 50; tg.gy = 26; tg.sc = down ? .955 : (over ? 1.015 : 1); }
    if (reduce) return;
    btn.addEventListener('pointerenter', function (e) { over = true; tg.sc = down ? .955 : 1.015; aim(e); go(); });
    btn.addEventListener('pointermove', function (e) { aim(e); go(); });
    btn.addEventListener('pointerleave', function () { over = false; down = false; rest(); go(); });
    btn.addEventListener('pointerdown', function (e) { down = true; tg.sc = .955; aim(e); go(); });
    window.addEventListener('pointerup', function () { if (!down) return; down = false; rest(); go(); });
    btn.addEventListener('pointercancel', function () { down = false; over = false; rest(); go(); });
    btn.addEventListener('contextmenu', function (e) { if (e.pointerType === 'touch') e.preventDefault(); });
  }
  $$('.dl').forEach(springButton);

  /* ---------- nav shadow, reveal ---------- */
  var nav = $('.nav');
  function onScroll() { nav.classList.toggle('stuck', window.scrollY > 24); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });
    $$('.reveal').forEach(function (n) { io.observe(n); });
  } else { $$('.reveal').forEach(function (n) { n.classList.add('in'); }); }

  /* ---------- sounds (synthesised, no files) ---------- */
  var AC = null;
  function ac() {
    try { AC = AC || new (window.AudioContext || window.webkitAudioContext)(); if (AC.state === 'suspended') AC.resume(); } catch (e) { AC = null; }
    return AC;
  }
  function noiseBuf(c, sec) {
    var n = Math.floor(c.sampleRate * sec), b = c.createBuffer(1, n, c.sampleRate), d = b.getChannelData(0);
    for (var i = 0; i < n; i++) d[i] = Math.random() * 2 - 1; return b;
  }
  function tick(c, t, vol, f) {            // one soft bearing tick
    var o = c.createOscillator(), g = c.createGain();
    o.type = 'triangle'; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * .55, t + .022);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .002); g.gain.exponentialRampToValueAtTime(0.0001, t + .03);
    o.connect(g); g.connect(c.destination); o.start(t); o.stop(t + .04);
    var s = c.createBufferSource(), hp = c.createBiquadFilter(), g2 = c.createGain();
    s.buffer = noiseBuf(c, .02); hp.type = 'highpass'; hp.frequency.value = 3500;
    g2.gain.setValueAtTime(vol * .35, t); g2.gain.exponentialRampToValueAtTime(0.0001, t + .014);
    s.connect(hp); hp.connect(g2); g2.connect(c.destination); s.start(t);
  }
  function cylClick(c, t, vol, k) {          // one revolver-cylinder ratchet click: metallic ping + tiny knock
    var s = c.createBufferSource(), bp = c.createBiquadFilter(), g = c.createGain();
    s.buffer = noiseBuf(c, .02); bp.type = 'bandpass'; bp.frequency.value = 3200 + k * 500; bp.Q.value = 1.4;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + .012);
    s.connect(bp); bp.connect(g); g.connect(c.destination); s.start(t);
    [[1850, .5], [2780, .3], [4100, .14]].forEach(function (p) {
      var o = c.createOscillator(), og = c.createGain();
      o.type = 'sine'; o.frequency.value = p[0] * (1 + k * .06);
      og.gain.setValueAtTime(vol * p[1], t); og.gain.exponentialRampToValueAtTime(0.0001, t + .035);
      o.connect(og); og.connect(c.destination); o.start(t); o.stop(t + .04);
    });
    var lo = c.createOscillator(), lg = c.createGain();
    lo.type = 'sine'; lo.frequency.setValueAtTime(160, t); lo.frequency.exponentialRampToValueAtTime(70, t + .03);
    lg.gain.setValueAtTime(vol * .5, t); lg.gain.exponentialRampToValueAtTime(0.0001, t + .035);
    lo.connect(lg); lg.connect(c.destination); lo.start(t); lo.stop(t + .04);
  }
  function spinner() {                      // revolver cylinder rolling: fast ratchet that slows, then a lock-in click
    var c = ac(); if (!c) return; var t = c.currentTime + .005, gap = .02, at = 0;
    for (var i = 0; i < 16; i++) {
      cylClick(c, t + at, .2 - i * .006, Math.random());
      at += gap * (.92 + Math.random() * .16); gap *= 1.13;
    }
    cylClick(c, t + at + .03, .34, .2);      // final lock
  }
  function switchClick(on) {                // physical rocker: sharp click, then a low thock
    var c = ac(); if (!c) return; var t = c.currentTime + .003;
    function one(tt, vol, f) {
      var s = c.createBufferSource(), hp = c.createBiquadFilter(), g = c.createGain();
      s.buffer = noiseBuf(c, .03); hp.type = 'bandpass'; hp.frequency.value = 4200; hp.Q.value = .8;
      g.gain.setValueAtTime(vol, tt); g.gain.exponentialRampToValueAtTime(0.0001, tt + .016);
      s.connect(hp); hp.connect(g); g.connect(c.destination); s.start(tt);
      var o = c.createOscillator(), g2 = c.createGain();
      o.type = 'sine'; o.frequency.setValueAtTime(f, tt); o.frequency.exponentialRampToValueAtTime(f * .45, tt + .05);
      g2.gain.setValueAtTime(vol * .9, tt); g2.gain.exponentialRampToValueAtTime(0.0001, tt + .06);
      o.connect(g2); g2.connect(c.destination); o.start(tt); o.stop(tt + .07);
    }
    one(t, .5, on ? 210 : 260); one(t + .055, .22, on ? 150 : 190);
  }

  /* ---------- popups ---------- */
  var openM = null, lastFocus = null;
  function openModal(id) {
    var m = document.getElementById(id); if (!m) return;
    lastFocus = document.activeElement; m.hidden = false; document.body.classList.add('lock');
    requestAnimationFrame(function () { m.classList.add('on'); }); openM = m;
    var x = m.querySelector('[data-close]'); if (x) x.focus();
  }
  function closeModal() {
    if (!openM) return; var m = openM; openM = null; m.classList.remove('on'); document.body.classList.remove('lock');
    setTimeout(function () { m.hidden = true; }, 300); if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  $$('[data-open]').forEach(function (b) { b.addEventListener('click', function () { openModal(b.getAttribute('data-open')); }); });
  $$('.modal').forEach(function (m) {
    m.addEventListener('click', function (e) { if (e.target === m || e.target.closest('[data-close]')) closeModal(); });
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });

  /* ---------- site Matte Dark switch ---------- */
  var dk = $('#darkTg'), tc = $('#tc');
  function setSite(dark, save) {
    if (dark) document.documentElement.setAttribute('data-site', 'dark'); else document.documentElement.removeAttribute('data-site');
    if (dk) dk.setAttribute('aria-checked', dark ? 'true' : 'false');
    if (tc) tc.setAttribute('content', dark ? '#1c1d20' : '#e6e7e9');
    if (save) { try { localStorage.setItem('fn-site', dark ? 'dark' : 'light'); } catch (e) { } }
  }
  if (dk) {
    setSite(document.documentElement.getAttribute('data-site') === 'dark', false);
    dk.addEventListener('click', function () { var on = dk.getAttribute('aria-checked') !== 'true'; switchClick(on); setSite(on, true); });
  }

  /* ---------- five-theme slider (drag, tap, keys) ---------- */
  var stage = $('#stage'), sl = $('#themeSl');
  var NAMES = ['Matte White', 'Matte Black', 'Leather Bound', 'Midnight Blue', 'Lavender Mist'];
  if (stage && sl) {
    var cur = 0, dragging = false;
    var setP = function (p) { sl.style.setProperty('--p', p.toFixed(4)); };
    var apply = function (i) {
      if (i === cur) return; var cur0 = cur; cur = i;
      stage.setAttribute('data-t', String(i)); switchClick(i >= cur0);
      sl.setAttribute('aria-valuenow', String(i + 1)); sl.setAttribute('aria-valuetext', NAMES[i]);
    };
    var fromX = function (x) {
      var r = sl.getBoundingClientRect(), pad = 28;
      return Math.max(0, Math.min(1, (x - r.left - pad) / Math.max(1, r.width - pad * 2)));
    };
    sl.addEventListener('pointerdown', function (e) {
      dragging = true; sl.classList.add('drag');
      try { sl.setPointerCapture(e.pointerId); } catch (x) { }
      var p = fromX(e.clientX); setP(p); apply(Math.round(p * 4));
    });
    sl.addEventListener('pointermove', function (e) {
      if (!dragging) return; var p = fromX(e.clientX); setP(p); apply(Math.round(p * 4));
    });
    var end = function () { if (!dragging) return; dragging = false; sl.classList.remove('drag'); setP(cur / 4); };
    sl.addEventListener('pointerup', end); sl.addEventListener('pointercancel', end); sl.addEventListener('lostpointercapture', end);
    var go = function (i) { i = Math.max(0, Math.min(4, i)); apply(i); setP(i / 4); };
    sl.addEventListener('keydown', function (e) {
      var k = e.key;
      if (k === 'ArrowRight' || k === 'ArrowUp') { e.preventDefault(); go(cur + 1); }
      else if (k === 'ArrowLeft' || k === 'ArrowDown') { e.preventDefault(); go(cur - 1); }
      else if (k === 'Home') { e.preventDefault(); go(0); }
      else if (k === 'End') { e.preventDefault(); go(4); }
    });
    $$('.tsl-labs button').forEach(function (b) { b.addEventListener('click', function () { go(parseInt(b.getAttribute('data-i'), 10)); }); });
  }

  /* ---------- pricing by country ---------- */
  var TZ = {
    'Asia/Kolkata': 'IN', 'Asia/Calcutta': 'IN', 'Europe/London': 'GB', 'Europe/Dublin': 'IE', 'Europe/Berlin': 'DE', 'Europe/Paris': 'FR', 'Europe/Madrid': 'ES',
    'Europe/Rome': 'IT', 'Europe/Amsterdam': 'NL', 'Europe/Brussels': 'BE', 'Europe/Vienna': 'AT', 'Europe/Helsinki': 'FI', 'Europe/Lisbon': 'PT', 'Europe/Zurich': 'CH',
    'Europe/Oslo': 'NO', 'Europe/Stockholm': 'SE', 'Europe/Copenhagen': 'DK', 'Europe/Warsaw': 'PL', 'Europe/Prague': 'CZ', 'Europe/Budapest': 'HU', 'Europe/Bucharest': 'RO',
    'Europe/Istanbul': 'TR', 'Asia/Istanbul': 'TR', 'Asia/Singapore': 'SG', 'Asia/Dubai': 'AE', 'Asia/Tokyo': 'JP', 'Asia/Seoul': 'KR', 'Asia/Jerusalem': 'IL', 'Asia/Riyadh': 'SA',
    'Pacific/Auckland': 'NZ', 'America/Sao_Paulo': 'BR', 'America/Mexico_City': 'MX', 'America/Santiago': 'CL', 'America/Bogota': 'CO', 'Asia/Kuala_Lumpur': 'MY',
    'Asia/Bangkok': 'TH', 'Africa/Johannesburg': 'ZA', 'Asia/Jakarta': 'ID', 'Asia/Manila': 'PH', 'Asia/Ho_Chi_Minh': 'VN', 'Asia/Saigon': 'VN', 'Africa/Cairo': 'EG',
    'Africa/Lagos': 'NG', 'Africa/Nairobi': 'KE', 'Asia/Karachi': 'PK', 'Asia/Dhaka': 'BD', 'Asia/Colombo': 'LK', 'Asia/Kathmandu': 'NP', 'Asia/Katmandu': 'NP'
  };
  function regionFromTz() {
    var tz = ''; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { }
    if (TZ[tz]) return TZ[tz];
    if (/^Australia\//.test(tz)) return 'AU';
    if (/^America\/(Toronto|Vancouver|Edmonton|Winnipeg|Halifax|St_Johns|Regina|Montreal|Moncton|Glace_Bay|Iqaluit|Whitehorse|Yellowknife)/.test(tz)) return 'CA';
    if (/^America\/(New_York|Chicago|Denver|Los_Angeles|Phoenix|Anchorage|Boise|Detroit|Indiana|Kentucky|Menominee|North_Dakota|Juneau|Adak|Sitka|Nome|Yakutat|Metlakatla)/.test(tz) || tz === 'Pacific/Honolulu') return 'US';
    return '';
  }
  function regionFromLang() {
    var l = (navigator.languages && navigator.languages[0]) || navigator.language || '', m = l.match(/[-_]([A-Za-z]{2})$/);
    return m ? m[1].toUpperCase() : '';
  }
  function money(cur, amt) {
    try { return new Intl.NumberFormat('en', { style: 'currency', currency: cur, maximumFractionDigits: 0, minimumFractionDigits: 0 }).format(amt); }
    catch (e) { return cur + ' ' + amt; }
  }
  /* ---------- pricing: automatic by country, resistant to simple VPN switching ---------- */
  var priceEl = $('#priceNum');
  if (priceEl) {
    var P = CFG.prices || {}, fb = CFG.fallback, mobile = document.body.getAttribute('data-platform') === 'mobile';
    var MO = mobile ? (CFG.mobilePrices || {}) : {};
    function priceFor(code) {
      if (code && P[code]) return [P[code][1], MO[code] != null ? MO[code] : P[code][2]];
      return [fb[2], fb[3]];
    }
    var plat = mobile ? 'mobile' : 'desktop', AN = (CFG.annual || {})[plat] || {}, MUL = (CFG.annualMultiple || {})[plat] || 10;
    var yearEl = $('#priceYear'), badge = $('#saveBadge');
    function nice(v) { return v >= 1000 ? Math.round(v / 100) * 100 : v >= 100 ? Math.round(v / 10) * 10 : Math.round(v); }
    var shownCode = null;
    function show(code) {
      shownCode = code; var p = priceFor(code); priceEl.textContent = money(p[0], p[1]);
      if (!yearEl) return;
      var yr = (code && AN[code] != null) ? AN[code] : nice(p[1] * MUL);
      yearEl.textContent = money(p[0], yr);
      var save = Math.round((1 - yr / (p[1] * 12)) * 100);
      if (badge) { if (save > 0) { badge.textContent = tr('Save {n}%').replace('{n}', save); badge.hidden = false; } else badge.hidden = true; }
    }
    function viaFetch(url, parse) {
      return new Promise(function (res) {
        if (!window.fetch) return res('');
        var done = false, t = setTimeout(function () { if (!done) { done = true; res(''); } }, 2500);
        fetch(url, { cache: 'no-store' }).then(function (r) { return r.text(); }).then(function (txt) {
          if (done) return; done = true; clearTimeout(t); var c = parse(txt); res(/^[A-Z]{2}$/.test(c) ? c : '');
        }).catch(function () { if (!done) { done = true; clearTimeout(t); res(''); } });
      });
    }
    function ipCountry() {
      return viaFetch('https://www.cloudflare.com/cdn-cgi/trace', function (t) { var m = t.match(/^loc=([A-Z]{2})/m); return m ? m[1] : ''; })
        .then(function (c) { return c || viaFetch('https://api.country.is/', function (t) { try { return (JSON.parse(t).country || '').toUpperCase(); } catch (e) { return ''; } }); });
    }
    var tzC = regionFromTz() || regionFromLang();
    ipCountry().then(function (ipC) {
      var code;
      if (ipC && tzC && ipC !== tzC) code = '';            // location and device disagree (VPN or proxy): standard international price
      else code = ipC || tzC || '';
      show(code);
    });
    setTimeout(function () { if (!priceEl.textContent.trim()) show(tzC); }, 3200);
    window.FN_onlang.push(function () { if (shownCode !== null) show(shownCode); });
  }

  /* ---------- studio tour carousel ---------- */
  var gal = $('#gal');
  if (gal) {
    var its = $$('.g-it', gal), N = its.length, pos = 0, tween = 0, auto = 0, dragging = false, inView = true, moved = false, curI = -1;
    var gT = $('#gT'), gD = $('#gD'), gN = $('#gN'), gP = $('#gPrev'), gX = $('#gNext'), cap = $('.g-cap', gal);
    var STEP = 352, REST = 340;
    function wrap(d) { d = ((d + N / 2) % N + N) % N - N / 2; return d; }
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function setCaption(i) {
      if (i === curI) return; curI = i;
      cap.classList.add('out');
      setTimeout(function () {
        var f = its[i]; gT.textContent = f.getAttribute('data-t'); gD.textContent = f.getAttribute('data-d');
        gN.textContent = pad(i + 1) + ' / ' + pad(N); gP.textContent = pad(((i - 1 + N) % N) + 1); gX.textContent = pad(((i + 1) % N) + 1);
        cap.classList.remove('out');
      }, 180);
    }
    window.FN_onlang.push(function () { var i = curI; curI = -1; if (i >= 0) setCaption(i); });
    function render() {
      its.forEach(function (el, i) {
        var d = wrap(i - pos), ad = Math.abs(d), sgn = d < 0 ? -1 : 1;
        var x = ad <= 1 ? STEP * ad : STEP + (ad - 1) * REST, s = 1 + .32 * Math.min(ad, 1);
        el.style.setProperty('--dx', (sgn * x).toFixed(2)); el.style.setProperty('--s', s.toFixed(4));
        el.style.zIndex = String(10 - Math.round(ad * 2)); el.style.opacity = ad > 2.3 ? '0' : '1'; el.style.visibility = ad > 2.6 ? 'hidden' : 'visible';
      });
      setCaption(((Math.round(pos) % N) + N) % N);
    }
    function ease(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
    function goTo(target, ms) {
      cancelAnimationFrame(tween); var from = pos, t0 = performance.now(); ms = ms || 900;
      if (reduce) { pos = target; render(); return; }
      (function step(now) {
        var k = Math.min(1, (now - t0) / ms); pos = from + (target - from) * ease(k); render();
        if (k < 1) tween = requestAnimationFrame(step); else { pos = ((target % N) + N) % N; render(); }
      })(t0);
    }
    function next(n) { goTo(Math.round(pos) + n); restart(); }
    function restart() {
      clearInterval(auto); if (reduce) return;
      auto = setInterval(function () { if (!dragging && inView && !document.hidden) goTo(Math.round(pos) + 1); }, 3600);
    }
    var sx = 0, sp = 0, lastX = 0, lastT = 0, vel = 0, pid = null;
    function unit() { return gal.getBoundingClientRect().width / (window.matchMedia('(max-width:700px)').matches ? 620 : 1000); }
    gal.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.g-btn')) return;
      dragging = true; moved = false; sx = lastX = e.clientX; sp = pos; vel = 0; lastT = performance.now(); cancelAnimationFrame(tween);
      try { gal.setPointerCapture(e.pointerId); pid = e.pointerId; } catch (x) { }
    });
    gal.addEventListener('pointermove', function (e) {
      if (!dragging) return; var dx = e.clientX - sx;
      if (Math.abs(dx) > 4) { moved = true; gal.classList.add('drag'); }
      if (!moved) return;
      var now = performance.now(); vel = (e.clientX - lastX) / Math.max(1, now - lastT); lastX = e.clientX; lastT = now;
      pos = sp - dx / (STEP * unit()); render();
    });
    function up(e) {
      if (!dragging) return; dragging = false; gal.classList.remove('drag');
      if (moved) { var target = Math.round(pos - vel * 1.1); goTo(target, 600); }
      else if (e && e.target && e.target.closest) {
        var fig = e.target.closest('.g-it'); var r = gal.getBoundingClientRect();
        var ux = (e.clientX - r.left) / unit(), c = window.matchMedia('(max-width:700px)').matches ? 310 : 500;
        if (ux < c - 120) next(-1); else if (ux > c + 120) next(1);
      }
      restart();
    }
    gal.addEventListener('pointerup', up); gal.addEventListener('pointercancel', function () { up(null); });
    gal.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { e.preventDefault(); next(1); } else if (e.key === 'ArrowLeft') { e.preventDefault(); next(-1); } });
    $('#gBack').addEventListener('click', function () { next(-1); }); $('#gFwd').addEventListener('click', function () { next(1); });
    if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { inView = es[0].isIntersecting; }, { threshold: .25 }).observe(gal);
    render(); restart();
  }

  var y = $('#yr'); if (y) y.textContent = new Date().getFullYear();
})();
