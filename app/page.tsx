'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePerchaStore } from '@/store/usePerchaStore';
import { Category, Status } from '@/types/garment';

const categoryLabels: Record<Category, string> = {
  top: 'Parte de arriba', bottom: 'Parte de abajo', dress: 'Vestido / mono',
  outerwear: 'Abrigo / chaqueta', shoes: 'Calzado', accessory: 'Accesorio', cap: 'Gorras',
};

const statusLabels: Record<Status, string> = {
  disponible: 'Disponible', lavando: 'Lavando', no_quiero: 'No me la quiero poner',
};

export default function Home() {
  const { garments, outfits, initialized, init, toggleFavorite, cycleStatus } = usePerchaStore();
  const [filter, setFilter] = useState<'todas' | 'favoritos' | Status>('todas');

  useEffect(() => { void init(); }, [init]);

  const filtered = useMemo(() => {
    if (filter === 'todas') return garments;
    if (filter === 'favoritos') return garments.filter((g) => g.favorite);
    return garments.filter((g) => g.status === filter);
  }, [garments, filter]);

  if (!initialized) {
    return <main className="percha-shell"><p className="muted">Cargando tu armario…</p></main>;
  }

  return (
    <main className="percha-shell">
      <header className="app-header">
        <div>
          <h1>Percha</h1>
          <p>tu armario, sin repetir</p>
        </div>
        <span className="counter">{garments.length} prendas</span>
      </header>

      <nav className="filter-row" aria-label="Filtros">
        {(['todas', 'favoritos', 'disponible', 'lavando', 'no_quiero'] as const).map((value) => (
          <button key={value} className={filter === value ? 'filter active' : 'filter'} onClick={() => setFilter(value)}>
            {value === 'todas' ? 'Todas' : value === 'favoritos' ? 'Favoritos' : statusLabels[value]}
          </button>
        ))}
      </nav>

      {filtered.length === 0 ? (
        <section className="empty-state"><strong>No hay prendas aquí.</strong><span>Tu armario aparecerá aquí cuando tenga datos.</span></section>
      ) : (
        <section className="garment-grid">
          {filtered.map((garment) => (
            <article className="garment-card" key={garment.id}>
              <div className="garment-image">
                {garment.image ? <img src={garment.image} alt={garment.name} /> : <span>sin foto</span>}
                <button className="icon-button" onClick={() => void toggleFavorite(garment.id)} aria-label="Favorito">{garment.favorite ? '♥' : '♡'}</button>
              </div>
              <div className="garment-info">
                <strong>{garment.name}</strong>
                <small>{categoryLabels[garment.category]}</small>
                <button className="status-button" onClick={() => void cycleStatus(garment.id)}>{statusLabels[garment.status]}</button>
              </div>
            </article>
          ))}
        </section>
      )}

      <footer className="data-footer">{outfits.length} conjuntos guardados · datos locales conectados</footer>
    </main>
  );
}
