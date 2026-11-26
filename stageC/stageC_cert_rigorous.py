"""Stage C certificate, fully rigorous: every quantity is an arb/acb ball (python-flint), including
exp, cos, sin, sqrt, log, pow and every final comparison. Same structure, constants and summary lines
as stageC_cert.py / run_cert.mjs (box counts can differ slightly: ball enclosures are not the same as
the float interval enclosures).

    pip install python-flint
    python stageC_cert_rigorous.py 12 0.05          # N0 (= n+2), lambda0
    python stageC_cert_rigorous.py 12 0.05 96       # optional: working precision in bits (default 64)

Logic of each rigorous comparison: arb comparisons (<, >) return True only if the inequality holds for
every point of both balls; a ball that cannot be decided counts as a FAILED box, never as a pass.

Exactness is never assumed. union(), lower(), upper() may round outward (flint 0.9.0 stores radii as
30-bit mag_t). Every use is one of:
  (i)   a ball that CONTAINS a valid bound, used only in arithmetic and all-points comparisons;
  (ii)  a hull (union) that is a SUPERSET of the range it must cover (boxes, arcs, s-ranges);
  (iii) a max/min over many balls taken as union(...).upper()/.lower(), never via a possibly-undecidable
        comparison.
Box tiling: inner box endpoints are exact floats shared by neighbouring boxes; outward rounding only widens.
"""
import sys, math
from flint import arb, acb, ctx

N0 = int(sys.argv[1]) if len(sys.argv) > 1 else 12
LAM0F = float(sys.argv[2]) if len(sys.argv) > 2 else 0.05
ctx.prec = int(sys.argv[3]) if len(sys.argv) > 3 else 64

# ---------- API self-test (fails loudly if python-flint semantics differ from what is assumed) ----------
def _selftest():
    """Only containment / all-points semantics are assumed. union(), lower(), upper() may round
    outward (flint 0.9.0 stores radii as 30-bit mag_t); the code never relies on them being exact."""
    def chk(cond, msg):
        if not cond: raise AssertionError('python-flint self-test failed: ' + msg)
    u = arb(1).union(arb(2))
    chk(u.contains(arb(1)) and u.contains(arb(2)) and u.contains(arb('1.5')), 'union contains both inputs')
    chk(arb(1) < arb(2) and arb(2) > arb(1), 'decidable comparison is True')
    chk(not (u < arb('1.5')) and not (u > arb('1.5')), 'undecidable comparison is False')
    chk(u.lower() <= 1 and u.upper() >= 2, 'lower()/upper() bound the ball (containment)')
    chk(arb(-3).abs_lower() <= 3 and arb(-3).abs_lower() > 2 and arb(-3).abs_upper() >= 3 and arb(-3).abs_upper() < 4, 'abs_lower/abs_upper')
    chk(abs(acb(3, 4)).contains(arb(5)) and (acb(0, 1) * acb(0, 1)).real.contains(arb(-1)), 'acb arithmetic / abs')
    p = arb.pi(); chk(p > 3 and p < arb('3.1416'), 'arb.pi()')
    chk(abs(arb(2).sqrt() ** 2 - 2) < arb('1e-15') and abs((-arb(1)).exp() * arb(1).exp() - 1) < arb('1e-15'), 'sqrt / exp')
    chk((arb(-1).union(arb(1))).contains(arb(0)), 'union over 0')
    chk(arb(0).union(arb(1)).lower() <= 0, 'lower bound of [0,1] is <= 0')
    xb = arb(-1e-20).union(arb(4))                      # ball straddling 0
    chk(_float_upper(xb) >= 4, '_float_upper bounds the ball')
    z = csqrt(xb)                                        # clamped sqrt
    chk(z.is_finite(), 'clamped sqrt is finite')
    chk(z.contains(arb(0)) and z.contains(arb(1)) and z.contains(arb(2)), 'clamped sqrt of [0,4] contains [0,2]')
    chk(csqrt(arb(0)).contains(arb(0)) and csqrt(arb(0)).is_finite(), 'clamped sqrt of exact 0')
    w = csqrt(arb(9).union(arb(16)))                      # certainly positive: plain sqrt
    chk(w.contains(arb(3)) and w.contains(arb(4)), 'plain sqrt of [9,16] contains [3,4]')
    chk((arb(2) ** 3 - 8).contains(arb(0)) and (1 / arb(2) ** 3 - arb('0.125')).contains(arb(0)), 'integer powers')
    chk(arb(2).log() > 0 and (arb(1).cos() ** 2 + arb(1).sin() ** 2 - 1).contains(arb(0)), 'log / cos / sin')
    _ = float(arb('1.5').mid())

