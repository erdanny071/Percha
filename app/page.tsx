'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePerchaStore } from '@/store/usePerchaStore';
import { Category, Status } from '@/types/garment';
import { WallScene } from '@/components/views/WallScene';
import { ClosetStage } from '@/components/views/ClosetStage';

const categoryLabels: Record<Category, string> = { top: 'Parte de arriba', bottom: 'Parte de abajo', dress: 'Vestido / mono', outerwear: 'Abrigo / chaqueta', shoes: 'Calzado', accessory: 'Accesorio', cap: 'Gorras' };
const statusLabels: Record<Status, string> = { disponible: 'Disponible', lavando: 'Lavando', no_quiero: 'No me la quiero poner' };
type CategoryFilter = Category | 'top-dress' | 'accessory-cap' | null;

export default function Home() {
  const { garments, outfits, initialized, init, toggleFavorite, cycleStatus } = usePerchaStore();
  const [screen, setScreen] = useState<'wall' | 'closet' | 'list'>('wall');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>(null);
  const [statusFilter, setStatusFilter] = useState<'todas' | 'favoritos' | Status>('todas');

  useEffect(() => { void init(); }, [init]);
  const filtered = useMemo(() => garments.filter((g) => {
    const categoryOk = !categoryFilter || (categoryFilter === 'top-dress' ? g.category === 'top' || g.category === 'dress' : categoryFilter === 'accessory-cap' ? g.category === 'accessory' || g.category === 'cap' : g.category === categoryFilter);
    const statusOk = statusFilter === 'todas' || (statusFilter === 'favoritos' ? g.favorite : g.status === statusFilter);
    return categoryOk && statusOk;
  }), [garments, categoryFilter, statusFilter]);

  if (!initialized) return <main className="percha-shell"><p className="muted">Cargando tu armario…</p></main>;

  if (screen === 'list') return <main className="percha-shell">
    <header className="app-header"><button className="back-button" onClick={() => setScreen('closet')}>←</button><div><h1>Armario</h1><p>{filtered.length} prendas</p></div></header>
    <nav className="filter-row" aria-label="Filtros">{(['todas', 'favoritos', 'disponible', 'lavando', 'no_quiero'] as const).map((value) => <button key={value} className={statusFilter === value ? 'filter active' : 'filter'} onClick={() => setStatusFilter(value)}>{value === 'todas' ? 'Todas' : value === 'favoritos' ? 'Favoritos' : statusLabels[value]}</button>)}</nav>
    <section className="garment-grid">{filtered.length ? filtered.map((garment) => <article className="garment-card" key={garment.id}><div className="garment-image">{garment.image ? <img src={garment.image} alt={garment.name} loading="lazy" /> : <span>sin foto</span>}<button className="icon-button" onClick={() => void toggleFavorite(garment.id)}>{garment.favorite ? '♥' : '♡'}</button></div><div className="garment-info"><strong>{garment.name}</strong><small>{categoryLabels[garment.category]}</small><button className="status-button" onClick={() => void cycleStatus(garment.id)}>{statusLabels[garment.status]}</button></div></article>) : <div className="empty-state"><strong>No hay prendas aquí.</strong><span>Prueba otro filtro.</span></div>}</section>
    <footer className="data-footer">{outfits.length} conjuntos guardados · datos locales conectados</footer>
  </main>;

  return <main className="percha-shell"><div className="view-switcher"><button className={screen === 'wall' ? 'active' : ''} onClick={() => setScreen('wall')}>Inicio</button><button className={screen === 'closet' ? 'active' : ''} onClick={() => setScreen('closet')}>Armario</button></div>{screen === 'wall' ? <WallScene onCloset={() => setScreen('closet')} onHistory={() => setScreen('list')} onToday={() => setScreen('list')} /> : <ClosetStage onCategory={(category) => { setCategoryFilter(category); setStatusFilter('todas'); setScreen('list'); }} onLaundry={() => { setCategoryFilter(null); setStatusFilter('lavando'); setScreen('list'); }} onTrash={() => { setCategoryFilter(null); setStatusFilter('no_quiero'); setScreen('list'); }} />}</main>;
}
