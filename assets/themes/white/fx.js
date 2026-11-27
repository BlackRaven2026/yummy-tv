/* Yummy – theme "Yummy bijeli": soft warm bokeh drifting behind the menu */
(function () {
  var W = 1920, H = 1080;
  function rnd(a, b) { return a + Math.random() * (b - a); }
  // kitchen doodles, pancake stack and the Yummy chef (themes/shared/shop.js)
  if (window.yummyShop) window.yummyShop({ big: (window.YUMMY || {}).big !== false });
  var back = document.getElementById('fx-back');
  var bx = window.yummyCanvas(back);
  var spr = {};
  function bokeh(c) {
    if (spr[c]) return spr[c];
    var cv = document.createElement('canvas'); cv.width = cv.height = 64;
    var g = cv.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(' + c + ',1)'); gr.addColorStop(1, 'rgba(' + c + ',0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    return (spr[c] = cv);
  }
  var dots = [];
  for (var i = 0; i < 26; i++) dots.push({ x: rnd(0, W), y: rnd(0, H), r: rnd(20, 70), vx: rnd(-8, 8), vy: rnd(-6, 6),
    ph: rnd(0, 6.28), a: rnd(.04, .1), c: Math.random() < .6 ? '255,170,80' : '255,210,150' });
  var last = performance.now();
  function frame(now) {
    var dt = Math.min(.05, (now - last) / 1000); last = now;
    var tm = now / 1000;
    bx.clearRect(0, 0, W, H);
    for (var i = 0; i < dots.length; i++) {
      var d = dots[i];
      d.x += d.vx * dt; d.y += d.vy * dt;
      if (d.x < -80) d.x = W + 80; if (d.x > W + 80) d.x = -80;
      if (d.y < -80) d.y = H + 80; if (d.y > H + 80) d.y = -80;
      var a = d.a * (.7 + .3 * Math.sin(tm * .7 + d.ph));
      bx.globalAlpha = a; bx.drawImage(bokeh(d.c), d.x - d.r, d.y - d.r, d.r * 2, d.r * 2);
    }
    bx.globalAlpha = 1;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
