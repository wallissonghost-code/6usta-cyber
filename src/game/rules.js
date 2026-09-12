export const GAME_RULES=Object.freeze({
 gravity:1.4,
 boss:Object.freeze({maxHp:1200,yRatio:.28,maxRadius:45}),
 board:Object.freeze({rows:6,pinRadius:5,pinBodyRadius:6,pinRestitution:.35,slotBottom:180,dividerWidth:5,dividerHeight:82}),
 pinDeflector:Object.freeze({centerTolerance:1.5,cooldownMs:90,minLateral:1.35,maxLateral:3.2,lateralKick:.65,minDownward:1.55,maxDownward:4.6,verticalCarry:.72}),
 slots:Object.freeze([2,5,15,5,2]),
 ball:Object.freeze({restitution:.42,friction:0,frictionStatic:0,frictionAir:.006,slop:.04,spawnSpread:.34}),
 types:Object.freeze({
  tier1:Object.freeze({tier:1,color:'#00f0ff',radius:7,damage:15,scoreValue:5,density:.002}),
  tier2:Object.freeze({tier:2,color:'#ffe600',radius:9,damage:30,scoreValue:25,density:.003}),
  tier3:Object.freeze({tier:3,color:'#39ff14',radius:9,damage:80,scoreValue:90,density:.003}),
  tier4:Object.freeze({tier:4,color:'#ff0055',radius:11,damage:100,scoreValue:120,density:.004}),
  tier5:Object.freeze({tier:5,color:'#b000ff',radius:14,damage:500,scoreValue:1500,density:.008})
 })
});
export const slotIndex=(x,width)=>Math.min(4,Math.max(0,Math.floor(x/(width/5))));
export const slotPoints=(scoreValue,index)=>Number(scoreValue||0)*GAME_RULES.slots[index];
