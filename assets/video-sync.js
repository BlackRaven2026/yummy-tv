/* Yummy TV – plays the 60 s menu video in an endless loop, in step with the clock.
   Made for cheap TV browsers:
   - never changes the playback speed (that makes weak decoders stutter)
   - loops by itself just before the end (some TVs ignore the "loop" setting and stop),
     and uses that moment to get back in step with the clock – the end and the start of
     the video are the same picture, so the jump cannot be seen
   - if the picture freezes, it restarts the video; if that keeps failing, reloads the page */
(function () {
  var v = document.getElementById('v');
  var LEN = 60;     // video length in seconds
  var LEAD = 2;     // the video starts 2 s into the 60 s animation cycle
  var END = 0.35;   // loop this many seconds before the real end

  function target() { return ((Date.now() / 1000 - LEAD) % LEN + LEN) % LEN; }
  function len() { return v.duration && isFinite(v.duration) ? v.duration : LEN; }
  function play() { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
  function jump(t) {
    try { v.currentTime = Math.min(Math.max(0, t), len() - END - 0.05); } catch (e) {}
    play();
  }

  v.addEventListener('loadedmetadata', function () { jump(target()); });
  // our own loop: just before the end, go back to the start (in step with the clock)
  v.addEventListener('timeupdate', function () {
    if (v.currentTime >= len() - END) {
      var t = target();
      jump(t > len() - 3 ? 0 : t);
    }
  });
  v.addEventListener('ended', function () { jump(target()); });
  v.addEventListener('error', function () { setTimeout(function () { v.load(); }, 5000); });

  // every 15 s: if far out of step (more than 2 s), jump once; small differences wait for the loop point
  setInterval(function () {
    if (!v.duration || v.readyState < 2 || v.seeking) return;
    var d = v.currentTime - target();
    if (d > LEN / 2) d -= LEN;
    if (d < -LEN / 2) d += LEN;
    if (Math.abs(d) > 2) jump(target());
  }, 15000);

  // watchdog: the picture must move. Stuck for 4 s -> restart video; stuck 3 times in a row -> reload page
  var lastT = -1, stuck = 0, fails = 0;
  setInterval(function () {
    if (v.paused && !v.seeking) play();
    if (Math.abs(v.currentTime - lastT) < 0.01 && !v.seeking) stuck++; else { stuck = 0; fails = 0; }
    lastT = v.currentTime;
    if (stuck >= 4) {
      stuck = 0; fails++;
      if (fails >= 3) { location.reload(); return; }
      v.load();
    }
  }, 1000);

  window.addEventListener('keydown', function (e) {
    var n = +e.key, count = window.YUMMY_COUNT || 3;
    if (n >= 1 && n <= count) location.href = 'tv' + n + '-video.html';
  });
})();
