#!/usr/bin/env node
/**
 * build-story-pages.mjs — generates Stories hub + article HTML from templates.
 * Run: node scripts/build-story-pages.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

function navHtml(storiesCurrent = false) {
  const storiesLink = storiesCurrent
    ? '<a href="/stories/" class="nav-primary" aria-current="page">Stories</a>'
    : '<a href="/stories/" class="nav-primary">Stories</a>';
  return `  <nav class="top-nav" role="navigation" aria-label="Main navigation">
    <div class="top-nav-inner">
      <a href="/" class="nav-brand-link" aria-label="WhereToSkiNext.com home">
        <img src="/wtsn-icon.svg" alt="WhereToSkiNext.com logo" class="nav-logo" width="30" height="30" />
        <span class="nav-brand">
          <span class="nav-brand-name">WhereToSki<span class="nav-brand-next">Next</span>.com</span>
          <span class="nav-brand-tag">Stop guessing. Start skiing.</span>
        </span>
      </a>
      <div class="nav-divider"></div>
      <div class="nav-browse-wrap">
        <button class="nav-primary nav-browse-btn" aria-expanded="false" aria-haspopup="true">Browse &#9662;</button>
        <div class="nav-browse-dropdown" role="menu">
          <div class="nav-browse-col">
            <div class="nav-browse-region">Northeast</div>
            <a href="/ski/connecticut/" role="menuitem">Connecticut</a>
            <a href="/ski/maine/" role="menuitem">Maine</a>
            <a href="/ski/massachusetts/" role="menuitem">Massachusetts</a>
            <a href="/ski/new-hampshire/" role="menuitem">New Hampshire</a>
            <a href="/ski/new-jersey/" role="menuitem">New Jersey</a>
            <a href="/ski/new-york/" role="menuitem">New York</a>
            <a href="/ski/pennsylvania/" role="menuitem">Pennsylvania</a>
            <a href="/ski/rhode-island/" role="menuitem">Rhode Island</a>
            <a href="/ski/vermont/" role="menuitem">Vermont</a>
          </div>
          <div class="nav-browse-col">
            <div class="nav-browse-region">Southeast</div>
            <a href="/ski/maryland/" role="menuitem">Maryland</a>
            <a href="/ski/north-carolina/" role="menuitem">North Carolina</a>
            <a href="/ski/tennessee/" role="menuitem">Tennessee</a>
            <a href="/ski/virginia/" role="menuitem">Virginia</a>
            <a href="/ski/west-virginia/" role="menuitem">West Virginia</a>
            <div class="nav-browse-region" style="margin-top:10px;">Midwest</div>
            <a href="/ski/illinois/" role="menuitem">Illinois</a>
            <a href="/ski/indiana/" role="menuitem">Indiana</a>
            <a href="/ski/iowa/" role="menuitem">Iowa</a>
            <a href="/ski/michigan/" role="menuitem">Michigan</a>
            <a href="/ski/minnesota/" role="menuitem">Minnesota</a>
            <a href="/ski/missouri/" role="menuitem">Missouri</a>
            <a href="/ski/ohio/" role="menuitem">Ohio</a>
            <a href="/ski/wisconsin/" role="menuitem">Wisconsin</a>
          </div>
          <div class="nav-browse-col">
            <div class="nav-browse-region">Rockies</div>
            <a href="/ski/colorado/" role="menuitem">Colorado</a>
            <a href="/ski/idaho/" role="menuitem">Idaho</a>
            <a href="/ski/montana/" role="menuitem">Montana</a>
            <a href="/ski/new-mexico/" role="menuitem">New Mexico</a>
            <a href="/ski/utah/" role="menuitem">Utah</a>
            <a href="/ski/wyoming/" role="menuitem">Wyoming</a>
            <div class="nav-browse-region" style="margin-top:10px;">West</div>
            <a href="/ski/alaska/" role="menuitem">Alaska</a>
            <a href="/ski/arizona/" role="menuitem">Arizona</a>
            <a href="/ski/california/" role="menuitem">California</a>
            <a href="/ski/nevada/" role="menuitem">Nevada</a>
            <a href="/ski/oregon/" role="menuitem">Oregon</a>
            <a href="/ski/washington/" role="menuitem">Washington</a>
          </div>
        </div>
      </div>
      <span class="nav-link-sep" aria-hidden="true"></span>
      <a href="/about/" class="nav-primary">About</a>
      <span class="nav-link-sep" aria-hidden="true"></span>
      ${storiesLink}
      <span class="nav-link-sep" aria-hidden="true"></span>
      <a href="/ski-pass-comparison/" class="nav-primary">Pass Guides</a>
      <span class="nav-link-sep" aria-hidden="true"></span>
      <div class="nav-subscribe-wrap">
        <button class="nav-subscribe-btn" id="navSubBtn" aria-expanded="false" aria-haspopup="true">Subscribe &#9662;</button>
        <div class="nav-subscribe-dropdown" id="navSubDropdown">
          <div id="navSubForm">
            <div class="nav-subscribe-kicker">Weekly during ski season</div>
            <p class="nav-subscribe-headline">One top pick per region.</p>
            <p class="nav-subscribe-sub">Every Friday: snow totals, crowd outlook, pass coverage. Five regions, one clear call each.</p>
            <div class="nav-subscribe-row">
              <input type="email" id="navSubEmail" class="nav-subscribe-input" placeholder="you@email.com" autocomplete="email" spellcheck="false" />
              <button id="navSubSubmit" class="nav-subscribe-submit" type="button">Get the picks</button>
            </div>
            <p id="navSubErr" class="nav-subscribe-err" role="alert"></p>
            <p class="nav-subscribe-fine">Weekly during ski season. No spam. Unsubscribe anytime.</p>
          </div>
          <div id="navSubOk" class="nav-subscribe-ok">
            <div class="nav-subscribe-ok-icon">&#10003;</div>
            <p class="nav-subscribe-ok-head">You're on the list</p>
            <p class="nav-subscribe-ok-sub">First issue hits when the season opens. See you out there.</p>
          </div>
        </div>
      </div>
    </div>
  </nav>`;
}

function pageShell({ title, description, canonical, bodyClass, extraHead = '', main, storiesCurrent = false, ogType = 'website' }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:type" content="${ogType}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="https://wheretoskinext.com/wtsn-og.png" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="https://wheretoskinext.com/wtsn-og.png" />
  <link rel="icon" href="/wtsn-favicon.svg" type="image/svg+xml" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="preload" href="/hero-bg.jpg" as="image" type="image/jpeg" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700&display=swap" rel="stylesheet" media="print" onload="this.media='all'" />
  <noscript><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Newsreader:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700&display=swap" rel="stylesheet" /></noscript>
  <link rel="stylesheet" href="/styles.css" />
  <link rel="stylesheet" href="/about-page.css" />
  <link rel="stylesheet" href="/stories-page.css" />
  <link rel="stylesheet" href="/newsletter-band.css" />
  <link rel="stylesheet" href="/site-tokens-bridge.css" />
  ${extraHead}
</head>
<body class="about-page-body stories-page-body ${bodyClass}">
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MCCDNQGB" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>

${navHtml(storiesCurrent)}

${main}

  <script src="/newsletter-band.js"></script>

<footer class="site-footer">
  <p>&copy; 2026 WhereToSkiNext.com &middot; <a href="/#searchSection">Find my mountain</a> &middot; <a href="/about/">About</a> &middot; <a href="/stories/">Stories</a> &middot; <a href="/privacy/">Privacy Policy</a> &middot; <a href="/partners/">Partners</a> &middot; <a href="/ski-pass-comparison/">Pass Guides</a></p>
  <p class="site-footer-affiliate">Some links on this site are affiliate links. If you book lodging through them we may earn a small commission at no extra cost to you. This never influences mountain scores or rankings.</p>
</footer>

<script>
window.addEventListener('load', function gtmDeferred() {
  window.removeEventListener('load', gtmDeferred);
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-MCCDNQGB');
});
</script>
<script src="/nav.js"></script>

</body>
</html>`;
}

const indexMain = `<main class="about-page-shell">

  <section class="story-article-hero" aria-labelledby="stories-hub-h1">
    <div class="story-article-hero__inner">
      <p class="about-page-breadcrumb"><a href="/">Home</a> / Stories</p>
      <p class="about-page-eyebrow">Stories</p>
      <h1 id="stories-hub-h1" class="story-article-hero__title">Ski writing from someone who actually goes</h1>
      <p class="story-article-hero__meta">Opinion, culture, and the occasional rant. Same voice as the rest of this site.</p>
    </div>
  </section>

  <div class="stories-index-intro">
    <h2>Latest</h2>
    <p>Longer reads on what skiing feels like, not just what the data says. We will add more as the season goes.</p>
  </div>

  <div class="stories-grid">
    <a href="/stories/heres-to-the-two-seaters/" class="story-card">
      <p class="story-card__kicker">Lift culture</p>
      <h2 class="story-card__title">Here's to the Two-Seaters</h2>
      <p class="story-card__deck">Fixed-grip doubles are disappearing. Faster lifts do not make the mountain bigger. They just make it busier.</p>
      <span class="story-card__read">Read the story &rarr;</span>
    </a>
  </div>

</main>`;

const articleJsonLd = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Here's to the Two-Seaters",
  "description": "Fixed-grip doubles are disappearing from ski resorts. A case for slower lifts, quieter laps, and mountains that feel like skiing again.",
  "url": "https://wheretoskinext.com/stories/heres-to-the-two-seaters/",
  "datePublished": "2026-06-07",
  "dateModified": "2026-06-07",
  "author": { "@type": "Organization", "name": "WhereToSkiNext.com", "url": "https://wheretoskinext.com/" },
  "publisher": {
    "@type": "Organization",
    "name": "WhereToSkiNext.com",
    "url": "https://wheretoskinext.com/",
    "logo": { "@type": "ImageObject", "url": "https://wheretoskinext.com/wtsn-icon.svg" }
  },
  "image": "https://wheretoskinext.com/wtsn-og.png",
  "mainEntityOfPage": "https://wheretoskinext.com/stories/heres-to-the-two-seaters/"
}
</script>`;

const articleMain = `<main class="story-article-page">

  <section class="story-article-hero" aria-labelledby="story-h1">
    <div class="story-article-hero__inner">
      <p class="about-page-breadcrumb"><a href="/">Home</a> / <a href="/stories/">Stories</a> / Here's to the Two-Seaters</p>
      <p class="about-page-eyebrow">Lift culture</p>
      <h1 id="story-h1" class="story-article-hero__title">Here's to the Two-Seaters</h1>
      <p class="story-article-hero__meta">June 2026</p>
      <p class="story-article-hero__dek">If you've ever spent 12 minutes slowly creeping up a mountain on an old fixed-grip double, legs dangling, wind whistling, conversation flowing, you know that kind of chairlift ride is getting harder to find.</p>
    </div>
  </section>

  <div class="story-stat-strip" aria-label="Lift capacity comparison">
    <div class="story-stat-strip__inner">
      <div class="story-stat">
        <span class="story-stat__value">900</span>
        <span class="story-stat__label">people per hour on a fixed-grip double</span>
      </div>
      <div class="story-stat">
        <span class="story-stat__value">~2,700</span>
        <span class="story-stat__label">on a detachable quad</span>
      </div>
      <div class="story-stat">
        <span class="story-stat__value">12 min</span>
        <span class="story-stat__label">on a slow double, if you are lucky</span>
      </div>
    </div>
  </div>

  <div class="story-article-band">
    <article class="story-article-body">
      <div class="story-body">
        <p>More and more resorts are phasing out their two-seaters in favor of high-speed quads and six-packs. From a business perspective, it makes sense: more vertical per hour, better ROI when pass holders want to rack up days, fewer complaints about lift lines. Nobody is wrong to want that. But for those of us who actually like skiing the mountain, not just cycling it, there is a cost. And we are starting to feel it.</p>

        <p>First the numbers. Your average fixed-grip double moves about 900 people per hour. A detachable quad? Nearly triple that. That solves the lift line, but it hands you a different problem: the same trails, now with three times the traffic on them. Faster lifts do not make the mountain bigger. They just make it busier. None of this means fast is bad. On the main arteries, moving people efficiently is exactly the point. But run that math across a whole mountain and the trails that used to stay untouched until noon are tracked out by mid-morning. That two-minute lift ride you love? Great. But now you are back at the bottom with a few hundred of your closest friends, five times an hour, and so is everyone else.</p>

        <p>Beginners feel it too, in a different way. Wide-open green groomers, the ones that are perfect for your first season, are now speedways. High-speed access means advanced skiers are bombing those same runs lap after lap, and a nervous first-timer trying to link turns is suddenly sharing the trail with people doing 40. The terrain that is supposed to be the gentlest on the mountain stops feeling that way.</p>

        <p>There is something sacred about those slower, quieter laps. The ones off a mid-mountain double that somehow always stays uncrowded. The glades with a locals-only feel. The bump run that does not get chopped up in the first 45 minutes. The old double chair slowed you down on purpose. You were not in a rush. You were not pounding vert to get your money's worth. You were skiing, talking, looking around, and occasionally just sitting in silence, watching the snow drift sideways.</p>

        <p>Some places still get it. <a href="/ski-report/mad-river-glen/">Mad River Glen</a> has its single chair. <a href="/ski-report/alta-ski-area/">Alta</a> still runs old fixed-grips. <a href="/ski-report/magic-mountain/">Magic Mountain</a> held onto its mid-mountain doubles for years because they worked.</p>

        <p>The question is not whether we should stop upgrading lifts altogether. Of course not. Modern high-speed quads have their place, especially on the main arteries where moving big volumes of skiers efficiently is the whole job. But there is also value in protecting the slower, soulful doubles that access terrain meant to be savored, not rushed. And when a mountain plans an upgrade, the conversation cannot stop at the ride up. Are we ready for the downhill traffic that comes with it?</p>

        <p>We all love fast laps now and then. But if every lift becomes a bullet train, we will look around one day and realize the mountains feel more crowded, more rushed, and a little less like the thing we fell for in the first place.</p>
      </div>
    </article>
  </div>

  <blockquote class="story-outro">
    <p class="story-outro__text">So here is to the two-seaters. The creaky, quiet, character-rich relics that helped shape the skiing we love.</p>
  </blockquote>

  <div class="story-article-cta">
    <p><strong>Planning a weekend?</strong> Rank mountains from your ZIP with live snow, drive time, and crowd outlook.</p>
    <a href="/#searchSection" class="about-page-btn about-page-btn--primary">Find my mountain</a>
  </div>

</main>`;

const indexHtml = pageShell({
  title: 'Stories | WhereToSkiNext.com',
  description: 'Ski writing on lift culture, mountain character, and the decisions that shape a day on snow. From the team behind WhereToSkiNext.',
  canonical: 'https://wheretoskinext.com/stories/',
  bodyClass: 'stories-index-page',
  main: indexMain,
  storiesCurrent: true,
});

const articleHtml = pageShell({
  title: "Here's to the Two-Seaters | WhereToSkiNext Stories",
  description: 'Fixed-grip doubles are disappearing from ski resorts. A case for slower lifts, quieter laps, and mountains that feel like skiing again.',
  canonical: 'https://wheretoskinext.com/stories/heres-to-the-two-seaters/',
  bodyClass: 'stories-article-page',
  extraHead: articleJsonLd,
  main: articleMain,
  storiesCurrent: true,
  ogType: 'article',
});

fs.mkdirSync(path.join(root, 'stories'), { recursive: true });
fs.mkdirSync(path.join(root, 'stories', 'heres-to-the-two-seaters'), { recursive: true });
fs.writeFileSync(path.join(root, 'stories', 'index.html'), indexHtml, 'utf8');
fs.writeFileSync(path.join(root, 'stories', 'heres-to-the-two-seaters', 'index.html'), articleHtml, 'utf8');

console.log('✓ stories/index.html');
console.log('✓ stories/heres-to-the-two-seaters/index.html');
