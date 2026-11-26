# External AI cross-checks

- **Date:** 27 Nov 2026
- **Checkers:** ChatGPT (free tier, Think mode) and Gemini (free tier).
- **Input:** both received the same one-paragraph **outline** of the proof, not the full documents or the certificate code. They were asked to verify (a) the identities, (b) $G_n(-1)=0$ for $n\equiv2\pmod4$, and (c) the zero counting, and (d) to list gaps with severities.

## Summary

| Check | ChatGPT | Gemini |
|---|---|---|
| Generating function | Verified | Verified |
| Two-squares identity | Verified exactly ($b-x^\ast=4\sqrt2$) | Verified, coefficient by coefficient |
| $G_n(-1)=0$, $n\equiv2\pmod4$ | Verified, with a new short proof: the even part of $F(-1,t)$ is $\dfrac{1+3t^4}{1+14t^4+t^8}$ | Verified: $G_2=G_6=G_{10}=0$ |
| Partial-fraction form | Verified (given simple roots) | Verified |
| Zero counting, including when $x=-1$ is a sample | Correct in both cases | Correct in both cases |
| Errors found | **None** | **None** |

## Gaps they raised, and our response

| Raised by | Point | Severity given | Response |
|---|---|---|---|
| ChatGPT | The root collision at $x^\ast$: $\mathrm{Den}(x^\ast,t)=q^\ast(t)^2$, so the $u_j$ blow up and $\rho_1=\rho_2$ there | Major | **Already handled.** The $\lambda$-window uses the exact formula for $\Psi_N$, which treats $\lambda=0$ as a removable singularity. Referee 2 checked this (item 4). The outline just didn't describe it. |
| ChatGPT | The inequality $\lvert m\rvert>\lvert E\rvert$ for all $N\ge12$ is asserted, with no certificate shown | Major | **Already handled.** It is `stageC/stageC_cert_rigorous.py`. Boxes are fixed sets of $\theta$, and the condition holding at $N_0$ implies it holds for all $N\ge N_0$ (Referee 2, item 1). ChatGPT was not shown the code. |
| ChatGPT | The monotonicity of $\theta$ and the single sign change of $m$ need proofs | Moderate | The first is the angle lemma ([`PROOF_angle_lemma.md`](PROOF_angle_lemma.md)). The second is part of the certificate. |
| ChatGPT | Positivity of the coefficients should be justified | Minor | It follows from $G(n,k)=\sum_j D(n,j)D(j,k)>0$, as ChatGPT notes. This will be stated explicitly in the write-up. |
| Gemini | The angle-lemma proof was omitted, and so was the argument for uniformity in $N$ | Major | Both are in the full documents ([`PROOF_angle_lemma.md`](PROOF_angle_lemma.md), [`REFEREE_2.md`](REFEREE_2.md)). |

## New observation from ChatGPT (worth adding to the write-up)

No sample point can equal $x^\ast$ exactly. Here $2\cos(2\theta^\ast)=2\sqrt2-4$, whose minimal polynomial is $z^2+8z+8$. Its conjugate $-4-2\sqrt2$ is less than $-2$, so $2\cos(2\theta^\ast)$ cannot have the form $\omega+\omega^{-1}$ for a root of unity $\omega$. So $\theta^\ast/\pi$ is irrational.

The proof does not need this, because the $\lambda$-window covers points arbitrarily close to $x^\ast$. It is still a clean remark.

## Verdict

- ChatGPT recommended "major revision", and Gemini made a similar call. In both cases the reason was that the outline left out the certificate and the lemma proofs. **Neither was reviewing the full write-up.**
- Every item that **was** checkable from the outline was verified.
- No algebraic or logical error was found.
---

# Round 2: the full package (27 Nov 2026)

**Input:** both models received one file containing `STAGE_C_FINAL.md`, `PROOF_angle_lemma.md` and the full `stageC_cert_rigorous.py`. ChatGPT worked for 13 minutes. It tried to run the code but could not install python-flint, so its review of the code is a static audit. Gemini failed once and succeeded on the retry.

| Question | ChatGPT | Gemini |
|---|---|---|
| The $x^\ast$ collision ($\lambda$-window, $\Psi_N$, $\lambda=0$) | **Resolved.** It rechecked the residue signs. It confirmed that the code's intervals contain $\lambda=0$ and that it never divides by $\lambda$. | **Completely sound.** The removable singularity is handled correctly, and the ray labelling via $\operatorname{Re}\ell>0$ is correct. |
| Uniformity in $N$ (passing at $N_0$ ⇒ passing for all $N\ge N_0$) | **Valid.** The increment argument works. | **Airtight.** |
| Coverage of $(0,\pi)$ | No gaps found. | No gaps. It checked every boundary overlap. |
| Angle lemma | Sound in the final version (Part 1). The old draft (Part 2) has an unsupported slope claim. | Sound, with minor points of exposition. |
| Code soundness | No soundness bug. Two low-severity points. | No soundness bug. |
| **Recommendation** | **Minor revision, then acceptance in principle** | **Accept**, after minor exposition fixes |

## The one real defect, found by ChatGPT, now fixed

**C6 checked the wrong threshold.**
- The code tested `N*len < pi`. That proves at most one sample point lies in the failure set around $\pi/4$.
- The proof also claims there is **no** such sample point when $4\nmid N$. The nearest sample point can then be as close as $\pi/(4N)$, so the proof needs `N*len < pi/2`.
- The actual value is $3.2\times10^{-5}$, so the conclusion was true by a margin of about $5\times10^4$. But the check as written did not prove it.
- **Fix:** the code now tests `< PI / 2`, and `STAGE_C_FINAL.md` C6 has been rewritten to match.
- **The certificate must be rerun on Colab** to confirm that it still prints PASSED.

## Lower-severity items

| Item | Raised by | Status |
|---|---|---|
| `_float_upper` uses a float conversion with a $10^{-12}$ margin. Its IEEE error bound should be documented, or the helper replaced with a pure-Arb version. | ChatGPT | Open (low) |
| The arc bound evaluates only the upper semicircle. This is fine by conjugate symmetry, but should be stated in C4. | ChatGPT | Open (expository) |
| `PROOF_angle_lemma.md` has an old draft header and an unsupported slope claim | Both | **Fixed:** marked as the old draft, and the slope claim withdrawn |
| Certify the boundary orderings $\theta_\zeta<\theta_S$, $\tau_0<\tau_E<\lvert\zeta\rvert$ and $\tau_w\in W_1$ explicitly in the code | ChatGPT | Open (low) |
| Attach exact Sturm certificates for $1\le n\le9$ | ChatGPT | Open (low). `scripts/exact_rows.py` covers this; attach its output. |
| C7 prose: $\varphi$ should be $\arg\ell(\lambda)$, not $\arg(\ell/\lambda)$ | Gemini | Open (typo) |
| Lemma A4: state explicitly that $X(\theta)>x^\ast$ away from $\theta_\zeta$ | Gemini | Open (expository) |
