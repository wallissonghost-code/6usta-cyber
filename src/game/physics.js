import {GAME_RULES} from './rules.js';

export function createPhysics({Matter,engine,world,onCollision}){
 const {Bodies,World,Events}=Matter;
 let W=innerWidth,H=innerHeight,slotY=1,slotWidth=1,boss=null,pins=[],bounds=[],slotSensors=[];
 const clear=()=>{for(const body of [...bounds,...pins,...slotSensors,boss].filter(Boolean))World.remove(world,body);bounds=[];pins=[];slotSensors=[];boss=null};
 function build(width,height){
  clear();W=Math.max(280,width);H=Math.max(480,height);
  bounds=[Bodies.rectangle(W/2,-30,W,60,{isStatic:true,label:'wall'}),Bodies.rectangle(-20,H/2,40,H,{isStatic:true,label:'wall'}),Bodies.rectangle(W+20,H/2,40,H,{isStatic:true,label:'wall'})];World.add(world,bounds);
  const r=Math.min(W*.12,GAME_RULES.boss.maxRadius);boss=Bodies.polygon(W/2,H*GAME_RULES.boss.yRatio,6,r,{isStatic:true,label:'boss',renderRadius:r,friction:0,frictionStatic:0});World.add(world,boss);
  const sy=Math.min((H*.32)/GAME_RULES.board.rows,65),start=H*.38;
  for(let row=0;row<GAME_RULES.board.rows;row++){
   const count=row%2===0?6:5,dx=W/(count+1);
   for(let col=1;col<=count;col++){
    const pin=Bodies.circle(dx*col,start+row*sy,GAME_RULES.board.pinBodyRadius,{isStatic:true,restitution:GAME_RULES.board.pinRestitution,friction:0,frictionStatic:0,label:'pin'});
    pin.plugin={...(pin.plugin||{}),pinId:`r${row}c${col}`,row,col};pins.push(pin);
   }
  }
  World.add(world,pins);slotWidth=W/5;slotY=H-GAME_RULES.board.slotBottom;
  for(let i=1;i<5;i++){
   const divider=Bodies.rectangle(i*slotWidth,slotY-28,GAME_RULES.board.dividerWidth,GAME_RULES.board.dividerHeight,{isStatic:true,friction:0,frictionStatic:0,restitution:.12,chamfer:{radius:Math.max(2,GAME_RULES.board.dividerWidth/2)},label:'divider'});
   bounds.push(divider);World.add(world,divider);
  }
  const sensorWidth=Math.max(20,slotWidth-GAME_RULES.board.dividerWidth*2);
  for(let i=0;i<5;i++){
   const sensor=Bodies.rectangle((i+.5)*slotWidth,slotY+20,sensorWidth,38,{isStatic:true,isSensor:true,label:'slotSensor'});
   sensor.plugin={...(sensor.plugin||{}),slotIndex:i};slotSensors.push(sensor);
  }
  World.add(world,slotSensors);return snapshot();
 }
 Events.on(engine,'collisionStart',onCollision);
 const snapshot=()=>({width:W,height:H,slotY,slotWidth,boss,pins,slotSensors});
 return{build,snapshot};
}

export function createFixedStepper(engine,Matter){
 let last=performance.now(),acc=0;const STEP=1000/60,MAX_DELTA=150,MAX_STEPS=9;
 return now=>{const delta=Math.min(MAX_DELTA,Math.max(0,now-last));last=now;acc+=delta;let steps=0;while(acc>=STEP&&steps<MAX_STEPS){Matter.Engine.update(engine,STEP);acc-=STEP;steps++}if(steps===MAX_STEPS&&acc>STEP*MAX_STEPS)acc=STEP*MAX_STEPS};
}
