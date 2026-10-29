/* Arch Prime — Direction B "Night". Shell, pixel icons, charts and motion shared by every page. */
(() => {
  const AP = window.AP;
  const qs = new URLSearchParams(location.search);
  const still = qs.has("still");
  if (still) document.documentElement.classList.add("still");
  // Theme: ?theme= forces it (screenshots), else the saved choice, else Night.
  const THEME_KEY = "arch-prime-b-theme";
  const saved = (() => { try { return localStorage.getItem(THEME_KEY); } catch { return null; } })();
  const forced = qs.get("theme");
  let theme = forced === "light" || forced === "dark" ? forced : saved === "light" ? "light" : "dark";
  document.documentElement.dataset.theme = theme;

  // 7×7 LED glyphs. "." unlit cell, "#" lit cell, "o" orange accent cell.
  const G = {
    logo: ["....o....", "...###...", "...#.#...", "..##.##..", "..#...#..", ".##...##.", ".#.....#.", "##.....##", "#.......#"],
    home: ["...o...", "..###..", ".#####.", "#######", ".#...#.", ".#...#.", ".#####."],
    yield: ["......o", "......#", "....#.#", "....#.#", "..#.#.#", "..#.#.#", "#.#.#.#"],
    lend: ["##....o", "##...#.", "....#..", "...#...", "..#....", ".#...##", "#....##"],
    trade: [".....#.", "######o", ".....#.", ".......", ".#.....", "#######", ".#....."],
    points: ["...#...", "...#...", "#######", ".##o##.", "..###..", ".##.##.", "##...##"],
    docs: ["#####..", "#...##.", "#...###", "#.....#", "#.##o.#", "#.....#", "#######"],
    deposit: ["...#...", "...#...", ".#.#.#.", "..###..", "...o...", "#.....#", "#######"],
    withdraw: ["...o...", "..###..", ".#.#.#.", "...#...", "...#...", "#.....#", "#######"],
    transfer: ["..####o", ".....##", "....#.#", "...#..#", "..#....", ".#.....", "#......"],
    move: ["#......", "#...#..", "#....#.", "#.####o", "#....#.", "#...#..", "#......"],
    share: [".....#o", "....###", "..##...", "##.....", "..##...", "....###", ".....##"],
    copy: ["####...", "#..#...", "#.#####", "###...#", "..#...#", "..#...#", "..####o"],
    external: ["...###o", ".....##", "....#.#", "#..#...", "#.#....", "#......", "#####.."],
    search: [".###...", "#...#..", "#...#..", "#...#..", ".####..", ".....#.", "......o"],
    chevron: [".......", "..#....", "...#...", "....#..", "...#...", "..#....", "......."],
    caret: [".......", ".......", "#.....#", ".#...#.", "..#.#..", "...#...", "......."],
    theme: ["..###..", ".##..#.", "###...#", "###...o", "###...#", ".##..#.", "..###.."],
    collapse: ["#######", "#.#...#", "#.#.#.#", "#.#o..#", "#.#.#.#", "#.#...#", "#######"],
    close: ["#.....#", ".#...#.", "..#.#..", "...#...", "..#.#..", ".#...#.", "#.....#"],
    flip: [".#.....", "###..#.", ".#...#.", ".#...#.", ".#...#.", ".#..###", ".....#."],
    columns: ["..#....", "#.#.###", "..#....", ".......", "....#..", "###.#.#", "....o.."],
    arrow: ["..#..", "...#.", "####o", "...#.", "..#.."],
    btc: [".####..", ".#...#.", ".#...#.", ".####..", ".#...#.", ".#...#.", ".####.."],
    usd: ["...#...", ".#####.", ".#.#...", ".#####.", "...#.#.", ".#####.", "...#..."],
    primeBTC: [".####.o", ".#...#.", ".#...#.", ".####..", ".#...#.", ".#...#.", ".####.."],
    primeUSD: ["...#..o", ".#####.", ".#.#...", ".#####.", "...#.#.", ".#####.", "...#..."],
    tileMain: [".#.#.", "#####", "#.o.#", "#####", ".#.#."],
    tileSavings: ["#...#", ".###.", ".#o#.", ".###.", "#...#"],
    tileAll: ["##.##", "##.##", "..o..", "##.##", "##.##"],
  };
  const MARK = { BTC: "btc", USD: "usd", primeBTC: "primeBTC", primeUSD: "primeUSD" };
  const TILE = { "All accounts": "tileAll", Main: "tileMain", Savings: "tileSavings" };
  const NAV_ICON = { home: "home", yield: "yield", lend: "lend", trade: "trade", points: "points", docs: "docs" };

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  function px(name, cls = "") {
    const g = G[name];
    if (!g) return "";
    const h = g.length, w = g[0].length;
    let u = "", l = "";
    g.forEach((row, y) => [...row].forEach((ch, x) => {
      const r = `<rect x="${x + 0.1}" y="${y + 0.1}" width=".8" height=".8" rx=".14"`;
      if (ch === ".") u += r + "/>";
      else l += r + (ch === "o" ? ' class="a"/>' : "/>");
    }));
    return `<svg class="px ${cls}" viewBox="0 0 ${w} ${h}" aria-hidden="true"><g class="u">${u}</g><g class="l">${l}</g></svg>`;
  }
  const mark = (sym, cls = "") => `<span class="mark glow ${cls}">${px(MARK[sym] || "usd")}</span>`;
  const tile = (name) => `<span class="tile glow">${px(TILE[name] || "tileMain")}</span>`;

  // Buttons
  function btn(label, kind = "s", o = {}) {
    const cls = `btn btn-${kind} ${o.size ? "btn-" + o.size : ""} ${o.cls || ""}`;
    const ic = o.icon ? px(o.icon) : "";
    const attrs = `${o.title ? ` title="${esc(o.title)}"` : ""}${o.disabled ? " disabled" : ""}`;
    if (kind === "p") return `<button class="${cls}"${attrs}><span>${esc(label)}</span><span class="disc">${px("arrow")}</span></button>`;
    return `<button class="${cls}"${attrs}>${ic}<span>${esc(label)}</span></button>`;
  }
  const ibtn = (icon, label, cls = "") => `<button class="ibtn ${cls}" aria-label="${esc(label)}" title="${esc(label)}">${px(icon)}</button>`;
  const seg = (items, on, cls = "", aria = "") => `<div class="seg ${cls}" role="tablist"${aria ? ` aria-label="${esc(aria)}"` : ""}>${items.map((t) => `<button class="${t === on ? "on" : ""}">${esc(t)}</button>`).join("")}</div>`;
  function tabs(items, on) {
    return `<div class="tabs" role="tablist">${items.map((t) => {
      const m = / · soon$/.exec(t);
      if (m) return `<span class="tab off">${esc(t.replace(m[0], ""))}<span class="badge soon">soon</span></span>`;
      return `<button class="tab ${t === on ? "on" : ""}">${esc(t)}</button>`;
    }).join("")}</div>`;
  }
  const badge = (word) => {
    const k = { Healthy: "ok", Watch: "watch", "At risk": "risk" }[word] || "";
    return `<span class="badge ${k}"><i></i>${esc(word)}</span>`;
  };
  const dir = (d) => (d === "up" ? "up" : d === "down" ? "down" : "faint");
  const chev = () => `<span class="chev">${px("chevron")}</span>`;
  const roll = (v, cls = "") => `<span class="${cls}" data-roll>${esc(v)}</span>`;
  // "$21,902.10" → whole part + muted cents
  const money = (v) => {
    const m = /^(.*?)(\.\d+)$/.exec(v);
    return m ? `<span data-roll>${esc(m[1])}</span><span class="c" data-roll>${esc(m[2])}</span>` : `<span data-roll>${esc(v)}</span>`;
  };
  function led(pct, n = 20, cls = "") {
    const lit = Math.round((pct / 100) * n);
    return `<span class="led ${cls}" aria-hidden="true">${Array.from({ length: n }, (_, i) => `<i class="${i < lit ? "on" : ""}" style="--i:${i}"></i>`).join("")}</span>`;
  }

  // Health gauge: an arc of LED segments
  function gauge(score, word, size = 220) {
    const N = 29, lit = Math.round((score / 100) * N), cx = 100, cy = 100, R = 90, L = 15, W = 4.6;
    let segs = "";
    for (let i = 0; i < N; i++) {
      const a = 180 + (i * 180) / (N - 1);
      const on = i < lit;
      segs += `<rect class="${on ? "seg-l" : "seg-u"}" style="--i:${i}" x="${cx + R - L}" y="${cy - W / 2}" width="${L}" height="${W}" rx="1.4" transform="rotate(${a.toFixed(2)} ${cx} ${cy})"/>`;
    }
    const k = { Healthy: "var(--up)", Watch: "var(--watch)", "At risk": "var(--down)" }[word] || "var(--up)";
    return `<div class="gauge" style="width:${size}px" role="img" aria-label="Health ${score}, ${esc(word)}">
      <svg viewBox="0 0 200 104"><g style="filter:var(--bloom-soft)">${segs}</g></svg>
      <div class="gauge-v"><span class="big num" data-roll>${score}</span><span class="w"><i style="background:${k};box-shadow:0 0 var(--dot-glow) ${k}"></i>${esc(word)}</span></div>
    </div>`;
  }

  // Charts
  const charts = [];
  const chart = (cfg) => { charts.push(cfg); return `<div class="chart" data-c="${charts.length - 1}" style="height:${cfg.h}px"></div>`; };

  function niceTicks(lo, hi, count = 4) {
    const raw = (hi - lo) / count, mag = 10 ** Math.floor(Math.log10(raw)), f = raw / mag;
    const step = (f < 1.5 ? 1 : f < 3 ? 2 : f < 7 ? 5 : 10) * mag;
    const out = [];
    for (let v = Math.ceil(lo / step) * step; v <= hi + 1e-9; v += step) out.push(+v.toFixed(10));
    return out;
  }
  function smooth(p) {
    const n = p.length;
    if (n < 3) return "M" + p.map((q) => q.join(",")).join("L");
    const dx = [], m = [], t = [];
    for (let i = 0; i < n - 1; i++) { dx[i] = p[i + 1][0] - p[i][0]; m[i] = (p[i + 1][1] - p[i][1]) / dx[i]; }
    t[0] = m[0]; t[n - 1] = m[n - 2];
    for (let i = 1; i < n - 1; i++) t[i] = m[i - 1] * m[i] <= 0 ? 0 : (3 * (dx[i - 1] + dx[i])) / ((2 * dx[i] + dx[i - 1]) / m[i - 1] + (dx[i] + 2 * dx[i - 1]) / m[i]);
    let d = `M${p[0][0].toFixed(2)},${p[0][1].toFixed(2)}`;
    for (let i = 0; i < n - 1; i++) {
      const [x0, y0] = p[i], [x1, y1] = p[i + 1], h = dx[i] / 3;
      d += `C${(x0 + h).toFixed(2)},${(y0 + t[i] * h).toFixed(2)} ${(x1 - h).toFixed(2)},${(y1 - t[i + 1] * h).toFixed(2)} ${x1.toFixed(2)},${y1.toFixed(2)}`;
    }
    return d;
  }
  let uid = 0;
  function drawChart(el, c) {
    const W = el.clientWidth, H = c.h, id = "c" + ++uid;
    const s = c.series, n = s.length;
    const axisW = c.axis ? 64 : 0, padL = c.padL ?? 0, padT = c.padT ?? 18, padB = c.padB ?? 18;
    let lo = Math.min(...s, c.avg ?? Infinity), hi = Math.max(...s, c.avg ?? -Infinity);
    const span = hi - lo || 1;
    lo -= span * (c.padLo ?? 0.18); hi += span * (c.padHi ?? 0.12);
    const plotW = W - axisW - padL - (c.padR ?? 0);
    const step = c.step ? plotW / n : 0;
    const x = (i) => padL + (c.step ? i * step : (i / (n - 1)) * plotW);
    const y = (v) => padT + (1 - (v - lo) / (hi - lo)) * (H - padT - padB);
    let line, endX, endY;
    if (c.step) {
      line = `M${x(0).toFixed(2)},${y(s[0]).toFixed(2)}`;
      s.forEach((v, i) => { if (i) line += `V${y(v).toFixed(2)}`; line += `H${(x(i) + step).toFixed(2)}`; });
      endX = x(n - 1) + step; endY = y(s[n - 1]);
    } else {
      line = smooth(s.map((v, i) => [x(i), y(v)]));
      endX = x(n - 1); endY = y(s[n - 1]);
    }
    const area = `${line}L${endX.toFixed(2)},${H}L${x(0).toFixed(2)},${H}Z`;
    let grid = "", axis = "";
    if (c.axis) {
      niceTicks(lo, hi, c.ticks || 4).forEach((v) => {
        const yy = y(v);
        if (yy < 8 || yy > H - 8) return;
        grid += `<line x1="${padL}" x2="${W - axisW + 8}" y1="${yy.toFixed(1)}" y2="${yy.toFixed(1)}"/>`;
        axis += `<text class="ax" x="${W - 8}" y="${(yy + 4).toFixed(1)}" text-anchor="end">${esc(c.axis(v))}</text>`;
      });
    }
    let avg = "";
    if (c.avg != null) {
      const ya = y(c.avg), label = c.avgLabel;
      avg = `<g class="fall"><line class="avg" x1="${padL}" x2="${(padL + plotW).toFixed(1)}" y1="${ya.toFixed(1)}" y2="${ya.toFixed(1)}"/>
        <rect class="avg-bg" x="${(padL + 14).toFixed(1)}" y="${(ya - 12).toFixed(1)}" width="${label.length * 6.1 + 18}" height="24" rx="12"/>
        <text class="avg-t" x="${(padL + 23).toFixed(1)}" y="${(ya + 4).toFixed(1)}">${esc(label)}</text></g>`;
    }
    const stopTop = c.fill ?? 0.17;
    el.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" aria-label="${esc(c.label || "")}" role="img">
      <defs>
        <linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--area);stop-opacity:calc(${stopTop} * var(--area-k))"/><stop offset=".55" style="stop-color:var(--area);stop-opacity:calc(${stopTop * 0.3} * var(--area-k))"/><stop offset="1" style="stop-color:var(--area);stop-opacity:0"/></linearGradient>
        <filter id="${id}b" x="-10%" y="-60%" width="120%" height="220%"><feGaussianBlur stdDeviation="5"/></filter>
      </defs>
      <g class="grid">${grid}</g>${axis}
      <path class="fall" d="${area}" fill="url(#${id}g)"/>
      ${avg}
      <path class="ln-glow draw" d="${line}" pathLength="1" filter="url(#${id}b)"/>
      <path class="ln draw" d="${line}" pathLength="1"/>
      <g class="end" transform="translate(${endX.toFixed(2)} ${endY.toFixed(2)})"><circle class="halo" r="${c.dot ?? 11}"/><circle class="dot" r="${(c.dot ?? 11) / 3}"/></g>
    </svg>`;
  }
  // Fixed-size sparkline, rendered inline
  function spark(series, w = 104, h = 30, o = {}) {
    const n = series.length, lo = Math.min(...series), hi = Math.max(...series), sp = hi - lo || 1, id = "s" + ++uid;
    const pts = series.map((v, i) => [2 + (i / (n - 1)) * (w - 6), 3 + (1 - (v - lo) / sp) * (h - 6)]);
    const d = smooth(pts), [ex, ey] = pts[n - 1];
    return `<svg class="spark chart-inline" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true">
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--area);stop-opacity:calc(${o.fill ?? 0.14} * var(--area-k))"/><stop offset="1" style="stop-color:var(--area);stop-opacity:0"/></linearGradient></defs>
      <path class="fall" d="${d}L${ex.toFixed(2)},${h}L2,${h}Z" fill="url(#${id})"/>
      <path class="ln draw" d="${d}" pathLength="1"/>
      <circle class="end dot" cx="${ex.toFixed(2)}" cy="${ey.toFixed(2)}" r="2.2"/>
    </svg>`;
  }

  // Frame
  function side(active) {
    const parentOf = { "prime-btc": "yield", "prime-usd": "yield" };
    const items = AP.nav.map((n) => {
      const ic = px(NAV_ICON[n.id]);
      if (n.soon) return `<span class="nav-i off dim" title="${esc(n.soon)}" aria-disabled="true">${ic}<span>${esc(n.label)}</span><span class="nav-soon">soon</span></span>`;
      const on = n.id === active, parent = parentOf[active] === n.id;
      const cls = on ? "on glow" : parent ? "parent glow" : "dim";
      let h = `<a class="nav-i ${cls}" href="${n.href}"${on ? ' aria-current="page"' : ""}>${ic}<span>${esc(n.label)}</span>${n.children ? `<span class="tog" aria-label="Hide Prime Yield pages" title="Hide Prime Yield pages">${px("caret")}</span>` : ""}</a>`;
      if (n.children) h += `<div class="nav-sub">${n.children.map((c) => `<a href="${c.href}" class="${c.id === active ? "on" : ""}"${c.id === active ? ' aria-current="page"' : ""}>${esc(c.label)}</a>`).join("")}</div>`;
      return h;
    }).join("");
    return `<aside class="side"><div class="side-in">
      <a class="logo glow" href="home.html" aria-label="Arch Prime home">${px("logo")}<b>Arch Prime</b></a>
      <nav class="nav">${items}</nav>
      <div class="side-foot">
        <button class="nav-i dim" data-theme-toggle aria-label="${theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}">${px("theme")}<span>${theme === "dark" ? "Light mode" : "Dark mode"}</span></button>
        <button class="nav-i dim" aria-label="Collapse sidebar">${px("collapse")}<span>Collapse</span></button>
      </div>
    </div></aside>`;
  }
  const top = () => `<header class="top">
      <label class="search">${px("search")}<span>${esc(AP.search)}</span><kbd>⌘K</kbd></label>
      <button class="acct" aria-label="Accounts">${tile(AP.account.name)}<span>${esc(AP.account.name)}</span><span class="caret">${px("caret")}</span></button>
    </header>`;
  function ticker() {
    const one = AP.ticker.map((t) => `<span class="tk"><span class="s">${esc(t.sym)}</span><span class="v">${esc(t.value)}</span><span class="m ${t.dir || ""}">${esc(t.move)}</span></span><span class="tk-sep"></span>`).join("");
    return `<div class="ticker" aria-label="Markets"><div class="ticker-track">${one}${one}</div></div>`;
  }
  const defs = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>
    <filter id="nb-bloom" x="-60%" y="-60%" width="220%" height="220%" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceGraphic" stdDeviation=".42" result="b"/><feColorMatrix in="b" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 .9 0"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="nb-bloom-soft" x="-20%" y="-30%" width="140%" height="160%" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceGraphic" stdDeviation="2.4" result="b"/><feColorMatrix in="b" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 .7 0"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    <filter id="nb-dot" x="-300%" y="-300%" width="700%" height="700%"><feGaussianBlur stdDeviation="3"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs></svg>`;

  function rollEl(el) {
    const txt = el.textContent;
    el.setAttribute("aria-label", txt);
    el.innerHTML = [...txt].map((ch, k) => /\d/.test(ch)
      ? `<span class="rd" aria-hidden="true"><span class="ph">${ch}</span><span class="rc" style="--n:${ch};--k:${k}">${"0123456789".split("").map((d) => `<span>${d}</span>`).join("")}</span></span>`
      : `<span aria-hidden="true">${esc(ch)}</span>`).join("");
  }

  function mount() {
    document.querySelectorAll("[data-c]").forEach((el) => drawChart(el, charts[+el.dataset.c]));
    document.querySelectorAll(".rise").forEach((el, i) => el.style.setProperty("--i", i));
    document.querySelectorAll("[data-theme-toggle]").forEach((b) => b.addEventListener("click", () => {
      theme = theme === "dark" ? "light" : "dark";
      document.documentElement.dataset.theme = theme;
      try { localStorage.setItem(THEME_KEY, theme); } catch {}
      b.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
      b.querySelector("span").textContent = theme === "dark" ? "Light mode" : "Dark mode";
    }));
    const head = document.querySelector(".phead");
    if (head) {
      const onScroll = () => head.classList.toggle("stuck", window.scrollY > 70);
      addEventListener("scroll", onScroll, { passive: true });
    }
    if (still) return;
    const rolls = [...document.querySelectorAll("[data-roll]")];
    rolls.forEach(rollEl);
    requestAnimationFrame(() => requestAnimationFrame(() => rolls.forEach((el) => el.classList.add("go"))));
  }

  function page(active, html, o = {}) {
    document.title = `${o.title || "Arch Prime"} · Arch Prime`;
    document.body.insertAdjacentHTML("afterbegin", `${defs}<div class="app">${side(active)}<div class="main">${top()}${o.ticker ? ticker() : ""}<main class="page">${html}</main></div></div>`);
    const go = () => mount();
    document.fonts && document.fonts.ready ? document.fonts.ready.then(go) : go();
  }

  window.NB = { AP, still, px, mark, tile, btn, ibtn, seg, tabs, badge, dir, chev, roll, money, led, gauge, chart, spark, page, esc, G };
})();
