// === Desktop nav enhancements: accordion sidebar + scroll-spy + back-to-top ===
(function() {
  if (window.__navEnhanced) return;
  window.__navEnhanced = true;

  const style = document.createElement('style');
  style.textContent = `
    /* ── Accordion sidebar sections ── */
    .nav-section {
      cursor: pointer;
      user-select: none;
      display: flex;
      align-items: center;
      gap: 6px;
      padding-right: 16px !important;
    }
    .nav-section::after {
      content: '▾';
      font-size: 9px;
      margin-left: auto;
      transition: transform 0.2s;
      color: #64748b;
    }
    .nav-section.collapsed::after {
      transform: rotate(-90deg);
    }
    .nav-section.collapsed + .nav-item,
    .nav-section.collapsed ~ .nav-item {
      display: none;
    }
    .nav-section:not(.collapsed) ~ .nav-section { /* stop at next section header */ }
    /* JS will handle show/hide properly — CSS-only is fragile. See JS below. */

    /* ── Back to top FAB ── */
    #back-to-top {
      position: fixed; bottom: 28px; right: 28px; z-index: 200;
      width: 44px; height: 44px; border-radius: 50%;
      background: #1a1d27; border: 1px solid #2a2d3a; color: #8b949e;
      font-size: 20px; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      opacity: 0; transform: translateY(12px);
      transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
      pointer-events: none;
      box-shadow: 0 4px 16px rgba(0,0,0,0.3);
    }
    #back-to-top:hover { color: #58a6ff; border-color: #58a6ff; }
    #back-to-top.visible { opacity: 1; transform: translateY(0); pointer-events: auto; }

    /* ── Smooth scroll ── */
    html { scroll-behavior: smooth; }

    @media (max-width: 768px) {
      #back-to-top { bottom: 16px; right: 16px; width: 38px; height: 38px; font-size: 18px; }
    }
  `;
  document.head.appendChild(style);

  // ── Accordion: Click .nav-section to collapse/expand ──
  const sections = document.querySelectorAll('.nav-section');
  sections.forEach(header => {
    header.addEventListener('click', () => {
      header.classList.toggle('collapsed');
      // Hide/show all .nav-item between this header and the next .nav-section
      let el = header.nextElementSibling;
      while (el && !el.classList.contains('nav-section')) {
        if (el.classList.contains('nav-item')) {
          el.style.display = header.classList.contains('collapsed') ? 'none' : '';
        }
        el = el.nextElementSibling;
      }
    });
  });

  // ── Back to top button ──
  const fab = document.createElement('button');
  fab.id = 'back-to-top';
  fab.innerHTML = '↑';
  fab.title = '回到顶部';
  fab.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.body.appendChild(fab);

  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(() => {
        const scrolled = window.scrollY > 400;
        fab.classList.toggle('visible', scrolled);
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  // ── Scroll-spy: highlight active nav item ──
  const navItems = document.querySelectorAll('.nav-item');
  const mainContent = document.querySelector('.main');

  function updateActiveNav() {
    const scrollY = (mainContent || window).scrollTop || window.scrollY;
    let currentId = '';

    navItems.forEach(item => {
      const href = item.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.getElementById(href.slice(1));
      if (!target) return;
      const rect = target.getBoundingClientRect();
      // Section is "active" when its top is near the top of the viewport
      if (rect.top <= 120) {
        currentId = href;
      }
    });

    navItems.forEach(item => {
      item.classList.toggle('active', item.getAttribute('href') === currentId);
    });
  }

  let spyTicking = false;
  window.addEventListener('scroll', () => {
    if (!spyTicking) {
      requestAnimationFrame(() => { updateActiveNav(); spyTicking = false; });
      spyTicking = true;
    }
  }, { passive: true });

  updateActiveNav(); // initial
})();

// === Mobile responsiveness ===
(function() {
  if (window.__mobileLoaded) return;
  window.__mobileLoaded = true;

  const style = document.createElement('style');
  style.textContent = `
    #mobile-menu-btn {
      display: none; position: fixed; top: 12px; left: 12px; z-index: 300;
      width: 40px; height: 40px; border-radius: 10px;
      background: #1a1d27; border: 1px solid #2a2d3a; color: #c9d1d9;
      font-size: 22px; cursor: pointer; align-items: center; justify-content: center;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }
    #sidebar-backdrop {
      display: none; position: fixed; inset: 0; z-index: 250;
      background: rgba(0,0,0,0.6); backdrop-filter: blur(2px);
    }

    @media (max-width: 768px) {
      #mobile-menu-btn { display: flex; }
      .sidebar {
        display: block !important;
        transform: translateX(-100%);
        transition: transform 0.25s cubic-bezier(0.16,1,0.3,1);
        z-index: 260 !important;
        width: 280px !important;
        box-shadow: 4px 0 20px rgba(0,0,0,0.4);
      }
      .sidebar.open { transform: translateX(0); }
      #sidebar-backdrop.open { display: block; }
      .main {
        margin-left: 0 !important;
        padding: 16px 14px !important;
        max-width: 100% !important;
      }
      .section { margin-bottom: 40px !important; }
      .section h2 { font-size: 20px !important; }
      .section h3 { font-size: 16px !important; }
      .section h4 { font-size: 13px !important; }
      #tts-bar {
        left: 0 !important; right: 0 !important;
        padding: 8px 8px !important; gap: 4px !important;
        flex-wrap: wrap !important;
      }
      #tts-bar button { padding: 6px 10px !important; font-size: 14px !important; }
      #tts-label { max-width: 100px !important; font-size: 11px !important; }
      #tts-rate, #tts-voice { font-size: 10px !important; padding: 3px 6px !important; }
      table { display: block; overflow-x: auto; -webkit-overflow-scrolling: touch; }
      table th, table td { white-space: nowrap; padding: 8px 10px !important; font-size: 12px !important; }
      pre { font-size: 12px !important; padding: 12px 14px !important; }
      pre code { font-size: 11px !important; }
      p code, li code { font-size: 12px !important; }
      .diagram { padding: 6px !important; }
      .diagram svg { max-width: 100% !important; height: auto !important; }
      .feynman { padding: 14px 16px !important; }
      .info-card { padding: 14px 16px !important; }
      .compare { grid-template-columns: 1fr !important; gap: 10px !important; }
      .qa { padding-left: 12px !important; }
      .qa .q { font-size: 14px !important; }
      .qa .a { font-size: 13px !important; }
      .main { padding-bottom: 90px !important; }
    }
  `;
  document.head.appendChild(style);

  const sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  const backdrop = document.createElement('div');
  backdrop.id = 'sidebar-backdrop';
  document.body.appendChild(backdrop);

  const btn = document.createElement('button');
  btn.id = 'mobile-menu-btn';
  btn.innerHTML = '☰';
  btn.title = '菜单';
  document.body.appendChild(btn);

  function openSidebar() {
    sidebar.classList.add('open');
    backdrop.classList.add('open');
    btn.innerHTML = '✕';
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    backdrop.classList.remove('open');
    btn.innerHTML = '☰';
  }

  btn.addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });
  backdrop.addEventListener('click', closeSidebar);

  sidebar.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 768) closeSidebar();
    });
  });
})();

