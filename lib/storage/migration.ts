import { dataUrlToBlob, idbSet } from './indexeddb';

const LEGACY_KEYS = (key: string) =>
  key.startsWith('garment:') ||
  key.startsWith('outfit:') ||
  key === 'outfit-log' ||
  key === 'ai-api-key' ||
  key === 'use-ai';

export async function migrateLocalStorageToIndexedDB(): Promise<void> {
  if (typeof localStorage === 'undefined') return;

  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i);
    if (key && LEGACY_KEYS(key)) keys.push(key);
  }

  if (keys.length === 0) return;

  for (const key of keys) {
    const value = localStorage.getItem(key);
    if (value === null) continue;

    try {
      if (key.startsWith('garment:')) {
        const garment = JSON.parse(value) as { id?: string; image?: unknown };
        const id = garment.id || key.split(':')[1];

        if (typeof garment.image === 'string' && garment.image.startsWith('data:')) {
          const blob = dataUrlToBlob(garment.image);
          if (blob) await idbSet(`image:${id}`, blob);
          delete garment.image;
          await idbSet(key, JSON.stringify(garment));
          continue;
        }
      }

      await idbSet(key, value);
    } catch {
      // Preserve the original best-effort migration behaviour.
      try {
        await idbSet(key, value);
      } catch {
        // Ignore an individual broken legacy entry and continue migrating.
      }
    }
  }
}
