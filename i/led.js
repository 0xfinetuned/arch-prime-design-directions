// Lumen LED engine: dot-matrix numerals, LED marks, dot plots, light strips and the dial.
// Everything is drawn as round LEDs on a faint unlit field; lit dots bloom through CSS.
(function () {
  const STILL = document.documentElement.classList.contains("still");

  // 5×7 numerals and the few symbols our figures use. "#" = lit.
  const F = {
    "0": [".###.", "#...#", "#...#", "#...#", "#...#", "#...#", ".###."],
    "1": ["..#..", ".##..", "..#..", "..#..", "..#..", "..#..", ".###."],
    "2": [".###.", "#...#", "....#", "...#.", "..#..", ".#...", "#####"],
    "3": ["#####", "...#.", "..#..", "...#.", "....#", "#...#", ".###."],
    "4": ["...#.", "..##.", ".#.#.", "#..#.", "#####", "...#.", "...#."],
    "5": ["#####", "#....", "####.", "....#", "....#", "#...#", ".###."],
    "6": ["..##.", ".#...", "#....", "####.", "#...#", "#...#", ".###."],
    "7": ["#####", "....#", "...#.", "..#..", ".#...", ".#...", ".#..."],
    "8": [".###.", "#...#", "#...#", ".###.", "#...#", "#...#", ".###."],
    "9": [".###.", "#...#", "#...#", ".####", "....#", "...#.", ".##.."],
    "$": ["..#..", ".####", "#....", ".###.", "....#", "####.", "..#.."],
    "%": ["##...", "##..#", "...#.", "..#..", ".#...", "#..##", "...##"],
    "+": [".....", "..#..", "..#..", "#####", "..#..", "..#..", "....."],
    "-": ["....", "....", "....", "####", "....", "....", "...."],
    "x": [".....", ".....", "#...#", ".#.#.", "..#..", ".#.#.", "#...#"],
    "M": ["#...#", "##.##", "#.#.#", "#.#.#", "#...#", "#...#", "#...#"],
    "K": ["#...#", "#..#.", "#.#..", "##...", "#.#..", "#..#.", "#...#"],
    "≈": [".....", ".##.#", "#.##.", ".....", ".##.#", "#.##.", "....."],
    ".": [".", ".", ".", ".", ".", ".", "#"],
    ",": ["..", "..", "..", "..", "..", ".#", "#."],
    " ": ["..", "..", "..", "..", "..", "..", ".."],
  };

  // Split "1.0058 BTC" into the LED part and its unit, set in type.
  function split(value) {
    const s = String(value);
    let i = 0;
    while (i < s.length && F[s[i]]) i++;
    return { led: s.slice(0, i).trimEnd(), unit: s.slice(i).trim() };
  }

  let seq = 0;
  // LED figure. o: { p: pitch px, tone: amber|hot|ink|gain|loss|rose|sage|lilac, delay: ms }
  function led(value, o = {}) {
    const p = o.p || 6, tone = o.tone || "amber";
    const { led: text, unit } = split(value);
    const lit = [];
    let x = 0;
    [...text].forEach((ch, i) => {
      const g = F[ch];
      for (let r = 0; r < 7; r++) for (let c = 0; c < g[r].length; c++) if (g[r][c] === "#") lit.push([x + c, r]);
      x += g[0].length + (i < text.length - 1 ? 1 : 0);
    });
    const W = x, H = 7, on = new Set(lit.map(([c, r]) => c + "," + r));
    const base = (o.delay || 0) + (seq++ % 12) * 30;
    let off = "", onDots = "";
    for (let c = 0; c < W; c++) for (let r = 0; r < H; r++) {
      const cx = (c + 0.5) * p, cy = (r + 0.5) * p;
      if (on.has(c + "," + r)) {
        const d = STILL ? "" : ` style="--d:${Math.round(base + (c / W) * 520 + ((c * 7 + r * 13) % 9) * 14)}ms"`;
        onDots += `<circle cx="${cx}" cy="${cy}" r="${(p * 0.39).toFixed(2)}"${d}/>`;
      } else off += `<circle cx="${cx}" cy="${cy}" r="${(p * 0.3).toFixed(2)}"/>`;
    }
    const svg = `<svg class="led t-${tone}" style="--p:${p}px" width="${W * p}" height="${H * p}" viewBox="0 0 ${W * p} ${H * p}" role="img" aria-label="${text}"><g class="off">${off}</g><g class="on">${onDots}</g></svg>`;
    return `<span class="fig">${svg}${unit ? `<span class="unit">${unit}</span>` : ""}</span>`;
  }

  // LED marks, 9×9. "#" lit, "o" the one accent LED.
  const I = {
    home: ["....o....", "...#.#...", "..#...#..", ".#.....#.", "#.......#", ".#.....#.", ".#.###.#.", ".#.#.#.#.", ".#######."],
    yield: [".......o.", ".......#.", ".....#.#.", ".....#.#.", "...#.#.#.", "...#.#.#.", ".#.#.#.#.", ".#.#.#.#.", "........."],
    lend: ["...###...", "..#...#..", "..#.o.#..", "..#...#..", "...###...", ".........", "#.......#", "#.#####.#", "#########"],
    trade: [".....#...", "......#..", ".#######.", "......#..", "...#.#...", "..#......", ".#######o", "..#......", "...#....."],
    points: ["....#....", "....#....", "...#.#...", ".##...##.", "#...o...#", ".##...##.", "...#.#...", "....#....", "....#...."],
    docs: [".#####...", ".#...##..", ".#....##.", ".#.....#.", ".#.###.#.", ".#.....#.", ".#.#o#.#.", ".#.....#.", ".#######."],
    deposit: ["....#....", "....#....", "....#....", ".#..#..#.", "..#.#.#..", "...###...", "....o....", "#.......#", "#########"],
    withdraw: ["....o....", "...###...", "..#.#.#..", ".#..#..#.", "....#....", "....#....", ".........", "#.......#", "#########"],
    transfer: [".........", "........#", "....#...#", ".....#..#", "o######.#", ".....#..#", "....#...#", "........#", "........."],
    move: [".........", "..#......", ".#.......", "########.", ".#.....#.", "..#....#.", ".......#.", ".......#.", ".......o."],
    share: [".....####", ".......##", "......#.#", ".....#..#", "#...#...#", "#..#.....", "#.......#", "#.......#", "#########"],
    copy: ["...######", "...#....#", "...#....#", "######..#", "#....#..#", "#....####", "#....#...", "#....#...", "######..."],
    external: ["..#######", ".......##", "......#.#", ".....#..#", "....#...#", "...#.....", "..#......", ".#.......", "o........"],
    search: ["..###....", ".#...#...", "#.....#..", "#.....#..", "#.....#..", ".#...#...", "..###.o..", ".......#.", "........#"],
    chevron: [".........", "...#.....", "....#....", ".....#...", "......#..", ".....#...", "....#....", "...#.....", "........."],
    theme: ["..#####..", ".#...###.", "#....####", "#....####", "#....##o#", "#....####", "#....####", ".#...###.", "..#####.."],
    collapse: ["#########", "#..#....#", "#..#....#", "#..#.#..#", "#..#o##.#", "#..#.#..#", "#..#....#", "#..#....#", "#########"],
    close: ["#.......#", ".#.....#.", "..#...#..", "...#.#...", "....o....", "...#.#...", "..#...#..", ".#.....#.", "#.......#"],
    swap: ["..#......", ".###.....", "#.#.#....", "..#...#..", "..#...#..", "..#...#..", "....#.#.#", ".....###.", "......o.."],
    settings: [".#.......", "#########", ".#.......", "......#..", "#########", "......#..", "...o.....", "#########", "...#....."],
    plus: [".........", "....#....", "....#....", "....#....", "####o####", "....#....", "....#....", "....#....", "........."],
    arrow: [".........", "....#....", ".....#...", "......#..", "o#######.", "......#..", ".....#...", "....#....", "........."],
    caret: [".........", ".........", ".........", "..#...#..", "...#.#...", "....#....", ".........", ".........", "........."],
    info: ["...###...", ".........", "...##....", "....#....", "....#....", "....#....", "...###...", ".........", "........."],
    // asset marks
    BTC: ["..#.#....", ".######..", "..#....#.", "..#....#.", "..#####..", "..#....#.", "..#....#.", ".######..", "..#.#...."],
    USD: ["....#....", "..######.", ".#..#....", ".#..#....", "..#####..", "....#..#.", "....#..#.", ".######..", "....#...."],
    logo: [".........", "....o....", "...#.#...", "...#.#...", "..#...#..", "..#...#..", ".#.....#.", ".#.....#.", "........."],
  };

  // o: { field: show unlit LEDs, accent: false hides the accent LED colour }
  function icon(name, size = 18, o = {}) {
    const g = I[name] || I.info, n = g.length, p = size / n;
    let off = "", on = "", acc = "";
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      const ch = g[r][c], cx = ((c + 0.5) * p).toFixed(2), cy = ((r + 0.5) * p).toFixed(2);
      if (ch === "#") on += `<circle cx="${cx}" cy="${cy}" r="${(p * 0.42).toFixed(2)}"/>`;
      else if (ch === "o") acc += `<circle cx="${cx}" cy="${cy}" r="${(p * 0.44).toFixed(2)}"/>`;
      else if (o.field) off += `<circle cx="${cx}" cy="${cy}" r="${(p * 0.26).toFixed(2)}"/>`;
    }
    const accClass = o.accent === false ? "on" : "acc";
    return `<svg class="ico" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">${off ? `<g class="off">${off}</g>` : ""}<g class="on">${on}</g><g class="${accClass}">${acc}</g></svg>`;
  }

  // Dot plot: a field of LEDs, the series lit as a line, a dim glow of LEDs below it.
  // o: { cols, rows, p, step, avg, tone, area, marker, fmt, id }
  function plot(series, o = {}) {
    const cols = o.cols || 96, rows = o.rows || 24, p = o.p || 7, n = series.length;
    const all = o.avg != null ? series.concat([o.avg]) : series;
    let min = Math.min(...all), max = Math.max(...all);
    const pad = (max - min) * (o.pad ?? 0.14) || 1;
    min -= pad; max += pad;
    const valAt = (c) => {
      if (o.step) return series[Math.min(n - 1, Math.floor((c / cols) * n))];
      const t = (c / (cols - 1)) * (n - 1), i = Math.floor(t), f = t - i;
      return i >= n - 1 ? series[n - 1] : series[i] * (1 - f) + series[i + 1] * f;
    };
    const rowOf = (v) => Math.round((1 - (v - min) / (max - min)) * (rows - 1));
    const ys = Array.from({ length: cols }, (_, c) => rowOf(valAt(c)));
    const avgRow = o.avg != null ? rowOf(o.avg) : -1;
    let off = "", on = "", area = "", avg = "";
    const R = (p * 0.36).toFixed(2), r0 = (p * 0.24).toFixed(2);
    for (let c = 0; c < cols; c++) {
      const y = ys[c], prev = c ? ys[c - 1] : y;
      const lo = y > prev ? prev + 1 : y, hi = y < prev ? prev - 1 : y;
      const d = STILL ? "" : ` style="--d:${Math.round(120 + (c / cols) * 1000)}ms"`;
      for (let r = 0; r < rows; r++) {
        const cx = ((c + 0.5) * p).toFixed(1), cy = ((r + 0.5) * p).toFixed(1);
        const isLine = r === y || (r >= lo && r <= hi);
        if (isLine) on += `<circle cx="${cx}" cy="${cy}" r="${R}"${d}/>`;
        else if (o.area !== false && r > Math.max(y, hi)) {
          const k = (r - y) / (rows - y);
          area += `<circle cx="${cx}" cy="${cy}" r="${r0}" opacity="${(0.5 * Math.pow(1 - k, 1.6) + 0.05).toFixed(2)}"${d}/>`;
        } else if (r === avgRow && c % 2 === 0) avg += `<circle cx="${cx}" cy="${cy}" r="${r0}"/>`;
        else off += `<circle cx="${cx}" cy="${cy}" r="${r0}"/>`;
      }
    }
    let axis = "";
    if (o.axis) {
      const f = AXIS[o.axis], span = max - min;
      const raw = span / 4, mag = Math.pow(10, Math.floor(Math.log10(raw)));
      const step = [1, 2, 2.5, 5, 10].map((m) => m * mag).find((s) => s >= raw);
      for (let t = Math.ceil(min / step) * step; t <= max; t += step) {
        const row = (1 - (t - min) / span) * (rows - 1);
        axis += `<span style="top:${(((row + 0.5) / rows) * 100).toFixed(2)}%">${f(t)}</span>`;
      }
      axis = `<div class="axis">${axis}</div>`;
    }
    const W = cols * p, H = rows * p;
    const last = ys[cols - 1];
    const marker = o.marker === false ? "" : `<circle class="mark" cx="${(cols - 0.5) * p}" cy="${(last + 0.5) * p}" r="${p * 0.9}"/>`;
    const data = o.fmt ? ` data-series='${JSON.stringify(series)}' data-fmt="${o.fmt}" data-cols="${cols}" data-step="${o.step ? 1 : 0}"` : "";
    return `<div class="plot t-${o.tone || "amber"}${axis ? " has-axis" : ""}"${data} style="--p:${p}px"><div class="plot-field"><svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${o.label || "Chart"}"><g class="off">${off}</g><g class="avg">${avg}</g><g class="area">${area}</g><rect class="scan" x="-99" y="0" width="${p}" height="${H}" rx="${p / 2}"/><g class="on">${on}</g>${marker}</svg>${o.avg != null ? `<span class="avg-tag" style="top:${(((avgRow + 0.5) / rows) * 100).toFixed(2)}%">${o.avgLabel || ""}</span>` : ""}<span class="readout" hidden></span></div>${axis}</div>`;
  }

  const AXIS = {
    usdK: (v) => "$" + (v / 1000).toFixed(1) + "K",
    pct: (v) => v.toFixed(1) + "%",
  };

  // Light strip (Glyph-style): n LEDs in a row, lit to pct.
  function strip(pct, o = {}) {
    const n = o.n || 24, lit = Math.round((pct / 100) * n), p = o.p || 6;
    let s = "";
    for (let i = 0; i < n; i++) {
      const d = STILL ? "" : ` style="--d:${200 + i * 28}ms"`;
      s += `<circle class="${i < lit ? "l" : "u"}" cx="${(i + 0.5) * p}" cy="${p / 2}" r="${(p * (i < lit ? 0.38 : 0.26)).toFixed(2)}"${i < lit ? d : ""}/>`;
    }
    return `<svg class="strip t-${o.tone || "amber"}" width="${n * p}" height="${p}" viewBox="0 0 ${n * p} ${p}" aria-hidden="true">${s}</svg>`;
  }

  // Dial: three rings of LEDs around a 270° sweep, lit to the score.
  function dial(score, o = {}) {
    const S = o.size || 168, p = o.p || 7, cx = S / 2, cy = S / 2;
    const a0 = Math.PI * 0.75, sweep = Math.PI * 1.5;
    let s = "";
    for (let k = 0; k < 3; k++) {
      const r = S / 2 - p * (0.8 + k * 1.15);
      const n = Math.round((sweep * r) / (p * 1.15));
      for (let i = 0; i <= n; i++) {
        const t = i / n, a = a0 + t * sweep;
        const x = (cx + r * Math.cos(a)).toFixed(1), y = (cy + r * Math.sin(a)).toFixed(1);
        const lit = t <= score / 100;
        const d = STILL || !lit ? "" : ` style="--d:${Math.round(200 + t * 900)}ms"`;
        s += `<circle class="${lit ? "l" : "u"}" cx="${x}" cy="${y}" r="${(p * (lit ? 0.38 : 0.26)).toFixed(2)}"${d}/>`;
      }
    }
    return `<svg class="dial-svg t-${o.tone || "sage"}" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" aria-hidden="true">${s}</svg>`;
  }

  window.LED = { led, icon, plot, strip, dial, split, STILL };
})();
