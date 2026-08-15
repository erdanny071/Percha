'use client';

import { useState } from 'react';
import { Occasion } from '@/types/garment';

interface WallSceneProps {
  onCloset: () => void;
  onHistory: () => void;
  onToday: (occasion: Occasion) => void;
}

const occasions: Array<{ id: Occasion; label: string; hint: string }> = [
  { id: 'informal', label: 'Informal', hint: 'Cómodo para el día a día' },
  { id: 'salir', label: 'Salir', hint: 'Plan con amigos o paseo' },
  { id: 'noche', label: 'Noche', hint: 'Para salir por la noche' },
  { id: 'trabajo', label: 'Trabajo', hint: 'Arreglado y funcional' },
  { id: 'deporte', label: 'Deporte', hint: 'Activo y cómodo' },
  { id: 'evento', label: 'Evento', hint: 'Una ocasión especial' },
  { id: 'elegante', label: 'Elegante', hint: 'Más formal y cuidado' },
];

export function WallScene({ onCloset, onHistory, onToday }: WallSceneProps) {
  const now = new Date();
  const day = now.toLocaleDateString('es-ES', { day: '2-digit' });
  const month = now.toLocaleDateString('es-ES', { month: 'long' });
  const [showOccasions, setShowOccasions] = useState(false);

  return (
    <section className="wall-scene" aria-label="Inicio">
      <div className="wall-calendar" role="button" tabIndex={0} onClick={onHistory} onKeyDown={(e) => e.key === 'Enter' && onHistory()}>
        <span className="calendar-string" />
        <div className="calendar-body"><small>{month}</small><strong>{day}</strong><span>PERCHA</span></div>
      </div>
      <button className="today-card" onClick={() => setShowOccasions(true)}>
        <strong>?</strong><span>¿Qué me pongo hoy?</span>
      </button>
      <button className="wall-hint" onClick={onCloset}>Desliza o toca para ir al armario →</button>

      {showOccasions && <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Elige la ocasión" onClick={() => setShowOccasions(false)}>
        <section className="occasion-panel" onClick={(e) => e.stopPropagation()}>
          <div className="modal-heading"><div><p className="eyebrow">Personaliza tu sugerencia</p><h2>¿Para qué ocasión?</h2></div><button className="icon-button" onClick={() => setShowOccasions(false)} aria-label="Cerrar">×</button></div>
          <div className="occasion-grid">{occasions.map((item) => <button key={item.id} className="occasion-option" onClick={() => { setShowOccasions(false); onToday(item.id); }}><strong>{item.label}</strong><small>{item.hint}</small></button>)}</div>
        </section>
      </div>}
    </section>
  );
}
