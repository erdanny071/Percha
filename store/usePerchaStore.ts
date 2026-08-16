import { create } from 'zustand';
import type { Garment, Status } from '@/types/garment';
import type { Outfit } from '@/types/outfit';
import type { LogMap } from '@/types/log';
import type { Settings } from '@/types/settings';
import { storage } from '@/lib/storage';
import { loadGarments, saveGarment, deleteGarmentStorage } from '@/lib/garments/crud';
import { loadOutfits, saveOutfit, deleteOutfitStorage } from '@/lib/outfits/crud';
import { loadLog, saveLog, todayStr } from '@/lib/history/log';

const STATUS_ORDER: Status[] = ['disponible', 'lavando', 'no_quiero'];
interface PerchaState { garments: Garment[]; outfits: Outfit[]; log: LogMap; settings: Settings; initialized: boolean; init: () => Promise<void>; addGarment: (garment: Garment) => Promise<void>; updateGarment: (id:string, patch:Partial<Garment>)=>Promise<void>; deleteGarment:(id:string)=>Promise<void>; toggleFavorite:(id:string)=>Promise<void>; cycleStatus:(id:string)=>Promise<void>; addOutfit:(outfit:Outfit)=>Promise<void>; updateOutfit:(id:string,patch:Partial<Outfit>)=>Promise<void>; deleteOutfit:(id:string)=>Promise<void>; applyOutfit:(ids:string[])=>Promise<void>; updateSettings:(patch:Partial<Settings>)=>Promise<void>; }
export const usePerchaStore=create<PerchaState>((set,get)=>({
 garments:[],outfits:[],log:{},settings:{useAi:false,aiApiKey:null},initialized:false,
 async init(){if(get().initialized)return;await storage.init();const [garments,outfits,log]=await Promise.all([loadGarments(),loadOutfits(),loadLog()]);set({garments,outfits,log,initialized:true});},
 async addGarment(g){await saveGarment(g);set(s=>({garments:[...s.garments.filter(x=>x.id!==g.id),g]}));},
 async updateGarment(id,p){const g=get().garments.find(x=>x.id===id);if(!g)return;const u={...g,...p};await saveGarment(u);set(s=>({garments:s.garments.map(x=>x.id===id?u:x)}));},
 async deleteGarment(id){await deleteGarmentStorage(id);set(s=>({garments:s.garments.filter(x=>x.id!==id)}));},
 async toggleFavorite(id){const g=get().garments.find(x=>x.id===id);if(g)await get().updateGarment(id,{favorite:!g.favorite});},
 async cycleStatus(id){const g=get().garments.find(x=>x.id===id);if(!g)return;const n=STATUS_ORDER[(STATUS_ORDER.indexOf(g.status)+1)%STATUS_ORDER.length];await get().updateGarment(id,{status:n,noQuieroDate:n==='no_quiero'?todayStr():undefined});},
 async addOutfit(o){await saveOutfit(o);set(s=>({outfits:[...s.outfits.filter(x=>x.id!==o.id),o]}));},
 async updateOutfit(id,p){const o=get().outfits.find(x=>x.id===id);if(!o)return;const u={...o,...p,updatedAt:Date.now()};await saveOutfit(u);set(s=>({outfits:s.outfits.map(x=>x.id===id?u:x)}));},
 async deleteOutfit(id){await deleteOutfitStorage(id);set(s=>({outfits:s.outfits.filter(x=>x.id!==id)}));},
 async applyOutfit(ids){const d=todayStr();const l={...get().log,[d]:Array.from(new Set([...(get().log[d]??[]),...ids]))};await saveLog(l);set({log:l});},
 async updateSettings(p){const settings={...get().settings,...p};await storage.set('use-ai',settings.useAi?'true':'false');if(settings.aiApiKey)await storage.set('ai-api-key',settings.aiApiKey);else await storage.delete('ai-api-key');set({settings});}
}));
