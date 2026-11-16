# 数据来源 · Sources

| 数据 | 来源 | 状态 |
|---|---|---|
| 肉质（4 个阶段）、部位耐久、异常耐性、任务倍率、中文官方名 | MHRice v16.0.0 https://mhrise.mhrice.info/monster/132_05.html | 与 Kiranico 交叉确认 |
| 肉质、体力 | Kiranico https://mhrise.kiranico.com/data/monsters/1301934382 | 与 MHRice 一致 |
| 刻银讨铳 面板、弹药与速射 | MHRice https://mhrise.mhrice.info/weapon/LightBowgun_465.html | 已确认 |
| 技能中文名 | MHRice https://mhrise.mhrice.info/skill.html | 已确认 |
| 弹药动作值、伤害公式、技能倍率 | MHR-Damage https://github.com/stonesan101/MHR-Damage (docs/loading/loading.js, docs/main.js) | 单一来源（开源计算器） |
| 技能数值 | Kiranico https://mhrise.kiranico.com/data/skills | 已确认 |
| 阶段行为、配装 | game8.jp https://game8.jp/mhrise/534170, https://game8.jp/mhrise/465103 ; monsterhunterwiki.org ; Fextralife | 攻略描述 |

## 图标
- `assets/icons/*.png`（元素、异常、王冠、怪物图标 em132_05）来自 MHRice `resources/`
- `assets/icons/hit_*.png` 来自 Kiranico CDN
- `assets/icons/ammo_*.png` 由 MHRice 的道具遮罩图层（`item/0xx.r.png` 和 `.a.png`）按游戏内道具颜色合成
- 所有游戏素材版权归 CAPCOM 所有，本页只作个人、非商业的攻略参考

## 未验证
见页面底部「未验证 / 推测」，与 `data.js` 中的 `UNVERIFIED` 一致。
