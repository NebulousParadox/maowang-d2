# Next targets: duplicate-checked, 27 Nov 2026

**Method.**
- Took every open problem on [SymCat's real-rooted open-problems page](https://www.symmetricfunctions.com/realRootedOpenProblems.htm), checked live on 27 Nov 2026.
- Compared each one against all 300+ folders on Cinna Davis's `research` branch and her `results/` folder.

**Rule:** before starting any target, also search her **issues** for the target's name and arXiv id, as well as GitHub and arXiv in general. This is the step skipped on Mao–Wang.

## Untouched by Davis (no folder found)

| # | Conjecture | Source | Why it might be workable | Difficulty |
|---|---|---|---|---|
| 1 | **Ribbon lattice path matroids:** for a connected ribbon LPM of rank $r$, $Z_M(t)=N_{r+1}(t)$ (the Narayana polynomial), independent of the composition | Alexandersson 2026; checked for all 1,022 cases on $\le11$ elements | It is an **identity**, not a root-location problem. If it is true, a bijection or a deletion–contraction recurrence could prove it. Real-rootedness then follows, because Narayana polynomials are known to be real-rooted. | ★★☆ **Top pick** |
| 2 | **Binomial Eulerian interlacing:** $\tilde A_n\ll\tilde A_{n+1}$ | Haglund–Zhang 2019 (real-rootedness already proved) | Real-rootedness is known, so only interlacing remains. Standard tools apply: compatible polynomials, and recurrences that preserve interlacing. | ★★☆ |
| 3 | **Skew Schur Ehrhart $h^\ast$-polynomials** are real-rooted | SymCat #19; tested $\lvert\lambda\rvert\le8$, $k\le4$ | We already have 3,220 new passing cases. Possible first goal: prove a special family, such as hooks or two-row shapes. | ★★★ |
| 4 | **Transportation polytope $h^\ast$** is real-rooted (margins with an entry $\ge2$) | Alexandersson 2026; tested up to $5\times5$ | Try small fixed shapes such as $2\times n$ first, where the polytope is explicit. | ★★★ |
| 5 | **Key polynomial numerators** $H_{\lambda,\sigma}$ are real-rooted | Alexandersson 2020, and Gao–Liu–Yang–Zhao 2026 | Known for staircases. Try two-part $\lambda$. | ★★★ |
| 6 | **Nested-matroid $Z$-polynomials** are real-rooted | Proudfoot–Xu–Young; checked to 24 elements | Hard. It fails for general matroids, so it needs real structure. | ★★★★ |
| 7 | **Binder–Vecchi:** refined Hodge–Poincaré polynomials of Bergman fans | Binder–Vecchi 2026 | Hard. The tools are tropical geometry. | ★★★★★ |

## Touched by Davis, but still open (only with a genuinely new angle)

| Conjecture | Her folder | Note |
|---|---|---|
| **Mao–Wang $A^2$** (Eulerian squared) | `mao-wang/`, `wang-yang-eulerian-square/` | Open everywhere. Her notes show one shortcut is false. Our pipeline knows this problem well. |
| Alexandersson set-partition big blocks, $P_{n,j}$ | `alexandersson-ordered-set-partitions/` (covers $O_{n,j}$) | $P_{n,j}$ may be uncovered. **Check her issues first.** |
| Gessel–Lin–Zeng Jacobi–Stirling, $4\le i\le k-3$ | 3 folders, including a "barrier" note | Her pipeline hit a wall here. Avoid it. |

## Already solved or heavily worked by Davis: skip

Parking-function excedance; Caiolo–Ferroni–Hoster; Chow (type A/B); Gessel–Zhuang; big descents (Elizalde–Rivera–Zhuang); long cycles; natural descents; balanced arrays; FPV type B; Coulter–Do Hurwitz; Lin–Ma Schett; $b$-parking polytopes (probably `parking-magic/`).

## Recommendation

1. **#1, ribbon LPMs.** It's an exact identity, so it suits our pipeline: exact checks, a recurrence, then an AI prover and referees. A proof would be fully analytic. Confirm first that it really is unclaimed (Davis's issues, arXiv after Oct 2026).
2. **#2, binomial Eulerian interlacing.** A classic-style problem where standard tools may just work.
3. **$A^2$**, as the ambitious option.
