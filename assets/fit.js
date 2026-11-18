/* Yummy TV – shared page helper (all themes)
   - scales the fixed 1920x1080 stage to any screen
   - shrinks text/images of a block a little when it would not fit
     (so adding items or long names never breaks the layout)
   - small staggered animations, keyboard shortcuts on the TV */
(function () {
  var W = 1920, H = 1080;
  var stage = document.getElementById('stage');
  var cfg = window.YUMMY || {};

  function scale() {
    var s = Math.min(window.innerWidth / W, window.innerHeight / H);
    stage.style.transform = 'scale(' + s + ')';
  }
  window.addEventListener('resize', scale);
  scale();

  function over(el) { return el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1; }
  function anyOver(box) {
    if (over(box)) return true;
    for (var c = box.firstElementChild; c; c = c.nextElementSibling) {
      if ((c.classList.contains('card') || c.classList.contains('pill')) && over(c)) return true;
    }
    return false;
  }

  function stagger() {
    var imgs = document.querySelectorAll('.dish img');
    for (var a = 0; a < imgs.length; a++) {
      imgs[a].style.setProperty('--ft', (5 + (a * 37 % 30) / 10) + 's');
      imgs[a].style.setProperty('--fd', (-(a * 1.3) % 7) + 's');
    }
    var tags = document.querySelectorAll('.price');
    for (a = 0; a < tags.length; a++) tags[a].style.setProperty('--pd', (a * 0.55 % 6) + 's');
  }

  function fitAll() {
    var root = document.documentElement;
    root.classList.add('measuring');           // freeze animations while measuring
    var boxes = document.querySelectorAll('[data-fit]');
    for (var i = 0; i < boxes.length; i++) {
      var b = boxes[i], k = 1;
      b.style.setProperty('--k', '1');
      while (k > 0.5 && anyOver(b)) { k -= 0.025; b.style.setProperty('--k', k.toFixed(3)); }
    }
    root.classList.remove('measuring');
    stagger();
    var ev;
    try { ev = new Event('yummy:layout'); } catch (e) { ev = document.createEvent('Event'); ev.initEvent('yummy:layout', true, true); }
    window.dispatchEvent(ev);
  }
  window.yummyFit = fitAll;

  /* free horizontal gaps in the header (where themes hang ornaments / fireworks) */
  window.yummyGaps = function (minW) {
    var hdr = document.querySelector('.hdr');
    if (!hdr) return [];
    var s = stage.getBoundingClientRect(), sc = s.width / W, spans = [];
    var kids = hdr.children;
    for (var i = 0; i < kids.length; i++) {
      var r = kids[i].getBoundingClientRect();
      if (r.width < 2) continue;
      spans.push([(r.left - s.left) / sc, (r.right - s.left) / sc]);
    }
    spans.sort(function (a, b) { return a[0] - b[0]; });
    var gaps = [], x = 40;
    for (i = 0; i < spans.length; i++) {
      if (spans[i][0] - x >= (minW || 140)) gaps.push([x, spans[i][0]]);
      x = Math.max(x, spans[i][1]);
    }
    if (W - 40 - x >= (minW || 140)) gaps.push([x, W - 40]);
    var hr = hdr.getBoundingClientRect();
    return gaps.map(function (g) { return { x0: g[0], x1: g[1], y0: (hr.top - s.top) / sc, y1: (hr.bottom - s.top) / sc }; });
  };

  fitAll();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitAll);
  window.addEventListener('load', fitAll);

  if (!cfg.preview) {
    window.addEventListener('keydown', function (e) {
      if (/^[1-9]$/.test(e.key) && +e.key <= (cfg.count || 3)) location.href = 'tv' + e.key + '.html';
      if (e.key === 'f' || e.key === 'F') {
        var d = document.documentElement;
        if (!document.fullscreenElement && d.requestFullscreen) d.requestFullscreen();
        else if (document.exitFullscreen) document.exitFullscreen();
      }
    });
  }
})();