PI = arb.pi()
def B(lo, hi=None):
    """ball containing [lo, hi]; lo, hi are floats or arbs"""
    a = lo if isinstance(lo, arb) else arb(lo)
    if hi is None: return a
    b = hi if isinstance(hi, arb) else arb(hi)
    return a.union(b)
def _float_upper(x):
    """a float F >= every point of the ball x (generous slack covers float conversion rounding)"""
    ub = x.upper()                                        # a ball containing an upper bound U of x
    f = float(ub.mid()); r = float(ub.rad())              # U <= mid + rad
    return max((f + r) + 1e-12 * (abs(f) + r) + 1e-300, 1e-300)
def csqrt(x):
    """Enclosure of sqrt over the non-negative part of x (used only where every valid point has
    argument >= 0). If x is not certainly positive we never take sqrt of a ball touching 0 (Arb then
    returns an indeterminate result); instead: every valid point lies in [0, F] with F a positive float,
    sqrt is increasing, so sqrt(point) lies in [0, sqrt(F)] subset of hull(0, arb(F).sqrt())."""
    if x.upper() < 0: raise ValueError('sqrt of negative')
    if x > 0: return x.sqrt()
    return arb(0).union(arb(_float_upper(x)).sqrt())      # sqrt of an exact positive point: always finite
# Sound max/min of a list of balls: the union rounds outward, so union(...).upper() is >= every point of
# every ball, and union(...).lower() is <= every point (no reliance on decidable comparisons).
def ball_hull(vals):
    h = None
    for v in vals: h = v if h is None else h.union(v)
    return h
def amax(vals): return ball_hull(vals).upper()          # an upper bound for every point of every ball
def amin(vals): return ball_hull(vals).lower()          # a lower bound for every point of every ball
def pick_max_lower(lows):
    """lows: balls each containing a valid lower bound; returns one of them (any choice is valid), preferring
    the largest when that is decidable"""
    best = lows[0]
    for v in lows[1:]:
        if v > best: best = v
    return best
def fl(x): return float(x.mid())
_selftest()
print(f'python-flint self-test passed (flint version {getattr(__import__("flint"), "__version__", "?")}, '
      f'sqrtpos present: {hasattr(arb, "sqrtpos")} [not used])')
def cb(re, im=None): return acb(re, arb(0) if im is None else im)

# ---------- constants ----------
s2 = arb(2).sqrt(); al = 1 + s2; alp = 1 - s2
ONE = acb(1)
def qs(t): return al * t * t + s2 * t + 1
def qb(t): return alp * t * t - s2 * t + 1
def qsd(t): return 2 * al * t + s2
def qbd(t): return 2 * alp * t - s2
def Pz(t): return (1 - t) * (1 - 2 * t - t * t)
def Bz(t): return t * (1 + t) * (1 + t * t)
tau0 = ((arb(6).sqrt() - 2) / 2).sqrt()
r1 = (-s2 + (4 * s2 - 2).sqrt()) / (2 * (s2 - 1))
cAbs = (s2 - 1).sqrt()

