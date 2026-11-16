"""从 MHRice 抓一只怪物的数据，生成 data/monsters/<emid>.js（草稿）。

用法:
  python3 -I tools/fetch_monster.py 072_08            # 生成草稿 + 下载图标
  python3 -I tools/fetch_monster.py 132_05 --dry-run  # 只打印 JSON（回归检查用）

自动生成：名字、基础体力、各阶段肉质、部位耐久、异常耐性、任务倍率、属性弱点（按肉质计算）。
需要手写：阶段名称、招式、配装、盟友、视频、渲染图坐标（见 ADD_MONSTER.md）。
"""
import json, os, re, subprocess, sys, datetime, html
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import mhrice_parse as P

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = "https://mhrise.mhrice.info"
UA = "Mozilla/5.0 (Macintosh)"

def get(url, out=None):
    args = ["curl", "-sL", "-A", UA, url]
    if out: args += ["-o", out]
    r = subprocess.run(args, capture_output=True, check=True)
    return r.stdout.decode("utf-8", "ignore") if not out else None

def num(s, default=0):
    m = re.search(r"-?\d+(?:\.\d+)?", s or "")
    return float(m.group()) if m else default

# MHRice 肉质列序: 斩 打 弹 火 水 冰 雷 龙 眩晕 → 本站列序: 斩 打 弹 火 水 雷 冰 龙 眩晕
def hz_row(cells):
    v = [int(num(c["text"])) for c in cells]
    sl, im, sh, fi, wa, ic, th, dr, st = v
    return {"sever": sl, "blunt": im, "shot": sh, "fire": fi, "water": wa, "thunder": th, "ice": ic, "dragon": dr, "stun": st}

def parse_hitzones(page):
    rows = P.tables(P.section(page, "s-hitzone"))[0][1:]
    parts, cur = [], None
    for r in rows:
        if r and r[0]["text"].startswith("["):      # 新部位：[idx] 阶段 名称 9 个数值
            nm = r[2]
            if not (nm["en"] or nm["zh"]): cur = None; continue   # 无效部位
            cur = {"en": nm["en"] or "", "name": nm["zh"] or nm["en"], "hz": [hz_row(r[3:12])]}
            parts.append(cur)
        elif cur is not None and len(r) >= 10:        # 同一部位的下一个阶段：阶段 (空名) 9 个数值
            cur["hz"].append(hz_row(r[-9:]))
    # 去掉全 0 的占位部位
    parts = [p for p in parts if any(any(v for v in h.values()) for h in p["hz"])]
    ids = {}
    for p in parts:   # 生成稳定的英文 id
        base = re.sub(r"[^a-z]", "", (p["en"] or "part").lower()) or "part"
        ids[base] = ids.get(base, 0) + 1
        p["id"] = base if ids[base] == 1 else f"{base}{ids[base]}"
    return parts

def parse_parts(page):
    out = []
    for r in P.tables(P.section(page, "s-parts"))[0][1:]:
        if not r or r[1]["text"] in ("-1", ""): continue
        brk = re.search(r"\)\s*(\d+)", r[2]["text"])
        sev = re.search(r"(\d+)", r[3]["text"])
        out.append({"idx": r[0]["text"], "stagger": int(num(r[1]["text"])), "brk": int(brk.group(1)) if brk else None,
                    "sever": int(sev.group(1)) if sev else None, "severType": "Slash" if "Slash" in r[3]["text"] else None})
    return out

STATUS_MAP = {"Poison": ("poison", "毒", "poison"), "Paralyze": ("paralysis", "麻痹", "para"), "Sleep": ("sleep", "睡眠", "sleep"),
              "Blast": ("blast", "爆破", "blast"), "Stun": ("stun", "眩晕", "stun"), "Exhaust": ("exhaust", "减气", "exhaust")}
def parse_status(page):
    got = {}
    for r in P.tables(P.section(page, "s-status"))[0][1:]:
        k = r[0]["text"]
        if k not in STATUS_MAP: continue
        m = re.search(r"(\d+) \(\+(\d+)\) → (\d+)", ([x for x in r[1]["text"].split("|") if x.strip()] or [""])[0])
        if not m: continue
        init, inc, mx = map(int, m.groups())
        if k in got and got[k]["init"] > 0: continue       # 第一组常是全 0 的预设，取非 0 那组
        dur = re.match(r"(\d+) sec", r[4]["text"])
        dmg = r[6]["text"]
        sid, zh, icon = STATUS_MAP[k]
        got[k] = {"id": sid, "name": zh, "icon": icon, "init": init, "inc": inc, "max": mx,
                  "dur": (f"{dur.group(1)} 秒" if dur and dur.group(1) != "0" else ""), "dmg": dmg, "ok": init > 0}
    order = ["Poison", "Paralyze", "Sleep", "Blast", "Stun", "Exhaust"]
    out = [got[k] for k in order if k in got]
    for s in out:
        if not s["ok"]: s["dur"] = "无效"
    return out

