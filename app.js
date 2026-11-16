/* 猎人手记 · 轻弩 — v2 单页应用（hash 路由，一次只显示一页） */
(() => {
const D = window.MHR, C = window.MHRCalc;
const { MONSTER: M, BLOODBLIGHT, AMMO, WEAPON, SKILLS, BUILDS, PIERCE_PATHS, UNVERIFIED, SOURCES, VIDEOS, STATE_PAGES, FOLLOWERS, PAGES } = D;
const $ = s => document.querySelector(s);
const fmt = (x, d = 1) => (Math.round(x * 10 ** d) / 10 ** d).toLocaleString("zh-CN", { minimumFractionDigits: d, maximumFractionDigits: d });
const md = t => t.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");   // **粗体**

const IMG = { n1:"normal",n2:"normal",n3:"normal",p1:"pierce",p2:"pierce",p3:"pierce",s1:"spread",s2:"spread",s3:"spread",
  st2:"sticky",st3:"sticky",slice:"slicing",fire:"fire",pfire:"pfire",ice:"ice",pice:"pice",thunder:"thunder",dragon:"dragon",pdragon:"pdragon",wb:"wyvern" };
const aImg = a => `assets/icons/ammo_${IMG[a.id]}.png`;
const ICON = { fire:"fire", water:"water", thunder:"thunder", ice:"ice", dragon:"dragon" };
const COLS = [
  { k: "shot", n: "弹", img: "hit_shell" }, { k: "dragon", n: "龙", img: "dragon" }, { k: "fire", n: "火", img: "fire" },
  { k: "ice", n: "冰", img: "ice" }, { k: "sever", n: "斩", img: "hit_slash" },
];

// ---------------- 共享状态 ----------------
const S = {
  state: 0, part: "head", col: "shot", view: "img", quest: "mr6", path: "auto", onlyWeap: true, fAmmo: "p2", fRF: true,
  o: { atk: 320, aff: 0, attack: 7, critEye: 7, wex: 2, critBoost: 3, normalUp: 0, pierceUp: 2, spreadUp: 0, rapidUp: 3,
       dragonAtk: 0, fireAtk: 0, iceAtk: 0, critEle: 0, bloodlust: 0, extraAtk: 0, extraAff: 30, dist: 1, defMul: 1, critFire: false },
};
const quest = () => M.quests.find(q => q.id === S.quest);
const questHP = () => Math.round(M.baseHP * quest().hpMul);
const partObj = id => M.parts.find(p => p.id === id);
const stName = i => M.states[i].name;
const weakParts = st => M.parts.filter(p => p.hz[st].shot >= 45).map(p => p.name);

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
const weapRF = new Set(Object.entries(WEAPON.ammo).filter(([, v]) => v.rf).map(([k]) => k));
function pathFor(a) {
  if (!(a.kind === "pierce" || a.kind === "element-pierce") || S.path === "single") return null;
  if (S.path === "auto") {
    const best = PIERCE_PATHS.filter(p => p.hits && p.hits[S.part]).sort((x, y) => y.hits[S.part] - x.hits[S.part])[0];
    return best ? best.hits : null;
  }
  return PIERCE_PATHS.find(p => p.id === S.path).hits;
}
function ranking(part = S.part, state = S.state) {
  const saved = [S.part, S.state]; S.part = part; S.state = state;
  const list = S.onlyWeap ? AMMO.filter(a => WEAPON.ammo[a.id]) : AMMO;
  const r = C.rankAmmo(list, part, state, S.o, { rfSet: S.onlyWeap ? weapRF : null, pathFor });
  [S.part, S.state] = saved;
  return r;
}

// ---------------- 路由 ----------------
const ORDER = [];   // 线性顺序 [{route, title}]
PAGES.forEach(p => {
  if (p.group) p.items.forEach(it => {
    if (it.children) it.children.forEach(n => ORDER.push({ r: `${it.id}/${n}`, t: `${it.t} · ${stName(n)}` }));
    else ORDER.push({ r: it.id, t: it.t });
  });
  else ORDER.push({ r: p.id === "home" ? "" : p.id, t: p.t });
});
ORDER.push({ r: "sources", t: "来源与未验证" });

function parseHash(applyParams = false) {
  const h = location.hash.replace(/^#\/?/, "");
  const [path, qs] = h.split("?");
  if (!applyParams) return path || "";
  const q = new URLSearchParams(qs || "");
  if (q.has("s")) S.state = Math.max(0, Math.min(3, +q.get("s") || 0));
  if (q.has("p") && partObj(q.get("p"))) S.part = q.get("p");
  if (q.has("c") && COLS.some(c => c.k === q.get("c"))) S.col = q.get("c");
  if (q.has("v")) S.view = q.get("v") === "2d" ? "2d" : "img";
  return path || "";
}
const go = r => { location.hash = "#/" + r; };
function syncHash(route) {   // 不新增历史记录，只让网址可分享
  const q = route === "map" ? `?s=${S.state}&p=${S.part}&c=${S.col}&v=${S.view}` : "";
  history.replaceState(null, "", "#/" + route + q);
}

// ---------------- 外框：顶栏 + 侧栏 ----------------
const closed = new Set(JSON.parse(localStorage.getItem("mhr_closed") || "[]"));
function renderChrome(route) {
  const top = [["打法", "map"], ["原理", "formula"], ["准备", "builds"], ["视频", "videos"]];
  const grpOf = r => { const base = r.split("/")[0]; return PAGES.find(p => p.group && p.items.some(i => i.id === base))?.group || PAGES.find(p => p.id === base)?.t; };
  $("#topnav").innerHTML = top.map(([t, r]) => `<a href="#/${r}" class="${grpOf(route) === t ? "on" : ""}">${t}</a>`).join("");
  const link = (r, t, extra = "") => `<a class="it ${route === r ? "on" : ""}" href="#/${r}">${extra}${t}</a>`;
  let h = `<div class="brandm">${M.name}</div>`;
  for (const p of PAGES) {
    if (!p.group) { h += link(p.id === "home" ? "" : p.id, p.t); continue; }
    const n = p.items.reduce((s, i) => s + (i.children ? i.children.length : 1), 0);
    h += `<div class="gl ${closed.has(p.group) ? "closed" : ""}" data-g="${p.group}" role="button" tabindex="0"><span class="chev">▾</span>${p.group}<span class="cnt">${n}</span></div><div class="sub">`;
    for (const it of p.items) {
      if (!it.children) { h += link(it.id, it.t); continue; }
      const cur = route.startsWith(it.id + "/") ? route.split("/")[1] : 0;
      h += `<a class="it" href="#/${it.id}/${cur}">${it.t}</a><div class="tree">` +
        it.children.map(n => link(`${it.id}/${n}`, M.states[n].name, `<span class="dotc" style="background:${M.states[n].color}"></span>`)).join("") + `</div>`;
    }
    h += `</div>`;
  }
  h += `<div class="foot">
    <div class="legend2"><span><i style="background:var(--blood2)"></i>红 = 要躲 / 危险</span><span><i style="background:var(--gold)"></i>金 = 能打 / 弱点</span><span><i style="background:var(--paper3)"></i>灰 = 背景信息</span></div>
    ${link("sources", "来源与未验证")}
    <div class="legend2"><span><span class="kbd">[</span> 上一页　<span class="kbd">]</span> 下一页</span></div></div>`;
  $("#side").innerHTML = h;
  $("#side").querySelectorAll(".gl").forEach(g => {
    const t = () => { const k = g.dataset.g; closed.has(k) ? closed.delete(k) : closed.add(k);
      localStorage.setItem("mhr_closed", JSON.stringify([...closed])); g.classList.toggle("closed"); };
    g.onclick = t; g.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); t(); } };
  });
}

