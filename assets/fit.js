/* Yummy TV – shared page helper (all themes)
   - scales the fixed 1920x1080 stage to any screen
   - shrinks text/images of a block a little when it would not fit
     (so adding items or long names never breaks the layout)
   - small staggered animations, keyboard shortcuts on the TV */
(function () {
  var W = 1920, H = 1080;
  var stage = document.getElementById('stage');
  var cfg = window.YUMMY || {};
  var q = location.search;

  /* ---------- performance for cheap TVs ----------
     ?video  = recording a video (full quality, virtual time – leave everything alone)
     ?still  = making the picture version (no big moving animation)
     live    = canvas effects at half resolution and max 30 frames/s, which a weak TV can keep up with */
  var VIDEO = /[?&]video\b/.test(q), STILL = /[?&]still\b/.test(q);
  if (STILL) cfg.big = false;
  var LIVE = !VIDEO && !STILL;
  window.yummyCanvas = function (c) {
    var s = LIVE ? 0.5 : 1;
    c.width = W * s; c.height = H * s;
    var x = c.getContext('2d');
    x.setTransform(s, 0, 0, s, 0, 0);
    return x;
  };
  if (LIVE) {
    var nativeRaf = window.requestAnimationFrame.bind(window), gateT = -1, lastT = 0;
    window.__nativeRaf = nativeRaf;
    var open = function (t) {
      if (t === gateT) return true;
      if (t - lastT >= 31) { lastT = t; gateT = t; return true; }
      return false;
    };
    window.requestAnimationFrame = function (cb) {
      return nativeRaf(function tick(t) { if (open(t)) cb(t); else nativeRaf(tick); });
    };
    document.documentElement.classList.add('tv-live');
  }

  function scale() {
    var s = Math.min(window.innerWidth / W, window.innerHeight / H);
    stage.style.transform = 'scale(' + s + ')';
  }
  window.addEventListener('resize', scale);
  scale();

  function over(el) { return el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1; }
  function anyOver(box) {
    if (over(box)) return true;
    for (var c = box.firstElementChild; c; c = c.nextElementSibling) {
      if ((c.classList.contains('card') || c.classList.contains('pill')) && over(c)) return true;
    }
    return false;
  }

  function stagger() {
    var imgs = document.querySelectorAll('.dish img');
    for (var a = 0; a < imgs.length; a++) {
      imgs[a].style.setProperty('--ft', (5 + (a * 37 % 30) / 10) + 's');
      imgs[a].style.setProperty('--fd', (-(a * 1.3) % 7) + 's');
    }
    var tags = document.querySelectorAll('.price');
    for (a = 0; a < tags.length; a++) tags[a].style.setProperty('--pd', (a * 0.55 % 6) + 's');
  }

  function fitAll() {
    var root = document.documentElement;
    root.classList.add('measuring');           // freeze animations while measuring
    var boxes = document.querySelectorAll('[data-fit]');
    for (var i = 0; i < boxes.length; i++) {
      var b = boxes[i], k = 1;
      b.style.setProperty('--k', '1');
      while (k > 0.5 && anyOver(b)) { k -= 0.025; b.style.setProperty('--k', k.toFixed(3)); }
    }
    root.classList.remove('measuring');
    stagger();
    var ev;
    try { ev = new Event('yummy:layout'); } catch (e) { ev = document.createEvent('Event'); ev.initEvent('yummy:layout', true, true); }
    window.dispatchEvent(ev);
  }
  window.yummyFit = fitAll;

  /* free horizontal gaps in the header (where themes hang ornaments / fireworks) */
  window.yummyGaps = function (minW) {
    var hdr = document.querySelector('.hdr');
    if (!hdr) return [];
    var s = stage.getBoundingClientRect(), sc = s.width / W, spans = [];
    var kids = hdr.children;
    for (var i = 0; i < kids.length; i++) {
      var r = kids[i].getBoundingClientRect();
      if (r.width < 2) continue;
      spans.push([(r.left - s.left) / sc, (r.right - s.left) / sc]);
    }
    spans.sort(function (a, b) { return a[0] - b[0]; });
    var gaps = [], x = 40;
    for (i = 0; i < spans.length; i++) {
      if (spans[i][0] - x >= (minW || 140)) gaps.push([x, spans[i][0]]);
      x = Math.max(x, spans[i][1]);
    }
    if (W - 40 - x >= (minW || 140)) gaps.push([x, W - 40]);
    var hr = hdr.getBoundingClientRect();
    return gaps.map(function (g) { return { x0: g[0], x1: g[1], y0: (hr.top - s.top) / sc, y1: (hr.bottom - s.top) / sc }; });
  };

  /* draws a picture as a waving flag (cloth ripples, light & shade).
     anchor 'left' = the pole side stays still on the left ('right' = pole on the right). */
  window.yummyWave = function (ctx, img, x, y, w, h, t, o) {
    o = o || {};
    if (!img || !(img.naturalWidth || img.width)) return;
    var amp = o.amp != null ? o.amp : h * 0.1, waves = o.waves || 1.5, speed = o.speed || 3.4, step = o.step || (LIVE ? 7 : 3);
    var iw = img.naturalWidth || img.width, ih = img.naturalHeight || img.height, right = o.anchor === 'right';
    for (var sx = 0; sx < w; sx += step) {
      var sw = Math.min(step + 1, w - sx);
      var u = right ? 1 - (sx + sw / 2) / w : (sx + sw / 2) / w;      // 0 at the pole, 1 at the free end
      var ph = u * waves * 2 * Math.PI - t * speed;
      var dy = Math.sin(ph) * amp * Math.min(1, u * 1.6);
      var shade = Math.cos(ph) * Math.min(1, u * 1.6);
      ctx.drawImage(img, sx / w * iw, 0, sw / w * iw, ih, x + sx, y + dy, sw, h);
      ctx.fillStyle = shade > 0 ? 'rgba(255,255,255,' + (shade * .16).toFixed(3) + ')' : 'rgba(0,0,0,' + (-shade * .3).toFixed(3) + ')';
      ctx.fillRect(x + sx, y + dy, sw, h);
    }
  };
  window.yummyPole = function (ctx, x, top, bottom) {
    var g = ctx.createLinearGradient(x - 3, 0, x + 3, 0);
    g.addColorStop(0, '#8f6c14'); g.addColorStop(.5, '#fff0b0'); g.addColorStop(1, '#9c7a1c');
    ctx.fillStyle = g; ctx.fillRect(x - 3, top, 6, bottom - top);
    var b = ctx.createRadialGradient(x - 2, top - 3, 1, x, top - 1, 9);
    b.addColorStop(0, '#fff6cf'); b.addColorStop(1, '#b88c22');
    ctx.fillStyle = b; ctx.beginPath(); ctx.arc(x, top - 2, 8, 0, 6.3); ctx.fill();
  };

  fitAll();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll);
  window.addEventListener('load', fitAll);

  if (!cfg.preview) {
    window.addEventListener('keydown', function (e) {
      if (/^[1-9]$/.test(e.key) && +e.key <= (cfg.count || 3)) location.href = 'tv' + e.key + '.html';
      if (e.key === 'f' || e.key === 'F') {
        var d = document.documentElement;
        if (!document.fullscreenElement && d.requestFullscreen) d.requestFullscreen();
        else if (document.exitFullscreen) document.exitFullscreen();
      }
    });
  }
})();
