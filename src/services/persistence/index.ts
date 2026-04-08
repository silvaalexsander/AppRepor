import AsyncStorage from '@react-native-async-storage/async-storage';
import { Item, Movement } from '../../types';

const ITEMS_KEY = '@repor_items';
const MOVEMENTS_KEY = '@repor_movements';

export const saveItems = async (items: Item[]) => {
  try {
    await AsyncStorage.setItem(ITEMS_KEY, JSON.stringify(items));
  } catch (e) {
    console.error('Error saving items', e);
  }
};

export const loadItems = async (): Promise<Item[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(ITEMS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error loading items', e);
    return [];
  }
};

export const saveMovements = async (movements: Movement[]) => {
  try {
    await AsyncStorage.setItem(MOVEMENTS_KEY, JSON.stringify(movements));
  } catch (e) {
    console.error('Error saving movements', e);
  }
};

export const loadMovements = async (): Promise<Movement[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(MOVEMENTS_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : [];
  } catch (e) {
    console.error('Error loading movements', e);
    return [];
  }
};
