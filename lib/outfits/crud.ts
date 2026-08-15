import { Outfit } from '@/types/outfit';
import { storage } from '@/lib/storage';

export async function loadOutfits(): Promise<Outfit[]> {
  const keys = await storage.list('outfit:');
  const outfits: Outfit[] = [];
  for (const key of keys) {
    try {
      const raw = await storage.get<string | Outfit>(key);
      if (!raw) continue;
      outfits.push(typeof raw === 'string' ? JSON.parse(raw) as Outfit : raw);
    } catch {
      // Ignore malformed entries.
    }
  }
  outfits.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  return outfits;
}

export async function saveOutfit(outfit: Outfit): Promise<void> {
  await storage.set(`outfit:${outfit.id}`, JSON.stringify(outfit));
}

export async function deleteOutfitStorage(id: string): Promise<void> {
  await storage.delete(`outfit:${id}`);
}
