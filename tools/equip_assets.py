"""给 data/equip/<id>.js 里的装备准备图片：
1) 游戏内图标：MHRice 的两层遮罩 (equip/<n>.r.png / .a.png) 按稀有度颜色合成 → assets/equip/icon/<n>_<rar>.png
2) 渲染图：monsterhunterwiki 上有的就下载 → assets/equip/render/<文件名>.png（没有的就不显示）
用法: python3 -I tools/equip_assets.py em132_05 em132_00 em072_08 em072_00
"""
import json, os, re, subprocess, sys, time, unicodedata, urllib.parse
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAR = {1: "#FFFFFF", 2: "#FFFF8B", 3: "#FF9FBD", 4: "#9FE581", 5: "#35CCFF", 6: "#6E8BFF", 7: "#F05A48", 8: "#A9F0FF", 9: "#956EFF", 10: "#FA9A3A"}
DL = "/tmp/mhr_cache/equip_dl"   # 下载的原始文件单独放

def curl(url, out):
    subprocess.run(["curl", "-sL", "-A", "Mozilla/5.0 (Macintosh)", "-o", out, url], check=True); time.sleep(0.1)

def load(eid):
    s = open(os.path.join(ROOT, "data", "equip", eid + ".js")).read()
    i = s.index("] = ", s.index("MHR.equip[")) + 4
    return json.loads(s[i:].rstrip().rstrip(";"))

def icon(n, rar):
    out = os.path.join(ROOT, "assets", "equip", "icon", f"{n}_{rar}.png")
    if os.path.exists(out): return
    os.makedirs(os.path.dirname(out), exist_ok=True); os.makedirs(DL, exist_ok=True)
    r, a = os.path.join(DL, f"{n}.r.png"), os.path.join(DL, f"{n}.a.png")
    for f, u in ((r, f"equip/{n}.r.png"), (a, f"equip/{n}.a.png")):
        if not os.path.exists(f): curl(f"https://mhrise.mhrice.info/resources/{u}", f)
    R, A = Image.open(r).convert("RGBA"), Image.open(a).convert("RGBA")
    col = tuple(int(RAR[rar][i:i + 2], 16) for i in (1, 3, 5)) + (255,)
    img = Image.new("RGBA", R.size, (0, 0, 0, 0))
    img.paste(Image.new("RGBA", R.size, (0, 0, 0, 255)), (0, 0), A.split()[3])
    img.paste(Image.new("RGBA", R.size, col), (0, 0), R.split()[3])
    img.resize((96, 96), Image.LANCZOS).save(out)

def wiki_lookup(titles):
    """批量查 wiki 文件是否存在，返回 {标题: 下载地址}"""
    found = {}
    for i in range(0, len(titles), 40):
        chunk = titles[i:i + 40]
        q = "https://monsterhunterwiki.org/api.php?action=query&prop=imageinfo&iiprop=url&format=json&titles=" + urllib.parse.quote("|".join("File:" + t for t in chunk))
        out = os.path.join(DL, f"q_{abs(hash(q))}.json"); curl(q, out)
        for p in json.load(open(out)).get("query", {}).get("pages", {}).values():
            if "imageinfo" in p: found[p["title"].replace("File:", "").replace(" ", "_")] = p["imageinfo"][0]["url"]   # wiki 把 _ 变成空格
    return found

def save_render(raw, name, key_black=False):
    out = os.path.join(ROOT, "assets", "equip", "render", name)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    im = Image.open(raw).convert("RGBA")
    if key_black:   # 纯黑背景 → 透明（边缘按亮度渐变）
        px = im.load()
        for y in range(im.height):
            for x in range(im.width):
                r, g, b_, a = px[x, y]; m = max(r, g, b_)
                if m < 28: px[x, y] = (r, g, b_, 0)
                elif m < 60: px[x, y] = (r, g, b_, int(255 * (m - 28) / 32))
        bb = im.getbbox(); im = im.crop(bb) if bb else im
    bb = im.getchannel("A").point(lambda a: 255 if a > 8 else 0).getbbox()   # 去掉透明留白
    if bb: im = im.crop(bb)
    im.thumbnail((640, 640)); im.save(out, optimize=True)
    return "assets/equip/render/" + name

def fetch_override(en, o):
    raw = os.path.join(DL, "ov_" + re.sub(r"\W+", "_", en) + ".img")
    if not os.path.exists(raw): curl(o["url"], raw)
    return save_render(raw, "ov_" + re.sub(r"\W+", "_", en) + ".png", o.get("keyBlack"))

