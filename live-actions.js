(()=>{'use strict';
const BALL_TYPES=['tier1','tier2','tier3','tier4','tier5'];
const DAMAGE_LABELS={tier1:'15 dano',tier2:'30 dano',tier3:'80 dano',tier4:'100 dano',tier5:'500 dano'};
const ACTIONS=[
 {id:'drop_ball',label:'Drop de bolinha',description:'Solta bolinhas com potência definida pelo dano.',params:[{id:'ballType',label:'Dano da bolinha',type:'select',default:'tier1',options:BALL_TYPES.map(value=>({value,label:DAMAGE_LABELS[value]}))},{id:'quantity',label:'Quantidade',type:'number',min:1,max:50,default:1}]},
 {id:'restart',label:'Reiniciar',description:'Reinicia a partida.',params:[]}
];
const rulesFrom=data=>data?.rules||data?.liveRules||data?.mappings||data?.config?.rules||data?.configuration?.rules||null;
function syncRules(data={}){const rules=rulesFrom(data);if(!Array.isArray(rules))return false;return window.CyberLiveHud?.setRules?.(rules)===true}
async function execute(data={}){syncRules(data);const action=String(data.action||data.command||''),p=data.params&&typeof data.params==='object'?data.params:{},user=String(data.user||data.username||'Live');if(action==='drop_ball'){window.CyberGame?.dispatch?.('drop_ball',{...p,user,quantity:data.quantity??p.quantity});return true}if(action==='restart'){window.CyberGame?.reset?.();return true}return false}
window.CyberLiveActions={actions:ACTIONS,execute,syncRules,ballTypes:BALL_TYPES};
})();