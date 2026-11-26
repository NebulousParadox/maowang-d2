# Mao–Wang Conjecture 4.1 (the $D^2$ part): research log

> **Status:** work in progress. No resolution is claimed, and nothing here has been refereed externally.
> Started 25 Nov 2026. Last updated 26 Nov 2026.

## Target

The source is Mao & Wang, *The Narayana transformation*, [arXiv:2607.01572](https://arxiv.org/abs/2607.01572) (2 Jul 2026).

**Conjecture 4.1:** the row generating functions of $A^2$ (the Eulerian triangle squared) and $D^2$ (the Delannoy triangle squared) have only real, nonpositive zeros.

[SymCat](https://www.symmetricfunctions.com/realRootedOpenProblems.htm) lists it as open (checked 25 Nov 2026).

This log mainly concerns the $D^2$ part. Let $G_n(x)$ be row $n$ of $D^2$. The paper gives

$$G_0=1,\quad G_1=x+2,\quad G_2=x^2+6x+5,\quad G_3=x^3+10x^2+25x+12,$$

$$G_n=(x+3)G_{n-1}+(x-1)G_{n-2}+(x-1)G_{n-3}+x\,G_{n-4}\qquad(n\ge 4).$$

## Notation

$$a=-4-3\sqrt2,\qquad b=-3+2\sqrt2,\qquad x^\ast=-3-2\sqrt2,$$

$$q^\ast(t)=(1+\sqrt2)t^2+\sqrt2\,t+1,\qquad q_b(t)=(1-\sqrt2)t^2-\sqrt2\,t+1.$$

## Results so far

| # | Statement | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Our definitions match the paper: $A$ row 3 $=[0,1,4,1]$, $D$ row 3 $=[1,5,5,1]$, $D^2$ rows 0–3 $=G_0,\dots,G_3$ | Verified | [`scripts/exact_rows.py`](scripts/exact_rows.py) |
| 2 | $D^2$ rows $1$–$91$: all zeros real and $\le 0$ | **Exact** (Sturm count, integer arithmetic) | [`shots/07_rows91.png`](shots/07_rows91.png) |
| 3 | $A^2$ rows $1$–$30$ real-rooted | Exact (Mao–Wang, in the paper) | paper |
| 4 | $A^2$ and $D^2$, rows $\le 38$: consecutive rows interlace | Numerical only | [`shots/01_interlace.png`](shots/01_interlace.png) |
| 5 | No recurrence for $A^2$ of the form $\sum_{i\le 4}(a_i+b_ix+c_in+d_inx)P_{n-i}$ | Checked (the same search rediscovers the $D^2$ recurrence) | [`shots/01_interlace.png`](shots/01_interlace.png) |
| 6 | $\sum_n G_n t^n = \dfrac{1-t}{\mathrm{Den}}$, where $\mathrm{Den}=(1-t)(1-2t-t^2)-x\,t(1+t)(1+t^2)$ | **Proved** (Riordan array), with exact check | [`scripts/verify_lemma.py`](scripts/verify_lemma.py) |
| 7 | $\operatorname{disc}_t(\mathrm{Den})=-16(x^2+6x+1)^2(x^2+8x-2)$ | **Proved**, with exact check | [`shots/03_disc.png`](shots/03_disc.png) |
| 8 | The zeros accumulate on $[a,b]$; row 38 has its zeros in $(-8.218,-0.178)$ | Interval exact; accumulation numerical (Beraha–Kahane–Weiss) | [`shots/02_limit.png`](shots/02_limit.png) |
| 9 | **Two-squares identity:** $(b-x^\ast)\,\mathrm{Den}=(b-x)\,q^\ast(t)^2+(x-x^\ast)\,q_b(t)^2$ | **Proved**, with exact check | [`PROOF_angle_lemma.md`](PROOF_angle_lemma.md) |
| 10 | **Angle lemma:** for $x\in(a,b)$ the smallest-modulus roots form a unique conjugate pair $\tau e^{\pm i\theta}$ (the two pairs coincide only at $x^\ast$). $\theta$ is continuous and strictly decreasing from $\pi$ to $0$. | **Proved** by Opus 5.5. Algebra verified independently. Logic refereed (no fatal gaps; 3 fixable points). | [`PROOF_angle_lemma.md`](PROOF_angle_lemma.md), [`REFEREE_1.md`](REFEREE_1.md), [`shots/09_passed.png`](shots/09_passed.png) |
| 11 | For $n\le 60$, after mapping zeros to $\theta$, each slice of width $\pi/(n+2)$ holds at most one zero | Numerical | Colab output (not saved) |
| 12 | Forgács–Tran ([1606.07125](https://arxiv.org/abs/1606.07125), [1601.02582](https://arxiv.org/abs/1601.02582)) do not apply directly, for three reasons. (a) The numerator is $1-t$. (b) The $x$-part has several terms. (c) $P$ has the negative zero $-1-\sqrt2$, and their result only covers large $n$. | Checked | — |

## Stage C: claimed proof for all $n$ (26 Nov 2026)

**Claim.** Every $G_n$ is real-rooted with negative zeros. This would settle the $D^2$ half of Conjecture 4.1. See [`STAGE_C.md`](STAGE_C.md).

- **$n\ge10$:** covered by an interval-arithmetic certificate. It **passed on two independent platforms** (Node/V8 locally, Python/glibc on Colab) with identical output.
- **$n\le91$:** exact Sturm count.
- **Exact identities:** all pass in sympy.
- **New exact fact:** $G_n(-1)=0$ for every $n\equiv2\pmod4$. Because of this, the original "alternation" goal fails at $x=-1$, and the statement was corrected to account for it.
- **Still pending:**
  - a referee report on the reasoning (requested);
  - removing the libm accuracy assumption, by rerunning with rigorous interval arithmetic.

## Side target: SymCat #19 (skew Schur Ehrhart $h^\ast$-polynomials)

We tested 3,220 new cases ($|\lambda|\le 9$, $k\le 5$), all outside SymCat's checked range of $|\lambda|\le 8$, $k\le 4$. There were **0 failures**.

Our definition still needs checking against SymCat's exact wording. See [`shots/06_sym19.png`](shots/06_sym19.png).

## Files

| Path | Contents |
|------|----------|
| [`PROOF_angle_lemma.md`](PROOF_angle_lemma.md) | Proof of items 6, 7, 9 and 10 |
| [`REFEREE_1.md`](REFEREE_1.md) | Referee report on that proof |
| [`STAGE_C.md`](STAGE_C.md) | Stage C: claimed proof for all $n$, with the verification log |
| [`stageC/`](stageC/) | Stage C certificate (Node and Python) and the exact sympy checks |
| [`scripts/`](scripts/) | Exact checks: rows to 91, and verification of the lemma's algebra |
| [`opus/`](opus/) | Opus's original verification scripts |
| [`shots/`](shots/) | Screenshots of each computation |

## Credits

- Computations: Python/sympy in Google Colab.
- Proofs of items 6, 7, 9 and 10: Claude Opus 5.5, checked independently.
- Research direction and verification: Sukhraj Sachdeva, with Claude.
