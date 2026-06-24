/* ──────────────────────────────────────────────────────────────
   KMITL infographic kit — reusable inline-SVG components.
   Self-contained: injects its own <style>, exposes window.KV.
   No deps, no external assets — renders offline, crisp on a projector,
   themed with the site's clay/dark CSS variables.
   Components: icon · loop · mvpLadder · radar · gauge · ribbon ·
               domainBadge · slowVsLean · pivots · vanityReal · countUp
   ────────────────────────────────────────────────────────────── */
(function () {
  // ---------- styles + animations ----------
  var css = `
  .kv{--c:var(--clay,#D97757);--c2:var(--clay2,#E5926F);--g:var(--green,#7FCFA0);--b:var(--blue,#7BA9F2);--a:var(--amber,#E6B566);--r:var(--rose,#E58A8A);--p:var(--purple,#B79CF0);--ln:var(--line,rgba(255,255,255,.1));--t2:var(--text2,#A6A39A);--t3:var(--text3,#6f6d66);--tx:var(--text,#ECE9E2)}
  .kv svg{display:block;width:100%;height:auto;overflow:visible}
  .kv-i{display:inline-block;vertical-align:-.16em}
  @keyframes kv-spin{to{transform:rotate(360deg)}}
  @keyframes kv-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.78;transform:scale(1.07)}}
  @keyframes kv-dash{to{stroke-dashoffset:0}}
  @keyframes kv-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-4px)}}
  @keyframes kv-grow{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
  .kv-spin{transform-box:fill-box;transform-origin:center;animation:kv-spin 14s linear infinite}
  .kv-node{transform-box:fill-box;transform-origin:center;animation:kv-pulse 2.6s ease-in-out infinite}
  .kv-node.n2{animation-delay:.85s}.kv-node.n3{animation-delay:1.7s}
  .kv-draw{stroke-dasharray:var(--len,600);stroke-dashoffset:var(--len,600);animation:kv-dash 1.1s ease forwards}
  .kv-pop{opacity:0;animation:kv-grow .5s ease forwards}
  .kv-float{animation:kv-float 3.4s ease-in-out infinite}
  @media (prefers-reduced-motion: reduce){.kv-spin,.kv-node,.kv-draw,.kv-float{animation:none}.kv-draw{stroke-dashoffset:0}.kv-pop{opacity:1}}
  .kv-cap{font-family:var(--mono,monospace);font-size:11px;fill:var(--t2);font-weight:700;letter-spacing:.04em}
  .kv-lab{font-family:var(--sans,sans-serif);font-weight:800;fill:var(--tx)}
  /* journey ribbon */
  .kv-ribbon{display:flex;align-items:center;gap:0;max-width:760px;margin:0 auto}
  .kv-rb{display:flex;flex-direction:column;align-items:center;gap:6px;flex:0 0 auto;text-align:center}
  .kv-rb .dot{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid var(--line,rgba(255,255,255,.12));background:var(--panel2,#16171d);font-size:18px;transition:.3s}
  .kv-rb .rl{font-size:11.5px;font-weight:700;color:var(--text3,#6f6d66)}
  .kv-rb.done .dot{border-color:var(--green,#7FCFA0);color:var(--green,#7FCFA0)}
  .kv-rb.on .dot{border-color:var(--clay,#D97757);background:var(--clay-dim,rgba(217,119,87,.13));box-shadow:0 0 0 4px rgba(217,119,87,.12)}
  .kv-rb.on .rl{color:var(--clay2,#E5926F)}
  .kv-rseg{flex:1 1 auto;height:2px;min-width:18px;background:var(--line,rgba(255,255,255,.12));position:relative;top:-9px}
  .kv-rseg.fill{background:linear-gradient(90deg,var(--green,#7FCFA0),var(--clay,#D97757))}
  `;
  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  var NS = "http://www.w3.org/2000/svg";
  function wrap(svg, cls) { return '<div class="kv ' + (cls || "") + '">' + svg + "</div>"; }
  function deg(d) { return (d - 90) * Math.PI / 180; }

  // ---------- line icons (24-grid, stroke=currentColor) ----------
  var ICONS = {
    problem: '<circle cx="12" cy="12" r="9"/><path d="M12 8v5"/><circle cx="12" cy="16.3" r=".4" fill="currentColor"/>',
    customer: '<circle cx="12" cy="8" r="3.4"/><path d="M5.5 19a6.5 6.5 0 0 1 13 0"/>',
    money: '<circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.4 9.2c0-1.2 1.2-1.8 2.6-1.8s2.6.7 2.6 1.9c0 2.6-5.2 1.4-5.2 4 0 1.3 1.2 2 2.6 2s2.6-.6 2.6-1.8"/>',
    risk: '<path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 10v4"/><circle cx="12" cy="17" r=".4" fill="currentColor"/>',
    metric: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    innovation: '<path d="M12 3a6 6 0 0 0-3 11.2V17h6v-2.8A6 6 0 0 0 12 3Z"/><path d="M9.5 20h5M10.5 22h3"/>',
    rocket: '<path d="M12 3c3 1.5 5 4.5 5 8 0 2-1 4-2.5 5.5h-5C8 15 7 13 7 11c0-3.5 2-6.5 5-8Z"/><circle cx="12" cy="10" r="1.6"/><path d="M9.5 16.5 8 20l3-1.5M14.5 16.5 16 20l-3-1.5"/>',
    pivot: '<path d="M4 7h9a4 4 0 0 1 4 4v3"/><path d="m14 5 3 2-3 2M20 12l-3 2-3-2"/>',
    build: '<path d="m14 6 4 4M3 21l3-.6L18.5 8a2 2 0 0 0-2.8-2.8L3 17.7 3 21Z"/>',
    measure: '<path d="M4 20V4M4 20h16"/><path d="M8 16l3-4 3 2 4-7"/>',
    learn: '<path d="M12 5c-2-1.4-5-1.4-7 0v12c2-1.4 5-1.4 7 0 2-1.4 5-1.4 7 0V5c-2-1.4-5-1.4-7 0Z"/><path d="M12 5v14"/>',
    search: '<circle cx="11" cy="11" r="6"/><path d="m20 20-4.3-4.3"/>',
    sparkle: '<path d="M12 3l1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6L12 3Z"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".6" fill="currentColor"/>',
    chart: '<path d="M5 4v15a1 1 0 0 0 1 1h15"/><path d="M9 15l3-4 3 2 4-6"/>',
    check: '<path d="m5 12 4.5 4.5L19 7"/>',
    flag: '<path d="M5 21V4M5 4c3-1.8 7 1.8 10 0v9c-3 1.8-7-1.8-10 0"/>',
    image: '<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.6"/><path d="m21 16-5-5L5 19"/>',
    code: '<path d="m8 9-3 3 3 3M16 9l3 3-3 3M13.5 7l-3 10"/>'
  };
  function icon(name, size, color) {
    var p = ICONS[name] || ICONS.sparkle, s = size || 22;
    return '<svg class="kv-i" width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="' + (color || "currentColor") + '" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' + p + "</svg>";
  }

  // ---------- Build → Measure → Learn loop ----------
  function loop(el) {
    var nodes = [
      { a: 0, ic: "build", lab: "Build", th: "สร้าง", col: "var(--clay)" },
      { a: 120, ic: "measure", lab: "Measure", th: "วัดผล", col: "var(--blue)" },
      { a: 240, ic: "learn", lab: "Learn", th: "เรียนรู้", col: "var(--green)" }
    ];
    var cx = 160, cy = 150, R = 96;
    var g = nodes.map(function (n, i) {
      var x = cx + R * Math.cos(deg(n.a)), y = cy + R * Math.sin(deg(n.a));
      return '<g class="kv-node n' + (i + 1) + '" style="transform-origin:' + x + 'px ' + y + 'px">' +
        '<circle cx="' + x + '" cy="' + y + '" r="34" fill="var(--panel,#1d1f28)" stroke="' + n.col + '" stroke-width="2"/>' +
        '<g transform="translate(' + (x - 11) + ',' + (y - 17) + ')" stroke="' + n.col + '">' + icon(n.ic, 22, n.col).replace(/^<svg[^>]*>/, '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="' + n.col + '" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">') + '</g>' +
        '<text x="' + x + '" y="' + (y + 26) + '" text-anchor="middle" class="kv-lab" font-size="13" fill="' + n.col + '">' + n.lab + '</text>' +
        '</g>';
    }).join("");
    // 3 curved arrows clockwise between nodes
    var arcs = "";
    for (var i = 0; i < 3; i++) {
      var a1 = deg(nodes[i].a + 26), a2 = deg(nodes[(i + 1) % 3].a - 26), rr = R;
      var x1 = cx + rr * Math.cos(a1), y1 = cy + rr * Math.sin(a1);
      var x2 = cx + rr * Math.cos(a2), y2 = cy + rr * Math.sin(a2);
      arcs += '<path d="M' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ' A' + rr + ' ' + rr + ' 0 0 1 ' + x2.toFixed(1) + ' ' + y2.toFixed(1) + '" fill="none" stroke="var(--clay)" stroke-width="2.4" marker-end="url(#kvarrow)" opacity=".85" class="kv-draw" style="--len:230"/>';
    }
    var svg = '<svg viewBox="0 0 320 300" role="img" aria-label="Build Measure Learn loop">' +
      '<defs><marker id="kvarrow" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0 0l6 3-6 3z" fill="var(--clay)"/></marker></defs>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="none" stroke="var(--line)" stroke-width="1" stroke-dasharray="3 7" class="kv-spin"/>' +
      arcs + g +
      '<text x="' + cx + '" y="' + (cy + 4) + '" text-anchor="middle" class="kv-cap" fill="var(--clay2)">↻ faster</text>' +
      '<text x="' + cx + '" y="' + (cy + 19) + '" text-anchor="middle" class="kv-cap" fill="var(--text3)">each lap</text>' +
      '</svg>';
    el.innerHTML = wrap(svg);
  }

  // ---------- MVP ladder (skateboard → car) ----------
  function mvpLadder(el, opts) {
    opts = opts || {};
    var active = opts.active || 0;
    var V = {
      board: '<g stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"><line x1="6" y1="14" x2="30" y2="14"/><circle cx="11" cy="19" r="2.5"/><circle cx="25" cy="19" r="2.5"/></g>',
      scooter: '<g stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="3"/><circle cx="27" cy="20" r="3"/><path d="M9 20 24 7h4M24 7v13"/></g>',
      bike: '<g stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="4.5"/><circle cx="27" cy="20" r="4.5"/><path d="M9 20l6-9h7l-5 9M15 11h-3M22 11l5 9"/></g>',
      car: '<g stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18v-3l4-1 3-4h9l4 5 4 1v3"/><circle cx="11" cy="19" r="2.6"/><circle cx="25" cy="19" r="2.6"/></g>'
    };
    var steps = [
      { v: "board", n: "L1", lab: "Demand test", th: "ทดสอบความต้องการ", col: "var(--green)" },
      { v: "scooter", n: "L2", lab: "Prototype", th: "โปรโตไทป์", col: "var(--green)" },
      { v: "bike", n: "L3", lab: "Functional", th: "ใช้งานได้", col: "var(--amber)" },
      { v: "car", n: "L4", lab: "Marketable", th: "ขายได้", col: "var(--clay2)" }
    ];
    var W = 600, n = steps.length, cw = W / n, pad = 8, baseY = 190;
    var cells = steps.map(function (s, i) {
      var ch = 86 + i * 24, vy = baseY - ch, cxc = i * cw + cw / 2, on = (active === i + 1);
      var sc = 0.85 + i * 0.2, vcx = cxc, vcy = baseY - 48;
      return '<g class="kv-pop" style="animation-delay:' + (i * 0.1) + 's">' +
        '<rect x="' + (i * cw + pad) + '" y="' + vy + '" width="' + (cw - pad * 2) + '" height="' + ch + '" rx="14" fill="' + (on ? "var(--clay-dim,rgba(217,119,87,.13))" : "var(--panel,#1d1f28)") + '" stroke="' + (on ? "var(--clay)" : "var(--line)") + '" stroke-width="' + (on ? 2 : 1) + '"/>' +
        '<text x="' + cxc + '" y="' + (vy + 20) + '" text-anchor="middle" class="kv-cap" fill="var(--text3)">' + s.n + '</text>' +
        '<g transform="translate(' + (vcx - 16 * sc).toFixed(1) + ',' + (vcy - 16 * sc).toFixed(1) + ') scale(' + sc.toFixed(2) + ')" stroke="' + s.col + '"><g class="kv-float" style="animation-delay:' + (i * 0.3) + 's">' + V[s.v] + '</g></g>' +
        '<text x="' + cxc + '" y="' + (baseY - 12) + '" text-anchor="middle" class="kv-lab" font-size="13" fill="' + s.col + '">' + s.lab + '</text>' +
        '</g>';
    }).join("");
    var arrow = '<path d="M' + pad + ' ' + (baseY + 18) + ' H' + (W - pad) + '" stroke="var(--line)" stroke-width="2" marker-end="url(#kvarrow2)"/>' +
      '<text x="' + pad + '" y="' + (baseY + 36) + '" class="kv-cap" fill="var(--text3)">smaller · faster</text>' +
      '<text x="' + (W - pad) + '" y="' + (baseY + 36) + '" text-anchor="end" class="kv-cap" fill="var(--clay2)">bigger · later</text>';
    var svg = '<svg viewBox="0 0 ' + W + ' 244" role="img" aria-label="MVP levels from demand test to marketable">' +
      '<defs><marker id="kvarrow2" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto"><path d="M0 0l6 3-6 3z" fill="var(--line)"/></marker></defs>' +
      cells + arrow + "</svg>";
    el.innerHTML = wrap(svg);
  }

  // ---------- rubric radar (6 axes, values 0..max) ----------
  function radar(el, values, opts) {
    opts = opts || {};
    var max = opts.max || 3;
    var axes = opts.axes || [
      { k: "problem", en: "Problem", th: "ปัญหา" },
      { k: "customer", en: "Customer", th: "ลูกค้า" },
      { k: "innovation", en: "Innovation", th: "นวัตกรรม" },
      { k: "mvp", en: "MVP", th: "MVP" },
      { k: "assumption", en: "Assumption", th: "สมมติฐาน" },
      { k: "evidence", en: "Evidence", th: "หลักฐาน" }
    ];
    var cx = 150, cy = 142, R = 96, N = axes.length;
    function pt(i, r) { var a = deg(i * (360 / N)); return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; }
    var rings = "";
    for (var lv = 1; lv <= max; lv++) {
      var pts = axes.map(function (_, i) { return pt(i, R * lv / max).map(function (v) { return v.toFixed(1); }).join(","); }).join(" ");
      rings += '<polygon points="' + pts + '" fill="none" stroke="var(--line)" stroke-width="1" opacity="' + (lv === max ? .9 : .5) + '"/>';
    }
    var spokes = axes.map(function (_, i) { var p = pt(i, R); return '<line x1="' + cx + '" y1="' + cy + '" x2="' + p[0].toFixed(1) + '" y2="' + p[1].toFixed(1) + '" stroke="var(--line)" stroke-width="1" opacity=".55"/>'; }).join("");
    var labels = axes.map(function (ax, i) {
      var p = pt(i, R + 22), anchor = Math.abs(p[0] - cx) < 8 ? "middle" : (p[0] > cx ? "start" : "end");
      var v = Math.max(0, Math.min(max, (values && values[ax.k]) || 0));
      return '<text x="' + p[0].toFixed(1) + '" y="' + (p[1] + 4).toFixed(1) + '" text-anchor="' + anchor + '" class="kv-lab" font-size="11.5" fill="var(--text2)">' + ax.en + '</text>';
    }).join("");
    var dataPts = axes.map(function (ax, i) { var v = Math.max(0, Math.min(max, (values && values[ax.k]) || 0)); return pt(i, R * v / max).map(function (x) { return x.toFixed(1); }).join(","); }).join(" ");
    var dots = axes.map(function (ax, i) { var v = Math.max(0, Math.min(max, (values && values[ax.k]) || 0)); var p = pt(i, R * v / max); return '<circle cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="3.2" fill="var(--clay2)"/>'; }).join("");
    var svg = '<svg viewBox="0 0 300 300" role="img" aria-label="Idea strength radar">' +
      rings + spokes +
      '<polygon points="' + dataPts + '" fill="var(--clay)" fill-opacity=".22" stroke="var(--clay)" stroke-width="2" style="transition:all .5s ease"/>' +
      dots + labels + "</svg>";
    el.innerHTML = wrap(svg);
  }

  // ---------- tier gauge (0..100) ----------
  function gauge(el, pct) {
    pct = Math.max(0, Math.min(100, pct || 0));
    var col = pct >= 80 ? "var(--green)" : pct >= 60 ? "var(--clay2)" : pct >= 40 ? "var(--amber)" : "var(--rose)";
    var cx = 110, cy = 108, R = 86;
    function arc(frac) { var a = Math.PI - Math.PI * frac; return [cx + R * Math.cos(a), cy - R * Math.sin(a)]; }
    var s = arc(0), e = arc(pct / 100), big = pct / 100 > .5 ? 1 : 0;
    var bg = 'M' + (cx - R) + ' ' + cy + ' A' + R + ' ' + R + ' 0 0 1 ' + (cx + R) + ' ' + cy;
    var val = 'M' + s[0].toFixed(1) + ' ' + s[1].toFixed(1) + ' A' + R + ' ' + R + ' 0 ' + big + ' 1 ' + e[0].toFixed(1) + ' ' + e[1].toFixed(1);
    var svg = '<svg viewBox="0 0 220 132" role="img" aria-label="Score gauge">' +
      '<path d="' + bg + '" fill="none" stroke="var(--panel2,#16171d)" stroke-width="14" stroke-linecap="round"/>' +
      '<path d="' + val + '" fill="none" stroke="' + col + '" stroke-width="14" stroke-linecap="round" style="transition:all .55s ease"/>' +
      '<text x="' + cx + '" y="' + (cy - 6) + '" text-anchor="middle" font-family="var(--sans)" font-weight="800" font-size="40" fill="var(--text)">' + Math.round(pct) + '</text>' +
      '<text x="' + cx + '" y="' + (cy + 14) + '" text-anchor="middle" class="kv-cap" fill="var(--text3)">/ 100</text>' +
      '</svg>';
    el.innerHTML = wrap(svg);
  }

  // ---------- journey ribbon ----------
  function ribbon(el, active) {
    var steps = [
      { id: "learn", en: "Learn", th: "เรียน", ic: "📚" },
      { id: "lab", en: "Idea Lab", th: "แล็บ", ic: "🧪" },
      { id: "submit", en: "Submit", th: "ส่งงาน", ic: "📤" },
      { id: "present", en: "Present", th: "พรีเซนต์", ic: "🗳️" }
    ];
    var ai = steps.map(function (s) { return s.id; }).indexOf(active);
    var html = "";
    steps.forEach(function (s, i) {
      var cls = i < ai ? "done" : i === ai ? "on" : "";
      html += '<div class="kv-rb ' + cls + '"><div class="dot">' + (i < ai ? "✓" : s.ic) + '</div><div class="rl"><span class="bi inl"><span class="en">' + s.en + '</span><span class="th">' + s.th + "</span></span></div></div>";
      if (i < steps.length - 1) html += '<div class="kv-rseg ' + (i < ai ? "fill" : "") + '"></div>';
    });
    el.className = (el.className + " kv kv-ribbon").trim();
    el.innerHTML = html;
  }

  // ---------- domain badge (returns svg string) ----------
  var DOMAIN = {
    agri: { c: "var(--green)", p: '<path d="M16 26c0-6 4-10 9-11-1 6-4 10-9 11ZM16 26c0-6-4-10-9-11 1 6 4 10 9 11ZM16 26V14"/>' },
    health: { c: "var(--rose)", p: '<path d="M6 16h5l2-5 4 10 2-5h7"/>' },
    climate: { c: "var(--blue)", p: '<circle cx="16" cy="16" r="5"/><path d="M16 5v3M16 24v3M5 16h3M24 16h3M8.5 8.5l2 2M21.5 21.5l2 2M23.5 8.5l-2 2M8.5 23.5l2-2"/>' },
    industry: { c: "var(--amber)", p: '<path d="M8 24V14l6 4V14l6 4 .8-7H23l1 13Z"/>' },
    software: { c: "var(--purple)", p: '<path d="M12 11 7 16l5 5M20 11l5 5-5 5M17.5 9l-3 14"/>' }
  };
  function domainBadge(group, size) {
    var d = DOMAIN[group] || DOMAIN.software, s = size || 34;
    return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 32 32" fill="none" stroke="' + d.c + '" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="kv-i"><circle cx="16" cy="16" r="15" stroke="' + d.c + '" stroke-opacity=".3" stroke-width="1"/>' + d.p + "</svg>";
  }

  // ---------- slow vs lean timeline ----------
  function slowVsLean(el) {
    var svg = '<svg viewBox="0 0 600 150" role="img" aria-label="Slow vs lean timeline">' +
      // slow: one long bar -> skull
      '<text x="6" y="34" class="kv-cap" fill="var(--rose)">THE SLOW WAY</text>' +
      '<rect x="6" y="42" width="520" height="22" rx="11" fill="var(--rose-dim,rgba(229,138,138,.13))" stroke="var(--rose)" stroke-width="1.5"/>' +
      '<text x="266" y="57" text-anchor="middle" font-size="12" font-weight="700" fill="var(--rose)">build in secret · 6 months</text>' +
      '<text x="556" y="60" font-size="22">💀</text>' +
      // lean: small loops
      '<text x="6" y="100" class="kv-cap" fill="var(--green)">THE LEAN WAY</text>';
    var x = 6;
    for (var i = 0; i < 6; i++) {
      svg += '<g class="kv-pop" style="animation-delay:' + (i * .1) + 's"><rect x="' + x + '" y="108" width="64" height="22" rx="11" fill="var(--green-dim,rgba(127,207,160,.13))" stroke="var(--green)" stroke-width="1.5"/><text x="' + (x + 32) + '" y="123" text-anchor="middle" font-size="14">🔁</text></g>';
      x += 74;
    }
    svg += '<text x="' + (x + 4) + '" y="124" font-size="20">🚀</text></svg>';
    el.innerHTML = wrap(svg);
  }

  // ---------- pivot diagrams ----------
  function pivots(el) {
    var items = [
      { ic: "👤", en: "Customer pivot", th: "เปลี่ยนลูกค้า", d: "same product, new buyer", dt: "ของเดิม คนซื้อใหม่" },
      { ic: "🎯", en: "Problem pivot", th: "เปลี่ยนปัญหา", d: "same customer, new pain", dt: "ลูกค้าเดิม ปัญหาใหม่" },
      { ic: "💰", en: "Model pivot", th: "เปลี่ยนโมเดล", d: "same value, new way to earn", dt: "คุณค่าเดิม วิธีหาเงินใหม่" }
    ];
    var html = '<div style="display:flex;gap:12px;flex-wrap:wrap;justify-content:center">' + items.map(function (it, i) {
      return '<div class="kv-pop" style="animation-delay:' + (i * .1) + 's;flex:1;min-width:150px;border:1px solid var(--line);border-radius:14px;padding:14px;background:var(--panel-soft,#21242e);text-align:center">' +
        '<div style="font-size:26px">' + it.ic + '</div>' +
        '<svg viewBox="0 0 60 20" style="width:64px;height:20px;margin:4px auto"><path d="M6 6h34a6 6 0 0 1 6 6v2" fill="none" stroke="var(--clay)" stroke-width="2" stroke-linecap="round"/><path d="M42 2l5 4-5 4" fill="none" stroke="var(--clay)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
        '<div style="font-weight:800;font-size:14px" class="bi inl"><span class="en">' + it.en + '</span><span class="th">' + it.th + '</span></div>' +
        '<div style="font-size:12px;color:var(--text2)" class="bi"><span class="en">' + it.d + '</span><span class="th">' + it.dt + '</span></div></div>';
    }).join("") + "</div>";
    el.innerHTML = '<div class="kv">' + html + "</div>";
  }

  // ---------- animated count up ----------
  function countUp(el, to, opts) {
    opts = opts || {}; var dur = opts.dur || 1100, dp = opts.decimals || 0, suf = opts.suffix || "", pre = opts.prefix || "";
    var t0 = null;
    function step(ts) {
      if (!t0) t0 = ts; var p = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + (to * e).toFixed(dp) + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // reveal on scroll helper
  function reveal(root) {
    var els = [].slice.call((root || document).querySelectorAll("[data-kv-reveal]"));
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (ents) { ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }); }, { threshold: .2 });
    els.forEach(function (e) { io.observe(e); });
  }

  window.KV = {
    icon: icon, loop: loop, mvpLadder: mvpLadder, radar: radar, gauge: gauge,
    ribbon: ribbon, domainBadge: domainBadge, slowVsLean: slowVsLean, pivots: pivots,
    countUp: countUp, reveal: reveal
  };
})();
