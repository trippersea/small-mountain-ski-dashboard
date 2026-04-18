import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const regions = {
  rockies: {
    slug: "epic-vs-ikon-rockies",
    title: "Epic Pass vs Ikon Pass: Rockies Ski Resorts Compared | WhereToSkiNext.com",
    canonical: "https://www.wheretoskinext.com/epic-vs-ikon-rockies/",
    breadcrumb: "Epic vs Ikon: Rockies",
    h1: "Epic Pass vs Ikon Pass: Which One Wins in the Rockies?",
    lede:
      "Colorado, Utah, Wyoming, Montana, New Mexico. Epic brings the marquee names (Vail, Breck, Park City, Telluride). Ikon brings mountain count, the Cottonwoods, Jackson Hole, and Big Sky.",
    stats: [
      { n: "7", l: "Epic mountains" },
      { n: "17", l: "Ikon mountains" },
      { n: "5", l: "States" },
    ],
    panelBullets: [
      "Famous-name trips lean Epic; depth and variety lean Ikon.",
      "Utah and Jackson Hole skew Ikon hard.",
      "Always confirm access on official pass sites before you buy.",
    ],
    quickPicks: [
      {
        cls: "pp-quick-card--epic",
        label: "Best for marquee destination names",
        name: "Epic",
        text: "Vail, Breckenridge, Beaver Creek, Park City, Telluride, Crested Butte. When the logo on the lift matters.",
      },
      {
        cls: "pp-quick-card--ikon",
        label: "Best for Rockies depth and variety",
        name: "Ikon",
        text: "More mountains across CO and the West: Aspen complex, Steamboat, A-Basin, Copper, Eldora, plus Taos.",
      },
      {
        cls: "pp-quick-card--ikon",
        label: "Best for Utah and Jackson Hole / Big Sky",
        name: "Ikon",
        text: "Alta, Snowbird, Deer Valley, Solitude, Snowbasin plus Jackson and Big Sky. Epic only has Park City in Utah.",
      },
    ],
    fastSummary:
      "Epic wins the bucket-list brand game. Ikon wins headcount and covers the Cottonwoods, Jackson, Big Sky, and Taos where Epic is quiet. Pick Epic if your trip list is Vail-heavy; pick Ikon if Utah or Wyoming and Montana drive the season.",
    crossExclude: "/epic-vs-ikon-rockies/",
  },
  california: {
    slug: "epic-vs-ikon-california",
    title: "Epic Pass vs Ikon Pass: California Ski Resorts Compared | WhereToSkiNext.com",
    canonical: "https://www.wheretoskinext.com/epic-vs-ikon-california/",
    breadcrumb: "Epic vs Ikon: California",
    h1: "Epic Pass vs Ikon Pass: Which One Wins in California?",
    lede:
      "Lake Tahoe, Eastern Sierra, Southern California. Epic clusters Tahoe; Ikon owns Mammoth, Palisades, and all of SoCal on a major pass.",
    stats: [
      { n: "4", l: "Epic mountains" },
      { n: "6", l: "Ikon mountains" },
      { n: "3", l: "Regions" },
    ],
    panelBullets: [
      "Epic equals a strong Tahoe network. Ikon equals Mammoth, Palisades, and SoCal.",
      "Only Ikon covers real statewide California access.",
      "Verify current resort lists before buying.",
    ],
    quickPicks: [
      {
        cls: "pp-quick-card--epic",
        label: "Best for South Lake Tahoe regulars",
        name: "Epic",
        text: "Heavenly, Northstar, Kirkwood, Sierra. Great if you live or day-trip the south and east shore.",
      },
      {
        cls: "pp-quick-card--ikon",
        label: "Best for Mammoth or Palisades",
        name: "Ikon",
        text: "Mammoth plus the biggest Tahoe footprint at Palisades. Eastern Sierra trips start here.",
      },
      {
        cls: "pp-quick-card--ikon",
        label: "Best for statewide California coverage",
        name: "Ikon",
        text: "Only major pass with SoCal (Big Bear area). Epic has no SoCal.",
      },
    ],
    fastSummary:
      "Epic is the Tahoe cluster pass. Ikon is the California-wide pass: Palisades, Mammoth, June, and the three SoCal hills. If Mammoth or LA and SD weekends matter, Ikon is the answer.",
    crossExclude: "/epic-vs-ikon-california/",
  },
  pnw: {
    slug: "epic-vs-ikon-pacific-northwest",
    title: "Epic Pass vs Ikon Pass: Pacific Northwest Ski Resorts Compared | WhereToSkiNext.com",
    canonical: "https://www.wheretoskinext.com/epic-vs-ikon-pacific-northwest/",
    breadcrumb: "Epic vs Ikon: Pacific Northwest",
    h1: "Epic Pass vs Ikon Pass: Which One Wins in the Pacific Northwest?",
    lede:
      "Washington, Oregon, Idaho. Stevens Pass is Epic's whole PNW story. Ikon runs Crystal, Snoqualmie, Mt. Hood Meadows, Schweitzer, and Tamarack.",
    stats: [
      { n: "1", l: "Epic mountain" },
      { n: "5", l: "Ikon mountains" },
      { n: "3", l: "States" },
    ],
    panelBullets: [
      "Only choose Epic here if Stevens is truly your home mountain.",
      "Regional coverage across WA, OR, and ID is Ikon.",
      "Confirm access every season on official sites.",
    ],
    quickPicks: [
      {
        cls: "pp-quick-card--epic",
        label: "Best if Stevens Pass is your mountain",
        name: "Epic",
        text: "One solid WA resort with night skiing. No Oregon or Idaho on Epic.",
      },
      {
        cls: "pp-quick-card--ikon",
        label: "Best for real PNW coverage",
        name: "Ikon",
        text: "Crystal, Snoqualmie, Hood Meadows, Schweitzer, Tamarack. This is the regional pass.",
      },
      {
        cls: "pp-quick-card--ikon",
        label: "Best for WA, OR, and ID flexibility",
        name: "Ikon",
        text: "The pass that actually connects a PNW road trip. Epic cannot.",
      },
    ],
    fastSummary:
      "This is the cleanest Ikon region: five Ikon resorts versus one Epic. Epic only makes sense if Stevens is your primary hill and you do not care about Oregon or Idaho.",
    crossExclude: "/epic-vs-ikon-pacific-northwest/",
  },
  midwest: {
    slug: "epic-vs-ikon-midwest",
    title: "Epic Pass vs Ikon Pass: Midwest Ski Resorts Compared | WhereToSkiNext.com",
    canonical: "https://www.wheretoskinext.com/epic-vs-ikon-midwest/",
    breadcrumb: "Epic vs Ikon: Midwest",
    h1: "Epic Pass vs Ikon Pass: Which One Wins in the Midwest?",
    lede:
      "Michigan, Minnesota, Wisconsin, Ohio. Neither pass is Midwest-first, but Epic leads on count; Ikon hits Wisconsin and the Twin Cities.",
    stats: [
      { n: "6", l: "Epic mountains" },
      { n: "3", l: "Ikon mountains" },
      { n: "4", l: "States" },
    ],
    panelBullets: [
      "Michigan and Ohio lean Epic. Wisconsin and Twin Cities lean Ikon.",
      "Most people buy a national pass for trips west, not just local laps.",
      "Double-check lists every season.",
    ],
    quickPicks: [
      {
        cls: "pp-quick-card--epic",
        label: "Best for Michigan and Ohio skiers",
        name: "Epic",
        text: "Boyne Highlands, Boyne Mountain, Alpine Valley, Mad River, Boston Mills and Brandywine. More Midwest resorts on Epic.",
      },
      {
        cls: "pp-quick-card--ikon",
        label: "Best for Wisconsin and Twin Cities skiers",
        name: "Ikon",
        text: "Devil's Head plus Buck Hill and Wild Mountain. Epic has no Wisconsin.",
      },
      {
        cls: "",
        label: "Best if you also fly west a few times",
        name: "Compare networks",
        text: "Epic stacks more Vail Resorts destinations. Ikon spreads wider out west. If local days are the whole story, use the first two cards. If trips break the tie, pick the pass that matches where you actually land.",
      },
    ],
    fastSummary:
      "Epic wins raw Midwest count, especially MI and OH. Ikon wins Wisconsin and splits Minnesota. Most buyers are really choosing the national network; treat Midwest as a tiebreaker.",
    crossExclude: "/epic-vs-ikon-midwest/",
  },
};

