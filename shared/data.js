// One source of information for every direction. Labels, sections and copy are the app's own (content-inventory.md).
// Public market figures are shaped like the live mainnet reads; personal figures are a sample connected account.
// Every direction renders exactly these values so the comparison is design only.

window.AP = {
  nav: [
    { id: "home", label: "Home", href: "home.html" },
    { id: "yield", label: "Prime Yield", href: "products.html", children: [
      { id: "prime-btc", label: "primeBTC", href: "prime-btc.html" },
      { id: "prime-usd", label: "primeUSD", href: "#" },
    ] },
    { id: "lend", label: "Lend", href: "lend.html" },
    { id: "trade", label: "Trade", href: "trade.html" },
    { id: "points", label: "Points", href: "#" },
    { id: "docs", label: "Documentation", href: "#", soon: "Documentation arrives soon" },
  ],
  search: "Search markets, products and pages",
  network: "Mainnet",

  account: {
    name: "Main",
    address: "arch1q7…m4z9",
    accounts: [
      { name: "All accounts", line: "Combined · 2 accounts", net: "$24,318.42" },
      { name: "Main", line: "arch1q7…m4z9", net: "$21,902.10" },
      { name: "Savings", line: "arch1k2…p8d0", net: "$2,416.32" },
    ],
  },

  ticker: [
    { sym: "BTC", value: "$78,729.02", move: "-1.13%", dir: "down" },
    { sym: "primeBTC", value: "6.8% APY", move: "on BTC" },
    { sym: "primeUSD", value: "9.2% APY", move: "on dollars" },
    { sym: "primeBTC 3x", value: "14.9% APY", move: "up to 3.3x" },
    { sym: "primeUSD 3x", value: "19.4% APY", move: "up to 4.9x" },
    { sym: "Lend BTC", value: "0.3% APY", move: "borrow 1.9%" },
    { sym: "Lend dollars", value: "0.8% APY", move: "borrow 3.1%" },
  ],

  home: {
    label: "Account value",
    value: "$21,902.10",
    change: { usd: "+$412.36", pct: "+1.92%", dir: "up" },
    ranges: ["1W", "1M", "3M", "1Y", "All"],
    range: "1W",
    actions: ["Transfer", "Move funds", "Withdraw", "Deposit"],
    // account value over 1W (28 buckets), dollars
    series: [21489.7, 21512.3, 21470.1, 21390.8, 21402.6, 21455.0, 21530.2, 21601.9, 21588.4, 21540.7, 21498.3, 21566.1, 21642.8, 21710.5, 21695.2, 21650.9, 21702.4, 21788.6, 21841.3, 21808.0, 21760.5, 21795.9, 21862.2, 21910.7, 21884.1, 21851.6, 21889.3, 21902.1],
    columns: [
      { id: "holdings", title: "Holdings", rows: [["Assets", "$23,152.10"], ["Earning per year", "≈ +$1,084"]] },
      { id: "borrowing", title: "Borrowing", rows: [["Borrowed", "$1,250.00"], ["Borrow rate", "3.1%"]] },
      { id: "available", title: "Available", rows: [["Can borrow", "$9,826.40"], ["Can withdraw to Bitcoin", "0.1302 aBTC"]], disabled: "No history of borrowing power yet" },
    ],
    tabs: ["All assets", "Loans", "Activity", "Statements · soon"],
    assetColumns: ["Asset", "7 days", "24h", "Earning", "Value"],
    assets: [
      { sym: "BTC", name: "Bitcoin", amount: "0.1302 BTC", d24: "-$116.07 · -1.13%", dir: "down", earning: "0.3%", value: "$10,250.53", spark: [80.1, 80.4, 79.6, 79.1, 79.9, 79.3, 78.7] },
      { sym: "primeBTC", name: "primeBTC", amount: "0.0800 primeBTC", d24: "-$71.32 · -1.13%", dir: "down", earning: "6.8%", value: "$6,298.32", spark: [79.5, 79.8, 79.4, 79.0, 79.6, 79.2, 78.8] },
      { sym: "primeUSD", name: "primeUSD", amount: "4,102.88 primeUSD", d24: "+$1.03 · +0.03%", dir: "up", earning: "9.2%", value: "$4,102.88", spark: [4096, 4097.1, 4098.0, 4099.2, 4100.4, 4101.6, 4102.9] },
      { sym: "USD", name: "Dollars", amount: "2,500.37 aUSD", d24: "+$0.05 · +0.00%", dir: "up", earning: "0.8%", value: "$2,500.37", spark: [2500.0, 2500.06, 2500.12, 2500.18, 2500.24, 2500.31, 2500.37] },
    ],
    loans: [{ name: "Dollars loan", amount: "1,250.00 aUSD", line: "Opened Oct 21 · $0.11 a day · $0.86 to date", rate: "3.1% a year", borrowed: "$1,250.00" }],
    activity: [
      { verb: "Bought", detail: "+0.0300 BTC at 78,912 aUSD · −2,367.36 aUSD", when: "Oct 28, 14:02 UTC", tx: "5f2c…a91e" },
      { verb: "Supplied", detail: "+2,500.00 aUSD", when: "Oct 27, 09:41 UTC", tx: "c81d…07b3" },
      { verb: "Borrowed", detail: "+1,250.00 aUSD", when: "Oct 21, 18:15 UTC", tx: "93ae…4c10" },
      { verb: "Funds in", detail: "+0.1802 BTC", when: "Oct 20, 11:06 UTC", tx: "e04b…d5f2" },
    ],
    risk: { score: 82, word: "Healthy", rows: [["Loan to value", "5.4%"], ["Liquidates at", "85.0%"], ["Liquidation price", "$4,962.10"]] },
    boost: { title: "Boost primeBTC up to 3.3x", body: "About 14.9% a year at 3.0x.", cta: "Boost" },
  },

  products: {
    yours: { summary: [["Balance", "$10,401.20"], ["Earned all time", "$186.44"], ["Earning per year", "≈ +$805"]] ,
      columns: ["Product", "APY", "Boost", "Balance", "24h", "Earned", ""],
      rows: [
        { sym: "primeBTC", asset: "BTC", apy: "6.8%", boost: "Off", balance: "$6,298.32", d24: "-$71.32 · -1.13%", dir: "down", earned: "$92.18", action: "Withdraw" },
        { sym: "primeUSD", asset: "USD", apy: "9.2%", boost: "Off", balance: "$4,102.88", d24: "+$1.03 · +0.03%", dir: "up", earned: "$94.26", action: "Withdraw" },
      ] },
    range: [["Earn up to", "9.2%"], ["Boost up to", "4.9x"]],
    all: [
      { sym: "primeBTC", asset: "BTC", apy: "6.8%", tvl: "$1.9M", boostUpTo: "3.3x", apyAt: ["APY at 3.0x", "14.9%"], nav: [1.0000, 1.0004, 1.0009, 1.0013, 1.0016, 1.0022, 1.0027, 1.0031, 1.0036, 1.0041, 1.0045, 1.0049, 1.0055, 1.0058] },
      { sym: "primeUSD", asset: "USD", apy: "9.2%", tvl: "$2.6M", boostUpTo: "4.9x", apyAt: ["APY at 3.0x", "19.4%"], nav: [1.0000, 1.0006, 1.0012, 1.0018, 1.0024, 1.0031, 1.0037, 1.0043, 1.0049, 1.0055, 1.0062, 1.0068, 1.0074, 1.0080] },
    ],
  },

  primeBtc: {
    name: "primeBTC",
    head: [["APY", "6.8%", "+0.4%"], ["NAV per share", "1.0058 BTC", "+0.58%"], ["Deposited", "$1.9M", "+12.4%"]],
    tabs: ["Overview", "Your position"],
    chartTabs: ["APY", "NAV per share", "Deposited"],
    ranges: ["1W", "1M", "3M", "1Y"],
    // APY steps over 1M (30 days), percent
    apySeries: [5.9, 6.1, 6.0, 6.3, 6.4, 6.2, 6.6, 6.5, 6.7, 6.9, 6.8, 6.6, 6.7, 7.0, 7.1, 6.9, 6.8, 6.9, 7.2, 7.0, 6.8, 6.7, 6.9, 6.8, 6.6, 6.8, 6.9, 6.7, 6.8, 6.8],
    avg30: 6.7,
    stats: [["7-day APY", "6.8%"], ["30-day APY", "6.7%"], ["Since start", "6.5%"], ["Sharpe ratio", "2.41"], ["Worst drop", "-0.2%"], ["Room left", "18.42 BTC"]],
    hold: { title: "Hold", hero: "6.8%", heroUnit: "a year", rowLabel: "In a year, on 1.00 BTC", rowValue: "+0.0680 BTC", cta: "Deposit" },
    boost: { title: "Boost", badge: "Up to 3.3x", hero: "14.9%", heroUnit: "at 3.0x", rowLabel: "In a year, on 1.00 BTC", rowValue: "+0.1490 BTC", cta: "Boost" },
    disclosure: [
      { title: "NAV", head: [["Reported", "1.0058 BTC"], ["Status", "Fresh"], ["Last report", "Just now"]] },
      { title: "Transparency", head: [["Observed backing", "24.2061 BTC"], ["Difference", "0.0000 BTC"], ["Updated", "29 s ago"]] },
      { title: "Withdrawals and the queue", head: [["Reserve", "4.2420 BTC"], ["In the queue", "0 requests"], ["Expected wait", "Instant"]] },
      { title: "Strategy and risks", head: [["Off chain", "82.5%"], ["On-chain reserve", "17.5%"], ["Started", "Oct 20, 2026"]] },
      { title: "Fees", head: [["Deposit", "0%"], ["Withdraw", "0%"], ["Management", "0%"]] },
    ],
  },

  trade: {
    modes: ["Spot", "Margin"],
    pay: { label: "You pay", amount: "2,500.00", sym: "USD", foot: "$2,500.00", balance: "Balance 2,500.37" },
    receive: { label: "You receive, about", amount: "0.031754", sym: "BTC", foot: "Held as BTC · 1 BTC = 78,729.02 USD" },
    route: ["Route and quotes", "2 routes"],
    details: [["Swap fee", "0.30% · $7.50"], ["Min received", "0.031595 BTC"], ["Network fee", "0.0001 ARCH"], ["Slippage", "0.5%"], ["Route", "Swap USD → BTC · CLAMM"]],
    cta: "Buy 0.031754 BTC",
    featured: [
      { sym: "BTC", name: "Bitcoin", price: "$78,729.02", move: "-1.13%", dir: "down" },
      { sym: "primeBTC", name: "prime-btc", price: "1.0058 BTC", move: "+0.02%", dir: "up" },
      { sym: "primeUSD", name: "prime-usd", price: "$1.0080", move: "+0.01%", dir: "up" },
      { sym: "USD", name: "Dollars", price: "$1.0000", move: "0.00%" },
    ],
  },

  lend: {
    tiles: [
      { title: "Borrowing power", hero: "$9,826.40", sub: "3.1% a year", rows: [["Used", "11%"]], ctas: ["Buy", "Boost"] },
      { title: "Borrowed", hero: "$1,250.00", sub: "1 loan", rows: [["Dollars", "3.1%"]], ctas: ["Borrow", "Pay back"] },
      { title: "Health", gauge: 82, word: "Healthy", rows: [["Loan to value", "5.4%"], ["Liquidates at", "85.0%"]] },
      { title: "Lending", hero: "$2,500.37", sub: "+$20.00 a year", rows: [["Dollars", "0.8%"]], ctas: ["Withdraw"] },
    ],
    columns: ["Asset", "Supply rate", "Borrow rate", "Supplied", "Borrowed", "Utilization", "You"],
    markets: [
      { sym: "USD", name: "Dollars", supply: "0.8%", borrow: "3.1%", supplied: "$6.8K", borrowed: "$1.7K", util: 25, you: ["Lending", "$2,500.37"] },
      { sym: "BTC", name: "BTC", supply: "0.3%", borrow: "1.9%", supplied: "$5.9K", borrowed: "$893.3", util: 15, you: ["Lending", "None"] },
    ],
  },
};
