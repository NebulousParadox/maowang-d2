# Exact check: D^2 rows real-rooted with all zeros <= 0 (Sturm counting, integers).
# Ran 26 Nov 2026 in Colab: rows 1-91 all OK (see shots/07_rows91.png).
from sympy import symbols, Poly, oo, expand
import time

x = symbols('x')
NMAX = 100

G = [1, x + 2, x**2 + 6*x + 5, x**3 + 10*x**2 + 25*x + 12]
for n in range(4, NMAX + 1):
    G.append(expand((x+3)*G[n-1] + (x-1)*G[n-2] + (x-1)*G[n-3] + x*G[n-4]))

for n in range(1, NMAX + 1):
    t0 = time.time()
    p = Poly(G[n], x)
    d = p.degree()
    ok = p.count_roots(-oo, 0) == d
    print(f"D^2 row {n}: degree {d}, {'OK' if ok else '*** FAILS ***'}  ({time.time()-t0:.1f}s)", flush=True)
    if not ok:
        break
