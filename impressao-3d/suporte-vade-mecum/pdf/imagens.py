import sys, math
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import os; os.chdir(Path(__file__).parent)
import numpy as np, trimesh, matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d.art3d import Poly3DCollection
from shapely.ops import unary_union
import gerar as G

p = G.perfil()
lat = G.extrudar(p, G.LARGURA)   # coords do perfil (x,y) e z = largura
tra = trimesh.creation.box((G.LARGURA*2+G.VAO, G.BARRA, G.BARRA))
tra.apply_translation(-tra.bounds[0])

a = math.radians(G.ANGULO)
u = np.array([-math.cos(a), math.sin(a)]); n = np.array([math.sin(a), math.cos(a)])
def quad(o, su, sn):
    o = np.asarray(o, float)
    from shapely.geometry import Polygon
    return Polygon([o, o+u*su, o+u*su+n*sn, o+n*sn])
def pecas(o):
    return (quad(o, G.RAMPA, -G.ESP), quad(o-u*G.ESP-n*G.ESP, G.ESP, G.APARADOR+2*G.ESP), quad(o-u*G.ESP+n*G.APARADOR, G.ESP+G.ABA, G.ESP))
o = np.array([0.0, G.BASE+4-unary_union(pecas((0,0))).bounds[1]])

def xz(v, dy):  # perfil (x,y,z) -> mundo (x, y=z+dy, z=y)
    return np.c_[v[:,0], v[:,2]+dy, v[:,1]]

def cena(ax, livro, cor_lat="#a9c1de", cor_tra="#e8b04a"):
    for dy in (0, G.LARGURA+G.VAO):
        ax.add_collection3d(Poly3DCollection(xz(lat.vertices, dy)[lat.faces], facecolors=cor_lat, shade=True, lightsource=matplotlib.colors.LightSource(azdeg=225, altdeg=40)))
    for xc in G.furos_x(p):
        v = tra.vertices
        w = np.c_[v[:,1]+xc-G.BARRA/2, v[:,0], v[:,2]+G.BASE/2-G.BARRA/2]
        ax.add_collection3d(Poly3DCollection(w[tra.faces], facecolors=cor_tra, shade=True))
    if livro:
        W = 2*G.LARGURA+G.VAO
        for (y0, y1, cor) in ((W/2-170, W/2-2, "#f3ead8"), (W/2+2, W/2+170, "#f3ead8")):
            # bloco: s 0..235 ao longo de u, n 0..36
            b = trimesh.creation.box((235, 36, y1-y0)); b.apply_translation(-b.bounds[0])
            v = b.vertices
            pts2 = o + np.outer(v[:,0], u) + np.outer(v[:,1]+1, n)
            w = np.c_[pts2[:,0], v[:,2]+y0, pts2[:,1]]
            ax.add_collection3d(Poly3DCollection(w[b.faces], facecolors=cor, edgecolors="#c9b893", linewidths=.3, shade=True, alpha=.92))
    ax.set_axis_off()

for nome, livro, az in (("montado", False, -38), ("com-livro", True, -38)):
    fig = plt.figure(figsize=(8, 8)); ax = fig.add_subplot(projection="3d")
    cena(ax, livro)
    W = 2*G.LARGURA+G.VAO
    ys = (-70, W+70) if livro else (-10, W+10)
    xs = (-130, 90); zs = (0, 260)
    ax.set_xlim(*xs); ax.set_ylim(*ys); ax.set_zlim(*zs)
    ax.set_box_aspect((xs[1]-xs[0], ys[1]-ys[0], zs[1]-zs[0]))
    ax.view_init(elev=20, azim=az)
    fig.savefig(nome+".png", dpi=160, bbox_inches="tight", transparent=True)

# perfil com cotas
fig, ax = plt.subplots(figsize=(6, 7.5))
x, y = p.exterior.xy; ax.fill(x, y, color="#dbe5f1", ec="#1f3a5f", lw=1.4)
for i in p.interiors:
    x, y = i.xy; ax.fill(x, y, color="white", ec="#1f3a5f", lw=1.2)
minx, miny, maxx, maxy = p.bounds
def cota(p1, p2, txt, off):
    p1, p2 = np.array(p1), np.array(p2)
    ax.annotate("", p1, p2, arrowprops=dict(arrowstyle="<->", color="#b23a3a", lw=1))
    m = (p1+p2)/2 + off
    ax.text(*m, txt, color="#b23a3a", ha="center", va="center", fontsize=10, fontweight="bold")
cota((minx, -10), (maxx, -10), f"{maxx-minx:.0f} mm", (0, -7))
cota((minx-10, 0), (minx-10, maxy), f"{maxy:.0f} mm", (-14, 0))
ax.text(-12, 135, f"rampa a {G.ANGULO}°", rotation=-62, ha="center", va="center", color="#b23a3a", fontsize=12, fontweight="bold")
ap = o + n*G.APARADOR/2 + u*6
ax.text(*ap, "aparador\n48 mm", fontsize=8, ha="center", color="#1f3a5f")
ax.set_aspect("equal"); ax.axis("off")
ax.set_xlim(minx-30, maxx+20); ax.set_ylim(-25, maxy+10)
fig.savefig("perfil.png", dpi=160, bbox_inches="tight", transparent=True)
print("ok")
