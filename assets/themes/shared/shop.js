/* Yummy – pancake-shop decor shared by the "Yummy crni" and "Yummy bijeli" designs.
   - faint hand-drawn kitchen doodles drifting in the background (whisk, pan, strawberry …)
   - a warm pancake stack with dripping syrup and steam in the free space of the header
   - big animation (can be switched off): the Yummy chef pops up on TV 1, tosses a pancake
     that flips its way across all TVs and lands back in his pan. Timed by the clock, so
     the TVs stay in step. */
(function () {
  var W = 1920, H = 1080;
  var BASE = (document.currentScript && document.currentScript.src || '').replace(/shop\.js(\?.*)?$/, '');

  var DOODLES = [
    // pancake stack
    '<path d="M6 34c0 4 8 6 18 6s18-2 18-6M7 28c0 4 7 6 17 6s17-2 17-6c0-4-7-6-17-6S7 24 7 28zM9 22c0 3 7 5 15 5s15-2 15-5-7-5-15-5-15 2-15 5zM20 17l2-5h4l2 5M30 21v6M16 22v4"/>',
    // whisk
    '<path d="M24 46V32M24 32c-9-6-9-22 0-27 9 5 9 21 0 27zM24 32c-4-6-4-22 0-27 4 5 4 21 0 27zM20 46h8"/>',
    // frying pan
    '<circle cx="20" cy="26" r="13"/><circle cx="20" cy="26" r="9"/><path d="M33 26h13"/>',
    // strawberry
    '<path d="M24 43c-10-6-15-16-11-23 3-4 19-4 22 0 4 7-1 17-11 23zM17 16l7-5 7 5M24 11V6M19 25h.1M28 23h.1M23 31h.1M29 31h.1M18 33h.1"/>',
    // egg
    '<ellipse cx="24" cy="26" rx="11" ry="15"/><path d="M18 22c1-4 3-6 5-7"/>',
    // milk bottle
    '<path d="M19 6h10v6l5 7v24H14V19l5-7zM14 27h20M19 6h10"/>',
    // banana
    '<path d="M7 13c4 19 23 27 35 18-12 3-24-4-30-18zM7 13l-2-3"/>',
    // chocolate bar
    '<path d="M13 7h22v34H13zM13 15h22M13 23h22M13 31h22M24 7v34"/>',
    // spatula
    '<path d="M24 46V26M18 6h12v18H18zM22 10v10M26 10v10"/>',
    // cup with steam
    '<path d="M11 22h21v12a8 8 0 0 1-8 8h-5a8 8 0 0 1-8-8zM32 26h4a4 4 0 0 1 0 8h-4M17 16c-2-3 2-5 0-8M23 16c-2-3 2-5 0-8M29 16c-2-3 2-5 0-8"/>',
    // jar of spread
    '<path d="M14 14h20v28H14zM12 8h24v6H12zM18 26c3-3 9-3 12 0s-3 9-6 9-9-6-6-9z"/>',
    // sprinkle heart
    '<path d="M24 41S8 31 8 20c0-6 5-9 9-9 4 0 6 3 7 5 1-2 3-5 7-5 4 0 9 3 9 9 0 11-16 21-16 21zM17 20l2 2M28 18l-1 3M23 27l2-1M30 26l1 2"/>'
  ];
  function hr(k, n) { var v = Math.sin(k * 127.1 + n * 311.7) * 43758.5453; return v - Math.floor(v); }

  window.yummyShop = function (opt) {
    opt = opt || {};
    var stage = document.getElementById('stage');
    var cfg = window.YUMMY || {}, PAGE = cfg.tv || 1, COUNT = cfg.count || 3;

    var st = document.createElement('style');
    st.textContent =
      '.doodles{position:absolute;inset:0;z-index:0;pointer-events:none}' +
      '.doodle{position:absolute;fill:none;stroke:var(--doodle,rgba(255,255,255,.08));stroke-width:2;stroke-linecap:round;stroke-linejoin:round;' +
        'transform:rotate(var(--r));animation:doodle var(--dt,18s) ease-in-out var(--dd,0s) infinite alternate}' +
      '@keyframes doodle{from{transform:translate(-10px,6px) rotate(calc(var(--r) - 6deg))}to{transform:translate(10px,-8px) rotate(calc(var(--r) + 6deg))}}' +
      '.pstack{position:absolute;z-index:24;pointer-events:none;filter:drop-shadow(0 10px 14px rgba(0,0,0,.35));animation:pbob 4s ease-in-out infinite alternate}' +
      '@keyframes pbob{from{transform:translateY(0)}to{transform:translateY(-6px)}}' +
      '.pstack .drip{transform-box:fill-box;transform-origin:50% 0;animation:drip 3.6s ease-in-out infinite}' +
      '.pstack .d2{animation-delay:-1.3s;animation-duration:4.4s}.pstack .d3{animation-delay:-2.4s;animation-duration:3.1s}' +
      '@keyframes drip{0%,15%{transform:scaleY(.25)}70%{transform:scaleY(1.15)}100%{transform:scaleY(.25)}}' +
      '.pstack .steam{fill:none;stroke:var(--steam,rgba(255,255,255,.55));stroke-width:3;stroke-linecap:round;opacity:0;animation:steam 3.4s ease-in-out infinite}' +
      '.pstack .s2{animation-delay:-1.1s}.pstack .s3{animation-delay:-2.2s}' +
      '@keyframes steam{0%{opacity:0;transform:translateY(10px)}40%{opacity:.9}100%{opacity:0;transform:translateY(-16px)}}' +
      '.chef{position:absolute;left:0;top:0;z-index:28;pointer-events:none;visibility:hidden;transform-origin:50% 92%;will-change:transform;' +
        'filter:drop-shadow(0 8px 16px rgba(0,0,0,.35))}' +
      '.flycake{position:absolute;left:0;top:0;width:120px;z-index:29;pointer-events:none;visibility:hidden;will-change:transform;' +
        'filter:drop-shadow(0 6px 10px rgba(0,0,0,.35))}';
    document.head.appendChild(st);

    /* ---------- background doodles (same spots every time, different on each TV) ---------- */
    var dz = document.createElement('div');
    dz.className = 'doodles';
    var html = '', cols = 6, rows = 4, k = 0;
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) {
      var seed = PAGE * 100 + k++;
      if (hr(seed, 9) < .25) continue;
      var size = 70 + hr(seed, 1) * 60;
      var x = (c + .15 + hr(seed, 2) * .7) * (W / cols) - size / 2, y = (r + .15 + hr(seed, 3) * .7) * (H / rows) - size / 2;
      var rot = (hr(seed, 4) - .5) * 50, ic = DOODLES[Math.floor(hr(seed, 5) * DOODLES.length)];
      html += '<svg class="doodle" viewBox="0 0 48 48" style="left:' + x.toFixed(0) + 'px;top:' + y.toFixed(0) + 'px;width:' + size.toFixed(0) +
        'px;height:' + size.toFixed(0) + 'px;--r:' + rot.toFixed(0) + 'deg;--dd:' + (-hr(seed, 6) * 20).toFixed(1) + 's;--dt:' + (14 + hr(seed, 7) * 10).toFixed(1) + 's">' + ic + '</svg>';
    }
    dz.innerHTML = html;
    stage.insertBefore(dz, stage.firstChild);

    /* ---------- pancake stack with dripping syrup + steam, in the widest free space of the header ---------- */
    var stack = document.createElement('div');
    stack.className = 'pstack';
    stack.innerHTML =
      '<svg viewBox="0 0 160 150" width="150" height="141">' +
      '<defs><linearGradient id="pk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6c77a"/><stop offset=".55" stop-color="#d98f3a"/><stop offset="1" stop-color="#a8611c"/></linearGradient>' +
      '<linearGradient id="sy" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c46a14"/><stop offset="1" stop-color="#8a3f08"/></linearGradient></defs>' +
      '<ellipse cx="80" cy="134" rx="66" ry="11" fill="#fff" opacity=".9"/><ellipse cx="80" cy="132" rx="58" ry="8" fill="#e9e2d6"/>' +
      [118, 101, 84, 67].map(function (y) {
        return '<ellipse cx="80" cy="' + (y + 6) + '" rx="52" ry="12" fill="#8a4d14"/><ellipse cx="80" cy="' + y + '" rx="52" ry="13" fill="url(#pk)"/>';
      }).join('') +
      '<path d="M34 64c6-10 86-10 92 0 2 5-8 9-12 8-4 10-8 12-10 2-6 4-14 5-18 4-2 12-8 14-10 0-8 2-16 2-22-2-4 8-10 10-12-2-6 0-10-4-8-10z" fill="url(#sy)"/>' +
      '<path class="drip d1" d="M46 68c0 10-4 18 0 24 4-6 0-14 0-24z" fill="#9a4a0c"/>' +
      '<path class="drip d2" d="M104 70c0 12-4 20 0 28 4-8 0-16 0-28z" fill="#9a4a0c"/>' +
      '<path class="drip d3" d="M76 72c0 8-3 14 0 19 3-5 0-11 0-19z" fill="#9a4a0c"/>' +
      '<rect x="68" y="48" width="24" height="14" rx="3" fill="#fff3b0"/><rect x="68" y="48" width="24" height="5" rx="2" fill="#fffbe0"/>' +
      '<path class="steam s1" d="M60 40c-6-8 6-12 0-20s6-12 0-18"/>' +
      '<path class="steam s2" d="M82 38c-6-8 6-12 0-20s6-12 0-18"/>' +
      '<path class="steam s3" d="M104 40c-6-8 6-12 0-20s6-12 0-18"/>' +
      '</svg>';
    stage.appendChild(stack);
    function placeStack() {
      var gaps = window.yummyGaps ? window.yummyGaps(190) : [];
      gaps.sort(function (a, b) { return (b.x1 - b.x0) - (a.x1 - a.x0); });
      if (!gaps.length) { stack.style.display = 'none'; return; }
      var g = gaps[0];
      stack.style.display = '';
      stack.style.left = ((g.x0 + g.x1) / 2 - 75) + 'px';
      stack.style.top = Math.max(18, (g.y0 + g.y1) / 2 - 76) + 'px';
    }
    window.addEventListener('yummy:layout', placeStack);
    placeStack();

    /* ---------- big animation: the Yummy chef ---------- */
    if (opt.big === false) return;
    var VIDEO = /[?&]video\b/.test(location.search);
    var CYCLE = 30, T_TOSS = 1.8, FLIGHT = 6 * COUNT, T_CATCH = T_TOSS + FLIGHT;     // seconds
    var MW = 250, MH = MW * 325.07 / 312.6, MX = 26;                                 // chef size / spot (TV 1, bottom left)
    var PANX = MX + 274 / 312.6 * MW, PANY_UP = 112 / 325.07 * MH;                   // pan centre inside the picture
    var UP = H - MH * .9, DOWN = H + 30;

    var chef = null;
    if (PAGE === 1) {
      chef = document.createElement('img');
      chef.className = 'chef'; chef.alt = '';
      chef.src = BASE + 'mascot.svg';
      chef.style.width = MW + 'px';
      stage.appendChild(chef);
    }
    var pc = document.createElement('img');
    pc.className = 'flycake'; pc.alt = '';
    pc.src = BASE + 'pancake.svg';
    stage.appendChild(pc);

    function ease(x) { return x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x); }
    // how far up the chef is (0 hidden .. 1 fully up)
    function chefUp(t) {
      if (t < 1) return ease(t);
      if (t < 3.6) return 1;
      if (t < 4.6) return 1 - ease(t - 3.6);
      if (t < T_CATCH - 2.2) return 0;
      if (t < T_CATCH - 1.2) return ease(t - (T_CATCH - 2.2));
      if (t < T_CATCH + 1.6) return 1;
      if (t < T_CATCH + 2.6) return 1 - ease(t - (T_CATCH + 1.6));
      return 0;
    }
    function frame(now) {
      var clock = VIDEO ? now : Date.now();
      var t = ((clock % (CYCLE * 1000)) + CYCLE * 1000) % (CYCLE * 1000) / 1000;
      var panY = UP + PANY_UP;
      if (chef) {
        var up = chefUp(t), y = DOWN + (UP - DOWN) * up;
        var lean = 0, hop = 0;
        var dtT = t - T_TOSS, dtC = t - T_CATCH;
        if (dtT > -.5 && dtT < .6) lean = dtT < 0 ? 6 * (dtT + .5) / .5 : 6 - 14 * Math.min(1, dtT / .25) + 8 * Math.max(0, (dtT - .25) / .35);
        if (dtC > -.1 && dtC < .5) { lean = -5 * Math.sin(Math.PI * Math.max(0, dtC) / .5); hop = -14 * Math.sin(Math.PI * Math.max(0, dtC) / .5); }
        chef.style.visibility = up > 0 ? 'visible' : 'hidden';
        chef.style.transform = 'translate3d(' + MX + 'px,' + (y + hop).toFixed(1) + 'px,0) rotate(' + lean.toFixed(2) + 'deg)';
      }
      // the pancake: from the pan on TV 1, across every TV, back into the pan
      var u = (t - T_TOSS) / FLIGHT;
      if (u > 0 && u < 1) {
        var gx = PANX + COUNT * W * u;
        var x = gx - (PAGE - 1) * W;
        if (x > COUNT * W - 200) x -= COUNT * W;           // last stretch comes back in on TV 1
        var arcs = COUNT, a = u * arcs;
        var y2 = panY - 60 - (620 + 60 * Math.sin(a * 2.1)) * (1 - Math.cos(2 * Math.PI * a)) / 2;
        if (u < .04) y2 = panY - 60 * (u / .04) + (y2 - (panY - 60)) * (u / .04);
        if (u > .96) y2 = panY - 60 * ((1 - u) / .04) + (y2 - (panY - 60)) * ((1 - u) / .04);
        var flip = Math.cos(t * 7), spin = Math.sin(t * 2.3) * 25;
        pc.style.visibility = (x > -160 && x < W + 160) ? 'visible' : 'hidden';
        pc.style.transform = 'translate3d(' + (x - 60).toFixed(1) + 'px,' + (y2 - 30).toFixed(1) + 'px,0) rotate(' + spin.toFixed(1) + 'deg) scale(1,' +
          (Math.abs(flip) < .12 ? .12 : flip).toFixed(3) + ')';
      } else if (chef && chefUp(t) > 0) {               // resting in the pan before the toss / after the catch
        var cy = DOWN + (UP - DOWN) * chefUp(t) + PANY_UP;
        pc.style.visibility = 'visible';
        pc.style.transform = 'translate3d(' + (PANX - 58).toFixed(1) + 'px,' + (cy - 44).toFixed(1) + 'px,0) rotate(-14deg) scale(.82,.55)';
      } else pc.style.visibility = 'hidden';
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  };
})();
