# An independent computer-assisted proof of the $D^2$ case of Mao–Wang Conjecture 4.1

## Summary

**Theorem.** For every $n\ge0$, the row polynomial $G_n(x)$ of the squared Delannoy triangle $D^2$ has only real, negative zeros. This is the $D^2$ half of Conjecture 4.1 in Mao & Wang, *The Narayana transformation*, [arXiv:2607.01572](https://arxiv.org/abs/2607.01572).

**Priority.** This is **not the first proof.**
- Cinna Davis's pipeline completed a short, fully analytic proof on 20 Nov 2026: [`delannoy-proof.md`](https://github.com/1337isnot1337/solved-conjectures/blob/research/research/mao-wang/delannoy-proof.md).
- That proof completes a strategy the omega-institute had sketched publicly in October 2026.
- The proof here was found **independently** (25–27 Nov 2026), without knowledge of either, and **by a different method.** [`LITERATURE_CHECK.md`](LITERATURE_CHECK.md) gives the timeline and a side-by-side comparison.

**Method.**
1. $\sum_n G_nt^n=(1-t)/\mathrm{Den}(x,t)$, where $\mathrm{Den}$ is a quartic in $t$. A two-squares identity controls its roots.
2. An angle lemma shows that the argument of the dominant root decreases monotonically from $\pi$ to $0$ across $(a,b)$.
3. Partial fractions express $G_n$ at $n+1$ sample points as $\pm\rho^{-N}(m+E)$. A rigorous Arb interval-arithmetic certificate proves $\lvert m\rvert>\lvert E\rvert$ for all $n\ge10$.
4. This gives $n-1$ sign changes. Parity gives the last real zero, and positive coefficients make every zero negative.
5. Rows $n\le91$ are checked independently by exact Sturm sequences.

Two points need special care:
- The root collision at $x^\ast=-3-2\sqrt2$, handled by a regularised formula $\Psi_N$.
- The exact identity $G_n(-1)=0$ for $n\equiv2\pmod 4$, which breaks naive sign alternation.

**Side facts not found elsewhere** (to our knowledge):
- $G_n(-1)=0$ exactly when $n\equiv2\pmod4$.
- The collision angle satisfies $\theta_\ast/\pi\notin\mathbb{Q}$, so no sample point lands on $x^\ast$.

**Verification.**
- The certificate passed on Google Colab with python-flint 0.9.0 on 27 Nov 2026 ([output](stageC/CERT_OUTPUT_2026-11-27.txt)).
- Four AI referees reviewed it: two Claude sessions, ChatGPT and Gemini. Their final verdicts were "accept" and "minor revision". One genuine defect, the C6 threshold, was found and fixed ([`EXTERNAL_AI_CHECKS.md`](EXTERNAL_AI_CHECKS.md)).
- **No human mathematician has reviewed this work.**

**How it was made.** One person, using consumer AI tools (Claude, ChatGPT, Gemini) and free Google Colab. The full process is logged below.

## Where to start

| If you want… | Read |
|---|---|
| The proof | [`STAGE_C_FINAL.md`](STAGE_C_FINAL.md) |
| To rerun the certificate | `pip install python-flint`, then `python stageC/stageC_cert_rigorous.py 12 0.05` and `python stageC/stageC_exact.py` |
| How it compares with Davis's proof | [`LITERATURE_CHECK.md`](LITERATURE_CHECK.md) |
| The review history | [`REFEREE_1.md`](REFEREE_1.md), [`REFEREE_2.md`](REFEREE_2.md), [`EXTERNAL_AI_CHECKS.md`](EXTERNAL_AI_CHECKS.md) |

---

## Research log

### Setup

Mao–Wang Conjecture 4.1 states that the row generating functions of $A^2$ (the Eulerian triangle squared) and $D^2$ (the Delannoy triangle squared) have only real, nonpositive zeros. [SymCat](https://www.symmetricfunctions.com/realRootedOpenProblems.htm) lists it as open (checked 26 Nov 2026). This repository concerns the $D^2$ half only. **The $A^2$ half remains open.**

Write $G_n(x)$ for row $n$ of $D^2$. The paper gives

```math
G_0=1,\quad G_1=x+2,\quad G_2=x^2+6x+5,\quad G_3=x^3+10x^2+25x+12,
```

```math
G_n=(x+3)G_{n-1}+(x-1)G_{n-2}+(x-1)G_{n-3}+x\,G_{n-4}\qquad(n\ge 4).
```

### Notation

```math
a=-4-3\sqrt2,\qquad b=-3+2\sqrt2,\qquad x^\ast=-3-2\sqrt2,
```

```math
q^\ast(t)=(1+\sqrt2)t^2+\sqrt2\,t+1,\qquad q_b(t)=(1-\sqrt2)t^2-\sqrt2\,t+1.
```

### Results along the way

| # | Statement | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Our definitions match the paper: $A$ row 3 $=[0,1,4,1]$, $D$ row 3 $=[1,5,5,1]$, $D^2$ rows 0–3 $=G_0,\dots,G_3$ | Verified | [`scripts/exact_rows.py`](scripts/exact_rows.py) |
| 2 | $D^2$ rows $1$–$91$: all zeros real and $\le 0$ | **Exact** (Sturm count, integer arithmetic) | [`shots/07_rows91.png`](shots/07_rows91.png) |
| 3 | $A^2$ rows $1$–$30$ real-rooted | Exact (Mao–Wang, in the paper) | paper |
| 4 | $A^2$ and $D^2$, rows $\le 38$: consecutive rows interlace | Numerical only | [`shots/01_interlace.png`](shots/01_interlace.png) |
| 5 | No recurrence for $A^2$ of the form $\sum_{i\le 4}(a_i+b_ix+c_in+d_inx)P_{n-i}$ | Checked (the same search recovers the $D^2$ recurrence) | [`shots/01_interlace.png`](shots/01_interlace.png) |
| 6 | $\sum_n G_n t^n = (1-t)/\mathrm{Den}$, where $\mathrm{Den}=(1-t)(1-2t-t^2)-x t(1+t)(1+t^2)$ | **Proved** (Riordan arrays), with exact check | [`scripts/verify_lemma.py`](scripts/verify_lemma.py) |
| 7 | $\mathrm{disc}_t(\mathrm{Den})=-16(x^2+6x+1)^2(x^2+8x-2)$ | **Proved**, with exact check | [`shots/03_disc.png`](shots/03_disc.png) |
| 8 | The zeros accumulate on $[a,b]$; row 38 has its zeros in $(-8.218,-0.178)$ | Interval exact; accumulation numerical (Beraha–Kahane–Weiss) | [`shots/02_limit.png`](shots/02_limit.png) |
| 9 | **Two-squares identity:** $(b-x^\ast)\mathrm{Den}=(b-x)q^\ast(t)^2+(x-x^\ast)q_b(t)^2$ | **Proved**, with exact check | [`PROOF_angle_lemma.md`](PROOF_angle_lemma.md) |
| 10 | **Angle lemma:** for $x\in(a,b)$ the smallest-modulus roots form a conjugate pair $\tau e^{\pm i\theta}$, unique except at $x^\ast$. $\theta$ is continuous and strictly decreasing from $\pi$ to $0$. | **Proved.** Algebra verified independently; logic refereed. | [`STAGE_C_FINAL.md`](STAGE_C_FINAL.md) (Lemma A), [`REFEREE_1.md`](REFEREE_1.md) |
| 11 | Forgács–Tran ([1606.07125](https://arxiv.org/abs/1606.07125), [1601.02582](https://arxiv.org/abs/1601.02582)) do not apply directly: the numerator is $1-t$, the $x$-dependence has several terms, and their result covers only large $n$ | Checked | — |
| 12 | $G_n(-1)=0$ for every $n\equiv2\pmod4$ | **Proved** (exact identity) | [`STAGE_C_FINAL.md`](STAGE_C_FINAL.md) |
| 13 | **The theorem**, for all $n$ | **Proved** (computer-assisted) | [`STAGE_C_FINAL.md`](STAGE_C_FINAL.md) |

### Timeline

1. **25 Nov:** numerical exploration. Exact checks of rows to 91. Generating function, discriminant and two-squares identity.
2. **26 Nov:**
   - The angle lemma is proved, and referee report 1 is written.
   - Stage C partial-fraction argument.
   - A float interval certificate passes on Node/V8 and on Python/Colab.
   - Referee report 2 finds the reasoning correct.
3. **27 Nov:**
   - A rigorous Arb certificate removes the floating-point assumption.
   - ChatGPT and Gemini review the work (two rounds), and the C6 threshold is fixed.
   - The certificate is rerun and passes.
   - A literature check finds Davis's earlier proof.

[`STAGE_C.md`](STAGE_C.md) is the original working draft of Stage C, kept for the record. It is superseded by [`STAGE_C_FINAL.md`](STAGE_C_FINAL.md).

## Files

| Path | Contents |
|------|----------|
| [`STAGE_C_FINAL.md`](STAGE_C_FINAL.md) | **The complete proof**, including Lemma A (the angle lemma) |
| [`stageC/stageC_cert_rigorous.py`](stageC/stageC_cert_rigorous.py) | Rigorous Arb certificate for $n\ge10$ |
| [`stageC/stageC_exact.py`](stageC/stageC_exact.py), [`stageC/stageC_n45_exact.py`](stageC/stageC_n45_exact.py) | Exact sympy checks of the identities and small cases |
| [`stageC/CERT_OUTPUT_2026-11-27.txt`](stageC/CERT_OUTPUT_2026-11-27.txt) | Output of the final certificate run |
| `stageC/cert.mjs`, `run_cert.mjs`, `stageC_cert.py` | Earlier float-interval versions of the certificate (superseded) |
| `stageC/explore*.mjs`, `smalln.mjs`, `exact_n45.mjs` | Exploration scripts used during development |
| [`LITERATURE_CHECK.md`](LITERATURE_CHECK.md) | Priority search and comparison with Davis's proof |
| [`EXTERNAL_AI_CHECKS.md`](EXTERNAL_AI_CHECKS.md) | ChatGPT and Gemini review rounds |
| [`REFEREE_1.md`](REFEREE_1.md), [`REFEREE_2.md`](REFEREE_2.md) | Claude referee reports |
| [`PROOF_angle_lemma.md`](PROOF_angle_lemma.md), [`STAGE_C.md`](STAGE_C.md) | Original drafts, superseded by `STAGE_C_FINAL.md` |
| [`LEAN_FEASIBILITY.md`](LEAN_FEASIBILITY.md) | Notes on formalising parts of the proof in Lean |
| [`scripts/`](scripts/) | Exact checks: rows to 91, and the algebra in the lemmas |
| [`opus/`](opus/) | The prover's original verification scripts |
| [`shots/`](shots/) | Screenshots of key computations |

## Credits

- Mathematics and code: Claude Opus 5.5 (prover and referee sessions), directed and checked by Sukhraj Sachdeva.
- External review: ChatGPT and Gemini.
- Computation: Google Colab.
- Thanks to Jianxi Mao and Lijie Wang for the conjecture, and to Per Alexandersson's SymCat for cataloguing it.
