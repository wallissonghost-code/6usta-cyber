const {test,expect}=require('@playwright/test');
async function state(page){return page.evaluate(()=>CyberGame.getState())}
test.beforeEach(async({page})=>{await page.goto('/');await page.waitForFunction(()=>window.CyberGame&&window.CyberLiveActions)});
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
