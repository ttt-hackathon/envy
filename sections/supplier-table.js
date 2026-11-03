// Supplier table: all suppliers, a risk level and a plain-English reason,
// based only on our own purchasing data (stock vs. when the next order arrives).
// Live warnings (weather, news) will raise these levels later, in the risk section.
// Fills <div id="supplier-table"> on index.html. If that box isn't there, does nothing.
(function () {
  var DAY = 86400000;
  var D = window.LAUREL_RIDGE;
  if (!D) { return; }

  function toTime(s) { return Date.parse(s + 'T00:00:00Z'); }
  function fmt(t) {
    return new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
  }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function money(n) { return '$' + (Number(n) / 1e6).toFixed(2) + 'M'; }

  var asOf = toTime(D.asOf);
  var rank = { GREEN: 0, YELLOW: 1, AMBER: 2, RED: 3 };

  // Work out each part: when stock runs out, when the next order lands, the gap.
  var partInfo = {};
  D.parts.forEach(function (p) {
    var inv = D.inventory.filter(function (i) { return i.part_number === p.part_number; })[0];
    var arrivals = D.openOrders
      .filter(function (o) { return o.part_number === p.part_number && toTime(o.promised_arrival_date) >= asOf; })
      .map(function (o) { return toTime(o.promised_arrival_date); })
      .sort(function (a, b) { return a - b; });
    var weeks = inv ? Number(inv.weeks_of_cover) : null;
    var runsOut = weeks === null ? null : asOf + weeks * 7 * DAY;
    var next = arrivals.length ? arrivals[0] : null;
    var gapDays = (runsOut !== null && next !== null) ? Math.round((next - runsOut) / DAY) : null;
    partInfo[p.part_number] = {
      part: p, weeks: weeks, runsOut: runsOut, next: next, gapDays: gapDays,
      sole: String(p.only_source).toLowerCase() === 'yes'
    };
  });

  // Rate each supplier from its worst part.
  var rows = D.suppliers.map(function (s) {
    var parts = D.parts.filter(function (p) { return p.supplier_id === s.supplier_id; })
      .map(function (p) { return partInfo[p.part_number]; });
    var level = 'GREEN';
    var reasons = [];
    function raise(l) { if (rank[l] > rank[level]) { level = l; } }

    parts.forEach(function (pi) {
      var name = pi.part.description;
      if (pi.gapDays !== null && pi.gapDays > 0) {
        raise('AMBER');
        reasons.push({ r: 2 + pi.gapDays / 1000, t: name + ': ' + pi.weeks + ' weeks of stock runs out about ' + fmt(pi.runsOut) +
          ' but the next delivery is ' + fmt(pi.next) + ' (' + pi.gapDays + ' day' + (pi.gapDays === 1 ? '' : 's') + ' short).' });
      } else if (pi.gapDays !== null && pi.gapDays > -7) {
        // gapDays is zero or negative here: the delivery lands before stock runs out.
        var margin = -pi.gapDays;
        raise('YELLOW');
        reasons.push({ r: 1, t: name + ': stock lasts to about ' + fmt(pi.runsOut) + ' and the next delivery is ' +
          fmt(pi.next) + ', only ' + margin + ' day' + (margin === 1 ? '' : 's') + ' of margin.' });
      } else if (pi.sole && pi.weeks !== null && pi.weeks <= 3) {
        raise('YELLOW');
        reasons.push({ r: 1, t: name + ': only ' + pi.weeks + ' weeks of stock, and no other approved source.' });
      }
    });
    if (Number(s.on_time_delivery_pct_last_12_months) < 90 && parts.some(function (p) { return p.sole; })) {
      raise('YELLOW');
      reasons.push({ r: 1, t: 'Delivered on time only ' + s.on_time_delivery_pct_last_12_months +
        '% of the time last year, and we have no backup for its parts.' });
    }
    if (!reasons.length) {
      reasons.push({ r: 0, t: 'Stock covers us until the next delivery lands.' });
    }
    reasons.sort(function (a, b) { return b.r - a.r; });

    var soleCount = parts.filter(function (p) { return p.sole; }).length;
    return { s: s, level: level, reasons: reasons, soleCount: soleCount, parts: parts.length };
  });

  rows.sort(function (a, b) {
    return rank[b.level] - rank[a.level] || Number(b.s.annual_spend_usd) - Number(a.s.annual_spend_usd);
  });

  // Share the result so the summary bar (and later sections) can use it.
  window.LR_SUPPLIER_STATUS = rows.map(function (r) {
    return { id: r.s.supplier_id, name: r.s.supplier_name, level: r.level, why: r.reasons[0].t };
  });
  if (typeof window.LR_ON_STATUS === 'function') { window.LR_ON_STATUS(); }

  var box = document.getElementById('supplier-table');
  if (!box) { return; }

  var css = '' +
    '.supplier-table-wrap{overflow-x:auto}' +
    '.supplier-table-t{width:100%;border-collapse:collapse;font-size:15px}' +
    '.supplier-table-t th{text-align:left;font-size:12px;letter-spacing:.05em;text-transform:uppercase;color:#5b6b62;padding:8px 10px;border-bottom:2px solid #ddd8cc;white-space:nowrap}' +
    '.supplier-table-t td{padding:10px;border-bottom:1px solid #ddd8cc;vertical-align:top}' +
    '.supplier-table-pill{display:inline-block;min-width:68px;text-align:center;font-size:12px;font-weight:700;letter-spacing:.04em;padding:3px 8px;border-radius:999px;border:1px solid}' +
    '.supplier-table-RED{background:#fde8e6;color:#9b1c10;border-color:#e8a29b}' +
    '.supplier-table-AMBER{background:#fff0d6;color:#8a4b00;border-color:#e8b56a}' +
    '.supplier-table-YELLOW{background:#fbf6c8;color:#6b5d00;border-color:#d9cc5c}' +
    '.supplier-table-GREEN{background:#e6f0ea;color:#1f5a3f;border-color:#a9cdb8}' +
    '.supplier-table-name{font-weight:600}' +
    '.supplier-table-sub{display:block;font-size:13px;color:#5b6b62;margin-top:2px}' +
    '.supplier-table-more{margin:4px 0 0;padding-left:18px;font-size:13px;color:#5b6b62}' +
    '.supplier-table-note{font-size:13px;color:#5b6b62;margin:10px 0 0}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var html = '<div class="supplier-table-wrap"><table class="supplier-table-t"><thead><tr>' +
    '<th>Risk</th><th>Supplier</th><th>Why</th><th>Where / route</th><th>Spend / yr</th></tr></thead><tbody>';
  rows.forEach(function (r) {
    var s = r.s;
    var more = r.reasons.slice(1).map(function (x) { return '<li>' + esc(x.t) + '</li>'; }).join('');
    html += '<tr>' +
      '<td><span class="supplier-table-pill supplier-table-' + r.level + '">' + r.level + '</span></td>' +
      '<td><span class="supplier-table-name">' + esc(s.supplier_name) + '</span>' +
        '<span class="supplier-table-sub">' + esc(s.parts_supplied) + '</span>' +
        '<span class="supplier-table-sub">' + r.soleCount + ' of ' + r.parts + ' part' + (r.parts === 1 ? '' : 's') + ' with no backup source</span></td>' +
      '<td>' + esc(r.reasons[0].t) + (more ? '<ul class="supplier-table-more">' + more + '</ul>' : '') + '</td>' +
      '<td>' + esc(s.factory_city) + ', ' + esc(s.factory_country) +
        '<span class="supplier-table-sub">' + (/^none/i.test(s.us_port_of_entry) ? 'Domestic, by truck' : 'Arrives via ' + esc(s.us_port_of_entry)) + ' &middot; ' + esc(s.lead_time_days) + '-day lead time &middot; ' + esc(s.on_time_delivery_pct_last_12_months) + '% on time</span></td>' +
      '<td>' + money(s.annual_spend_usd) + '</td></tr>';
  });
  html += '</tbody></table></div>' +
    '<p class="supplier-table-note">Levels so far use only our own records as of ' + fmt(asOf) +
    ' (stock on hand against the next promised delivery). Live warnings from weather and news will be able to raise them.</p>';
  box.innerHTML = html;
})();
