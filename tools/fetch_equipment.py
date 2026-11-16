"""从 MHRice 抓所有大师等级（稀有度 ≥8）的武器和防具，按「关键怪物」分组，
生成 data/equip/<emid>.js（每只怪物一个文件，图鉴里任何怪物都能直接用）。

用法: python3 -I tools/fetch_equipment.py [--cache /tmp/mhr_cache] [--types light_bowgun,heavy_bowgun]
网页缓存在 --cache 目录（默认 /tmp/mhr_cache），重跑不会重复下载。
"""
import html, json, os, re, subprocess, sys, time
from html.parser import HTMLParser
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import mhrice_parse as P

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = "https://mhrise.mhrice.info"
CACHE = sys.argv[sys.argv.index("--cache") + 1] if "--cache" in sys.argv else "/tmp/mhr_cache"
TYPES = [("light_bowgun", "轻弩"), ("heavy_bowgun", "重弩"), ("bow", "弓"), ("great_sword", "大剑"), ("long_sword", "太刀"),
         ("short_sword", "片手剑"), ("dual_blades", "双剑"), ("hammer", "大锤"), ("horn", "狩猎笛"), ("lance", "长枪"),
         ("gun_lance", "铳枪"), ("slash_axe", "斩击斧"), ("charge_axe", "盾斧"), ("insect_glaive", "操虫棍")]
if "--types" in sys.argv:
    want = sys.argv[sys.argv.index("--types") + 1].split(",")
    TYPES = [t for t in TYPES if t[0] in want]
LANGS = {"zh-CN": "zh", "zh-TW": "tw", "ja": "ja", "en": "en"}

def get(path):
    f = os.path.join(CACHE, path.replace("/", "__"))
    if not os.path.exists(f):
        os.makedirs(CACHE, exist_ok=True)
        for attempt in range(4):   # 网络偶尔断：重试，失败时删掉半截文件
            r = subprocess.run(["curl", "-sL", "--retry", "2", "-A", "Mozilla/5.0 (Macintosh)", "-o", f + ".part", f"{BASE}/{path}"])
            if r.returncode == 0: os.replace(f + ".part", f); break
            if os.path.exists(f + ".part"): os.remove(f + ".part")
            time.sleep(2 * (attempt + 1))
        else:
            raise RuntimeError("download failed: " + path)
        time.sleep(0.12)
    return open(f, encoding="utf-8", errors="ignore").read()

class Names(HTMLParser):
    """读一个片段里第一组 4 语言名字。"""
    def __init__(self): super().__init__(); self.cur = []; self.out = {}
    def handle_starttag(self, tag, a):
        if tag == "span": self.cur.append(dict(a).get("lang"))
    def handle_endtag(self, tag):
        if tag == "span" and self.cur: self.cur.pop()
    def handle_data(self, d):
        l = next((x for x in reversed(self.cur) if x), None)
        if l in LANGS and d.strip() and LANGS[l] not in self.out: self.out[LANGS[l]] = html.unescape(d.strip())
def names(fragment):
    p = Names(); p.feed(fragment); return p.out

# ---------- 武器树 ----------
class Tree(HTMLParser):
    """解析武器列表页的嵌套 <li> 树：每个 li = (系列名?) + 武器链接 + 子 ul。"""
    def __init__(self):
        super().__init__(); self.stack = []; self.items = []; self.buf = None; self.mode = None; self.depth_li = 0
    def handle_starttag(self, tag, a):
        a = dict(a)
        if tag == "li" and "--data-row" in (a.get("style") or ""):
            node = {"parent": self.stack[-1]["i"] if self.stack else None, "series": None, "i": None, "href": None,
                    "final": False, "rar": None, "icon": None, "_li": True}
            self.stack.append(node)
        elif self.stack:
            node = self.stack[-1]
            cls = a.get("class") or ""
            if tag == "div" and "mh-weapon-series" in cls: self.mode = "series"; self.buf = []
            if tag == "div" and "mh-weapon-tree-label" in cls: node["final"] = "final" in (a.get("data-filter") or "")
            if tag == "a" and node["href"] is None and (a.get("href") or "").startswith("weapon/"):
                node["href"] = a["href"]; self.mode = "name"; self.buf = []
            m = re.search(r"mh-rarity-color-(\d+)", cls)
            if m and node["rar"] is None: node["rar"] = int(m.group(1))
            st = a.get("style") or ""
            m = re.search(r"resources/equip/(\d+)\.r\.png", st)
            if m and node["icon"] is None: node["icon"] = m.group(1)
        if self.buf is not None: self.buf.append(self.get_starttag_text() or "")
    def handle_endtag(self, tag):
        if self.buf is not None:
            self.buf.append(f"</{tag}>")
            if (self.mode == "series" and tag == "div") or (self.mode == "name" and tag == "a"):
                frag = "".join(self.buf); node = self.stack[-1]
                if self.mode == "series": node["series"] = names(frag)
                else: node["names"] = names(frag)
                self.buf = None; self.mode = None
        if tag == "li" and self.stack:
            node = self.stack.pop()
            if node["href"]:
                node["i"] = len(self.items); self.items.append(node)
                # 子节点在 pop 之前已经加入；修正它们的 parent 指向
                for it in self.items:
                    if it.get("_pending") is node: it["parent"] = node["i"]; del it["_pending"]
    def handle_data(self, d):
        if self.buf is not None: self.buf.append(html.escape(d))