function transformStateContent(html) {
  let b = html;
  b = b.replace(/<div class="section-header">/g, '<div class="rpp-section-head">');
  b = b.replace(
    /<div class="section-header" style="margin-top:56px">/g,
    '<div class="rpp-section-head rpp-section-head--spaced">'
  );
  b = b.replace(/<span class="state-sub">/g, '<span class="rpp-sub">');
  b = b.replace(/<div class="editorial-note">([\s\S]*?)<\/div>/g, "<p class=\"rpp-note\">$1</p>");
  b = b.replace(/<div class="mountain-grid">/g, '<div class="rpp-mountain-grid">');
  b = b.replace(/class="mountain-card"/g, 'class="rpp-mountain-card"');
  b = b.replace(/compare-table-wrap/g, "pp-table-wrap");
  b = b.replace(/class="compare-table"/g, 'class="pp-table"');
  b = b.replace(/<h2>📋 Full Mountain List<\/h2>/gi, "<h2>📋 Full mountain list</h2>");
  b = b.replace(/<p style="font-size:0\.75rem[^"]*">/g, '<p class="pp-table-note">');
  b = b.replace(/<h2>([^<]+) — ([^<]+)<\/h2>/g, "<h2>$1 · $2</h2>");
  b = b.replace(/ — /g, ", ");
  b = b.replace(
    /Park City, enormous at 7,300 acres, but just one resort\./g,
    "Park City Mountain at 7,300 acres, but just one resort in Utah."
  );
  return b;
}