// === 艾宾浩斯复习系统 ===
(function() {
  if (window.__ebbinghausLoaded) return;
  window.__ebbinghausLoaded = true;

  var isArticle = window.location.pathname.match(/\/([a-z0-9_-]+)\.html$/);
  var script = document.createElement('script');
  script.src = '/ebbinghaus.js';
  script.onload = function() { if (isArticle) initReviewFab(); };
  document.head.appendChild(script);

  // ── 文章字数统计 ──
  function countArticleWords() {
    var main = document.querySelector('.main');
    if (!main) return 500;
    var text = main.textContent || '';
    var chinese = (text.match(/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/g) || []).length;
    var english = (text.match(/[a-zA-Z]+/g) || []).length;
    return chinese + english;
  }

  // ── 动态阅读时长：每分钟500字 × 复习加速（每轮 x0.9） ──
  function calcMinStayMs(wordCount, reviewCount) {
    var baseSeconds = (wordCount / 500) * 60;
    var speedup = Math.pow(0.9, reviewCount);
    return Math.round(baseSeconds * speedup * 1000);
  }

  function fmtWordCount(wc) {
    return wc >= 10000 ? (wc/10000).toFixed(1)+'万字'
      : wc >= 1000 ? (wc/1000).toFixed(1)+'k字'
      : wc+'字';
  }

  // ── 注入 FAB 样式 ──
  var fabStyle = document.createElement('style');
  fabStyle.textContent =
    '#review-fab{'+
      'position:fixed;bottom:84px;right:28px;z-index:199;'+
      'border-radius:26px;padding:10px 20px;'+
      'background:#1a1d27;border:1px solid #2a2d3a;color:#c9d1d9;'+
      'font-size:13px;font-weight:600;font-family:inherit;cursor:pointer;'+
      'display:flex;align-items:center;gap:8px;white-space:nowrap;'+
      'box-shadow:0 4px 20px rgba(0,0,0,0.35);'+
      'transition:all 0.25s cubic-bezier(0.16,1,0.3,1);'+
      'user-select:none;'+
    '}'+
    '#review-fab:hover:not(.locked){border-color:#58a6ff;box-shadow:0 4px 24px rgba(88,166,255,0.15);}'+
    '#review-fab.locked{opacity:0.55;cursor:not-allowed;filter:grayscale(0.3);}'+
    '#review-fab.done{border-color:rgba(63,185,80,0.3);background:rgba(63,185,80,0.06);}'+
    '#review-fab .fab-icon{font-size:18px;line-height:1;}'+
    '#review-fab .fab-timer{font-size:11px;color:#f87173;font-variant-numeric:tabular-nums;}'+
    '#review-fab .fab-meta{font-size:10px;color:#64748b;}'+
    '@keyframes fabPulse{0%,100%{box-shadow:0 0 0 0 rgba(63,185,80,0.3)}50%{box-shadow:0 0 20px 6px rgba(63,185,80,0.12)}}'+
    '#review-fab.pulse{animation:fabPulse 0.7s ease;}'+
    '@media(max-width:768px){'+
      '#review-fab{bottom:70px;right:16px;padding:8px 14px;font-size:12px;border-radius:22px;}'+
      '#review-fab .fab-icon{font-size:16px;}'+
    '}';
  document.head.appendChild(fabStyle);

  function initReviewFab() {
    var id = Ebbinghaus.currentArticleId();
    var pageLoadTime = Date.now();
    var wordCount = countArticleWords();
    var status = Ebbinghaus.getAllStatus()[id];
    var reviewCount = status ? status.reviewCount : 0;
    var MIN_STAY_MS = calcMinStayMs(wordCount, reviewCount);
    var baseMin = (MIN_STAY_MS / 60000).toFixed(1);
    var wcLabel = fmtWordCount(wordCount);

    var fab = document.createElement('div');
    fab.id = 'review-fab';
    fab.classList.add('locked');
    document.body.appendChild(fab);

    var timerInterval;

    function getStatus() {
      var s = Ebbinghaus.getAllStatus()[id];
      reviewCount = s ? s.reviewCount : 0;
      return s;
    }

    function renderLocked(remainingSec) {
      var m = Math.floor(remainingSec / 60);
      var s = remainingSec % 60;
      var timeStr = m + ':' + (s < 10 ? '0' : '') + s;
      fab.innerHTML = '<span class="fab-icon">⏳</span>'+
        '<span style="display:flex;flex-direction:column;align-items:flex-start;line-height:1.3">'+
          '<span style="font-size:12px">'+wcLabel+' · 第'+(reviewCount+1)+'遍</span>'+
          '<span class="fab-timer">'+timeStr+'</span>'+
        '</span>';
      fab.className = 'locked';
      fab.title = '约'+wcLabel+'，第'+(reviewCount+1)+'次阅读，需停留约'+baseMin+'分钟';
    }

    function renderActive() {
      var s = getStatus();
      var max = Ebbinghaus.INTERVALS.length;
      var count = s ? s.reviewCount : 0;
      var isDone = count >= max;
      var label = !s || count === 0 ? '📖 标记已复习'
        : isDone ? '✅ 已掌握'
        : '🧠 第' + count + '/' + max + '轮';
      fab.innerHTML = '<span class="fab-icon">'+(isDone?'✅':'🧠')+'</span><span>'+label+'</span>';
      fab.className = isDone ? 'done' : '';
      fab.title = isDone ? '全部7轮复习完成！' : '标记本轮复习完成，自动安排下次复习';
    }

    function markAndUpdate() {
      var elapsed = Date.now() - pageLoadTime;
      if (elapsed < MIN_STAY_MS) return;
      Ebbinghaus.markReviewed(id);
      getStatus();
      // 下一轮加速
      MIN_STAY_MS = calcMinStayMs(wordCount, reviewCount);
      baseMin = (MIN_STAY_MS / 60000).toFixed(1);
      renderActive();
      fab.classList.add('pulse');
      setTimeout(function(){ fab.classList.remove('pulse'); }, 700);
    }

    fab.addEventListener('click', function() {
      if (fab.classList.contains('locked')) return;
      markAndUpdate();
    });

    // 计时器
    function tick() {
      var elapsed = Date.now() - pageLoadTime;
      if (elapsed < MIN_STAY_MS) {
        renderLocked(Math.ceil((MIN_STAY_MS - elapsed) / 1000));
      } else {
        clearInterval(timerInterval);
        fab.classList.remove('locked');
        renderActive();
      }
    }

    tick();
    timerInterval = setInterval(tick, 1000);
  }
})();

