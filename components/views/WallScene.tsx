'use client';

interface WallSceneProps {
  onCloset: () => void;
  onHistory: () => void;
  onToday: () => void;
}

export function WallScene({ onCloset, onHistory, onToday }: WallSceneProps) {
  const now = new Date();
  const day = now.toLocaleDateString('es-ES', { day: '2-digit' });
  const month = now.toLocaleDateString('es-ES', { month: 'long' });

  return (
    <section className="wall-scene" aria-label="Inicio">
      <div className="wall-calendar" role="button" tabIndex={0} onClick={onHistory} onKeyDown={(e) => e.key === 'Enter' && onHistory()}>
        <span className="calendar-string" />
        <div className="calendar-body"><small>{month}</small><strong>{day}</strong><span>PERCHA</span></div>
      </div>
      <button className="today-card" onClick={onToday}>
        <strong>?</strong><span>¿Qué me pongo hoy?</span>
      </button>
      <button className="wall-hint" onClick={onCloset}>Desliza o toca para ir al armario →</button>
    </section>
  );
}
