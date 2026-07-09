# Protocols — the p0–p3 series

The course experiments are numbered **p0 → p3**. Each one is a self-contained
Arena Studio protocol; most come in a **short** and a **full** version.

**Workflow:** run the **short** version first to check the fly is responsive,
then run the **full** version to collect the real data. Each genotype block is
about **45 minutes**, then you rotate.

| # | Name | What it probes | Closed-loop / FicTrac? | Short | Full |
| --- | --- | --- | --- | --- | --- |
| **[p0](p0-opto-intensity.md)** | Optogenetic intensity | Which LED level drives the fly | No (open-loop) | ~2.6 min | longer |
| **[p1](p1-motion.md)** | Visual motion | Optomotor turning + looming escape | No (open-loop) | 3–4 min | ~7–8 min |
| **[p2](p2-object.md)** | Object responses | Bar fixation + A/B choice | **Yes** (needs FicTrac) | 3–4 min | ~10 min |
| **[p3](p3.md)** | *(coming soon)* | — | — | — | — |

## Also on the rigs

- **`p100_rig_test`** — a 60-second, controller-only checkout (no fly, no
  FicTrac): full-field brightness, panel map, a moving bar, and LED levels
  2/5/10/20/40%. Use it to confirm a rig works after setup.
- **`fictrac_direction_test`** — open-loop motion then a closed-loop block, to
  confirm the [FicTrac](../fictrac.md) bridge is working.
- **`optomotor_led_test`** — a slow grating with the LED switched on for the
  last few seconds; the reference example of "fire a command partway through a
  trial."

## How to read a protocol page

Each page tells you: **what the fly sees**, **what the LED does**, **how the
trials are organized**, and **roughly how long it takes**. The authoritative
source is always the protocol's YAML file (in `protocols/shared/`), whose header
comment describes it in full detail.

> ✍️ **Instructor to confirm:** which genotypes pair with which protocol, and
> the intended order for the course sessions.

---
*Last updated 2026-07-09.*
