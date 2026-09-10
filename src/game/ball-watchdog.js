export function createBallWatchdog({Matter,world,balls,getBounds,finish}){
 const {Body,World}=Matter;
 const MAX_AGE_MS=12000,STUCK_MS=1400,MIN_SPEED=.16;
 function remove(ball){World.remove(world,ball);const i=balls.indexOf(ball);if(i>=0)balls.splice(i,1)}
 function tick(now=performance.now()){
  const {width,height,slotY}=getBounds();
  for(const ball of [...balls]){
   const meta=ball.gameData||(ball.gameData={});
   meta.spawnedAt??=now;meta.lastMovingAt??=now;
   const speed=Math.hypot(ball.velocity.x,ball.velocity.y);
   if(speed>MIN_SPEED)meta.lastMovingAt=now;
   if(ball.position.y>=slotY-8){finish(ball);continue}
   if(ball.position.y>height+80||ball.position.x<-80||ball.position.x>width+80){remove(ball);continue}
   if(now-meta.spawnedAt>MAX_AGE_MS){finish(ball);continue}
   if(now-meta.lastMovingAt>STUCK_MS){
    const dir=ball.position.x<width/2?1:-1;
    Body.setVelocity(ball,{x:dir*(1.1+Math.random()),y:Math.max(2.6,ball.velocity.y+2.2)});
    Body.setPosition(ball,{x:Math.min(width-16,Math.max(16,ball.position.x+dir*3)),y:Math.min(slotY-18,ball.position.y+5)});
    meta.lastMovingAt=now;meta.rescues=(meta.rescues||0)+1;
   }
  }
 }
 return{tick};
}
