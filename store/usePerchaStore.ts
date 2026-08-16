'use client';
import { create } from 'zustand';
import type { Garment, Status } from '@/types/garment';
import type { Outfit } from '@/types/index';

type LogMap = Record<string, string[]>;
interface PerchaState { garments: Garment[]; outfits: Outfit[]; log: LogMap; initialized: boolean; init: () => Promise<void>; addGarment:(g:Garment)=>Promise<void>; updateGarment:(id:string,p:Partial<Garment>)=>Promise<void>; deleteGarment:(id:string)=>Promise<void>; toggleFavorite:(id:string)=>Promise<void>; cycleStatus:(id:string)=>Promise<void>; addOutfit:(o:Outfit)=>Promise<void>; updateOutfit:(id:string,p:Partial<Outfit>)=>Promise<void>; deleteOutfit:(id:string)=>Promise<void>; applyOutfit:(ids:string[])=>Promise<void>; }
const GK='percha-garments-v1',OK='percha-outfits-v1',LK='percha-log-v1';
const read=<T,>(k:string,d:T):T=>{if(typeof window==='undefined')return d;try{const r=localStorage.getItem(k);return r?JSON.parse(r) as T:d}catch{return d}};
const write=(k:string,v:unknown)=>{if(typeof window!=='undefined')localStorage.setItem(k,JSON.stringify(v))};
const statuses:Status[]=['disponible','lavando','no_quiero'];
export const usePerchaStore=create<PerchaState>((set,get)=>({
 garments:[],outfits:[],log:{},initialized:false,
 async init(){if(get().initialized)return;set({garments:read<Garment[]>(GK,[]),outfits:read<Outfit[]>(OK,[]),log:read<LogMap>(LK,{}),initialized:true})},
 async addGarment(g){const garments=[...get().garments.filter(x=>x.id!==g.id),g];write(GK,garments);set({garments})},
 async updateGarment(id,p){const garments=get().garments.map(g=>g.id===id?{...g,...p}:g);write(GK,garments);set({garments})},
 async deleteGarment(id){const garments=get().garments.filter(g=>g.id!==id);const outfits=get().outfits.map(o=>({...o,garmentIds:o.garmentIds.filter(x=>x!==id)}));write(GK,garments);write(OK,outfits);set({garments,outfits})},
 async toggleFavorite(id){const g=get().garments.find(x=>x.id===id);if(g)await get().updateGarment(id,{favorite:!g.favorite})},
 async cycleStatus(id){const g=get().garments.find(x=>x.id===id);if(!g)return;const n=statuses[(statuses.indexOf(g.status)+1)%statuses.length];await get().updateGarment(id,{status:n,noQuieroDate:n==='no_quiero'?new Date().toISOString().slice(0,10):undefined})},
 async addOutfit(o){const outfits=[...get().outfits.filter(x=>x.id!==o.id),o];write(OK,outfits);set({outfits})},
 async updateOutfit(id,p){const outfits=get().outfits.map(o=>o.id===id?{...o,...p}:o);write(OK,outfits);set({outfits})},
 async deleteOutfit(id){const outfits=get().outfits.filter(o=>o.id!==id);write(OK,outfits);set({outfits})},
 async applyOutfit(ids){const d=new Date().toISOString().slice(0,10);const log={...get().log,[d]:Array.from(new Set([...(get().log[d]??[]),...ids]))};write(LK,log);set({log})}
}));
