export function createBallWatchdog({Matter,world,balls,getBounds}){
 const {Body,World}=Matter;
 const STUCK_MS=650,MIN_SPEED=.28,MAX_RESCUES=18,MIN_PROGRESS=.55;
 function remove(ball,reason='out-of-bounds'){
  if(ball?.gameData){ball.gameData.removedReason=reason;ball.gameData.removedAt=performance.now()}
  World.remove(world,ball);const i=balls.indexOf(ball);if(i>=0)balls.splice(i,1)
 }
 function tick(now=performance.now()){
  const {width,height,slotY}=getBounds();
  for(const ball of [...balls]){
   const meta=ball.gameData||(ball.gameData={});
   meta.spawnedAt??=now;meta.lastMovingAt??=now;meta.lastY??=ball.position.y;meta.lastProgressAt??=now;
   const speed=Math.hypot(ball.velocity.x,ball.velocity.y),progress=ball.position.y-meta.lastY;
   if(progress>MIN_PROGRESS){meta.lastProgressAt=now;meta.lastY=ball.position.y}
   if(speed>MIN_SPEED&&progress>0){meta.lastMovingAt=now}
   const stalledFor=now-Math.max(meta.lastMovingAt,meta.lastProgressAt);
   if(ball.position.y>height+80||ball.position.x<-80||ball.position.x>width+80){remove(ball);continue}
   if(stalledFor>STUCK_MS){
    meta.rescues=(meta.rescues||0)+1;
    const nearSlots=ball.position.y>slotY-120;
    const centerDir=ball.position.x<width/2?1:-1;
    const alternate=meta.rescues%2?1:-1;
    const dir=centerDir*alternate;
    const lateral=dir*(nearSlots?.8:1.35);
    const down=nearSlots?3.8:3.1;
    Body.applyForce(ball,ball.position,{x:lateral*ball.mass*.0015,y:ball.mass*(nearSlots?.0032:.0025)});
    Body.setVelocity(ball,{x:Math.max(-4.2,Math.min(4.2,ball.velocity.x+lateral)),y:Math.max(down,ball.velocity.y+2.35)});
    Body.setAngularVelocity(ball,dir*.12);
    meta.lastMovingAt=now;meta.lastProgressAt=now;meta.lastY=ball.position.y;
    if(meta.rescues>=MAX_RESCUES)meta.watchdogWarning=true;
   }
  }
 }
 return{tick};
}
