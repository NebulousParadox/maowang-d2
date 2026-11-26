// (1) exact real-rootedness for n <= 11 by exact sign changes of q^n G_n(p/q) on rational grids in (a,b)
// (2) interval-certified signs of G_n(x_k(n)) for small n, showing where alternation fails
import * as K from './cert.mjs';
const { I, ip, iadd, isub, imul, idiv, isqrt, isqr, icos, isin, Z, zdiv, s2, tau0, r1, PI } = K;
const H = (p, q, N) => { const h = [1n, p + 2n * q, p * p + 6n * p * q + 5n * q * q, p ** 3n + 10n * p * p * q + 25n * p * q * q + 12n * q ** 3n]; for (let n = 4; n <= N; n++) h.push((p + 3n * q) * h[n - 1] + (p - q) * q * h[n - 2] + (p - q) * q * q * h[n - 3] + p * q ** 3n * h[n - 4]); return h; };
const Q = 10n ** 6n, lo = -8242640n, hi = -171573n;
for (let N = 1; N <= 11; N++) {
  let changes = 0, prev = 0; const M = 20000;
  for (let i = 0; i <= M; i++) { const s = i / M; const p = lo + BigInt(Math.round(Number(hi - lo) * (1 - (1 - s) ** 3))); const v = H(p, Q, N)[N]; const sg = v > 0n ? 1 : v < 0n ? -1 : 0; if (sg && prev && sg !== prev) changes++; if (sg) prev = sg; }
  console.log(`n=${N}: ${changes} exact sign changes in (a,b) (degree ${N}) ${changes === N ? 'ALL ZEROS REAL' : ''}`);
}
// interval x at angle theta: Gamma side (theta < theta_c) via bisection on tau of f(tau)=tau^4+4c tau^3+4(1-c^2)tau^2-1 ; circle side explicit
const thC = Math.acos(-1 / Math.sqrt(2 + 2 * Math.SQRT2));
function xAt(thI) {
  const c = icos(thI), s = isin(thI); let tau;
  if (thI.lo > thC + 1e-9) tau = iadd(c, isqrt(iadd(ip(1), isqr(c))));
  else if (thI.hi < thC - 1e-9) {
    const f = (t) => { const T = ip(t); return isub(iadd(iadd(isqr(isqr(T)), imul(imul(ip(4), c), imul(isqr(T), T))), imul(imul(ip(4), isub(ip(1), isqr(c))), isqr(T))), ip(1)); };
    let a = 0.3, b = 4.2; if (!(f(a).hi < 0 && f(b).lo > 0)) throw new Error('bracket');
    for (let i = 0; i < 60; i++) { const mid = (a + b) / 2; const fm = f(mid); if (fm.hi < 0) a = mid; else if (fm.lo > 0) b = mid; else break; }
    tau = I(a, b);
  } else throw new Error('too close to theta_c');
  const t1 = Z(imul(tau, c), imul(tau, s));
  const P = K.zmul(K.zsub(K.ONE, t1), K.zsub(K.zsub(K.ONE, K.zmul(K.zr(2), t1)), K.zmul(t1, t1)));
  const B = K.zmul(K.zmul(t1, K.zadd(K.ONE, t1)), K.zadd(K.ONE, K.zmul(t1, t1)));
  return zdiv(P, B).re;
}
function Gint(x, n) { const g = [ip(1), iadd(x, ip(2)), iadd(iadd(isqr(x), imul(ip(6), x)), ip(5)), iadd(iadd(iadd(imul(isqr(x), x), imul(ip(10), isqr(x))), imul(ip(25), x)), ip(12))];
  for (let k = 4; k <= n; k++) g.push(iadd(iadd(iadd(imul(iadd(x, ip(3)), g[k - 1]), imul(isub(x, ip(1)), g[k - 2])), imul(isub(x, ip(1)), g[k - 3])), imul(x, g[k - 4]))); return g[n]; }
for (const n of [4, 5, 6, 10, 18, 40]) {
  const N = n + 2; const row = [];
  for (let k = 1; k <= n + 1; k++) {
    const th = imul(PI, ip(k / N)); // k/N exact? use interval product with k and 1/N
    const thI = idiv(imul(PI, ip(k)), ip(N));
    let sgn = '?';
    try { const x = xAt(thI); const g = Gint(x, n); sgn = g.lo > 0 ? '+' : g.hi < 0 ? '-' : '?'; } catch (e) { sgn = 'c'; }
    const flag = Math.abs(k / N - 0.25) < 1e-12 ? '|' : '';
    row.push(flag + sgn);
  }
  // locate repeats
  const reps = []; for (let k = 1; k < row.length; k++) if (row[k].slice(-1) === row[k - 1].slice(-1) && '+-'.includes(row[k].slice(-1))) reps.push(`(k=${k},${k + 1}: theta=${k}pi/${N},${k + 1}pi/${N})`);
  console.log(`n=${n}: signs k=1..${n + 1}: ${row.join('')}  repeats: ${reps.join(' ') || 'none'}`);
}
