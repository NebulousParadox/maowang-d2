# Real-rootedness of the row polynomials of $D^2$ (Delannoy squared)

**Status.** This is a computer-assisted proof of the $D^2$ half of Conjecture 4.1 in Mao–Wang, *The Narayana transformation*, arXiv:2607.01572. No novelty is claimed; this note is written for verification. Each step is labelled **PROVED** (by hand, or by an exact symbolic check), **PROVED (exact)** (rational arithmetic, no rounding) or **PROVED (CA)** (a computer-assisted interval or ball-arithmetic certificate, described in §4).

---

## 0. Setup and notation

- $D$ is the Delannoy triangle: $D(n,0)=D(n,n)=1$ and $D(n,k)=D(n-1,k-1)+D(n-1,k)+D(n-2,k-1)$. As a Riordan array, $D=\big(\tfrac{1}{1-t},\tfrac{t(1+t)}{1-t}\big)$.
- $G_n(x)=\sum_k (D^2)(n,k)\ x^k$, the row polynomials of $D^2$.
- $\displaystyle\sum_{n\ge0}G_n(x)t^n=\frac{1-t}{\mathrm{Den}(x,t)}$, where $\mathrm{Den}(x,t)=1-(x+3)t-(x-1)t^2-(x-1)t^3-xt^4$.
- Constants: $a=-4-3\sqrt2$, $b=-3+2\sqrt2$, $x^\ast=-3-2\sqrt2$ (note $x^\ast b=1$), $\alpha=1+\sqrt2$, $v_a=(1+2\sqrt2)/7$.
- Quadratics: $q_\ast(t)=\alpha t^2+\sqrt2\ t+1$ and $q_b(t)=(1-\sqrt2)t^2-\sqrt2\ t+1$.
- $\zeta=\dfrac{-\sqrt2+i\sqrt{2+4\sqrt2}}{2+2\sqrt2}$ is the root of $q_\ast$ with $\mathrm{Im}\zeta>0$. Then $\lvert\zeta\rvert^2=\sqrt2-1$ and $\theta_\zeta:=\arg\zeta=\arccos\big(-1/\sqrt{2+2\sqrt2}\big)\approx2.043269$.
- $r_1\approx0.601232>0>r_2\approx-4.01545$ are the roots of $q_b$, with $r_1+r_2=-(2+\sqrt2)$ and $r_1r_2=-(1+\sqrt2)$.
- $\psi=q_\ast/q_b$, $\kappa(x)=\dfrac{x-x^\ast}{x-b}$, $\tau_0=\big((\sqrt6-2)/2\big)^{1/2}\approx0.474073$, $\theta_0=\arccos(\tau_0/2)\approx1.3315$.
- The letter $c$ always means $\cos\theta$. The root of $q_\ast$ is always $\zeta$.

---

## 1. Lemma A (the angle lemma)

**Lemma A.**

**(a) PROVED.** We have

```math
\mathrm{disc}_t\mathrm{Den}=-16(x^2+6x+1)^2(x^2+8x-2),\qquad (b-x^\ast)\ \mathrm{Den}(x,t)=(b-x)\ q_\ast(t)^2+(x-x^\ast)\ q_b(t)^2 .
```

In particular $\mathrm{Den}(x^\ast,\cdot)=q_\ast^2$ and $\mathrm{Den}(b,\cdot)=q_b^2$. For $x\neq b$, $\mathrm{Den}=K(x)\ \big(q_\ast^2-\kappa(x)\ q_b^2\big)$ with $K(x)=\dfrac{b-x}{4\sqrt2}>0$ on $(a,b)$.

**(b) PROVED.** For $x\in(a,b)$, $\mathrm{Den}(x,\cdot)$ has no real zeros.
- If $x\ne x^\ast$, the zeros are four distinct numbers $t_1,\bar t_1,t_2,\bar t_2$ with $\mathrm{Im}t_j>0$ and $\lvert t_1\rvert<\lvert t_2\rvert$ strictly.
- At $x=x^\ast$ the zeros are $\zeta,\bar\zeta$, each a double zero, all of modulus $(\sqrt2-1)^{1/2}$.
- **Convention (F3).** On $(a,b)\setminus\lbrace x^\ast\rbrace$ there is a strict modulus gap. At $x^\ast$, counted without multiplicity, $\lbrace \zeta,\bar\zeta\rbrace$ is the unique smallest pair, and we put $t_1=t_2=\zeta$ there. Every later step allows this double root.

