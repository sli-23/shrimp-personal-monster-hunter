/* 猎人手记 · 轻弩 — v3 多怪物单页应用
 * 路由：#/ 怪物图鉴 · #/m/<id>/<page> 怪物页 · #/guide/lbg 轻弩基础 · #/sources 来源
 * 怪物数据按需加载（注入 <script>，file:// 下也能用）。 */
(() => {
const D = window.MHR, C = window.MHRCalc;
const { AMMO, SKILLS, WEAPONS } = D;
const $ = s => document.querySelector(s);
const fmt = (x, d = 1) => (Math.round(x * 10 ** d) / 10 ** d).toLocaleString("zh-CN", { minimumFractionDigits: d, maximumFractionDigits: d });
const md = t => String(t).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
const esc = t => String(t).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const IMG = { n1:"normal",n2:"normal",n3:"normal",p1:"pierce",p2:"pierce",p3:"pierce",s1:"spread",s2:"spread",s3:"spread",
  st2:"sticky",st3:"sticky",slice:"slicing",fire:"fire",pfire:"pfire",ice:"ice",pice:"pice",thunder:"thunder",dragon:"dragon",pdragon:"pdragon",wb:"wyvern" };
const aImg = a => `assets/icons/ammo_${IMG[a.id] || "normal"}.png`;
const ICON = { fire:"fire", water:"water", thunder:"thunder", ice:"ice", dragon:"dragon" };
const COLS = [
  { k: "shot", n: "弹", img: "hit_shell" }, { k: "dragon", n: "龙", img: "dragon" }, { k: "fire", n: "火", img: "fire" },
  { k: "thunder", n: "雷", img: "thunder" }, { k: "ice", n: "冰", img: "ice" }, { k: "sever", n: "斩", img: "hit_slash" },
];

// ---------------- 当前怪物 ----------------
let MON = null, M = null, MAPD = null, TEXT = {}, WEAPON = null, weapRF = new Set();
const VIEW = JSON.parse(localStorage.getItem("mhr_view") || "{}");   // 每只怪物各自记住：状态/部位/任务…
const S = {
  state: 0, part: "head", col: "shot", view: "img", quest: null, path: "auto", onlyWeap: true, fAmmo: "p2", fRF: true,
  o: { atk: 320, aff: 0, attack: 7, critEye: 7, wex: 2, critBoost: 3, normalUp: 0, pierceUp: 2, spreadUp: 0, rapidUp: 3,
       dragonAtk: 0, fireAtk: 0, iceAtk: 0, critEle: 0, bloodlust: 0, extraAtk: 0, extraAff: 30, dist: 1, defMul: 1, critFire: false },
};
const saveView = () => { if (MON) { VIEW[MON.id] = { state: S.state, part: S.part, col: S.col, view: S.view, quest: S.quest, path: S.path }; localStorage.setItem("mhr_view", JSON.stringify(VIEW)); } };
function setMonster(id) {
  if (MON && MON.id === id) return;
  saveView();
  MON = D.monsters[id]; M = MON.MONSTER; MAPD = MON.MAP || {}; TEXT = MON.TEXT || {};
  WEAPON = MON.weapon ? WEAPONS[MON.weapon] : null;
  weapRF = new Set(WEAPON ? Object.entries(WEAPON.ammo).filter(([, v]) => v.rf).map(([k]) => k) : []);
  const v = VIEW[id] || {};
  const firstWeak = (M.parts.find(p => p.hz[0].shot >= 45) || M.parts[0]).id;
  Object.assign(S, { state: 0, part: firstWeak, col: "shot", view: MAPD.render ? "img" : "2d", quest: M.quests[0]?.id, path: "auto", onlyWeap: !!WEAPON },
    Object.fromEntries(Object.entries(v).filter(([k, x]) => x !== undefined && (k !== "part" || M.parts.some(p => p.id === x)) && (k !== "quest" || M.quests.some(q => q.id === x)))));
  if (!MAPD.render) S.view = "2d";
  if (S.state >= M.states.length) S.state = 0;
  buildPages();
}
const loaded = {};
function loadMonster(id) {
  if (D.monsters[id]) return Promise.resolve(D.monsters[id]);
  if (!D.REGISTRY.some(r => r.id === id)) return Promise.reject(new Error("unknown monster " + id));
  return loaded[id] ||= new Promise((ok, bad) => {
    const s = document.createElement("script"); s.src = `data/monsters/${id}.js`;
    s.onload = () => D.monsters[id] ? ok(D.monsters[id]) : bad(new Error("bundle did not register: " + id));
    s.onerror = () => bad(new Error("failed to load " + id)); document.head.appendChild(s);
  });
}
const loadAll = () => Promise.all(D.REGISTRY.map(r => loadMonster(r.id)));

const quest = () => M.quests.find(q => q.id === S.quest) || M.quests[0] || { name: "—", hpMul: 1, statusMul: {} };
const questHP = () => Math.round(M.baseHP * quest().hpMul);
const partObj = id => M.parts.find(p => p.id === id);
const stName = i => M.states[i].name;
const weakParts = (st, mon = M) => mon.parts.filter(p => p.hz[st].shot >= 45).map(p => p.name);
const isDraft = () => MON.status === "draft";
const TODO = t => `<div class="todo">✎ ${t || "待补充"}：这只怪物还是<b>草稿</b>（只有 MHRice 数据），攻略内容还没写。</div>`;

// ---------------- 颜色 ----------------
const STOPS = [[0,"#2b2420"],[10,"#3d2b26"],[20,"#6a2a2b"],[30,"#9b2c30"],[40,"#c9463b"],[45,"#d9993a"],[60,"#f0cf7a"]];
function heat(v, col) {
  const scale = col === "shot" || col === "sever" ? 1 : 2;
  v = Math.min(60, v * scale);
  for (let i = 1; i < STOPS.length; i++) if (v <= STOPS[i][0]) {
    const [a, ca] = STOPS[i - 1], [b, cb] = STOPS[i], t = (v - a) / (b - a || 1);
    const h = c => [1, 3, 5].map(j => parseInt(c.slice(j, j + 2), 16));
    const x = h(ca), y = h(cb);
    return `rgb(${x.map((n, k) => Math.round(n + (y[k] - n) * t)).join(",")})`;
  }
  return STOPS.at(-1)[1];
}

// ---------------- 弹药排名 ----------------
function pathFor(a) {
  const paths = MAPD.piercePaths || [];
  if (!(a.kind === "pierce" || a.kind === "element-pierce") || S.path === "single" || !paths.length) return null;
  if (S.path === "auto") {
    const best = paths.filter(p => p.hits && p.hits[S.part]).sort((x, y) => y.hits[S.part] - x.hits[S.part])[0];
    return best ? best.hits : null;
  }
  return (paths.find(p => p.id === S.path) || {}).hits || null;
}
function ranking(part = S.part, state = S.state) {
  const saved = [S.part, S.state]; S.part = part; S.state = state;
  const useW = S.onlyWeap && WEAPON;
  const list = useW ? AMMO.filter(a => WEAPON.ammo[a.id]) : AMMO;
  const r = C.rankAmmo(list, part, state, S.o, { rfSet: useW ? weapRF : null, pathFor, monster: M });
  [S.part, S.state] = saved;
  return r;
}

// ---------------- 页面目录（每只怪物生成一次） ----------------
let PAGES = [], ORDER = [];
// 阶段页列表：有 STATE_PAGES 就按行为状态分页（可能和肉质阶段不同），否则按肉质阶段
const phaseList = () => (MON.STATE_PAGES && MON.STATE_PAGES.length)
  ? MON.STATE_PAGES.map((sp, i) => ({ i, name: sp.title, color: sp.color || (M.states[sp.hzState ?? sp.state] || M.states[0]).color, hz: sp.hzState ?? sp.state ?? 0, sp }))
  : M.states.map(st => ({ i: st.id, name: st.name, color: st.color, hz: st.id, sp: null }));
function buildPages() {
  PAGES = [
    { id: "", t: "速读" },
    { group: "打法", items: [{ id: "map", t: "打哪里" }, { id: "ammo", t: "用什么弹" }, { id: "phase", t: phaseList().length > 1 ? "阶段与招式" : "招式", children: phaseList().map((_, i) => i) }] },
    { group: "原理", items: [{ id: "formula", t: "伤害怎么算" }] },
    { group: "准备", items: [{ id: "equip", t: "能做的装备" }, { id: "drops", t: "素材掉落" }, { id: "builds", t: "推荐配装" }, ...(MON.FOLLOWERS ? [{ id: "followers", t: "盟友" }] : []), { id: "status", t: "异常与道具" }] },
    { id: "videos", t: "视频" },
  ];
  ORDER = [];
  PAGES.forEach(p => {
    if (!p.group) return ORDER.push({ r: p.id, t: p.t });
    p.items.forEach(it => it.children ? it.children.forEach(n => ORDER.push({ r: `${it.id}/${n}`, t: it.children.length > 1 ? `${it.t} · ${phaseList()[n].name}` : it.t })) : ORDER.push({ r: it.id, t: it.t }));
  });
}

// ---------------- 路由 ----------------
const LEGACY = new Set(["map", "ammo", "phase", "formula", "builds", "followers", "status", "videos"]);
function parseRoute() {
  const h = location.hash.replace(/^#\/?/, "");
  const [path, qs] = h.split("?");
  const seg = (path || "").split("/").filter(Boolean);
  if (seg[0] === "m" && seg[1]) return { kind: "mon", id: seg[1], page: seg.slice(2).join("/"), qs };
  if (LEGACY.has(seg[0])) return { kind: "legacy", page: seg.join("/"), qs };       // v2 旧网址
  if (seg[0] === "guide") return { kind: "guide", page: seg[1] || "lbg", sec: new URLSearchParams(qs || "").get("sec"), qs };
  if (seg[0] === "sources") return { kind: "sources" };
  return { kind: "library" };
}
function applyParams(qs) {
  const q = new URLSearchParams(qs || "");
  if (q.has("s")) S.state = Math.max(0, Math.min(M.states.length - 1, +q.get("s") || 0));
  if (q.has("p") && partObj(q.get("p"))) S.part = q.get("p");
  if (q.has("c") && COLS.some(c => c.k === q.get("c"))) S.col = q.get("c");
  if (q.has("v") && MAPD.render) S.view = q.get("v") === "2d" ? "2d" : "img";
}
const mLink = r => `#/m/${MON.id}${r ? "/" + r : ""}`;
const go = r => { location.hash = mLink(r); };
function syncHash(r) {
  const q = r === "map" ? `?s=${S.state}&p=${S.part}&c=${S.col}&v=${S.view}` : "";
  history.replaceState(null, "", mLink(r) + q);
}
// 怪物页里的相对链接 #/map → #/m/<id>/map
const relink = html => html.replace(/href="#\/(?!m\/|guide\/|sources)([^"]*)"/g, (_, r) => `href="${mLink(r)}"`);

// ---------------- 外框 ----------------
const closed = new Set(JSON.parse(localStorage.getItem("mhr_closed") || "[]"));
function renderChrome(ctx) {
  const inMon = ctx.kind === "mon";
  $("#topnav").innerHTML = [["怪物图鉴", "#/", ctx.kind === "library"], ["轻弩基础", "#/guide/lbg", ctx.kind === "guide" && ctx.page !== "anomaly"], ["怪异调查", "#/guide/anomaly", ctx.kind === "guide" && ctx.page === "anomaly"]]
    .map(([t, h, on]) => `<a href="${h}" class="${on ? "on" : ""}">${t}</a>`).join("") +
    (inMon ? `<button class="mon" id="monChip" aria-haspopup="menu" aria-expanded="false" title="切换怪物"><img src="${M.icon}" alt="">${M.name}<span class="car"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3.5 6 L8 10.5 L12.5 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span></button>`
           : `<button class="mon" id="monChip" aria-haspopup="menu" aria-expanded="false"><span>选择怪物</span><span class="car"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3.5 6 L8 10.5 L12.5 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span></button>`);
  $("#monChip").onclick = e => { e.stopPropagation(); toggleMonMenu(ctx); };
  $("#bnav").innerHTML = inMon ? [["", "速读", "⚡"], ["map", "打哪里", "◎"], ["ammo", "弹药", "▮"], ["phase/0", phaseList().length > 1 ? "阶段" : "招式", "⚔"], ["videos", "视频", "▶"]]
    .map(([r, t, i]) => `<a href="${mLink(r)}" class="${(ctx.r === r || (r === "phase/0" && (ctx.r || "").startsWith("phase/"))) ? "on" : ""}"><span class="i">${i}</span>${t}</a>`).join("") : "";
  document.body.classList.toggle("has-bnav", inMon);
  $("#questWrap").style.display = inMon && M.quests.length ? "" : "none";
  if (inMon) {
    $("#questBtn").innerHTML = questBtnHtml();
  }
  const link = (href, t, on, extra = "") => `<a class="it ${on ? "on" : ""}" href="${href}">${extra}${t}</a>`;
  const legend = `<div class="legend2"><span><i style="background:var(--blood2)"></i>红 = 要躲 / 危险</span><span><i style="background:var(--gold)"></i>金 = 能打 / 弱点</span><span><i style="background:var(--paper3)"></i>灰 = 背景信息</span></div>`;
  let h = "";
  if (inMon) {
    const r = ctx.r;
    h += `<div class="moncard"><a class="mimg" href="${mLink("")}" title="${M.name} 速读"><img src="${M.icon}" alt=""></a>
      <div class="mtxt"><a class="mname" href="${mLink("")}">${M.name}</a><div class="men">${M.en}${MON.status === "draft" ? ' · <span class="draftt">草稿</span>' : ""}</div>
      <a class="swap" href="#/">⇄ 换怪物</a></div></div>
      ${M.quests.length ? `<div class="mq"><button class="qbtn" id="questBtn2" aria-haspopup="menu" aria-expanded="false">${questBtnHtml()}</button></div>` : ""}`;
    for (const p of PAGES) {
      if (!p.group) { h += link(mLink(p.id), p.t, r === p.id); continue; }
      const n = p.items.reduce((s, i) => s + (i.children ? i.children.length : 1), 0);
      h += `<div class="gl ${closed.has(p.group) ? "closed" : ""}" data-g="${p.group}" role="button" tabindex="0"><span class="chev"><svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true"><path d="M3.5 6 L8 10.5 L12.5 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span>${p.group}<span class="cnt">${n}</span></div><div class="sub">`;
      for (const it of p.items) {
        if (!it.children) { h += link(mLink(it.id), it.t, r === it.id); continue; }
        if (it.children.length === 1) { h += link(mLink(`${it.id}/0`), it.t, r === `${it.id}/0`); continue; }
        const cur = r.startsWith(it.id + "/") ? r.split("/")[1] : 0;
        h += `<a class="it" href="${mLink(`${it.id}/${cur}`)}">${it.t}</a><div class="tree">` +
          it.children.map(n => link(mLink(`${it.id}/${n}`), phaseList()[n].name, r === `${it.id}/${n}`, `<span class="dotc" style="background:${phaseList()[n].color}"></span>`)).join("") + `</div>`;
      }
      h += `</div>`;
    }
    h += `<div class="foot">${legend}
      <div class="gl static">通用</div>${link("#/guide/lbg", "轻弩基础", false)}${link(`#/guide/anomaly?m=${MON.id}`, "怪异调查计算器", false)}${link("#/sources", "来源与未验证", false)}
      <div class="legend2"><span><span class="kbd">[</span> 上一页　<span class="kbd">]</span> 下一页　<span class="kbd">/</span> 搜索</span></div></div>`;
  } else {
    h += `<div class="gl static">怪物 <span class="cnt">${D.REGISTRY.length}</span></div>` +
      D.REGISTRY.map(m => link(`#/m/${m.id}`, m.name, false, `<img class="mi" src="${m.icon}">`) .replace("</a>", `${m.status === "draft" ? '<span class="badge draft sm">草稿</span>' : ""}</a>`)).join("") +
      `<div class="gl static">通用</div>${link("#/", "怪物图鉴", ctx.kind === "library")}${link("#/guide/lbg", "轻弩基础", ctx.kind === "guide" && ctx.page !== "anomaly")}${link("#/guide/anomaly", "怪异调查计算器", ctx.kind === "guide" && ctx.page === "anomaly")}${link("#/sources", "来源与未验证", ctx.kind === "sources")}` +
      `<div class="foot">${legend}<div class="legend2"><span><span class="kbd">/</span> 搜索怪物</span></div></div>`;
  }
  $("#side").innerHTML = h;
  if ($("#questBtn2")) $("#questBtn2").onclick = e => { e.stopPropagation(); toggleQuestMenu($("#questBtn2")); };
  $("#side").querySelectorAll(".gl[data-g]").forEach(g => {
    const t = () => { const k = g.dataset.g; closed.has(k) ? closed.delete(k) : closed.add(k);
      localStorage.setItem("mhr_closed", JSON.stringify([...closed])); g.classList.toggle("closed"); };
    g.onclick = t; g.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); t(); } };
  });
}

