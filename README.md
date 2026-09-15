# Ember Expedition · 余烬远征

A browser-based roguelike deckbuilder centered on tactical minion combat. Defeat 8 bosses, choose a 3-card pack after each victory, and shape your build with permanent buffs and powerful treasure cards.

以随从交互为核心的八关网页卡牌肉鸽。无需账号，无需安装游戏客户端。

## 在线游玩

**[点击开始远征 / Play Ember Expedition](https://ember-expedition-5jwyc6.v2.appdeploy.ai/)**

用电脑或手机浏览器打开即可。当前网站由 AppDeploy 托管，直接显示完整游戏，不需要下载 HTML。

- AppDeploy 应用 ID：`ember-expedition-5jwyc6`。
- 当前发布的游戏源码提交：[`fd8f212`](https://github.com/CLRedfield/ember-expedition/commit/fd8f21270d5882810ce91b69ca628963e0461514)。
- 发布时下载并校验固定提交中的源文件，随后将其作为网站自身的静态文件提供。游玩时不需要从 GitHub 加载代码。
- 此次发布是固定版本快照，**尚未配置 GitHub push 后自动重新部署**。后续修改游戏源码后，需要更新 AppDeploy 发布版本；仅修改本 README 不改变在线游戏。

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

本次发布前重新运行了全部 35 项规则测试并通过。对相同游戏源文件的本地 Chromium 交互检查覆盖了八关奖励、出牌、攻击、营地和响应式布局，没有记录到 JavaScript 异常。本地浏览器存储检查使用受控 Storage 适配器，不等同于所有真实浏览器的原生存储兼容性验证。

AppDeploy 最终状态为 `ready`，部署检查未报告前端或网络错误。部署状态返回的 `e2e_tests` 字段为空，因此不将已提交的五组线上验收方案记作全部执行通过。

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
