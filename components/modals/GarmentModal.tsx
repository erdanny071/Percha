'use client';

import { useEffect, useRef, useState } from 'react';
import { Category, Occasion } from '@/types/garment';
import { fileToCompressedDataUrl } from '@/lib/garments/image';

const categories: Array<[Category, string]> = [['top','Parte de arriba'],['bottom','Parte de abajo'],['dress','Vestido / mono'],['outerwear','Abrigo / chaqueta'],['shoes','Calzado'],['accessory','Accesorio'],['cap','Gorra']];
const occasions: Array<[Occasion, string]> = [['informal','Informal'],['salir','Salir'],['noche','Noche'],['trabajo','Trabajo'],['deporte','Deporte'],['evento','Evento'],['elegante','Elegante']];

interface Props { open: boolean; initial?: { id:string; name:string; category:Category; occasion:Occasion; favorite:boolean; image?:string }; onClose:()=>void; onSave:(data:{id?:string;name:string;category:Category;occasion:Occasion;favorite:boolean;image?:string;_pendingDataUrl?:string})=>Promise<void>; }

export function GarmentModal({open,initial,onClose,onSave}:Props){
 const cameraRef=useRef<HTMLInputElement>(null);
 const galleryRef=useRef<HTMLInputElement>(null);
 const [name,setName]=useState(''); const [category,setCategory]=useState<Category>('top'); const [occasion,setOccasion]=useState<Occasion>('informal'); const [favorite,setFavorite]=useState(false); const [image,setImage]=useState<string>(); const [pending,setPending]=useState<string>(); const [saving,setSaving]=useState(false); const [processing,setProcessing]=useState(false);
 useEffect(()=>{if(open){setName(initial?.name??'');setCategory(initial?.category??'top');setOccasion(initial?.occasion??'informal');setFavorite(initial?.favorite??false);setImage(initial?.image);setPending(undefined);setProcessing(false)}},[open,initial]);
 if(!open)return null;
 const handleFile=async(file?:File)=>{if(!file)return;setProcessing(true);try{const data=await fileToCompressedDataUrl(file);setPending(data);setImage(data)}finally{setProcessing(false)}};
 const submit=async()=>{if(!name.trim()||(!initial&&!pending&&!image))return;setSaving(true);try{await onSave({id:initial?.id,name:name.trim(),category,occasion,favorite,image,_pendingDataUrl:pending});onClose()}finally{setSaving(false)}};
 return <div className="modal-backdrop" role="dialog" aria-modal="true"><form className="garment-modal garment-modal-premium" onSubmit={e=>{e.preventDefault();void submit()}}>
  <div className="modal-head"><div><p className="eyebrow">{initial?'Tu armario':'Nueva incorporación'}</p><h2>{initial?'Editar prenda':'Añadir prenda'}</h2></div><button type="button" onClick={onClose} aria-label="Cerrar">×</button></div>
  <div className="photo-area">
   <label className="photo-picker">{image?<img src={image} alt="Vista previa de la prenda"/>:<div className="photo-placeholder"><span>＋</span><strong>Añade una foto</strong><small>Mejor con fondo limpio y buena luz</small></div>}<input ref={galleryRef} type="file" accept="image/*" onChange={e=>void handleFile(e.target.files?.[0])}/></label>
   <div className="photo-actions"><button type="button" className="secondary-action" onClick={()=>cameraRef.current?.click()}>Cámara</button><button type="button" className="secondary-action" onClick={()=>galleryRef.current?.click()}>Galería</button></div>
   <input ref={cameraRef} className="hidden-file" type="file" accept="image/*" capture="environment" onChange={e=>void handleFile(e.target.files?.[0])}/>
   {processing?<p className="processing-note">Procesando imagen…</p>:image?<p className="processing-note">✓ Foto lista · imagen optimizada</p>:null}
  </div>
  <div className="form-grid">
   <label>Nombre<input value={name} onChange={e=>setName(e.target.value)} placeholder="Ej. Blazer negro" required/></label>
   <label>Categoría<select value={category} onChange={e=>setCategory(e.target.value as Category)}>{categories.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
   <label>Ocasión<select value={occasion} onChange={e=>setOccasion(e.target.value as Occasion)}>{occasions.map(([v,l])=><option key={v} value={v}>{l}</option>)}</select></label>
  </div>
  <label className="favorite-check premium-favorite"><input type="checkbox" checked={favorite} onChange={e=>setFavorite(e.target.checked)}/> <span>Marcar como favorita</span></label>
  <div className="smart-note"><strong>PERCHA</strong><span>La información de la prenda queda guardada localmente y estará disponible para tus futuros conjuntos.</span></div>
  <button className="primary-action save-garment" disabled={saving||processing||!name.trim()||(!initial&&!image)}>{saving?'Guardando…':initial?'Guardar cambios':'Añadir al armario'}</button>
 </form></div>;
}