**(c) PROVED.** $\theta(x):=\arg t_1\in(0,\pi)$ is continuous and strictly decreasing on $(a,b)$, with $\theta\to\pi$ as $x\to a^+$, $\theta\to0$ as $x\to b^-$, and $\theta(x^\ast)=\theta_\zeta$.

**(d) PROVED. Geometry.** Write $t_1=\tau e^{i\theta}$ and $c=\cos\theta$.
- **Circle side.** For $\theta\in[\theta_\zeta,\pi)$, i.e. $x\in(a,x^\ast]$, $t_1$ lies on the circle $\lvert t-1\rvert=\sqrt2$, with $\tau=c+\sqrt{1+c^2}$.
  - **(M1)** On this side, $\psi(t_1)=\sqrt{\kappa(x)}\in[0,v_a)$ is real and strictly increasing in $\theta$.
- **$\Gamma$ side.** For $\theta\in(0,\theta_\zeta]$, i.e. $x\in[x^\ast,b)$, $t_1$ lies on the curve $\Gamma:\ \tau^4+4c\tau^3+4(1-c^2)\tau^2-1=0$.
  - For each $\theta\in(0,\pi)$ this equation has exactly one positive root $\tau$.
  - $\Gamma\cap\mathbb{H}$ is the union of two branches $\cos\theta=c_\pm(\tau)=\dfrac{\tau^2\pm\sqrt{2\tau^4+4\tau^2-1}}{2\tau}$.
  - $c_+$ is strictly increasing on $[\tau_0,r_1)$, which covers $\theta\in(0,\theta_0]$. $c_-$ is strictly decreasing on $[\tau_0,\lvert r_2\rvert)$, which covers $\theta\in[\theta_0,\pi)$.
  - The smallest-root part of the $-$ branch is $\tau\in[\tau_0,\lvert\zeta\rvert]$.
  - **(M2)** On the $-$ branch, $\lvert\psi(t_1)\rvert=\sqrt{-\kappa(x)}$ is strictly decreasing in $\tau$.
- **(F1)** Along $\Gamma$, $X(\theta):=\kappa^{-1}\big(\psi(t_1)^2\big)\to b^-$ as $\theta\to0^+$ and as $\theta\to\pi^-$.

**(e) PROVED.** For $x\in(a,b)$, $t_1$ is a zero of $q_\ast-\lambda q_b$ and $t_2$ a zero of $q_\ast+\lambda q_b$, where $\lambda:=\psi(t_1)$ and $\lambda^2=\kappa(x)$. Here $\lambda=v>0$ on the left of $x^\ast$. For the right ray, the labelling $\lambda\in i(0,\lambda_0]$ near $x^\ast$ is certified in C7.

**Proof.**

**A1.** Generating function and discriminant. Use the Riordan product $(g,f)(h,l)=(g\ h(f),\ l(f))$. With $1-f=\frac{1-2t-t^2}{1-t}$ and $1+f=\frac{1+t^2}{1-t}$:

```math
D^2=\Big(\tfrac1{1-2t-t^2},\ \tfrac{t(1+t)(1+t^2)}{(1-t)(1-2t-t^2)}\Big),
```

and the row generating function $g/(1-xf)$ simplifies to $(1-t)/\mathrm{Den}$. The discriminant and the interpolation identity are checked symbolically (`stageC_exact.py`, and the earlier Stage A/B scripts). The identity holds because both sides are linear in $x$ and agree at $x^\ast$ (where $\mathrm{Den}=q_\ast^2$) and at $b$ (where $\mathrm{Den}=q_b^2$).

**A2.** No real zeros; the left side $x\in(a,x^\ast]$.
- Put $v=\sqrt{\kappa}\in[0,v_a)$. Then $\mathrm{Den}\propto(q_\ast-vq_b)(q_\ast+vq_b)$.
- The two quadratics have discriminants $(4\sqrt2-2)v^2\pm12v-(2+4\sqrt2)$. Both are negative on $[0,v_a)$; the root of the $+12v$ one is exactly $v_a$.
- On $(x^\ast,b)$: both weights in (a) are positive and $q_\ast^2>0$ on $\mathbb{R}$, so $\mathrm{Den}>0$ on $\mathbb{R}$.
- Distinctness for $x\ne x^\ast$ follows from the discriminant in (a).
- On the left side, with $\beta=\sqrt2-1$:
  - pair 1 (the roots of $q_\ast-vq_b$) has $\tau_1^2=\frac{1-v}{\alpha+\beta v}$;
  - pair 2 has $\tau_2^2=\frac{1+v}{\alpha-\beta v}$, which is strictly larger for $v>0$;
  - $\cos^2\theta_1=\frac{(1+v)^2}{2(1-v)(\alpha+\beta v)}$ is strictly increasing in $v$. Its log-derivative is $\frac2{1+v}+\frac1{1-v}-\frac\beta{\alpha+\beta v}>1-(3-2\sqrt2)>0$.
