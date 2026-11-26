// Exact verification (BigInt rationals, Q(sqrt2)) + float numerics, for the Delannoy^2 lemma.
const B = (v) => BigInt(v);
const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
// ---------- rationals ----------
const R = (n, d = 1n) => { n = B(n); d = B(d); if (d < 0n) { n = -n; d = -d; } const g = gcd(n, d) || 1n; return { n: n / g, d: d / g }; };
const radd = (x, y) => R(x.n * y.d + y.n * x.d, x.d * y.d);
const rmul = (x, y) => R(x.n * y.n, x.d * y.d);
const rneg = (x) => R(-x.n, x.d);
const rzero = (x) => x.n === 0n;
// ---------- Q(sqrt2): a + b*s ----------
const K = (a, b = 0) => ({ a: typeof a === 'object' ? a : R(a), b: typeof b === 'object' ? b : R(b) });
const kadd = (x, y) => K(radd(x.a, y.a), radd(x.b, y.b));
const kmul = (x, y) => K(radd(rmul(x.a, y.a), rmul(R(2), rmul(x.b, y.b))), radd(rmul(x.a, y.b), rmul(x.b, y.a)));
const kneg = (x) => K(rneg(x.a), rneg(x.b));
const kzero = (x) => rzero(x.a) && rzero(x.b);
const kinv = (x) => { // 1/(a+bs) = (a-bs)/(a^2-2b^2)
  const nrm = radd(rmul(x.a, x.a), rneg(rmul(R(2), rmul(x.b, x.b))));
  const ni = R(nrm.d, nrm.n);
  return K(rmul(x.a, ni), rmul(rneg(x.b), ni));
};
const kstr = (x) => `${x.a.n}/${x.a.d} + (${x.b.n}/${x.b.d})√2`;
// ---------- multivariate polys over Q(sqrt2): Map "e0,e1,.." -> K ----------
const NV = 3; // variables: 0=x (or t), 1=t (or u), 2=v
const P = (terms) => { const m = new Map(); for (const [e, c] of terms) addTerm(m, e, c); return m; };
function addTerm(m, e, c) { const k = e.join(','); const old = m.get(k); const nv = old ? kadd(old, c) : c; if (kzero(nv)) m.delete(k); else m.set(k, nv); }
const padd = (p, q) => { const m = new Map(p); for (const [k, c] of q) addTerm(m, k.split(',').map(Number), c); return m; };
const pneg = (p) => { const m = new Map(); for (const [k, c] of p) m.set(k, kneg(c)); return m; };
const psub = (p, q) => padd(p, pneg(q));
const pmul = (p, q) => { const m = new Map(); for (const [k1, c1] of p) for (const [k2, c2] of q) { const e1 = k1.split(',').map(Number), e2 = k2.split(',').map(Number); addTerm(m, e1.map((v, i) => v + e2[i]), kmul(c1, c2)); } return m; };
const pconst = (c) => P([[[0, 0, 0], c]]);
const pvar = (i) => { const e = [0, 0, 0]; e[i] = 1; return P([[e, K(1)]]); };
const pis0 = (p) => p.size === 0;
const ppow = (p, n) => { let r = pconst(K(1)); for (let i = 0; i < n; i++) r = pmul(r, p); return r; };
const check = (name, ok) => { console.log((ok ? 'OK   ' : 'FAIL ') + name); if (!ok) process.exitCode = 1; };

const S2 = K(0, 1);               // sqrt2
const a = K(-4, -3), b = K(-3, 2), xs = K(-3, -2);   // a=-4-3√2, b=-3+2√2, x*=-3-2√2
const X = pvar(0), T = pvar(1), V = pvar(2);
const one = pconst(K(1));
const c = (k) => pconst(k);

