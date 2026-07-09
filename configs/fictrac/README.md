# FicTrac per-rig configs

These are the July 8, 2026 working FicTrac config files shared in Slack for the
CSHL course rigs. Keep one folder per rig and do not overwrite a working config
in place; if a rig is retuned, add a dated subfolder or commit a deliberate
replacement with notes.

## Files

| Rig | Repo path | Slack source | Size |
| --- | --- | --- | --- |
| 1 | `rig01/config.txt` | `#cshl-lab-2026`, 2026-07-08 14:21, file `F0BFLAVTLCF` | 976 B |
| 2 | `rig02/config.txt` | `#cshl-lab-2026`, 2026-07-08 17:02, file `F0BG4RNMA0H`; thread note says "rig 2" | 955 B |
| 3 | `rig03/config.txt` | `#cshl-lab-2026`, 2026-07-08 17:39, file `F0BG15AAERL` | 989 B |
| 4 | `rig04/config.txt` | `#cshl-lab-2026`, 2026-07-08 18:07, file `F0BGXKZAJGY` | 997 B |
| 5 | `rig05/config.txt` | `#cshl-lab-2026`, 2026-07-08 18:49, file `F0BGXS1R5U0` | 987 B |
| 6 | `rig06/config.txt` | `#cshl-lab-2026`, 2026-07-08 19:16, file `F0BG7BY6YGL` | 1007 B |
| 7 | `rig07/config.txt` | `#cshl-lab-2026`, 2026-07-08 19:39, file `F0BG0EE2BB7` | 997 B |

The original Slack filenames were `config.txt` for rigs 1 and 2 and
`config3.txt` through `config7.txt` for rigs 3-7. They are normalized here as
`rigXX/config.txt` so the rig association is explicit.

## Use

Copy the relevant rig folder to the rig computer, open PowerShell in that
folder, and run FicTrac from there. FicTrac outputs will write next to the
config, so keep the course repo copy clean and treat run outputs as local rig
artifacts unless they are intentionally added to `runlogs/`.
