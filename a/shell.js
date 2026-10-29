/* Arch Prime — Direction A, "Paper". Frame, icons, figures and motion. */
(() => {
  const AP = window.AP;
  const q = new URLSearchParams(location.search);
  const still = q.has("still");
  document.documentElement.classList.toggle("still", still);

  /* ── theme: ?theme= forces, else the saved choice, else light ── */
  const THEME_KEY = "ap-paper-theme";
  const saved = (() => { try { return localStorage.getItem(THEME_KEY); } catch { return null; } })();
  const forced = q.get("theme");
  let theme = forced === "dark" || forced === "light" ? forced : saved === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = theme;
  const themeLabel = () => (theme === "dark" ? "Light mode" : "Dark mode");
  function setTheme(next) {
    theme = next;
    const root = document.documentElement;
    if (!still) { root.classList.add("is-switching"); setTimeout(() => root.classList.remove("is-switching"), 400); }
    root.dataset.theme = next;
    try { localStorage.setItem(THEME_KEY, next); } catch {}
    const b = document.querySelector("[data-theme-toggle]");
    if (b) { b.setAttribute("aria-label", `Switch to ${next === "dark" ? "light" : "dark"} mode`); b.querySelector(".grow").textContent = themeLabel(); }
  }

  /* ── 7×7 LED glyphs. # lit · + half · o accent · . unlit ── */
  const PX = {
    // navigation
    home:     ["...#...", "..###..", ".#####.", "#######", ".#...#.", ".#.o.#.", ".#.#.#."],
    yield:    ["......o", "......#", "....#.#", "....#.#", "..#.#.#", "..#.#.#", "#.#.#.#"],
    lend:     ["...o...", "..###..", "#######", ".#.#.#.", ".#.#.#.", ".#.#.#.", "#######"],
    trade:    [".....#.", "######o", ".....#.", ".......", ".#.....", "#######", ".#....."],
    points:   ["...#...", "...#...", "..###..", "###o###", "..###..", "...#...", "...#..."],
    docs:     ["#####..", "#...##.", "#.....#", "#.###.#", "#.....#", "#.##o.#", "#######"],
    // actions
    deposit:  ["...#...", "...#...", ".#.#.#.", "..###..", "...#...", ".......", "#######"],
    withdraw: ["...#...", "..###..", ".#.#.#.", "...#...", "...#...", ".......", "#######"],
    transfer: [".......", "....#..", ".....#.", "+.#####", ".....#.", "....#..", "......."],
    move:     ["#......", "#......", "#...#..", "#....#.", "#######", ".....#.", "....#.."],
    share:    ["...#...", "..###..", ".#.#.#.", "...#...", "#..#..#", "#.....#", "#######"],
    copy:     ["####...", "#..#...", "#.#####", "#.#...#", "###...#", "..#...#", "..#####"],
    external: ["...####", ".....##", "....#.#", "...#..#", "..#....", ".#.....", "#......"],
    search:   [".###...", "#...#..", "#...#..", "#...#..", ".####..", ".....#.", "......#"],
    chevron:  [".......", "..#....", "...#...", "....#..", "...#...", "..#....", "......."],
    caret:    [".......", ".......", ".#...#.", "..#.#..", "...#...", ".......", "......."],
    theme:    ["..###..", ".#..##.", "#...###", "#...###", "#...###", ".#..##.", "..###.."],
    collapse: [".......", "...#..#", "..#..#.", ".#..#..", "..#..#.", "...#..#", "......."],
    close:    ["#.....#", ".#...#.", "..#.#..", "...#...", "..#.#..", ".#...#.", "#.....#"],
    flip:     [".#.....", "###....", ".#...#.", ".#...#.", ".#...#.", "....###", ".....#."],
    columns:  [".#.....", "#######", ".#.....", ".......", "....#..", "#######", "....#.."],
    arrow:    [".......", "....#..", ".....#.", "#######", ".....#.", "....#..", "......."],
    plus:     [".......", "...#...", "...#...", ".#####.", "...#...", "...#...", "......."],
    // marks
    arch:     ["...#...", "..###..", ".##.##.", ".#...#.", "##...##", "#.....#", "#.....#"],
    btc:      ["..#.#..", ".####..", "..#..#.", "..####.", "..#..#.", ".####..", "..#.#.."],
    usd:      ["...#...", "..####.", ".#.#...", "..###..", "...#.#.", ".####..", "...#..."],
  };

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  function px(name, o = {}) {
    const g = typeof name === "string" ? PX[name] : name;
    if (!g) throw new Error("No glyph " + name);
    // snap to whole device pixels per cell at 2x: multiples of 3.5px
    const size = Math.max(7, Math.round((o.size || 14) / 3.5) * 3.5), led = !!o.led;
    const k = led ? 0.82 : 1, off = led ? 0.09 : 0;
    let r = "";
    g.forEach((row, y) => [...row].forEach((ch, x) => {
      const cls = ch === "#" ? "on" : ch === "+" ? "mid" : ch === "o" ? "acc" : led ? "off" : "";
      if (!cls) return;
      r += `<rect class="${cls}" x="${x + off}" y="${y + off}" width="${k}" height="${k}"${led ? ' rx=".16"' : ""} style="--d:${(x + y) * 28}ms"/>`;
    }));
    return `<svg class="px${led ? " px-led" : ""}${o.cls ? " " + o.cls : ""}" viewBox="0 0 7 7" width="${size}" height="${size}" aria-hidden="true">${r}</svg>`;
  }

  // a small symmetric pixel tile from the account address
  function tileGlyph(seed) {
    let h = 2166136261;
    for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0;
    const rows = [];
    for (let y = 0; y < 7; y++) {
      let row = "";
      for (let x = 0; x < 7; x++) {
        if (x === 0 || x === 6 || y === 0 || y === 6) { row += "."; continue; }
        const mx = x > 3 ? 6 - x : x;
        row += (h >>> ((y - 1) * 3 + (mx - 1))) & 1 ? "#" : ".";
      }
      rows.push(row);
    }
    return rows;
  }

  const MARK = { BTC: ["btc", false], USD: ["usd", false], primeBTC: ["btc", true], primeUSD: ["usd", true] };
  function mark(sym, cls = "") {
    const [g, prime] = MARK[sym] || ["usd", false];
    const size = cls.includes("mk-l") ? 18 : cls.includes("mk-s") ? 12 : 14;
    return `<span class="mk${prime ? " is-prime" : ""}${cls ? " " + cls : ""}" aria-hidden="true">${px(g, { size })}</span>`;
  }

  /* ── controls ── */
  const btn = {
    primary: (label, o = {}) => `<button class="btn btn-primary${o.sm ? " btn-sm" : ""}${o.wide ? " btn-wide" : ""}"><span>${esc(label)}</span><span class="disc">${px("arrow", { size: o.sm ? 10.5 : 14 })}</span></button>`,
    secondary: (label, o = {}) => `<button class="btn btn-secondary${o.sm ? " btn-sm" : ""}"${o.title ? ` title="${esc(o.title)}"` : ""}>${o.icon ? px(o.icon, { size: o.sm ? 10 : 12 }) : ""}<span>${esc(label)}</span></button>`,
    ghost: (label, o = {}) => `<button class="btn btn-ghost${o.sm ? " btn-sm" : ""}">${o.icon && !o.after ? px(o.icon, { size: 10 }) : ""}<span>${esc(label)}</span>${o.icon && o.after ? px(o.icon, { size: 10 }) : ""}</button>`,
    icon: (name, label, o = {}) => `<button class="ibtn${o.sm ? " ibtn-sm" : ""}${o.cls ? " " + o.cls : ""}" aria-label="${esc(label)}" title="${esc(label)}">${px(name, { size: o.size || (o.sm ? 10 : 12) })}</button>`,
  };
  const seg = (items, on, cls = "") => `<div class="seg ${cls}" role="tablist">${items.map((t) => `<button class="${t === on ? "is-on" : ""}" role="tab" aria-selected="${t === on}">${esc(t)}</button>`).join("")}</div>`;
  const tabs = (items, on) => `<div class="tabs" role="tablist">${items.map((t) => {
    const soon = t.includes("· soon");
    const name = soon ? t.replace(" · soon", "") : t;
    return `<button class="tab${t === on ? " is-on" : ""}${soon ? " is-soon" : ""}" role="tab">${esc(name)}${soon ? ' <span class="badge is-soon">soon</span>' : ""}</button>`;
  }).join("")}</div>`;
  const HEALTH = { Healthy: "", Watch: "is-watch", "At risk": "is-risk" };
  const badge = (word, kind) => `<span class="badge ${kind ?? HEALTH[word] ?? ""}"><i></i>${esc(word)}</span>`;
  const rows = (pairs, cls = "") => `<div class="rows ${cls}">${pairs.map(([k, v, t]) => `<div class="row"><span${t ? ` class="tip" title="${esc(t)}"` : ""}>${esc(k)}</span><span>${v}</span></div>`).join("")}</div>`;
  const dir = (d) => (d === "up" ? "up" : d === "down" ? "down" : "muted");
  // "-$116.07 · -1.13%" set as two figures with air between, no dot
  const move = (s) => `<span class="mv">${s.split(" · ").map((p) => `<span>${esc(p)}</span>`).join("")}</span>`;
  const led = (pct, n = 20, o = {}) => {
    const lit = Math.round((pct / 100) * n), d0 = o.delay ?? 400;
    return `<span class="led${o.wide ? " led-wide" : ""}" aria-hidden="true">${Array.from({ length: n }, (_, i) => i < lit ? `<i class="on" style="--d:${d0 + i * 22}ms"></i>` : "<i></i>").join("")}</span>`;
  };

  /* ── health gauge: an arc of LED cells ── */
  function gauge(score, word, o = {}) {
    const W = o.size || 184, n = 27, r = W / 2 - 10, cx = W / 2, cy = r + 10, H = cy + 6;
    const lit = Math.round((score / 100) * n);
    const cw = o.size && o.size < 170 ? 3.4 : 4, ch = o.size && o.size < 170 ? 10 : 12;
    let cells = "";
    for (let i = 0; i < n; i++) {
      const a = Math.PI - (i / (n - 1)) * Math.PI;
      const x = cx + r * Math.cos(a), y = cy - r * Math.sin(a);
      const deg = 90 - (a * 180) / Math.PI;
      const t = `translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${deg.toFixed(2)})`;
      cells += `<rect class="g-off" x="${-cw / 2}" y="${-ch / 2}" width="${cw}" height="${ch}" rx="1" transform="${t}"/>`;
      if (i < lit) cells += `<rect class="g-on" x="${-cw / 2}" y="${-ch / 2}" width="${cw}" height="${ch}" rx="1" transform="${t}" style="--d:${300 + i * 32}ms"/>`;
    }
    return `<div class="gauge" role="img" aria-label="Health ${score}, ${esc(word)}"><svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${cells}</svg>
      <div class="gauge-c"><span class="fig-m" data-roll="200">${score}</span>${badge(word)}</div></div>`;
  }

  /* ── charts ── */
  function smooth(p) {
    if (p.length < 2) return "";
    let d = `M${p[0][0].toFixed(2)},${p[0][1].toFixed(2)}`;
    for (let i = 0; i < p.length - 1; i++) {
      const p0 = p[i - 1] || p[i], p1 = p[i], p2 = p[i + 1], p3 = p[i + 2] || p2;
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += `C${c1[0].toFixed(2)},${c1[1].toFixed(2)} ${c2[0].toFixed(2)},${c2[1].toFixed(2)} ${p2[0].toFixed(2)},${p2[1].toFixed(2)}`;
    }
    return d;
  }
  function stepped(p) {
    let d = `M${p[0][0].toFixed(2)},${p[0][1].toFixed(2)}`;
    for (let i = 1; i < p.length; i++) d += `H${p[i][0].toFixed(2)}V${p[i][1].toFixed(2)}`;
    return d;
  }
  function niceTicks(lo, hi, want = 3) {
    const raw = (hi - lo) / want, mag = 10 ** Math.floor(Math.log10(raw));
    const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw);
    const out = [];
    for (let t = Math.ceil(lo / step) * step; t <= hi + 1e-9; t += step) out.push(+t.toFixed(10));
    return out;
  }

  function chart(el, o) {
    const s = o.series, w = el.clientWidth, h = o.h || 260;
    const gut = o.axis ? 64 : 0, pw = w - gut, top = 14, foot = 14;
    const vals = o.ref != null ? [...s, o.ref] : s;
    const lo0 = Math.min(...vals), hi0 = Math.max(...vals), span = hi0 - lo0 || 1;
    const lo = lo0 - span * 0.18, hi = hi0 + span * 0.08;
    const X = (i) => o.step ? (i / s.length) * pw : (i / (s.length - 1)) * pw;
    const Y = (v) => top + ((hi - v) / (hi - lo)) * (h - top - foot);
    let pts = s.map((v, i) => [X(i), Y(v)]);
    if (o.step) pts.push([pw, Y(s[s.length - 1])]);
    const line = o.step ? stepped(pts) : smooth(pts);
    const area = `${line}L${pw},${h}L0,${h}Z`;
    const last = pts[pts.length - 1];
    let ax = "";
    if (o.axis) for (const t of niceTicks(lo0, hi0, 3)) ax += `<text class="ax" x="${w}" y="${(Y(t) + 4).toFixed(1)}" text-anchor="end">${o.fmt(t)}</text>`;
    let ref = "";
    if (o.ref != null) {
      const ry = Y(o.ref).toFixed(1);
      ref = `<line class="avg fadein" x1="0" x2="${pw}" y1="${ry}" y2="${ry}" style="--dl:500ms"/><text class="avg-l fadein" x="8" y="${(+ry + 18).toFixed(1)}" style="--dl:600ms">${esc(o.refLabel)}</text>`;
    }
    el.innerHTML = `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(o.label || "")}">
      <path class="area fadein" d="${area}"/>
      ${ref}
      <line class="base" x1="0" x2="${pw}" y1="${h - 0.5}" y2="${h - 0.5}"/>
      <path class="line draw" pathLength="1" d="${line}"/>
      ${ax}
      <line class="xh" x1="0" x2="0" y1="0" y2="${h}"/>
      <circle class="xd" r="4" cx="0" cy="0"/>
      ${o.dot ? `<circle class="end-ring" cx="${last[0]}" cy="${last[1]}" r="3.5"/><circle class="${o.dot === "ink" ? "end-ink" : "end"} fadein" cx="${last[0]}" cy="${last[1]}" r="3.5" style="--dl:700ms"/>` : ""}
    </svg><div class="chart-tip"></div>`;
    // hover readout
    const xh = el.querySelector(".xh"), xd = el.querySelector(".xd"), tip = el.querySelector(".chart-tip");
    el.onmousemove = (e) => {
      const bx = e.clientX - el.getBoundingClientRect().left;
      if (bx > pw) return el.classList.remove("is-hover");
      const i = Math.max(0, Math.min(s.length - 1, o.step ? Math.floor((bx / pw) * s.length) : Math.round((bx / pw) * (s.length - 1))));
      const x = o.step ? X(i) + pw / s.length / 2 : X(i), y = Y(s[i]);
      xh.setAttribute("x1", x); xh.setAttribute("x2", x);
      xd.setAttribute("cx", x); xd.setAttribute("cy", y);
      tip.textContent = o.fmtTip ? o.fmtTip(s[i]) : o.fmt(s[i]);
      tip.style.left = x + "px";
      el.classList.add("is-hover");
    };
    el.onmouseleave = () => el.classList.remove("is-hover");
  }

  function spark(s, o = {}) {
    const w = o.w || 96, h = o.h || 28, pad = 2;
    const lo = Math.min(...s), hi = Math.max(...s), span = hi - lo || 1;
    const p = s.map((v, i) => [(i / (s.length - 1)) * w, pad + ((hi - v) / span) * (h - pad * 2)]);
    const d = smooth(p);
    return `<svg class="spark" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true">${o.area ? `<path class="area fadein" d="${d}L${w},${h}L0,${h}Z"/>` : ""}<path class="line draw" pathLength="1" d="${d}" style="--dl:${o.delay || 200}ms"/></svg>`;
  }

  /* ── digit roll ── */
  function prepRoll(el) {
    const text = el.textContent, base = +el.dataset.roll || 0;
    // measure each glyph's kerned advance so the rolling figure sits exactly where the settled text will
    const node = el.firstChild, range = document.createRange(), lefts = [];
    for (let k = 0; k < text.length; k++) { range.setStart(node, k); range.setEnd(node, k + 1); lefts.push(range.getBoundingClientRect().left); }
    range.selectNodeContents(el);
    lefts.push(range.getBoundingClientRect().right);
    let i = 0, out = "";
    for (const ch of text) {
      const dl = base + i * 38, w = `width:${(lefts[i + 1] - lefts[i]).toFixed(3)}px`;
      if (/\d/.test(ch)) {
        const n = +ch;
        const strip = Array.from({ length: 10 + n + 1 }, (_, k) => `<span>${k % 10}</span>`).join("");
        out += `<span class="rd" style="${w}"><span class="rd-sz">${ch}</span><span class="rd-strip" style="--n:${10 + n};--dl:${dl}ms">${strip}</span></span>`;
      } else {
        out += `<span class="rc" style="${w};--dl:${dl}ms">${ch === " " ? "&nbsp;" : esc(ch)}</span>`;
      }
      i++;
    }
    el.setAttribute("aria-label", text);
    el.classList.add("roll", "is-rolling");
    el.innerHTML = out;
    // once settled, hand the figure back as plain text
    setTimeout(() => { el.textContent = text; el.classList.remove("roll", "is-rolling"); }, base + i * 38 + 1400);
  }

  /* ── frame ── */
  const ICON = { home: "home", yield: "yield", lend: "lend", trade: "trade", points: "points", docs: "docs" };
  function side(active, sub) {
    const items = AP.nav.filter((n) => n.id !== "docs").map((n) => {
      const on = n.id === active;
      const base = `<a class="nav-item${on ? " is-active" : ""}" href="${n.href}"${on && !sub ? ' aria-current="page"' : ""}>${px(ICON[n.id], { size: 21, led: true })}<span class="grow">${esc(n.label)}</span>${n.children ? `<span class="caret" role="button" aria-label="Hide Prime Yield pages" title="Hide Prime Yield pages">${px("caret", { size: 10 })}</span>` : ""}</a>`;
      if (!n.children) return base;
      return base + `<div class="nav-sub">${n.children.map((c) => `<a href="${c.href}" class="${c.id === sub ? "is-active" : ""}"${c.id === sub ? ' aria-current="page"' : ""}>${esc(c.label)}</a>`).join("")}</div>`;
    }).join("");
    const docs = AP.nav.find((n) => n.id === "docs");
    return `<aside class="side">
      <a class="side-logo" href="home.html" aria-label="Arch Prime home">${px("arch", { size: 20 })}<span>Arch Prime</span></a>
      <nav class="nav" aria-label="Main">${items}
        <span class="nav-item is-disabled" aria-disabled="true" title="${esc(docs.soon)}">${px("docs", { size: 21, led: true })}<span class="grow">${esc(docs.label)}</span><span class="badge is-soon">soon</span></span>
      </nav>
      <div class="side-foot">
        <button class="nav-item" data-theme-toggle aria-label="Switch to ${theme === "dark" ? "light" : "dark"} mode">${px("theme", { size: 14 })}<span class="grow" style="text-align:left">${themeLabel()}</span></button>
        <button class="nav-item" aria-label="Collapse sidebar">${px("collapse", { size: 14 })}<span class="grow" style="text-align:left">Collapse</span></button>
      </div>
    </aside>`;
  }
  function top() {
    return `<header class="top"><span class="mark-o" aria-hidden="true"></span>
      <div class="search" role="button" tabindex="0">${px("search", { size: 14 })}<span>${esc(AP.search)}</span><span class="kbd">⌘K</span></div>
      <div class="top-end">
        <span class="net"><span class="live"></span>${esc(AP.network)}</span>
        <button class="who" aria-label="Accounts"><span class="tile">${px(tileGlyph(AP.account.address), { size: 14 })}</span><span>${esc(AP.account.name)}</span>${px("caret", { size: 10 })}</button>
      </div>
    </header>`;
  }
  function ticker() {
    const one = AP.ticker.map((t) => `<span class="tk"><b>${esc(t.sym)}</b><span>${esc(t.value)}</span><em class="${t.dir ? dir(t.dir) : ""}">${esc(t.move)}</em></span>`).join("");
    return `<div class="ticker" aria-label="Markets"><span class="live is-orange"></span><div class="ticker-track"><div class="ticker-set">${one}</div><div class="ticker-set" aria-hidden="true">${one}</div></div></div>`;
  }

  function page({ active, sub, title, html, withTicker, after }) {
    document.title = `${title} · Arch Prime`;
    const app = document.createElement("div");
    app.className = "app";
    app.innerHTML = `${side(active, sub)}<div class="main">${top()}${withTicker ? ticker() : ""}<main class="page">${html}</main></div>
      <svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><linearGradient id="fade" x1="0" y1="0" x2="0" y2="1"><stop class="fade-0" offset="0"/><stop class="fade-1" offset="1"/></linearGradient></defs></svg>`;
    document.body.prepend(app);
    app.querySelector("[data-theme-toggle]").addEventListener("click", () => setTheme(theme === "dark" ? "light" : "dark"));
    const go = () => {
      if (after) after();
      if (still) { document.documentElement.classList.add("is-in"); return; }
      document.querySelectorAll("[data-roll]").forEach(prepRoll);
      requestAnimationFrame(() => requestAnimationFrame(() => document.documentElement.classList.add("is-in")));
    };
    document.fonts && document.fonts.ready ? document.fonts.ready.then(go) : go();
  }

  window.P = { AP, px, mark, btn, seg, tabs, badge, rows, dir, move, led, gauge, chart, spark, esc, page, still };
})();