const header = (crumb, title, sub, key) => `
  <div class="ph"><div class="crumb">${crumb}</div><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ""}</div>
  ${key && key.length ? `<div class="key"><div class="t">要点</div><ul>${key.map(k => `<li>${md(k)}</li>`).join("")}</ul></div>` : ""}`;
function pager(r) {
  const i = ORDER.findIndex(o => o.r === r);
  const pv = ORDER[i - 1], nx = ORDER[i + 1];
  return `<div class="pager">${pv ? `<a href="#/${pv.r}"><div class="k">← 上一页</div>${pv.t}</a>` : "<span></span>"}${nx ? `<a class="nx" href="#/${nx.r}"><div class="k">下一页 →</div>${nx.t}</a>` : ""}</div>`;
}
const srcLink = k => { const s = (MON && MON.SOURCES && MON.SOURCES[k]) || D.SOURCES[k]; return s ? `<a href="${s.url}" target="_blank">${s.name}</a>` : esc(k); };

// ================= 怪物页 =================
const PAGE = {};

// ---------- 速读 ----------
PAGE[""] = () => {
  const w0 = weakParts(0), wL = weakParts(M.states.length - 1);
  const target = (M.parts.find(p => p.hz[0].shot >= 45) || M.parts.slice().sort((a, b) => b.hz[0].shot - a.hz[0].shot)[0]);
  const best = ranking(target.id, 0)[0];
  const multi = M.states.length > 1;
  const autoKey = [`弱点：**${w0.join("、") || target.name}**（弹肉质 ${target.hz[0].shot}）`, `打${target.name}最强：**${best.ammo.name}**`,
    `属性：${M.weakness.filter(w => w.stars).map(w => `**${w.name}**${"★".repeat(w.stars)}`).join(" ")}`];
  const check = (TEXT.home && TEXT.home.checklist) || [["builds", "整理配装：先看 <b>推荐配装</b>", "推荐配装"], ["status", "看 <b>异常耐性</b>：哪种异常弹最划算", "异常与道具"], ["videos", "先看 <b>视频</b> 认识它的招式", "视频"]];
  const secs = [["map", "打哪里", "肉质图：每个部位多软"], ["ammo", "用什么弹", "计算器 + 弹药伤害排名"], ["phase/0", phaseList().length > 1 ? "阶段与招式" : "招式", phaseList().length > 1 ? `${phaseList().length} 个状态：怎么认、怎么躲、何时打` : "怎么躲、何时打"],
    ["formula", "伤害怎么算", "一发子弹的伤害是怎么来的"], ["builds", "推荐配装", MON.BUILDS.length ? `${MON.BUILDS.length} 套` : "待补充"], MON.FOLLOWERS ? ["followers", "盟友", "带谁、别带谁"] : ["status", "异常与道具", "异常耐性、道具"]];
  return header("Quick read · 30 秒", M.name, M.nameAlt, (TEXT.home && TEXT.home.key) || autoKey) + (isDraft() ? TODO("攻略要点") : "") + `
  <div class="tiles">
    <a class="tile" href="#/map?s=${multi ? 1 : 0}&p=${target.id}"><span class="go">→</span><div class="t">弱点部位</div><div class="v">${multi ? `${w0.join("、") || "—"} → ${wL.join("、") || "—"}` : (w0.join("、") || target.name)}</div><div class="s">${multi ? `${stName(0)} → ${stName(M.states.length - 1)}` : "弹肉质 ≥45"} · 看肉质图</div></a>
    <a class="tile" href="#/ammo"><span class="go">→</span><div class="t">最佳弹药（打${target.name}）</div><div class="v">${best.ammo.name}</div><div class="s"><span class="mono" style="color:var(--gold2)">${fmt(best.total)}</span> / 每次射击 · 看全部弹药</div></a>
    <a class="tile" href="#" data-act="quest"><span class="go">→</span><div class="t">任务体力</div><div class="v"><span class="mono">${questHP().toLocaleString()}</span></div><div class="s">${quest().name} · 点击切换任务</div></a>
    <a class="tile" href="#/map?c=${M.weakness[0].el}"><span class="go">→</span><div class="t">弱点属性</div><div class="v" style="display:flex;gap:10px;align-items:center">${M.weakness.filter(w => w.stars).map(w => `<span><img src="assets/icons/${ICON[w.el]}.png" style="width:22px;vertical-align:-4px"><span class="stars">${"★".repeat(w.stars)}</span></span>`).join("")}</div><div class="s">${M.weakness.filter(w => !w.stars).map(w => w.name).join(" / ") || "—"} 无效${M.weakness[0].computed ? " · 按肉质估算" : ""}</div></a>
  </div>
  <h2 class="h">开打前 3 件事</h2>
  <ul class="check">${check.map(([r, t, g], i) => `<li><a class="row" href="#/${r}"><span class="n">${i + 1}</span><span>${t}</span><span class="go">${g} →</span></a></li>`).join("")}</ul>
  <h2 class="h">内容</h2>
  <div class="secs">${secs.map(([r, t, s]) => `<a href="#/${r}"><div class="t">${t}</div><div class="s">${s}</div></a>`).join("")}</div>`;
};

// ---------- 打哪里 ----------
// 2D 俯视图模板（viewBox 400×520）：左侧画一次，右侧镜像
const DIAGRAMS = {
  winged_quadruped: {
    shapes: {
      wing: "M178 170 C150 138 108 110 62 100 C40 96 22 108 22 128 C34 132 40 142 34 152 C22 162 20 176 28 186 C42 188 46 198 40 210 C36 222 40 234 54 236 C64 238 66 248 62 260 C76 264 90 258 98 268 C114 262 144 246 178 226 Z",
      wingarm: "M180 166 C152 140 112 116 66 104 C60 102 58 110 64 114 C110 128 148 150 178 178 Z",
      foreleg: "M182 182 C166 184 150 192 140 206 C132 218 120 224 108 226 C100 230 102 240 112 240 C126 240 138 234 148 224 C158 214 170 206 184 204 Z",
      hindleg: "M182 270 C168 274 154 284 146 298 C140 312 132 322 120 328 C114 334 118 342 128 340 C142 338 152 326 160 312 C166 300 176 292 186 290 Z",
      tail: "M190 316 C186 360 190 398 204 428 C212 446 220 458 230 468 L242 458 C232 446 226 432 220 414 C210 384 208 352 210 316 Z",
      tailtip: "M228 462 C240 456 246 458 252 466 C262 480 272 494 286 514 C268 504 252 494 238 486 C230 480 226 472 228 462 Z",
      torso: "M200 96 C214 96 220 118 222 148 C232 190 236 236 228 276 C222 304 212 322 200 326 C188 322 178 304 172 276 C164 236 168 190 178 148 C180 118 186 96 200 96 Z",
      neck: "M200 92 C210 92 214 102 214 116 C214 130 208 140 200 142 C192 140 186 130 186 116 C186 102 190 92 200 92 Z",
      head: "M200 24 C215 28 225 44 225 62 C225 82 214 98 200 106 C186 98 175 82 175 62 C175 44 185 28 200 24 Z",
    },
    mirrored: ["wing", "wingarm", "hindleg", "foreleg"],
    order: ["wing", "wingarm", "hindleg", "foreleg", "tail", "tailtip", "torso", "neck", "head"],
    horns: ["M190 38 C182 24 170 12 156 4", "M210 38 C218 24 230 12 244 4", "M184 54 C170 46 156 42 142 42", "M216 54 C230 46 244 42 258 42"],
    spots: { head: [[200, 64]], neck: [[200, 128]], torso: [[200, 214]], foreleg: [[126, 226], [274, 226]], wing: [[66, 178], [334, 178]],
             wingarm: [[110, 124], [290, 124]], hindleg: [[138, 322], [262, 322]], tail: [[214, 396]], tailtip: [[262, 494]] },
  },
};
const mirror = d => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) => `${400 - +x} ${y}`);
function hotspot(id, x, y) {
  const p = partObj(id); if (!p) return "";
  const v = p.hz[S.state][S.col];
  return `<button class="hs${id === S.part ? " sel" : ""}${S.col === "shot" && v >= 45 ? " weak" : ""}" data-part="${id}" style="left:${x}%;top:${y}%" title="${p.name}：${v}">
    <span class="dot" style="background:${heat(v, S.col)}">${v}</span><span class="lb">${p.name}</span></button>`;
}
// 2D 热力剪影：部位图（tools/make_partmap.py 生成）+ 肉质上色，保留原图明暗
const pmLoad = {};
function loadPartmap(id) {
  if ((D.partmaps || {})[id]) return Promise.resolve(D.partmaps[id]);
  return pmLoad[id] ||= new Promise(ok => { const s = document.createElement("script"); s.src = `data/monsters/${id}.partmap.js`;
    s.onload = () => ok((D.partmaps || {})[id] || null); s.onerror = () => ok(null); document.head.appendChild(s); });
}
const pmCache = {};
async function drawPartmap(hoverId) {
  const cv = $("#pmc"); if (!cv) return;
  const pm = await loadPartmap(MON.id); if (!pm || !$("#pmc")) return;
  if (!pmCache[MON.id]) pmCache[MON.id] = await new Promise(ok => { const im = new Image(); im.onload = () => {
    const c = document.createElement("canvas"); c.width = pm.w; c.height = pm.h; const x = c.getContext("2d"); x.drawImage(im, 0, 0);
    ok(x.getImageData(0, 0, pm.w, pm.h).data); }; im.src = pm.png; });
  const src = pmCache[MON.id];
  cv.width = pm.w; cv.height = pm.h;
  const ctx = cv.getContext("2d"), out = ctx.createImageData(pm.w, pm.h), o = out.data;
  const rgb = pm.parts.map(id => { const p = partObj(id); if (!p) return [60, 52, 46];
    return heat(p.hz[S.state][S.col], S.col).match(/\d+/g).map(Number); });
  const sel = pm.parts.indexOf(S.part) + 1, hov = hoverId ? pm.parts.indexOf(hoverId) + 1 : 0;
  for (let i = 0; i < src.length; i += 4) {
    const k = src[i]; if (!k) continue;
    const l = src[i + 1] / 255, edge = src[i + 2] > 0, c = rgb[k - 1];
    let f = 0.42 + 0.95 * l;                       // 原图明暗
    if (k === hov) f *= 1.18;
    if (sel && k !== sel) f *= 0.82;               // 选中部位以外稍暗
    let r = c[0] * f, g = c[1] * f, b = c[2] * f;
    if (l > 0.85) { const t = (l - 0.85) / 0.15 * 0.35; r += (255 - r) * t; g += (255 - g) * t; b += (255 - b) * t; }  // 高光
    if (edge) { if (k === sel) { r = 240; g = 207; b = 122; } else { r *= 0.35; g *= 0.35; b *= 0.35; } }
    o[i] = r; o[i + 1] = g; o[i + 2] = b; o[i + 3] = src[i + 3];
  }
  ctx.putImageData(out, 0, 0);
  const hit = e => { const r = cv.getBoundingClientRect(), x = Math.floor((e.clientX - r.left) / r.width * pm.w), y = Math.floor((e.clientY - r.top) / r.height * pm.h);
    const k = src[(y * pm.w + x) * 4]; return k ? pm.parts[k - 1] : null; };
  cv.onclick = e => { const id = hit(e); if (id && partObj(id)) { S.part = id; saveView(); render(false); } };
  let last = null;
  cv.onmousemove = e => { const id = hit(e); cv.style.cursor = id ? "pointer" : "default"; if (id !== last) { last = id; drawPartmap(id); } };
  cv.onmouseleave = () => { if (last) { last = null; drawPartmap(null); } };
}
function mapView() {
  if (S.view === "2d" && MAPD.render && MAPD.partmap !== false) {
    const spots = (MAPD.spots || []);
    return `<div class="mapimg hm" style="aspect-ratio:${MAPD.aspect || "16/9"}"><canvas id="pmc" aria-label="${M.name} 部位热力图"></canvas>${spots.map(([id, x, y]) => hotspot(id, x, y)).join("")}</div>`;
  }
  if (S.view === "img" && MAPD.render) return `<div class="mapimg st${S.state}" style="aspect-ratio:${MAPD.aspect || "16/9"}"><img class="render" src="${MAPD.render}" alt="${M.name}">${(MAPD.spots || []).map(([id, x, y]) => hotspot(id, x, y)).join("")}</div>`;
  const T = DIAGRAMS[MAPD.diagram || "winged_quadruped"];
  const dm = MAPD.diagramMap || Object.fromEntries(M.parts.filter(p => T.shapes[p.id]).map(p => [p.id, p.id]));
  let svg = `<defs><linearGradient id="sh" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></linearGradient>
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#f0cf7a" flood-opacity=".8"/></filter></defs>`;
  svg += T.horns.map(d => `<path class="horn" d="${d}"/>`).join("");
  for (const shape of T.order) {
    const id = dm[shape]; if (!id || !partObj(id)) continue;
    const v = partObj(id).hz[S.state][S.col], ds = [T.shapes[shape]];
    if (T.mirrored.includes(shape)) ds.push(mirror(T.shapes[shape]));
    const glow = (S.col === "shot" && v >= 45) || id === S.part ? ` filter="url(#glow)"` : "";
    svg += ds.map(d => `<path class="pt${id === S.part ? " sel" : ""}" data-part="${id}" d="${d}" fill="${heat(v, S.col)}"${glow}/><path class="shade" d="${d}" fill="url(#sh)"/>`).join("");
  }
  const spots = Object.entries(dm).flatMap(([shape, id]) => (T.spots[shape] || []).map(([x, y]) => hotspot(id, x / 4, y / 5.2))).join("");
  const missing = M.parts.filter(p => !Object.values(dm).includes(p.id));
  return `<div class="map2d"><svg viewBox="0 0 400 520" aria-label="${M.name} 俯视示意图">${svg}</svg>${spots}</div>` +
    (missing.length ? `<div class="note-s">示意图里没有画的部位：${missing.map(p => `<button class="linkbtn" data-part="${p.id}">${p.name} ${p.hz[S.state][S.col]}</button>`).join(" ")}</div>` : "");
}
PAGE.map = () => {
  const p = partObj(S.part), h = p.hz[S.state];
  const top = ranking().slice(0, 3);
  const col = COLS.find(c => c.k === S.col);
  const multi = M.states.length > 1;
  const autoKey = M.states.map((st, i) => `${multi ? st.name + "：" : ""}打**${weakParts(i).join("、") || M.parts.slice().sort((a, b) => b.hz[i].shot - a.hz[i].shot)[0].name}**`).filter((x, i, a) => a.indexOf(x) === i).slice(0, 2)
    .concat([`最硬：**${M.parts.slice().sort((a, b) => a.hz[S.state].shot - b.hz[S.state].shot).slice(0, 2).map(p => `${p.name} ${p.hz[S.state].shot}`).join("、")}**，别浪费子弹`]);
  return header("打法 · Hitzones", "打哪里", "点击部位查看详情。" + (multi ? "切换状态看弱点怎么变。" : ""), (TEXT.map && TEXT.map.key) || autoKey) + `
  <div class="ctrls">
    ${MAPD.render ? `<div class="seg" id="viewSeg"><button data-v="img" class="${S.view === "img" ? "on" : ""}">实景图</button><button data-v="2d" class="${S.view === "2d" ? "on" : ""}">2D 热力图</button></div>` : ""}
    ${multi ? `<div class="seg" id="stateSeg">${M.states.map(st => `<button data-s="${st.id}" class="${st.id === S.state ? "on" : ""}">${st.name}</button>`).join("")}</div>` : ""}
    <div class="seg" id="colSeg">${COLS.map(c => `<button data-c="${c.k}" class="${c.k === S.col ? "on" : ""}"><img src="assets/icons/${c.img}.png">${c.n}</button>`).join("")}</div>
  </div>
  <div class="mapgrid">
    <div class="panel">
      ${mapView()}
      <div class="note-s" style="margin-top:6px">◎ 金色闪动 = 弱点（弹肉质 ≥45）。点击圆点切换部位。</div>
      <div class="legend"><span>软</span><div class="bar" style="background:linear-gradient(90deg,${[60, 45, 40, 30, 20, 10, 0].map(v => STOPS.find(x => x[0] === v)[1]).join(",")})"></div><span>硬</span></div>
    </div>
    <div style="display:grid;gap:18px;align-content:start">
      <div class="panel detail">
        <div class="kicker">${p.en} · ${stName(S.state)}</div>
        <div class="big">${p.name}</div>
        <div class="row">
          ${[["hit_shell", "弹", h.shot], ["hit_slash", "斩", h.sever], ["dragon", "龙", h.dragon], ["fire", "火", h.fire], ["thunder", "雷", h.thunder], ["ice", "冰", h.ice]].map(([i, n, v]) => `<span><img src="assets/icons/${i}.png" style="width:16px;vertical-align:-3px"> ${n} <b>${v}</b></span>`).join("")}
          ${h.stun ? `<span><img src="assets/icons/stun.png" style="width:16px;vertical-align:-3px"> 眩晕 <b>${h.stun}</b></span>` : ""}
        </div>
        <div class="row"><span>硬直值 <b>${p.stagger ?? "—"}</b></span><span>破坏值 <b>${p.brk ?? "—"}</b></span>${p.note ? `<span>${p.note}</span>` : ""}
          ${h.shot >= 45 ? `<span style="color:var(--gold2)">◆ 弱点：弱点特效生效</span>` : ""}</div>
        <h3 style="margin-top:6px">这个部位最强的 3 种弹</h3>
        <div class="top3">${top.map((r, i) => `<div class="it"><span class="rk">${i + 1}</span><img class="ammoimg" src="${aImg(r.ammo)}">
          <span>${r.ammo.name} ${r.isRF ? `<span class="rf">速射×${r.bullets}</span>` : ""}</span><span class="mono" style="color:var(--gold2)">${fmt(r.total)}</span></div>`).join("")}</div>
        <a class="btn" style="display:inline-block;margin-top:12px;text-decoration:none" href="#/ammo">看全部弹药 →</a>
      </div>
    </div>
  </div>
  <div class="panel hzwide">
    <h3>全部位${multi ? " × 全状态" : ""}（${col.n} 肉质）<span class="note-s" style="font-family:var(--sans);font-weight:400;margin-left:8px">点部位名或状态名切换</span></h3>
    <div class="hzscroll"><table class="hzt">
      <tr><th></th>${M.parts.map(pp => `<th class="${pp.id === S.part ? "cur" : ""}"><button class="linkbtn" data-part="${pp.id}">${pp.name}</button></th>`).join("")}</tr>
      ${M.states.map((st, i) => `<tr class="${i === S.state ? "selrow" : ""}"><th class="sth">${multi ? `<button class="linkbtn" data-s="${i}"><span class="dotc" style="background:${st.color}"></span>${st.name}</button>` : "肉质"}</th>${M.parts.map(pp =>
        `<td class="hzcell${i === S.state && pp.id === S.part ? " cur" : ""}" style="background:${heat(pp.hz[i][S.col], S.col)}">${pp.hz[i][S.col]}</td>`).join("")}</tr>`).join("")}
    </table></div>
    ${M.states.some(s => s.guess) ? `<div class="state-note">状态名称与肉质编号的对应是推测的<span class="unv guess">推测</span></div>` : ""}
  </div>`;
};
function bindMap() {
  const rr = () => { saveView(); render(false); };
  document.querySelectorAll("#main [data-part]").forEach(b => b.onclick = () => { S.part = b.dataset.part; rr(); });
  document.querySelectorAll("#stateSeg button, .hzt [data-s]").forEach(b => b.onclick = () => { S.state = +b.dataset.s; rr(); });
  document.querySelectorAll("#colSeg button").forEach(b => b.onclick = () => { S.col = b.dataset.c; rr(); });
  document.querySelectorAll("#viewSeg button").forEach(b => b.onclick = () => { S.view = b.dataset.v; rr(); });
  drawPartmap();
}

