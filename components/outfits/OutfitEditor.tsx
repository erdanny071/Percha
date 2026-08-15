'use client';

import { useMemo, useState } from 'react';
import { Garment } from '@/types/garment';
import { OutfitCombo } from '@/types/outfit';

interface Props {
  combo: OutfitCombo;
  garments: Garment[];
  onBack: () => void;
  onWear: (ids: string[]) => Promise<void>;
}

export function OutfitEditor({ combo, garments, onBack, onWear }: Props) {
  const [current, setCurrent] = useState(combo);
  const [saving, setSaving] = useState(false);
  const slots = useMemo(() => [
    ['top', 'Parte de arriba'], ['bottom', 'Parte de abajo'], ['shoes', 'Calzado'],
    ['accessory', 'Accesorio'], ['cap', 'Gorra'],
  ] as const, []);
  const available = (slot: string) => garments.filter(g => g.status === 'disponible' && (
    slot === 'top' ? g.category === 'top' || g.category === 'dress' :
    slot === 'bottom' ? g.category === 'bottom' :
    slot === 'shoes' ? g.category === 'shoes' :
    slot === 'accessory' ? g.category === 'accessory' : g.category === 'cap'
  ));
  const wear = async () => {
    const ids = [current.top, current.bottom, current.shoes, current.accessory, current.cap].filter(Boolean) as string[];
    setSaving(true); try { await onWear(ids); } finally { setSaving(false); }
  };
  return <section className="percha-panel outfit-editor">
    <header className="app-header"><button className="back-button" onClick={onBack}>←</button><div><h1>Ajusta tu outfit</h1><p>Cambia cualquier prenda antes de ponértelo</p></div></header>
    <div className="outfit-slots">{slots.map(([key,label]) => { const id=current[key]; const garment=id?garments.find(g=>g.id===id):undefined; const options=available(key); return <article className="outfit-slot" key={key}><div className="slot-head"><strong>{label}</strong>{garment&&<span>{garment.name}</span>}</div>{garment?<div className="slot-current">{garment.image&&<img src={garment.image} alt={garment.name}/>}<button onClick={()=>setCurrent(v=>({...v,[key]:undefined}))}>Quitar</button></div>:<span className="muted">Sin seleccionar</span>}<div className="slot-alternatives">{options.filter(g=>g.id!==id).slice(0,6).map(g=><button key={g.id} onClick={()=>setCurrent(v=>({...v,[key]:g.id}))}>{g.image&&<img src={g.image} alt=""/>}<small>{g.name}</small></button>)}</div></article> })}</div>
    <button className="primary-action" disabled={saving} onClick={()=>void wear()}>{saving?'Guardando…':'Me lo pongo hoy'}</button>
  </section>;
}
