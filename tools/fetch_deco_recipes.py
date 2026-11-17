"""装饰品配方 + 每种素材去哪拿。
读 data/glossary_skills.js 里的技能 → MHRice 技能页的 Decoration 表（解锁条件、关键怪物、费用、素材），
再查每种素材的道具页 s-get（哪些怪物 / 任务 / 其他地方），怪物不多时（≤ MAX_MON）
再读怪物页的大师报酬表，找出这个素材在每只怪身上概率最高的拿法。
输出 data/deco_recipes.js；素材图标合成到 assets/items/。
用法: python3 -I tools/fetch_deco_recipes.py
"""
import html, json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import subprocess
import fetch_rewards as R          # get / names / item_icon / parse（main 有 __name__ 保护）
from mhrice_parse import section

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MAX_MON = 8      # 超过这么多只怪都掉的素材（怪异原珠之类）只列怪物数，不逐只查概率
KIND_ZH = {"target": "目标报酬", "carves": "剥取", "capture": "捕获", "breaks": "部位破坏", "drops": "掉落物", "buddy": "随从"}

def load_skills():
    s = open(os.path.join(ROOT, "data", "glossary_skills.js")).read()
    return json.loads(s[s.index("= ") + 2:].rstrip().rstrip(";"))

def plain(h): return " ".join(html.unescape(re.sub(r"<[^>]+>", " ", h)).split())

def deco_rows(page):
    t = section(page, "s-decoration")
    out = []
    for tr in re.findall(r"<tr>(.*?)</tr>", t, re.S)[1:]:
        tds = re.findall(r"<td[^>]*>(.*?)</td>", tr, re.S)
        if len(tds) < 6: continue
        en = R.names(tds[0]).get("en")
        km = re.search(r'href="monster/(\d+_\d+)\.html"', tds[3])
        mats = []
        for li in re.findall(r"<li>(.*?)</li>", tds[5], re.S):
            q = re.match(r"\s*(\d+)x", li); it = R.parse_item(li)
            if it: it["qty"] = int(q.group(1)) if q else 1; mats.append(it)
        unlock = plain(tds[2])
        out.append({"en": en, "unlock": None if unlock in ("None", "") else unlock.replace("Check:HRUnlock", "通关 HR 剧情后"),
                    "key": {"id": "em" + km.group(1), **R.names(tds[3])} if km else None,
                    "cost": int(re.sub(r"\D", "", plain(tds[4])) or 0), "mats": mats})
    return out

def item_sources(href):
    g = section(R.get(href), "s-get")
    out = {"mons": [], "quests": 0, "other": []}
    for blk in re.findall(r'<div class="mh-item-in-out"><h3>([^<]+)</h3>(.*?)</ul></div>', g, re.S):
        h, body = blk
        if h.startswith("From monsters"):
            for a in re.finditer(r'href="monster/(\d+_\d+)\.html".*?</a>', body, re.S):
                out["mons"].append({"id": "em" + a.group(1), **R.names(a.group(0))})
        elif h.startswith("From quests"):
            out["quests"] = len(re.findall(r'href="quest/', body))
        elif h.startswith("From maps"):
            out["maps"] = sorted({R.names(x).get("zh") or plain(x) for x in re.findall(r"<li>(.*?)</li>", body, re.S)})
        elif h.startswith("From other"):
            out["other"] = [plain(x) for x in re.findall(r"<li>(.*?)</li>", body, re.S)]
    return out

def best_on_monster(mid, href):
    """这个素材在这只怪大师报酬里每种拿法的最高概率，按概率降序。"""
    r = R.parse(R.get(f"monster/{mid[2:]}.html"))
    best = {}
    for kind, groups in r.items():
        for g in groups:
            for it in g["items"]:
                if it.get("href") != href: continue
                pn = g.get("part") or {}
                part = pn.get("zh") or part_en(pn.get("en") or "")
                k = (kind, part if kind in ("breaks", "carves", "target") else None)
                if it["p"] > best.get(k, {}).get("p", -1):
                    best[k] = {"kind": KIND_ZH.get(kind, kind), "part": k[1], "p": it["p"]}
    return sorted(best.values(), key=lambda x: -x["p"])[:3]

def part_en(en):
    m = re.match(r"Main body \(x(\d+)\)", en)
    if m: return f"本体（剥 {m.group(1)} 次）"
    return PART_EN.get(en, en)
PART_EN = {"Special": "特殊", "Main body": "本体", "Severed part A": "切断部位（尾）", "Severed part B": "切断部位 B"}
OTHER_ZH = {"Market lucky prize": "杂货屋抽奖", "Motley mix": "炼金·杂锦", "Anomaly research lab": "怪异研究所（换取）", "Meowcenaries": "随从派遣（翔虫船）", "Argosy": "交易船",
            "Melding": "炼金", "Trading": "交易", "Buddy Plaza": "随从广场"}

def mon_icon(eid):
    f = os.path.join(ROOT, "assets", "monsters", eid, "icon.png")
    if os.path.exists(f): return
    os.makedirs(os.path.dirname(f), exist_ok=True)
    subprocess.run(["curl", "-sL", "-A", "Mozilla/5.0", "-o", f, f"https://mhrise.mhrice.info/resources/{eid}_icon.png"], check=True)

def main():
    skills = load_skills()
    recipes, mats = {}, {}
    for sk in skills:
        for d in deco_rows(R.get(sk["href"])):
            recipes[d["en"]] = {k: v for k, v in d.items() if k != "en"}
            recipes[d["en"]]["mats"] = [{"href": m["href"], "qty": m["qty"]} for m in d["mats"]]
            for m in d["mats"]:
                if m["href"] in mats: continue
                R.item_icon(m["icon"], m["color"])
                src = item_sources(m["href"])
                for mon in (src["mons"] if len(src["mons"]) <= MAX_MON else []):
                    mon["best"] = best_on_monster(mon["id"], m["href"])
                for mon in src["mons"][:MAX_MON]: mon_icon(mon["id"])
                src["other"] = [OTHER_ZH.get(o, o) for o in src["other"]]
                mats[m["href"]] = {"n": m["n"], "icon": m["icon"], "color": m["color"], **src}
                print(f"  {m['n'].get('zh'):10s} 怪物 {len(src['mons']):2d}  任务 {src['quests']}  其他 {src['other']}")
        print(sk["n"]["zh"], [(d, recipes[d]["cost"]) for d in recipes if d in {x["n"]["en"] for x in sk["decos"]}])
    js = ("/* 由 tools/fetch_deco_recipes.py 从 MHRice 生成：装饰品配方 + 素材来源 */\n"
          "MHR.DECO_RECIPES = " + json.dumps(recipes, ensure_ascii=False, separators=(",", ":")) + ";\n"
          "MHR.DECO_MATS = " + json.dumps(mats, ensure_ascii=False, separators=(",", ":")) + ";\n")
    open(os.path.join(ROOT, "data", "deco_recipes.js"), "w").write(js)
    print("wrote", len(recipes), "decos,", len(mats), "materials,", len(js) // 1024, "KB")

if __name__ == "__main__":
    main()
