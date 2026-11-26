# Lean 4 + Mathlib: what can realistically be formalised

There is no Lean toolchain on the machine where this was written, so **every code sketch below is uncompiled**. The effort estimates are rough.

## Summary

| Part | Feasible now? | Approach | Rough size |
|---|---|---|---|
| $G_n(-1)=0$ for $n\equiv2\pmod4$ | **Yes, easy** | Integer recurrence plus $\chi(y)\chi(-y)=y^8+14y^4+1$, giving $g_{n+8}=-14g_{n+4}-g_n$; then induction from $g_2=g_6=0$ | under 50 lines |
| Exact identities (factorisation, $\mathrm{Den}(x^\ast,\cdot)=q_\ast^2$, $\mathrm{Den}(b,\cdot)=q_b^2$, $q_\ast q_b=-(t^4+4t^3-1)$, $\theta(-1)=\pi/4$) | **Yes** | Polynomial identities over $\mathbb{R}$ with $\sqrt2,\sqrt6$; `linear_combination` / `ring_nf` with `Real.sq_sqrt`, or computation in $\mathbb{Q}(\sqrt2)$ | 100–300 lines |
| The discriminant formula | Yes, if the discriminant is *defined* by the explicit quartic formula | `ring` on a degree-6 polynomial in $x$ | small, but `ring` may be slow |
| Counting and parity (C3): $n-1$ sign changes plus real coefficients imply all $n$ zeros are real; positive coefficients imply they are negative | **Yes** | IVT (`intermediate_value_Ioo`); divide by $\prod(X-r_i)$ (`Polynomial.prod_multiset_X_sub_C_dvd`); a real polynomial of degree 1 has a real root | 200–400 lines |
| Small $n$ (here $n\le11$; could go to $n\le91$) | **Yes** | Exhibit rational points; `norm_num` gives the exact signs, then use the counting lemma | per $n$; up to 91 needs automation or `native_decide` (trusts the compiler) |
| $G_n$ as the row polynomials of $D^2$ (the Riordan link) | Moderate | `PowerSeries` manipulation, or a direct combinatorial proof that the rows of $D^2$ satisfy the 4-term recurrence | 300–800 lines |
| C1 partial fractions: $G_n=-2\mathrm{Re}\sum u_jt_j^{-N}$ | Moderate to hard | Avoid residues: solution theory of linear recurrences with distinct characteristic roots over $\mathbb{C}$ | 500+ lines |
| Lemma A (angle lemma: root geometry, continuity and monotonicity of $\arg t_1$) | **Hard** | Continuity of roots in a parameter, IVT on curves, monotone branches | thousands of lines |
| The interval certificate (C4–C7: about $10^4$ boxes, exp/cos/sin/complex sqrt, interval derivatives) | **Not realistic in Mathlib today** | Mathlib has no verified interval-arithmetic engine at this scale | research-engineering project |

## Recommendation: a conditional formal theorem

Formalise the parts marked **Yes**, and state the certificate's output as an explicit hypothesis. This keeps the trusted computing base to exactly what python-flint certified.

```lean
-- UNCOMPILED SKETCH
-- G_n defined by the paper's recurrence (the D^2 link can be added later)
noncomputable def G : ℕ → Polynomial ℤ
  | 0 => 1
  | 1 => X + 2
  | 2 => X^2 + 6*X + 5
  | 3 => X^3 + 10*X^2 + 25*X + 12
  | n+4 => (X+3) * G (n+3) + (X-1) * G (n+2) + (X-1) * G (n+1) + X * G n

/-- hypothesis supplied by the certificate (Proposition C) -/
def CertifiedSignPattern (n : ℕ) : Prop :=
  ∃ xs : Fin (n+2) → ℝ, StrictAnti xs ∧ (∀ k, xs k < 0) ∧
    -- at least n-1 indices k with a sign change of G_n between xs k and xs (k+1), or a zero at xs k
    ...

theorem realRooted_of_signPattern (n : ℕ) (h : CertifiedSignPattern n) :
    ((G n).map (Int.castRingHom ℝ)).roots.card = n ∧
    ∀ r ∈ ((G n).map (Int.castRingHom ℝ)).roots, r < 0 := by
  sorry -- counting/parity lemma + positivity of coefficients
```

The $G_n(-1)$ part, which is expected to go through more or less directly:

```lean
-- UNCOMPILED SKETCH
def g : ℕ → ℤ
  | 0 => 1 | 1 => 1 | 2 => 0 | 3 => -4
  | n+4 => 2*g (n+3) - 2*g (n+2) - 2*g (n+1) - g n

theorem g_step (n : ℕ) : g (n+8) = -14 * g (n+4) - g n := by
  simp only [g]; ring          -- unfolds g (n+8), …, g (n+4) down to g n … g (n+3)

theorem g_vanish (k : ℕ) : g (4*k+2) = 0 := by
  suffices h : ∀ k, g (4*k+2) = 0 ∧ g (4*k+6) = 0 from (h k).1
  intro k; induction k with
  | zero => exact ⟨by decide, by decide⟩
  | succ k ih =>
      refine ⟨by simpa [show 4*(k+1)+2 = 4*k+6 by ring] using ih.2, ?_⟩
      have := g_step (4*k+2)
      rw [show 4*k+2+8 = 4*(k+1)+6 by ring, show 4*k+2+4 = 4*k+6 by ring] at this
      rw [this, ih.1, ih.2]; ring
```

## What a formal proof would and would not cover

- **Covered with no extra trust:**
  - $G_n(-1)=0$ for $n\equiv2\pmod4$;
  - the algebraic identities;
  - the implication "certified sign pattern ⇒ real-rooted with negative zeros";
  - small $n$.
- **Still trusted, outside Lean:**
  - the python-flint certificate (Arb's ball arithmetic), and the reduction from the certificate's box conditions to the sign pattern (C1, C4–C7, Lemma A);
  - these remain pen-and-paper plus a certified computation.
- **Path to a fully formal proof:** formalise Lemma A and C1 (hard, but plain analysis), and replace the certificate by a proof-producing interval method. That last part is the main obstacle.
