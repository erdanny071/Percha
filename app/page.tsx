export default function Home() {
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', padding: 24 }}>
      <h1 style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 19, letterSpacing: 2, textTransform: 'uppercase' }}>
        Percha
      </h1>
      <p style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.4 }}>
        tu armario, sin repetir
      </p>
      <p style={{ marginTop: 24, color: 'var(--muted)' }}>
        Migración a Next.js — Fase 1 completada.
      </p>
    </div>
  );
}
