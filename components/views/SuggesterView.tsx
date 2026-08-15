'use client';

import { useMemo } from 'react';
import { usePerchaStore } from '@/store/usePerchaStore';
import { generateAllOutfits, generateStyleReasoning } from '@/lib/outfits/engine';
import { Occasion } from '@/types/garment';

interface Props { occasion?: Occasion; onBack:()=>void; }

export function SuggesterView({ occasion='informal', onBack }: Props) {
  const { garments, log, addOutfit, applyOutfit } = usePerchaStore();
  const combos = useMemo(() => generateAllOutfits(garments, occasion, log), [garments, occasion, log]);
  const saveAndWear = async (combo: typeof combos[number]) => {
    const ids = [combo.top, combo.bottom, combo.shoes, combo.accessory, combo.cap].filter(Boolean) as string[];
    await addOutfit({ id: crypto.randomUUID(), name: `Outfit ${new Date().toLocaleDateString('es-ES')}`, garmentIds: ids, createdAt: Date.now(), updatedAt: Date.now() });
    await applyOutfit(ids);
  };
  return <section className="percha-panel">
    <header className="app-header"><button className="back-button" onClick={onBack}>←</button><div><h1>¿Qué me pongo?</h1><p>{occasion}</p></div></header>
    {!combos.length ? <div className="empty-state"><strong>No hay suficientes prendas.</strong><span>Necesitas al menos una parte de arriba, una de abajo y calzado disponibles.</span></div> : <div className="outfit-grid">{combos.map((combo,i)=>{const ids=[combo.top,combo.bottom,combo.shoes,combo.accessory,combo.cap].filter(Boolean) as string[]; const items=ids.map(id=>garments.find(g=>g.id===id)).filter(Boolean); return <article className="outfit-card" key={`${combo.top}-${combo.bottom}-${combo.shoes}-${combo.accessory}-${combo.cap}`}><div className="outfit-items">{items.map(g=><div key={g!.id}><strong>{g!.name}</strong><small>{g!.category}</small></div>)}</div><p>{generateStyleReasoning(combo,garments,occasion)}</p><strong>Match {Math.round(Math.max(0,Math.min(100,combo.score*5)))}%</strong><button className="primary-action" onClick={()=>void saveAndWear(combo)}>{i===0?'Me lo pongo hoy':'Guardar y ponérmelo'}</button></article>})}</div>}
  </section>;
}
