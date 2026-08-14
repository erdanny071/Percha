import type { Garment, Outfit, OutfitLog } from "@/types";
import { storage, dataUrlToBlob } from "@/lib/storage";

// Object URLs for garment images, keyed by garment id. Not persisted.
export const imageObjectUrls: Record<string, string> = {};

function isBlob(v: unknown): v is Blob {
  return (
    v instanceof Blob ||
    Object.prototype.toString.call(v) === "[object Blob]"
  );
}

function metaForStorage(g: Garment): string {
  const meta: Record<string, unknown> = { ...g };
  delete meta.image;
  delete meta._pendingDataUrl;
  return JSON.stringify(meta);
}

// ---- garments ----
export async function loadGarments(): Promise<Garment[]> {
  const keys = await storage.list("garment:");
  const out: Garment[] = [];
  for (const k of keys) {
    try {
      const raw = await storage.get<string | Garment>(k);
      if (!raw) continue;
      const meta = typeof raw === "string" ? JSON.parse(raw) : raw;
      const id = meta.id || k.split(":")[1];
      const g: Garment = { ...meta, id };
      const blob = await storage.get<Blob>("image:" + id);
      if (blob && isBlob(blob)) {
        const url = URL.createObjectURL(blob);
        imageObjectUrls[id] = url;
        g.image = url;
      } else {
        g.image = meta.image || "";
      }
      out.push(g);
    } catch {
      /* ignore */
    }
  }
  out.sort((a, b) => (a.addedAt || 0) - (b.addedAt || 0));
  return out;
}

export async function saveGarment(g: Garment): Promise<void> {
  const id = g.id;
  await storage.set("garment:" + id, metaForStorage(g));
  if (g._pendingDataUrl) {
    const blob = dataUrlToBlob(g._pendingDataUrl);
    if (blob) {
      await storage.set("image:" + id, blob);
      if (imageObjectUrls[id]) {
        try {
          URL.revokeObjectURL(imageObjectUrls[id]);
        } catch {
          /* ignore */
        }
        delete imageObjectUrls[id];
      }
      imageObjectUrls[id] = URL.createObjectURL(blob);
      g.image = imageObjectUrls[id];
    }
    delete g._pendingDataUrl;
  }
}

export async function deleteGarmentStorage(id: string): Promise<void> {
  if (imageObjectUrls[id]) {
    try {
      URL.revokeObjectURL(imageObjectUrls[id]);
    } catch {
      /* ignore */
    }
    delete imageObjectUrls[id];
  }
  await storage.delete("garment:" + id);
  await storage.delete("image:" + id);
}

// ---- outfits ----
export async function loadOutfits(): Promise<Outfit[]> {
  const keys = await storage.list("outfit:");
  const out: Outfit[] = [];
  for (const k of keys) {
    try {
      const raw = await storage.get<string | Outfit>(k);
      if (!raw) continue;
      out.push(typeof raw === "string" ? JSON.parse(raw) : raw);
    } catch {
      /* ignore */
    }
  }
  out.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  return out;
}

export async function saveOutfit(o: Outfit): Promise<void> {
  await storage.set("outfit:" + o.id, JSON.stringify(o));
}

export async function deleteOutfitStorage(id: string): Promise<void> {
  await storage.delete("outfit:" + id);
}

// ---- log ----
export async function loadLog(): Promise<OutfitLog> {
  const v = await storage.get<string>("outfit-log");
  if (!v) return {};
  try {
    return JSON.parse(v);
  } catch {
    return {};
  }
}

export async function saveLog(log: OutfitLog): Promise<void> {
  await storage.set("outfit-log", JSON.stringify(log));
}

export function newId(): string {
  return crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now() + Math.random());
}
