# Ember Expedition · 余烬远征

A browser-based roguelike deckbuilder centered on tactical minion combat. Defeat 8 bosses, choose a 3-card pack after each victory, and shape your build with permanent buffs and powerful treasure cards.

以随从交互为核心的八关网页卡牌肉鸽。无需账号，无需安装游戏客户端。

## 游戏内容

- 3 种起始职业：铁誓守卫、林契行者、星祷术师。
- 56 张可收集卡牌，包含 6 张独特宝藏；另有战斗生成牌与首领专属牌。
- 8 个首领，每关胜利从三组奖励中选取一整组 3 张牌。
- 第 2、5 关额外选择永久增益，第 4、7 关额外选择宝藏。
- 营地回血、删牌或永久减费；3 档难度、起手换牌、有限重试。
- 嘲讽、圣盾、突袭、冲锋、亡语、战吼、吸血、冻结和邻位光环。
- 自动存档、JSON 存档导入导出、固定种子和战术提示。

## 本地运行

直接用现代浏览器打开根目录 `index.html` 即可。也可启动静态服务器：

```sh
python3 -m http.server 8000
```

打开 `http://localhost:8000`。本项目没有运行时外部依赖，插画由 `src/art.js` 中的原创 SVG 绘制，音效由 Web Audio 合成。

生成可单独分发的离线 HTML：

```sh
python3 build.py
```

## 操作

点击手牌，再点击绿色「＋」选择召唤站位。点击绿色描边随从，再点击红色目标攻击。点击英雄技能后按提示选择目标。空格结束回合，Esc 取消选择。手机可使用点击操作，手牌区可横向滑动。

## 测试

```sh
node tests/rules.test.cjs
```

35 项规则测试覆盖随从交战、关键词、位置光环、费用与场面限制、全部卡牌、八关奖励、营地、重试与存档。自动化测试不等于所有浏览器和所有操作下的零缺陷保证。

## 结构

```text
index.html          网页入口
src/data.js         卡牌、首领、职业、增益和奖励数据
src/engine.js       无 DOM 的确定性规则引擎
src/art.js          原创矢量插画
src/style.css       桌面与手机界面样式
src/ui.js           交互、动画、音效、存档和本地对手决策调度
tests/rules.test.cjs 规则回归测试
build.py            离线单文件构建
```

存档仅保存在当前浏览器和当前网站来源，不会自动跨设备同步。从离线文件迁移至在线站点时，请先导出 JSON 再导入。为兼容既有存档，内部存储键保留原型时期的 `emberbound` 前缀；公开游戏名称为 Ember Expedition。

## License

MIT. See [LICENSE.txt](LICENSE.txt).