// ---------- 用什么弹 ----------
PAGE.ammo = () => header("打法 · Ammo", "用什么弹", `目标：<b style="color:var(--paper)">${partObj(S.part).name}${M.states.length > 1 ? " · " + stName(S.state) : ""}</b>（在 <a href="#/map">打哪里</a> 里换部位${M.states.length > 1 ? "和状态" : ""}）`, [
  `按「**扣一次扳机**」的期望伤害排序`, `左边改技能，右边马上更新`, `属性弹的排名依赖一个**未验证**的公式`,
]) + `
  <div class="calcgrid">
    <div class="panel calc" id="calc"></div>
    <div>
      <div class="summary" id="summary"></div>
      <div class="ctrls">
        ${WEAPON ? `<label><input type="checkbox" id="onlyWeap" ${S.onlyWeap ? "checked" : ""}> 只看${WEAPON.name}能用的弹</label>` : `<span class="note-s">这只怪物还没指定推荐武器：显示全部弹药，速射按弹药本身</span>`}
        ${(MAPD.piercePaths || []).length ? `<label>贯穿路径 <select id="path"><option value="auto">自动：选经过该部位的路径</option>${MAPD.piercePaths.map(p => `<option value="${p.id}">${p.name}</option>`).join("")}</select></label>` : ""}
      </div>
      <div class="panel" style="padding:6px 12px"><table class="rank" id="rank"></table></div>
      <details class="more"><summary>这些数字怎么看？</summary><div class="note-s" style="margin-top:6px">「打倒约需」= 任务体力 ÷ 每次射击伤害，只是理论值，不算装填、走位和多人体力倍率。贯穿弹最多 7 段；按路径估算时，7 段分到不同部位，各自用自己的肉质；没有路径时按 7 段全中选中部位（理想值）。</div></details>
    </div>
  </div>`;
function isApplied(b) {
  return Object.keys(S.o).every(k => k === "dist" || k === "defMul" ? true : (b.preset[k] ?? (typeof S.o[k] === "number" ? 0 : false)) === S.o[k]);
}
function renderCalc() {
  const num = (k, label, step = 1) => `<div class="f"><label>${label}</label><input type="number" data-k="${k}" step="${step}" value="${S.o[k]}"></div>`;
  // 技能等级：− / + 步进器 + 等级点（代替原生下拉）
  const sel = k => { const mx = SKILLS[k].max, v = S.o[k];
    return `<div class="f"><label>${SKILLS[k].name}</label><div class="stp" data-stp="${k}">
      <span class="pips">${Array.from({ length: mx }, (_, i) => `<i class="${i < v ? "on" : ""}"></i>`).join("")}</span>
      <button type="button" data-d="-1" aria-label="减少" ${v <= 0 ? "disabled" : ""}>−</button><span class="lv">${v}<small>/${mx}</small></span><button type="button" data-d="1" aria-label="增加" ${v >= mx ? "disabled" : ""}>+</button></div></div>`; };
  const grp = (t, open, inner) => `<details ${open ? "open" : ""}><summary>${t}</summary>${inner}</details>`;
  $("#calc").innerHTML = `<h3>计算器</h3>
    ${MON.BUILDS.length ? `<div class="presets" style="margin:0 0 6px">${MON.BUILDS.map(b => { const on = isApplied(b); return `<button class="btn${on ? " on" : ""}" data-b="${b.id}" aria-pressed="${on}">${on ? "✓ 已套用：" : "套用："}${b.short}</button>`; }).join("")}</div>` : ""}
    ${grp("武器", true, num("atk", "攻击力") + num("aff", "会心率 %"))}
    ${grp("攻击 / 会心", true, sel("attack") + sel("critEye") + sel("wex") + sel("critBoost") + sel("bloodlust") + num("extraAtk", "其他攻击 (固定值)") + num("extraAff", "其他会心 %"))}
    ${grp("弹药强化", false, sel("normalUp") + sel("pierceUp") + sel("spreadUp") + sel("rapidUp"))}
    ${grp("属性", false, sel("dragonAtk") + sel("fireAtk") + sel("iceAtk") + sel("critEle"))}
    ${grp("其他", false, `<div class="f"><label>会心射击（切换技）</label><input type="checkbox" data-k="critFire" ${S.o.critFire ? "checked" : ""}></div>` +
      num("dist", "会心距离倍率", 0.05) + `<div class="note-s">1.0 = 在会心距离内<span class="unv">未验证</span></div>` + num("defMul", "怪物防御倍率", 0.05))}`;
  $("#calc").querySelectorAll("[data-k]").forEach(el => el.oninput = el.onchange = () => {
    S.o[el.dataset.k] = el.type === "checkbox" ? el.checked : +el.value; renderRank(); refreshPresets();
  });
  $("#calc").querySelectorAll("[data-b]").forEach(el => el.onclick = () => applyBuild(el.dataset.b));
  $("#calc").querySelectorAll("[data-stp]").forEach(box => box.querySelectorAll("button").forEach(b => b.onclick = () => {
    const k = box.dataset.stp, mx = SKILLS[k].max;
    S.o[k] = Math.max(0, Math.min(mx, S.o[k] + +b.dataset.d));
    box.querySelector(".lv").innerHTML = `${S.o[k]}<small>/${mx}</small>`;
    box.querySelectorAll(".pips i").forEach((p, i) => p.classList.toggle("on", i < S.o[k]));
    box.querySelector('[data-d="-1"]').disabled = S.o[k] <= 0; box.querySelector('[data-d="1"]').disabled = S.o[k] >= mx;
    renderRank(); refreshPresets();
  }));
}
function refreshPresets() {
  document.querySelectorAll("#calc [data-b]").forEach(el => { const b = MON.BUILDS.find(x => x.id === el.dataset.b), on = isApplied(b);
    el.classList.toggle("on", on); el.setAttribute("aria-pressed", on); el.textContent = (on ? "✓ 已套用：" : "套用：") + b.short; });
}
function applyBuild(id) {
  const b = MON.BUILDS.find(x => x.id === id);
  const keep = { dist: S.o.dist, defMul: S.o.defMul };
  Object.keys(S.o).forEach(k => { if (typeof S.o[k] === "number") S.o[k] = 0; });
  S.o.critFire = false;
  Object.assign(S.o, keep, b.preset);
  if (b.after) Object.assign(S, b.after);
  if (location.hash.endsWith("/ammo")) render(true); else go("ammo");
}
function renderRank() {
  const r = ranking(), max = Math.max(...r.map(x => x.total), 1), hp = questHP(), p = partObj(S.part), best = r[0];
  $("#rank").innerHTML = `<tr><th>#</th><th>弹药</th><th class="num">每段</th><th class="num">段 × 发</th><th class="num">每次射击</th>${WEAPON ? '<th class="num">装填</th>' : ""}<th class="num">打倒约需</th><th style="width:20%"></th></tr>` +
    r.map((x, i) => {
      const pierce = x.ammo.kind.includes("pierce"), pa = pathFor(x.ammo), perHit = x.total / (x.hitsPerBullet * x.bullets);
      return `<tr><td class="mono" style="color:var(--blood2)">${i + 1}</td>
        <td><span class="nm"><img class="ammoimg" src="${aImg(x.ammo)}">${x.ammo.name} ${x.isRF ? `<span class="rf">速射</span>` : ""}</span>${x.ammo.note ? `<span class="note-s nt">${x.ammo.note}</span>` : ""}</td>
        <td class="num">${fmt(perHit)}${pa ? '<div class="note-s">路径平均</div>' : ""}</td>
        <td class="num">${x.hitsPerBullet} × ${x.bullets}${pierce && !pa ? '<div class="note-s">全中该部位</div>' : ""}</td>
        <td class="num" style="color:var(--gold2);font-weight:600">${fmt(x.total)}</td>
        ${WEAPON ? `<td class="num">${WEAPON.ammo[x.ammo.id] ? WEAPON.ammo[x.ammo.id].cap : "—"}</td>` : ""}
        <td class="num">${Math.ceil(hp / x.total).toLocaleString()} 次</td>
        <td><div class="barwrap"><i style="width:${(x.total / max * 100).toFixed(1)}%"></i></div></td></tr>`;
    }).join("");
  $("#summary").innerHTML = `
    <div><div class="t">当前目标</div><div class="v">${p.name} <span class="mono">弹 ${p.hz[S.state].shot}</span></div><div class="note-s">${stName(S.state)}</div></div>
    <div><div class="t">最佳弹药</div><div class="v">${best.ammo.name} <span class="mono">${fmt(best.total)}</span></div><div class="note-s">每次射击期望伤害${best.ammo.ele ? '<span class="unv">属性公式未验证</span>' : ""}</div></div>
    <div><div class="t">任务体力</div><div class="v"><span class="mono">${hp.toLocaleString()}</span></div><div class="note-s">基础 ${M.baseHP} × ${quest().hpMul}</div></div>`;
}
function bindAmmo() {
  renderCalc(); renderRank();
  if ($("#path")) { $("#path").value = S.path; $("#path").onchange = e => { S.path = e.target.value; saveView(); renderRank(); }; }
  if ($("#onlyWeap")) $("#onlyWeap").onchange = e => { S.onlyWeap = e.target.checked; renderRank(); };
}

