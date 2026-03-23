#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────────────────
// add-live-cta-banner.js
// Adds a sticky "Live Conditions" CTA banner to every ski-report page.
// The banner pulls users from the static SEO page into the full interactive app.
//
// Usage (run from your project root):
//   node add-live-cta-banner.js
// ─────────────────────────────────────────────────────────────────────────────

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── The sticky banner CSS + HTML ─────────────────────────────────────────────
const BANNER_CSS = `
    /* ── Sticky Live CTA Banner ── */
    .live-cta-banner {
      position: fixed;
      bottom: 0; left: 0; right: 0;
      z-index: 999;
      background: linear-gradient(135deg, #0f1f35 0%, #1b3356 100%);
      border-top: 1px solid rgba(43,109,233,.4);
      box-shadow: 0 -4px 24px rgba(0,0,0,.25);
      padding: 14px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      transform: translateY(100%);
      transition: transform .35s cubic-bezier(.4,0,.2,1);
    }
    .live-cta-banner.visible { transform: translateY(0); }
    .live-cta-left {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
    }
    .live-cta-pulse {
      width: 10px; height: 10px; border-radius: 50%;
      background: #34d399; flex-shrink: 0;
      animation: livePulse 1.8s ease-in-out infinite;
    }
    .live-cta-text {
      display: flex; flex-direction: column; min-width: 0;
    }
    .live-cta-title {
      font-size: 14px; font-weight: 700; color: #fff;
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .live-cta-sub {
      font-size: 12px; color: rgba(255,255,255,.55);
      white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .live-cta-right {
      display: flex; align-items: center; gap: 10px; flex-shrink: 0;
    }
    .live-cta-btn {
      background: #2b6de9;
      color: #fff;
      font-size: 13px; font-weight: 700;
      padding: 9px 18px;
      border-radius: 999px;
      text-decoration: none;
      white-space: nowrap;
      transition: background .15s;
    }
    .live-cta-btn:hover { background: #1d5fd4; }
    .live-cta-dismiss {
      background: none; border: none; cursor: pointer;
      color: rgba(255,255,255,.4); font-size: 20px; line-height: 1;
      padding: 4px 6px;
      transition: color .15s;
    }
    .live-cta-dismiss:hover { color: rgba(255,255,255,.8); }
    @media (max-width: 480px) {
      .live-cta-sub { display: none; }
      .live-cta-btn { font-size: 12px; padding: 8px 14px; }
    }`;

function buildBannerHtml(resortName, resortId) {
  const appUrl = `https://wheretoskinext.com/?resort=${resortId}`;
  return `
  <!-- ── Sticky Live Conditions CTA Banner ── -->
  <div class="live-cta-banner" id="liveCta" role="complementary" aria-label="Live conditions available">
    <div class="live-cta-left">
      <div class="live-cta-pulse"></div>
      <div class="live-cta-text">
        <span class="live-cta-title">Live Ski Score &amp; Snow Forecast</span>
        <span class="live-cta-sub">Drive time, crowd outlook &amp; personalized score for ${resortName}</span>
      </div>
    </div>
    <div class="live-cta-right">
      <a href="${appUrl}" class="live-cta-btn">See Live Conditions →</a>
      <button class="live-cta-dismiss" id="liveCtaDismiss" aria-label="Dismiss">×</button>
    </div>
  </div>
  <script>
    (function() {
      var banner = document.getElementById('liveCta');
      var dismiss = document.getElementById('liveCtaDismiss');
      // Show banner after 2 seconds if not previously dismissed
      var dismissed = sessionStorage.getItem('liveCtaDismissed');
      if (!dismissed) {
        setTimeout(function() {
          banner.classList.add('visible');
        }, 2000);
      }
      // Dismiss button
      dismiss.addEventListener('click', function() {
        banner.classList.remove('visible');
        sessionStorage.setItem('liveCtaDismissed', '1');
      });
    })();
  </script>`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const reportDir = path.join(__dirname, 'ski-report');
if (!fs.existsSync(reportDir)) {
  console.error('❌ ski-report/ folder not found. Run from your project root.');
  process.exit(1);
}

let patched = 0;
let skipped = 0;

const subDirs = fs.readdirSync(reportDir, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

for (const resortId of subDirs) {
  const filePath = path.join(reportDir, resortId, 'index.html');
  if (!fs.existsSync(filePath)) continue;

  let html = fs.readFileSync(filePath, 'utf8');

  // Skip if banner already present
  if (html.includes('live-cta-banner')) {
    skipped++;
    continue;
  }

  // Extract resort name from <h1> tag
  const nameMatch = html.match(/<h1[^>]*class="resort-name"[^>]*>([^<]+)<\/h1>/);
  const resortName = nameMatch ? nameMatch[1].trim() : resortId;

  // 1. Inject CSS before closing </style>
  html = html.replace('</style>', BANNER_CSS + '\n  </style>');

  // 2. Inject banner HTML before closing </body>
  const bannerHtml = buildBannerHtml(resortName, resortId);
  html = html.replace('</body>', bannerHtml + '\n</body>');

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`  ✓ Patched: ski-report/${resortId}/index.html`);
  patched++;
}

console.log(`\n─────────────────────────────────────`);
console.log(`✅ Done! ${patched} files patched, ${skipped} already had banner or skipped.`);
console.log(`\nNext steps:`);
console.log(`  1. Check GitHub Desktop — you should only see ski-report/ files changed`);
console.log(`  2. Commit: "Add live conditions CTA banner to ski-report pages"`);
console.log(`  3. Push to main — Vercel will auto-deploy`);
console.log(`  4. Verify: visit wheretoskinext.com/ski-report/mt-baker-ski-area`);
console.log(`     A dark sticky banner should appear at the bottom after 2 seconds`);
