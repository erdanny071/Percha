'use client';

import { useState } from 'react';
import { Category } from '@/types/garment';

interface ClosetStageProps {
  onCategory: (category: Category | 'top-dress' | 'accessory-cap') => void;
  onLaundry: () => void;
  onTrash: () => void;
}

export function ClosetStage({ onCategory, onLaundry, onTrash }: ClosetStageProps) {
  const [doorsOpen, setDoorsOpen] = useState(false);

  return (
    <section className="closet-stage" aria-label="Armario">
      <div className={`closet-frame ${doorsOpen ? 'is-open' : ''}`}>
        <div className="closet-interior">
          <button className="closet-zone outerwear" onClick={() => onCategory('outerwear')}>Abrigos</button>
          <button className="closet-zone top-dress" onClick={() => onCategory('top-dress')}>Arriba / vestidos</button>
          <button className="closet-zone bottom" onClick={() => onCategory('bottom')}>Abajo</button>
          <button className="closet-zone accessory-cap" onClick={() => onCategory('accessory-cap')}>Accesorios / gorras</button>
          <button className="closet-zone shoes" onClick={() => onCategory('shoes')}>Calzado</button>
        </div>
        {!doorsOpen && (
          <>
            <button className="closet-door left" aria-label="Abrir armario" onClick={() => setDoorsOpen(true)} />
            <button className="closet-door right" aria-label="Abrir armario" onClick={() => setDoorsOpen(true)} />
          </>
        )}
      </div>
      <div className="closet-side-actions">
        <button onClick={onLaundry}>🧺 Lavadora</button>
        <button onClick={onTrash}>🗑️ Papelera</button>
      </div>
    </section>
  );
}
