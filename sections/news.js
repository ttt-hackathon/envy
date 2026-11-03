// Supplier, strike and port news: findings that need attention, context, and what was searched.
// Reads window.LR_NEWS (data/signals-news.js). Fills <div id="news"> on index.html.
// If that box or the data isn't there, does nothing.
(function () {
  var N = window.LR_NEWS;
  var D = window.LAUREL_RIDGE;
  var box = document.getElementById('news');
  if (!N || !box) { return; }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function fmt(s) {
    return new Date(s + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
  }
  function name(id) {
    var s = D && D.suppliers.filter(function (x) { return x.supplier_id === id; })[0];
    return s ? s.supplier_name : id;
  }
  function names(ids) { return ids.map(name).join(', '); }
  function conf(c) {
    return '<span class="news-conf news-conf-' + c + '">' + (c === 'official' ? 'Official source' : 'News report') + '</span>';
  }
  function links(ls) {
    return ls.map(function (l) {
      return '<a href="' + esc(l.url) + '" target="_blank" rel="noopener">' + esc(l.label) + '</a>';
    }).join(' &middot; ');
  }

  var css = '' +
    '.news-summary{margin:0 0 14px;padding:10px 14px;border-radius:10px;background:#fff3df;border:1px solid #e8b56a;font-size:15px}' +
    '.news-card{border:1px solid #ddd8cc;border-radius:10px;padding:14px 16px;margin-bottom:12px;background:#fff}' +
    '.news-card.news-AMBER{border-left:6px solid #e8a33a}' +
    '.news-card.news-YELLOW{border-left:6px solid #d9cc5c}' +
    '.news-card h3{font-size:16px;margin:6px 0 4px}' +
    '.news-card p{margin:6px 0;font-size:14px}' +
    '.news-pill{display:inline-block;font-size:12px;font-weight:700;letter-spacing:.04em;padding:2px 9px;border-radius:999px;border:1px solid}' +
    '.news-pill-AMBER{background:#fff0d6;color:#8a4b00;border-color:#e8b56a}' +
    '.news-pill-YELLOW{background:#fbf6c8;color:#6b5d00;border-color:#d9cc5c}' +
    '.news-conf{display:inline-block;font-size:11px;font-weight:700;padding:2px 7px;border-radius:999px;border:1px solid;margin-left:6px;white-space:nowrap}' +
    '.news-conf-official{background:#e6f0ea;color:#1f5a3f;border-color:#a9cdb8}' +
    '.news-conf-news{background:#fbf6c8;color:#6b5d00;border-color:#d9cc5c}' +
    '.news-meta{font-size:13px;color:#5b6b62}' +
    '.news-todo{margin:4px 0 0;padding-left:20px;font-size:14px}' +
    '.news-todo li{margin-bottom:3px}' +
    '.news-label{font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:.04em;color:#5b6b62;margin-top:10px}' +
    '.news-h3{font-size:16px;margin:22px 0 8px}' +
    '.news-small{border:1px solid #ddd8cc;border-radius:10px;padding:10px 14px;margin-bottom:8px;background:#fcfbf8}' +
    '.news-small p{margin:3px 0;font-size:14px}' +
    '.news-list{margin:0;padding-left:20px;font-size:14px}' +
    '.news-list li{margin-bottom:5px}' +
    '.news-foot{font-size:13px;color:#5b6b62;margin:12px 0 0}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var amber = N.attention.filter(function (a) { return a.level === 'AMBER'; }).length;
  var yellow = N.attention.filter(function (a) { return a.level === 'YELLOW'; }).length;
  var html = '<p class="news-summary"><strong>' + N.attention.length + ' real findings need attention</strong> (' +
    amber + ' amber, ' + yellow + ' yellow), checked ' + fmt(N.checkedAt) + '. None is confirmed to have hit one of our shipments yet.</p>';

  N.attention.forEach(function (a) {
    html += '<div class="news-card news-' + a.level + '">' +
      '<span class="news-pill news-pill-' + a.level + '">' + a.level + '</span>' + conf(a.confidence) +
      '<h3>' + esc(a.title) + '</h3>' +
      '<p class="news-meta">' + esc(a.dateText) + ' &middot; Affects: ' + esc(names(a.suppliers)) + '</p>' +
      '<p>' + esc(a.what) + '</p>' +
      '<p class="news-label">Why it matters to us</p><p>' + esc(a.why) + '</p>' +
      '<p class="news-label">What to do</p><ul class="news-todo">' +
      a.todo.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>' +
      '<p class="news-meta">Sources: ' + links(a.links) + '</p></div>';
  });

  html += '<h3 class="news-h3">Context (does not raise a level)</h3>';
  N.context.forEach(function (c) {
    html += '<div class="news-small">' +
      '<p><strong>' + esc(c.title) + '</strong>' + conf(c.confidence) + '</p>' +
      '<p class="news-meta">' + esc(c.dateText) + ' &middot; ' + esc(names(c.suppliers)) + ' &middot; ' + links(c.links) + '</p>' +
      '<p>' + esc(c.what) + '</p><p><em>' + esc(c.note) + '</em></p></div>';
  });

  html += '<h3 class="news-h3">Searched, nothing found that affects supply</h3><ul class="news-list">';
  N.nothingFound.forEach(function (n) {
    html += '<li><strong>' + esc(name(n.id)) + ':</strong> ' + esc(n.note) + '</li>';
  });
  N.portsChecked.forEach(function (p) {
    html += '<li><strong>' + esc(p.port) + ' (port):</strong> ' + esc(p.note) + '</li>';
  });
  html += '</ul><p class="news-foot">' + esc(N.limits) + ' To refresh this section, ask Claude to check the supplier and port news again.</p>';
  box.innerHTML = html;
})();
