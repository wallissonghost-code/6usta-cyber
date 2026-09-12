export function mountDebugController({commands}){
 const dock=document.getElementById('debug-dock');
 if(!dock)return()=>{};
 const actions={
  like:()=>commands.like('Gamer_Tap'),
  comment:()=>commands.comment('User_Chat','!drop'),
  rosa:()=>commands.gift('Spectator_01','Rosa'),
  capivara:()=>commands.gift('Mega_Supporter','Capivara'),
  galaxia:()=>commands.gift('Lord_Whale','Galáxia'),
  hide:()=>{dock.style.display='none'}
 };
 const onClick=event=>{
  const button=event.target.closest('[data-debug-action]');
  if(!button||!dock.contains(button))return;
  actions[button.dataset.debugAction]?.();
 };
 dock.addEventListener('click',onClick);
 return()=>dock.removeEventListener('click',onClick);
}