def parse_tree(page):
    """更稳的做法：先用正则切出每个 li 的起止，再建树。"""
    items, stack = [], []
    pos = 0
    tok = re.compile(r'<li style="--data-row[^"]*">|</li>|<ul>|</ul>')
    for m in tok.finditer(page):
        t = m.group(0)
        if t.startswith("<li"):
            stack.append({"start": m.end(), "parent": stack[-1]["id"] if stack else None, "id": len(items)})
            items.append(None)
        elif t == "</li>" and stack:
            node = stack.pop()
            frag = page[node["start"]: m.start()]
            # 只取本节点自己的部分（第一个子 <ul> 之前）
            own = frag.split("<ul>", 1)[0]
            href = re.search(r'href="(weapon/[^"]+\.html)"', own)
            ser = re.search(r'<div class="mh-weapon-series".*?</div>', own, re.S)
            lab = re.search(r'<div class="mh-main-filter-item mh-weapon-tree-label" data-filter="([^"]*)"', own)
            rar = re.search(r"mh-rarity-color-(\d+)", own)
            ico = re.search(r"resources/equip/(\d+)\.r\.png", own)
            nm = re.search(r'<span class="mh-weapon-name">(.*?)</a>', own, re.S)
            items[node["id"]] = {"id": node["id"], "parent": node["parent"], "href": href.group(1) if href else None,
                                 "series": names(ser.group(0)) if ser else None, "final": bool(lab and "final" in lab.group(1)),
                                 "rar": int(rar.group(1)) if rar else None, "icon": ico.group(1) if ico else None,
                                 "names": names(nm.group(1)) if nm else {}}
    return [x for x in items if x]

def weapon_detail(href):
    page = get(href)
    key = None
    for tb in P.tables(P.section(page, "s-crafting")) + P.tables(P.section(page, "s-upgrade")):
        if not tb or "Key Monster" not in [c["text"] for c in tb[0]]: continue
        ki = [c["text"] for c in tb[0]].index("Key Monster")
        for r in tb[1:]:
            if len(r) > ki and (r[ki]["en"] or r[ki]["zh"]) and r[0]["text"] != "As layered":
                key = {"en": r[ki]["en"], "zh": r[ki]["zh"]}; break
        if key: break
    stat = P.text(P.section(page, "s-stat"))
    atk = re.search(r"Attack (\d+)", stat); aff = re.search(r"Affinity (-?\d+)%", stat)
    ele = re.search(r"(Fire|Water|Thunder|Ice|Dragon|Poison|Paralysis|Sleep|Blast) (\d+)", stat)
    ammo = []
    for tb in P.tables(P.section(page, "s-ammo")):
        for r in tb[1:]:
            if len(r) >= 3 and r[0]["text"]:
                ammo.append({"n": r[0]["zh"] or r[0]["text"], "cap": int(P.re.search(r"\d+", r[1]["text"]).group()) if re.search(r"\d+", r[1]["text"]) else None,
                             "rf": "Rapid shot" in r[2]["text"]})
    return {"key": key, "atk": int(atk.group(1)) if atk else None, "aff": int(aff.group(1)) if aff else None,
            "ele": [ele.group(1), int(ele.group(2))] if ele else None, "ammo": ammo or None}

# ---------- 防具 ----------
def parse_armor_list(page):
    out = []
    for m in re.finditer(r'<li class="mh-armor-filter-item" data-filter="([^"]*)"[^>]*><a href="(armor/\d+\.html)">(.*?)</a></li>', page, re.S):
        filt, href, body = m.groups()
        if not filt.startswith("mr"): continue   # 大师等级（"mr" 和 "mr layered" 都是真防具；layered 表示也能做外观）
        h2 = re.search(r"<h2>(.*?)</h2>", body, re.S)
        pieces = []
        for pm in re.finditer(r'<div class="mh-colored-icon"><div class="mh-rarity-color-(\d+)" style="mask-image: url\(&#39;resources/equip/(\d+)\.r\.png.*?</div></div>(.*?)</div>', body, re.S):
            pieces.append({"rar": int(pm.group(1)), "icon": pm.group(2), "names": names(pm.group(3))})
        out.append({"href": href, "series": names(h2.group(1)) if h2 else {}, "pieces": pieces})
    return out