// ---------- 阶段与招式 ----------
PAGE.phase = n => {
  const PL = phaseList(), ph = PL[n], sp = ph.sp, hz = ph.hz, st = M.states[hz], multi = PL.length > 1;
  const list = arr => `<ul>${arr.map(x => `<li>${md(x)}</li>`).join("")}</ul>`;
  const pill = v => v === "yes" ? `<span class="pill yes">能打</span>` : v === "no" ? `<span class="pill no">别贪</span>` : `<span class="pill q">看情况</span>`;
  const tabs = multi ? `<div class="stabs">${PL.map(s => `<a href="#/phase/${s.i}" class="${s.i === n ? "on" : ""}" style="--c:${s.color}"><span class="dotc" style="width:8px;height:8px;border-radius:50%;background:${s.color}"></span>${s.name}</a>`).join("")}</div>` : "";
  const strip = `<h2 class="h">${multi ? "这个状态的" : ""}弹肉质${M.states.length > 1 ? `<span class="muted" style="font:13px var(--sans)">（肉质阶段：${st.name}）</span>` : ""}</h2>
    <div class="strip" style="grid-template-columns:repeat(${M.parts.length},1fr)">${M.parts.map(p => `<div><b style="background:${heat(p.hz[hz].shot, "shot")}">${p.hz[hz].shot}</b>${p.name}</div>`).join("")}</div>
    <a class="btn" style="display:inline-block;margin-top:14px;text-decoration:none" href="#/map?s=${hz}">在肉质图里看 →</a>`;
  const crumb = multi ? `阶段 ${n + 1} / ${PL.length}` : "招式";
  if (!sp) return tabs + header(crumb, ph.name, st.desc !== "待补充" ? st.desc : "") + TODO("招式、前兆、躲法") + strip;
  return tabs + header(crumb, sp.title, sp.desc || st.desc, sp.key) + `
  <div class="hero2">
    ${sp.img ? `<figure><img src="${sp.img}" alt="${sp.title}"><figcaption>${sp.imgCap || ""}${sp.imgGuess ? '<span class="unv guess">推测</span>' : ""}</figcaption></figure>` : `<div class="todo">✎ 还没有这个状态的截图</div>`}
    <div class="blocks">
      <div class="blk see"><div class="h">👁 怎么认</div>${list(sp.see)}</div>
      <div class="blk dodge"><div class="h">🛡 要躲</div>${list(sp.dodge)}</div>
      <div class="blk hit"><div class="h">🎯 能打</div>${list(sp.hit)}</div>
      <div class="blk stand"><div class="h">📍 站位</div>${list(sp.stand)}</div>
    </div>
  </div>
  <h2 class="h">招式表</h2>
  <div class="panel" style="padding:6px 12px"><table class="moves">
    <tr><th>招式</th><th>前兆 / 效果</th><th>怎么躲（远程）</th><th>之后</th></tr>
    ${sp.moves.map(m => `<tr><td class="mv">${m.n}${m.yi ? '<span class="unv guess" title="名字是按日文数据意译">译</span>' : ""}${m.guess ? '<span class="unv guess">推测</span>' : ""}
      ${m.blood ? `<div class="bb"><img src="assets/icons/${m.bloodIcon || "blood"}.png">${m.bloodText || "附噬血"}</div>` : ""}</td>
      <td>${md(m.tell)}</td><td>${md(m.dodge)}</td><td>${pill(m.punish)}</td></tr>`).join("")}
  </table></div>` + strip;
};

// ---------- 伤害怎么算 ----------
PAGE.formula = () => header("原理 · Damage", "伤害怎么算", "选一种弹，看一发子弹的伤害怎么一步步算出来。", [
  `物理 = **真实攻击 × 动作值 × 肉质 × 倍率 × 会心**`, `肉质 **≥45** 才算弱点，弱点特效才生效`, `部位${M.states.length > 1 ? "和状态" : ""}沿用「打哪里」的选择`,
]) + `
  <div class="panel">
    <div class="ctrls">
      <label>弹药 <select id="fAmmo">${AMMO.map(a => `<option value="${a.id}" ${a.id === S.fAmmo ? "selected" : ""}>${a.name}</option>`).join("")}</select></label>
      <label><input type="checkbox" id="fRF"> 速射</label>
      <span class="muted" style="font-size:13px">部位 / 状态：<b style="color:var(--paper)">${partObj(S.part).name} · ${stName(S.state)}</b></span>
    </div>
    <div class="chain" id="chainRaw"></div><div class="chain" id="chainEle"></div>
    <div class="formula-line" id="fLine"></div>
  </div>
  <h2 class="h">名词解释</h2>
  ${[["真实攻击", "武器面板攻击 + 攻击技能。崛起没有武器倍率，面板上显示的就是真实攻击。"],
     ["动作值 (MV)", "每种弹自带的倍率。例如 LV3通常弹 34、LV2贯穿弹 每段 7、灭龙弹 48。速射时每发 ×0.7。"],
     ["肉质", "部位的软硬，0–100。子弹看「弹」这一列，斩裂弹的刃看「斩」。≥45 才算弱点。"],
     ["会心", "暴击伤害 ×1.25，超会心最高 ×1.40；负会心 ×0.75。这里用期望值计算。"]].map(([t, d]) => `<details class="more"><summary>${t}</summary><div style="margin-top:6px;font-size:14px;color:var(--paper2)">${d}</div></details>`).join("")}`;
function renderFormula() {
  const a = AMMO.find(x => x.id === S.fAmmo), rf = S.fRF && !!a.rf;
  $("#fRF").disabled = !a.rf; $("#fRF").checked = rf;
  const h = C.hitDamage(a, S.part, S.state, S.o, rf, M);
  const st = (t, v, s, cls = "") => `<div class="step ${cls}"><div class="t">${t}</div><div class="v">${v}</div><div class="s">${s || "&nbsp;"}</div></div>`;
  const op = x => `<div class="op">${x}</div>`;
  const hzName = a.hz === "none" ? "无视肉质" : a.hz === "sever" ? "斩肉质" : "弹肉质";
  $("#chainRaw").innerHTML = st("真实攻击", h.raw, `面板 ${S.o.atk} + 技能`) + op("×") + st("动作值", h.mv, rf ? "速射 ×0.7" : a.name) + op("×") +
    st(hzName, h.hzVal, h.wexOn ? "≥45 弱点" : "") + op("×") + st("弹/技能倍率", fmt(h.ammoMult, 3), h.ammoSteps.map(s => `${s.label}×${s.x}`).join(" ") || "无") + op("×") +
    st("会心期望", fmt(h.crit, 3), `会心率 ${h.aff}%`) + op("=") + st("物理 / 段", fmt(h.rawHit), "", "res");
  if (h.eleSteps) {
    const e = h.eleSteps;
    $("#chainEle").innerHTML = st("属性值", h.ele, `弹 ${e.base} + 技能`) + op("×") + st({ dragon: "龙", fire: "火", ice: "冰", thunder: "雷" }[a.ele] + "肉质", h.eleHz) + op("×") +
      st("攻击加成", fmt(e.rawScale, 2), "1 + 真实攻击/100 ⚠") + op("×") + st("速射/会心击", fmt(e.rf * e.ce, 3)) + op("=") + st("属性 / 段", fmt(h.eleHit), "", "res") + op("→") + st("合计 / 段", fmt(h.total), "", "res");
  } else $("#chainEle").innerHTML = "";
  $("#fLine").innerHTML = `物理 = <em>真实攻击</em> × <em>动作值</em>/100 × <em>肉质</em>/100 × 弹药技能倍率 × 会心期望 × 防御倍率` +
    (h.eleSteps ? `　|　属性 = <em>属性值</em> × <em>属性肉质</em>/100 × (1+真实攻击/100) × …<span class="unv">未验证</span>` : "");
}
function bindFormula() {
  renderFormula();
  $("#fAmmo").onchange = e => { S.fAmmo = e.target.value; S.fRF = true; renderFormula(); };
  $("#fRF").onchange = e => { S.fRF = e.target.checked; renderFormula(); };
}

