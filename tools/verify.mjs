/**
 * Pre-publish checks for a no-build static site.
 *
 *   node tools/verify.mjs
 *
 * Catches the failure modes that actually bite a hand-maintained multi-page
 * site: nav drift between pages, links to files that don't exist, images
 * without alt text, and half-finished placeholder copy going live.
 *
 * Exits 1 if any error is found, 0 otherwise. Warnings never fail the run.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SKIP_DIRS = new Set(['.git', 'node_modules', '_incoming', '.claude', 'tools']);

const errors = [];
const warnings = [];

const err = (file, message) => errors.push(`${file}: ${message}`);
const warn = (file, message) => warnings.push(`${file}: ${message}`);

/* ------------------------------------------------------------------ */

function collectHtml(dir, found = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) collectHtml(full, found);
    else if (entry.endsWith('.html')) found.push(full);
  }
  return found;
}

/** Strip comments so placeholder prose inside <!-- --> doesn't trip checks. */
const stripComments = (html) => html.replace(/<!--[\s\S]*?-->/g, '');

/** Pull a named shared block, normalising the one attribute that varies. */
function sharedBlock(html, name) {
  const match = html.match(
    new RegExp(`<!--\\s*SHARED:${name} start\\s*-->([\\s\\S]*?)<!--\\s*SHARED:${name} end\\s*-->`)
  );
  return match ? match[1].replace(/\s+aria-current="page"/g, '').trim() : null;
}

/* ------------------------------------------------------------------ */

const files = collectHtml(ROOT);

if (files.length === 0) {
  console.error('No HTML files found. Run this from the repository root.');
  process.exit(1);
}

const anchorsByPage = new Map();
const sharedRef = { HEADER: null, FOOTER: null };

// Pass 1 — collect every id so cross-page anchor links can be checked.
for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const ids = new Set();
  for (const m of html.matchAll(/\sid="([^"]+)"/g)) ids.add(m[1]);
  anchorsByPage.set('/' + relative(ROOT, file).replace(/\\/g, '/'), ids);
}