- Since $v$ is strictly decreasing in $x$, $\theta_1$ is strictly decreasing in $x$, and $\theta_1\to\pi$ as $v\to v_a$ (the double root at $1-\sqrt2$).
- The roots lie on $\lvert t-1\rvert=\sqrt2$ because $q_\ast(t)q_b(u)-q_\ast(u)q_b(t)=2\sqrt2(t-u)(s-p+1)$, with $s=t+u$ and $p=tu$.
- (M1) holds because $v=\sqrt\kappa$ is strictly decreasing in $x$ and $\theta$ is strictly decreasing in $x$.

**A3.** The point $x=x^\ast$. $\mathrm{Den}=q_\ast^2$, so the zeros are $\zeta,\bar\zeta$, each double. All four have modulus $(\sqrt2-1)^{1/2}$, so the gap is $0$ exactly here (F3).

**A4.** The right side $x\in(x^\ast,b)$.
- Put $w=\sqrt{-\kappa}$. Then $\mathrm{Den}\propto q_\ast^2+w^2q_b^2$, so $q_\ast(t)=\pm iw\ q_b(t)$ at a zero, i.e. $\mathrm{Re}\big(q_\ast(t)\overline{q_b(t)}\big)=0$.
- The symmetric part of $q_\ast(t)q_b(u)$ equals $-2(p^2+2ps-s^2+4p-1)$. In polar form this is the curve $\Gamma$.
- Solving for $c$ gives $c_\pm(\tau)$. Write $h(\tau)=\sqrt{2\tau^2+4-\tau^{-2}}$.
  - $c_+=(\tau+h)/2$ is strictly increasing.
  - $c_-=(\tau-h)/2$ is strictly decreasing, because $h'>1$: indeed $(2\tau+\tau^{-3})^2-h^2=2\tau^2+5\tau^{-2}+\tau^{-6}-4\ge2\sqrt{10}-4>0$.
- Endpoints: $c_+=1\iff\tau^4+4\tau^3-1=-q_\ast(\tau)q_b(\tau)=0\iff\tau=r_1$, and $c_-=-1\iff\tau=\lvert r_2\rvert$.
- Hence $\Gamma\cap\mathbb{H}$ is one arc $\tau=T(\theta)$, $\theta\in(0,\pi)$: strictly decreasing on $(0,\theta_0]$, strictly increasing on $[\theta_0,\pi)$, with $T(0^+)=r_1$ and $T(\pi^-)=\lvert r_2\rvert$.
- **(F1)** As $\theta\to0^+$ (respectively $\pi^-$), $T(\theta)e^{i\theta}\to r_1$ (respectively $r_2$), and these are zeros of $q_b$. Since $q_\ast$ has no real zeros, $\lvert\psi\rvert\to\infty$. On $\Gamma$, $\psi^2\le0$, so $\psi^2\to-\infty$ and $X=\kappa^{-1}(\psi^2)\to b^-$, because $\kappa$ is a decreasing bijection from $(-\infty,b)$ onto $(-\infty,1)$.
- **Counting.** $X$ is continuous, equals $x^\ast$ only at $\theta_\zeta$, and tends to $b$ at both ends. Each $x\in(x^\ast,b)$ has exactly two zeros in $\mathbb{H}$. By the intermediate value theorem, exactly one of them is in $(0,\theta_\zeta)$ and exactly one in $(\theta_\zeta,\pi)$. So $X$ is strictly monotone on each side, and $\theta_A(x)$ (the angle of the root in $(0,\theta_\zeta)$) is strictly decreasing.
- **Moduli.** $r_1<\lvert\zeta\rvert$, because that is equivalent to $5\sqrt2>7$. Hence $T<\lvert\zeta\rvert$ on $(0,\theta_\zeta)$ and $T>\lvert\zeta\rvert$ on $(\theta_\zeta,\pi)$, so the root at $\theta_A$ is $t_1$.
- **(M2)** Along the $-$ branch, as $\tau$ increases, $\theta$ increases (because $c_-$ decreases), so $x$ decreases towards $x^\ast$, and $w$, which is increasing in $x$, decreases.