// ---------- 能做的装备 ----------
const eqLoad = {};
function loadEquip(id) {
  if ((D.equip || {})[id]) return Promise.resolve(D.equip[id]);
  return eqLoad[id] ||= new Promise(ok => { const s = document.createElement("script"); s.src = `data/equip/${id}.js`;
    s.onload = () => ok((D.equip || {})[id] || { weapons: [], armor: [] }); s.onerror = () => ok({ weapons: [], armor: [] }); document.head.appendChild(s); });
}
const RARC = { 1: "#FFFFFF", 2: "#FFFF8B", 3: "#FF9FBD", 4: "#9FE581", 5: "#35CCFF", 6: "#6E8BFF", 7: "#F05A48", 8: "#A9F0FF", 9: "#956EFF", 10: "#FA9A3A" };
const TYPE_ORDER = ["light_bowgun", "heavy_bowgun", "bow", "great_sword", "long_sword", "short_sword", "dual_blades", "hammer", "horn", "lance", "gun_lance", "slash_axe", "charge_axe", "insect_glaive"];
const ELE_ZH = { Fire: "火", Water: "水", Thunder: "雷", Ice: "冰", Dragon: "龙", Poison: "毒", Paralysis: "麻痹", Sleep: "睡眠", Blast: "爆破" };
const n4 = n => `<div class="n4"><span><i>繁</i>${esc(n.tw || "—")}</span><span><i>日</i>${esc(n.ja || "—")}</span><span><i>EN</i>${esc(n.en || "—")}</span></div>`;
const eqIcon = (icon, rar) => `<img class="eqi" src="assets/equip/icon/${icon}_${rar}.png" alt="" onerror="this.style.visibility='hidden'">`;
const rarTag = r => `<span class="rar" style="--rc:${RARC[r] || "#fff"}">RARE ${r}</span>`;
function weaponCard(w) {
  const meta = [w.typeZh, w.atk != null ? `攻击 ${w.atk}` : "", w.aff ? `会心 ${w.aff}%` : "", w.ele ? `${ELE_ZH[w.ele[0]] || w.ele[0]} ${w.ele[1]}` : ""].filter(Boolean);
  return `<div class="eq">
    <div class="eqv">${w.render ? `<img class="rend" src="${w.render}" alt="" loading="lazy">` : `<div class="noimg">${eqIcon(w.icon, w.rar)}<small>暂无图片</small></div>`}${w.render ? eqIcon(w.icon, w.rar) : ""}</div>
    <div class="eqb">
      <div class="eqt">${esc(w.names.zh)} ${rarTag(w.rar)}</div>
      ${n4(w.names)}
      <div class="eqm">${meta.map(x => `<span>${x}</span>`).join("")}</div>
      ${w.ammo ? `<div class="ammo">${w.ammo.filter(a => a.n && !/none/i.test(a.n)).map(a => `<span class="${a.rf ? "rfa" : ""}">${esc(a.n)} ${a.cap ?? ""}${a.rf ? " 速射" : ""}</span>`).join("")}</div>` : ""}
      ${w.path && w.path.length > 1 ? `<div class="path">强化路线：${w.path.map(p => esc(p.zh || p.en)).join(" → ")}</div>` : ""}
      ${(w.next || []).length ? `<div class="path nx">可继续强化 → ${w.next.map(x => `${esc(x.names.zh)}${x.key && x.key.zh ? `（需要 <b>${esc(x.key.zh)}</b>）` : ""}`).join("、")}</div>` : ""}
      <a class="src" href="https://mhrise.mhrice.info/${w.href}" target="_blank">MHRice →</a>
    </div></div>`;
}
function armorCard(a) {
  const rs = [a.render && a.render.m, a.render && a.render.f].filter(Boolean);
  return `<div class="eq arm">
    <div class="eqv">${rs.length ? rs.map(r => `<img class="rend" src="${r}" alt="" loading="lazy">`).join("") : `<div class="noimg">${a.pieces[0] ? eqIcon(a.pieces[0].icon, a.pieces[0].rar) : ""}<small>暂无图片</small></div>`}</div>
    <div class="eqb">
      <div class="eqt">${esc(a.series.zh)} 系列 ${a.pieces[0] ? rarTag(a.pieces[0].rar) : ""}</div>
      ${n4(a.series)}
      <table class="pcs">${a.pieces.map(p => `<tr><td>${eqIcon(p.icon, p.rar)}</td><td><b>${esc(p.names.zh)}</b>${n4(p.names)}</td></tr>`).join("")}</table>
      ${a.skills && a.skills.length ? `<div class="eqm sk">${a.skills.map(([en, zh, lv]) => `<span>${esc(zh)} +${lv}</span>`).join("")}</div>` : ""}
      <a class="src" href="https://mhrise.mhrice.info/${a.href}" target="_blank">MHRice →</a>
    </div></div>`;
}
PAGE.equip = () => header("准备 · Equipment", "能做的装备", "这只怪物是「关键怪物」的大师等级武器和防具（来源 MHRice）。名字：简体 / 繁體 / 日本語 / English。", null) + `<div id="eqbox"><div class="note-s">读取中…</div></div>`;
async function bindEquip() {
  const id = MON.id, eq = await loadEquip(id);
  const rel = await Promise.all((MON.relatedEquip || []).map(async r => ({ ...r, eq: await loadEquip(r.id) })));
  if (!$("#eqbox") || MON.id !== id) return;
  if (S.eqFor !== id) { S.eqFor = id; S.eqTab = eq.weapons.length ? "w" : "a"; S.eqType = null; }   // 没有武器的怪物默认打开防具
  const types = TYPE_ORDER.filter(t => eq.weapons.some(w => w.type === t));
  if (S.eqType && !types.includes(S.eqType)) S.eqType = null;
  // 自己的武器 vs 用它素材强化的别家武器（比如钢龙、炎王龙的最终强化要用天彗龙素材）
  const stem = (M.name.match(/[一-鿿]{2}龙$/) || [""])[0];
  const counts = {}; eq.weapons.forEach(w => { const k = (w.series && w.series.zh) || ""; counts[k] = (counts[k] || 0) + 1; });
  const own = MON.ownSeries || Object.keys(counts).filter(k => stem && k.includes(stem)).concat(Object.keys(counts).length === 1 ? Object.keys(counts) : []);
  const isOwn = w => !Object.keys(counts).length || own.includes((w.series && w.series.zh) || "") || own.length === 0;
  const sortW = arr => arr.sort((a, b) => TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type) || b.rar - a.rar);
  const filt = eq.weapons.filter(w => !S.eqType || w.type === S.eqType);
  const ws = sortW(filt.filter(isOwn)), others = sortW(filt.filter(w => !isOwn(w)));
  const relCount = rel.reduce((n, r) => n + r.eq.weapons.length + r.eq.armor.length, 0);
  const ownN = eq.weapons.filter(isOwn).length, otherN = eq.weapons.length - ownN;
  const key = [`它自己的武器 **${ownN}** 件${otherN ? `（另有 ${otherN} 件别家武器要用它的素材强化）` : ""} · 防具 **${eq.armor.length}** 套`, `轻弩、重弩排在最前面`];
  if (rel.length) key.push(`⚠ 容易搞混：${rel.map(r => `**${r.label}**`).join("、")}的装备放在「别搞混」里`);
  if (!eq.weapons.length) key.splice(1, 1, `**这只怪物没有武器**（只有防具）`);
  const tabs = `<div class="seg" id="eqTabs"><button data-t="w" class="${S.eqTab === "w" ? "on" : ""}" aria-pressed="${S.eqTab === "w"}">武器 ${ownN}${otherN ? `<small style="opacity:.7"> +${otherN}</small>` : ""}</button><button data-t="a" class="${S.eqTab === "a" ? "on" : ""}" aria-pressed="${S.eqTab === "a"}">防具 ${eq.armor.length}</button>${rel.length ? `<button data-t="r" class="${S.eqTab === "r" ? "on" : ""}" aria-pressed="${S.eqTab === "r"}">⚠ 别搞混 ${relCount}</button>` : ""}</div>`;
  const chips = S.eqTab === "w" && types.length > 1 ? `<div class="seg" id="eqTypes"><button data-ty="" class="${!S.eqType ? "on" : ""}" aria-pressed="${!S.eqType}">全部</button>${types.map(t => `<button data-ty="${t}" class="${S.eqType === t ? "on" : ""}" aria-pressed="${S.eqType === t}">${eq.weapons.find(w => w.type === t).typeZh}</button>`).join("")}</div>` : "";
  let body = "";
  if (S.eqTab === "w") {
    body = ws.length ? `<div class="eqs">${ws.map(weaponCard).join("")}</div>` : (others.length ? "" : `<div class="todo">这只怪物没有可以制作的武器。${rel.length ? "名字相近的武器在「⚠ 别搞混」里。" : ""}</div>`);
    if (others.length) {
      const grp = {}; others.forEach(w => { const k = (w.series && w.series.zh) || "其他"; (grp[k] ||= []).push(w); });
      body += `<details class="more otherw"${ws.length ? "" : " open"}><summary>用它的素材强化的<b>其他怪物的武器</b>（${others.length} 件：${Object.entries(grp).map(([k, v]) => `${k} ${v.length}`).join("、")}）</summary>
        <div class="note-s" style="margin:6px 0 10px">这些不是它的武器：是别的怪物的武器线，<b>最后一步强化</b>需要${M.name}的素材。</div>
        <div class="eqs">${others.map(weaponCard).join("")}</div></details>`;
    }
  }
  else if (S.eqTab === "a") body = eq.armor.length ? `<div class="eqs">${eq.armor.map(armorCard).join("")}</div>` : `<div class="todo">没有找到防具。</div>`;
  else body = rel.map(r => `<div class="relh"><img src="${r.icon}" alt=""><div><b>${r.label}</b>的装备<div class="note-s">${r.note || ""}</div></div></div>
      <div class="eqs">${r.eq.weapons.sort((a, b) => TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type)).map(weaponCard).join("")}${r.eq.armor.map(armorCard).join("")}</div>`).join("");
  $("#eqbox").innerHTML = `<div class="key"><div class="t">要点</div><ul>${key.map(k => `<li>${md(k)}</li>`).join("")}</ul></div><div class="ctrls">${tabs}${chips}</div>${body}`;
  $("#eqbox").querySelectorAll("#eqTabs button").forEach(b => b.onclick = () => { S.eqTab = b.dataset.t; bindEquip(); });
  $("#eqbox").querySelectorAll("#eqTypes button").forEach(b => b.onclick = () => { S.eqType = b.dataset.ty || null; bindEquip(); });
}

// ---------- 素材掉落 ----------
const rwLoad = {};
function loadRewards(id) {
  if ((D.rewards || {})[id]) return Promise.resolve(D.rewards[id]);
  return rwLoad[id] ||= new Promise(ok => { const s = document.createElement("script"); s.src = `data/rewards/${id}.js`;
    s.onload = () => ok((D.rewards || {})[id] || {}); s.onerror = () => ok({}); document.head.appendChild(s); });
}
// 每组掉落的中文标题
function rwLabel(kind, g, i, all) {
  const en = (g.part && g.part.en) || "", zh = g.part && g.part.zh;
  if (kind === "target") return "目标报酬（任务结算）";
  if (kind === "capture") return "捕获报酬";
  if (kind === "buddy") return "随从（艾露猫 / 加尔克）带回";
  if (kind === "carves") { const m = en.match(/Main body \(x(\d+)\)/); if (m) return `剥取本体 ×${m[1]}`; if (/Severed/.test(en)) return "剥取切断的尾巴"; return zh || en; }
  if (kind === "drops") { if (/Riding/.test(en)) return "操龙时掉落"; return "掉落物（硬直、倒地时掉在地上）"; }
  if (kind === "breaks") return `破坏「${zh || en}」${g.rule === "Any of" && g.idx.length > 1 ? "（任意一边）" : ""}`;
  return zh || en;
}
const RW_ORDER = ["breaks", "target", "carves", "drops", "capture", "buddy"];
const itemImg = it => `<img class="iti" src="assets/items/${it.icon}_${it.color}.png" alt="" onerror="this.style.visibility='hidden'">`;
PAGE.drops = () => header("准备 · Drops", "素材掉落", "大师等级的掉落概率（来源 MHRice）。想要哪个素材，先看第一张表。", null) + `<div id="rwbox"><div class="note-s">读取中…</div></div>`;
async function bindDrops() {
  const id = MON.id, rw = await loadRewards(id);
  if (!$("#rwbox") || MON.id !== id) return;
  const groups = RW_ORDER.flatMap(k => (rw[k] || []).map((g, i) => ({ kind: k, g, label: rwLabel(k, g, i) })));
  if (!groups.length) { $("#rwbox").innerHTML = TODO("掉落数据"); return; }
  // 素材 → 所有来源
  const byItem = {};
  groups.forEach(({ g, label, kind }) => g.items.forEach(it => {
    const k = it.n.zh || it.n.en; (byItem[k] ||= { it, src: [] }).src.push({ label, kind, p: it.p, qty: it.qty });
  }));
  const items = Object.values(byItem).map(x => ({ ...x, best: x.src.slice().sort((a, b) => b.p - a.p)[0] }))
    .filter(x => !/秘宝|Treasure/.test(x.it.n.zh || x.it.n.en)).sort((a, b) => a.best.p - b.best.p);
  const rare = items[0], hasSever = (rw.carves || []).some(g => /Severed/.test((g.part || {}).en || ""));
  const topBreak = (rw.breaks || []).map(g => ({ g, it: g.items.slice().sort((a, b) => b.p - a.p)[0] })).sort((a, b) => b.it.p - a.it.p)[0];
  const key = [rare ? `最难拿：**${rare.it.n.zh}**（最高只有 ${rare.best.p}%：${rare.best.label}）` : "",
    topBreak ? `破坏「**${topBreak.g.part.zh}**」${topBreak.it.p}% 拿 **${topBreak.it.n.zh}**` : "",
    hasSever ? `断尾要用**斩击**：轻弩用**斩裂弹**的刃` : ""].filter(Boolean);
  const bar = p => `<div class="pbar"><i style="width:${p}%"></i></div>`;
  const nm = it => `<span class="itn"><b>${esc(it.n.zh || it.n.en)}</b><small>${[it.n.tw, it.n.ja, it.n.en].filter(Boolean).map(esc).join(" · ")}</small></span>`;
  $("#rwbox").innerHTML = `<div class="key"><div class="t">要点</div><ul>${key.map(k => `<li>${md(k)}</li>`).join("")}</ul></div>
    <h2 class="h">想要哪个素材 → 去哪拿 <span class="muted" style="font:13px var(--sans)">（越稀有越靠前）</span></h2>
    <div class="panel" style="padding:6px 12px"><table class="rwt"><tr><th></th><th>素材</th><th>最好的来源</th><th class="num">概率</th><th>其他来源</th></tr>
    ${items.map(x => `<tr><td>${itemImg(x.it)}</td><td>${nm(x.it)}</td><td><span class="src-best">${x.best.label}</span></td>
      <td class="num"><b class="${x.best.p <= 5 ? "rare" : ""}">${x.best.p}%</b>${bar(x.best.p)}</td>
      <td class="note-s">${x.src.filter(s => s !== x.best).sort((a, b) => b.p - a.p).map(s => `${s.label} ${s.p}%`).join("　")}</td></tr>`).join("")}</table></div>
    <h2 class="h">按来源</h2>
    <div class="rwcards">${groups.map(({ g, label, kind }) => `<div class="rwc ${kind}"><div class="rwh">${label}</div>
      ${g.items.slice().sort((a, b) => b.p - a.p).map(it => `<div class="rwi">${itemImg(it)}${nm(it)}<span class="qty">×${it.qty}</span><span class="pp ${it.p <= 5 ? "rare" : ""}">${it.p}%</span>${bar(it.p)}</div>`).join("")}</div>`).join("")}</div>
    <p class="note-s" style="margin-top:12px">概率是每一次判定的概率；剥取 ×4 表示剥 4 次，每次各自判定。来源：<a href="https://mhrise.mhrice.info/monster/${M.mhrice || MON.id.slice(2)}.html#s-reward-mr" target="_blank">MHRice</a></p>`;
}

// ---------- 推荐配装 ----------
PAGE.builds = () => header("准备 · Builds", "推荐配装", "", (TEXT.builds && TEXT.builds.key) || []) + (MON.BUILDS.length ? `<div class="builds">${MON.BUILDS.map(b => `<div class="build">
    <h4>${b.title}${b.guess ? '<span class="unv guess">推测</span>' : ""}</h4><div class="w">${b.weapon}</div><div class="st">${b.stats}</div>
    <div class="sk">${b.skills.map(s => `<span>${s}</span>`).join("")}</div><p>${b.why}</p>
    <div style="display:flex;justify-content:space-between;align-items:center"><span class="note-s">来源：${srcLink(b.src)}</span>
    <button class="btn" data-b="${b.id}">套用到计算器</button></div></div>`).join("")}</div>` : TODO("推荐配装")) +
  (TEXT.weaponNote ? `<details class="more"><summary>${WEAPON ? WEAPON.name : "武器"} 是哪只怪物做的？</summary><div style="margin-top:6px;font-size:14px;color:var(--paper2)">${TEXT.weaponNote}</div></details>` : "");
const bindBuilds = () => document.querySelectorAll("#main [data-b]").forEach(el => el.onclick = () => applyBuild(el.dataset.b));

// ---------- 盟友 ----------
PAGE.followers = () => {
  const F = MON.FOLLOWERS;
  if (!F) return header("准备 · Followers", "盟友", "") + TODO("盟友推荐");
  const card = (f, cls = "") => `<div class="fcard"><span class="tier ${cls}">${f.tier}</span><div class="n">${f.n}<small>${f.ja}</small></div><div class="w">${f.w} · ${f.role}</div>${f.why ? `<p>${f.why}</p>` : ""}</div>`;
  return header("准备 · Followers", "盟友", "单人打的时候带谁。", F.key) + (F.quest ? `
  <div class="panel" style="margin-bottom:18px"><h3>紧急任务：${F.quest.name} <span class="muted" style="font:13px var(--sans)">${F.quest.en}</span></h3>
    <div class="row" style="display:flex;gap:18px;flex-wrap:wrap;font-size:14px;color:var(--paper2)"><span>${F.quest.rank}</span><span>委托人：${F.quest.giver}</span><span>固定盟友：<b style="color:var(--gold2)">${F.quest.fixed}</b></span><a href="${F.quest.src}" target="_blank">来源</a></div></div>` : "") + `
  <h2 class="h">推荐<span class="unv guess">推测</span></h2><div class="fol">${F.pick.map(f => card(f)).join("")}</div>
  ${F.alt && F.alt.length ? `<h2 class="h">也可以</h2><div class="fol">${F.alt.map(f => card(f, "a")).join("")}</div>` : ""}
  ${F.avoid && F.avoid.length ? `<h2 class="h">别带</h2><ul class="check">${F.avoid.map(a => `<li class="static"><span class="n" style="color:var(--blood2)">✕</span><span><b>${a.n}</b>：${a.why}</span></li>`).join("")}</ul>` : ""}
  <p class="note-s" style="margin-top:12px">评级来自 <a href="${F.tierSrc}" target="_blank">game8 盟友评级</a>（通用，不是针对这只龙）。${F.note || ""}</p>`;
};

