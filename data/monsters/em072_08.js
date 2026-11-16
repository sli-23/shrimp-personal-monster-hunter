/* 怪异克服天廻龙 · Risen Shagaru Magala — 数据由 tools/fetch_monster.py 从 MHRice 生成，攻略内容手工整理 */
MHR.registerMonster({
  "id": "em072_08",
  "status": "full",
  "updated": "2026-11-16",
  "MONSTER": {
    "id": "em072_08",
    "mhrice": "072_08",
    "name": "怪异克服天廻龙",
    "nameAlt": "Risen Shagaru Magala · 天廻龍 傀異克服シャガルマガラ",
    "en": "Risen Shagaru Magala",
    "ja": "天廻龍 傀異克服シャガルマガラ",
    "icon": "assets/monsters/em072_08/icon.png",
    "baseHP": 4500,
    "states": [
      {
        "id": 0,
        "name": "肉质阶段 0",
        "short": "阶段0",
        "guess": false,
        "color": "#7a8bb0",
        "desc": "大部分时间的肉质。"
      },
      {
        "id": 1,
        "name": "肉质阶段 1（翼足变软）",
        "short": "阶段1",
        "guess": true,
        "color": "#e0612f",
        "desc": "只有翼足变软（弹 20 → 25）。触发条件未知。"
      }
    ],
    "parts": [
      {
        "id": "head",
        "name": "头部",
        "en": "Head",
        "hz": [
          {
            "sever": 65,
            "blunt": 60,
            "shot": 45,
            "fire": 20,
            "water": 0,
            "thunder": 15,
            "ice": 5,
            "dragon": 25,
            "stun": 100
          },
          {
            "sever": 65,
            "blunt": 60,
            "shot": 45,
            "fire": 20,
            "water": 0,
            "thunder": 15,
            "ice": 5,
            "dragon": 25,
            "stun": 100
          }
        ],
        "stagger": 400,
        "brk": 600,
        "note": "唯一的弱点；愤怒时打头够伤害会大倒地"
      },
      {
        "id": "neck",
        "name": "颈部",
        "en": "Neck",
        "hz": [
          {
            "sever": 45,
            "blunt": 45,
            "shot": 20,
            "fire": 15,
            "water": 0,
            "thunder": 10,
            "ice": 5,
            "dragon": 20,
            "stun": 0
          },
          {
            "sever": 45,
            "blunt": 45,
            "shot": 20,
            "fire": 15,
            "water": 0,
            "thunder": 10,
            "ice": 5,
            "dragon": 20,
            "stun": 0
          }
        ],
        "stagger": null,
        "brk": null,
        "note": ""
      },
      {
        "id": "torso",
        "name": "躯干",
        "en": "Torso",
        "hz": [
          {
            "sever": 25,
            "blunt": 25,
            "shot": 15,
            "fire": 10,
            "water": 0,
            "thunder": 5,
            "ice": 5,
            "dragon": 10,
            "stun": 0
          },
          {
            "sever": 25,
            "blunt": 25,
            "shot": 15,
            "fire": 10,
            "water": 0,
            "thunder": 5,
            "ice": 5,
            "dragon": 10,
            "stun": 0
          }
        ],
        "stagger": 440,
        "brk": null,
        "note": ""
      },
      {
        "id": "wingarm",
        "name": "翼足",
        "en": "Wingarm",
        "hz": [
          {
            "sever": 22,
            "blunt": 25,
            "shot": 20,
            "fire": 25,
            "water": 0,
            "thunder": 15,
            "ice": 5,
            "dragon": 30,
            "stun": 0
          },
          {
            "sever": 36,
            "blunt": 36,
            "shot": 25,
            "fire": 15,
            "water": 0,
            "thunder": 10,
            "ice": 5,
            "dragon": 20,
            "stun": 0
          }
        ],
        "stagger": 220,
        "brk": 220,
        "note": ""
      },
      {
        "id": "foreleg",
        "name": "前肢",
        "en": "Foreleg",
        "hz": [
          {
            "sever": 40,
            "blunt": 40,
            "shot": 30,
            "fire": 10,
            "water": 0,
            "thunder": 5,
            "ice": 5,
            "dragon": 10,
            "stun": 0
          },
          {
            "sever": 40,
            "blunt": 40,
            "shot": 30,
            "fire": 10,
            "water": 0,
            "thunder": 5,
            "ice": 5,
            "dragon": 10,
            "stun": 0
          }
        ],
        "stagger": 250,
        "brk": 450,
        "note": ""
      },
      {
        "id": "hindleg",
        "name": "后肢",
        "en": "Hind Leg",
        "hz": [
          {
            "sever": 36,
            "blunt": 36,
            "shot": 30,
            "fire": 10,
            "water": 0,
            "thunder": 5,
            "ice": 5,
            "dragon": 10,
            "stun": 0
          },
          {
            "sever": 36,
            "blunt": 36,
            "shot": 30,
            "fire": 10,
            "water": 0,
            "thunder": 5,
            "ice": 5,
            "dragon": 10,
            "stun": 0
          }
        ],
        "stagger": 275,
        "brk": null,
        "note": ""
      },
      {
        "id": "wing",
        "name": "翼",
        "en": "Wing",
        "hz": [
          {
            "sever": 26,
            "blunt": 26,
            "shot": 10,
            "fire": 10,
            "water": 0,
            "thunder": 10,
            "ice": 5,
            "dragon": 15,
            "stun": 0
          },
          {
            "sever": 26,
            "blunt": 26,
            "shot": 10,
            "fire": 10,
            "water": 0,
            "thunder": 10,
            "ice": 5,
            "dragon": 15,
            "stun": 0
          }
        ],
        "stagger": 385,
        "brk": null,
        "note": ""
      },
      {
        "id": "tail",
        "name": "尾巴",
        "en": "Tail",
        "hz": [
          {
            "sever": 36,
            "blunt": 36,
            "shot": 25,
            "fire": 10,
            "water": 0,
            "thunder": 10,
            "ice": 5,
            "dragon": 15,
            "stun": 0
          },
          {
            "sever": 36,
            "blunt": 36,
            "shot": 25,
            "fire": 10,
            "water": 0,
            "thunder": 10,
            "ice": 5,
            "dragon": 15,
            "stun": 0
          }
        ],
        "stagger": 360,
        "brk": null,
        "note": "斩击可切断（400）；轻弩用斩裂弹"
      }
    ],
    "status": [
      {
        "id": "poison",
        "name": "毒",
        "icon": "poison",
        "init": 80,
        "inc": 70,
        "max": 290,
        "dur": "15 秒",
        "dmg": "10 / 1 sec",
        "ok": true
      },
      {
        "id": "paralysis",
        "name": "麻痹",
        "icon": "para",
        "init": 300,
        "inc": 100,
        "max": 700,
        "dur": "7 秒",
        "dmg": "0 / 0 sec",
        "ok": true
      },
      {
        "id": "sleep",
        "name": "睡眠",
        "icon": "sleep",
        "init": 250,
        "inc": 150,
        "max": 700,
        "dur": "40 秒",
        "dmg": "0 / 0 sec",
        "ok": true
      },
      {
        "id": "blast",
        "name": "爆破",
        "icon": "blast",
        "init": 120,
        "inc": 60,
        "max": 720,
        "dur": "",
        "dmg": "0 / 0 sec",
        "ok": true
      },
      {
        "id": "stun",
        "name": "眩晕",
        "icon": "stun",
        "init": 150,
        "inc": 120,
        "max": 630,
        "dur": "10 秒",
        "dmg": "0 / 0 sec",
        "ok": true
      },
      {
        "id": "exhaust",
        "name": "减气",
        "icon": "exhaust",
        "init": 0,
        "inc": 0,
        "max": 0,
        "dur": "无效",
        "dmg": "0 / 0 sec",
        "ok": false
      }
    ],
    "quests": [
      {
        "id": "q0",
        "name": "MR6★ 怪异克服：天廻龙",
        "hpMul": 16,
        "atkMul": 18,
        "partMul": 15.5,
        "defMul": 1,
        "statusMul": {
          "stun": 1.7,
          "paralysis": 2.8,
          "sleep": 1
        },
        "src": "mhrice",
        "verified": false
      }
    ],
    "weakness": [
      {
        "el": "dragon",
        "name": "龙",
        "stars": 3
      },
      {
        "el": "fire",
        "name": "火",
        "stars": 2
      },
      {
        "el": "thunder",
        "name": "雷",
        "stars": 2
      },
      {
        "el": "ice",
        "name": "冰",
        "stars": 1
      },
      {
        "el": "water",
        "name": "水",
        "stars": 0
      }
    ],
    "desc": "Description Risen Shagaru Magala are elder dragons that have found a way to overcome their affliction. By suppressing the Qurio virus, they have gained great strength and new abilities. They release larger quantities of the Frenzy virus, resulting in viral explosions with increased radius. Anything that gets in their way will fall prey to their powerful wingarms. When their anger reaches its peak, they'll enter into their Risen state and their body will begin to glow. 带有“怪异克服”之名的天廻龙。 因为克服了啮生虫引发的发狂，而获得了强大力量。 受此影响，它的体表出现了诡异的纹路。它能够释 放出更多的狂龙病毒，用大范围的病毒爆炸吞没周 围，还会用翼足来蹂躏那些被它玩弄的猎物。当古 龙之怒达到最大时，其体表会发光，其形",
    "type": "古龙种",
    "statusDecay": "所有耐性每 10 秒衰减 5 点",
    "items": [
      {
        "name": "闪光弹",
        "ok": true,
        "note": "有效约 10 秒 (monsterhunterwiki)"
      },
      {
        "name": "陷阱",
        "ok": false,
        "note": "古龙种无效"
      }
    ],
    "misc": [
      {
        "k": "毒",
        "v": "首次只要 80，最高 290：毒弹非常划算"
      },
      {
        "k": "怪气脉动时打够伤害",
        "v": "强制倒地并解除该状态",
        "guess": true
      }
    ],
    "special": {
      "title": "狂龙症（猎人身上）",
      "icon": "stun",
      "verified": false,
      "points": [
        "被它打中会累积血条旁边的**狂龙病槽**，满了就发病：**自然回复停止**",
        "发病后**持续命中怪物**就能克服，克服后**会心率上升**",
        "吃**净化果实（解除系）**能减少槽",
        "技能「狂龙症【蚀】」能把发病变成强化（被感染时攻击上升但慢慢扣血）"
      ]
    }
  },
  "MAP": {
    "render": "assets/monsters/em072_08/render.png",
    "aspect": "1247/827",
    "spots": [
      [
        "head",
        30,
        45
      ],
      [
        "neck",
        39,
        64
      ],
      [
        "torso",
        47,
        72
      ],
      [
        "wingarm",
        42,
        42
      ],
      [
        "foreleg",
        31,
        88
      ],
      [
        "hindleg",
        50,
        91
      ],
      [
        "wing",
        74,
        40
      ],
      [
        "tail",
        11,
        76
      ]
    ],
    "diagram": "winged_quadruped",
    "diagramMap": {
      "head": "head",
      "neck": "neck",
      "torso": "torso",
      "wingarm": "wingarm",
      "foreleg": "foreleg",
      "hindleg": "hindleg",
      "wing": "wing",
      "tail": "tail"
    },
    "piercePaths": [
      {
        "id": "front",
        "name": "正面：头 → 颈 → 躯干",
        "hits": {
          "head": 2,
          "neck": 2,
          "torso": 3
        }
      },
      {
        "id": "side",
        "name": "侧面：翼足 → 躯干 → 翼足",
        "hits": {
          "wingarm": 3,
          "torso": 2,
          "wing": 2
        }
      },
      {
        "id": "back",
        "name": "背面：尾巴 → 躯干",
        "hits": {
          "tail": 3,
          "torso": 2,
          "hindleg": 2
        }
      },
      {
        "id": "single",
        "name": "理想：7 段全打在选中部位",
        "hits": null
      }
    ]
  },
  "STATE_PAGES": [
    {
      "state": 0,
      "hzState": 0,
      "title": "通常状态",
      "color": "#7a8bb0",
      "img": "assets/monsters/em072_08/states/normal.jpg",
      "imgCap": "怪异克服天廻龙：深蓝黑身体、紫色怪异粒子（fandom 截图）",
      "desc": "招式和普通的大师级天廻龙几乎一样；愤怒时每个攻击都会附带狂龙能量弹。",
      "key": [
        "**只打头**：其他部位都硬",
        "双段爆炸吐息：**先顺长边走，再侧移**",
        "直线激光后**收招很长** → 打头"
      ],
      "see": [
        "**深蓝黑**身体，翼尖和角**橙红发光**",
        "身边飘**紫色粒子**",
        "（普通天廻龙是**白金色**的）"
      ],
      "dodge": [
        "**双段爆炸吐息**：先横后竖",
        "**擒抱**：马上翔虫受身，后面有追击",
        "**腹压**：前方大范围，远程保持距离"
      ],
      "hit": [
        "**直线激光**后收招长 → 打头",
        "双段吐息第二段后",
        "愤怒时打头够伤害 → **大倒地**"
      ],
      "stand": [
        "正面**斜前方**，方便打头",
        "别站它正下方"
      ],
      "moves": [
        {
          "n": "双段爆炸吐息",
          "yi": true,
          "tell": "先出现横向延迟爆炸线，再出现纵向",
          "dodge": "**先顺着长边走，再侧移**；翔虫方向错了会吃第二段",
          "punish": "yes",
          "blood": false,
          "src": "game8shagaru"
        },
        {
          "n": "横扫吐息",
          "yi": true,
          "tell": "抬身后横向扫射（75 伤害）",
          "dodge": "侧移出范围，或绕到身后",
          "punish": "?",
          "blood": false,
          "src": "game8shagaru"
        },
        {
          "n": "直线激光",
          "yi": true,
          "tell": "粗的直线光束（105 伤害，要强化防御才能挡）",
          "dodge": "**侧移**",
          "punish": "yes",
          "blood": false,
          "src": "game8shagaru"
        },
        {
          "n": "腹压",
          "yi": true,
          "tell": "高高抬起身体（95 伤害，眩晕 60）",
          "dodge": "离开正前方；远程保持距离",
          "punish": "yes",
          "blood": false,
          "src": "game8shagaru"
        },
        {
          "n": "擒抱",
          "yi": true,
          "tell": "前扑抓人",
          "dodge": "**马上翔虫受身往侧边**，后面有追击",
          "punish": "no",
          "blood": false,
          "src": "game8shagaru"
        }
      ]
    },
    {
      "state": 1,
      "hzState": 0,
      "title": "怪气脉动状态",
      "color": "#e0612f",
      "img": "assets/monsters/em072_08/states/risen.jpg",
      "imgCap": "怪气脉动：翼发红光、紫色光芒，砸地变成三连（YouTube 截图，分辨率低）",
      "imgGuess": false,
      "desc": "古龙之怒到顶点时进入：身体周围爆炸一次，全身发出橙色光芒。打够伤害会倒地并解除。",
      "key": [
        "大招**病毒柱**：**收刀从缝里跑出去**",
        "翼拳砸地会**三连 / 四连**：别太早受身",
        "连续狂龙能量弹**比大招还危险**"
      ],
      "see": [
        "变身时**身边爆炸**",
        "全身**橙色光芒**"
      ],
      "dodge": [
        "**病毒柱大招**：柱子围过来 → 收刀找缝跑出",
        "**翼拳砸地**三连以上，第 4 下趴地砸",
        "**后跳**：嘴边黑雾 = 横扫吐息；没黑雾 = 延迟冲撞"
      ],
      "hit": [
        "大招**最后爆炸后**",
        "第 3 / 4 下砸地之后",
        "打够伤害 → **倒地并解除**状态"
      ],
      "stand": [
        "**中距离**，随时准备收刀跑",
        "横扫后不要贪，马上停手"
      ],
      "moves": [
        {
          "n": "大招：病毒柱",
          "yi": true,
          "tell": "柱子围住猎人并收缩（80 伤害，眩晕 100），最后大爆炸（110，不可防御）",
          "dodge": "**收刀，从缝隙跑出去**，一直跑；或卡时机紧急回避最后的爆炸",
          "punish": "yes",
          "blood": false,
          "src": "game8risen"
        },
        {
          "n": "连续翼拳砸地",
          "yi": true,
          "tell": "连续跳起用翼拳砸地，至少 3 下（90 伤害）",
          "dodge": "**别太早受身**；准备第 4 下趴地砸",
          "punish": "yes",
          "blood": false,
          "src": "game8risen"
        },
        {
          "n": "连续狂龙能量弹",
          "yi": true,
          "tell": "横扫 → 能量弹连发 → 冲击爆炸吐息",
          "dodge": "收刀从间隙跑；game8 认为比大招更危险",
          "punish": "no",
          "blood": false,
          "src": "game8risen"
        },
        {
          "n": "后跳 → 吐息 / 冲撞",
          "yi": true,
          "tell": "旋转后跳：嘴边**有黑雾 = 横扫吐息**，没有 = 延迟冲撞",
          "dodge": "看黑雾判断；吐息蓄力长，可以回避或反击",
          "punish": "yes",
          "blood": false,
          "src": "game8risen"
        },
        {
          "n": "连续翼拳 + 直线地雷",
          "yi": true,
          "tell": "翼足横扫后常接快速翼拳，地上一条地雷",
          "dodge": "**不能往后躲**；横扫后提早停手",
          "punish": "no",
          "blood": false,
          "src": "vidShiina"
        }
      ]
    }
  ],
  "BUILDS": [
    {
      "id": "pfire",
      "short": "贯穿火炎",
      "title": "速射贯穿火炎弹",
      "weapon": "鳳仙火竜砲【銀炎】等速射贯穿火炎弹的轻弩（中文名未确认）",
      "stats": "视频里最常见的打法（柴イカ 3 分台、らぐな、はおー 4'59）",
      "skills": [
        "火属性攻击强化 5",
        "会心击【属性】3",
        "速射强化 3",
        "看破 / 弱点特效",
        "狂龙症【蚀】1"
      ],
      "why": "贯穿弹一发能打 7 段，火肉质全身都有 10–25，比物理贯穿更不怕打到硬部位。",
      "preset": {
        "atk": 300,
        "aff": 0,
        "attack": 4,
        "critEye": 4,
        "wex": 0,
        "critBoost": 0,
        "rapidUp": 3,
        "fireAtk": 5,
        "critEle": 3,
        "extraAff": 30,
        "extraAtk": 0
      },
      "after": {
        "fAmmo": "pfire"
      },
      "src": "game8lbg",
      "guess": true
    },
    {
      "id": "pierce",
      "short": "物理贯穿",
      "title": "刻银讨铳 · 物理贯穿",
      "weapon": "刻银讨铳（原初形态爵银龙的轻弩）",
      "stats": "攻击 320 · 速射 LV2贯穿弹；防具用怪异克服天廻龙的腕 / 腰",
      "skills": [
        "攻击 7",
        "看破 7",
        "超会心 3",
        "贯穿弹・贯穿箭强化 2",
        "速射强化 3",
        "狂龙症【蚀】1",
        "狂龙症【翔】1"
      ],
      "why": "game8 的通用物理贯穿配装。这只龙只有头 45，其他部位 10–30，贯穿弹的伤害会被硬部位拉低。",
      "preset": {
        "atk": 320,
        "aff": 0,
        "attack": 7,
        "critEye": 7,
        "wex": 2,
        "critBoost": 3,
        "pierceUp": 2,
        "rapidUp": 3,
        "extraAff": 30,
        "extraAtk": 0
      },
      "after": {
        "fAmmo": "p2"
      },
      "src": "game8lbg"
    },
    {
      "id": "normal",
      "short": "通常弹",
      "title": "通常弹速射 专打头",
      "weapon": "速射 LV2通常弹 的高攻击轻弩",
      "stats": "やぎこ Lv300 5 分、とかげーむ「通常弹才是正解？」",
      "skills": [
        "攻击 7",
        "看破 7",
        "弱点特效 3",
        "超会心 3",
        "通常弹・连射箭强化 3",
        "速射强化 3"
      ],
      "why": "头是唯一 45 的部位：通常弹每一发都打在弱点上，弱点特效吃满。",
      "preset": {
        "atk": 320,
        "aff": 0,
        "attack": 7,
        "critEye": 7,
        "wex": 3,
        "critBoost": 3,
        "normalUp": 3,
        "rapidUp": 3,
        "extraAff": 0,
        "extraAtk": 0
      },
      "after": {
        "fAmmo": "n2",
        "part": "head"
      },
      "src": "vidYagiko",
      "guess": true
    }
  ],
  "FOLLOWERS": null,
  "VIDEOS": [
    {
      "group": "先认识它",
      "items": [
        {
          "id": "tdyWt3jmwM8",
          "t": "官方：免费更新第 5 弹 天彗龙 & 怪异克服天廻龙",
          "ch": "Monster Hunter (CAPCOM)",
          "len": "3:02",
          "lang": "英",
          "star": true,
          "why": "看清它和普通天廻龙的区别"
        },
        {
          "id": "fb4ApiQ0eBA",
          "t": "Hazard 怪异克服天廻龙 招式变化",
          "ch": "Aenshin",
          "len": "2:20",
          "lang": "英",
          "why": "烈祸 / 特殊调查的招式差异"
        }
      ]
    },
    {
      "group": "招式 / 怎么躲",
      "items": [
        {
          "id": "WWGz8_8JYqU",
          "t": "【完全解说】怪异克服天廻龙 全动作",
          "ch": "もちゃのゲーム配信",
          "len": "12:32",
          "lang": "日",
          "star": true,
          "why": "逐招讲解，含怪气脉动"
        },
        {
          "id": "ayiwHh8YCIg",
          "t": "【曙光怪物底裤系列#10】怪异克服天廻龙全面解读",
          "ch": "外卖大爷",
          "len": "22:21",
          "lang": "中",
          "star": true,
          "why": "中文：机制、状态、招式"
        },
        {
          "id": "AhrenRTbWWw",
          "t": "最详细的怪异克服天廻龙打法讲解",
          "ch": "バーン - BURN Channel",
          "len": "27:43",
          "lang": "日",
          "why": "很长但很细"
        },
        {
          "id": "wxK6QoKSCng",
          "t": "the absolute best risen shagaru magala guide",
          "ch": "shadey guy",
          "len": "21:32",
          "lang": "英",
          "why": "英文招式攻略"
        },
        {
          "id": "isbEA9Dm07w",
          "t": "Quick Sheathe is the only thing that matters",
          "ch": "Peppo",
          "len": "11:20",
          "lang": "英",
          "why": "为什么躲病毒柱要会收刀"
        }
      ]
    },
    {
      "group": "轻弩实战 / 配装",
      "items": [
        {
          "id": "5ESp7h0X2kI",
          "t": "怪异克服天廻龙 3 分台 贯通火炎轻弩",
          "ch": "柴イカ",
          "len": "4:21",
          "lang": "日",
          "why": "速射贯穿火炎弹的快速打法"
        },
        {
          "id": "uaY_QWrNYYY",
          "t": "不用怪异炼成也很强的贯通火轻弩",
          "ch": "らぐな",
          "len": "12:17",
          "lang": "日",
          "why": "配装讲解 + 实战"
        },
        {
          "id": "CfOwfTQokWg",
          "t": "轻弩（贯穿火炎弹）4'59",
          "ch": "はおー",
          "len": "6:23",
          "lang": "日",
          "why": "说明里有躲法：往侧面或身下，不要往后"
        },
        {
          "id": "52RvQUNFA1w",
          "t": "Lv300 怪异克服天廻龙 5 分 通常速射轻弩",
          "ch": "やぎこ",
          "len": "11:32",
          "lang": "日",
          "why": "Ver.16 通常弹速射"
        },
        {
          "id": "pd8whxZqgIg",
          "t": "怪异克服天廻龙 是通常弹才对？",
          "ch": "とかげーむ ch.",
          "len": "18:22",
          "lang": "日",
          "why": "通常弹和其他弹种比较 + 配装"
        },
        {
          "id": "u5mXIn7cHXc",
          "t": "Lv300 怪异克服天廻龙 5 分 散弹轻弩",
          "ch": "やぎこ",
          "len": "6:27",
          "lang": "日",
          "why": "回避向散弹轻弩"
        },
        {
          "id": "EgLBiWEW8p8",
          "t": "Risen Shagaru Magala Spread LBG 8:09",
          "ch": "NightMeow",
          "len": "8:56",
          "lang": "—",
          "why": "散弹实战"
        },
        {
          "id": "47O6HgudfiM",
          "t": "特殊调查 EX 怪异克服天廻龙 10:11 轻弩",
          "ch": "Xer0o0 HASSAN CHOP",
          "len": "11:03",
          "lang": "英",
          "why": "最高难度的轻弩打法"
        }
      ]
    }
  ],
  "UNVERIFIED": [
    "通常状态和怪气脉动状态都按肉质阶段 0 计算（MHRice 没有单独的怪气脉动肉质）。肉质阶段 1 只有翼足变软，触发条件未知。",
    "招式中文名是按日文数据意译（标「译」）。",
    "「速射贯穿火炎弹」配装的武器中文名未确认；技能等级按视频和 game8 推测。",
    "怪气脉动时打够伤害会倒地的阈值（MHRice Unique1：400 / 450 / 500）是推测的对应关系。"
  ],
  "SOURCES": {
    "mhrice": {
      "name": "MHRice 072_08",
      "url": "https://mhrise.mhrice.info/monster/072_08.html"
    },
    "game8risen": {
      "name": "game8.jp 怪异克服天廻龙",
      "url": "https://game8.jp/mhrise/524038"
    },
    "game8shagaru": {
      "name": "game8.jp 天廻龙（通常招式）",
      "url": "https://game8.jp/mhrise/463871"
    },
    "game8lbg": {
      "name": "game8.jp 轻弩配装",
      "url": "https://game8.jp/mhrise/465103"
    },
    "mhwiki": {
      "name": "monsterhunterwiki.org",
      "url": "https://monsterhunterwiki.org/wiki/Risen_Shagaru_Magala_(MHRS)"
    },
    "vidShiina": {
      "name": "YouTube しーな（a5WIU0RtlTo）",
      "url": "https://www.youtube.com/watch?v=a5WIU0RtlTo"
    },
    "vidYagiko": {
      "name": "YouTube やぎこ",
      "url": "https://www.youtube.com/watch?v=52RvQUNFA1w"
    }
  },
  "weapon": null,
  "TEXT": {
    "home": {
      "key": [
        "只有**头**是弱点（弹 45），其他部位只有 10–30",
        "热门打法：**速射贯穿火炎弹**；也可以**通常弹速射**专心打头",
        "**毒**首次只要 **80**：毒弹非常划算"
      ],
      "checklist": [
        [
          "builds",
          "选配装：<b>贯穿火炎弹</b>速射 或 <b>刻银讨铳</b> 物理贯穿",
          "推荐配装"
        ],
        [
          "phase/1",
          "背熟<b>怪气脉动</b>的大招：<b>收刀从缝里跑出去</b>",
          "怪气脉动状态"
        ],
        [
          "videos",
          "先看官方预告和招式解说",
          "视频"
        ]
      ]
    },
    "map": {
      "key": [
        "打**头 (45)**：唯一的弱点",
        "腿 30、尾巴 25；**翼只有 10**",
        "翼足在肉质阶段 1 会变软（20 → 25）"
      ]
    },
    "builds": {
      "key": [
        "最常见：**速射贯穿火炎弹**（火属性 ★★）",
        "物理贯穿：**刻银讨铳**（原初爵银龙的轻弩）",
        "龙属性最有效（★★★），火、雷次之"
      ]
    },
    "status": {
      "key": [
        "**毒**首次只要 **80**、最高 290 → 毒弹很划算",
        "麻痹 / 睡眠 / 爆破 / 眩晕 有效，**减气无效**",
        "**陷阱无效**（古龙）；闪光弹有效"
      ]
    },
    "weaponNote": "怪异克服天廻龙<b>没有轻弩</b>（只出防具）。名字里带「天廻」的轻弩 THE美德（La Vertu）是<b>普通天廻龙</b>做的，性能一般。<br>它的素材「天廻龙的破怪玉」可以做 <b>狂蚀珠【4】</b>（狂龙症【蚀】）。它的防具还带 <b>狂龙症【翔】</b>：克服后一段时间多一只翔虫。"
  },
  "relatedEquip": [
    {
      "id": "em072_00",
      "label": "普通天廻龙",
      "icon": "assets/monsters/em072_00/icon.png",
      "note": "普通天廻龙：白金色。怪异克服天廻龙是深蓝黑色、翼尖橙红发光。"
    }
  ]
});
