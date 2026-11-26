# Referee report 1: angle lemma

**Date:** 26 Nov 2026.
**Referee:** a fresh Claude Opus 5.5 chat (medium effort).
**Scope:** the logic only. The algebra had already been verified in exact sympy.

## Verdict

**The logic is correct, and nothing is fatal.**

Steps 1, 2, 4b, 4c, 4d and 5 hold as written.

## Fixable

**F1 (Step 4c).** The proof asserts that $X(\theta)\to b$ as $\theta\to 0^+$ and as $\theta\to\pi^-$, but does not prove it.

*Fix.* By 4b, $T(\theta)e^{i\theta}\to r_1$ or $r_2$. Both are roots of $q_b$, and $q^\ast$ has no real roots, so $|\psi|\to\infty$. On $\Gamma$ we have $\psi^2\le 0$. Hence $\psi^2\to-\infty$, and so $\kappa^{-1}(\psi^2)\to b^-$.

**F2 (Step 3).** The step is labelled PROVED, but its claim of infinite slope on the right is only NUMERICAL.

*Fix.* That claim is not needed, so drop it. Alternatively, prove it: $\psi$ has a simple zero at $c$, which gives $\theta-\theta_c\sim C'\sqrt{x-x^\ast}$, and the tangent to $\Gamma$ at $c$ is not radial because $\theta_c>\theta_0$.

**F3 (statement at $x^\ast$).** The statement needs a fixed convention at $x^\ast$.

*Adopted convention.* There is a strict modulus gap on $(a,b)\setminus\lbrace x^\ast\rbrace $. At $x^\ast$, both double roots have modulus $(\sqrt2-1)^{1/2}$. Counted without multiplicity, $\lbrace c,\bar c\rbrace $ is the unique smallest pair. Stage C must allow for this double root.

## Cosmetic

1. Lost asterisks on $x^\ast$ in the headings.
2. The letter $c$ is used both for $\cos\theta$ and for the root of $q^\ast$. Rename one of them.
3. In Step 2, state that $v<1$. This holds because $v<v_a\approx 0.547$.
4. In 4c, state that $X$ is decreasing.
5. In 4c, state that $\theta\mapsto T(\theta)e^{i\theta}$ is a bijection onto $\Gamma$, and that $\theta_c$ is never a solution.
6. In 4b, $h'$ is infinite at $\tau_0$. State that $c_-$ is continuous there.
7. Keep the label "cross-check" on Step 6.
8. Remove the leftover references to "$R=P/B$" and "your values".
9. Replace the phrase "grid effect" with the $\sqrt\delta$ scaling. Here $\delta = |x - x^\ast|$:
   - at $\delta=10^{-2}$, ratio $-1\approx 0.05$
   - at $\delta=10^{-4}$, ratio $-1\approx 0.005$
10. Mark the circle fact $|t-1|=\sqrt2$ as a remark.

## Checked and sound

- **Step 1:** the degree, the factorisation, the signs of the discriminants, and that the roots are distinct.
- **Step 2:** the ordering, the monotonicity, and the limits.
- **Step 4a:** the equivalence, and that the branch of $\kappa^{-1}$ is unique.
- **Step 4b:** that $T$ is single-valued and continuous, and the endpoints.
- **Step 4d:** the ordering, which uses $50>49$.
- **Step 5:** the gluing, and continuity at $x^\ast$.
