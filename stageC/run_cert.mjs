// Driver: node run_cert.mjs N0 lam0
import * as K from './cert.mjs';
const { I, ip, iadd, isub, imul, idiv, isqrt, isqr, icos, isin, Z, zr, zadd, zsub, zmul, zdiv, zabs, zsqrtRH, zexp, zsc, zneg, zconj, s2, al, alp, qs, qb, qsd, qbd, tau0, r1, cAbs, evalBox, farCheck, cover, circleBox, gammaBox, PI, ONE, iexp, ineg, iabs, ihull } = K;
const N0 = Number(process.argv[2] || 20), lam0 = Number(process.argv[3] || 0.05);
console.log(`=== certificate run: N0 = ${N0} (N = n+2), lambda0 = ${lam0} ===`);
let allOK = true;
// ---------------- window boundaries ----------------
// left (circle): t(lam0) = root of q* - lam0 q_b ; real quadratic A t^2 + B t + C
const fl = (v) => { const A = 1 + Math.SQRT2 + (Math.SQRT2 - 1) * v, B = Math.SQRT2 * (1 + v), C = 1 - v; return [-B / (2 * A), Math.sqrt(4 * A * C - B * B) / (2 * A)]; };
const tL = fl(lam0); const thL = Math.atan2(tL[1], tL[0]); const thS = thL - 1e-7;
// certify psi(t1(thS)) <= lam0 (circle side: psi increases with theta)
{
  const th = ip(thS); const c = icos(th), s = isin(th); const tau = iadd(c, isqrt(iadd(ip(1), isqr(c))));
  const t1 = Z(imul(tau, c), imul(tau, s)); const ps = zdiv(qs(t1), qb(t1));
  const ok = ps.re.hi <= lam0; console.log(`left boundary theta_s=${thS.toFixed(9)} psi in [${ps.re.lo}, ${ps.re.hi}] <= lam0: ${ok}`); allOK &&= ok;
}
// right (Gamma, - branch): t(i lam0) root of q* - i lam0 q_b, Newton from c
const C = { add: (p, q) => [p[0] + q[0], p[1] + q[1]], sub: (p, q) => [p[0] - q[0], p[1] - q[1]], mul: (p, q) => [p[0] * q[0] - p[1] * q[1], p[0] * q[1] + p[1] * q[0]], div: (p, q) => { const d = q[0] ** 2 + q[1] ** 2; return [(p[0] * q[0] + p[1] * q[1]) / d, (p[1] * q[0] - p[0] * q[1]) / d]; } };
const S2 = Math.SQRT2, AL = 1 + S2;
const fqs = (t) => C.add(C.add(C.mul([AL, 0], C.mul(t, t)), [S2 * t[0], S2 * t[1]]), [1, 0]), fqb = (t) => C.add(C.add(C.mul([1 - S2, 0], C.mul(t, t)), [-S2 * t[0], -S2 * t[1]]), [1, 0]);
const fqsd = (t) => [2 * AL * t[0] + S2, 2 * AL * t[1]], fqbd = (t) => [2 * (1 - S2) * t[0] - S2, 2 * (1 - S2) * t[1]];
let tR = [-S2 / (2 * AL), Math.sqrt(2 + 4 * S2) / (2 * AL)]; const lamR = [0, lam0];
for (let i = 0; i < 80; i++) tR = C.sub(tR, C.div(C.sub(fqs(tR), C.mul(lamR, fqb(tR))), C.sub(fqsd(tR), C.mul(lamR, fqbd(tR)))));
const tauE = Math.hypot(...tR) + 1e-7;
{
  const tau = ip(tauE); const a = isub(iadd(imul(ip(2), isqr(isqr(tau))), imul(ip(4), isqr(tau))), ip(1));
  const c = idiv(isub(isqr(tau), isqrt(a)), imul(ip(2), tau)); const s = isqrt(isub(ip(1), isqr(c)));
  const t1 = Z(imul(tau, c), imul(tau, s)); const ps = zdiv(qs(t1), qb(t1));
  const ok = zabs(ps).hi <= lam0; console.log(`right boundary tau_e=${tauE.toFixed(9)} |psi| <= ${zabs(ps).hi} <= lam0: ${ok}; |c|=${cAbs.lo}`); allOK &&= ok && tauE < cAbs.lo;
}
// ---------------- -1 window (tau on + branch) ----------------
const tw = 0.5176380902050415; // (sqrt6-sqrt2)/2 = |t1| at x=-1
const W1 = [tw - 0.004, tw + 0.004];
// ---------------- far region covers ----------------
const res = [];
res.push(['circle', K.cover('circle theta', thS, Math.PI, 400, (th) => circleBox(I(th.lo, th.hi === Math.PI ? K.PI.hi : th.hi)), N0)]);
res.push(['gamma-', K.cover('Gamma - branch tau', tau0.lo, tauE, 400, (t) => gammaBox(t, -1), N0)]);
res.push(['gamma+a', K.cover('Gamma + branch tau (theta>pi/4 side)', tau0.lo, W1[0], 400, (t) => gammaBox(t, +1), N0)]);
res.push(['gamma+b', K.cover('Gamma + branch tau (theta<pi/4 side)', W1[1], r1.hi, 400, (t) => gammaBox(I(t.lo, Math.min(t.hi, r1.hi)), +1), N0)]);
for (const [nm, r] of res) { if (r.fails.length) allOK = false; }
const sg = res.map(([nm, r]) => `${nm}:${[...r.signs]}`).join(' ');
console.log('sign(m) per region:', sg, '(expected circle,gamma-,gamma+a: +1 ; gamma+b: -1)');
allOK &&= [...res[0][1].signs].join() === '1' && [...res[1][1].signs].join() === '1' && [...res[2][1].signs].join() === '1' && [...res[3][1].signs].join() === '-1';
// ---------------- -1 window: AD in tau ----------------
const D = (v, d) => ({ v, d });
const dc = (x) => D(ip(x), ip(0));
const dadd = (a, b) => D(iadd(a.v, b.v), iadd(a.d, b.d)), dsub = (a, b) => D(isub(a.v, b.v), isub(a.d, b.d));
const dmul = (a, b) => D(imul(a.v, b.v), iadd(imul(a.d, b.v), imul(a.v, b.d)));
const ddiv = (a, b) => { const q = idiv(a.v, b.v); return D(q, idiv(isub(a.d, imul(q, b.d)), b.v)); };
const dsqrt = (a) => { const r = isqrt(a.v); return D(r, idiv(a.d, imul(ip(2), r))); };
const dneg = (a) => D(ineg(a.v), ineg(a.d));
const CD = (re, im = dc(0)) => ({ re, im });
const cadd = (a, b) => CD(dadd(a.re, b.re), dadd(a.im, b.im)), csub = (a, b) => CD(dsub(a.re, b.re), dsub(a.im, b.im));
const cmul = (a, b) => CD(dsub(dmul(a.re, b.re), dmul(a.im, b.im)), dadd(dmul(a.re, b.im), dmul(a.im, b.re)));
const cdiv = (a, b) => { const den = dadd(dmul(b.re, b.re), dmul(b.im, b.im)); const n = cmul(a, CD(b.re, dneg(b.im))); return CD(ddiv(n.re, den), ddiv(n.im, den)); };
const creal = (x) => CD(x);
function mAD(tauI) {
  const tau = D(tauI, ip(1)); const one = dc(1);
  const t2 = dmul(tau, tau); const rt = dsqrt(dsub(dadd(dmul(dc(2), dmul(t2, t2)), dmul(dc(4), t2)), one));
  const c = ddiv(dadd(t2, rt), dmul(dc(2), tau)); const s = dsqrt(dsub(one, dmul(c, c)));
  const t1 = CD(dmul(tau, c), dmul(tau, s)); const ONEc = creal(one);
  const P = cmul(csub(ONEc, t1), csub(csub(ONEc, cmul(creal(dc(2)), t1)), cmul(t1, t1)));
  const Bv = cmul(cmul(t1, cadd(ONEc, t1)), cadd(ONEc, cmul(t1, t1)));
  const x = cdiv(P, Bv).re; const negx = dneg(x);
  const sA = dmul(dc(2), dmul(tau, c)), pA = dmul(tau, tau);
  const sB = dsub(dneg(ddiv(dsub(x, one), x)), sA), pB = dneg(ddiv(one, dmul(x, pA)));
  const QB = cadd(csub(cmul(t1, t1), cmul(creal(sB), t1)), creal(pB));
  const h = cdiv(cmul(csub(ONEc, t1), t1), cmul(creal(negx), QB));
  const m = ddiv(h.im, t1.im);
  // d theta / d tau = -c'(tau)/sin(theta)  (theta = arccos c)
  return { m, thp: idiv(ineg(c.d), s.v) };
}
{
  const K1 = 400; let minAbsMp = Infinity, maxThp = 0, sgnMp = new Set(), maxE = 0, minQ = Infinity, mEnds = [];
  for (let j = 0; j < K1; j++) {
    const tI = I(W1[0] + (W1[1] - W1[0]) * j / K1, W1[0] + (W1[1] - W1[0]) * (j + 1) / K1);
    const r = mAD(tI); if (r.m.d.lo <= 0 && r.m.d.hi >= 0) { sgnMp.add(0); continue; }
    sgnMp.add(Math.sign(r.m.d.lo)); minAbsMp = Math.min(minAbsMp, Math.min(Math.abs(r.m.d.lo), Math.abs(r.m.d.hi)));
    maxThp = Math.max(maxThp, iabs(r.thp).hi);
    const b = gammaBox(tI, +1); maxE = Math.max(maxE, b.e.hi); minQ = Math.min(minQ, b.q.lo);
  }
  // failure set length in theta <= 2*maxE*minQ^-N * maxThp / minAbsMp ; need < pi/N for all N>=N0
  const lenAt = (N) => 2 * maxE * Math.pow(minQ, -N) * maxThp / minAbsMp;
  const okW = !sgnMp.has(0) && sgnMp.size === 1 && lenAt(N0) * N0 < Math.PI * (1 - 1e-9) && N0 >= 1 / Math.log(minQ);
  console.log(`-1 window tau in [${W1}]: sign m'=${[...sgnMp]} min|m'|=${minAbsMp.toExponential(3)} max|dtheta/dtau|=${maxThp.toFixed(3)} max e=${maxE.toFixed(3)} min q=${minQ.toFixed(3)}  N*len(N0)=${(lenAt(N0) * N0).toExponential(3)} < pi : ${okW}`);
  allOK &&= okW;
}
// ---------------- lambda-window around x* ----------------
function tLam(lam) { // complex interval lam -> t(lam) (root near c)
  const a = zsub(Z(al), zsc(alp, lam)); const b = zadd(Z(s2), zsc(s2, lam)); const cq = zsub(ONE, lam);
  const mD = zsub(zmul(zmul(zr(4), a), cq), zmul(b, b)); // -D
  const sq = zsqrtRH(mD); const num = zadd(zneg(b), Z(ineg(sq.im), sq.re)); // -b + i*sqrt(-D)
  return zdiv(num, zmul(zr(2), a));
}
const qsdd = Z(imul(ip(2), al)), qbdd = Z(imul(ip(2), alp));
function lamQuant(lam) {
  const t = tLam(lam); const qbt = qb(t), qbdt = qbd(t), qsdt = qsd(t);
  const den1 = zsub(qsdt, zmul(lam, qbdt)); // q*' - lam q_b'
  const Dv = zmul(qbt, den1); const num = zmul(zsub(ONE, t), t);
  const U = zdiv(num, Dv);
  const tp = zdiv(qbt, den1); const g = zdiv(tp, t);
  const Dt = zadd(zmul(qbdt, den1), zmul(qbt, zsub(qsdd, zmul(lam, qbdd))));
  const Dl = zneg(zmul(qbt, qbdt));
  const Up = zdiv(zsub(zmul(zmul(zsub(ONE, zmul(zr(2), t)), tp), Dv), zmul(num, zadd(zmul(Dt, tp), Dl))), zmul(Dv, Dv));
  return { t, U, g, Up };
}
const E2 = (W) => { // (1-e^{-W})/W
  const r2 = isqrt(iadd(isqr(W.re), isqr(W.im)));
  if (r2.lo > 0.25) return zdiv(zsub(ONE, zexp(zneg(W))), W);
  // E2(W) = sum_k (-W)^k/(k+1)! = 1 - W/2 + W^2/6 + R, |R| <= |W|^3/24 * e^{|W|}
  const W2 = zmul(W, W); const base = zadd(zsub(ONE, zsc(ip(0.5), W)), zsc(idiv(ip(1), ip(6)), W2));
  const rr = imul(imul(isqr(r2), r2), imul(idiv(ip(1), ip(24)), iexp(r2))).hi;
  return Z(iadd(base.re, I(-rr, rr)), iadd(base.im, I(-rr, rr)));
};
const Zc = 2; // case split |W| = Zc
let Nnear = 0;
for (const [ray, dir] of [['left (lam=v)', Z(ip(1))], ['right (lam=i w)', Z(ip(0), ip(1))]]) {
  // D2 = 2 sup |U'| on segment [-lam0, lam0]*dir
  let D2 = 0; const KS = 200;
  for (let j = 0; j < KS; j++) { const r = I(-lam0 + 2 * lam0 * j / KS, -lam0 + 2 * lam0 * (j + 1) / KS); D2 = Math.max(D2, 2 * zabs(lamQuant(zsc(r, dir)).Up).hi); }
  // g hull on full segment (used for L = ell/lam = -2 avg g) -- per segment j use [-r_{j+1}, r_{j+1}]
  const KL = 100; let worstBeta = Infinity, worstCase2 = Infinity, ok = true;
  let gHull = null; // enclosure of g on the segment [-r_hi, r_hi]*dir, grown incrementally
  for (let j = 0; j < KL; j++) {
    const rlo = lam0 * j / KL, rhi = lam0 * (j + 1) / KL;
    const gr1 = lamQuant(zsc(I(rlo, rhi), dir)).g, gr2 = lamQuant(zsc(I(-rhi, -rlo), dir)).g;
    const add = { re: ihull(gr1.re, gr2.re), im: ihull(gr1.im, gr2.im) };
    gHull = gHull ? { re: ihull(gHull.re, add.re), im: ihull(gHull.im, add.im) } : add;
    const L = zsc(ip(-2), gHull); // ell/lam enclosure (hull of segment [-rhi, rhi])
    const lam = zsc(I(rlo, rhi), dir);
    const Um = lamQuant(zneg(lam)).U; // U(-lam)
    const Aq = zmul(Um, L);
    const dL = zmul(dir, L); // direction of W up to positive factor s = N|lam|
    const absL = zabs(L);
    // case 1: s in [0, Zc/|L|lo], W = s * dir * L
    const smax = Zc / absL.lo; const KSs = 60; let beta = Infinity;
    for (let k = 0; k < KSs; k++) { const sI = I(smax * k / KSs, smax * (k + 1) / KSs); const W = zsc(sI, dL); const val = zmul(Aq, E2(W)).re.lo; beta = Math.min(beta, val); }
    if (!(beta > 0)) ok = false; worstBeta = Math.min(worstBeta, beta);
    Nnear = Math.max(Nnear, D2 / beta);
    // case 2: |U(-lam)|/|lam| (cos psi - exp(-Zc cos phi)) > D2
    const absU = zabs(Um); const cosPsi = idiv(zmul(Um, zconj(dir)).re, absU).lo; const cosPhi = idiv(dL.re, zabs(dL)).lo;
    const margin = cosPsi - Math.exp(-Zc * cosPhi) * (1 + 1e-12);
    const c2 = (absU.lo / rhi) * margin - D2;
    if (!(margin > 0 && c2 > 0)) ok = false; worstCase2 = Math.min(worstCase2, c2);
  }
  console.log(`lambda-window ${ray}: D2=${D2.toFixed(4)} min beta=${worstBeta.toFixed(4)} min case2 slack=${worstCase2.toFixed(4)} ok=${ok}`);
  allOK &&= ok;
}
console.log(`lambda-window needs N > ${Nnear.toFixed(2)} ; N0=${N0}: ${N0 > Nnear}`);
allOK &&= N0 > Nnear;
console.log(allOK ? `\nCERTIFICATE PASSED for all N >= ${N0} (n >= ${N0 - 2})` : '\nCERTIFICATE FAILED');
