import { create } from 'zustand';
import type { Garment, Status } from '@/types/garment';
import type { Outfit } from '@/types/outfit';
import type { LogMap } from '@/types/log';
import type { Settings } from '@/types/settings';
import { storage } from '@/lib/storage';
import { loadGarments, saveGarment, deleteGarmentStorage } from '@/lib/garments/crud';
import { loadOutfits, saveOutfit, deleteOutfitStorage } from '@/lib/outfits/crud';
import { loadLog, saveLog, todayStr } from '@/lib/history/log';

const STATUS_ORDER: Status[] = ['disponible', 'lavando', 'no_quiero'];

interface PerchaState {
  garments: Garment[];
  outfits: Outfit[];
  log: LogMap;
  settings: Settings;
  initialized: boolean;
  init: () => Promise<void>;
  addGarment: (garment: Garment) => Promise<void>;
  updateGarment: (id: string, patch: Partial<Garment>) => Promise<void>;
  deleteGarment: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  cycleStatus: (id: string) => Promise<void>;
  bulkSetStatus: (ids: string[], status: Status) => Promise<void>;
  bulkDelete: (ids: string[]) => Promise<void>;
  addOutfit: (outfit: Outfit) => Promise<void>;
  updateOutfit: (id: string, patch: Partial<Outfit>) => Promise<void>;
  deleteOutfit: (id: string) => Promise<void>;
  applyOutfit: (ids: string[]) => Promise<void>;
  undoLogDay: (date: string) => Promise<void>;
  updateSettings: (patch: Partial<Settings>) => Promise<void>;
}

export const usePerchaStore = create<PerchaState>((set, get) => ({
  garments: [],
  outfits: [],
  log: {},
  settings: { useAi: false, aiApiKey: null },
  initialized: false,

  async init() {
    if (get().initialized) return;
    await storage.init();
    const [garments, outfits, log] = await Promise.all([loadGarments(), loadOutfits(), loadLog()]);
    const today = todayStr();
    const normalized = garments.map((garment) =>
      garment.status === 'no_quiero' && garment.noQuieroDate && garment.noQuieroDate !== today
        ? { ...garment, status: 'disponible' as const, noQuieroDate: undefined }
        : garment,
    );
    for (const garment of normalized) {
      if (garment !== garments.find((g) => g.id === garment.id)) await saveGarment(garment);
    }
    const useAi = await storage.get<boolean | string>('use-ai');
    const aiApiKey = await storage.get<string>('ai-api-key');
    set({ garments: normalized, outfits, log, settings: { useAi: useAi === true || useAi === 'true', aiApiKey: aiApiKey ?? null }, initialized: true });
  },

  async addGarment(garment) {
    await saveGarment(garment);
    set((state) => ({ garments: [...state.garments.filter((g) => g.id !== garment.id), garment] }));
  },

  async updateGarment(id, patch) {
    const current = get().garments.find((g) => g.id === id);
    if (!current) return;
    const updated = { ...current, ...patch };
    await saveGarment(updated);
    set((state) => ({ garments: state.garments.map((g) => (g.id === id ? updated : g)) }));
  },

  async deleteGarment(id) {
    await deleteGarmentStorage(id);
    const affected = get().outfits.filter((outfit) => outfit.garmentIds.includes(id));
    for (const outfit of affected) {
      const garmentIds = outfit.garmentIds.filter((garmentId) => garmentId !== id);
      if (garmentIds.length === 0) await deleteOutfitStorage(outfit.id);
      else await saveOutfit({ ...outfit, garmentIds, updatedAt: Date.now() });
    }
    set((state) => ({
      garments: state.garments.filter((g) => g.id !== id),
      outfits: state.outfits
        .map((o) => ({ ...o, garmentIds: o.garmentIds.filter((gid) => gid !== id) }))
        .filter((o) => o.garmentIds.length > 0),
    }));
  },

  async toggleFavorite(id) {
    const garment = get().garments.find((g) => g.id === id);
    if (garment) await get().updateGarment(id, { favorite: !garment.favorite });
  },

  async cycleStatus(id) {
    const garment = get().garments.find((g) => g.id === id);
    if (!garment) return;
    const next = STATUS_ORDER[(STATUS_ORDER.indexOf(garment.status) + 1) % STATUS_ORDER.length];
    await get().updateGarment(id, { status: next, noQuieroDate: next === 'no_quiero' ? todayStr() : undefined });
  },

  async bulkSetStatus(ids, status) {
    for (const id of ids) await get().updateGarment(id, { status, noQuieroDate: status === 'no_quiero' ? todayStr() : undefined });
  },

  async bulkDelete(ids) {
    for (const id of ids) await get().deleteGarment(id);
  },

  async addOutfit(outfit) {
    await saveOutfit(outfit);
    set((state) => ({ outfits: [...state.outfits.filter((o) => o.id !== outfit.id), outfit] }));
  },

  async updateOutfit(id, patch) {
    const current = get().outfits.find((o) => o.id === id);
    if (!current) return;
    const updated = { ...current, ...patch, updatedAt: Date.now() };
    await saveOutfit(updated);
    set((state) => ({ outfits: state.outfits.map((o) => (o.id === id ? updated : o)) }));
  },

  async deleteOutfit(id) {
    await deleteOutfitStorage(id);
    set((state) => ({ outfits: state.outfits.filter((o) => o.id !== id) }));
  },

  async applyOutfit(ids) {
    const date = todayStr();
    const nextLog = { ...get().log, [date]: Array.from(new Set([...(get().log[date] ?? []), ...ids])) };
    await saveLog(nextLog);
    set({ log: nextLog });
  },

  async undoLogDay(date) {
    const nextLog = { ...get().log };
    delete nextLog[date];
    await saveLog(nextLog);
    set({ log: nextLog });
  },

  async updateSettings(patch) {
    const settings = { ...get().settings, ...patch };
    if (settings.useAi) await storage.set('use-ai', 'true'); else await storage.set('use-ai', 'false');
    if (settings.aiApiKey) await storage.set('ai-api-key', settings.aiApiKey); else await storage.delete('ai-api-key');
    set({ settings });
  },
}));
