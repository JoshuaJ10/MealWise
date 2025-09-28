import { Ingredient, Store, StoreSearchResult, StorePrice } from '@/types/store';

class StoreService {
  private readonly KROGER_API_KEY = process.env.NEXT_PUBLIC_KROGER_API_KEY;
  private readonly WALMART_API_KEY = process.env.NEXT_PUBLIC_WALMART_API_KEY;
  private readonly GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  /**
   * Extract ingredients from notes text
   */
  extractIngredients(notes: string): Ingredient[] {
    const ingredients: Ingredient[] = [];
    
    // Simple patterns for common ingredients
    const patterns = [
      // Pattern: "2 lbs chicken breast" - quantity, unit, ingredient
      /(\d+(?:\.\d+)?)\s*(lbs?|pounds?|oz|ounces?|kg|kilograms?|g|grams?|bag|bags|box|boxes|can|cans|jar|jars|bottle|bottles|package|packages|pkg|pieces?|slices?|cups?|tablespoons?|tsp|teaspoons?|tbsp|tablespoons?)\s+([a-zA-Z\s]+)/gi,
      // Pattern: "chicken breast" - just ingredient name
      /(?:^|\n|,|\s)(chicken\s+(?:breast|thigh|wing|drumstick|ground)|beef\s+(?:ground|steak|roast)|pork\s+(?:chop|tenderloin|ground)|salmon|tuna|cod|shrimp|lobster|crab|turkey\s+(?:breast|ground)|lamb\s+(?:chop|leg|ground)|rice|pasta|spaghetti|noodles|bread|flour|sugar|salt|pepper|garlic|onion|tomato|potato|carrot|broccoli|spinach|lettuce|cheese|milk|eggs|butter|oil|vinegar|soy\s+sauce|olive\s+oil|vegetable\s+oil|canola\s+oil|sesame\s+oil|balsamic\s+vinegar|apple\s+cider\s+vinegar|white\s+vinegar|red\s+wine\s+vinegar|lemon\s+juice|lime\s+juice|orange\s+juice|ginger|basil|oregano|thyme|rosemary|parsley|cilantro|mint|sage|bay\s+leaves|paprika|cumin|coriander|turmeric|curry|chili\s+powder|cayenne|red\s+pepper\s+flakes|black\s+pepper|white\s+pepper|sea\s+salt|kosher\s+salt|table\s+salt|himalayan\s+salt|brown\s+sugar|white\s+sugar|powdered\s+sugar|honey|maple\s+syrup|molasses|vanilla\s+extract|almond\s+extract|baking\s+powder|baking\s+soda|cornstarch|yeast|bread\s+crumbs|panko|almonds|walnuts|pecans|cashews|pistachios|peanuts|sunflower\s+seeds|pumpkin\s+seeds|chia\s+seeds|flax\s+seeds|quinoa|barley|oats|wheat|buckwheat|millet|bulgur|couscous|polenta|grits|beans|black\s+beans|kidney\s+beans|pinto\s+beans|navy\s+beans|garbanzo\s+beans|chickpeas|lentils|split\s+peas|black\s+eyed\s+peas|lima\s+beans|green\s+beans|snap\s+beans|asparagus|artichoke|avocado|bell\s+pepper|jalapeno|serrano|habanero|poblano|anaheim|chipotle|mushrooms|shiitake|portobello|cremini|button\s+mushrooms|oyster\s+mushrooms|enoki|maitake|morel|chanterelle|porcini|truffle|zucchini|yellow\s+squash|butternut\s+squash|acorn\s+squash|spaghetti\s+squash|pumpkin|sweet\s+potato|yam|beet|radish|turnip|rutabaga|parsnip|celery|fennel|leek|scallion|green\s+onion|shallot|cauliflower|brussels\s+sprouts|cabbage|kale|collard\s+greens|swiss\s+chard|arugula|watercress|endive|radicchio|bok\s+choy|napa\s+cabbage|red\s+cabbage|savoy\s+cabbage|corn|peas|edamame|snow\s+peas|sugar\s+snap\s+peas|cucumber|pickle|olives|capers|sun\s+dried\s+tomatoes|roasted\s+red\s+peppers|artichoke\s+hearts|hearts\s+of\s+palm|water\s+chestnuts|bamboo\s+shoots|bean\s+sprouts|alfalfa\s+sprouts|broccoli\s+sprouts|radish\s+sprouts|mung\s+bean\s+sprouts|apples|bananas|oranges|lemons|limes|grapefruit|grapes|strawberries|blueberries|raspberries|blackberries|cranberries|cherries|peaches|pears|plums|apricots|nectarines|pineapple|mango|papaya|kiwi|passion\s+fruit|dragon\s+fruit|star\s+fruit|pomegranate|figs|dates|raisins|prunes|dried\s+cranberries|dried\s+cherries|dried\s+apricots|dried\s+mango|dried\s+pineapple|dried\s+banana|dried\s+apple|dried\s+pear|dried\s+peach|dried\s+plum|dried\s+fig|dried\s+date|dried\s+raisin|dried\s+prune|nuts|seeds|grains|cereals|breads|crackers|chips|popcorn|pretzels|trail\s+mix|granola|muesli|protein\s+bars|energy\s+bars|breakfast\s+bars|cereal\s+bars|fruit\s+bars|nut\s+bars|seed\s+bars|dairy|milk|cheese|yogurt|butter|cream|sour\s+cream|cream\s+cheese|cottage\s+cheese|ricotta|mozzarella|cheddar|swiss|provolone|parmesan|romano|asiago|gouda|brie|camembert|feta|goat\s+cheese|blue\s+cheese|gorgonzola|roquefort|stilton|manchego|pecorino|gruyere|emmental|jarlsberg|havarti|muenster|colby|monterey\s+jack|pepper\s+jack|string\s+cheese|cream\s+cheese|mascarpone|marscapone|burrata|bocconcini|fresh\s+mozzarella|buffalo\s+mozzarella|smoked\s+mozzarella|low\s+fat\s+mozzarella|part\s+skim\s+mozzarella|whole\s+milk\s+mozzarella|skim\s+milk|1%\s+milk|2%\s+milk|whole\s+milk|buttermilk|almond\s+milk|soy\s+milk|oat\s+milk|coconut\s+milk|rice\s+milk|hemp\s+milk|cashew\s+milk|macadamia\s+milk|hazelnut\s+milk|pistachio\s+milk|walnut\s+milk|pecan\s+milk|brazil\s+nut\s+milk|pumpkin\s+seed\s+milk|sunflower\s+seed\s+milk|flax\s+milk|chia\s+milk|quinoa\s+milk|spelt\s+milk|kamut\s+milk|amaranth\s+milk|teff\s+milk|millet\s+milk|buckwheat\s+milk|barley\s+milk|rye\s+milk|triticale\s+milk|freekeh\s+milk|bulgur\s+milk|couscous\s+milk|polenta\s+milk|grits\s+milk|eggs|chicken\s+eggs|duck\s+eggs|quail\s+eggs|goose\s+eggs|turkey\s+eggs|ostrich\s+eggs|emu\s+eggs|rhea\s+eggs|cassowary\s+eggs|kiwi\s+eggs|penguin\s+eggs|seagull\s+eggs|pigeon\s+eggs|dove\s+eggs|pheasant\s+eggs|partridge\s+eggs|grouse\s+eggs|ptarmigan\s+eggs|woodcock\s+eggs|snipe\s+eggs|rail\s+eggs|coot\s+eggs|moorhen\s+eggs|waterhen\s+eggs|gallinule\s+eggs|swamphen\s+eggs|purple\s+swamphen\s+eggs|grey\s+headed\s+swamphen\s+eggs|white\s+breasted\s+waterhen\s+eggs|common\s+moorhen\s+eggs|eurasian\s+coot\s+eggs|american\s+coot\s+eggs|red\s+knot\s+eggs|sanderling\s+eggs|dunlin\s+eggs|curlew\s+sandpiper\s+eggs|little\s+stint\s+eggs|temminck's\s+stint\s+eggs|least\s+sandpiper\s+eggs|white\s+rumped\s+sandpiper\s+eggs|baird's\s+sandpiper\s+eggs|pectoral\s+sandpiper\s+eggs|semipalmated\s+sandpiper\s+eggs|western\s+sandpiper\s+eggs|long\s+billed\s+dowitcher\s+eggs|short\s+billed\s+dowitcher\s+eggs|stilt\s+sandpiper\s+eggs|buff\s+breasted\s+sandpiper\s+eggs|spotted\s+sandpiper\s+eggs|solitary\s+sandpiper\s+eggs|green\s+sandpiper\s+eggs|wood\s+sandpiper\s+eggs|common\s+sandpiper\s+eggs|spotted\s+redshank\s+eggs|common\s+redshank\s+eggs|marsh\s+sandpiper\s+eggs|common\s+greenshank\s+eggs|lesser\s+yellowlegs\s+eggs|greater\s+yellowlegs\s+eggs|willet\s+eggs|ruddy\s+turnstone\s+eggs|black\s+turnstone\s+eggs|surfbird\s+eggs|red\s+knot\s+eggs|sanderling\s+eggs|dunlin\s+eggs|curlew\s+sandpiper\s+eggs|little\s+stint\s+eggs|temminck's\s+stint\s+eggs|least\s+sandpiper\s+eggs|white\s+rumped\s+sandpiper\s+eggs|baird's\s+sandpiper\s+eggs|pectoral\s+sandpiper\s+eggs|semipalmated\s+sandpiper\s+eggs|western\s+sandpiper\s+eggs|long\s+billed\s+dowitcher\s+eggs|short\s+billed\s+dowitcher\s+eggs|stilt\s+sandpiper\s+eggs|buff\s+breasted\s+sandpiper\s+eggs|spotted\s+sandpiper\s+eggs|solitary\s+sandpiper\s+eggs|green\s+sandpiper\s+eggs|wood\s+sandpiper\s+eggs|common\s+sandpiper\s+eggs|spotted\s+redshank\s+eggs|common\s+redshank\s+eggs|marsh\s+sandpiper\s+eggs|common\s+greenshank\s+eggs|lesser\s+yellowlegs\s+eggs|greater\s+yellowlegs\s+eggs|willet\s+eggs|ruddy\s+turnstone\s+eggs|black\s+turnstone\s+eggs|surfbird\s+eggs)/gi,
    ];
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(notes)) !== null) {
        const quantity = match[1] || '1';
        const unit = match[2] || '';
        const name = match[3] || match[1];
        
        if (name && name.trim().length > 2) {
          ingredients.push({
            name: name.trim().toLowerCase(),
            quantity: quantity,
            unit: unit,
          });
        }
      }
    });

    // Remove duplicates
    const uniqueIngredients = ingredients.filter((ingredient, index, self) =>
      index === self.findIndex(i => i.name === ingredient.name)
    );

    return uniqueIngredients;
  }

  /**
   * Get user's current location
   */
  async getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(new Error(`Geolocation error: ${error.message}`));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }

  /**
   * Search for nearby stores using Google Maps API
   */
  async searchNearbyStores(location: { latitude: number; longitude: number }): Promise<Store[]> {
    // For now, return mock data
    // In production, you would call Google Maps Places API here
    
    const mockStores: Store[] = [
      {
        id: 'kroger1',
        name: 'Kroger',
        address: '123 Main St, Anytown, USA',
        chain: 'kroger',
        distance: Math.random() * 5, // Mock distance calculation
      },
      {
        id: 'walmart1',
        name: 'Walmart Supercenter',
        address: '456 Oak Ave, Anytown, USA',
        chain: 'walmart',
        distance: Math.random() * 5, // Mock distance calculation
      },
    ];

    return mockStores.map(store => ({
      ...store,
      distance: Math.random() * 5, // Mock distance calculation
    })).sort((a, b) => a.distance - b.distance);
  }

  /**
   * Get prices for ingredients from specific stores
   */
  async getIngredientPrices(ingredients: Ingredient[], stores: Store[]): Promise<StorePrice[]> {
    // For now, return mock data
    // In production, you would call Kroger and Walmart APIs here
    
    const prices: StorePrice[] = [];
    
    ingredients.forEach(ingredient => {
      stores.forEach(store => {
        // Mock price generation for unit price
        const unitPrice = Math.random() * 5 + 1; // $1-$6 per unit
        const priceVariation = (Math.random() - 0.5) * 0.5; // ±$0.25 variation
        const finalUnitPrice = Math.round((unitPrice + priceVariation) * 100) / 100;
        
        // Calculate total price based on quantity
        const quantity = parseFloat(ingredient.quantity || '1');
        const totalPrice = finalUnitPrice * quantity;
        
        prices.push({
          storeId: store.id,
          storeName: store.name,
          chain: store.chain,
          ingredient: ingredient.name,
          price: Math.round(totalPrice * 100) / 100, // Total price for the quantity
          unitPrice: Math.round(finalUnitPrice * 100) / 100, // Price per unit
          unit: ingredient.unit || 'per item',
          quantity: quantity,
          availability: Math.random() > 0.1, // 90% availability
          lastUpdated: new Date(),
        });
      });
    });

    return prices;
  }

  /**
   * Main method to search for stores and prices
   */
  async searchStoresAndPrices(notes: string): Promise<StoreSearchResult> {
    try {
      // Extract ingredients from notes
      const ingredients = this.extractIngredients(notes);
      
      if (ingredients.length === 0) {
        return {
          stores: [],
          prices: [],
          totalEstimatedCost: 0,
        };
      }

      // Get user location
      const location = await this.getCurrentLocation();
      
      // Search for nearby stores
      const stores = await this.searchNearbyStores(location);
      
      // Get prices for ingredients at each store
      const prices = await this.getIngredientPrices(ingredients, stores);
      
      // Calculate total estimated cost
      const totalEstimatedCost = this.calculateTotalCost(prices, ingredients);

      return {
        stores,
        prices,
        totalEstimatedCost,
      };
    } catch (error) {
      console.error('Error searching stores and prices:', error);
      return {
        stores: [],
        prices: [],
        totalEstimatedCost: 0,
      };
    }
  }

  /**
   * Calculate total estimated cost using cheapest available prices
   */
  private calculateTotalCost(prices: StorePrice[], ingredients: Ingredient[]): number {
    let total = 0;
    
    ingredients.forEach(ingredient => {
      const ingredientPrices = prices.filter(p => 
        p.ingredient === ingredient.name && p.availability
      );
      
      if (ingredientPrices.length > 0) {
        // Use the total price (already calculated for the quantity)
        const cheapestTotalPrice = Math.min(...ingredientPrices.map(p => p.price));
        total += cheapestTotalPrice;
      }
    });
    
    return Math.round(total * 100) / 100;
  }
}

export const storeService = new StoreService();