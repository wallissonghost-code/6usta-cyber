(()=>{'use strict';
const configurable={type:'integer',min:0,max:50,default:1,label:'Quantidade de bolas'};
const ACTIONS=[
 {id:'like',label:'Like',description:'Solta esfera de like.',config:{quantity:configurable}},
 {id:'comment',label:'Comentário',description:'Solta esfera de comentário.',config:{quantity:configurable}},
 {id:'gift_rosa',label:'Rosa',description:'Executa o presente Rosa.',config:{quantity:configurable}},
 {id:'gift_capivara',label:'Capivara',description:'Executa o presente Capivara.',config:{quantity:configurable}},
 {id:'gift_galaxia',label:'Galáxia',description:'Executa o presente Galáxia.',config:{quantity:configurable}},
 {id:'restart',label:'Reiniciar',description:'Reinicia a partida.'}
];
function applyConfig(data={}){const values=data.actionQuantities||data.quantities||data.config?.actionQuantities||data.config?.quantities;if(!values)return false;return window.CyberGame?.applyActionConfig?.(values)===true}
async function execute(data={}){if(data.type==='game_config'||data.type==='action_config'||data.action==='configure_actions')return applyConfig(data);const a=String(data.action||data.command||''),u=String(data.user||data.username||'Live'),quantity=data.quantity??data.params?.quantity;if(a==='like')window.triggerLike?.(u,{quantity});else if(a==='comment')window.triggerComment?.(u,String(data.text||data.comment||'!drop'),{quantity});else if(a==='gift_rosa')window.triggerGift?.(u,'Rosa',{quantity});else if(a==='gift_capivara')window.triggerGift?.(u,'Capivara',{quantity});else if(a==='gift_galaxia')window.triggerGift?.(u,'Galáxia',{quantity});else if(a==='restart')window.CyberGame?.reset?.();else return false;return true}
window.CyberLiveActions={actions:ACTIONS,execute,applyConfig};
})();