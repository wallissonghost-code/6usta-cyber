export function createBallWatchdog({Matter,world,balls,getBounds}){
 const {Body,World}=Matter;
 const STUCK_MS=900,MIN_SPEED=.22,MAX_RESCUES=12;
 function remove(ball,reason='out-of-bounds'){
  if(ball?.gameData){ball.gameData.removedReason=reason;ball.gameData.removedAt=performance.now()}
  World.remove(world,ball);const i=balls.indexOf(ball);if(i>=0)balls.splice(i,1)
 }
 function tick(now=performance.now()){
  const {width,height,slotY}=getBounds();
  for(const ball of [...balls]){
   const meta=ball.gameData||(ball.gameData={});
   meta.spawnedAt??=now;meta.lastMovingAt??=now;meta.lastY??=ball.position.y;
   const speed=Math.hypot(ball.velocity.x,ball.velocity.y),progress=ball.position.y-meta.lastY;
   if(speed>MIN_SPEED||progress>.8){meta.lastMovingAt=now;meta.lastY=ball.position.y}
   if(ball.position.y>height+80||ball.position.x<-80||ball.position.x>width+80){remove(ball);continue}
   if(now-meta.lastMovingAt>STUCK_MS){
    meta.rescues=(meta.rescues||0)+1;
    const centerDir=ball.position.x<width/2?1:-1;
    const dir=meta.rescues%2?centerDir:-centerDir;
    const nearSlots=ball.position.y>slotY-110;
    const lateral=dir*(nearSlots?.55:1.05);
    Body.applyForce(ball,ball.position,{x:lateral*ball.mass*.0011,y:ball.mass*(nearSlots?.0024:.0019)});
    Body.setVelocity(ball,{x:Math.max(-3.2,Math.min(3.2,ball.velocity.x+lateral)),y:Math.max(nearSlots?2.8:2.2,ball.velocity.y+1.8)});
    Body.setAngularVelocity(ball,(Math.random()-.5)*.16);
    meta.lastMovingAt=now;meta.lastY=ball.position.y;
    if(meta.rescues>=MAX_RESCUES)meta.watchdogWarning=true;
   }
  }
 }
 return{tick};
}
