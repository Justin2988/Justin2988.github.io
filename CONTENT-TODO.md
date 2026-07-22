# Content checklist

The site is complete and presentable as it stands. Everything below makes it stronger.

Drop source files into `_incoming/` — that folder is gitignored, so nothing in it is ever
published. Work through this at your own pace; nothing here blocks going live except the two
items marked **before launch**.

---

## Before launch

### 1. Social preview image — **before launch**

The `og:image` tag on every page points at `assets/img/og-image.png`, which doesn't exist yet.
Until it does, sharing a link on LinkedIn shows a text-only card. Generate it with:

```
powershell -ExecutionPolicy Bypass -File tools\make-og-image.ps1
```

One command, takes a second, and `node tools/verify.mjs` will stop complaining.

### 2. Read the philosophy statements — **before launch**

The Philosophy section of `index.html` (`/#philosophy`) contains two long-form statements I
drafted in your voice from your résumé and dissertation:

- **Leadership philosophy** — four commitments, built around the "manage the gap rather than
  eliminate it" finding from your study
- **Teaching and learning philosophy** — five principles grounded in andragogy

They are substantive and defensible, but they are **my words about your beliefs**. A search
committee may ask you to expand on any sentence in them. Read both, change anything that isn't
how you'd actually put it, and cut anything you wouldn't defend in an interview.

---

## High value

### 3. Headshot — higher resolution

Done, with a caveat. The photo you sent is wired into the hero on `index.html`, but the original
was only 400×400, which crops to 320×400 — about half the resolution the frame wants. It looks
correct on a standard display and soft on a high-DPI laptop or phone.

If you can find a larger original — the file straight off the camera or phone, or LinkedIn's
full-size download rather than the profile thumbnail — drop it in `_incoming/headshot-source.jpg`
and run:

```
powershell -ExecutionPolicy Bypass -File tools\make-headshot.ps1
```

That re-crops to 4:5 and writes `assets/img/justin-barczewski.jpg`. The script never upscales, so
the output is only ever as sharp as what you feed it.

### 4. SafetyLink case study

The SafetyLink block in the `#work` section of `index.html` is the one case study with no real
content — I have nothing on this project beyond the name. It currently shows an honest "case
study in preparation" note, and there's a detailed question list in an HTML comment inside that
block.

The short version of what I need:

- What SafetyLink is, and what problem it solved at Mears
- Your title and dates on the project
- How you planned and phased the rollout
- What training and documentation you built
- **Any numbers at all** — sites, users, timeline, adoption, ticket volume, audit outcomes

Once it's written, delete the "in preparation" callout and the `tag--muted` badge in that block's
summary.

### 5. Expand the VA case study

The EHR Modernization case study in the `#work` section of `index.html` is built entirely from
your résumé. Anything you can add that's publicly shareable — specific skills applied, scale, the
shape of a problem you solved — makes it stronger. Everything there stays at a level appropriate
for public discussion; keep it that way, and when in doubt leave it out.

---

## Worth doing

### 6. Certificates and recognition

Images or PDFs of the CSM certificate, Six Sigma White Belt, Azure Fundamentals, President's List,
Dean's List, or Golden Key. The guide you sent specifically recommends educators include
professional certifications as portfolio artifacts. Drop them in `_incoming/` and I'll build a
credentials gallery.

### 7. Recommendations and testimonials

Letters of recommendation, performance evaluations, or short quotes from supervisors, colleagues,
or faculty. Two or three good pull quotes would add real credibility — get permission first, and
tell me how each person wants to be attributed.

### 8. Training materials you own

Anything from Mears or the Guard you can legally publish: facilitator guides, quick-reference
cards, slide decks, SOPs. These are the "concrete evidence" the portfolio guide keeps insisting
on. Check ownership before publishing anything.

---

## Decisions I made for you — change any of these

- **Phone number omitted.** Your résumé lists 231-577-8181. A public page invites scraping and
  robocalls; email and LinkedIn are higher-signal and lower-risk. Say the word and I'll add it.
- **Location shown as "Cadillac, Michigan"** — no ZIP code.
- **Email is assembled by JavaScript** rather than sitting in the HTML as plain text, with a
  readable `[at]`/`[dot]` fallback if scripts are blocked. Modest protection, no downside.
- **Consider a cleaner email address.** `justinbar100@gmail.com` reads casually for a doctoral
  candidate applying to academic administration roles. Changing it is easy now and painful once
  the URL is circulating.
- **No contact form.** You chose email plus LinkedIn — zero setup, nothing to break, no spam
  endpoint to maintain.
- **Expected graduation shown as "2026."** Your résumé summary says August 2026 but the education
  section says just 2026, so I used the more conservative form throughout. Tell me if you want the
  month.
- **Light theme only.** No dark mode. A warm academic palette is right for this audience, and a
  half-finished second theme is a worse risk than not having one.

---

## Keeping it current

The guide you sent recommends refreshing a portfolio once or twice a year. Two habits that make
that painless:

- Add new projects to the `#work` section of `index.html` as they happen, while the numbers are
  still fresh in your head. Copy any existing `<details class="case">` block as the template —
  they're all structurally identical.
- Run `node tools/verify.mjs` before every push. It catches broken links, missing alt text,
  navigation that has drifted between pages, and placeholder text that slipped through.
