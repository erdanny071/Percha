"use client";

import { useState } from "react";

type Screen =
  | "inicio"
  | "armario"
  | "armario-abierto"
  | "categorias"
  | "detalle"
  | "anadir"
  | "generador"
  | "resultado"
  | "editor"
  | "outfits"
  | "historial"
  | "ajustes";

const categories = [
  ["Tops", "32 prendas", "👕"],
  ["Vestidos", "12 prendas", "👗"],
  ["Pantalones", "18 prendas", "👖"],
  ["Faldas", "8 prendas", "🩷"],
  ["Abrigos", "9 prendas", "🧥"],
  ["Zapatos", "18 prendas", "👟"],
  ["Bolsos", "6 prendas", "👜"],
  ["Accesorios", "15 prendas", "🕶️"],
];

const outfits = [
  ["Look Oficina Lunes", "Trabajo", "92% match"],
  ["Cita Romántica", "Salir", "88% match"],
  ["Domingo Brunch", "Informal", "91% match"],
];

function Icon({ name }: { name: string }) {
  const paths: Record<string, string> = {
    home: "M3 10.5 12 3l9 7.5v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z",
    closet: "M5 4h14v16H5z M8 8h2 M14 8h2 M8 12h8 M8 16h8",
    outfits: "M6 4h12v16H6z M9 8h6 M9 12h6 M9 16h4",
    settings: "M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm0-5v2m0 13v2M4.2 5.2l1.4 1.4m12.8 12.8 1.4 1.4M2 12h2m16 0h2M4.2 18.8l1.4-1.4m12.8-12.8 1.4-1.4",
    arrow: "M5 12h13m-5-5 5 5-5 5",
    back: "M19 12H5m6-6-6 6 6 6",
    search: "m20 20-4.2-4.2m2-5.3a7.3 7.3 0 1 1-14.6 0 7.3 7.3 0 0 1 14.6 0Z",
    plus: "M12 5v14M5 12h14",
    camera: "M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Zm8 3.2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
    wand: "m15 4 5 5M4 20l9.5-9.5M5 5l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Zm11 10 1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z",
    heart: "M20 8.5c0 5-8 9.5-8 9.5S4 13.5 4 8.5A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 8 2.5Z",
    refresh: "M20 11a8 8 0 1 0 2 5m-2-5v-5m0 5h-5",
    check: "m5 12 4 4L19 6",
    x: "M6 6l12 12M18 6 6 18",
  };
  return (
    <svg viewBox="0 0 24 24" className="icon" aria-hidden="true">
      <path d={paths[name] || paths.plus} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BottomNav({ screen, go }: { screen: Screen; go: (s: Screen) => void }) {
  return (
    <nav className="bottom-nav">
      <button className={screen === "inicio" ? "active" : ""} onClick={() => go("inicio")}><Icon name="home"/><span>Inicio</span></button>
      <button className={["armario", "armario-abierto", "categorias", "detalle", "anadir"].includes(screen) ? "active" : ""} onClick={() => go("armario")}><Icon name="closet"/><span>Armario</span></button>
      <button className={["outfits", "resultado", "editor"].includes(screen) ? "active" : ""} onClick={() => go("outfits")}><Icon name="outfits"/><span>Outfits</span></button>
      <button className={screen === "ajustes" ? "active" : ""} onClick={() => go("ajustes")}><Icon name="settings"/><span>Ajustes</span></button>
    </nav>
  );
}

function Header({ title, back, go }: { title?: string; back?: Screen; go: (s: Screen) => void }) {
  return (
    <header className="brand-header">
      <div className="brand-left">
        {back ? <button className="round-btn" onClick={() => go(back)}><Icon name="back"/></button> : <div className="brand-mark">×</div>}
        <span className={title ? "screen-title" : "wordmark"}>{title || "Percha"}</span>
      </div>
      <span className="ai-badge">✦ AI Assist</span>
    </header>
  );
}

function ImageCard({ emoji, className = "" }: { emoji: string; className?: string }) {
  return <div className={`fashion-image ${className}`}><span>{emoji}</span></div>;
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("inicio");
  const go = (next: Screen) => setScreen(next);

  return (
    <main className="app-shell">
      <div className="phone">
        {screen === "inicio" && <>
          <div className="scroll-content home-screen">
            <Header go={go}/>
            <section className="hero">
              <ImageCard emoji="🧥" className="hero-image"/>
              <h1>Tu armario<br/>inteligente</h1>
              <p>Organiza tus prendas, redescubre tu estilo y genera los outfits perfectos para cada ocasión con nuestro asistente de moda virtual.</p>
              <button className="primary-btn" onClick={() => go("armario")}>Abrir mi armario <Icon name="arrow"/></button>
              <button className="secondary-btn large" onClick={() => go("generador")}><Icon name="wand"/> ¿Qué me pongo hoy?</button>
              <div className="stats"><b>142</b> Prendas listas <i/> <b>24</b> Outfits creados</div>
            </section>
          </div>
          <BottomNav screen={screen} go={go}/>
        </>}

        {screen === "armario" && <>
          <div className="scroll-content closed-closet">
            <div className="status-space"/>
            <div className="center-title"><h2>Mi Armario</h2><span>Otoño / Invierno</span></div>
            <button className="closed-cabinet" onClick={() => go("armario-abierto")}><div/><div/><span>Toca para abrir</span></button>
            <div className="side-actions"><button>♧<small>3</small></button><button>♢</button></div>
          </div>
          <BottomNav screen={screen} go={go}/>
        </>}

        {screen === "armario-abierto" && <>
          <div className="scroll-content">
            <Header go={go}/>
            <div className="filter-scroll">{["Informal", "Salir", "Elegante", "Noche", "Trabajo", "Evento"].map(x => <button key={x}>{x}</button>)}</div>
            <section className="wardrobe-card">
              {[['🧥','balda superior','Abrigos','8 prendas'],['👕','barra superior','Parte de arriba','32 prendas'],['👗','barra media','Vestidos y Enteros','12 prendas'],['👖','cajón principal','Parte de abajo','24 prendas'],['🕶️','cajón pequeño','Gorras y accesorios','15 prendas'],['👟','zona inferior','Calzado','18 pares']].map(([e,sub,name,count]) => <button className="wardrobe-row" key={name} onClick={() => go("categorias")}><ImageCard emoji={e}/><div><small>{sub}</small><strong>{name}</strong></div><em>{count}</em></button>)}
            </section>
            <button className="fab" onClick={() => go("anadir")}><Icon name="camera"/></button>
          </div>
          <BottomNav screen={screen} go={go}/>
        </>}

        {screen === "categorias" && <>
          <div className="scroll-content"><Header title="Categorías" go={go}/><span className="subheading">Mi Armario</span><div className="search"><Icon name="search"/>Buscar prendas...</div><section className="category-grid">{categories.map(([name,count,emoji]) => <button key={name} onClick={() => go("detalle")}><ImageCard emoji={emoji}/><strong>{name}</strong><small>{count}</small></button>)}</section></div>
          <BottomNav screen={screen} go={go}/>
        </>}

        {screen === "detalle" && <>
          <div className="scroll-content"><Header title="Detalle de Prenda" back="categorias" go={go}/><ImageCard emoji="🧥" className="detail-image"/><section className="detail-body"><div className="detail-brand">Zara Studio <button>♡</button></div><h2>Blazer Oversize Camel</h2><div className="pills"><span>● Camel</span><span>Talla M</span><span>🍁 Otoño / Invierno</span></div><h4>Ocasiones recomendadas</h4><div className="pills"><span>✨ Elegante</span><span>💼 Trabajo</span></div><div className="metrics"><div>Puesta<strong>14 veces</strong></div><div>Última puesta<strong>Hace 3 días</strong></div></div><div className="detail-actions"><button className="secondary-square"><Icon name="settings"/></button><button className="primary-btn" onClick={() => go("generador")}><Icon name="wand"/> Generar Outfit con esta prenda</button></div></section></div><BottomNav screen={screen} go={go}/>
        </>}

        {screen === "anadir" && <>
          <div className="scroll-content"><Header title="Añadir Prenda" go={go}/><section className="add-body"><button className="upload-zone"><div className="camera-circle"><Icon name="camera"/></div><strong>Sube o toma una foto</strong><small>Soporta JPG, PNG en fondo claro</small></button><div className="ai-banner">✦ <span>La IA detectará automáticamente tipo, color y estilo de tu prenda al subir la imagen.</span></div><div className="form"><label>Nombre de la Prenda<input placeholder="Jersey de Punto Cuello V"/></label><label>Tipo de Prenda<select><option>Tops</option><option>Bottom</option><option>Vestido</option></select></label><label>Talla<select><option>M</option><option>S</option><option>L</option></select></label><label>Ocasiones recomendadas<div className="chip-row">{["Informal","Salir","Elegante","Trabajo"].map(x => <button key={x}>{x}</button>)}</div></label></div><button className="primary-btn" onClick={() => go("armario-abierto")}>Guardar Prenda</button></section></div><BottomNav screen={screen} go={go}/>
        </>}

        {screen === "generador" && <>
          <div className="scroll-content"><Header title="Generador AI" go={go}/><section className="generator"><h3>¿Para qué ocasión?</h3><div className="occasion-grid">{["Casual","Trabajo","Cita","Eventos","Deporte"].map(x => <button key={x}>{x}</button>)}</div><h3>Clima actual</h3><div className="weather"><span>☁️</span><div>Ligeramente frío<small>Gran Canaria, Otoño</small></div><strong>22°C</strong></div><h3>Preferencia de estilo</h3><div className="style-toggle"><button>Minimalista</button><button className="selected">Atrevido</button><button>Clásico</button></div><button className="primary-btn generate" onClick={() => go("resultado")}><Icon name="wand"/> Generar Outfit Inteligente ✨</button><p className="helper">Buscando entre tus 142 prendas y combinando estilos...</p></section></div><BottomNav screen={screen} go={go}/>
        </>}

        {screen === "resultado" && <>
          <div className="scroll-content"><Header title="Tu Outfit AI" back="generador" go={go}/><span className="match">94% Match</span><section className="outfit-result"><div className="outfit-stack"><ImageCard emoji="🧥"/><ImageCard emoji="👕"/><ImageCard emoji="👖"/><ImageCard emoji="👞"/></div><div className="outfit-labels"><span>Abrigo<strong>Blazer Camel</strong></span><span>Parte superior<strong>Blusa Seda</strong></span><span>Parte inferior<strong>Pantalón Pinzas</strong></span><span>Calzado<strong>Loafers Piel</strong></span></div></section><div className="result-actions"><button><Icon name="refresh"/></button><button className="primary-btn" onClick={() => go("editor")}><Icon name="check"/> Guardar este look</button></div><p className="helper">Desliza para ver más combinaciones alternativas</p></div><BottomNav screen={screen} go={go}/>
        </>}

        {screen === "editor" && <>
          <div className="scroll-content"><Header title="Editar Outfit" back="resultado" go={go}/><button className="reset">Reset</button><section className="editor-stack">{[["Parte Superior","Blusa Seda"],["Parte Inferior","Pantalón Pinzas"],["Calzado","Loafers Piel"]].map(([slot,item]) => <div className="editor-slot" key={slot}><div className="slot-head"><b>{slot}</b><span>⌁</span></div><div className="current-item"><ImageCard emoji="👕"/><div><strong>{item}</strong><small>Actual</small></div><button><Icon name="refresh"/></button></div><small>Alternativas en tu armario</small><div className="alternatives"><ImageCard emoji="👕"/><ImageCard emoji="👚"/><button><Icon name="plus"/></button></div></div>)}</section><button className="primary-btn confirm" onClick={() => go("outfits")}>Confirmar Cambios</button></div><BottomNav screen={screen} go={go}/>
        </>}

        {screen === "outfits" && <>
          <div className="scroll-content"><Header title="Mis Outfits" go={go}/><span className="saved-count">24 Guardados</span><div className="filter-scroll dark">{["Todos","Favoritos","Recientes"].map(x => <button key={x}>{x}</button>)}</div><section className="outfits-grid">{outfits.map(([name,occasion,match], i) => <button key={name} className={i === 0 ? "outfit-card featured" : "outfit-card"}><ImageCard emoji={i === 0 ? "🧥" : i === 1 ? "👗" : "👕"}/><strong>{name}</strong><small><span>{occasion}</span>{match}</small></button>)}</section><button className="fab"><Icon name="plus"/></button></div><BottomNav screen={screen} go={go}/>
        </>}

        {screen === "historial" && <>
          <div className="scroll-content"><Header title="Historial" go={go}/><section className="calendar"><div><strong>Noviembre 2026</strong><span>Ver mes completo</span></div><div className="days">{[12,13,14,15,16,17,18].map((d,i) => <span key={d} className={i===5 ? "today" : ""}>{d}{[12,14,15,17].includes(d) && <i/>}</span>)}</div></section><section className="timeline"><h3>Recientemente puesto</h3>{[["🧥","Blazer Camel + Vaqueros","Hoy, 10:15 AM","Trabajo"],["👗","Vestido Midi Negro","Ayer, 8:30 PM","Noche"]].map(x => <div className="timeline-row" key={x[1]}><ImageCard emoji={x[0]}/><div><strong>{x[1]}</strong><small>{x[2]}</small></div><em>{x[3]}</em></div>)}</section><section className="curiosities"><h3>Curiosidades de Armario</h3><div><b>Favorito absoluto</b><strong>Blazer Camel</strong><small>14 puestas</small></div><div><b>Olvidado</b><strong>Vestido Flores</strong><small>Sin usar 2 meses</small></div></section></div><BottomNav screen={screen} go={go}/>
        </>}

        {screen === "ajustes" && <>
          <div className="scroll-content"><Header title="Ajustes" go={go}/><section className="profile"><div className="avatar">SV</div><div><strong>Sofía Valdés</strong><small>sofia.valdes@luxefashion.com</small></div><span>PREMIUM</span></section><SettingsSection title="MI CUENTA" items={["Información Personal","Suscripción Premium","Preferencias de Estilo"]}/><SettingsSection title="HERRAMIENTAS IA" items={["Ajustar mi Asistente AI","Exportar Datos de Armario"]}/><SettingsSection title="SOPORTE" items={["Ayuda y Soporte"]}/></div><BottomNav screen={screen} go={go}/>
        </>}
      </div>
    </main>
  );
}

function SettingsSection({ title, items }: { title: string; items: string[] }) {
  return <section className="settings-section"><h4>{title}</h4><div className="settings-card">{items.map(x => <button key={x}><span>{x}</span><b>›</b></button>)}</div></section>;
}
