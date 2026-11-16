/* MHR:SB 轻弩伤害计算 — 纯函数
 * 公式依据 MHR-Damage (stonesan101) 源码 main.js，技能数值依据 Kiranico。
 * 所有结果都是「期望伤害」（会心按会心率加权），所以会带小数。
 */
(function (root) {
  const D = (typeof module !== "undefined" && module.exports) ? require("./data.js") : root.MHR;
  const { SKILLS, SWITCH, MONSTER } = D;

  const lv = (o, k) => Math.max(0, Math.min(SKILLS[k] ? SKILLS[k].max : 9, +o[k] || 0));
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

  /** 真实攻击 = floor(武器攻击 × (1+攻击%) + 攻击固定值 + 狂龙症 + 其他)，上限 2600 */
  function trueRaw(o) {
    const a = lv(o, "attack"), b = lv(o, "bloodlust");
    const pct = SKILLS.attack.pct[a] / 100;
    const flat = SKILLS.attack.flat[a] + SKILLS.bloodlust.flat[b] + (+o.extraAtk || 0);
    return Math.min(Math.floor((+o.atk || 0) * (1 + pct) + flat), 2600);
  }

  /** 会心率（%），弱点特效只在肉质 ≥45 时加 */
  function affinity(o, hzVal) {
    let aff = (+o.aff || 0) + SKILLS.critEye.aff[lv(o, "critEye")] + SKILLS.bloodlust.aff[lv(o, "bloodlust")] + (+o.extraAff || 0);
    if (hzVal >= 45) aff += SKILLS.wex.aff[lv(o, "wex")];
    return clamp(aff, -100, 100);
  }

  /** 会心期望倍率：正会心 1+(超会心倍率-1)×率；负会心 1-0.25×率 */
  function critExpect(aff, cbLv) {
    const m = SKILLS.critBoost.mult[cbLv];
    return aff >= 0 ? 1 + (m - 1) * aff / 100 : 1 - 0.25 * (-aff) / 100;
  }

  function ammoRawMult(ammo, o, isRF) {
    let m = 1;
    const steps = [];
    const add = (label, x) => { if (x !== 1) { m *= x; steps.push({ label, x }); } };
    if (ammo.kind === "normal") add("通常弹强化", SKILLS.normalUp.mult[lv(o, "normalUp")]);
    if (ammo.kind === "pierce") add("贯穿弹强化", SKILLS.pierceUp.mult[lv(o, "pierceUp")]);
    if (ammo.kind === "spread") add("散弹强化", SKILLS.spreadUp.mult[lv(o, "spreadUp")]);
    if (isRF) add("速射强化", SKILLS.rapidUp.mult[lv(o, "rapidUp")]);
    if (o.critFire) {
      const cf = SWITCH.critFire;
      add("会心射击", ammo.kind === "normal" ? cf.normal : ammo.kind === "spread" ? cf.spread : ammo.kind === "pierce" ? cf.pierce : 1);
    }
    add("会心距离", +o.dist || 1);
    return { m, steps };
  }

  function eleSkillKey(el) { return { dragon: "dragonAtk", fire: "fireAtk", ice: "iceAtk" }[el]; }

  /** 单段命中的期望伤害 + 计算步骤 */
  function hitDamage(ammo, partId, state, o, isRF) {
    const part = MONSTER.parts.find(p => p.id === partId);
    const hzRow = part.hz[state];
    const ignoreHz = ammo.hz === "none";
    const hzVal = ignoreHz ? 100 : hzRow[ammo.hz];
    const mv = isRF ? ammo.rf.mv : ammo.mv;
    const raw = trueRaw(o);
    const noCrit = ammo.noCrit || ammo.kind === "sticky";
    const aff = noCrit ? 0 : affinity(o, ignoreHz ? 0 : hzVal);
    const crit = noCrit ? 1 : critExpect(aff, lv(o, "critBoost"));
    const am = ammoRawMult(ammo, o, isRF);
    const def = +o.defMul || 1;
    const rawHit = raw * (mv / 100) * (hzVal / 100) * am.m * crit * def;

    let eleHit = 0, ele = 0, eleHz = 0, eleSteps = null;
    if (ammo.ele) {
      const base = isRF ? (ammo.rf.eleVal ?? ammo.eleVal) : ammo.eleVal;
      const k = eleSkillKey(ammo.ele);
      const el = k ? lv(o, k) : 0;
      const pct = k ? SKILLS[k].pct[el] / 100 : 0;
      const flat = (k ? SKILLS[k].flat[el] : 0) + SKILLS.bloodlust.ele[lv(o, "bloodlust")];
      ele = Math.min(Math.floor(base * (1 + pct) + flat + 0.1), 560);
      eleHz = ignoreHz ? 100 : hzRow[ammo.ele];
      const rawScale = 1 + raw / 100;               // 未验证：取自 MHR-Damage
      const rf = isRF ? SKILLS.rapidUp.mult[lv(o, "rapidUp")] : 1;
      const ce = noCrit ? 1 : 1 + (SKILLS.critEle.mult[lv(o, "critEle")] - 1) * Math.max(aff, 0) / 100;
      eleHit = ele * (eleHz / 100) * rawScale * rf * ce * def;
      eleSteps = { base, ele, eleHz, rawScale, rf, ce };
    }
    return {
      part: part.name, hzVal, mv, raw, aff, crit, ammoMult: am.m, ammoSteps: am.steps, def,
      rawHit, eleHit, ele, eleHz, eleSteps, total: rawHit + eleHit, wexOn: !noCrit && !ignoreHz && hzVal >= 45,
    };
  }

  /** 一次扣扳机的总伤害。贯穿弹可传入穿透路径（部位 → 段数）。 */
  function shotDamage(ammo, partId, state, o, opts = {}) {
    const isRF = !!(opts.rf && ammo.rf);
    const bullets = isRF ? ammo.rf.n : 1;
    const isPierce = ammo.kind === "pierce" || ammo.kind === "element-pierce";
    let perBullet = 0, hitsPerBullet = ammo.hits;
    if (isRF && ammo.rf.hitsPer) hitsPerBullet = ammo.rf.hitsPer;
    if (isPierce && opts.path) {
      perBullet = Object.entries(opts.path).reduce((s, [pid, n]) => s + n * hitDamage(ammo, pid, state, o, isRF).total, 0);
      hitsPerBullet = Object.values(opts.path).reduce((a, b) => a + b, 0);
    } else {
      perBullet = hitsPerBullet * hitDamage(ammo, partId, state, o, isRF).total;
    }
    const one = hitDamage(ammo, partId, state, o, isRF);
    return { ammo, isRF, bullets, hitsPerBullet, perHit: one.total, hit: one, total: perBullet * bullets };
  }

  /** 按「一次扣扳机伤害」排序全部弹药 */
  function rankAmmo(ammoList, partId, state, o, opts = {}) {
    return ammoList.map(a => {
      const allowRF = opts.rfSet ? opts.rfSet.has(a.id) : !!a.rf;
      const r = shotDamage(a, partId, state, o, { rf: allowRF && !!a.rf, path: opts.pathFor ? opts.pathFor(a) : null });
      return r;
    }).sort((x, y) => y.total - x.total);
  }

  const API = { trueRaw, affinity, critExpect, hitDamage, shotDamage, rankAmmo };
  if (typeof module !== "undefined" && module.exports) module.exports = API;
  else root.MHRCalc = API;
})(typeof window !== "undefined" ? window : globalThis);