# ---------- core box evaluation ----------
def evalBox(tau, c, s, arc=True):
    t1 = acb(tau * c, tau * s)
    x = (Pz(t1) / Bz(t1)).real
    if not (x < 0): raise ValueError('x not negative')
    sA = 2 * tau * c; pA = tau ** 2
    sB = -(x - 1) / x - sA; pB = -1 / (x * pA)
    disc = 4 * pB - sB ** 2
    if disc.upper() < 0: return None
    im2 = csqrt(disc) / 2; re2 = sB / 2
    t2 = acb(re2, im2); rho2 = pB.sqrt(); q = rho2 / tau
    negx = -x
    QB = lambda t: t * t - sB * t + pB
    QA = lambda t: t * t - sA * t + pA
    def hgen(Q, sq):
        def h(t): return (1 - t) * t / (negx * Q(t))
        def hp(t):
            qv = Q(t); qd = 2 * t - sq
            return ((1 - 2 * t) * qv - (1 - t) * t * qd) / (negx * qv * qv)
        return h, hp
    h, hp = hgen(QB, sB); h2, h2p = hgen(QA, sA)
    # m = 2 Re u1 = Im h(t1)/Im t1 = mean of Re h' over the vertical segment [conj t1, t1]
    cands = []
    if not t1.imag.contains(arb(0)): cands.append(h(t1).imag / t1.imag)
    ia = t1.imag.abs_upper()
    cands.append(hp(acb(t1.real, (-ia).union(ia))).real)
    e = None if im2.contains(arb(0)) else abs(h2(t2)) / im2
    arcb = None
    if arc and re2.upper() < 0:
        th2lo = (PI - im2 / abs(re2)).lower()
        if th2lo > PI / 2:
            K = 16
            ends = [th2lo + (PI - th2lo) * j / K for j in range(K)] + [PI]
            a0s, a1s = [], []
            for j in range(K):
                ph = ends[j].union(ends[j + 1])
                zz = acb(rho2 * ph.cos(), rho2 * ph.sin())
                a0s.append(abs(h2(zz))); a1s.append(abs(h2p(zz)))
            arcb = (amax(a0s), amax(a1s))                 # sound upper bounds (union-based)
    return dict(x=x, m=cands, e=e, q=q, rho2=rho2, arc=arcb)

def farCheck(r, N):
    if r is None: return None
    mc = [m for m in r['m'] if m.is_finite() and not m.contains(arb(0))]
    if not mc: return None
    sg = {1 if m > 0 else -1 for m in mc}
    if len(sg) != 1: return None
    am = pick_max_lower([m.abs_lower() for m in mc])   # any candidate is a valid lower bound for |m|
    ql = r['q'].lower()
    if not (ql > 1): return None
    lhs = am * ql ** N
    if r['e'] is not None and r['e'].is_finite() and lhs > r['e'].upper(): return (sg.pop(), 'e')
    if r['arc'] is not None:
        S0, S1 = r['arc']; r2l = r['rho2'].lower()
        rhs = PI / 2 * (S1 + N * S0 / r2l)
        inc = lhs * (ql - 1) > PI / 2 * S0 / r2l
        if lhs > rhs and inc: return (sg.pop(), 'arc')
    return None

def circleBox(th):
    c = th.cos(); s = th.sin()
    return evalBox(c + (1 + c ** 2).sqrt(), c, s)
def gammaBox(tlo, thi, branch):
    """tlo, thi: balls containing the box endpoints; c+ increasing, c- decreasing in tau (angle lemma)"""
    def cAt(t):
        r = csqrt(2 * t ** 4 + 4 * t ** 2 - 1)
        return ((t ** 2 + r) if branch > 0 else (t ** 2 - r)) / (2 * t)
    c = cAt(tlo).union(cAt(thi))
    return evalBox(tlo.union(thi), c, csqrt(1 - c ** 2))

def cover(name, lo_f, hi_f, lo_ball, hi_ball, n_init, mk, N, max_depth=18):
    """covers [lo_ball, hi_ball]; inner box endpoints are exact floats shared by neighbouring boxes"""
    pts = [lo_f + (hi_f - lo_f) * i / n_init for i in range(n_init)] + [hi_f]
    stack = [(pts[i], pts[i + 1], i == 0, i == n_init - 1, 0) for i in range(n_init)]
    nbox = 0; fails = []; signs = set(); how = {'e': 0, 'arc': 0}
    while stack:
        a, b, first, last, d = stack.pop(); nbox += 1
        if nbox % 2000 == 0: print(f'  ... {name}: {nbox} boxes', file=sys.stderr, flush=True)
        A = lo_ball if first else arb(a); Bb = hi_ball if last else arb(b)
        try: res = farCheck(mk(A, Bb), N)
        except (ValueError, ZeroDivisionError): res = None
        if res: signs.add(res[0]); how[res[1]] += 1; continue
        if d >= max_depth: fails.append((a, b)); continue
        mid = (a + b) / 2
        stack += [(a, mid, first, False, d + 1), (mid, b, False, last, d + 1)]
    print(f'{name}: boxes={nbox} fails={len(fails)} signs(m)={sorted(signs)} via {how}')
    if fails: print('   first fails:', fails[:6])
    return fails, signs

