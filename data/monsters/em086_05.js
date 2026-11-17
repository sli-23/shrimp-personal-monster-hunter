/* 神秘红光天彗龙 · Crimson Glow Valstrax — MHRice 数据 + 手工整理 */
MHR.registerMonster({
  "id": "em086_05",
  "status": "full",
  "updated": "2026-11-17",
  "MONSTER": {
    "id": "em086_05",
    "mhrice": "086_05",
    "name": "神秘红光天彗龙",
    "nameAlt": "Crimson Glow Valstrax · 天彗龍 奇しき赫耀のバルファルク",
    "en": "Crimson Glow Valstrax",
    "ja": "天彗龍 奇しき赫耀のバルファルク",
    "icon": "assets/monsters/em086_05/icon.png",
    "baseHP": 4700,
    "states": [
      {
        "id": 0,
        "name": "通常",
        "short": "通常",
        "en": "Normal",
        "guess": false,
        "color": "#c9c2b4",
        "desc": "大部分时间。"
      },
      {
        "id": 1,
        "name": "龙气活性",
        "short": "龙气活性",
        "en": "Dragon energy",
        "guess": false,
        "color": "#c2414b",
        "desc": "吸气成功后翼发红光：翼变软（45），翼上属性无效。"
      },
      {
        "id": 2,
        "name": "愤怒",
        "short": "愤怒",
        "en": "Enraged",
        "guess": false,
        "color": "#e0612f",
        "desc": "头、颈、身体被龙气覆盖：这些部位属性无效，后肢变软（40）。"
      },
      {
        "id": 3,
        "name": "龙气活性 + 愤怒",
        "short": "龙气+怒",
        "en": "Dragon energy & enraged",
        "guess": false,
        "color": "#8f1d2c",
        "desc": "两种同时。"
      }
    ],
    "parts": [
      {
        "id": "head",
        "name": "头部",
        "en": "Head",
        "hz": [
          {
            "sever": 55,
            "blunt": 60,
            "shot": 35,
            "fire": 25,
            "water": 25,
            "thunder": 25,
            "ice": 25,
            "dragon": 0,
            "stun": 100
          },
          {
            "sever": 55,
            "blunt": 60,
            "shot": 35,
            "fire": 25,
            "water": 25,
            "thunder": 25,
            "ice": 25,
            "dragon": 0,
            "stun": 100
          },
          {
            "sever": 57,
            "blunt": 62,
            "shot": 35,
            "fire": 0,
            "water": 0,
            "thunder": 0,
            "ice": 0,
            "dragon": 0,
            "stun": 100
          },
          {
            "sever": 57,
            "blunt": 62,
            "shot": 35,
            "fire": 0,
            "water": 0,
            "thunder": 0,
            "ice": 0,
            "dragon": 0,
            "stun": 100
          }
        ],
        "stagger": 700,
        "brk": 1050,
        "note": ""
      },
      {
        "id": "neck",
        "name": "颈部",
        "en": "Neck",
        "hz": [
          {
            "sever": 40,
            "blunt": 30,
            "shot": 15,
            "fire": 25,
            "water": 25,
            "thunder": 25,
            "ice": 25,
            "dragon": 0,
            "stun": 0
          },
          {
            "sever": 40,
            "blunt": 30,
            "shot": 15,
            "fire": 25,
            "water": 25,
            "thunder": 25,
            "ice": 25,
            "dragon": 0,
            "stun": 0
          },
          {
            "sever": 40,
            "blunt": 30,
            "shot": 20,
            "fire": 0,
            "water": 0,
            "thunder": 0,
            "ice": 0,
            "dragon": 0,
            "stun": 0
          },
          {
            "sever": 40,
            "blunt": 30,
            "shot": 20,
            "fire": 0,
            "water": 0,
            "thunder": 0,
            "ice": 0,
            "dragon": 0,
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
            "sever": 30,
            "blunt": 25,
            "shot": 10,
            "fire": 20,
            "water": 20,
            "thunder": 20,
            "ice": 20,
            "dragon": 0,
            "stun": 0
          },
          {
            "sever": 30,
            "blunt": 25,
            "shot": 10,
            "fire": 20,
            "water": 20,
            "thunder": 20,
            "ice": 20,
            "dragon": 0,
            "stun": 0
          },
          {
            "sever": 30,
            "blunt": 25,
            "shot": 10,
            "fire": 0,
            "water": 0,
            "thunder": 0,
            "ice": 0,
            "dragon": 0,
            "stun": 0
          },
          {
            "sever": 30,
            "blunt": 25,
            "shot": 10,
            "fire": 0,
            "water": 0,
            "thunder": 0,
            "ice": 0,
            "dragon": 0,
            "stun": 0
          }
        ],
        "stagger": null,
        "brk": null,
        "note": ""
      },
      {
        "id": "wingarm",
        "name": "翼足",
        "en": "Wingarm",
        "hz": [
          {
            "sever": 45,
            "blunt": 45,
            "shot": 45,
            "fire": 15,
            "water": 15,
            "thunder": 15,
            "ice": 15,
            "dragon": 0,
            "stun": 0
          },
          {
            "sever": 45,
            "blunt": 45,
            "shot": 45,
            "fire": 15,
            "water": 15,
            "thunder": 15,
            "ice": 15,
            "dragon": 0,
            "stun": 0
          },
          {
            "sever": 45,
            "blunt": 45,
            "shot": 45,
            "fire": 15,
            "water": 15,
            "thunder": 15,
            "ice": 15,
            "dragon": 0,
            "stun": 0
          },
          {
            "sever": 45,
            "blunt": 45,
            "shot": 45,
            "fire": 15,
            "water": 15,
            "thunder": 15,
            "ice": 15,
            "dragon": 0,
            "stun": 0
          }
        ],
        "stagger": null,
        "brk": null,
        "note": "翼的根部（肩膀）：所有状态弹肉质都是 45，轻弩主要打这里"
      },
      {
        "id": "foreleg",
        "name": "前肢",
        "en": "Foreleg",
        "hz": [
          {
            "sever": 25,
            "blunt": 24,
            "shot": 25,
            "fire": 25,
            "water": 25,
            "thunder": 25,
            "ice": 25,
            "dragon": 0,
            "stun": 0
          },
          {
            "sever": 25,
            "blunt": 24,
            "shot": 25,
            "fire": 25,
            "water": 25,
            "thunder": 25,
            "ice": 25,
            "dragon": 0,
            "stun": 0
          },
          {
            "sever": 25,
            "blunt": 24,
            "shot": 25,
            "fire": 25,
            "water": 25,
            "thunder": 25,
            "ice": 25,
            "dragon": 0,
            "stun": 0
          },
          {
            "sever": 25,
            "blunt": 24,
            "shot": 25,
            "fire": 25,
            "water": 25,
            "thunder": 25,
            "ice": 25,
            "dragon": 0,
            "stun": 0
          }
        ],
        "stagger": null,
        "brk": null,
        "note": ""
      },
      {
        "id": "hindleg",
        "name": "后肢",
        "en": "Hind Leg",
        "hz": [
          {
            "sever": 25,
            "blunt": 24,
            "shot": 20,
            "fire": 15,
            "water": 15,
            "thunder": 15,
            "ice": 15,
            "dragon": 0,
            "stun": 0
          },
          {
            "sever": 25,
            "blunt": 24,
            "shot": 20,
            "fire": 15,
            "water": 15,
            "thunder": 15,
            "ice": 15,
            "dragon": 0,
            "stun": 0
          },
          {
            "sever": 25,
            "blunt": 24,
            "shot": 40,
            "fire": 0,
            "water": 0,
            "thunder": 0,
            "ice": 0,
            "dragon": 0,
            "stun": 0
          },
          {
            "sever": 25,
            "blunt": 24,
            "shot": 40,
            "fire": 0,
            "water": 0,
            "thunder": 0,
            "ice": 0,
            "dragon": 0,
            "stun": 0
          }
        ],
        "stagger": null,
        "brk": null,
        "note": ""
      },
      {
        "id": "wing",
        "name": "翼",
        "en": "Wing",
        "hz": [
          {
            "sever": 22,
            "blunt": 45,
            "shot": 10,
            "fire": 25,
            "water": 25,
            "thunder": 25,
            "ice": 25,
            "dragon": 0,
            "stun": 0
          },
          {
            "sever": 64,
            "blunt": 70,
            "shot": 45,
            "fire": 0,
            "water": 0,
            "thunder": 0,
            "ice": 0,
            "dragon": 0,
            "stun": 0
          },
          {
            "sever": 22,
            "blunt": 45,
            "shot": 10,
            "fire": 0,
            "water": 0,
            "thunder": 0,
            "ice": 0,
            "dragon": 0,
            "stun": 0
          },
          {
            "sever": 64,
            "blunt": 70,
            "shot": 45,
            "fire": 0,
            "water": 0,
            "thunder": 0,
            "ice": 0,
            "dragon": 0,
            "stun": 0
          }
        ],
        "stagger": 400,
        "brk": 600,
        "note": "平时 10；龙气活性（翼发红光）时变 45"
      },
      {
        "id": "tail",
        "name": "尾巴",
        "en": "Tail",
        "hz": [
          {
            "sever": 45,
            "blunt": 24,
            "shot": 20,
            "fire": 20,
            "water": 20,
            "thunder": 20,
            "ice": 20,
            "dragon": 0,
            "stun": 0
          },
          {
            "sever": 45,
            "blunt": 24,
            "shot": 20,
            "fire": 20,
            "water": 20,
            "thunder": 20,
            "ice": 20,
            "dragon": 0,
            "stun": 0
          },
          {
            "sever": 45,
            "blunt": 24,
            "shot": 20,
            "fire": 0,
            "water": 0,
            "thunder": 0,
            "ice": 0,
            "dragon": 0,
            "stun": 0
          },
          {
            "sever": 45,
            "blunt": 24,
            "shot": 20,
            "fire": 0,
            "water": 0,
            "thunder": 0,
            "ice": 0,
            "dragon": 0,
            "stun": 0
          }
        ],
        "stagger": null,
        "brk": null,
        "note": ""
      },
      {
        "id": "chest_in",
        "name": "胸部（吸气中）",
        "en": "Chest (inhaling)",
        "hz": [
          {
            "sever": 80,
            "blunt": 90,
            "shot": 50,
            "fire": 15,
            "water": 25,
            "thunder": 20,
            "ice": 25,
            "dragon": 0,
            "stun": 0
          },
          {
            "sever": 80,
            "blunt": 90,
            "shot": 50,
            "fire": 15,
            "water": 25,
            "thunder": 20,
            "ice": 25,
            "dragon": 0,
            "stun": 0
          },
          {
            "sever": 80,
            "blunt": 90,
            "shot": 50,
            "fire": 15,
            "water": 25,
            "thunder": 20,
            "ice": 25,
            "dragon": 0,
            "stun": 0
          },
          {
            "sever": 80,
            "blunt": 90,
            "shot": 50,
            "fire": 15,
            "water": 25,
            "thunder": 20,
            "ice": 25,
            "dragon": 0,
            "stun": 0
          }
        ],
        "stagger": null,
        "brk": null,
        "note": "只有吸气时才这么软：打这里够伤害 → 倒地"
      },
      {
        "id": "chest",
        "name": "胸部",
        "en": "Chest",
        "hz": [
          {
            "sever": 30,
            "blunt": 25,
            "shot": 10,
            "fire": 20,
            "water": 20,
            "thunder": 20,
            "ice": 20,
            "dragon": 0,
            "stun": 0
          },
          {
            "sever": 30,
            "blunt": 25,
            "shot": 10,
            "fire": 20,
            "water": 20,
            "thunder": 20,
            "ice": 20,
            "dragon": 0,
            "stun": 0
          },
          {
            "sever": 30,
            "blunt": 25,
            "shot": 10,
            "fire": 0,
            "water": 0,
            "thunder": 0,
            "ice": 0,
            "dragon": 0,
            "stun": 0
          },
          {
            "sever": 30,
            "blunt": 25,
            "shot": 10,
            "fire": 0,
            "water": 0,
            "thunder": 0,
            "ice": 0,
            "dragon": 0,
            "stun": 0
          }
        ],
        "stagger": 350,
        "brk": 350,
        "note": "平时很硬；吸气时换成「胸部（吸气中）」"
      }
    ],
    "status": [
      {
        "id": "poison",
        "name": "毒",
        "icon": "poison",
        "init": 150,
        "inc": 100,
        "max": 650,
        "dur": "30 秒",
        "dmg": "10 / 1 sec",
        "ok": true
      },
      {
        "id": "paralysis",
        "name": "麻痹",
        "icon": "para",
        "init": 200,
        "inc": 200,
        "max": 800,
        "dur": "9 秒",
        "dmg": "0 / 0 sec",
        "ok": true
      },
      {
        "id": "sleep",
        "name": "睡眠",
        "icon": "sleep",
        "init": 200,
        "inc": 200,
        "max": 800,
        "dur": "30 秒",
        "dmg": "0 / 0 sec",
        "ok": true
      },
      {
        "id": "blast",
        "name": "爆破",
        "icon": "blast",
        "init": 200,
        "inc": 100,
        "max": 800,
        "dur": "",
        "dmg": "0 / 0 sec",
        "ok": true
      },
      {
        "id": "stun",
        "name": "眩晕",
        "icon": "stun",
        "init": 180,
        "inc": 170,
        "max": 800,
        "dur": "10 秒",
        "dmg": "0 / 0 sec",
        "ok": true
      },
      {
        "id": "exhaust",
        "name": "减气",
        "icon": "exhaust",
        "init": 375,
        "inc": 150,
        "max": 1575,
        "dur": "",
        "dmg": "0 / 0 sec",
        "ok": true
      }
    ],
    "quests": [
      {
        "id": "q0",
        "name": "MR6★ 终焉之天，彗星燃灼",
        "hpMul": 11.9,
        "atkMul": 11.2,
        "partMul": 13.2,
        "defMul": 1,
        "statusMul": {
          "stun": 1.6,
          "paralysis": 2.6,
          "sleep": 1
        },
        "src": "mhrice",
        "verified": false
      },
      {
        "id": "q1",
        "name": "MR6★ 神秘光辉",
        "hpMul": 10.4,
        "atkMul": 11.2,
        "partMul": 11.6,
        "defMul": 1,
        "statusMul": {
          "stun": 1.6,
          "paralysis": 2.6,
          "sleep": 1
        },
        "src": "mhrice",
        "verified": false
      },
      {
        "id": "q2",
        "name": "MR6★ 毁灭龙神",
        "hpMul": 10.1,
        "atkMul": 11.2,
        "partMul": 11.6,
        "defMul": 1,
        "statusMul": {
          "stun": 1.6,
          "paralysis": 2.6,
          "sleep": 1
        },
        "src": "mhrice",
        "verified": false
      },
      {
        "id": "q3",
        "name": "MR6★ 高难度：驱除灾厄的烈焰",
        "hpMul": 4.7,
        "atkMul": 11.5,
        "partMul": 11.6,
        "defMul": 1,
        "statusMul": {
          "stun": 1.6,
          "paralysis": 2.6,
          "sleep": 1
        },
        "src": "mhrice",
        "verified": false
      },
      {
        "id": "q4",
        "name": "MR6★ 双凶来袭：名为终焉的凶星",
        "hpMul": 6.4,
        "atkMul": 15.1,
        "partMul": 12,
        "defMul": 1,
        "statusMul": {
          "stun": 1.6,
          "paralysis": 2.6,
          "sleep": 1
        },
        "src": "mhrice",
        "verified": false
      },
      {
        "id": "q5",
        "name": "MR6★ 烈祸袭来：奏响毁灭的旋律",
        "hpMul": 9.2,
        "atkMul": 11.2,
        "partMul": 11.6,
        "defMul": 1,
        "statusMul": {
          "stun": 1.6,
          "paralysis": 2.6,
          "sleep": 1
        },
        "src": "mhrice",
        "verified": false
      },
      {
        "id": "q6",
        "name": "MR6★ 大凶星",
        "hpMul": 11.9,
        "atkMul": 12.7,
        "partMul": 13.2,
        "defMul": 1,
        "statusMul": {
          "stun": 1.6,
          "paralysis": 2.6,
          "sleep": 1
        },
        "src": "mhrice",
        "verified": false
      },
      {
        "id": "q7",
        "name": "MR6★ 调查降临于密林的赤红凶星",
        "hpMul": 10.4,
        "atkMul": 11.2,
        "partMul": 11.6,
        "defMul": 1,
        "statusMul": {
          "stun": 1.6,
          "paralysis": 2.6,
          "sleep": 1
        },
        "src": "mhrice",
        "verified": false
      }
    ],
    "weakness": [
      {
        "el": "fire",
        "name": "火",
        "stars": 2
      },
      {
        "el": "water",
        "name": "水",
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
        "stars": 2
      },
      {
        "el": "dragon",
        "name": "龙",
        "stars": 0
      }
    ],
    "desc": "Description A mutant Valstrax fearsomely dubbed the \"Crimson Glow.\" This elder dragon typically secludes itself in the upper atmosphere, but it has been driven mad by its own rampant energy, causing it to lash out at anything in its sight. Once it sights its prey, it swoops down, trampling them beneath its shifting wingblades. Several have been sighted all over, so be prepared to encounter one at any time. “天彗龙”的变异体。 原是居于秘境，翱翔高空的古龙， 却受自身龙气影响而狂暴化， 会毫不犹豫地攻击映入眼帘的一切事物。 一旦发现猎物，就会高速飞来发动攻击， 以千变万化的翼足将之蹂躏。活动范围极广， 在各地都有与之遭遇的危险，还望注意。 After channeling energy into its wings, it will unleash a powerful atta",
    "type": "古龙种",
    "statusDecay": "所有耐性每 10 秒衰减 5 点",
    "items": [
      {
        "name": "陷阱",
        "ok": false,
        "note": "古龙种无效"
      }
    ],
    "misc": [
      {
        "k": "吸气时打胸倒地",
        "v": "额外 600 伤害（game8）；前肢也能打出倒地"
      },
      {
        "k": "属性",
        "v": "火 / 水 / 雷 / 冰 都是 25（头）；被龙气覆盖的部位属性全无效"
      }
    ]
  },
  "MAP": {
    "render": "assets/monsters/em086_05/render.png",
    "aspect": "764/625",
    "spots": [
      [
        "head",
        5,
        84
      ],
      [
        "neck",
        13,
        76
      ],
      [
        "chest",
        22,
        69
      ],
      [
        "chest_in",
        33,
        64
      ],
      [
        "torso",
        46,
        52
      ],
      [
        "wingarm",
        13,
        46
      ],
      [
        "wingarm",
        27,
        88
      ],
      [
        "wing",
        32,
        28
      ],
      [
        "wing",
        62,
        66
      ],
      [
        "tail",
        70,
        27
      ]
    ],
    "piercePaths": [
      {
        "id": "front",
        "name": "正面：头 → 颈 → 胸",
        "hits": {
          "head": 2,
          "neck": 2,
          "chest": 3
        }
      },
      {
        "id": "side",
        "name": "侧面：翼足 → 躯干 → 翼足",
        "hits": {
          "wingarm": 4,
          "torso": 3
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
      "title": "通常",
      "img": "assets/monsters/em086_05/states/normal.jpg",
      "imgCap": "通常状态：银蓝身体，翼没有发光（game8 截图）",
      "key": [
        "打**翼足 45**",
        "看到**吸气** → 打胸让它倒地",
        "二连光束：**第二发要紧急回避**"
      ],
      "see": [
        "银蓝身体、**红色喷射翼**",
        "翼**没有红光**"
      ],
      "dodge": [
        "**二连光束**：第二发收刀紧急回避",
        "**正下方爆炸**：看到蓄力就后退",
        "前方吐息后地面会**爆炸**"
      ],
      "hit": [
        "**吸气**时打胸（50）→ 倒地 + 额外 600 伤害",
        "地面刺击打空后",
        "侧面打**翼足**"
      ],
      "stand": [
        "站**侧面**，避开正前方光束",
        "中距离，方便后退"
      ],
      "moves": [
        {
          "n": "二连光束",
          "yi": true,
          "tell": "长直线龙属性光束，接着很快的第二发（几乎一击倒）",
          "dodge": "躲第一发后**收刀紧急回避**第二发",
          "punish": "?",
          "src": "game8cg"
        },
        {
          "n": "地面刺击",
          "yi": true,
          "tell": "先吼一声，然后转身刺地",
          "dodge": "听到吼声就拉开距离",
          "punish": "yes",
          "src": "game8cg"
        },
        {
          "n": "前方吐息 + 地爆",
          "yi": true,
          "tell": "正面光束，之后地面爆炸",
          "dodge": "别站正前方，从**侧面**打",
          "punish": "yes",
          "src": "game8cg"
        },
        {
          "n": "正下方爆炸",
          "yi": true,
          "tell": "短蓄力后身体正下方大范围爆炸",
          "dodge": "看到蓄力就后退（远程优势）",
          "punish": "?",
          "src": "game8cg"
        },
        {
          "n": "吸气",
          "yi": true,
          "tell": "胸口吸入龙气",
          "dodge": "不用躲：这是机会",
          "punish": "yes",
          "src": "mhwiki"
        }
      ]
    },
    {
      "state": 2,
      "hzState": 2,
      "title": "愤怒",
      "img": "assets/monsters/em086_05/states/enraged.jpg",
      "imgCap": "红光发作（game8 登场画面）",
      "imgGuess": true,
      "key": [
        "头 / 颈 / 身体**属性无效**",
        "**后肢变 40**：可以打腿",
        "注意**陨星俯冲**：圈子变小时紧急回避"
      ],
      "see": [
        "身上**红色纹路发光**",
        "肩膀、头冠喷出龙气"
      ],
      "dodge": [
        "**陨星俯冲**：圈小了就紧急回避 / 翔虫",
        "地面刺击会**两次**",
        "空中双翼刺：被打中就连按回避"
      ],
      "hit": [
        "翼足 45 照打",
        "**后肢 40**",
        "刺击打空后"
      ],
      "stand": [
        "多人时**分散**，别让俯冲一次打到所有人"
      ],
      "moves": [
        {
          "n": "地面刺击 ×2",
          "yi": true,
          "tell": "愤怒时刺两次",
          "dodge": "拉开距离，等第二下",
          "punish": "yes",
          "src": "game8cg"
        },
        {
          "n": "空中双翼刺",
          "yi": true,
          "tell": "从空中用翼刺两次，第二下可能接尾巴砸地",
          "dodge": "被第一下打中就**连按回避**",
          "punish": "?",
          "src": "game8cg"
        },
        {
          "n": "袭击（陨星俯冲）",
          "yi": true,
          "tell": "飞走，先绕大圈再绕小圈，红光锁定目标后撞下来（140 伤害，不能翔虫受身）",
          "dodge": "圈子变小时**紧急回避或翔虫**；多人时分散",
          "punish": "?",
          "blood": false,
          "src": "fextra"
        }
      ]
    },
    {
      "state": 1,
      "hzState": 1,
      "title": "龙气活性（吸气后）",
      "img": "assets/monsters/em086_05/states/dragon.jpg",
      "imgCap": "龙气活性：翼发红色光（game8 截图）",
      "key": [
        "**翼变 45**：可以打翼",
        "翼上**属性无效**",
        "龙气留在地上时别贴近"
      ],
      "see": [
        "吸气成功后，**翼发红光**"
      ],
      "dodge": [
        "**翼拍击**会多一次爆炸",
        "刺过的地方**留下龙气**"
      ],
      "hit": [
        "**翼 45**、翼足 45",
        "物理弹最好"
      ],
      "stand": [
        "离地上的龙气远一点"
      ],
      "moves": [
        {
          "n": "翼拍击 + 爆炸",
          "yi": true,
          "tell": "翼向前拍两下，龙气翼会多一次爆炸",
          "dodge": "被第一下打中就往侧边或后方翔虫受身",
          "punish": "?",
          "src": "game8cg"
        },
        {
          "n": "地面刺击（留龙气）",
          "yi": true,
          "tell": "翼带龙气时，刺过的地方会留下能量",
          "dodge": "龙气留在地上时别贴近",
          "punish": "no",
          "src": "game8cg"
        }
      ]
    }
  ],
  "BUILDS": [
    {
      "id": "pierce",
      "short": "物理贯穿",
      "title": "刻银讨铳 · 物理贯穿",
      "weapon": "刻银讨铳（原初形态爵银龙的轻弩）",
      "stats": "game8 综合最强轻弩；侧面贯穿两边翼足",
      "skills": [
        "攻击 7",
        "看破 7",
        "弱点特效 2",
        "超会心 3",
        "贯穿弹・贯穿箭强化 2",
        "速射强化 3"
      ],
      "why": "这只龙属性不稳（愤怒、龙气时失效），物理弹最稳。翼足在所有状态都是 45。",
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
        "fAmmo": "p2",
        "part": "wingarm"
      },
      "src": "game8lbg"
    },
    {
      "id": "slice",
      "short": "穿甲+斩裂",
      "title": "穿甲榴弹 + 斩裂弹",
      "weapon": "能装穿甲榴弹和斩裂弹的轻弩",
      "stats": "はおー 3'18、とかgeーむ「斩裂弹轻松打」",
      "skills": [
        "炸弹客",
        "攻击 / 看破",
        "装填速度"
      ],
      "why": "穿甲榴弹无视肉质、能打头晕；斩裂弹的刃用斩击肉质（翼足斩 45、头 55）。",
      "preset": {
        "atk": 320,
        "aff": 0,
        "attack": 7,
        "critEye": 7,
        "wex": 0,
        "critBoost": 3,
        "extraAff": 0,
        "extraAtk": 0
      },
      "after": {
        "fAmmo": "slice",
        "part": "head"
      },
      "src": "vidHaoo",
      "guess": true
    },
    {
      "id": "normal",
      "short": "通常弹",
      "title": "通常弹 打翼足",
      "weapon": "速射 LV2通常弹 的高攻击轻弩",
      "stats": "单点命中，全部打在 45 上",
      "skills": [
        "攻击 7",
        "看破 7",
        "弱点特效 3",
        "超会心 3",
        "通常弹・连射箭强化 3",
        "速射强化 3"
      ],
      "why": "通常弹每一发都打在翼足 45 上，弱点特效吃满。",
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
        "part": "wingarm"
      },
      "src": "推测",
      "guess": true
    }
  ],
  "FOLLOWERS": null,
  "VIDEOS": [
    {
      "group": "先认识它",
      "items": [
        {
          "id": "xPE1cN_beYs",
          "t": "官方：更新 Ver.3.0 天彗龙 & 新结局",
          "ch": "Monster Hunter (CAPCOM)",
          "len": "1:39",
          "lang": "英",
          "star": true,
          "why": "官方预告"
        },
        {
          "id": "c_MKTV3Va-4",
          "t": "神秘红光天彗龙 4K",
          "ch": "Monster Hunter (CAPCOM)",
          "len": "0:27",
          "lang": "英",
          "why": "看清它的样子"
        }
      ]
    },
    {
      "group": "招式 / 怎么躲",
      "items": [
        {
          "id": "a8JuiZyZixw",
          "t": "神秘红光天彗龙 全部招式动画",
          "ch": "PokédachsVT",
          "len": "1:48",
          "lang": "—",
          "star": true,
          "why": "全招式，很短"
        },
        {
          "id": "tKSM2iRt-n4",
          "t": "神秘红光天彗龙 闪避指南（不带回避距离）",
          "ch": "mugwort",
          "len": "2:32",
          "lang": "英",
          "why": "闪避时机"
        },
        {
          "id": "NjRR1zWf05M",
          "t": "全部吼叫和大招",
          "ch": "ProHunter & Sayori",
          "len": "7:23",
          "lang": "英",
          "why": "大招参考"
        }
      ]
    },
    {
      "group": "轻弩实战 / 配装",
      "items": [
        {
          "id": "W9YE8Ub7w1E",
          "t": "Ver3.0 穿甲斩裂轻弩配装 · 天彗龙 4 分台",
          "ch": "綠茶 GameLab",
          "len": "10:37",
          "lang": "中",
          "star": true,
          "why": "中文轻弩配装"
        },
        {
          "id": "tgfNQ8Tv6PE",
          "t": "神秘红光 轻弩（穿甲榴弹 & 斩裂弹）3'18",
          "ch": "はおー",
          "len": "4:39",
          "lang": "日",
          "why": "打晕 / 倒地的节奏"
        },
        {
          "id": "LVsZ5p-eO50",
          "t": "高难度天彗龙用斩裂弹轻松打",
          "ch": "とかげーむ ch.",
          "len": "20:07",
          "lang": "日",
          "why": "斩裂弹讲解"
        },
        {
          "id": "W2BwMadBYfk",
          "t": "单人 安全稳定 讨伐：轻弩",
          "ch": "マロニーちゃんねる",
          "len": "6:39",
          "lang": "日",
          "why": "新手向"
        },
        {
          "id": "T1S3JsviMvE",
          "t": "天彗龙 贯穿轻弩 4'42",
          "ch": "Mai LBG",
          "len": "6:15",
          "lang": "—",
          "why": "贯穿弹站位"
        }
      ]
    }
  ],
  "UNVERIFIED": [
    "招式中文名是按日文意译（标「译」）。",
    "「愤怒」页的截图是登场画面，状态对应是推测。",
    "陨星俯冲后有没有输出窗口：没找到来源。",
    "翼足 / 翼在图上的位置：按 game8「翼脚 = 翼的根部」放置。"
  ],
  "SOURCES": {
    "mhrice": {
      "name": "MHRice 086_05",
      "url": "https://mhrise.mhrice.info/monster/086_05.html"
    },
    "game8cg": {
      "name": "game8.jp 神秘红光天彗龙",
      "url": "https://game8.jp/mhrise/388455"
    },
    "game8lbg": {
      "name": "game8.jp 轻弩配装",
      "url": "https://game8.jp/mhrise/465103"
    },
    "mhwiki": {
      "name": "monsterhunterwiki.org",
      "url": "https://monsterhunterwiki.org/wiki/Crimson_Glow_Valstrax_(MHRS)"
    },
    "fextra": {
      "name": "Fextralife",
      "url": "https://monsterhunterrise.wiki.fextralife.com/Crimson+Glow+Valstrax"
    },
    "vidHaoo": {
      "name": "YouTube はおー",
      "url": "https://www.youtube.com/watch?v=tgfNQ8Tv6PE"
    }
  },
  "weapon": "silver",
  "TEXT": {
    "home": {
      "key": [
        "打**翼足（翼的根部）**：所有状态都是 45",
        "它**吸气**时打胸（50）→ **倒地**",
        "属性弹不稳：愤怒、龙气时属性全无效"
      ],
      "checklist": [
        [
          "builds",
          "带 <b>刻银讨铳</b> 打物理贯穿（它自己的轻弩是灭龙弹，对它没用）",
          "推荐配装"
        ],
        [
          "phase/0",
          "认得出<b>吸气</b>：吸气时打胸让它倒地",
          "通常状态"
        ],
        [
          "videos",
          "先看官方预告和轻弩实战",
          "视频"
        ]
      ]
    },
    "map": {
      "key": [
        "打**翼足 45**（翼的根部），所有状态都一样",
        "龙气活性时**翼**也变 45；吸气时**胸**变 50",
        "身体 10、胸平时 10：别打"
      ]
    },
    "builds": {
      "key": [
        "**龙属性无效**：它自己的轻弩（灭龙弹）不适合打它",
        "推荐物理弹：**贯穿 / 通常 / 穿甲榴弹 + 斩裂弹**",
        "火 / 水 / 雷 / 冰 都可以，但愤怒和龙气时会失效"
      ]
    },
    "status": {
      "key": [
        "异常都有效：毒首次 150、麻痹 / 睡眠 / 爆破 200",
        "**减气**也有效（375）",
        "**陷阱无效**（古龙）"
      ]
    },
    "weaponNote": "神秘红光天彗龙自己的轻弩是 <b>赤绝耀翼南门星</b>（Elder's Grace / 赫絶の輝翼ジェハダル）：攻击 330，速射只有<b>灭龙弹 / 贯穿灭龙弹</b>。可是这只龙<b>龙属性全身 0</b>，所以打它不推荐。"
  },
  "relatedEquip": [
    {
      "id": "em086_08",
      "label": "怪异克服天彗龙",
      "icon": "assets/monsters/em086_08/icon.png",
      "note": "怪异克服版：身体更黑、胸口红色纹路、翼尖金色发光。它只有防具。"
    }
  ]
});
