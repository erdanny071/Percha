'use client';

import { useEffect, useState } from 'react';
import { Category, Occasion } from '@/types/garment';
import { fileToCompressedDataUrl } from '@/lib/garments/image';

const categories: Array<[Category, string]> = [['top','Parte de arriba'],['bottom','Parte de abajo'],['dress','Vestido / mono'],['outerwear','Abrigo / chaqueta'],['shoes','Calzado'],['accessory','Accesorio'],['cap','Gorra']];
const occasions: Array<[Occasion, string]> = [['informal','Informal'],['salir','Salir'],['noche','Noche'],['trabajo','Trabajo'],['deporte','Deporte'],['evento','Evento'],['elegante','Elegante']];

interface Props { open: boolean; initial?: { id:string; name:string; category:Category; occasion:Occasion; favorite:boolean; image?:string }; onClose:()=>void; onSave:(data:{id?:string;name:string;category:Category;occasion:Occasion;favorite:boolean;image?:string;_pendingDataUrl?:string})=>Promise<void>; }

export function GarmentModal({open,initial,onClose,onSave}:Props){
 const [name,setName]=useState(''); const [category,setCategory]=useState<Category>('top'); const [occasion,setOccasion]=useState<Occasion>('informal'); const [favorite,setFavorite]=useState(false); const [image,setImage]=useState<string>(); const [pending,setPending]=useState<string>(); const [saving,setSaving]=useState(false);
 useEffect(()=>{if(open){setName(initial?.name??'');setCategory(initial?.category??'top');setOccasion(initial?.occasion??'informal');setFavorite(initial?.favorite??false);setImage(initial?.image);setPending(undefined)}},[open,initial]);
 if(!open)return null;
 const handleFile=async(file?:File)=>{if(!file)return;const data=await fileToCompressedDataUrl(file);setPending(data);setImage(data)};
 const submit=async()=>{if(!name.trim()||(!initial&&!pending&&!image))return;setSaving(true);try{await onSave({id:initial?.id,name:name.trim(),category,occasion,favorite,image,_pendingDataUrl:pending});onClose()}finally{setSaving(false)}};
 return <div className="modal-backdrop" role="dialog" aria-modal="true"><form className="garment-modal" onSubmit={e=>{e.preventDefault();void submit()}}><div className="modal-head"><h2>{initial?'Editar prenda':'Nueva prenda'}</h2><button type="button" onClick={onClose}>×</button></div><label className="photo-picker">{image?<img src={image} alt="Vista previa"/>:<span>📷 Añadir foto</span>}<input type="file" accept="image/*" capture="environment" onChange={e=>void handleFile(e.target.files?.[0])}/></label><label>Nombre<input value={name} onChange={e=>setName(e.target.value)} placeholder="Ej. Camiseta blanca" required/></label><label>Categoría<select value={category} onChange={e=>setCategory(e.target.value as Category)}>{categories.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label><label>Ocasión<select value={occasion} onChange={e=>setOccasion(e.target.value as Occasion)}>{occasions.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label><label className="favorite-check"><input type="checkbox" checked={favorite} onChange={e=>setFavorite(e.target.checked)}/> Favorita</label><button className="primary-action" disabled={saving}>{saving?'Guardando…':'Guardar prenda'}</button></form></div>;
}
