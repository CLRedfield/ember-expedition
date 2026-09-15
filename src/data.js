/* 余烬远征 / Ember Expedition: original card and encounter data. No external assets. */
(function (root) {
'use strict';
const C = {};
function card(id,name,cost,atk,hp,text,extra={}) {
  C[id]={id,name,cost,atk,hp,text,type:atk==null?'spell':'minion',set:'neutral',rarity:'common',tribe:'旅者',art:atk==null?'rune':'knight',tags:[],...extra};
}
// Shared expedition cards.
card('squire','持盾新兵',1,1,3,'嘲讽。',{tags:['taunt'],art:'guard',tribe:'军团'});
card('scout','林地斥候',1,2,1,'战吼：为你的英雄恢复2点生命。',{effect:'heal2',art:'ranger'});
card('page','寻路学徒',2,2,2,'战吼：抽一张牌。',{effect:'draw1',art:'mage'});
card('wolf','灰鬃狼',2,3,2,'突袭。',{tags:['rush'],tribe:'野兽',art:'wolf'});
card('medic','战地医师',2,2,3,'战吼：为你的英雄恢复3点生命。',{effect:'heal3',art:'healer'});
card('archer','暮色游侠',3,3,3,'战吼：对生命最低的敌方随从造成2点伤害。',{effect:'snipe2',art:'ranger'});
card('guard','石墙卫士',3,2,5,'嘲讽。',{tags:['taunt'],tribe:'军团',art:'guard'});
card('banner','旗帜队长',3,2,4,'相邻的友方随从获得+1攻击力。',{aura:'adj1',rarity:'rare',tribe:'军团',art:'banner'});
card('boar','碎岩野猪',3,4,3,'突袭。',{tags:['rush'],tribe:'野兽',art:'boar'});
card('scholar','古卷学者',4,3,4,'战吼：抽两张牌。',{effect:'draw2',rarity:'rare',art:'mage'});
card('knight','白银骑士',4,3,5,'圣盾。',{tags:['shield'],tribe:'军团',art:'knight'});
card('ogre','山岭巨人',5,5,7,'嘲讽。',{tags:['taunt'],art:'golem'});
card('drake','烬翼幼龙',5,4,5,'战吼：对所有敌方随从造成1点伤害。',{effect:'aoe1',rarity:'rare',tribe:'龙',art:'dragon'});
card('champion','远征先锋',6,6,6,'突袭。战吼：抽一张牌。',{tags:['rush'],effect:'draw1',rarity:'epic',tribe:'军团',art:'knight'});
card('bolt','星火箭',1,null,null,'对一个敌人造成2点伤害。',{effect:'bolt2',target:'enemy',art:'flame'});
card('mend','复苏之光',1,null,null,'恢复一个友方角色5点生命。抽一张牌。',{effect:'mend',target:'friendly',art:'healer'});
card('rally','吹响号角',3,null,null,'使所有友方随从获得+1/+1。',{effect:'rally',art:'banner'});
card('insight','秘境研习',2,null,null,'抽两张牌。',{effect:'draw2',art:'rune'});
// Iron oath: shield, position, sustained board pressure.
card('iron_novice','铁誓侍从',1,1,2,'圣盾。',{set:'iron',tags:['shield'],tribe:'军团',art:'knight'});
card('blacksmith','营地铁匠',2,2,3,'战吼：使相邻随从获得+1/+1。',{set:'iron',effect:'neighbors',tribe:'军团',art:'smith'});
card('defender','誓约守卫',3,2,4,'嘲讽。圣盾。',{set:'iron',tags:['taunt','shield'],rarity:'rare',tribe:'军团',art:'guard'});
card('armorer','铸甲大师',3,3,4,'战吼：使你的英雄获得4点护甲。',{set:'iron',effect:'armor4',tribe:'军团',art:'smith'});
card('captain','钢翼统领',4,3,5,'你的其他军团随从获得+1攻击力。',{set:'iron',aura:'legion1',rarity:'rare',tribe:'军团',art:'banner'});
card('paladin','晨光圣骑',5,4,6,'吸血。',{set:'iron',tags:['lifesteal'],rarity:'rare',tribe:'军团',art:'knight'});
card('marshal','破阵元帅',6,5,6,'突袭。战吼：使其他友方随从获得+1/+1。',{set:'iron',tags:['rush'],effect:'buffOthers',rarity:'epic',tribe:'军团',art:'knight'});
card('bastion','不屈壁垒',7,5,9,'嘲讽。圣盾。',{set:'iron',tags:['taunt','shield'],rarity:'epic',tribe:'军团',art:'golem'});
card('recruit','紧急征募',2,null,null,'召唤两个1/2并具有嘲讽的卫兵。',{set:'iron',effect:'recruit',art:'banner'});
card('blessing','誓约加护',2,null,null,'使一个友方随从获得+2/+2和圣盾。',{set:'iron',effect:'blessing',target:'friendlyMinion',rarity:'rare',art:'rune'});
// Grove pact: beasts and deathrattles.
card('egg','荆棘之卵',1,0,2,'亡语：召唤一只3/2的幼兽。',{set:'grove',death:'hatch',tribe:'野兽',art:'egg'});
card('cub','林间幼兽',1,2,2,'野兽。',{set:'grove',tribe:'野兽',art:'wolf'});
card('spider','孢丝母蛛',2,2,2,'亡语：召唤两个1/1的小蜘蛛。',{set:'grove',death:'spiders',tribe:'野兽',art:'spider'});
card('tender','林泉看护者',3,2,5,'回合结束：为你的英雄恢复2点生命。',{set:'grove',end:'heal2',art:'healer'});
card('packleader','灰鬃头狼',3,3,4,'你的其他野兽获得+1攻击力。',{set:'grove',aura:'beast1',rarity:'rare',tribe:'野兽',art:'wolf'});
card('stag','月角灵鹿',4,4,4,'亡语：抽两张牌。',{set:'grove',death:'draw2',rarity:'rare',tribe:'野兽',art:'stag'});
card('bear','铁皮巨熊',4,3,6,'嘲讽。',{set:'grove',tags:['taunt'],tribe:'野兽',art:'bear'});
card('brood','兽群呼唤者',5,3,4,'战吼：召唤两只2/2的幼兽。',{set:'grove',effect:'cubs',rarity:'rare',art:'ranger'});
card('elder','古林长老',6,5,6,'嘲讽。亡语：召唤一个3/3的树灵。',{set:'grove',tags:['taunt'],death:'sapling',rarity:'epic',art:'tree'});
card('alpha','啸月兽王',7,7,7,'突袭。战吼：使其他友方野兽获得+1/+1。',{set:'grove',tags:['rush'],effect:'beastBuff',rarity:'epic',tribe:'野兽',art:'wolf'});
card('roots','野性滋长',2,null,null,'使一个友方随从获得+2/+3和嘲讽。',{set:'grove',effect:'roots',target:'friendlyMinion',art:'tree'});
// Astral covenant: battlecries and spell/minion interactions.
card('spark','星火使徒',1,1,3,'每当你施放法术，获得+1/+1。',{set:'astral',onSpell:'grow',art:'mage'});
card('wispkeeper','萤灯守护者',2,2,3,'亡语：抽一张牌。',{set:'astral',death:'draw1',art:'mage'});
card('arcanist','棱光术师',3,3,3,'战吼：对生命最低的敌方随从造成3点伤害。',{set:'astral',effect:'snipe3',rarity:'rare',art:'mage'});
card('frostguard','霜晶卫士',3,2,5,'嘲讽。亡语：对一个随机敌方随从造成2点伤害。',{set:'astral',tags:['taunt'],death:'zap2',art:'golem'});
card('weaver','星纹织者',4,3,5,'每回合你施放的第一个法术使你抽一张牌。',{set:'astral',onSpell:'drawFirst',rarity:'rare',art:'mage'});
card('sentinel','观星构装体',4,4,5,'回合结束：对一个随机敌方随从造成1点伤害。',{set:'astral',end:'zap1',art:'golem'});
card('oracle','月镜先知',5,4,5,'战吼：使你手牌中所有法术的费用减少1点。',{set:'astral',effect:'discountSpells',rarity:'rare',art:'mage'});
card('stormdrake','风暴星龙',6,5,6,'战吼：对所有敌方随从造成2点伤害。',{set:'astral',effect:'aoe2',rarity:'epic',tribe:'龙',art:'dragon'});
card('archmage','穹顶大法师',7,6,7,'战吼：抽两张牌。获得2点法力水晶（仅本回合）。',{set:'astral',effect:'archmage',rarity:'epic',art:'mage'});
card('frost','寒星凝滞',2,null,null,'对一个敌方随从造成3点伤害，并冻结它。',{set:'astral',effect:'frost',target:'enemyMinion',art:'rune'});
card('nova','群星坠落',4,null,null,'对所有敌方随从造成3点伤害。',{set:'astral',effect:'aoe3',rarity:'rare',art:'rune'});
// Six unique treasure cards; earned after gates 4 and 7.
card('t_flag','王者圣旗',4,2,8,'嘲讽。相邻友军+2攻击。战吼：其他友军+1/+1。',{set:'treasure',rarity:'legendary',tags:['taunt'],aura:'adj2',effect:'buffOthers',tribe:'军团',art:'banner'});
card('t_crown','群星冠冕',5,null,null,'使所有友方随从获得+2/+2和圣盾。',{set:'treasure',rarity:'legendary',effect:'crown',art:'crown'});
card('t_phoenix','不灭的余烬',7,6,6,'冲锋。亡语：召唤一只3/3并具有突袭的余烬雏鸟。',{set:'treasure',rarity:'legendary',tags:['charge'],death:'phoenix',tribe:'野兽',art:'phoenix'});
card('t_hourglass','时序沙漏',4,null,null,'使所有友军获得圣盾，解除冻结，并可立即再次攻击。抽一张牌。',{set:'treasure',rarity:'legendary',effect:'hourglass',art:'hourglass'});
card('t_forge','远古锻炉',6,4,8,'嘲讽。回合结束：召唤一个2/3并具有嘲讽的铁卫。',{set:'treasure',rarity:'legendary',tags:['taunt'],end:'forge',art:'smith'});
card('t_seed','世界树之种',4,0,6,'嘲讽。亡语：召唤一个8/8并具有嘲讽的世界树化身。',{set:'treasure',rarity:'legendary',tags:['taunt'],death:'ancient',art:'tree'});
// Generated tokens and exclusive encounter cards.
card('tok_guard','远征卫兵',1,1,2,'嘲讽。',{collect:false,tags:['taunt'],tribe:'军团',art:'guard'});
card('tok_veteran','铁誓卫兵',2,2,2,'嘲讽。',{collect:false,tags:['taunt'],tribe:'军团',art:'guard'});
card('tok_iron','锻炉铁卫',2,2,3,'嘲讽。',{collect:false,tags:['taunt'],tribe:'军团',art:'guard'});
card('tok_spider','小蜘蛛',1,1,1,'野兽。',{collect:false,tribe:'野兽',art:'spider'});
card('tok_hatch','破壳幼兽',2,3,2,'野兽。',{collect:false,tribe:'野兽',art:'wolf'});
card('tok_cub','幼兽',1,2,2,'野兽。',{collect:false,tribe:'野兽',art:'wolf'});
card('tok_tree','树灵',2,3,3,'树灵。',{collect:false,art:'tree'});
card('tok_ancient','世界树化身',8,8,8,'嘲讽。',{collect:false,tags:['taunt'],art:'tree'});
card('tok_phoenix','余烬雏鸟',3,3,3,'突袭。',{collect:false,tags:['rush'],tribe:'野兽',art:'phoenix'});
card('tok_skeleton','骸骨仆从',1,1,1,'亡灵。',{collect:false,tribe:'亡灵',art:'skeleton'});
card('tok_shade','无面虚影',2,2,2,'亡灵。',{collect:false,tribe:'亡灵',art:'shade'});
card('bone','碎骨战士',2,2,2,'亡语：召唤一个1/1的骸骨仆从。',{collect:false,death:'skeleton',tribe:'亡灵',art:'skeleton'});
card('necromancer','招魂侍祭',4,3,4,'战吼：召唤两个1/1的骸骨仆从。',{collect:false,effect:'skeletons',tribe:'亡灵',art:'skeleton'});
card('jailer','锁链狱卒',4,3,6,'嘲讽。',{collect:false,tags:['taunt'],tribe:'军团',art:'guard'});
card('bramble','血棘爬行者',3,3,3,'亡语：对一个随机敌方随从造成2点伤害。',{collect:false,death:'zap2',tribe:'野兽',art:'spider'});
card('infernal','熔核巨像',6,6,7,'战吼：对所有敌方随从造成1点伤害。',{collect:false,effect:'aoe1',art:'golem'});
card('darkknight','余烬禁卫',5,4,6,'嘲讽。圣盾。',{collect:false,tags:['taunt','shield'],tribe:'亡灵',art:'knight'});
const HEROES={
 iron:{id:'iron',name:'铁誓守卫',subtitle:'军团 · 圣盾 · 邻位强化',title:'让阵线，成为你的锋刃。',desc:'以嘲讽与圣盾建立阵线，用旗手和铁匠强化邻位，在有利交换中稳步推进。',art:'knight',color:'#cda66a',power:'集结援军',powerText:'召唤一个2/2并具有嘲讽的铁誓卫兵。',powerTarget:null,deck:['iron_novice','squire','wolf','scout','page','blacksmith','blacksmith','medic','recruit','banner','defender','guard','knight','paladin','rally']},
 grove:{id:'grove',name:'林契行者',subtitle:'野兽 · 亡语 · 持续铺场',title:'倒下的生命，仍在生长。',desc:'让野兽和亡语不断补充战场，用永久强化积累优势，召集一支越战越勇的兽群。',art:'ranger',color:'#79ba91',power:'野性生长',powerText:'使一个友方随从获得+1/+1。',powerTarget:'friendlyMinion',deck:['egg','cub','squire','scout','page','wolf','spider','spider','medic','roots','packleader','tender','bear','brood','rally']},
 astral:{id:'astral',name:'星祷术师',subtitle:'法术协同 · 战吼 · 资源循环',title:'每一道星光，都有人回应。',desc:'用精准法术争夺场面，让施法随从持续成长。保住关键随从，再用星龙扳回战局。',art:'mage',color:'#9a9de0',power:'引星之术',powerText:'对一个敌方随从造成1点伤害。抽一张牌。',powerTarget:'enemyMinion',deck:['spark','spark','squire','bolt','page','wispkeeper','medic','frost','wolf','arcanist','guard','frostguard','weaver','sentinel','nova']}
};
const BUFFS=[
 {id:'drums',name:'远征战鼓',icon:'banner',text:'每个回合，你召唤的第一个随从获得+1/+1。',hint:'低费随从，也能挑起大梁。'},
 {id:'spring',name:'晨曦之泉',icon:'healer',text:'你的回合结束时，为英雄恢复2点生命。',hint:'为漫长远征保留余力。'},
 {id:'heart',name:'巨人之心',icon:'crown',text:'你的最大生命值提高12点，并立即恢复12点生命。',hint:'面对最终关卡，多一份容错。'},
 {id:'vanguard',name:'先遣军旗',icon:'guard',text:'每场战斗开始时，召唤两个1/2嘲讽卫兵。',hint:'无需花费法力，先立稳阵线。'},
 {id:'supply',name:'高效补给',icon:'rune',text:'每个你的回合，打出的第一张牌费用减少1点。',hint:'更早打出关键的那张牌。'},
 {id:'echo',name:'灵魂回声',icon:'shade',text:'每个回合中，你的第一个随从死亡时，抽一张牌。',hint:'交换场面，也不丢失资源。'},
 {id:'command',name:'统御印记',icon:'banner',text:'你的英雄技能费用减少1点。',hint:'将英雄技能融入每个回合。'},
 {id:'hearth',name:'永燃炉心',icon:'flame',text:'每场战斗开始获得6点护甲。每个回合，你召唤的第一个随从获得圣盾。',hint:'守护你的英雄与先遣随从。'}
];
const BOSSES=[
 {id:'moss',name:'苔门守望',title:'荒径的第一道试炼',hp:22,armor:0,art:'tree',color:'#68856e',ability:'苔痕复苏',text:'回合结束：为生命最低的友方随从恢复1点生命。',deck:['squire','scout','wolf','page','guard','medic','boar','archer','cub','tender','bear','mend']},
 {id:'bones',name:'骸骨收集者',title:'长眠者，从不独行',hp:27,armor:0,art:'skeleton',color:'#a1a394',ability:'枯骨苏醒',text:'每逢偶数回合开始：召唤一个1/1的骸骨仆从。',deck:['bone','bone','squire','page','spider','necromancer','wolf','guard','bramble','archer','rally','bolt']},
 {id:'jailer',name:'铁面典狱长',title:'高墙之后，誓言已锈',hp:30,armor:3,art:'guard',color:'#b69370',ability:'铸铁壁垒',text:'回合开始：获得1点护甲。',deck:['iron_novice','squire','blacksmith','armorer','jailer','guard','banner','knight','defender','recruit','bolt','paladin']},
 {id:'mirror',name:'镜湖先知',title:'你看见的，未必是全部',hp:34,armor:0,art:'mage',color:'#9e96bc',ability:'倒影之池',text:'每逢3的倍数回合开始：复制攻击力最低的友方随从，使其变为1/1。',deck:['spark','page','wispkeeper','arcanist','frostguard','weaver','sentinel','frost','bolt','insight','oracle','nova']},
 {id:'thorn',name:'血棘女王',title:'每一朵花，都曾饮血',hp:39,armor:0,art:'ranger',color:'#b36f86',ability:'荆棘蔓生',text:'回合结束：使攻击力最低的友方随从获得+1/+1。',deck:['egg','spider','cub','wolf','bramble','tender','packleader','bear','brood','elder','roots','rally']},
 {id:'forge',name:'熔炉暴君',title:'群山熔化，铸出新的王座',hp:43,armor:4,art:'golem',color:'#ce7954',ability:'熔炉脉冲',text:'每逢3的倍数回合开始：对所有敌方随从造成1点伤害。',deck:['squire','iron_novice','blacksmith','armorer','guard','archer','knight','infernal','ogre','drake','bolt','nova']},
 {id:'faceless',name:'无面主教',title:'当钟声响起，不要回头',hp:47,armor:0,art:'shade',color:'#9e8cc0',ability:'虚影仪式',text:'回合开始：若友方随从少于3个，召唤一个2/2的虚影。',deck:['bone','spider','wispkeeper','arcanist','necromancer','frostguard','sentinel','darkknight','scholar','stormdrake','frost','nova']},
 {id:'king',name:'余烬之王',title:'最后一扇门，通向黎明',hp:55,armor:6,art:'crown',color:'#d4a665',ability:'王座余火',text:'回合结束：对你的英雄造成2点伤害。生命首次降至一半时，召唤两个2/3嘲讽铁卫。',deck:['iron_novice','squire','wolf','blacksmith','arcanist','banner','defender','knight','darkknight','infernal','stormdrake','marshal','bolt','frost','nova','rally']}
];
const PACKS={
 iron:{name:'铁誓军团',tag:'稳固阵线 · 邻位强化',tiers:[['iron_novice','blacksmith','banner'],['defender','armorer','blessing'],['captain','paladin','recruit'],['marshal','bastion','blessing']]},
 grove:{name:'林契兽群',tag:'亡语铺场 · 野兽协同',tiers:[['egg','spider','packleader'],['tender','bear','roots'],['stag','brood','packleader'],['alpha','elder','roots']]},
 astral:{name:'星祷秘典',tag:'控场解牌 · 施法成长',tiers:[['spark','frost','arcanist'],['wispkeeper','weaver','bolt'],['oracle','sentinel','nova'],['stormdrake','archmage','frost']]},
 sustain:{name:'长夜补给',tag:'治疗续航 · 补充手牌',tiers:[['medic','page','mend'],['tender','scholar','insight'],['paladin','stag','mend'],['champion','scholar','paladin']]},
 assault:{name:'破晓先锋',tag:'即时解场 · 主动进攻',tiers:[['wolf','boar','archer'],['boar','knight','ogre'],['drake','champion','rally'],['marshal','stormdrake','champion']]}
};
const KEYWORDS={
 '嘲讽':'敌方随从必须先攻击有嘲讽的随从；不限制法术或战吼的目标。',
 '圣盾':'免疫下一次伤害，然后移除圣盾。',
 '突袭':'召唤的当回合即可攻击敌方随从，但不能攻击敌方英雄。',
 '冲锋':'召唤的当回合即可攻击，包括攻击敌方英雄。',
 '战吼':'从手牌打出时触发；被召唤、复制时不触发。',
 '亡语':'随从死亡时触发。场上已满时，无法额外召唤。',
 '吸血':'此随从造成伤害时，为你的英雄恢复等量实际损失的生命/护甲值。',
 '冻结':'随从跳过下一次属于它的回合的攻击机会。',
 '相邻':'战场上紧挨在随从左边、右边的随从。点击插入点选择站位。'
};
const api={C,HEROES,BUFFS,BOSSES,PACKS,KEYWORDS};
if(typeof module!=='undefined'&&module.exports)module.exports=api;root.EmberData=api;
})(typeof window!=='undefined'?window:globalThis);
