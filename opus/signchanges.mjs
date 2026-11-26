// Exact sign changes of G_n at rational points in (a,b): q^n G_n(p/q) via homogenised recurrence.
// a = -4-3√2 ≈ -8.2426, b = -3+2√2 ≈ -0.17157. Grid uses rationals strictly inside (a,b).
const H = (p, q, N) => {
  const h = [1n, p + 2n * q, p * p + 6n * p * q + 5n * q * q, p ** 3n + 10n * p * p * q + 25n * p * q * q + 12n * q ** 3n];
  for (let n = 4; n <= N; n++) h.push((p + 3n * q) * h[n - 1] + (p - q) * q * h[n - 2] + (p - q) * q * q * h[n - 3] + p * q ** 3n * h[n - 4]);
  return h;
};
const Q = 10n ** 6n;
const lo = -8242640n, hi = -171573n; // -8.242640, -0.171573 (inside (a,b): a≈-8.2426407, b≈-0.1715729)
for (const N of [10, 20, 30, 40]) {
  // nonuniform grid: denser near b, where zeros cluster
  const pts = []; const M = 60000;
  for (let i = 0; i <= M; i++) { const s = i / M; const w = 1 - (1 - s) ** 3; pts.push(lo + BigInt(Math.round(Number(hi - lo) * w))); }
  let changes = 0, prev = 0;
  for (const p of pts) { const v = H(p, Q, N)[N]; const sg = v > 0n ? 1 : v < 0n ? -1 : 0; if (sg !== 0 && prev !== 0 && sg !== prev) changes++; if (sg !== 0) prev = sg; }
  console.log(`n=${N}: exact sign changes of G_n on rational grid in (a,b) = ${changes} (degree ${N})`);
}
