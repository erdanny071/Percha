import { dataUrlToBlob, idbSet } from './indexeddb';

const LEGACY_KEYS = (key: string) =>
  key.startsWith('garment:') ||
  key.startsWith('outfit:') ||
  key === 'outfit-log' ||
  key === 'ai-api-key' ||
  key === 'use-ai';

function parseJson<T>(value: string): T | string {
  try {
    return JSON.parse(value) as T;
  } catch {
    return value;
  }
}

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
        const garment = parseJson<{ id?: string; image?: unknown }>(value);
        if (typeof garment === 'string') {
          await idbSet(key, garment);
          continue;
        }

        const id = garment.id || key.split(':')[1];
        if (typeof garment.image === 'string' && garment.image.startsWith('data:')) {
          const blob = dataUrlToBlob(garment.image);
          if (blob) await idbSet(`image:${id}`, blob);
          delete garment.image;
        }
        await idbSet(key, garment);
        continue;
      }

      if (key.startsWith('outfit:') || key === 'outfit-log') {
        await idbSet(key, parseJson(value));
        continue;
      }

      if (key === 'use-ai') {
        await idbSet(key, value === 'true');
        continue;
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
