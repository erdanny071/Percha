"use client";

import { useEffect, useRef } from "react";
import type { Garment, Outfit, Status } from "@/types";
import { GarmentCard } from "@/components/garment-card";
import { EmptyClosetIcon } from "@/components/icons";

const STATUS_FILTERS = [
  { key: "todas", label: "Todas" },
  { key: "favoritos", label: "Favoritos" },
  { key: "disponible", label: "Disponibles" },
  { key: "lavando", label: "Lavando" },
  { key: "no_quiero", label: "No usar" },
];

const OCC_FILTERS = [
  { key: "", label: "Todas las ocasiones" },
  { key: "informal", label: "Informal" },
  { key: "salir", label: "Salir" },
  { key: "elegante", label: "Elegante" },
  { key: "noche", label: "Noche" },
  { key: "trabajo", label: "Trabajo" },
  { key: "deporte", label: "Deporte" },
  { key: "evento", label: "Evento" },
];

function OutfitsRow({
  outfits,
  garments,
  onCreate,
  onApply,
  onDelete,
}: {
  outfits: Outfit[];
  garments: Garment[];
  onCreate: () => void;
  onApply: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="outfits-row" id="outfitsSection">
      <button className="secondary-btn" onClick={onCreate}>
        + Crear conjunto
      </button>
      {outfits.length === 0 ? (
        <div style={{ marginLeft: 8, color: "var(--muted)" }}>No hay conjuntos</div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginLeft: 8,
          }}
        >
          {outfits.map((o) => {
            const thumb =
              o.garmentIds && o.garmentIds.length
                ? garments.find((g) => g.id === o.garmentIds[0])?.image
                : "";
            return (
              <div className="outfit-card" key={o.id}>
                <div className="outfit-thumb">
                  {thumb ? (
                    <img
                      src={thumb || "/placeholder.svg"}
                      alt={o.name}
                      loading="lazy"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : null}
                </div>
                <div style={{ marginLeft: 8 }}>
                  <div style={{ fontWeight: 700 }}>{o.name}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>
                    {o.garmentIds.length} prendas
                  </div>
                </div>
                <div
                  style={{
                    marginLeft: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  <button
                    className="cta-btn"
                    style={{ padding: "6px 8px", fontSize: 12 }}
                    onClick={() => onApply(o.id)}
                  >
                    Aplicar
                  </button>
                  <button
                    className="secondary-btn"
                    style={{ padding: "6px 8px", fontSize: 12 }}
                    onClick={() => onDelete(o.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function ArmarioList({
  filtered,
  garments,
  outfits,
  visibleCount,
  currentFilter,
  currentOccFilter,
  selectMode,
  selectionSet,
  onClose,
  onFilter,
  onOccFilter,
  onToggleSelectMode,
  onCreateOutfit,
  onMarkStatus,
  onDeleteSelected,
  onCreateOutfitFromSel,
  onExitSelect,
  onToggleSelect,
  onFav,
  onEdit,
  onDelete,
  onCycle,
  onApplyOutfit,
  onDeleteOutfit,
  onLoadMore,
}: {
  filtered: Garment[];
  garments: Garment[];
  outfits: Outfit[];
  visibleCount: number;
  currentFilter: string;
  currentOccFilter: string;
  selectMode: boolean;
  selectionSet: Set<string>;
  onClose: () => void;
  onFilter: (f: string) => void;
  onOccFilter: (f: string) => void;
  onToggleSelectMode: () => void;
  onCreateOutfit: () => void;
  onMarkStatus: (s: Status) => void;
  onDeleteSelected: () => void;
  onCreateOutfitFromSel: () => void;
  onExitSelect: () => void;
  onToggleSelect: (id: string) => void;
  onFav: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onCycle: (id: string) => void;
  onApplyOutfit: (id: string) => void;
  onDeleteOutfit: (id: string) => void;
  onLoadMore: () => void;
}) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const toRender = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting && hasMore) onLoadMore();
        });
      },
      { root: null, rootMargin: "200px", threshold: 0.01 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [hasMore, onLoadMore]);

  return (
    <div>
      <button
        className="secondary-btn"
        style={{ marginBottom: 10 }}
        onClick={onClose}
      >
        ← Volver al armario
      </button>

      <div className="filter-row">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.key}
            className={`filter-chip ${currentFilter === f.key ? "active" : ""}`}
            onClick={() => onFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="filter-row">
        {OCC_FILTERS.map((f) => (
          <button
            key={f.key}
            className={`filter-chip ${currentOccFilter === f.key ? "active" : ""}`}
            onClick={() => onOccFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="armario-controls">
        <div style={{ display: "flex", gap: 8 }}>
          <button className="secondary-btn" onClick={onToggleSelectMode}>
            Seleccionar
          </button>
          <button className="secondary-btn" onClick={onCreateOutfit}>
            Crear conjunto
          </button>
        </div>
        {selectMode ? (
          <div className="selection-actions">
            <div style={{ fontSize: 13, color: "var(--muted)" }}>
              Seleccionadas: {selectionSet.size}
            </div>
            <button className="secondary-btn" onClick={() => onMarkStatus("lavando")}>
              Lavando
            </button>
            <button
              className="secondary-btn"
              onClick={() => onMarkStatus("disponible")}
            >
              Disponible
            </button>
            <button
              className="secondary-btn"
              onClick={() => onMarkStatus("no_quiero")}
            >
              No usar
            </button>
            <button className="secondary-btn" onClick={onCreateOutfitFromSel}>
              Crear conjunto
            </button>
            <button
              className="secondary-btn"
              style={{
                background: "#FDEDEB",
                borderColor: "var(--accent)",
                color: "var(--accent)",
              }}
              onClick={onDeleteSelected}
            >
              Eliminar
            </button>
            <button className="secondary-btn" onClick={onExitSelect}>
              Salir
            </button>
          </div>
        ) : null}
      </div>

      <OutfitsRow
        outfits={outfits}
        garments={garments}
        onCreate={onCreateOutfit}
        onApply={onApplyOutfit}
        onDelete={onDeleteOutfit}
      />

      <div id="armarioGrid">
        {toRender.length === 0 ? (
          <div className="empty-state">
            <EmptyClosetIcon />
            <div>No hay prendas aquí.</div>
          </div>
        ) : (
          <div className="garment-grid">
            {toRender.map((g) => (
              <GarmentCard
                key={g.id}
                g={g}
                selectMode={selectMode}
                selected={selectionSet.has(g.id)}
                onToggleSelect={onToggleSelect}
                onFav={onFav}
                onEdit={onEdit}
                onDelete={onDelete}
                onCycle={onCycle}
              />
            ))}
          </div>
        )}
      </div>

      <div ref={sentinelRef} className="sentinel" />
    </div>
  );
}
