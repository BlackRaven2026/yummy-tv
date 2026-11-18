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

  /* the moon sits in the widest free space of the header */
  var moon = document.querySelector('.moon');
  function placeMoon() {
    if (!moon) return;
    var gaps = window.yummyGaps ? window.yummyGaps(170) : [];
    gaps.sort(function (a, b) { return (b.x1 - b.x0) - (a.x1 - a.x0); });
    if (!gaps.length) { moon.style.visibility = 'hidden'; return; }
    moon.style.left = ((gaps[0].x0 + gaps[0].x1) / 2 - 52) + 'px';
    moon.style.visibility = 'visible';
  }
  window.addEventListener('yummy:layout', placeMoon);
  placeMoon();

  /* ---------- canvases ---------- */
  var back = document.getElementById('fx-back'), front = document.getElementById('fx-front');
  back.width = front.width = W; back.height = front.height = H;
  var bx = back.getContext('2d'), fx = front.getContext('2d');
  var stars = [];
  for (var i = 0; i < 180; i++) stars.push({ x: rnd(0, W), y: rnd(0, H * .8), r: rnd(.5, 1.8), p: rnd(0, 6.28), v: rnd(.4, 1.6), b: Math.random() < .08 });
  var mist = [];
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
      else { bx.fillStyle = 'rgba(255,248,230,' + al.toFixed(3) + ')'; bx.fillRect(st.x, st.y, st.r, st.r); }
    }
    for (i = 0; i < mist.length; i++) {
      var m = mist[i];
      m.x += m.vx * dt; if (m.x < -m.w) m.x = W + m.w; if (m.x > W + m.w) m.x = -m.w;
      var g = bx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.w / 2);
      g.addColorStop(0, 'rgba(200,215,235,' + m.a + ')'); g.addColorStop(1, 'rgba(200,215,235,0)');
      bx.fillStyle = g;
      bx.save(); bx.translate(m.x, m.y); bx.scale(1, m.h / m.w); bx.translate(-m.x, -m.y);
      bx.beginPath(); bx.arc(m.x, m.y, m.w / 2, 0, 6.3); bx.fill(); bx.restore();
    }
    fx.clearRect(0, 0, W, H);
    if (BIG) drawComet(now);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
