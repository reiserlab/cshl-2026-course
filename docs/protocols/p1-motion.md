# p1 — Visual motion (optomotor + looming)

**Goal:** measure how the fly responds to **wide-field motion** (optomotor
turning) and to **looming** stimuli (approaching objects that trigger
avoidance/escape). Each trial also starts with a brief optogenetic pulse.

**Files:** `p1_motion_short.yaml` / `p1_motion_full.yaml`, and a revised
`p1_motion_v2_short.yaml` / `p1_motion_v2_full.yaml`. Fly-on-ball rig;
**open-loop**. Full ≈ **7–8 min**.

## The optogenetic prestim

Every visual trial begins with a **0.5 s LED pulse at 25%** while the pattern is
held on its first frame. The LED then turns **off** for the moving stimulus. So
each trial is "brief light, then motion."

## What the fly sees

- **Optomotor gratings** — drifting gratings at **2 spatial periods** and
  several speeds, in both directions (CW/CCW). A fly tends to turn *with* the
  motion. In v2, each spatial period includes a static (0 Hz) condition plus
  moving conditions paired at matched temporal frequencies.
- **Looming** — expanding dark stimuli that simulate an approaching object, at
  **3 classes × 5 positions × 2 speeds**. These probe escape/avoidance. (The
  loom files include a few duplicated final frames so the image holds steady at
  the end instead of rolling over.)

## Trial counts (full)

| Version | Optomotor | Looming |
| --- | --- | --- |
| v1 | 2 periods × 3 speeds × 2 dirs × 3 reps = **36** | 3 classes × 5 positions × 2 speeds × 3 reps = **90** |
| v2 | 2 periods × (1 static + 5 TFs × 2 dirs) × 3 reps = **66** | same **90** |

**v1 vs v2:** v2 runs trials in a fixed, paired order (opposite-direction
optomotor and left/right looms back-to-back), adds static optomotor baselines,
and shows a **static gray background** between trials instead of blanking the
arena. Use whichever your instructor specifies.

## What to watch

- **Optomotor:** does the fly turn in the direction of grating motion? Does the
  strength depend on speed / spatial period?
- **Looming:** does the fly react (turn away, freeze, or attempt escape) as the
  object expands? Does position matter?

## Timing

Short versions are the quick responsiveness check (a few minutes); full versions
run ≈ 7–8 minutes before setup/metadata overhead.

> ✍️ **Instructor to confirm:** whether the course uses p1 v1 or v2, and which
> genotypes.

---
*Last updated 2026-07-09. Source: `protocols/shared/p1_motion_*.yaml`.*