function extractFaqInner(html) {
  const m = html.match(
    /<div class="faq-list">\s*([\s\S]*)<\/div>\s*<div class="cross-links">/
  );
  if (!m) {
    console.error("faq-list extract failed");
    return "";
  }
  let inner = m[1].trim();
  inner = inner.replace(/class="faq-item"/g, 'class="pp-faq-item"');
  inner = inner.replace(/class="faq-q"/g, 'class="pp-faq-q"');
  inner = inner.replace(/class="faq-a"/g, 'class="pp-faq-a"');
  return inner;
}

function extractLdJsonString(html) {
  const m = html.match(/<script type="application\/ld\+json">\s*([\s\S]*?)\s*<\/script>/);
  return m ? m[1].trim() : "{}";
}

function extractStateBlock(html) {
  const start = html.indexOf('<div class="content">');
  if (start === -1) throw new Error("no content div");
  const bodyStart = html.indexOf("\n", start) + 1;
  const faqMarker =
    '<div class="section-header" style="margin-top:56px">\n    <h2>Frequently Asked Questions</h2>';
  const faqIdx = html.indexOf(faqMarker);
  if (faqIdx === -1) throw new Error("no FAQ section header");
  let block = html.slice(bodyStart, faqIdx).trim();
  block = transformStateContent(block);
  block = block.replace(
    /(<div class="rpp-section-head rpp-section-head--spaced">\s*)<h2>📋 Full mountain list<\/h2>/i,
    '<section class="pp-section rpp-full-list" id="full-list" aria-labelledby="full-list-h">$1<h2 id="full-list-h">📋 Full mountain list</h2>'
  );
  block = block.replace(
    /(<\/tbody>\s*<\/table>\s*<\/div>)\s*(<p class="pp-table-note">)/,
    "$1</section>$2"
  );
  return `<div class="rpp-region-states">\n${block}\n</div>`;
}