def fextra(en):
    """Fextralife 武器页里的武器小图（文件名 = 名字小写 + -mhr-wiki-guide）。"""
    page = os.path.join(DL, "fx_" + re.sub(r"\W+", "_", en) + ".html")
    if not os.path.exists(page):
        curl("https://monsterhunterrise.wiki.fextralife.com/" + urllib.parse.quote(en.replace(" ", "+"), safe="+'"), page)
    s = open(page, encoding="utf-8", errors="ignore").read()
    plain = lambda t: unicodedata.normalize("NFKD", t).encode("ascii", "ignore").decode()   # é → e
    slug = re.sub(r"[^a-z0-9]", "", plain(en).lower())
    for u in re.findall(r'src="(https://static0\.fextralifeimages\.com/file/monsterhunterrise/[^"]+?\.png)"', s):
        fn = u.rsplit("/", 1)[1].lower()
        if "ammo" in fn or fn.startswith("rare-") or "wiki-guide" not in fn: continue
        base = re.sub(r"[^a-z0-9]", "", plain(urllib.parse.unquote(fn)).split("mhr")[0].split("monster")[0])
        if base == slug or (slug.endswith("set") and base == slug[:-3] + "armorset"):   # 防具图有时叫 <系列>_armor_set
            raw = os.path.join(DL, "fxi_" + fn)
            if not os.path.exists(raw): curl(u, raw)
            return save_render(raw, "fx_" + re.sub(r"\W+", "_", en) + ".png")
    return None

def fname(en): return "MHRS-" + re.sub(r"\s+", "_", en.strip())

def main():
    os.makedirs(DL, exist_ok=True)
    for eid in sys.argv[1:]:
        b = load(eid)
        for w in b["weapons"]: icon(w["icon"], w["rar"])
        for a in b["armor"]:
            for p in a["pieces"]: icon(p["icon"], p["rar"])
        want = {}
        for w in b["weapons"]:
            for suf in ("_Render.png", "_Render_001.webp", "_Render.webp"): want[fname(w["names"]["en"]) + suf] = ("w", w["href"])
        for a in b["armor"]:
            for g in ("Male", "Female"):
                for suf in (f"_Armor_{g}_Render.png", f"_Armor_{g}_Render.webp"): want[fname(a["series"]["en"]) + suf] = ("a" + g[0], a["href"])
        found = wiki_lookup(list(want))
        renders = {}
        for t, url in found.items():
            kind, href = want[t]
            ext = os.path.splitext(t)[1]
            out = os.path.join(ROOT, "assets", "equip", "render", t.replace(ext, ".png"))
            os.makedirs(os.path.dirname(out), exist_ok=True)
            if not os.path.exists(out):
                raw = os.path.join(DL, t); curl(url, raw)
                im = Image.open(raw).convert("RGBA"); im.thumbnail((640, 640)); im.save(out, optimize=True)
            renders.setdefault(href, {})[kind] = "assets/equip/render/" + os.path.basename(out)
        # 补图：手动指定 > wiki > Fextralife（几乎每把武器都有一张小图，背景透明）
        ov = {k: v for k, v in json.load(open(os.path.join(ROOT, "tools", "render_overrides.json"))).items() if not k.startswith("_")}
        for w in b["weapons"]:
            en = w["names"]["en"]
            if en in ov:
                renders.setdefault(w["href"], {})["w"] = fetch_override(en, ov[en])
            elif not (renders.get(w["href"]) or {}).get("w"):
                r = fextra(en)
                if r: renders.setdefault(w["href"], {})["w"] = r
        for w in b["weapons"]: w["render"] = (renders.get(w["href"]) or {}).get("w")
        for a in b["armor"]:
            r = renders.get(a["href"]) or {}
            a["render"] = {"m": r.get("aM"), "f": r.get("aF")}
            if not (a["render"]["m"] or a["render"]["f"]):   # Fextralife「<系列> Set」页的整套图
                a["render"]["m"] = fextra(a["series"]["en"] + " Set")
        js = f"/* 由 tools/fetch_equipment.py + tools/equip_assets.py 生成 */\nMHR.equip = MHR.equip || {{}};\nMHR.equip[{json.dumps(eid)}] = {json.dumps(b, ensure_ascii=False)};\n"
        open(os.path.join(ROOT, "data", "equip", eid + ".js"), "w").write(js)
        print(eid, "weapons", len(b["weapons"]), "armor", len(b["armor"]), "renders found", len(found))

main()
