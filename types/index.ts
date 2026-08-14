export type Category =
  | "top"
  | "bottom"
  | "dress"
  | "outerwear"
  | "shoes"
  | "accessory"
  | "cap";

export type Status = "disponible" | "lavando" | "no_quiero";

export type Occasion =
  | "informal"
  | "salir"
  | "elegante"
  | "noche"
  | "trabajo"
  | "deporte"
  | "evento";

export type ColorBucket =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "grey"
  | "black"
  | "white"
  | "brown";

export interface Garment {
  id: string;
  name: string;
  category: Category;
  occasion: Occasion | string;
  status: Status;
  favorite: boolean;
  addedAt: number;
  colorBucket?: ColorBucket | string;
  noQuieroDate?: string;
  /** Object URL resolved at load time (not persisted). */
  image?: string;
  /** Transient data URL awaiting persistence as a blob. */
  _pendingDataUrl?: string;
}

export interface Outfit {
  id: string;
  name: string;
  garmentIds: string[];
  createdAt: number;
}

export type OutfitLog = Record<string, string[]>;

export interface Combo {
  top: Garment;
  bottom: Garment;
  shoes: Garment;
  accessory: Garment | null;
  cap: Garment | null;
  score: number;
  repeatedDates: string[];
}

export interface Draft {
  top: Garment | null;
  bottom: Garment | null;
  shoes: Garment | null;
  accessory: Garment | null;
  cap: Garment | null;
}

export interface GenerateResult {
  error?: string[];
  combos?: Combo[];
  tops?: Garment[];
  bottoms?: Garment[];
  shoes?: Garment[];
  accessories?: Garment[];
  caps?: Garment[];
}
