import { lockViewport } from './ui/viewport.js';
import { createAudioManager } from './audio/sfx.js';
import { createGameRuntime } from './game/runtime.js';
import { createCommands } from './game/commands.js';
import { createLiveHud } from './live/live-hud.js';

lockViewport();
const audio=createAudioManager();
const runtime=createGameRuntime({audio});
const commands=createCommands(runtime);
const liveHud=createLiveHud();
const soundToggle=document.getElementById('soundToggle');
if(soundToggle){soundToggle.checked=audio.isEnabled();soundToggle.addEventListener('change',()=>audio.setEnabled(soundToggle.checked))}
window.startGame=runtime.start;
window.CyberAudio=Object.freeze(audio);
window.CyberGame=Object.freeze({dropBall:commands.dropBall,reset:runtime.reset,resize:runtime.resize,getState:runtime.getState,getBallAudit:runtime.getBallAudit,dispatch:commands.dispatch});
window.CyberLiveHud=Object.freeze(liveHud);
window.addEventListener('cyber:action',e=>commands.dispatch(e.detail?.action,e.detail?.payload||{}));
