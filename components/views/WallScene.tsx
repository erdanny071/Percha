'use client';

import { useState } from 'react';
import { Occasion } from '@/types/garment';
import { usePerchaStore } from '@/store/usePerchaStore';
import styles from './WallScene.module.css';

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
    <section className={styles.homeScreen} aria-label="Inicio">
      <header className={styles.homeBrandHeader}>
        <div className={styles.homeBrand}>
          <span className={styles.homeBrandMark} aria-hidden="true">⊗</span>
          <span>Percha</span>
        </div>
        <span className={styles.aiBadge}>✣ AI ASSIST</span>
      </header>

      <div className={styles.homeContent}>
        <button className={styles.homeHero} onClick={onCloset} aria-label="Abrir mi armario">
          <img src={heroImage} alt="Armario de Percha" />
          <span className={styles.heroAiLabel}>✣ AI Wardrobe Curator</span>
        </button>

        <div className={styles.homeCopy}>
          <h1>Tu armario<br />inteligente</h1>
          <p>Organiza tus prendas, redescubre tu estilo y genera los outfits perfectos para cada ocasión con nuestro asistente de moda virtual.</p>
        </div>

        <div className={styles.homeActions}>
          <button className={styles.homePrimary} onClick={onCloset}>Abrir mi armario <span>→</span></button>
          <button className={styles.homeSecondary} onClick={() => setShowOccasions(true)}>✣ <span>¿Qué me pongo hoy?</span></button>
        </div>

        <div className={styles.homeStats}>
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