**A5.** Gluing. On $(a,x^\ast)$, $\theta\in(\theta_\zeta,\pi)$. At $x^\ast$, $\theta=\theta_\zeta$. On $(x^\ast,b)$, $\theta\in(0,\theta_\zeta)$. Each piece is strictly decreasing and $\theta$ is continuous at $x^\ast$, which gives (c).

**A6.** Equal-modulus cross-check. Suppose $x<0$ and the two pairs have equal modulus. Then $\tau^4=-1/x$ and $e_3=\tau^2e_1$, which forces $x(x+3)^2+(x-1)^2=(x+1)(x^2+6x+1)=0$. The values $x=-1$ and $x=b$ would need $\tau^2<0$, so only $x^\ast$ remains. $\square$

---

## 2. Main results

**Theorem B (PROVED (CA) + exact).** For every $n\ge1$, $G_n$ has only real zeros, and all of them are negative. For $n\ge10$, at least $n-1$ of them lie in $(a,b)$.

**Proposition C (PROVED (CA)).** Let $n\ge10$, $N=n+2$, $\theta_k=k\pi/N$ and $x_k=\theta^{-1}(\theta_k)$ for $k=1,\dots,n+1$. Then

```math
\mathrm{sign}G_n(x_k)=\begin{cases}(-1)^{k+1}, & \theta_k>\pi/4,\\ (-1)^{k}, & \theta_k<\pi/4,\end{cases}
```

for every $k$ except possibly one with $\lvert\theta_k-\pi/4\rvert\le15.1\cdot3.652^{-N}$. Such a $k$ exists only when $4\mid N$, and then $\theta_k=\pi/4$, $x_k=-1$ and $G_n(-1)=0$.

**Remark D (the naive claim is false).** "The sign of $G_n(x_k)$ alternates in $k$" fails for every $n\ge4$, at the two sample points either side of $\pi/4$, or at $x=-1$ itself (C2).

---

## 3. Proof

### C1. Sample-point identity (PROVED)

For $x\in(a,b)$ with $x\ne x^\ast$, the residue of $(1-t)/(\mathrm{Den}\ t^{n+1})$ at $0$ is $G_n$. The residue at $\infty$ vanishes, because the integrand is $O(t^{-n-4})$. Summing residues over the four simple zeros gives

```math
G_n(x)=-2\mathrm{Re}\big(u_1t_1^{-N}+u_2t_2^{-N}\big),\qquad u_j=\frac{(1-t_j)t_j}{\partial_t\mathrm{Den}(x,t_j)},\qquad N=n+2 .
```

At $x_k$ we have $t_1^{-N}=(-1)^k\rho_1^{-N}$, where $\rho_j=\lvert t_j\rvert$. Hence

```math
G_n(x_k)=(-1)^{k+1}\rho_1^{-N}\ \big[m(x_k)+E\big],\qquad m:=2\mathrm{Re}u_1,\qquad \lvert E\rvert=\rho_1^{N}\ \lvert 2\mathrm{Re}(u_2t_2^{-N})\rvert .
```

### C2. The sign change at $x=-1$; the naive claim fails

- **PROVED (sympy).** $t_1(-1)=\rho e^{i\pi/4}$ with $\rho=(\sqrt6-\sqrt2)/2$, so $\theta(-1)=\pi/4$ exactly, and $m(-1)=0$. The other pair at $x=-1$ is $\rho'e^{\pm3i\pi/4}$ with $\rho'=(\sqrt6+\sqrt2)/2>\rho$.
- **PROVED.** $G_n(-1)=0$ for every $n\equiv2\pmod 4$.
  - Put $g_n=G_n(-1)$. It satisfies $g_{n+4}=2g_{n+3}-2g_{n+2}-2g_{n+1}-g_n$, whose characteristic polynomial is $\chi(y)=y^4-2y^3+2y^2+2y+1$.
  - We have $\chi(y)\ \chi(-y)=y^8+14y^4+1$. So $g$ is annihilated by $\chi(-E)\chi(E)=E^8+14E^4+1$, i.e. $g_{n+8}=-14\ g_{n+4}-g_n$ for all $n$.
  - Since $g_2=0$ and $g_6=0$ (the values $g_0,\dots,g_6$ are $1,1,0,-4,-11,-15,0$), induction gives $g_{4k+2}=0$.
  - Equivalent generating-function form: $F(t)+F(-t)-F(it)-F(-it)=0$ with $F=(1-t)/\mathrm{Den}(-1,t)$. Both forms are checked in `stageC_exact.py`; the values for $n\le2000$ confirm it.
