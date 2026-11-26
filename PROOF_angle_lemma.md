# Angle lemma for the $D^2$ generating function

- **Produced by:** Claude Opus 5.5, 26 Nov 2026.
- **Algebra:** checked independently with [`scripts/verify_lemma.py`](scripts/verify_lemma.py). All checks pass.
- **Logic:** refereed in [`REFEREE_1.md`](REFEREE_1.md). No fatal gaps were found. **This is the original draft, kept for the record.** The fixes F1–F3 are folded into Lemma A in [`STAGE_C_FINAL.md`](STAGE_C_FINAL.md), which is the version to cite.
- **Novelty:** none claimed.

## Notation

- $\alpha=1+\sqrt2$ and $\beta=\sqrt2-1$, so $\alpha\beta=1$.
- The constants:
  - $a=-4-3\sqrt2$ is a root of $x^2+8x-2$.
  - $b=-3+2\sqrt2$ is a root of $x^2+6x+1$.
  - $x^\ast=-3-2\sqrt2$.
  - These satisfy $x^\ast b=1$.
- The quadratics:

```math
q^\ast(t)=(1+\sqrt2)t^2+\sqrt2\ t+1,\qquad q_b(t)=(1-\sqrt2)t^2-\sqrt2\ t+1.
```

- The maps:

```math
\kappa(x)=\frac{x-x^\ast}{x-b},\qquad \psi(t)=\frac{q^\ast(t)}{q_b(t)}.
```

- $c=\dfrac{-\sqrt2+i\sqrt{2+4\sqrt2}}{2+2\sqrt2}$ is the root of $q^\ast$ in the upper half-plane. It satisfies $|c|^2=\sqrt2-1$, and $\theta_c=\arg c\approx 2.043269$.
- $r_1\approx 0.6012$ and $r_2\approx-4.0155$ are the roots of $q_b$. They satisfy $r_1+r_2=-(2+\sqrt2)$.

## (a) The generating function and the discriminant

**A1 (proved).** $D$ is the Riordan array $\left(\frac{1}{1-t},\ \frac{t(1+t)}{1-t}\right)$.

Put $C_k=t^k(1+t)^k/(1-t)^{k+1}$. Then $(1-t)C_k=t(1+t)C_{k-1}$. This gives the recurrence

```math
d(n,k)=d(n-1,k)+d(n-1,k-1)+d(n-2,k-1),
```

with the same boundary values as $D$.

**A2 (proved).** The Riordan product rule gives $D^2=\big(g\cdot g(f),\ f\circ f\big)$, where

```math
g\cdot g(f)=\frac{1}{1-2t-t^2},\qquad f\circ f=\frac{t(1+t)(1+t^2)}{(1-t)(1-2t-t^2)}.
```

So

```math
\sum_n G_nt^n=\frac{1-t}{\mathrm{Den}},\qquad \mathrm{Den}=1-(x+3)t-(x-1)t^2-(x-1)t^3-xt^4.
```

**A3 (proved by computer algebra).**

```math
\mathrm{disc}_t(\mathrm{Den})=-16(x^2+6x+1)^2(x^2+8x-2).
```

## Key structure

**S1.** At the two special values of $x$, $\mathrm{Den}$ is a perfect square:

```math
\mathrm{Den}(x^\ast,t)=q^\ast(t)^2,\qquad \mathrm{Den}(b,t)=q_b(t)^2.
```

**S2 (two-squares identity).** In general, $\mathrm{Den}$ is a blend of these two squares:

```math
(b-x^\ast)\ \mathrm{Den}(x,t)=(b-x)\ q^\ast(t)^2+(x-x^\ast)\ q_b(t)^2.
```

So for $x\ne b$, $\mathrm{Den}=0\iff\psi(t)^2=\kappa(x)$.

**S3.** Facts about the quadratics and about $\kappa$:
- $\mathrm{disc}q^\ast<0$, so $q^\ast>0$ on $\mathbb{R}$.
- $\mathrm{disc}q_b>0$.
- $q^\ast q_b=-(t^4+4t^3-1)$.
- $\kappa$ is a decreasing bijection $(-\infty,b)\to(-\infty,1)$. It maps $(a,x^\ast)$ onto $(0,\kappa(a))$, and $[x^\ast,b)$ onto $(-\infty,0]$.
- $\kappa(a)=v_a^2$, where $v_a=(1+2\sqrt2)/7$.

## (b) The angle lemma

**Step 1 (proved).** For $x\in(a,b)$ there are no real roots. For $x\ne x^\ast$, the four roots are distinct.

