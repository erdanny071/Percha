import { Garment } from '@/types/garment';
import { storage } from '@/lib/storage';
import { setImageObjectUrl, revokeImageObjectUrl } from './image';

export async function loadGarments(): Promise<Garment[]> {
  const keys = await storage.list('garment:');
  const garments: Garment[] = [];
  for (const key of keys) {
    try {
      const raw = await storage.get<string | Garment>(key);
      if (!raw) continue;
      const meta = typeof raw === 'string' ? JSON.parse(raw) as Garment : raw;
      const id = meta.id || key.split(':')[1];
      const garment: Garment = { ...meta, id, image: undefined };
      const blob = await storage.get<Blob>(`image:${id}`);
      if (blob instanceof Blob) garment.image = setImageObjectUrl(id, blob);
      else if (meta.image) garment.image = meta.image;
      garments.push(garment);
    } catch {
      // Ignore malformed legacy entries, matching the original app's behavior.
    }
  }
  garments.sort((a, b) => (a.addedAt || 0) - (b.addedAt || 0));
  return garments;
}

export async function saveGarment(garment: Garment): Promise<void> {
  const meta = { ...garment } as Garment & { _pendingDataUrl?: string };
  const pendingDataUrl = meta._pendingDataUrl;
  delete meta.image;
  delete meta._pendingDataUrl;
  await storage.set(`garment:${garment.id}`, JSON.stringify(meta));

  if (pendingDataUrl) {
    const { dataUrlToBlob } = await import('./image');
    const blob = dataUrlToBlob(pendingDataUrl);
    if (blob) {
      await storage.set(`image:${garment.id}`, blob);
      setImageObjectUrl(garment.id, blob);
    }
  }
}

export async function deleteGarmentStorage(id: string): Promise<void> {
  revokeImageObjectUrl(id);
  await storage.delete(`garment:${id}`);
  await storage.delete(`image:${id}`);
}
