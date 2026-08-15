'use client';

import { Category } from '@/types/garment';

interface ClosetStageProps {
  onCategory: (category: Category | 'top-dress' | 'accessory-cap') => void;
  onLaundry: () => void;
  onTrash: () => void;
}

export function ClosetStage({ onCategory, onLaundry, onTrash }: ClosetStageProps) {
  return (
    <section className="closet-stage" aria-label="Armario">
      <div className="closet-frame">
        <button className="closet-door left" aria-label="Abrir armario" />
        <button className="closet-door right" aria-label="Abrir armario" />
        <div className="closet-interior">
          <button onClick={() => onCategory('outerwear')}>Abrigos</button>
          <button onClick={() => onCategory('top-dress')}>Arriba / vestidos</button>
          <button onClick={() => onCategory('bottom')}>Abajo</button>
          <button onClick={() => onCategory('accessory-cap')}>Accesorios / gorras</button>
          <button onClick={() => onCategory('shoes')}>Calzado</button>
        </div>
      </div>
      <div className="closet-side-actions">
        <button onClick={onLaundry}>🧺 Lavadora</button>
        <button onClick={onTrash}>🗑️ Papelera</button>
      </div>
    </section>
  );
}