- On $(x^\ast,b)$: $\mathrm{Den}>0$ on $\mathbb{R}$, by S2.
- On $(a,x^\ast]$: put $v=\sqrt{\kappa}$. Then $\mathrm{Den}\propto(q^\ast-vq_b)(q^\ast+vq_b)$, and on $[0,v_a)$ both discriminants are negative:

```math
\mathrm{disc}(q^\ast\mp vq_b)=(4\sqrt2-2)v^2\pm 12v-(2+4\sqrt2)<0.
```

**Step 2 (proved).** On $(a,x^\ast)$, pair 1 is the pair of roots of $q^\ast-vq_b$, which has coefficients

```math
A_1=\alpha+\beta v,\qquad B_1=\sqrt2(1+v),\qquad C_1=1-v.
```

- The moduli are strictly ordered: $\tau_1<\tau_2$.
- The angle satisfies

```math
\cos^2\theta_1=\frac{(1+v)^2}{2(1-v)(\alpha+\beta v)},
```

  and the log-derivative of the right-hand side is positive.
- So $\theta_1$ is strictly decreasing in $x$.
- Limits:
  - $\theta_1\to\pi$ as $x\to a$, where there is a double root at $t=1-\sqrt2$.
  - $\theta_1\to\theta_c$ as $v\to0$.

**Step 3 (proved).** At $x^\ast$ we have $\mathrm{Den}=q^{\ast2}$.

- The roots $c$ and $\bar c$ are double roots.
- All four roots have modulus $(\sqrt2-1)^{1/2}$, so the modulus ratio is exactly $1$ here.
- ~~The slope of $\theta$ is infinite at $x^\ast$.~~ **Withdrawn.** This was proved only from the left, and the main proof does not need it. The $x^\ast$ neighbourhood is handled by the $\lambda$-window (C7).

**Step 4 (proved).** On $(x^\ast,b)$, put $w=\sqrt{-\kappa}$.

- **4a.** The upper roots lie on

```math
\Gamma=\lbrace \mathrm{Re}(q^\ast(t)\overline{q_b(t)})=0,\ \mathrm{Im}t>0\rbrace .
```

- **4b.** In polar form $t=\tau e^{i\theta}$, writing $\gamma=\cos\theta$, the curve $\Gamma$ becomes

```math
\tau^4+4\gamma\tau^3+4(1-\gamma^2)\tau^2-1=0.
```

  - Each branch $\gamma_\pm$ is monotone, because $h'>1$ (by AM–GM).
  - So $\Gamma$ is a single arc $\tau=T(\theta)$ for $\theta\in(0,\pi)$, with $T(0^+)=r_1$ and $T(\pi^-)=|r_2|$.
- **4c.** On each side of $\theta_c$ there is exactly one root. This follows from the intermediate value theorem together with the fact that there are exactly 2 roots in the upper half-plane.
  - So $X(\theta)$ is injective.
  - Hence $\theta_A(x)$ is strictly decreasing from $\theta_c$ to $0$.
- **4d.** $r_1<|c|$; this reduces to $50>49$.
  - Hence $\tau_A<|c|<\tau_B$.
  - So the smallest pair is unique.

**Step 5 (proved).** Gluing the two sides together, $\theta$ is continuous and strictly decreasing on $(a,b)$, going from $\pi$ to $0$.

**Step 6 (cross-check).** Suppose two non-real pairs have equal modulus and $x<0$. Then $(x+1)(x^2+6x+1)=0$, so in $(a,b)$ the only possibility is $x=x^\ast$.

## Referee checklist (from the author)

1. The Riordan identification and the product rule (A1–A2).
2. The discriminant (A3).
3. The identity S2, and its equivalence with $\psi^2=\kappa$.
4. The discriminant signs of $q^\ast\mp vq_b$ on $[0,v_a)$, and $v_a^2=\kappa(a)$.
5. The log-derivative inequality in Step 2.
6. The polar reduction of $\Gamma$, the branches $\gamma_\pm$, and $h'>1$ (4b).
7. The endpoints: $\gamma_+=1\iff\tau=r_1$ (using $\tau\le2$), and $\gamma_-=-1\iff\tau=|r_2|$.
8. The intermediate value counting in 4c.
9. $r_1<|c|$, i.e. $50>49$. This is the tightest step.
10. The treatment of $x^\ast$ as the point where the two pairs coincide.

*Notation change from the original: the referee asked us to rename $\cos\theta$, so it is $\gamma$ here (it was $c$).*
