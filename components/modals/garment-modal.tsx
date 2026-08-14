"use client";

import { useEffect, useRef, useState } from "react";
import type { Category, Garment, Occasion } from "@/types";
import { CAT_LABELS } from "@/lib/constants";
import { fileToCompressedDataUrl, colorBucketFromDataUrl } from "@/lib/image";

const OCCASIONS: { value: Occasion; label: string }[] = [
  { value: "informal", label: "Informal / diario" },
  { value: "salir", label: "Salir / quedar" },
  { value: "elegante", label: "Elegante" },
  { value: "noche", label: "Noche / fiesta" },
  { value: "trabajo", label: "Trabajo" },
  { value: "deporte", label: "Deporte" },
  { value: "evento", label: "Evento especial" },
];

interface Props {
  garment: Garment | null;
  defaultCategory?: Category;
  onClose: () => void;
  onSave: (g: Garment) => void;
}

export function GarmentModal({ garment, defaultCategory, onClose, onSave }: Props) {
  const [name, setName] = useState(garment?.name ?? "");
  const [category, setCategory] = useState<Category>(
    (garment?.category as Category) ?? defaultCategory ?? "top"
  );
  const [occasion, setOccasion] = useState<string>(garment?.occasion ?? "informal");
  const [preview, setPreview] = useState<string>(garment?.image ?? "");
  const [pendingDataUrl, setPendingDataUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await fileToCompressedDataUrl(file);
      setPreview(dataUrl);
      setPendingDataUrl(dataUrl);
    } finally {
      setBusy(false);
    }
  }

  async function handleSave() {
    if (!name.trim()) {
      alert("Ponle un nombre a la prenda.");
      return;
    }
    setBusy(true);
    try {
      let colorBucket = garment?.colorBucket;
      if (pendingDataUrl) {
        colorBucket = await colorBucketFromDataUrl(pendingDataUrl);
      }
      const base: Garment = garment
        ? { ...garment }
        : {
            id: "",
            name: "",
            category: "top",
            occasion: "informal",
            status: "disponible",
            favorite: false,
            addedAt: Date.now(),
          };
      const next: Garment = {
        ...base,
        name: name.trim(),
        category,
        occasion,
        colorBucket,
      };
      if (pendingDataUrl) {
        next._pendingDataUrl = pendingDataUrl;
        next.image = pendingDataUrl;
      }
      onSave(next);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>{garment ? "Editar prenda" : "Nueva prenda"}</h2>
          <button className="modal-x" onClick={onClose} aria-label="Cerrar">
            ×
          </button>
        </div>

        <div className="field">
          <label>Foto</label>
          <div className="photo-drop">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview || "/placeholder.svg"} alt={name || "Prenda"} />
            ) : (
              <span className="photo-empty">Sin foto</span>
            )}
          </div>
          <div className="photo-actions">
            <button type="button" className="btn-soft" onClick={() => cameraRef.current?.click()}>
              Cámara
            </button>
            <button type="button" className="btn-soft" onClick={() => galleryRef.current?.click()}>
              Galería
            </button>
          </div>
          <input
            ref={cameraRef}
            type="file"
            accept="image/*"
            capture="environment"
            hidden
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          <input
            ref={galleryRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>

        <div className="field">
          <label htmlFor="g-name">Nombre</label>
          <input
            id="g-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Camiseta blanca"
          />
        </div>

        <div className="field">
          <label htmlFor="g-cat">Categoría</label>
          <select
            id="g-cat"
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
          >
            {(Object.keys(CAT_LABELS) as Category[]).map((c) => (
              <option key={c} value={c}>
                {CAT_LABELS[c]}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="g-occ">Ocasión</label>
          <select id="g-occ" value={occasion} onChange={(e) => setOccasion(e.target.value)}>
            {OCCASIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="modal-foot">
          <button className="btn-ghost" onClick={onClose} disabled={busy}>
            Cancelar
          </button>
          <button className="btn-primary" onClick={handleSave} disabled={busy}>
            {busy ? "Guardando…" : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
}
