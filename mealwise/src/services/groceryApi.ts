import { ApiProduct, GroceryItem, GroceryCategory } from '@/types/grocery';

// Mock API responses for demonstration
// In a real app, these would be actual API calls to Walmart/Kroger

const MOCK_PRODUCTS: ApiProduct[] = [
  // Produce
  { id: '1', name: 'Organic Bananas', brand: 'Fresh Farms', price: 1.99, category: 'Produce', availability: true, imageUrl: '/api/placeholder/100/100' },
  { id: '2', name: 'Red Apples', brand: 'Gala', price: 2.49, category: 'Produce', availability: true, imageUrl: '/api/placeholder/100/100' },
  { id: '3', name: 'Spinach', brand: 'Fresh Leaf', price: 2.99, category: 'Produce', availability: true, imageUrl: '/api/placeholder/100/100' },
  { id: '4', name: 'Carrots', brand: 'Garden Fresh', price: 1.49, category: 'Produce', availability: true, imageUrl: '/api/placeholder/100/100' },
  
  // Dairy
  { id: '5', name: 'Whole Milk', brand: 'Organic Valley', price: 4.99, category: 'Dairy', availability: true, imageUrl: '/api/placeholder/100/100' },
  { id: '6', name: 'Greek Yogurt', brand: 'Chobani', price: 3.49, category: 'Dairy', availability: true, imageUrl: '/api/placeholder/100/100' },
  { id: '7', name: 'Cheddar Cheese', brand: 'Kraft', price: 3.99, category: 'Dairy', availability: true, imageUrl: '/api/placeholder/100/100' },
  { id: '8', name: 'Butter', brand: 'Land O Lakes', price: 2.99, category: 'Dairy', availability: true, imageUrl: '/api/placeholder/100/100' },
  
  // Frozen
  { id: '9', name: 'Frozen Broccoli', brand: 'Birds Eye', price: 2.49, category: 'Frozen', availability: true, imageUrl: '/api/placeholder/100/100' },
  { id: '10', name: 'Frozen Pizza', brand: 'DiGiorno', price: 6.99, category: 'Frozen', availability: true, imageUrl: '/api/placeholder/100/100' },
  { id: '11', name: 'Ice Cream', brand: 'Ben & Jerry\'s', price: 4.99, category: 'Frozen', availability: true, imageUrl: '/api/placeholder/100/100' },
  
  // Pantry
  { id: '12', name: 'Rice', brand: 'Uncle Ben\'s', price: 2.99, category: 'Pantry', availability: true, imageUrl: '/api/placeholder/100/100' },
  { id: '13', name: 'Pasta', brand: 'Barilla', price: 1.99, category: 'Pantry', availability: true, imageUrl: '/api/placeholder/100/100' },
  { id: '14', name: 'Olive Oil', brand: 'Bertolli', price: 7.99, category: 'Pantry', availability: true, imageUrl: '/api/placeholder/100/100' },
  { id: '15', name: 'Canned Tomatoes', brand: 'Hunt\'s', price: 1.49, category: 'Pantry', availability: true, imageUrl: '/api/placeholder/100/100' },
  
  // Meat
  { id: '16', name: 'Chicken Breast', brand: 'Tyson', price: 8.99, category: 'Meat', availability: true, imageUrl: '/api/placeholder/100/100' },
  { id: '17', name: 'Ground Beef', brand: 'Angus', price: 6.99, category: 'Meat', availability: true, imageUrl: '/api/placeholder/100/100' },
  { id: '18', name: 'Salmon Fillet', brand: 'Fresh Catch', price: 12.99, category: 'Meat', availability: true, imageUrl: '/api/placeholder/100/100' },
  
  // Bakery
  { id: '19', name: 'Whole Wheat Bread', brand: 'Wonder', price: 2.99, category: 'Bakery', availability: true, imageUrl: '/api/placeholder/100/100' },
  { id: '20', name: 'Bagels', brand: 'Thomas', price: 3.49, category: 'Bakery', availability: true, imageUrl: '/api/placeholder/100/100' },
  
  // Beverages
  { id: '21', name: 'Orange Juice', brand: 'Tropicana', price: 3.99, category: 'Beverages', availability: true, imageUrl: '/api/placeholder/100/100' },
  { id: '22', name: 'Coffee', brand: 'Folgers', price: 5.99, category: 'Beverages', availability: true, imageUrl: '/api/placeholder/100/100' },
  
  // Snacks
  { id: '23', name: 'Chips', brand: 'Lays', price: 2.99, category: 'Snacks', availability: true, imageUrl: '/api/placeholder/100/100' },
  { id: '24', name: 'Granola Bars', brand: 'Nature Valley', price: 4.99, category: 'Snacks', availability: true, imageUrl: '/api/placeholder/100/100' },
];

export interface SearchFilters {
  maxPrice?: number;
  category?: GroceryCategory;
  brand?: string;
  inStock?: boolean;
}

