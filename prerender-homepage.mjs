// prerender-homepage.mjs
// Runs at deploy time via vercel.json buildCommand.
// Injects static mountain data into index.html so Googlebot sees real content
// without waiting for JavaScript. JS clears and replaces these rows at runtime.

import { readFileSync, writeFileSync } from 'fs';

// ─── Load resort data ──────────────────────────────────────────────────────
function parseResortArray(filePath, varName) {
  const src = readFileSync(filePath, 'utf8');
  const match = src.match(new RegExp(`const ${varName}\\s*=\\s*(\\[[\\s\\S]*?\\]);\\s*\n`));
  if (!match) {
    console.warn(`Could not parse ${varName} from ${filePath}`);
    return [];
  }
  try {
    return JSON.parse(match[1]);
  } catch (e) {
    console.warn(`JSON parse error in ${filePath}:`, e.message);
    return [];
  }
}

const RESORTS_NE       = parseResortArray('./sd-data.js',          'RESORTS_NE');
const RESORTS_NATIONAL = parseResortArray('./resorts-national.js', 'RESORTS_NATIONAL');
const RESORTS          = [...RESORTS_NE, ...RESORTS_NATIONAL];

console.log(`Loaded ${RESORTS.length} resorts (${RESORTS_NE.length} NE + ${RESORTS_NATIONAL.length} national)`);

if (RESORTS.length === 0) {
  console.error('No resorts loaded — aborting pre-render to avoid wiping the table.');
  process.exit(1);
}

// ─── Helpers ──────────────────────────────────────────────────────────────
const esc = s => String(s ?? '')
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

// ─── Static table rows (match compare table in index.html: 9 columns) ─────
function awinBookingSearchHref(r) {
  const dest = `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(`${r.name}, ${r.state}`)}`;
  return `https://www.awin1.com/cread.php?awinmid=6776&awinaffid=2816032&ued=${encodeURIComponent(dest)}`;
}

function buildTableRows(resorts) {
  return resorts.map((r, idx) => `<tr data-id="${esc(r.id)}" data-static="true">
      <td class="compare-rank-cell"><span class="compare-rank" aria-hidden="true">${idx + 1}</span></td>
      <td class="compare-select-cell"><input type="checkbox" data-compare="${esc(r.id)}" /></td>
      <td>
        <div class="table-mountain-cell">
          <div class="table-mountain-name-row">
            <a class="row-name row-name--report" href="/ski-report/${esc(r.id)}/">${esc(r.name)}</a>
          </div>
          <div class="row-sub">${esc(r.state)}</div>
        </div>
      </td>
      <td class="compare-weekend">—</td>
      <td class="compare-drive">—</td>
      <td>${esc(r.passGroup)}</td>
      <td>—</td>
      <td>$${r.price}</td>
      <td>
        <a class="table-lodging-link" href="${esc(awinBookingSearchHref(r))}" target="_blank" rel="noopener sponsored">Find a place →</a>
      </td>
    </tr>`).join('\n');
}

// ─── Static summary cards ─────────────────────────────────────────────────
function buildSummaryCards(resorts) {
  const stats = [
    ['Mountains',   resorts.length,                                              'in the database'],
    ['Epic',        resorts.filter(r => r.passGroup === 'Epic').length,          'resorts'],
    ['Ikon',        resorts.filter(r => r.passGroup === 'Ikon').length,          'resorts'],
    ['Indy',        resorts.filter(r => r.passGroup === 'Indy').length,          'resorts'],
    ['Independent', resorts.filter(r => r.passGroup === 'Independent').length,   'resorts'],
  ];
  return stats.map(([label, value, sub]) =>
    `<div class="db-stat"><div class="db-stat-value">${value}</div><div class="db-stat-label">${esc(label)}</div><div class="db-stat-sub">${esc(sub)}</div></div>`
  ).join('');
}

// ─── ItemList schema ──────────────────────────────────────────────────────
function buildItemListSchema(resorts) {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'US Ski Resorts ranked by live snow, drive time, and crowds',
    description: `${resorts.length} US ski mountains ranked in real time by snow forecast, drive time, pass affiliation, and crowd outlook.`,
    numberOfItems: resorts.length,
    itemListElement: resorts.slice(0, 50).map((r, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: r.name,
      url: `https://www.wheretoskinext.com/ski-report/${r.id}/`,
      description: `${r.name} — ${r.vertical.toLocaleString()} ft vertical, ${r.trails} trails, ${r.passGroup} pass, ${r.state}. Avg snowfall: ${r.avgSnowfall}".`,
    })),
  }, null, 2);
}

// ─── Inject into index.html ───────────────────────────────────────────────
let html = readFileSync('./index.html', 'utf8');

// 1. Static table rows
html = html.replace(
  '<tbody id="comparisonBody"></tbody>',
  `<tbody id="comparisonBody" data-prerendered="true">\n${buildTableRows(RESORTS)}\n    </tbody>`
);

// 2. Static summary cards
html = html.replace(
  '<div id="summaryCards" class="db-summary-grid"></div>',
  `<div id="summaryCards" class="db-summary-grid" data-prerendered="true">${buildSummaryCards(RESORTS)}</div>`
);

// 3. ItemList schema in <head> — replace existing block so deploy does not duplicate JSON-LD
const itemListHtml = `  <script type="application/ld+json" id="ld-home-itemlist">\n${buildItemListSchema(RESORTS)}\n  </script>`;
const itemListRe = /<script type="application\/ld\+json" id="ld-home-itemlist">[\s\S]*?<\/script>/;
if (itemListRe.test(html)) {
  html = html.replace(itemListRe, itemListHtml);
} else {
  html = html.replace('</head>', `${itemListHtml}\n</head>`);
}

// 4. Write back
writeFileSync('./index.html', html, 'utf8');

console.log(`✓  Injected ${RESORTS.length} static table rows into index.html`);
console.log(`✓  Injected summary card counts`);
console.log(`✓  Injected ItemList schema (${Math.min(50, RESORTS.length)} items)`);