# ================= main =================
print(f'=== rigorous certificate run (python-flint arb, prec={ctx.prec}): N0 = {N0} (N = n+2), lambda0 = {LAM0F} ===')
LAM0 = arb(LAM0F); ok = True
# left boundary (circle): psi(t1(thS)) < lambda0  =>  thS < theta_L   (psi increases with theta on the circle)
S2f = math.sqrt(2); ALf = 1 + S2f
A_ = ALf + (S2f - 1) * LAM0F; B_ = S2f * (1 + LAM0F); C_ = 1 - LAM0F
thS = math.atan2(math.sqrt(4 * A_ * C_ - B_ * B_) / (2 * A_), -B_ / (2 * A_)) - 1e-7
th = arb(thS); c = th.cos(); s = th.sin(); tau = c + (1 + c ** 2).sqrt()
ps = qs(acb(tau * c, tau * s)) / qb(acb(tau * c, tau * s))
okL = ps.real < LAM0; ok &= okL
print(f'left boundary theta_s={thS:.9f} psi < lam0: {okL}')
# right boundary (Gamma - branch): |psi(t1(tauE))| < lambda0  =>  tauE > tau_R   (|psi| decreases in tau there)
tR = complex(-S2f / (2 * ALf), math.sqrt(2 + 4 * S2f) / (2 * ALf)); lR = 1j * LAM0F
fq = lambda t: ALf * t * t + S2f * t + 1; fb = lambda t: (1 - S2f) * t * t - S2f * t + 1
for _ in range(80):
    tR -= (fq(tR) - lR * fb(tR)) / ((2 * ALf * tR + S2f) - lR * (2 * (1 - S2f) * tR - S2f))
tauE = abs(tR) + 1e-7
tau = arb(tauE); c = (tau ** 2 - csqrt(2 * tau ** 4 + 4 * tau ** 2 - 1)) / (2 * tau); s = csqrt(1 - c ** 2)
t1 = acb(tau * c, tau * s); ps = qs(t1) / qb(t1)
okR = (abs(ps) < LAM0) and (arb(tauE) < cAbs); ok &= okR
print(f'right boundary tau_e={tauE:.9f} |psi| < lam0 and tau_e < |zeta|: {okR}')
tw = (math.sqrt(6) - math.sqrt(2)) / 2; W1 = (tw - 0.004, tw + 0.004)
regs = [
    cover('circle theta', thS, math.pi, arb(thS), PI, 400, lambda a, b: circleBox(a.union(b)), N0),
    # fl(tau0), fl(r1) are only approximate partition anchors: the first/last boxes use the balls tau0, r1 themselves
    cover('Gamma - branch tau', fl(tau0), tauE, tau0, arb(tauE), 400, lambda a, b: gammaBox(a, b, -1), N0),
    cover('Gamma + branch tau (theta>pi/4 side)', fl(tau0), W1[0], tau0, arb(W1[0]), 400, lambda a, b: gammaBox(a, b, 1), N0),
    cover('Gamma + branch tau (theta<pi/4 side)', W1[1], fl(r1), arb(W1[1]), r1, 400, lambda a, b: gammaBox(a, b, 1), N0),
]
ok &= all(not f for f, _ in regs)
sigs = [sorted(sg) for _, sg in regs]
print('sign(m) per region:', sigs, '(expected [1],[1],[1],[-1])')
ok &= sigs == [[1], [1], [1], [-1]]
# ---------- -1 window: forward-mode AD over balls ----------
def dc(v): return (arb(v), arb(0))
def dadd(a, b): return (a[0] + b[0], a[1] + b[1])
def dsub(a, b): return (a[0] - b[0], a[1] - b[1])
def dmul(a, b): return (a[0] * b[0], a[1] * b[0] + a[0] * b[1])
def ddiv(a, b):
    qv = a[0] / b[0]; return (qv, (a[1] - qv * b[1]) / b[0])
