export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  category: GroceryCategory;
  isChecked: boolean;
}

export type GroceryCategory = 
  | 'Meat'
  | 'Vegetables'
  | 'Fruits'
  | 'Dairy'
  | 'Pantry'
  | 'Bakery'
  | 'Frozen'
  | 'Beverages'
  | 'Snacks'
  | 'Other';
