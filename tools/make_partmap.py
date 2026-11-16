"""把怪物渲染图切成部位区域，生成 2D 热力图用的部位图。
输入: assets/monsters/<id>/render.png + seeds.json（每个部位若干种子点，百分比坐标）
输出: data/monsters/<id>.partmap.js —— 一张 data-URI PNG：
      R = 部位编号+1（0 = 背景），G = 原图亮度，B = 边缘标记，A = 轮廓
用法: python3 -I tools/make_partmap.py em132_05 [--preview out.png]"""
import base64, io, json, os, sys
import numpy as np
from PIL import Image, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
mid = sys.argv[1]
d = os.path.join(ROOT, "assets", "monsters", mid)
seeds = {k: v for k, v in json.load(open(os.path.join(d, "seeds.json"))).items() if not k.startswith("_")}
img = Image.open(os.path.join(d, "render.png")).convert("RGBA")
W = 720
img = img.resize((W, round(img.height * W / img.width)), Image.LANCZOS)
H = img.height
a = np.asarray(img).astype(np.float32)
alpha = a[..., 3]
lum = (0.299 * a[..., 0] + 0.587 * a[..., 1] + 0.114 * a[..., 2])
# 亮度做对比度拉伸，让阴影更明显
lo, hi = np.percentile(lum[alpha > 128], [3, 97])
lum = np.clip((lum - lo) / max(1, hi - lo), 0, 1)

parts = list(seeds.keys())
pts, lab = [], []
for i, p in enumerate(parts):
    for x, y in seeds[p]:
        pts.append((x / 100 * W, y / 100 * H)); lab.append(i)
pts = np.array(pts); lab = np.array(lab)
yy, xx = np.mgrid[0:H, 0:W]
# 最近种子点（分块计算省内存）
best = np.zeros((H, W), np.int32); bestd = np.full((H, W), np.inf, np.float32)
for (px, py), l in zip(pts, lab):
    dd = (xx - px) ** 2 + (yy - py) ** 2
    m = dd < bestd; bestd[m] = dd[m]; best[m] = l
mask = alpha > 100
idx = np.where(mask, best + 1, 0).astype(np.uint8)
# 部位边界：相邻像素部位不同
edge = np.zeros_like(mask)
edge[1:, :] |= (idx[1:, :] != idx[:-1, :]); edge[:, 1:] |= (idx[:, 1:] != idx[:, :-1])
edge &= mask
edge_img = Image.fromarray((edge * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(3))
edge = np.asarray(edge_img) > 0
out = np.zeros((H, W, 4), np.uint8)
out[..., 0] = idx; out[..., 1] = (lum * 255).astype(np.uint8); out[..., 2] = (edge * 255).astype(np.uint8)
out[..., 3] = np.where(mask, 255, 0)
buf = io.BytesIO(); Image.fromarray(out).save(buf, "PNG", optimize=True)
uri = "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()
# 每个部位的标签位置：区域质心
centers = {}
for i, p in enumerate(parts):
    ys, xs = np.nonzero(idx == i + 1)
    if len(xs): centers[p] = [round(float(xs.mean()) / W * 100, 1), round(float(ys.mean()) / H * 100, 1)]
js = f"/* 由 tools/make_partmap.py 生成，不要手改 */\nMHR.partmaps = MHR.partmaps || {{}};\nMHR.partmaps[{json.dumps(mid)}] = {json.dumps({'w': W, 'h': H, 'parts': parts, 'centers': centers, 'png': uri})};\n"
open(os.path.join(ROOT, "data", "monsters", mid + ".partmap.js"), "w").write(js)
print(mid, W, H, "parts", parts, "bytes", len(js))
if "--preview" in sys.argv:
    pal = np.array([[0, 0, 0], [230, 80, 70], [240, 200, 90], [90, 160, 230], [120, 210, 120], [200, 120, 220], [240, 150, 60], [100, 220, 220], [220, 220, 220], [160, 100, 60]], np.uint8)
    pv = pal[idx % len(pal)] * (0.4 + 0.6 * lum[..., None]); pv[edge] = 0
    Image.fromarray(pv.astype(np.uint8)).save(sys.argv[sys.argv.index("--preview") + 1])
