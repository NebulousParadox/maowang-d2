// Numerical exploration for Stage C (floats). Roots via explicit factorisation.
const S2 = Math.SQRT2, al = 1 + S2, be = S2 - 1;
const A = -4 - 3 * S2, B = -3 + 2 * S2, XS = -3 - 2 * S2;
const C = {
  add: (p, q) => [p[0] + q[0], p[1] + q[1]], sub: (p, q) => [p[0] - q[0], p[1] - q[1]],
  mul: (p, q) => [p[0] * q[0] - p[1] * q[1], p[0] * q[1] + p[1] * q[0]],
  div: (p, q) => { const d = q[0] ** 2 + q[1] ** 2; return [(p[0] * q[0] + p[1] * q[1]) / d, (p[1] * q[0] - p[0] * q[1]) / d]; },
  sqrt: (p) => { const r = Math.hypot(p[0], p[1]); const re = Math.sqrt((r + p[0]) / 2), im = Math.sign(p[1] || 1) * Math.sqrt((r - p[0]) / 2); return [re, im]; },
  abs: (p) => Math.hypot(p[0], p[1]), arg: (p) => Math.atan2(p[1], p[0]), sc: (s, p) => [s * p[0], s * p[1]],
};
const kap = (x) => (x - XS) / (x - B);
// roots of q* - lam q_b  (lam complex):  (al - lam*(1-S2)) t^2 + (S2 + lam*S2) t + (1 - lam) = 0
function rootsQ(lam) {
  const a2 = C.sub([al, 0], C.mul(lam, [1 - S2, 0])), a1 = C.add([S2, 0], C.mul(lam, [S2, 0])), a0 = C.sub([1, 0], lam);
  const d = C.sqrt(C.sub(C.mul(a1, a1), C.sc(4, C.mul(a2, a0))));
  return [C.div(C.add(C.sc(-1, a1), d), C.sc(2, a2)), C.div(C.sub(C.sc(-1, a1), d), C.sc(2, a2))];
}
function uhpRoots(x) { // returns [t1 (small), t2 (large)] in UHP
  const k = kap(x); let lam = k >= 0 ? [Math.sqrt(k), 0] : [0, Math.sqrt(-k)];
  const rs = [...rootsQ(lam), ...rootsQ(C.sc(-1, lam))].filter((t) => t[1] > 0).sort((p, q) => C.abs(p) - C.abs(q));
  return rs;
}
const dDen = (x, t) => { // -(x+3) - 2(x-1)t - 3(x-1)t^2 - 4x t^3
  const t2 = C.mul(t, t), t3 = C.mul(t2, t);
  return C.add(C.add([-(x + 3), 0], C.sc(-2 * (x - 1), t)), C.add(C.sc(-3 * (x - 1), t2), C.sc(-4 * x, t3)));
};
const W = (x, t) => C.div(C.mul(C.sub([1, 0], t), t), dDen(x, t)); // (1-t) t / Den'(t)
function profile(x) {
  const [t1, t2] = uhpRoots(x); const r1 = C.abs(t1), r2 = C.abs(t2);
  const m = 2 * W(x, t1)[0], e = 2 * C.abs(W(x, t2));
  return { t1, t2, r1, r2, th: C.arg(t1), m, e, L: Math.log(e / Math.abs(m)) / Math.log(r2 / r1) };
}
// theta inverse by bisection
const thetaOf = (x) => C.arg(uhpRoots(x)[0]);
function xOfTheta(th) { let lo = A + 1e-15, hi = B - 1e-15; for (let i = 0; i < 200; i++) { const mid = (lo + hi) / 2; if (thetaOf(mid) > th) lo = mid; else hi = mid; } return (lo + hi) / 2; }
// G_n by recurrence
function G(x, n) { const g = [1, x + 2, x * x + 6 * x + 5, x ** 3 + 10 * x * x + 25 * x + 12]; for (let k = 4; k <= n; k++) g.push((x + 3) * g[k - 1] + (x - 1) * g[k - 2] + (x - 1) * g[k - 3] + x * g[k - 4]); return g[n]; }
// G_n via root sum
function Groot(x, n) { let s = 0; for (const t of uhpRoots(x)) { const c = C.div(C.sub([1, 0], t), C.mul(dDen(x, t), cpow(t, n + 1))); s += -2 * c[0]; } return s; }
const cpow = (t, n) => { const r = C.abs(t) ** n, a = C.arg(t) * n; return [r * Math.cos(a), r * Math.sin(a)]; };

console.log('theta_c', thetaOf(XS + 1e-12), Math.acos(-1 / Math.sqrt(2 + 2 * S2)));
console.log('check G vs root sum at x=-3, n=20:', G(-3, 20), Groot(-3, 20));
console.log('\n x, theta, r2/r1, m, e, L');
for (const x of [A + 1e-6, -8, -7.5, -7, -6.5, -6.2, -6, -5.9, -5.85, -5.83, XS - 1e-4, XS + 1e-4, -5.82, -5.8, -5.7, -5.5, -5, -4, -3, -2, -1, -0.5, -0.3, -0.2, B - 1e-6]) {
  const p = profile(x); console.log(x.toFixed(6), p.th.toFixed(4), (p.r2 / p.r1).toFixed(5), p.m.toExponential(4), p.e.toExponential(4), p.L.toFixed(2));
}
// alternation check
let bad = [];
for (let n = 4; n <= 300; n++) {
  let prev = 0;
  for (let k = 1; k <= n + 1; k++) { const x = xOfTheta(k * Math.PI / (n + 2)); const g = Groot(x, n); const s = Math.sign(g); if (prev !== 0 && s === prev) bad.push([n, k]); prev = s; }
}
console.log('\nalternation failures (n,k) for n<=300:', bad.length ? JSON.stringify(bad.slice(0, 40)) : 'none');
// sign of main term relative to (-1)^(k+1)
let sgns = new Set(); for (let i = 1; i < 2000; i++) { const x = A + (B - A) * i / 2000; if (Math.abs(x - XS) < 1e-9) continue; sgns.add(Math.sign(profile(x).m)); } console.log('sign(m) values over grid:', [...sgns]);