def parse_quests(page):
    t = P.tables(P.section(page, "s-quest"))
    if not t: return []
    head = [c["text"] for c in t[0][0]]
    col = {h: i for i, h in enumerate(head)}
    out = []
    for r in t[0][1:]:
        if len(r) < len(head): continue
        q = r[0]
        rank = re.search(r"\b(MR\d+|HR\d+|LR\d+|\d★)", q["text"])
        nm = q["zh"] or q["text"]
        nm = re.sub(r"^(MR\d+|HR\d+|LR\d+)", "", nm).replace("Target", "").replace("High level", "").replace("Event", "").strip()
        if not (rank and rank.group(1).startswith("MR")): continue   # 只要大师等级
        first = lambda i: num(r[i]["text"].split("/")[0], 1)
        out.append({"id": f"q{len(out)}", "name": f"{rank.group(1).replace('MR', 'MR')}★ {nm}", "hpMul": first(col["HP"]),
                    "atkMul": first(col["Attack"]), "partMul": first(col["Parts"]), "defMul": first(col["Defense"]),
                    "statusMul": {"stun": first(col["Stun"]), "paralysis": first(col["Paralyze"]), "sleep": first(col["Sleep"])},
                    "src": "mhrice", "verified": False})
    return out

def weakness(parts):
    """按通常状态下各部位属性肉质的平均值估算星级（≥15 ★3，≥10 ★2，≥5 ★1）。"""
    els = [("dragon", "龙"), ("fire", "火"), ("water", "水"), ("thunder", "雷"), ("ice", "冰")]
    avg = {e: sum(p["hz"][0][e] for p in parts) / len(parts) for e, _ in els}
    star = lambda v: 3 if v >= 15 else 2 if v >= 10 else 1 if v >= 5 else 0
    return sorted([{"el": e, "name": n, "stars": star(avg[e]), "avgHz": round(avg[e], 1), "computed": True} for e, n in els], key=lambda w: -w["avgHz"])

def fetch(mid):
    page = get(f"{BASE}/monster/{mid}.html")
    nm = P.names(page)
    basic = P.text(P.section(page, "s-basic"))
    hp = re.search(r"Base HP \(LR/HR\) (\d+), \(MR\) (\d+)", basic)
    desc = P.text(P.section(page, "s-description"))
    parts = parse_hitzones(page)
    nphase = max(len(p["hz"]) for p in parts)
    for p in parts:   # 阶段数不足的部位补齐
        while len(p["hz"]) < nphase: p["hz"].append(dict(p["hz"][-1]))
    return {
        "id": "em" + mid, "mhrice": mid, "name": nm["zh"], "nameAlt": f"{nm['en']} · {nm['ja']}", "en": nm["en"], "ja": nm["ja"],
        "icon": f"assets/monsters/em{mid}/icon.png", "baseHP": int(hp.group(2)) if hp else None,
        "states": [{"id": i, "name": "通常" if i == 0 else f"阶段 {i}", "short": "通常" if i == 0 else f"阶段{i}", "guess": i > 0,
                    "color": ["#c9c2b4", "#c2414b", "#e0612f", "#8f1d2c", "#7a5ab8", "#4a8fb8"][i % 6], "desc": "待补充"} for i in range(nphase)],
        "parts": [{"id": p["id"], "name": p["name"], "en": p["en"], "hz": p["hz"], "stagger": None, "brk": None, "note": ""} for p in parts],
        "partsRaw": parse_parts(page),
        "status": parse_status(page), "quests": parse_quests(page), "weakness": weakness(parts),
        "desc": desc[:600],
    }

TEMPLATE = """/* {name} — 由 tools/fetch_monster.py 从 MHRice ({mid}) 生成于 {date}。
 * status: "draft" = 只有数据，攻略内容待补充（见 ADD_MONSTER.md）。 */
MHR.registerMonster({{
  id: "{id}", status: "draft", updated: "{date}",
  MONSTER: {monster},
  MAP: {{ render: null, spots: [], diagram: null }},
  STATE_PAGES: [],
  BUILDS: [], FOLLOWERS: null, VIDEOS: [], UNVERIFIED: ["本怪物为草稿：阶段名称、招式、配装尚未整理。", "属性弱点星级按最高属性肉质自动计算。"],
  SOURCES: {{ mhrice: {{ name: "MHRice {mid}", url: "{base}/monster/{mid}.html" }} }},
}});
"""

def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    mid = args[0]
    data = fetch(mid)
    if "--dry-run" in sys.argv:
        print(json.dumps(data, ensure_ascii=False, indent=1)); return
    d = os.path.join(ROOT, "assets", "monsters", data["id"]); os.makedirs(d, exist_ok=True)
    get(f"{BASE}/resources/em{mid}_icon.png", os.path.join(d, "icon.png"))
    out = os.path.join(ROOT, "data", "monsters", data["id"] + ".js")
    if os.path.exists(out) and "--force" not in sys.argv:
        print("已存在，不覆盖：", out, "（用 --force 覆盖）"); return
    js = TEMPLATE.format(name=data["name"], mid=mid, date=datetime.date.today().isoformat(), id=data["id"],
                         monster=json.dumps(data, ensure_ascii=False, indent=2), base=BASE)
    open(out, "w").write(js)
    # 注册到 index.js
    idx = os.path.join(ROOT, "data", "monsters", "index.js")
    s = open(idx).read()
    if f'id: "{data["id"]}"' not in s:
        entry = (f'  {{ id: "{data["id"]}", name: "{data["name"]}", en: "{data["en"]}", ja: "{data["ja"]}", aliases: [], '
                 f'icon: "{data["icon"]}", type: "", status: "draft", updated: "{datetime.date.today().isoformat()}" }},\n')
        s = s.replace("  // @@NEXT@@", entry + "  // @@NEXT@@")
        open(idx, "w").write(s)
    print("写入", out)

main()