// ================= PART A: claim 1 =================
// Delannoy triangle by recurrence, square, row polys (integers)
const N = 14;
const D = Array.from({ length: N }, () => Array(N).fill(0n));
for (let n = 0; n < N; n++) for (let k = 0; k <= n; k++) {
  if (k === 0 || k === n) D[n][k] = 1n;
  else D[n][k] = D[n - 1][k - 1] + D[n - 1][k] + (n >= 2 ? D[n - 2][k - 1] : 0n);
}
const D2 = Array.from({ length: N }, (_, n) => Array.from({ length: N }, (_, k) => { let s = 0n; for (let j = 0; j < N; j++) s += D[n][j] * D[j][k]; return s; }));
// series of (1-t)/Den: S_n = [n==0] - [n==1] + (x+3)S_{n-1} + (x-1)(S_{n-2}+S_{n-3}) + x S_{n-4}
const uadd = (p, q) => { const r = Array(Math.max(p.length, q.length)).fill(0n); p.forEach((v, i) => r[i] += v); q.forEach((v, i) => r[i] += v); return r; };
const umul = (p, q) => { const r = Array(p.length + q.length - 1).fill(0n); p.forEach((u, i) => q.forEach((w, j) => r[i + j] += u * w)); return r; };
const S = [];
for (let n = 0; n < N; n++) {
  let s = [n === 0 ? 1n : n === 1 ? -1n : 0n];
  if (n >= 1) s = uadd(s, umul([3n, 1n], S[n - 1]));
  if (n >= 2) s = uadd(s, umul([-1n, 1n], S[n - 2]));
  if (n >= 3) s = uadd(s, umul([-1n, 1n], S[n - 3]));
  if (n >= 4) s = uadd(s, umul([0n, 1n], S[n - 4]));
  S.push(s);
}
let okA = true;
for (let n = 0; n < N; n++) for (let k = 0; k < N; k++) if ((S[n][k] ?? 0n) !== D2[n][k]) okA = false;
check(`claim1: [t^n](1-t)/Den == row polys of D^2 for n<${N}`, okA);
check('G_3 = x^3+10x^2+25x+12', S[3].join(',') === '12,25,10,1');
// Den expanded form
const Pt = pmul(pmul(psub(one, T), psub(psub(one, pmul(c(K(2)), T)), pmul(T, T))), one);
const Bt = pmul(pmul(T, padd(one, T)), padd(one, pmul(T, T)));
const Den = psub(Pt, pmul(X, Bt));
const DenExp = P([[[0, 0, 0], K(1)]]);
const DenExp2 = psub(psub(psub(psub(DenExp, pmul(padd(X, c(K(3))), T)), pmul(psub(X, one), ppow(T, 2))), pmul(psub(X, one), ppow(T, 3))), pmul(X, ppow(T, 4)));
check('claim1: (1-t)(1-2t-t^2) - x t(1+t)(1+t^2) = 1-(x+3)t-(x-1)t^2-(x-1)t^3-x t^4', pis0(psub(Den, DenExp2)));

// ================= PART B: claim 2 (discriminant) =================
// quartic disc formula, validated on (t-1)(t-2)(t-3)(t-5)
const disc4 = (A, Bq, C, Dq, E, mul, add, sc) => {
  const m = (...xs) => xs.reduce((p, q) => mul(p, q));
  const t = [
    [256n, m(A, A, A, E, E, E)], [-192n, m(A, A, Bq, Dq, E, E)], [-128n, m(A, A, C, C, E, E)], [144n, m(A, A, C, Dq, Dq, E)],
    [-27n, m(A, A, Dq, Dq, Dq, Dq)], [144n, m(A, Bq, Bq, C, E, E)], [-6n, m(A, Bq, Bq, Dq, Dq, E)], [-80n, m(A, Bq, C, C, Dq, E)],
    [18n, m(A, Bq, C, Dq, Dq, Dq)], [16n, m(A, C, C, C, C, E)], [-4n, m(A, C, C, C, Dq, Dq)], [-27n, m(Bq, Bq, Bq, Bq, E, E)],
    [18n, m(Bq, Bq, Bq, C, Dq, E)], [-4n, m(Bq, Bq, Bq, Dq, Dq, Dq)], [-4n, m(Bq, Bq, C, C, C, E)], [1n, m(Bq, Bq, C, C, Dq, Dq)]];
  return t.map(([k, v]) => sc(k, v)).reduce(add);
};
{ // test: roots 1,2,3,5: t^4 - 11t^3 + 41t^2 - 61t + 30
  const d = disc4(1n, -11n, 41n, -61n, 30n, (p, q) => p * q, (p, q) => p + q, (k, v) => k * v);
  const r = [1n, 2n, 3n, 5n]; let pr = 1n; for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) pr *= (r[i] - r[j]) ** 2n;
  check('quartic discriminant formula validated on roots {1,2,3,5}', d === pr);
}
const usc = (k, v) => v.map((w) => w * k);
const disc = disc4([0n, -1n], [1n, -1n], [1n, -1n], [-3n, -1n], [1n], umul, uadd, usc);
const target = usc(-16n, umul(umul([1n, 6n, 1n], [1n, 6n, 1n]), [-2n, 8n, 1n]));
const trim = (p) => { p = [...p]; while (p.length && p[p.length - 1] === 0n) p.pop(); return p.join(','); };
check('claim2: disc_t(Den) = -16 (x^2+6x+1)^2 (x^2+8x-2)', trim(disc) === trim(target));
console.log('      disc coeffs (x^0..):', trim(disc));

