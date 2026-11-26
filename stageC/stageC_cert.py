"""Stage C interval certificate -- pure Python (>=3.9) port of cert.mjs + run_cert.mjs.
Usage: python stageC_cert.py 12 0.05      (N0 = n+2, lambda0)
Rounding: + - * / sqrt widened 1 ulp (IEEE correctly rounded); exp/cos/sin widened 4 ulp
(assumes the platform libm is accurate to < 4 ulp)."""
import math, sys
INF = math.inf
def up(x, k=1):
    for _ in range(k): x = math.nextafter(x, INF)
    return x
def dn(x, k=1):
    for _ in range(k): x = math.nextafter(x, -INF)
    return x
# ---------- real intervals: tuples (lo, hi) ----------
def I(lo, hi=None):
    hi = lo if hi is None else hi
    if not lo <= hi: raise ValueError(f'bad interval {lo} {hi}')
    return (lo, hi)
def iadd(a, b): return I(dn(a[0] + b[0]), up(a[1] + b[1]))
def isub(a, b): return I(dn(a[0] - b[1]), up(a[1] - b[0]))
def ineg(a): return I(-a[1], -a[0])
def _p(u, v):
    r = u * v
    return 0.0 if r != r else r
def imul(a, b):
    p = [_p(a[0], b[0]), _p(a[0], b[1]), _p(a[1], b[0]), _p(a[1], b[1])]
    return I(dn(min(p)), up(max(p)))
def iinv(b):
    if b[0] <= 0 <= b[1]: return I(-INF, INF)
    return I(dn(1 / b[1]), up(1 / b[0]))
def idiv(a, b):
    if b[0] <= 0 <= b[1]: return I(-INF, INF)
    p = [a[0] / b[0], a[0] / b[1], a[1] / b[0], a[1] / b[1]]
    return I(dn(min(p)), up(max(p)))
def isqr(a):
    if a[0] >= 0: return I(dn(a[0] * a[0]), up(a[1] * a[1]))
    if a[1] <= 0: return I(dn(a[1] * a[1]), up(a[0] * a[0]))
    return I(0.0, up(max(a[0] * a[0], a[1] * a[1])))
def isqrt(a):
    if a[1] < 0: raise ValueError(f'sqrt of negative {a[1]}')
    lo = max(0.0, a[0])
    return I(0.0 if lo == 0 else dn(math.sqrt(lo)), up(math.sqrt(a[1])))
def iexp(a): return I(max(0.0, dn(math.exp(a[0]), 4)), up(math.exp(a[1]), 4))
PI = (math.pi, up(math.pi))
def icos(a):
    if a[1] - a[0] >= 6.28: return I(-1.0, 1.0)
    lo = dn(min(math.cos(a[0]), math.cos(a[1])), 4); hi = up(max(math.cos(a[0]), math.cos(a[1])), 4)
    for k in range(math.floor(a[0] / math.pi) - 1, math.ceil(a[1] / math.pi) + 2):
        L, H = sorted((k * PI[0], k * PI[1]))
        if dn(L, 2) <= a[1] and up(H, 2) >= a[0]:
            if k % 2 == 0: hi = 1.0
            else: lo = -1.0
    return I(max(-1.0, lo), min(1.0, hi))
def isin(a): return icos(isub(a, imul(PI, I(0.5))))
def ihull(a, b): return I(min(a[0], b[0]), max(a[1], b[1]))
def iisect(a, b): return I(max(a[0], b[0]), min(a[1], b[1]))
def iabs(a):
    if a[0] >= 0: return a
    if a[1] <= 0: return ineg(a)
    return I(0.0, max(-a[0], a[1]))
ip = lambda v: I(v, v)
# ---------- complex intervals: (re, im) ----------
def Z(re, im=None): return (re, ip(0.0) if im is None else im)
def zr(v): return Z(ip(v))
def zadd(a, b): return (iadd(a[0], b[0]), iadd(a[1], b[1]))
def zsub(a, b): return (isub(a[0], b[0]), isub(a[1], b[1]))
def zneg(a): return (ineg(a[0]), ineg(a[1]))
def zmul(a, b): return (isub(imul(a[0], b[0]), imul(a[1], b[1])), iadd(imul(a[0], b[1]), imul(a[1], b[0])))
def zsc(s, a): return (imul(s, a[0]), imul(s, a[1]))
def zconj(a): return (a[0], ineg(a[1]))
def zabs2(a): return iadd(isqr(a[0]), isqr(a[1]))
def zabs(a): return isqrt(zabs2(a))
def zdiv(a, b):
    d = zabs2(b); n = zmul(a, zconj(b))
    return (idiv(n[0], d), idiv(n[1], d))
