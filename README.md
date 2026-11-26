# Mao–Wang Conjecture 4.1 (D² part): research log

**Status: work in progress. No resolution claimed. Unrefereed.**
Started 25 Nov 2026. This log dated 26 Nov 2026.

## Target
Mao & Wang, *The Narayana transformation*, arXiv:2607.01572 (2 Jul 2026), Conjecture 4.1:
the row generating functions of A² (Eulerian triangle squared) and D² (Delannoy triangle squared)
have only real nonpositive zeros. Listed as open on SymCat
(symmetricfunctions.com/realRootedOpenProblems.htm) as of 25 Nov 2026.

This log concerns mainly the **D² part**. G_n(x) = row n of D².
G_0=1, G_1=x+2, G_2=x²+6x+5, G_3=x³+10x²+25x+12,
G_n = (x+3)G_{n-1} + (x-1)G_{n-2} + (x-1)G_{n-3} + x G_{n-4}  (from the paper).

## Results so far

| # | Statement | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Our definitions match the paper (A row 3 = [0,1,4,1], D row 3 = [1,5,5,1], D² rows 0–3 = G_0..G_3) | Verified | scripts/exact_rows.py asserts |
| 2 | D² rows 1–91: all zeros real and ≤ 0 | **EXACT** (Sturm count, integer arithmetic) | shots/07_rows91.png, scripts/exact_rows.py |
| 3 | A² rows 1–30 real-rooted | Exact, by Mao–Wang (paper) | paper |
| 4 | A², D² rows ≤ 38: consecutive rows interlace | Numerical only (diagnostic) | shots/01_interlace.png |
| 5 | Search for recurrence for A² of form sum (a_i + b_i x + c_i n + d_i n x) P_{n-i}, order ≤ 4 | None exists (method rediscovers the D² recurrence) | shots/01_interlace.png |
| 6 | Σ G_n tⁿ = (1−t)/Den, Den = (1−t)(1−2t−t²) − x t(1+t)(1+t²) | PROVED (Riordan array), exact check | opus/, scripts/verify_lemma.py |
| 7 | disc_t(Den) = −16(x²+6x+1)²(x²+8x−2) | PROVED, exact check | shots/03_disc.png |
| 8 | Limit interval of zeros = [a,b] = [−4−3√2, −3+2√2]; row 38 zeros in (−8.218, −0.178) | Interval exact; accumulation numerical (Beraha–Kahane–Weiss) | shots/02_limit.png |
| 9 | **Two-squares identity**: (b−x*)·Den = (b−x)·q*(t)² + (x−x*)·q_b(t)², x* = −3−2√2 | PROVED, exact check | PROOF_angle_lemma.md |
| 10 | **Angle lemma**: for x in (a,b) the smallest-modulus t-roots are a unique conjugate pair τe^{±iθ} (pairs coincide only at x*), θ continuous, strictly decreasing from π to 0 | PROVED by Opus 5.5; all algebra independently verified (sympy, all checks passed); **logic refereed 26 Nov (second Opus chat, medium): no fatal gaps, 3 fixable (F1 endpoint limit of X, F2 Step 3 labelling, F3 statement at x*), 10 cosmetic** — see REFEREE_1.md | PROOF_angle_lemma.md, shots/09_passed.png |
| 11 | For n ≤ 60, zeros mapped to θ lie one per slice of width π/(n+2) | Numerical | (Colab output, not screenshotted) |
| 12 | Forgács–Tran (arXiv 1606.07125, 1601.02582) do not apply directly: numerator 1−t, multi-term x-part, P has negative zero −1−√2, and only "eventually" | Checked | — |

## Side target: SymCat #19 (skew Schur Ehrhart h*-polynomials)
3,220 new cases (|λ| ≤ 9, k ≤ 5, outside SymCat's checked |λ| ≤ 8, k ≤ 4): **0 failures**.
Definition used still to be checked against SymCat's exact wording. shots/06_sym19.png.

## Plan (Stage C)
Let x_k(n) = θ⁻¹(kπ/(n+2)), k = 1..n+1. Prove sign G_n(x_k(n)) alternates for all n ≥ N0
with explicit N0. Since rows ≤ 91 are verified exactly, any N0 ≤ 91 completes the D² proof.

## Credits / tools
Computations: Python/sympy in Google Colab. Proof of items 6, 7, 9, 10: Claude Opus 5.5,
verified independently. Research direction and verification: Sukhraj Sachdeva, with Claude.