function buildShell(cfg, stateBlock, faqInner, ldJson) {
  const crossLinks = [
    ["/epic-vs-ikon-northeast/", "Epic vs Ikon: Northeast"],
    ["/epic-vs-ikon-rockies/", "Epic vs Ikon: Rockies"],
    ["/epic-vs-ikon-california/", "Epic vs Ikon: California"],
    ["/epic-vs-ikon-pacific-northwest/", "Epic vs Ikon: Pacific Northwest"],
    ["/epic-vs-ikon-midwest/", "Epic vs Ikon: Midwest"],
  ]
    .filter(([href]) => href !== cfg.crossExclude)
    .map(
      ([href, label]) =>
        `      <a href="${href}"><span class="rpp-cross-label">Pass guide</span><span class="rpp-cross-title">${label}</span></a>`
    )
    .join("\n");

  const quickCards = cfg.quickPicks
    .map(
      (c) => `      <article class="pp-quick-card${c.cls ? " " + c.cls : ""}">
        <div class="pp-quick-card__label">${c.label}</div>
        <div class="pp-quick-card__name">${c.name}</div>
        <p>${c.text}</p>
      </article>`
    )
    .join("\n");

  const statPanel = cfg.stats
    .map((s) => `          <li><strong>${s.n}</strong> ${s.l}</li>`)
    .join("\n");

  const panelBullets = cfg.panelBullets.map((t) => `          <li>${t}</li>`).join("\n");

  const ogTitle = cfg.title.replace(" | WhereToSkiNext.com", "");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${cfg.title}</title>
  <meta name="description" content="${cfg.lede.replace(/"/g, "&quot;")}" />
  <link rel="canonical" href="${cfg.canonical}" />
  <meta property="og:title" content="${ogTitle}" />
  <meta property="og:description" content="${cfg.lede.replace(/"/g, "&quot;")}" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="${cfg.canonical}" />
  <meta property="og:image" content="https://www.wheretoskinext.com/og-image.png" />
  <meta property="og:image:alt" content="WhereToSkiNext.com ski trip planner" />
  <link rel="icon" href="/ski-decision-logo.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preload" href="/hero-bg.jpg" as="image" type="image/jpeg" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700&display=swap" rel="stylesheet" media="print" onload="this.media='all'" />
  <noscript><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700&display=swap" rel="stylesheet" /></noscript>
  <link rel="stylesheet" href="/styles.css" />
  <link rel="stylesheet" href="/ski-pass-comparison/pass-comparison-page.css" />
  <link rel="stylesheet" href="/regional-pass-page.css" />
  <script type="application/ld+json">
${ldJson}
  </script>
</head>
<body class="pass-page-body">
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MCCDNQGB" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<nav class="top-nav" role="navigation" aria-label="Main navigation">
  <div class="top-nav-inner">
    <a href="/" class="nav-brand-link" aria-label="WhereToSkiNext.com home">
      <img src="/ski-decision-logo.svg" alt="WhereToSkiNext.com logo" class="nav-logo" width="30" height="30" />
      <span class="nav-brand">
        <span class="nav-brand-name">WhereToSki<span class="nav-brand-next">Next</span>.com</span>
        <span class="nav-brand-tag">Stop guessing. Start skiing.</span>
      </span>
    </a>
    <div class="nav-divider"></div>
    <a href="/about/" class="nav-primary">About</a>
    <span class="nav-link-sep" aria-hidden="true"></span>
    <a href="/ski-pass-comparison/" class="nav-primary">Pass Guides</a>
  </div>
</nav>
<main class="pp-shell">
  <section class="pp-hero" aria-labelledby="reg-hero-h1">
    <div class="pp-hero__inner">
      <p class="pp-breadcrumb"><a href="/">Home</a> / ${cfg.breadcrumb}</p>
      <div>
        <p class="pp-eyebrow">Pass guide · Epic vs Ikon</p>
        <h1 id="reg-hero-h1" class="pp-headline">${cfg.h1}</h1>
        <p class="pp-lede">${cfg.lede}</p>
        <div class="pp-hero__actions">
          <a href="https://www.wheretoskinext.com/#searchSection" class="pp-btn pp-btn--primary">Find my mountain</a>
          <a href="/ski-pass-comparison/" class="pp-btn pp-btn--ghost">All pass guides</a>
        </div>
      </div>
      <aside class="pp-hero__panel" aria-label="Region snapshot">
        <h3>Counts</h3>
        <ul class="pp-hero-panel-list">
