const STORAGE_KEY='cyber-action-config-v1';
const ACTION_IDS=['like','comment','gift_rosa','gift_capivara','gift_galaxia'];
const DEFAULT_QUANTITY=1;
const clampQuantity=value=>Math.max(0,Math.min(50,Math.floor(Number(value)||0)));
export function createActionConfig(){
 let quantities=Object.fromEntries(ACTION_IDS.map(id=>[id,DEFAULT_QUANTITY]));
 try{const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');for(const id of ACTION_IDS)if(saved[id]!=null)quantities[id]=clampQuantity(saved[id])}catch{}
 const persist=()=>{try{localStorage.setItem(STORAGE_KEY,JSON.stringify(quantities))}catch{}};
 const getQuantity=id=>ACTION_IDS.includes(id)?quantities[id]:DEFAULT_QUANTITY;
 const setQuantity=(id,value)=>{if(!ACTION_IDS.includes(id))return false;quantities[id]=clampQuantity(value);persist();return true};
 const apply=values=>{if(!values||typeof values!=='object')return false;let changed=false;for(const id of ACTION_IDS)if(values[id]!=null){quantities[id]=clampQuantity(values[id]);changed=true}if(changed)persist();return changed};
 const snapshot=()=>({...quantities});
 return{getQuantity,setQuantity,apply,snapshot};
}
export const ACTION_CONFIG_STORAGE_KEY=STORAGE_KEY;
