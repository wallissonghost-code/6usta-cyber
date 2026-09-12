(()=>{'use strict';
const BALL_TYPES=['like','comment','rosa','capivara','galaxia'];
const ACTIONS=[
 {id:'drop_ball',label:'Bolinha',description:'Solta bolinhas no campo.',params:[{id:'ballType',label:'Tipo da bolinha',type:'select',default:'like',options:BALL_TYPES.map(value=>({value,label:value[0].toUpperCase()+value.slice(1)}))},{id:'quantity',label:'Quantidade',type:'number',min:1,max:50,default:1}]},
 {id:'restart',label:'Reiniciar',description:'Reinicia a partida.',params:[]}
];
const rulesFrom=data=>data?.rules||data?.liveRules||data?.mappings||data?.config?.rules||data?.configuration?.rules||null;
function syncRules(data={}){const rules=rulesFrom(data);if(!Array.isArray(rules))return false;return window.CyberLiveHud?.setRules?.(rules)===true}
async function execute(data={}){syncRules(data);const action=String(data.action||data.command||''),p=data.params&&typeof data.params==='object'?data.params:{},user=String(data.user||data.username||'Live');if(action==='drop_ball'){window.CyberGame?.dispatch?.('drop_ball',{...p,user,quantity:data.quantity??p.quantity});return true}if(action==='restart'){window.CyberGame?.reset?.();return true}return false}
window.CyberLiveActions={actions:ACTIONS,execute,syncRules,ballTypes:BALL_TYPES};
})();