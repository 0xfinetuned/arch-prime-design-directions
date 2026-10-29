// Lumen: the app frame and the six pages, rendered from window.AP.
(function () {
  const AP = window.AP;
  const { led, icon, plot, strip, dial } = window.LED;
  const root = document.documentElement;
  const page = document.body.dataset.page;

  /* ---------- small parts ---------- */
  const btn = (label, kind = "secondary", ico, extra = "") => {
    const lead = ico ? `<span class="b-ico">${icon(ico, 14)}</span>` : "";
    const disc = kind === "primary" ? `<span class="disc">${icon("arrow", 16)}</span>` : "";
    return `<button class="btn btn-${kind}" type="button" ${extra}>${lead}<span>${label}</span>${disc}</button>`;
  };
  const iconBtn = (ico, label) => `<button class="btn-icon" type="button" aria-label="${label}" title="${label}">${icon(ico, 16)}</button>`;
  const seg = (items, on, cls = "") => `<div class="seg ${cls}" role="tablist">${items.map((t) => `<button type="button" role="tab" class="${t === on ? "on" : ""}" aria-selected="${t === on}">${t}</button>`).join("")}</div>`;
  const mark = (sym, size = 30) => {
    const prime = sym.startsWith("prime");
    const base = sym.includes("BTC") ? "BTC" : "USD";
    return `<span class="mk ${prime ? "mk-prime" : ""} mk-${base.toLowerCase()}" style="--s:${size}px">${icon(base, Math.round(size * 0.56), { accent: false })}${prime ? `<i class="mk-dot"></i>` : ""}</span>`;
  };
  const dirClass = (d) => (d === "up" ? "up" : d === "down" ? "down" : "flat");
  const panel = (cls, inner, attrs = "") => `<section class="panel ${cls}" ${attrs}>${inner}</section>`;
  const head = (title, end = "", lead = "") => `<header class="ph"><h2 class="pt">${lead}${title}</h2>${end ? `<div class="ph-end">${end}</div>` : ""}</header>`;
  const kv = (k, v, cls = "") => `<div class="kv ${cls}"><dt>${k}</dt><dd>${v}</dd></div>`;
  const badge = (word, tone) => `<span class="badge b-${tone}"><i></i>${word}</span>`;

  /* ---------- frame ---------- */
  const activeOf = { home: "home", products: "yield", "prime-btc": "yield", lend: "lend", trade: "trade" };
  function sidebar() {
    const cur = activeOf[page];
    const items = AP.nav.map((n) => {
      const on = n.id === cur;
      if (n.soon) {
        return `<span class="vt is-soon" aria-disabled="true" title="${n.soon}"><span class="vt-ico">${icon(n.id, 18, { field: true })}</span><span class="vt-label">${n.label}</span><span class="soon">soon</span></span>`;
      }
      const sub = n.children
        ? `<button class="vt-fold" type="button" aria-label="Hide Prime Yield pages" aria-expanded="true">${icon("caret", 14)}</button></div><div class="vt-sub">${n.children
            .map((c) => `<a class="vs ${c.id === page ? "on" : ""}" href="${c.href}"><i></i>${c.label}</a>`)
            .join("")}</div>`
        : "</div>";
      return `<div class="vt-row"><a class="vt ${on ? "on" : ""}" href="${n.href}" ${on ? 'aria-current="page"' : ""}><span class="vt-ico">${icon(n.id, 18, { field: true })}</span><span class="vt-label">${n.label}</span></a>${sub}`;
    });
    return `<aside class="side" aria-label="Main navigation">
      <a class="brand" href="home.html" aria-label="Arch Prime home"><span class="brand-mark">${icon("logo", 22, { field: true })}</span><span class="brand-word">Arch Prime</span></a>
      <nav class="vtabs">${items.join("")}</nav>
      <div class="side-foot">
        <button class="vt foot-btn" type="button" data-theme-toggle><span class="vt-ico">${icon("theme", 18, { field: true })}</span><span class="vt-label" data-theme-label></span><span class="switch" aria-hidden="true"><i></i><i></i><i></i></span></button>
        <button class="vt foot-btn" type="button" data-collapse aria-label="Collapse sidebar"><span class="vt-ico">${icon("collapse", 18, { field: true })}</span><span class="vt-label">Collapse</span></button>
      </div>
    </aside>`;
  }
  function topbar() {
    return `<header class="top">
      <label class="search">${icon("search", 16)}<input type="search" placeholder="${AP.search}" aria-label="${AP.search}"><kbd>⌘K</kbd></label>
      <div class="top-end">
        <span class="net"><i class="live"></i>${AP.network}</span>
        <button class="acct" type="button" aria-haspopup="menu"><span class="acct-tile">${icon("logo", 16)}</span><span class="acct-name">${AP.account.name}</span>${icon("caret", 14)}</button>
      </div>
    </header>`;
  }

  /* ---------- Home ---------- */
  function home() {
    const H = AP.home;
    const acts = H.actions.map((a) => (a === "Deposit" ? btn(a, "primary") : btn(a, "secondary", { Transfer: "transfer", "Move funds": "move", Withdraw: "withdraw" }[a]))).join("");
    const chanTone = { holdings: "amber", borrowing: "lilac", available: "sage" };
    const cols = H.columns
      .map((c, i) => `<button class="chan ch-${chanTone[c.id]} ${i === 0 ? "on" : ""}" type="button" ${c.disabled ? `aria-disabled="true" title="${c.disabled}"` : ""} aria-pressed="${i === 0}">
        <span class="chan-h"><i class="chan-led"></i>${c.title}</span>
        <dl>${c.rows.map(([k, v]) => kv(k, v)).join("")}</dl></button>`)
      .join("");
    const value = panel("p-value", `
      <div class="pv-head">
        <div class="label"><i class="live"></i>${H.label}</div>
        <div class="pv-actions">${acts}</div>
      </div>
      <div class="hero">${led(H.value, { p: 9, tone: "amber" })}</div>
      <div class="pv-line">
        <span class="chg up">${H.change.usd}</span><span class="chg up">${H.change.pct}</span>
        ${btn("Share", "ghost", "share")}
        <span class="grow"></span>
        ${seg(H.ranges, H.range)}
      </div>
      ${plot(H.series, { cols: 116, rows: 30, p: 6, tone: "amber", fmt: "usd", axis: "usdK", label: "Account value, 1W" })}
      <div class="chans">${cols}</div>`, `aria-label="${H.label}"`);

    const rows = H.assets
      .map((a) => `<a class="row" href="#">
        <span class="c-asset">${mark(a.sym)}<span><b>${a.name}</b><small>${a.amount}</small></span></span>
        <span class="c-spark">${plot(a.spark, { cols: 30, rows: 9, p: 3.4, tone: a.dir === "down" ? "rose" : "sage", marker: false, label: "7 days" })}</span>
        <span class="c-num ${dirClass(a.dir)}">${a.d24}</span>
        <span class="c-num earn">${a.earning}</span>
        <span class="c-num strong">${a.value}</span>
        <span class="c-chev">${icon("chevron", 14)}</span></a>`)
      .join("");
    const lists = panel("p-lists", `
      <header class="ph">
        <div class="tabs" role="tablist">${H.tabs.map((t, i) => { const soon = t.includes("soon"); return `<button type="button" role="tab" class="${i === 0 ? "on" : ""}" ${soon ? 'aria-disabled="true"' : ""}>${soon ? `${t.split(" · ")[0]} <span class="soon">soon</span>` : t}</button>`; }).join("")}</div>
        <div class="ph-end">${iconBtn("settings", "Columns")}</div>
      </header>
      <div class="board assets">
        <div class="row hd">${H.assetColumns.map((c, i) => `<span class="${i > 1 ? "c-num" : ""}">${c}</span>`).join("")}<span></span></div>
        ${rows}
      </div>`);

    const R = H.risk;
    const risk = panel("p-risk", `
      ${head(`<a href="#" class="pt-link">Risk ${icon("chevron", 12)}</a>`, badge(R.word, "sage"))}
      <div class="face">${dial(R.score, { size: 196, p: 7, tone: "sage" })}<div class="face-c">${led(String(R.score), { p: 6, tone: "ink" })}<span>Health</span></div></div>
      <dl class="list">${R.rows.map(([k, v]) => kv(k, v)).join("")}</dl>`, 'id="risk"');
    const accts = panel("p-accts", `
      ${head("Accounts")}
      <div class="radios" role="radiogroup">${AP.account.accounts.map((a) => `<label class="radio ${a.name === AP.account.name ? "on" : ""}"><input type="radio" name="acct" ${a.name === AP.account.name ? "checked" : ""}><i class="rd"></i><span><b>${a.name}</b><small>${a.line}</small></span><em>${a.net}</em></label>`).join("")}</div>
      <button class="add" type="button">${icon("plus", 12)}Add sub-account</button>`);
    const B = H.boost;
    const boost = panel("p-boost glow", `
      <div class="boost-top">${mark("primeBTC", 36)}<h3>${B.title}</h3></div>
      <p>${B.body}</p>${btn(B.cta, "primary")}`);
    return `<h1 class="sr">Home</h1><div class="g-home"><div class="g-main">${value}${lists}</div><aside class="g-rail" aria-label="Risk and accounts">${risk}${accts}${boost}</aside></div>`;
  }

  /* ---------- Prime Yield ---------- */
  function products() {
    const P = AP.products, Y = P.yours;
    const rows = Y.rows
      .map((r) => `<a class="row" href="${r.sym === "primeBTC" ? "prime-btc.html" : "#"}">
        <span class="c-asset">${mark(r.sym)}<span><b>${r.sym}</b><small>${r.asset}</small></span></span>
        <span class="c-num earn">${r.apy}</span><span class="c-num dim">${r.boost}</span>
        <span class="c-num strong">${r.balance}</span><span class="c-num ${dirClass(r.dir)}">${r.d24}</span>
        <span class="c-num">${r.earned}</span><span class="c-act">${btn(r.action, "secondary", "withdraw")}</span></a>`)
      .join("");
    const tones = ["amber", "amber", "sage"];
    const yours = panel("p-yours", `
      ${head("Your products")}
      <div class="figs">${Y.summary.map(([k, v], i) => `<div class="figbox"><span class="label">${k}</span>${led(v, { p: 4.5, tone: tones[i], delay: i * 120 })}</div>`).join("")}</div>
      <div class="board yours-t">
        <div class="row hd">${Y.columns.map((c, i) => `<span class="${i ? "c-num" : ""}">${c}</span>`).join("")}</div>
        ${rows}
      </div>`);
    const range = P.range.map(([k, v], i) => panel("p-range widget", `<span class="label">${k}</span>${led(v, { p: 11, tone: "hot", delay: 200 + i * 160 })}<span class="w-led">${icon(i ? "yield" : "points", 14)}</span>`)).join("");
    const cards = P.all
      .map((c, i) => panel("p-card", `
        <header class="pc-head">${mark(c.sym, 40)}<span><b>${c.sym}</b><small>${c.asset}</small></span>${iconBtn("chevron", `Open ${c.sym}`)}</header>
        <div class="pc-body">
          <div><span class="label">APY</span>${led(c.apy, { p: 9, tone: "hot", delay: 300 + i * 160 })}</div>
          <div class="pc-spark"><span class="label">Last 30 days</span>${plot(c.nav, { cols: 52, rows: 13, p: 5, tone: "amber", label: "Last 30 days" })}</div>
        </div>
        <dl class="list">${kv("Total deposited", c.tvl)}${kv("Boost up to", c.boostUpTo)}${kv(c.apyAt[0], c.apyAt[1], "hot")}</dl>
        <div class="pc-cta">${btn("Deposit", "primary")}${btn("Boost", "secondary", "yield")}</div>`))
      .join("");
    return `<h1 class="sr">Prime Yield</h1>
      <div class="g-products">${yours}<div class="ranges">${range}</div></div>
      <div class="sec-h"><h2>All products</h2><div class="sec-end"><span class="muted">Show products as</span>${seg(["Cards", "List"], "Cards")}</div></div>
      <div class="g-cards">${cards}</div>`;
  }

  /* ---------- primeBTC ---------- */
  function primeBtc() {
    const P = AP.primeBtc, card = AP.products.all[0];
    const headFigs = P.head.map(([k, v, m], i) => `<div class="hf"><span class="label">${k}</span><div class="hf-v">${led(v, { p: 5, tone: i ? "ink" : "hot", delay: i * 120 })}<span class="chg up">${m}</span></div></div>`).join("");
    const top = `<div class="phead">
      <div class="phead-id">${mark("primeBTC", 52)}<div><h1>${P.name}</h1><div class="kpis"><span>${card.apy} APY</span><span>${card.tvl} Deposited</span></div></div></div>
      <div class="hfs">${headFigs}</div>
      <button class="btn btn-secondary vault" type="button"><span>Vault</span>${icon("caret", 14)}</button>
      <div class="tabs phead-tabs" role="tablist">${P.tabs.map((t, i) => `<button type="button" role="tab" class="${i ? "" : "on"}">${t}</button>`).join("")}</div>
    </div>`;
    const chart = panel("p-chart", `
      <header class="ph">${seg(P.chartTabs, "APY", "seg-metric")}<div class="ph-end">${seg(P.ranges, "1M")}</div></header>
      ${plot(P.apySeries, { cols: 108, rows: 54, p: 6.4, step: true, avg: P.avg30, avgLabel: `30-day avg · ${P.avg30}%`, tone: "hot", fmt: "pct", axis: "pct", label: "APY, 1M" })}
      <div class="legend"><span><i class="lg-on"></i>APY</span><span><i class="lg-avg"></i>30-day avg</span></div>
      <dl class="stats">${P.stats.map(([k, v]) => `<div><dt>${k}${icon("info", 12)}</dt><dd>${v}</dd></div>`).join("")}</dl>`);
    const offer = (o, i) => panel(`p-offer ${i ? "glow" : ""}`, `
      <header class="ph"><h2 class="pt">${o.title}</h2>${o.badge ? `<div class="ph-end">${badge(o.badge, "amber")}</div>` : ""}</header>
      <div class="offer-hero">${led(o.hero, { p: 8, tone: "hot", delay: 200 + i * 200 })}<span class="unit-l">${o.heroUnit}</span></div>
      <div class="yr"><div class="yr-row"><span>${o.rowLabel}</span><b class="up">${o.rowValue}</b></div>${strip(i ? 100 : (6.8 / 14.9) * 100, { n: 40, p: 6.6, tone: i ? "hot" : "amber" })}</div>
      ${btn(o.cta, "primary")}`);
    const acc = panel("p-disc", P.disclosure
      .map((d, i) => `<div class="acc ${i === 0 ? "open" : ""}">
        <button class="acc-h" type="button" aria-expanded="${i === 0}"><span class="acc-t"><i></i>${d.title}</span>${d.head.map(([k, v]) => `<span class="acc-f"><small>${k}</small><b class="${v === "Fresh" ? "up" : ""}">${v}</b></span>`).join("")}<span class="acc-chev">${icon("caret", 14)}</span></button>
        ${i === 0 ? `<div class="acc-b"><div><h4>Reported by the manager</h4><dl class="list">${kv("NAV per share", P.head[1][1])}${kv(d.head[0][0], d.head[0][1])}${kv(d.head[1][0], `<span class="up">${d.head[1][1]}</span>`)}${kv(d.head[2][0], d.head[2][1])}</dl></div><div><h4>Recent NAV</h4>${plot(card.nav, { cols: 64, rows: 11, p: 5, tone: "amber", fmt: "nav", label: "Recent NAV" })}</div></div>` : ""}
      </div>`)
      .join(""));
    return `${top}<div class="g-prime"><div class="g-main">${chart}</div><aside class="g-rail">${offer(P.hold, 0)}${offer(P.boost, 1)}</aside></div>${acc}`;
  }

  /* ---------- Trade ---------- */
  function trade() {
    const T = AP.trade;
    const tick = AP.ticker.map((t) => `<span class="tk"><b>${t.sym}</b>${led(t.value, { p: 2.6, tone: t.dir === "down" ? "ink" : "amber" })}<span class="${t.dir ? dirClass(t.dir) : "muted"}">${t.move}</span></span><i class="tk-sep"></i>`).join("");
    const field = (f, recv) => `<div class="field ${recv ? "recv" : ""}">
      <div class="f-top"><span class="label">${f.label}</span>${f.balance ? `<span class="f-bal">${f.balance}<button class="chip" type="button">Max</button></span>` : ""}</div>
      <div class="f-mid">${led(f.amount, { p: 7, tone: recv ? "hot" : "ink", delay: recv ? 300 : 0 })}<button class="tok" type="button" aria-label="${recv ? "Choose the asset to receive" : "Choose the asset to pay with"}">${mark(f.sym, 26)}<b>${f.sym}</b>${icon("caret", 14)}</button></div>
      <div class="f-foot">${f.foot}</div></div>`;
    const swap = panel("p-swap glow", `
      ${head("Swap", `${seg(T.modes, "Spot")}<label class="pro"><span>Pro</span><span class="switch" aria-hidden="true"><i></i><i></i><i></i></span></label>`)}
      ${field(T.pay)}<button class="flip" type="button" aria-label="Switch what you pay and receive">${icon("swap", 16)}</button>${field(T.receive, true)}
      <div class="route"><button type="button" class="route-h"><span>${T.route[0]}</span><span class="muted">${T.route[1]}</span>${icon("caret", 14)}</button>
      <dl class="list">${T.details.map(([k, v]) => kv(k, v)).join("")}</dl></div>
      <button class="btn btn-primary btn-wide" type="button"><span>${T.cta}</span><span class="disc">${icon("arrow", 16)}</span></button>`);
    const feat = panel("p-feat", `
      ${head("Featured")}
      <div class="feat">${T.featured.map((f) => `<a class="frow" href="#">${mark(f.sym, 32)}<span><b>${f.sym}</b><small>${f.name}</small></span><span class="fr-v"><b>${f.price}</b><small class="${dirClass(f.dir)}">${f.move}</small></span></a>`).join("")}</div>
      ${btn("Explore", "secondary", "search")}`);
    return `<h1 class="sr">Trade</h1>
      <div class="ticker" aria-label="Prices"><div class="tk-track">${tick}${tick}</div></div>
      <div class="g-trade">${swap}${feat}</div>`;
  }

  /* ---------- Lend ---------- */
  function lend() {
    const L = AP.lend;
    const icoFor = { Buy: "trade", Boost: "yield", Borrow: "deposit", "Pay back": "withdraw", Withdraw: "withdraw" };
    const tone = ["amber", "lilac", "sage", "amber"];
    const tiles = L.tiles
      .map((t, i) => {
        if (t.gauge != null) {
          return panel("p-tile", `${head(t.title + icon("info", 12), badge(t.word, "sage"))}
            <div class="face sm">${dial(t.gauge, { size: 156, p: 5.4, tone: "sage" })}<div class="face-c">${led(String(t.gauge), { p: 4.6, tone: "ink" })}</div></div>
            <dl class="list">${t.rows.map(([k, v]) => kv(k, v)).join("")}</dl>`);
        }
        const used = t.rows[0][0] === "Used";
        return panel("p-tile", `${head(t.title + icon("info", 12))}
          <div class="tile-hero">${led(t.hero, { p: 4.6, tone: tone[i], delay: i * 140 })}<span class="sub ${t.sub.startsWith("+") ? "up" : ""}">${t.sub}</span></div>
          <dl class="list">${t.rows.map(([k, v]) => kv(k, v)).join("")}</dl>
          ${used ? `<div class="used">${strip(parseFloat(t.rows[0][1]), { n: 34, p: 6.2, tone: "amber" })}</div>` : ""}
          <div class="tile-cta">${t.ctas.map((c) => btn(c, "secondary", icoFor[c])).join("")}</div>`);
      })
      .join("");
    const mk = L.markets
      .map((m) => `<a class="row" href="#">
        <span class="c-asset">${mark(m.sym)}<span><b>${m.name}</b><small>${m.sym}</small></span></span>
        <span class="c-num earn">${m.supply}</span><span class="c-num">${m.borrow}</span>
        <span class="c-num">${m.supplied}</span><span class="c-num">${m.borrowed}</span>
        <span class="c-util">${strip(m.util, { n: 20, p: 5, tone: "amber" })}<b>${m.util}%</b></span>
        <span class="c-num you"><small>${m.you[0]}</small><b class="${m.you[1] === "None" ? "dim" : ""}">${m.you[1]}</b></span>
        <span class="c-chev">${icon("chevron", 14)}</span></a>`)
      .join("");
    const markets = panel("p-markets", `${head("Markets")}<div class="board mkts"><div class="row hd">${L.columns.map((c, i) => `<span class="${i ? "c-num" : ""}">${c}</span>`).join("")}<span></span></div>${mk}</div>`);
    return `<h1 class="sr">Lend</h1><div class="quiet">${icon("logo", 12)}${AP.account.name}</div><div class="g-tiles">${tiles}</div>${markets}`;
  }

  /* ---------- Kit ---------- */
  function kit() {
    const sw = (name, hex, v) => `<div class="sw"><i style="background:${hex}"></i><b>${name}</b><small>${hex}</small></div>`;
    const dark = [["Velvet ground", "#0d0a0c"], ["Panel", "#181210"], ["Night sky", "#16213a"], ["Figures", "#f7ece1"], ["Labels", "#c2b2a4"], ["Amber LED", "#ffb466"], ["Arch orange", "#ff5e00"], ["Lilac", "#d2abf0"], ["Sage · up", "#b8d6a0"], ["Rose · down", "#f4a2a6"]];
    const light = [["Paper ground", "#f2eae0"], ["Board", "#fcf7f0"], ["Apricot glow", "#ffd7b5"], ["Ink", "#21170f"], ["Labels", "#5f5045"], ["Ink LED", "#2a1c14"], ["Arch orange", "#e05300"], ["Lilac", "#8250ad"], ["Sage · up", "#3f7338"], ["Rose · down", "#b03f52"]];
    const icons = ["home", "yield", "lend", "trade", "points", "docs", "deposit", "withdraw", "transfer", "move", "share", "copy", "external", "search", "chevron", "theme", "collapse", "close", "swap", "settings"];
    const names = { home: "Home", yield: "Prime Yield", lend: "Lend", trade: "Trade", points: "Points", docs: "Documentation", deposit: "Deposit", withdraw: "Withdraw", transfer: "Transfer", move: "Move funds", share: "Share", copy: "Copy", external: "External", search: "Search", chevron: "Chevron", theme: "Theme", collapse: "Collapse", close: "Close", swap: "Swap flip", settings: "Columns" };
    const a = AP.home.assets[0];
    return `<div class="kit-head"><h1>Lumen <span class="o">kit.</span></h1><p>The landing's LED “A”, grown into the whole display. Figures are lit LEDs that bloom warm; words stay in PP Neue Montreal. Velvet panels glow at the edge by night, ink dots sit on warm paper by day.</p></div>
    <div class="g-kit">
      ${panel("k-colour span2", `${head("Colour", '<span class="muted">Both themes</span>')}<div class="sw-set"><span class="label">Dark · velvet</span><div class="sws">${dark.map(([n, h]) => sw(n, h)).join("")}</div><span class="label">Light · paper</span><div class="sws">${light.map(([n, h]) => sw(n, h)).join("")}</div></div>`)}
      ${panel("k-type span2", `${head("Type", '<span class="muted">LED figures · PP Neue Montreal</span>')}
        <div class="type-rows">
          <div class="tr"><span class="label">Hero · LED 9</span>${led(AP.home.value, { p: 9, tone: "amber" })}</div>
          <div class="tr"><span class="label">Figure · LED 6</span>${led(AP.primeBtc.boost.hero, { p: 6, tone: "hot" })}${led(AP.home.change.pct, { p: 6, tone: "sage" })}${led(a.d24.split(" · ")[1], { p: 6, tone: "rose" })}${led(AP.lend.tiles[1].hero, { p: 6, tone: "lilac" })}</div>
          <div class="tr"><span class="label">Display 44</span><span class="t-44">${AP.primeBtc.name}</span></div>
          <div class="tr"><span class="label">Title 20</span><span class="t-20">${AP.home.boost.title}</span></div>
          <div class="tr"><span class="label">Body 15</span><span class="t-15">${AP.home.boost.body} ${AP.trade.receive.foot}</span></div>
          <div class="tr"><span class="label">Label 13</span><span class="t-13">${AP.home.label} · ${AP.network}</span></div>
        </div>`)}
      ${panel("k-buttons span2", `${head("Buttons")}<div class="k-row"><span class="label">Primary</span>${btn("Deposit", "primary")}${btn("Boost", "primary")}${btn(AP.trade.cta, "primary")}</div>
        <div class="k-row"><span class="label">Secondary</span>${btn("Withdraw", "secondary", "withdraw")}${btn("Move funds", "secondary", "move")}${btn("Transfer", "secondary", "transfer")}</div>
        <div class="k-row"><span class="label">Ghost</span>${btn("Share", "ghost", "share")}<button class="add" type="button">${icon("plus", 12)}Add sub-account</button></div>
        <div class="k-row"><span class="label">Icon</span>${iconBtn("copy", "Copy")}${iconBtn("external", "View on explorer")}${iconBtn("settings", "Columns")}${iconBtn("close", "Close")}</div>
        <div class="k-row"><span class="label">Disabled</span><button class="btn btn-primary" type="button" disabled><span>Deposit</span><span class="disc">${icon("arrow", 16)}</span></button>${btn("Pay back", "secondary", "withdraw", "disabled")}</div>`)}
      ${panel("k-controls", `${head("Controls")}
        <div class="k-row"><span class="label">Segmented</span>${seg(AP.home.ranges, "1W")}</div>
        <div class="k-row"><span class="label">Toggle</span>${seg(AP.trade.modes, "Spot")}<label class="pro"><span>Pro</span><span class="switch"><i></i><i></i><i></i></span></label></div>
        <div class="k-row"><span class="label">Tabs</span><div class="tabs">${AP.home.tabs.slice(0, 3).map((t, i) => `<button type="button" class="${i ? "" : "on"}">${t}</button>`).join("")}</div></div>
        <div class="k-row"><span class="label">Chips</span><button class="chip" type="button">25%</button><button class="chip on" type="button">50%</button><button class="chip" type="button">Max</button></div>`)}
      ${panel("k-badges", `${head("Badges")}<div class="k-row wrap">${badge("Healthy", "sage")}${badge("Watch", "amber")}${badge("At risk", "rose")}<span class="soon">soon</span><span class="test">test</span>${badge("Up to 3.3x", "amber")}</div>
        <div class="k-row"><span class="label">Light strip</span>${strip(AP.lend.markets[0].util, { n: 24, p: 6, tone: "amber" })}<b class="mono">${AP.lend.markets[0].util}%</b></div>
        <div class="k-row"><span class="label">Sparkline</span>${plot(a.spark, { cols: 22, rows: 9, p: 3.4, tone: "rose", marker: false })}${plot(AP.home.assets[2].spark, { cols: 22, rows: 9, p: 3.4, tone: "sage", marker: false })}</div>`)}
      ${panel("k-inputs", `${head("Inputs")}<div class="field"><div class="f-top"><span class="label">${AP.trade.pay.label}</span><span class="f-bal">${AP.trade.pay.balance}<button class="chip" type="button">Max</button></span></div><div class="f-mid">${led(AP.trade.pay.amount, { p: 4, tone: "ink" })}<button class="tok" type="button">${mark("USD", 26)}<b>USD</b>${icon("caret", 14)}</button></div><div class="f-foot">${AP.trade.pay.foot}</div></div>
        <label class="search text">${icon("search", 16)}<input placeholder="${AP.search}"><kbd>⌘K</kbd></label>`)}
      ${panel("k-gauge", `${head("Health gauge", badge(AP.home.risk.word, "sage"))}<div class="face">${dial(AP.home.risk.score, { size: 196, p: 7, tone: "sage" })}<div class="face-c">${led(String(AP.home.risk.score), { p: 6, tone: "ink" })}<span>Health</span></div></div>`)}
      ${panel("k-table span2", `${head("Table row")}<div class="board assets"><div class="row hd">${AP.home.assetColumns.map((c, i) => `<span class="${i > 1 ? "c-num" : ""}">${c}</span>`).join("")}<span></span></div><a class="row" href="#"><span class="c-asset">${mark(a.sym)}<span><b>${a.name}</b><small>${a.amount}</small></span></span><span class="c-spark">${plot(a.spark, { cols: 30, rows: 9, p: 3.4, tone: "rose", marker: false })}</span><span class="c-num down">${a.d24}</span><span class="c-num earn">${a.earning}</span><span class="c-num strong">${a.value}</span><span class="c-chev">${icon("chevron", 14)}</span></a></div>`)}
      ${panel("k-signed", `<div class="signed">${icon("logo", 54, { field: true })}<h3>See your portfolio</h3>${btn("Connect wallet", "primary")}</div>`)}
      ${panel("k-icons span3", `${head("Icons", '<span class="muted">9 × 9 LEDs, one accent</span>')}<div class="ico-grid">${icons.map((n) => `<div class="ic"><span class="ic-box">${icon(n, 27, { field: true })}</span><small>${names[n]}</small></div>`).join("")}${["BTC", "primeBTC", "primeUSD", "USD"].map((s) => `<div class="ic"><span class="ic-box plain">${mark(s, 36)}</span><small>${s}</small></div>`).join("")}</div>`)}
    </div>`;
  }

  /* ---------- mount ---------- */
  const views = { home, products, "prime-btc": primeBtc, trade, lend, kit };
  document.getElementById("app").innerHTML = `${sidebar()}<div class="main">${topbar()}<main class="content c-${page}">${views[page]()}</main></div>`;

  // theme
  const themeLabel = () => document.querySelectorAll("[data-theme-label]").forEach((el) => { el.textContent = root.dataset.theme === "dark" ? "Light mode" : "Dark mode"; el.parentElement.setAttribute("aria-label", root.dataset.theme === "dark" ? "Switch to light mode" : "Switch to dark mode"); });
  themeLabel();
  document.querySelector("[data-theme-toggle]").addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("lumen-theme", next); } catch (e) {}
    themeLabel();
  });
  // collapse
  document.querySelector("[data-collapse]").addEventListener("click", (e) => {
    const c = document.body.classList.toggle("collapsed");
    e.currentTarget.setAttribute("aria-label", c ? "Expand sidebar" : "Collapse sidebar");
    e.currentTarget.title = c ? "Expand" : "";
  });
  // Prime Yield fold
  document.querySelectorAll(".vt-fold").forEach((b) => b.addEventListener("click", () => {
    const open = b.getAttribute("aria-expanded") !== "true";
    b.setAttribute("aria-expanded", open);
    b.setAttribute("aria-label", `${open ? "Hide" : "Show"} Prime Yield pages`);
    b.closest(".vt-row").classList.toggle("folded", !open);
  }));
  // segmented / tabs / chips: local state only
  document.querySelectorAll(".seg, .tabs").forEach((g) => g.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b || b.getAttribute("aria-disabled")) return;
    g.querySelectorAll("button").forEach((x) => { x.classList.toggle("on", x === b); x.setAttribute("aria-selected", x === b); });
  }));
  document.querySelectorAll(".chans").forEach((g) => g.addEventListener("click", (e) => {
    const b = e.target.closest(".chan");
    if (!b || b.getAttribute("aria-disabled")) return;
    g.querySelectorAll(".chan").forEach((x) => { x.classList.toggle("on", x === b); x.setAttribute("aria-pressed", x === b); });
  }));
  document.querySelectorAll(".acc-h").forEach((h) => h.addEventListener("click", () => {
    const acc = h.parentElement;
    if (!acc.querySelector(".acc-b")) return;
    const open = !acc.classList.contains("open");
    acc.classList.toggle("open", open);
    h.setAttribute("aria-expanded", open);
  }));
  document.querySelectorAll(".pro").forEach((p) => p.addEventListener("click", (e) => { e.preventDefault(); p.classList.toggle("on"); }));
  // Plot readout: a lit scan column and the value under the pointer.
  const fmts = {
    usd: (v) => "$" + v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    pct: (v) => v.toFixed(1) + "%",
    nav: (v) => v.toFixed(4) + " BTC",
  };
  document.querySelectorAll(".plot[data-series]").forEach((pl) => {
    const s = JSON.parse(pl.dataset.series), cols = +pl.dataset.cols, step = pl.dataset.step === "1";
    const svg = pl.querySelector("svg"), scan = pl.querySelector(".scan"), out = pl.querySelector(".readout");
    const p = parseFloat(getComputedStyle(pl).getPropertyValue("--p"));
    pl.addEventListener("pointermove", (e) => {
      const r = svg.getBoundingClientRect();
      const c = Math.max(0, Math.min(cols - 1, Math.floor(((e.clientX - r.left) / r.width) * cols)));
      const i = step ? Math.min(s.length - 1, Math.floor((c / cols) * s.length)) : Math.round((c / (cols - 1)) * (s.length - 1));
      scan.setAttribute("x", c * p);
      pl.classList.add("scanning");
      out.hidden = false;
      out.textContent = fmts[pl.dataset.fmt](s[i]);
      out.style.left = ((c + 0.5) / cols) * 100 + "%";
    });
    pl.addEventListener("pointerleave", () => { pl.classList.remove("scanning"); out.hidden = true; });
  });
})();
