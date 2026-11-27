/* Yummy TV – automatic updates.
   Every 3 minutes the TV checks whether this page or version.json changed on
   the website. If so, it reloads itself. If the internet is down it simply
   keeps showing the menu it already has. */
(function () {
  if (location.protocol === 'file:' || /[?&]video\b/.test(location.search)) return;

  var CHECK_MS = 3 * 60 * 1000;
  var page = location.pathname;

  function get(url) {
    var u = url + (url.indexOf('?') < 0 ? '?' : '&') + 'nocache=' + Date.now();
    return fetch(u, { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.text();
    });
  }
  function fingerprint() {
    return Promise.all([get('version.json'), get(page)]).then(function (a) { return a[0] + '\n' + a[1]; });
  }

  var base = null;
  function check() {
    fingerprint().then(function (fp) {
      if (base === null) { base = fp; return; }
      if (fp !== base) reloadFresh();
    }).catch(function () { /* offline – keep the current menu */ });
  }
  function reloadFresh() {
    // reload once now, and once more ~11 min later so images/styles the TV
    // had cached are refreshed too (GitHub Pages lets browsers cache for 10 min)
    try { sessionStorage.setItem('nyReloadAgain', String(Date.now() + 11 * 60 * 1000)); } catch (e) {}
    location.replace(page + '?v=' + Date.now());
  }

  try {
    var again = +sessionStorage.getItem('nyReloadAgain');
    if (again) {
      setTimeout(function () {
        try { sessionStorage.removeItem('nyReloadAgain'); } catch (e) {}
        location.reload();
      }, Math.max(0, again - Date.now()));
    }
  } catch (e) {}

  // a fresh start every morning at 06:00 keeps a TV running for weeks without hiccups
  var now = new Date(), six = new Date(now);
  six.setHours(6, 0, 0, 0);
  if (six <= now) six.setDate(six.getDate() + 1);
  setTimeout(function () { location.reload(); }, six - now);

  window.nyCheckForUpdate = check;   // lets you trigger a check by hand (for testing)
  check();
  setInterval(check, CHECK_MS);
})();
