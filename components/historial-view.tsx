"use client";

import type { Garment, OutfitLog } from "@/types";
import { todayStr } from "@/lib/constants";

export function HistorialView({
  garments,
  log,
  onUndo,
}: {
  garments: Garment[];
  log: OutfitLog;
  onUndo: (date: string) => void;
}) {
  const days: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }
  const today = todayStr();

  return (
    <div id="historialList">
      {days.map((dateStr) => {
        const ids = log[dateStr] || [];
        const items = ids
          .map((id) => garments.find((g) => g.id === id))
          .filter(Boolean) as Garment[];
        return (
          <div key={dateStr} style={{ marginBottom: 14 }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontFamily: "var(--font-mono)",
                fontSize: 12,
                color: "var(--muted)",
              }}
            >
              <span>{dateStr === today ? "Hoy · " + dateStr : dateStr}</span>
              {items.length ? (
                <button
                  onClick={() => onUndo(dateStr)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--accent)",
                    cursor: "pointer",
                  }}
                >
                  deshacer
                </button>
              ) : null}
            </div>
            {items.length ? (
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                  marginTop: 8,
                }}
              >
                {items.map((g) => (
                  <img
                    key={g.id}
                    src={g.image || "/placeholder.svg"}
                    alt={g.name}
                    style={{
                      width: 56,
                      height: 56,
                      objectFit: "cover",
                      borderRadius: 8,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div style={{ marginTop: 8, color: "var(--muted)" }}>
                Sin registro
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