- **PROVED (exact, rational arithmetic; `stageC_n45_exact.py`).**
  - $n=4$: the signs for $k=1,\dots,5$ are $-,-,+,-,+$.
  - $n=5$: the signs for $k=1,\dots,6$ are $-,-,+,-,+,-$.
  - Both repeat at $k=1,2$, where $\theta=\pi/N,2\pi/N$ straddle $\pi/4$.
  - Method: $\cos(k\pi/N)$ is bracketed from its minimal polynomial, $\tau$ by exact bisection, then $x_k$ and $G_n(x_k)$ by rational interval arithmetic. (For $n=4$, $k=3$, this reproduces $x_3=-2-\sqrt5$.)
- **PROVED (CA).** Interval certification also gives the repeat at $k=10,11$ for $n=40$. That run is an illustration only; for $N\ge12$, Proposition C already implies the repeat.

### C3. Counting and parity (PROVED, given C4–C7)

- Suppose $4\nmid N$. Then every sample value is nonzero with the sign in Proposition C. Consecutive pairs change sign except the single pair straddling $\pi/4$. That gives $n-1$ sign changes, hence $n-1$ distinct zeros in $(x_{n+1},x_1)\subset(a,b)$.
- Suppose $4\mid N$. Then $x_{k_0}=-1$ with $k_0=N/4$ is a zero. The other $n-2$ consecutive pairs, none of which straddles $\pi/4$, all change sign. Again that gives at least $n-1$ distinct zeros.
- $G_n$ has degree $n$, leading coefficient $1$ and real coefficients, so its non-real zeros come in conjugate pairs. With at least $n-1$ real zeros, all $n$ zeros are real.
- $(D^2)(n,k)\ge D(n,k)D(k,k)\ge1$, so all coefficients are positive and $G_n>0$ on $[0,\infty)$. Hence every zero is negative.

### C4. Regularised $m$; bounds for the second pair (PROVED)

Write $\partial_t\mathrm{Den}(t_1)=-x\ (t_1-\bar t_1)\ Q_B(t_1)$, where $Q_B(t)=(t-t_2)(t-\bar t_2)=t^2-s_Bt+p_B$. By Vieta, $s_A+s_B=(1-x)/x$ and $p_Ap_B=-1/x$, where $Q_A(t)=(t-t_1)(t-\bar t_1)=t^2-s_At+p_A$, $s_A=2\tau c$ and $p_A=\tau^2$.

**Regularised $m$ (segment mean-value form).** Put $h(t)=\dfrac{(1-t)t}{-x\ Q_B(t)}$, which has real coefficients. Then

```math
m=2\mathrm{Re}u_1=\frac{h(t_1)-h(\bar t_1)}{t_1-\bar t_1}=\int_0^1 h'\big(\bar t_1+s(t_1-\bar t_1)\big)\ ds\ \in\ \mathrm{Re}\ \mathrm{conv}\ h'\big([\bar t_1,t_1]\big).
```

The right-hand side stays finite as $\mathrm{Im}t_1\to0$. At $\theta=0$, $t_1=r_1$; at $\theta=\pi$, $t_1=1-\sqrt2$. In both cases $Q_B(t_1)\ne0$, and $m=h'(t_1)$. So **the certified boxes run all the way to $\theta=0$ and to $\theta=\pi$**, and the endpoint balls contain $r_1$ and $\pi$.

**Second pair.** Put $h_2(t)=\dfrac{(1-t)t}{-x\ Q_A(t)}$ and $H=h_2\ t^{-N}$. Then

```math
2\mathrm{Re}(u_2t_2^{-N})=\frac{H(t_2)-H(\bar t_2)}{t_2-\bar t_2},
```

and $\lvert E\rvert\le q^{-N}\min\lbrace e,\ \tfrac\pi2(S_1+NS_0/\rho_2)\rbrace$, where $q=\rho_2/\rho_1$ and:
- (i) $e=2\lvert u_2\rvert=\lvert h_2(t_2)\rvert/\mathrm{Im}t_2$;
- (ii) the arc bound. $H$ is single-valued, so $\int H'$ is path-independent. Take the path along $\lvert z\rvert=\rho_2$ from $\bar t_2$ to $t_2$ through $-\rho_2$. Then $\lvert\cdot\rvert\le\frac{\pi-\theta_2}{\sin\theta_2}\max\lvert H'\rvert$, and $\frac{\pi-\theta_2}{\sin\theta_2}\le\frac\pi2$ for $\theta_2\ge\pi/2$. Here $S_0=\max_{\rm arc}\lvert h_2\rvert$ and $S_1=\max_{\rm arc}\lvert h_2'\rvert$. This bound needs no $1/\mathrm{Im}t_2$, so it works at $\theta=0$, where pair 2 is the double root $r_2$.

