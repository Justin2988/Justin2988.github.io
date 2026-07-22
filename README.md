# justin2988.github.io

Professional portfolio of Justin Barczewski — educational leader and EdD candidate in educational
leadership, focused on higher education administration and program development.

Live at **https://justin2988.github.io**

---

## How it's built

Plain HTML, CSS, and JavaScript. No framework, no build step, no dependencies. Edit a file, refresh
the browser, push. `.nojekyll` tells GitHub Pages to serve the files exactly as written.

The site is a **single page plus the CV**. Everything — profile, case studies, experience,
research, philosophy, credentials, contact — lives on `index.html` behind anchor navigation, with
case studies and long-form statements in `<details>` blocks that expand in place.

```
index.html              The whole portfolio: #about #work #experience #research
                        #philosophy #credentials #contact
cv.html                 Full CV — print-styled, exports to PDF from the browser
404.html                Not-found page

about.html              ┐
research.html           │ Redirect stubs. The old multi-page URLs forward into
work/*.html             ┘ the matching /#section so links already shared keep working.

assets/css/site.css     Everything visual. Design tokens live at the top.
assets/js/site.js       Nav, scroll spy, deep links into <details>, scroll reveal,
                        email assembly. Progressive enhancement only.
assets/img/             Favicon, social card, photography

tools/verify.mjs        Pre-publish checks
tools/make-og-image.ps1 Regenerates the social sharing card

_incoming/              Drop folder for source material. Gitignored, never published.
CONTENT-TODO.md         What still needs filling in
```

## Working on it locally

Use a local server — the pages use site-absolute paths (`/assets/...`), so opening
`index.html` straight from the file system will not load styles.

```
python -m http.server 8000
```

Then visit http://localhost:8000

## Before you push

```
node tools/verify.mjs
```

Checks that every internal link resolves, every image has alt text, the shared header and footer
haven't drifted apart between pages, no placeholder copy is visible, and each page has its title,
description, canonical URL, and a single `<h1>`.

## Editing conventions

- **Header and footer are duplicated across pages** and must stay byte-identical, apart from the
  `aria-current="page"` marker on the current page's nav link. They're fenced with
  `<!-- SHARED:HEADER start -->` / `<!-- SHARED:FOOTER start -->` comments. `verify.mjs` enforces
  this — if you change the nav, change it everywhere.
- **Links use site-absolute paths** (`/about.html`, not `../about.html`) so markup can be moved
  between directories without breaking.
- **Colors and type come from the custom properties** at the top of `site.css`. Change them there,
  not inline.
- `--brass` (`#A67C3D`) is only accessible at large sizes. Small text uses `--brass-text`
  (`#7A5620`). Don't collapse the two.
- **Adding a case study:** copy an existing `<details class="case">` block inside the `#work`
  section of `index.html`, give it a unique `id`, and replace the content. The case studies are
  structurally identical on purpose.
- **Redirect stubs** (`about.html`, `research.html`, `work/*.html`) are frozen. They exist only so
  old links keep resolving; don't add content to them.

## Accessibility

Built to WCAG 2.1 AA: semantic landmarks, single `h1` per page, visible focus states, keyboard-
operable navigation with Escape-to-close, alt text on all images, AA contrast throughout, and
`prefers-reduced-motion` support. Every JavaScript feature degrades to working HTML.
