/* 怪物目录：图鉴首页和搜索只读这里；进入怪物页时才加载 data/monsters/<id>.js。
 * tools/fetch_monster.py 会在 @@NEXT@@ 前自动加一行。 */
MHR.REGISTRY = [
  { id: "em132_05", name: "原初形态爵银龙", en: "Primordial Malzeno", ja: "原初を刻むメル・ゼナ", aliases: ["原初爵银龙", "原初的爵银龙", "原型爵银龙", "爵银龙", "malzeno"], icon: "assets/monsters/em132_05/icon.png", type: "古龙种", status: "full", updated: "2026-11-16" },
  { id: "em072_08", name: "怪异克服天廻龙", en: "Risen Shagaru Magala", ja: "天廻龍 傀異克服シャガルマガラ", aliases: ["怪异天廻龙", "天廻龙", "shagaru"], icon: "assets/monsters/em072_08/icon.png", type: "古龙种", status: "full", updated: "2026-11-16" },
  // @@NEXT@@
];
