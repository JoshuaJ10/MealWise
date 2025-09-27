export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category: GroceryCategory;
  brand?: string;
  isChecked: boolean;
  notes?: string;
}

export type GroceryCategory = 'Produce' | 'Dairy' | 'Frozen' | 'Pantry' | 'Meat' | 'Bakery' | 'Beverages' | 'Snacks' | 'Other';

export interface GroceryListState {
  items: GroceryItem[];
  total: number;
  budget?: number;
  store?: string;
}

export interface ApiProduct {
  id: string;
  name: string;
  brand: string;
  price: number;
  category: string;
  availability: boolean;
  imageUrl?: string;
  description?: string;
}

export interface MealPlan {
  id: string;
  name: string;
  items: GroceryItem[];
  totalCost: number;
  servings: number;
}
