'use client';

import { useEffect, useState } from 'react';
import { storage } from '@/lib/storage';

export default function Home() {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [garmentCount, setGarmentCount] = useState(0);
  const [outfitCount, setOutfitCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        await storage.init();
        const [garments, outfits] = await Promise.all([
          storage.list('garment:'),
          storage.list('outfit:'),
        ]);

        if (cancelled) return;
        setGarmentCount(garments.length);
        setOutfitCount(outfits.length);
        setStatus('ready');
      } catch {
        if (!cancelled) setStatus('error');
      }
    }

    void init();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', padding: 24 }}>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 19, letterSpacing: 2, textTransform: 'uppercase' }}>
        Percha
      </h1>
      <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.4 }}>
        tu armario, sin repetir
      </p>

      <section style={{ marginTop: 32 }}>
        {status === 'loading' && <p style={{ color: 'var(--muted)' }}>Cargando tu armario…</p>}
        {status === 'error' && <p style={{ color: 'var(--muted)' }}>No se ha podido abrir el almacenamiento.</p>}
        {status === 'ready' && (
          <>
            <p style={{ color: 'var(--muted)' }}>Datos conectados correctamente.</p>
            <p style={{ marginTop: 12 }}>Prendas: <strong>{garmentCount}</strong></p>
            <p>Conjuntos: <strong>{outfitCount}</strong></p>
          </>
        )}
      </section>
    </main>
  );
}
