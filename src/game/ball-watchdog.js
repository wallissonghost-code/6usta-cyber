export function createBallWatchdog({Matter,world,balls,getBounds,onRemove,onStall}){
 const {World}=Matter;const STALL_MS=1800,MIN_PROGRESS=.7;
 function remove(ball,reason){if(ball?.gameData){ball.gameData.removedReason=reason;ball.gameData.removedAt=performance.now()}World.remove(world,ball);const i=balls.indexOf(ball);if(i>=0)balls.splice(i,1);onRemove?.(ball,reason)}
 function tick(now=performance.now()){
  const {width,height}=getBounds();
  for(const ball of [...balls]){
   const meta=ball.gameData||(ball.gameData={});meta.lastY??=ball.position.y;meta.lastProgressAt??=now;
   if(ball.position.y-meta.lastY>MIN_PROGRESS){meta.lastY=ball.position.y;meta.lastProgressAt=now;meta.stallReported=false}
   if(ball.position.y>height+80||ball.position.x<-80||ball.position.x>width+80){remove(ball,'out-of-bounds');continue}
   if(now-meta.lastProgressAt>STALL_MS&&!meta.stallReported){meta.stallReported=true;meta.stalls=(meta.stalls||0)+1;onStall?.(ball,{durationMs:now-meta.lastProgressAt,lastPin:meta.lastPin||null})}
  }
 }
 return{tick};
}
