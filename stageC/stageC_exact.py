"""Stage C exact identities (sympy). Every assert is an exact symbolic check."""
import sympy as sp
x, t, u = sp.symbols('x t u')
r2, I = sp.sqrt(2), sp.I
z = lambda e: sp.simplify(sp.expand(e)) == 0          # simplify needed for sqrt(2) cancellation
Den = 1 - (x+3)*t - (x-1)*t**2 - (x-1)*t**3 - x*t**4
dDen = sp.diff(Den, t)
a, b, xs = -4-3*r2, -3+2*r2, -3-2*r2
qs = (1+r2)*t**2 + r2*t + 1
qb = (1-r2)*t**2 - r2*t + 1
kap = (x - xs)/(x - b)

# S1. Den = K (q*^2 - kappa q_b^2) with K = (b-x)/(4 sqrt2)  =>  Den = K (q*-lam q_b)(q*+lam q_b), lam^2 = kappa
assert z(sp.together(Den - (b-x)/(4*r2)*(qs**2 - kap*qb**2)))

# S2. At a root of q* - lam q_b:  dDen/dt = 2 K lam q_b (q*' - lam q_b')   (product rule + q* = lam q_b)
lam = sp.symbols('lam')
K = sp.symbols('K')
prod = K*(qs - lam*qb)*(qs + lam*qb)
d = sp.diff(prod, t)
dqs, dqb = sp.diff(qs, t), sp.diff(qb, t)
assert z(d - K*(dqs - lam*dqb)*(qs + lam*qb) - K*(qs - lam*qb)*(dqs + lam*dqb))
# (second term vanishes at a root of q* - lam q_b, and there q* + lam q_b = 2 lam q_b)

# S3. x = -1: t1 = rho e^{i pi/4}, rho = (sqrt6 - sqrt2)/2 is a root, so theta(-1) = pi/4; and m(-1) = 0
rho = (sp.sqrt(6) - r2)/2
t1 = rho*(1 + I)/r2
assert sp.simplify(sp.expand(Den.subs({x: -1, t: t1}))) == 0
w = ((1 - t1)*t1/dDen.subs(x, -1).subs(t, t1))
assert sp.simplify(sp.expand_complex(w + sp.conjugate(w))) == 0          # m(-1) = 2 Re w = 0
# the other pair at x=-1 has argument 3 pi/4 (root of the same Den)
rho2 = (sp.sqrt(6) + r2)/2
assert sp.simplify(sp.expand(Den.subs({x: -1, t: rho2*(-1 + I)/r2}))) == 0
assert sp.N(rho2) > sp.N(rho)                                           # so t1 is the smaller pair

# S4. G_n(-1) = 0 for every n = 2 mod 4:  F(t)+F(-t)-F(it)-F(-it) = 0, F = (1-t)/Den(-1,t)
F = lambda s: (1 - s)/Den.subs(x, -1).subs(t, s)
assert sp.simplify(sp.together(F(t) + F(-t) - F(I*t) - F(-I*t))) == 0
# S4'. elementary proof: g_n = G_n(-1) has characteristic polynomial chi(y) = y^4 - 2y^3 + 2y^2 + 2y + 1,
# chi(y) chi(-y) = y^8 + 14 y^4 + 1, hence g_{n+8} = -14 g_{n+4} - g_n; with g_2 = g_6 = 0 all g_{4k+2} = 0.
yv = sp.symbols('y')
chi = yv**4 - 2*yv**3 + 2*yv**2 + 2*yv + 1
assert sp.expand(chi*chi.subs(yv, -yv) - (yv**8 + 14*yv**4 + 1)) == 0
# (g_2 = g_6 = 0 is asserted in S6 below, once G_0..G_11 are built)

# S5. theta = pi/2 sample point is x = -2 - sqrt5 (Den(x, i rho) = 0 with rho^2 = (x+3)/(x-1))
xv = -2 - sp.sqrt(5); rr = sp.sqrt((xv+3)/(xv-1))
assert sp.simplify(sp.expand(Den.subs({x: xv, t: I*rr}))) == 0

# S6. small n: G_n real-rooted (exact Sturm count via count_roots), n = 1..11
G = [sp.Integer(1), x+2, x**2+6*x+5, x**3+10*x**2+25*x+12]
for n in range(4, 12):
    G.append(sp.expand((x+3)*G[n-1] + (x-1)*G[n-2] + (x-1)*G[n-3] + x*G[n-4]))
assert G[2].subs(x, -1) == 0 and G[6].subs(x, -1) == 0          # base cases for S4'
assert all(sp.expand(G[n+8] + 14*G[n+4] + G[n]).subs(x, -1) == 0 for n in range(0, 4))  # step-4 recurrence spot check
for n in range(1, 12):
    P = sp.Poly(G[n], x)
    assert P.count_roots() == n                       # n real roots (exact, with multiplicity)
    assert all(cf > 0 for cf in P.all_coeffs())       # positive coefficients: no roots in [0, oo)
print("all Stage C exact checks passed")
