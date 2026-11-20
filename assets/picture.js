/* Yummy TV – Picture mode: shows the still picture of this TV's menu, full screen.
   Uses almost no TV power. The picture is remade by the studio on every Publish;
   update.js reloads the page when something new is published. */
(function () {
  var img = document.getElementById('p');
  var src = img.getAttribute('data-src');
  function show(v) { img.src = src + (v ? '?v=' + encodeURIComponent(v) : ''); }
  // the version number makes sure the TV shows the newest picture, not an old saved copy
  if (location.protocol === 'file:') show('');
  else fetch('version.json?nocache=' + Date.now(), { cache: 'no-store' })
    .then(function (r) { return r.json(); })
    .then(function (j) { show(j.version); })
    .catch(function () { show(''); });
  img.addEventListener('error', function () { setTimeout(function () { show(String(Date.now())); }, 30000); });

  window.addEventListener('keydown', function (e) {
    var n = +e.key, count = window.YUMMY_COUNT || 3;
    if (n >= 1 && n <= count) location.href = 'tv' + n + '-image.html';
  });
})();