def zsqrtRH(a):
    if a[0][0] <= 0: raise ValueError('zsqrt needs Re>0')
    r = zabs(a); re = isqrt(imul(iadd(r, a[0]), ip(0.5)))
    return (re, idiv(a[1], imul(ip(2.0), re)))
def zexp(a):
    m = iexp(a[0]); return (imul(m, icos(a[1])), imul(m, isin(a[1])))
def zpoly(cs, t):
    r = zr(0.0)
    for c in reversed(cs): r = zadd(zmul(r, t), c)
    return r
# ---------- constants ----------
s2 = isqrt(ip(2.0)); al = iadd(ip(1.0), s2); alp = isub(ip(1.0), s2)
ONE = zr(1.0)
qsC = [ONE, Z(s2), Z(al)]; qbC = [ONE, Z(ineg(s2)), Z(alp)]
qsP = [Z(s2), Z(imul(ip(2.0), al))]; qbP = [Z(ineg(s2)), Z(imul(ip(2.0), alp))]
qs = lambda t: zpoly(qsC, t); qb = lambda t: zpoly(qbC, t)
qsd = lambda t: zpoly(qsP, t); qbd = lambda t: zpoly(qbP, t)
def Pz(t): return zmul(zsub(ONE, t), zsub(zsub(ONE, zmul(zr(2.0), t)), zmul(t, t)))
def Bz(t): return zmul(zmul(t, zadd(ONE, t)), zadd(ONE, zmul(t, t)))
tau0 = isqrt(imul(isub(isqrt(ip(6.0)), ip(2.0)), ip(0.5)))
r1 = idiv(iadd(ineg(s2), isqrt(isub(imul(ip(4.0), s2), ip(2.0)))), imul(ip(2.0), isub(s2, ip(1.0))))
cAbs = isqrt(isub(s2, ip(1.0)))
# ---------- core box evaluation ----------
def evalBox(tau, c, s, arc=True):
    t1 = (imul(tau, c), imul(tau, s))
    x = zdiv(Pz(t1), Bz(t1))[0]
    if x[1] >= 0: raise ValueError('x not negative')
    sA = imul(ip(2.0), imul(tau, c)); pA = isqr(tau)
    sB = isub(ineg(idiv(isub(x, ip(1.0)), x)), sA); pB = ineg(iinv(imul(x, pA)))
    disc = isub(imul(ip(4.0), pB), isqr(sB))
    if disc[1] < 0: return None
    im2 = imul(isqrt(I(max(0.0, disc[0]), disc[1])), ip(0.5)); re2 = imul(sB, ip(0.5))
    t2 = (re2, im2); rho2 = isqrt(pB); q = idiv(rho2, tau)
    negx = ineg(x)
    QB = lambda t: zadd(zsub(zmul(t, t), zsc(sB, t)), Z(pB))
    QA = lambda t: zadd(zsub(zmul(t, t), zsc(sA, t)), Z(pA))
    def hgen(Q, sq):
        def h(t): return zdiv(zmul(zsub(ONE, t), t), zsc(negx, Q(t)))
        def hp(t):
            qv = Q(t); qd = zsub(zmul(zr(2.0), t), Z(sq))
            num = zsub(zmul(zsub(ONE, zmul(zr(2.0), t)), qv), zmul(zmul(zsub(ONE, t), t), qd))
            return zdiv(num, zsc(negx, zmul(qv, qv)))
        return h, hp
    h, hp = hgen(QB, sB); h2, h2p = hgen(QA, sA)
    m = idiv(h(t1)[1], t1[1])
    mh = hp((t1[0], I(-t1[1][1], t1[1][1])))[0]
    m = iisect(m, mh) if math.isfinite(m[0]) and math.isfinite(m[1]) else mh
    e = idiv(zabs(h2(t2)), im2)
    arcb = None
    if arc and re2[1] < 0:
        th2lo = isub(PI, idiv(im2, iabs(re2)))[0]
        if th2lo >= math.pi / 2:
            S0 = S1 = 0.0; Kk = 16
            for j in range(Kk):
                ph = I(th2lo + (math.pi - th2lo) * j / Kk, PI[1] if j == Kk - 1 else th2lo + (math.pi - th2lo) * (j + 1) / Kk)
                zz = (imul(rho2, icos(ph)), imul(rho2, isin(ph)))
                S0 = max(S0, zabs(h2(zz))[1]); S1 = max(S1, zabs(h2p(zz))[1])
            arcb = (S0, S1)
    return dict(x=x, m=m, e=e, q=q, rho2=rho2, arc=arcb)
