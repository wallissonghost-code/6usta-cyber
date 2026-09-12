import {GAME_RULES} from './rules.js';
const TYPES=new Set(Object.keys(GAME_RULES.types));
const clampQuantity=value=>Math.max(1,Math.min(50,Math.floor(Number(value)||1)));
export function createCommands(runtime){
 const dropBall=(type='like',user='Live')=>{const safe=TYPES.has(type)?type:'like';return runtime.drop({username:user||'Live',...GAME_RULES.types[safe]})};
 const dropMany=(type,user,quantity=1)=>{const balls=[];for(let i=0,n=clampQuantity(quantity);i<n;i++)balls.push(dropBall(type,user));return balls};
 const dispatch=(action,p={})=>{switch(action){case'drop_ball':return dropMany(String(p.ballType||p.type||'like'),p.username||p.user||'Live',p.quantity);case'restart':return runtime.reset();default:return false}};
 return{dropBall,dropMany,dispatch};
}
