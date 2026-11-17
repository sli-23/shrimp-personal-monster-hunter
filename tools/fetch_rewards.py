"""从 MHRice 抓怪物的大师等级素材掉落（目标报酬、剥取、部位破坏、掉落物、操龙、随从），
写 data/rewards/<emid>.js，并合成道具图标到 assets/items/。
用法: python3 -I tools/fetch_rewards.py em132_05 em072_08 ...   （默认：图鉴里的全部怪物）
"""
import html, json, os, re, subprocess, sys, time
from PIL import Image
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from mhrice_parse import section

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = "/tmp/mhr_cache"
LANGS = {"zh-CN": "zh", "zh-TW": "tw", "ja": "ja", "en": "en"}

def get(path):
    f = os.path.join(CACHE, path.replace("/", "__"))
    if not os.path.exists(f):
        os.makedirs(CACHE, exist_ok=True)
        subprocess.run(["curl", "-sL", "--retry", "3", "-A", "Mozilla/5.0 (Macintosh)", "-o", f, "https://mhrise.mhrice.info/" + path], check=True)
        time.sleep(0.15)
    return open(f, encoding="utf-8", errors="ignore").read()

def names(frag):
    out = {}
    for lang, key in LANGS.items():
        m = re.search(rf'lang="{lang}"><span>([^<]+)</span>', frag)
        if m: out[key] = html.unescape(m.group(1))
    return out

COLORS = dict(re.findall(r"\.mh-item-color-(\d+) \{background-color: (#[0-9A-Fa-f]{6})\}",
                         open(os.path.join(ROOT, "assets", "icons", "item_color.css")).read()))

def item_icon(icon, color):
    out = os.path.join(ROOT, "assets", "items", f"{icon}_{color}.png")
    if os.path.exists(out): return
    os.makedirs(os.path.dirname(out), exist_ok=True)
    dl = os.path.join(CACHE, "item_dl"); os.makedirs(dl, exist_ok=True)
    r, a = os.path.join(dl, f"{icon}.r.png"), os.path.join(dl, f"{icon}.a.png")
    for f, u in ((r, f"{icon}.r.png"), (a, f"{icon}.a.png")):
        if not os.path.exists(f):
            subprocess.run(["curl", "-sL", "-A", "Mozilla/5.0", "-o", f, f"https://mhrise.mhrice.info/resources/item/{u}"], check=True)
    R, A = Image.open(r).convert("RGBA"), Image.open(a).convert("RGBA")
    hexc = COLORS.get(color, "#FFFFFF")
    img = Image.new("RGBA", R.size, (0, 0, 0, 0))
    img.paste(Image.new("RGBA", R.size, (0, 0, 0, 255)), (0, 0), A.split()[3])
    img.paste(Image.new("RGBA", R.size, tuple(int(hexc[i:i + 2], 16) for i in (1, 3, 5)) + (255,)), (0, 0), R.split()[3])
    img.resize((64, 64), Image.LANCZOS).save(out)

def parse_item(cell):
    m = re.search(r'mh-item-color-(\d+)" style="mask-image: url\(&#39;resources/item/(\d+)\.r\.png', cell)
    if not m: return None
    q = re.match(r"\s*(\d+)x", re.sub(r"<[^>]+>", "", cell))
    href = re.search(r'href="(item/[^"]+)"', cell)
    return {"n": names(cell), "qty": int(q.group(1)) if q else 1, "icon": m.group(2), "color": m.group(1), "href": href.group(1) if href else None}

def cells(tr):
    return re.findall(r"<t[dh]([^>]*)>(.*?)</t[dh]>", tr, re.S)

KIND = {"Target rewards": "target", "Carves": "carves", "Capture rewards": "capture", "Broken part rewards": "breaks",
        "Dropped materials": "drops", "From buddy": "buddy"}

def parse(page):
    sec = section(page, "s-reward-mr")
    out = {}
    for tb in re.findall(r"<table>(.*?)</table>", sec, re.S):
        rows = re.findall(r"<tr>(.*?)</tr>", tb, re.S)
        head = [re.sub(r"<[^>]+>", "", c[1]).strip() for c in cells(rows[0])]
        kind = next((KIND[h] for h in head if h in KIND), None)
        if not kind: continue
        groups, cur = [], None
        for tr in rows[1:]:
            cs = cells(tr)
            # 分组标题格：带 rowspan 或不是道具格
            if cs and "rowspan" in cs[0][0] or (cs and not parse_item(cs[0][1]) and len(cs) >= 2 and not re.search(r"\d+%", cs[0][1])):
                label_html = cs[0][1]
                nm = names(label_html)
                plain = re.sub(r"<[^>]+>", " ", label_html)
                rule = re.search(r"(All of|Any of):", plain)
                idxs = re.findall(r"\[(\d+)\]\(x(\d+)\)", plain)
                label = nm or {"en": " ".join(plain.split())}
                cur = {"part": label, "rule": rule.group(1) if rule else None, "idx": [int(i) for i, _ in idxs], "items": []}
                groups.append(cur); cs = cs[1:]
            if len(cs) < 2: continue
            it = parse_item(cs[0][1]); p = re.search(r"(\d+)%", cs[-1][1])
            if not it or not p: continue
            it["p"] = int(p.group(1))
            if cur is None: cur = {"part": None, "items": []}; groups.append(cur)
            cur["items"].append(it)
        # 「掉落物」表里第二张小表是操龙
        if kind == "drops" and any(re.sub(r"<[^>]+>", "", c[1]).strip() == "Riding" for r in rows for c in cells(r)):
            pass
        out.setdefault(kind, []).extend(g for g in groups if g["items"])
    return out

def main():
    reg = open(os.path.join(ROOT, "data", "monsters", "index.js")).read()
    ids = sys.argv[1:] or re.findall(r'id: "(em\d+_\d+)"', reg)
    os.makedirs(os.path.join(ROOT, "data", "rewards"), exist_ok=True)
    for eid in ids:
        mid = eid[2:]
        r = parse(get(f"monster/{mid}.html"))
        for groups in r.values():
            for g in groups:
                for it in g["items"]: item_icon(it["icon"], it["color"])
        js = f"/* 由 tools/fetch_rewards.py 从 MHRice 生成：大师等级素材掉落 */\nMHR.rewards = MHR.rewards || {{}};\nMHR.rewards[{json.dumps(eid)}] = {json.dumps(r, ensure_ascii=False)};\n"
        open(os.path.join(ROOT, "data", "rewards", eid + ".js"), "w").write(js)
        print(eid, {k: [(g["part"] or {}).get("zh", (g["part"] or {}).get("en")) if g["part"] else "-" for g in v] for k, v in r.items()})

main()
