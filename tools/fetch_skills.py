"""配装常用技能的名词解释：4 语言名字、说明、每级效果、对应装饰品（珠子）。
来源 MHRice 技能页。输出 data/glossary_skills.js；珠子图标合成到 assets/items/。
用法: python3 -I tools/fetch_skills.py
"""
import json, os, re, subprocess, sys, time
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import mhrice_parse as P
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = "/tmp/mhr_cache"

# (英文技能名, 分组) —— 轻弩配装常见技能
WANT = [
    ("Attack Boost", "攻击 / 会心"), ("Critical Eye", "攻击 / 会心"), ("Weakness Exploit", "攻击 / 会心"), ("Critical Boost", "攻击 / 会心"),
    ("Maximum Might", "攻击 / 会心"), ("Agitator", "攻击 / 会心"), ("Peak Performance", "攻击 / 会心"), ("Latent Power", "攻击 / 会心"),
    ("Burst", "攻击 / 会心"), ("Coalescence", "攻击 / 会心"), ("Critical Element", "属性"),
    ("Fire Attack", "属性"), ("Water Attack", "属性"), ("Thunder Attack", "属性"), ("Ice Attack", "属性"), ("Dragon Attack", "属性"),
    ("Normal/Rapid Up", "弹药 / 弩"), ("Pierce Up", "弹药 / 弩"), ("Spread Up", "弹药 / 弩"), ("Rapid Fire Up", "弹药 / 弩"),
    ("Spare Shot", "弹药 / 弩"), ("Reload Speed", "弹药 / 弩"), ("Recoil Down", "弹药 / 弩"), ("Ballistics", "弹药 / 弩"),
    ("Special Ammo Boost", "弹药 / 弩"), ("Bombardier", "弹药 / 弩"), ("Tune-Up", "弹药 / 弩"),
    ("Bloodlust", "曙光特殊技能"), ("Dereliction", "曙光特殊技能"), ("Blood Rite", "曙光特殊技能"), ("Frenzied Bloodlust", "曙光特殊技能"),
    ("Evade Window", "生存"), ("Evade Extender", "生存"), ("Constitution", "生存"), ("Stamina Surge", "生存"), ("Wirebug Whisperer", "生存"),
    ("Divine Blessing", "生存"), ("Flinch Free", "生存"), ("Health Boost", "生存"), ("Recovery Up", "生存"),
]

def get(path):
    f = os.path.join(CACHE, path.replace("/", "__"))
    if not os.path.exists(f):
        subprocess.run(["curl", "-sL", "--retry", "3", "-A", "Mozilla/5.0 (Macintosh)", "-o", f, "https://mhrise.mhrice.info/" + path], check=True)
        time.sleep(0.15)
    return open(f, encoding="utf-8", errors="ignore").read()

COLORS = dict(re.findall(r"\.mh-item-color-(\d+) \{background-color: (#[0-9A-Fa-f]{6})\}", open(os.path.join(ROOT, "assets", "icons", "item_color.css")).read()))
def item_icon(icon, color):
    out = os.path.join(ROOT, "assets", "items", f"{icon}_{color}.png")
    if os.path.exists(out): return
    os.makedirs(os.path.dirname(out), exist_ok=True); dl = os.path.join(CACHE, "item_dl"); os.makedirs(dl, exist_ok=True)
    r, a = os.path.join(dl, f"{icon}.r.png"), os.path.join(dl, f"{icon}.a.png")
    for f, u in ((r, f"{icon}.r.png"), (a, f"{icon}.a.png")):
        if not os.path.exists(f): subprocess.run(["curl", "-sL", "-A", "Mozilla/5.0", "-o", f, f"https://mhrise.mhrice.info/resources/item/{u}"], check=True)
    R, A = Image.open(r).convert("RGBA"), Image.open(a).convert("RGBA"); hexc = COLORS.get(color, "#FFFFFF")
    img = Image.new("RGBA", R.size, (0, 0, 0, 0))
    img.paste(Image.new("RGBA", R.size, (0, 0, 0, 255)), (0, 0), A.split()[3])
    img.paste(Image.new("RGBA", R.size, tuple(int(hexc[i:i + 2], 16) for i in (1, 3, 5)) + (255,)), (0, 0), R.split()[3])
    img.resize((64, 64), Image.LANCZOS).save(out)

def names4(frag):
    out = {}
    for lang, key in (("zh-CN", "zh"), ("zh-TW", "tw"), ("ja", "ja"), ("en", "en")):
        m = re.search(rf'lang="{lang}"><span>([^<]+)</span>', frag)
        if m: out[key] = P.html.unescape(m.group(1))
    return out

def main():
    lst = get("skill.html")
    links = {}
    for m in re.finditer(r'href="(skill/PlayerSkill_\d+\.html)"', lst):
        seg = lst[m.end(): m.end() + 1500]
        en = re.search(r'lang="en"><span>([^<]+)', seg)
        if en: links.setdefault(P.html.unescape(en.group(1)), m.group(1))
    out = []
    for en, grp in WANT:
        href = links.get(en)
        if not href: print("not found:", en); continue
        page = get(href)
        h1 = re.search(r"<h1[^>]*>(.*?)</h1>", page, re.S).group(1)
        nm = names4(h1)
        desc = P.text(P.section(page, "s-description")).replace("Description ", "", 1)
        parts = re.split(r"Level (\d+): ", desc)
        intro = parts[0]
        zh_intro = re.sub(r"^[^一-鿿【「（]*", "", intro).replace(" ", "")
        levels = []
        for i in range(1, len(parts), 2):
            seg = parts[i + 1].strip()
            m = re.search(r"[一-鿿【「（]", seg)
            levels.append(seg[m.start():].replace(" ", "") if m else seg)
        decos = []
        for tr in re.findall(r"<tr>(.*?)</tr>", P.section(page, "s-decoration"), re.S):
            tds = re.findall(r"<td[^>]*>(.*?)</td>", tr, re.S)
            if len(tds) < 2: continue
            ic = re.search(r'mh-item-color-(\d+)" style="mask-image: url\(&#39;resources/item/(\d+)\.r\.png', tds[0])
            dn = names4(tds[0])
            if not dn: continue
            slot = re.search(r"【(\d)】", dn.get("zh", "")) or re.search(r"(\d)\s*$", dn.get("en", ""))
            lvl = re.sub(r"<[^>]+>", "", tds[1]).strip()
            d = {"n": dn, "slot": int(slot.group(1)) if slot else None, "lv": int(lvl) if lvl.isdigit() else None}
            if ic: d["icon"], d["color"] = ic.group(2), ic.group(1); item_icon(d["icon"], d["color"])
            decos.append(d)
        out.append({"en": en, "group": grp, "n": nm, "desc": zh_intro, "levels": levels, "max": len(levels), "decos": decos, "href": href})
        print(f"{nm.get('zh'):12s} Lv{len(levels)} decos {[(d['n'].get('zh'), d['lv']) for d in decos]}")
    js = "/* 由 tools/fetch_skills.py 从 MHRice 生成：配装常用技能 + 装饰品 */\nMHR.GLOSSARY_SKILLS = " + json.dumps(out, ensure_ascii=False) + ";\n"
    open(os.path.join(ROOT, "data", "glossary_skills.js"), "w").write(js)
    print("wrote", len(out))

main()
