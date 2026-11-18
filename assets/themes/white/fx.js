/* Yummy – theme "Yummy bijeli": soft warm bokeh drifting behind the menu */
(function () {
  var W = 1920, H = 1080;
  function rnd(a, b) { return a + Math.random() * (b - a); }
  var back = document.getElementById('fx-back');
  back.width = W; back.height = H;
  var bx = back.getContext('2d');
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
      var g = bx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r);
      g.addColorStop(0, 'rgba(' + d.c + ',' + a.toFixed(3) + ')'); g.addColorStop(1, 'rgba(' + d.c + ',0)');
      bx.fillStyle = g; bx.beginPath(); bx.arc(d.x, d.y, d.r, 0, 6.3); bx.fill();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