/** Map a site-absolute URL path to the file that serves it. */
function resolveUrlToFile(urlPath) {
  const clean = urlPath.replace(/\/+$/, '');
  const candidates = clean === ''
    ? ['index.html']
    : [clean.replace(/^\//, ''), join(clean.replace(/^\//, ''), 'index.html')];

  for (const candidate of candidates) {
    const full = join(ROOT, candidate);
    if (existsSync(full) && statSync(full).isFile()) {
      return '/' + relative(ROOT, full).replace(/\\/g, '/');
    }
  }
  return null;
}

// Pass 2 — per-file checks.
for (const file of files) {
  const rel = relative(ROOT, file).replace(/\\/g, '/');
  const raw = readFileSync(file, 'utf8');
  const html = stripComments(raw);

  /* --- document basics ------------------------------------------- */

  if (!/^<!DOCTYPE html>/i.test(raw)) err(rel, 'missing <!DOCTYPE html>');
  if (!/<html[^>]+lang="en"/.test(raw)) err(rel, 'missing lang="en" on <html>');
  if (!/<meta charset="utf-8">/i.test(raw)) err(rel, 'missing charset declaration');
  if (!/<meta name="viewport"/.test(raw)) err(rel, 'missing viewport meta');

  const title = raw.match(/<title>([\s\S]*?)<\/title>/);
  if (!title || !title[1].trim()) err(rel, 'missing or empty <title>');

  if (!/<meta name="description" content="[^"]{40,}"/.test(raw)) {
    err(rel, 'missing or too-short meta description');
  }

  const isErrorPage = /name="robots" content="noindex"/.test(raw);
  if (!isErrorPage && !/<link rel="canonical"/.test(raw)) {
    err(rel, 'missing canonical link');
  }

  const h1s = [...html.matchAll(/<h1[\s>]/g)].length;
  if (h1s === 0) err(rel, 'no <h1>');
  if (h1s > 1) err(rel, `${h1s} <h1> elements — expected exactly 1`);

  if (!/class="skip-link"/.test(raw)) err(rel, 'missing skip link');
  if (!/id="main"/.test(raw)) err(rel, 'missing <main id="main">');

  /* --- images ----------------------------------------------------- */

  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt=/.test(m[0])) err(rel, `<img> without alt: ${m[0].slice(0, 90)}`);
  }

  /* --- shared blocks --------------------------------------------- */

  for (const name of ['HEADER', 'FOOTER']) {
    const block = sharedBlock(raw, name);
    if (block === null) {
      err(rel, `missing SHARED:${name} block markers`);
      continue;
    }
    if (sharedRef[name] === null) {
      sharedRef[name] = { block, file: rel };
    } else if (sharedRef[name].block !== block) {
      err(rel, `SHARED:${name} differs from ${sharedRef[name].file} — nav has drifted`);
    }
  }

  /* --- links ------------------------------------------------------ */

  for (const m of html.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];

    if (/^(https?:|mailto:|tel:|data:)/.test(href)) continue;

    const [path, anchor] = href.split('#');

    if (!path) {
      // Same-page anchor.
      if (anchor && !anchorsByPage.get('/' + rel)?.has(anchor)) {
        err(rel, `anchor #${anchor} does not exist on this page`);
      }
      continue;
    }

    if (!path.startsWith('/')) {
      warn(rel, `relative href "${href}" — prefer site-absolute paths`);
      continue;
    }

    const target = resolveUrlToFile(path);
    if (!target) {
      err(rel, `broken link: ${href}`);
      continue;
    }

    if (anchor && target.endsWith('.html') && !anchorsByPage.get(target)?.has(anchor)) {
      err(rel, `link ${href} points at an id that does not exist in ${target}`);
    }
  }

  /* --- referenced assets ------------------------------------------ */

  for (const m of html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)) {
    if (!existsSync(join(ROOT, m[1].replace(/^\//, '')))) {
      err(rel, `missing asset: ${m[1]}`);
    }
  }

  // og:image is an absolute URL, so the check above never sees it.
  for (const m of raw.matchAll(/property="og:image" content="https:\/\/justin2988\.github\.io(\/[^"]+)"/g)) {
    if (!existsSync(join(ROOT, m[1].replace(/^\//, '')))) {
      err(rel, `og:image points at a file that does not exist: ${m[1]} — run tools/make-og-image.ps1`);
    }
  }

  /* --- unfinished copy -------------------------------------------- */

  // Comments are stripped above, so authoring notes to self are fine.
  // This only fires on placeholder text that would render to a visitor.
  // Case-sensitive on the code markers so class names like
  // "portrait-placeholder" don't trip it.
  const markers = [
    ...(html.match(/\b(TODO|TKTK|FIXME|XXX)\b/g) || []),
    ...(html.match(/\b(Lorem ipsum|\[INSERT)/gi) || []),
  ];
  if (markers.length) {
    err(rel, `visible placeholder text: ${[...new Set(markers)].join(', ')}`);
  }

  /* --- a11y wiring ------------------------------------------------- */

  for (const m of html.matchAll(/aria-labelledby="([^"]+)"/g)) {
    for (const id of m[1].split(/\s+/)) {
      if (!anchorsByPage.get('/' + rel)?.has(id)) {
        err(rel, `aria-labelledby="${id}" references a missing id`);
      }
    }
  }

  for (const m of html.matchAll(/aria-controls="([^"]+)"/g)) {
    if (!anchorsByPage.get('/' + rel)?.has(m[1])) {
      err(rel, `aria-controls="${m[1]}" references a missing id`);
    }
  }
}

/* --- sitemap cross-check ------------------------------------------ */

const sitemapPath = join(ROOT, 'sitemap.xml');
if (existsSync(sitemapPath)) {
  const sitemap = readFileSync(sitemapPath, 'utf8');
  const listed = new Set(
    [...sitemap.matchAll(/<loc>https:\/\/justin2988\.github\.io([^<]*)<\/loc>/g)]
      .map((m) => resolveUrlToFile(m[1] || '/'))
      .filter(Boolean)
  );

  for (const file of files) {
    const rel = '/' + relative(ROOT, file).replace(/\\/g, '/');
    if (rel === '/404.html') continue;
    if (!listed.has(rel)) warn('sitemap.xml', `${rel} is not listed`);
  }
} else {
  warn('sitemap.xml', 'not found');
}

/* --- report -------------------------------------------------------- */

console.log(`Checked ${files.length} HTML files.\n`);

if (warnings.length) {
  console.log(`Warnings (${warnings.length}):`);
  for (const w of warnings) console.log(`  ! ${w}`);
  console.log('');
}

if (errors.length) {
  console.log(`Errors (${errors.length}):`);
  for (const e of errors) console.log(`  x ${e}`);
  console.log('');
  process.exit(1);
}

console.log('All checks passed.');
