/* Deterministic, DOM-free rules engine. Shared by the browser and the automated tests. */
(function(root){
'use strict';
const D=root.EmberData||(typeof require==='function'?require('./data.js'):null);
const {C,HEROES,BUFFS,BOSSES,PACKS}=D;
const SAVE_VERSION=3, MAX_BOARD=7, MAX_HAND=10;
const other=s=>s==='p'?'e':'p';
const copy=v=>JSON.parse(JSON.stringify(v));
const has=(s,id)=>s.run.buffs.includes(id);
function rng(s){let x=s.run.rng|0;x^=x<<13;x^=x>>>17;x^=x<<5;s.run.rng=x>>>0;return (x>>>0)/4294967296;}
function pick(s,a){return a.length?a[Math.floor(rng(s)*a.length)]:null;}
function shuffle(s,a){for(let i=a.length-1;i>0;i--){const j=Math.floor(rng(s)*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function uid(s,prefix='x'){return prefix+(++s.run.nextId);}
function entry(s,id,up=0){return {uid:uid(s,'c'),id,up};}
function log(s,msg){if(s.battle){s.battle.log.push(msg);if(s.battle.log.length>70)s.battle.log.shift();}}
function event(s,type,target,value){s.events.push({type,target,value,n:++s.serial});if(s.events.length>25)s.events.shift();}
function side(s,k){return s.battle[k];}
function find(s,k,id){if(id===k+'hero')return side(s,k);return side(s,k).board.find(m=>m.uid===id);}
function isHero(t){return t&&Array.isArray(t.board);}
function attackValue(s,k,m){let val=m.atk;const b=side(s,k).board,i=b.indexOf(m);for(let j=0;j<b.length;j++){if(i===j)continue;const d=C[b[j].id];if(d.aura==='adj1'&&Math.abs(j-i)===1)val++;if(d.aura==='adj2'&&Math.abs(j-i)===1)val+=2;if(d.aura==='legion1'&&C[m.id].tribe==='军团')val++;if(d.aura==='beast1'&&C[m.id].tribe==='野兽')val++;}return Math.max(0,val);}
function cardCost(s,k,c){const discount=(c.discount||0)+(c.up?1:0)+(k==='p'&&has(s,'supply')&&side(s,k).played===0?1:0);return Math.max(0,C[c.id].cost-discount);}
function powerCost(s){return has(s,'command')?1:2;}
function heal(s,k,id,n){const t=find(s,k,id);if(!t)return 0;const actual=Math.min(n,Math.max(0,t.maxHp-t.hp));t.hp+=actual;if(actual)event(s,'heal',id,actual);return actual;}
function buff(m,a,h){m.atk+=a;m.maxHp+=h;m.hp+=h;}
function damage(s,k,id,n,source){const t=find(s,k,id);if(!t||n<=0)return 0;if(!isHero(t)&&t.shield){t.shield=false;event(s,'shield',id,0);return 0;}let amount=n,total=0;if(isHero(t)){let a=Math.min(t.armor,amount);t.armor-=a;amount-=a;total+=a;}total+=Math.min(Math.max(0,t.hp),amount);t.hp-=amount;event(s,'damage',id,n);if(source==='p')s.run.stats.damage+=total;return total;}
function draw(s,k,n=1){const p=side(s,k);for(let i=0;i<n;i++){if(!p.deck.length){p.fatigue++;damage(s,k,k+'hero',p.fatigue,other(k));log(s,`${k==='p'?'你':'敌方'}牌库已空，受到${p.fatigue}点疲劳伤害。`);continue;}const c=p.deck.pop();if(p.hand.length>=MAX_HAND){log(s,`${k==='p'?'你':'敌方'}的手牌已满，${C[c.id].name}被弃置。`);continue;}p.hand.push(c);if(k==='p')s.run.stats.drawn++;event(s,'draw',k+'hero',1);}}
function summon(s,k,id,opts={}){const p=side(s,k),d=C[id];if(p.board.length>=MAX_BOARD||!d||d.type!=='minion')return null;const m={uid:uid(s,'u'),id,atk:opts.atk??d.atk,hp:opts.hp??d.hp,maxHp:opts.hp??d.hp,taunt:d.tags.includes('taunt'),shield:d.tags.includes('shield'),rush:d.tags.includes('rush'),charge:d.tags.includes('charge'),lifesteal:d.tags.includes('lifesteal'),sleep:true,attacks:0,freeze:0,frozenNow:false,spellCount:0};p.board.splice(Math.min(opts.pos??p.board.length,p.board.length),0,m);if(k==='p'){if(p.summoned===0&&has(s,'drums'))buff(m,1,1);if(p.summoned===0&&has(s,'hearth'))m.shield=true;s.run.stats.summoned++;}p.summoned++;event(s,'summon',m.uid,id);return m;}
function weakest(s,k,by='hp'){const b=side(s,k).board.filter(m=>m.hp>0);return b.slice().sort((a,b)=>by==='atk'?attackValue(s,k,a)-attackValue(s,k,b):a.hp-b.hp)[0];}
function aoe(s,k,n,source){side(s,k).board.slice().forEach(m=>damage(s,k,m.uid,n,source));}
function applyEffect(s,k,effect,target,m){const p=side(s,k),ek=other(k),foe=side(s,ek),t=target?find(s,target.side,target.id):null;
 switch(effect){
 case 'heal2':heal(s,k,k+'hero',2);break;case 'heal3':heal(s,k,k+'hero',3);break;
 case 'draw1':draw(s,k,1);break;case 'draw2':draw(s,k,2);break;
 case 'snipe2':case 'snipe3':{const w=weakest(s,ek);if(w)damage(s,ek,w.uid,effect==='snipe2'?2:3,k);break;}
 case 'armor4':p.armor+=4;event(s,'armor',k+'hero',4);break;
 case 'neighbors':{const i=p.board.indexOf(m);[p.board[i-1],p.board[i+1]].filter(Boolean).forEach(x=>buff(x,1,1));break;}
 case 'buffOthers':p.board.filter(x=>x!==m).forEach(x=>buff(x,1,1));break;
 case 'beastBuff':p.board.filter(x=>x!==m&&C[x.id].tribe==='野兽').forEach(x=>buff(x,1,1));break;
 case 'aoe1':case 'aoe2':case 'aoe3':aoe(s,ek,Number(effect.slice(-1)),k);break;
 case 'cubs':summon(s,k,'tok_cub');summon(s,k,'tok_cub');break;
 case 'skeletons':summon(s,k,'tok_skeleton');summon(s,k,'tok_skeleton');break;
 case 'recruit':summon(s,k,'tok_guard');summon(s,k,'tok_guard');break;
 case 'discountSpells':p.hand.forEach(x=>{if(C[x.id].type==='spell')x.discount=(x.discount||0)+1;});break;
 case 'archmage':draw(s,k,2);p.mana=Math.min(10,p.mana+2);break;
 case 'bolt2':if(t)damage(s,target.side,target.id,2,k);break;
 case 'mend':if(t)heal(s,target.side,target.id,5);draw(s,k,1);break;
 case 'rally':p.board.forEach(x=>buff(x,1,1));break;
 case 'blessing':if(t){buff(t,2,2);t.shield=true;}break;
 case 'roots':if(t){buff(t,2,3);t.taunt=true;}break;
 case 'frost':if(t){damage(s,target.side,target.id,3,k);t.freeze=1;}break;
 case 'crown':p.board.forEach(x=>{buff(x,2,2);x.shield=true;});break;
 case 'hourglass':p.board.forEach(x=>{x.shield=true;x.sleep=false;x.attacks=0;x.frozenNow=false;x.freeze=0;});draw(s,k,1);break;
 }
}
function settle(s){if(!s.battle||s.screen!=='battle')return;
 for(let loop=0;loop<30;loop++){let dead=[];for(const k of ['p','e']){const p=side(s,k);p.board.forEach((m,i)=>{if(m.hp<=0)dead.push({k,m,i,rightIds:p.board.slice(i+1).map(x=>x.uid)});});p.board=p.board.filter(m=>m.hp>0);}if(!dead.length)break;
  for(const {k,m,rightIds} of dead){const board=side(s,k).board;let i=board.findIndex(x=>rightIds.includes(x.uid));if(i<0)i=board.length;if(k==='e')s.run.stats.kills++;log(s,`${C[m.id].name}倒下了。`);event(s,'death',m.uid,0);if(k==='p'&&has(s,'echo')&&!s.battle.echoUsed){s.battle.echoUsed=true;draw(s,k);}
   const d=C[m.id].death,ek=other(k);switch(d){case 'hatch':summon(s,k,'tok_hatch',{pos:i});break;case 'spiders':summon(s,k,'tok_spider',{pos:i});summon(s,k,'tok_spider',{pos:i+1});break;case 'skeleton':summon(s,k,'tok_skeleton',{pos:i});break;case 'draw1':draw(s,k,1);break;case 'draw2':draw(s,k,2);break;case 'heal3':heal(s,k,k+'hero',3);break;case 'sapling':summon(s,k,'tok_tree',{pos:i});break;case 'ancient':summon(s,k,'tok_ancient',{pos:i});break;case 'phoenix':summon(s,k,'tok_phoenix',{pos:i});break;case 'zap2':{const t=pick(s,side(s,ek).board.filter(x=>x.hp>0));if(t)damage(s,ek,t.uid,2,k);break;}}
  }
 }
 const b=s.battle;
 if(b.p.hp<=0){s.run.hp=0;s.screen='defeat';s.reward=null;return;}
 if(b.e.hp<=0){winBattle(s);return;}
 if(s.run.stage===8&&!b.enraged&&b.e.hp<=b.e.maxHp/2){b.enraged=true;summon(s,'e','tok_iron');summon(s,'e','tok_iron');log(s,'余烬之王进入第二阶段，召唤了两名禁卫！');event(s,'phase','ehero',2);}
}
function canAttack(s,k,m){return s.screen==='battle'&&s.battle.phase==='play'&&s.battle.active===k&&!m.frozenNow&&m.attacks<1&&attackValue(s,k,m)>0&&(!m.sleep||m.rush||m.charge);}
function attackTargets(s,k,m){if(!canAttack(s,k,m))return [];const ek=other(k),b=side(s,ek).board;const taunts=b.filter(x=>x.taunt&&x.hp>0);if(taunts.length)return taunts.map(x=>({side:ek,id:x.uid}));let res=b.filter(x=>x.hp>0).map(x=>({side:ek,id:x.uid}));if(!m.sleep||m.charge)res.push({side:ek,id:ek+'hero'});return res;}
function attack(s,k,id,target){const m=find(s,k,id);if(!m||isHero(m)||!attackTargets(s,k,m).some(x=>x.id===target.id&&x.side===target.side))return {ok:false,msg:'这个目标现在不能被攻击。请注意嘲讽、冻结与召唤限制。'};const t=find(s,target.side,target.id),a=attackValue(s,k,m),ret=isHero(t)?0:attackValue(s,target.side,t);m.attacks++;event(s,'attack',m.uid,target.id);const d1=damage(s,target.side,target.id,a,k);const d2=isHero(t)?0:damage(s,k,m.uid,ret,target.side);if(m.lifesteal)heal(s,k,k+'hero',d1);if(!isHero(t)&&t.lifesteal)heal(s,target.side,target.side+'hero',d2);log(s,`${C[m.id].name}攻击了${isHero(t)?(target.side==='e'?BOSSES[s.run.stage-1].name:HEROES[s.run.hero].name):C[t.id].name}。`);if(k==='p')s.run.stats.attacks++;settle(s);return {ok:true};}
function effectTargets(s,k,d){const ek=other(k);let targets=[];if(d.target==='enemy'||d.target==='enemyMinion')targets=side(s,ek).board.map(m=>({side:ek,id:m.uid}));if(d.target==='enemy')targets.push({side:ek,id:ek+'hero'});if(d.target==='friendly'||d.target==='friendlyMinion')targets=side(s,k).board.map(m=>({side:k,id:m.uid}));if(d.target==='friendly')targets.push({side:k,id:k+'hero'});return targets;}
function canPlay(s,k,c){if(s.screen!=='battle'||s.battle.phase!=='play'||s.battle.active!==k)return false;const p=side(s,k),d=C[c.id];if(cardCost(s,k,c)>p.mana)return false;if(d.type==='minion'&&p.board.length>=MAX_BOARD)return false;if(d.target&&!effectTargets(s,k,d).length)return false;if(['recruit','cubs','skeletons'].includes(d.effect)&&d.type==='spell'&&p.board.length>=MAX_BOARD)return false;return true;}
function play(s,k,id,target=null,pos=null){const p=side(s,k),idx=p.hand.findIndex(c=>c.uid===id),c=p.hand[idx];if(!c||!canPlay(s,k,c))return {ok:false,msg:'法力不足、战场已满，或当前没有合法目标。'};const d=C[c.id];if(d.target&&!effectTargets(s,k,d).some(x=>target&&x.id===target.id&&x.side===target.side))return {ok:false,msg:'请选择一个高亮的合法目标。'};p.mana-=cardCost(s,k,c);p.hand.splice(idx,1);p.played++;if(k==='p')s.run.stats.played++;log(s,`${k==='p'?'你':'敌方'}打出了「${d.name}」。`);let m=null;if(d.type==='minion'){m=summon(s,k,c.id,{pos:pos??p.board.length});}
 applyEffect(s,k,d.effect,target,m);
 if(d.type==='spell'){event(s,'spell',target?.id||other(k)+'hero',c.id);for(const x of p.board.slice()){if(C[x.id].onSpell==='grow')buff(x,1,1);if(C[x.id].onSpell==='drawFirst'&&!x.spellCount){x.spellCount++;draw(s,k,1);}}}
 settle(s);return {ok:true};}
function usePower(s,target=null){if(s.screen!=='battle')return {ok:false,msg:'不在战斗中。'};const p=side(s,'p'),h=HEROES[s.run.hero];if(s.battle.active!=='p'||s.battle.phase!=='play'||p.powerUsed||p.mana<powerCost(s))return {ok:false,msg:'英雄技能本回合不可用。'};if(s.run.hero==='iron'&&p.board.length>=MAX_BOARD)return {ok:false,msg:'战场已满。'};if(h.powerTarget&&!effectTargets(s,'p',{target:h.powerTarget}).some(x=>target&&x.id===target.id&&x.side===target.side))return {ok:false,msg:'请选择一个高亮的随从。'};p.mana-=powerCost(s);p.powerUsed=true;
 if(s.run.hero==='iron')summon(s,'p','tok_veteran');if(s.run.hero==='grove')buff(find(s,'p',target.id),1,1);if(s.run.hero==='astral'){damage(s,'e',target.id,1,'p');draw(s,'p');}log(s,`你使用了「${h.power}」。`);s.run.stats.powers++;settle(s);return {ok:true};}
function startTurn(s,k){if(s.screen!=='battle')return;const b=s.battle,p=side(s,k);b.active=k;b.phase='play';b.echoUsed=false;b.p.summoned=0;b.e.summoned=0;p.maxMana=Math.min(10,p.maxMana+1);p.mana=p.maxMana;p.played=0;p.summoned=0;p.powerUsed=false;p.board.forEach(m=>{m.sleep=false;m.attacks=0;m.spellCount=0;m.frozenNow=m.freeze>0;if(m.freeze)m.freeze--;});if(k==='p'){b.turn++;s.run.stats.turns++;log(s,`── 你的第${b.turn}回合 ──`);}else log(s,'── 敌方回合 ──');draw(s,k);if(k==='e')bossStart(s);settle(s);}
function bossStart(s){const b=s.battle,id=BOSSES[s.run.stage-1].id;switch(id){case 'bones':if(b.turn%2===0){summon(s,'e','tok_skeleton');log(s,'枯骨苏醒：骸骨仆从加入战场。');}break;case 'jailer':b.e.armor++;break;case 'mirror':if(b.turn%3===0){const m=weakest(s,'e','atk');if(m)summon(s,'e',m.id,{atk:1,hp:1});log(s,'倒影之池：镜像正在凝结。');}break;case 'forge':if(b.turn%3===0){aoe(s,'p',1,'e');log(s,'熔炉脉冲扫过你的阵线。');}break;case 'faceless':if(b.e.board.length<3){summon(s,'e','tok_shade');log(s,'虚影仪式：主教唤出一个无面虚影。');}break;}}
function endTurn(s,k){if(s.screen!=='battle'||s.battle.active!==k||s.battle.phase!=='play')return {ok:false,msg:'还不能结束回合。'};const p=side(s,k);for(const m of p.board.slice()){if(!p.board.includes(m)||m.hp<=0)continue;switch(C[m.id].end){case 'heal2':heal(s,k,k+'hero',2);break;case 'zap1':{const t=pick(s,side(s,other(k)).board.filter(x=>x.hp>0));if(t)damage(s,other(k),t.uid,1,k);break;}case 'forge':summon(s,k,'tok_iron');break;}}
 if(k==='p'&&has(s,'spring'))heal(s,'p','phero',2);
 if(k==='e'){const id=BOSSES[s.run.stage-1].id;if(id==='moss'){const t=weakest(s,'e');if(t)heal(s,'e',t.uid,1);}if(id==='thorn'){const t=weakest(s,'e','atk');if(t)buff(t,1,1);}if(id==='king'){damage(s,'p','phero',2,'e');log(s,'王座余火对你造成了2点伤害。');}}
 settle(s);if(s.screen==='battle')startTurn(s,other(k));return {ok:true};}
function newSide(hp,maxHp,armor,deck){return {hp,maxHp,armor,deck,hand:[],board:[],mana:0,maxMana:0,fatigue:0,powerUsed:false,played:0,summoned:0};}
function beginBattle(s){const r=s.run,boss=BOSSES[r.stage-1];s.screen='battle';s.reward=null;r.checkpointHp=r.hp;s.events=[];const factor=r.difficulty==='story'?.85:r.difficulty==='heroic'?1.18:1;const ehp=Math.round(boss.hp*factor),ed=shuffle(s,[...boss.deck,...boss.deck].map(id=>entry(s,id)));s.battle={turn:0,active:'p',phase:'mulligan',p:newSide(r.hp,r.maxHp,has(s,'hearth')?6:0,shuffle(s,copy(r.deck))),e:newSide(ehp,ehp,boss.armor,ed),log:[],enraged:false,echoUsed:false};draw(s,'p',4);draw(s,'e',4);if(has(s,'vanguard')){summon(s,'p','tok_guard');summon(s,'p','tok_guard');}log(s,`第${r.stage}关：${boss.name}。`);return s;}
function newRun(hero='iron',difficulty='normal',seed=Date.now()){if(!HEROES[hero])hero='iron';if(!['story','normal','heroic'].includes(difficulty))difficulty='normal';let n=Number(seed)||1;if(typeof seed==='string'){n=2166136261;for(let i=0;i<seed.length;i++)n=Math.imul(n^seed.charCodeAt(i),16777619);}n=(n>>>0)||1;const maxHp=difficulty==='story'?44:difficulty==='heroic'?32:36;const s={version:SAVE_VERSION,screen:'battle',run:{hero,difficulty,seed:String(seed),rng:n,nextId:0,stage:1,deck:[],buffs:[],treasures:[],hp:maxHp,maxHp,retries:difficulty==='story'?2:1,history:[],stats:{turns:0,damage:0,kills:0,played:0,summoned:0,drawn:0,attacks:0,powers:0},startedAt:Date.now()},battle:null,events:[],serial:0,reward:null};s.run.deck=HEROES[hero].deck.map(id=>entry(s,id));return beginBattle(s);}
function mulligan(s,ids=[]){if(s.screen!=='battle'||s.battle.phase!=='mulligan')return {ok:false,msg:'换牌已经结束。'};const p=s.battle.p,replace=p.hand.filter(c=>ids.includes(c.uid));p.hand=p.hand.filter(c=>!ids.includes(c.uid));draw(s,'p',replace.length);p.deck.push(...replace);shuffle(s,p.deck);startTurn(s,'p');return {ok:true};}
function makePacks(s){let types=shuffle(s,Object.keys(PACKS).filter(x=>x!==s.run.hero));types=[s.run.hero,...types.slice(0,2)];shuffle(s,types);return types.map(type=>{const pk=PACKS[type],base=Math.min(3,Math.floor((s.run.stage-1)/2)),tier=Math.min(3,Math.max(0,base+(rng(s)<.22?1:0)));let ids=pk.tiers[tier].slice();return {type,name:pk.name,tag:pk.tag,ids};});}
function winBattle(s){const r=s.run;r.hp=Math.max(1,s.battle.p.hp);r.history.push({stage:r.stage,boss:BOSSES[r.stage-1].name,turns:s.battle.turn,hp:r.hp});r.hp=Math.min(r.maxHp,r.hp+(r.difficulty==='story'?14:10));s.screen='reward';s.reward={kind:'pack',options:makePacks(s)};log(s,'战斗胜利！远征队恢复了生命，战利品已送达。');}
function afterPack(s){const stage=s.run.stage;if([2,5].includes(stage)){s.reward={kind:'buff',options:shuffle(s,BUFFS.filter(b=>!has(s,b.id)).map(b=>b.id)).slice(0,3)};}else if([4,7].includes(stage)){s.reward={kind:'treasure',options:shuffle(s,Object.values(C).filter(c=>c.set==='treasure'&&!s.run.treasures.includes(c.id)).map(c=>c.id)).slice(0,3)};}else finishRewards(s);}
function finishRewards(s){s.reward=null;s.screen=s.run.stage===8?'victory':'camp';}
function chooseReward(s,index){if(s.screen!=='reward'||!s.reward||!Number.isInteger(index)||index<0||index>=s.reward.options.length)return {ok:false,msg:'无效的奖励选项。'};const r=s.run,x=s.reward.options[index],kind=s.reward.kind;if(kind==='pack'){x.ids.forEach(id=>r.deck.push(entry(s,id)));afterPack(s);}else if(kind==='buff'){r.buffs.push(x);if(x==='heart'){r.maxHp+=12;r.hp=Math.min(r.maxHp,r.hp+12);}finishRewards(s);}else if(kind==='treasure'){r.deck.push(entry(s,x));r.treasures.push(x);finishRewards(s);}return {ok:true};}
function camp(s,action,cardUid=null){if(s.screen!=='camp')return {ok:false,msg:'现在不在营地。'};const r=s.run;if(action==='heal')r.hp=Math.min(r.maxHp,r.hp+10);else if(action==='remove'){if(r.deck.length<=12)return {ok:false,msg:'套牌至少需要12张牌。'};const i=r.deck.findIndex(c=>c.uid===cardUid);if(i<0)return {ok:false,msg:'请选择一张牌。'};r.deck.splice(i,1);}else if(action==='upgrade'){const c=r.deck.find(c=>c.uid===cardUid);if(!c||c.up||C[c.id].cost===0)return {ok:false,msg:'这张牌无法再次强化。'};c.up=1;}else return {ok:false,msg:'未知营地行动。'};r.stage++;beginBattle(s);return {ok:true};}
function retry(s){if(s.screen!=='defeat'||s.run.retries<=0)return {ok:false,msg:'余烬已经耗尽。'};s.run.retries--;s.run.hp=Math.min(s.run.maxHp,Math.max(s.run.checkpointHp,Math.ceil(s.run.maxHp*.7)));beginBattle(s);return {ok:true};}
// Tactical AI: deterministic candidate scoring; it can attack before playing an AoE or a buff.
function unitValue(s,k,m){return attackValue(s,k,m)*1.15+Math.min(m.hp,12)*.7+(m.shield?1.8:0)+(m.taunt?.6:0)+(C[m.id].aura?2:0)+(C[m.id].onSpell?1.8:0)+(C[m.id].end?1.4:0)+(C[m.id].death?1:0);}
function playScore(s,k,c,t){const d=C[c.id],p=side(s,k),ek=other(k),foe=side(s,ek),unit=t?find(s,t.side,t.id):null,cost=cardCost(s,k,c);let v=0;if(d.type==='minion'){v=2+cost*.9+(d.atk+d.hp)*.28;if(d.tags.includes('rush'))v+=foe.board.length?1.5:0;if(d.tags.includes('taunt')&&p.hp<16)v+=2;if(d.aura)v+=p.board.length*.5;if(d.effect==='neighbors')v+=Math.min(p.board.length,2)*1.1;if(d.effect==='buffOthers')v+=p.board.length*1.4;}
 if(d.target){switch(d.effect){case 'bolt2':case 'frost':{let n=d.effect==='frost'?3:2;if(isHero(unit)){v=foe.hp+foe.armor<=n?1000:foe.hp<9?3.2:.5;}else{v=unit.shield?.6:unit.hp<=n?3+unitValue(s,ek,unit)*.7:1.5+(d.effect==='frost'?attackValue(s,ek,unit)*.25:0);}break;}case 'mend':v=Math.min(5,unit.maxHp-unit.hp)*(isHero(unit)&&p.hp<15?1:.48)+1.5;break;case 'blessing':case 'roots':v=2.8+(canAttack(s,k,unit)?2:0)+(unit.shield&&d.effect==='blessing'?-1:0)+(unit.lifesteal?1.5:0);break;}}
 if(/^aoe/.test(d.effect||'')){const n=Number(d.effect.slice(-1));v+=foe.board.reduce((a,m)=>a+(m.shield?.55:Math.min(m.hp,n)*.75+(m.hp<=n?unitValue(s,ek,m)*.55:0)),0);if(d.type==='spell'&&!foe.board.length)v=-20;}
 if(['rally','crown'].includes(d.effect)){v=p.board.reduce((a,m)=>a+1.35+(canAttack(s,k,m)?.65:0),0)*(d.effect==='crown'?1.65:1);if(!p.board.length)v=-20;}
 if(d.effect==='hourglass'){v=p.board.reduce((a,m)=>a+(m.attacks>0||m.sleep?attackValue(s,k,m)*1.1:1),0);if(!p.board.length)v=-10;}
 if(d.effect==='recruit')v=p.board.length<=5?4.5:p.board.length===6?1.7:-20;
 if(d.effect==='draw1'||d.effect==='draw2')v+=(p.hand.length<6?2:0)-(p.deck.length<3?4:0);
 if(d.effect==='heal3'||d.effect==='heal2')v+=Math.min(3,p.maxHp-p.hp)*.5;
 if(d.effect==='cubs')v+=Math.min(2,6-p.board.length)*1.4;
 if(d.effect==='discountSpells')v+=p.hand.filter(x=>C[x.id].type==='spell').length*.6;
 return v-cost*.12;
}
function bestPosition(s,k,c){const p=side(s,k),d=C[c.id];if(!p.board.length)return 0;if(d.effect==='neighbors'||d.aura?.startsWith('adj')){let idx=0,best=-1;for(let i=0;i<=p.board.length;i++){const near=[p.board[i-1],p.board[i]].filter(Boolean);const score=near.reduce((a,m)=>a+attackValue(s,k,m)*.3+m.hp*.45+(canAttack(s,k,m)?2:0),0);if(score>best){best=score;idx=i;}}return idx;}const banner=p.board.findIndex(m=>C[m.id].aura?.startsWith('adj'));return banner>=0?banner+1:p.board.length;}
function decide(s,k){if(s.screen!=='battle'||s.battle.active!==k||s.battle.phase!=='play')return null;const p=side(s,k),ek=other(k),foe=side(s,ek),candidates=[];
 for(const m of p.board){for(const t of attackTargets(s,k,m)){const tar=find(s,t.side,t.id),atk=attackValue(s,k,m);let value;if(isHero(tar)){value=atk>=tar.hp+tar.armor?2000:1+atk*.37+(tar.hp+tar.armor<14?2:0);}else{const ea=attackValue(s,ek,tar),kill=!tar.shield&&atk>=tar.hp,die=!m.shield&&ea>=m.hp;value=(kill?unitValue(s,ek,tar)+2:Math.min(tar.hp,atk)*.5)+(tar.shield?1.4:0)-(die?unitValue(s,k,m)*.8:Math.min(m.hp,ea)*.32)+(m.shield?.8:0)+(kill&&tar.taunt?1:0);if(!die&&kill)value+=2;if(die&&C[m.id].death)value+=1.5;if(foe.board.reduce((a,x)=>a+attackValue(s,ek,x),0)>=p.hp+p.armor&&kill)value+=4;}candidates.push({kind:'attack',id:m.uid,target:t,score:value});}}
 for(const c of p.hand){if(!canPlay(s,k,c))continue;const d=C[c.id],targets=d.target?effectTargets(s,k,d):[null];for(const t of targets)candidates.push({kind:'play',id:c.uid,target:t,pos:bestPosition(s,k,c),score:playScore(s,k,c,t)});}
 if(k==='p'&&!p.powerUsed&&p.mana>=powerCost(s)){if(s.run.hero==='iron'&&p.board.length<MAX_BOARD)candidates.push({kind:'power',score:p.hp<16?4:2.9});if(s.run.hero==='grove')for(const m of p.board)candidates.push({kind:'power',target:{side:'p',id:m.uid},score:2+(canAttack(s,k,m)?1.8:0)+(m.lifesteal?1:0)});if(s.run.hero==='astral')for(const m of foe.board)candidates.push({kind:'power',target:{side:'e',id:m.uid},score:(m.hp===1&&!m.shield?4+unitValue(s,'e',m)*.45:2)-(p.deck.length<3?3:0)});}
 candidates.sort((a,b)=>b.score-a.score);return candidates.length&&candidates[0].score>.05?candidates[0]:{kind:'end'};
}
function execute(s,k,a){if(!a)return {ok:false};if(a.kind==='attack')return attack(s,k,a.id,a.target);if(a.kind==='play')return play(s,k,a.id,a.target,a.pos);if(a.kind==='power')return usePower(s,a.target);return endTurn(s,k);}
function validateState(s){try{if(!s||s.version!==SAVE_VERSION||!HEROES[s.run.hero]||s.run.stage<1||s.run.stage>8||!Array.isArray(s.run.deck)||s.run.deck.some(c=>!C[c.id])||!Array.isArray(s.run.buffs)||s.run.buffs.some(id=>!BUFFS.some(b=>b.id===id)))return false;if(!['battle','reward','camp','victory','defeat'].includes(s.screen))return false;if(!s.battle||!['p','e'].every(k=>s.battle[k]&&Array.isArray(s.battle[k].board)&&s.battle[k].board.length<=MAX_BOARD&&Array.isArray(s.battle[k].hand)&&s.battle[k].hand.length<=MAX_HAND&&[...s.battle[k].hand,...s.battle[k].deck,...s.battle[k].board].every(c=>C[c.id])&&Number.isFinite(s.battle[k].hp)))return false;if(s.screen==='reward'&&(!s.reward||!Array.isArray(s.reward.options)||s.reward.options.length!==3))return false;return true;}catch(e){return false;}}
const api={SAVE_VERSION,MAX_BOARD,MAX_HAND,newRun,beginBattle,mulligan,play,attack,usePower,endTurn,chooseReward,camp,retry,decide,execute,canPlay,canAttack,attackTargets,effectTargets,cardCost,powerCost,attackValue,find,other,validateState,unitValue,copy,_test:{damage,heal,summon,settle,draw,applyEffect,startTurn,buff,makePacks}};
root.EmberCore=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
