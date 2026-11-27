/* Yummy – theme "Božić" (Orthodox Christmas): oak-leaf badnjak garland, hanging
   badnjak bundles and straw stars, rising embers from the fire.
   Big animation (can be switched off): a golden Christmas star flying across all
   TVs, timed by the clock so the TVs stay in step. */
(function () {
  var W = 1920, H = 1080;
  var stage = document.getElementById('stage');
  var CFG = window.YUMMY || {}, BIG = CFG.big !== false;
  var NS = 'http://www.w3.org/2000/svg';
  function rnd(a, b) { return a + Math.random() * (b - a); }

  var LEAF = 'M0 0C3 -3 6 -3 8 -6C10 -3 12 -5 14 -8C16 -4 19 -5 21 -8C23 -3 27 -3 30 0C27 3 23 3 21 8C19 5 16 4 14 8C12 5 10 3 8 6C6 3 3 3 0 0Z';
  var LEAF_C = [['#8fae4f', '#5b7a2c'], ['#7a9840', '#4d6a24'], ['#c49a4a', '#8a6224'], ['#a8843c', '#6e4e1c']];
  function leafSvg(x, y, ang, sc, ci, i) {
    var c = LEAF_C[ci % LEAF_C.length];
    return '<g transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + ang.toFixed(1) + ') scale(' + sc.toFixed(2) + ')">' +
      '<path class="leaf" d="' + LEAF + '" fill="url(#lg' + (ci % LEAF_C.length) + ')" stroke="rgba(40,30,10,.35)" stroke-width=".6" ' +
      'style="--r0:' + (-6 - (i % 3)) + 'deg;--r1:' + (5 + (i % 4)) + 'deg;--t:' + (3 + (i % 5) * .45).toFixed(2) + 's;--d:-' + (i % 7) * .5 + 's"/>' +
      '<path d="M1 0L27 0" stroke="rgba(60,45,15,.45)" stroke-width=".7"/></g>';
  }
  function acorn(x, y, sc) {
    return '<g transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') scale(' + sc + ')">' +
      '<ellipse cx="0" cy="7" rx="5" ry="7" fill="#b9853f"/><ellipse cx="-1.5" cy="5" rx="1.6" ry="3" fill="#e6b973" opacity=".7"/>' +
      '<path d="M-6 2Q0 -6 6 2Q0 4 -6 2Z" fill="#6b4a22"/><path d="M0 -3L1 -6" stroke="#6b4a22" stroke-width="1.5"/></g>';
  }
  function bow(x, y, sc) {
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + sc + ')">' +
      '<path d="M0 0C-14 -12 -22 -2 -16 6C-10 10 -4 4 0 0Z" fill="#c42a2a"/><path d="M0 0C14 -12 22 -2 16 6C10 10 4 4 0 0Z" fill="#a51e1e"/>' +
      '<path d="M-2 1L-9 20L-4 18L0 22Z" fill="#a51e1e"/><path d="M2 1L9 20L4 18L0 22Z" fill="#c42a2a"/><circle r="4" fill="#d83a3a"/></g>';
  }
  var DEFS = '<defs>' + LEAF_C.map(function (c, i) {
    return '<linearGradient id="lg' + i + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c[0] + '"/><stop offset="1" stop-color="' + c[1] + '"/></linearGradient>';
  }).join('') + '</defs>';

  /* ---------- oak garland ---------- */
  var oak = document.getElementById('oak');
  if (oak) {
    var swags = 6, top = 8, sag = 30, span = W / swags, svg = '<svg width="1920" height="96">' + DEFS, path = '', n = 0;
    for (var i = 0; i < swags; i++) {
      var x0 = i * span;
      path += (i ? 'L' : 'M') + x0 + ' ' + top + ' Q ' + (x0 + span / 2) + ' ' + (top + sag * 2) + ' ' + (x0 + span) + ' ' + top + ' ';
    }
    svg += '<path d="' + path + '" fill="none" stroke="#5a3a1c" stroke-width="4" stroke-linecap="round"/>';
    for (i = 0; i < swags; i++) {
      for (var j = 1; j < 14; j++) {
        var t = j / 14, x = i * span + t * span, y = top + 2 * t * (1 - t) * sag * 2;
        var tang = Math.atan(2 * (1 - 2 * t) * sag * 2 / span) * 57.3;
        var side = j % 2 ? -1 : 1;
        svg += leafSvg(x, y, tang + side * rnd(35, 70) + (side < 0 ? 180 : 0) * 0, rnd(1.05, 1.5), (n * 7 + j) % 4, n++);
        if (j % 5 === 3) svg += acorn(x + 2, y + 4, 1.1);
      }
    }
    for (i = 0; i <= swags; i++) svg += bow(i * span, top + 2, 1);
    oak.innerHTML = svg + '</svg>';
  }

  /* ---------- hanging badnjak bundle + straw star in the free space of the header ---------- */
  function bundleSvg() {
    var s = '<svg viewBox="-40 -10 80 90">' + DEFS;
    s += '<path d="M-4 0L-14 70M0 0L0 74M4 0L14 70" stroke="#6b4626" stroke-width="3.2" stroke-linecap="round"/>';
    var k = 0;
    [[-14, 70], [0, 74], [14, 70]].forEach(function (tip, b) {
      for (var q = 0.3; q <= 1.0; q += 0.23) {
        var x = tip[0] * q, y = tip[1] * q;
        s += leafSvg(x, y, 20 + b * 30 + (k % 2 ? 0 : 140), .9, k + b, k); k++;
      }
    });
    s += bow(0, 4, .8) + '</svg>';
    return s;
  }
  function strawSvg() {
    var s = '<svg viewBox="-40 -40 80 80"><g stroke="#f2cf7a" stroke-width="3.2" stroke-linecap="round">';
    for (var a = 0; a < 8; a++) {
      var r = a % 2 ? 26 : 36, ang = a * Math.PI / 4;
      s += '<path d="M0 0L' + (Math.cos(ang) * r).toFixed(1) + ' ' + (Math.sin(ang) * r).toFixed(1) + '"/>';
    }
    s += '</g><circle r="7" fill="none" stroke="#e0b450" stroke-width="2.5"/><circle r="3" fill="#c42a2a"/></svg>';
    return '<div class="spin" style="width:100%;height:100%;animation:spin 18s linear infinite">' + s + '</div>';
  }
  var HANG = [
    { dx: -78, len: 54, size: 64, html: bundleSvg, sw: 5.2, sd: 0 },
    { dx: 6, len: 92, size: 56, html: strawSvg, sw: 6.3, sd: -2 },
    { dx: 80, len: 40, size: 50, html: bundleSvg, sw: 4.7, sd: -1 }
  ];
  var hung = [];
  function placeHang() {
    hung.forEach(function (e) { if (e.parentNode) e.parentNode.removeChild(e); });
    hung = [];
    var gaps = window.yummyGaps ? window.yummyGaps(150) : [];
    gaps.sort(function (a, b) { return (b.x1 - b.x0) - (a.x1 - a.x0); });
    gaps.slice(0, 2).forEach(function (g) {
      var cx = (g.x0 + g.x1) / 2, set = g.x1 - g.x0 >= 280 ? HANG : HANG.slice(0, 2);
      set.forEach(function (o, n2) {
        var d = document.createElement('div');
        d.className = 'hang';
        d.style.cssText = 'left:' + (cx + (set.length === 2 ? (n2 ? 36 : -36) : o.dx)) + 'px;--len:' + o.len + 'px;--size:' + o.size + 'px;--sw:' + o.sw + 's;--sd:' + o.sd + 's';
        d.innerHTML = '<div class="swing"><div class="cord"></div>' + o.html() + '</div>';
        stage.appendChild(d); hung.push(d);
      });
    });
  }
  window.addEventListener('yummy:layout', placeHang);
  placeHang();

  /* ---------- canvases: embers + golden motes ---------- */
  var back = document.getElementById('fx-back'), front = document.getElementById('fx-front');
  var bx = window.yummyCanvas(back), fx = window.yummyCanvas(front);
  var glow = document.createElement('canvas'); glow.width = glow.height = 32;
  var gc = glow.getContext('2d'), gg = gc.createRadialGradient(16, 16, 0, 16, 16, 16);
  gg.addColorStop(0, 'rgba(255,240,200,1)'); gg.addColorStop(.3, 'rgba(255,170,70,.85)'); gg.addColorStop(1, 'rgba(255,110,30,0)');
  gc.fillStyle = gg; gc.fillRect(0, 0, 32, 32);

  function ember(init) {
    return { x: rnd(0, W), y: init ? rnd(H * .3, H + 40) : H + rnd(10, 60), vy: -rnd(26, 70), sway: rnd(10, 40), ph: rnd(0, 6.28),
             sp: rnd(.5, 1.4), r: rnd(3, 9), life: 0, max: rnd(6, 14), fl: rnd(4, 9) };
  }
  var embers = [];
  for (var e = 0; e < 55; e++) embers.push(ember(true));
  var motes = [];
  for (e = 0; e < 60; e++) motes.push({ x: rnd(0, W), y: rnd(0, H), r: rnd(.6, 1.6), p: rnd(0, 6.28), v: rnd(.5, 1.5) });

  /* ---------- big animation: the Christmas star ---------- */
  var VIDEO = /[?&]video\b/.test(location.search);
  var PAGE = CFG.tv || 1, COUNT = CFG.count || 3;
  var LAP = 10 * COUNT, CYCLE = 60, RING = COUNT * W, V = RING / LAP, SW = 96;
  var star = null, trail = [];
  if (BIG) {
    star = document.createElement('div');
    star.id = 'star';
    var pts = [];
    for (var a = 0; a < 16; a++) {
      var rr = a % 2 ? 15 : (a % 4 === 0 ? 46 : 30), an = a * Math.PI / 8 - Math.PI / 2;
      pts.push((Math.cos(an) * rr).toFixed(1) + ',' + (Math.sin(an) * rr).toFixed(1));
    }
    star.innerHTML = '<svg viewBox="-50 -50 100 100" width="' + SW + '" height="' + SW + '" style="overflow:visible">' +
      '<defs><radialGradient id="stg"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="#ffe7a8"/><stop offset="1" stop-color="#e8a83a"/></radialGradient></defs>' +
      '<circle r="44" fill="rgba(255,210,120,.18)"/><polygon points="' + pts.join(' ') + '" fill="url(#stg)" stroke="#fff3cf" stroke-width="1.5"/></svg>';
    star.style.filter = 'drop-shadow(0 0 10px rgba(255,220,140,.95)) drop-shadow(0 0 28px rgba(255,170,60,.6))';
    stage.appendChild(star);
  }
  function updateStar(now, dt) {
    var clock = VIDEO ? now : Date.now();
    var t = ((clock % (CYCLE * 1000)) + CYCLE * 1000) % (CYCLE * 1000) / 1000;
    var x = ((V * t - (PAGE - 1) * W + SW) % RING + RING) % RING - SW;
    var y = 380 + 170 * Math.sin(2 * Math.PI * t / 10 + 1.2) + 40 * Math.sin(2 * Math.PI * t / 2.9);
    var on = x > -SW && x < W + SW;
    star.style.visibility = on ? 'visible' : 'hidden';
    if (on) {
      var pulse = 1 + .08 * Math.sin(t * 6);
      star.style.transform = 'translate3d(' + (x - SW / 2).toFixed(1) + 'px,' + (y - SW / 2).toFixed(1) + 'px,0) rotate(' + (t * 40 % 360).toFixed(1) + 'deg) scale(' + pulse.toFixed(3) + ')';
      for (var i = 0; i < 3; i++) trail.push({ x: x - 20 + rnd(-8, 8), y: y + rnd(-10, 10), vx: -rnd(30, 90), vy: rnd(-12, 18), life: 0, max: rnd(.8, 1.8), r: rnd(4, 11) });
    }
    fx.globalCompositeOperation = 'lighter';
    for (var j = trail.length - 1; j >= 0; j--) {
      var q = trail[j];
      q.life += dt;
      if (q.life > q.max) { trail.splice(j, 1); continue; }
      q.x += q.vx * dt; q.y += q.vy * dt;
      var k = 1 - q.life / q.max;
      fx.globalAlpha = .7 * k;
      var d = q.r * (.5 + .5 * k);
      fx.drawImage(glow, q.x - d / 2, q.y - d / 2, d, d);
    }
    fx.globalAlpha = 1; fx.globalCompositeOperation = 'source-over';
  }

  var last = performance.now();
  function frame(now) {
    var dt = Math.min(.05, (now - last) / 1000); last = now;
    var tm = now / 1000;
    bx.clearRect(0, 0, W, H);
    for (var i = 0; i < motes.length; i++) {
      var m = motes[i], al = .15 + .35 * (0.5 + 0.5 * Math.sin(tm * m.v + m.p));
      bx.globalAlpha = al; bx.fillStyle = '#ffe2a0'; bx.fillRect(m.x, m.y, m.r, m.r);
    }
    bx.globalAlpha = 1;
    bx.globalCompositeOperation = 'lighter';
    for (i = 0; i < embers.length; i++) {
      var q = embers[i];
      q.y += q.vy * dt; q.life += dt;
      if (q.y < -20 || q.life > q.max) { embers[i] = ember(false); continue; }
      var fade = Math.min(1, (H + 40 - q.y) / 200) * (1 - q.life / q.max);
      var fl = .6 + .4 * Math.sin(tm * q.fl + q.ph);
      bx.globalAlpha = Math.max(0, .75 * fade * fl);
      var d = q.r;
      bx.drawImage(glow, q.x + Math.sin(tm * q.sp + q.ph) * q.sway - d / 2, q.y - d / 2, d, d);
    }
    bx.globalAlpha = 1; bx.globalCompositeOperation = 'source-over';
    fx.clearRect(0, 0, W, H);
    if (BIG) updateStar(now, dt);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
