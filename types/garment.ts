export type Category = 'top' | 'bottom' | 'dress' | 'outerwear' | 'shoes' | 'accessory' | 'cap';
export type Occasion = 'informal' | 'salir' | 'noche' | 'trabajo' | 'deporte' | 'evento' | 'elegante';
export type Status = 'disponible' | 'lavando' | 'no_quiero';
export type ColorBucket = 'red' | 'orange' | 'yellow' | 'green' | 'blue' | 'purple' | 'pink' | 'grey' | 'black' | 'white' | 'brown';

export interface Garment {
  id: string;
  name: string;
  category: Category;
  occasion: Occasion;
  status: Status;
  favorite: boolean;
  addedAt: number;
  colorBucket?: ColorBucket;
  noQuieroDate?: string;
  image?: string;
  _pendingDataUrl?: string;
}
