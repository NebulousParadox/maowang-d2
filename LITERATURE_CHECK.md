# Literature and priority check

- **Date:** 27 Nov 2026
- **Question:** has anyone else proved the $D^2$ half of Mao–Wang Conjecture 4.1?

## Sources searched

- The arXiv listing of 2607.01572.
- Citation databases: Google Scholar says "cited by 3"; Semantic Scholar was queried through its API.
- Web search for the paper ID, its title and its topic.
- SymCat's open-problems page (live, updated 26 Nov 2026).
- GitHub.

## Findings

| Source | What it says |
|---|---|
| SymCat open problems (updated 26 Nov 2026) | Lists Mao–Wang 4.1 as **Open** |
| Zeng, arXiv 2610.28691 and 2610.19548 | Cite Mao–Wang, but concern other Narayana results. Neither proves $D^2$ or $A^2$. |
| Defant, arXiv 2611.13479 (10 Nov 2026) | Related Narayana-transform results. Does not address $D^2$ or $A^2$. |
| the-omega-institute/trureturing issue #6135 (Sep 2026) | Exact real-root certificate for $A^2$ at **row 31 only**. Does not address $D^2$. |
| **Cinna Davis, 1337isnot1337/solved-conjectures issue #156 (21 Nov 2026)** | **"Mao–Wang: algebra agent's complete D²-clause argument passes independent review. A² remains open."** Also: "the proved D² half of Mao–Wang's joint conjecture remain[s] explicitly uncounted." |

## Conclusion

- **We are not first.**
  - Davis's proof file is dated **20 Nov 2026**, and her pipeline reported it as internally reviewed on 21 Nov.
  - Our work started on 25 Nov 2026.
- Her argument is public on her `research` branch, but it is **not formally published**:
  - It is not in her results list.
  - SymCat still lists the conjecture as open.
  - Her issue calls it "uncounted", because the joint conjecture also needs $A^2$.
- **Our proof was found independently**, without knowledge of hers, and by a different method (compared below). That has some value as independent confirmation. It is not a priority claim.


## Method comparison (Davis's `research/mao-wang/delannoy-proof.md`, dated 20 Nov 2026)

| | Davis | Ours |
|---|---|---|
| Core object | The **ordinary** Delannoy rows $d_n$, which are Chebyshev in disguise, through the divided difference $g_n=\dfrac{\alpha d_n(\alpha)-\beta d_n(\beta)}{\alpha-\beta}$ | The generating function $(1-t)/\mathrm{Den}$ of the **squared** rows, which has 4 roots |
| Interval $(x^\ast,b)$ | Argument principle on the circle $\alpha=-1+\sqrt2e^{i\phi}$, giving $n-k$ roots | Angle lemma plus partial-fraction sign samples |
| Interval $(-\infty,x^\ast)$ | Explicit amplitude inequality (18), giving $k-1$ roots | The same sign-sample method, plus the $\lambda$-window at the collision point $x^\ast$ |
| Computer needed? | **No.** Fully analytic, about 300 lines. | **Yes.** Arb certificate for $n\ge10$, exact checks for $n\le91$. |
| Shared ingredients | The split point $x^\ast=-3-2\sqrt2$, the endpoint $b=-3+2\sqrt2$, the "$n-1$ roots plus parity" finish, and positivity of the coefficients | Same |

Notes:
- **Checked:** her $g_n$ equals our $G_n$ for $n<16$, and her identity (9) holds numerically.
- **Earlier still:** her file credits a public omega-institute note (last changed 11 Oct 2026) that already described the divided-difference and circle strategy. Her new step is the amplitude inequality.
- **Verdict:** the methods are genuinely different, and hers is cleaner and shorter. Ours is an independent, computer-assisted confirmation.
- **Not in her proof:** the facts $G_n(-1)=0$ for $n\equiv2\pmod4$ and $\theta_\ast/\pi\notin\mathbb Q$ appear only in our work. They are minor side results.

- **The $A^2$ half is still open everywhere.** Davis confirms it. The best known result is an exact check of row 31 (omega-institute).
