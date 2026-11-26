# Stage C: real-rootedness of every $G_n$

- **Author:** Claude Opus 5.5, 26 Nov 2026.
- **Status:** this is the original working document, kept for the record. **The current version is [`STAGE_C_FINAL.md`](STAGE_C_FINAL.md).** Since this was written, the reasoning has been refereed ([`REFEREE_2.md`](REFEREE_2.md)), the libm assumption has been removed by a rigorous Arb certificate, and ChatGPT and Gemini have cross-checked it ([`EXTERNAL_AI_CHECKS.md`](EXTERNAL_AI_CHECKS.md)).
- **Scripts:** [`stageC/`](stageC/)

## Verification log (26 Nov 2026)

| Check | Platform | Result |
|---|---|---|
| `node run_cert.mjs 12 0.05` | Node / V8, local | **CERTIFICATE PASSED for all $N\ge12$ ($n\ge10$)** |
| `python stageC_cert.py 12 0.05` | Python / glibc, Google Colab | **CERTIFICATE PASSED**. Box counts and constants are identical to the Node run. |
| `python stageC_exact.py` | sympy, Google Colab | **all stage C exact checks passed** |
| Sturm count, $n\le 91$ | sympy, Colab | all real-rooted ([`shots/07_rows91.png`](shots/07_rows91.png)) |

## Notation

| Symbol | Meaning |
|---|---|
| $N$ | $n+2$ |
| $\theta_k$ | $k\pi/N$ |
| $x_k$ | $\theta^{-1}(\theta_k)$ |
| $t_1, t_2$ | the upper-half-plane roots of $\mathrm{Den}$, with $\lvert t_1\rvert<\lvert t_2\rvert$ |
| $\rho_j$ | $\lvert t_j\rvert$ |
| $u_j$ | $(1-t_j)t_j/\partial_t\mathrm{Den}(t_j)$ |
| $\zeta$ | the root of $q^\ast$ in the upper half-plane |

## C1. Sample-point identity (proved)

Partial fractions give

$$G_n=-2\operatorname{Re}\!\left[u_1t_1^{-N}+u_2t_2^{-N}\right].$$

At $\theta_1=k\pi/N$ we have $t_1^{-N}=(-1)^k\rho_1^{-N}$. So

$$G_n(x_k)=(-1)^{k+1}\rho_1^{-N}\,[\,m+E\,],\qquad m=2\operatorname{Re}u_1,\quad |E|\le 2|u_2|\,(\rho_1/\rho_2)^N.$$

## C2. The original goal is false

$m$ changes sign at $x=-1$. There $\theta=\pi/4$ exactly, with $t_1=\rho e^{i\pi/4}$ and $\rho=(\sqrt6-\sqrt2)/2$. So the two sample points on either side of $\pi/4$ have the same sign.

These repeated signs are certified:
- $n=4$: $k=1,2$
- $n=5$: $k=1,2$
- $n=40$: $k=10,11$

**Exact fact.** $G_n(-1)=0$ whenever $n\equiv 2\pmod 4$. This follows from the identity

$$F(t)+F(-t)-F(it)-F(-it)=0,\qquad F=\frac{1-t}{\mathrm{Den}(-1,t)}.$$

## C3. Corrected theorem, for $N\ge12$ (proved, computer-assisted)

**Sign pattern.**
- If $\theta_k>\pi/4$, then $\operatorname{sign}G_n(x_k)=(-1)^{k+1}$.
- If $\theta_k<\pi/4$, then $\operatorname{sign}G_n(x_k)=(-1)^k$.

The only possible exception is a $k$ with $|\theta_k-\pi/4|\le 15.1\cdot3.652^{-N}$. That happens only when $4\mid N$, at $x_k=-1$.

**From signs to zeros.**
1. The sign pattern gives at least $n-1$ distinct zeros.
2. $G_n$ is monic with real coefficients, so non-real zeros come in conjugate pairs. By parity, the remaining zero is also real.
3. All coefficients are positive, so every zero is negative.

## C4–C7. The interval certificate

The certificate uses outward rounding. `exp`, `cos` and `sin` are widened by 4 ulp.

| Region | Method | Constants |
|---|---|---|
| Far region (circle side, $\Gamma_\pm$ branches) | Adaptive boxes that check the C1 condition at $N_0$ | 0 failures. $\operatorname{sign} m=+$ for $\theta>\pi/4$ and $-$ for $\theta<\pi/4$ |
| $b$ end | Arc bound for pair 2: $\rho_2^{-N}(\pi/2)(S_1+NS_0/\rho_2)$ | Passes, together with an increment check |
| $-1$ window, $\tau\in[0.51364,0.52164]$ | Forward-mode automatic differentiation over intervals | $m'\le-0.829$, $\lvert d\theta/d\tau\rvert\le7.42$, $e\le0.838$, $\rho_2/\rho_1\ge3.652$ |
| $x^\ast$ window, $\lvert\kappa\rvert\le\lambda_0^2=0.0025$ | Exact formula for $\Psi_N$ (below), with two cases | Left: $D_2=0.370$, $\beta\ge0.124$. Right: $D_2=0.328$, $\beta\ge0.050$. So $\Psi_N>0$ for all $N>6.6$ |

The exact formula used in the $x^\ast$ window:

$$G_n(x_k)=(-1)^{k+1}\frac{\rho_1^{-N}}{K}\,\Psi_N,\qquad \Psi_N=\operatorname{Re}\frac{U(\lambda)-U(-\lambda)e^{-N\ell(\lambda)}}{\lambda},$$

where

$$K=\frac{b-x}{4\sqrt2},\qquad U(\lambda)=\frac{(1-t)\,t}{q_b(t)\,\big(q^{\ast\prime}(t)-\lambda q_b'(t)\big)},\qquad \ell(\lambda)=\log\frac{t(-\lambda)}{t(\lambda)}.$$

## C8. Small $n$ (exact)

For $n=1,\dots,11$, exact sign changes show that $G_n$ has $n$ real zeros. Rows up to $n\le91$ were also checked separately by Sturm count.

## Conclusion

Every $G_n$ is real-rooted with negative zeros. (This originally assumed libm accuracy to within 4 ulp. That assumption was removed when the Arb certificate passed on 27 Nov 2026.) **This settles the $D^2$ half of Mao–Wang Conjecture 4.1, pending review by a human expert.**

## Open items

1. ~~Referee the reasoning.~~ **Done.** Report 2 found the reasoning correct.
2. ~~Remove the libm assumption.~~ **Done.** `stageC_cert_rigorous.py` (python-flint/Arb) passed for all $N\ge12$.
3. Review by a human expert. **Pending.**
4. A gap that the conjecture does not need: we have not shown that the $n$-th zero lies in $(a,b)$.
