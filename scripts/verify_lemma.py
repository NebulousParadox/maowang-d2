# Independent exact verification of the algebra in PROOF_angle_lemma.md.
# Ran 26 Nov 2026 in Colab: "all exact checks passed" (see shots/09_passed.png).
# Note: z() uses simplify, because plain expand left uncancelled sqrt(2) terms (shots/08_quirk.png).
import sympy as sp
x,t,u,v,tau,c,S,Pp = sp.symbols('x t u v tau c S Pp'); r2 = sp.sqrt(2)
z = lambda e: sp.simplify(sp.expand(e)) == 0

N = 10; D = [[0]*N for _ in range(N)]
for n in range(N):
    for k in range(n+1):
        D[n][k] = 1 if k in (0,n) else D[n-1][k-1]+D[n-1][k]+(D[n-2][k-1] if n>=2 else 0)
M2 = sp.Matrix(D)**2
Den = sp.expand((1-t)*(1-2*t-t**2) - x*t*(1+t)*(1+t**2))
assert z(Den - (1-(x+3)*t-(x-1)*t**2-(x-1)*t**3-x*t**4))
ser = sp.series((1-t)/Den, t, 0, N).removeO()
for n in range(N): assert z(ser.coeff(t,n) - sum(M2[n,k]*x**k for k in range(N)))
print("A1-A2 passed")

assert z(sp.discriminant(Den,t) + 16*(x**2+6*x+1)**2*(x**2+8*x-2))
print("A3 passed")

a, b, xs = -4-3*r2, -3+2*r2, -3-2*r2
qs = (1+r2)*t**2 + r2*t + 1; qb = (1-r2)*t**2 - r2*t + 1
assert z(Den.subs(x,xs) - qs**2) and z(Den.subs(x,b) - qb**2)
assert z((b-xs)*Den - (b-x)*qs**2 - (x-xs)*qb**2) and z(qs*qb + t**4+4*t**3-1)
assert sp.discriminant(qs,t) < 0 and sp.discriminant(qb,t) > 0
va = (1+2*r2)/7; assert sp.simplify((a-xs)/(a-b) - va**2) == 0
print("S1-S3 passed")

d1 = sp.discriminant(sp.expand(qs-v*qb),t); d2 = sp.discriminant(sp.expand(qs+v*qb),t)
print("  d1 difference:", sp.simplify(d1 - ((4*r2-2)*v**2 + 12*v - (2+4*r2))))
print("  d2 difference:", sp.simplify(d2 - ((4*r2-2)*v**2 - 12*v - (2+4*r2))))
assert z(d1-((4*r2-2)*v**2+12*v-(2+4*r2))) and z(d2-((4*r2-2)*v**2-12*v-(2+4*r2)))
assert sp.simplify(d1.subs(v,va)) == 0
assert sp.simplify((1-va)/((1+r2)+va*(r2-1)) - (r2-1)**2) == 0
assert sp.simplify(Den.subs({x:a,t:1-r2})) == 0 and sp.simplify(sp.diff(Den,t).subs({x:a,t:1-r2})) == 0
print("Step 2 passed")

qsu, qbu = qs.subs(t,u), qb.subs(t,u); s_, p_ = t+u, t*u
assert z(qs*qbu + qsu*qb + 2*(p_**2+2*p_*s_-s_**2+4*p_-1))
assert z(qs*qbu - qsu*qb - 2*r2*(t-u)*(s_-p_+1))
f = tau**4 + 4*c*tau**3 + 4*(1-c**2)*tau**2 - 1
assert z((Pp**2+2*Pp*S-S**2+4*Pp-1).subs({S:2*tau*c, Pp:tau**2}) - f)
for sg in (1,-1): assert sp.simplify(f.subs(c,(tau**2+sg*sp.sqrt(2*tau**4+4*tau**2-1))/(2*tau))) == 0
assert z((2*tau+tau**-3)**2 - (2*tau**2+4-tau**-2) - (2*tau**2+5*tau**-2+tau**-6-4))
assert z(2*(r2-1)**2 + 4*(r2-1) - 2)
assert sp.simplify(sp.expand((r2-1)-(2-r2)**2) - (5*r2-7)) == 0 and 5*r2-7 > 0
assert z(qs.subs(t,-tau)*qb.subs(t,-tau) + tau**4-4*tau**3-1)
print("Step 4 passed")

assert z(x*(x+3)**2+(x-1)**2 - (x+1)*(x**2+6*x+1))
print("Step 6 passed")
print("\nall exact checks passed")