**Sufficient condition at a point.** $\lvert m\rvert\ q^N>\min\lbrace e,\ \tfrac\pi2(S_1+NS_0/\rho_2)\rbrace$.
- With $e$, the left side increases in $N$ while the right side is fixed, so the inequality at $N_0$ implies it for all $N\ge N_0$.
- With the arc bound, it also suffices that $\lvert m\rvert q^{N_0}(q-1)\ge\frac\pi2S_0/\rho_2$, which is checked.

### C5. The coverage chain (PROVED (CA))

The angle interval $(0,\pi)$, i.e. $x\in(a,b)$, is covered by five regions. Here $\lambda_0=0.05$, $\tau_w=(\sqrt6-\sqrt2)/2$ and $W_1=[\tau_w-0.004,\ \tau_w+0.004]$.

1. **$\Gamma^+$**: $\tau\in[\tau_0,r_1]\setminus W_1$. This is $\theta\in[0,\theta_0]$ minus a neighbourhood of $\pi/4$. It is valid because $c_+$ is monotone and the positive root is unique (Lemma A(d)).
2. **$W_1$** (the $-1$ window, C6).
3. **$\Gamma^-$**: $\tau\in[\tau_0,\tau_E]$ with $\tau_E=0.621171550$. The boundary certificate gives $\lvert\psi(t_1(\tau_E))\rvert<\lambda_0$ and $\tau_E<\lvert\zeta\rvert$. By (M2), $\tau_E\ge\tau_R$, where $\lvert\psi\rvert=\lambda_0$ at $\tau_R$, so $\Gamma^-$ reaches into the $\lambda$-window.
4. **$\lambda$-window**: $\lvert\kappa(x)\rvert\le\lambda_0^2$, parametrised by $\lambda=\psi(t_1)$ along the left ray $[0,\lambda_0]$ and the right ray $i[0,\lambda_0]$ (C7).
5. **Circle**: $\theta\in[\theta_S,\pi]$ with $\theta_S=2.080786230$. The boundary certificate gives $\psi(t_1(\theta_S))<\lambda_0$. By (M1), $\theta_S\le\theta_L$, where $\psi=\lambda_0$ at $\theta_L$, so the circle region also reaches into the $\lambda$-window.

The enclosures for $c=\cos\theta$ on a $\tau$-box use the monotonicity of $c_\pm$, so they are evaluated at the box endpoints. On every box of regions 1, 3 and 5 the condition of C4 holds at $N_0=12$, and $\mathrm{sign}m$ is certified to be $+1$ for $\theta>\pi/4$ and $-1$ for $\theta<\pi/4$.

**Right-ray labelling.** In C7 the certificate checks $\cos\varphi>0$ on every segment, where $\varphi=\arg\ell(\lambda)$. This means $\mathrm{Re}\ell(\lambda)>0$, i.e. $\lvert t(\lambda)\rvert<\lvert t(-\lambda)\rvert$. Together with $\mathrm{Im}t(\pm\lambda)>0$ (also checked), it gives $t(\lambda)=t_1$ and $t(-\lambda)=t_2$ for $\lambda\in i(0,\lambda_0]$, and likewise for $\lambda\in(0,\lambda_0]$ on the left.

### C6. The $-1$ window (PROVED (CA))

On $W_1$, on the $+$ branch, forward-mode automatic differentiation over Arb balls gives (rounded in the safe direction):
- $m'(\tau)\le-0.828$, so $m$ is strictly monotone and has a single sign change at $\tau_w$, i.e. at $\theta=\pi/4$;
- $\lvert d\theta/d\tau\rvert\le7.42$;
- $e\le0.829$;
- $q\ge3.652$.