const header = (crumb, title, sub, key) => `
  <div class="ph"><div class="crumb">${crumb}</div><h1>${title}</h1>${sub ? `<p>${sub}</p>` : ""}</div>
  ${key ? `<div class="key"><div class="t">要点</div><ul>${key.map(k => `<li>${md(k)}</li>`).join("")}</ul></div>` : ""}`;
function pager(route) {
  const i = ORDER.findIndex(o => o.r === route);
  const pv = ORDER[i - 1], nx = ORDER[i + 1];
  return `<div class="pager">${pv ? `<a href="#/${pv.r}"><div class="k">← 上一页</div>${pv.t}</a>` : "<span></span>"}${nx ? `<a class="nx" href="#/${nx.r}"><div class="k">下一页 →</div>${nx.t}</a>` : ""}</div>`;
}

// ================= 页面 =================
const PAGE = {};

// ---------- 速读 ----------
PAGE[""] = () => {
  const w0 = weakParts(0), w1 = weakParts(1);
  const best = ranking(w0.length ? M.parts.find(p => p.name === w0[0]).id : "head", 0)[0];
  const secs = [
    ["map", "打哪里", "肉质图：每个状态的弱点"], ["ammo", "用什么弹", "计算器 + 弹药伤害排名"], ["phase/0", "阶段与招式", "4 个状态：怎么认、怎么躲、何时打"],
    ["formula", "伤害怎么算", "一发子弹的伤害是怎么来的"], ["builds", "推荐配装", "刻银讨铳 等 3 套"], ["followers", "盟友", "带谁、别带谁"],
  ];
  return header("Quick read · 30 秒", `${M.name}`, `${M.nameAlt}`, [
    `原初打**头**，血气觉醒以后打**前肢**（弹肉质 45）`,
    `主力 **速射 LV2贯穿弹**；倒地时打 **贯穿灭龙弹 / 灭龙弹**`,
    `最大输出窗口：**烈昂大爆炸后的跌落**`,
  ]) + `
  <div class="tiles">
    <a class="tile" href="#/map?s=1&p=foreleg"><span class="go">→</span><div class="t">弱点部位</div><div class="v">${w0.join("、")} → ${w1.join("、")}</div><div class="s">原初 → 侵蚀后（弹肉质 ≥45）· 看肉质图</div></a>
    <a class="tile" href="#/ammo"><span class="go">→</span><div class="t">最佳弹药（打${w0[0]}）</div><div class="v">${best.ammo.name}</div><div class="s"><span class="mono" style="color:var(--gold2)">${fmt(best.total)}</span> / 每次射击 · 看全部弹药</div></a>
    <a class="tile" href="#" data-act="quest"><span class="go">→</span><div class="t">任务体力</div><div class="v"><span class="mono">${questHP().toLocaleString()}</span></div><div class="s">${quest().name} · 点击切换任务</div></a>
    <a class="tile" href="#/map?c=dragon"><span class="go">→</span><div class="t">弱点属性</div><div class="v" style="display:flex;gap:10px;align-items:center">${M.weakness.filter(w => w.stars).map(w => `<span><img src="assets/icons/${ICON[w.el]}.png" style="width:22px;vertical-align:-4px"><span class="stars">${"★".repeat(w.stars)}</span></span>`).join("")}</div><div class="s">雷 / 水 无效 · 看龙肉质</div></a>
  </div>
  <h2 class="h">开打前 3 件事</h2>
  <ul class="check">
    <li><a class="row" href="#/builds"><span class="n">1</span><span>带 <b>刻银讨铳</b>（或高攻击的速射贯穿轻弩）</span><span class="go">推荐配装 →</span></a></li>
    <li><a class="row" href="#/status"><span class="n">2</span><span>多带 <b>回复药</b>（噬血会降低回复）；<b>闪光弹</b>在蚀烈前有用</span><span class="go">异常与道具 →</span></a></li>
    <li><a class="row" href="#/videos"><span class="n">3</span><span>先看 1 分钟 <b>官方预告</b>，认清 4 个状态长什么样</span><span class="go">视频 →</span></a></li>
  </ul>
  <h2 class="h">内容</h2>
  <div class="secs">${secs.map(([r, t, s]) => `<a href="#/${r}"><div class="t">${t}</div><div class="s">${s}</div></a>`).join("")}</div>`;
};

