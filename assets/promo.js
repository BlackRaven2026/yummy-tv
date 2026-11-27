/* Yummy TV – short promo overlay, shared by Live / Video / Slika.
   Two modes:
     dish  – a chosen dish pops out of the menu (menu stays visible behind)
     slide – full-screen card with a title, small line and QR / picture
   Config comes from menu.json -> settings.promo, built by engine/render.js.
   Opens window.YummyPromo so the studio can preview one without publishing. */
(function () {
  var c = window.PROMO;
  if (!c) return;
  var items = (c.items || []).filter(function (x) { return x && (x.mode !== 'dish' || !x.missing); });
  if (!c.preview && (!c.enabled || !items.length)) return;

  var interval = Math.max(1, +c.intervalMin || 10) * 60000;
  var baseDur = Math.max(2, Math.min(120, +c.durationSec || 12)) * 1000;
  var imgBase = c.preview ? '/data/images/' : 'assets/img/';
  var idx = 0, timer = null, order = [];

  var css = document.createElement('style');
  css.textContent =
    '.yummy-promo{position:fixed;top:0;right:0;bottom:0;left:0;z-index:9999;display:grid;place-items:center;opacity:0;' +
    'transition:opacity .4s ease;pointer-events:none;cursor:none;font-family:Montserrat,system-ui,sans-serif;' +
    'text-align:center;color:#fff;overflow:hidden}' +
    '.yummy-promo.on{opacity:1}' +
    '.yummy-promo.yp-slide{background:rgba(6,9,20,.82)}' +
    '.yummy-promo.yp-dish{background:rgba(6,9,20,.42)}' +
    '@keyframes ypop{0%{transform:scale(.78);filter:brightness(1.4)}60%{transform:scale(var(--pop,1.25));filter:brightness(1)}' +
    '100%{transform:scale(var(--pop,1.25))}}' +
    '@keyframes yglow{0%,100%{box-shadow:0 0 5vh rgba(240,124,0,.45)}50%{box-shadow:0 0 12vh rgba(240,124,0,.95)}}' +
    '.yummy-promo .card,.yummy-promo .dish-card{max-width:72vw;padding:3.5vh 5vw;border-radius:3vh;' +
    'background:linear-gradient(135deg,rgba(255,143,31,.96),rgba(246,210,127,.96));color:#2a1704;' +
    'display:flex;align-items:center;justify-content:center;gap:4vw;font-family:Montserrat,system-ui,sans-serif}' +
    '.yummy-promo .txt{max-width:44vw}.yummy-promo h2{font-family:Oswald,sans-serif;font-size:clamp(34px,5vw,86px);' +
    'margin:0 0 1.2vh;line-height:1.05;text-transform:uppercase}.yummy-promo p{font-size:clamp(18px,2.2vw,40px);' +
    'margin:0;font-weight:600}.yummy-promo img{width:min(28vh,24vw);height:min(28vh,24vw);object-fit:contain;' +
    'background:#fff;border-radius:2vh;padding:1vh}' +
    '.yummy-promo .dish-card{transform-origin:center;animation:ypop .55s cubic-bezier(.2,1.35,.4,1) forwards,' +
    'yglow 1.6s ease-in-out .55s infinite alternate}' +
    '.yummy-promo .dish-pic{flex:none;width:min(30vh,26vw);height:min(30vh,26vw);display:grid;place-items:center;' +
    'background:#fff;border-radius:2vh;padding:1vh;box-shadow:0 1vh 4vh rgba(0,0,0,.3)}' +
    '.yummy-promo .dish-pic img{width:100%;height:100%;padding:0;background:none;border-radius:0}' +
    '.yummy-promo .dish-ph{font-size:min(16vh,14vw);color:var(--orange,#f07c00)}' +
    '.yummy-promo .dish-txt{max-width:42vw;display:flex;flex-direction:column;align-items:center;gap:.8vh}' +
    '.yummy-promo .dish-label{font:700 clamp(14px,1.8vw,28px) Montserrat,sans-serif;text-transform:uppercase;' +
    'letter-spacing:.06em;background:#c40308;color:#fff;padding:.7vh 1.6vw;border-radius:999px}' +
    '.yummy-promo .dish-txt h2{font-size:clamp(28px,4vw,72px);margin:0}' +
    '.yummy-promo .dish-meta{font-size:clamp(18px,2.4vw,42px);font-weight:700}' +
    '.yummy-promo .dish-sub{font-size:clamp(15px,1.8vw,30px);font-weight:500;opacity:.85}';
  document.head.appendChild(css);

  var box = document.createElement('div');
  box.className = 'yummy-promo';
  document.body.appendChild(box);

  function picture(src) {
    var im = document.createElement('img');
    im.alt = ''; im.src = imgBase + encodeURIComponent(src);
    return im;
  }
  function buildSlide(it) {
    var card = document.createElement('div'); card.className = 'card';
    var txt = document.createElement('div'); txt.className = 'txt';
    if (it.title) { var h = document.createElement('h2'); h.textContent = it.title; txt.appendChild(h); }
    if (it.sub) { var p = document.createElement('p'); p.textContent = it.sub; txt.appendChild(p); }
    card.appendChild(txt);
    if (it.qr) card.appendChild(picture('qr-' + it.qr + '.png'));
    else if (it.image) card.appendChild(picture(it.image));
    return card;
  }
  function buildDish(it) {
    var card = document.createElement('div'); card.className = 'dish-card';
    card.style.setProperty('--pop', String(Math.max(1, Math.min(2, +it.scale || 1.25))));
    var pic = document.createElement('div'); pic.className = 'dish-pic';
    if (it.dishImage) pic.appendChild(picture(it.dishImage));
    else { var ph = document.createElement('div'); ph.className = 'dish-ph'; ph.textContent = '★'; pic.appendChild(ph); }
    card.appendChild(pic);
    var txt = document.createElement('div'); txt.className = 'dish-txt';
    if (it.title) { var lab = document.createElement('div'); lab.className = 'dish-label'; lab.textContent = it.title; txt.appendChild(lab); }
    if (it.name) { var nm = document.createElement('h2'); nm.textContent = it.name; txt.appendChild(nm); }
    var meta = [];
    if (it.showPrice && it.price) meta.push(it.price);
    if (it.weight) meta.push(it.weight);
    if (meta.length) { var m = document.createElement('p'); m.className = 'dish-meta'; m.textContent = meta.join(' · '); txt.appendChild(m); }
    if (it.sub) { var s = document.createElement('p'); s.className = 'dish-sub'; s.textContent = it.sub; txt.appendChild(s); }
    card.appendChild(txt);
    return card;
  }

  function nextIndex() {
    if (!order.length) order = items.map(function (_, i) { return i; });
    if (c.shuffle && order.length > 1) {
      for (var i = order.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1)), t = order[i]; order[i] = order[j]; order[j] = t;
      }
      if (order.length > 1 && order[0] === idx) { var z = order[0]; order[0] = order[1]; order[1] = z; }
    }
    idx = order.shift();
    return idx;
  }
  function show(i) {
    var it = items[i == null ? nextIndex() : i];
    if (!it) return;
    box.innerHTML = '';
    box.className = 'yummy-promo ' + (it.mode === 'dish' ? 'yp-dish' : 'yp-slide');   // not "dish": that class belongs to the menu pictures
    // restart the pop animation every time
    box.appendChild(it.mode === 'dish' ? buildDish(it) : buildSlide(it));
    void box.offsetWidth;
    box.classList.add('on');
    clearTimeout(timer);
    timer = setTimeout(hide, (+it.durationSec > 0 ? +it.durationSec : baseDur / 1000) * 1000);
  }
  function hide() { box.classList.remove('on'); }

  window.YummyPromo = { show: show, hide: hide, count: function () { return items.length; } };
  if (!c.preview && c.enabled) setInterval(function () { show(); }, interval);
})();