// ---------- 异常与道具 ----------
PAGE.status = () => {
  const ok = M.status.filter(s => s.ok).map(s => s.name), no = M.status.filter(s => !s.ok).map(s => s.name);
  const easiest = M.status.filter(s => s.ok && s.id !== "stun").sort((a, b) => a.init - b.init)[0];
  const autoKey = [`有效：**${ok.join(" / ")}**${no.length ? `；**${no.join(" / ")}无效**` : ""}`, easiest ? `最容易上的异常：**${easiest.name}**（首次 ${easiest.init}）` : ""].filter(Boolean);
  const sp = M.special;
  return header("准备 · Status", "异常与道具", "", (TEXT.status && TEXT.status.key) || autoKey) + `
  <div class="grid2">
    <div class="panel"><h3>异常耐性 <span class="muted" style="font:12px var(--sans)">第 1 / 2 / 3 次所需累积值</span></h3><div id="status"></div>
      <div class="note-s" style="margin-top:8px">${M.statusDecay || "耐性会随时间衰减"}。任务倍率取自 MHRice 任务表<span class="unv">未验证</span></div></div>
    <div class="panel">${sp ? `<h3><img src="assets/icons/${sp.icon || "blood"}.png" style="width:20px;vertical-align:-4px"> ${sp.title}${sp.verified === false ? '<span class="unv">数值未验证</span>' : ""}</h3>
      <ul style="margin:0;padding-left:18px;font-size:14px;color:var(--paper2)">${sp.points.map(x => `<li>${md(x)}</li>`).join("")}</ul>` : ""}
      ${(M.items || []).length || (M.misc || []).length ? `<h3 style="margin-top:16px">道具与其他</h3>
      <ul style="margin:0;padding-left:18px;font-size:14px;color:var(--paper2)">${(M.items || []).map(i => `<li>${i.ok ? "✔" : "✕"} ${i.name}：${i.note}</li>`).join("")}
      ${(M.misc || []).map(m => `<li>${m.k}：${m.v}${m.guess ? '<span class="unv guess">推测</span>' : ""}</li>`).join("")}</ul>` : (sp ? "" : TODO("道具与特殊状态"))}</div>
  </div>`;
};
function bindStatus() {
  const q = quest();
  $("#status").innerHTML = M.status.map(s => {
    const mul = (q.statusMul || {})[s.id] || 1;
    const t = [s.init, Math.min(s.init + s.inc, s.max), Math.min(s.init + 2 * s.inc, s.max)].map(x => Math.round(x * mul));
    const scale = t[2] * 1.04 || 1;
    const bars = s.ok ? [3, 2, 1].map(n => `<i class="t${n}" style="width:${(t[n - 1] / scale * 100).toFixed(1)}%"></i>`).join("") + t.map(v => `<span style="left:${(v / scale * 100).toFixed(1)}%">${v}</span>`).join("") : "";
    return `<div class="status-row"><span class="nm"><img src="assets/icons/${s.icon}.png">${s.name}</span>
      <div class="track">${s.ok ? bars : '<span style="left:60px;transform:none;color:var(--paper3)">无效</span>'}</div>
      <span class="muted">${s.ok ? `${s.init}(+${s.inc})→${s.max}${mul !== 1 ? ` ×${mul}` : ""} · ` : ""}${s.dur}</span></div>`;
  }).join("");
}

// ---------- 视频 ----------
PAGE.videos = () => header("视频 · YouTube", "视频", "点击在 YouTube 打开。", MON.VIDEOS.length ? [`标红「**先看**」的加起来不到 20 分钟`, `先认状态 → 再看躲招 → 最后看轻弩实战`] : []) +
  (MON.VIDEOS.length ? MON.VIDEOS.map(g => `<div class="vgroup"><h3>${g.group}</h3><div class="vids">${g.items.map(v => `
  <a class="vid" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener">
    <div class="th"><img src="assets/yt/${v.id}.jpg" alt="" loading="lazy">${v.star ? '<span class="star">先看</span>' : ""}<span class="len">${v.len}</span>${v.lang !== "—" ? `<span class="lang">${v.lang}</span>` : ""}</div>
    <div class="bd"><div class="tt">${v.t}</div><div class="ch">${v.ch}</div><div class="why">→ ${v.why}</div></div></a>`).join("")}</div></div>`).join("") : TODO("视频"));

// ================= 通用页 =================
function libraryPage() {
  const all = D.REGISTRY.map(r => ({ r, b: D.monsters[r.id] })).filter(x => x.b);
  const full = all.filter(x => x.r.status === "full").length;
  const card = ({ r, b }) => {
    const m = b.MONSTER, w = weakParts(0, m), last = weakParts(m.states.length - 1, m);
    return `<a class="mcard" href="#/m/${r.id}">
      <img src="${r.icon}" alt="">
      <div class="mb"><div class="mt">${r.name} ${r.status === "draft" ? '<span class="badge draft">草稿</span>' : '<span class="badge full">完整</span>'}</div>
        <div class="ms">${r.en} · ${r.ja}</div>
        <div class="mr"><span>弱点 <b>${w.join("、") || "—"}</b>${m.states.length > 1 && last.join() !== w.join() ? ` → <b>${last.join("、")}</b>` : ""}</span>
          <span class="wk">${m.weakness.filter(x => x.stars).map(x => `<img src="assets/icons/${ICON[x.el]}.png"><span class="stars">${"★".repeat(x.stars)}</span>`).join(" ")}</span></div>
        <div class="ms">${m.states.length > 1 ? `${m.states.length} 个状态 · ` : ""}${m.parts.length} 个部位 · 基础体力 ${m.baseHP}</div></div></a>`;
  };
  return header("Library", "怪物图鉴", "轻弩视角的怪物攻略：打哪里、用什么弹、怎么躲。", [`点一只怪物进入它的攻略`, `**草稿** = 只有游戏数据（肉质、耐性），攻略还没写`, `按 **/** 搜索（中文 / 日文 / 英文都可以）`]) + `
  <div class="tiles" style="grid-template-columns:repeat(3,1fr)">
    <div class="tile"><div class="t">怪物</div><div class="v"><span class="mono">${all.length}</span></div><div class="s">已收录</div></div>
    <div class="tile"><div class="t">完整攻略</div><div class="v"><span class="mono">${full}</span></div><div class="s">数据 + 招式 + 配装 + 视频</div></div>
    <div class="tile"><div class="t">草稿</div><div class="v"><span class="mono">${all.length - full}</span></div><div class="s">只有 MHRice 数据</div></div>
  </div>
  <div class="mcards">${all.map(card).join("")}</div>
  <h2 class="h">最近更新</h2>
  <table class="recent"><tr><th>怪物</th><th>类型</th><th>状态</th><th class="num">更新</th></tr>
  ${all.slice().sort((a, b) => (b.r.updated || "").localeCompare(a.r.updated || "")).map(({ r }) => `<tr><td><a href="#/m/${r.id}">${r.name}</a><div class="note-s">${r.en}</div></td><td>${r.type || "—"}</td><td>${r.status === "draft" ? "草稿" : "完整"}</td><td class="num mono">${r.updated || "—"}</td></tr>`).join("")}</table>`;
}
// ---------- 名词解释 ----------
let glP = null;
function loadGlossary() {
  if (D.GLOSSARY_SKILLS) return Promise.resolve();
  return glP ||= new Promise(ok => { const s = document.createElement("script"); s.src = "data/glossary_skills.js"; s.onload = ok; s.onerror = ok; document.head.appendChild(s); });
}
const TERMS = [
  ["会心 / 会心率", "Affinity", "打出「会心一击」（暴击）的概率。会心时伤害 ×1.25；负会心（红字）时 ×0.75。"],
  ["超会心", "Critical Boost", "把会心一击的伤害从 ×1.25 提高到 ×1.30 / 1.35 / 1.40。"],
  ["弱点 / 肉质", "Hitzone", "部位的软硬（0–100）。子弹看「弹」肉质，≥45 算弱点，「弱点特效」只在弱点上生效。"],
  ["动作值", "Motion Value", "每种弹自带的伤害倍率，例如 LV3通常弹 34、LV2贯穿弹 每段 7。"],
  ["会心距离", "Critical Distance", "每种弹有一个伤害最高的距离（准星变亮）。太近或太远伤害会下降。"],
  ["速射", "Rapid Fire", "轻弩特有：一次扣扳机连射 2–3 发，每发伤害 ×0.7，但只消耗 1 发子弹。"],
  ["装饰品（珠子）", "Decoration / Jewel", "镶在武器或防具的孔里，增加技能。名字里的【数字】是需要的孔大小；「Ⅱ」是同一技能的 2 级珠，要 4 级孔。"],
  ["镶嵌槽（孔）", "Slot", "武器 / 防具上的孔，大小 1–4。大孔可以放小珠子，反过来不行。"],
  ["护石", "Talisman", "额外的饰品：自带 1–2 个技能和几个孔。可以用炼金做。"],
  ["百龙装饰品", "Rampage Decoration", "只能镶在武器的「百龙孔」里的特殊珠子，给武器专用技能。"],
  ["怪异炼成", "Qurious Crafting", "曙光后期用怪异素材强化装备：武器加攻击 / 会心，防具可以换技能（俗称「傀异炼成」）。"],
  ["怪异化 / 怪异克服", "Afflicted / Risen", "被啮生虫感染的强化个体。「怪异克服」是克服了感染、更强的版本（例如怪异克服天彗龙）。"],
  ["狂龙病 / 狂龙症", "Frenzy", "被天廻龙一类的狂龙病毒感染：自然回复停止；持续打怪物可以克服，克服后会心上升。"],
  ["噬血", "Bloodblight", "原初爵银龙等给的状态：体力慢慢减少、回复变差，打中怪物可以回血。"],
];
function bindGlossary() {
  const box = $("#glbox"); if (!box) return;
  const SK = D.GLOSSARY_SKILLS || [];
  const groups = [...new Set(SK.map(x => x.group))];
  const q = (S.glq || "").trim().toLowerCase(), g = S.glg || "";
  const hit = x => !q || [x.n.zh, x.n.tw, x.n.ja, x.n.en, x.desc, ...x.decos.flatMap(d => [d.n.zh, d.n.tw, d.n.ja, d.n.en])].some(t => (t || "").toLowerCase().includes(q));
  const list = SK.filter(x => (!g || x.group === g) && hit(x));
  const deco = d => `<span class="deco" title="${esc([d.n.tw, d.n.ja, d.n.en].filter(Boolean).join(" / "))}">${d.icon ? `<img src="assets/items/${d.icon}_${d.color}.png" alt="">` : ""}<b>${esc(d.n.zh)}</b><small>+${d.lv} 级</small></span>`;
  box.innerHTML = `<div class="ctrls"><input class="glq" id="glq" placeholder="搜索：达人珠 / 看破 / Critical Eye / 見切り" value="${esc(S.glq || "")}" autocomplete="off">
    <div class="seg" id="glg"><button data-g="" class="${!g ? "on" : ""}" aria-pressed="${!g}">全部 ${SK.length}</button>${groups.map(x => `<button data-g="${x}" class="${g === x ? "on" : ""}" aria-pressed="${g === x}">${x}</button>`).join("")}</div></div>
    <div class="glist">${list.map(x => `<div class="gl1">
      <div class="glh"><b>${esc(x.n.zh)}</b><span class="n4"><span><i>繁</i>${esc(x.n.tw || "")}</span><span><i>日</i>${esc(x.n.ja || "")}</span><span><i>EN</i>${esc(x.n.en || "")}</span></span><span class="mx">最高 Lv${x.max}</span></div>
      <div class="gld">${esc(x.desc)}</div>
      ${x.decos.length ? `<div class="decos">${x.decos.map(deco).join("")}</div>` : `<div class="note-s">没有对应的装饰品（只能靠防具 / 护石）</div>`}
      <details class="lv"><summary>每级效果</summary><ol>${x.levels.map(l => `<li>${esc(l)}</li>`).join("")}</ol></details>
    </div>`).join("") || `<div class="todo">没有找到「${esc(q)}」</div>`}</div>`;
  const inp = $("#glq");
  inp.oninput = () => { S.glq = inp.value; const pos = inp.selectionStart; bindGlossary(); const n = $("#glq"); n.focus(); n.setSelectionRange(pos, pos); };
  box.querySelectorAll("#glg [data-g]").forEach(b => b.onclick = () => { S.glg = b.dataset.g; bindGlossary(); });
}

