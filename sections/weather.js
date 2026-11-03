// Storms and quakes: what we checked, what it said, and recent real events.
// Reads window.LR_WEATHER (data/signals-weather.js). Fills <div id="weather"> on index.html.
// If that box or the data isn't there, does nothing.
(function () {
  var W = window.LR_WEATHER;
  var D = window.LAUREL_RIDGE;
  var box = document.getElementById('weather');
  if (!W || !box) { return; }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function fmt(s) {
    return new Date(s + 'T00:00:00Z').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
  }
  function names(ids) {
    if (!ids || !ids.length || !D) { return ''; }
    return ids.map(function (id) {
      var s = D.suppliers.filter(function (x) { return x.supplier_id === id; })[0];
      return s ? s.supplier_name : id;
    }).join(', ');
  }
  function conf(c) {
    return '<span class="weather-conf weather-conf-' + c + '">' + (c === 'official' ? 'Official source' : 'News report') + '</span>';
  }
  var statusText = { clear: 'Nothing found', partial: 'Not fully checked' };

  var css = '' +
    '.weather-summary{margin:0 0 14px;padding:10px 14px;border-radius:10px;background:#e6f0ea;border:1px solid #a9cdb8;font-size:15px}' +
    '.weather-t{width:100%;border-collapse:collapse;font-size:14px}' +
    '.weather-t th{text-align:left;font-size:12px;letter-spacing:.05em;text-transform:uppercase;color:#5b6b62;padding:8px 10px;border-bottom:2px solid #ddd8cc}' +
    '.weather-t td{padding:9px 10px;border-bottom:1px solid #ddd8cc;vertical-align:top}' +
    '.weather-wrap{overflow-x:auto}' +
    '.weather-conf{display:inline-block;font-size:11px;font-weight:700;padding:2px 7px;border-radius:999px;border:1px solid;white-space:nowrap}' +
    '.weather-conf-official{background:#e6f0ea;color:#1f5a3f;border-color:#a9cdb8}' +
    '.weather-conf-news{background:#fbf6c8;color:#6b5d00;border-color:#d9cc5c}' +
    '.weather-clear{color:#1f5a3f;font-weight:600}' +
    '.weather-partial{color:#8a4b00;font-weight:600}' +
    '.weather-sub{display:block;font-size:12px;color:#5b6b62;margin-top:3px}' +
    '.weather-h3{font-size:16px;margin:20px 0 8px}' +
    '.weather-event{border:1px solid #ddd8cc;border-radius:10px;padding:12px 14px;margin-bottom:10px;background:#fcfbf8}' +
    '.weather-event p{margin:4px 0;font-size:14px}' +
    '.weather-event .weather-title{font-weight:600;font-size:15px}' +
    '.weather-note{background:#fff3df;border-left:4px solid #e8b56a;padding:6px 10px;border-radius:4px}' +
    '.weather-foot{font-size:13px;color:#5b6b62;margin:10px 0 0}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var clear = W.checks.filter(function (c) { return c.status === 'clear'; }).length;
  var html = '<p class="weather-summary"><strong>No current storm or quake warning found for our suppliers or ports</strong> ' +
    '(checked ' + fmt(W.checkedAt) + '). ' + clear + ' of ' + W.checks.length + ' checks came back clear; ' +
    (W.checks.length - clear) + ' could not be fully checked and are marked below.</p>';

  html += '<div class="weather-wrap"><table class="weather-t"><thead><tr><th>Area</th><th>Source</th><th>What it said</th><th>Result</th></tr></thead><tbody>';
  W.checks.forEach(function (c) {
    html += '<tr>' +
      '<td>' + esc(c.area) + (c.suppliers.length ? '<span class="weather-sub">' + esc(names(c.suppliers)) + '</span>' : '') + '</td>' +
      '<td><a href="' + esc(c.link) + '" target="_blank" rel="noopener">' + esc(c.source) + '</a>' +
        '<span class="weather-sub">' + fmt(c.date) + '</span> ' + conf(c.confidence) + '</td>' +
      '<td>' + esc(c.result) + '</td>' +
      '<td class="weather-' + c.status + '">' + statusText[c.status] + '</td></tr>';
  });
  html += '</tbody></table></div>';

  html += '<h3 class="weather-h3">Recent events (for context)</h3>';
  W.recent.forEach(function (e) {
    html += '<div class="weather-event">' +
      '<p class="weather-title">' + esc(e.title) + '</p>' +
      '<p>' + fmt(e.date) + ' &middot; <a href="' + esc(e.link) + '" target="_blank" rel="noopener">Source</a> ' + conf(e.confidence) + '</p>' +
      '<p>' + esc(e.what) + '</p>' +
      '<p><strong>Suppliers:</strong> ' + esc(names(e.suppliers)) + '</p>' +
      '<p class="weather-note">' + esc(e.note) + '</p></div>';
  });
  html += '<p class="weather-foot">These events are older than 7 days and come from news reports, so they do not raise any supplier\'s risk level on their own. ' +
    'To refresh this section, ask Claude to check the storm and quake sources again.</p>';
  box.innerHTML = html;
})();
