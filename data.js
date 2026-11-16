/* MHR:SB 轻弩攻略 — 数据层
 * 每条数据带 src（来源 key，见 SOURCES）与 verified（是否经两处来源交叉确认）。
 * 未验证的数值在页面上会标「未验证」。
 */
(function (root) {
  const SOURCES = {
    mhrice:   { name: "MHRice 数据挖掘 (v16.0.0)", url: "https://mhrise.mhrice.info/monster/132_05.html" },
    kiranico: { name: "Kiranico MHRise 数据库", url: "https://mhrise.kiranico.com/data/monsters/1301934382" },
    mhrdmg:   { name: "MHR-Damage 开源伤害计算器 (stonesan101)", url: "https://github.com/stonesan101/MHR-Damage" },
    game8jp:  { name: "game8.jp 攻略", url: "https://game8.jp/mhrise/534170" },
    mhwiki:   { name: "monsterhunterwiki.org", url: "https://monsterhunterwiki.org/wiki/Primordial_Malzeno_(MHRS)" },
    fextra:   { name: "Fextralife wiki", url: "https://monsterhunterrise.wiki.fextralife.com/Primordial+Malzeno" },
    weapon:   { name: "MHRice 刻银讨铳", url: "https://mhrise.mhrice.info/weapon/LightBowgun_465.html" },
    game8lbg: { name: "game8.jp 轻弩配装", url: "https://game8.jp/mhrise/465103" },
  };

  // ---------------- 怪物 ----------------
  // 肉质顺序: [斩, 打, 弹, 火, 水, 雷, 冰, 龙, 眩晕]
  // 注意 MHRice 原表列序为 火 水 冰 雷 龙，这里已重排为常见的 火 水 雷 冰 龙。
  const HZ_COLS = ["sever", "blunt", "shot", "fire", "water", "thunder", "ice", "dragon", "stun"];
  const hz = (a) => Object.fromEntries(HZ_COLS.map((k, i) => [k, a[i]]));

  const MONSTER = {
    id: "em132_05",
    name: "原初形态爵银龙",
    nameAlt: "原初的爵银龙 · Primordial Malzeno · 原初を刻むメル・ゼナ",
    icon: "assets/icons/malzeno_primordial.png",
    type: "古龙种",
    baseHP: 4500,
    quests: [
      { id: "mr6", name: "MR6★ 复活之传说", hpMul: 12.7, atkMul: 14.7, partMul: 14, defMul: 1,
        statusMul: { paralysis: 2.6, sleep: 2.6, stun: 1.6 }, src: "mhrice", verified: true },
      { id: "hazard", name: "MR6★ 烈祸袭来：原初异音！(烈祸)", hpMul: 17, atkMul: 21, partMul: 24, defMul: 1,
        statusMul: { paralysis: 3.75, sleep: 3.75, stun: 3.1 }, src: "mhrice", verified: true },
    ],
    // 怪物 4 个肉质阶段。MHRice 只给编号，阶段含义是根据攻略描述推测的。
    states: [
      { id: 0, name: "原初", short: "原初", guess: false, color: "#c9c2b4",
        desc: "未被啮生虫侵蚀的常态。像骑士一样用翼和尾巴连击。" },
      { id: 1, name: "血气觉醒", short: "觉醒", guess: true, color: "#c2414b",
        desc: "胸口、前肢、尾巴被啮生虫覆盖并发光，开始远程攻击，尾巴攻击会让猎人进入「噬血」。头、前肢、尾巴尖变软。" },
      { id: 2, name: "血气烈昂", short: "烈昂", guess: true, color: "#e0612f",
        desc: "侵蚀加剧，会瞬移，使用最强的啮生虫招式。全身多数部位变软（躯干、后肢、翼、尾巴都提高）。" },
      { id: 3, name: "血气蚀烈", short: "蚀烈", guess: true, color: "#8f1d2c",
        desc: "体力很低时进入，并一直持续到战斗结束，几乎不停连招。造成伤害无法让它平静。" },
    ],
    parts: [
      { id: "head",     name: "头部",   en: "Head",      hz: [hz([46,48,45,15,0,0,15,25,100]), hz([55,58,30,15,0,0,20,30,100]), hz([55,58,30,15,0,0,20,30,100]), hz([55,58,30,15,0,0,20,30,100])], stagger: 400, brk: 300, note: "可破坏" },
      { id: "torso",    name: "躯干",   en: "Torso",     hz: [hz([32,30,15,10,0,0,5,15,0]),    hz([32,30,15,10,0,0,5,15,0]),    hz([45,45,25,10,0,0,5,15,0]),    hz([32,30,15,10,0,0,5,15,0])],    stagger: 350, brk: null, note: "不可破坏" },
      { id: "foreleg",  name: "前肢",   en: "Foreleg",   hz: [hz([45,40,30,10,0,0,5,20,0]),    hz([58,55,45,15,0,0,5,25,0]),    hz([58,55,45,15,0,0,5,25,0]),    hz([58,55,45,15,0,0,5,25,0])],    stagger: 250, brk: 200, note: "左右各自可破坏" },
      { id: "hindleg",  name: "后肢",   en: "Hind Leg",  hz: [hz([30,28,5,10,0,0,5,15,0]),     hz([30,28,5,10,0,0,5,15,0]),     hz([45,45,20,10,0,0,5,15,0]),    hz([30,28,5,10,0,0,5,15,0])],     stagger: 250, brk: null, note: "不可破坏" },
      { id: "wing",     name: "翼",     en: "Wing",      hz: [hz([22,22,5,10,0,0,5,15,0]),     hz([22,22,5,10,0,0,5,15,0]),     hz([35,35,15,10,0,0,5,15,0]),    hz([22,22,5,10,0,0,5,15,0])],     stagger: 320, brk: 320, note: "可破坏" },
      { id: "tail",     name: "尾巴",   en: "Tail",      hz: [hz([35,32,10,10,0,0,5,15,0]),    hz([35,32,10,10,0,0,5,15,0]),    hz([45,45,20,10,0,0,5,15,0]),    hz([35,32,10,10,0,0,5,15,0])],    stagger: 280, brk: 280, note: "只能用斩击切断（斩裂弹的刃是斩击）" },
      { id: "tailtip",  name: "尾巴尖", en: "Tail Tip",  hz: [hz([26,22,10,10,0,0,5,15,0]),    hz([50,48,40,10,0,0,5,15,0]),    hz([50,48,40,10,0,0,5,15,0]),    hz([50,48,40,10,0,0,5,15,0])],    stagger: null, brk: null, note: "侵蚀后弹肉质 10 → 40" },
    ],
    hzSrc: "mhrice+kiranico", hzVerified: true,
    weakness: [
      { el: "dragon",  name: "龙", stars: 3 },
      { el: "fire",    name: "火", stars: 2 },
      { el: "ice",     name: "冰", stars: 1 },
      { el: "water",   name: "水", stars: 0 },
      { el: "thunder", name: "雷", stars: 0 },
    ],
    // 异常耐性（基础值，未乘任务倍率）
    status: [
      { id: "poison",    name: "毒",   icon: "poison",  init: 250, inc: 150, max: 700,  dur: "15 秒，每秒 10 伤害（共 150）", ok: true },
      { id: "paralysis", name: "麻痹", icon: "para",    init: 300, inc: 100, max: 700,  dur: "7 秒", ok: true },
      { id: "sleep",     name: "睡眠", icon: "sleep",   init: 250, inc: 150, max: 700,  dur: "40 秒", ok: true },
      { id: "blast",     name: "爆破", icon: "blast",   init: 70,  inc: 30,  max: 670,  dur: "每次爆炸 100 伤害", ok: true },
      { id: "stun",      name: "眩晕", icon: "stun",    init: 300, inc: 250, max: 1200, dur: "10 秒（只有头部能累积）", ok: true },
      { id: "exhaust",   name: "减气", icon: "exhaust", init: 0,   inc: 0,   max: 0,    dur: "无效", ok: false },
    ],
    statusDecay: "所有耐性每 10 秒衰减 5 点",
    items: [
      { name: "闪光弹", ok: true, note: "血气蚀烈时无效 (game8)" },
      { name: "陷阱 / 音爆弹 / 肉", ok: false, note: "古龙种无效" },
    ],
    misc: [
      { k: "瘸腿阈值", v: "9% 体力 (MR)" },
      { k: "睡眠恢复", v: "90 秒内恢复 5% 体力" },
      { k: "怒时攻击", v: "×1.15，防御不变 (×1)" },
      { k: "血气烈昂·强制倒地", v: "部位累计伤害 500 / 750 / 900 / 1200（推测为第 1–4 次）", guess: true },
    ],
  };

  // ---------------- 阶段攻略 ----------------
  const PHASES = [
    {
      state: 0, title: "原初",
      changes: "常态。弹肉质最软的是头 (45)。",
      dodge: ["尾刺 / 后方尾刺：别站在正后方", "突进 → 翼 → 尾刺：吃翼后用翔虫受身", "双翼横扫", "滑铲咬 / 空中俯冲"],
      windows: ["招式间隙打头。通常弹、散弹、灭龙弹都优先头。"],
      ranged: "站在正面斜前方 30–45°，进入会心距离后打头。",
    },
    {
      state: 1, title: "血气觉醒",
      changes: "胸口、前肢、尾巴被啮生虫覆盖。头的弹肉质降为 30，前肢升到 45，尾巴尖升到 40。",
      dodge: ["新增远程：风压、龙属性弹、啮生虫飞弹", "尾巴攻击会附加「噬血」"],
      windows: ["改打发光的前肢 (45)。", "累积伤害打掉啮生虫部位 → 强制倒地，回到原初。"],
      ranged: "主目标从头换成前肢。贯穿弹从侧面穿过两只前肢最划算。",
    },
    {
      state: 2, title: "血气烈昂",
      changes: "瞬移，使用最强的啮生虫招式。全身变软：躯干 25、后肢 20、尾巴 20、翼 15。",
      dodge: ["升空 → 释放啮生虫波 → 瞬移到头顶爆炸", "离开地面的能量，最后一下用紧急回避", "三连光束：站在光束中间"],
      windows: ["爆炸后会跌落回「觉醒」：这是全场最大的输出窗口 (game8)。", "此阶段贯穿弹整体收益最好。"],
      ranged: "爆炸收招后马上贴近到会心距离，速射前肢或贯穿全身。",
    },
    {
      state: 3, title: "血气蚀烈",
      changes: "低体力进入，并持续到结束。造成伤害无法让它平静。",
      dodge: ["跳起 → 翼砸地：留下圆形能量场，换个干净位置", "连招结尾的地面 / 空中啮生虫新星爆发", "血之火焰：三波向外，身后也会被打到"],
      windows: ["新星后会痛苦倒地：第二个大窗口。", "闪光弹在此阶段无效。"],
      ranged: "保持中距离，别贪刀。倒地时打前肢或头。",
    },
  ];

  const BLOODBLIGHT = {
    title: "噬血状态（猎人身上）",
    points: [
      "自然回复停止，体力慢慢流失",
      "回复道具的效果降低",
      "命中怪物会按伤害量回血：持续输出就是最好的「解药」",
      "造成足够伤害即可解除 (game8)",
      "技能「狂龙症【蚀】」：被噬血侵蚀后转为强化（克服状态）",
    ],
    verified: false,
  };

  // ---------------- 弹药 ----------------
  // icon: MHRice 道具图标编号；color: 游戏内的道具颜色
  // kind: normal / pierce / spread / sticky / slicing / element / dragon / wyvernblast
  // hz: 用哪一列肉质 ("shot" / "sever" / "none" = 无视肉质)
  // hits: 每发命中段数（贯穿弹为上限 7，实际由命中部位决定）
  const COLOR = { white: "#FFFFFF", grey: "#AEAEAE", orange: "#FFB356", dragon: "#FF721F", fire: "#FF4C17",
    blue: "#5AA9FF", ice: "#9FCCFF", purple: "#A443E0", exhaust: "#486EFF", brown: "#9A7751", green: "#2CE095" };

  const AMMO = [
    { id: "n1", name: "LV1通常弹", kind: "normal", mv: 16, hits: 1, hz: "shot", icon: "014", color: COLOR.white, rf: { n: 3, mv: 11.2 } },
    { id: "n2", name: "LV2通常弹", kind: "normal", mv: 22, hits: 1, hz: "shot", icon: "014", color: COLOR.white, rf: { n: 3, mv: 15.4 } },
    { id: "n3", name: "LV3通常弹", kind: "normal", mv: 34, hits: 1, hz: "shot", icon: "014", color: COLOR.white },
    { id: "p1", name: "LV1贯穿弹", kind: "pierce", mv: 7, hits: 7, hz: "shot", icon: "016", color: COLOR.blue, rf: { n: 3, mv: 4.9 } },
    { id: "p2", name: "LV2贯穿弹", kind: "pierce", mv: 7, hits: 7, hz: "shot", icon: "016", color: COLOR.blue, rf: { n: 3, mv: 4.9 } },
    { id: "p3", name: "LV3贯穿弹", kind: "pierce", mv: 9, hits: 7, hz: "shot", icon: "016", color: COLOR.blue },
    { id: "s1", name: "LV1散弹", kind: "spread", mv: 7, hits: 3, hz: "shot", icon: "015", color: COLOR.grey, rf: { n: 3, mv: 4.9 } },
    { id: "s2", name: "LV2散弹", kind: "spread", mv: 7, hits: 4, hz: "shot", icon: "015", color: COLOR.grey, rf: { n: 3, mv: 4.9 } },
    { id: "s3", name: "LV3散弹", kind: "spread", mv: 10, hits: 5, hz: "shot", icon: "015", color: COLOR.grey },
    { id: "st2", name: "LV2穿甲榴弹", kind: "sticky", mv: 15, hits: 1, hz: "none", ele: "fire", eleVal: 5, icon: "017", color: COLOR.orange, note: "爆炸无视肉质、不会会心；打头可累积眩晕" },
    { id: "st3", name: "LV3穿甲榴弹", kind: "sticky", mv: 19, hits: 1, hz: "none", ele: "fire", eleVal: 5, icon: "017", color: COLOR.orange, note: "爆炸无视肉质、不会会心" },
    { id: "slice", name: "斩裂弹", kind: "slicing", mv: 14, hits: 3, hz: "sever", icon: "016", color: COLOR.white, rf: { n: 2, mv: 9.8, hitsPer: 3 }, note: "3 片刃用斩击肉质计算，可以切尾" },
    { id: "fire", name: "火炎弹", kind: "element", mv: 16, hits: 1, hz: "shot", ele: "fire", eleVal: 40, icon: "014", color: COLOR.fire, rf: { n: 3, mv: 11.2, eleVal: 20 } },
    { id: "pfire", name: "贯穿火炎弹", kind: "element-pierce", mv: 10, hits: 7, hz: "shot", ele: "fire", eleVal: 22, icon: "016", color: COLOR.fire, rf: { n: 2, mv: 7, eleVal: 11 } },
    { id: "ice", name: "冰结弹", kind: "element", mv: 16, hits: 1, hz: "shot", ele: "ice", eleVal: 40, icon: "014", color: COLOR.ice, rf: { n: 3, mv: 11.2, eleVal: 20 } },
    { id: "pice", name: "贯穿冰结弹", kind: "element-pierce", mv: 10, hits: 7, hz: "shot", ele: "ice", eleVal: 22, icon: "016", color: COLOR.ice, rf: { n: 2, mv: 7, eleVal: 11 } },
    { id: "thunder", name: "电击弹", kind: "element", mv: 16, hits: 1, hz: "shot", ele: "thunder", eleVal: 40, icon: "014", color: "#FFFF70", rf: { n: 3, mv: 11.2, eleVal: 20 }, note: "雷肉质全身 0：对这只龙基本无用" },
    { id: "dragon", name: "灭龙弹", kind: "dragon", mv: 48, hits: 1, hz: "shot", ele: "dragon", eleVal: 80, icon: "014", color: COLOR.dragon, rf: { n: 2, mv: 33.6, eleVal: 40 } },
    { id: "pdragon", name: "贯穿灭龙弹", kind: "element-pierce", mv: 20, hits: 7, hz: "shot", ele: "dragon", eleVal: 44, icon: "016", color: COLOR.dragon, rf: { n: 2, mv: 14, eleVal: 22 } },
    { id: "wb", name: "起爆龙弹 (L)", kind: "wyvernblast", mv: 49, hits: 1, hz: "none", ele: "fire", eleVal: 7, icon: "018", color: COLOR.brown, noCrit: true, note: "地雷式；无视肉质、不会会心" },
  ];
  const AMMO_SRC = "mhrdmg";

  // 刻银讨铳 可用弹药 (MHRice LightBowgun_465)
  const WEAPON = {
    name: "刻银讨铳", en: "Silver Shooter", atk: 320, aff: 0, deviation: "左右·大", reload: "稍慢", recoil: "中",
    ammo: { n1: { cap: 5 }, p2: { cap: 6, rf: true }, p3: { cap: 5 }, st2: { cap: 2 }, dragon: { cap: 2, rf: true },
            pdragon: { cap: 2, rf: true }, slice: { cap: 2, rf: true } },
    src: "weapon", verified: true,
  };

  // ---------------- 技能 ----------------
  const SKILLS = {
    attack:   { name: "攻击", max: 7, flat: [0,3,6,9,7,8,9,10], pct: [0,0,0,0,5,6,8,10] },
    critEye:  { name: "看破", max: 7, aff: [0,5,10,15,20,25,30,40] },
    wex:      { name: "弱点特效", max: 3, aff: [0,15,30,50], note: "肉质 ≥45 才生效" },
    critBoost:{ name: "超会心", max: 3, mult: [1.25,1.30,1.35,1.40] },
    normalUp: { name: "通常弹・连射箭强化", max: 3, mult: [1,1.05,1.10,1.20] },
    pierceUp: { name: "贯穿弹・贯穿箭强化", max: 3, mult: [1,1.05,1.10,1.20], note: "只加物理贯穿弹，不加属性贯穿弹" },
    spreadUp: { name: "散弹・扩散箭强化", max: 3, mult: [1,1.05,1.10,1.20] },
    rapidUp:  { name: "速射强化", max: 3, mult: [1,1.05,1.10,1.20] },
    dragonAtk:{ name: "龙属性攻击强化", max: 5, flat: [0,2,3,4,4,4], pct: [0,0,0,5,10,20] },
    fireAtk:  { name: "火属性攻击强化", max: 5, flat: [0,2,3,4,4,4], pct: [0,0,0,5,10,20] },
    iceAtk:   { name: "冰属性攻击强化", max: 5, flat: [0,2,3,4,4,4], pct: [0,0,0,5,10,20] },
    critEle:  { name: "会心击【属性】", max: 3, mult: [1,1.05,1.10,1.15] },
    bloodlust:{ name: "狂龙症【蚀】(克服)", max: 3, flat: [0,10,15,20], ele: [0,5,7,10], aff: [0,20,25,25] },
  };
  const SWITCH = {
    critFire: { name: "会心射击 (Critical Firepower)", normal: 1.3, spread: 1.2, pierce: 1.1, note: "会心距离变窄、后坐力变大" },
  };

  // ---------------- 推荐配装 ----------------
  const BUILDS = [
    {
      id: "pierce", short: "物理贯穿", title: "刻银讨铳 · 物理贯穿", weapon: "刻银讨铳（原初形态爵银龙轻弩）",
      stats: "攻击 320 · 会心 0% · 速射：LV2贯穿弹 / 灭龙弹 / 贯穿灭龙弹 / 斩裂弹",
      skills: ["攻击 7", "看破 7", "弱点特效 2", "超会心 3", "贯穿弹・贯穿箭强化 2", "速射强化 3", "弹丸节约 3", "精神抖擞 3", "伏魔耗命 3", "连击 3", "装填速度 3", "减轻后坐力 3", "零件改造 1", "因祸得福 1", "狂龙症【蚀】1"],
      why: "game8 推荐的通用轻弩配装。速射 LV2贯穿弹 是主力。对这只龙有个问题：翼和后肢的弹肉质只有 5，贯穿弹的段数会浪费在硬部位上，所以要从侧面打穿前肢，或在「烈昂」全身变软时打。",
      preset: { atk: 320, aff: 0, attack: 7, critEye: 7, wex: 2, critBoost: 3, pierceUp: 2, rapidUp: 3, extraAff: 30, extraAtk: 0 },
      src: "game8lbg",
    },
    {
      id: "dragon", short: "速射灭龙", title: "刻银讨铳 · 速射灭龙弹", weapon: "同一把刻银讨铳",
      stats: "灭龙弹速射 2 发：头的龙肉质 25–30，前肢 20–25",
      skills: ["龙属性攻击强化 5", "会心击【属性】3", "速射强化 3", "攻击 / 看破 补满"],
      why: "龙属性是唯一有效的属性 (★3)。灭龙弹的物理动作值本身就有 48，同时吃物理和属性。灭龙弹只能带 2 发，适合在大硬直窗口打出去。",
      preset: { atk: 320, aff: 0, attack: 4, critEye: 4, wex: 0, critBoost: 0, rapidUp: 3, dragonAtk: 5, critEle: 3, extraAff: 30, extraAtk: 0 },
      src: "推测（伤害依据 MHR-Damage 公式）", guess: true,
    },
    {
      id: "normal", short: "通常弹", title: "通常弹 / 散弹 打弱点", weapon: "任意速射 LV2通常弹 的高攻轻弩",
      stats: "原初阶段打头 (45)，侵蚀后打前肢 (45)",
      skills: ["攻击 7", "看破 7", "弱点特效 3", "超会心 3", "通常弹・连射箭强化 3", "速射强化 3"],
      why: "单点命中，所有伤害都落在 45 的弱点上，弱点特效能吃满。打法简单，对瞄准要求高。",
      preset: { atk: 320, aff: 0, attack: 7, critEye: 7, wex: 3, critBoost: 3, normalUp: 3, rapidUp: 3, extraAff: 0, extraAtk: 0 },
      src: "推测", guess: true,
    },
  ];

  // 贯穿弹的穿透路径（估算）：7 段分别打到哪些部位
  const PIERCE_PATHS = [
    { id: "front", name: "正面：头 → 躯干 → 尾巴", hits: { head: 2, torso: 3, tail: 2 } },
    { id: "side",  name: "侧面：前肢 → 躯干 → 前肢", hits: { foreleg: 3, torso: 2, wing: 2 } },
    { id: "back",  name: "背面：尾巴尖 → 尾巴 → 躯干", hits: { tailtip: 2, tail: 3, torso: 2 } },
    { id: "single", name: "理想：7 段全打在选中部位", hits: null },
  ];


  // ---------------- YouTube 视频 ----------------
  // star: 先看这几个；lang: 语言
  const VIDEOS = [
    { group: "先认识它", items: [
      { id: "l3z8oj9koPo", t: "官方预告：原初形态爵银龙", ch: "Monster Hunter (CAPCOM)", len: "1:15", lang: "英", star: true, why: "1 分钟看清它的样子和血气状态" },
      { id: "7DbTIIiLjTI", t: "原初爵银龙 登场动画", ch: "MonsterSlayer Squad", len: "1:01", lang: "—", why: "第一次见面的过场" },
    ]},
    { group: "招式 / 怎么躲", items: [
      { id: "OgOdMS7i9PU", t: "原初メルゼナ 确定行动 + 躲法（弓视角讲解）", ch: "時雨ミト", len: "4:26", lang: "日", star: true, why: "远程武器视角，短，讲长连招怎么躲" },
      { id: "ETCJQDX3iuc", t: "原初メルゼナ 极恶连招，背下来就能躲", ch: "駆矢/カヤちゃんねる", len: "6:31", lang: "日", why: "专讲连招顺序" },
      { id: "ZCBhypIO7QQ", t: "Primordial Malzeno moveset breakdown", ch: "Just_a_guy", len: "12:06", lang: "英", why: "逐招拆解" },
    ]},
    { group: "轻弩实战 / 配装", items: [
      { id: "2zttEwdQdVk", t: "原初爵银轻弩配装 · 最强贯通速射 + 烈祸实战 5'27", ch: "綠茶 GameLab", len: "12:20", lang: "中", star: true, why: "中文，正好讲刻银讨铳" },
      { id: "E9pdzQlPu-E", t: "原初メルゼナ 超简单打法，贯通速射轻弩也能轻松过", ch: "とかげーむ ch.", len: "18:58", lang: "日", why: "新手向，31 万播放" },
      { id: "5bQ4IHByW1c", t: "烈祸 原初メルゼナ 2'29 轻弩 贯通灭龙弹 无盟友", ch: "SS 6987", len: "3:47", lang: "—", why: "贯通灭龙弹的实战上限" },
      { id: "p26CwwcS-Dk", t: "原初を刻むメル・ゼナ 单人 4'13 轻弩", ch: "チョコ(choco)", len: "5:33", lang: "—", why: "看高手站位和速射时机" },
      { id: "91my1wCvE-I", t: "原初爵银龙 4'14 贯通弹速射 轻弩", ch: "DoWhatAr Ch.", len: "5:27", lang: "粤", why: "贯通速射完整一场" },
      { id: "ZsDaff_2a1k", t: "刻銀の討銃 强不强？与 ヴァイス 比较 + 配装", ch: "皆で一緒にモンハンライフ", len: "5:58", lang: "日", why: "武器选择" },
      { id: "8MBYOJVF9Sc", t: "最终版本 散弹速射轻弩 原初メルゼナ 3 分", ch: "やぎこ", len: "8:08", lang: "日", why: "散弹流派" },
      { id: "mcVpC19hOTc", t: "Final Update Pierce LBG build vs Primordial Malzeno", ch: "Taneomi", len: "3:33", lang: "英", why: "英文配装" },
      { id: "6CKVe4YTrLQ", t: "Hazard Primordial Malzeno 6:40 LBG", ch: "Hawa", len: "7:18", lang: "—", why: "烈祸难度的轻弩打法" },
    ]},
  ];


  // ---------------- v2：阶段页内容（ADHD 版：固定 4 块，每行短句） ----------------
  // punish: "yes" = 之后能打 / "no" = 别贪 / "?" = 看情况（资料未写）
  const STATE_PAGES = [
    {
      state: 0, title: "原初", img: "assets/img/states/normal.jpg",
      imgCap: "原初状态：银白身体 + 紫色翼膜（Steam 官方截图）",
      key: ["弱点是**头 (45)**", "交叉斩要**往它身前**闪", "被冲撞→**翔虫受身往侧边**"],
      see: ["银白身体、**紫色翼膜**", "身上**没有红光**"],
      dodge: ["**交叉斩**：向前闪，别往侧后", "**冲撞→尾刺**：吃冲撞后侧向受身", "**尾扫 / 尾刺**分不清 → 多滚一次"],
      hit: ["招式结束后**打头**", "灭龙弹也打头（龙 25）"],
      stand: ["正面**斜前 30–45°**", "别站正后方"],
      moves: [
        { n: "翼盾冲撞 → 尾刺", yi: true, tell: "翼像盾一样向前冲，范围宽", dodge: "被撞到就**翔虫受身往侧边**，追击的尾刺会落空", punish: "?", blood: false, src: "game8jp" },
        { n: "翼刺 → 横扫", yi: true, tell: "单翼往前刺，接着横扫", dodge: "**侧闪**刺击；近就贴上去，远就拉开", punish: "yes", blood: false, src: "game8jp" },
        { n: "尾扫", yi: true, tell: "起手和尾刺很像", dodge: "近 → 钻到身下；远 → 走开；**多滚一次**保险", punish: "?", blood: false, src: "game8jp" },
        { n: "双翼交叉斩", yi: true, tell: "两翼交叉斩两次，左右后都很宽", dodge: "**向前（朝怪物）**闪；往侧面或后面会被打到", punish: "yes", blood: false, src: "game8jp" },
      ],
    },
    {
      state: 1, title: "血气觉醒", img: "assets/img/states/bloodening.jpg",
      imgCap: "血气觉醒：胸口与两只前肢附着红色啮生虫（YouTube 截图）",
      key: ["改打**前肢 (45)**", "尾巴攻击附带**噬血**", "打够伤害 → **大倒地**，回到原初"],
      see: ["**胸口、前肢、尾巴**发红光", "周围飘**红色粒子**"],
      dodge: ["新增**远程**：火球、吐息、风刃", "**尾一闪**：最强尾击 + 噬血 20 秒", "吐息留下**龙卷**，别站里面"],
      hit: ["打**发光的前肢**", "尾巴尖也变软（40）", "累积伤害 → 强制倒地"],
      stand: ["站**侧面**", "贯穿弹**穿过两只前肢**"],
      moves: [
        { n: "超火球", yi: true, tell: "龙属性大火球", dodge: "横向翻滚；要挡需要**强化防御**", punish: "?", blood: false, src: "mhrice" },
        { n: "蓄力吐息", yi: true, tell: "蓄力后吐出，留下持续区域和龙卷", dodge: "离开区域，**别站龙卷里**", punish: "?", blood: false, src: "mhrice" },
        { n: "火焰放射 / 乱舞放射", yi: true, tell: "龙属性光束扫射", dodge: "往光束扫来方向的**外侧**走", punish: "?", blood: false, src: "mhrice" },
        { n: "血镰", yi: true, tell: "血红色镰刃", dodge: "侧闪（龙属性异常 20 秒）", punish: "?", blood: false, src: "mhrice" },
        { n: "啮生虫风刃", yi: true, tell: "飞出风刃", dodge: "侧闪", punish: "?", blood: true, src: "mhrice" },
        { n: "尾一闪", yi: true, tell: "最强单发尾击（110 伤害）", dodge: "**远离尾巴**", punish: "?", blood: true, src: "mhrice" },
      ],
    },
    {
      state: 2, title: "血气烈昂", img: "assets/img/states/bloodrage.jpg",
      imgCap: "烈昂大招：升空后地面落下啮生虫陨石（YouTube 截图）", imgGuess: true,
      key: ["大招最后**紧急回避**", "爆炸后**跌落倒地** = 最大输出窗口", "全身变软 → **贯穿弹**最赚"],
      see: ["会**瞬移**", "红光更强，招式更凶"],
      dodge: ["**大招**：升空 → 陨石 + 地面冲击 → 瞬移头顶 → **大爆炸**", "陨石阶段**一直跑**", "最后爆炸**紧急回避**（不可防）"],
      hit: ["爆炸后它会**跌落**", "全身肉质变软", "速射**前肢**或贯穿全身"],
      stand: ["大招时离开地面能量", "跌落后马上**贴近到会心距离**"],
      moves: [
        { n: "大招：陨石 → 大爆炸", yi: true, tell: "飞上天，地面落下啮生虫陨石和冲击波，然后瞬移到头顶", dodge: "陨石阶段**一直跑动**；最后爆炸**紧急回避**（150 伤害，不可防御）", punish: "yes", blood: true, src: "mhrice" },
        { n: "追踪啮生虫", yi: true, guess: true, tell: "啮生虫会追着人飞", dodge: "横向跑动拉开", punish: "?", blood: true, src: "mhrice" },
        { n: "范围吸血", yi: true, guess: true, tell: "地面冲击波向外扩散", dodge: "离开范围；要挡需**强化防御**", punish: "?", blood: true, src: "mhrice" },
        { n: "多重激光", yi: true, guess: true, tell: "三道光束", dodge: "**站光束之间**，不可防御", punish: "?", blood: true, src: "mhrice" },
      ],
    },
    {
      state: 3, title: "血气蚀烈", img: "assets/img/states/bloodlust.jpg",
      imgCap: "血气蚀烈：翼与全身发出橙红光（monsterhunterwiki 截图）",
      key: ["连招不停，**别贪**", "新星爆发后**痛苦挣扎** = 输出窗口", "**闪光弹无效**"],
      see: ["体力很低时进入，**不会再退出**", "**翼发出橙红光**"],
      dodge: ["**起跳 → 双翼砸地**：地上出现能量圈", "→ 去**没有能量**的位置", "连招结尾：地面 / 空中**新星爆发**"],
      hit: ["新星后它会**痛苦挣扎**", "这时打**前肢或头**"],
      stand: ["保持**中距离**", "连招中只躲不打"],
      moves: [
        { n: "起跳 → 双翼砸地", yi: true, tell: "起跳时地上出现圆形能量场", dodge: "移到**没有能量**的地方；进了圈就回避砸地", punish: "?", blood: true, src: "game8jp" },
        { n: "新星爆发", yi: true, tell: "长连招的结尾，地面或空中爆发", dodge: "提前拉开距离", punish: "yes", blood: true, src: "mhwiki" },
        { n: "血之火焰", yi: true, tell: "向外三波火焰，身后也会被打到", dodge: "往远处跑，别站身后", punish: "?", blood: false, src: "fextra" },
      ],
    },
  ];

  const FOLLOWERS = {
    quest: { name: "灭净制裁", en: "Harbinger of Destruction", rank: "MR6★ 紧急任务（MR10 解锁）", giver: "提督加雷亚斯", fixed: "菲奥莱娜（Fiorayne）· 片手剑", src: "https://mhrise.mhrice.info/quest/405602.html" },
    pick: [
      { n: "Hinoa", ja: "ヒノエ", w: "狩猎笛", role: "回复 · 攻防强化 · 生命粉尘", why: "噬血会让回复变差，有人帮你奶最省心", tier: "S" },
      { n: "Utsushi", ja: "ウツシ教官", w: "狩猎笛", role: "攻击 / 属性攻击强化 · 属性异常无效", why: "game8 评价和弩很搭；灭龙弹吃属性强化", tier: "S" },
    ],
    alt: [
      { n: "Minoto", ja: "ミノト", w: "狩猎笛", role: "守护 · 耐力 · 音障", tier: "A" },
      { n: "Luchika", ja: "ルーチカ", w: "重弩", role: "黏着弹 / 状态弹，不回复", tier: "A" },
    ],
    avoid: [
      { n: "Rondine", why: "她的陷阱对这只龙无效（落穴、麻痹陷阱、音爆都没用）" },
      { n: "3 个狩猎笛", why: "game8：三笛一起配合不好" },
    ],
    note: "游戏内中文名只确认了菲奥莱娜、提督加雷亚斯；其他用日文 / 英文名。",
    tierSrc: "https://game8.jp/mhrise/454177",
  };

  // 侧边栏结构 + 线性顺序（上一页 / 下一页）
  const PAGES = [
    { id: "home", t: "速读", icon: "⚡" },
    { group: "打法", items: [
      { id: "map", t: "打哪里" },
      { id: "ammo", t: "用什么弹" },
      { id: "phase", t: "阶段与招式", children: [0, 1, 2, 3] },
    ]},
    { group: "原理", items: [{ id: "formula", t: "伤害怎么算" }] },
    { group: "准备", items: [
      { id: "builds", t: "推荐配装" },
      { id: "followers", t: "盟友" },
      { id: "status", t: "异常与道具" },
    ]},
    { id: "videos", t: "视频", icon: "▶" },
  ];

  const UNVERIFIED = [
    "肉质阶段 1–3 分别对应哪个状态：MHRice 只给编号，本页按攻略描述推测（觉醒 / 烈昂 / 蚀烈）。",
    "属性弹公式中的 ×(1 + 真实攻击/100) 项：取自 MHR-Damage 源码，没有找到第二个来源。",
    "会心距离以外的伤害衰减：没有找到可靠数值，所以做成手动输入（默认 1.0 = 在会心距离内）。",
    "速射强化是否同时提高属性伤害：本页按同时提高计算。",
    "任务的异常耐性倍率：取自 MHRice 任务表，列名对应没有完全确认。",
    "异常弹每发的累积值：数据不一致，本页不计算需要几发。",
    "噬血状态的流血速度、吸血比例：没有找到数值。",
    "推荐配装中标「推测」的两套：按公式推演，不是攻略站给出的配装。",
    "招式的中文名大多是按日文数据名意译（标「译」），不是游戏内官方译名。",
    "烈昂阶段的招式归属：MHRice 只标了【強】，按攻略描述推测属于烈昂。",
    "盟友推荐（Hinoa + Utsushi）：依据 game8 的通用盟友评级推导，没有找到针对这只龙的共识。",
  ];

  const DATA = { SOURCES, MONSTER, PHASES, BLOODBLIGHT, AMMO, AMMO_SRC, WEAPON, SKILLS, SWITCH, BUILDS, PIERCE_PATHS, UNVERIFIED, VIDEOS, STATE_PAGES, FOLLOWERS, PAGES };
  if (typeof module !== "undefined" && module.exports) module.exports = DATA;
  else root.MHR = DATA;
})(typeof window !== "undefined" ? window : globalThis);
