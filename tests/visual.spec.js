const{test,expect}=require('@playwright/test');

const rect=sel=>{const el=document.querySelector(sel);if(!el)return null;const r=el.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom,hidden:el.hidden}};

test('tela usa o stage inteiro sem exceder a viewport',async({page})=>{
 await page.goto('/');
 await page.waitForFunction(()=>window.CyberGame);
 const r=await page.evaluate(()=>({iw:innerWidth,ih:innerHeight,b:document.body.getBoundingClientRect().toJSON(),v:document.getElementById('viewport').getBoundingClientRect().toJSON(),meta:document.querySelector('meta[name=viewport]').content}));
 expect(Math.abs(r.v.width-r.iw)).toBeLessThanOrEqual(1);
 expect(Math.abs(r.v.height-r.ih)).toBeLessThanOrEqual(1);
 expect(Math.abs(r.b.height-r.ih)).toBeLessThanOrEqual(1);
 expect(r.meta).toContain('user-scalable=no');
 expect(r.meta).toContain('maximum-scale=1');
});

test('HUD, multiplicadores e HUD da Live respeitam a viewport e não se sobrepõem',async({page})=>{
 await page.goto('/');
 await page.waitForFunction(()=>window.CyberGame&&window.CyberLiveHud);
 const result=await page.evaluate(rect=>{const get=eval(`(${rect})`);return{iw:innerWidth,ih:innerHeight,top:get('.hud-top'),slots:get('.slots-container'),live:get('#live-interactions')}},rect.toString());
 for(const b of [result.top,result.slots,result.live]){
  expect(b).not.toBeNull();
  if(b.hidden)continue;
  expect(b.x).toBeGreaterThanOrEqual(0);
  expect(b.y).toBeGreaterThanOrEqual(0);
  expect(b.right).toBeLessThanOrEqual(result.iw+1);
  expect(b.bottom).toBeLessThanOrEqual(result.ih+1);
 }
 if(!result.live.hidden)expect(result.slots.bottom).toBeLessThanOrEqual(result.live.y-8);
});

test('multiplicadores acompanham a altura real do HUD da Live com várias linhas',async({page})=>{
 await page.goto('/');
 await page.waitForFunction(()=>window.CyberLiveHud);
 await page.evaluate(()=>{
  const rules=Array.from({length:7},(_,i)=>({giftName:`Gift ${i+1}`,action:'drop_ball',params:{ballType:'tier1',quantity:1}}));
  CyberLiveHud.setVisible(true);
  CyberLiveHud.setRules(rules);
 });
 await page.waitForTimeout(100);
 const before=await page.evaluate(()=>{const s=document.querySelector('.slots-container').getBoundingClientRect(),h=document.getElementById('live-interactions').getBoundingClientRect();return{slotsBottom:s.bottom,hudTop:h.top,hudHeight:h.height}});
 expect(before.hudHeight).toBeGreaterThan(100);
 expect(before.slotsBottom).toBeLessThanOrEqual(before.hudTop-8);
 await page.evaluate(()=>CyberLiveHud.setRules([{giftName:'Gift único',action:'drop_ball',params:{ballType:'tier1',quantity:1}}]));
 await page.waitForTimeout(100);
 const after=await page.evaluate(()=>{const s=document.querySelector('.slots-container').getBoundingClientRect(),h=document.getElementById('live-interactions').getBoundingClientRect();return{slotsBottom:s.bottom,hudTop:h.top,hudHeight:h.height}});
 expect(after.hudHeight).toBeLessThan(before.hudHeight);
 expect(after.slotsBottom).toBeLessThanOrEqual(after.hudTop-8);
 expect(after.slotsBottom).toBeGreaterThan(before.slotsBottom);
});

test('HUD mobile usa três colunas e multiplicadores ficam abaixo de todos os pinos',async({page})=>{
 await page.goto('/');await page.waitForFunction(()=>window.CyberLiveHud&&window.CyberGame);
 await page.evaluate(()=>CyberLiveHud.setRules(Array.from({length:5},(_,i)=>({giftName:`Presente ${i+1}`,action:'drop_ball',params:{ballType:`tier${Math.min(5,i+1)}`,quantity:1}}))));
 await page.waitForTimeout(100);
 const r=await page.evaluate(()=>{const live=document.querySelector('.live-interactions-list'),cards=[...document.querySelectorAll('.live-rule-card')],contributors=document.querySelector('.contributors-bar').getBoundingClientRect(),slots=document.querySelector('.slots-container').getBoundingClientRect(),state=CyberGame.getState();return{cols:getComputedStyle(live).gridTemplateColumns,cards:cards.map(x=>x.getBoundingClientRect().toJSON()),contributors:contributors.toJSON(),slots:slots.toJSON(),pinBottom:state.board.pinBottom,iw:innerWidth}});
 if(r.iw<=600)expect(r.cols.split(' ').length).toBe(3);
 expect(r.cards.every(x=>x.width>0&&x.height>=50)).toBeTruthy();
 expect(r.contributors.left).toBeGreaterThanOrEqual(0);expect(r.contributors.right).toBeLessThanOrEqual(r.iw+1);
 expect(r.slots.top).toBeGreaterThan(r.pinBottom+8);
});
