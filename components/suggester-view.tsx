"use client";

import type { Combo, Draft, Garment } from "@/types";
import { EmptyClosetIcon } from "@/components/icons";
import { generateStyleReasoning } from "@/lib/outfit-engine";

export interface SuggestionState {
  view: "cta" | "list" | "editor" | "confirmed" | "empty" | "error";
  combos: Combo[];
  occasion: string;
  includeAcc: boolean;
  includeCap: boolean;
  draft: Draft | null;
  error: string[];
}

function Thumb({ g, size = 44 }: { g?: Garment | null; size?: number }) {
  if (!g) return null;
  return (
    <img
      src={g.image || "/placeholder.svg"}
      alt={g.name}
      style={{
        width: size,
        height: size,
        objectFit: "cover",
        borderRadius: 8,
        border: "1px solid var(--canvas-deep)",
      }}
    />
  );
}

function SlotRow({
  label,
  category,
  current,
  slotKey,
  garments,
  onPick,
}: {
  label: string;
  category: Garment["category"];
  current: Garment | null;
  slotKey: keyof Draft;
  garments: Garment[];
  onPick: (key: keyof Draft, id: string) => void;
}) {
  const alternatives = garments.filter(
    (g) => g.status === "disponible" && g.category === category,
  );
  const optional = slotKey === "accessory" || slotKey === "cap";
  return (
    <div style={{ marginTop: 12 }}>
      <div className="field-label">{label}</div>
      <div
        style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 6 }}
      >
        {current ? (
          <img
            src={current.image || "/placeholder.svg"}
            alt={current.name}
            style={{
              width: 56,
              height: 56,
              objectFit: "cover",
              borderRadius: 10,
              border: "1px solid var(--canvas-deep)",
            }}
          />
        ) : (
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 10,
              border: "1.5px dashed var(--canvas-deep)",
            }}
          />
        )}
        <div style={{ flex: 1, fontSize: 13 }}>
          {current ? current.name : "Ninguno"}
        </div>
      </div>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", padding: "8px 0" }}>
        {optional ? (
          <button
            className={`filter-chip ${!current ? "active" : ""}`}
            onClick={() => onPick(slotKey, "")}
          >
            Ninguno
          </button>
        ) : null}
        {alternatives.map((a) => (
          <button
            key={a.id}
            className={`filter-chip ${current && current.id === a.id ? "active" : ""}`}
            onClick={() => onPick(slotKey, a.id)}
          >
            {a.name}
          </button>
        ))}
      </div>
    </div>
  );
}

export function SuggesterView({
  suggestion,
  garments,
  onBack,
  onSuggest,
  onChoose,
  onSlotPick,
  onBackToList,
  onConfirm,
}: {
  suggestion: SuggestionState;
  garments: Garment[];
  onBack: () => void;
  onSuggest: () => void;
  onChoose: (idx: number) => void;
  onSlotPick: (key: keyof Draft, id: string) => void;
  onBackToList: () => void;
  onConfirm: () => void;
}) {
  const { view, combos, occasion, draft, error } = suggestion;

  return (
    <div className="drill-panel">
      <button className="secondary-btn back-drill-btn" onClick={onBack}>
        ← Volver
      </button>
      <button className="cta-btn" onClick={onSuggest}>
        ¿Qué me pongo hoy?
      </button>

      <div style={{ marginTop: 12 }}>
        {view === "error" && (
          <div className="empty-state">
            <EmptyClosetIcon />
            <div>
              Te falta tener disponible: <b>{error.join(", ")}</b>. Todo conjunto
              necesita parte de arriba, parte de abajo y playeras.
            </div>
          </div>
        )}

        {view === "empty" && (
          <div className="empty-state">
            No hay combinaciones posibles con tu ropa disponible.
          </div>
        )}

        {view === "confirmed" && (
          <div className="reasoning-box">
            Registrado en tu historial. ¡Que lo disfrutes!
          </div>
        )}

        {view === "list" && (
          <>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>
              {combos.length} conjunto{combos.length === 1 ? "" : "s"} posible
              {combos.length === 1 ? "" : "s"} para {`"${occasion}"`}
            </div>
            {combos.map((c, i) => (
              <div
                key={i}
                className="outfit-card"
                style={{
                  flexDirection: "column",
                  alignItems: "stretch",
                  marginBottom: 10,
                }}
              >
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <Thumb g={c.top} />
                  <Thumb g={c.bottom} />
                  <Thumb g={c.shoes} />
                  {c.accessory ? <Thumb g={c.accessory} /> : null}
                  {c.cap ? <Thumb g={c.cap} /> : null}
                  <div
                    style={{
                      flex: 1,
                      textAlign: "right",
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      color: "var(--muted)",
                    }}
                  >
                    #{i + 1}
                  </div>
                </div>
                <div
                  style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}
                >
                  {c.top.name} · {c.bottom.name} · {c.shoes.name}
                  {c.accessory ? " · " + c.accessory.name : ""}
                  {c.cap ? " · " + c.cap.name : ""}
                </div>
                <div
                  className="reasoning-box"
                  style={{ marginTop: 8, fontSize: 12 }}
                >
                  {generateStyleReasoning(c, occasion, i)}
                </div>
                {c.repeatedDates.length ? (
                  <div
                    className="occasion-badge"
                    style={{
                      marginTop: 8,
                      background: "var(--wash-bg)",
                      color: "var(--wash)",
                      borderColor: "#C7D6DE",
                    }}
                  >
                    Repetido (ya lo usaste{" "}
                    {c.repeatedDates.length === 1
                      ? "el " + c.repeatedDates[0]
                      : c.repeatedDates.length + " veces"}
                    )
                  </div>
                ) : null}
                <button
                  className="secondary-btn"
                  style={{ marginTop: 10 }}
                  onClick={() => onChoose(i)}
                >
                  Elegir y ajustar
                </button>
              </div>
            ))}
          </>
        )}

        {view === "editor" && draft && (
          <>
            <div className="reasoning-box" style={{ marginBottom: 12 }}>
              {generateStyleReasoning(draft, occasion, 0)}
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>
              Ajusta cualquier prenda antes de confirmar
            </div>
            <SlotRow label="Parte de arriba" category="top" current={draft.top} slotKey="top" garments={garments} onPick={onSlotPick} />
            <SlotRow label="Parte de abajo" category="bottom" current={draft.bottom} slotKey="bottom" garments={garments} onPick={onSlotPick} />
            <SlotRow label="Playeras / calzado" category="shoes" current={draft.shoes} slotKey="shoes" garments={garments} onPick={onSlotPick} />
            <SlotRow label="Accesorio (opcional)" category="accessory" current={draft.accessory} slotKey="accessory" garments={garments} onPick={onSlotPick} />
            <SlotRow label="Gorra (opcional)" category="cap" current={draft.cap} slotKey="cap" garments={garments} onPick={onSlotPick} />
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button className="secondary-btn" onClick={onBackToList}>
                Volver a la lista
              </button>
              <button className="cta-btn" onClick={onConfirm}>
                Me lo pongo hoy
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
