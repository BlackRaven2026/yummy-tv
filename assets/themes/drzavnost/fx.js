/* Yummy – theme "Dan državnosti": the Montenegro flag waving in the header, golden laurel
   sprigs, gold dust, slow light beams.
   Big animation (can be switched off): the flag flying across all TVs behind the menu,
   timed by the clock so the TVs stay in step. */
(function () {
  var W = 1920, H = 1080;
  var stage = document.getElementById('stage');
  var CFG = window.YUMMY || {}, BIG = CFG.big !== false;
  function rnd(a, b) { return a + Math.random() * (b - a); }

  /* ---------- laurel sprigs in the free space of the header ---------- */
  function laurelSvg() {
    var s = '<svg viewBox="-40 -6 80 86"><path d="M0 0Q-4 40 0 78" stroke="#b88c22" stroke-width="2.4" fill="none"/>';
    for (var i = 0; i < 6; i++) {
      var y = 10 + i * 11, sz = 1 - i * .06;
      s += '<ellipse cx="-11" cy="' + y + '" rx="' + (11 * sz).toFixed(1) + '" ry="' + (4.5 * sz).toFixed(1) + '" transform="rotate(-32 -11 ' + y + ')" fill="url(#lau)"/>';
      s += '<ellipse cx="11" cy="' + (y + 5) + '" rx="' + (11 * sz).toFixed(1) + '" ry="' + (4.5 * sz).toFixed(1) + '" transform="rotate(32 11 ' + (y + 5) + ')" fill="url(#lau)"/>';
    }
    return s + '<defs><linearGradient id="lau" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff0b0"/><stop offset=".5" stop-color="#d3ae3b"/><stop offset="1" stop-color="#8f6c14"/></linearGradient></defs>' +
      '<path d="M-7 0L0 -6L7 0L0 6Z" fill="#c40308" stroke="#d3ae3b" stroke-width="1.5"/></svg>';
  }
  var me = document.currentScript && document.currentScript.src;
  var flag = document.createElement('img');
  flag.alt = ''; flag.style.display = 'none';
  flag.src = me ? me.replace(/drzavnost\/fx\.js(\?.*)?$/, 'nezavisnost/flag-me.png') : 'assets/themes/nezavisnost/flag-me.png';
  stage.appendChild(flag);
  var spot = null;
  var hung = [];
  function placeLaurels() {
    hung.forEach(function (e) { if (e.parentNode) e.parentNode.removeChild(e); });
    hung = [];
    var gaps = window.yummyGaps ? window.yummyGaps(150) : [];
    gaps.sort(function (a, b) { return (b.x1 - b.x0) - (a.x1 - a.x0); });
    spot = null;
    if (gaps.length && gaps[0].x1 - gaps[0].x0 >= 190) {
      var g0 = gaps.shift(), w = Math.min(240, g0.x1 - g0.x0 - 70), h = w / 2, y0 = Math.max(26, (g0.y0 + g0.y1) / 2 - h / 2 - 8);
      spot = { pole: (g0.x0 + g0.x1) / 2 - w / 2, top: y0 - 14, bottom: Math.min(y0 + h + 40, g0.y1 + 10), x: (g0.x0 + g0.x1) / 2 - w / 2 + 3, y: y0, w: w, h: h };
    }
    gaps.slice(0, 1).forEach(function (g) {
      var cx = (g.x0 + g.x1) / 2, offs = g.x1 - g.x0 >= 280 ? [[-70, 56], [0, 90], [70, 44]] : [[-34, 60], [34, 84]];
      offs.forEach(function (o, n) {
        var d = document.createElement('div');
        d.className = 'laurel';
        d.style.cssText = 'left:' + (cx + o[0]) + 'px;--len:' + o[1] + 'px;--sw:' + (5 + n * .7) + 's;--sd:-' + n + 's';
        d.innerHTML = '<div class="swing"><div class="cord"></div>' + laurelSvg() + '</div>';
        stage.appendChild(d); hung.push(d);
      });
    });
  }
  window.addEventListener('yummy:layout', placeLaurels);
  placeLaurels();

  /* ---------- canvases ---------- */
  var back = document.getElementById('fx-back'), front = document.getElementById('fx-front');
  back.width = front.width = W; back.height = front.height = H;
  var bx = back.getContext('2d'), fx = front.getContext('2d');
  var dust = [];
  for (var i = 0; i < 90; i++) dust.push({ x: rnd(0, W), y: rnd(0, H), r: rnd(.6, 2), vy: -rnd(4, 14), sw: rnd(8, 30), p: rnd(0, 6.28), sp: rnd(.2, .6), red: Math.random() < .25 });

  /* the flying flag: the pole leads, the flag streams behind it */
  var VIDEO = /[?&]video\b/.test(location.search);
  var PAGE = CFG.tv || 1, COUNT = CFG.count || 3;
  var LAP = 10 * COUNT, CYCLE = 60, RING = COUNT * W, V = RING / LAP;
  var FW = 300, FH = 150, sparks = [];
  function pathAt(t) {
    return { x: V * t, y: 420 + 230 * Math.sin(2 * Math.PI * t / 10 + .4) + 50 * Math.sin(2 * Math.PI * t / 3.3) };
  }
  function drawFlight(now, dt) {
    var clock = VIDEO ? now : Date.now();
    var t = ((clock % (CYCLE * 1000)) + CYCLE * 1000) % (CYCLE * 1000) / 1000;
    var p = pathAt(t), p2 = pathAt(t + .05);
    var x = ((p.x - (PAGE - 1) * W) % RING + RING) % RING;           // pole position on this TV
    if (x > 0 && x < W + FW) {
      var tilt = Math.atan2(p2.y - p.y, V * .05) * .5;
      bx.save();
      bx.translate(x, p.y); bx.rotate(tilt); bx.translate(-x, -p.y);
      bx.globalAlpha = .93;
      bx.shadowColor = 'rgba(0,0,0,.5)'; bx.shadowBlur = 18; bx.shadowOffsetY = 8;
      window.yummyWave(bx, flag, x - FW, p.y - FH / 2, FW, FH, t, { anchor: 'right', amp: FH * .13, waves: 1.6, speed: 6 });
      bx.shadowColor = 'transparent';
      window.yummyPole(bx, x + 3, p.y - FH / 2 - 14, p.y + FH / 2 + 80);
      bx.restore();
      for (var i = 0; i < 2; i++) sparks.push({ x: x - FW + rnd(-10, 20), y: p.y + rnd(-FH / 2, FH / 2), vx: -rnd(20, 70), vy: rnd(-15, 15), life: 0, max: rnd(.8, 1.6), r: rnd(1, 2.6) });
    }
    bx.globalCompositeOperation = 'lighter';
    for (var j = sparks.length - 1; j >= 0; j--) {
      var q = sparks[j];
      q.life += dt;
      if (q.life > q.max) { sparks.splice(j, 1); continue; }
      q.x += q.vx * dt; q.y += q.vy * dt;
      bx.globalAlpha = .7 * (1 - q.life / q.max);
      bx.fillStyle = '#ffe9a6'; bx.beginPath(); bx.arc(q.x, q.y, q.r, 0, 6.3); bx.fill();
    }
    bx.globalAlpha = 1; bx.globalCompositeOperation = 'source-over';
  }

  var last = performance.now();
  function frame(now) {
    var dt = Math.min(.05, (now - last) / 1000); last = now;
    var tm = now / 1000;
    bx.clearRect(0, 0, W, H);
    for (var i = 0; i < dust.length; i++) {
      var d = dust[i];
      d.y += d.vy * dt; if (d.y < -5) { d.y = H + 5; d.x = rnd(0, W); }
      var al = .2 + .4 * (0.5 + 0.5 * Math.sin(tm * 1.5 + d.p));
      bx.fillStyle = d.red ? 'rgba(255,70,70,' + (al * .7).toFixed(3) + ')' : 'rgba(255,225,140,' + al.toFixed(3) + ')';
      bx.beginPath(); bx.arc(d.x + Math.sin(tm * d.sp + d.p) * d.sw, d.y, d.r, 0, 6.3); bx.fill();
    }
    if (BIG) drawFlight(now, dt);
    fx.clearRect(0, 0, W, H);
    if (spot) {
      window.yummyPole(fx, spot.pole, spot.top, spot.bottom);
      fx.save(); fx.shadowColor = 'rgba(0,0,0,.5)'; fx.shadowBlur = 14; fx.shadowOffsetY = 6;
      window.yummyWave(fx, flag, spot.x, spot.y, spot.w, spot.h, tm, { amp: spot.h * .09, waves: 1.3, speed: 3 });
      fx.restore();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
