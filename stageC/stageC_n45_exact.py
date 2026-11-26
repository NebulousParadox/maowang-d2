"""Exact signs of G_n(x_k(n)) for n = 4, 5 -- rational interval arithmetic (fractions.Fraction),
no floating point anywhere. Shows the repeated sign at k = 1, 2 (theta = pi/N, 2pi/N, straddling pi/4).
x_k = theta^{-1}(k pi/N), N = n+2. tau from the angle lemma:
  circle side (cos th < cos th_zeta ~ -0.45509): tau = c + sqrt(1+c^2)
  Gamma side  (cos th > cos th_zeta): tau = unique positive root of tau^4+4c tau^3+4(1-c^2)tau^2-1.
cos(k pi/N) is bracketed from its minimal polynomial (checked with sympy at the end)."""
from fractions import Fraction as Q
from math import isqrt
P = 200; S = 1 << P
def R(lo, hi=None): return (Q(lo), Q(lo if hi is None else hi))
def radd(a, b): return (a[0] + b[0], a[1] + b[1])
def rsub(a, b): return (a[0] - b[1], a[1] - b[0])
def rmul(a, b):
    p = [a[0]*b[0], a[0]*b[1], a[1]*b[0], a[1]*b[1]]; return (min(p), max(p))
def rdiv(a, b):
    assert b[0] > 0 or b[1] < 0, 'division by interval containing 0'
    p = [a[0]/b[0], a[0]/b[1], a[1]/b[0], a[1]/b[1]]; return (min(p), max(p))
def sqlo(r): return Q(0) if r <= 0 else Q(isqrt(r.numerator * S * S // r.denominator), S)
def sqhi(r): return Q(isqrt(-(-r.numerator * S * S // r.denominator)) + 1, S)
def rsqrt(a): return (sqlo(a[0]), sqhi(a[1]))
def neg(a): return (-a[1], -a[0])
def sign(a): return '+' if a[0] > 0 else '-' if a[1] < 0 else '?'
# complex intervals
def C(re, im=None): return (re, R(0) if im is None else im)
def cadd(a, b): return (radd(a[0], b[0]), radd(a[1], b[1]))
def csub(a, b): return (rsub(a[0], b[0]), rsub(a[1], b[1]))
def cmul(a, b): return (rsub(rmul(a[0], b[0]), rmul(a[1], b[1])), radd(rmul(a[0], b[1]), rmul(a[1], b[0])))
def cdiv(a, b):
    d = radd(rmul(b[0], b[0]), rmul(b[1], b[1])); n = cmul(a, (b[0], neg(b[1])))
    return (rdiv(n[0], d), rdiv(n[1], d))
ONE = C(R(1))
def bracket(coeffs, lo, hi, steps=120):          # coeffs low->high, sign change on [lo,hi]
    ev = lambda x: sum(c * x**i for i, c in enumerate(coeffs))
    lo, hi = Q(lo), Q(hi); s = ev(lo) > 0
    assert ev(lo) != 0 and (ev(hi) > 0) != s
    for _ in range(steps):
        m = (lo + hi) / 2; v = ev(m)
        if v == 0: return (m, m)
        if (v > 0) == s: lo = m
        else: hi = m
    return (lo, hi)
c7a = lambda lo, hi: bracket([1, -4, -4, 8], lo, hi)   # 8x^3-4x^2-4x+1 : cos(pi/7), cos(3pi/7), cos(5pi/7)
c7b = lambda lo, hi: bracket([-1, -4, 4, 8], lo, hi)   # 8x^3+4x^2-4x-1 : cos(2pi/7), cos(4pi/7), cos(6pi/7)
sq3h = rsqrt(R(Q(3, 4)))
COS = {(1, 6): sq3h, (2, 6): R(Q(1, 2)), (3, 6): R(0), (4, 6): R(Q(-1, 2)), (5, 6): neg(sq3h),
       (1, 7): c7a(Q(9, 10), 1), (2, 7): c7b(Q(6, 10), Q(7, 10)), (3, 7): c7a(Q(2, 10), Q(3, 10)),
       (4, 7): c7b(Q(-3, 10), Q(-2, 10)), (5, 7): c7a(Q(-7, 10), Q(-6, 10)), (6, 7): c7b(Q(-95, 100), Q(-85, 100))}
def xAt(c):
    s = rsqrt(rsub(R(1), rmul(c, c)))
    if c[0] > Q(-4550, 10000):                          # Gamma side
        def f(t):
            T = R(t); T2 = rmul(T, T)
            return rsub(radd(radd(rmul(T2, T2), rmul(rmul(R(4), c), rmul(T2, T))), rmul(rmul(R(4), rsub(R(1), rmul(c, c))), T2)), R(1))
        lo, hi = Q(1, 10), Q(5)
        assert f(lo)[1] < 0 and f(hi)[0] > 0
        for _ in range(90):
            m = (lo + hi) / 2; fm = f(m)
            if fm[1] < 0: lo = m
            elif fm[0] > 0: hi = m
            else: break
        tau = (lo, hi)
    elif c[1] < Q(-4552, 10000):                        # circle side
        tau = radd(c, rsqrt(radd(R(1), rmul(c, c))))
    else: raise ValueError('ambiguous side')
    t = C(rmul(tau, c), rmul(tau, s))
    Pz = cmul(csub(ONE, t), csub(csub(ONE, cmul(C(R(2)), t)), cmul(t, t)))
    Bz = cmul(cmul(t, cadd(ONE, t)), cadd(ONE, cmul(t, t)))
    return cdiv(Pz, Bz)[0]
def G(x, n):
    g = [R(1), radd(x, R(2)), radd(radd(rmul(x, x), rmul(R(6), x)), R(5)),
         radd(radd(radd(rmul(rmul(x, x), x), rmul(R(10), rmul(x, x))), rmul(R(25), x)), R(12))]
    for k in range(4, n + 1):
        g.append(radd(radd(radd(rmul(radd(x, R(3)), g[k-1]), rmul(rsub(x, R(1)), g[k-2])), rmul(rsub(x, R(1)), g[k-3])), rmul(x, g[k-4])))
    return g[n]
for n in (4, 5):
    N = n + 2; signs = []
    for k in range(1, n + 2):
        x = xAt(COS[(k, N)]); s = sign(G(x, n)); signs.append(s)
        print(f'n={n} k={k}: x in [{float(x[0]):.9f}, {float(x[1]):.9f}]  sign G_{n}(x_k) = {s}')
    reps = [k for k in range(1, n + 1) if signs[k-1] == signs[k] and signs[k] in '+-']
    print(f'n={n}: signs {"".join(signs)}  repeated sign at (k, k+1) for k in {reps}')
    assert reps == [1]
# sympy cross-check of the minimal polynomials used for cos(k pi/7)
try:
    import sympy as sp
    X = sp.symbols('X')
    assert sp.expand(sp.minimal_polynomial(sp.cos(sp.pi/7), X) - (8*X**3 - 4*X**2 - 4*X + 1)) == 0
    assert sp.expand(sp.minimal_polynomial(sp.cos(2*sp.pi/7), X) - (8*X**3 + 4*X**2 - 4*X - 1)) == 0
    print('minimal polynomials of cos(pi/7), cos(2pi/7) confirmed by sympy')
except ImportError:
    print('sympy not available: minimal polynomial check skipped')
