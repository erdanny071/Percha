"use client";

import { ChevronLeftIcon, GearIcon } from "@/components/icons";

export function PerchaHeader({
  showBack,
  onBack,
  onSettings,
}: {
  showBack: boolean;
  onBack: () => void;
  onSettings: () => void;
}) {
  return (
    <div className="p-header">
      <div className="header-left">
        <button
          className="icon-btn"
          title="Atrás"
          onClick={onBack}
          style={{ display: showBack ? "inline-flex" : "none" }}
        >
          <ChevronLeftIcon />
        </button>
      </div>
      <div className="header-center">
        <div className="wordmark">Percha</div>
        <div className="tagline">tu armario, sin repetir</div>
      </div>
      <div className="header-right">
        <button className="icon-btn" title="Ajustes" onClick={onSettings}>
          <GearIcon />
        </button>
      </div>
    </div>
  );
}
