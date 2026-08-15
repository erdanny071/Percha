'use client';

import { useMemo, useState } from 'react';
import { usePerchaStore } from '@/store/usePerchaStore';
import { generateAllOutfits, generateStyleReasoning } from '@/lib/outfits/engine';
import { Occasion } from '@/types/garment';
import { OutfitCombo } from '@/types/outfit';
import { OutfitEditor } from '@/components/outfits/OutfitEditor';

interface Props { occasion?: Occasion; onBack:()=>void; }

export function SuggesterView({ occasion='informal', onBack }: Props) {
 const { garments, log, addOutfit, applyOutfit } = usePerchaStore();
 const [selected, setSelected] = useState<OutfitCombo | null>(null);
 const [selectedOccasion] = useState<Occasion>(() => {
   if (typeof window === 'undefined') return occasion;
   const stored = sessionStorage.getItem('percha-selected-occasion') as Occasion | null;
   return stored || occasion;
 });
 const combos = useMemo(() => generateAllOutfits(garments, selectedOccasion, log, true, true), [garments, selectedOccasion, log]);
 const createOutfit = async (ids: string[]) => {
   const now = Date.now();
   await addOutfit({ id: crypto.randomUUID(), name:`Outfit ${new Date().toLocaleDateString('es-ES')}`, garmentIds:ids, createdAt:now, updatedAt:now });
 };
 if (selected) return <OutfitEditor combo={selected} garments={garments} onBack={()=>setSelected(null)} onSave={createOutfit} onWear={async ids=>{await createOutfit(ids);await applyOutfit(ids);sessionStorage.removeItem('percha-selected-occasion');onBack()}}/>;
 return <section className="percha-panel">
  <header className="app-header"><button className="back-button" onClick={onBack}>←</button><div><p className="eyebrow">Sugerencia inteligente</p><h1>¿Qué me pongo?</h1><p>{selectedOccasion}</p></div></header>
  {!combos.length ? <div className="empty-state"><strong>No hay suficientes prendas.</strong><span>Necesitas al menos una parte de arriba, una de abajo y calzado disponibles.</span></div> : <div className="outfit-grid">{combos.slice(0,12).map((combo,i)=>{const ids=[combo.top,combo.bottom,combo.shoes,combo.accessory,combo.cap].filter(Boolean) as string[]; const items=ids.map(id=>garments.find(g=>g.id===id)).filter(Boolean); return <article className="outfit-card" key={`${combo.top}-${combo.bottom}-${combo.shoes}-${combo.accessory}-${combo.cap}`}><div className="outfit-items">{items.map(g=><div key={g!.id}>{g!.image&&<img src={g!.image} alt=""/>}<strong>{g!.name}</strong><small>{g!.category}</small></div>)}</div><p>{generateStyleReasoning(combo,garments,selectedOccasion)}</p><strong>Match {Math.round(Math.max(0,Math.min(100,combo.score*5)))}%</strong><button className="primary-action" onClick={()=>setSelected(combo)}>{i===0?'Elegir y ajustar':'Ajustar este outfit'}</button></article>})}</div>}
 </section>;
}
