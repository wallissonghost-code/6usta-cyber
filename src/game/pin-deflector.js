import {GAME_RULES} from './rules.js';

const signFrom=(ball,pin)=>{
 const dx=ball.position.x-pin.position.x;
 if(Math.abs(dx)>GAME_RULES.pinDeflector.centerTolerance)return Math.sign(dx);
 if(Math.abs(ball.velocity.x)>.15)return Math.sign(ball.velocity.x);
 const key=String(ball.gameData?.id||'0')+String(pin.plugin?.pinId||pin.id);
 return [...key].reduce((n,c)=>n+c.charCodeAt(0),0)%2?1:-1;
};

export function createPinDeflector({Matter,onDeflect}){
 const {Body}=Matter;
 return function deflect(ball,pin){
  if(!ball?.gameData||!pin)return;
  const now=performance.now(),pinId=pin.plugin?.pinId||String(pin.id),meta=ball.gameData;
  if(meta.lastDeflectPin===pinId&&now-(meta.lastDeflectAt||0)<GAME_RULES.pinDeflector.cooldownMs)return;
  const dir=signFrom(ball,pin),incoming=Math.hypot(ball.velocity.x,ball.velocity.y);
  const vx=dir*Math.max(GAME_RULES.pinDeflector.minLateral,Math.min(GAME_RULES.pinDeflector.maxLateral,Math.abs(ball.velocity.x)+GAME_RULES.pinDeflector.lateralKick));
  const vy=Math.max(GAME_RULES.pinDeflector.minDownward,Math.min(GAME_RULES.pinDeflector.maxDownward,Math.abs(ball.velocity.y)*GAME_RULES.pinDeflector.verticalCarry));
  Body.setVelocity(ball,{x:vx,y:vy});
  meta.lastDeflectPin=pinId;meta.lastDeflectAt=now;meta.deflections=(meta.deflections||0)+1;
  onDeflect?.(ball,pin,{vx,vy,incoming,deflections:meta.deflections});
 };
}
