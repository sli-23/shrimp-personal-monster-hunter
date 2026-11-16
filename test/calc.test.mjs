// node test/calc.test.mjs — 公式输出与手算对照
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const D = require("../data/shared.js");
require("../data/monsters/em132_05.js");
require("../data/monsters/em072_08.js");
const C = require("../calc.js");
const A = id => D.AMMO.find(a => a.id === id);
let fail = 0;
const near = (name, got, want, eps = 0.01) => {
  const ok = Math.abs(got - want) < eps;
  if (!ok) fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}: got ${got.toFixed(4)}, want ${want}`);
};

// 1) LV3通常弹 打头（原初，弹肉质 45）：攻击7 看破7 弱特3 超会心3 通常强化3
//    真实攻击 floor(320×1.10+10)=362；会心 40+50=90% → ×(1+0.4×0.9)=1.36
//    362×0.34×0.45×1.2×1.36 = 90.38995
const o1 = { atk: 320, attack: 7, critEye: 7, wex: 3, critBoost: 3, normalUp: 3 };
near("trueRaw", C.trueRaw(o1), 362);
near("N3 head s0", C.hitDamage(A("n3"), "head", 0, o1, false).total, 362 * 0.34 * 0.45 * 1.2 * 1.36);

// 2) 速射 LV2贯穿弹 打前肢（觉醒，弹肉质 45），无攻击/会心技能，贯穿强化2 速射强化3
//    每段 320×0.049×0.45×1.1×1.2 = 9.31392；7 段 × 3 发 = 195.59232
const o2 = { atk: 320, pierceUp: 2, rapidUp: 3 };
near("P2 RF foreleg s1 per hit", C.hitDamage(A("p2"), "foreleg", 1, o2, true).total, 9.31392);
near("P2 RF foreleg s1 volley", C.shotDamage(A("p2"), "foreleg", 1, o2, { rf: true }).total, 9.31392 * 21);

// 3) 灭龙弹 打头（原初，弹 45 / 龙 25），无技能
//    物理 320×0.48×0.45 = 69.12；属性 80×0.25×(1+3.2) = 84 → 153.12
const o3 = { atk: 320 };
near("Dragon head s0", C.hitDamage(A("dragon"), "head", 0, o3, false).total, 153.12);

// 4) 弱点特效不在 <45 肉质上生效：头在觉醒阶段为 30
near("affinity head s1 (no WEX)", C.affinity(o1, 30), 40);

// 5) 穿甲榴弹无视肉质、不会会心：320×0.15 = 48 物理 + 火 5×1×4.2 = 21
near("Sticky2 wing s0", C.hitDamage(A("st2"), "wing", 0, { atk: 320, critEye: 7 }, false).total, 48 + 21);

// 6) 显式传入怪物：怪异克服天廻龙 头部弹肉质 45 → 与爵银龙头部同值，LV3通常弹 结果应相同
const SH = D.monsters.em072_08.MONSTER;
near("N3 head s0 (Shagaru, explicit monster)", C.hitDamage(A("n3"), "head", 0, o1, false, SH).total, 362 * 0.34 * 0.45 * 1.2 * 1.36);
// 7) 天廻龙躯干弹肉质 15：同一发弹，伤害按 15/45 缩放，且不触发弱点特效（会心 40% → ×1.16）
near("N3 torso s0 (Shagaru)", C.hitDamage(A("n3"), "torso", 0, o1, false, SH).total, 362 * 0.34 * 0.15 * 1.2 * 1.16);

process.exit(fail ? 1 : 0);
