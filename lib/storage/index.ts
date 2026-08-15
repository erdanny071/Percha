import { idbDelete, idbGet, idbList, idbSet, openDB, IdbRow } from './indexeddb';
import { migrateLocalStorageToIndexedDB } from './migration';

let initialized = false;
let initialization: Promise<void> | null = null;

export const storage = {
  async init(): Promise<void> {
    if (initialized) return;
    if (!initialization) {
      initialization = (async () => {
        await openDB();
        await migrateLocalStorageToIndexedDB();
        initialized = true;
      })();
    }
    await initialization;
  },

  async get<T = unknown>(key: string): Promise<T | null> {
    return idbGet<T>(key);
  },

  async set<T = unknown>(key: string, value: T): Promise<boolean> {
    return idbSet(key, value);
  },

  async delete(key: string): Promise<boolean> {
    return idbDelete(key);
  },

  async list<T = unknown>(prefix: string): Promise<IdbRow<T>[]> {
    return idbList<T>(prefix);
  },
};

export { idbDelete, idbGet, idbList, idbSet, openDB } from './indexeddb';
export type { IdbRow } from './indexeddb';
