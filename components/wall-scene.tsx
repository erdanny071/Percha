"use client";

import { MESES } from "@/lib/constants";

export function WallScene({
  onOpenHistorial,
  onOpenHoy,
  onGoToCloset,
}: {
  onOpenHistorial: () => void;
  onOpenHoy: () => void;
  onGoToCloset: () => void;
}) {
  const now = new Date();
  const month = MESES[now.getMonth()];
  const day = now.getDate();

  return (
    <div className="wall-scene">
      <div className="calendar-hang" onClick={onOpenHistorial}>
        <div className="calendar-string" />
        <div className="calendar-body">
          <div className="calendar-ring" />
          <div className="calendar-month">{month}</div>
          <div className="calendar-day">{day}</div>
        </div>
        <div className="zone-label">Historial</div>
      </div>

      <div className="question-block" onClick={onOpenHoy}>
        <div className="question-mark">?</div>
        <div className="zone-label" style={{ color: "#fff", opacity: 1 }}>
          ¿Qué me pongo hoy?
        </div>
      </div>

      <div className="wall-hint" onClick={onGoToCloset}>
        Desliza o toca ‹ para ir al armario
      </div>
    </div>
  );
}
