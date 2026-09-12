import {GAME_RULES} from './rules.js';

export function createRenderer({ctx,getSize,getBoard,balls,particles,Matter}){
 const {Body}=Matter;
 function frame(){
  const {width,height}=getSize(),{boss,pins}=getBoard();ctx.clearRect(0,0,width,height);
  if(boss){Body.rotate(boss,.012);ctx.save();ctx.translate(boss.position.x,boss.position.y);ctx.rotate(boss.angle);ctx.fillStyle='rgba(255,0,85,.2)';ctx.strokeStyle='#ff0055';ctx.lineWidth=4;ctx.beginPath();for(let i=0;i<6;i++){const r=boss.renderRadius,t=Math.PI/3*i,x=r*Math.cos(t),y=r*Math.sin(t);i?ctx.lineTo(x,y):ctx.moveTo(x,y)}ctx.closePath();ctx.fill();ctx.stroke();ctx.restore()}
  for(const pin of pins){ctx.beginPath();ctx.arc(pin.position.x,pin.position.y,GAME_RULES.board.pinRadius,0,Math.PI*2);ctx.fillStyle='#00f0ff';ctx.fill()}
  for(const ball of balls){ctx.beginPath();ctx.arc(ball.position.x,ball.position.y,ball.gameData.radius,0,Math.PI*2);ctx.fillStyle=ball.gameData.color;ctx.fill();ctx.font='bold 11px Rajdhani';ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText(ball.gameData.username,ball.position.x,ball.position.y-ball.gameData.radius-4)}
  for(let i=particles.length-1;i>=0;i--){const p=particles[i];if(p.wave){p.r+=6;p.a-=.04;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.strokeStyle=p.color;ctx.globalAlpha=Math.max(0,p.a);ctx.stroke()}else{p.x+=p.vx;p.y+=p.vy;p.a-=.05;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=p.color;ctx.globalAlpha=Math.max(0,p.a);ctx.fill()}ctx.globalAlpha=1;if(p.a<=0)particles.splice(i,1)}
 }
 return{frame};
}