So the failure set $\lbrace \theta:\lvert m\rvert\le e\ q^{-N}\rbrace$ is an interval around $\pi/4$ of length at most $2\cdot0.829\cdot7.42/0.828\cdot3.652^{-N}\le15.1\cdot3.652^{-N}$. For $N\ge12$ this is less than $\pi/(2N)$, because $N\ 3.652^{-N}$ is decreasing once $N\ge1/\ln3.652$, and at $N=12$ we have $N\cdot15.1\cdot3.652^{-N}\approx3.2\times10^{-5}<\pi/2$. The failure set is centred at $\pi/4$, so it lies within $\pi/(4N)$ of $\pi/4$. If $4\nmid N$, every sample point satisfies $\lvert k\pi/N-\pi/4\rvert\ge\pi/(4N)$, so none lies in the failure set. If $4\mid N$, the only sample point within $\pi/N$ of $\pi/4$ is $\pi/4$ itself. This proves the exceptional clause of Proposition C. (A round-2 external referee pointed out that the length bound $<\pi/N$ alone gives only "at most one sample point". The threshold is now $\pi/(2N)$, both here and in the code.)

### C7. The $x^\ast$ window (PROVED (CA))

- Let $t(\lambda)$ be the root of $q_\ast-\lambda q_b$ near $\zeta$. The certificate checks $\mathrm{Re}(-\mathrm{disc})>0$, so the principal square root formula applies.
- At $t=t(\lambda)$, $\partial_t\mathrm{Den}=2K\lambda\ q_b(t)\big(q_\ast'(t)-\lambda q_b'(t)\big)$, so $u(t(\pm\lambda))=\pm U(\pm\lambda)/(2K\lambda)$ with

```math
U(\lambda)=\frac{(1-t)t}{q_b(t)\ (q_\ast'(t)-\lambda q_b'(t))}\Big|_{t=t(\lambda)} .
```

- Writing $\ell(\lambda)=\log\big(t(-\lambda)/t(\lambda)\big)$, for $\lambda\neq0$:

```math
G_n(x_k)=(-1)^{k+1}\frac{\rho_1^{-N}}{K}\ \Psi_N(\lambda),\qquad \Psi_N(\lambda)=\mathrm{Re}\frac{U(\lambda)-U(-\lambda)e^{-N\ell(\lambda)}}{\lambda}.
```

- **$x^\ast$ itself is covered by removable singularity and continuity.** The numerator of $\Psi_N$ is analytic and vanishes at $\lambda=0$, so $\Psi_N$ extends analytically to $\lambda=0$, and $G_n$ is continuous in $x$.
- Split $\Psi_N$ as

```math
\Psi_N=\mathrm{Re}\frac{U(\lambda)-U(-\lambda)}{\lambda}+N\mathrm{Re}\big[A(\lambda)\ E_2(W)\big],
```

where $A=U(-\lambda)\ \ell(\lambda)/\lambda$, $W=N\ell(\lambda)$ and $E_2(z)=(1-e^{-z})/z$. Then:
  - $\big\lvert\mathrm{Re}\frac{U(\lambda)-U(-\lambda)}{\lambda}\big\rvert\le D_2:=2\max_{[-\lambda_0,\lambda_0]\cdot\mathrm{dir}}\lvert U'\rvert$;
  - $\ell(\lambda)/\lambda=-\int_{-1}^1 g(s\lambda)\ ds\in-2\ \mathrm{conv}g([-\lambda,\lambda])$, where $g=t'/t$.
- **Case $\lvert W\rvert\le2$.** $\Psi_N\ge N\beta-D_2$. Here $E_2$ is enclosed by its Taylor polynomial $1-W/2+W^2/6$ plus a remainder of at most $\lvert W\rvert^3e^{\lvert W\rvert}/24$ when $\lvert W\rvert\le\tfrac14$, and directly otherwise.
- **Case $\lvert W\rvert\ge2$.** $\Psi_N\ge\frac{\lvert U(-\lambda)\rvert}{\lvert\lambda\rvert}\big(\cos\chi-e^{-2\cos\varphi}\big)-D_2>0$, where $\chi=\arg(U(-\lambda)/\lambda)$ (named $\chi$ to avoid a clash with $\psi=q_\ast/q_b$).

Certified constants at $\lambda_0=0.05$ (from the rigorous Arb run, rounded in the safe direction):
- left ray: $D_2\le0.367$, $\beta\ge0.080$, case-2 slack $\ge1.89$;
- right ray: $D_2\le0.327$, $\beta\ge0.053$, case-2 slack $\ge0.46$.

So $\Psi_N>0$ for all $N>6.2$ (the run prints $N>6.13$). That is the sign $(-1)^{k+1}$, consistent with $m>0$ on $(a,-1)$.

