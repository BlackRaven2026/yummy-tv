/* Yummy – theme "Yummy crni": chalkboard grain + slow warm dust */
(function () {
  var W = 1920, H = 1080;
  function rnd(a, b) { return a + Math.random() * (b - a); }

  // chalkboard grain, drawn once
  var g = document.querySelector('.grain');
  if (g) {
    var c = document.createElement('canvas'); c.width = c.height = 256;
    var x = c.getContext('2d'), d = x.createImageData(256, 256);
    for (var i = 0; i < d.data.length; i += 4) {
      var v = Math.random() * 255 | 0;
      d.data[i] = d.data[i + 1] = d.data[i + 2] = v;
      d.data[i + 3] = Math.random() < .5 ? 10 : 0;
    }
    x.putImageData(d, 0, 0);
    // a few faint chalk smudges
    for (i = 0; i < 6; i++) {
      x.strokeStyle = 'rgba(255,255,255,.025)'; x.lineWidth = rnd(10, 30);
      x.beginPath(); x.moveTo(rnd(0, 256), rnd(0, 256)); x.quadraticCurveTo(rnd(0, 256), rnd(0, 256), rnd(0, 256), rnd(0, 256)); x.stroke();
    }
    g.style.backgroundImage = 'url(' + c.toDataURL() + ')';
  }

  var back = document.getElementById('fx-back');
  back.width = W; back.height = H;
  var bx = back.getContext('2d');
  var dust = [];
  function mote(init) {
    return { x: rnd(0, W), y: init ? rnd(0, H) : H + 10, r: rnd(.8, 2.4), vy: -rnd(6, 18), sway: rnd(10, 40), ph: rnd(0, 6.28),
             sp: rnd(.2, .6), a: rnd(.08, .3), warm: Math.random() < .55 };
  }
  for (var m = 0; m < 70; m++) dust.push(mote(true));
  var last = performance.now();
  function frame(now) {
    var dt = Math.min(.05, (now - last) / 1000); last = now;
    var tm = now / 1000;
    bx.clearRect(0, 0, W, H);
    for (var i = 0; i < dust.length; i++) {
      var q = dust[i];
      q.y += q.vy * dt;
      if (q.y < -10) { dust[i] = mote(false); continue; }
      var a = q.a * (.6 + .4 * Math.sin(tm * 1.3 + q.ph));
      bx.fillStyle = q.warm ? 'rgba(255,150,60,' + a.toFixed(3) + ')' : 'rgba(255,255,255,' + (a * .7).toFixed(3) + ')';
      bx.beginPath(); bx.arc(q.x + Math.sin(tm * q.sp + q.ph) * q.sway, q.y, q.r, 0, 6.3); bx.fill();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
