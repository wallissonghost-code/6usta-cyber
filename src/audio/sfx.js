const SOUND_KEY='cyber-sound-enabled';
export function createAudioManager(){
 let ctx=null,master=null,enabled=read(),needsGesture=true;
 const standalone=()=>window.matchMedia?.('(display-mode: standalone)').matches||navigator.standalone===true;
 function read(){try{return localStorage.getItem(SOUND_KEY)!=='0'}catch{return true}}
 function destroy(){try{ctx?.close?.()}catch{}ctx=null;master=null;needsGesture=true}
 function build(){if(ctx?.state==='closed')destroy();if(ctx)return ctx;const A=window.AudioContext||window.webkitAudioContext;if(!A)return null;try{ctx=new A({latencyHint:'interactive'})}catch{ctx=new A()}master=ctx.createGain();master.gain.value=.9;master.connect(ctx.destination);needsGesture=ctx.state!=='running';ctx.onstatechange=()=>{needsGesture=ctx.state!=='running'};return ctx}
 function prime(c){try{const b=c.createBuffer(1,1,22050),s=c.createBufferSource(),g=c.createGain(),t=c.currentTime;g.gain.value=.000001;s.buffer=b;s.connect(g).connect(master);s.start(t)}catch{}}
 function unlock(){if(!enabled)return null;const c=build();if(!c)return null;try{if(c.state!=='running'){const p=c.resume();p?.catch?.(()=>{})}prime(c);needsGesture=false}catch{needsGesture=true}return c}
 function playable(){if(!enabled)return null;const c=build();if(!c)return null;if(c.state==='closed'){destroy();return unlock()}if(c.state!=='running')return unlock();return c}
 function play(kind){const c=playable();if(!c)return;try{const o=c.createOscillator(),g=c.createGain(),n=c.currentTime;o.connect(g).connect(master);o.type=kind==='boss_hit'?'sawtooth':kind==='hit'?'triangle':'sine';o.frequency.setValueAtTime(kind==='boss_hit'?120:kind==='hit'?360:400,n);o.frequency.exponentialRampToValueAtTime(kind==='boss_hit'?40:kind==='hit'?120:800,n+.1);g.gain.setValueAtTime(.12,n);g.gain.linearRampToValueAtTime(.01,n+.12);o.start(n);o.stop(n+.12)}catch{}}
 function setEnabled(value){enabled=!!value;try{localStorage.setItem(SOUND_KEY,enabled?'1':'0')}catch{}if(enabled){unlock();play('score')}else if(master)master.gain.value=0;if(enabled&&master)master.gain.value=.9;window.dispatchEvent(new CustomEvent('cyber:sound-visibility',{detail:{enabled}}));return enabled}
 const gesture=()=>{if(enabled&&(needsGesture||ctx?.state!=='running'||standalone()))unlock()};
 ['touchstart','touchend','pointerdown','pointerup','click'].forEach(ev=>document.addEventListener(ev,gesture,{passive:true,capture:true}));
 document.addEventListener('visibilitychange',()=>{if(document.hidden){needsGesture=true;return}if(ctx?.state==='closed')destroy();else if(ctx?.state!=='running')needsGesture=true});
 window.addEventListener('pageshow',()=>{if(ctx?.state==='closed')destroy();else if(ctx?.state!=='running')needsGesture=true});
 window.addEventListener('focus',()=>{if(!document.hidden&&enabled&&ctx?.state==='running')prime(ctx)});
 return{play,unlock,setEnabled,toggle:()=>setEnabled(!enabled),isEnabled:()=>enabled,status:()=>({supported:!!(window.AudioContext||window.webkitAudioContext),state:ctx?.state||'not-created',enabled,standalone:standalone(),needsGesture})};
}
