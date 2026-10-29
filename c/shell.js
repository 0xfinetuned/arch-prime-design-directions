/* Arch Prime — Direction C, "Instrument". Shell, components, charts and motion. */
(function () {
  const AP = window.AP;
  const Q = new URLSearchParams(location.search);
  const STILL = Q.has("still");
  document.documentElement.classList.toggle("still", STILL);

  /* Theme: ?theme= forces (not persisted), else the saved choice, else light. */
  const THEME_KEY = "ap-c-theme";
  const store = { get() { try { return localStorage.getItem(THEME_KEY); } catch { return null; } }, set(v) { try { localStorage.setItem(THEME_KEY, v); } catch {} } };
  const valid = (t) => t === "light" || t === "dark";
  let theme = valid(Q.get("theme")) ? Q.get("theme") : valid(store.get()) ? store.get() : "light";
  document.documentElement.dataset.theme = theme;
  function setTheme(t) {
    theme = t;
    document.documentElement.dataset.theme = t;
    store.set(t);
    const b = document.getElementById("themeToggle");
    if (!b) return;
    b.querySelector(".lbl").textContent = t === "dark" ? "Dark mode" : "Light mode";
    b.querySelector(".switch").classList.toggle("on", t === "dark");
    b.setAttribute("aria-label", t === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }

  /* ───────── Icons: 1.5px lines on a 20px grid, one pixel-square accent each ───────── */
  const ICONS = {
    home:     { d: "M3.75 8.75 10 3.5l6.25 5.25v7.75H3.75Z M8 16.5v-4.25h4v4.25", px: [9, 6.5] },
    yield:    { d: "M4 16.5v-3.5 M8 16.5v-6 M12 16.5v-8.5 M16 16.5V8", px: [15, 3.5] },
    lend:     { d: "M3 7.75 10 3.75l7 4Z M5.5 10v4.5 M10 10v4.5 M14.5 10v4.5 M3 16.75h14", px: [9, 5.75] },
    trade:    { d: "M3.5 6.75h12 M12.5 3.75l3 3-3 3 M13.5 13.25h-9 M7.5 10.25l-3 3 3 3", px: [15.25, 12.25] },
    points:   { d: "M14.5 7.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z M7.25 11.75l-1 5 3.75-1.75 3.75 1.75-1-5", px: [9, 6.75] },
    docs:     { d: "M5 2.75h6.5l3.5 3.5v11H5Z M11.5 2.75v3.5H15 M7.5 9.5h5 M7.5 12.25h5", px: [7.5, 14.25] },
    deposit:  { d: "M10 2.75v8.5 M6.75 8 10 11.25 13.25 8 M3.5 12v4.5h13V12", px: [9, 13.5] },
    withdraw: { d: "M10 12.25v-8.5 M6.75 7 10 3.75 13.25 7 M3.5 12v4.5h13V12", px: [15.5, 2] },
    transfer: { d: "M6 10h9 M11.75 6.75 15 10l-3.25 3.25 M17.25 4.5v11", px: [2.5, 9] },
    move:     { d: "M3 3.75h6v4.5H3Z M11 11.75h6v4.5h-6Z M6 8.25V14h3.25 M8 12.5 9.5 14 8 15.5", px: [13, 13] },
    share:    { d: "M7 7.5H4.75v9h10.5v-9H13 M10 12.25V3 M7 6l3-3 3 3", px: [9, 13.25] },
    copy:     { d: "M7 7h9.25v9.25H7Z M13 7V3.75H3.75V13H7", px: [10.75, 10.75] },
    external: { d: "M15.5 11v5.25H3.75V4.5H9 M11.5 3.75h4.75V8.5 M16.25 3.75 9.5 10.5", px: [6, 12.5] },
    search:   { d: "M14 8.75a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z M12.5 12.5l4.25 4.25", px: [7.75, 7.75] },
    chevron:  { d: "M7.5 4.5 13 10l-5.5 5.5", px: [14.5, 9] },
    theme:    { d: "M16 10a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z M10 4v12 M10 7h3.25 M10 10h4.5 M10 13h3.25", px: [5.75, 9] },
    collapse: { d: "M3 3.75h14v12.5H3Z M7.5 3.75v12.5 M13 7.5 10.5 10l2.5 2.5", px: [4.25, 5.5] },
    close:    { d: "M5 5l10 10 M15 5 5 15", px: [9, 9] },
    swap:     { d: "M7 16.5V5.5 M4 8.5l3-3 3 3 M13 3.5v11 M10 11.5l3 3 3-3", px: [6, 2.25] },
    columns:  { d: "M3.5 6h1.5 M9 6h7.5 M3.5 14h7.75 M14.75 14h1.75 M9 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z", px: [12, 13] },
    caret:    { d: "M6.5 8.25 10 11.75l3.5-3.5" },
    arrow:    { d: "M3.75 10h11.5 M11 5.75 15.25 10 11 14.25" },
    plus:     { d: "M10 4.5v11 M4.5 10h11" },
    check:    { d: "M4.5 10.25 8.25 14l7.25-7.5" },
    info:     { d: "M16.5 10a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z M10 9v4.75 M10 6.25v1.5" },
  };
  function icon(name, cls = "") {
    const g = ICONS[name];
    const px = g.px ? `<rect class="px" x="${g.px[0]}" y="${g.px[1]}" width="2" height="2"/>` : "";
    return `<svg class="ico ${cls}" viewBox="0 0 20 20" aria-hidden="true"><path d="${g.d}"/>${px}</svg>`;
  }

  /* ───────── Asset marks: round, ink or paper, prime marks carry the lit pixel ───────── */
  const GLYPH = {
    btc: "M10.5 9.5h2 M10.5 23h2 M12.5 9.5V23 M12.5 9.5h4.75a3.25 3.25 0 0 1 0 6.5H12.5 M12.5 16h5.5a3.5 3.5 0 0 1 0 7h-5.5 M14.5 7v2.5 M17 7v2.5 M14.5 23v2.5 M17 23v2.5",
    usd: "M20 11.6c-.6-1.3-2-2.1-4-2.1-2.4 0-4 1.2-4 3.1 0 4.4 8.3 2.4 8.3 7 0 1.9-1.8 3.1-4.3 3.1-2.2 0-3.7-.9-4.3-2.4 M16 6.75v2.75 M16 22.7v2.55",
  };
  function mark(sym, size = 32) {
    const btc = /BTC/.test(sym), prime = /^prime/.test(sym);
    const v = btc ? "btc" : "usd";
    const ring = btc ? "" : `<circle cx="16" cy="16" r="15.5" fill="none" style="stroke:var(--mk-ring)"/>`;
    const px = prime ? `<rect x="22.5" y="5.5" width="4" height="4" style="fill:var(--orange)"/>` : "";
    return `<svg class="mark" width="${size}" height="${size}" viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="16" style="fill:var(--mk-${v}-bg)"/>${ring}<path d="${GLYPH[v]}" fill="none" style="stroke:var(--mk-${v}-fg)" stroke-width="1.6"/>${px}</svg>`;
  }

  /* Account tile: a 3×3 pixel signature on ink */
  function tile(name, size = 28) {
    let h = 0; for (const c of name) h = (h * 31 + c.charCodeAt(0)) >>> 0;
    let cells = "";
    const lit = [];
    for (let k = 0; k < 9; k++) lit.push(((h >> k) & 1) || k === 4);
    const orange = h % 9;
    for (let k = 0; k < 9; k++) {
      const x = 8 + (k % 3) * 4.5, y = 8 + Math.floor(k / 3) * 4.5;
      const fill = k === orange ? "var(--orange)" : lit[k] ? "var(--tl-on)" : "var(--tl-off)";
      cells += `<rect x="${x}" y="${y}" width="3.5" height="3.5" style="fill:${fill}"/>`;
    }
    return `<svg width="${size}" height="${size}" viewBox="0 0 28 28" aria-hidden="true"><rect width="28" height="28" rx="8" style="fill:var(--tl-bg)"/>${cells}</svg>`;
  }

  function logo() {
    return `<svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true"><rect width="28" height="28" rx="8" style="fill:var(--solid)"/><path d="M8.25 20.25 12.4 11.5 M15.6 11.5l4.15 8.75" style="stroke:var(--on-solid)" stroke-width="2.25" fill="none"/><rect x="12.4" y="7.6" width="3.2" height="3.2" style="fill:var(--orange)"/></svg>`;
  }

  /* ───────── Components ───────── */
  function btn(label, o = {}) {
    const kind = o.kind || "sec";
    const cls = ["btn", `btn-${kind}`, o.sm && "sm", o.lg && "lg", o.block && "block", o.iconOnly && "btn-icon", o.cls].filter(Boolean).join(" ");
    const ic = o.icon ? icon(o.icon) : "";
    const arr = o.arrow ? icon("arrow", "arr") : "";
    const tag = o.href ? "a" : "button";
    const attrs = `${o.href ? `href="${o.href}"` : ""} ${o.disabled ? "disabled" : ""} ${o.title ? `title="${o.title}"` : ""} ${o.iconOnly ? `aria-label="${label}"` : ""}`;
    return `<${tag} class="${cls}" ${attrs}>${ic}${o.iconOnly ? "" : `<span>${label}</span>`}${arr}</${tag}>`;
  }
  function seg(items, active, o = {}) {
    return `<div class="seg ${o.lg ? "lg" : ""}" role="tablist" ${o.label ? `aria-label="${o.label}"` : ""}><i class="thumb"></i>${items.map((t) => `<button role="tab" class="${t === active ? "on" : ""}">${t}</button>`).join("")}</div>`;
  }
  function tabs(items, active, o = {}) {
    return `<div class="tabs" role="tablist"><i class="thumb"></i>${items.map((t) => {
      const soon = / · soon$/.test(t);
      const lab = t.replace(/ · soon$/, "");
      return `<button role="tab" class="${t === active ? "on" : ""}" ${soon ? "disabled" : ""}>${lab}${soon ? ` <span class="badge soon">soon</span>` : ""}</button>`;
    }).join("")}</div>`;
  }
  const HEALTH = { Healthy: "ok", Watch: "watch", "At risk": "risk" };
  function badge(text, kind) {
    kind = kind || HEALTH[text] || "neutral";
    const dot = ["ok", "watch", "risk"].includes(kind) ? "<i></i>" : "";
    return `<span class="badge ${kind}">${dot}${text}</span>`;
  }
  function tip(text) { return `<span title="${text.replace(/"/g, "&quot;")}">${icon("info", "tip")}</span>`; }

  function spark(series, o = {}) {
    const w = o.w || 96, h = o.h || 28, pad = 3;
    const lo = Math.min(...series), hi = Math.max(...series), span = hi - lo || 1;
    const pts = series.map((v, i) => [pad + (w - pad * 2) * i / (series.length - 1), pad + (h - pad * 2) * (1 - (v - lo) / span)]);
    const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(2)} ${p[1].toFixed(2)}`).join(" ");
    const e = pts[pts.length - 1];
    const sz = o.marker || 4;
    return `<svg class="spark ${o.lit ? "lit" : ""}" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true"><path class="ln draw" pathLength="1" d="${d}"/><rect class="end fade-in" x="${(e[0] - sz / 2).toFixed(2)}" y="${(e[1] - sz / 2).toFixed(2)}" width="${sz}" height="${sz}"/></svg>`;
  }

  /* Health dial: 41 ticks over a half circle; lit to the score, the leading tick orange */
  function gauge(score, word, o = {}) {
    const R = o.r || 84, len = o.len || 11, n = 40;
    const W = R * 2 + 8, H = R + 6, cx = W / 2, cy = R + 4;
    const lit = Math.round(score / 100 * n);
    let ticks = "";
    for (let k = 0; k <= n; k++) {
      const a = Math.PI - Math.PI * k / n;
      const isTip = k === lit;
      const r1 = R, r0 = R - len - (isTip ? 6 : 0);
      const x0 = cx + r0 * Math.cos(a), y0 = cy - r0 * Math.sin(a), x1 = cx + r1 * Math.cos(a), y1 = cy - r1 * Math.sin(a);
      const cls = isTip ? "tk on tip-tk" : k < lit ? "tk on" : "tk";
      ticks += `<line class="${cls}" style="--k:${k}" x1="${x0.toFixed(2)}" y1="${y0.toFixed(2)}" x2="${x1.toFixed(2)}" y2="${y1.toFixed(2)}"/>`;
    }
    return `<div class="gauge ${o.sm ? "sm" : ""}"><svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-label="Health ${score}, ${word}">${ticks}</svg><div class="read"><div class="score" data-roll>${score}</div></div></div>`;
  }

  /* ───────── Charts: ink line, orange end marker, crosshair readout ───────── */
  function niceTicks(lo, hi, count) {
    const rough = (hi - lo) / count;
    const mag = Math.pow(10, Math.floor(Math.log10(rough)));
    const norm = rough / mag;
    const step = (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * mag;
    const out = [];
    for (let v = Math.floor(lo / step) * step; v <= Math.ceil(hi / step) * step + step / 2; v += step) out.push(+v.toFixed(6));
    return out;
  }
  let gradId = 0;
  function chart(el, o) {
    const W = el.clientWidth, H = o.height;
    const padL = 0, padR = o.padR ?? 56, padT = 12, padB = o.padB ?? 28;
    const s = o.series, n = s.length;
    const lo0 = Math.min(...s, o.avg ?? Infinity), hi0 = Math.max(...s, o.avg ?? -Infinity);
    const ticks = niceTicks(lo0, hi0, o.tickCount || 3);
    const lo = ticks[0], hi = ticks[ticks.length - 1];
    const iw = W - padL - padR, ih = H - padT - padB;
    const X = (i) => padL + iw * (o.step ? i / n : i / (n - 1));
    const Y = (v) => padT + ih * (1 - (v - lo) / (hi - lo));
    let d = "";
    if (o.step) {
      d = `M${X(0)} ${Y(s[0])}`;
      for (let i = 0; i < n; i++) d += ` H${X(i + 1).toFixed(2)}` + (i + 1 < n ? ` V${Y(s[i + 1]).toFixed(2)}` : "");
    } else {
      d = s.map((v, i) => `${i ? "L" : "M"}${X(i).toFixed(2)} ${Y(v).toFixed(2)}`).join(" ");
    }
    const ex = o.step ? X(n) : X(n - 1), ey = Y(s[n - 1]);
    const id = `g${++gradId}`;
    const area = `${d} V${padT + ih} H${padL} Z`;
    const grid = ticks.map((t) => `<line x1="${padL}" x2="${W - padR + 8}" y1="${Y(t)}" y2="${Y(t)}"/><text x="${W}" y="${Y(t) + 3.5}" text-anchor="end">${o.fmtY(t)}</text>`).join("");
    const xl = (o.xLabels || []).map(([i, t]) => `<text x="${(o.step ? X(i + .5) : X(i)).toFixed(2)}" y="${H - 6}" text-anchor="middle">${t}</text>`).join("");
    const avg = o.avg != null ? `<line class="avg fade-in" x1="${padL}" x2="${W - padR + 8}" y1="${Y(o.avg)}" y2="${Y(o.avg)}"/>` : "";
    el.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--ink);stop-opacity:var(--area-a)"/><stop offset="1" style="stop-color:var(--ink);stop-opacity:0"/></linearGradient></defs>
      <g class="grid">${grid}</g>${xl}${avg}
      <path class="fade-in" d="${area}" fill="url(#${id})"/>
      <path class="ln draw" pathLength="1" d="${d}"/>
      <g class="xg fade-in"><line class="xh" x1="0" x2="0" y1="${padT}" y2="${padT + ih}"/><circle class="dot" r="4"/></g>
      <rect class="endh fade-in" x="${ex - 7}" y="${ey - 7}" width="14" height="14"/>
      <rect class="endm fade-in" x="${ex - 3.5}" y="${ey - 3.5}" width="7" height="7"/>
    </svg><div class="readout fade-in"><div class="cap"></div><div class="rv"></div></div>${o.avg != null ? `<div class="avg-tag fade-in" style="left:12px;top:${Y(o.avg) - 30}px"><i></i>${o.avgLabel}</div>` : ""}`;
    const g = el.querySelector(".xg"), line = g.querySelector("line"), dot = g.querySelector("circle"), ro = el.querySelector(".readout");
    const place = (i) => {
      const px = o.step ? X(i + .5) : X(i), py = Y(s[i]);
      line.setAttribute("x1", px); line.setAttribute("x2", px);
      dot.setAttribute("cx", px); dot.setAttribute("cy", py);
      ro.querySelector(".cap").textContent = o.readCap(i);
      ro.querySelector(".rv").textContent = o.readVal(s[i], i);
      const rw = ro.offsetWidth || 140, rh = ro.offsetHeight || 56;
      const lineY = (x) => {
        const t = Math.max(0, Math.min(1, (x - padL) / iw));
        if (o.step) return Y(s[Math.min(n - 1, Math.floor(t * n))]);
        const f = t * (n - 1), k = Math.min(n - 2, Math.floor(f));
        return Y(s[k] + (s[k + 1] - s[k]) * (f - k));
      };
      const clear = (l, t) => {
        if (l < 0 || l + rw > W - padR || t < 0 || t + rh > padT + ih) return false;
        if (o.avg != null && Y(o.avg) > t - 4 && Y(o.avg) < t + rh + 4) return false;
        for (let x = l - 4; x <= l + rw + 4; x += 3) { const y = lineY(x); if (y > t - 8 && y < t + rh + 8) return false; }
        return true;
      };
      const sides = [px + 18, px - 18 - rw];
      const tops = [py - rh - 14, py + 14, padT, padT + ih - rh];
      let pos = null;
      for (const t of tops) { for (const l of sides) if (clear(l, t)) { pos = [l, t]; break; } if (pos) break; }
      if (!pos) pos = [px + 18 + rw > W - padR ? px - 18 - rw : px + 18, Math.max(0, py - rh - 14)];
      ro.style.left = pos[0] + "px"; ro.style.top = pos[1] + "px";
    };
    const park = o.park ?? n - 1;
    place(park);
    const svg = el.querySelector("svg");
    svg.addEventListener("mousemove", (e) => {
      const r = svg.getBoundingClientRect();
      const t = (e.clientX - r.left - padL) / iw;
      const i = Math.max(0, Math.min(n - 1, o.step ? Math.floor(t * n) : Math.round(t * (n - 1))));
      place(i);
    });
    svg.addEventListener("mouseleave", () => place(park));
  }

  /* ───────── Frame + shell ───────── */
  const MARK = `<svg class="fm" width="56" height="56" viewBox="0 0 56 56" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true">
    <path d="M2.5 6v19.5H34 M5.5 14v8.5H26 M2.5 50V30.5H34 M5.5 42v-8.5H26"/>
    <circle cx="11" cy="17" r="4.5"/><circle cx="11" cy="17" r="1" fill="currentColor" stroke="none"/>
    <circle cx="11" cy="39" r="4.5"/><circle cx="11" cy="39" r="1" fill="currentColor" stroke="none"/>
    <path d="M0 28h44" stroke-width="2" opacity=".5"/></svg>`;
  function frame() {
    return `<div class="frame" aria-hidden="true"><i class="edge l"></i><i class="edge r"></i><i class="rule" style="top:84px"></i>
      <span class="mark l" style="top:56px">${MARK}</span><span class="mark r" style="top:56px">${MARK}</span></div>`;
  }
  function navItem(it, active, extra = "") {
    const on = it.id === active;
    const ic = { home: "home", yield: "yield", lend: "lend", trade: "trade", points: "points", docs: "docs" }[it.id];
    if (it.soon) return `<span class="nav-item dis" title="${it.soon}" aria-disabled="true">${icon(ic)}<span>${it.label}</span>${badge("soon", "soon")}</span>`;
    return `<a class="nav-item ${on ? "on" : ""}" href="${it.href}" ${on ? 'aria-current="page"' : ""}>${ic ? icon(ic) : ""}<span>${it.label}</span>${extra}</a>`;
  }
  function nav(active) {
    const N = Object.fromEntries(AP.nav.map((n) => [n.id, n]));
    const y = N.yield;
    const sub = y.children.map((c) => navItem(c, active)).join("");
    return `<nav class="nav rise" aria-label="Main">
      <a class="logo" href="home.html" aria-label="Arch Prime home">${logo()}<span class="logo-word">Arch Prime</span></a>
      <div class="nav-groups">
        ${navItem(N.home, active)}
        <div class="nav-sep"></div>
        ${navItem(y, active, `<span class="tog" title="Hide Prime Yield pages">${icon("chevron")}</span>`)}
        <div class="nav-sub">${sub}</div>
        ${navItem(N.lend, active)}
        ${navItem(N.trade, active)}
        <div class="nav-sep"></div>
        ${navItem(N.points, active)}
        ${navItem(N.docs, active)}
      </div>
      <div class="nav-foot">
        <button class="nav-item" id="themeToggle" aria-label="${theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}">${icon("theme")}<span class="lbl">${theme === "dark" ? "Dark mode" : "Light mode"}</span><i class="switch ${theme === "dark" ? "on" : ""}"></i></button>
        <button class="nav-item" aria-label="Collapse sidebar">${icon("collapse")}<span>Collapse</span></button>
      </div>
    </nav>`;
  }
  function top() {
    const a = AP.account;
    return `<header class="top">
      <button class="search" aria-label="Search">${icon("search")}<span class="lbl">${AP.search}</span><span class="kbd">⌘</span><span class="kbd">K</span></button>
      <span class="spacer"></span>
      <span class="net"><i class="live"></i><span class="cap">${AP.network}</span></span>
      <button class="acct" aria-label="Accounts">${tile(a.name)}<span>${a.name}</span><span class="addr">${a.address}</span>${icon("caret")}</button>
    </header>`;
  }

  /* ───────── Motion ───────── */
  /* Digits roll on an overlay laid exactly over the final glyphs, so layout never shifts. */
  function rollIn(el, k) {
    const node = el.firstChild;
    if (!node || node.nodeType !== 3) return;
    const txt = node.textContent;
    const box = el.getBoundingClientRect();
    const layer = document.createElement("span");
    layer.className = "roll-layer";
    const range = document.createRange();
    const base = 250 + k * 90;
    let j = 0;
    const strips = [];
    [...txt].forEach((c, i) => {
      range.setStart(node, i); range.setEnd(node, i + 1);
      const r = range.getBoundingClientRect();
      const cell = document.createElement("span");
      cell.className = "roll-cell";
      cell.style.cssText = `left:${r.left - box.left}px;top:${r.top - box.top}px;width:${r.width}px;height:${r.height}px;line-height:${r.height}px`;
      if (/\d/.test(c)) {
        const strip = document.createElement("span");
        strip.className = "roll-strip";
        strip.innerHTML = "0123456789".split("").map((d) => `<span style="height:${r.height}px">${d}</span>`).join("");
        strip.style.transitionDelay = base + j++ * 40 + "ms";
        cell.appendChild(strip);
        strips.push([strip, +c * r.height]);
      } else cell.textContent = c;
      layer.appendChild(cell);
    });
    const cs = getComputedStyle(el);
    if (cs.position === "static") el.style.position = "relative";
    layer.style.color = cs.color;
    el.classList.add("rolling");
    el.appendChild(layer);
    requestAnimationFrame(() => requestAnimationFrame(() => strips.forEach(([s, y]) => (s.style.transform = `translateY(-${y}px)`))));
    setTimeout(() => { layer.remove(); el.classList.remove("rolling"); }, base + j * 40 + 1150);
  }
  function placeThumb(group) {
    const on = group.querySelector("button.on");
    const th = group.querySelector(".thumb");
    if (!on || !th) return;
    th.style.width = on.offsetWidth + "px";
    th.style.transform = `translateX(${on.offsetLeft}px)`;
  }
  function wireGroups(root) {
    root.querySelectorAll(".seg, .tabs").forEach((g) => {
      placeThumb(g);
      g.addEventListener("click", (e) => {
        const b = e.target.closest("button");
        if (!b || b.disabled || !g.contains(b)) return;
        g.querySelectorAll("button").forEach((x) => x.classList.toggle("on", x === b));
        placeThumb(g);
        g.dispatchEvent(new CustomEvent("pick", { detail: b.textContent.trim() }));
      });
      requestAnimationFrame(() => requestAnimationFrame(() => g.classList.add("ready")));
    });
  }
  function motion(root) {
    root.querySelectorAll(".rise").forEach((el, i) => el.style.setProperty("--i", i));
    if (!STILL) root.querySelectorAll("[data-roll]").forEach((el, k) => rollIn(el, Math.min(k, 6)));
    root.querySelectorAll(".switch").forEach((s) => {
      const host = s.parentElement;
      if (host.id === "themeToggle") host.addEventListener("click", () => setTheme(theme === "dark" ? "light" : "dark"));
      else if (host.tagName === "BUTTON") host.addEventListener("click", () => s.classList.toggle("on"));
    });
  }

  function mount(active, html, after) {
    document.title = document.title || "Arch Prime";
    document.body.innerHTML = `${frame()}<div class="app">${nav(active)}<main class="main">${top()}${html}</main></div>`;
    const navEl = document.querySelector(".nav");
    navEl.style.height = Math.max(640, window.innerHeight - 32) + "px";
    const go = () => {
      if (after) after();
      wireGroups(document);
      motion(document);
    };
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(go);
  }

  window.UI = { AP, STILL, icon, ICONS, mark, tile, logo, btn, seg, tabs, badge, tip, spark, gauge, chart, mount, placeThumb, theme: () => theme };
})();
