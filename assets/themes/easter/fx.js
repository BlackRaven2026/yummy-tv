/* Yummy – theme "Uskrs": pastel bunting, hanging eggs, falling petals, butterflies */
(function () {
  var W = 1920, H = 1080;
  var stage = document.getElementById('stage');
  function rnd(a, b) { return a + Math.random() * (b - a); }
  var PASTEL = ['#ffb3cf', '#ffcf4d', '#9be3c4', '#b9a3f0', '#8fd3ff', '#ff9f8a'];

  /* ---------- bunting ---------- */
  var bt = document.getElementById('bunting');
  if (bt) {
    var swags = 5, top = 4, sag = 30, span = W / swags, per = 9, path = '', k = 0;
    for (var i = 0; i < swags; i++) {
      var x0 = i * span;
      path += (i ? 'L' : 'M') + x0 + ' ' + top + ' Q ' + (x0 + span / 2) + ' ' + (top + sag * 2) + ' ' + (x0 + span) + ' ' + top + ' ';
    }
    bt.innerHTML = '<svg width="1920" height="90"><path d="' + path + '" fill="none" stroke="#c9a3c9" stroke-width="2.5"/></svg>';
    for (i = 0; i < swags; i++) {
      for (var j = 1; j <= per; j++) {
        var t = j / (per + 1), x = i * span + t * span, y = top + 2 * t * (1 - t) * sag * 2;
        var slope = 2 * (1 - 2 * t) * sag * 2 / span;
        var f = document.createElement('div');
        f.className = 'flag';
        f.style.left = x + 'px'; f.style.top = y + 'px';
        f.style.background = 'linear-gradient(180deg,' + PASTEL[k % PASTEL.length] + ',' + PASTEL[(k + 2) % PASTEL.length] + ')';
        f.style.setProperty('--r', (Math.atan(slope) * 57.3 * .7).toFixed(1) + 'deg');
        f.style.setProperty('--t', rnd(2.2, 3.8).toFixed(2) + 's');
        f.style.setProperty('--d', (-rnd(0, 3)).toFixed(2) + 's');
        bt.appendChild(f); k++;
      }
    }
  }

  /* ---------- hanging eggs in the free space of the header ---------- */
  var EGGS = [
    { dx: -70, len: 70, size: 40, c1: '#ffd6e5', c2: '#ef6a9a', s: '#fff4c2', sw: 4.8, sd: 0 },
    { dx: 0, len: 104, size: 48, c1: '#fff1b0', c2: '#ffc23d', s: '#ffffff', sw: 6.1, sd: -2 },
    { dx: 68, len: 58, size: 36, c1: '#d9ccff', c2: '#7c5cc4', s: '#c9f2e2', sw: 5.3, sd: -1 }
  ];
  var eggEls = [];
  function placeEggs() {
    eggEls.forEach(function (e) { if (e.parentNode) e.parentNode.removeChild(e); });
    eggEls = [];
    var gaps = (window.yummyGaps ? window.yummyGaps(150) : []);
    gaps.sort(function (a, b) { return (b.x1 - b.x0) - (a.x1 - a.x0); });
    gaps.slice(0, 2).forEach(function (g, gi) {
      var cx = (g.x0 + g.x1) / 2, set = (g.x1 - g.x0 >= 260) ? EGGS : EGGS.slice(0, 2);
      set.forEach(function (o, n) {
        var d = document.createElement('div');
        d.className = 'egg';
        d.style.cssText = 'left:' + (cx + (set.length === 2 ? (n ? 34 : -34) : o.dx)) + 'px;--len:' + (o.len + gi * 8) + 'px;--size:' + o.size +
          'px;--c1:' + o.c1 + ';--c2:' + o.c2 + ';--s:' + o.s + ';--sw:' + o.sw + 's;--sd:' + o.sd + 's';
        d.innerHTML = '<div class="swing"><div class="cord"></div><div class="shell"></div></div>';
        stage.appendChild(d); eggEls.push(d);
      });
    });
  }
  window.addEventListener('yummy:layout', placeEggs);
  placeEggs();

  /* ---------- canvases: petals + butterflies ---------- */
  var back = document.getElementById('fx-back'), front = document.getElementById('fx-front');
  back.width = front.width = W; back.height = front.height = H;
  var bx = back.getContext('2d'), fx = front.getContext('2d');
  var PET = ['255,190,214', '255,255,255', '255,214,230', '232,220,255'];
  function petal(isFront, init) {
    return { x: rnd(-60, W + 60), y: init ? rnd(-H, H) : rnd(-80, -20), s: isFront ? rnd(7, 11) : rnd(4, 8),
             vy: isFront ? rnd(30, 48) : rnd(16, 34), sway: rnd(20, 60), ph: rnd(0, 6.28), sp: rnd(.3, .8),
             rot: rnd(0, 6.28), vr: rnd(-1.2, 1.2), flip: rnd(1, 2.5), c: PET[(Math.random() * PET.length) | 0],
             a: isFront ? rnd(.5, .75) : rnd(.35, .7) };
  }
  var backP = [], frontP = [];
  for (var p = 0; p < 70; p++) backP.push(petal(false, true));
  for (p = 0; p < 14; p++) frontP.push(petal(true, true));

  function drawPetals(ctx, arr, isFront, dt, tm) {
    for (var i = 0; i < arr.length; i++) {
      var q = arr[i];
      q.y += q.vy * dt; q.rot += q.vr * dt;
      if (q.y > H + 30) { arr[i] = petal(isFront, false); continue; }
      var x = q.x + Math.sin(tm * q.sp + q.ph) * q.sway;
      ctx.save();
      ctx.translate(x, q.y); ctx.rotate(q.rot);
      ctx.scale(1, Math.abs(Math.sin(tm * q.flip + q.ph)) * .7 + .3);
      ctx.fillStyle = 'rgba(' + q.c + ',' + q.a.toFixed(2) + ')';
      ctx.beginPath();
      ctx.moveTo(0, -q.s);
      ctx.quadraticCurveTo(q.s * .9, 0, 0, q.s);
      ctx.quadraticCurveTo(-q.s * .9, 0, 0, -q.s);
      ctx.fill();
      ctx.restore();
    }
  }

  var BUT = [['#ffb3cf', '#ef6a9a'], ['#ffe08a', '#ffb000'], ['#c9b8ff', '#7c5cc4'], ['#a8ecd2', '#2fb486']];
  var flies = [];
  for (var b = 0; b < 4; b++) flies.push({ cx: rnd(200, W - 200), cy: rnd(250, H - 150), ax: rnd(260, 520), ay: rnd(120, 260),
    fx: rnd(.05, .11), fy: rnd(.08, .17), ph: rnd(0, 6.28), flap: rnd(9, 13), s: rnd(.8, 1.2), c: BUT[b] });
  function drawFly(f, tm) {
    var t = tm + f.ph * 10;
    var x = f.cx + Math.sin(t * f.fx * 6.28) * f.ax, y = f.cy + Math.sin(t * f.fy * 6.28) * f.ay;
    var nx = f.cx + Math.sin((t + .05) * f.fx * 6.28) * f.ax, ny = f.cy + Math.sin((t + .05) * f.fy * 6.28) * f.ay;
    var ang = Math.atan2(ny - y, nx - x) + Math.PI / 2, w = Math.abs(Math.sin(t * f.flap)) * .8 + .2;
    bx.save();
    bx.translate(x, y); bx.rotate(ang); bx.scale(f.s, f.s); bx.globalAlpha = .55;
    for (var side = -1; side <= 1; side += 2) {
      bx.save(); bx.scale(side * w, 1);
      var g = bx.createLinearGradient(0, -14, 18, 10);
      g.addColorStop(0, f.c[0]); g.addColorStop(1, f.c[1]);
      bx.fillStyle = g;
      bx.beginPath(); bx.ellipse(9, -6, 10, 8, -.5, 0, 6.3); bx.fill();
      bx.beginPath(); bx.ellipse(7, 7, 7, 6, .5, 0, 6.3); bx.fill();
      bx.restore();
    }
    bx.fillStyle = '#5b3f5f'; bx.beginPath(); bx.ellipse(0, 0, 2, 10, 0, 0, 6.3); bx.fill();
    bx.restore();
  }

  var last = performance.now();
  function frame(now) {
    var dt = Math.min(.05, (now - last) / 1000); last = now;
    var tm = now / 1000;
    bx.clearRect(0, 0, W, H);
    for (var i = 0; i < flies.length; i++) drawFly(flies[i], tm);
    bx.globalAlpha = 1;
    drawPetals(bx, backP, false, dt, tm);
    fx.clearRect(0, 0, W, H);
    drawPetals(fx, frontP, true, dt, tm);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
