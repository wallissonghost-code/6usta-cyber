import { lockViewport } from './ui/viewport.js';
import { createGameRuntime } from './game/runtime.js';
import { createCommands } from './game/commands.js';

lockViewport();
const runtime=createGameRuntime();
const commands=createCommands(runtime);

const hideDock=()=>{const d=document.getElementById('debug-dock');if(d)d.style.display='none'};
Object.assign(window,{
 startGame:runtime.start,
 triggerLike:commands.like,
 triggerComment:commands.comment,
 triggerGift:commands.gift,
 hideDock
});
window.CyberGame=Object.freeze({
 dropBall:runtime.drop,
 reset:runtime.reset,
 resize:runtime.resize,
 getState:runtime.getState,
 getBallAudit:runtime.getBallAudit,
 triggerLike:commands.like,
 triggerComment:commands.comment,
 triggerGift:commands.gift,
 dispatch:commands.dispatch
});
window.addEventListener('cyber:action',e=>commands.dispatch(e.detail?.action,e.detail?.payload||{}));
