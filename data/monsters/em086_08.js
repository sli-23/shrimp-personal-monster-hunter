/* 怪异克服天彗龙 · Risen Crimson Glow Valstrax — MHRice 数据 + 手工整理 */
MHR.registerMonster({
  "id": "em086_08",
  "status": "full",
  "updated": "2026-11-17",
  "MONSTER": {
    "id": "em086_08",
    "mhrice": "086_08",
    "name": "怪异克服天彗龙",
    "nameAlt": "Risen Crimson Glow Valstrax · 天彗龍 傀異克服バルファルク",
    "en": "Risen Crimson Glow Valstrax",
    "ja": "天彗龍 傀異克服バルファルク",
    "icon": "assets/monsters/em086_08/icon.png",
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
        "name": "MR6★ 怪异克服：天彗龙（赫耀）",
        "hpMul": 14.6,
        "atkMul": 16.3,
        "partMul": 15,
        "defMul": 1,
        "statusMul": {
          "stun": 1.7,
          "paralysis": 2.7,
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
    "desc": "Description Risen Crimson Glow Valstrax are elder dragons that have found a way to overcome their affliction. By suppressing the Qurio virus, they have gained great strength and new abilities. Their abundance of dragon energy has granted them greater agility, and even more devastating explosive powers. Very few will be able to withstand their ferocious attacks. When their anger reaches its peak, they'll enter into their Risen state and their body will begin to glow. 带有“怪异克服”之名的天彗龙变异体。 因为克服了啮生虫引发的发狂，而获得了强大力量。 受此影响，它的体表出现了诡异的纹路。庞大的龙 气能量不仅使它的行动极其敏捷，还让它释放的龙 气爆炸猛烈至极。无人能从其灾厄般的猛攻中逃脱。 当古龙之怒达到最大时，其体表会发",
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
      },
      {
        "k": "怪气脉动时打够伤害",
        "v": "大倒地并解除状态（MHRice Unique1：360 / 540 / 720 / 1200，推测为这个阈值）",
        "guess": true
      }
    ]
  },
  "MAP": {
    "render": "assets/monsters/em086_08/render.png",
    "aspect": "988/666",
    "spots": [
      [
        "head",
        77,
        57
      ],
      [
        "neck",
        65,
        48
      ],
      [
        "chest",
        53,
        58
      ],
      [
        "chest_in",
        50,
        47
      ],
      [
        "torso",
        57,
        70
      ],
      [
        "wingarm",
        47,
        39
      ],
      [
        "wingarm",
        70,
        34
      ],
      [
        "wing",
        25,
        30
      ],
      [
        "wing",
        89,
        40
      ],
      [
        "foreleg",
        40,
        77
      ],
      [
        "hindleg",
        51,
        92
      ],
      [
        "tail",
        80,
        80
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
      "title": "通常（和神秘红光一样）",
      "img": "assets/monsters/em086_08/states/normal.jpg",
      "imgCap": "怪异克服天彗龙：深色身体、胸口红纹（monsterhunterwiki 截图）",
      "key": [
        "招式和肉质跟神秘红光**基本一样**",
        "**二连光束**爆炸范围更大：侧闪要更远",
        "吸气时打胸 → 倒地（约 2000 伤害）"
      ],
      "see": [
        "身体**更黑**，胸口**红色纹路**",
        "翼尖**金色发光**",
        "（神秘红光是**银蓝色**的）"
      ],
      "dodge": [
        "**二连光束**：比普通版更宽，侧闪更远",
        "**翼拍击 → 纵向爆炸**：往侧边",
        "**后跳横扫**：很快，用翔虫受身躲后续"
      ],
      "hit": [
        "**吸气**时打胸 → 倒地",
        "侧面打**翼足**"
      ],
      "stand": [
        "侧面中距离"
      ],
      "moves": [
        {
          "n": "二连光束（怪异）",
          "yi": true,
          "tell": "光束后接一个约一人宽的爆炸",
          "dodge": "侧闪要比普通版**更远**",
          "punish": "?",
          "src": "game8risen"
        },
        {
          "n": "翼拍击 → 纵向爆炸",
          "yi": true,
          "tell": "拍地、翼砸，然后正前方一条爆炸",
          "dodge": "往**侧边**移动或翔虫",
          "punish": "?",
          "src": "game8risen"
        },
        {
          "n": "后跳横扫",
          "yi": true,
          "tell": "一边后跳一边正面大范围横扫（不会一击倒）",
          "dodge": "很难躲；用**翔虫受身**躲后续",
          "punish": "no",
          "src": "game8risen"
        },
        {
          "n": "回旋攻击",
          "yi": true,
          "tell": "前摇很长的旋转",
          "dodge": "**收刀紧急回避**，然后再紧急回避后面的砸击",
          "punish": "?",
          "src": "game8risen"
        }
      ]
    },
    {
      "state": 1,
      "hzState": 0,
      "title": "怪气脉动状态",
      "color": "#e0612f",
      "img": "assets/monsters/em086_08/states/risen.jpg",
      "imgCap": "怪气脉动：全身发光（官方 4K 影片截图）",
      "imgGuess": true,
      "key": [
        "**持续输出**能压制这个状态",
        "打够伤害 → **大倒地**并解除",
        "怪异版**袭击**：连续紧急回避"
      ],
      "see": [
        "**全身发光**"
      ],
      "dodge": [
        "**袭击（怪异）**：先空中撒龙弹再冲撞 → **连续紧急回避**",
        "**单翼旋转长枪刺**：集中力量在一边翼上旋转刺来"
      ],
      "hit": [
        "持续打，**打够伤害就倒地**"
      ],
      "stand": [
        "中距离，随时准备收刀紧急回避"
      ],
      "moves": [
        {
          "n": "袭击（怪异）",
          "yi": true,
          "tell": "空中撒出龙弹，然后冲撞",
          "dodge": "**连续紧急回避**：无敌时间能撑过爆炸，再躲一次冲撞",
          "punish": "?",
          "src": "game8risen"
        },
        {
          "n": "单翼旋转刺",
          "yi": true,
          "tell": "力量集中在一边翼，激烈旋转后像长枪一样刺穿",
          "dodge": "资料没写，先拉开距离",
          "punish": "?",
          "guess": true,
          "src": "mhrice"
        }
      ]
    }
  ],
  "BUILDS": [
    {
      "id": "pierce",
      "short": "物理贯穿",
      "title": "刻银讨铳 · 速射贯穿",
      "weapon": "刻银讨铳（原初形态爵银龙的轻弩）",
      "stats": "とかげーむ、やぎこ、game8 都推荐",
      "skills": [
        "攻击 7",
        "看破 7",
        "弱点特效 2",
        "超会心 3",
        "贯穿弹・贯穿箭强化 2",
        "速射强化 3"
      ],
      "why": "这只龙最热门的轻弩打法；侧面贯穿翼足最划算。",
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
      "id": "elem",
      "short": "属性弹",
      "title": "属性弹轻弩（稳定刷）",
      "weapon": "能速射属性弹的轻弩",
      "stats": "桜ころみん：属性弹轻弩稳定打",
      "skills": [
        "对应属性攻击强化 5",
        "会心击【属性】3",
        "速射强化 3"
      ],
      "why": "火 / 水 / 雷 / 冰 都是 25（头）。但愤怒和龙气时，被覆盖的部位属性无效。",
      "preset": {
        "atk": 300,
        "aff": 0,
        "attack": 4,
        "critEye": 4,
        "rapidUp": 3,
        "fireAtk": 5,
        "critEle": 3,
        "extraAff": 0,
        "extraAtk": 0
      },
      "after": {
        "fAmmo": "fire",
        "part": "head"
      },
      "src": "vidSakura",
      "guess": true
    }
  ],
  "FOLLOWERS": null,
  "VIDEOS": [
    {
      "group": "先认识它",
      "items": [
        {
          "id": "6MaZ0V0QNF0",
          "t": "官方：免费更新第 4 弹 冰呪龙 & 怪异克服天彗龙",
          "ch": "Monster Hunter (CAPCOM)",
          "len": "2:33",
          "lang": "英",
          "star": true,
          "why": "官方预告"
        },
        {
          "id": "8tLfLc5b3LE",
          "t": "怪异克服天彗龙 4K",
          "ch": "Monster Hunter (CAPCOM)",
          "len": "0:35",
          "lang": "英",
          "why": "看清怪异版的发光"
        },
        {
          "id": "xjQAFZLTrxo",
          "t": "怪异克服天彗龙 大招",
          "ch": "Arkyuu",
          "len": "1:43",
          "lang": "英",
          "why": "单翼旋转刺"
        }
      ]
    },
    {
      "group": "招式 / 怎么躲",
      "items": [
        {
          "id": "eOvMdrXYaEs",
          "t": "怪异克服天彗龙 机制、状态、出招处理和实战教学",
          "ch": "外卖大爷",
          "len": "11:11",
          "lang": "中",
          "star": true,
          "why": "中文机制讲解"
        },
        {
          "id": "oT3Wrn6Q4lE",
          "t": "让怪异天彗龙更好打的 10 个技巧",
          "ch": "Yokai Nox",
          "len": "8:03",
          "lang": "英",
          "why": "实用技巧"
        },
        {
          "id": "R47beZRab-o",
          "t": "Risen Crimson Valstrax Guide",
          "ch": "Vaulick The Crow",
          "len": "21:31",
          "lang": "英",
          "why": "完整攻略"
        },
        {
          "id": "kTEtW0_b_3E",
          "t": "看懂怪异天彗龙的每一招",
          "ch": "Aris MH",
          "len": "3:53",
          "lang": "—",
          "why": "干净的读招示范"
        }
      ]
    },
    {
      "group": "轻弩实战 / 配装",
      "items": [
        {
          "id": "BlfVLTuOOHo",
          "t": "怪异克服天彗龙 LV300 3'35 轻弩 对策配装",
          "ch": "神鸟",
          "len": "5:00",
          "lang": "中",
          "star": true,
          "why": "中文轻弩配装 + 实战"
        },
        {
          "id": "pOnIszhsfS4",
          "t": "拒绝猫车！怪异克服天彗龙对策配装",
          "ch": "綠茶 GameLab",
          "len": "12:23",
          "lang": "中",
          "why": "防猫车配装"
        },
        {
          "id": "sxjsvrEmrQM",
          "t": "贯穿速射轻弩 · 刻银轻弩",
          "ch": "とかげーむ ch.",
          "len": "20:24",
          "lang": "日",
          "why": "刻银讨铳 贯穿配装"
        },
        {
          "id": "kIy4Im0xt5I",
          "t": "普通装备 Lv300 轻弩 3–4 分 攻略流程",
          "ch": "柴イカ",
          "len": "4:46",
          "lang": "日",
          "why": "打法流程图"
        },
        {
          "id": "CnjsyIYvlKo",
          "t": "属性弹轻弩 稳定打怪异天彗龙",
          "ch": "桜ころみん",
          "len": "16:05",
          "lang": "日",
          "why": "属性弹打法"
        },
        {
          "id": "FY-iIfsy3Rc",
          "t": "单人轻弩 Lv300 2'18",
          "ch": "Bubul",
          "len": "3:34",
          "lang": "—",
          "why": "顶级轻弩"
        }
      ]
    }
  ],
  "UNVERIFIED": [
    "怪气脉动状态没有单独的肉质，按肉质阶段 0–3 计算（推测）。",
    "招式中文名是按日文意译（标「译」）。",
    "单翼旋转刺的躲法：没找到来源。",
    "怪气脉动打倒阈值（360 / 540 / 720 / 1200）是推测的对应关系。"
  ],
  "SOURCES": {
    "mhrice": {
      "name": "MHRice 086_08",
      "url": "https://mhrise.mhrice.info/monster/086_08.html"
    },
    "game8risen": {
      "name": "game8.jp 怪异克服天彗龙",
      "url": "https://game8.jp/mhrise/510928"
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
    "vidSakura": {
      "name": "YouTube 桜ころみん",
      "url": "https://www.youtube.com/watch?v=CnjsyIYvlKo"
    }
  },
  "weapon": "silver",
  "TEXT": {
    "home": {
      "key": [
        "打**翼足 45**（翼的根部）",
        "**怪气脉动**时打够伤害 → 大倒地并解除",
        "陨星俯冲（怪异版）：**连续紧急回避**"
      ],
      "checklist": [
        [
          "builds",
          "带 <b>刻银讨铳</b> 速射贯穿（视频里最常见）",
          "推荐配装"
        ],
        [
          "phase/1",
          "背熟<b>怪气脉动</b>的招式",
          "怪气脉动状态"
        ],
        [
          "status",
          "带<b>防护术</b>团子 / 吃绿色翔虫（game8 建议）",
          "异常与道具"
        ]
      ]
    },
    "map": {
      "key": [
        "肉质和神秘红光天彗龙**完全一样**",
        "打**翼足 45**；龙气时翼 45；吸气时胸 50",
        "身体 10：别打"
      ]
    },
    "builds": {
      "key": [
        "**刻银讨铳 速射贯穿**（视频里最常见）",
        "属性弹也能稳定打（桜ころみん）",
        "**龙属性无效**"
      ]
    },
    "status": {
      "key": [
        "异常耐性和神秘红光天彗龙一样",
        "game8 建议：团子 **防护术 Lv4**、**马加顿团子（不屈）**",
        "**陷阱无效**（古龙）"
      ]
    },
    "weaponNote": "怪异克服天彗龙<b>没有武器</b>，只有防具「赫耀·历」。名字带「赤绝」的武器是<b>神秘红光天彗龙</b>做的。"
  },
  "relatedEquip": [
    {
      "id": "em086_05",
      "label": "神秘红光天彗龙",
      "icon": "assets/monsters/em086_05/icon.png",
      "note": "神秘红光天彗龙：银蓝身体、红色喷射翼。名字带「赤绝」的武器都是它做的。"
    }
  ]
});
