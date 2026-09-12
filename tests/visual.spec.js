const{test,expect}=require('@playwright/test');

test('tela permanece presa à viewport',async({page})=>{
 await page.goto('/');
 await page.waitForFunction(()=>window.CyberGame);
 const r=await page.evaluate(()=>({iw:innerWidth,ih:innerHeight,b:document.body.getBoundingClientRect().toJSON(),v:document.getElementById('viewport').getBoundingClientRect().toJSON(),meta:document.querySelector('meta[name=viewport]').content}));
 expect(Math.abs(r.v.width-r.iw)).toBeLessThanOrEqual(1);
 expect(Math.abs(r.v.height-r.ih)).toBeLessThanOrEqual(1);
 expect(r.meta).toContain('user-scalable=no');
 expect(r.meta).toContain('maximum-scale=1');
});

test('HUD, multiplicadores e HUD da Live respeitam a viewport e não se sobrepõem',async({page})=>{
 await page.goto('/');
 await page.waitForFunction(()=>window.CyberGame&&window.CyberLiveHud);
 const result=await page.evaluate(()=>{
  const rect=sel=>{const el=document.querySelector(sel);if(!el)return null;const r=el.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom,hidden:el.hidden}};
  return{iw:innerWidth,ih:innerHeight,top:rect('.hud-top'),slots:rect('.slots-container'),live:rect('#live-interactions')};
 });
 for(const b of [result.top,result.slots,result.live]){
  expect(b).not.toBeNull();
  if(b.hidden)continue;
  expect(b.x).toBeGreaterThanOrEqual(0);
  expect(b.y).toBeGreaterThanOrEqual(0);
  expect(b.right).toBeLessThanOrEqual(result.iw+1);
  expect(b.bottom).toBeLessThanOrEqual(result.ih+1);
 }
 if(!result.live.hidden)expect(result.slots.bottom).toBeLessThanOrEqual(result.live.y-5);
});
