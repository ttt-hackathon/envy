// Risk levels: combines our own stock records with the storm and news findings,
// gives each supplier one final level and the reasons, and explains the rules.
// Needs window.LAUREL_RIDGE, the supplier table (sections/supplier-table.js), and optionally
// window.LR_WEATHER and window.LR_NEWS. Fills <div id="risk"> on index.html.
// If any piece is missing it still loads without errors.
(function () {
  var DAY = 86400000;
  var D = window.LAUREL_RIDGE;
  var stock = window.LR_STOCK_STATUS;
  if (!D || !stock) { return; }

  var rank = { GREEN: 0, YELLOW: 1, AMBER: 2, RED: 3 };
  function toTime(s) { return Date.parse(s + 'T00:00:00Z'); }
  function fmt(t) { return new Date(t).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' }); }
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function supplier(id) { return D.suppliers.filter(function (s) { return s.supplier_id === id; })[0]; }

  var asOf = toTime(D.asOf);
  var final = {};
  D.suppliers.forEach(function (s) {
    var st = stock[s.supplier_id] || { level: 'GREEN', reasons: [] };
    final[s.supplier_id] = {
      level: st.level,
      reasons: st.reasons.filter(function (r) { return r.r > 0; }).slice(),
      fromWarnings: false
    };
  });
  function bump(id, level, reason) {
    var f = final[id];
    if (!f) { return; }
    if (rank[level] > rank[f.level]) { f.level = level; }
    f.reasons.push(reason);
    f.fromWarnings = true;
  }

  // 1. Day-by-day stock check for each part, using every open order (not just the first).
  var stockoutNotes = {};
  D.parts.forEach(function (p) {
    var inv = D.inventory.filter(function (i) { return i.part_number === p.part_number; })[0];
    if (!inv) { return; }
    var arrivals = D.openOrders.filter(function (o) { return o.part_number === p.part_number && toTime(o.promised_arrival_date) >= asOf; });
    if (!arrivals.length) { return; }
    var last = Math.max.apply(null, arrivals.map(function (o) { return toTime(o.promised_arrival_date); }));
    var perDay = Number(inv.weekly_usage_units) / 7;
    var safety = Number(inv.safety_stock_units);
    var onHand = Number(inv.on_hand_units);
    var below = false, breaches = [], out = null;
    for (var t = asOf + DAY; t <= last; t += DAY) {
      onHand -= perDay;
      if (onHand < 0.5 && out === null) { out = t; }
      if (onHand < safety && !below) { breaches.push(t); below = true; }
      if (onHand >= safety) { below = false; }
      arrivals.forEach(function (o) { if (toTime(o.promised_arrival_date) === t) { onHand += Number(o.quantity); } });
      if (onHand >= safety) { below = false; }
    }
    var existing = stock[p.supplier_id].reasons.some(function (r) { return r.t.indexOf(p.description + ':') === 0 && r.r >= 2; });
    if (out !== null && !existing) {
      bump(p.supplier_id, 'AMBER', { r: 2, t: p.description + ': stock runs out about ' + fmt(out) + ' before a later delivery lands.' });
    } else if (out === null && breaches.length && !stock[p.supplier_id].reasons.some(function (r) { return r.t.indexOf(p.description + ':') === 0; })) {
      stockoutNotes[p.supplier_id] = true;
      bump(p.supplier_id, 'YELLOW', { r: 1, t: p.description + ': stock dips below the ' + safety + '-unit safety level about ' +
        breaches.slice(0, 2).map(fmt).join(' and ') + ' while waiting for deliveries.' });
    }
  });
  // The note above is not a warning from outside, so don't label it as one.
  Object.keys(stockoutNotes).forEach(function (id) { final[id].fromWarnings = false; });

  // 2. Findings from storm and news checks.
  var W = window.LR_WEATHER, N = window.LR_NEWS;
  function addSignals(items, source) {
    (items || []).forEach(function (a) {
      (a.raises || []).forEach(function (rz) {
        // A news report alone can make a supplier amber at most; only an official source can make it red.
        var level = (a.confidence !== 'official' && rz.level === 'RED') ? 'AMBER' : rz.level;
        var text = 'Warning: ' + a.title + '.';
        bump(rz.supplier, level, { r: level === 'RED' ? 3.5 : level === 'AMBER' ? 2.5 : 1.5, t: text, src: source });
      });
    });
  }
  if (W) { addSignals(W.alerts, 'weather'); }
  if (N) { addSignals(N.attention, 'news'); }

  Object.keys(final).forEach(function (id) {
    final[id].reasons.sort(function (a, b) { return b.r - a.r; });
    if (!final[id].reasons.length) {
      final[id].reasons.push({ r: 0, t: 'Stock covers us until the next delivery lands, and no warnings found.' });
    }
  });

  // Share it, and ask the supplier table and summary bar to redraw.
  window.LR_RISK_FINAL = final;
  if (typeof window.LR_REFRESH_SUPPLIER_TABLE === 'function') { window.LR_REFRESH_SUPPLIER_TABLE(); }

  var box = document.getElementById('risk');
  if (!box) { return; }

  // ---- Draw the section ----
  var css = '' +
    '.risk-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;margin-bottom:6px}' +
    '.risk-rule{border:1px solid #ddd8cc;border-radius:10px;padding:10px 12px;background:#fcfbf8;font-size:14px}' +
    '.risk-rule p{margin:4px 0 0}' +
    '.risk-pill{display:inline-block;font-size:12px;font-weight:700;letter-spacing:.04em;padding:2px 9px;border-radius:999px;border:1px solid}' +
    '.risk-RED{background:#fde8e6;color:#9b1c10;border-color:#e8a29b}' +
    '.risk-AMBER{background:#fff0d6;color:#8a4b00;border-color:#e8b56a}' +
    '.risk-YELLOW{background:#fbf6c8;color:#6b5d00;border-color:#d9cc5c}' +
    '.risk-GREEN{background:#e6f0ea;color:#1f5a3f;border-color:#a9cdb8}' +
    '.risk-h3{font-size:16px;margin:20px 0 8px}' +
    '.risk-list{margin:0;padding-left:20px;font-size:14px}' +
    '.risk-list li{margin-bottom:6px}' +
    '.risk-meta{font-size:13px;color:#5b6b62}' +
    '.risk-bars{font-size:14px}' +
    '.risk-bar{display:flex;align-items:center;gap:10px;margin:5px 0}' +
    '.risk-bar span.l{flex:0 0 190px}' +
    '.risk-bar span.t{flex:1;background:#ece9e1;border-radius:6px;height:14px;overflow:hidden}' +
    '.risk-bar span.f{display:block;height:100%;background:#2f6b4f}' +
    '.risk-bar span.v{flex:0 0 120px;text-align:right}' +
    '.risk-note{font-size:13px;color:#5b6b62;margin:12px 0 0}';
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var html = '<div class="risk-grid">' +
    '<div class="risk-rule"><span class="risk-pill risk-RED">RED</span><p>A confirmed event at a supplier\'s site, port or route, <strong>and</strong> the part has no backup source or already has a stock gap. Any serious confirmed event at Cataloochee is automatically red. <strong>Call the supplier today</strong>, ask for order status and expediting, and tell production which models are at risk.</p></div>' +
    '<div class="risk-rule"><span class="risk-pill risk-AMBER">AMBER</span><p>A credible but unconfirmed warning, a confirmed event with 8+ weeks of cover, or our own records show stock running out before the next delivery. <strong>Check order status within 48 hours</strong> and consider ordering earlier.</p></div>' +
    '<div class="risk-rule"><span class="risk-pill risk-YELLOW">YELLOW</span><p>Early signs: a thin margin, stock dipping below the safety level, a slow supplier with no backup, or a single news report. <strong>Watch only.</strong></p></div>' +
    '<div class="risk-rule"><span class="risk-pill risk-GREEN">GREEN</span><p>Stock covers the wait and no warnings found.</p></div></div>' +
    '<p class="risk-note">The final level is the highest of what our own records say and what the storm and news checks found. A single news report can only make a supplier yellow or amber, never red.</p>';

  // This week's priorities
  var ranked = D.suppliers.map(function (s) {
    return { s: s, f: final[s.supplier_id] };
  }).filter(function (x) { return rank[x.f.level] >= 2; })
    .sort(function (a, b) { return rank[b.f.level] - rank[a.f.level] || b.f.reasons[0].r - a.f.reasons[0].r; });

  html += '<h3 class="risk-h3">Where to act first</h3>';
  if (!ranked.length) {
    html += '<p>No supplier is amber or red.</p>';
  } else {
    html += '<ol class="risk-list">';
    ranked.forEach(function (x) {
      var action = 'Ask ' + x.s.supplier_name + ' to confirm the next delivery date and whether it can ship earlier or by air.';
      if (N) {
        N.attention.forEach(function (a) {
          if (a.suppliers.indexOf(x.s.supplier_id) !== -1 && a.level === x.f.level && a.todo && a.todo.length && a.suppliers[0] === x.s.supplier_id) {
            action = a.todo[0];
          }
        });
      }
      html += '<li><span class="risk-pill risk-' + x.f.level + '">' + x.f.level + '</span> <strong>' + esc(x.s.supplier_name) + '.</strong> ' +
        esc(x.f.reasons[0].t) + '<br><span class="risk-meta">Next step: ' + esc(action) + '</span></li>';
    });
    html += '</ol>';
  }

  // One step from red
  var gapPlus = ranked.filter(function (x) {
    var st = stock[x.s.supplier_id];
    return st && st.level === 'AMBER';
  });
  html += '<h3 class="risk-h3">What would turn something red</h3><ul class="risk-list">';
  if (N) {
    N.attention.forEach(function (a) {
      if (a.escalatesTo) {
        html += '<li><strong>' + esc(supplier(a.suppliers[0]).supplier_name) + ':</strong> red if ' + esc(a.escalatesWhen) + '.</li>';
      }
    });
  }
  if (gapPlus.length) {
    html += '<li><strong>' + esc(gapPlus.map(function (x) { return x.s.supplier_name; }).join(', ')) +
      ':</strong> each already has a stock gap and no backup source, so any confirmed event at the supplier, its port or its route makes it red.</li>';
  }
  html += '<li><strong>Cataloochee Cell Works:</strong> any serious confirmed event is red at once, because it is our only battery source and every bike needs one.</li></ul>';

  // Where the money and the risk are concentrated
  var total = D.suppliers.reduce(function (n, s) { return n + Number(s.annual_spend_usd); }, 0);
  function share(test) {
    var v = D.suppliers.filter(test).reduce(function (n, s) { return n + Number(s.annual_spend_usd); }, 0);
    return { v: v, pct: Math.round(v / total * 100) };
  }
  var bars = [
    ['Arrives through Savannah', share(function (s) { return /Savannah/.test(s.us_port_of_entry); })],
    ['Arrives through Charleston', share(function (s) { return /Charleston/.test(s.us_port_of_entry); })],
    ['Made in Taiwan', share(function (s) { return s.factory_country === 'Taiwan'; })],
    ['Domestic (truck)', share(function (s) { return /^none/i.test(s.us_port_of_entry); })]
  ];
  html += '<h3 class="risk-h3">How much rides on one place</h3><div class="risk-bars">';
  bars.forEach(function (b) {
    html += '<div class="risk-bar"><span class="l">' + b[0] + '</span><span class="t"><span class="f" style="width:' + b[1].pct + '%"></span></span>' +
      '<span class="v">' + b[1].pct + '% of spend</span></div>';
  });
  html += '</div><p class="risk-meta">Share of our $' + (total / 1e6).toFixed(1) + 'M yearly supplier spend. A problem at Savannah or in Taiwan touches every bike model.</p>';

  html += '<p class="risk-note">Storm and quake checks found nothing current, so today\'s levels come from our own stock records plus the news findings. ' +
    'Levels are as of ' + fmt(asOf) + ' for stock and ' + (N ? fmt(toTime(N.checkedAt)) : 'n/a') + ' for news.</p>';
  box.innerHTML = html;
})();