def farCheck(r, N):
    if r is None: return None
    m = r['m']
    if m[0] <= 0 <= m[1] or r['q'][0] <= 1: return None
    am = min(abs(m[0]), abs(m[1])); ql = r['q'][0]
    lhs = am * ql ** N * (1 - 1e-12)
    if math.isfinite(r['e'][1]) and lhs > r['e'][1] * (1 + 1e-12): return (1 if m[0] > 0 else -1, 'e')
    if r['arc']:
        S0, S1 = r['arc']
        rhs = (math.pi / 2 + 1e-12) * (S1 + N * S0 / r['rho2'][0])
        inc = am * ql ** N * (ql - 1) > (math.pi / 2 + 1e-12) * S0 / r['rho2'][0]
        if lhs > rhs * (1 + 1e-12) and inc: return (1 if m[0] > 0 else -1, 'arc')
    return None
def circleBox(th):
    c = icos(th); s = isin(th)
    return evalBox(iadd(c, isqrt(iadd(ip(1.0), isqr(c)))), c, s)
def gammaBox(tau, branch):
    def cAt(t):
        a = isub(iadd(imul(ip(2.0), isqr(isqr(t))), imul(ip(4.0), isqr(t))), ip(1.0))
        r = isqrt(I(max(0.0, a[0]), max(0.0, a[1])))
        return idiv(iadd(isqr(t), r) if branch > 0 else isub(isqr(t), r), imul(ip(2.0), t))
    c = ihull(cAt(I(tau[0], max(tau[0], tau0[1]))), cAt(ip(tau[1])))
    c = I(max(c[0], -1.0), min(c[1], 1.0))
    return evalBox(tau, c, isqrt(isub(ip(1.0), isqr(c))))
def cover(name, lo, hi, n_init, mk, N, max_depth=18):
    stack = [(lo + (hi - lo) * i / n_init, hi if i == n_init - 1 else lo + (hi - lo) * (i + 1) / n_init, 0) for i in range(n_init)]
    nbox = 0; fails = []; signs = set()
    while stack:
        a, b, d = stack.pop(); nbox += 1
        try: res = farCheck(mk(I(a, b)), N)
        except ValueError: res = None
        if res: signs.add(res[0]); continue
        if d >= max_depth: fails.append((a, b)); continue
        mid = (a + b) / 2; stack += [(a, mid, d + 1), (mid, b, d + 1)]
    print(f'{name}: boxes={nbox} fails={len(fails)} signs(m)={sorted(signs)}')
    return fails, signs
# ---------- main ----------
N0 = int(sys.argv[1]) if len(sys.argv) > 1 else 12
lam0 = float(sys.argv[2]) if len(sys.argv) > 2 else 0.05
ok = True
S2f = math.sqrt(2); ALf = 1 + S2f
A_ = ALf + (S2f - 1) * lam0; B_ = S2f * (1 + lam0); C_ = 1 - lam0
thL = math.atan2(math.sqrt(4 * A_ * C_ - B_ * B_) / (2 * A_), -B_ / (2 * A_)); thS = thL - 1e-7
th = ip(thS); c = icos(th); s = isin(th); tau = iadd(c, isqrt(iadd(ip(1.0), isqr(c))))
t1 = (imul(tau, c), imul(tau, s)); ps = zdiv(qs(t1), qb(t1))
ok &= ps[0][1] <= lam0; print('left boundary ok:', ps[0][1] <= lam0)
tR = complex(-S2f / (2 * ALf), math.sqrt(2 + 4 * S2f) / (2 * ALf)); lR = 1j * lam0
fqs = lambda t: ALf * t * t + S2f * t + 1; fqb = lambda t: (1 - S2f) * t * t - S2f * t + 1
for _ in range(80):
    tR -= (fqs(tR) - lR * fqb(tR)) / ((2 * ALf * tR + S2f) - lR * (2 * (1 - S2f) * tR - S2f))
tauE = abs(tR) + 1e-7
tau = ip(tauE); a_ = isub(iadd(imul(ip(2.0), isqr(isqr(tau))), imul(ip(4.0), isqr(tau))), ip(1.0))
c = idiv(isub(isqr(tau), isqrt(a_)), imul(ip(2.0), tau)); s = isqrt(isub(ip(1.0), isqr(c)))
t1 = (imul(tau, c), imul(tau, s)); ps = zdiv(qs(t1), qb(t1))
okR = zabs(ps)[1] <= lam0 and tauE < cAbs[0]; ok &= okR; print('right boundary ok:', okR)
tw = (math.sqrt(6) - math.sqrt(2)) / 2; W1 = (tw - 0.004, tw + 0.004)
regs = [cover('circle', thS, math.pi, 400, lambda t: circleBox(I(t[0], PI[1] if t[1] == math.pi else t[1])), N0),
        cover('Gamma-', tau0[0], tauE, 400, lambda t: gammaBox(t, -1), N0),
        cover('Gamma+ (theta>pi/4)', tau0[0], W1[0], 400, lambda t: gammaBox(t, 1), N0),
        cover('Gamma+ (theta<pi/4)', W1[1], r1[1], 400, lambda t: gammaBox(I(t[0], min(t[1], r1[1])), 1), N0)]