// === 音频播放器（edge-tts 语音） ===
(function() {
  if (window.__audioPlayerLoaded) return;
  window.__audioPlayerLoaded = true;

  var isArticle = window.location.pathname.match(/\/([a-z0-9_-]+)\.html$/);
  if (!isArticle) return;
  var articleId = isArticle[1];
  var audioSrc = '/audio/' + articleId + '.mp3';

  var style = document.createElement('style');
  style.textContent =
    '#audio-bar{'+
      'position:fixed;bottom:0;left:0;right:0;z-index:198;'+
      'background:#15171e;border-top:1px solid #2a2d3a;'+
      'padding:10px 20px;display:none;align-items:center;gap:12px;'+
      'font-family:inherit;font-size:13px;color:#c9d1d9;'+
      'box-shadow:0 -2px 16px rgba(0,0,0,0.3);'+
    '}'+
    '#audio-bar.visible{display:flex;}'+
    '#audio-bar .ab-title{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600;}'+
    '#audio-bar .ab-time{font-size:11px;color:#64748b;font-variant-numeric:tabular-nums;min-width:90px;text-align:right;}'+
    '#audio-bar .ab-progress-wrap{flex:2;min-width:60px;height:4px;background:#1e222a;border-radius:2px;cursor:pointer;position:relative;}'+
    '#audio-bar .ab-progress{height:100%;background:#58a6ff;border-radius:2px;width:0;transition:width 0.15s linear;}'+
    '#audio-bar button{background:none;border:none;color:#c9d1d9;cursor:pointer;font-size:18px;padding:4px 6px;line-height:1;border-radius:6px;transition:all 0.15s;}'+
    '#audio-bar button:hover{color:#58a6ff;background:rgba(88,166,255,0.08);}'+
    '#audio-bar .ab-speed{font-size:11px;color:#64748b;cursor:pointer;padding:2px 6px;border-radius:4px;background:rgba(255,255,255,0.04);}'+
    '#audio-bar .ab-speed:hover{color:#58a6ff;}'+
    '@media(max-width:768px){'+
      '#audio-bar{padding:8px 12px;gap:8px;font-size:11px;}'+
      '#audio-bar button{font-size:16px;padding:3px 5px;}'+
      '#audio-bar .ab-time{min-width:70px;font-size:10px;}'+
    '}';
  document.head.appendChild(style);

  var audio = new Audio();
  audio.preload = 'metadata';

  function checkAudio(cb) {
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', audioSrc, true);
    xhr.onload = function() { cb(xhr.status === 200); };
    xhr.onerror = function() { cb(false); };
    xhr.send();
  }

  function fmtTime(sec) {
    if (isNaN(sec) || sec < 0) return '0:00';
    var m = Math.floor(sec / 60);
    var s = Math.floor(sec % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }

  checkAudio(function(exists) {
    if (!exists) return;

    audio.src = audioSrc;

    var bar = document.createElement('div');
    bar.id = 'audio-bar';

    var btnPlay = document.createElement('button');
    btnPlay.innerHTML = '▶️';
    btnPlay.title = '播放 / 暂停';

    var titleEl = document.createElement('span');
    titleEl.className = 'ab-title';
    titleEl.textContent = '🎧 ' + (document.title || articleId);

    var progressWrap = document.createElement('div');
    progressWrap.className = 'ab-progress-wrap';
    var progressFill = document.createElement('div');
    progressFill.className = 'ab-progress';
    progressWrap.appendChild(progressFill);

    var timeEl = document.createElement('span');
    timeEl.className = 'ab-time';
    timeEl.textContent = '0:00 / 0:00';

    var speedBtn = document.createElement('span');
    speedBtn.className = 'ab-speed';
    speedBtn.textContent = '1×';
    speedBtn.title = '切换播放速度';

    bar.appendChild(btnPlay);
    bar.appendChild(titleEl);
    bar.appendChild(progressWrap);
    bar.appendChild(timeEl);
    bar.appendChild(speedBtn);
    document.body.appendChild(bar);

    document.body.style.paddingBottom = '110px';

    var playing = false;

    btnPlay.addEventListener('click', function() {
      if (playing) { audio.pause(); }
      else { audio.play(); }
    });

    audio.addEventListener('play', function() {
      playing = true;
      btnPlay.innerHTML = '⏸️';
      bar.classList.add('visible');
    });

    audio.addEventListener('pause', function() {
      playing = false;
      btnPlay.innerHTML = '▶️';
    });

    audio.addEventListener('ended', function() {
      playing = false;
      btnPlay.innerHTML = '🔄';
    });

    audio.addEventListener('loadedmetadata', function() {
      timeEl.textContent = '0:00 / ' + fmtTime(audio.duration);
    });

    audio.addEventListener('timeupdate', function() {
      var pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      progressFill.style.width = pct + '%';
      timeEl.textContent = fmtTime(audio.currentTime) + ' / ' + fmtTime(audio.duration);
    });

    progressWrap.addEventListener('click', function(e) {
      if (!audio.duration) return;
      var rect = progressWrap.getBoundingClientRect();
      var pct = (e.clientX - rect.left) / rect.width;
      audio.currentTime = pct * audio.duration;
    });

    var speeds = [1.0, 1.25, 1.5, 2.0];
    var speedIdx = 0;
    speedBtn.addEventListener('click', function() {
      speedIdx = (speedIdx + 1) % speeds.length;
      var rate = speeds[speedIdx];
      audio.playbackRate = rate;
      speedBtn.textContent = rate + '×';
    });

    bar.classList.add('visible');
  });
})();