// ================= PART C: structure in Q(sqrt2) =================
const alpha = K(1, 1), beta = K(0, 1), alphap = K(1, -1), betap = K(0, -1);
const qs = padd(padd(pmul(c(alpha), ppow(T, 2)), pmul(c(beta), T)), one);   // q*(t)
const qb = padd(padd(pmul(c(alphap), ppow(T, 2)), pmul(c(betap), T)), one); // q_b(t)
const subsX = (p, val) => { let r = new Map(); for (const [k, co] of p) { const e = k.split(',').map(Number); let cc = co; for (let i = 0; i < e[0]; i++) cc = kmul(cc, val); addTerm(r, [0, e[1], e[2]], cc); } return r; };
check('Den(x*,t) = q*(t)^2,  q* = (1+√2)t^2+√2 t+1', pis0(psub(subsX(Den, xs), ppow(qs, 2))));
check('Den(b,t)  = q_b(t)^2, q_b = (1-√2)t^2-√2 t+1', pis0(psub(subsX(Den, b), ppow(qb, 2))));
const bmx = kadd(b, kneg(xs)); // b - x* = 4√2
check('b - x* = 4√2', kzero(kadd(bmx, kneg(K(0, 4)))));
const ident = psub(pmul(c(bmx), Den), padd(pmul(psub(c(b), X), ppow(qs, 2)), pmul(psub(X, c(xs)), ppow(qb, 2))));
check('(b-x*)Den = (b-x) q*^2 + (x-x*) q_b^2', pis0(ident));
check('q*(t) q_b(t) = -(t^4+4t^3-1)', pis0(padd(pmul(qs, qb), padd(padd(ppow(T, 4), pmul(c(K(4)), ppow(T, 3))), c(K(-1))))));
check('x* * b = 1', kzero(kadd(kmul(xs, b), K(-1))));
// kappa(a) = (a-x*)/(a-b) = ((2√2+1)/7)^2
const kap = (xv) => kmul(kadd(xv, kneg(xs)), kinv(kadd(xv, kneg(b))));
const va = K(R(1, 7), R(2, 7));
check('kappa(a) = v_a^2, v_a=(1+2√2)/7', kzero(kadd(kap(a), kneg(kmul(va, va)))));
// quadratic discriminants of q* -/+ v q_b (in variable v = var 2)
const coefT = (p, j) => { const r = new Map(); for (const [k, co] of p) { const e = k.split(',').map(Number); if (e[1] === j) addTerm(r, [e[0], 0, e[2]], co); } return r; };
const q1 = psub(qs, pmul(V, qb)), q2 = padd(qs, pmul(V, qb));
const qdisc = (q) => psub(ppow(coefT(q, 1), 2), pmul(c(K(4)), pmul(coefT(q, 2), coefT(q, 0))));
const d1 = qdisc(q1), d2 = qdisc(q2);
const vpoly = (c0, c1, c2) => padd(padd(c(c0), pmul(c(c1), V)), pmul(c(c2), ppow(V, 2)));
check('disc(q*-v q_b) = (4√2-2)v^2 + 12v - (2+4√2)', pis0(psub(d1, vpoly(K(-2, -4), K(12), K(-2, 4)))));
check('disc(q*+v q_b) = (4√2-2)v^2 - 12v - (2+4√2)', pis0(psub(d2, vpoly(K(-2, -4), K(-12), K(-2, 4)))));
const evalV = (p, val) => { let s = K(0); for (const [k, co] of p) { const e = k.split(',').map(Number); let cc = co; for (let i = 0; i < e[2]; i++) cc = kmul(cc, val); s = kadd(s, cc); } return s; };
check('disc(q*-v q_b) vanishes at v=v_a', kzero(evalV(d1, va)));
// tau1^2 at v_a equals (√2-1)^2 : C1/A1 = (1-v)/((1+√2)+v(√2-1))
const tau1sq = (v) => kmul(kadd(K(1), kneg(v)), kinv(kadd(K(1, 1), kmul(v, K(-1, 1)))));
check('tau1^2(v_a) = (√2-1)^2 = 3-2√2 (double root at t=1-√2)', kzero(kadd(tau1sq(va), K(-3, 2))));
check('Den(a,1-√2)=0 and d/dt Den(a,t) at 1-√2 = 0', (() => {
  const s = K(1, -1); const ev = (p, xv, tv) => { let r = K(0); for (const [k, co] of p) { const e = k.split(',').map(Number); let cc = co; for (let i = 0; i < e[0]; i++) cc = kmul(cc, xv); for (let i = 0; i < e[1]; i++) cc = kmul(cc, tv); r = kadd(r, cc); } return r; };
  const dDen = new Map(); for (const [k, co] of Den) { const e = k.split(',').map(Number); if (e[1] > 0) addTerm(dDen, [e[0], e[1] - 1, e[2]], kmul(co, K(e[1]))); }
  return kzero(ev(Den, a, s)) && kzero(ev(dDen, a, s));
})());
// symmetric / antisymmetric parts of q*(t) q_b(u), u = var 2
const U = V;
const sub_t_to_u = (p) => { const r = new Map(); for (const [k, co] of p) { const e = k.split(',').map(Number); addTerm(r, [e[0], 0, e[1]], co); } return r; };
const qsU = sub_t_to_u(qs), qbU = sub_t_to_u(qb);
const sS = padd(T, U), pP = pmul(T, U);
const sym = padd(pmul(qs, qbU), pmul(qsU, qb));
check('q*(t)q_b(u)+q*(u)q_b(t) = -2(p^2+2ps-s^2+4p-1)', pis0(padd(sym, pmul(c(K(2)), padd(padd(padd(padd(ppow(pP, 2), pmul(c(K(2)), pmul(pP, sS))), pneg(ppow(sS, 2))), pmul(c(K(4)), pP)), c(K(-1)))))));
const anti = psub(pmul(qs, qbU), pmul(qsU, qb));
check('q*(t)q_b(u)-q*(u)q_b(t) = 2√2 (t-u)(s-p+1)', pis0(psub(anti, pmul(c(K(0, 2)), pmul(psub(T, U), padd(psub(sS, pP), one))))));
// equal-modulus lemma polynomial
check('x(x+3)^2+(x-1)^2 = (x+1)(x^2+6x+1)', trim(uadd(umul([0n, 1n], umul([3n, 1n], [3n, 1n])), umul([-1n, 1n], [-1n, 1n]))) === trim(umul([1n, 1n], [1n, 6n, 1n])));
// |c|^2=√2-1 makes 2tau^4+4tau^2-1 = 1
{ const p2 = K(-1, 1); check('2|c|^4+4|c|^2-1 = 1 at |c|^2=√2-1', kzero(kadd(kadd(kmul(K(2), kmul(p2, p2)), kmul(K(4), p2)), K(-2)))); }
// |r1|<|c|: g(t)=(√2-1)t^2+√2 t-1 > 0 at t=|c| <=> |c| > 2-√2 <=> √2-1 > 6-4√2 <=> 5√2>7
check('|r1| < |c| reduces to 50 > 49', 50 > 49);

