'use client';

import { useState } from 'react';

type View = 'wall' | 'closet';

export default function Home() {
  const [view, setView] = useState<View>('wall');
  const [doorsOpen, setDoorsOpen] = useState(false);

  return (
    <main className="percha-app">
      <header className="percha-header">
        <div>
          <h1>Percha</h1>
          <p>tu armario, sin repetir</p>
        </div>
        <button className="icon-button" aria-label="Ajustes" type="button">⚙</button>
      </header>

      <nav className="view-switcher" aria-label="Navegación principal">
        <button type="button" className={view === 'wall' ? 'active' : ''} onClick={() => setView('wall')}>
          Inicio
        </button>
        <button type="button" className={view === 'closet' ? 'active' : ''} onClick={() => setView('closet')}>
          Armario
        </button>
      </nav>

      {view === 'wall' ? (
        <section className="wall-scene" aria-label="Inicio">
          <div className="calendar-card">
            <span>HOY</span>
            <strong>{new Date().getDate()}</strong>
            <small>{new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date())}</small>
          </div>

          <button className="today-card" type="button" onClick={() => setView('closet')}>
            <span className="question">?</span>
            <strong>¿Qué me pongo hoy?</strong>
            <small>Descubre un conjunto para hoy</small>
          </button>

          <p className="swipe-hint">Desliza o toca para ir al armario</p>
        </section>
      ) : (
        <section className="closet-stage" aria-label="Armario">
          <div className={`closet ${doorsOpen ? 'open' : ''}`}>
            <button className="closet-door left" type="button" onClick={() => setDoorsOpen(true)} aria-label="Abrir armario" />
            <button className="closet-door right" type="button" onClick={() => setDoorsOpen(true)} aria-label="Abrir armario" />

            <div className="closet-interior">
              <button type="button">ABRIGOS</button>
              <button type="button">ARRIBA / VESTIDOS</button>
              <button type="button">ABAJO</button>
              <button type="button">ACCESORIOS</button>
              <button type="button">CALZADO</button>
            </div>
          </div>

          <button className="back-button" type="button" onClick={() => setView('wall')}>
            ← Volver a inicio
          </button>
        </section>
      )}
    </main>
  );
}
