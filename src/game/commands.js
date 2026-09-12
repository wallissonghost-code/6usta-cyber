import {GAME_RULES} from './rules.js';
export function createCommands(runtime,actionConfig){
 const spawnOne=(type,user)=>runtime.drop({username:user||'Live',...GAME_RULES.types[type]});
 const spawnMany=(action,type,user,override)=>{const quantity=override==null?actionConfig.getQuantity(action):Math.max(0,Math.min(50,Math.floor(Number(override)||0)));const balls=[];for(let i=0;i<quantity;i++)balls.push(spawnOne(type,user));return balls};
 const like=(user,opts={})=>spawnMany('like','like',user,opts.quantity);
 const comment=(user,text,opts={})=>{runtime.toast(`${user||'Live'}: ${text||''}`);return spawnMany('comment','comment',user,opts.quantity)};
 const gift=(user,name,opts={})=>{user=user||'Live';name=name||'Presente';runtime.toast(`🎁 ${user} mandou ${name}!`,'#ff0055');if(name==='Rosa')return spawnMany('gift_rosa','rosa',user,opts.quantity);if(name==='Capivara')return spawnMany('gift_capivara','capivara',user,opts.quantity);return spawnMany('gift_galaxia','galaxia',user,opts.quantity)};
 const dispatch=(action,p={})=>{const opts={quantity:p.quantity};switch(action){case'like':return like(p.username||p.user,opts);case'comment':return comment(p.username||p.user,p.text||p.comment,opts);case'gift_rosa':return gift(p.username||p.user,'Rosa',opts);case'gift_capivara':return gift(p.username||p.user,'Capivara',opts);case'gift_galaxia':return gift(p.username||p.user,'Galáxia',opts);case'restart':return runtime.reset();default:return false}};
 return{like,comment,gift,dispatch};
}