def armor_detail(href):
    page = get(href)
    keys = []
    for tb in P.tables(P.section(page, "s-crafting")):
        if not tb or "Key Monster" not in [c["text"] for c in tb[0]]: continue
        ki = [c["text"] for c in tb[0]].index("Key Monster")
        for r in tb[1:]:
            if len(r) > ki: keys.append({"en": r[ki]["en"], "zh": r[ki]["zh"]})
    skills = re.findall(r"([A-Z][A-Za-z'\-/ ]+?) ([一-鿿【】・·]+) \+ (\d)", P.text(P.section(page, "s-stat")))
    tot = {}
    for en, zh, lv in skills: tot.setdefault(zh, [en, zh, 0])[2] += int(lv)   # 整套合计
    return {"keys": keys, "skills": sorted(tot.values(), key=lambda x: -x[2])}

def monster_ids():
    """怪物英文名 → emid。每个 <li><a href="monster/..">…</a></li> 只在自己内部找名字。"""
    page = get("monster.html")
    out = {}
    for m in re.finditer(r'<a href="monster/(\d+_\d+)\.html">(.*?)</a>', page, re.S):
        body = m.group(2)
        en = re.search(r'lang="en"><span>([^<]+)', body) or re.search(r"<div><span>([^<]+)</span></div>", body)
        if en and html.unescape(en.group(1)) not in out: out[html.unescape(en.group(1))] = "em" + m.group(1)
    return out

def main():
    ids = monster_ids()
    by = {}
    def bucket(en):
        eid = ids.get(en)
        if not eid: return None
        return by.setdefault(eid, {"weapons": [], "armor": []})
    for typ, zh in TYPES:
        items = parse_tree(get(f"weapon/{typ}.html"))
        byid = {it["id"]: it for it in items}
        mr = [it for it in items if it["href"] and (it["rar"] or 0) >= 8]
        print(typ, "total", len(items), "MR", len(mr), flush=True)
        details = {it["id"]: weapon_detail(it["href"]) for it in mr}
        for it in mr:
            d = details[it["id"]]
            if not d["key"] or not d["key"]["en"]: continue
            b = bucket(d["key"]["en"])
            if b is None: continue
            # 往下找：同一棵树里继续强化成的武器（用于提示「可继续强化 → …（需要别的怪物）」）
            kids = [c for c in items if c["parent"] == it["id"]]
            path, p = [], it
            while p is not None:
                path.append(p["names"]); p = byid.get(p["parent"])
            series = next((byid[x]["series"] for x in [it["id"]] if byid[x]["series"]), None)
            q = it
            while not series and q["parent"] is not None:
                q = byid[q["parent"]]; series = q["series"]
            b["weapons"].append({"type": typ, "typeZh": zh, "href": it["href"], "names": it["names"], "series": series, "rar": it["rar"],
                                 "icon": it["icon"], "final": it["final"], "path": list(reversed(path)), "atk": d["atk"], "aff": d["aff"],
                                 "ele": d["ele"], "ammo": d["ammo"] if typ in ("light_bowgun", "heavy_bowgun") else None,
                                 "next": [{"names": c["names"], "key": (details.get(c["id"]) or {}).get("key")} for c in kids]})
    for a in parse_armor_list(get("armor.html")):
        d = armor_detail(a["href"])
        ks = {k["en"] for k in d["keys"] if k["en"]}
        for en in ks:
            b = bucket(en)
            if b is None: continue
            b["armor"].append({"href": a["href"], "series": a["series"], "pieces": a["pieces"], "skills": d["skills"]})
    os.makedirs(os.path.join(ROOT, "data", "equip"), exist_ok=True)
    for eid, b in by.items():
        js = f"/* 由 tools/fetch_equipment.py 从 MHRice 生成：关键怪物 = 这只怪物的大师等级武器 / 防具 */\nMHR.equip = MHR.equip || {{}};\nMHR.equip[{json.dumps(eid)}] = {json.dumps(b, ensure_ascii=False)};\n"
        open(os.path.join(ROOT, "data", "equip", eid + ".js"), "w").write(js)
    print("wrote", len(by), "monsters")
    for eid in ("em132_05", "em132_00", "em072_08", "em072_00"):
        b = by.get(eid, {"weapons": [], "armor": []})
        print(eid, "weapons", len(b["weapons"]), "armor", len(b["armor"]))

main()