${statPanel}
        </ul>
        <h3 class="pp-hero-panel-h3">Remember</h3>
        <ul class="pp-hero-panel-list">
${panelBullets}
        </ul>
      </aside>
    </div>
  </section>

  <section class="pp-section" id="quick-picks" aria-labelledby="qp-h">
    <div class="pp-section__head">
      <p class="pp-eyebrow">Quick picks</p>
      <h2 id="qp-h">Start with how you actually ski</h2>
    </div>
    <div class="pp-quick-grid">
${quickCards}
    </div>
  </section>

  <section class="pp-section" id="regional-summary" aria-labelledby="sum-h">
    <div class="pp-section__head">
      <p class="pp-eyebrow">How this region shakes out</p>
      <h2 id="sum-h">Fast read</h2>
    </div>
    <p class="pp-fast-intro">${cfg.fastSummary}</p>
  </section>

${stateBlock}

  <section class="pp-section" id="faq" aria-labelledby="faq-h">
    <div class="pp-section__head">
      <p class="pp-eyebrow">FAQ</p>
      <h2 id="faq-h">Frequently asked questions</h2>
    </div>
    <div>
${faqInner}
    </div>
  </section>

  <section class="pp-section rpp-cross" aria-label="Other regions">
    <h2 class="rpp-cross-section-title">Compare passes in other regions</h2>
    <div class="rpp-cross-grid">
${crossLinks}
    </div>
  </section>

  <section class="pp-cta-band" aria-labelledby="cta-h">
    <div>
      <h2 id="cta-h">Which mountain fits your weekend?</h2>
      <p>Add your location. We rank live snow, drive time, and crowds. Pass fit is built in.</p>
    </div>
    <a href="https://www.wheretoskinext.com/#searchSection" class="pp-btn pp-btn--primary">Find my mountain &rarr;</a>
  </section>
</main>
<footer class="site-footer">
  <p>&copy; 2026 WhereToSkiNext.com · <a href="/#searchSection">Find my mountain</a> · <a href="/about/">About</a> · <a href="/privacy/">Privacy Policy</a> · <a href="/partners/">Partners</a> · <a href="/ski-pass-comparison/">Pass Guides</a></p>
  <p class="site-footer-affiliate">Some links on this site are affiliate links. If you book lodging through them we may earn a small commission at no extra cost to you. This never influences mountain scores or rankings.</p>
</footer>
<script>
window.addEventListener('load', function gtmDeferred() {
  window.removeEventListener('load', gtmDeferred);
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-MCCDNQGB');
});
</script>
</body>
</html>`;
}

for (const key of Object.keys(regions)) {
  const cfg = regions[key];
  const p = path.join(root, cfg.slug, "index.html");
  let html = fs.readFileSync(p, "utf8").replace(/\r\n/g, "\n");
  html = html.replace(
    /\n  <\/div>\n      <div class="cross-link-title">Epic vs Ikon: Northeast<\/div>\n    <\/a>[\s\S]*?\n  <\/div>\n  <\/div>\n  <div class="cta-block">/,
    "\n  <div class=\"cta-block\">"
  );
  const ldJson = extractLdJsonString(html).replace(/—/g, ". ").replace(/\u2013/g, " to ");
  const stateBlock = extractStateBlock(html);
  const faqInner = extractFaqInner(html);
  if (!faqInner) {
    console.error("Missing FAQ:", cfg.slug);
    process.exit(1);
  }
  const out = buildShell(cfg, stateBlock, faqInner, ldJson);
  fs.writeFileSync(p, out);
  console.log("Wrote", cfg.slug);
}