// ---------- 打哪里 ----------
const SPOTS_IMG = [["head", 47, 31], ["torso", 46, 56], ["foreleg", 55, 77], ["foreleg", 38, 84], ["wing", 24, 30], ["wing", 80, 66], ["hindleg", 25, 81], ["tail", 15, 76], ["tailtip", 5, 62]];
// 2D 俯视图：平滑曲线（viewBox 400×520），左侧画一次，右侧镜像
const SHAPES = {
  wing: "M178 170 C150 138 108 110 62 100 C40 96 22 108 22 128 C34 132 40 142 34 152 C22 162 20 176 28 186 C42 188 46 198 40 210 C36 222 40 234 54 236 C64 238 66 248 62 260 C76 264 90 258 98 268 C114 262 144 246 178 226 Z",
  foreleg: "M182 182 C166 184 150 192 140 206 C132 218 120 224 108 226 C100 230 102 240 112 240 C126 240 138 234 148 224 C158 214 170 206 184 204 Z",
  hindleg: "M182 270 C168 274 154 284 146 298 C140 312 132 322 120 328 C114 334 118 342 128 340 C142 338 152 326 160 312 C166 300 176 292 186 290 Z",
  tail: "M190 316 C186 360 190 398 204 428 C212 446 220 458 230 468 L242 458 C232 446 226 432 220 414 C210 384 208 352 210 316 Z",
  tailtip: "M228 462 C240 456 246 458 252 466 C262 480 272 494 286 514 C268 504 252 494 238 486 C230 480 226 472 228 462 Z",
  torso: "M200 96 C214 96 220 118 222 148 C232 190 236 236 228 276 C222 304 212 322 200 326 C188 322 178 304 172 276 C164 236 168 190 178 148 C180 118 186 96 200 96 Z",
  head: "M200 24 C215 28 225 44 225 62 C225 82 214 98 200 106 C186 98 175 82 175 62 C175 44 185 28 200 24 Z",
};
const HORNS = ["M190 38 C182 24 170 12 156 4", "M210 38 C218 24 230 12 244 4", "M184 54 C170 46 156 42 142 42", "M216 54 C230 46 244 42 258 42"];
const SPOTS_2D = [["head", 200, 64], ["torso", 200, 214], ["foreleg", 126, 226], ["foreleg", 274, 226], ["wing", 72, 168], ["wing", 328, 168], ["hindleg", 138, 322], ["hindleg", 262, 322], ["tail", 214, 396], ["tailtip", 262, 494]];
const mirror = d => d.replace(/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g, (_, x, y) => `${400 - +x} ${y}`);

