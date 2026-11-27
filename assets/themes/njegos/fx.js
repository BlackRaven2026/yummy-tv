/* Yummy – theme "Njegošev dan": Lovćen ridges, twinkling stars, drifting mist.
   Big animation (can be switched off): a shooting star – a "luča" – that crosses all
   TVs one after another, timed by the clock so the TVs stay in step. */
(function () {
  var W = 1920, H = 1080;
  var stage = document.getElementById('stage');
  var CFG = window.YUMMY || {}, BIG = CFG.big !== false;
  function rnd(a, b) { return a + Math.random() * (b - a); }

  /* ---------- Lovćen ridges (three layers) with the chapel on the peak ---------- */
  var lv = document.querySelector('.lovcen');
  if (lv) {
    function ridge(base, amp, seed, step) {
      var d = 'M0 300L0 ' + base;
      for (var x = 0; x <= W; x += step) {
        var y = base - amp * (0.55 * Math.sin(x / 260 + seed) + 0.3 * Math.sin(x / 97 + seed * 2) + 0.15 * Math.sin(x / 41 + seed * 3));
        d += 'L' + x + ' ' + y.toFixed(1);
      }
      return d + 'L' + W + ' 300Z';
    }
    // the main peak (Jezerski vrh) with a small chapel silhouette
    var px = 1380, peak = 'M' + (px - 420) + ' 300L' + (px - 120) + ' 120L' + (px - 40) + ' 70L' + (px + 30) + ' 64L' + (px + 140) + ' 118L' + (px + 460) + ' 300Z';
    var chapel = '<path d="M' + (px - 8) + ' 66L' + (px - 8) + ' 46L' + (px + 6) + ' 36L' + (px + 20) + ' 46L' + (px + 20) + ' 66Z" fill="#0d1828" opacity=".9"/>';
    lv.innerHTML = '<svg width="1920" height="300" viewBox="0 0 1920 300">' +
      '<defs><linearGradient id="lr1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22385a"/><stop offset="1" stop-color="#132339"/></linearGradient>' +
      '<linearGradient id="lr2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1a2c48"/><stop offset="1" stop-color="#0e1a2c"/></linearGradient>' +
      '<linearGradient id="lr3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#111f35"/><stop offset="1" stop-color="#0a1220"/></linearGradient></defs>' +
      '<path d="' + ridge(140, 70, 1.3, 24) + '" fill="url(#lr1)" opacity=".55"/>' +
      '<path d="' + peak + '" fill="url(#lr2)" opacity=".7"/>' + chapel +
      '<path d="' + ridge(205, 50, 4.1, 20) + '" fill="url(#lr2)" opacity=".75"/>' +
      '<path d="' + ridge(255, 30, 7.7, 16) + '" fill="url(#lr3)" opacity=".85"/>' + '</svg>';
  }

  /* the Njegoš cameo (portrait: Johann Böss, 1847 – public domain) sits in the widest free space of the header */
  var me = document.currentScript && document.currentScript.src;
  var cameo = document.querySelector('.cameo');
  if (cameo) {
    var laurel = '';
    for (var li = 0; li < 5; li++) {
      var lx = 46 - li * 9, ly = 18 + li * 3.2;
      laurel += '<ellipse cx="' + lx + '" cy="' + ly + '" rx="7" ry="2.8" transform="rotate(' + (-25 - li * 10) + ' ' + lx + ' ' + ly + ')"/>' +
                '<ellipse cx="' + (118 - lx) + '" cy="' + ly + '" rx="7" ry="2.8" transform="rotate(' + (25 + li * 10) + ' ' + (118 - lx) + ' ' + ly + ')"/>';
    }
    cameo.innerHTML = '<div class="oval"><img alt="Petar II Petrović Njegoš" src="' + (me ? me.replace(/fx\.js(\?.*)?$/, 'njegos-portrait.jpg') : 'assets/themes/njegos/njegos-portrait.jpg') + '"></div>' +
      '<svg viewBox="0 0 118 40"><g fill="#c9a45c">' + laurel + '</g><path d="M50 32q9 6 18 0" stroke="#c9a45c" stroke-width="2" fill="none"/>' +
      '<path d="M59 26l4 4-4 4-4-4z" fill="#f2dca0" stroke="#8c6a2c" stroke-width="1"/></svg>';
  }
  function placeCameo() {
    if (!cameo) return;
    var gaps = window.yummyGaps ? window.yummyGaps(150) : [];
    gaps.sort(function (a, b) { return (b.x1 - b.x0) - (a.x1 - a.x0); });
    if (!gaps.length) { cameo.style.visibility = 'hidden'; return; }
    cameo.style.left = ((gaps[0].x0 + gaps[0].x1) / 2 - 70) + 'px';
    cameo.style.top = Math.max(8, (gaps[0].y0 + gaps[0].y1) / 2 - 92) + 'px';
    cameo.style.visibility = 'visible';
  }
  window.addEventListener('yummy:layout', placeCameo);
  placeCameo();

  /* line-art corner ornaments on the gold frame */
  var fr = document.querySelector('.nframe');
  if (fr) {
    var C = '<svg viewBox="0 0 92 92"><g fill="none" stroke="#c9a45c" stroke-width="1.6" stroke-linecap="round">' +
      '<path d="M2 60V14Q2 2 14 2h46"/><path d="M10 52V20q0-10 10-10h32"/>' +
      '<path d="M20 20c10 2 16 8 18 18M20 20c2 10 8 16 18 18"/><path d="M38 38q6-14 20-12M38 38q-14 6-12 20"/>' +
      '<path d="M58 26q8 0 10-6M26 58q0 8-6 10"/></g><path d="M20 20l5-2-2 5z" fill="#f2dca0"/>' +
      '<circle cx="38" cy="38" r="3" fill="#f2dca0"/></svg>';
    fr.innerHTML = ['left:-6px;top:-6px', 'right:-6px;top:-6px;transform:scaleX(-1)', 'left:-6px;bottom:-6px;transform:scaleY(-1)',
      'right:-6px;bottom:-6px;transform:scale(-1,-1)'].map(function (st) { return C.replace('<svg ', '<svg style="' + st + '" '); }).join('');
  }

  /* ---------- canvases ---------- */
  var back = document.getElementById('fx-back'), front = document.getElementById('fx-front');
  var bx = window.yummyCanvas(back), fx = window.yummyCanvas(front);
  var stars = [];
  for (var i = 0; i < 180; i++) stars.push({ x: rnd(0, W), y: rnd(0, H * .8), r: rnd(.5, 1.8), p: rnd(0, 6.28), v: rnd(.4, 1.6), b: Math.random() < .08 });
  var mist = [], mistSpr = null;
  for (i = 0; i < 7; i++) mist.push({ x: rnd(0, W), y: rnd(760, 980), w: rnd(400, 800), h: rnd(60, 120), vx: rnd(-10, 10), a: rnd(.04, .08) });

  var glow = document.createElement('canvas'); glow.width = glow.height = 64;
  var gc = glow.getContext('2d'), gg = gc.createRadialGradient(32, 32, 0, 32, 32, 32);
  gg.addColorStop(0, 'rgba(255,252,240,1)'); gg.addColorStop(.25, 'rgba(242,220,160,.7)'); gg.addColorStop(1, 'rgba(242,220,160,0)');
  gc.fillStyle = gg; gc.fillRect(0, 0, 64, 64);

  /* ---------- big animation: the luča (shooting star) ----------
     Every 20 s it flies from the left of TV 1 to the right of TV 3 in ~4 s,
     on a gently falling arc – each TV computes the same flight from the clock. */
  var VIDEO = /[?&]video\b/.test(location.search);
  var PAGE = CFG.tv || 1, COUNT = CFG.count || 3;
  var EVERY = 20, FLIGHT = 1.5 * COUNT, TAIL = 0.55;
  function cometAt(s) {                          // s = 0..1 progress of a flight
    var gx = -200 + (COUNT * W + 400) * s;
    var gy = 150 + 300 * s * s + 60 * Math.sin(s * 9);
    return { x: gx - (PAGE - 1) * W, y: gy };
  }
  function drawComet(now) {
    var clock = VIDEO ? now : Date.now();
    var t = ((clock % 60000) + 60000) % 60000 / 1000;
    var ft = t % EVERY;
    if (ft > FLIGHT + TAIL) return;
    var s = ft / FLIGHT;
    fx.globalCompositeOperation = 'lighter';
    for (var i = 0; i < 40; i++) {               // tail: older positions, fading
      var ss = s - TAIL / FLIGHT * i / 40;
      if (ss < 0 || ss > 1) continue;
      var p = cometAt(ss);
      if (p.x < -100 || p.x > W + 100) continue;
      var k = 1 - i / 40, d = 6 + 44 * k * k;
      fx.globalAlpha = .55 * k;
      fx.drawImage(glow, p.x - d / 2, p.y - d / 2, d, d);
    }
    if (s <= 1) {
      var h = cometAt(s);
      if (h.x > -100 && h.x < W + 100) {
        fx.globalAlpha = 1; fx.drawImage(glow, h.x - 40, h.y - 40, 80, 80);
        fx.globalAlpha = .9; fx.drawImage(glow, h.x - 12, h.y - 12, 24, 24);
        fx.strokeStyle = 'rgba(255,250,235,.6)'; fx.lineWidth = 1.2;  // little cross flare
        fx.beginPath(); fx.moveTo(h.x - 26, h.y); fx.lineTo(h.x + 26, h.y); fx.moveTo(h.x, h.y - 26); fx.lineTo(h.x, h.y + 26); fx.stroke();
      }
    }
    fx.globalAlpha = 1; fx.globalCompositeOperation = 'source-over';
  }

  var last = performance.now();
  function frame(now) {
    var dt = Math.min(.05, (now - last) / 1000); last = now;
    var tm = now / 1000;
    bx.clearRect(0, 0, W, H);
    for (var i = 0; i < stars.length; i++) {
      var st = stars[i], al = .25 + .6 * (0.5 + 0.5 * Math.sin(tm * st.v + st.p));
      if (st.b) { bx.globalAlpha = al * .8; bx.drawImage(glow, st.x - 6, st.y - 6, 12, 12); bx.globalAlpha = 1; }
      else { bx.globalAlpha = al; bx.fillStyle = '#fff8e6'; bx.fillRect(st.x, st.y, st.r, st.r); bx.globalAlpha = 1; }
    }
    for (i = 0; i < mist.length; i++) {
      var m = mist[i];
      m.x += m.vx * dt; if (m.x < -m.w) m.x = W + m.w; if (m.x > W + m.w) m.x = -m.w;
      if (!mistSpr) { mistSpr = document.createElement('canvas'); mistSpr.width = mistSpr.height = 128; var mg = mistSpr.getContext('2d'), gr = mg.createRadialGradient(64, 64, 0, 64, 64, 64); gr.addColorStop(0, 'rgba(200,215,235,1)'); gr.addColorStop(1, 'rgba(200,215,235,0)'); mg.fillStyle = gr; mg.fillRect(0, 0, 128, 128); }
      bx.globalAlpha = m.a; bx.drawImage(mistSpr, m.x - m.w / 2, m.y - m.h / 2, m.w, m.h); bx.globalAlpha = 1;
    }
    fx.clearRect(0, 0, W, H);
    if (BIG) drawComet(now);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
