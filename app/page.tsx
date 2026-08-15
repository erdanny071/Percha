'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePerchaStore } from '@/store/usePerchaStore';
import { Category, Occasion, Status } from '@/types/garment';
import { WallScene } from '@/components/views/WallScene';
import { ClosetStage } from '@/components/views/ClosetStage';
import { GarmentModal } from '@/components/modals/GarmentModal';
import { HistorialView } from '@/components/views/HistorialView';
import { SuggesterView } from '@/components/views/SuggesterView';

const categoryLabels: Record<Category,string> = {
  top:'Parte de arriba', bottom:'Parte de abajo', dress:'Vestidos',
  outerwear:'Abrigos', shoes:'Calzado', accessory:'Accesorios', cap:'Gorras'
};
const statusLabels: Record<Status,string> = { disponible:'Disponible', lavando:'Lavando', no_quiero:'No usar' };
type CategoryFilter = Category|'top-dress'|'accessory-cap'|null;
type Screen = 'wall'|'closet'|'categories'|'list'|'history'|'today'|'outfits';

const categories: Array<{id: CategoryFilter; label:string; icon:string; description:string}> = [
  {id:'top-dress',label:'Arriba',icon:'◒',description:'Camisetas, camisas y vestidos'},
  {id:'bottom',label:'Abajo',icon:'◓',description:'Vaqueros, cargos y shorts'},
  {id:'outerwear',label:'Abrigos',icon:'◇',description:'Chaquetas y prendas exteriores'},
  {id:'shoes',label:'Calzado',icon:'⌁',description:'Zapatillas, botas y más'},
  {id:'accessory-cap',label:'Accesorios',icon:'✦',description:'Complementos y gorras'},
  {id:null,label:'Todo el armario',icon:'＋',description:'Ver todas tus prendas'},
];