function hotspot(id, x, y) {
  const p = partObj(id), v = p.hz[S.state][S.col];
  return `<button class="hs${id === S.part ? " sel" : ""}${S.col === "shot" && v >= 45 ? " weak" : ""}" data-part="${id}" style="left:${x}%;top:${y}%" title="${p.name}：${v}">
    <span class="dot" style="background:${heat(v, S.col)}">${v}</span><span class="lb">${p.name}</span></button>`;
}
function mapView() {
  if (S.view === "img") return `<div class="mapimg st${S.state}"><img class="render" src="assets/img/primordial_render.png" alt="原初形态爵银龙">${SPOTS_IMG.map(([id, x, y]) => hotspot(id, x, y)).join("")}</div>`;
  const order = ["wing", "hindleg", "foreleg", "tail", "tailtip", "torso", "head"];
  let svg = `<defs><linearGradient id="sh" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></linearGradient>
    <filter id="glow" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="#f0cf7a" flood-opacity=".8"/></filter></defs>`;
  svg += HORNS.map(d => `<path class="horn" d="${d}"/>`).join("");
  for (const id of order) {
    const v = partObj(id).hz[S.state][S.col], ds = [SHAPES[id]];
    if (["wing", "hindleg", "foreleg"].includes(id)) ds.push(mirror(SHAPES[id]));
    const glow = (S.col === "shot" && v >= 45) || id === S.part ? ` filter="url(#glow)"` : "";
    svg += ds.map(d => `<path class="pt${id === S.part ? " sel" : ""}" data-part="${id}" d="${d}" fill="${heat(v, S.col)}"${glow}/><path class="shade" d="${d}" fill="url(#sh)"/>`).join("");
  }
  return `<div class="map2d"><svg viewBox="0 0 400 520" aria-label="爵银龙俯视示意图">${svg}</svg>${SPOTS_2D.map(([id, x, y]) => hotspot(id, x / 4, y / 5.2)).join("")}</div>`;
}
PAGE.map = () => {
  const p = partObj(S.part), h = p.hz[S.state];
  const top = ranking().slice(0, 3);
  const col = COLS.find(c => c.k === S.col);
  return header("打法 · Hitzones", "打哪里", "点击部位查看详情。切换状态，弱点会从头移到前肢。", [
    `原初：打**头 (45)**`, `觉醒 / 烈昂 / 蚀烈：打**前肢 (45)**，尾巴尖 40`, `翼和后肢只有 **5**：别把子弹浪费在这里`,
  ]) + `
  <div class="ctrls">
    <div class="seg" id="viewSeg"><button data-v="img" class="${S.view === "img" ? "on" : ""}">实景图</button><button data-v="2d" class="${S.view === "2d" ? "on" : ""}">2D 图</button></div>
    <div class="seg" id="stateSeg">${M.states.map(st => `<button data-s="${st.id}" class="${st.id === S.state ? "on" : ""}">${st.name}</button>`).join("")}</div>
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
          ${[["hit_shell", "弹", h.shot], ["hit_slash", "斩", h.sever], ["dragon", "龙", h.dragon], ["fire", "火", h.fire], ["ice", "冰", h.ice]].map(([i, n, v]) => `<span><img src="assets/icons/${i}.png" style="width:16px;vertical-align:-3px"> ${n} <b>${v}</b></span>`).join("")}
          ${h.stun ? `<span><img src="assets/icons/stun.png" style="width:16px;vertical-align:-3px"> 眩晕 <b>${h.stun}</b></span>` : ""}
        </div>
        <div class="row"><span>硬直值 <b>${p.stagger ?? "—"}</b></span><span>破坏值 <b>${p.brk ?? "—"}</b></span><span>${p.note}</span>
          ${h.shot >= 45 ? `<span style="color:var(--gold2)">◆ 弱点：弱点特效生效</span>` : ""}</div>
        <h3 style="margin-top:6px">这个部位最强的 3 种弹</h3>
        <div class="top3">${top.map((r, i) => `<div class="it"><span class="rk">${i + 1}</span><img class="ammoimg" src="${aImg(r.ammo)}">
          <span>${r.ammo.name} ${r.isRF ? `<span class="rf">速射×${r.bullets}</span>` : ""}</span><span class="mono" style="color:var(--gold2)">${fmt(r.total)}</span></div>`).join("")}</div>
        <a class="btn" style="display:inline-block;margin-top:12px;text-decoration:none" href="#/ammo">看全部弹药 →</a>
      </div>
      <div class="panel">
        <h3>全部位 × 全状态（${col.n} 肉质）</h3>
        <table><tr><th>部位</th>${M.states.map(s => `<th style="text-align:center">${s.short}</th>`).join("")}</tr>
        ${M.parts.map(pp => `<tr class="${pp.id === S.part ? "selrow" : ""}"><td>${pp.name}</td>${pp.hz.map((hh, i) =>
          `<td class="hzcell${i === S.state && pp.id === S.part ? " cur" : ""}" style="background:${heat(hh[S.col], S.col)}">${hh[S.col]}</td>`).join("")}</tr>`).join("")}</table>
        <div class="state-note">状态 1–3 与肉质编号的对应是按攻略推测的<span class="unv guess">推测</span></div>
      </div>
    </div>
  </div>`;
};
function bindMap() {
  const rr = () => render(false);
  document.querySelectorAll("[data-part]").forEach(b => b.onclick = () => { S.part = b.dataset.part; rr(); });
  document.querySelectorAll("#stateSeg button").forEach(b => b.onclick = () => { S.state = +b.dataset.s; rr(); });
  document.querySelectorAll("#colSeg button").forEach(b => b.onclick = () => { S.col = b.dataset.c; rr(); });
  document.querySelectorAll("#viewSeg button").forEach(b => b.onclick = () => { S.view = b.dataset.v; rr(); });
}

