import { lockViewport } from './ui/viewport.js';
import { createGameRuntime } from './game/runtime.js';
import { createCommands } from './game/commands.js';
import { createLiveHud } from './live/live-hud.js';

lockViewport();
const runtime=createGameRuntime();
const commands=createCommands(runtime);
const liveHud=createLiveHud();
window.startGame=runtime.start;
window.CyberGame=Object.freeze({dropBall:commands.dropBall,reset:runtime.reset,resize:runtime.resize,getState:runtime.getState,getBallAudit:runtime.getBallAudit,dispatch:commands.dispatch});
window.CyberLiveHud=Object.freeze(liveHud);
window.addEventListener('cyber:action',e=>commands.dispatch(e.detail?.action,e.detail?.payload||{}));
