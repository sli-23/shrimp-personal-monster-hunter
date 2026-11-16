/* 原初形态爵银龙 · Primordial Malzeno — 完整攻略数据（手工整理 + MHRice） */
MHR.registerMonster({
  "id": "em132_05",
  "status": "full",
  "updated": "2026-11-16",
  "weapon": "silver",
  "MONSTER": {
    "id": "em132_05",
    "name": "原初形态爵银龙",
    "nameAlt": "原初的爵银龙 · Primordial Malzeno · 原初を刻むメル・ゼナ",
    "icon": "assets/monsters/em132_05/icon.png",
    "type": "古龙种",
    "baseHP": 4500,
    "quests": [
      {
        "id": "mr6",
        "name": "MR6★ 复活之传说",
        "hpMul": 12.7,
        "atkMul": 14.7,
        "partMul": 14,
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
        "id": "hazard",
        "name": "MR6★ 烈祸袭来：原初异音！(烈祸)",
        "hpMul": 17,
        "atkMul": 21,
        "partMul": 24,
        "defMul": 1,
        "statusMul": {
          "stun": 3.1,
          "paralysis": 3.75,
          "sleep": 1
        },
        "src": "mhrice",
        "verified": false
      }
    ],
    "states": [
      {
        "id": 0,
        "name": "原初",
        "short": "原初",
        "guess": false,
        "color": "#c9c2b4",
        "desc": "未被啮生虫侵蚀的常态。像骑士一样用翼和尾巴连击。"
      },
      {
        "id": 1,
        "name": "血气觉醒",
        "short": "觉醒",
        "guess": true,
        "color": "#c2414b",
        "desc": "胸口、前肢、尾巴被啮生虫覆盖并发光，开始远程攻击，尾巴攻击会让猎人进入「噬血」。头、前肢、尾巴尖变软。"
      },
      {
        "id": 2,
        "name": "血气烈昂",
        "short": "烈昂",
        "guess": true,
        "color": "#e0612f",
        "desc": "侵蚀加剧，会瞬移，使用最强的啮生虫招式。全身多数部位变软（躯干、后肢、翼、尾巴都提高）。"
      },
      {
        "id": 3,
        "name": "血气蚀烈",
        "short": "蚀烈",
        "guess": true,
        "color": "#8f1d2c",
        "desc": "体力很低时进入，并一直持续到战斗结束，几乎不停连招。造成伤害无法让它平静。"
      }
    ],
    "parts": [
      {
        "id": "head",
        "name": "头部",
        "en": "Head",
        "hz": [
          {
            "sever": 46,
            "blunt": 48,
            "shot": 45,
            "fire": 15,
            "water": 0,
            "thunder": 0,
            "ice": 15,
            "dragon": 25,
            "stun": 100
          },
          {
            "sever": 55,
            "blunt": 58,
            "shot": 30,
            "fire": 15,
            "water": 0,
            "thunder": 0,
            "ice": 20,
            "dragon": 30,
            "stun": 100
          },
          {
            "sever": 55,
            "blunt": 58,
            "shot": 30,
            "fire": 15,
            "water": 0,
            "thunder": 0,
            "ice": 20,
            "dragon": 30,
            "stun": 100
          },
          {
            "sever": 55,
            "blunt": 58,
            "shot": 30,
            "fire": 15,
            "water": 0,
            "thunder": 0,
            "ice": 20,
            "dragon": 30,
            "stun": 100
          }
        ],
        "stagger": 400,
        "brk": 300,
        "note": "可破坏"
      },
      {
        "id": "torso",
        "name": "躯干",
        "en": "Torso",
        "hz": [
          {
            "sever": 32,
            "blunt": 30,
            "shot": 15,
            "fire": 10,
            "water": 0,
            "thunder": 0,
            "ice": 5,
            "dragon": 15,
            "stun": 0
          },
          {
            "sever": 32,
            "blunt": 30,
            "shot": 15,
            "fire": 10,
            "water": 0,
            "thunder": 0,
            "ice": 5,
            "dragon": 15,
            "stun": 0
          },
          {
            "sever": 45,
            "blunt": 45,
            "shot": 25,
            "fire": 10,
            "water": 0,
            "thunder": 0,
            "ice": 5,
            "dragon": 15,
            "stun": 0
          },
          {
            "sever": 32,
            "blunt": 30,
            "shot": 15,
            "fire": 10,
            "water": 0,
            "thunder": 0,
            "ice": 5,
            "dragon": 15,
            "stun": 0
          }
        ],
        "stagger": 350,
        "brk": null,
        "note": "不可破坏"
      },
      {
        "id": "foreleg",
        "name": "前肢",
        "en": "Foreleg",
        "hz": [
          {
            "sever": 45,
            "blunt": 40,
            "shot": 30,
            "fire": 10,
            "water": 0,
            "thunder": 0,
            "ice": 5,
            "dragon": 20,
            "stun": 0
          },
          {
            "sever": 58,
            "blunt": 55,
            "shot": 45,
            "fire": 15,
            "water": 0,
            "thunder": 0,
            "ice": 5,
            "dragon": 25,
            "stun": 0
          },
          {
            "sever": 58,
            "blunt": 55,
            "shot": 45,
            "fire": 15,
            "water": 0,
            "thunder": 0,
            "ice": 5,
            "dragon": 25,
            "stun": 0
          },
          {
            "sever": 58,
            "blunt": 55,
            "shot": 45,
            "fire": 15,
            "water": 0,
            "thunder": 0,
            "ice": 5,
            "dragon": 25,
            "stun": 0
          }
        ],
        "stagger": 250,
        "brk": 200,
        "note": "左右各自可破坏"
      },
      {
        "id": "hindleg",
        "name": "后肢",
        "en": "Hind Leg",
        "hz": [
          {
            "sever": 30,
            "blunt": 28,
            "shot": 5,
            "fire": 10,
            "water": 0,
            "thunder": 0,
            "ice": 5,
            "dragon": 15,
            "stun": 0
          },
          {
            "sever": 30,
            "blunt": 28,
            "shot": 5,
            "fire": 10,
            "water": 0,
            "thunder": 0,
            "ice": 5,
            "dragon": 15,
            "stun": 0
          },
          {
            "sever": 45,
            "blunt": 45,
            "shot": 20,
            "fire": 10,
            "water": 0,
            "thunder": 0,
            "ice": 5,
            "dragon": 15,
            "stun": 0
          },
          {
            "sever": 30,
            "blunt": 28,
            "shot": 5,
            "fire": 10,
            "water": 0,
            "thunder": 0,
            "ice": 5,
            "dragon": 15,
            "stun": 0
          }
        ],
        "stagger": 250,
        "brk": null,
        "note": "不可破坏"
      },
      {
        "id": "wing",
        "name": "翼",
        "en": "Wing",
        "hz": [
          {
            "sever": 22,
            "blunt": 22,
            "shot": 5,
            "fire": 10,
            "water": 0,
            "thunder": 0,
            "ice": 5,
            "dragon": 15,
            "stun": 0
          },
          {
            "sever": 22,
            "blunt": 22,
            "shot": 5,
            "fire": 10,
            "water": 0,
            "thunder": 0,
            "ice": 5,
            "dragon": 15,
            "stun": 0
          },
          {
            "sever": 35,
            "blunt": 35,
            "shot": 15,
            "fire": 10,
            "water": 0,
            "thunder": 0,
            "ice": 5,
            "dragon": 15,
            "stun": 0
          },
          {
            "sever": 22,
            "blunt": 22,
            "shot": 5,
            "fire": 10,
            "water": 0,
            "thunder": 0,
            "ice": 5,
            "dragon": 15,
            "stun": 0
          }
        ],
        "stagger": 320,
        "brk": 320,
        "note": "可破坏"
      },
      {
        "id": "tail",
        "name": "尾巴",
        "en": "Tail",
        "hz": [
          {
            "sever": 35,
            "blunt": 32,
            "shot": 10,
            "fire": 10,
            "water": 0,
            "thunder": 0,
            "ice": 5,
            "dragon": 15,
            "stun": 0
          },
          {
            "sever": 35,
            "blunt": 32,
            "shot": 10,
            "fire": 10,
            "water": 0,
            "thunder": 0,
            "ice": 5,
            "dragon": 15,
            "stun": 0
          },
          {
            "sever": 45,
            "blunt": 45,
            "shot": 20,
            "fire": 10,
            "water": 0,
            "thunder": 0,
            "ice": 5,
            "dragon": 15,
            "stun": 0
          },
          {
            "sever": 35,
            "blunt": 32,
            "shot": 10,
            "fire": 10,
            "water": 0,
            "thunder": 0,
            "ice": 5,
            "dragon": 15,
            "stun": 0
          }
        ],
        "stagger": 280,
        "brk": 280,
        "note": "只能用斩击切断（斩裂弹的刃是斩击）"
      },
      {
        "id": "tailtip",
        "name": "尾巴尖",
        "en": "Tail Tip",
        "hz": [
          {
            "sever": 26,
            "blunt": 22,
            "shot": 10,
            "fire": 10,
            "water": 0,
            "thunder": 0,
            "ice": 5,
            "dragon": 15,
            "stun": 0
          },
          {
            "sever": 50,
            "blunt": 48,
            "shot": 40,
            "fire": 10,
            "water": 0,
            "thunder": 0,
            "ice": 5,
            "dragon": 15,
            "stun": 0
          },
          {
            "sever": 50,
            "blunt": 48,
            "shot": 40,
            "fire": 10,
            "water": 0,
            "thunder": 0,
            "ice": 5,
            "dragon": 15,
            "stun": 0
          },
          {
            "sever": 50,
            "blunt": 48,
            "shot": 40,
            "fire": 10,
            "water": 0,
            "thunder": 0,
            "ice": 5,
            "dragon": 15,
            "stun": 0
          }
        ],
        "stagger": null,
        "brk": null,
        "note": "侵蚀后弹肉质 10 → 40"
      }
    ],
    "hzSrc": "mhrice+kiranico",
    "hzVerified": true,
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
        "el": "ice",
        "name": "冰",
        "stars": 1
      },
      {
        "el": "water",
        "name": "水",
        "stars": 0
      },
      {
        "el": "thunder",
        "name": "雷",
        "stars": 0
      }
    ],
    "status": [
      {
        "id": "poison",
        "name": "毒",
        "icon": "poison",
        "init": 250,
        "inc": 150,
        "max": 700,
        "dur": "15 秒，每秒 10 伤害（共 150）",
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
        "ok": true
      },
      {
        "id": "blast",
        "name": "爆破",
        "icon": "blast",
        "init": 70,
        "inc": 30,
        "max": 670,
        "dur": "每次爆炸 100 伤害",
        "ok": true
      },
      {
        "id": "stun",
        "name": "眩晕",
        "icon": "stun",
        "init": 300,
        "inc": 250,
        "max": 1200,
        "dur": "10 秒（只有头部能累积）",
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
        "ok": false
      }
    ],
    "statusDecay": "所有耐性每 10 秒衰减 5 点",
    "items": [
      {
        "name": "闪光弹",
        "ok": true,
        "note": "血气蚀烈时无效 (game8)"
      },
      {
        "name": "陷阱 / 音爆弹 / 肉",
        "ok": false,
        "note": "古龙种无效"
      }
    ],
    "misc": [
      {
        "k": "瘸腿阈值",
        "v": "9% 体力 (MR)"
      },
      {
        "k": "睡眠恢复",
        "v": "90 秒内恢复 5% 体力"
      },
      {
        "k": "怒时攻击",
        "v": "×1.15，防御不变 (×1)"
      },
      {
        "k": "血气烈昂·强制倒地",
        "v": "部位累计伤害 500 / 750 / 900 / 1200（推测为第 1–4 次）",
        "guess": true
      }
    ],
    "mhrice": "132_05",
    "en": "Primordial Malzeno",
    "ja": "原初を刻むメル・ゼナ",
    "special": {
      "title": "噬血状态（猎人身上）",
      "points": [
        "自然回复停止，体力慢慢流失",
        "回复道具的效果降低",
        "命中怪物会按伤害量回血：持续输出就是最好的「解药」",
        "造成足够伤害即可解除 (game8)",
        "技能「狂龙症【蚀】」：被噬血侵蚀后转为强化（克服状态）"
      ],
      "verified": false
    }
  },
  "MAP": {
    "render": "assets/monsters/em132_05/render.png",
    "aspect": "1358/644",
    "spots": [
      [
        "head",
        47,
        31
      ],
      [
        "torso",
        46,
        56
      ],
      [
        "foreleg",
        55,
        77
      ],
      [
        "foreleg",
        38,
        84
      ],
      [
        "wing",
        24,
        30
      ],
      [
        "wing",
        80,
        66
      ],
      [
        "hindleg",
        25,
        81
      ],
      [
        "tail",
        15,
        76
      ],
      [
        "tailtip",
        5,
        62
      ]
    ],
    "diagram": "winged_quadruped",
    "diagramMap": {
      "head": "head",
      "torso": "torso",
      "foreleg": "foreleg",
      "hindleg": "hindleg",
      "wing": "wing",
      "tail": "tail",
      "tailtip": "tailtip"
    },
    "piercePaths": [
      {
        "id": "front",
        "name": "正面：头 → 躯干 → 尾巴",
        "hits": {
          "head": 2,
          "torso": 3,
          "tail": 2
        }
      },
      {
        "id": "side",
        "name": "侧面：前肢 → 躯干 → 前肢",
        "hits": {
          "foreleg": 3,
          "torso": 2,
          "wing": 2
        }
      },
      {
        "id": "back",
        "name": "背面：尾巴尖 → 尾巴 → 躯干",
        "hits": {
          "tailtip": 2,
          "tail": 3,
          "torso": 2
        }
      },
      {
        "id": "single",
        "name": "理想：7 段全打在选中部位",
        "hits": null
      }
    ]
  },
  "TEXT": {
    "home": {
      "key": [
        "原初打**头**，血气觉醒以后打**前肢**（弹肉质 45）",
        "主力 **速射 LV2贯穿弹**；倒地时打 **贯穿灭龙弹 / 灭龙弹**",
        "最大输出窗口：**烈昂大爆炸后的跌落**"
      ],
      "checklist": [
        [
          "builds",
          "带 <b>刻银讨铳</b>（或高攻击的速射贯穿轻弩）",
          "推荐配装"
        ],
        [
          "status",
          "多带 <b>回复药</b>（噬血会降低回复）；<b>闪光弹</b>在蚀烈前有用",
          "异常与道具"
        ],
        [
          "videos",
          "先看 1 分钟 <b>官方预告</b>，认清 4 个状态长什么样",
          "视频"
        ]
      ]
    },
    "map": {
      "key": [
        "原初：打**头 (45)**",
        "觉醒 / 烈昂 / 蚀烈：打**前肢 (45)**，尾巴尖 40",
        "翼和后肢只有 **5**：别把子弹浪费在这里"
      ]
    },
    "builds": {
      "key": [
        "主力：**刻银讨铳 · 物理贯穿**",
        "**雷、水**肉质全身 0：雷贯 / 水贯轻弩无效",
        "点「套用到计算器」可以直接看伤害"
      ]
    },
    "status": {
      "key": [
        "**毒 / 麻痹 / 睡眠 / 爆破 / 眩晕**有效，**减气无效**",
        "**陷阱、音爆、肉**无效；闪光弹在蚀烈前有效",
        "被「**噬血**」：继续输出就能回血并解除"
      ]
    },
    "weaponNote": "<b>刻银讨铳</b> 不是普通爵银龙的武器：它在「爵银龙衍生改」这条线的最后，但锻造要用<b>原初形态爵银龙</b>的素材（原初的宠鳞、刻冥的龙血玉 等），MR6★ 解锁。"
  },
  "STATE_PAGES": [
    {
      "state": 0,
      "title": "原初",
      "img": "assets/monsters/em132_05/states/normal.jpg",
      "imgCap": "原初状态：银白身体 + 紫色翼膜（Steam 官方截图）",
      "key": [
        "弱点是**头 (45)**",
        "交叉斩要**往它身前**闪",
        "被冲撞→**翔虫受身往侧边**"
      ],
      "see": [
        "银白身体、**紫色翼膜**",
        "身上**没有红光**"
      ],
      "dodge": [
        "**交叉斩**：向前闪，别往侧后",
        "**冲撞→尾刺**：吃冲撞后侧向受身",
        "**尾扫 / 尾刺**分不清 → 多滚一次"
      ],
      "hit": [
        "招式结束后**打头**",
        "灭龙弹也打头（龙 25）"
      ],
      "stand": [
        "正面**斜前 30–45°**",
        "别站正后方"
      ],
      "moves": [
        {
          "n": "翼盾冲撞 → 尾刺",
          "yi": true,
          "tell": "翼像盾一样向前冲，范围宽",
          "dodge": "被撞到就**翔虫受身往侧边**，追击的尾刺会落空",
          "punish": "?",
          "blood": false,
          "src": "game8jp"
        },
        {
          "n": "翼刺 → 横扫",
          "yi": true,
          "tell": "单翼往前刺，接着横扫",
          "dodge": "**侧闪**刺击；近就贴上去，远就拉开",
          "punish": "yes",
          "blood": false,
          "src": "game8jp"
        },
        {
          "n": "尾扫",
          "yi": true,
          "tell": "起手和尾刺很像",
          "dodge": "近 → 钻到身下；远 → 走开；**多滚一次**保险",
          "punish": "?",
          "blood": false,
          "src": "game8jp"
        },
        {
          "n": "双翼交叉斩",
          "yi": true,
          "tell": "两翼交叉斩两次，左右后都很宽",
          "dodge": "**向前（朝怪物）**闪；往侧面或后面会被打到",
          "punish": "yes",
          "blood": false,
          "src": "game8jp"
        }
      ]
    },
    {
      "state": 1,
      "title": "血气觉醒",
      "img": "assets/monsters/em132_05/states/bloodening.jpg",
      "imgCap": "血气觉醒：胸口与两只前肢附着红色啮生虫（YouTube 截图）",
      "key": [
        "改打**前肢 (45)**",
        "尾巴攻击附带**噬血**",
        "打够伤害 → **大倒地**，回到原初"
      ],
      "see": [
        "**胸口、前肢、尾巴**发红光",
        "周围飘**红色粒子**"
      ],
      "dodge": [
        "新增**远程**：火球、吐息、风刃",
        "**尾一闪**：最强尾击 + 噬血 20 秒",
        "吐息留下**龙卷**，别站里面"
      ],
      "hit": [
        "打**发光的前肢**",
        "尾巴尖也变软（40）",
        "累积伤害 → 强制倒地"
      ],
      "stand": [
        "站**侧面**",
        "贯穿弹**穿过两只前肢**"
      ],
      "moves": [
        {
          "n": "超火球",
          "yi": true,
          "tell": "龙属性大火球",
          "dodge": "横向翻滚；要挡需要**强化防御**",
          "punish": "?",
          "blood": false,
          "src": "mhrice"
        },
        {
          "n": "蓄力吐息",
          "yi": true,
          "tell": "蓄力后吐出，留下持续区域和龙卷",
          "dodge": "离开区域，**别站龙卷里**",
          "punish": "?",
          "blood": false,
          "src": "mhrice"
        },
        {
          "n": "火焰放射 / 乱舞放射",
          "yi": true,
          "tell": "龙属性光束扫射",
          "dodge": "往光束扫来方向的**外侧**走",
          "punish": "?",
          "blood": false,
          "src": "mhrice"
        },
        {
          "n": "血镰",
          "yi": true,
          "tell": "血红色镰刃",
          "dodge": "侧闪（龙属性异常 20 秒）",
          "punish": "?",
          "blood": false,
          "src": "mhrice"
        },
        {
          "n": "啮生虫风刃",
          "yi": true,
          "tell": "飞出风刃",
          "dodge": "侧闪",
          "punish": "?",
          "blood": true,
          "src": "mhrice"
        },
        {
          "n": "尾一闪",
          "yi": true,
          "tell": "最强单发尾击（110 伤害）",
          "dodge": "**远离尾巴**",
          "punish": "?",
          "blood": true,
          "src": "mhrice"
        }
      ]
    },
    {
      "state": 2,
      "title": "血气烈昂",
      "img": "assets/monsters/em132_05/states/bloodrage.jpg",
      "imgCap": "烈昂大招：升空后地面落下啮生虫陨石（YouTube 截图）",
      "imgGuess": true,
      "key": [
        "大招最后**紧急回避**",
        "爆炸后**跌落倒地** = 最大输出窗口",
        "全身变软 → **贯穿弹**最赚"
      ],
      "see": [
        "会**瞬移**",
        "红光更强，招式更凶"
      ],
      "dodge": [
        "**大招**：升空 → 陨石 + 地面冲击 → 瞬移头顶 → **大爆炸**",
        "陨石阶段**一直跑**",
        "最后爆炸**紧急回避**（不可防）"
      ],
      "hit": [
        "爆炸后它会**跌落**",
        "全身肉质变软",
        "速射**前肢**或贯穿全身"
      ],
      "stand": [
        "大招时离开地面能量",
        "跌落后马上**贴近到会心距离**"
      ],
      "moves": [
        {
          "n": "大招：陨石 → 大爆炸",
          "yi": true,
          "tell": "飞上天，地面落下啮生虫陨石和冲击波，然后瞬移到头顶",
          "dodge": "陨石阶段**一直跑动**；最后爆炸**紧急回避**（150 伤害，不可防御）",
          "punish": "yes",
          "blood": true,
          "src": "mhrice"
        },
        {
          "n": "追踪啮生虫",
          "yi": true,
          "guess": true,
          "tell": "啮生虫会追着人飞",
          "dodge": "横向跑动拉开",
          "punish": "?",
          "blood": true,
          "src": "mhrice"
        },
        {
          "n": "范围吸血",
          "yi": true,
          "guess": true,
          "tell": "地面冲击波向外扩散",
          "dodge": "离开范围；要挡需**强化防御**",
          "punish": "?",
          "blood": true,
          "src": "mhrice"
        },
        {
          "n": "多重激光",
          "yi": true,
          "guess": true,
          "tell": "三道光束",
          "dodge": "**站光束之间**，不可防御",
          "punish": "?",
          "blood": true,
          "src": "mhrice"
        }
      ]
    },
    {
      "state": 3,
      "title": "血气蚀烈",
      "img": "assets/monsters/em132_05/states/bloodlust.jpg",
      "imgCap": "血气蚀烈：翼与全身发出橙红光（monsterhunterwiki 截图）",
      "key": [
        "连招不停，**别贪**",
        "新星爆发后**痛苦挣扎** = 输出窗口",
        "**闪光弹无效**"
      ],
      "see": [
        "体力很低时进入，**不会再退出**",
        "**翼发出橙红光**"
      ],
      "dodge": [
        "**起跳 → 双翼砸地**：地上出现能量圈",
        "→ 去**没有能量**的位置",
        "连招结尾：地面 / 空中**新星爆发**"
      ],
      "hit": [
        "新星后它会**痛苦挣扎**",
        "这时打**前肢或头**"
      ],
      "stand": [
        "保持**中距离**",
        "连招中只躲不打"
      ],
      "moves": [
        {
          "n": "起跳 → 双翼砸地",
          "yi": true,
          "tell": "起跳时地上出现圆形能量场",
          "dodge": "移到**没有能量**的地方；进了圈就回避砸地",
          "punish": "?",
          "blood": true,
          "src": "game8jp"
        },
        {
          "n": "新星爆发",
          "yi": true,
          "tell": "长连招的结尾，地面或空中爆发",
          "dodge": "提前拉开距离",
          "punish": "yes",
          "blood": true,
          "src": "mhwiki"
        },
        {
          "n": "血之火焰",
          "yi": true,
          "tell": "向外三波火焰，身后也会被打到",
          "dodge": "往远处跑，别站身后",
          "punish": "?",
          "blood": false,
          "src": "fextra"
        }
      ]
    }
  ],
  "BUILDS": [
    {
      "id": "pierce",
      "short": "物理贯穿",
      "title": "刻银讨铳 · 物理贯穿",
      "weapon": "刻银讨铳（原初形态爵银龙轻弩）",
      "stats": "攻击 320 · 会心 0% · 速射：LV2贯穿弹 / 灭龙弹 / 贯穿灭龙弹 / 斩裂弹",
      "skills": [
        "攻击 7",
        "看破 7",
        "弱点特效 2",
        "超会心 3",
        "贯穿弹・贯穿箭强化 2",
        "速射强化 3",
        "弹丸节约 3",
        "精神抖擞 3",
        "伏魔耗命 3",
        "连击 3",
        "装填速度 3",
        "减轻后坐力 3",
        "零件改造 1",
        "因祸得福 1",
        "狂龙症【蚀】1"
      ],
      "why": "game8 推荐的通用轻弩配装。速射 LV2贯穿弹 是主力。对这只龙有个问题：翼和后肢的弹肉质只有 5，贯穿弹的段数会浪费在硬部位上，所以要从侧面打穿前肢，或在「烈昂」全身变软时打。",
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
      "src": "game8lbg"
    },
    {
      "id": "dragon",
      "short": "速射灭龙",
      "title": "刻银讨铳 · 速射灭龙弹",
      "weapon": "同一把刻银讨铳",
      "stats": "灭龙弹速射 2 发：头的龙肉质 25–30，前肢 20–25",
      "skills": [
        "龙属性攻击强化 5",
        "会心击【属性】3",
        "速射强化 3",
        "攻击 / 看破 补满"
      ],
      "why": "龙属性是唯一有效的属性 (★3)。灭龙弹的物理动作值本身就有 48，同时吃物理和属性。灭龙弹只能带 2 发，适合在大硬直窗口打出去。",
      "preset": {
        "atk": 320,
        "aff": 0,
        "attack": 4,
        "critEye": 4,
        "wex": 0,
        "critBoost": 0,
        "rapidUp": 3,
        "dragonAtk": 5,
        "critEle": 3,
        "extraAff": 30,
        "extraAtk": 0
      },
      "src": "推测（伤害依据 MHR-Damage 公式）",
      "guess": true
    },
    {
      "id": "normal",
      "short": "通常弹",
      "title": "通常弹 / 散弹 打弱点",
      "weapon": "任意速射 LV2通常弹 的高攻轻弩",
      "stats": "原初阶段打头 (45)，侵蚀后打前肢 (45)",
      "skills": [
        "攻击 7",
        "看破 7",
        "弱点特效 3",
        "超会心 3",
        "通常弹・连射箭强化 3",
        "速射强化 3"
      ],
      "why": "单点命中，所有伤害都落在 45 的弱点上，弱点特效能吃满。打法简单，对瞄准要求高。",
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
      "src": "推测",
      "guess": true
    }
  ],
  "FOLLOWERS": {
    "quest": {
      "name": "灭净制裁",
      "en": "Harbinger of Destruction",
      "rank": "MR6★ 紧急任务（MR10 解锁）",
      "giver": "提督加雷亚斯",
      "fixed": "菲奥莱娜（Fiorayne）· 片手剑",
      "src": "https://mhrise.mhrice.info/quest/405602.html"
    },
    "pick": [
      {
        "n": "Hinoa",
        "ja": "ヒノエ",
        "w": "狩猎笛",
        "role": "回复 · 攻防强化 · 生命粉尘",
        "why": "噬血会让回复变差，有人帮你奶最省心",
        "tier": "S"
      },
      {
        "n": "Utsushi",
        "ja": "ウツシ教官",
        "w": "狩猎笛",
        "role": "攻击 / 属性攻击强化 · 属性异常无效",
        "why": "game8 评价和弩很搭；灭龙弹吃属性强化",
        "tier": "S"
      }
    ],
    "alt": [
      {
        "n": "Minoto",
        "ja": "ミノト",
        "w": "狩猎笛",
        "role": "守护 · 耐力 · 音障",
        "tier": "A"
      },
      {
        "n": "Luchika",
        "ja": "ルーチカ",
        "w": "重弩",
        "role": "黏着弹 / 状态弹，不回复",
        "tier": "A"
      }
    ],
    "avoid": [
      {
        "n": "Rondine",
        "why": "她的陷阱对这只龙无效（落穴、麻痹陷阱、音爆都没用）"
      },
      {
        "n": "3 个狩猎笛",
        "why": "game8：三笛一起配合不好"
      }
    ],
    "note": "游戏内中文名只确认了菲奥莱娜、提督加雷亚斯；其他用日文 / 英文名。",
    "tierSrc": "https://game8.jp/mhrise/454177"
  },
  "VIDEOS": [
    {
      "group": "先认识它",
      "items": [
        {
          "id": "l3z8oj9koPo",
          "t": "官方预告：原初形态爵银龙",
          "ch": "Monster Hunter (CAPCOM)",
          "len": "1:15",
          "lang": "英",
          "star": true,
          "why": "1 分钟看清它的样子和血气状态"
        },
        {
          "id": "7DbTIIiLjTI",
          "t": "原初爵银龙 登场动画",
          "ch": "MonsterSlayer Squad",
          "len": "1:01",
          "lang": "—",
          "why": "第一次见面的过场"
        }
      ]
    },
    {
      "group": "招式 / 怎么躲",
      "items": [
        {
          "id": "OgOdMS7i9PU",
          "t": "原初メルゼナ 确定行动 + 躲法（弓视角讲解）",
          "ch": "時雨ミト",
          "len": "4:26",
          "lang": "日",
          "star": true,
          "why": "远程武器视角，短，讲长连招怎么躲"
        },
        {
          "id": "ETCJQDX3iuc",
          "t": "原初メルゼナ 极恶连招，背下来就能躲",
          "ch": "駆矢/カヤちゃんねる",
          "len": "6:31",
          "lang": "日",
          "why": "专讲连招顺序"
        },
        {
          "id": "ZCBhypIO7QQ",
          "t": "Primordial Malzeno moveset breakdown",
          "ch": "Just_a_guy",
          "len": "12:06",
          "lang": "英",
          "why": "逐招拆解"
        }
      ]
    },
    {
      "group": "轻弩实战 / 配装",
      "items": [
        {
          "id": "2zttEwdQdVk",
          "t": "原初爵银轻弩配装 · 最强贯通速射 + 烈祸实战 5'27",
          "ch": "綠茶 GameLab",
          "len": "12:20",
          "lang": "中",
          "star": true,
          "why": "中文，正好讲刻银讨铳"
        },
        {
          "id": "E9pdzQlPu-E",
          "t": "原初メルゼナ 超简单打法，贯通速射轻弩也能轻松过",
          "ch": "とかげーむ ch.",
          "len": "18:58",
          "lang": "日",
          "why": "新手向，31 万播放"
        },
        {
          "id": "5bQ4IHByW1c",
          "t": "烈祸 原初メルゼナ 2'29 轻弩 贯通灭龙弹 无盟友",
          "ch": "SS 6987",
          "len": "3:47",
          "lang": "—",
          "why": "贯通灭龙弹的实战上限"
        },
        {
          "id": "p26CwwcS-Dk",
          "t": "原初を刻むメル・ゼナ 单人 4'13 轻弩",
          "ch": "チョコ(choco)",
          "len": "5:33",
          "lang": "—",
          "why": "看高手站位和速射时机"
        },
        {
          "id": "91my1wCvE-I",
          "t": "原初爵银龙 4'14 贯通弹速射 轻弩",
          "ch": "DoWhatAr Ch.",
          "len": "5:27",
          "lang": "粤",
          "why": "贯通速射完整一场"
        },
        {
          "id": "ZsDaff_2a1k",
          "t": "刻銀の討銃 强不强？与 ヴァイス 比较 + 配装",
          "ch": "皆で一緒にモンハンライフ",
          "len": "5:58",
          "lang": "日",
          "why": "武器选择"
        },
        {
          "id": "8MBYOJVF9Sc",
          "t": "最终版本 散弹速射轻弩 原初メルゼナ 3 分",
          "ch": "やぎこ",
          "len": "8:08",
          "lang": "日",
          "why": "散弹流派"
        },
        {
          "id": "mcVpC19hOTc",
          "t": "Final Update Pierce LBG build vs Primordial Malzeno",
          "ch": "Taneomi",
          "len": "3:33",
          "lang": "英",
          "why": "英文配装"
        },
        {
          "id": "6CKVe4YTrLQ",
          "t": "Hazard Primordial Malzeno 6:40 LBG",
          "ch": "Hawa",
          "len": "7:18",
          "lang": "—",
          "why": "烈祸难度的轻弩打法"
        }
      ]
    }
  ],
  "UNVERIFIED": [
    "肉质阶段 1–3 分别对应哪个状态：MHRice 只给编号，本页按攻略描述推测（觉醒 / 烈昂 / 蚀烈）。",
    "噬血状态的流血速度、吸血比例：没有找到数值。",
    "推荐配装中标「推测」的两套：按公式推演，不是攻略站给出的配装。",
    "招式的中文名大多是按日文数据名意译（标「译」），不是游戏内官方译名。",
    "烈昂阶段的招式归属：MHRice 只标了【強】，按攻略描述推测属于烈昂。",
    "盟友推荐（Hinoa + Utsushi）：依据 game8 的通用盟友评级推导，没有找到针对这只龙的共识。"
  ],
  "SOURCES": {
    "mhrice": {
      "name": "MHRice 132_05",
      "url": "https://mhrise.mhrice.info/monster/132_05.html"
    },
    "kiranico": {
      "name": "Kiranico MHRise 数据库",
      "url": "https://mhrise.kiranico.com/data/monsters/1301934382"
    },
    "game8jp": {
      "name": "game8.jp 攻略",
      "url": "https://game8.jp/mhrise/534170"
    },
    "mhwiki": {
      "name": "monsterhunterwiki.org",
      "url": "https://monsterhunterwiki.org/wiki/Primordial_Malzeno_(MHRS)"
    },
    "fextra": {
      "name": "Fextralife wiki",
      "url": "https://monsterhunterrise.wiki.fextralife.com/Primordial+Malzeno"
    },
    "weapon": {
      "name": "MHRice 刻银讨铳",
      "url": "https://mhrise.mhrice.info/weapon/LightBowgun_465.html"
    },
    "game8lbg": {
      "name": "game8.jp 轻弩配装",
      "url": "https://game8.jp/mhrise/465103"
    }
  }
});
