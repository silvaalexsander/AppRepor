export type MovementType = 'CREATED' | 'ENTRY' | 'EXIT' | 'ADJUSTMENT';

export type StockStatus = 'OK' | 'LOW' | 'BUY';

export type ItemCategory = 
  | 'Açougue'
  | 'Bebidas'
  | 'Farmácia'
  | 'Higiene'
  | 'Hortifruti'
  | 'Limpeza'
  | 'Mercearia'
  | 'Outros'
  | 'Pets'
  | string;

export type UnitType = 'un' | 'kg' | 'g' | 'l' | 'ml' | 'pct' | 'cx' | string;

export type SortOption = 'alphabetical' | 'price' | 'date';

export interface Item {
  id: string;
  name: string;
  category: ItemCategory;
  unit: UnitType;
  currentQuantity: number;
  minimumQuantity: number;
  lastUnitPrice?: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Movement {
  id: string;
  itemId: string;
  itemName: string;
  type: MovementType;
  quantity: number;
  createdAt: string;
  observation?: string;
}
