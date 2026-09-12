const SOUND_KEY='cyber-sound-enabled';
export function createAudioManager(){
 let ctx=null,master=null,enabled=read(),needsGesture=true;
 const standalone=()=>window.matchMedia?.('(display-mode: standalone)').matches||navigator.standalone===true;
 function read(){try{return localStorage.getItem(SOUND_KEY)!=='0'}catch{return true}}
 function destroy(){try{ctx?.close?.()}catch{}ctx=null;master=null;needsGesture=true}
 function build(){
  if(ctx?.state==='closed')destroy();
  if(ctx)return ctx;
  const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;
  try{ctx=new A({latencyHint:'interactive'})}catch{try{ctx=new A()}catch{return null}}
  master=ctx.createGain();master.gain.value=enabled?.9:0;master.connect(ctx.destination);
  needsGesture=ctx.state!=='running';ctx.onstatechange=()=>{needsGesture=ctx.state!=='running'};
  return ctx;
 }
 function prime(c){try{const b=c.createBuffer(1,1,22050),s=c.createBufferSource(),g=c.createGain(),t=c.currentTime;g.gain.setValueAtTime(.000001,t);s.buffer=b;s.connect(g).connect(master);s.start(t)}catch{}}
 async function resume(c){if(!c||c.state==='closed')return false;try{if(c.state!=='running')await c.resume();if(c.state==='running'){prime(c);needsGesture=false;return true}}catch{}needsGesture=true;return false}
 function unlock(){if(!enabled)return null;const c=build();if(!c)return null;resume(c);return c}
 function playable(){if(!enabled)return null;let c=build();if(!c)return null;if(c.state==='closed'){destroy();c=build()}if(c&&c.state!=='running')resume(c);return c}
 function play(kind){const c=playable();if(!c)return;const emit=()=>{if(!enabled||c.state!=='running')return;try{const o=c.createOscillator(),g=c.createGain(),n=c.currentTime;o.connect(g).connect(master);o.type=kind==='boss_hit'?'sawtooth':kind==='hit'?'triangle':'sine';o.frequency.setValueAtTime(kind==='boss_hit'?120:kind==='hit'?360:400,n);o.frequency.exponentialRampToValueAtTime(kind==='boss_hit'?40:kind==='hit'?120:800,n+.1);g.gain.setValueAtTime(.12,n);g.gain.exponentialRampToValueAtTime(.0001,n+.12);o.start(n);o.stop(n+.14)}catch{}};if(c.state==='running')emit();else resume(c).then(ok=>{if(ok)emit()})}
 function setEnabled(value){enabled=!!value;try{localStorage.setItem(SOUND_KEY,enabled?'1':'0')}catch{}if(master)master.gain.value=enabled?.9:0;if(enabled){const c=unlock();if(c)resume(c).then(ok=>{if(ok)play('score')})}window.dispatchEvent(new CustomEvent('cyber:sound-visibility',{detail:{enabled}}));return enabled}
 const recover=()=>{if(!enabled)return;if(ctx?.state==='closed')destroy();const c=build();if(c&&c.state!=='running'){needsGesture=true;resume(c)}};
 const gesture=()=>{if(enabled&&(needsGesture||ctx?.state!=='running'||standalone()))recover()};
 ['touchstart','touchend','pointerdown','pointerup','mousedown','keydown','click'].forEach(ev=>document.addEventListener(ev,gesture,{passive:true,capture:true}));
 document.addEventListener('visibilitychange',()=>{if(document.hidden){needsGesture=true;return}recover()});
 window.addEventListener('pageshow',recover);window.addEventListener('focus',recover);
 window.addEventListener('pagehide',()=>{needsGesture=true});
 return{play,unlock,recover,setEnabled,toggle:()=>setEnabled(!enabled),isEnabled:()=>enabled,status:()=>({supported:!!(window.AudioContext||window.webkitAudioContext),state:ctx?.state||'not-created',enabled,standalone:standalone(),needsGesture})};
}
