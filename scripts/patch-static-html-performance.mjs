/**
 * Non-blocking Google Fonts, og:image:alt, deferred GTM for static index.html files.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const SKIP = new Set(['node_modules', '.git']);

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (name === 'index.html') out.push(p);
  }
  return out;
}

const GTM_FOOTER = `<script>
window.addEventListener('load', function gtmDeferred() {
  window.removeEventListener('load', gtmDeferred);
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-MCCDNQGB');
});
</script>
`;

function patchFonts(html) {
  if (/media="print"[\s\S]{0,240}onload="this\.media='all'"/.test(html)) return { html, ok: false };
  let h = html;
  let changed = false;
  const re = /([ \t]*)<link href="(https:\/\/fonts\.googleapis\.com\/css2\?[^"]+)" rel="stylesheet"( \/)?>/g;
  h = h.replace(re, (full, indent, url, sc) => {
    if (full.includes('media="print"')) return full;
    changed = true;
    const close = sc || '';
    return `${indent}<link href="${url}" rel="stylesheet" media="print" onload="this.media='all'"${close}>\n${indent}<noscript><link href="${url}" rel="stylesheet"${close}></noscript>`;
  });
  return { html: h, ok: changed };
}

function patchOgAlts(html) {
  let h = html;
  let changed = false;
  if (!h.includes('property="og:image:alt"')) {
    const m = h.match(/<meta property="og:image" content="[^"]+"\s*\/?>/);
    if (m) {
      h = h.replace(
        m[0],
        `${m[0]}\n  <meta property="og:image:alt" content="WhereToSkiNext.com — ski trip planner" />`
      );
      changed = true;
    }
  }
  if (!h.includes('name="twitter:image:alt"')) {
    const m = h.match(/<meta name="twitter:image" content="[^"]+"\s*\/?>/);
    if (m) {
      h = h.replace(
        m[0],
        `${m[0]}\n  <meta name="twitter:image:alt" content="WhereToSkiNext.com — ski trip planner" />`
      );
      changed = true;
    }
  }
  return { html: h, ok: changed };
}

function stripGtmFromHead(html) {
  const withComments =
    /\s*<!-- Google Tag Manager -->\s*<script>\(function\(w,d,s,l,i\)\{[\s\S]*?GTM-MCCDNQGB'\);<\/script>\s*<!-- End Google Tag Manager -->\s*/;
  if (withComments.test(html)) return html.replace(withComments, '\n');

  const m = html.match(/<head>([\s\S]*?)<\/head>/i);
  if (!m || !m[1].includes('GTM-MCCDNQGB')) return html;
  const newInner = m[1].replace(
    /<script>\(function\(w,d,s,l,i\)\{[\s\S]*?GTM-MCCDNQGB[\s\S]*?<\/script>\s*/g,
    ''
  );
  if (newInner === m[1]) return html;
  return html.replace(/<head>[\s\S]*?<\/head>/i, `<head>${newInner}</head>`);
}

function patchGtm(html) {
  if (html.includes('function gtmDeferred')) return { html, ok: false };
  if (!html.includes('GTM-MCCDNQGB')) return { html, ok: false };

  let h = stripGtmFromHead(html);
  if (h === html) return { html, ok: false };
  if (!h.includes('</body>')) return { html: html, ok: false };
  h = h.replace(/<\/body>/i, `${GTM_FOOTER}</body>`);
  return { html: h, ok: true };
}

let total = 0;
let updated = 0;

for (const file of walk(root)) {
  let html = readFileSync(file, 'utf8');
  const orig = html;

  html = patchFonts(html).html;
  html = patchGtm(html).html;
  html = patchOgAlts(html).html;

  if (html !== orig) {
    writeFileSync(file, html, 'utf8');
    updated++;
  }
  total++;
}

console.log(`Scanned ${total} index.html files; updated ${updated}.`);
