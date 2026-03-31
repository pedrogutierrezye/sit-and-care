---
description: "Review and improve HTML pages for Google SEO — covers on-page, technical, local, and Core Web Vitals factors for the Sit & Care site"
name: "SEO Review"
argument-hint: "Which page to review, e.g. index.html"
agent: "agent"
---

Review and improve the specified HTML page for Google search visibility.
Apply all changes directly to the file.

## Site context

- **Business**: Sit & Care — family-run house/pet/plant/child-sitting service
- **Location**: Walldorf, Germany (5 km radius)
- **Language**: German (`lang="de"`); English alternate at `/en.html`
- **Domain**: https://www.sitandcare.com
- **Stack**: Plain HTML + Tailwind CSS (CDN)

## Checklist — work through every item

### 1. Title & Meta description

- `<title>` is 50–60 characters, contains primary keyword + location (Walldorf)
- `<meta name="description">` is 140–160 characters, unique per page, contains a call to action
- One `<h1>` per page; matches or closely echoes the `<title>`

### 2. Heading hierarchy

- `h1 → h2 → h3` — no skipping levels
- Headings contain natural keywords, not just styling labels

### 3. Structured data (JSON-LD)

- `LocalBusiness` schema present with: `name`, `url`, `email`, `areaServed`, `address` (including `streetAddress` if available), `telephone` if available
- Add `openingHoursSpecification` when hours are known
- Validate with [schema.org validator](https://validator.schema.org/)

### 4. Canonical & hreflang

- `<link rel="canonical">` present and correct for every page
- `<link rel="alternate" hreflang="de">` and `hreflang="x-default"` on pages with language alternates

### 5. Open Graph & Twitter Card

- `og:title`, `og:description`, `og:url`, `og:type`, `og:image` (minimum 1200×630 px)
- `twitter:card` set to `summary_large_image` when an image exists

### 6. Images

- Every `<img>` has a descriptive `alt` attribute (not empty, not "image")
- Add `loading="lazy"` on below-the-fold images
- Use `width` and `height` attributes to prevent layout shift (CLS)
- Prefer WebP format; provide a JPEG fallback via `<picture>`

### 7. Core Web Vitals

- **LCP**: Largest hero image or `<h1>` renders fast — add `<link rel="preload">` for critical above-the-fold images
- **CLS**: All images and embeds have explicit dimensions; no injected content that shifts layout
- **INP**: Keep main-thread JS minimal; avoid long tasks in event handlers

### 8. Mobile & accessibility

- `<meta name="viewport" content="width=device-width, initial-scale=1">` present
- Tap targets ≥ 48×48 px
- Sufficient colour contrast (WCAG AA: ≥ 4.5:1 for body text)
- All form inputs have associated `<label>` elements

### 9. Technical hygiene

- No broken links (check `href` values point to existing files)
- `robots` meta tag NOT set to `noindex` on public pages
- `<html lang="de">` (or correct locale) on every page
- Footer has links to `impressum.html` and `datenschutz.html` (required in Germany)

### 10. Local SEO signals

- NAP (Name, Address, Phone) consistent across every page and the JSON-LD schema
- Mention "Walldorf" and "5 km" naturally in body copy at least once per page
- Use local keywords: _Walldorf_, _Rhein-Neckar_, _SAP-Campus-Umgebung_ where relevant

### 11. Internal linking

- Navigation links are plain `<a href>` elements (not JS-only)
- Sitemap entry exists (or create `sitemap.xml` if missing) listing all public pages
- `robots.txt` references the sitemap URL

## Output expectations

1. Apply all fixes directly to the target file.
2. If a new file is needed (e.g. `sitemap.xml` or `robots.txt`), create it.
3. After editing, list each change made and the checklist item it satisfies.
4. Flag any items that require content decisions (e.g. phone number, opening hours) and cannot be completed automatically.
