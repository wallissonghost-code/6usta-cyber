export function createBallWatchdog({Matter,world,balls,getBounds}){
 const {Body,World}=Matter;
 const STUCK_MS=1400,MIN_SPEED=.16,MAX_RESCUES=8;
 function remove(ball,reason='out-of-bounds'){
  if(ball?.gameData){ball.gameData.removedReason=reason;ball.gameData.removedAt=performance.now()}
  World.remove(world,ball);const i=balls.indexOf(ball);if(i>=0)balls.splice(i,1)
 }
 function tick(now=performance.now()){
  const {width,height}=getBounds();
  for(const ball of [...balls]){
   const meta=ball.gameData||(ball.gameData={});
   meta.spawnedAt??=now;meta.lastMovingAt??=now;
   const speed=Math.hypot(ball.velocity.x,ball.velocity.y);
   if(speed>MIN_SPEED)meta.lastMovingAt=now;
   if(ball.position.y>height+80||ball.position.x<-80||ball.position.x>width+80){remove(ball);continue}
   if(now-meta.lastMovingAt>STUCK_MS){
    meta.rescues=(meta.rescues||0)+1;
    const dir=ball.velocity.x!==0?Math.sign(ball.velocity.x):(ball.position.x<width/2?1:-1);
    const lateral=dir*(.75+Math.random()*.55);
    Body.applyForce(ball,ball.position,{x:lateral*ball.mass*.0007,y:ball.mass*.0018});
    Body.setVelocity(ball,{x:ball.velocity.x+lateral,y:Math.max(1.8,ball.velocity.y+1.5)});
    meta.lastMovingAt=now;
    if(meta.rescues>=MAX_RESCUES)meta.watchdogWarning=true;
   }
  }
 }
 return{tick};
}
