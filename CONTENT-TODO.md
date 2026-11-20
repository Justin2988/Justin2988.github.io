# Content checklist

The site is complete and presentable as it stands. Everything below makes it stronger.

Drop source files into `_incoming/` — that folder is gitignored, so nothing in it is ever
published. Work through this at your own pace; nothing here blocks going live except the two
items marked **before launch**.

---

## Before launch

### 1. Social preview image — done

`assets/img/og-image.png` was regenerated in November 2026 in the dark theme, with the old
"EdD Candidate" line replaced. If the tagline changes again, edit and re-run:

```
powershell -ExecutionPolicy Bypass -File tools\make-og-image.ps1
```

### 2. Read the philosophy statements — **before launch**

The Philosophy section of `index.html` (`/#philosophy`) contains two long-form statements I
drafted in your voice from your résumé and dissertation:

- **Leadership philosophy** — four commitments, built around the "manage the gap rather than
  eliminate it" finding from your study
- **Teaching and learning philosophy** — five principles grounded in andragogy

They are substantive and defensible, but they are **my words about your beliefs**. A search
committee may ask you to expand on any sentence in them. Read both, change anything that isn't
how you'd actually put it, and cut anything you wouldn't defend in an interview.

Both were rewritten in plainer, first-person language in October 2026. Same ideas, simpler words,
so give them a fresh read.

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

SafetyLink isn't on the current résumé and had no real content, so the "in preparation" card was
taken off the site in the October 2026 cleanup (a half-finished card confused visitors more than it
helped). Old links to `/work/safetylink-implementation.html` now land on the Projects section.

If you want it back, send me:

- What SafetyLink is, and what problem it solved at Mears
- Your title and dates on the project
- How you planned and phased the rollout
- What training and documentation you built
- **Any numbers at all**: sites, users, timeline, adoption, ticket volume, audit outcomes

Then copy the Mears case study block in `#work` and fill it in with the same headings.

### 5. Expand the VA case study

The VA Electronic Health Record Modernization case study (which now also covers the Power BI dashboards) in the `#work` section of `index.html` is built entirely from
your résumé. Anything you can add that's publicly shareable — specific skills applied, scale, the
shape of a problem you solved — makes it stronger. Everything there stays at a level appropriate
for public discussion; keep it that way, and when in doubt leave it out.

---

## Worth doing

### 6. Certificates and recognition

Images or PDFs of the CSM certificate, Azure Fundamentals, President's List, Dean's List, Golden
Key, or NSLS. The guide you sent specifically recommends educators include
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

- **Two documents, two audiences (October 2026; refreshed November 2026 with the Capitol
  Technology University committee role).** The academic CV (PDF) is for adjunct and
  teaching roles; the résumé (Word) is for training, L&D, and professional roles. `cv.html`
  mirrors the academic CV section for section (Teaching Areas, Teaching and Training Experience,
  Related Professional Experience, Publications, Affiliations). The homepage Experience and Skills
  sections follow the résumé. When either document changes, replace the file in `assets/docs/`
  (same filename) and update the matching page.
- **Positioned for online teaching first.** The hero, About, and Contact sections lead with
  teaching online in the CV's four teaching areas (education and leadership, management and
  business, project management, IT), with training and L&D work as the second track.
- **Phone number not shown on the pages.** A public page invites scraping and robocalls; email and
  LinkedIn are higher-signal and lower-risk. Note that the downloadable CV and résumé both include
  your phone number and ZIP code, as they did before. Say the word if you want a phone-free copy
  for the site.
- **Location shown as "Cadillac, Michigan"** — no ZIP code.
- **Email is assembled by JavaScript** rather than sitting in the HTML as plain text, with a
  readable `[at]`/`[dot]` fallback if scripts are blocked. Modest protection, no downside.
- **Consider a cleaner email address.** `justinbar100@gmail.com` reads casually for an EdD holder
  applying to higher education roles. Changing it is easy now and painful once
  the URL is circulating.
- **No contact form.** You chose email plus LinkedIn — zero setup, nothing to break, no spam
  endpoint to maintain.
- **EdD shown as completed in 2026.** This matches the updated résumé and keeps the portfolio
  consistent across the profile, research, credentials, and CV sections.
- **Dark theme only (November 2026).** You asked for a darker, streamlined look that recruiters
  can skim. The site is now one dark theme ("Night Study": navy, off-white text, gold accent),
  with every text color checked against WCAG AA. There is no light/dark toggle on purpose.
- **Streamlined for skimming (November 2026).** The homepage leads with current roles and the
  resume button, then a five-bullet About, Experience (newest first, four bullets max per job),
  Skills as tags, and three collapsed project cards. Philosophy statements stay collapsed at the
  bottom as optional reading.
- **SNHU MA in History removed (November 2026).** Both the November CV and resume dropped it, so
  the site did too. Tell me if that was an oversight and I'll put it back.

---

## Keeping it current

The guide you sent recommends refreshing a portfolio once or twice a year. Two habits that make
that painless:

- When a privacy-reviewed final transcript is available, replace
  `assets/docs/Justin_Barczewski_Unofficial_Transcript.pdf` and update the transcript labels in
  `index.html` and `cv.html` from "unofficial" to "final."
- Add new projects to the `#work` section of `index.html` as they happen, while the numbers are
  still fresh in your head. Copy any existing `<details class="case">` block as the template —
  they're all structurally identical.
- Run `node tools/verify.mjs` before every push. It catches broken links, missing alt text,
  navigation that has drifted between pages, and placeholder text that slipped through.
