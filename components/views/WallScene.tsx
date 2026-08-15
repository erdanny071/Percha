'use client';

import { useState } from 'react';
import { Occasion } from '@/types/garment';
import { usePerchaStore } from '@/store/usePerchaStore';

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

// Temporary Figma asset URL. Keep this isolated so it can be replaced by a local public asset later.
const heroImage = 'https://www.figma.com/api/mcp/asset/87b05625-9ebe-4827-b74a-26519d59e40b.png';

export function WallScene({ onCloset, onHistory, onToday }: WallSceneProps) {
  const [showOccasions, setShowOccasions] = useState(false);
  const garments = usePerchaStore((state) => state.garments);
  const outfits = usePerchaStore((state) => state.outfits);
  const readyCount = garments.filter((garment) => garment.status === 'disponible').length;

  const chooseOccasion = (occasion: Occasion) => {
    sessionStorage.setItem('percha-selected-occasion', occasion);
    setShowOccasions(false);
    onToday(occasion);
  };

  return (
    <section className="home-screen" aria-label="Inicio">
      <header className="home-brand-header">
        <div className="home-brand">
          <span className="home-brand-mark" aria-hidden="true">⊗</span>
          <span>Percha</span>
        </div>
        <span className="ai-badge">✣ AI ASSIST</span>
      </header>

      <div className="home-content">
        <button className="home-hero" onClick={onCloset} aria-label="Abrir mi armario">
          <img src={heroImage} alt="Armario de Percha" />
          <span className="hero-ai-label">✣ AI Wardrobe Curator</span>
        </button>

        <div className="home-copy">
          <h1>Tu armario<br />inteligente</h1>
          <p>Organiza tus prendas, redescubre tu estilo y genera los outfits perfectos para cada ocasión con nuestro asistente de moda virtual.</p>
        </div>

        <div className="home-actions">
          <button className="home-primary" onClick={onCloset}>Abrir mi armario <span>→</span></button>
          <button className="home-secondary" onClick={() => setShowOccasions(true)}>✣ <span>¿Qué me pongo hoy?</span></button>
        </div>

        <div className="home-stats">
          <span><strong>{readyCount}</strong> Prendas listas</span>
          <i />
          <span><strong>{outfits.length}</strong> Outfits creados</span>
        </div>
      </div>

      {showOccasions && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Elige la ocasión" onClick={() => setShowOccasions(false)}>
          <section className="occasion-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-heading">
              <div><p className="eyebrow">Personaliza tu sugerencia</p><h2>¿Para qué ocasión?</h2></div>
              <button className="icon-button" onClick={() => setShowOccasions(false)} aria-label="Cerrar">×</button>
            </div>
            <div className="occasion-grid">
              {occasions.map((item) => (
                <button key={item.id} className="occasion-option" onClick={() => chooseOccasion(item.id)}>
                  <strong>{item.label}</strong><small>{item.hint}</small>
                </button>
              ))}
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