ok &= all(not f for f, _ in regs)
ok &= [sorted(sg) for _, sg in regs] == [[1], [1], [1], [-1]]
# ---------- -1 window: forward-mode AD over intervals ----------
def D(v, d): return (v, d)
dc = lambda v: (ip(v), ip(0.0))
dadd = lambda a, b: (iadd(a[0], b[0]), iadd(a[1], b[1])); dsub = lambda a, b: (isub(a[0], b[0]), isub(a[1], b[1]))
dmul = lambda a, b: (imul(a[0], b[0]), iadd(imul(a[1], b[0]), imul(a[0], b[1])))
def ddiv(a, b):
    qv = idiv(a[0], b[0]); return (qv, idiv(isub(a[1], imul(qv, b[1])), b[0]))
def dsqrt(a):
    r = isqrt(a[0]); return (r, idiv(a[1], imul(ip(2.0), r)))
dneg = lambda a: (ineg(a[0]), ineg(a[1]))
CD = lambda re, im=None: (re, dc(0.0) if im is None else im)
cadd = lambda a, b: (dadd(a[0], b[0]), dadd(a[1], b[1])); csub = lambda a, b: (dsub(a[0], b[0]), dsub(a[1], b[1]))
cmul = lambda a, b: (dsub(dmul(a[0], b[0]), dmul(a[1], b[1])), dadd(dmul(a[0], b[1]), dmul(a[1], b[0])))
def cdiv(a, b):
    den = dadd(dmul(b[0], b[0]), dmul(b[1], b[1])); n = cmul(a, (b[0], dneg(b[1])))
    return (ddiv(n[0], den), ddiv(n[1], den))
def mAD(tI):
    tau = (tI, ip(1.0)); one = dc(1.0); t2 = dmul(tau, tau)
    rt = dsqrt(dsub(dadd(dmul(dc(2.0), dmul(t2, t2)), dmul(dc(4.0), t2)), one))
    c = ddiv(dadd(t2, rt), dmul(dc(2.0), tau)); s = dsqrt(dsub(one, dmul(c, c)))
    t1 = (dmul(tau, c), dmul(tau, s)); O = CD(one)
    P = cmul(csub(O, t1), csub(csub(O, cmul(CD(dc(2.0)), t1)), cmul(t1, t1)))
    Bv = cmul(cmul(t1, cadd(O, t1)), cadd(O, cmul(t1, t1)))
    xx = cdiv(P, Bv)[0]; negx = dneg(xx)
    sA = dmul(dc(2.0), dmul(tau, c)); pA = dmul(tau, tau)
    sB = dsub(dneg(ddiv(dsub(xx, one), xx)), sA); pB = dneg(ddiv(one, dmul(xx, pA)))
    QB = cadd(csub(cmul(t1, t1), cmul(CD(sB), t1)), CD(pB))
    h = cdiv(cmul(csub(O, t1), t1), cmul(CD(negx), QB))
    m = ddiv(h[1], t1[1])
    return m, idiv(ineg(c[1]), s[0])
minMp = INF; maxThp = 0.0; sg = set(); maxE = 0.0; minQ = INF
for j in range(400):
    tI = I(W1[0] + (W1[1] - W1[0]) * j / 400, W1[0] + (W1[1] - W1[0]) * (j + 1) / 400)
    m, thp = mAD(tI)
    if m[1][0] <= 0 <= m[1][1]: sg.add(0); continue
    sg.add(1 if m[1][0] > 0 else -1); minMp = min(minMp, abs(m[1][0]), abs(m[1][1]))
    maxThp = max(maxThp, iabs(thp)[1])
    bx = gammaBox(tI, 1); maxE = max(maxE, bx['e'][1]); minQ = min(minQ, bx['q'][0])
