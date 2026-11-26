// Exact (rational interval, no rounding) signs of G_n(x_k(n)) for n = 4, 5.
// x_k = theta^{-1}(k pi/(n+2)); t1 = tau e^{i theta}; tau from the angle lemma:
//   circle side (cos theta < cos theta_zeta): tau = c + sqrt(1+c^2)
//   Gamma side  (cos theta > cos theta_zeta): tau = unique positive root of tau^4+4c tau^3+4(1-c^2)tau^2-1
const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a; };
const F = (n, d = 1n) => { n = BigInt(n); d = BigInt(d); if (d < 0n) { n = -n; d = -d; } const g = gcd(n, d) || 1n; return { n: n / g, d: d / g }; };
const fadd = (a, b) => F(a.n * b.d + b.n * a.d, a.d * b.d), fsub = (a, b) => F(a.n * b.d - b.n * a.d, a.d * b.d);
const fmul = (a, b) => F(a.n * b.n, a.d * b.d), fdiv = (a, b) => F(a.n * b.d, a.d * b.n);
const fcmp = (a, b) => { const v = a.n * b.d - b.n * a.d; return v > 0n ? 1 : v < 0n ? -1 : 0; };
const fmin = (...xs) => xs.reduce((p, q) => (fcmp(p, q) <= 0 ? p : q)), fmax = (...xs) => xs.reduce((p, q) => (fcmp(p, q) >= 0 ? p : q));
// rational intervals
const R = (lo, hi = lo) => ({ lo, hi });
const radd = (a, b) => R(fadd(a.lo, b.lo), fadd(a.hi, b.hi)), rsub = (a, b) => R(fsub(a.lo, b.hi), fsub(a.hi, b.lo));
const rmul = (a, b) => { const p = [fmul(a.lo, b.lo), fmul(a.lo, b.hi), fmul(a.hi, b.lo), fmul(a.hi, b.hi)]; return R(fmin(...p), fmax(...p)); };
const rdiv = (a, b) => { if (fcmp(b.lo, F(0)) <= 0 && fcmp(b.hi, F(0)) >= 0) throw new Error('div by 0-interval'); const p = [fdiv(a.lo, b.lo), fdiv(a.lo, b.hi), fdiv(a.hi, b.lo), fdiv(a.hi, b.hi)]; return R(fmin(...p), fmax(...p)); };
const rc = (n, d = 1n) => R(F(n, d));
const P = 200n, S = 1n << P;
const isqrtB = (n) => { if (n < 2n) return n; let x = BigInt(Math.floor(Math.sqrt(Number(n)))) || 1n; for (;;) { const y = (x + n / x) >> 1n; if (y >= x && y * y <= n) { while ((x + 1n) * (x + 1n) <= n) x++; while (x * x > n) x--; return x; } x = y; if (x === 0n) return 0n; } };
const fsqrtLo = (r) => (r.n <= 0n ? F(0) : F(isqrtB((r.n * S * S) / r.d), S));
const fsqrtHi = (r) => F(isqrtB((r.n * S * S + r.d - 1n) / r.d) + 1n, S);
const rsqrt = (a) => R(fsqrtLo(a.lo), fsqrtHi(a.hi));
const rsign = (a) => (fcmp(a.lo, F(0)) > 0 ? '+' : fcmp(a.hi, F(0)) < 0 ? '-' : '?');
// complex rational intervals
const C = (re, im = rc(0)) => ({ re, im });
const cadd = (a, b) => C(radd(a.re, b.re), radd(a.im, b.im)), csub = (a, b) => C(rsub(a.re, b.re), rsub(a.im, b.im));
const cmul = (a, b) => C(rsub(rmul(a.re, b.re), rmul(a.im, b.im)), radd(rmul(a.re, b.im), rmul(a.im, b.re)));
const cdiv = (a, b) => { const d = radd(rmul(b.re, b.re), rmul(b.im, b.im)); const n = cmul(a, C(b.re, R(fsub(F(0), b.im.hi), fsub(F(0), b.im.lo)))); return C(rdiv(n.re, d), rdiv(n.im, d)); };
const ONE = C(rc(1));
// cos(k pi/N) enclosures (exact algebraic, bracketed by bisection on minimal polynomials)
function rootBracket(poly, a, b, steps = 120) { // poly: coeffs low->high (BigInt rationals as F); sign change on [a,b]
  const ev = (x) => poly.reduceRight((acc, c) => fadd(fmul(acc, x), c), F(0));
  let lo = a, hi = b; const slo = fcmp(ev(lo), F(0)); if (slo === 0 || slo === fcmp(ev(hi), F(0))) throw new Error('no sign change');
  for (let i = 0; i < steps; i++) { const mid = F(lo.n * hi.d + hi.n * lo.d, 2n * lo.d * hi.d); const sm = fcmp(ev(mid), F(0)); if (sm === 0) return R(mid); if (sm === slo) lo = mid; else hi = mid; }
  return R(lo, hi);
}
const negR = (a) => R(fsub(F(0), a.hi), fsub(F(0), a.lo));
function cosEnc(k, N) { // cos(k pi / N) for the cases needed
  const key = `${k}/${N}`;
  const sq3h = rsqrt(rc(3n, 4n));
  const c7a = (lo, hi) => rootBracket([F(1), F(-4), F(-4), F(8)], F(lo[0], lo[1]), F(hi[0], hi[1])); // 8x^3-4x^2-4x+1: cos(pi/7), cos(3pi/7), cos(5pi/7)
  const c7b = (lo, hi) => rootBracket([F(-1), F(-4), F(4), F(8)], F(lo[0], lo[1]), F(hi[0], hi[1])); // 8x^3+4x^2-4x-1: cos(2pi/7), cos(4pi/7), cos(6pi/7)
  const tab = {
    '1/6': sq3h, '2/6': rc(1n, 2n), '3/6': rc(0), '4/6': rc(-1n, 2n), '5/6': negR(sq3h),
    '1/7': c7a([9n, 10n], [1n, 1n]), '2/7': c7b([6n, 10n], [7n, 10n]), '3/7': c7a([2n, 10n], [3n, 10n]),
    '4/7': c7b([-3n, 10n], [-2n, 10n]), '5/7': c7a([-7n, 10n], [-6n, 10n]), '6/7': c7b([-95n, 100n], [-85n, 100n]),
  };
  return tab[key];
}
// theta_zeta: cos(theta_zeta) = -1/sqrt(2+2 sqrt2) ~ -0.45509 ; decide side by c > -0.4551 (Gamma) or c < -0.4550 (circle)
function xAt(c) {
  const s = rsqrt(rsub(rc(1), rmul(c, c)));
  let tau;
  if (fcmp(c.lo, F(-4550n, 10000n)) > 0) { // Gamma side: bisect f(tau) = tau^4+4c tau^3+4(1-c^2)tau^2-1 (f(0)<0, unique positive root)
    const f = (t) => { const T = R(t); const T2 = rmul(T, T); return rsub(radd(radd(rmul(T2, T2), rmul(rmul(rc(4), c), rmul(T2, T))), rmul(rmul(rc(4), rsub(rc(1), rmul(c, c))), T2)), rc(1)); };
    let lo = F(1n, 10n), hi = F(5n); if (!(fcmp(f(lo).hi, F(0)) < 0 && fcmp(f(hi).lo, F(0)) > 0)) throw new Error('bracket');
    for (let i = 0; i < 90; i++) { const mid = F(lo.n * hi.d + hi.n * lo.d, 2n * lo.d * hi.d); const fm = f(mid); if (fcmp(fm.hi, F(0)) < 0) lo = mid; else if (fcmp(fm.lo, F(0)) > 0) hi = mid; else break; }
    tau = R(lo, hi);
  } else if (fcmp(c.hi, F(-4552n, 10000n)) < 0) tau = radd(c, rsqrt(radd(rc(1), rmul(c, c)))); // circle side
  else throw new Error('ambiguous side');
  const t = C(rmul(tau, c), rmul(tau, s));
  const Pz = cmul(csub(ONE, t), csub(csub(ONE, cmul(C(rc(2)), t)), cmul(t, t)));
  const Bz = cmul(cmul(t, cadd(ONE, t)), cadd(ONE, cmul(t, t)));
  return cdiv(Pz, Bz).re;
}
function G(x, n) { const g = [rc(1), radd(x, rc(2)), radd(radd(rmul(x, x), rmul(rc(6), x)), rc(5)), radd(radd(radd(rmul(rmul(x, x), x), rmul(rc(10), rmul(x, x))), rmul(rc(25), x)), rc(12))];
  for (let k = 4; k <= n; k++) g.push(radd(radd(radd(rmul(radd(x, rc(3)), g[k - 1]), rmul(rsub(x, rc(1)), g[k - 2])), rmul(rsub(x, rc(1)), g[k - 3])), rmul(x, g[k - 4]))); return g[n]; }
for (const n of [4, 5]) {
  const N = n + 2; const row = [];
  const dec = (f) => (Number((f.n * 10n ** 12n) / f.d) / 1e12).toFixed(9);
  for (let k = 1; k <= n + 1; k++) { const x = xAt(cosEnc(k, N)); const g = G(x, n); row.push(`k=${k}: x in [${dec(x.lo)}, ${dec(x.hi)}] sign G_${n} = ${rsign(g)}`); }
  console.log(`n=${n} (N=${N}):\n  ` + row.join('\n  '));
}
