# CSHL 2026 course data

Shared data repo for the CSHL course's 7 LED-arena bench rigs. The benches
write here **directly on the default branch** (no branches, no PRs) from
[Arena Studio](https://reiserlab.github.io/webDisplayTools/arena_studio.html)
and the Pattern Editor. That is safe because every write is namespaced by the
bench id, so no two rigs ever write the same file.

## Student guide draft

Draft course handouts live in [`docs/`](docs/). A styled, unlisted web version
is being staged on the webDisplayTools GitHub Pages site:

<https://reiserlab.github.io/webDisplayTools/course/cshl-2026/guide.html>

This guide is intentionally **not linked from public webDisplayTools pages**
while it is still being proofread. Share direct links only when instructors are
ready for students to read it.

## Layout

```
roster.yaml                                  course roster {id, name, rig_id, mac} — instructor-edited
protocols/<bench-id>/<name>.yaml             a bench's protocol saves (Arena Studio → Save)
protocols/<bench-id>/<name>_patterns/*.pat   patterns pushed from the Pattern Editor
protocols/shared/<name>.yaml                 promoted protocols (visible to every bench)
protocols/shared/<name>_patterns/*.pat       promoted patterns
runlogs/<bench-id>/<protocol>__<experimenter>__<stamp>__<runid>.jsonl
                                             ONE bridge log per COMPLETED recorded run (auto-committed)
```

## How each path gets written

- **`protocols/<bench-id>/…`** — Arena Studio's Save (with "Commit directly to
  default branch" checked) and the Pattern Editor's "⇪ Push to course repo".
- **`protocols/shared/…`** — Arena Studio File ▾ → "Promote to shared
  (course)…". Promotion refuses to overwrite a *different* same-named file
  (byte-compare guard); identical re-promotes are no-ops.
- **`runlogs/<bench-id>/…`** — auto-committed when a recorded run COMPLETES:
  the FicTrac-bridge JSONL (with a `run_metadata` line near the top carrying
  run id, experimenter, protocol sha, rig id, arena config). Aborted and test
  runs never commit. Filenames are colon-free so Windows clones check out.
- **`roster.yaml`** — instructor-edited (in the GitHub UI is fine). The
  benches only read it.

## Instructor bench setup (once per bench, before the course)

1. Open Arena Studio → **File ▾** → GitHub **Sign in…** — paste the shared
   fine-grained PAT (**Contents: Read and write**, scoped to THIS repo only)
   and answer **YES** to "Remember this token" (localStorage; a
   sessionStorage-only token evaporates when the tab closes).
2. **Repo** = `reiserlab/cshl-2026-course`.
3. **Bench id** = `bench01` … `bench07` (must match `roster.yaml`).
4. Check **"Commit directly to default branch"**.
5. Connect the arena — the roster entry for this bench pre-fills the
   Experimenter field. A **"bench ≠ roster"** chip means the bench id and the
   controller's MAC disagree with this file: fix the bench id or the roster.

## Guard rails / do-not

- **Do not enable branch protection** on the default branch — the benches
  commit straight to it.
- Recorded runs are gated in the Studio: connected arena, live FicTrac
  bridge, saved protocol, experimenter + genotype filled, and every
  referenced pattern present on the SD (missing patterns name the
  Console → SD upload fix).
- If a run-log commit fails (network), the log still exists on that bench's
  bridge machine (`arena-log-*.jsonl` in the bridge's working directory /
  `--log-dir`).