export default function Home(){
 const {garments,outfits,initialized,init,toggleFavorite,cycleStatus,addGarment,updateGarment,deleteGarment,deleteOutfit,applyOutfit}=usePerchaStore();
 const [screen,setScreen]=useState<Screen>('wall');
 const [categoryFilter,setCategoryFilter]=useState<CategoryFilter>(null);
 const [statusFilter,setStatusFilter]=useState<'todas'|'favoritos'|Status>('todas');
 const [modal,setModal]=useState<'create'|'edit'|null>(null);
 const [editingId,setEditingId]=useState<string>();
 const [occasion,setOccasion]=useState<Occasion>('informal');
 useEffect(()=>{void init()},[init]);
 const filtered=useMemo(()=>garments.filter(g=>{
   const categoryOk=!categoryFilter||(categoryFilter==='top-dress'?g.category==='top'||g.category==='dress':categoryFilter==='accessory-cap'?g.category==='accessory'||g.category==='cap':g.category===categoryFilter);
   const statusOk=statusFilter==='todas'||(statusFilter==='favoritos'?g.favorite:g.status===statusFilter);
   return categoryOk&&statusOk;
 }),[garments,categoryFilter,statusFilter]);
 const editing=editingId?garments.find(g=>g.id===editingId):undefined;
 const goCategories=()=>setScreen('categories');
 const openCategory=(c:CategoryFilter)=>{setCategoryFilter(c);setStatusFilter('todas');setScreen('list')};
 if(!initialized)return <main className="percha-shell"><p className="muted">Preparando tu armario…</p></main>;
 if(screen==='history')return <main className="percha-shell"><HistorialView onBack={()=>setScreen('wall')}/></main>;
 if(screen==='today')return <main className="percha-shell"><SuggesterView occasion={occasion} onBack={()=>setScreen('wall')}/></main>;
 if(screen==='outfits')return <main className="percha-shell page-space"><section className="percha-panel"><header className="app-header"><button className="back-button" onClick={()=>setScreen('wall')}>←</button><div><p className="eyebrow">Tu colección</p><h1>Mis conjuntos</h1><p>{outfits.length} guardados</p></div></header>{outfits.length?<div className="outfit-grid">{outfits.map(o=><article className="outfit-card" key={o.id}><h2>{o.name}</h2><div className="outfit-items">{o.garmentIds.map(id=>{const g=garments.find(x=>x.id===id);return g?<div key={id}>{g.image&&<img src={g.image} alt=""/>}<strong>{g.name}</strong><small>{categoryLabels[g.category]}</small></div>:null})}</div><div className="card-actions"><button onClick={()=>void applyOutfit(o.garmentIds)}>Me lo pongo hoy</button><button onClick={()=>{if(confirm(`¿Eliminar ${o.name}?`))void deleteOutfit(o.id)}}>Eliminar</button></div></article>)}</div>:<div className="empty-state"><strong>Aún no tienes conjuntos.</strong><span>Genera uno desde “¿Qué me pongo hoy?”.</span></div>}</section></main>;
 if(screen==='categories')return <main className="percha-shell page-space"><header className="app-header"><button className="back-button" onClick={()=>setScreen('closet')}>←</button><div><p className="eyebrow">Tu armario</p><h1>Categorías</h1><p>{garments.length} prendas en total</p></div><button className="primary-action small" onClick={()=>{setEditingId(undefined);setModal('create')}}>+ Añadir</button></header><section className="category-grid">{categories.map(c=><button key={c.label} className="category-tile" onClick={()=>openCategory(c.id)}><span className="category-icon">{c.icon}</span><span className="category-copy"><strong>{c.label}</strong><small>{c.description}</small></span><span className="category-arrow">›</span></button>)}</section><div className="category-note">Selecciona una categoría para explorar tus prendas.</div><GarmentModal open={modal!==null} initial={editing} onClose={()=>{setModal(null);setEditingId(undefined)}} onSave={async data=>{if(data.id)await updateGarment(data.id,data);else await addGarment({id:crypto.randomUUID(),name:data.name,category:data.category,occasion:data.occasion,status:'disponible',favorite:data.favorite,addedAt:Date.now(),image:data.image,_pendingDataUrl:data._pendingDataUrl})}}/></main>;
 if(screen==='list')return <main className="percha-shell page-space"><header className="app-header"><button className="back-button" onClick={goCategories}>←</button><div><p className="eyebrow">Colección</p><h1>Armario</h1><p>{filtered.length} prendas</p></div><button className="primary-action small" onClick={()=>{setEditingId(undefined);setModal('create')}}>+ Añadir</button></header><nav className="filter-row">{(['todas','favoritos','disponible','lavando','no_quiero'] as const).map(v=><button key={v} className={statusFilter===v?'filter active':'filter'} onClick={()=>setStatusFilter(v)}>{v==='todas'?'Todas':v==='favoritos'?'Favoritos':statusLabels[v]}</button>)}</nav><section className="garment-grid">{filtered.length?filtered.map(g=><article className="garment-card" key={g.id}><div className="garment-image">{g.image?<img src={g.image} alt={g.name} loading="lazy"/>:<span>sin foto</span>}<button className="icon-button" onClick={()=>void toggleFavorite(g.id)}>{g.favorite?'♥':'♡'}</button></div><div className="garment-info"><strong>{g.name}</strong><small>{categoryLabels[g.category]}</small><button className="status-button" onClick={()=>void cycleStatus(g.id)}>{statusLabels[g.status]}</button><div className="card-actions"><button onClick={()=>{setEditingId(g.id);setModal('edit')}}>Editar</button><button onClick={()=>{if(confirm(`¿Eliminar ${g.name}?`))void deleteGarment(g.id)}}>Eliminar</button></div></div></article>):<div className="empty-state"><strong>No hay prendas aquí.</strong><span>Prueba otro filtro o añade una.</span></div>}</section><footer className="data-footer">{outfits.length} conjuntos guardados · datos locales conectados <button onClick={()=>setScreen('outfits')}>Ver conjuntos</button></footer><GarmentModal open={modal!==null} initial={editing} onClose={()=>{setModal(null);setEditingId(undefined)}} onSave={async data=>{if(data.id)await updateGarment(data.id,data);else await addGarment({id:crypto.randomUUID(),name:data.name,category:data.category,occasion:data.occasion,status:'disponible',favorite:data.favorite,addedAt:Date.now(),image:data.image,_pendingDataUrl:data._pendingDataUrl})}}/></main>;
 return <main className="percha-shell"><div className="view-switcher bottom-nav"><button className={screen==='wall'?'active':''} onClick={()=>setScreen('wall')}><span>⌂</span>Inicio</button><button className={screen==='closet'?'active':''} onClick={()=>setScreen('closet')}><span>♧</span>Armario</button><button onClick={()=>setScreen('outfits')}><span>◇</span>Conjuntos</button></div>{screen==='wall'?<WallScene onCloset={()=>setScreen('closet')} onHistory={()=>setScreen('history')} onToday={()=>{setOccasion('informal');setScreen('today')}}/>:<ClosetStage onCategory={c=>openCategory(c)} onLaundry={()=>{setCategoryFilter(null);setStatusFilter('lavando');setScreen('list')}} onTrash={()=>{setCategoryFilter(null);setStatusFilter('no_quiero');setScreen('list')}}/>}</main>;
}
