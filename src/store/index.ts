import { create } from 'zustand';
import { Item, Movement } from '../types';
import { loadItems, loadMovements, saveItems, saveMovements } from '../services/persistence';
import { generateId } from '../utils';

interface AppState {
  items: Item[];
  movements: Movement[];
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  createItem: (item: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateItem: (id: string, item: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  increaseItem: (id: string, amount: number) => void;
  decreaseItem: (id: string, amount: number) => void;
  getItemById: (id: string) => Item | undefined;
}

export const useStore = create<AppState>((set, get) => ({
  items: [],
  movements: [],
  isHydrated: false,

  hydrate: async () => {
    const items = await loadItems();
    const movements = await loadMovements();
    set({ items, movements, isHydrated: true });
  },

  createItem: (itemData) => {
    const now = new Date().toISOString();
    const newItem: Item = {
      ...itemData,
      id: generateId(),
      createdAt: now,
      updatedAt: now,
    };
    
    const newMovement: Movement = {
      id: generateId(),
      itemId: newItem.id,
      itemName: newItem.name,
      type: 'CREATED',
      quantity: newItem.currentQuantity,
      createdAt: now,
      observation: 'Item criado',
    };

    set((state) => {
      const newItems = [...state.items, newItem];
      const newMovements = [newMovement, ...state.movements];
      saveItems(newItems);
      saveMovements(newMovements);
      return { items: newItems, movements: newMovements };
    });
  },

  updateItem: (id, itemData) => {
    const now = new Date().toISOString();
    set((state) => {
      const newItems = state.items.map(item => 
        item.id === id ? { ...item, ...itemData, updatedAt: now } : item
      );
      saveItems(newItems);
      return { items: newItems };
    });
  },

  deleteItem: (id) => {
    set((state) => {
      const newItems = state.items.filter(item => item.id !== id);
      // Not deleting movements to keep history, or optional implementation
      saveItems(newItems);
      return { items: newItems };
    });
  },

  increaseItem: (id, amount) => {
    const now = new Date().toISOString();
    set((state) => {
      const itemToUpdate = state.items.find(item => item.id === id);
      if (!itemToUpdate) return state;

      const newQuantity = itemToUpdate.currentQuantity + amount;
      const updatedItem = { ...itemToUpdate, currentQuantity: newQuantity, updatedAt: now };

      const newMovement: Movement = {
        id: generateId(),
        itemId: updatedItem.id,
        itemName: updatedItem.name,
        type: 'ENTRY',
        quantity: amount,
        createdAt: now,
      };

      const newItems = state.items.map(i => i.id === id ? updatedItem : i);
      const newMovements = [newMovement, ...state.movements];
      
      saveItems(newItems);
      saveMovements(newMovements);

      return { items: newItems, movements: newMovements };
    });
  },

  decreaseItem: (id, amount) => {
    const now = new Date().toISOString();
    set((state) => {
      const itemToUpdate = state.items.find(item => item.id === id);
      if (!itemToUpdate) return state;

      const newQuantity = Math.max(0, itemToUpdate.currentQuantity - amount);
      const actualAmountSubtracted = itemToUpdate.currentQuantity - newQuantity;
      
      const updatedItem = { ...itemToUpdate, currentQuantity: newQuantity, updatedAt: now };

      const newMovement: Movement = {
        id: generateId(),
        itemId: updatedItem.id,
        itemName: updatedItem.name,
        type: 'EXIT',
        quantity: actualAmountSubtracted,
        createdAt: now,
      };

      const newItems = state.items.map(i => i.id === id ? updatedItem : i);
      const newMovements = [newMovement, ...state.movements];
      
      saveItems(newItems);
      saveMovements(newMovements);

      return { items: newItems, movements: newMovements };
    });
  },

  getItemById: (id) => {
    return get().items.find(item => item.id === id);
  }
}));
