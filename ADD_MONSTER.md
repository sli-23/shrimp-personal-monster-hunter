# 新增一只怪物

不需要改 HTML 或 JS，只要加一个数据文件。

## 1. 抓数据（自动）
```bash
python3 -I tools/fetch_monster.py 072_08      # MHRice 怪物编号，网址 https://mhrise.mhrice.info/monster/<编号>.html
```
- 生成 `data/monsters/em<编号>.js`（`status: "draft"`）和 `assets/monsters/em<编号>/icon.png`
- 在 `data/monsters/index.js` 里登记（图鉴和搜索马上能看到，标「草稿」）
- 自动生成的部分：名字（中/日/英）、基础体力、各阶段肉质、异常耐性、MR 任务倍率、属性星级（按肉质估算）
- 回归检查：`python3 -I tools/fetch_monster.py 132_05 --dry-run` 的肉质和耐性应与 `em132_05.js` 一致

## 2. 渲染图 + 部位坐标
1. 透明背景渲染图放到 `assets/monsters/<id>/render.png`（monsterhunterwiki 的 `MHRS-<名字>_Render.png`）
2. `python3 -I tools/grid.py assets/monsters/<id>/render.png /tmp/grid.jpg`，看网格写坐标（百分比）
3. bundle 里写 `MAP: { render, aspect: "宽/高", spots: [[部位id, x, y], …] }`
4. 2D 热力图：写 `assets/monsters/<id>/seeds.json`（每个部位几个种子点），然后
   `python3 -I tools/make_partmap.py <id> --preview /tmp/pm.png`，看预览，分区不对就加种子点

## 3. 攻略内容（手写，必须带来源）
- `STATE_PAGES`：每个**行为状态**一页（`hzState` 指向肉质阶段）。固定 4 块：`see / dodge / hit / stand`，每行 ≤15 字，重点用 `**粗体**`
- `moves`：`n / tell / dodge / punish ("yes"|"no"|"?") / blood / src`；自己翻译的名字加 `yi: true`，推测加 `guess: true`
- `TEXT`：各页「要点」（不写就自动生成）
- `BUILDS`（`preset` = 计算器数值）、`FOLLOWERS`、`VIDEOS`（`python3 -I tools/yt.py "关键词" 10`；缩略图放 `assets/yt/<id>.jpg`）
- `UNVERIFIED`：所有没确认的东西
- 状态截图放 `assets/monsters/<id>/states/`，确认是**这只**怪物（变种和普通版长得不一样）

## 4. 完成
- bundle 和 `index.js` 里都改成 `status: "full"`，`updated` 写日期
- `node test/calc.test.mjs`
- `python3 -I tools/clickcheck.py`（0 个死按钮）
- `python3 -I tools/mobileshot.py /tmp/mob m/<id> m/<id>/map`（无横向溢出）