def dsqrt(a):
    r = csqrt(a[0]); return (r, a[1] / (2 * r))
def dneg(a): return (-a[0], -a[1])
def CD(re, im=None): return (re, dc(0) if im is None else im)
def cadd(a, b): return (dadd(a[0], b[0]), dadd(a[1], b[1]))
def csub(a, b): return (dsub(a[0], b[0]), dsub(a[1], b[1]))
def cmul(a, b): return (dsub(dmul(a[0], b[0]), dmul(a[1], b[1])), dadd(dmul(a[0], b[1]), dmul(a[1], b[0])))
def cdiv(a, b):
    den = dadd(dmul(b[0], b[0]), dmul(b[1], b[1])); n = cmul(a, (b[0], dneg(b[1])))
    return (ddiv(n[0], den), ddiv(n[1], den))
def mAD(tI):
    tau = (tI, arb(1)); one = dc(1); t2 = dmul(tau, tau)
    rt = dsqrt(dsub(dadd(dmul(dc(2), dmul(t2, t2)), dmul(dc(4), t2)), one))
    c = ddiv(dadd(t2, rt), dmul(dc(2), tau)); s = dsqrt(dsub(one, dmul(c, c)))
    t1 = (dmul(tau, c), dmul(tau, s)); O = CD(one)
    P = cmul(csub(O, t1), csub(csub(O, cmul(CD(dc(2)), t1)), cmul(t1, t1)))
    Bv = cmul(cmul(t1, cadd(O, t1)), cadd(O, cmul(t1, t1)))
    xx = cdiv(P, Bv)[0]; negx = dneg(xx)
    sA = dmul(dc(2), dmul(tau, c)); pA = dmul(tau, tau)
    sB = dsub(dneg(ddiv(dsub(xx, one), xx)), sA); pB = dneg(ddiv(one, dmul(xx, pA)))
    QB = cadd(csub(cmul(t1, t1), cmul(CD(sB), t1)), CD(pB))
    h = cdiv(cmul(csub(O, t1), t1), cmul(CD(negx), QB))
    m = ddiv(h[1], t1[1])
    return m, -c[1] / s[0]                      # m(tau) with m'(tau); dtheta/dtau = -c'(tau)/sin(theta)
pts = [W1[0] + (W1[1] - W1[0]) * j / 400 for j in range(400)] + [W1[1]]
mps, thps, Es, Qs, sgm = [], [], [], [], set()
for j in range(400):
    tI = B(pts[j], pts[j + 1])
    m, thp = mAD(tI)
    if m[1].contains(arb(0)): sgm.add(0); continue
    sgm.add(1 if m[1] > 0 else -1); mps.append(abs(m[1])); thps.append(abs(thp))
    bx = gammaBox(arb(pts[j]), arb(pts[j + 1]), 1)
    if bx is None or bx['e'] is None: sgm.add(0); continue
    Es.append(bx['e']); Qs.append(bx['q'])
okW = False
if 0 in sgm or len(sgm) != 1:
    print('-1 window: derivative enclosure contains 0 (or pair-2 bound unavailable)')
else:
    minMp, maxThp, maxE, minQ = amin(mps), amax(thps), amax(Es), amin(Qs)   # union-based: sound bounds
    if minMp > 0 and minQ > 1:
        lenN = 2 * maxE * maxThp / (minMp * minQ ** N0)
        # Failure set is centred at pi/4 with full length lenN. When 4 does not divide N the
        # nearest grid point is >= pi/(4N) away, so we need lenN < pi/(2N), i.e. N*lenN < pi/2.
        # (Round-2 ChatGPT referee: the earlier test '< PI' only gave "at most one grid point".)
        okW = (lenN * N0 < PI / 2) and (arb(N0) > 1 / minQ.log())
        print(f'-1 window tau in [{W1[0]}, {W1[1]}]: sign m\'={sorted(sgm)} min|m\'|={fl(minMp):.3e} max|dtheta/dtau|={fl(maxThp):.3f} '
              f'max e={fl(maxE):.3f} min q={fl(minQ):.3f}  N*len(N0)={fl(lenN * N0):.3e} < pi/2 : {okW}')
    else:
        print('-1 window: min|m\'| or min q not certified positive / > 1')
