// Model near x*, L-profile in theta, failure locations.
const S2 = Math.SQRT2, al = 1 + S2;
const A = -4 - 3 * S2, B = -3 + 2 * S2, XS = -3 - 2 * S2;
const C = {
  add: (p, q) => [p[0] + q[0], p[1] + q[1]], sub: (p, q) => [p[0] - q[0], p[1] - q[1]],
  mul: (p, q) => [p[0] * q[0] - p[1] * q[1], p[0] * q[1] + p[1] * q[0]],
  div: (p, q) => { const d = q[0] ** 2 + q[1] ** 2; return [(p[0] * q[0] + p[1] * q[1]) / d, (p[1] * q[0] - p[0] * q[1]) / d]; },
  exp: (p) => [Math.exp(p[0]) * Math.cos(p[1]), Math.exp(p[0]) * Math.sin(p[1])],
  abs: (p) => Math.hypot(p[0], p[1]), arg: (p) => Math.atan2(p[1], p[0]), sc: (s, p) => [s * p[0], s * p[1]],
};
const cc = [-S2 / (2 * al), Math.sqrt(2 + 4 * S2) / (2 * al)]; // c
const qsp = (t) => C.add(C.sc(2 * al, t), [S2, 0]);           // q*'
const qb = (t) => C.add(C.add(C.sc(1 - S2, C.mul(t, t)), C.sc(-S2, t)), [1, 0]);
const ell1 = C.sc(-2, C.div(qb(cc), C.mul(cc, qsp(cc))));
const U0 = C.div(C.mul(C.sub([1, 0], cc), cc), C.mul(qb(cc), qsp(cc)));
const A0 = C.mul(U0, ell1);
console.log('c =', cc, ' ell1 =', ell1, ' U0 =', U0, ' A0 =', A0, ' check A0 = (1-c)/(2 al^2 Im c^2):', C.sc(1 / (2 * al * al * cc[1] ** 2), C.sub([1, 0], cc)));
const sigma = -Math.sign(ell1[1]);
const dL = C.sc(1 / C.abs(ell1), ell1), dR = C.sc(sigma / C.abs(ell1), C.mul([0, 1], ell1));
console.log('sigma =', sigma, ' dL =', dL, 'Re', dL[0] > 0, ' dR =', dR, 'Re', dR[0] > 0);
const E2 = (z) => (C.abs(z) < 1e-9 ? [1, 0] : C.div(C.sub([1, 0], C.exp(C.sc(-1, z))), z));
for (const [name, d] of [['left', dL], ['right', dR]]) {
  let mn = Infinity, at = 0, mnScaled = Infinity;
  for (let i = 0; i <= 400000; i++) { const r = i * 0.0005; const v = C.mul(A0, E2(C.sc(r, d)))[0]; if (v < mn) { mn = v; at = r; } mnScaled = Math.min(mnScaled, v * Math.max(1, r)); }
  console.log(name, 'min Re[A0 E2(r d)] over r in [0,200] =', mn.toFixed(6), 'at r =', at, '; min of r*Re (r>=1) =', mnScaled.toFixed(6), '; Re(A0 conj d)=', C.mul(A0, [d[0], -d[1]])[0].toFixed(6));
}