// ---------- 用什么弹 ----------
PAGE.ammo = () => header("打法 · Ammo", "用什么弹", `目标：<b style="color:var(--paper)">${partObj(S.part).name} · ${stName(S.state)}</b>（在 <a href="#/map">打哪里</a> 里换部位和状态）`, [
  `按「**扣一次扳机**」的期望伤害排序`, `左边改技能，右边马上更新`, `属性弹的排名依赖一个**未验证**的公式`,
]) + `
  <div class="calcgrid">
    <div class="panel calc" id="calc"></div>
    <div>
      <div class="summary" id="summary"></div>
      <div class="ctrls">
        <label><input type="checkbox" id="onlyWeap" ${S.onlyWeap ? "checked" : ""}> 只看刻银讨铳能用的弹</label>
        <label>贯穿路径 <select id="path"><option value="auto">自动：选经过该部位的路径</option>${PIERCE_PATHS.map(p => `<option value="${p.id}">${p.name}</option>`).join("")}</select></label>
      </div>
      <div class="panel" style="padding:6px 12px"><table class="rank" id="rank"></table></div>
      <details class="more"><summary>这些数字怎么看？</summary><div class="note-s" style="margin-top:6px">「打倒约需」= 任务体力 ÷ 每次射击伤害，只是理论值，不算装填、走位和多人体力倍率。贯穿弹最多 7 段；按路径估算时，7 段分到不同部位，各自用自己的肉质。</div></details>
    </div>
  </div>`;
