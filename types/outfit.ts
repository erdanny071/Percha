export interface Outfit {
  id: string;
  name: string;
  garmentIds: string[];
  createdAt: number;
  updatedAt?: number;
}

export interface OutfitDraft {
  name: string;
  garmentIds: string[];
}

export interface OutfitCombo {
  top: string;
  bottom: string;
  shoes: string;
  accessory?: string;
  cap?: string;
  score: number;
  reasoning?: string;
}
