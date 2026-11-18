/* Yummy – theme "Nova godina": snow, stars, fireworks, garland, ornaments and
   Santa's sleigh flying across all TVs (timed by the clock, so the TVs stay in step). */
(function () {
  var W = 1920, H = 1080;
  var stage = document.getElementById('stage');
  var CFG = window.YUMMY || {};

  /* ---------- hanging ornaments + firework zones: placed in the free space of the header ---------- */
  var STAR = '<svg viewBox="0 0 100 100"><path d="M50 4 61 38 97 38 68 59 79 94 50 73 21 94 32 59 3 38 39 38Z" fill="url(#sgx)" stroke="#fff1c9" stroke-width="2"/><defs><linearGradient id="sgx" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff1c9"/><stop offset=".5" stop-color="#f6d27f"/><stop offset="1" stop-color="#c9973a"/></linearGradient></defs></svg>';
  var ORN_SETS = [
    [{ dx: -76, len: 58, size: 44, c1: '#ff7a6e', c2: '#8e1410', sw: 4.8, sd: 0 },
     { dx: 0, len: 84, size: 54, star: 1, sw: 6.2, sd: -2 },
     { dx: 72, len: 40, size: 38, sw: 5.4, sd: -1 }],
    [{ dx: -34, len: 62, size: 42, c1: '#9fd0ff', c2: '#1d4f8f', sw: 5.1, sd: 0 },
     { dx: 34, len: 100, size: 36, sw: 6, sd: -2 }]
  ];
  var ornEls = [];
  function placeOrnaments() {
    for (var i = 0; i < ornEls.length; i++) ornEls[i].parentNode && ornEls[i].parentNode.removeChild(ornEls[i]);
    ornEls = [];
    var gaps = (window.yummyGaps ? window.yummyGaps(150) : []).filter(function (g) { return g.x1 - g.x0 >= 150; });
    gaps.sort(function (a, b) { return (b.x1 - b.x0) - (a.x1 - a.x0); });
    gaps = gaps.slice(0, 2);
    zones = gaps.length ? gaps.map(function (g) { return [g.x0 + 30, 70, g.x1 - 30, 170]; }) : [[200, 60, 1720, 170]];
    gaps.forEach(function (g, gi) {
      var cx = (g.x0 + g.x1) / 2, set = (g.x1 - g.x0 >= 260 && gi === 0) ? ORN_SETS[0] : ORN_SETS[1];
      set.forEach(function (o) {
        var d = document.createElement('div');
        d.className = 'orn' + (o.star ? ' star' : '');
        d.style.cssText = 'left:' + (cx + o.dx) + 'px;--len:' + o.len + 'px;--size:' + o.size + 'px;--sw:' + o.sw + 's;--sd:' + o.sd + 's' +
          (o.c1 ? ';--c1:' + o.c1 + ';--c2:' + o.c2 : '');
        d.innerHTML = '<div class="swing"><div class="cord"></div><div class="ball">' + (o.star ? STAR : '') + '</div></div>';
        stage.appendChild(d);
        ornEls.push(d);
      });
    });
  }
  window.addEventListener('yummy:layout', placeOrnaments);

  /* ---------- garland of lights across the top ---------- */
  var COLORS = [
    [246, 210, 127], // gold
    [255, 143, 31],  // orange
    [255, 79, 69],   // red
    [255, 244, 214], // warm white
    [120, 200, 255]  // ice blue
  ];
  function rgba(c, a) { return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')'; }

  var g = document.getElementById('garland');
  if (g) {
    var swags = 6, top = 6, sag = 34, perSwag = 8, span = W / swags;
    var path = '', ns = 'http://www.w3.org/2000/svg';
    for (var i = 0; i < swags; i++) {
      var x0 = i * span, x1 = x0 + span;
      path += (i === 0 ? 'M' : 'L') + x0 + ' ' + top + ' Q ' + (x0 + span / 2) + ' ' + (top + sag * 2) + ' ' + x1 + ' ' + top + ' ';
    }
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('width', W); svg.setAttribute('height', 80);
    var p = document.createElementNS(ns, 'path');
    p.setAttribute('d', path); p.setAttribute('fill', 'none');
    p.setAttribute('stroke', '#3b4a33'); p.setAttribute('stroke-width', '3');
    svg.appendChild(p);
    g.appendChild(svg);
    var k = 0;
    for (i = 0; i < swags; i++) {
      for (var j = 1; j <= perSwag; j++) {
        var t = j / (perSwag + 1);
        var x = i * span + t * span;
        var y = top + 2 * t * (1 - t) * sag * 2;        // quadratic bezier y
        var slope = 2 * (1 - 2 * t) * sag * 2 / span;   // dy/dx
        var b = document.createElement('div');
        var c = COLORS[k++ % COLORS.length];
        b.className = 'bulb';
        b.style.left = x + 'px'; b.style.top = (y + 2) + 'px';
        b.style.transform = 'rotate(' + (Math.atan(slope) * 57.3 * 0.6) + 'deg)';
        b.style.background = 'radial-gradient(circle at 40% 35%, #fff 0 12%, ' + rgba(c, 1) + ' 45%, ' +
          rgba([c[0] * .55 | 0, c[1] * .55 | 0, c[2] * .55 | 0], 1) + ' 100%)';
        b.style.boxShadow = '0 0 10px 3px ' + rgba(c, .75) + ', 0 0 24px 8px ' + rgba(c, .3);
        b.style.setProperty('--t', (1.4 + Math.random() * 2.2).toFixed(2) + 's');
        b.style.setProperty('--d', (-Math.random() * 3).toFixed(2) + 's');
        g.appendChild(b);
      }
    }
  }

  /* ---------- canvases: stars, snow, fireworks ---------- */
  var back = document.getElementById('fx-back'), front = document.getElementById('fx-front');
  back.width = front.width = W; back.height = front.height = H;
  var bx = back.getContext('2d'), fx = front.getContext('2d');
  var zones = [[200, 60, 1720, 170]];
  placeOrnaments();

  function rnd(a, b) { return a + Math.random() * (b - a); }

  var stars = [];
  for (var s = 0; s < 110; s++) stars.push({ x: rnd(0, W), y: rnd(0, H), r: rnd(.4, 1.5), p: rnd(0, 6.28), v: rnd(.6, 1.8) });

  function makeFlake(front, init) {
    var depth = front ? rnd(.8, 1) : rnd(.2, .75);
    return {
      x: rnd(-50, W + 50), y: init ? rnd(-H, H) : rnd(-60, -10),
      r: front ? rnd(1.6, 3.2) : rnd(.8, 2.6) * (0.6 + depth),
      vy: (front ? rnd(28, 46) : rnd(12, 34)) * (0.5 + depth),
      sway: rnd(10, 40), ph: rnd(0, 6.28), sp: rnd(.3, .9),
      a: front ? rnd(.35, .6) : rnd(.25, .7) * (0.5 + depth / 2)
    };
  }
  var backSnow = [], frontSnow = [];
  for (s = 0; s < 150; s++) backSnow.push(makeFlake(false, true));
  for (s = 0; s < 28; s++) frontSnow.push(makeFlake(true, true));

  // pre-rendered soft flake sprite
  var sprite = document.createElement('canvas'); sprite.width = sprite.height = 32;
  var sc = sprite.getContext('2d');
  var gr = sc.createRadialGradient(16, 16, 0, 16, 16, 16);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(.35, 'rgba(255,255,255,.8)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  sc.fillStyle = gr; sc.fillRect(0, 0, 32, 32);

  var sparks = [];
  var FW = [[246, 210, 127], [255, 143, 31], [255, 236, 190], [255, 120, 90], [170, 210, 255]];
  function burst() {
    var z = zones[(Math.random() * zones.length) | 0];
    var cx = rnd(z[0], z[2]), cy = rnd(z[1], z[3]);
    var col = FW[(Math.random() * FW.length) | 0], n = 46 + (Math.random() * 20 | 0), spd = rnd(90, 150);
    for (var i = 0; i < n; i++) {
      var ang = (i / n) * Math.PI * 2 + rnd(-.05, .05), v = spd * rnd(.75, 1);
      sparks.push({ x: cx, y: cy, vx: Math.cos(ang) * v, vy: Math.sin(ang) * v, life: 0, max: rnd(1.4, 2.1), c: col });
    }
  }
  var nextBurst = performance.now() + 2500;

  var last = performance.now();
  function frame(now) {
    var dt = Math.min(.05, (now - last) / 1000); last = now;
    var tm = now / 1000;

    bx.clearRect(0, 0, W, H);
    // stars
    for (var i = 0; i < stars.length; i++) {
      var st = stars[i], al = .25 + .55 * (0.5 + 0.5 * Math.sin(tm * st.v + st.p));
      bx.fillStyle = 'rgba(255,246,220,' + al.toFixed(3) + ')';
      bx.fillRect(st.x, st.y, st.r, st.r);
    }
    // fireworks (soft, additive)
    if (now > nextBurst) { burst(); nextBurst = now + rnd(4200, 8000); }
    bx.globalCompositeOperation = 'lighter';
    for (i = sparks.length - 1; i >= 0; i--) {
      var sp = sparks[i];
      sp.life += dt;
      if (sp.life > sp.max) { sparks.splice(i, 1); continue; }
      sp.vx *= (1 - 1.6 * dt); sp.vy = sp.vy * (1 - 1.6 * dt) + 38 * dt;
      var px = sp.x, py = sp.y;
      sp.x += sp.vx * dt; sp.y += sp.vy * dt;
      var k = 1 - sp.life / sp.max, alpha = .55 * k * k;
      bx.strokeStyle = 'rgba(' + sp.c[0] + ',' + sp.c[1] + ',' + sp.c[2] + ',' + alpha.toFixed(3) + ')';
      bx.lineWidth = 2;
      bx.beginPath(); bx.moveTo(px - sp.vx * .05, py - sp.vy * .05); bx.lineTo(sp.x, sp.y); bx.stroke();
      if (Math.random() < .25) { bx.fillStyle = 'rgba(255,250,230,' + (alpha * .9).toFixed(3) + ')'; bx.fillRect(sp.x, sp.y, 1.6, 1.6); }
    }
    bx.globalCompositeOperation = 'source-over';
    // back snow
    drawSnow(bx, backSnow, false, dt, tm);
    // front snow
    fx.clearRect(0, 0, W, H);
    drawSnow(fx, frontSnow, true, dt, tm);
    // Santa's sleigh + sparkle trail
    updateSleigh(now, dt);

    requestAnimationFrame(frame);
  }

  /* ---------- Santa's sleigh ----------
     Flies left -> right on a schedule tied to the clock, so TVs 1, 2, 3
     placed side by side see ONE sleigh crossing all three screens. */
  var VIDEO = /[?&]video\b/.test(location.search);
  var PAGE = CFG.tv || 1, COUNT = CFG.count || 3;
  var SL_W = 440, SL_VBW = 570, SL_S = SL_W / SL_VBW, SL_H = 135 * SL_S;
  // Non-stop spiral flight around the 3 TVs: one loop per screen, and when Santa
  // leaves TV 3 on the right he comes straight back in on the left of TV 1.
  // One lap of all 3 screens = 30 s, so everything repeats exactly every 60 s.
  var SP_LAP = 10 * COUNT, SP_CYCLE = 60;                   // seconds
  var SP_P = COUNT * W;                                 // width of the 3-TV "ring"
  var SP_V = SP_P / SP_LAP, SP_OM = 2 * Math.PI * COUNT / SP_LAP;
  var SP_RX = 520, SP_RY = 350, SP_PHI = 0, SP_YC = 540;   // PHI 0 = loop centred on each TV
  function wrapX(x, m) { return ((x + m) % SP_P + SP_P) % SP_P - m; }   // -> [-m, P-m)

  // sleigh state at time t (seconds), x in TV-1 coordinates (continues over TV 2 and 3)
  function sleighAt(t) {
    var th = SP_OM * t + SP_PHI, c = Math.cos(th), s = Math.sin(th);
    var vx = SP_V + SP_RX * SP_OM * c, vy = -SP_RY * SP_OM * s;
    return {
      x: SP_V * t + SP_RX * s,
      y: SP_YC + SP_RY * c,
      vx: vx, vy: vy,
      ang: Math.atan2(vy, vx),
      depth: (c + 1) / 2                // 1 = bottom of loop (near), 0 = top (far)
    };
  }
  // point of the sleigh artwork (viewBox coords) -> TV-1 coordinates
  function artPoint(st, vbx, vby) {
    var sc = 0.8 + 0.28 * st.depth;
    var lx = ((vbx + 10) * SL_S - SL_W / 2) * sc, ly = ((vby + 20) * SL_S - SL_H / 2) * sc;
    var ca = Math.cos(st.ang), sa = Math.sin(st.ang);
    return { x: st.x + lx * ca - ly * sa, y: st.y + lx * sa + ly * ca };
  }

  var DEER_BODY =
    '<ellipse cx="42" cy="34" rx="24" ry="11"/>' +
    '<path d="M58 30 Q64 20 70 12 L78 14 Q74 26 66 40 Z"/>' +
    '<path d="M70 12 Q74 5 82 7 L94 12 Q96 15 92 16 L82 17 Q76 18 72 16 Z"/>' +
    '<path d="M74 9 L70 3 L77 7 Z"/>' +
    '<path d="M19 29 L11 24 L17 34 Z"/>' +
    '<path d="M76 7 Q74 -4 66 -8 M73 -1 L80 -7 M70 -5 L68 -12 M79 6 Q84 -4 92 -6 M84 -1 L86 -9" fill="none" stroke="#f3cd74" stroke-width="2.4" stroke-linecap="round"/>';
  var LEGS_A = '<path d="M60 40 L72 50 L84 52 M56 42 L66 54 L76 58 M26 40 L14 48 L4 48 M30 42 L20 54 L10 58"/>';
  var LEGS_B = '<path d="M60 40 L66 50 L60 57 M56 42 L60 52 L54 59 M26 40 L31 50 L37 55 M30 42 L35 52 L41 57"/>';

  var deerX = [194, 284, 374, 464], deerY = [22, 12, 22, 12];
  var reins = 'M94 50';
  for (var di = 0; di < 4; di++) reins += ' L' + (deerX[di] + 52) + ' ' + (deerY[di] + 33);

  var deerSvg = '';
  for (di = 0; di < 4; di++) {
    deerSvg += '<g transform="translate(' + deerX[di] + ',' + deerY[di] + ')"><g class="deer">' +
      DEER_BODY + '<g class="legs" fill="none" stroke="#f3cd74" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round">' +
      '<g class="la">' + LEGS_A + '</g><g class="lb" style="display:none">' + LEGS_B + '</g></g></g></g>';
  }

  var sleighSvg =
    '<svg viewBox="-10 -20 ' + SL_VBW + ' 135" width="' + SL_W + '" height="' + (135 * SL_S).toFixed(1) + '" fill="url(#slg)">' +
    '<defs><linearGradient id="slg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3d1"/>' +
    '<stop offset=".45" stop-color="#f6d27f"/><stop offset="1" stop-color="#c9973a"/></linearGradient></defs>' +
    '<path d="' + reins + '" fill="none" stroke="#f6d27f" stroke-width="1.6" opacity=".85"/>' +
    // sack
    '<path d="M22 52 Q14 30 30 21 Q37 17 43 24 Q51 35 45 58 Z"/>' +
    '<path d="M27 25 Q33 29 40 24" fill="none" stroke="#a87a26" stroke-width="2"/>' +
    // Santa
    '<path d="M46 66 Q43 40 63 36 Q83 37 85 66 Z"/>' +
    '<path d="M74 44 L93 47 L95 52 L75 53 Z"/>' +
    '<circle cx="66" cy="27" r="9"/>' +
    '<path d="M59 30 Q66 47 75 30 Z" fill="#fff8e6"/>' +
    '<path d="M57 23 Q60 9 47 5 Q44 7 46 11 Q55 14 59 24 Z"/>' +
    '<circle cx="46" cy="8" r="3.6" fill="#fff8e6"/>' +
    '<rect x="56" y="20" width="20" height="5" rx="2.5" fill="#fff8e6"/>' +
    // sleigh body + runner
    '<path d="M14 56 Q10 88 30 94 L130 94 Q150 92 156 70 Q160 56 150 50 L138 58 Q130 66 116 66 L40 66 Q30 64 28 46 Q18 44 14 56 Z"/>' +
    '<path d="M34 80 Q80 88 140 76" fill="none" stroke="#a87a26" stroke-width="2.5" stroke-linecap="round"/>' +
    '<path d="M40 94 L40 105 M120 94 L120 105" stroke="#f3cd74" stroke-width="3.5"/>' +
    '<path d="M8 96 Q4 105 16 106 L150 106 Q166 106 168 92 Q170 82 160 84" fill="none" stroke="#f3cd74" stroke-width="4" stroke-linecap="round"/>' +
    deerSvg + '</svg>';

  var sl = document.createElement('div');
  sl.id = 'sleigh';
  sl.innerHTML = sleighSvg;
  stage.appendChild(sl);
  var deerEls = sl.querySelectorAll('.deer'), legA = sl.querySelectorAll('.la'), legB = sl.querySelectorAll('.lb');
  var poses = [-1, -1, -1, -1], slVisible = false;

  var gold = document.createElement('canvas'); gold.width = gold.height = 32;
  var gc = gold.getContext('2d'), gg = gc.createRadialGradient(16, 16, 0, 16, 16, 16);
  gg.addColorStop(0, 'rgba(255,248,220,1)'); gg.addColorStop(.3, 'rgba(246,210,127,.85)'); gg.addColorStop(1, 'rgba(246,190,90,0)');
  gc.fillStyle = gg; gc.fillRect(0, 0, 32, 32);
  var trail = [];

  /* party hats (drawn once into small sprites) */
  var HAT_COLORS = [['#ffb35c', '#ff8f1f', '#b85a00'], ['#ff8a80', '#ff4f45', '#a8161a'],
                    ['#8fb4ff', '#3f7bff', '#1a3c99'], ['#7ee0b5', '#22b07d', '#0d6b48']];
  function makeHat(c) {
    var cv = document.createElement('canvas'); cv.width = 120; cv.height = 150;
    var h = cv.getContext('2d');
    h.save();
    h.beginPath(); h.moveTo(60, 16); h.lineTo(14, 128); h.quadraticCurveTo(60, 148, 106, 128); h.closePath();
    var lg = h.createLinearGradient(14, 0, 106, 0);
    lg.addColorStop(0, c[0]); lg.addColorStop(.45, c[1]); lg.addColorStop(1, c[2]);
    h.fillStyle = lg; h.fill();
    h.clip();
    h.strokeStyle = 'rgba(255,226,150,.9)'; h.lineWidth = 7;
    for (var s = -4; s < 8; s++) { h.beginPath(); h.moveTo(-20, 40 + s * 26); h.lineTo(140, 0 + s * 26 + 60); h.stroke(); }
    h.fillStyle = 'rgba(255,250,235,.9)';
    [[48, 70], [74, 96], [40, 112], [66, 50], [86, 120]].forEach(function (d) { h.beginPath(); h.arc(d[0], d[1], 3.2, 0, 6.3); h.fill(); });
    h.restore();
    var bg = h.createLinearGradient(0, 120, 0, 142);
    bg.addColorStop(0, '#fff1c9'); bg.addColorStop(1, '#c9973a');
    h.fillStyle = bg; h.beginPath(); h.ellipse(60, 131, 48, 10, 0, 0, 6.3); h.fill();
    var pg = h.createRadialGradient(56, 10, 2, 60, 14, 15);
    pg.addColorStop(0, '#ffffff'); pg.addColorStop(.6, '#fff1c9'); pg.addColorStop(1, '#f6d27f');
    h.fillStyle = pg;
    for (var a = 0; a < 12; a++) { h.beginPath(); h.arc(60 + Math.cos(a) * 8, 14 + Math.sin(a) * 8, 6, 0, 6.3); h.fill(); }
    h.beginPath(); h.arc(60, 14, 10, 0, 6.3); h.fill();
    return cv;
  }
  var hats = HAT_COLORS.map(makeHat);

  /* wrapped gifts */
  var GIFT_COLORS = [['#ff6b61', '#c4231d', '#fff1c9'], ['#6f9bff', '#2851c7', '#f6d27f'],
                     ['#5fd3a0', '#178a5e', '#f6d27f'], ['#ffe08a', '#d9a43a', '#c4231d']];
  function makeGift(c) {
    var cv = document.createElement('canvas'); cv.width = 120; cv.height = 120;
    var g = cv.getContext('2d');
    var bg = g.createLinearGradient(14, 0, 106, 0);
    bg.addColorStop(0, c[0]); bg.addColorStop(1, c[1]);
    g.fillStyle = bg; g.fillRect(18, 50, 84, 62);                 // box
    g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(18, 50, 84, 8);   // lid shadow
    g.fillStyle = bg; g.fillRect(12, 38, 96, 16);                 // lid
    var rg = g.createLinearGradient(0, 30, 0, 112);
    rg.addColorStop(0, '#ffffff'); rg.addColorStop(.3, c[2]); rg.addColorStop(1, c[2]);
    g.fillStyle = rg; g.fillRect(52, 38, 16, 74); g.fillRect(12, 42, 96, 8);   // ribbons
    g.strokeStyle = c[2]; g.lineWidth = 9; g.lineCap = 'round';
    g.beginPath(); g.ellipse(44, 26, 17, 10, -0.5, 0, 6.3); g.stroke();      // bow loops
    g.beginPath(); g.ellipse(76, 26, 17, 10, 0.5, 0, 6.3); g.stroke();
    g.fillStyle = c[2]; g.beginPath(); g.arc(60, 34, 8, 0, 6.3); g.fill();
    return cv;
  }
  var gifts = GIFT_COLORS.map(makeGift);
  function hrand(k, n) { var v = Math.sin(k * 127.1 + n * 311.7) * 43758.5453; return v - Math.floor(v); }
  function easeOutBack(x) { var y = x - 1; return 1 + 2.70158 * y * y * y + 1.70158 * y * y; }
  var HAT_EVERY = 1.5, HAT_LIFE = 2.6;

  // Santa tosses a party hat or a gift every 1.5 s. They are drawn BEHIND the
  // menu (so they never cover text) and every TV computes the same ones from
  // the clock, so one tossed near a screen edge carries on into the next TV.
  function drawHats(t) {
    var off = (PAGE - 1) * W, ctx = bx;
    var kMin = Math.ceil((t - HAT_LIFE) / HAT_EVERY), kMax = Math.floor(t / HAT_EVERY);
    var perCycle = Math.round(SP_CYCLE / HAT_EVERY);
    for (var kk = kMin; kk <= kMax; kk++) {
      var tk = kk * HAT_EVERY, k = ((kk % perCycle) + perCycle) % perCycle;   // same throws every minute
      var a = t - tk;
      if (a < 0 || a > HAT_LIFE) continue;
      var isGift = k % 2 === 1;
      var st = sleighAt(tk), hand = artPoint(st, 93, 47);
      var vx = st.vx * 0.2 + (hrand(k, 1) - .5) * 130,
          vy = (isGift ? -90 : -140) - hrand(k, 2) * 110 + st.vy * 0.1,
          grav = isGift ? 170 : 120;
      var x = wrapX(hand.x + vx * a - off, 120), y = hand.y + vy * a + grav * a * a;
      if (x > W + 120) continue;
      var pop = a < .3 ? easeOutBack(a / .3) : 1;
      var alpha = .8 * (a < .08 ? a / .08 : (a > HAT_LIFE - .9 ? Math.max(0, (HAT_LIFE - a) / .9) : 1));
      var size = (0.8 + 0.25 * st.depth) * pop;
      if (a < .3) {                                   // soft golden "pop"
        ctx.globalCompositeOperation = 'lighter';
        ctx.globalAlpha = (1 - a / .3) * .35;
        var r = 20 + 90 * a;
        ctx.drawImage(gold, x - r / 2, y - r / 2, r, r);
        ctx.globalCompositeOperation = 'source-over';
      }
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y);
      ctx.rotate((hrand(k, 3) - .5) * 0.6 + (hrand(k, 4) - .5) * (isGift ? 2.2 : 3.5) * a);
      ctx.scale(size, size);
      if (isGift) ctx.drawImage(gifts[(hrand(k, 5) * gifts.length) | 0], -22, -22, 44, 44);
      else ctx.drawImage(hats[(hrand(k, 5) * hats.length) | 0], -20, -25, 40, 50);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
  }

  var BIG = CFG.big !== false;
  function updateSleigh(now, dt) {
    if (!BIG) return;   // "big animation" switched off in the studio
    var clock = VIDEO ? now : Date.now();
    var t = ((clock % (SP_CYCLE * 1000)) + SP_CYCLE * 1000) % (SP_CYCLE * 1000) / 1000;
    var st = sleighAt(t);
    var x = wrapX(st.x - (PAGE - 1) * W, SL_W), shift = x - st.x;
    var on = x < W + SL_W;
    if (on !== slVisible) { sl.style.visibility = on ? 'visible' : 'hidden'; slVisible = on; }

    if (on) {
      var sc = 0.8 + 0.28 * st.depth;
      sl.style.opacity = (0.72 + 0.26 * st.depth).toFixed(3);
      sl.style.transform = 'translate3d(' + (x - SL_W / 2).toFixed(1) + 'px,' + (st.y - SL_H / 2).toFixed(1) + 'px,0) rotate(' +
        (st.ang * 57.2958).toFixed(2) + 'deg) scale(' + sc.toFixed(3) + ')';
      for (var i = 0; i < 4; i++) {
        var pose = Math.floor(t * 6 + i * 0.5) % 2;
        if (pose !== poses[i]) {
          legA[i].style.display = pose ? 'none' : '';
          legB[i].style.display = pose ? '' : 'none';
          poses[i] = pose;
        }
        deerEls[i].setAttribute('transform', 'translate(0,' + (Math.sin(t * 9 + i * 1.3) * 2.5).toFixed(2) + ')');
      }
      // sparkle dust from the back of the sleigh and the runner
      for (i = 0; i < 4; i++) {
        var e = artPoint(st, rnd(0, 70), rnd(88, 108));
        trail.push({ x: e.x + shift, y: e.y, vx: rnd(-30, 30) - st.vx * 0.08, vy: rnd(-15, 20) - st.vy * 0.08,
                     life: 0, max: rnd(.9, 2.2), r: rnd(3, 9) });
      }
    }
    drawHats(t);
    if (!trail.length) return;
    fx.globalCompositeOperation = 'lighter';
    for (var j = trail.length - 1; j >= 0; j--) {
      var q = trail[j];
      q.life += dt;
      if (q.life > q.max) { trail.splice(j, 1); continue; }
      q.x += q.vx * dt; q.y += q.vy * dt; q.vy += 14 * dt;
      var k = 1 - q.life / q.max;
      fx.globalAlpha = .75 * k;
      var d = q.r * (0.6 + 0.4 * k);
      fx.drawImage(gold, q.x - d / 2, q.y - d / 2, d, d);
    }
    fx.globalAlpha = 1;
    fx.globalCompositeOperation = 'source-over';
  }
  function drawSnow(ctx, arr, isFront, dt, tm) {
    for (var i = 0; i < arr.length; i++) {
      var f = arr[i];
      f.y += f.vy * dt;
      var x = f.x + Math.sin(tm * f.sp + f.ph) * f.sway;
      if (f.y > H + 20) { arr[i] = makeFlake(isFront, false); continue; }
      ctx.globalAlpha = f.a;
      var d = f.r * 4;
      ctx.drawImage(sprite, x - d / 2, f.y - d / 2, d, d);
    }
    ctx.globalAlpha = 1;
  }
  requestAnimationFrame(frame);

})();
