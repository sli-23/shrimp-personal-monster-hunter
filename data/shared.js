/* 共享数据：弹药、技能、武器、通用来源。每只怪物的数据在 data/monsters/<id>.js */
(function (root) {
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

  // 武器（按 id）。怪物文件里用 weapon: "silver" 引用。
  const WEAPONS = {
    silver: {
      "name": "刻银讨铳",
      "en": "Silver Shooter",
      "atk": 320,
      "aff": 0,
      "deviation": "左右·大",
      "reload": "稍慢",
      "recoil": "中",
      "ammo": {
        "n1": {
          "cap": 5
        },
        "p2": {
          "cap": 6,
          "rf": true
        },
        "p3": {
          "cap": 5
        },
        "st2": {
          "cap": 2
        },
        "dragon": {
          "cap": 2,
          "rf": true
        },
        "pdragon": {
          "cap": 2,
          "rf": true
        },
        "slice": {
          "cap": 2,
          "rf": true
        }
      },
      "src": "weapon",
      "verified": true
    },
  };
  const SOURCES = {
    mhrice:   { name: "MHRice 数据挖掘 (v16.0.0)", url: "https://mhrise.mhrice.info/" },
    kiranico: { name: "Kiranico MHRise 数据库", url: "https://mhrise.kiranico.com/" },
    mhrdmg:   { name: "MHR-Damage 开源伤害计算器 (stonesan101)", url: "https://github.com/stonesan101/MHR-Damage" },
    game8lbg: { name: "game8.jp 轻弩配装", url: "https://game8.jp/mhrise/465103" },
    fandomSwitch: { name: "Fandom：MHRS Switch Skills", url: "https://monsterhunter.fandom.com/wiki/MHRS:_Switch_Skills" },
  };
  const UNVERIFIED = [
    "属性弹公式中的 ×(1 + 真实攻击/100) 项：取自 MHR-Damage 源码，没有找到第二个来源。",
    "会心距离以外的伤害衰减：没有找到可靠数值，所以做成手动输入（默认 1.0 = 在会心距离内）。",
    "速射强化是否同时提高属性伤害：本页按同时提高计算。",
    "任务的异常耐性倍率：取自 MHRice 任务表，列名对应没有完全确认。",
    "异常弹每发的累积值：数据不一致，本页不计算需要几发。",
  ];
  const monsters = {};
  const MHR = { COLOR, AMMO, AMMO_SRC, SKILLS, SWITCH, WEAPONS, SOURCES, UNVERIFIED, monsters, REGISTRY: [],
    registerMonster(b) { monsters[b.id] = b; return b; } };
  root.MHR = MHR;
  if (typeof module !== "undefined" && module.exports) module.exports = MHR;
})(typeof window !== "undefined" ? window : globalThis);