lenN = 2 * maxE * minQ ** (-N0) * maxThp / minMp
okW = sg == {-1} and lenN * N0 < math.pi * (1 - 1e-9) and N0 >= 1 / math.log(minQ)
print(f'-1 window: sign m\'={sg} min|m\'|={minMp:.4g} max|dth/dtau|={maxThp:.4g} max e={maxE:.4g} min q={minQ:.4g} N*len={lenN*N0:.3g} ok={okW}')
ok &= okW
# ---------- lambda window ----------
def tLam(lam):
    a = zsub(Z(al), zsc(alp, lam)); b = zadd(Z(s2), zsc(s2, lam)); cq = zsub(ONE, lam)
    mD = zsub(zmul(zmul(zr(4.0), a), cq), zmul(b, b)); sq = zsqrtRH(mD)
    return zdiv(zadd(zneg(b), (ineg(sq[1]), sq[0])), zmul(zr(2.0), a))
qsdd = Z(imul(ip(2.0), al)); qbdd = Z(imul(ip(2.0), alp))
def lamQuant(lam):
    t = tLam(lam); qbt = qb(t); qbdt = qbd(t); qsdt = qsd(t)
    den1 = zsub(qsdt, zmul(lam, qbdt)); Dv = zmul(qbt, den1); num = zmul(zsub(ONE, t), t)
    U = zdiv(num, Dv); tp = zdiv(qbt, den1); g = zdiv(tp, t)
    Dt = zadd(zmul(qbdt, den1), zmul(qbt, zsub(qsdd, zmul(lam, qbdd)))); Dl = zneg(zmul(qbt, qbdt))
    Up = zdiv(zsub(zmul(zmul(zsub(ONE, zmul(zr(2.0), t)), tp), Dv), zmul(num, zadd(zmul(Dt, tp), Dl))), zmul(Dv, Dv))
    return U, g, Up
def E2(W):
    r = isqrt(iadd(isqr(W[0]), isqr(W[1])))
    if r[0] > 0.25: return zdiv(zsub(ONE, zexp(zneg(W))), W)
    base = zadd(zsub(ONE, zsc(ip(0.5), W)), zsc(idiv(ip(1.0), ip(6.0)), zmul(W, W)))
    rr = imul(imul(isqr(r), r), imul(idiv(ip(1.0), ip(24.0)), iexp(r)))[1]
    return (iadd(base[0], I(-rr, rr)), iadd(base[1], I(-rr, rr)))
Zc = 2.0; Nnear = 0.0
for name, dirv in (('left', Z(ip(1.0))), ('right', Z(ip(0.0), ip(1.0)))):
    D2 = 0.0
    for j in range(200):
        rI = I(-lam0 + 2 * lam0 * j / 200, -lam0 + 2 * lam0 * (j + 1) / 200)
        D2 = max(D2, 2 * zabs(lamQuant(zsc(rI, dirv))[2])[1])
    gH = None; okr = True; wb = INF; wc = INF
    for j in range(100):
        rlo, rhi = lam0 * j / 100, lam0 * (j + 1) / 100
        g1 = lamQuant(zsc(I(rlo, rhi), dirv))[1]; g2 = lamQuant(zsc(I(-rhi, -rlo), dirv))[1]
        add = (ihull(g1[0], g2[0]), ihull(g1[1], g2[1]))
        gH = add if gH is None else (ihull(gH[0], add[0]), ihull(gH[1], add[1]))
        L = zsc(ip(-2.0), gH); lam = zsc(I(rlo, rhi), dirv)
        Um = lamQuant(zneg(lam))[0]; Aq = zmul(Um, L); dL = zmul(dirv, L); absL = zabs(L)
        smax = Zc / absL[0]; beta = INF
        for k in range(60):
            W = zsc(I(smax * k / 60, smax * (k + 1) / 60), dL)
            beta = min(beta, zmul(Aq, E2(W))[0][0])
        if not beta > 0: okr = False
        wb = min(wb, beta); Nnear = max(Nnear, D2 / beta if beta > 0 else INF)
        absU = zabs(Um); cosPsi = idiv(zmul(Um, zconj(dirv))[0], absU)[0]; cosPhi = idiv(dL[0], zabs(dL))[0]
        margin = cosPsi - math.exp(-Zc * cosPhi) * (1 + 1e-12)
        c2 = (absU[0] / rhi) * margin - D2
        if not (margin > 0 and c2 > 0): okr = False
        wc = min(wc, c2)
    print(f'lambda-window {name}: D2={D2:.4f} min beta={wb:.4f} min case2 slack={wc:.4f} ok={okr}')
    ok &= okr
print(f'lambda-window needs N > {Nnear:.2f}')
ok &= N0 > Nnear
print(f'CERTIFICATE PASSED for all N >= {N0} (n >= {N0-2})' if ok else 'CERTIFICATE FAILED')