function guidePage() {
  const G = [
    ["Wyvern Counter（曙光新增翔虫技）", "用翔虫往后紧急撤退，同时打出后坐力很大的一发。<b>时机对上怪物的攻击</b>时，会变成爆炸反击，连吐息都能抵消。你说的「跳起来用翔虫挡攻击」应该就是它。", "fandomSwitch"],
    ["Fanning Vault（翔虫跃升）", "用翔虫跳到空中，空中可以开枪；在空中往正下方打起爆龙弹，会<b>直接命中怪物</b>。不能挡攻击。", "fandomSwitch"],
    ["Fanning Maneuver", "用翔虫向左右快速侧移，同时<b>短时间提高攻击</b>。", "fandomSwitch"],
    ["Critical Firepower（会心射击）", "通常弹 ×1.3、散弹 ×1.2、贯穿弹 ×1.1，但会心距离变窄、后坐力变大。计算器「其他」里可以打开。", "mhrdmg"],
  ];
  return header("通用知识", "轻弩基础", "跟怪物无关、所有轻弩都用得上的知识。", [`**名词解释**和**配装技能 / 珠子**在下面，可以搜索`, `被打飞时按**翔虫受身**，配合方向键**往侧边**躲追击`, `**Wyvern Counter**：翔虫后撤 + 时机对了就反击，可以抵消吐息`, `**狂龙症【蚀】**：被感染时**持续扣血**，但攻击、回避上升；克服后回满红血、会心上升`, `**伏魔耗命**：啮生虫**一直吸血**，换来攻击上升；切换翔虫技（迅速切换）可以回血`]) + `
  <h2 class="h" id="terms">名词解释</h2>
  <div class="terms">${TERMS.map(([t, en, d]) => `<div class="term"><b>${t}</b><small>${en}</small><p>${d}</p></div>`).join("")}</div>
  <h2 class="h" id="skills">配装常用技能 & 珠子 <span class="muted" style="font:13px var(--sans)">（4 语言 · 来源 MHRice）</span></h2>
  <div id="glbox"></div>
  <h2 class="h">翔虫技 / 切换技</h2>
  <div class="panel" style="padding:6px 12px"><table class="moves"><tr><th>名字</th><th>做什么</th><th>来源</th></tr>
    ${G.map(([n, d, s]) => `<tr><td class="mv">${n}</td><td>${d}</td><td class="note-s">${srcLink(s)}</td></tr>`).join("")}</table></div>
  <div class="note-s" style="margin-top:6px">中文名只在确认过时才写；没确认的保留英文名<span class="unv">未验证</span></div>
  <h2 class="h" id="wirefall">翔虫受身：被打飞后马上恢复</h2>
  <div class="grid2">
    <div class="panel"><h3>怎么做</h3>
      <ol style="margin:0;padding-left:20px;font-size:14.5px;line-height:1.8;color:var(--paper2)">
        <li>被怪物<b>打飞 / 撞飞</b>的瞬间（人还在空中）</li>
        <li>按<b>翔虫受身键</b>（Switch 默认 <span class="kbd">ZR</span>；其他平台看「按键设置 → 翔虫受身」）</li>
        <li>同时用<b>左摇杆选方向</b>：原初爵银龙的「翼盾冲撞 → 尾刺」要<b>往侧边</b>，不要往前后</li>
        <li>落地后马上拉开距离或继续射击</li>
      </ol>
      <div class="note-s" style="margin-top:8px">需要剩余翔虫（翔虫槽）。按键名称以游戏内设置为准<span class="unv">未验证</span></div></div>
    <div class="panel"><h3>为什么要往侧边</h3>
      <p style="margin:0;font-size:14.5px;color:var(--paper2);line-height:1.8">爵银龙的冲撞后面<b>固定接一下尾刺</b>，尾刺是沿着正前方刺过来的。往侧边受身就离开了尾刺的直线，往后受身反而会被刺中（game8）。</p></div>
  </div>
  <div class="vids" style="margin-top:12px">${[
    ["pTz_KUBGM00", "官方新动作指南 · 翔虫篇", "CapcomChannel", "5:29", "日", "官方教学，含翔虫受身"],
    ["hM2tUSrbj3c", "新手要知道的 8 个小贴士（含翔虫受身）", "单身狗游戏频道", "11:59", "中", "中文，新手向"],
    ["eFAMJD0kM1E", "绝对必须的技巧！翔虫基础篇", "タカティン", "10:30", "日", "53 万播放的翔虫基础"],
    ["GFdEwxXGdS0", "受身的诀窍 · 翔虫大师之路", "missing31", "14:09", "日", "专讲受身时机和方向"],
    ["sVNzyQv5ehQ", "Hunting 101 – Wirebug", "Capcom USA", "6:03", "英", "官方英文教学"],
    ["eMlSSey1bWI", "翔虫系统 + 操龙 极速攻略（翔虫受身）", "天神", "10:35", "中", "中文，翔虫受身章节"]].map(([id, t, ch, len, lang, why], i) => `
    <a class="vid" href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener"><div class="th"><img src="assets/yt/${id}.jpg" alt="" loading="lazy">${i < 2 ? '<span class="star">先看</span>' : ""}<span class="len">${len}</span><span class="lang">${lang}</span></div>
      <div class="bd"><div class="tt">${t}</div><div class="ch">${ch}</div><div class="why">→ ${why}</div></div></a>`).join("")}</div>
  <h2 class="h">会扣血的技能（不是怪物打的）</h2>
  <div class="grid2">
    <div class="panel"><h3>狂龙症【蚀】<span class="muted" style="font:12px var(--sans)"> Bloodlust</span></h3>
      <ul style="margin:0;padding-left:18px;font-size:14px;color:var(--paper2)"><li>战斗中<b>每隔一段时间</b>会被狂龙症感染</li><li>感染时：<b>体力慢慢减少</b>，但攻击力、回避性能上升，耐力消耗减少</li><li>克服后：<b>红色体力槽回满</b>，会心率上升（等级越高越久）</li></ul>
      <div class="note-s" style="margin-top:8px">来源：<a href="https://mhrise.mhrice.info/skill/PlayerSkill_205.html" target="_blank">MHRice 技能页</a></div></div>
    <div class="panel"><h3>伏魔耗命<span class="muted" style="font:12px var(--sans)"> Dereliction</span></h3>
      <ul style="margin:0;padding-left:18px;font-size:14px;color:var(--paper2)"><li>啮生虫<b>一直在吸你的体力</b>，换来攻击性能上升</li><li>啮生虫越多越强；用<b>迅速切换</b>（切换翔虫技那本书）可以回血</li><li>冥渊缠铠（Archfiend）防具带这个技能</li></ul>
      <div class="note-s" style="margin-top:8px">来源：<a href="https://mhrise.mhrice.info/skill/PlayerSkill_201.html" target="_blank">MHRice 技能页</a></div></div>
  </div>
  <div class="panel" style="margin-top:14px"><h3>和「噬血」不一样</h3><p style="margin:0;font-size:14px;color:var(--paper2)">上面两个是<b>你自己装备的技能</b>带来的扣血。「噬血」是<b>原初形态爵银龙打你</b>时附加的状态：自然回复停止、回复变差，打怪物可以回血。</p></div>`;
}
// ---------- 怪异调查计算器 ----------
let anP = null;
function loadAnomaly() {
  if (D.ANOMALY) return Promise.resolve(D.ANOMALY);
  return anP ||= new Promise(ok => { const s = document.createElement("script"); s.src = "data/anomaly.js"; s.onload = () => ok(D.ANOMALY); document.head.appendChild(s); });
}
const AN = { m: null, lv: 200, mode: null, pl: 1 };
const PL_MUL = [1, 1.35, 1.7, 2.0];   // 多人：按普通大师任务的倍率（怪异调查未公开）
const anRow = (tbl, lv) => { const r = tbl.rows.find(r => lv >= r[0] && lv <= r[1]) || tbl.rows.at(-1); return Object.fromEntries(D.ANOMALY.cols.map((c, i) => [c, r[i]])); };
function anMon() { const A = D.ANOMALY; return A.monsters.find(m => m.id === AN.m) || A.monsters.find(m => m.id === "em132_05") || A.monsters[0]; }
function anModes(m) { return [m.affFrom != null && "aff", m.norFrom != null && "nor"].filter(Boolean); }
function anomalyPage(ctx) {
  const q = new URLSearchParams(ctx.qs || "");
  if (q.get("m") && D.ANOMALY.monsters.some(m => m.id === q.get("m"))) AN.m = q.get("m");
  if (!AN.m) AN.m = (MON && D.ANOMALY.monsters.some(m => m.id === MON.id)) ? MON.id : "em132_05";
  return header("通用 · Anomaly", "怪异调查计算器", "选怪物和调查等级，算出体力和各种倍率。", [
    `体力 = **大师基础体力 × 这一级的体力倍率**（单人）`, `怪异调查**没有体力浮动**：同一级每次都一样`, `倍率表来自 MHRice（隐藏页）；多人倍率没有公开，按普通任务**推测**`]) + `<div id="anbox"></div>`;
}
function bindAnomaly() {
  const A = D.ANOMALY, m = anMon(), modes = anModes(m);
  if (!modes.includes(AN.mode)) AN.mode = modes[0] || "nor";
  const special = AN.lv === 301, lv = AN.lv;
  const from = AN.mode === "aff" ? m.affFrom : m.norFrom;
  const tbl = A.tables[AN.mode][AN.mode === "aff" ? m.aff : m.nor];
  const r = anRow(tbl, lv), hpSolo = Math.round(m.baseHP * r.hp), hp = Math.round(hpSolo * PL_MUL[AN.pl - 1]);
  const below = !special && from && lv < from;
  const reg = new Set(D.REGISTRY.map(x => x.id));
  const tile = (t, v, s) => `<div class="tile"><div class="t">${t}</div><div class="v">${v}</div><div class="s">${s}</div></div>`;
  const stat = (n, v) => `<span class="anst"><b>×${(+v).toFixed(2).replace(/\.?0+$/, "")}</b>${n}</span>`;
  // 折线图：两张表的体力随等级变化
  const series = modes.map(md => ({ md, name: md === "aff" ? "怪异化" : "通常", color: md === "aff" ? "#b8862f" : "#4a8fe0",
    pts: Array.from({ length: 300 }, (_, i) => [i + 1, Math.round(m.baseHP * anRow(A.tables[md][md === "aff" ? m.aff : m.nor], i + 1).hp)]),
    from: md === "aff" ? m.affFrom : m.norFrom }));
  const W = 760, H = 260, L = 56, R = 16, T = 16, B = 30;
  const ymax = Math.max(...series.flatMap(s => s.pts.map(p => p[1]))) * 1.06, ymin = 0;
  const X = l => L + (l - 1) / 299 * (W - L - R), Y = v => T + (1 - (v - ymin) / (ymax - ymin)) * (H - T - B);
  const ticks = Array.from({ length: 5 }, (_, i) => Math.round(ymax / 4 * i / 1000) * 1000);
  const svg = `<svg class="anchart" viewBox="0 0 ${W} ${H}" role="img" aria-label="体力随调查等级变化">
    ${ticks.map(t => `<line x1="${L}" x2="${W - R}" y1="${Y(t)}" y2="${Y(t)}" class="gr"/><text x="${L - 8}" y="${Y(t) + 4}" class="ax" text-anchor="end">${(t / 1000).toFixed(0)}k</text>`).join("")}
    ${[1, 50, 100, 150, 200, 250, 300].map(l => `<text x="${X(l)}" y="${H - 8}" class="ax" text-anchor="middle">Lv${l}</text>`).join("")}
    ${series.map(s => (s.from ? `<line x1="${X(s.from)}" x2="${X(s.from)}" y1="${T}" y2="${H - B}" class="fromline" stroke="${s.color}"/>` : "") +
      `<polyline fill="none" stroke="${s.color}" stroke-width="2" stroke-linejoin="round" points="${s.pts.map(p => `${X(p[0]).toFixed(1)},${Y(p[1]).toFixed(1)}`).join(" ")}"/>` +
      `<text x="${W - R}" y="${Y(s.pts.at(-1)[1]) - 6}" class="dl" text-anchor="end">${s.name}</text>`).join("")}
    ${!special ? `<line x1="${X(lv)}" x2="${X(lv)}" y1="${T}" y2="${H - B}" class="cur"/>` + series.map(s => `<circle cx="${X(lv)}" cy="${Y(s.pts[lv - 1][1])}" r="5" fill="${s.color}" stroke="#1b1714" stroke-width="2"/>`).join("") : ""}
    <line id="anx" x1="0" x2="0" y1="${T}" y2="${H - B}" class="hov" visibility="hidden"/>
    <rect id="anhit" x="${L}" y="${T}" width="${W - L - R}" height="${H - T - B}" fill="transparent"/></svg>`;
  $("#anbox").innerHTML = `
  <div class="anctl">
    <button class="qbtn anmon" id="anMonBtn" aria-haspopup="menu" aria-expanded="false"><img src="${m.icon}" alt=""><b>${esc(m.zh)}</b><span class="note-s">${esc(m.en)}</span>
      <svg viewBox="0 0 16 16" width="16" height="16"><path d="M3.5 6 L8 10.5 L12.5 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg></button>
    <div class="seg" id="anMode">${["aff", "nor"].map(md => `<button data-md="${md}" class="${AN.mode === md ? "on" : ""}" ${modes.includes(md) ? "" : "disabled"} aria-pressed="${AN.mode === md}">${md === "aff" ? "怪异化" : "通常（非怪异化）"}</button>`).join("")}</div>
    <div class="seg" id="anPl">${[1, 2, 3, 4].map(n => `<button data-pl="${n}" class="${AN.pl === n ? "on" : ""}" aria-pressed="${AN.pl === n}">${n} 人</button>`).join("")}</div>
  </div>
  <div class="anlv">
    <div class="lvbig"><span class="note-s">调查等级</span><b>${special ? "特殊调查" : "Lv " + lv}</b></div>
    <input type="range" id="anRange" min="1" max="300" value="${special ? 300 : lv}" aria-label="调查等级">
    <div class="seg" id="anQuick">${[1, 100, 200, 250, 300].map(l => `<button data-lv="${l}" class="${lv === l ? "on" : ""}" aria-pressed="${lv === l}">Lv${l}</button>`).join("")}<button data-lv="301" class="${special ? "on" : ""}" aria-pressed="${special}">特殊调查</button></div>
  </div>
  ${below ? `<div class="todo">⚠ ${esc(m.zh)}的${AN.mode === "aff" ? "怪异化" : "通常"}版本要到 <b>Lv${from}</b> 才会出现${m.norAlt && AN.mode === "nor" ? `（或 Lv${m.norAlt}）` : ""}，下面的数字只是表里的值。</div>` : ""}
  <div class="tiles">
    ${tile("体力" + (AN.pl > 1 ? `（${AN.pl} 人）` : ""), `<span class="mono">${hp.toLocaleString()}</span>`, `${m.baseHP} × ${r.hp}${AN.pl > 1 ? ` × ${PL_MUL[AN.pl - 1]}<span class="unv guess">推测</span>` : ""}`)}
    ${tile("攻击", `<span class="mono">×${r.atk}</span>`, "怪物攻击力倍率")}
    ${tile("部位耐久", `<span class="mono">×${r.part}</span>`, "破坏 / 硬直要打的量")}
    ${tile("单人体力", `<span class="mono">${hpSolo.toLocaleString()}</span>`, `${AN.mode === "aff" ? "怪异化" : "通常"}表 ${AN.mode === "aff" ? m.aff : m.nor}${m.risen ? " · 怪异克服" : ""}`)}
  </div>
  <div class="anstats"><span class="note-s">异常耐性倍率（越高越难上异常）</span>${stat("麻痹", r.paralyze)}${stat("睡眠", r.sleep)}${stat("眩晕", r.stun)}${stat("减气", r.exhaust)}${stat("属性异常", r.elementA)}${stat("骑乘", r.ride)}</div>
  <div class="panel" style="margin-top:16px"><h3>体力随等级变化 <span class="note-s" style="font-family:var(--sans);font-weight:400">虚线 = 从这一级开始出现 · 鼠标移上去看每一级</span></h3>
    ${series.length > 1 ? `<div class="legend3">${series.map(s => `<span><i style="background:${s.color}"></i>${s.name}</span>`).join("")}</div>` : ""}
    <div class="anwrap">${svg}<div class="antip" id="antip" hidden></div></div></div>
  <details class="more"><summary>${AN.mode === "aff" ? "怪异化" : "通常"}表 · 每个等级档位</summary>
    <table class="hzt antbl"><tr><th>等级</th><th>体力</th><th>体力倍率</th><th>攻击</th><th>部位</th><th>麻痹</th><th>睡眠</th><th>眩晕</th></tr>
    ${tbl.rows.filter((r0, i, a) => tbl.rows.length < 40 || i % 10 === 0 || i === a.length - 1).map(r0 => `<tr><td>${r0[0] === 301 ? "特殊调查" : r0[0] === r0[1] ? "Lv" + r0[0] : `Lv${r0[0]}–${r0[1]}`}</td><td class="num">${Math.round(m.baseHP * r0[2]).toLocaleString()}</td><td class="num">×${r0[2]}</td><td class="num">×${r0[3]}</td><td class="num">×${r0[4]}</td><td class="num">×${r0[7]}</td><td class="num">×${r0[8]}</td><td class="num">×${r0[5]}</td></tr>`).join("")}</table>
    <div class="note-s">${tbl.rows.length >= 40 ? "怪异化表几乎每一级都变，这里每 10 档显示一行。" : ""}来源：<a href="${tbl.src}" target="_blank">MHRice</a></div></details>
  <p class="note-s" style="margin-top:10px">${reg.has(m.id) ? `<a href="#/m/${m.id}">打开 ${esc(m.zh)} 的攻略 →</a>　` : ""}${A.note}</p>`;
  // 交互
  $("#anMonBtn").onclick = e => { e.stopPropagation(); toggleAnMenu(); };
  $("#anbox").querySelectorAll("#anMode [data-md]").forEach(b => b.onclick = () => { AN.mode = b.dataset.md; bindAnomaly(); });
  $("#anbox").querySelectorAll("#anPl [data-pl]").forEach(b => b.onclick = () => { AN.pl = +b.dataset.pl; bindAnomaly(); });
  $("#anbox").querySelectorAll("#anQuick [data-lv]").forEach(b => b.onclick = () => { AN.lv = +b.dataset.lv; bindAnomaly(); });
  $("#anRange").oninput = e => { AN.lv = +e.target.value; bindAnomaly(); $("#anRange").focus(); };
  const svgEl = $("#anbox .anchart"), tip = $("#antip"), hx = $("#anx");
  $("#anhit").onmousemove = e => {
    const b = svgEl.getBoundingClientRect(), x = (e.clientX - b.left) / b.width * W;
    const l = Math.max(1, Math.min(300, Math.round((x - L) / (W - L - R) * 299 + 1)));
    hx.setAttribute("x1", X(l)); hx.setAttribute("x2", X(l)); hx.setAttribute("visibility", "visible");
    tip.hidden = false; tip.style.left = Math.min(b.width - 160, (X(l) / W) * b.width + 10) + "px";
    tip.innerHTML = `<b>Lv${l}</b>` + series.map(s => `<div><i style="background:${s.color}"></i>${s.name} <span class="mono">${s.pts[l - 1][1].toLocaleString()}</span></div>`).join("");
  };
  $("#anhit").onmouseleave = () => { tip.hidden = true; hx.setAttribute("visibility", "hidden"); };
  $("#anhit").onclick = e => { const b = svgEl.getBoundingClientRect(), x = (e.clientX - b.left) / b.width * W; AN.lv = Math.max(1, Math.min(300, Math.round((x - L) / (W - L - R) * 299 + 1))); bindAnomaly(); };
}
function toggleAnMenu(force) {
  const menu = $("#questMenu"), btn = $("#anMonBtn"), open = force ?? menu.hidden;
  if (!open) { menu.hidden = true; return; }
  const reg = new Set(D.REGISTRY.map(x => x.id)), A = D.ANOMALY;
  const list = A.monsters.slice().sort((a, b) => reg.has(b.id) - reg.has(a.id));
  menu.innerHTML = `<div class="mh">选择怪物 · ${list.length} 只（有攻略的在前）</div><input class="anq" id="anQ" placeholder="搜索（中 / 日 / 英）" autocomplete="off">
    <div class="anlist">${list.map(x => `<a href="#" data-m="${x.id}" class="${x.id === AN.m ? "cur" : ""}" data-s="${esc((x.zh + x.ja + x.en).toLowerCase())}"><img src="${x.icon}" alt=""><span><b>${esc(x.zh)}</b><small>${esc(x.en)}${reg.has(x.id) ? " · 有攻略" : ""}</small></span>${x.id === AN.m ? '<span class="ck">✓</span>' : ""}</a>`).join("")}</div>`;
  const b = btn.getBoundingClientRect();
  menu.style.left = Math.max(8, b.left) + "px"; menu.style.top = (b.bottom + 6) + "px"; menu.hidden = false;
  menu.querySelectorAll("[data-m]").forEach(a => a.onclick = e => { e.preventDefault(); AN.m = a.dataset.m; menu.hidden = true; history.replaceState(null, "", "#/guide/anomaly?m=" + AN.m); bindAnomaly(); });
  const qi = $("#anQ"); qi.focus(); qi.oninput = () => { const v = qi.value.trim().toLowerCase(); menu.querySelectorAll("[data-m]").forEach(a => a.style.display = !v || a.dataset.s.includes(v) ? "" : "none"); };
  qi.onclick = e => e.stopPropagation();
}

