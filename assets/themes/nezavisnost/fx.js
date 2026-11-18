/* Yummy – theme "Dan nezavisnosti": waving red-gold flags in the header, gold glitter.
   Big animation (can be switched off): a red, gold & white fireworks show with confetti. */
(function () {
  var W = 1920, H = 1080;
  var stage = document.getElementById('stage');
  var CFG = window.YUMMY || {}, BIG = CFG.big !== false;
  function rnd(a, b) { return a + Math.random() * (b - a); }

  /* ---------- the real Montenegro flag, waving on gold poles in the free space of the header ---------- */
  var me = document.currentScript && document.currentScript.src;
  var flag = document.createElement('img');
  flag.alt = ''; flag.style.display = 'none';
  flag.src = me ? me.replace(/fx\.js(\?.*)?$/, 'flag-me.png') : 'assets/themes/nezavisnost/flag-me.png';
  stage.appendChild(flag);                       // (in the page, so the video recorder waits for it)
  var spots = [];
  function placeFlags() {
    var gaps = window.yummyGaps ? window.yummyGaps(190) : [];
    gaps.sort(function (a, b) { return (b.x1 - b.x0) - (a.x1 - a.x0); });
    spots = gaps.slice(0, 2).map(function (g, i) {
      var w = Math.min(i ? 210 : 250, g.x1 - g.x0 - 70), h = w / 2;
      var y0 = Math.max(26, (g.y0 + g.y1) / 2 - h / 2 - 8);
      return { pole: (g.x0 + g.x1) / 2 - w / 2, top: y0 - 14, bottom: Math.min(y0 + h + 40, g.y1 + 10), x: (g.x0 + g.x1) / 2 - w / 2 + 3, y: y0, w: w, h: h, ph: i * 1.7 };
    });
  }
  window.addEventListener('yummy:layout', placeFlags);
  placeFlags();
  function drawFlags(tm) {
    for (var i = 0; i < spots.length; i++) {
      var f = spots[i];
      window.yummyPole(fx, f.pole, f.top, f.bottom);
      fx.save(); fx.shadowColor = 'rgba(40,0,0,.45)'; fx.shadowBlur = 14; fx.shadowOffsetY = 6;
      window.yummyWave(fx, flag, f.x, f.y, f.w, f.h, tm + f.ph, { amp: f.h * .09, waves: 1.3, speed: 3 });
      fx.restore();
    }
  }

  /* ---------- canvases ---------- */
  var back = document.getElementById('fx-back'), front = document.getElementById('fx-front');
  back.width = front.width = W; back.height = front.height = H;
  var bx = back.getContext('2d'), fx = front.getContext('2d');
  var spr = document.createElement('canvas'); spr.width = spr.height = 32;
  var sc = spr.getContext('2d'), sg = sc.createRadialGradient(16, 16, 0, 16, 16, 16);
  sg.addColorStop(0, 'rgba(255,250,225,1)'); sg.addColorStop(.35, 'rgba(255,220,120,.8)'); sg.addColorStop(1, 'rgba(255,200,80,0)');
  sc.fillStyle = sg; sc.fillRect(0, 0, 32, 32);

  var glitter = [];
  for (var i = 0; i < 70; i++) glitter.push({ x: rnd(0, W), y: rnd(0, H), r: rnd(1, 3), vy: rnd(6, 16), p: rnd(0, 6.28), v: rnd(1, 3) });

  var COLS = [[255, 233, 166], [211, 174, 59], [255, 255, 255], [255, 90, 80], [255, 200, 90]];
  var sparks = [], rockets = [], confetti = [];
  function burst(x, y, big) {
    var col = COLS[(Math.random() * COLS.length) | 0], col2 = COLS[(Math.random() * COLS.length) | 0];
    var n = big ? 90 : 50, spd = big ? rnd(170, 240) : rnd(100, 150);
    for (var i = 0; i < n; i++) {
      var a = i / n * 6.283 + rnd(-.04, .04), v = spd * rnd(.7, 1);
      sparks.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: rnd(1.4, 2.3), c: i % 3 ? col : col2 });
    }
    if (big) for (i = 0; i < 26; i++) confetti.push({ x: x + rnd(-60, 60), y: y + rnd(-30, 30), vx: rnd(-60, 60), vy: rnd(-40, 30),
      rot: rnd(0, 6.28), vr: rnd(-6, 6), w: rnd(6, 11), h: rnd(3, 6), c: Math.random() < .5 ? '#d3ae3b' : (Math.random() < .5 ? '#ffffff' : '#ff3b3b'), life: 0, max: rnd(3, 5) });
  }
  var nextSmall = performance.now() + 2000, nextRocket = performance.now() + 1200;

  var last = performance.now();
  function frame(now) {
    var dt = Math.min(.05, (now - last) / 1000); last = now;
    var tm = now / 1000;
    bx.clearRect(0, 0, W, H);
    // gold glitter falling slowly
    for (var i = 0; i < glitter.length; i++) {
      var g = glitter[i];
      g.y += g.vy * dt; if (g.y > H + 5) { g.y = -5; g.x = rnd(0, W); }
      bx.globalAlpha = .25 + .45 * (0.5 + 0.5 * Math.sin(tm * g.v + g.p));
      bx.drawImage(spr, g.x - g.r * 2, g.y - g.r * 2, g.r * 4, g.r * 4);
    }
    bx.globalAlpha = 1;
    // small bursts behind the menu (always); the big show only when switched on
    if (now > nextSmall) {
      var gaps = window.yummyGaps ? window.yummyGaps(160) : [];
      var z = gaps.length ? gaps[(Math.random() * gaps.length) | 0] : { x0: 300, x1: 1600 };
      burst(rnd(z.x0 + 30, z.x1 - 30), rnd(80, 160), false);
      nextSmall = now + rnd(BIG ? 2500 : 4500, BIG ? 4500 : 8000);
    }
    if (BIG && now > nextRocket) {
      rockets.push({ x: rnd(160, W - 160), y: H + 10, vy: -rnd(620, 760), ty: rnd(200, 520) });
      nextRocket = now + rnd(1400, 2600);
    }
    bx.globalCompositeOperation = 'lighter';
    for (i = rockets.length - 1; i >= 0; i--) {
      var r = rockets[i];
      r.y += r.vy * dt;
      bx.globalAlpha = .9; bx.drawImage(spr, r.x - 6, r.y - 6, 12, 12);
      for (var k = 1; k < 6; k++) { bx.globalAlpha = .35 * (1 - k / 6); bx.drawImage(spr, r.x - 4, r.y + k * 14 - 4, 8, 8); }
      if (r.y <= r.ty) { burst(r.x, r.y, true); rockets.splice(i, 1); }
    }
    for (i = sparks.length - 1; i >= 0; i--) {
      var s = sparks[i];
      s.life += dt;
      if (s.life > s.max) { sparks.splice(i, 1); continue; }
      s.vx *= (1 - 1.5 * dt); s.vy = s.vy * (1 - 1.5 * dt) + 45 * dt;
      var px = s.x, py = s.y;
      s.x += s.vx * dt; s.y += s.vy * dt;
      var kk = 1 - s.life / s.max, al = .7 * kk * kk;
      bx.globalAlpha = 1;
      bx.strokeStyle = 'rgba(' + s.c[0] + ',' + s.c[1] + ',' + s.c[2] + ',' + al.toFixed(3) + ')';
      bx.lineWidth = 2.2;
      bx.beginPath(); bx.moveTo(px - s.vx * .05, py - s.vy * .05); bx.lineTo(s.x, s.y); bx.stroke();
    }
    bx.globalAlpha = 1; bx.globalCompositeOperation = 'source-over';
    // confetti in front, falling and fading
    fx.clearRect(0, 0, W, H);
    drawFlags(tm);
    for (i = confetti.length - 1; i >= 0; i--) {
      var c = confetti[i];
      c.life += dt;
      if (c.life > c.max || c.y > H + 20) { confetti.splice(i, 1); continue; }
      c.vy += 60 * dt; c.vy = Math.min(c.vy, 90); c.vx *= (1 - .8 * dt);
      c.x += (c.vx + Math.sin(tm * 3 + c.rot) * 20) * dt; c.y += c.vy * dt; c.rot += c.vr * dt;
      fx.save(); fx.translate(c.x, c.y); fx.rotate(c.rot); fx.scale(1, Math.abs(Math.sin(c.rot * 1.3)) * .8 + .2);
      fx.globalAlpha = .85 * Math.min(1, (c.max - c.life) / 1);
      fx.fillStyle = c.c; fx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
      fx.restore();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
