# Referee report 1 on PROOF_angle_lemma.md

26 Nov 2026. A fresh Claude Opus 5.5 chat (medium effort) refereed the logic only, because the algebra had already been verified.

**Verdict: the logic is correct and nothing is fatal.** Steps 1, 2, 4b, 4c, 4d and 5 hold as written.

## Fixable
- **F1 (Step 4c).** The limit "X → b as θ → 0⁺ and as θ → π⁻" was asserted without proof. Fix: by 4b, T(θ)e^{iθ} tends to r1 or to r2, and both are roots of q_b. Since q* has no real roots, |ψ| → ∞. On Γ we have ψ² ≤ 0, so ψ² → −∞ and κ⁻¹(ψ²) → b⁻.
- **F2 (Step 3).** The step is labelled PROVED but its right-side slope claim is NUMERICAL. That claim isn't needed, so either drop it or prove it. Sketch of a proof: ψ has a simple zero at c, so θ − θ_c ~ C′√(x − x*). The tangent to Γ at c is not radial, because θ_c > θ0.
- **F3 (statement).** Fix a convention for x*. **Adopted:** strict modulus gap on (a,b)∖{x*}. At x*, both double roots have modulus (√2−1)^{1/2}. Counting roots without multiplicity, {c, c̄} is the unique smallest pair at x*. Later stages (Stage C) must allow this double root.

## Cosmetic
1. Lost asterisks (x*) in the headings.
2. c is used both for cos θ and for the root of q*; rename one.
3. In Step 2, say v < 1, which holds because v < v_a ≈ 0.547.
4. In 4c, state that X is decreasing.
5. In 4c, state that θ ↦ T(θ)e^{iθ} is a bijection onto Γ, and that θ_c is never a solution.
6. In 4b, h' is infinite at τ0; say that c₋ is continuous there.
7. Keep the "cross-check" label on Step 6.
8. Remove the leftover references: "R = P/B" and "your values".
9. Replace "grid effect" with the √δ scaling: ratio − 1 is about 0.05 at δ = 10⁻², and about 0.005 at δ = 10⁻⁴.
10. Mark the |t−1| = √2 circle fact as a remark.

## Checked and sound
Step 1 (degree, factorisation, discriminant signs, distinct roots). Step 2 (ordering, monotonicity, limits).
Step 4a (equivalence, unique κ⁻¹ branch). Step 4b (single-valued continuous T, endpoints).
Step 4d (ordering, using 50 > 49). Step 5 (gluing and continuity at x*).
