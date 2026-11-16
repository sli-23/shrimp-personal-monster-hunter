"""在渲染图上画百分比网格，方便写 MAP.spots / seeds.json 的坐标。
用法: python3 -I tools/grid.py assets/monsters/<id>/render.png out.jpg"""
import sys
from PIL import Image, ImageDraw
im = Image.open(sys.argv[1]).convert("RGBA")
bg = Image.new("RGBA", im.size, (60, 52, 48, 255)); bg.alpha_composite(im)
d = ImageDraw.Draw(bg); W, H = im.size
for p in range(0, 101, 10):
    d.line([(W * p / 100, 0), (W * p / 100, H)], fill=(255, 255, 0, 140)); d.line([(0, H * p / 100), (W, H * p / 100)], fill=(255, 255, 0, 140))
    d.text((W * p / 100 + 2, 2), str(p), fill="yellow"); d.text((2, H * p / 100 + 2), str(p), fill="cyan")
bg.convert("RGB").save(sys.argv[2]); print("saved", sys.argv[2])