ok &= okW
# ---------- lambda-window around x* ----------
def tLam(lam):
    a = al - lam * alp; b = s2 + lam * s2; cq = 1 - lam
    mD = 4 * a * cq - b * b
    if not (mD.real > 0): raise ValueError('sqrt branch')
    sq = mD.sqrt()
    t = (-b + acb(0, 1) * sq) / (2 * a)
    if not (t.imag > 0): raise ValueError('t(lambda) not in the upper half-plane')   # t(+-lam) are the UHP roots
    return t
def lamQuant(lam):
    t = tLam(lam); qbt = qb(t); qbdt = qbd(t); qsdt = qsd(t)
    den1 = qsdt - lam * qbdt; Dv = qbt * den1; num = (1 - t) * t
    U = num / Dv; tp = qbt / den1; g = tp / t
    Dt = qbdt * den1 + qbt * (2 * al - lam * (2 * alp)); Dl = -(qbt * qbdt)
    Up = ((1 - 2 * t) * tp * Dv - num * (Dt * tp + Dl)) / (Dv * Dv)
    return U, g, Up
def E2(W):
    r = abs(W)
    if r.lower() > arb('0.25'): return (1 - (-W).exp()) / W
    base = 1 - W / 2 + W * W / 6
    rr = (r ** 3 / 24 * r.exp()).upper(); ball = (-rr).union(rr)
    return base + acb(ball, ball)
Zc = arb(2); nns = []
for name, dirv in (('left (lam=v)', acb(1)), ('right (lam=i w)', acb(0, 1))):
    KS = 200; e_ = [-LAM0F + 2 * LAM0F * j / KS for j in range(KS)] + [LAM0F]
    D2 = amax([2 * abs(lamQuant(acb(B(e_[j], e_[j + 1])) * dirv)[2]) for j in range(KS)])   # >= 2|U'| on the segment
    KL = 100; rs = [LAM0F * j / KL for j in range(KL)] + [LAM0F]
    gH = None; okr = True; betas = []; c2s = []
    for j in range(KL):
        rlo, rhi = rs[j], rs[j + 1]
        g1 = lamQuant(acb(B(rlo, rhi)) * dirv)[1]; g2 = lamQuant(acb(B(-rhi, -rlo)) * dirv)[1]
        add = acb(g1.real.union(g2.real), g1.imag.union(g2.imag))
        gH = add if gH is None else acb(gH.real.union(add.real), gH.imag.union(add.imag))
        L = -2 * gH                                   # ell(lam)/lam = -2 * mean of g over [-lam, lam]
        lam = acb(B(rlo, rhi)) * dirv
        Um = lamQuant(-lam)[0]; Aq = Um * L; dL = dirv * L; absL = abs(L)
        smax = (Zc / absL.lower()).upper()            # case 1: s = N|lam| in [0, Zc/|L|]
        beta = amin([(Aq * E2(acb(B(smax * k / 60, smax * (k + 1) / 60)) * dL)).real for k in range(60)])
        betas.append(beta)
        if not (beta > 0): okr = False
        else: nns.append(D2 / beta)
        absU = abs(Um)                                # case 2: |W| >= Zc
        cosPsi = ((Um * dirv.conjugate()).real / absU).lower()
        cosPhi = (dL.real / abs(dL)).lower()          # cos phi > 0 also fixes the ray labelling: Re ell > 0
        margin = cosPsi - (-Zc * cosPhi).exp()
        c2 = absU.lower() / arb(rhi) * margin - D2
        c2s.append(c2)
        if not (cosPhi > 0 and margin > 0 and c2 > 0): okr = False
    print(f'lambda-window {name}: D2={fl(D2):.4f} min beta={fl(amin(betas)):.4f} min case2 slack={fl(amin(c2s)):.4f} ok={okr}')
    ok &= okr
Nnear = amax(nns) if nns else arb(10 ** 9)
okN = bool(nns) and (arb(N0) > Nnear)
print(f'lambda-window needs N > {fl(Nnear):.2f} ; N0={N0}: {okN}')
ok &= okN
print(f'\nCERTIFICATE PASSED for all N >= {N0} (n >= {N0 - 2})' if ok else '\nCERTIFICATE FAILED')
