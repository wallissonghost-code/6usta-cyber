import { lockViewport } from './ui/viewport.js';
import { createGameRuntime } from './game/runtime.js';
import { createCommands } from './game/commands.js';
import { createActionConfig } from './game/action-config.js';
import { mountDebugController } from './debug/debug-controller.js';

lockViewport();
const runtime=createGameRuntime();
const actionConfig=createActionConfig();
const commands=createCommands(runtime,actionConfig);

window.startGame=runtime.start;
window.CyberGame=Object.freeze({
 dropBall:runtime.drop,
 reset:runtime.reset,
 resize:runtime.resize,
 getState:()=>({...runtime.getState(),actionQuantities:actionConfig.snapshot()}),
 getBallAudit:runtime.getBallAudit,
 getActionConfig:actionConfig.snapshot,
 setActionQuantity:actionConfig.setQuantity,
 applyActionConfig:actionConfig.apply,
 triggerLike:commands.like,
 triggerComment:commands.comment,
 triggerGift:commands.gift,
 dispatch:commands.dispatch
});
window.addEventListener('cyber:action',e=>commands.dispatch(e.detail?.action,e.detail?.payload||{}));
mountDebugController({commands});