function sourcesPage() {
  const mons = D.REGISTRY.map(r => D.monsters[r.id]).filter(Boolean);
  return header("Info", "来源与未验证", "图标、截图来自游戏数据站和官方素材，版权归 CAPCOM 所有。本页只作个人攻略参考。") + `
  <div class="grid2">
    <div class="panel"><h3>未验证 / 推测（通用）</h3><ol style="font-size:13.5px;color:var(--paper2);padding-left:18px">${D.UNVERIFIED.map(x => `<li>${x}</li>`).join("")}</ol>
      ${mons.map(b => b.UNVERIFIED && b.UNVERIFIED.length ? `<h3 style="margin-top:14px">${b.MONSTER.name}</h3><ol style="font-size:13.5px;color:var(--paper2);padding-left:18px">${b.UNVERIFIED.map(x => `<li>${x}</li>`).join("")}</ol>` : "").join("")}</div>
    <div class="panel"><h3>数据来源</h3><ol style="font-size:13.5px;padding-left:18px">${Object.values(D.SOURCES).map(s => `<li><a href="${s.url}" target="_blank">${s.name}</a></li>`).join("")}</ol>
      ${mons.map(b => `<h3 style="margin-top:14px">${b.MONSTER.name}</h3><ol style="font-size:13.5px;padding-left:18px">${Object.values(b.SOURCES || {}).map(s => `<li><a href="${s.url}" target="_blank">${s.name}</a></li>`).join("")}</ol>`).join("")}</div>
  </div>`;
}

// ================= 渲染 =================
let lastCtx = { kind: "library" };
async function render(scrollTop = true, fromHash = false) {
  let ctx = parseRoute();
  if (ctx.kind === "legacy") { history.replaceState(null, "", `#/m/em132_05/${ctx.page}${ctx.qs ? "?" + ctx.qs : ""}`); ctx = parseRoute(); fromHash = true; }
  try {
    if (ctx.kind === "mon") { await loadMonster(ctx.id); setMonster(ctx.id); if (fromHash) applyParams(ctx.qs); }
    if (ctx.kind === "library" || ctx.kind === "sources") await loadAll();
  } catch (e) { $("#main").innerHTML = header("Error", "找不到这只怪物", esc(e.message)) + `<a class="btn" href="#/">回到怪物图鉴</a>`; renderChrome({ kind: "library" }); return; }
  let html = "", bind = null;
  if (ctx.kind === "mon") {
    const [base, arg] = ctx.page.split("/");
    let r = base || "";
    if (base === "phase") { const n = Math.max(0, Math.min(phaseList().length - 1, +arg || 0)); r = `phase/${n}`; html = PAGE.phase(n); }
    else if (PAGE[r] && (r !== "followers" || MON.FOLLOWERS)) { html = PAGE[r](); bind = { map: bindMap, ammo: bindAmmo, formula: bindFormula, builds: bindBuilds, status: bindStatus, equip: bindEquip, drops: bindDrops }[r]; }
    else { r = ""; html = PAGE[""](); }
    ctx.r = r;
    $("#main").innerHTML = relink(html + pager(r));
    if (r === "map") syncHash("map");
    document.title = `${M.name} · ${(ORDER.find(o => o.r === r) || {}).t || ""} · 猎人手记`;
  } else {
    if (ctx.kind === "guide" && ctx.page === "anomaly") { await loadAnomaly(); html = anomalyPage(ctx); bind = bindAnomaly; }
    else if (ctx.kind === "guide") { await loadGlossary(); html = guidePage(); bind = bindGlossary; }
    else html = ctx.kind === "sources" ? sourcesPage() : libraryPage();
    $("#main").innerHTML = html;
    document.title = (ctx.kind === "guide" ? (ctx.page === "anomaly" ? "怪异调查计算器" : "轻弩基础") : ctx.kind === "sources" ? "来源" : "怪物图鉴") + " · 猎人手记";
  }
  bind && bind();
  document.querySelectorAll('[data-act="quest"]').forEach(a => a.onclick = e => { e.preventDefault(); e.stopPropagation(); toggleQuestMenu(a, true); });
  renderChrome(ctx);
  lastCtx = ctx;
  if (scrollTop) window.scrollTo(0, 0);
  if (ctx.sec && document.getElementById(ctx.sec)) document.getElementById(ctx.sec).scrollIntoView({ block: "start" });
}

// ---------------- 任务选择菜单 ----------------
const qTag = q => /烈祸|Hazard/.test(q.name) ? '<span class="qtag">烈祸</span>' : /活动|Event|双凶|Dual/.test(q.name) ? '<span class="qtag ev">活动</span>' : "";
const qShort = q => q.name.replace(/\s*[(（]烈祸[)）]/, "");
function questBtnHtml() {
  const q = quest();
  return `<span class="ql">任务</span><b>${esc(qShort(q))}</b>${qTag(q)}<span class="hp">${questHP().toLocaleString()}</span><svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M3.5 6 L8 10.5 L12.5 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
function toggleQuestMenu(anchor, force) {
  const menu = $("#questMenu");
  const open = force ?? menu.hidden;
  document.querySelectorAll('[aria-haspopup="menu"].qbtn').forEach(b => b.setAttribute("aria-expanded", "false"));
  if (!open || !M) { menu.hidden = true; return; }
  menu.innerHTML = `<div class="mh">选择任务 · 体力和异常耐性跟着变</div>` + M.quests.map(q => {
    const cur = q.id === S.quest, hp = Math.round(M.baseHP * q.hpMul);
    return `<a href="#" data-q="${q.id}" class="${cur ? "cur" : ""}" role="menuitemradio" aria-checked="${cur}"><span style="flex:1"><span class="qn">${esc(qShort(q))} ${qTag(q)}</span>
      <span class="qs">体力 ${hp.toLocaleString()} · 攻击 ×${q.atkMul ?? "—"}</span></span>${cur ? '<span class="ck">✓</span>' : ""}</a>`;
  }).join("");
  const b = anchor.getBoundingClientRect();
  const left = Math.min(Math.max(8, b.right - 340), innerWidth - 348);
  menu.style.left = left + "px"; menu.style.top = (b.bottom + 6) + "px";
  menu.hidden = false; anchor.getAttribute("aria-haspopup") && anchor.setAttribute("aria-expanded", "true");
  menu.querySelectorAll("[data-q]").forEach(a => a.onclick = e => { e.preventDefault(); S.quest = a.dataset.q; saveView(); menu.hidden = true; render(false); });
  const c = menu.querySelector(".cur") || menu.querySelector("a"); c && c.focus({ preventScroll: true });
}
document.addEventListener("click", e => { if (!e.target.closest("#questMenu") && !e.target.closest(".qbtn")) $("#questMenu").hidden = true; });

// ---------------- 怪物切换菜单 ----------------
function toggleMonMenu(ctx, force) {
  const menu = $("#monMenu"), chip = $("#monChip");
  const open = force ?? menu.hidden;
  if (!open) { menu.hidden = true; chip && chip.setAttribute("aria-expanded", "false"); return; }
  const page = ctx.kind === "mon" ? ctx.r || "" : "";
  const keep = page.startsWith("phase/") ? "phase/0" : page;   // 切换怪物时留在同一种页面
  menu.innerHTML = `<div class="mh">切换怪物${keep ? " · 停留在同一页" : ""}</div>` + D.REGISTRY.map(r => {
    const cur = MON && ctx.kind === "mon" && r.id === MON.id;
    return `<a href="#/m/${r.id}${keep ? "/" + keep : ""}" class="${cur ? "cur" : ""}" role="menuitem"><img src="${r.icon}" alt=""><span><b>${r.name}</b><small>${r.en}${r.status === "draft" ? " · 草稿" : ""}</small></span>${cur ? '<span class="ck">✓</span>' : ""}</a>`;
  }).join("") + `<a class="all" href="#/">☰ 全部怪物（图鉴）</a>`;
  const b = chip.getBoundingClientRect();
  menu.style.left = Math.max(8, b.left) + "px"; menu.style.top = (b.bottom + 6) + "px";
  menu.hidden = false; chip.setAttribute("aria-expanded", "true");
  const first = menu.querySelector("a"); first && first.focus({ preventScroll: true });
}
document.addEventListener("click", e => { if (!e.target.closest("#monMenu") && !e.target.closest("#monChip")) toggleMonMenu(lastCtx, false); });
$("#monMenu").addEventListener("click", e => { if (e.target.closest("a")) toggleMonMenu(lastCtx, false); });
document.addEventListener("keydown", e => { if (e.key === "Escape") { toggleMonMenu(lastCtx, false); document.body.classList.remove("drawer"); } });
// ---------------- 手机端抽屉 ----------------
$("#menuBtn").onclick = () => document.body.classList.toggle("drawer");
$("#scrim").onclick = () => document.body.classList.remove("drawer");
$("#side").addEventListener("click", e => { if (e.target.closest("a")) document.body.classList.remove("drawer"); });

// ---------------- 搜索 ----------------
function searchMatches(q) {
  q = q.trim().toLowerCase(); if (!q) return [];
  return D.REGISTRY.filter(r => [r.name, r.en, r.ja, ...(r.aliases || [])].some(x => (x || "").toLowerCase().includes(q)));
}
function renderSearch() {
  const box = $("#searchRes"), q = $("#search").value, res = searchMatches(q);
  if (!q.trim()) { box.hidden = true; return; }
  box.hidden = false;
  box.innerHTML = res.length ? res.map((r, i) => `<a href="#/m/${r.id}" class="${i === 0 ? "first" : ""}"><img src="${r.icon}">${r.name}<small>${r.en}</small>${r.status === "draft" ? '<span class="badge draft sm">草稿</span>' : ""}</a>`).join("") : `<div class="none">没有找到「${esc(q)}」</div>`;
}
$("#search").oninput = renderSearch;
$("#search").onkeydown = e => {
  if (e.key === "Enter") { const r = searchMatches(e.target.value)[0]; if (r) { location.hash = `#/m/${r.id}`; e.target.value = ""; renderSearch(); e.target.blur(); } }
  if (e.key === "Escape") { e.target.value = ""; renderSearch(); e.target.blur(); }
};
$("#searchRes").onclick = () => { $("#search").value = ""; renderSearch(); };
document.addEventListener("click", e => { if (!e.target.closest(".search")) $("#searchRes").hidden = true; });

$("#questBtn").onclick = e => { e.stopPropagation(); toggleQuestMenu($("#questBtn")); };
window.addEventListener("hashchange", () => render(true, true));
document.addEventListener("keydown", e => {
  if (/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) return;
  if (e.key === "/") { e.preventDefault(); $("#search").focus(); return; }
  if ((e.key !== "[" && e.key !== "]") || lastCtx.kind !== "mon") return;
  const i = ORDER.findIndex(o => o.r === lastCtx.r);
  const t = ORDER[i + (e.key === "]" ? 1 : -1)];
  if (t) go(t.r);
});
render(true, true);
})();
