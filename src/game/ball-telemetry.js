export function createBallTelemetry({limit=2000}={}){
 const rows=[];
 const push=(ball,event,data={})=>{if(!ball?.gameData)return;rows.push({id:ball.gameData.id,username:ball.gameData.username,event,at:performance.now(),x:ball.position.x,y:ball.position.y,...data});if(rows.length>limit)rows.splice(0,rows.length-limit)};
 const pinHit=(ball,pin)=>{const m=ball.gameData;m.pinHits=(m.pinHits||0)+1;m.lastPin=pin.plugin?.pinId||pin.id;m.lastPinAt=performance.now();push(ball,'pin-hit',{pin:m.lastPin,pinHits:m.pinHits})};
 const snapshot=()=>rows.map(x=>({...x}));
 const clear=()=>{rows.length=0};
 return{push,pinHit,snapshot,clear};
}
