// IndexedDB KV store (with legacy localStorage migration).
// Images are saved as Blobs under image:{id}; metadata as JSON strings under garment:{id}.

const DB_NAME = "percha-db";
const DB_VERSION = 1;
const STORE = "kv";

let dbP: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbP) return dbP;
  dbP = new Promise((res, rej) => {
    const rq = indexedDB.open(DB_NAME, DB_VERSION);
    rq.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE))
        db.createObjectStore(STORE, { keyPath: "key" });
    };
    rq.onsuccess = () => res(rq.result);
    rq.onerror = () => rej(rq.error);
  });
  return dbP;
}

async function idbGet<T = unknown>(k: string): Promise<T | null> {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, "readonly");
    const s = tx.objectStore(STORE);
    const r = s.get(k);
    r.onsuccess = () => res(r.result ? r.result.value : null);
    r.onerror = () => rej(r.error);
  });
}

async function idbSet(k: string, v: unknown): Promise<boolean> {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, "readwrite");
    const s = tx.objectStore(STORE);
    const r = s.put({ key: k, value: v });
    r.onsuccess = () => res(true);
    r.onerror = () => rej(r.error);
  });
}

async function idbDelete(k: string): Promise<boolean> {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, "readwrite");
    const s = tx.objectStore(STORE);
    const r = s.delete(k);
    r.onsuccess = () => res(true);
    r.onerror = () => rej(r.error);
  });
}

async function idbList(prefix: string): Promise<string[]> {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction(STORE, "readonly");
    const s = tx.objectStore(STORE);
    const out: string[] = [];
    const rq = s.openCursor();
    rq.onsuccess = (e) => {
      const cur = (e.target as IDBRequest<IDBCursorWithValue>).result;
      if (!cur) {
        res(out);
        return;
      }
      if (typeof cur.key === "string" && (cur.key as string).indexOf(prefix) === 0)
        out.push(cur.key as string);
      cur.continue();
    };
    rq.onerror = () => rej(rq.error);
  });
}

export function dataUrlToBlob(d: string): Blob | null {
  const m = d.match(/^data:(.+);base64,(.*)$/);
  if (!m) return null;
  const mime = m[1];
  const b64 = m[2];
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

async function migrateLocalStorageToIndexedDB(): Promise<void> {
  try {
    if (typeof localStorage === "undefined") return;
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (
        k &&
        (k.indexOf("garment:") === 0 ||
          k.indexOf("outfit:") === 0 ||
          k === "outfit-log" ||
          k === "ai-api-key" ||
          k === "use-ai")
      )
        keys.push(k);
    }
    if (keys.length === 0) return;
    for (const k of keys) {
      const v = localStorage.getItem(k);
      if (v === null) continue;
      try {
        if (k.indexOf("garment:") === 0) {
          const obj = JSON.parse(v);
          const id = obj.id || k.split(":")[1];
          if (
            obj.image &&
            typeof obj.image === "string" &&
            obj.image.indexOf("data:") === 0
          ) {
            const blob = dataUrlToBlob(obj.image);
            if (blob) await idbSet("image:" + id, blob);
            delete obj.image;
            await idbSet(k, JSON.stringify(obj));
            continue;
          }
        }
        await idbSet(k, v);
      } catch {
        try {
          await idbSet(k, v);
        } catch {
          /* ignore */
        }
      }
    }
  } catch (e) {
    console.warn("migration err", e);
  }
}

export const storage = {
  get: async <T = unknown>(k: string): Promise<T | null> => {
    try {
      return await idbGet<T>(k);
    } catch {
      return null;
    }
  },
  set: async (k: string, v: unknown): Promise<void> => {
    try {
      await idbSet(k, v);
    } catch {
      /* ignore */
    }
  },
  delete: async (k: string): Promise<void> => {
    try {
      await idbDelete(k);
    } catch {
      /* ignore */
    }
  },
  list: async (p: string): Promise<string[]> => {
    try {
      return await idbList(p);
    } catch {
      return [];
    }
  },
  _init: async (): Promise<void> => {
    await openDB();
    await migrateLocalStorageToIndexedDB();
  },
};
