"""怪异调查计算器的数据：每级倍率表（MHRice 隐藏页 quest/anomaly_difficulty_{0怪异|1通常}_{表}.html）
+ 每只怪物的大师基础体力、用哪张表、从几级开始出现。输出 data/anomaly.js。
用法: python3 -I tools/build_anomaly.py [/tmp/mhr_probe/anomaly/tables.json]
"""
import json, os, re, subprocess, sys, time, html
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from mhrice_parse import section, text

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE = "/tmp/mhr_cache"
SRC = sys.argv[1] if len(sys.argv) > 1 else "/tmp/mhr_probe/anomaly/tables.json"

def get(path):
    f = os.path.join(CACHE, path.replace("/", "__"))
    if not os.path.exists(f):
        subprocess.run(["curl", "-sL", "--retry", "3", "-A", "Mozilla/5.0 (Macintosh)", "-o", f, "https://mhrise.mhrice.info/" + path], check=True)
        time.sleep(0.15)
    return open(f, encoding="utf-8", errors="ignore").read()

T = json.load(open(SRC))
KEEP = ["hp", "atk", "part", "stun", "exhaust", "paralyze", "sleep", "ride", "elementA"]
def compact(t):   # 每级一行：[lvFrom, lvTo, hp, atk, part, stun, exhaust, paralyze, sleep, ride, elementA]
    return {"src": t["source"], "rows": [[b["lvFrom"], b["lvTo"]] + [b[k] for k in KEEP] for b in t["bands"]]}

mons = []
icons_dir = os.path.join(ROOT, "assets", "monsters")
for mid, a in T["monsterAssignment"].items():
    page = get(f"monster/{mid}.html")
    basic = text(section(page, "s-basic"))
    hp = re.search(r"\(MR\) (\d+)", basic)
    an = text(section(page, "s-anomaly"))
    aff = re.search(r"Appear as afflicted at (\S+)(?: \(Lv(\d+)\))?", an)
    nor = re.search(r'Appear as normal at "?(\S+?)"?(?: \(Lv(\d+)\))?(?: Or Lv(\d+))?(?= |$)', an)
    risen = "Risen mode stats" in text(page) or mid.endswith("_08")
    icon = os.path.join(icons_dir, "em" + mid, "icon.png")
    if not os.path.exists(icon):
        os.makedirs(os.path.dirname(icon), exist_ok=True)
        subprocess.run(["curl", "-sL", "-A", "Mozilla/5.0", "-o", icon, f"https://mhrise.mhrice.info/resources/em{mid}_icon.png"], check=True)
    def lv(m):
        if not m or m.group(1) == "None": return None
        return int(m.group(2)) if m.group(2) else (int(m.group(3)) if m.lastindex and m.lastindex >= 3 and m.group(3) else 1)
    mons.append({"id": "em" + mid, "en": a["en"], "ja": a["ja"], "zh": a["zhCN"], "baseHP": int(hp.group(1)) if hp else None,
                 "aff": a["afflictedTable"], "nor": a["nonAfflictedTable"], "affFrom": lv(aff), "norFrom": lv(nor),
                 "norAlt": int(nor.group(3)) if nor and nor.group(3) else None, "risen": risen,
                 "icon": f"assets/monsters/em{mid}/icon.png"})
    print(mid, a["zhCN"], hp and hp.group(1), "aff", lv(aff), "nor", lv(nor), nor.group(3) if nor else None)

out = {"tables": {"aff": {k: compact(v) for k, v in T["afflicted"].items()}, "nor": {k: compact(v) for k, v in T["nonAfflicted"].items()}},
       "cols": ["lvFrom", "lvTo"] + KEEP, "monsters": sorted(mons, key=lambda m: m["zh"] or m["en"]),
       "note": "solo HP = MR base HP × hp（Kiranico 核对过）；怪异调查没有体力浮动；多人倍率未公开。"}
js = "/* 由 tools/build_anomaly.py 生成：怪异调查每级倍率（MHRice 隐藏页）+ 怪物基础体力 */\nMHR.ANOMALY = " + json.dumps(out, ensure_ascii=False, separators=(",", ":")) + ";\n"
open(os.path.join(ROOT, "data", "anomaly.js"), "w").write(js)
print("wrote", len(mons), "monsters", len(js) // 1024, "KB")
