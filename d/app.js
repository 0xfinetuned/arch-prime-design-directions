/* Arch Prime — Direction D, "Hearth". Frame, icons, marks, charts and motion. */
(() => {
  const AP = window.AP;
  const q = new URLSearchParams(location.search);
  const still = q.has("still");
  const root = document.documentElement;
  root.classList.toggle("still", still);

  /* ── theme: ?theme= forces, else the saved choice, else light ── */
  const KEY = "ap-hearth-theme";
  const saved = (() => { try { return localStorage.getItem(KEY); } catch { return null; } })();
  const forced = q.get("theme");
  let theme = forced === "dark" || forced === "light" ? forced : saved === "dark" ? "dark" : "light";
  root.dataset.theme = theme;
  const themeWord = () => (theme === "dark" ? "Light mode" : "Dark mode");
  function setTheme(next) {
    theme = next;
    if (!still) { root.classList.add("is-switching"); setTimeout(() => root.classList.remove("is-switching"), 450); }
    root.dataset.theme = next;
    try { localStorage.setItem(KEY, next); } catch {}
    const b = document.querySelector("[data-theme-toggle]");
    if (b) { b.setAttribute("aria-label", `Switch to ${next === "dark" ? "light" : "dark"} mode`); b.querySelector(".grow").textContent = themeWord(); }
  }

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  /* ── icons: soft rounded strokes on a 24 grid; nav icons carry one ember ── */
  const I = {
    home: ['<path d="M4.5 11 12 5l7.5 6v8a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 19z"/><path d="M10 20.5V16a2 2 0 0 1 4 0v4.5"/>', [12, 11.2]],
    yield: ['<path d="M5 19.5v-3.5M10 19.5V13M15 19.5v-9"/><path d="M4 9.5c4.5 0 9-1.8 13-5.5"/>', [19.6, 4.4]],
    lend: ['<path d="M4.5 9.5 12 5l7.5 4.5"/><path d="M7 12.5v5M12 12.5v5M17 12.5v5M4.5 20.5h15"/>', [12, 8.4]],
    trade: ['<path d="M5 8.5h13M15 5.5l3 3-3 3"/><path d="M19 15.5H6M9 12.5l-3 3 3 3"/>', [5, 8.5]],
    points: ['<path d="M11 4.5c.7 4.2 2.3 5.8 6.5 6.5-4.2.7-5.8 2.3-6.5 6.5-.7-4.2-2.3-5.8-6.5-6.5 4.2-.7 5.8-2.3 6.5-6.5z"/>', [18.6, 18.4]],
    docs: ['<path d="M7.5 3.8h6.3l4.4 4.4v10.6a1.7 1.7 0 0 1-1.7 1.7H7.5a1.7 1.7 0 0 1-1.7-1.7V5.5a1.7 1.7 0 0 1 1.7-1.7z"/><path d="M13.5 4v4.5H18M9.5 13h5M9.5 16.5h3.5"/>', [9.6, 9]],
    deposit: ['<path d="M12 4v10M8 10.5l4 4 4-4M5 19.5h14"/>'],
    withdraw: ['<path d="M12 14.5v-10M8 8l4-4 4 4M5 19.5h14"/>'],
    transfer: ['<path d="M5 12h13.5M13.5 7l5 5-5 5"/>'],
    move: ['<path d="M6 4.5v6a3.5 3.5 0 0 0 3.5 3.5H19M15 10l4 4-4 4"/>'],
    share: ['<path d="M12 14.5V4M8.5 7.5 12 4l3.5 3.5M6.5 11.5v7A1.5 1.5 0 0 0 8 20h8a1.5 1.5 0 0 0 1.5-1.5v-7"/>'],
    copy: ['<rect x="9" y="9" width="10.5" height="10.5" rx="3"/><path d="M15 9V7a2.5 2.5 0 0 0-2.5-2.5H7A2.5 2.5 0 0 0 4.5 7v5.5A2.5 2.5 0 0 0 7 15h2"/>'],
    external: ['<path d="M13.5 4.5h6v6M19.5 4.5l-8 8M17.5 14v3.5a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2H10"/>'],
    search: ['<circle cx="11" cy="11" r="6.2"/><path d="m15.6 15.6 4 4"/>'],
    chevron: ['<path d="m10 6.5 5.5 5.5-5.5 5.5"/>'],
    caret: ['<path d="m7.5 10 4.5 4.5 4.5-4.5"/>'],
    theme: ['<circle cx="12" cy="12" r="7.2"/><path d="M12 4.8a7.2 7.2 0 0 1 0 14.4z" fill="currentColor"/>'],
    collapse: ['<path d="m11.5 7-5 5 5 5M18 7l-5 5 5 5"/>'],
    close: ['<path d="m6.5 6.5 11 11M17.5 6.5l-11 11"/>'],
    flip: ['<path d="M8.5 19.5v-15M5 8l3.5-3.5L12 8M15.5 4.5v15M12 16l3.5 3.5L19 16"/>'],
    columns: ['<path d="M4.5 8h8M17.5 8h2M4.5 16h2M11.5 16h8"/><circle cx="15" cy="8" r="2.3"/><circle cx="9" cy="16" r="2.3"/>'],
    arrow: ['<path d="M5 12h14M13.5 6.5 19 12l-5.5 5.5"/>'],
    plus: ['<path d="M12 5.5v13M5.5 12h13"/>'],
  };
  function icon(name, o = {}) {
    const [body, em] = I[name];
    const s = o.size || 20, w = o.w || (s <= 14 ? 2 : 1.7);
    const ember = em && o.ember !== false ? `<circle class="em" cx="${em[0]}" cy="${em[1]}" r="${o.emR || 1.9}"/>` : "";
    return `<svg class="ic${o.cls ? " " + o.cls : ""}" viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}${ember}</svg>`;
  }

  /* the arch: a rounded arch with an ember at its keystone */
  const archMark = (s = 26) => `<svg viewBox="0 0 26 26" width="${s}" height="${s}" aria-hidden="true"><path d="M5 22V13a8 8 0 0 1 16 0v9" fill="none" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/><path d="M10 22v-8.5a3 3 0 0 1 6 0V22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity=".45"/><circle cx="13" cy="5" r="2.6" fill="var(--ember)"/></svg>`;

  /* ── asset marks: glyphs drawn here, discs in the asset's colour ── */
  const GLYPH = {
    btc: '<path d="M9.5 6.8v10.4M9.5 6.8h3.7a2.5 2.5 0 0 1 0 5H9.5M9.5 11.8h4.3a2.7 2.7 0 0 1 0 5.4H9.5M11 5.2v1.6M13.4 5.2v1.6M11 17.2v1.6M13.4 17.2v1.6"/>',
    usd: '<path d="M15.2 8.6c-.6-1-1.8-1.6-3.2-1.6-1.8 0-3.1.9-3.1 2.3 0 3.3 6.4 1.9 6.4 5.2 0 1.4-1.4 2.5-3.3 2.5-1.5 0-2.8-.6-3.4-1.7M12 5v14"/>',
  };
  const MARK = { BTC: ["btc", "is-btc"], USD: ["usd", "is-usd"], primeBTC: ["btc", "is-prime"], primeUSD: ["usd", "is-prime"] };
  function mark(sym, cls = "") {
    const [g, tone] = MARK[sym] || ["usd", "is-usd"];
    const s = cls.includes("mk-l") ? 26 : cls.includes("mk-s") ? 18 : 22;
    return `<span class="mk ${tone}${cls ? " " + cls : ""}" aria-hidden="true"><svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${GLYPH[g]}</svg></span>`;
  }
  const COLOUR = { BTC: "--c-btc", USD: "--c-usd", primeBTC: "--c-pbtc", primeUSD: "--c-pusd" };

  /* ── controls ── */
  const btn = {
    primary: (label, o = {}) => `<button class="btn btn-pri${o.sm ? " btn-sm" : ""}${o.wide ? " btn-wide" : ""}"><span>${esc(label)}</span><span class="disc">${icon("arrow", { size: o.sm ? 14 : o.wide ? 20 : 17, w: 2.2 })}</span></button>`,
    soft: (label, o = {}) => `<button class="btn btn-soft${o.sm ? " btn-sm" : ""}">${o.icon ? icon(o.icon, { size: o.sm ? 15 : 17 }) : ""}<span>${esc(label)}</span></button>`,
    ghost: (label, o = {}) => `<button class="btn btn-ghost">${o.icon && !o.after ? icon(o.icon, { size: 16 }) : ""}<span>${esc(label)}</span>${o.icon && o.after ? icon(o.icon, { size: 16 }) : ""}</button>`,
    icon: (name, label, o = {}) => `<button class="ibtn${o.sm ? " ibtn-sm" : ""}${o.raised ? " is-raised" : ""}" aria-label="${esc(label)}" title="${esc(label)}">${icon(name, { size: o.sm ? 15 : 18 })}</button>`,
  };
  const seg = (items, on, cls = "") => `<div class="seg ${cls}" role="tablist">${items.map((t) => `<button class="${t === on ? "is-on" : ""}" role="tab" aria-selected="${t === on}">${esc(t)}</button>`).join("")}</div>`;
  const tabs = (items, on) => `<div class="tabs" role="tablist">${items.map((t) => {
    const soon = t.includes("· soon"), name = soon ? t.replace(" · soon", "") : t;
    return `<button class="tab${t === on ? " is-on" : ""}${soon ? " is-soon" : ""}" role="tab" aria-selected="${t === on}">${esc(name)}${soon ? ' <span class="badge is-soon">soon</span>' : ""}</button>`;
  }).join("")}</div>`;
  const HEALTH = { Healthy: "is-ok", Watch: "is-watch", "At risk": "is-risk" };
  const badge = (word, kind) => `<span class="badge ${kind ?? HEALTH[word] ?? ""}"><i></i>${esc(word)}</span>`;
  const kvs = (pairs) => `<div class="kvs">${pairs.map(([k, v, t]) => `<div class="kv"><span${t ? ` class="tip" title="${esc(t)}"` : ""}>${esc(k)}</span><span>${v}</span></div>`).join("")}</div>`;
  const dir = (d) => (d === "up" ? "up" : d === "down" ? "down" : "muted");
  const move = (s) => `<span class="mv">${s.split(" · ").map((p) => `<span>${esc(p)}</span>`).join("")}</span>`;
  const bar = (pct, o = {}) => `<span class="bar${o.wide ? " is-wide" : ""}${o.cool ? " is-cool" : ""}" aria-hidden="true"><i style="--w:${pct.toFixed(1)}%;--dl:${o.delay ?? 400}ms"></i></span>`;
  const orb = (style = "") => `<span class="orb" aria-hidden="true"${style ? ` style="${style}"` : ""}></span>`;

  /* ── charts ── */
  let uid = 0;
  function smooth(p) {
    let d = `M${p[0][0].toFixed(1)},${p[0][1].toFixed(1)}`;
    for (let i = 0; i < p.length - 1; i++) {
      const a = p[i - 1] || p[i], b = p[i], c = p[i + 1], e = p[i + 2] || c;
      d += `C${(b[0] + (c[0] - a[0]) / 6).toFixed(1)},${(b[1] + (c[1] - a[1]) / 6).toFixed(1)} ${(c[0] - (e[0] - b[0]) / 6).toFixed(1)},${(c[1] - (e[1] - b[1]) / 6).toFixed(1)} ${c[0].toFixed(1)},${c[1].toFixed(1)}`;
    }
    return d;
  }
  // steps with softened corners
  function steps(p, r = 5) {
    let d = `M${p[0][0].toFixed(1)},${p[0][1].toFixed(1)}`;
    for (let i = 1; i < p.length; i++) {
      const [x0, y0] = p[i - 1], [x1, y1] = p[i], dy = y1 - y0;
      if (Math.abs(dy) < 0.5) { d += `H${x1.toFixed(1)}`; continue; }
      const k = Math.min(r, Math.abs(dy) / 2, (x1 - x0) / 2), s = Math.sign(dy);
      d += `H${(x1 - k).toFixed(1)}Q${x1.toFixed(1)},${y0.toFixed(1)} ${x1.toFixed(1)},${(y0 + s * k).toFixed(1)}V${(y1 - s * k).toFixed(1)}`;
      const nx = p[i + 1] ? p[i + 1][0] : x1;
      d += nx > x1 ? `Q${x1.toFixed(1)},${y1.toFixed(1)} ${(x1 + k).toFixed(1)},${y1.toFixed(1)}` : `V${y1.toFixed(1)}`;
    }
    return d;
  }
  function ticks(lo, hi, want = 3) {
    const raw = (hi - lo) / want, mag = 10 ** Math.floor(Math.log10(raw));
    const st = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((x) => x >= raw);
    const out = [];
    for (let t = Math.ceil(lo / st) * st; t <= hi + 1e-9; t += st) out.push(+t.toFixed(10));
    return out;
  }
  function defs(id, w, yTop, h) {
    return `<defs>
      <linearGradient id="${id}h" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${w.toFixed(1)}" y2="0"><stop class="c-0" offset="0"/><stop class="c-1" offset=".55"/><stop class="c-2" offset="1"/></linearGradient>
      <linearGradient id="${id}v" gradientUnits="userSpaceOnUse" x1="0" y1="${yTop.toFixed(1)}" x2="0" y2="${h}"><stop class="a-0" offset="0"/><stop class="a-1" offset="1"/></linearGradient>
      <mask id="${id}m" maskUnits="userSpaceOnUse" x="0" y="0" width="${w.toFixed(1)}" height="${h}"><rect width="${w.toFixed(1)}" height="${h}" fill="url(#${id}v)"/></mask>
      <filter id="${id}f" x="-5%" y="-40%" width="110%" height="180%"><feGaussianBlur stdDeviation="6"/></filter>
      <radialGradient id="${id}o"><stop class="o-0" offset="0"/><stop class="o-1" offset=".45"/><stop class="o-2" offset="1"/></radialGradient>
    </defs>`;
  }
  function chart(el, o) {
    const s = o.series, w = el.clientWidth, h = o.h || 260;
    const gut = o.axis ? 58 : 0, pw = w - gut, top = 20, foot = 16;
    const vals = o.ref != null ? [...s, o.ref] : s;
    const lo0 = Math.min(...vals), hi0 = Math.max(...vals), span = hi0 - lo0 || 1;
    const lo = lo0 - span * 0.22, hi = hi0 + span * 0.1;
    const X = (i) => (o.step ? (i / s.length) * pw : (i / (s.length - 1)) * pw);
    const Y = (v) => top + ((hi - v) / (hi - lo)) * (h - top - foot);
    const pts = s.map((v, i) => [X(i), Y(v)]);
    if (o.step) pts.push([pw, Y(s[s.length - 1])]);
    const d = o.step ? steps(pts) : smooth(pts), last = pts[pts.length - 1], id = "h" + ++uid;
    let ax = "";
    if (o.axis) for (const t of ticks(lo0, hi0, 3)) {
      const y = Y(t).toFixed(1);
      ax += `<line class="grid" x1="0" x2="${pw}" y1="${y}" y2="${y}"/><text class="ax" x="${w}" y="${(+y + 4).toFixed(1)}" text-anchor="end">${o.fmt(t)}</text>`;
    }
    let ref = "";
    if (o.ref != null) {
      const ry = Y(o.ref).toFixed(1);
      ref = `<line class="avg fadein" x1="2" x2="${pw}" y1="${ry}" y2="${ry}" style="--dl:400ms"/><text class="avg-l fadein" x="4" y="${(+ry + 22).toFixed(1)}" style="--dl:500ms">${esc(o.refLabel)}</text>`;
    }
    el.innerHTML = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(o.label || "")}">${defs(id, pw, Math.min(...pts.map((p) => p[1])), h)}
      ${ax}
      <path class="fadein" d="${d}L${pw},${h}L0,${h}Z" fill="url(#${id}h)" mask="url(#${id}m)"/>
      ${ref}
      <path class="haze fadein" d="${d}" stroke="url(#${id}h)" filter="url(#${id}f)"/>
      <path class="line draw" pathLength="1" d="${d}" stroke="url(#${id}h)"/>
      <circle class="fadein" cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="34" fill="url(#${id}o)" style="--dl:700ms"/>
      <circle class="pearl fadein" cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="6.5" style="--dl:700ms"/>
      <line class="xh" x1="0" x2="0" y1="${top}" y2="${h}"/><circle class="xd" r="6" cx="0" cy="0"/>
    </svg><div class="chart-tip"></div>`;
    const xh = el.querySelector(".xh"), xd = el.querySelector(".xd"), tip = el.querySelector(".chart-tip");
    el.onmousemove = (e) => {
      const bx = e.clientX - el.getBoundingClientRect().left;
      if (bx > pw) return el.classList.remove("is-hover");
      const i = Math.max(0, Math.min(s.length - 1, o.step ? Math.floor((bx / pw) * s.length) : Math.round((bx / pw) * (s.length - 1))));
      const x = o.step ? X(i) + pw / s.length / 2 : X(i), y = Y(s[i]);
      xh.setAttribute("x1", x); xh.setAttribute("x2", x); xd.setAttribute("cx", x); xd.setAttribute("cy", y);
      tip.textContent = (o.fmtTip || o.fmt)(s[i]);
      tip.style.left = x + "px"; tip.style.top = y - 12 + "px";
      el.classList.add("is-hover");
    };
    el.onmouseleave = () => el.classList.remove("is-hover");
  }
  function spark(s, o = {}) {
    const w = o.w || 96, h = o.h || 30, pad = 5, id = "s" + ++uid;
    const lo = Math.min(...s), hi = Math.max(...s), span = hi - lo || 1;
    const p = s.map((v, i) => [pad + (i / (s.length - 1)) * (w - pad * 2), pad + ((hi - v) / span) * (h - pad * 2)]);
    const d = smooth(p), e = p[p.length - 1];
    return `<svg class="spark" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true">${defs(id, w, Math.min(...p.map((x) => x[1])), h)}
      ${o.area ? `<path class="fadein" d="${d}L${e[0]},${h}L${p[0][0]},${h}Z" fill="url(#${id}h)" mask="url(#${id}m)"/>` : ""}
      <path class="haze fadein" d="${d}" stroke="url(#${id}h)" filter="url(#${id}f)"/>
      <path class="line draw" pathLength="1" d="${d}" stroke="url(#${id}h)" style="--dl:${o.delay || 250}ms"/>
      <circle class="pearl fadein" cx="${e[0].toFixed(1)}" cy="${e[1].toFixed(1)}" r="3" style="--dl:${(o.delay || 250) + 400}ms"/></svg>`;
  }

  /* ── health gauge: a thick soft arc ── */
  function gauge(score, word, o = {}) {
    const W = o.size || 200, sw = o.sw || 14, r = W / 2 - sw, cx = W / 2, cy = r + sw, H = cy + sw / 2, id = "g" + ++uid;
    const arc = `M${cx - r},${cy} A${r},${r} 0 0 1 ${cx + r},${cy}`;
    const off = still ? 0 : score;
    return `<div class="gauge ${HEALTH[word] || ""}" role="img" aria-label="Health ${score}, ${esc(word)}" style="width:${W}px;height:${H}px">
      <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>
        <linearGradient id="${id}" gradientUnits="userSpaceOnUse" x1="${cx - r}" y1="0" x2="${cx + r}" y2="0"><stop class="g-0" offset="0"/><stop class="g-1" offset=".85"/></linearGradient>
        <filter id="${id}f" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="5"/></filter></defs>
        <path class="trk" d="${arc}" stroke-width="${sw}"/>
        <path class="val-h" d="${arc}" stroke="url(#${id})" stroke-width="${sw}" pathLength="100" stroke-dasharray="${score} 200" stroke-dashoffset="${off}" data-off="0" filter="url(#${id}f)"/>
        <path class="val" d="${arc}" stroke="url(#${id})" stroke-width="${sw}" pathLength="100" stroke-dasharray="${score} 200" stroke-dashoffset="${off}" data-off="0"/>
      </svg>
      <div class="gauge-c"><span class="${o.small ? "fig-m" : "fig-l"} focus" style="--dl:300ms">${score}</span>${badge(word)}</div></div>`;
  }

  /* ── the account card: blooms in each holding's colour, sized by its share ── */
  function acard(name, line) {
    const parts = AP.home.assets.map((a) => ({ sym: a.sym, v: parseFloat(a.value.replace(/[^\d.]/g, "")) }));
    const total = parts.reduce((t, p) => t + p.v, 0);
    const spots = [[16, 92], [88, 12], [96, 96], [4, 6]];
    const bloom = parts.map((p, i) => {
      const k = Math.sqrt(p.v / total);
      return `radial-gradient(${(34 + 46 * k).toFixed(0)}% ${(40 + 60 * k).toFixed(0)}% at ${spots[i][0]}% ${spots[i][1]}%, color-mix(in srgb, var(${COLOUR[p.sym]}) ${(55 + 45 * k).toFixed(0)}%, transparent), transparent 72%)`;
    }).join(",");
    const legend = parts.map((p) => `<span style="--c:var(${COLOUR[p.sym]})"><i></i>${esc(p.sym)} ${Math.round((p.v / total) * 100)}%</span>`).join("");
    const alloc = parts.map((p) => `<i style="--c:var(${COLOUR[p.sym]});flex:${p.v.toFixed(0)}"></i>`).join("");
    return { card: `<div class="acard" role="img" aria-label="${esc(name)} account card"><div class="bloom" style="background:${bloom}"></div><div class="sheen"></div>
      <div class="ac-in"><div class="ac-top"><span class="ac-brand">${archMark(20)}Arch Prime</span><span class="ac-sub">${esc(AP.network)}</span></div>
      <div class="ac-bot"><div style="display:flex;flex-direction:column;gap:2px"><span class="ac-name">${esc(name)}</span><span class="ac-sub">${esc(line)}</span></div>${icon("points", { size: 22, w: 1.5 })}</div></div></div>`,
      alloc: `<div class="alloc" aria-hidden="true">${alloc}</div>`, legend: `<div class="alloc-legend">${legend}</div>` };
  }

  /* ── frame ── */
  const NAVI = { home: "home", yield: "yield", lend: "lend", trade: "trade", points: "points", docs: "docs" };
  function side(active, sub) {
    const items = AP.nav.filter((n) => n.id !== "docs").map((n) => {
      const on = n.id === active;
      const a = `<a class="tabx${on ? " is-on" : ""}" href="${n.href}"${on && !sub ? ' aria-current="page"' : ""}>${icon(NAVI[n.id], { size: 21 })}<span class="grow">${esc(n.label)}</span>${n.children ? `<span class="caret" role="button" aria-label="Hide Prime Yield pages" title="Hide Prime Yield pages">${icon("caret", { size: 15 })}</span>` : ""}</a>`;
      if (!n.children) return a;
      return a + `<div class="subs">${n.children.map((c) => `<a href="${c.href}" class="${c.id === sub ? "is-on" : ""}"${c.id === sub ? ' aria-current="page"' : ""}>${esc(c.label)}</a>`).join("")}</div>`;
    }).join("");
    const docs = AP.nav.find((n) => n.id === "docs");
    return `<aside class="side" aria-label="Sidebar">
      <a class="logo" href="home.html" aria-label="Arch Prime home">${archMark(26)}<span>Arch Prime</span></a>
      <nav class="nav" aria-label="Main">${items}
        <span class="tabx is-off" aria-disabled="true" title="${esc(docs.soon)}">${icon("docs", { size: 21 })}<span class="grow">${esc(docs.label)}</span><span class="badge is-soon">soon</span></span>
      </nav>
      <div class="side-foot">
        <button class="tabx" data-theme-toggle aria-label="Switch to ${theme === "dark" ? "light" : "dark"} mode">${icon("theme", { size: 18 })}<span class="grow" style="text-align:left">${themeWord()}</span></button>
        <button class="tabx" aria-label="Collapse sidebar">${icon("collapse", { size: 18 })}<span class="grow" style="text-align:left">Collapse</span></button>
      </div>
    </aside>`;
  }
  function tileStyle(seed) {
    let h = 2166136261;
    for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0;
    const hue = 12 + (h % 30);
    return `background:radial-gradient(circle at 30% 25%, hsl(${hue + 18} 100% 84%), hsl(${hue} 92% 62%) 60%, hsl(${hue - 8} 70% 44%))`;
  }
  function top() {
    return `<header class="top">
      <div class="search" role="button" tabindex="0"><span>${esc(AP.search)}</span><span class="kbd">⌘K</span><span class="sdisc">${icon("search", { size: 17, w: 2.2 })}</span></div>
      <div class="top-end">
        <span class="net"><span class="live"></span>${esc(AP.network)}</span>
        <button class="who" aria-label="Accounts"><span class="atile" style="${tileStyle(AP.account.address)}">${esc(AP.account.name[0])}</span><span>${esc(AP.account.name)}</span>${icon("caret", { size: 15 })}</button>
      </div>
    </header>`;
  }
  function ticker() {
    const one = AP.ticker.map((t) => `<span class="tk"><b>${esc(t.sym)}</b><span>${esc(t.value)}</span><em class="${t.dir ? dir(t.dir) : ""}">${esc(t.move)}</em></span>`).join("");
    return `<div class="ticker" aria-label="Markets"><span class="live is-ember"></span><div class="ticker-track"><div class="ticker-set">${one}</div><div class="ticker-set" aria-hidden="true">${one}</div></div></div>`;
  }

  function page({ active, sub, title, html, withTicker, after }) {
    document.title = `${title} · Arch Prime`;
    const app = document.createElement("div");
    app.className = "app";
    app.innerHTML = `${side(active, sub)}<main class="main">${top()}${withTicker ? ticker() : ""}${html}</main>`;
    document.body.prepend(app);
    app.querySelector("[data-theme-toggle]").addEventListener("click", () => setTheme(theme === "dark" ? "light" : "dark"));
    const go = () => {
      if (after) after();
      const settle = () => document.querySelectorAll(".gauge [data-off]").forEach((p) => p.setAttribute("stroke-dashoffset", p.dataset.off));
      if (still) { settle(); root.classList.add("is-in"); return; }
      requestAnimationFrame(() => requestAnimationFrame(() => { root.classList.add("is-in"); settle(); }));
    };
    document.fonts && document.fonts.ready ? document.fonts.ready.then(go) : go();
  }

  window.H = { AP, icon, archMark, mark, btn, seg, tabs, badge, kvs, dir, move, bar, orb, chart, spark, gauge, acard, esc, page, still };
})();
