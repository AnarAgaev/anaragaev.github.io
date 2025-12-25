const o=t=>{const s=new Map;for(const e of t)if(e)if(s.has(e.id)){const c=s.get(e.id);c.selectedCount++}else s.set(e.id,{...e,selectedCount:1});return Array.from(s.values())};export{o as c};
