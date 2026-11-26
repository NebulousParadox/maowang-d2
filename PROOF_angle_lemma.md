# Angle lemma for the D² generating function

Produced by Claude Opus 5.5 on 26 Nov 2026 from our brief. Algebra independently verified
(scripts/verify_lemma.py, all checks passed). Logic NOT yet refereed. No novelty claimed.

## Notation
- α = 1+√2, β = √2−1 (αβ = 1).
- a = −4−3√2 (root of x²+8x−2), b = −3+2√2 (root of x²+6x+1), x* = −3−2√2; x*·b = 1.
- q*(t) = (1+√2)t² + √2 t + 1, q_b(t) = (1−√2)t² − √2 t + 1.
- κ(x) = (x−x*)/(x−b), ψ(t) = q*(t)/q_b(t).
- c = (−√2 + i√(2+4√2))/(2+2√2), the upper root of q*; |c|² = √2−1; θ_c = arg c ≈ 2.043269.
- r1 ≈ 0.6012 > 0 > r2 ≈ −4.0155 the roots of q_b; r1 + r2 = −(2+√2).

## (a) Claims 1 and 2
**A1 (PROVED).** D is the Riordan array (1/(1−t), t(1+t)/(1−t)). With C_k = t^k(1+t)^k/(1−t)^{k+1},
(1−t)C_k = t(1+t)C_{k−1}, giving d(n,k) = d(n−1,k) + d(n−1,k−1) + d(n−2,k−1), with the same boundary values.

**A2 (PROVED).** (g,f)(h,l) = (g·h(f), l(f)) gives D² = (g·g(f), f∘f), where g·g(f) = 1/(1−2t−t²) and
f∘f = t(1+t)(1+t²)/((1−t)(1−2t−t²)). So Σ G_n tⁿ = (1−t)/Den. Series check matches D² rows for n < 14.

**A3 (PROVED, computer algebra).** disc_t(Den) = −16(x²+6x+1)²(x²+8x−2).

## Key structure
- **S1.** Den(x*,t) = q*(t)², Den(b,t) = q_b(t)².
- **S2.** (b−x*)·Den(x,t) = (b−x)·q*(t)² + (x−x*)·q_b(t)². For x ≠ b: Den = 0 ⇔ ψ(t)² = κ(x).
- **S3.** disc(q*) < 0, so q* > 0 on ℝ; disc(q_b) > 0; q*·q_b = −(t⁴+4t³−1).
  κ is a decreasing bijection (−∞,b) → (−∞,1). It maps (a,x*) onto (0,κ(a)) and [x*,b) onto (−∞,0].
  κ(a) = v_a², with v_a = (1+2√2)/7.

## (b) Claim 3
**Step 1 (PROVED).** No real roots for x in (a,b), and the roots are distinct for x ≠ x*.
- On (x*,b), Den > 0 on ℝ by S2.
- On (a,x*] put v = √κ. Then Den ∝ (q* − v q_b)(q* + v q_b), with
  disc(q* − v q_b) = (4√2−2)v² + 12v − (2+4√2) < 0 and disc(q* + v q_b) = (4√2−2)v² − 12v − (2+4√2) < 0 on [0,v_a).

**Step 2 (PROVED).** On (a,x*), pair 1 comes from q* − v q_b, with A1 = α+βv, B1 = √2(1+v), C1 = 1−v.
- τ1 < τ2 strictly.
- cos²θ1 = (1+v)²/(2(1−v)(α+βv)), and its log-derivative is positive.
- So θ1 is strictly decreasing in x, with θ1 → π as x → a (a double root at t = 1−√2) and θ1 → θ_c as v → 0.

**Step 3 (PROVED).** At x*, Den = q*², with double roots c and c̄ and all moduli equal to (√2−1)^{1/2}.
The modulus ratio is exactly 1 there (the earlier "≈1.05" was grid resolution).
Infinite slope of θ at x*: proved from the left, numerical from the right.

**Step 4 (PROVED).** On (x*,b), with w = √(−κ):
- **4a.** The upper roots lie on Γ = {Re(q*(t)·conj(q_b(t))) = 0, Im t > 0}.
- **4b.** In polar form, Γ is τ⁴ + 4cτ³ + 4(1−c²)τ² − 1 = 0 with c = cos θ. The branches c± are monotone (h' > 1, via AM–GM).
  Γ is a single arc τ = T(θ), θ ∈ (0,π), with T(0+) = r1 and T(π−) = |r2|.
- **4c.** Intermediate value theorem plus exactly 2 upper-half-plane roots gives exactly one root on each side of θ_c.
  Hence X(θ) is injective, θ_A(x) is strictly decreasing, and θ_A runs from θ_c down to 0.
- **4d.** r1 < |c| reduces to 50 > 49, so τ_A < |c| < τ_B: the smallest pair is unique.

**Step 5 (PROVED).** Gluing: θ is continuous and strictly decreasing on (a,b), from π to 0.

**Step 6 (PROVED, cross-check).** Equal moduli for two non-real pairs with x < 0 forces (x+1)(x²+6x+1) = 0,
so only x = x* is possible.

## Referee checklist (from Opus)
1. Riordan identification and product rule (A1–A2).
2. Discriminant (A3).
3. Interpolation identity S2 ⇔ ψ² = κ.
4. Discriminant signs of q* ∓ v q_b on [0,v_a), and v_a² = κ(a).
5. Log-derivative inequality (Step 2).
6. Polar reduction of Γ, the branches c±, and h' > 1 (4b).
7. Endpoint equations c+ = 1 ⇔ τ = r1 (with τ ≤ 2), and c− = −1 ⇔ τ = |r2|.
8. Intermediate value counting in 4c (uses exactly 2 upper-half-plane roots).
9. r1 < |c| (50 > 49): the tightest step.
10. Treatment of x* as the coincidence point.

Opus's original scripts are in opus/ (verify.mjs was run by Opus; verify_sympy.py was rerun by us
with a simplify fix as scripts/verify_lemma.py).
