# justin2988.github.io

Professional portfolio of Justin Barczewski — educational leader and EdD candidate in educational
leadership, focused on higher education administration and program development.

Live at **https://justin2988.github.io**

---

## How it's built

Plain HTML, CSS, and JavaScript. No framework, no build step, no dependencies. Edit a file, refresh
the browser, push. `.nojekyll` tells GitHub Pages to serve the files exactly as written.

```
index.html              Home
about.html              Bio, leadership philosophy, teaching philosophy, experience
research.html           Dissertation and research agenda
cv.html                 Full CV — print-styled, exports to PDF from the browser
work/index.html         Filterable case study index
work/*.html             Individual case studies
404.html                Not-found page

assets/css/site.css     Everything visual. Design tokens live at the top.
assets/js/site.js       Nav, filter, scroll reveal, email assembly. Progressive enhancement only.
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
- **Adding a case study:** copy an existing file in `work/`, replace the content, add a card to
  `work/index.html` with the right `data-categories`, and add the URL to `sitemap.xml`.

## Accessibility

Built to WCAG 2.1 AA: semantic landmarks, single `h1` per page, visible focus states, keyboard-
operable navigation with Escape-to-close, alt text on all images, AA contrast throughout, and
`prefers-reduced-motion` support. Every JavaScript feature degrades to working HTML.
