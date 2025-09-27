import { create } from 'zustand';
import { GroceryItem, GroceryListState, GroceryCategory } from '@/types/grocery';

interface GroceryStore extends GroceryListState {
  // Actions
  addItem: (item: Omit<GroceryItem, 'id'>) => void;
  updateItem: (id: string, updates: Partial<GroceryItem>) => void;
  removeItem: (id: string) => void;
  toggleItem: (id: string) => void;
  clearList: () => void;
  setBudget: (budget: number) => void;
  setStore: (store: string) => void;
  addItemsFromApi: (items: Omit<GroceryItem, 'id'>[]) => void;
  replaceList: (items: Omit<GroceryItem, 'id'>[]) => void;
  
  // Computed values
  getItemsByCategory: (category: GroceryCategory) => GroceryItem[];
  getTotal: () => number;
  getCheckedItems: () => GroceryItem[];
  getUncheckedItems: () => GroceryItem[];
}

const generateId = () => Math.random().toString(36).substr(2, 9);

export const useGroceryStore = create<GroceryStore>((set, get) => ({
  items: [],
  total: 0,
  budget: undefined,
  store: undefined,

  addItem: (item) => {
    const newItem: GroceryItem = {
      ...item,
      id: generateId(),
    };
    
    set((state) => ({
      items: [...state.items, newItem],
      total: state.total + (newItem.price * newItem.quantity),
    }));
  },

  updateItem: (id, updates) => {
    set((state) => {
      const itemIndex = state.items.findIndex(item => item.id === id);
      if (itemIndex === -1) return state;
      
      const oldItem = state.items[itemIndex];
      const newItem = { ...oldItem, ...updates };
      const newItems = [...state.items];
      newItems[itemIndex] = newItem;
      
      const oldTotal = oldItem.price * oldItem.quantity;
      const newTotal = newItem.price * newItem.quantity;
      const totalChange = newTotal - oldTotal;
      
      return {
        items: newItems,
        total: state.total + totalChange,
      };
    });
  },

  removeItem: (id) => {
    set((state) => {
      const item = state.items.find(item => item.id === id);
      if (!item) return state;
      
      return {
        items: state.items.filter(item => item.id !== id),
        total: state.total - (item.price * item.quantity),
      };
    });
  },

  toggleItem: (id) => {
    set((state) => ({
      items: state.items.map(item =>
        item.id === id ? { ...item, isChecked: !item.isChecked } : item
      ),
    }));
  },

  clearList: () => {
    set({ items: [], total: 0 });
  },

  setBudget: (budget) => {
    set({ budget });
  },

  setStore: (store) => {
    set({ store });
  },

  addItemsFromApi: (items) => {
    const newItems: GroceryItem[] = items.map(item => ({
      ...item,
      id: generateId(),
    }));
    
    const totalCost = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    set((state) => ({
      items: [...state.items, ...newItems],
      total: state.total + totalCost,
    }));
  },

  replaceList: (items) => {
    const newItems: GroceryItem[] = items.map(item => ({
      ...item,
      id: generateId(),
    }));
    
    const totalCost = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    set({
      items: newItems,
      total: totalCost,
    });
  },

  getItemsByCategory: (category) => {
    return get().items.filter(item => item.category === category);
  },

  getTotal: () => {
    return get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  getCheckedItems: () => {
    return get().items.filter(item => item.isChecked);
  },

  getUncheckedItems: () => {
    return get().items.filter(item => !item.isChecked);
  },
}));
