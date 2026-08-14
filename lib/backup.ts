import type { Garment, Outfit, OutfitLog } from "@/types";
import { storage } from "@/lib/storage";
import { imageObjectUrls, saveOutfit, saveLog, newId } from "@/lib/data";

// Export: build a JSON blob with metadata and image data URLs, then download it.
export async function exportData(
  garments: Garment[],
  outfits: Outfit[],
  log: OutfitLog,
): Promise<void> {
  const data: {
    garments: Record<string, unknown>[];
    outfits: Outfit[];
    log: OutfitLog;
  } = { garments: [], outfits, log };
  for (const g of garments) {
    const meta: Record<string, unknown> = { ...g };
    delete meta.image;
    delete meta._pendingDataUrl;
    const blob = await storage.get<Blob>("image:" + g.id);
    if (blob) {
      const b64 = await new Promise<string>((res) => {
        const r = new FileReader();
        r.onloadend = () => res(r.result as string);
        r.readAsDataURL(blob);
      });
      meta.imageDataUrl = b64;
    }
    data.garments.push(meta);
  }
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "percha-export.json";
  a.click();
  URL.revokeObjectURL(url);
}

export interface ImportResult {
  garments: Garment[];
  outfits: Outfit[];
  log: OutfitLog;
  imported: number;
  skipped: number;
}

// Import: parse, validate and merge into the provided collections (persisting as it goes).
export async function importData(
  file: File,
  garments: Garment[],
  outfits: Outfit[],
  log: OutfitLog,
): Promise<ImportResult> {
  const text = await file.text();
  const data = JSON.parse(text);
  if (!data || !Array.isArray(data.garments)) {
    throw new Error("Archivo inválido");
  }

  const nextGarments = [...garments];
  const nextOutfits = [...outfits];
  let nextLog = { ...log };
  let imported = 0;
  let skipped = 0;

  for (const meta of data.garments) {
    if (!meta.id || !meta.name) {
      skipped++;
      continue;
    }
    let id: string = meta.id;
    if (
      nextGarments.find((g) => g.id === id) ||
      (await storage.get("garment:" + id))
    ) {
      id = newId();
    }
    const g: Garment = { ...meta, id };
    if (meta.imageDataUrl && typeof meta.imageDataUrl === "string") {
      const m = meta.imageDataUrl.match(/^data:(.+);base64,(.*)$/);
      if (m) {
        const mime = m[1];
        const b64 = m[2];
        const bin = atob(b64);
        const arr = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
        const blob = new Blob([arr], { type: mime });
        await storage.set("image:" + id, blob);
        g.image = URL.createObjectURL(blob);
        imageObjectUrls[id] = g.image;
      }
    } else {
      g.image = "";
    }
    delete (g as { imageDataUrl?: string }).imageDataUrl;
    g.status = g.status || "disponible";
    g.favorite = !!g.favorite;
    g.addedAt = g.addedAt || Date.now();
    const persistMeta: Record<string, unknown> = { ...g };
    delete persistMeta.image;
    await storage.set("garment:" + id, JSON.stringify(persistMeta));
    nextGarments.push(g);
    imported++;
  }

  if (Array.isArray(data.outfits)) {
    for (const o of data.outfits) {
      const id = newId();
      const o2: Outfit = {
        id,
        name: o.name || "Importado",
        garmentIds: (o.garmentIds || []).filter((i: string) =>
          nextGarments.find((g) => g.id === i),
        ),
        createdAt: o.createdAt || Date.now(),
      };
      nextOutfits.push(o2);
      await saveOutfit(o2);
    }
  }

  if (data.log && typeof data.log === "object") {
    nextLog = { ...nextLog, ...data.log };
    await saveLog(nextLog);
  }

  return {
    garments: nextGarments,
    outfits: nextOutfits,
    log: nextLog,
    imported,
    skipped,
  };
}
