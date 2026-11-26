// Interval-arithmetic certificate for Stage C.  Usage: node cert.mjs N0
// Outward rounding: +,-,*,/,sqrt are IEEE correctly rounded -> widen 1 ulp.
// exp/log/cos/sin -> widen 4 ulp (assumes V8 libm error < 4 ulp).
const N0 = Number(process.argv[2] || 20);
const dv = new DataView(new ArrayBuffer(8));
function up1(x) { if (!Number.isFinite(x)) return x; if (x === 0) return Number.MIN_VALUE; dv.setFloat64(0, x); let b = dv.getBigUint64(0); b = x > 0 ? b + 1n : b - 1n; dv.setBigUint64(0, b); return dv.getFloat64(0); }
const dn1 = (x) => -up1(-x);
const up = (x, k = 1) => { for (let i = 0; i < k; i++) x = up1(x); return x; };
const dn = (x, k = 1) => { for (let i = 0; i < k; i++) x = dn1(x); return x; };
// ---------- real intervals ----------
const I = (lo, hi = lo) => { if (!(lo <= hi)) throw new Error('bad interval ' + lo + ' ' + hi); return { lo, hi }; };
const ip = (x) => I(x, x);
const iadd = (a, b) => I(dn(a.lo + b.lo), up(a.hi + b.hi));
const isub = (a, b) => I(dn(a.lo - b.hi), up(a.hi - b.lo));
const ineg = (a) => I(-a.hi, -a.lo);
const imul = (a, b) => { const p = [a.lo * b.lo, a.lo * b.hi, a.hi * b.lo, a.hi * b.hi].map((v) => (Number.isNaN(v) ? 0 : v)); return I(dn(Math.min(...p)), up(Math.max(...p))); };
const iinv = (b) => { if (b.lo <= 0 && b.hi >= 0) return I(-Infinity, Infinity); return I(dn(1 / b.hi), up(1 / b.lo)); };
const idiv = (a, b) => { if (b.lo <= 0 && b.hi >= 0) return I(-Infinity, Infinity); const p = [a.lo / b.lo, a.lo / b.hi, a.hi / b.lo, a.hi / b.hi]; return I(dn(Math.min(...p)), up(Math.max(...p))); };
const isqr = (a) => { if (a.lo >= 0) return I(dn(a.lo * a.lo), up(a.hi * a.hi)); if (a.hi <= 0) return I(dn(a.hi * a.hi), up(a.lo * a.lo)); return I(0, up(Math.max(a.lo * a.lo, a.hi * a.hi))); };
const isqrt = (a) => { const lo = Math.max(0, a.lo); if (a.hi < 0) throw new Error('sqrt of negative ' + a.hi); return I(lo === 0 ? 0 : dn(Math.sqrt(lo)), up(Math.sqrt(a.hi))); };
const iexp = (a) => I(Math.max(0, dn(Math.exp(a.lo), 4)), up(Math.exp(a.hi), 4));
const PI = I(Math.PI, up1(Math.PI));
function icos(a) {
  if (a.hi - a.lo >= 6.28) return I(-1, 1);
  let lo = Math.min(Math.cos(a.lo), Math.cos(a.hi)), hi = Math.max(Math.cos(a.lo), Math.cos(a.hi));
  lo = dn(lo, 4); hi = up(hi, 4);
  const kmin = Math.floor(a.lo / Math.PI) - 1, kmax = Math.ceil(a.hi / Math.PI) + 1;
  for (let k = kmin; k <= kmax; k++) { const lo_k = k * PI.lo, hi_k = k * PI.hi; const L = Math.min(lo_k, hi_k), H = Math.max(lo_k, hi_k); if (dn(L, 2) <= a.hi && up(H, 2) >= a.lo) { if (k % 2 === 0) hi = 1; else lo = -1; } }
  return I(Math.max(-1, lo), Math.min(1, hi));
}
const isin = (a) => icos(isub(a, imul(PI, ip(0.5))));
const ihull = (a, b) => I(Math.min(a.lo, b.lo), Math.max(a.hi, b.hi));
const iisect = (a, b) => I(Math.max(a.lo, b.lo), Math.min(a.hi, b.hi));
const iabs = (a) => (a.lo >= 0 ? a : a.hi <= 0 ? ineg(a) : I(0, Math.max(-a.lo, a.hi)));
// ---------- complex intervals ----------
const Z = (re, im = ip(0)) => ({ re, im });
const zr = (x) => Z(ip(x));
const zadd = (a, b) => Z(iadd(a.re, b.re), iadd(a.im, b.im));
const zsub = (a, b) => Z(isub(a.re, b.re), isub(a.im, b.im));
const zneg = (a) => Z(ineg(a.re), ineg(a.im));
const zmul = (a, b) => Z(isub(imul(a.re, b.re), imul(a.im, b.im)), iadd(imul(a.re, b.im), imul(a.im, b.re)));
const zsc = (s, a) => Z(imul(s, a.re), imul(s, a.im));
const zconj = (a) => Z(a.re, ineg(a.im));
const zabs2 = (a) => iadd(isqr(a.re), isqr(a.im));
const zabs = (a) => isqrt(zabs2(a));
const zdiv = (a, b) => { const d = zabs2(b); const n = zmul(a, zconj(b)); return Z(idiv(n.re, d), idiv(n.im, d)); };
const zsqrtRH = (a) => { // principal sqrt for box with Re>0
  if (a.re.lo <= 0) throw new Error('zsqrt needs Re>0'); const r = zabs(a); const re = isqrt(imul(iadd(r, a.re), ip(0.5))); return Z(re, idiv(a.im, imul(ip(2), re)));
};
const zexp = (a) => { const m = iexp(a.re); return Z(imul(m, icos(a.im)), imul(m, isin(a.im))); };
const zhull = (a, b) => Z(ihull(a.re, b.re), ihull(a.im, b.im));
const zpoly = (cs, t) => { let r = zr(0); for (let k = cs.length - 1; k >= 0; k--) r = zadd(zmul(r, t), cs[k]); return r; }; // cs complex coeffs low->high
// ---------- constants ----------
const s2 = isqrt(ip(2));
const al = iadd(ip(1), s2), alp = isub(ip(1), s2);            // alpha = 1+√2, alpha' = 1-√2
const xA = isub(ip(-4), imul(ip(3), s2)), xB = iadd(ip(-3), imul(ip(2), s2)), xS = isub(ip(-3), imul(ip(2), s2));
const cZ = (i) => Z(i); const ONE = zr(1);
const qsC = [ONE, cZ(s2), cZ(al)], qbC = [ONE, cZ(ineg(s2)), cZ(alp)];
const qsP = [cZ(s2), cZ(imul(ip(2), al))], qbP = [cZ(ineg(s2)), cZ(imul(ip(2), alp))];
const qs = (t) => zpoly(qsC, t), qb = (t) => zpoly(qbC, t), qsd = (t) => zpoly(qsP, t), qbd = (t) => zpoly(qbP, t);
const Pz = (t) => zmul(zsub(ONE, t), zsub(zsub(ONE, zmul(zr(2), t)), zmul(t, t)));
const Bz = (t) => zmul(zmul(t, zadd(ONE, t)), zadd(ONE, zmul(t, t)));
const tau0 = isqrt(imul(isub(isqrt(ip(6)), ip(2)), ip(0.5)));
const r1 = idiv(iadd(ineg(s2), isqrt(isub(imul(ip(4), s2), ip(2)))), imul(ip(2), isub(s2, ip(1)))); // positive root of q_b
const cAbs = isqrt(isub(s2, ip(1)));                                                               // |c|
// ---------- core evaluation for a box of t1 = tau*(c + i s) ----------
function evalBox(tau, c, s, opts = {}) {
  const t1 = Z(imul(tau, c), imul(tau, s));
  const x = zdiv(Pz(t1), Bz(t1)).re;                                   // x = R(t1), real
  if (x.hi >= 0) throw new Error('x not negative');
  const sA = imul(ip(2), imul(tau, c)), pA = isqr(tau);
  const sB = isub(ineg(idiv(isub(x, ip(1)), x)), sA), pB = ineg(iinv(imul(x, pA)));
  const disc = isub(imul(ip(4), pB), isqr(sB));
  // true disc >= 0 for valid points (= 0 only at theta = 0, where pair 2 is the double root r2)
  if (disc.hi < 0) return { ok: false, why: 'disc' };
  const im2 = imul(isqrt(I(Math.max(0, disc.lo), disc.hi)), ip(0.5)), re2 = imul(sB, ip(0.5));
  const t2 = Z(re2, im2), rho1 = tau, rho2 = isqrt(pB);
  const q = idiv(rho2, rho1);
  // m = Im h(t1)/Im t1 ; and hull of Re h' on vertical segment
  const QB = (t) => zadd(zsub(zmul(t, t), zsc(sB, t)), Z(pB));
  const QA = (t) => zadd(zsub(zmul(t, t), zsc(sA, t)), Z(pA));
  const negx = ineg(x);
  const h = (t) => zdiv(zmul(zsub(ONE, t), t), zsc(negx, QB(t)));
  const hp = (t) => { const qv = QB(t), qd = zsub(zmul(zr(2), t), Z(sB)); const num = zsub(zmul(zsub(ONE, zmul(zr(2), t)), qv), zmul(zmul(zsub(ONE, t), t), qd)); return zdiv(num, zsc(negx, zmul(qv, qv))); };
  let m = idiv(h(t1).im, t1.im);
  const seg = Z(t1.re, I(-t1.im.hi, t1.im.hi));
  const mh = hp(seg).re;
  m = Number.isFinite(m.lo) && Number.isFinite(m.hi) ? iisect(m, mh) : mh;
  // pair-2 bounds
  const h2 = (t) => zdiv(zmul(zsub(ONE, t), t), zsc(negx, QA(t)));
  const h2p = (t) => { const qv = QA(t), qd = zsub(zmul(zr(2), t), Z(sA)); const num = zsub(zmul(zsub(ONE, zmul(zr(2), t)), qv), zmul(zmul(zsub(ONE, t), t), qd)); return zdiv(num, zsc(negx, zmul(qv, qv))); };
  const e = idiv(zabs(h2(t2)), im2);                                   // 2|u2| = |h2(t2)|/Im t2
  let arc = null;
  if (opts.arc && re2.hi < 0) { // arc from theta2 to pi at radius rho2: theta2 >= pi - Im/|Re|
    const th2lo = isub(PI, idiv(im2, iabs(re2))).lo;
    if (th2lo >= Math.PI / 2) {
      let S0 = 0, S1 = 0; const K = 16;
      for (let j = 0; j < K; j++) {
        const ph = I(th2lo + (Math.PI - th2lo) * j / K, j === K - 1 ? PI.hi : th2lo + (Math.PI - th2lo) * (j + 1) / K);
        const z = Z(imul(rho2, icos(ph)), imul(rho2, isin(ph)));
        S0 = Math.max(S0, zabs(h2(z)).hi); S1 = Math.max(S1, zabs(h2p(z)).hi);
      }
      arc = { S0, S1 };
    }
  }
  return { ok: true, x, m, e, q, rho1, rho2, arc, t1, t2, im2 };
}
function farCheck(r, N) { // returns {ok, sign}
  if (!r.ok) return { ok: false };
  const m = r.m; if (m.lo <= 0 && m.hi >= 0) return { ok: false, why: 'm0' };
  if (r.q.lo <= 1) return { ok: false, why: 'q' };
  const am = Math.min(Math.abs(m.lo), Math.abs(m.hi));
  const lhs = am * Math.pow(r.q.lo, N) * (1 - 1e-12);
  if (Number.isFinite(r.e.hi) && lhs > r.e.hi * (1 + 1e-12)) return { ok: true, sign: Math.sign(m.lo), how: 'e' };
  if (r.arc) { // need |m| q^N > (pi/2)(S1 + N S0/rho2) and increment condition
    const rhs = (Math.PI / 2 + 1e-12) * (r.arc.S1 + N * r.arc.S0 / r.rho2.lo);
    const inc = am * Math.pow(r.q.lo, N) * (r.q.lo - 1) > (Math.PI / 2 + 1e-12) * r.arc.S0 / r.rho2.lo;
    if (lhs > rhs * (1 + 1e-12) && inc) return { ok: true, sign: Math.sign(m.lo), how: 'arc' };
  }
  return { ok: false, why: 'ratio' };
}
// box generators
const circleBox = (th) => { const c = icos(th), s = isin(th); return evalBox(iadd(c, isqrt(iadd(ip(1), isqr(c)))), c, s, { arc: true }); };
const gammaBox = (tau, branch) => { // branch +1 or -1
  // c+ strictly increasing, c- strictly decreasing in tau (Step 4b): enclose by endpoint values
  // sqrt argument clamped at 0: valid points have tau >= tau0 where it is >= 0
  const cAt = (t) => { const a = isub(iadd(imul(ip(2), isqr(isqr(t))), imul(ip(4), isqr(t))), ip(1)); const r = isqrt(I(Math.max(0, a.lo), Math.max(0, a.hi))); return idiv(branch > 0 ? iadd(isqr(t), r) : isub(isqr(t), r), imul(ip(2), t)); };
  let c = ihull(cAt(I(tau.lo, Math.max(tau.lo, tau0.hi))), cAt(ip(tau.hi)));
  c = I(Math.max(c.lo, -1), Math.min(c.hi, 1));
  const s = isqrt(isub(ip(1), isqr(c)));
  return evalBox(tau, c, s, { arc: true });
};
function cover(name, lo, hi, nInit, mk, N, maxDepth = 18) {
  let stack = []; for (let i = 0; i < nInit; i++) stack.push([lo + (hi - lo) * i / nInit, i === nInit - 1 ? hi : lo + (hi - lo) * (i + 1) / nInit, 0]);
  let nBox = 0, fails = [], signs = new Set(), how = { e: 0, arc: 0 };
  while (stack.length) {
    const [a, b, d] = stack.pop(); nBox++;
    let res; try { res = farCheck(mk(I(a, b)), N); } catch (err) { res = { ok: false, why: String(err.message) }; }
    if (res.ok) { signs.add(res.sign); how[res.how]++; continue; }
    if (d >= maxDepth) { fails.push([a, b, res.why]); continue; }
    const mid = (a + b) / 2; stack.push([a, mid, d + 1], [mid, b, d + 1]);
  }
  console.log(`${name}: [${lo}, ${hi}] boxes=${nBox} fails=${fails.length} signs(m)=${[...signs]} via ${JSON.stringify(how)}`);
  if (fails.length) console.log('   first fails:', JSON.stringify(fails.slice(0, 6)));
  return { fails, signs };
}
export { I, ip, iadd, isub, imul, idiv, isqrt, isqr, icos, isin, Z, zr, zadd, zsub, zmul, zdiv, zabs, zsqrtRH, zexp, zsc, zneg, zconj, zhull, s2, al, alp, xA, xB, xS, qs, qb, qsd, qbd, tau0, r1, cAbs, evalBox, farCheck, cover, circleBox, gammaBox, PI, ONE, iexp, ineg, iabs, ihull, iisect };
