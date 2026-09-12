import {GAME_RULES} from './rules.js';
export function createCommands(runtime){
 const spawn=(type,user)=>runtime.drop({username:user||'Live',...GAME_RULES.types[type]});
 const like=user=>spawn('like',user);
 const comment=(user,text)=>{runtime.toast(`${user||'Live'}: ${text||''}`);return spawn('comment',user)};
 const gift=(user,name)=>{user=user||'Live';name=name||'Presente';runtime.toast(`🎁 ${user} mandou ${name}!`,'#ff0055');if(name==='Rosa')return spawn('rosa',user);if(name==='Capivara'){const r=GAME_RULES.types.capivara;for(let i=0;i<r.count;i++)setTimeout(()=>spawn('capivara',user),i*r.interval);return}return spawn('galaxia',user)};
 const dispatch=(action,p={})=>{switch(action){case'like':return like(p.username||p.user);case'comment':return comment(p.username||p.user,p.text||p.comment);case'gift_rosa':return gift(p.username||p.user,'Rosa');case'gift_capivara':return gift(p.username||p.user,'Capivara');case'gift_galaxia':return gift(p.username||p.user,'Galáxia');case'restart':return runtime.reset();default:return false}};
 return{like,comment,gift,dispatch};
}