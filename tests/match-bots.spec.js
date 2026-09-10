const {test,expect}=require('@playwright/test');
async function state(page){return page.evaluate(()=>CyberGame.getState())}
test.beforeEach(async({page})=>{await page.goto('/');await page.waitForFunction(()=>window.CyberGame&&window.CyberLiveActions)});
test('5 bolas entram fisicamente nos slots e contabilizam uma unica vez',async({page})=>{
 await page.evaluate(()=>{CyberGame.reset();for(let i=0;i<5;i++)CyberGame.triggerLike('FiveBall'+i)});
 await expect.poll(async()=>page.evaluate(()=>CyberGame.getBallAudit().filter(x=>x.event==='slot').length),{timeout:20000}).toBe(5);
 const result=await page.evaluate(()=>({state:CyberGame.getState(),audit:CyberGame.getBallAudit()}));
 const spawns=result.audit.filter(x=>x.event==='spawn'),slots=result.audit.filter(x=>x.event==='slot'),removed=result.audit.filter(x=>x.event==='removed');
 expect(spawns).toHaveLength(5);expect(slots).toHaveLength(5);expect(removed).toHaveLength(5);expect(result.state.activeBalls).toBe(0);
 expect(new Set(spawns.map(x=>x.id)).size).toBe(5);expect(new Set(slots.map(x=>x.id)).size).toBe(5);expect(new Set(removed.map(x=>x.id)).size).toBe(5);
 expect(slots.every(x=>Number.isInteger(x.slot)&&x.slot>=0&&x.slot<5&&[2,5,15].includes(x.multiplier)&&x.points>0)).toBeTruthy();
 expect(removed.every(x=>x.reason==='scored')).toBeTruthy();
 const expected=slots.reduce((sum,x)=>sum+x.points,0);expect(result.state.topScore).toBe(expected);
});
test('bots simulam partida completa sem acumular bolas',async({page})=>{
 await page.evaluate(()=>{for(let i=0;i<36;i++){setTimeout(()=>CyberGame.triggerLike('BotLike'+i),i*45);if(i%4===0)setTimeout(()=>CyberGame.triggerComment('BotChat'+i,'!drop'),i*45+15);if(i%9===0)setTimeout(()=>CyberGame.triggerGift('BotGift'+i,i%18===0?'Capivara':'Rosa'),i*45+25)}});
 await page.waitForTimeout(15000);
 const s=await state(page);expect(s.topScore).toBeGreaterThan(0);expect(s.activeBalls).toBeLessThanOrEqual(2);
});
test('rajada de presentes termina e runtime continua responsivo',async({page})=>{
 await page.evaluate(()=>{for(let i=0;i<10;i++)CyberGame.triggerGift('Stress'+i,i%3===0?'Galáxia':i%3===1?'Capivara':'Rosa')});
 await page.waitForTimeout(15000);
 let s=await state(page);expect(s.activeBalls).toBeLessThanOrEqual(2);expect(s.bossPercent).toBeGreaterThan(0);expect(s.bossPercent).toBeLessThanOrEqual(100);
 await page.evaluate(()=>CyberGame.triggerLike('AfterStress'));await page.waitForTimeout(100);s=await state(page);expect(s.activeBalls).toBeGreaterThan(0);
});
test('resize durante partida não deixa corpos órfãos',async({page})=>{
 await page.evaluate(()=>{for(let i=0;i<12;i++)CyberGame.triggerLike('ResizeBot'+i)});await page.setViewportSize({width:390,height:700});await page.evaluate(()=>CyberGame.resize());await page.waitForTimeout(15000);expect((await state(page)).activeBalls).toBeLessThanOrEqual(2);
});
