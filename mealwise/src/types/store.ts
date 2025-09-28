export interface Store {
  id: string;
  name: string;
  chain: 'kroger' | 'walmart';
  address: string;
  distance: number; // in miles
  latitude: number;
  longitude: number;
}

export interface Ingredient {
  name: string;
  quantity?: string;
  unit?: string;
}

export interface StorePrice {
  storeId: string;
  storeName: string;
  chain: 'kroger' | 'walmart';
  ingredient: string;
  price: number; // Total price for the quantity
  unitPrice: number; // Price per unit
  unit: string;
  quantity: number; // Quantity requested
  availability: boolean;
  lastUpdated: Date;
}

export interface StoreSearchResult {
  stores: Store[];
  prices: StorePrice[];
  totalEstimatedCost: number;
}
