export const GAME_RULES=Object.freeze({
 gravity:1.4,
 boss:{maxHp:1200,yRatio:.28,maxRadius:45},
 board:{rows:6,pinRadius:5,pinBodyRadius:6,slotBottom:180,dividerWidth:5,dividerHeight:82},
 slots:Object.freeze([2,5,15,5,2]),
 ball:{restitution:.56,friction:.02,frictionAir:.008,slop:.05,spawnSpread:.34},
 types:Object.freeze({
  like:Object.freeze({color:'#00f0ff',radius:7,damage:15,scoreValue:5,density:.002}),
  comment:Object.freeze({color:'#ffe600',radius:9,damage:30,scoreValue:25,density:.003}),
  rosa:Object.freeze({color:'#ff0055',radius:11,damage:100,scoreValue:120,density:.004}),
  capivara:Object.freeze({color:'#39ff14',radius:9,damage:80,scoreValue:90,density:.003,count:4,interval:180}),
  galaxia:Object.freeze({color:'#b000ff',radius:14,damage:500,scoreValue:1500,density:.008})
 })
});
export const slotIndex=(x,width)=>Math.min(4,Math.max(0,Math.floor(x/(width/5))));
export const slotPoints=(scoreValue,index)=>Number(scoreValue||0)*GAME_RULES.slots[index];
