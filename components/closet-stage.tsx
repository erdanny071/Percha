"use client";

import { useRef } from "react";
import type { Status } from "@/types";

const ZONES: { zone: string; label: string; kind: string }[] = [
  { zone: "outerwear", label: "Abrigos", kind: "shelf" },
  { zone: "top-dress", label: "Parte de arriba y vestidos", kind: "rod" },
  { zone: "bottom", label: "Parte de abajo", kind: "drawer" },
  { zone: "accessory-cap", label: "Gorras y accesorios", kind: "drawer" },
  { zone: "shoes", label: "Calzado", kind: "shoe-cubby" },
];

export function ClosetStage({
  doorsOpen,
  showingSide,
  onOpenDoors,
  onZoneClick,
  onGoLaundry,
  onBackToCloset,
  onSideClick,
}: {
  doorsOpen: boolean;
  showingSide: boolean;
  onOpenDoors: () => void;
  onZoneClick: (zoneKey: string) => void;
  onGoLaundry: () => void;
  onBackToCloset: () => void;
  onSideClick: (status: Status) => void;
}) {
  const startX = useRef<number | null>(null);

  return (
    <div
      className="closet-stage"
      onTouchStart={(e) => {
        startX.current = e.touches[0].clientX;
      }}
      onTouchEnd={(e) => {
        if (startX.current === null) return;
        const dx = e.changedTouches[0].clientX - startX.current;
        if (dx < -50) onGoLaundry();
        else if (dx > 50) onBackToCloset();
        startX.current = null;
      }}
    >
      <div className={`closet-swipe ${showingSide ? "showing-side" : ""}`}>
        <div className="closet-page closet-main">
          <div
            className={`closet-doors ${doorsOpen ? "open" : ""}`}
            onClick={onOpenDoors}
          >
            <div className="door door-left">
              <div className="door-handle" />
            </div>
            <div className="door door-right">
              <div className="door-handle" />
            </div>
            <div className="doors-hint">Toca para abrir tu armario</div>
          </div>

          <div className="closet-interior">
            {ZONES.map((z) => (
              <div
                key={z.zone}
                className={`closet-zone ${z.kind}`}
                onClick={() => {
                  if (!doorsOpen) return;
                  onZoneClick(z.zone);
                }}
              >
                {z.kind === "shelf" && <div className="shelf-plank" />}
                {z.kind === "rod" && (
                  <>
                    <div className="rod-bar" />
                    <div className="hangers">
                      <div className="hanger-shirt s1" />
                      <div className="hanger-shirt s2" />
                      <div className="hanger-shirt s3" />
                      <div className="hanger-shirt s4" />
                    </div>
                  </>
                )}
                {z.kind === "drawer" && <div className="drawer-front" />}
                {z.kind === "shoe-cubby" && (
                  <div className="cubby-cells">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div key={i} className="cubby-cell" />
                    ))}
                  </div>
                )}
                <div className="zone-label">{z.label}</div>
              </div>
            ))}
          </div>

          <button
            id="goLaundryBtn"
            className="swipe-hint-btn"
            onClick={onGoLaundry}
          >
            ‹ Lavadora y papelera
          </button>
        </div>

        <div className="closet-page closet-side">
          <button
            className="swipe-hint-btn swipe-hint-btn-right"
            onClick={onBackToCloset}
          >
            Armario ›
          </button>
          <div className="side-block" onClick={() => onSideClick("lavando")}>
            <div className="washer-body">
              <div className="washer-drum" />
            </div>
            <div className="zone-label">Lavando</div>
          </div>
          <div className="side-block" onClick={() => onSideClick("no_quiero")}>
            <div className="trash-body">
              <div className="trash-lid" />
              <div className="trash-lines">
                <span />
                <span />
                <span />
              </div>
            </div>
            <div className="zone-label">No usar hoy</div>
          </div>
        </div>
      </div>
    </div>
  );
}
