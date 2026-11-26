# Referee report 2: Stage C

- **Date:** 26 Nov 2026
- **Referee:** a separate Claude Opus 5.5 session. It refereed the reasoning and checked it against what `cert.mjs` and `run_cert.mjs` actually do.

## Verdict

**The reasoning is correct.** Nothing is fatal. There are two fixable gaps in the write-up, and the rest is cosmetic.

The proof is correct **given** two things:
- the libm accuracy assumption;
- the angle lemma, which was already accepted with fixes F1–F3.

## Item by item

1. **C1, the sample-point identity: correct.**
   - The sign convention checks out: $t_1^{-N}=(-1)^k\rho_1^{-N}$.
   - Passing from $N_0$ to all $N\ge N_0$ is valid. Boxes are fixed sets of $\theta$, the condition is pointwise, and $q>1$.
   - The arc branch uses an increment check, and that check increases with $N$.
2. **C3, the counting: correct in both cases.**
   - **(a)** One sign repeat leaves $n-1$ sign changes, so there are $n-1$ zeros.
   - **(b)** At $x=-1$, where $G_n(-1)=0$, the neighbouring signs are opposite. That gives $n-2$ zeros from the gaps plus the zero at $-1$, so $n-1$ in total, with no double count.
   - **Parity:** the one remaining zero must be real.
   - "$4\nmid N$ ⇒ no exception" holds, because $\pi/(4N)\gg15.1\cdot3.652^{-N}$.
   - The coefficient factor $1+(-1)^n-i^n-(-i)^n=4$ for $n\equiv2\pmod4$ is verified.
3. **Coverage of $(0,\pi)$: complete.** The regions chain together like this:
   - the $\Gamma^+$ boxes down to $\theta=0$;
   - the $-1$ window;
   - $\Gamma^-$ up to the boundary certificate at $\tau_E$, plus the monotonicity of $\lvert\psi\rvert$;
   - the $x^\ast$ window;
   - the circle, from the boundary certificate at $\theta_S$ up to $\pi$.

   Both singular ends are handled soundly through the segment mean-value form of $m$.
4. **The $x^\ast$ window formula: correct.**
   - The derivation of $\Psi_N$, the hull enclosure for $\ell/\lambda$, and both cases ($\lvert W\rvert\le2$ and $\lvert W\rvert\ge2$) are sound.
   - The right-ray labelling is implied by the check $\cos\varphi>0$.
   - $\lambda=0$ is a removable singularity, so it is covered by continuity.
5. **The $-1$ window: correct.** The failure set is an interval of length less than $\pi/N$, so it contains at most one sample point.
6. **The arc bound: correct.** It uses $\varphi/\sin\varphi\le\pi/2$, and the sampled arc contains the true one.
7. **Issues found:**
   - **Fixable (write-up):** explain the regularised $m$, and state that the boxes run all the way to $\theta=0$ and $\theta=\pi$.
   - **Fixable (write-up):** state the coverage chain explicitly, including the boundary certificates, the monotonicity facts and the $\lambda$-labelling.
   - **Cosmetic:** `Math.pow` and `Math.exp` are used without widening in the final comparisons. The $10^{-12}$ and $10^{-9}$ margins cover this, but `pow` should be added to the libm assumption.
   - **Cosmetic:** the repeats at $n=4$ and $n=5$ in C2 fall outside the certificate's range. Cite exact arithmetic for them.

## What this does and does not establish

The two referees and the prover are all Claude models. An external human expert review has **not** happened yet.

The libm assumption is still in place. Removing it needs a rerun with rigorous arithmetic (mpmath `iv` or Arb) before publication.