function renderCalc() {
  const num = (k, label, step = 1) => `<div class="f"><label>${label}</label><input type="number" data-k="${k}" step="${step}" value="${S.o[k]}"></div>`;
  const sel = k => `<div class="f"><label>${SKILLS[k].name}</label><select data-k="${k}">${Array.from({ length: SKILLS[k].max + 1 }, (_, i) => `<option ${i == S.o[k] ? "selected" : ""}>${i}</option>`).join("")}</select></div>`;
  const grp = (t, open, inner) => `<details ${open ? "open" : ""}><summary>${t}</summary>${inner}</details>`;
  $("#calc").innerHTML = `<h3>计算器</h3>
    <div class="presets" style="margin:0 0 6px">${BUILDS.map(b => { const on = isApplied(b); return `<button class="btn${on ? " on" : ""}" data-b="${b.id}" aria-pressed="${on}">${on ? "✓ 已套用：" : "套用："}${b.short}</button>`; }).join("")}</div>
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
}
function isApplied(b) {   // 当前计算器数值是否正好等于这套配装
  return Object.keys(S.o).every(k => k === "dist" || k === "defMul" ? true : (b.preset[k] ?? (typeof S.o[k] === "number" ? 0 : false)) === S.o[k]);
}
function applyBuild(id) {
  const b = BUILDS.find(x => x.id === id);
  const keep = { dist: S.o.dist, defMul: S.o.defMul };
  Object.keys(S.o).forEach(k => { if (typeof S.o[k] === "number") S.o[k] = 0; });
  S.o.critFire = false;
  Object.assign(S.o, keep, b.preset);
  if (id === "dragon") { S.fAmmo = "dragon"; S.part = "head"; S.state = 0; }
  if (id === "normal") { S.onlyWeap = false; S.fAmmo = "n2"; }
  if (id === "pierce") { S.fAmmo = "p2"; S.onlyWeap = true; }
  location.hash === "#/ammo" ? render(true) : go("ammo");
}
function refreshPresets() {
  document.querySelectorAll("#calc [data-b]").forEach(el => { const b = BUILDS.find(x => x.id === el.dataset.b), on = isApplied(b);
    el.classList.toggle("on", on); el.setAttribute("aria-pressed", on); el.textContent = (on ? "✓ 已套用：" : "套用：") + b.short; });
}
function renderRank() {
  const r = ranking(), max = Math.max(...r.map(x => x.total), 1), hp = questHP(), p = partObj(S.part), best = r[0];
  $("#rank").innerHTML = `<tr><th>#</th><th>弹药</th><th class="num">每段</th><th class="num">段 × 发</th><th class="num">每次射击</th><th class="num">装填</th><th class="num">打倒约需</th><th style="width:20%"></th></tr>` +
    r.map((x, i) => {
      const pierce = x.ammo.kind.includes("pierce"), pa = pathFor(x.ammo), perHit = x.total / (x.hitsPerBullet * x.bullets);
      return `<tr><td class="mono" style="color:var(--blood2)">${i + 1}</td>
        <td><span class="nm"><img class="ammoimg" src="${aImg(x.ammo)}">${x.ammo.name} ${x.isRF ? `<span class="rf">速射</span>` : ""}</span>${x.ammo.note ? `<span class="note-s nt">${x.ammo.note}</span>` : ""}</td>
        <td class="num">${fmt(perHit)}${pa ? '<div class="note-s">路径平均</div>' : ""}</td>
        <td class="num">${x.hitsPerBullet} × ${x.bullets}${pierce && !pa ? '<div class="note-s">全中该部位</div>' : ""}</td>
        <td class="num" style="color:var(--gold2);font-weight:600">${fmt(x.total)}</td>
        <td class="num">${WEAPON.ammo[x.ammo.id] ? WEAPON.ammo[x.ammo.id].cap : "—"}</td>
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
  $("#path").value = S.path;
  $("#path").onchange = e => { S.path = e.target.value; renderRank(); };
  $("#onlyWeap").onchange = e => { S.onlyWeap = e.target.checked; renderRank(); };
}

// ---------- 阶段与招式 ----------
const pageOf = n => STATE_PAGES.find(x => x.state === n);
PAGE.phase = n => {
  const sp = pageOf(n), st = M.states[n];
  const list = arr => `<ul>${arr.map(x => `<li>${md(x)}</li>`).join("")}</ul>`;
  const pill = v => v === "yes" ? `<span class="pill yes">能打</span>` : v === "no" ? `<span class="pill no">别贪</span>` : `<span class="pill q">看情况</span>`;
  return `<div class="stabs">${M.states.map(s => `<a href="#/phase/${s.id}" class="${s.id === n ? "on" : ""}" style="--c:${s.color}"><span class="dotc" style="width:8px;height:8px;border-radius:50%;background:${s.color}"></span>${s.name}</a>`).join("")}</div>` +
  header(`阶段 ${n} / 3`, sp.title, st.desc, sp.key) + `
  <div class="hero2">
    <figure><img src="${sp.img}" alt="${sp.title}"><figcaption>${sp.imgCap}${sp.imgGuess ? '<span class="unv guess">推测</span>' : ""}</figcaption></figure>
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
      ${m.blood ? `<div class="bb"><img src="assets/icons/blood.png">附噬血</div>` : ""}</td>
      <td>${md(m.tell)}</td><td>${md(m.dodge)}</td><td>${pill(m.punish)}</td></tr>`).join("")}
  </table></div>
  <h2 class="h">这个状态的弹肉质</h2>
  <div class="strip">${M.parts.map(p => `<div><b style="background:${heat(p.hz[n].shot, "shot")}">${p.hz[n].shot}</b>${p.name}</div>`).join("")}</div>
  <a class="btn" style="display:inline-block;margin-top:14px;text-decoration:none" href="#/map?s=${n}&p=${n === 0 ? "head" : "foreleg"}">在肉质图里看 →</a>`;
};

// ---------- 伤害怎么算 ----------
PAGE.formula = () => header("原理 · Damage", "伤害怎么算", "选一种弹，看一发子弹的伤害怎么一步步算出来。", [
  `物理 = **真实攻击 × 动作值 × 肉质 × 倍率 × 会心**`, `肉质 **≥45** 才算弱点，弱点特效才生效`, `部位和状态沿用「打哪里」的选择`,
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
  const h = C.hitDamage(a, S.part, S.state, S.o, rf);
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

// ---------- 推荐配装 ----------
PAGE.builds = () => header("准备 · Builds", "推荐配装", "", [
  `主力：**刻银讨铳 · 物理贯穿**`, `**雷、水**肉质全身 0：雷贯 / 水贯轻弩无效`, `点「套用到计算器」可以直接看伤害`,
]) + `<div class="builds">${BUILDS.map(b => `<div class="build">
    <h4>${b.title}${b.guess ? '<span class="unv guess">推测</span>' : ""}</h4><div class="w">${b.weapon}</div><div class="st">${b.stats}</div>
    <div class="sk">${b.skills.map(s => `<span>${s}</span>`).join("")}</div><p>${b.why}</p>
    <div style="display:flex;justify-content:space-between;align-items:center"><span class="note-s">来源：${SOURCES[b.src] ? `<a href="${SOURCES[b.src].url}" target="_blank">${SOURCES[b.src].name}</a>` : b.src}</span>
    <button class="btn" data-b="${b.id}">套用到计算器</button></div></div>`).join("")}</div>
  <details class="more"><summary>刻银讨铳 是普通爵银龙的武器吗？</summary><div style="margin-top:6px;font-size:14px;color:var(--paper2)">不是。它在「爵银龙衍生改」这条武器线的最后，但锻造需要<b>原初形态爵银龙</b>的素材（原初的宠鳞、刻冥的龙血玉 等），MR6★ 解锁。来源：<a href="${SOURCES.weapon.url}" target="_blank">MHRice</a></div></details>`;
const bindBuilds = () => document.querySelectorAll("[data-b]").forEach(el => el.onclick = () => applyBuild(el.dataset.b));

// ---------- 盟友 ----------
PAGE.followers = () => {
  const F = FOLLOWERS;
  const card = (f, cls = "") => `<div class="fcard"><span class="tier ${cls}">${f.tier}</span><div class="n">${f.n}<small>${f.ja}</small></div><div class="w">${f.w} · ${f.role}</div>${f.why ? `<p>${f.why}</p>` : ""}</div>`;
  return header("准备 · Followers", "盟友", "单人打的时候带谁。", [
    `紧急任务「**${F.quest.name}**」盟友固定：**菲奥莱娜**`, `其他任务推荐 **Hinoa + Utsushi**（两个狩猎笛）`, `别带 **Rondine**：陷阱对这只龙无效`,
  ]) + `
  <div class="panel" style="margin-bottom:18px"><h3>紧急任务：${F.quest.name} <span class="muted" style="font:13px var(--sans)">${F.quest.en}</span></h3>
    <div class="row" style="display:flex;gap:18px;flex-wrap:wrap;font-size:14px;color:var(--paper2)"><span>${F.quest.rank}</span><span>委托人：${F.quest.giver}</span><span>固定盟友：<b style="color:var(--gold2)">${F.quest.fixed}</b></span><a href="${F.quest.src}" target="_blank">来源</a></div></div>
  <h2 class="h">推荐<span class="unv guess">推测</span></h2>
  <div class="fol">${F.pick.map(f => card(f)).join("")}</div>
  <h2 class="h">也可以</h2>
  <div class="fol">${F.alt.map(f => card(f, "a")).join("")}</div>
  <h2 class="h">别带</h2>
  <ul class="check">${F.avoid.map(a => `<li class="static"><span class="n" style="color:var(--blood2)">✕</span><span><b>${a.n}</b>：${a.why}</span></li>`).join("")}</ul>
  <p class="note-s" style="margin-top:12px">评级来自 <a href="${F.tierSrc}" target="_blank">game8 盟友评级</a>（通用，不是针对这只龙）。${F.note}</p>`;
};

// ---------- 异常与道具 ----------
PAGE.status = () => header("准备 · Status", "异常与道具", "", [
  `**毒 / 麻痹 / 睡眠 / 爆破 / 眩晕**有效，**减气无效**`, `**陷阱、音爆、肉**无效；闪光弹在蚀烈前有效`, `被「**噬血**」：继续输出就能回血并解除`,
]) + `
  <div class="grid2">
    <div class="panel"><h3>异常耐性 <span class="muted" style="font:12px var(--sans)">第 1 / 2 / 3 次所需累积值</span></h3><div id="status"></div>
      <div class="note-s" style="margin-top:8px">${M.statusDecay}。任务倍率取自 MHRice 任务表<span class="unv">未验证</span></div></div>
    <div class="panel"><h3><img src="assets/icons/blood.png" style="width:20px;vertical-align:-4px"> ${BLOODBLIGHT.title}<span class="unv">数值未验证</span></h3>
      <ul style="margin:0;padding-left:18px;font-size:14px;color:var(--paper2)">${BLOODBLIGHT.points.map(x => `<li>${x}</li>`).join("")}</ul>
      <h3 style="margin-top:16px">道具与其他</h3>
      <ul style="margin:0;padding-left:18px;font-size:14px;color:var(--paper2)">${M.items.map(i => `<li>${i.ok ? "✔" : "✕"} ${i.name}：${i.note}</li>`).join("")}
      ${M.misc.map(m => `<li>${m.k}：${m.v}${m.guess ? '<span class="unv guess">推测</span>' : ""}</li>`).join("")}</ul></div>
  </div>`;
function bindStatus() {
  const q = quest();
  $("#status").innerHTML = M.status.map(s => {
    const mul = q.statusMul[s.id] || 1;
    const t = [s.init, Math.min(s.init + s.inc, s.max), Math.min(s.init + 2 * s.inc, s.max)].map(x => Math.round(x * mul));
    const scale = t[2] * 1.04;
    const bars = s.ok ? [3, 2, 1].map(n => `<i class="t${n}" style="width:${(t[n - 1] / scale * 100).toFixed(1)}%"></i>`).join("") + t.map(v => `<span style="left:${(v / scale * 100).toFixed(1)}%">${v}</span>`).join("") : "";
    return `<div class="status-row"><span class="nm"><img src="assets/icons/${s.icon}.png">${s.name}</span>
      <div class="track">${s.ok ? bars : '<span style="left:60px;transform:none;color:var(--paper3)">无效</span>'}</div>
      <span class="muted">${s.ok ? `${s.init}(+${s.inc})→${s.max}${mul !== 1 ? ` ×${mul}` : ""} · ` : ""}${s.dur}</span></div>`;
  }).join("");
}

// ---------- 视频 ----------
PAGE.videos = () => header("视频 · YouTube", "视频", "点击在 YouTube 打开。", [
  `标红「**先看**」的 3 个加起来不到 20 分钟`, `先看预告认状态 → 再看躲招 → 最后看轻弩实战`,
]) + VIDEOS.map(g => `<div class="vgroup"><h3>${g.group}</h3><div class="vids">${g.items.map(v => `
  <a class="vid" href="https://www.youtube.com/watch?v=${v.id}" target="_blank" rel="noopener">
    <div class="th"><img src="assets/yt/${v.id}.jpg" alt="" loading="lazy">${v.star ? '<span class="star">先看</span>' : ""}<span class="len">${v.len}</span>${v.lang !== "—" ? `<span class="lang">${v.lang}</span>` : ""}</div>
    <div class="bd"><div class="tt">${v.t}</div><div class="ch">${v.ch}</div><div class="why">→ ${v.why}</div></div></a>`).join("")}</div></div>`).join("");

// ---------- 来源 ----------
PAGE.sources = () => header("Info", "来源与未验证", "图标、截图来自游戏数据站和官方素材，版权归 CAPCOM 所有。本页只作个人攻略参考。") + `
  <div class="grid2">
    <div class="panel"><h3>未验证 / 推测</h3><ol style="font-size:13.5px;color:var(--paper2);padding-left:18px">${UNVERIFIED.map(x => `<li>${x}</li>`).join("")}</ol></div>
    <div class="panel"><h3>数据来源</h3><ol style="font-size:13.5px;padding-left:18px">${Object.values(SOURCES).map(s => `<li><a href="${s.url}" target="_blank">${s.name}</a></li>`).join("")}</ol></div>
  </div>`;

// ================= 渲染 =================
// fromHash=true：只有网址变化时才用网址参数覆盖状态；页面内点击不会被旧参数还原
function render(scrollTop = true, fromHash = false) {
  const route = parseHash(fromHash);
  let html, bind;
  const [base, arg] = route.split("/");
  if (base === "phase") { const n = Math.max(0, Math.min(3, +arg || 0)); html = PAGE.phase(n); }
  else if (PAGE[base]) { html = PAGE[base](); bind = { map: bindMap, ammo: bindAmmo, formula: bindFormula, builds: bindBuilds, status: bindStatus }[base]; }
  else { html = PAGE[""](); }
  const r = base === "phase" ? `phase/${Math.max(0, Math.min(3, +arg || 0))}` : (PAGE[base] ? base : "");
  $("#main").innerHTML = html + pager(r);
  bind && bind();
  document.querySelectorAll('[data-act="quest"]').forEach(a => a.onclick = e => { e.preventDefault(); const q = $("#quest"); q.focus(); try { q.showPicker(); } catch (_) {} });
  renderChrome(r);
  if (r === "map") syncHash("map");
  $("#hpLine").textContent = `体力 ${questHP().toLocaleString()}`;
  if (scrollTop) window.scrollTo(0, 0);
}

$("#quest").innerHTML = M.quests.map(q => `<option value="${q.id}">${q.name}</option>`).join("");
$("#quest").value = S.quest;
$("#quest").onchange = e => { S.quest = e.target.value; render(false); };
window.addEventListener("hashchange", () => render(true, true));
document.addEventListener("keydown", e => {
  if (/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) return;
  if (e.key !== "[" && e.key !== "]") return;
  const cur = parseHash().split("?")[0];
  const i = ORDER.findIndex(o => o.r === cur);
  const t = ORDER[i + (e.key === "]" ? 1 : -1)];
  if (t) go(t.r);
});
render(true, true);
})();
