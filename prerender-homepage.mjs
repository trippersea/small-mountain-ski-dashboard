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

// ─── Static table rows ────────────────────────────────────────────────────
function buildTableRows(resorts) {
  return resorts.map(r => `<tr data-id="${esc(r.id)}" data-static="true">
      <td><input type="checkbox" data-compare="${esc(r.id)}" /></td>
      <td><div class="row-name"><a href="/ski-report/${esc(r.id)}/" style="color:inherit;text-decoration:none">${esc(r.name)}</a></div></td>
      <td>${esc(r.state)}</td>
      <td>${esc(r.passGroup)}</td>
      <td><span class="score-badge">—</span></td>
      <td>—</td>
      <td>—</td>
      <td>—</td>
      <td>${r.vertical.toLocaleString()}</td>
      <td>${r.trails}</td>
      <td>$${r.price}</td>
      <td>—</td>
      <td>—</td>
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

// 3. ItemList schema in <head>
const schemaTag = `  <script type="application/ld+json">\n${buildItemListSchema(RESORTS)}\n  </script>`;
html = html.replace('</head>', `${schemaTag}\n</head>`);

// 4. Write back
writeFileSync('./index.html', html, 'utf8');

console.log(`✓  Injected ${RESORTS.length} static table rows into index.html`);
console.log(`✓  Injected summary card counts`);
console.log(`✓  Injected ItemList schema (${Math.min(50, RESORTS.length)} items)`);