// ================= PART D: numerics =================
const C = { add: (p, q) => [p[0] + q[0], p[1] + q[1]], sub: (p, q) => [p[0] - q[0], p[1] - q[1]], mul: (p, q) => [p[0] * q[0] - p[1] * q[1], p[0] * q[1] + p[1] * q[0]], div: (p, q) => { const d = q[0] * q[0] + q[1] * q[1]; return [(p[0] * q[0] + p[1] * q[1]) / d, (p[1] * q[0] - p[0] * q[1]) / d]; } };
function roots(co) { // co[0..4], Durand-Kerner on monic
  const n = co.length - 1, lead = co[n]; const m = co.map((v) => v / lead);
  let z = Array.from({ length: n }, (_, i) => { const r = 0.4, ang = 2 * Math.PI * i / n + 0.4; return [r * Math.cos(ang), r * Math.sin(ang)]; });
  const ev = (w) => { let r = [1, 0]; for (let k = n - 1; k >= 0; k--) r = C.add(C.mul(r, w), [m[k], 0]); return r; };
  for (let it = 0; it < 2000; it++) { z = z.map((zi, i) => { let den = [1, 0]; z.forEach((zj, j) => { if (j !== i) den = C.mul(den, C.sub(zi, zj)); }); return C.sub(zi, C.div(ev(zi), den)); }); }
  // Newton polish on full-precision polynomial
  return z;
}
const A_ = -4 - 3 * Math.SQRT2, B_ = -3 + 2 * Math.SQRT2, XS = -3 - 2 * Math.SQRT2;
const smallest = (x) => {
  const rs = roots([1, -(x + 3), -(x - 1), -(x - 1), -x]).map((w) => ({ w, m: Math.hypot(...w), th: Math.atan2(w[1], w[0]) }));
  rs.sort((p, q) => p.m - q.m);
  const up = rs.filter((r) => r.w[1] > 0).sort((p, q) => p.m - q.m);
  return { up, minImag: Math.min(...rs.map((r) => Math.abs(r.w[1]))) };
};
let prev = Infinity, mono = true, worstImag = Infinity, count = 0;
for (let i = 1; i < 4000; i++) {
  const x = A_ + (B_ - A_) * i / 4000; if (Math.abs(x - XS) < 1e-9) continue;
  const { up, minImag } = smallest(x); count++;
  worstImag = Math.min(worstImag, minImag);
  if (up.length !== 2) { mono = false; console.log('  not two UHP roots at', x); continue; }
  const th = up[0].th; if (!(th < prev)) mono = false; prev = th;
}
check(`NUMERICAL: theta of smallest UHP root strictly decreasing on ${count} grid points`, mono);
console.log('      min |Im root| over grid:', worstImag.toExponential(3));
for (const h of [1e-1, 1e-2, 1e-3, 1e-4]) for (const sgn of [-1, 1]) {
  const { up } = smallest(XS + sgn * h); console.log(`      x = x* ${sgn > 0 ? '+' : '-'} ${h}: |t_big|/|t_small| = ${(up[1].m / up[0].m).toFixed(6)}, theta = ${up[0].th.toFixed(6)}`);
}
{ const { up } = smallest(XS); console.log(`      x = x* exactly: moduli ${up.map((r) => r.m.toFixed(6)).join(', ')} ; sqrt(sqrt2-1) = ${Math.sqrt(Math.SQRT2 - 1).toFixed(6)}; theta_c = ${Math.acos(-1 / Math.sqrt(2 + 2 * Math.SQRT2)).toFixed(6)}`); }
// compare closed-form theta on (a,x*) with root finder
let maxErr = 0;
for (let i = 1; i < 200; i++) {
  const x = A_ + (XS - A_) * i / 200; const kap = (x - XS) / (x - B_); const v = Math.sqrt(kap);
  const tau = Math.sqrt((1 - v) / ((1 + Math.SQRT2) + v * (Math.SQRT2 - 1)));
  const cth = -Math.SQRT2 * (1 + v) / (2 * Math.sqrt((1 - v) * ((1 + Math.SQRT2) + v * (Math.SQRT2 - 1))));
  const { up } = smallest(x); maxErr = Math.max(maxErr, Math.abs(up[0].m - tau), Math.abs(Math.cos(up[0].th) - cth));
}
check(`NUMERICAL: closed form (tau1, cos theta1) on (a,x*) matches root finder (max err ${maxErr.toExponential(2)})`, maxErr < 1e-9);
// on (x*,b): smallest root satisfies tau^4+4c tau^3+4(1-c^2)tau^2-1=0 and theta<theta_c
let maxRes = 0, thOK = true; const thc = Math.acos(-1 / Math.sqrt(2 + 2 * Math.SQRT2));
for (let i = 1; i < 200; i++) {
  const x = XS + (B_ - XS) * i / 200; const { up } = smallest(x); const t = up[0].m, cc = Math.cos(up[0].th);
  maxRes = Math.max(maxRes, Math.abs(t ** 4 + 4 * cc * t ** 3 + 4 * (1 - cc * cc) * t * t - 1)); if (!(up[0].th < thc && up[1].th > thc)) thOK = false;
}
check(`NUMERICAL: on (x*,b) small root on quartic curve (max residual ${maxRes.toExponential(2)}), theta_small<theta_c<theta_big`, maxRes < 1e-9 && thOK);