*(Explanatory, NUMERICAL.)* The limiting model is $\mathrm{Re}[A_0E_2(z)]$ with $A_0=(1-\zeta)/(2\alpha^2(\mathrm{Im}\zeta)^2)\approx0.3377-0.1497i$. It is positive along both rays.

### C8. Small $n$ (PROVED (exact))

For $1\le n\le11$, $G_n$ has $n$ real zeros: `sympy` `count_roots` (exact Sturm), and independently exact sign changes on a rational grid. Its coefficients are positive. Together with C3–C7, which cover $n\ge10$, this proves Theorem B for every $n\ge1$. $\square$

---

## 4. The certificate

| File | What it does | Rounding model |
|---|---|---|
| `stageC_cert_rigorous.py` | The full certificate (C5–C7) in python-flint arb/acb balls. Every operation is a ball, including `exp`, `cos`, `sin`, `sqrt`, `log` and `pow`, and so is every final comparison. Run: `pip install python-flint`, then `python stageC_cert_rigorous.py 12 0.05 [prec_bits]`. | **Fully rigorous.** Undecidable comparisons count as failures. Ball endpoints (`union`, `lower`, `upper`) are never assumed exact: flint rounds them outward. Every use is a containing bound or a superset hull, and maxima/minima over many balls are taken as `union(...).upper()/.lower()`. |
| `stageC_cert.py`, `cert.mjs` + `run_cert.mjs` | The same certificate with float intervals. | `+ - * / sqrt` are correctly rounded and widened 1 ulp. **Assumes** libm `exp`, `cos`, `sin` are accurate to within 4 ulp, and that `pow`/`Math.pow` and `exp` in the final comparisons are accurate to within the $10^{-12}$ relative slack. |
| `stageC_exact.py` | sympy: the factorisation; $\partial_t\mathrm{Den}$ at the roots; $\theta(-1)=\pi/4$ and $m(-1)=0$; $G_n(-1)=0$ for $n\equiv2\pmod4$; $x=-2-\sqrt5$ at $\theta=\pi/2$; $n\le11$. | Exact. |
| `stageC_n45_exact.py` (`exact_n45.mjs`) | The C2 repeats for $n=4,5$. | Exact rational intervals. |

Expected summary of the rigorous run ([`CERT_OUTPUT_2026-11-27.txt`](stageC/CERT_OUTPUT_2026-11-27.txt), $N_0=12$, $\lambda_0=0.05$): both boundary checks `true`; the four regions `fails=0` with signs $[1],[1],[1],[-1]$; the $-1$ window `N*len(N0)=3.2e-5 < pi/2`; the $\lambda$-window needs $N>6.13$; `CERTIFICATE PASSED for all N >= 12 (n >= 10)`. The earlier float versions (Node and Python) print the same verdict, with slightly different constants.

---

## 5. Referee checklist

1. Lemma A, steps A2–A5 and F1, including the facts (M1) and (M2) that the boundary certificates rely on.
2. C1: the residue argument (residue at $\infty$ is $0$) and the convention $t_1^{-N}=(-1)^k\rho_1^{-N}$.
3. C3: the counting in both cases, $4\nmid N$ and $4\mid N$, and the parity step.
4. C4: the segment mean-value form of $m$, so that the boxes reach $\theta=0$ and $\theta=\pi$; the arc bound, including path independence and $(\pi-\theta_2)/\sin\theta_2\le\pi/2$.
5. C5: the coverage chain $\Gamma^+\cup W_1\cup\Gamma^-\cup(\lambda\text{-window})\cup\text{circle}=(0,\pi)$, using the boundary certificates at $\theta_S$ and $\tau_E$ with (M1) and (M2).
6. C5/C7: the $\lambda$ labelling via $\cos\varphi>0$ (so $\mathrm{Re}\ell>0$) and $\mathrm{Im}t(\pm\lambda)>0$.
7. C6: that $m$ is monotone on $W_1$, and that a set centred at $\pi/4$ and shorter than $\pi/(2N)$ contains no grid point unless $4\mid N$, and then only $\pi/4$.
8. C7: the derivation of $\Psi_N$, the removable singularity at $x^\ast$, and both cases $\lvert W\rvert\lessgtr2$.
9. C2: the exact $n=4,5$ repeats, and the identity for $G_n(-1)$.
10. §4: that `stageC_cert_rigorous.py` passes, so the libm assumption (including `pow`) of the float versions is no longer needed.