export interface MealPlanRequest {
  budget: number;
  servings: number;
  dietaryRestrictions?: string[];
  preferences?: string[];
}

export class GroceryApiService {
  private static instance: GroceryApiService;
  
  public static getInstance(): GroceryApiService {
    if (!GroceryApiService.instance) {
      GroceryApiService.instance = new GroceryApiService();
    }
    return GroceryApiService.instance;
  }

  /**
   * Search for products by name
   */
  async searchProducts(query: string, filters?: SearchFilters): Promise<ApiProduct[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let results = MOCK_PRODUCTS.filter(product => 
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.brand.toLowerCase().includes(query.toLowerCase())
    );

    if (filters) {
      if (filters.maxPrice) {
        results = results.filter(product => product.price <= filters.maxPrice!);
      }
      if (filters.category) {
        results = results.filter(product => product.category === filters.category);
      }
      if (filters.brand) {
        results = results.filter(product => 
          product.brand.toLowerCase().includes(filters.brand!.toLowerCase())
        );
      }
      if (filters.inStock !== undefined) {
        results = results.filter(product => product.availability === filters.inStock);
      }
    }

    // Sort by price (cheapest first)
    return results.sort((a, b) => a.price - b.price);
  }

  /**
   * Get products by category
   */
  async getProductsByCategory(category: GroceryCategory): Promise<ApiProduct[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_PRODUCTS.filter(product => product.category === category);
  }

  /**
   * Get product recommendations based on meal plan
   */
  async getMealPlanProducts(request: MealPlanRequest): Promise<ApiProduct[]> {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simple meal planning logic
    const products: ApiProduct[] = [];
    const budgetPerServing = request.budget / request.servings;
    
    // Add basic staples
    const staples = MOCK_PRODUCTS.filter(p => 
      ['Rice', 'Pasta', 'Bread', 'Milk', 'Eggs'].some(staple => 
        p.name.toLowerCase().includes(staple.toLowerCase())
      )
    );
    
    products.push(...staples.slice(0, 3));
    
    // Add proteins
    const proteins = MOCK_PRODUCTS.filter(p => p.category === 'Meat' || p.category === 'Dairy');
    products.push(...proteins.slice(0, 2));
    
    // Add vegetables
    const vegetables = MOCK_PRODUCTS.filter(p => p.category === 'Produce');
    products.push(...vegetables.slice(0, 3));
    
    return products.slice(0, 8); // Limit to 8 items for a meal plan
  }

  /**
   * Convert API products to grocery items
   */
  convertToGroceryItems(products: ApiProduct[], quantities: number[] = []): Omit<GroceryItem, 'id'>[] {
    return products.map((product, index) => ({
      name: product.name,
      quantity: quantities[index] || 1,
      price: product.price,
      category: product.category as GroceryCategory,
      brand: product.brand,
      isChecked: false,
      notes: product.description,
    }));
  }

  /**
   * Get budget-friendly alternatives for expensive items
   */
  async getBudgetAlternatives(itemName: string, maxPrice: number): Promise<ApiProduct[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const alternatives = MOCK_PRODUCTS.filter(product => 
      product.price <= maxPrice &&
      (product.name.toLowerCase().includes(itemName.toLowerCase()) ||
       product.category === this.getCategoryForItem(itemName))
    );
    
    return alternatives.sort((a, b) => a.price - b.price);
  }

  /**
   * Get category suggestions for a given item
   */
  private getCategoryForItem(itemName: string): GroceryCategory {
    const name = itemName.toLowerCase();
    
    if (name.includes('milk') || name.includes('cheese') || name.includes('yogurt')) {
      return 'Dairy';
    }
    if (name.includes('chicken') || name.includes('beef') || name.includes('fish')) {
      return 'Meat';
    }
    if (name.includes('apple') || name.includes('banana') || name.includes('vegetable')) {
      return 'Produce';
    }
    if (name.includes('bread') || name.includes('bagel')) {
      return 'Bakery';
    }
    
    return 'Other';
  }

  /**
   * Get store availability for products
   */
  async checkAvailability(productIds: string[]): Promise<Record<string, boolean>> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const availability: Record<string, boolean> = {};
    productIds.forEach(id => {
      const product = MOCK_PRODUCTS.find(p => p.id === id);
      availability[id] = product?.availability || false;
    });
    
    return availability;
  }

  /**
   * Get price comparison between stores
   */
  async getPriceComparison(productName: string): Promise<{ store: string; price: number }[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const product = MOCK_PRODUCTS.find(p => 
      p.name.toLowerCase().includes(productName.toLowerCase())
    );
    
    if (!product) return [];
    
    // Simulate different store prices
    return [
      { store: 'Walmart', price: product.price },
      { store: 'Kroger', price: product.price * 1.1 },
      { store: 'Target', price: product.price * 0.95 },
    ];
  }
}

// Export singleton instance
export const groceryApi = GroceryApiService.getInstance();
