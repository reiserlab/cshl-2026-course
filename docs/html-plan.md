# Plan: markdown → stylish HTML pages

These `docs/*.md` files are the **single source of truth**. This plan turns them
into a student-friendly website that matches the Arena Studio look, without
making the markdown any harder to edit.

The page map is intentionally inspired by the Modular LED Display G3 user guide:
brief introduction, fly preparation, hardware overview, software operation,
example experiments, and technical appendices. The CSHL version should be much
shorter and more procedural.

## Goals

- **One source, two renderings.** Instructors edit markdown; students read
  styled pages. Never maintain content twice.
- **On-brand, but readable.** Use Arena Studio's dark/cyan visual language for
  navigation and code, but keep the reading surface light enough for students to
  skim on laptops and phones.
- **Low-friction hosting.** Ideally free (GitHub Pages), ideally no heavy build.
- **Course-first structure.** The site should expose six top-level entry points:
  tethering, FicTrac, Rig 101, protocols, GitHub, and Arena Studio.

## The theme

```
Ink:        #17212b    Paper:     #fffdf7   Line:   #d7ddd4
Cyan:       #0e8f9e    Coral:    #df5b43   Gold:   #c9941a
Leaf:       #378b54    Plum:     #6c4b8e
Mono/code:  JetBrains Mono or IBM Plex Mono
Body:       Inter, system sans
```

Layout: a compact top bar with the course name and links back to Arena Studio
and the repo; a left sidebar from the [index](README.md) on desktop; a single
column on phones; protocol cards for p0-p3; tables for run gates and QC.

## Option A — client-side reader (fast MVP, no build)

A single `guide.html` page that fetches a markdown file and renders it in the
browser with [marked.js](https://marked.js.org/) (CDN) + the theme above.

- URL: `guide.html?doc=fictrac` → fetches `docs/fictrac.md`, renders it.
- Sidebar is a small hardcoded list (or generated from `README.md`).
- **Pros:** zero build step; edit a `.md`, refresh, done. ~1 file to write.
- **Cons:** needs the `.md` files reachable over HTTP from the page's origin
  (see hosting), and renders on the client (fine for docs).

This is the fastest path to "stylish pages for students" and can be done in an
hour. It is acceptable for a same-day mockup.

## Option B — static build (polished, later)

A tiny build script (Node, run via `pixi`) converts every `docs/**/*.md` into a
standalone `.html` using one template, with a generated nav and search.

- **Pros:** real pages (fast, indexable, work offline), pretty URLs, link
  checking at build time.
- **Cons:** a build step to run whenever docs change (can be a GitHub Action).
- Off-the-shelf alternatives that would also work: MkDocs (Material theme),
  Docusaurus, or Astro — but a ~100-line custom builder keeps the exact
  Arena Studio styling and avoids a framework.

**Recommendation:** ship Option A for the course-day mockup; graduate to Option
B (or MkDocs Material skinned to the theme) if the guide will be reused after
the course.

## Hosting — the one decision to make

The course repo is **private**. Pick how students reach the pages:

1. **Public docs on the webDisplayTools Pages site** (e.g.
   `reiserlab.github.io/webDisplayTools/course/`). Simplest and free, but the
   doc content becomes **public**. Fine for how-tos; **check** genotype/roster
   material first.
2. **GitHub Pages from the private course repo.** Keeps everything together;
   private-repo Pages/visibility depends on the GitHub plan and who's added.
3. **Bundle at hand-out time.** Build to static HTML (Option B) and share via
   the course LMS / a zip / a private link.

> ✍️ **Instructor decision:** which hosting option, and whether any doc content
> must stay private.

## Suggested next steps

1. Confirm the hosting choice above.
2. Build `guide.html` (Option A) with the theme + a sidebar from the index.
3. Add a "Guide" link in Arena Studio's top bar pointing at it.
4. (Later) Add the static builder + a GitHub Action to publish on every push.

I can implement Option A (`guide.html`) on request — it's a single self-contained
file, matching the pattern of the other webDisplayTools tools.

---
*Last updated 2026-07-09.*
