export function createBallWatchdog({Matter,world,balls,getBounds,onRemove}){
 const {Body,World}=Matter;const STUCK_MS=1200,MIN_PROGRESS=.7;
 function remove(ball,reason){if(ball?.gameData){ball.gameData.removedReason=reason;ball.gameData.removedAt=performance.now()}World.remove(world,ball);const i=balls.indexOf(ball);if(i>=0)balls.splice(i,1);onRemove?.(ball,reason)}
 function tick(now=performance.now()){
  const {width,height,slotY}=getBounds();
  for(const ball of [...balls]){
   const meta=ball.gameData||(ball.gameData={});meta.lastY??=ball.position.y;meta.lastProgressAt??=now;
   if(ball.position.y-meta.lastY>MIN_PROGRESS){meta.lastY=ball.position.y;meta.lastProgressAt=now}
   if(ball.position.y>height+80||ball.position.x<-80||ball.position.x>width+80){remove(ball,'out-of-bounds');continue}
   if(now-meta.lastProgressAt>STUCK_MS){const dir=ball.position.x<width/2?1:-1,nearSlots=ball.position.y>slotY-110;Body.applyForce(ball,ball.position,{x:dir*ball.mass*(nearSlots?.00055:.0008),y:ball.mass*(nearSlots?.0016:.0012)});meta.rescues=(meta.rescues||0)+1;meta.lastProgressAt=now;meta.lastY=ball.position.y}
  }
 }
 return{tick};
}
