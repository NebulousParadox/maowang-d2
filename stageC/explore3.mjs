// Parameter selection (floats): near-x* constants and far-region L(theta).
const S2 = Math.SQRT2, al = 1 + S2;
const A = -4 - 3 * S2, B = -3 + 2 * S2, XS = -3 - 2 * S2;
const C = {
  add: (p, q) => [p[0] + q[0], p[1] + q[1]], sub: (p, q) => [p[0] - q[0], p[1] - q[1]],
  mul: (p, q) => [p[0] * q[0] - p[1] * q[1], p[0] * q[1] + p[1] * q[0]],
  div: (p, q) => { const d = q[0] ** 2 + q[1] ** 2; return [(p[0] * q[0] + p[1] * q[1]) / d, (p[1] * q[0] - p[0] * q[1]) / d]; },
  exp: (p) => [Math.exp(p[0]) * Math.cos(p[1]), Math.exp(p[0]) * Math.sin(p[1])],
  abs: (p) => Math.hypot(p[0], p[1]), arg: (p) => Math.atan2(p[1], p[0]), sc: (s, p) => [s * p[0], s * p[1]],
  sqrt: (p) => { const r = Math.hypot(p[0], p[1]); const re = Math.sqrt((r + p[0]) / 2); const im = (p[1] >= 0 ? 1 : -1) * Math.sqrt(Math.max(0, (r - p[0]) / 2)); return [re, im]; },
  log: (p) => [Math.log(Math.hypot(p[0], p[1])), Math.atan2(p[1], p[0])],
};
const one = [1, 0];
const qs = (t) => C.add(C.add(C.sc(al, C.mul(t, t)), C.sc(S2, t)), one), qsp = (t) => C.add(C.sc(2 * al, t), [S2, 0]);
const qb = (t) => C.add(C.add(C.sc(1 - S2, C.mul(t, t)), C.sc(-S2, t)), one), qbp = (t) => C.add(C.sc(2 * (1 - S2), t), [-S2, 0]);
const cc = [-S2 / (2 * al), Math.sqrt(2 + 4 * S2) / (2 * al)];
// t(lam): root of q* - lam q_b near c, via Newton from c (continuation)
function tOf(lam, t0 = cc) { let t = t0; for (let i = 0; i < 60; i++) { const f = C.sub(qs(t), C.mul(lam, qb(t))); const fp = C.sub(qsp(t), C.mul(lam, qbp(t))); t = C.sub(t, C.div(f, fp)); } return t; }
const U = (lam) => { const t = tOf(lam); return C.div(C.mul(C.sub(one, t), t), C.mul(qb(t), C.sub(qsp(t), C.mul(lam, qbp(t))))); };
const ell = (lam) => { const p = tOf(C.sc(-1, lam)), q = tOf(lam); return C.log(C.div(p, q)); };
const ell1 = C.sc(-2, C.div(qb(cc), C.mul(cc, qsp(cc))));
const h = 1e-6; const Up0 = C.sc(1 / (2 * h), C.sub(U([h, 0]), U([-h, 0])));
console.log('U\'(0) ~', Up0, '|2U\'(0)| =', 2 * C.abs(Up0));
const E2 = (z) => (C.abs(z) < 1e-9 ? one : C.div(C.sub(one, C.exp(C.sc(-1, z))), z));
const dirs = { left: [1, 0], right: [0, 1] }; // lambda = r*dir ; sigma=+1
for (const lam0 of [0.01, 0.02, 0.05]) {
  // D2 = 2 sup_{|mu|<=lam0} |U'(mu)| (sample)
  let D2 = 0; for (let i = 0; i < 64; i++) for (const rr of [lam0 / 2, lam0]) { const mu = [rr * Math.cos(i * Math.PI / 32), rr * Math.sin(i * Math.PI / 32)]; const d = C.sc(1 / (2 * h), C.sub(U(C.add(mu, [h, 0])), U(C.sub(mu, [h, 0])))); D2 = Math.max(D2, 2 * C.abs(d)); }
  for (const Z of [0.5, 1, 2, 4]) {
    let beta = Infinity, gamma = Infinity, Lmax = 0;
    for (const [nm, d] of Object.entries(dirs)) for (let j = 1; j <= 50; j++) {
      const lam = C.sc(lam0 * j / 50, d); const l = ell(lam); const Aval = C.mul(U(C.sc(-1, lam)), C.div(l, lam)); Lmax = Math.max(Lmax, C.abs(C.div(l, lam)));
      const ph = C.arg(l);
      for (let i = 0; i <= 400; i++) { const r = Z * i / 400; beta = Math.min(beta, C.mul(Aval, E2(C.sc(r, [Math.cos(ph), Math.sin(ph)])))[0]); }
      for (let i = 0; i <= 2000; i++) { const r = Z + i * 0.05; const W = C.sc(r, [Math.cos(ph), Math.sin(ph)]); gamma = Math.min(gamma, C.mul(C.mul(Aval, [Math.cos(ph), -Math.sin(ph)]), C.sub(one, C.exp(C.sc(-1, W))))[0]); }
    }
    console.log(`lam0=${lam0} Z=${Z}: D2=${D2.toFixed(4)} beta=${beta.toFixed(4)} -> N>${(D2 / beta).toFixed(1)} ; gamma=${gamma.toFixed(4)} need gamma/(lam0*Lmax)=${(gamma / (lam0 * Lmax)).toFixed(2)} > D2`);
  }
}
// far region: x at |lambda| = lam0 on each side, and L there
const kap = (x) => (x - XS) / (x - B);
const xOfKappa = (k) => (XS - k * B) / (1 - k); // inverse of kappa
for (const lam0 of [0.01, 0.02, 0.05]) console.log(`lam0=${lam0}: left x=${xOfKappa(lam0 ** 2).toFixed(6)}  right x=${xOfKappa(-(lam0 ** 2)).toFixed(6)}`);
