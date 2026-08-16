export type Garment = {
  id: string;
  name: string;
  type: string;
  size: string;
  category: string;
  occasions: string[];
  color: string;
  season: string;
  image?: string;
  favorite?: boolean;
  createdAt: number;
  wornCount: number;
  lastWorn?: number;
};

export type SavedOutfit = {
  id: string;
  name: string;
  type: string;
  garmentIds: string[];
  favorite?: boolean;
  createdAt: number;
};

export type AppSettings = {
  displayName: string;
  email: string;
  style: string;
  assistantEnabled: boolean;
};

const GARMENTS_KEY = "percha:garments";
const OUTFITS_KEY = "percha:outfits";
const SETTINGS_KEY = "percha:settings";
const HISTORY_KEY = "percha:history";

const fallbackSettings: AppSettings = {
  displayName: "Mi perfil",
  email: "",
  style: "Minimalista",
  assistantEnabled: true,
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable in private/embedded previews.
  }
}

export const wardrobeStore = {
  getGarments: () => read<Garment[]>(GARMENTS_KEY, []),
  saveGarment: (garment: Garment) => {
    const garments = read<Garment[]>(GARMENTS_KEY, []);
    write(GARMENTS_KEY, [garment, ...garments.filter((x) => x.id !== garment.id)]);
  },
  deleteGarment: (id: string) => {
    write(GARMENTS_KEY, read<Garment[]>(GARMENTS_KEY, []).filter((x) => x.id !== id));
  },
  toggleFavorite: (id: string) => {
    const garments = read<Garment[]>(GARMENTS_KEY, []);
    write(GARMENTS_KEY, garments.map((x) => x.id === id ? { ...x, favorite: !x.favorite } : x));
  },
  getOutfits: () => read<SavedOutfit[]>(OUTFITS_KEY, []),
  saveOutfit: (outfit: SavedOutfit) => {
    const outfits = read<SavedOutfit[]>(OUTFITS_KEY, []);
    write(OUTFITS_KEY, [outfit, ...outfits.filter((x) => x.id !== outfit.id)]);
  },
  deleteOutfit: (id: string) => {
    write(OUTFITS_KEY, read<SavedOutfit[]>(OUTFITS_KEY, []).filter((x) => x.id !== id));
  },
  toggleOutfitFavorite: (id: string) => {
    const outfits = read<SavedOutfit[]>(OUTFITS_KEY, []);
    write(OUTFITS_KEY, outfits.map((x) => x.id === id ? { ...x, favorite: !x.favorite } : x));
  },
  getSettings: () => read<AppSettings>(SETTINGS_KEY, fallbackSettings),
  saveSettings: (settings: AppSettings) => write(SETTINGS_KEY, settings),
  getHistory: () => read<string[]>(HISTORY_KEY, []),
  addHistory: (entry: string) => {
    const history = read<string[]>(HISTORY_KEY, []);
    write(HISTORY_KEY, [entry, ...history].slice(0, 100));
  },
  clearAll: () => {
    if (typeof window === "undefined") return;
    [GARMENTS_KEY, OUTFITS_KEY, SETTINGS_KEY, HISTORY_KEY].forEach((key) => window.localStorage.removeItem(key));
  },
};

export function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
