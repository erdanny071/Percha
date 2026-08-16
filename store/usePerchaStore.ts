'use client';
import { useCallback, useState } from 'react';
import type { Garment, Status } from '@/types/garment';
import type { Outfit } from '@/types/index';

type LogMap = Record<string, string[]>;

interface PerchaState {
  garments: Garment[];
  outfits: Outfit[];
  log: LogMap;
  initialized: boolean;
  init: () => Promise<void>;
  addGarment: (g: Garment) => Promise<void>;
  updateGarment: (id: string, p: Partial<Garment>) => Promise<void>;
  deleteGarment: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  cycleStatus: (id: string) => Promise<void>;
  addOutfit: (o: Outfit) => Promise<void>;
  updateOutfit: (id: string, p: Partial<Outfit>) => Promise<void>;
  deleteOutfit: (id: string) => Promise<void>;
  applyOutfit: (ids: string[]) => Promise<void>;
}

const GK = 'percha-garments-v1';
const OK = 'percha-outfits-v1';
const LK = 'percha-log-v1';
const statuses: Status[] = ['disponible', 'lavando', 'no_quiero'];

function read<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const value = localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

export function usePerchaStore(): PerchaState {
  const [garments, setGarments] = useState<Garment[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [log, setLog] = useState<LogMap>({});
  const [initialized, setInitialized] = useState(false);

  const init = useCallback(async () => {
    setGarments(read<Garment[]>(GK, []));
    setOutfits(read<Outfit[]>(OK, []));
    setLog(read<LogMap>(LK, {}));
    setInitialized(true);
  }, []);

  const addGarment = useCallback(async (garment: Garment) => {
    setGarments(current => {
      const next = [...current.filter(g => g.id !== garment.id), garment];
      write(GK, next);
      return next;
    });
  }, []);

  const updateGarment = useCallback(async (id: string, patch: Partial<Garment>) => {
    setGarments(current => {
      const next = current.map(g => g.id === id ? { ...g, ...patch } : g);
      write(GK, next);
      return next;
    });
  }, []);

  const deleteGarment = useCallback(async (id: string) => {
    setGarments(current => {
      const next = current.filter(g => g.id !== id);
      write(GK, next);
      return next;
    });
    setOutfits(current => {
      const next = current.map(o => ({ ...o, garmentIds: o.garmentIds.filter(gid => gid !== id) }));
      write(OK, next);
      return next;
    });
  }, []);

  const toggleFavorite = useCallback(async (id: string) => {
    setGarments(current => {
      const next = current.map(g => g.id === id ? { ...g, favorite: !g.favorite } : g);
      write(GK, next);
      return next;
    });
  }, []);

  const cycleStatus = useCallback(async (id: string) => {
    setGarments(current => {
      const garment = current.find(g => g.id === id);
      if (!garment) return current;
      const index = statuses.indexOf(garment.status);
      const status = statuses[(index + 1) % statuses.length];
      const next = current.map(g => g.id === id ? {
        ...g,
        status,
        noQuieroDate: status === 'no_quiero' ? new Date().toISOString().slice(0, 10) : undefined,
      } : g);
      write(GK, next);
      return next;
    });
  }, []);

  const addOutfit = useCallback(async (outfit: Outfit) => {
    setOutfits(current => {
      const next = [...current.filter(o => o.id !== outfit.id), outfit];
      write(OK, next);
      return next;
    });
  }, []);

  const updateOutfit = useCallback(async (id: string, patch: Partial<Outfit>) => {
    setOutfits(current => {
      const next = current.map(o => o.id === id ? { ...o, ...patch } : o);
      write(OK, next);
      return next;
    });
  }, []);

  const deleteOutfit = useCallback(async (id: string) => {
    setOutfits(current => {
      const next = current.filter(o => o.id !== id);
      write(OK, next);
      return next;
    });
  }, []);

  const applyOutfit = useCallback(async (ids: string[]) => {
    const date = new Date().toISOString().slice(0, 10);
    setLog(current => {
      const next = { ...current, [date]: Array.from(new Set([...(current[date] ?? []), ...ids])) };
      write(LK, next);
      return next;
    });
  }, []);

  return {
    garments,
    outfits,
    log,
    initialized,
    init,
    addGarment,
    updateGarment,
    deleteGarment,
    toggleFavorite,
    cycleStatus,
    addOutfit,
    updateOutfit,
    deleteOutfit,
    applyOutfit,
  };
}
