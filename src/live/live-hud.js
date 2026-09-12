const $=id=>document.getElementById(id);
const text=(v,fallback='')=>String(v??fallback);
const HUD_KEY='cyber-live-hud-visible';
const LAYOUT_GAP=10;
function safeImage(raw){try{const u=new URL(text(raw),location.href);return ['https:','http:'].includes(u.protocol)?u.href:''}catch{return''}}
function ruleAction(rule){return text(rule.actionId||rule.action||rule.command)}
function params(rule){return rule.params||rule.actionParams||rule.effectParams||{}}
function giftName(rule){return text(rule.giftName||rule.triggerName||rule.gift?.name||rule.gift?.title,'Presente')}
function giftIcon(rule){return safeImage(rule.giftIcon||rule.giftImage||rule.gift?.icon||rule.gift?.image||rule.gift?.imageUrl)}
function effect(rule){const p=params(rule);if(ruleAction(rule)==='drop_ball'){const q=Math.max(1,Number(p.quantity)||1);return `${q}× bolinha · ${text(p.ballType,'like')}`}if(ruleAction(rule)==='restart')return'Reiniciar partida';return ruleAction(rule)||'Ação'}
export function createLiveHud(){
 let rules=[];
 const root=$('live-interactions');
 const list=$('live-interactions-list');
 const toggle=$('liveHudToggle');
 const slots=document.querySelector('.slots-container');
 function savedVisible(){try{const value=localStorage.getItem(HUD_KEY);return value===null?true:value==='1'}catch{return true}}
 function syncLayout(){
  if(!slots)return;
  if(!root||root.hidden){slots.style.bottom='max(18px, env(safe-area-inset-bottom))';return}
  const rect=root.getBoundingClientRect();
  const bottom=Math.max(0,window.innerHeight-rect.top+LAYOUT_GAP);
  slots.style.bottom=`${Math.ceil(bottom)}px`;
 }
 function setVisible(active,{persist=true}={}){const visible=!!active;if(root)root.hidden=!visible;if(toggle)toggle.checked=visible;if(persist){try{localStorage.setItem(HUD_KEY,visible?'1':'0')}catch{}}document.documentElement.dataset.liveHud=visible?'visible':'hidden';syncLayout();window.dispatchEvent(new CustomEvent('cyber:live-hud-visibility',{detail:{visible}}));return visible}
 function render(){if(!root||!list)return;list.replaceChildren();if(!rules.length){const empty=document.createElement('div');empty.className='live-rule-empty';empty.textContent='Aguardando regras do painel';list.appendChild(empty);syncLayout();return}for(const rule of rules){const card=document.createElement('article');card.className='live-rule-card';const icon=document.createElement('div');icon.className='live-rule-icon';const src=giftIcon(rule);if(src){const img=document.createElement('img');img.src=src;img.alt='';img.referrerPolicy='no-referrer';icon.appendChild(img)}else icon.textContent='🎁';const copy=document.createElement('div');copy.className='live-rule-copy';const b=document.createElement('b');b.textContent=giftName(rule);const small=document.createElement('small');small.textContent=effect(rule);copy.append(b,small);card.append(icon,copy);list.appendChild(card)}syncLayout()}
 function setRules(next){rules=Array.isArray(next)?next.filter(r=>r&&ruleAction(r)):[];render();return true}
 if(toggle)toggle.addEventListener('change',()=>setVisible(toggle.checked));
 if(root&&'ResizeObserver'in window)new ResizeObserver(syncLayout).observe(root,{box:'border-box'});
 window.addEventListener('resize',syncLayout,{passive:true});
 window.addEventListener('orientationchange',syncLayout,{passive:true});
 window.addEventListener('pageshow',()=>{setVisible(savedVisible(),{persist:false});syncLayout()});
 setVisible(savedVisible(),{persist:false});
 render();
 return{setRules,setVisible,getVisible:savedVisible,getRules:()=>rules.map(r=>({...r})),syncLayout}
}
