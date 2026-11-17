/* Yummy TV – plays the 60 s menu video in a loop, locked to the clock.
   Every TV whose clock is right shows the same moment, so Santa still flies
   from TV 1 to TV 2 to TV 3 (and matches the live pages too). */
(function () {
  var v = document.getElementById('v');
  var LEN = 60;     // video length in seconds
  var LEAD = 2;     // the video starts 2 s into the 60 s animation cycle

  function target() { return ((Date.now() / 1000 - LEAD) % LEN + LEN) % LEN; }
  function drift() {
    var d = v.currentTime - target();
    if (d > LEN / 2) d -= LEN;
    if (d < -LEN / 2) d += LEN;
    return d;
  }
  function sync() {
    if (!v.duration || v.readyState < 2) return;
    var d = drift();
    if (Math.abs(d) > 1) { v.currentTime = target(); v.playbackRate = 1; }   // far off: jump
    else if (Math.abs(d) > 0.08) v.playbackRate = d > 0 ? 0.97 : 1.03;       // close: ease in
    else v.playbackRate = 1;
  }
  function play() { var p = v.play(); if (p && p.catch) p.catch(function () {}); }

  v.addEventListener('loadedmetadata', function () { v.currentTime = target(); play(); });
  v.addEventListener('error', function () { setTimeout(function () { v.load(); }, 10000); });
  setInterval(sync, 2000);
  setInterval(function () { if (v.paused) play(); }, 5000);

  window.addEventListener('keydown', function (e) {
    if (e.key === '1' || e.key === '2' || e.key === '3') location.href = 'tv' + e.key + '-video.html';
  });
})();
