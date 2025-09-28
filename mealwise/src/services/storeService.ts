import { Ingredient, Store, StoreSearchResult, StorePrice } from '@/types/store';

class StoreService {
  private readonly KROGER_API_KEY = process.env.NEXT_PUBLIC_KROGER_API_KEY;
  private readonly WALMART_API_KEY = process.env.NEXT_PUBLIC_WALMART_API_KEY;

  /**
   * Extract ingredients from notes text
   */
  extractIngredients(notes: string): Ingredient[] {
    const ingredients: Ingredient[] = [];
    
    // More comprehensive ingredient patterns
    const patterns = [
      // Pattern: "Ground beef (1 lb)" - quantity in parentheses
      /([a-zA-Z\s]+)\s*\((\d+(?:\.\d+)?)\s*(lbs?|pounds?|oz|ounces?|kg|kilograms?|g|grams?|bag|bags|box|boxes|can|cans|jar|jars|bottle|bottles|package|packages|pkg|pieces?|slices?|cups?|tablespoons?|tsp|teaspoons?|tbsp|tablespoons?|cloves?|large|medium|small|packet|pinch|block|head|bunch)\)/gi,
      
      // Pattern: "2 lbs chicken breast" - quantity before ingredient
      /(\d+(?:\.\d+)?)\s*(lbs?|pounds?|oz|ounces?|kg|kilograms?|g|grams?|bag|bags|box|boxes|can|cans|jar|jars|bottle|bottles|package|packages|pkg|pieces?|slices?|cups?|tablespoons?|tsp|teaspoons?|tbsp|tablespoons?|cloves?|large|medium|small|packet|pinch|block|head|bunch)\s+([a-zA-Z\s]+)/gi,
      
      // Pattern: "3lbs of rice" - natural language with "of"
      /(\d+(?:\.\d+)?)\s*(lbs?|pounds?|oz|ounces?|kg|kilograms?|g|grams?|bag|bags|box|boxes|can|cans|jar|jars|bottle|bottles|package|packages|pkg|pieces?|slices?|cups?|tablespoons?|tsp|teaspoons?|tbsp|tablespoons?|cloves?|large|medium|small|packet|pinch|block|head|bunch)\s+of\s+([a-zA-Z\s]+)/gi,
      
      // Pattern: "2 cups of milk" - natural language with "of"
      /(\d+(?:\.\d+)?)\s*(cups?|tablespoons?|tsp|teaspoons?|tbsp|tablespoons?)\s+of\s+([a-zA-Z\s]+)/gi,
      
      // Pattern: "chicken breast" - just ingredient name
      /(?:^|\n|,|\s)(chicken\s+(?:breast|thigh|wing|drumstick|ground)|beef\s+(?:ground|steak|roast)|pork\s+(?:chop|tenderloin|ground)|salmon|tuna|cod|shrimp|lobster|crab|turkey\s+(?:breast|ground)|lamb\s+(?:chop|leg|ground)|rice|pasta|spaghetti|noodles|bread|flour|sugar|salt|pepper|garlic|onion|tomato|potato|carrot|broccoli|spinach|lettuce|cheese|milk|eggs|butter|oil|vinegar|soy\s+sauce|olive\s+oil|vegetable\s+oil|canola\s+oil|sesame\s+oil|balsamic\s+vinegar|apple\s+cider\s+vinegar|white\s+vinegar|red\s+wine\s+vinegar|lemon\s+juice|lime\s+juice|orange\s+juice|ginger|basil|oregano|thyme|rosemary|parsley|cilantro|mint|sage|bay\s+leaves|paprika|cumin|coriander|turmeric|curry|chili\s+powder|cayenne|red\s+pepper\s+flakes|black\s+pepper|white\s+pepper|sea\s+salt|kosher\s+salt|table\s+salt|himalayan\s+salt|brown\s+sugar|white\s+sugar|powdered\s+sugar|honey|maple\s+syrup|molasses|vanilla\s+extract|almond\s+extract|baking\s+powder|baking\s+soda|cornstarch|yeast|bread\s+crumbs|panko|almonds|walnuts|pecans|cashews|pistachios|peanuts|sunflower\s+seeds|pumpkin\s+seeds|chia\s+seeds|flax\s+seeds|quinoa|barley|oats|wheat|buckwheat|millet|bulgur|couscous|polenta|grits|beans|black\s+beans|kidney\s+beans|pinto\s+beans|navy\s+beans|garbanzo\s+beans|chickpeas|lentils|split\s+peas|black\s+eyed\s+peas|lima\s+beans|green\s+beans|snap\s+beans|asparagus|artichoke|avocado|bell\s+pepper|jalapeno|serrano|habanero|poblano|anaheim|chipotle|mushrooms|shiitake|portobello|cremini|button\s+mushrooms|oyster\s+mushrooms|enoki|maitake|morel|chanterelle|porcini|truffle|zucchini|yellow\s+squash|butternut\s+squash|acorn\s+squash|spaghetti\s+squash|pumpkin|sweet\s+potato|yam|beet|radish|turnip|rutabaga|parsnip|celery|fennel|leek|scallion|green\s+onion|shallot|cauliflower|brussels\s+sprouts|cabbage|kale|collard\s+greens|swiss\s+chard|arugula|watercress|endive|radicchio|bok\s+choy|napa\s+cabbage|red\s+cabbage|savoy\s+cabbage|corn|peas|edamame|snow\s+peas|sugar\s+snap\s+peas|cucumber|pickle|olives|capers|sun\s+dried\s+tomatoes|roasted\s+red\s+peppers|artichoke\s+hearts|hearts\s+of\s+palm|water\s+chestnuts|bamboo\s+shoots|bean\s+sprouts|alfalfa\s+sprouts|broccoli\s+sprouts|radish\s+sprouts|mung\s+bean\s+sprouts|apples|bananas|oranges|lemons|limes|grapefruit|grapes|strawberries|blueberries|raspberries|blackberries|cranberries|cherries|peaches|pears|plums|apricots|nectarines|pineapple|mango|papaya|kiwi|passion\s+fruit|dragon\s+fruit|star\s+fruit|pomegranate|figs|dates|raisins|prunes|dried\s+cranberries|dried\s+cherries|dried\s+apricots|dried\s+mango|dried\s+pineapple|dried\s+banana|dried\s+apple|dried\s+pear|dried\s+peach|dried\s+plum|dried\s+fig|dried\s+date|dried\s+raisin|dried\s+prune|nuts|seeds|grains|cereals|breads|crackers|chips|popcorn|pretzels|trail\s+mix|granola|muesli|protein\s+bars|energy\s+bars|breakfast\s+bars|cereal\s+bars|fruit\s+bars|nut\s+bars|seed\s+bars|dairy|milk|cheese|yogurt|butter|cream|sour\s+cream|cream\s+cheese|cottage\s+cheese|ricotta|mozzarella|cheddar|swiss|provolone|parmesan|romano|asiago|gouda|brie|camembert|feta|goat\s+cheese|blue\s+cheese|gorgonzola|roquefort|stilton|manchego|pecorino|gruyere|emmental|jarlsberg|havarti|muenster|colby|monterey\s+jack|pepper\s+jack|string\s+cheese|cream\s+cheese|mascarpone|marscapone|burrata|bocconcini|fresh\s+mozzarella|buffalo\s+mozzarella|smoked\s+mozzarella|low\s+fat\s+mozzarella|part\s+skim\s+mozzarella|whole\s+milk\s+mozzarella|skim\s+milk|1%\s+milk|2%\s+milk|whole\s+milk|buttermilk|almond\s+milk|soy\s+milk|oat\s+milk|coconut\s+milk|rice\s+milk|hemp\s+milk|cashew\s+milk|macadamia\s+milk|hazelnut\s+milk|pistachio\s+milk|walnut\s+milk|pecan\s+milk|brazil\s+nut\s+milk|pumpkin\s+seed\s+milk|sunflower\s+seed\s+milk|flax\s+milk|chia\s+milk|quinoa\s+milk|spelt\s+milk|kamut\s+milk|amaranth\s+milk|teff\s+milk|millet\s+milk|buckwheat\s+milk|barley\s+milk|rye\s+milk|triticale\s+milk|freekeh\s+milk|bulgur\s+milk|couscous\s+milk|polenta\s+milk|grits\s+milk|eggs|chicken\s+eggs|duck\s+eggs|quail\s+eggs|goose\s+eggs|turkey\s+eggs|ostrich\s+eggs|emu\s+eggs|rhea\s+eggs|cassowary\s+eggs|kiwi\s+eggs|penguin\s+eggs|seagull\s+eggs|pigeon\s+eggs|dove\s+eggs|pheasant\s+eggs|partridge\s+eggs|grouse\s+eggs|ptarmigan\s+eggs|woodcock\s+eggs|snipe\s+eggs|rail\s+eggs|coot\s+eggs|moorhen\s+eggs|waterhen\s+eggs|gallinule\s+eggs|swamphen\s+eggs|purple\s+swamphen\s+eggs|grey\s+headed\s+swamphen\s+eggs|white\s+breasted\s+waterhen\s+eggs|common\s+moorhen\s+eggs|eurasian\s+coot\s+eggs|american\s+coot\s+eggs|red\s+knot\s+eggs|sanderling\s+eggs|dunlin\s+eggs|curlew\s+sandpiper\s+eggs|little\s+stint\s+eggs|temminck's\s+stint\s+eggs|least\s+sandpiper\s+eggs|white\s+rumped\s+sandpiper\s+eggs|baird's\s+sandpiper\s+eggs|pectoral\s+sandpiper\s+eggs|semipalmated\s+sandpiper\s+eggs|western\s+sandpiper\s+eggs|long\s+billed\s+dowitcher\s+eggs|short\s+billed\s+dowitcher\s+eggs|stilt\s+sandpiper\s+eggs|buff\s+breasted\s+sandpiper\s+eggs|spotted\s+sandpiper\s+eggs|solitary\s+sandpiper\s+eggs|green\s+sandpiper\s+eggs|wood\s+sandpiper\s+eggs|common\s+sandpiper\s+eggs|spotted\s+redshank\s+eggs|common\s+redshank\s+eggs|marsh\s+sandpiper\s+eggs|common\s+greenshank\s+eggs|lesser\s+yellowlegs\s+eggs|greater\s+yellowlegs\s+eggs|willet\s+eggs|ruddy\s+turnstone\s+eggs|black\s+turnstone\s+eggs|surfbird\s+eggs|red\s+knot\s+eggs|sanderling\s+eggs|dunlin\s+eggs|curlew\s+sandpiper\s+eggs|little\s+stint\s+eggs|temminck's\s+stint\s+eggs|least\s+sandpiper\s+eggs|white\s+rumped\s+sandpiper\s+eggs|baird's\s+sandpiper\s+eggs|pectoral\s+sandpiper\s+eggs|semipalmated\s+sandpiper\s+eggs|western\s+sandpiper\s+eggs|long\s+billed\s+dowitcher\s+eggs|short\s+billed\s+dowitcher\s+eggs|stilt\s+sandpiper\s+eggs|buff\s+breasted\s+sandpiper\s+eggs|spotted\s+sandpiper\s+eggs|solitary\s+sandpiper\s+eggs|green\s+sandpiper\s+eggs|wood\s+sandpiper\s+eggs|common\s+sandpiper\s+eggs|spotted\s+redshank\s+eggs|common\s+redshank\s+eggs|marsh\s+sandpiper\s+eggs|common\s+greenshank\s+eggs|lesser\s+yellowlegs\s+eggs|greater\s+yellowlegs\s+eggs|willet\s+eggs|ruddy\s+turnstone\s+eggs|black\s+turnstone\s+eggs|surfbird\s+eggs)/gi,
    ];
    
    patterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(notes)) !== null) {
        let quantity, unit, name;
        
        if (pattern.source.includes('\\(')) {
          // Pattern 1: "Ground beef (1 lb)"
          name = match[1];
          quantity = match[2];
          unit = match[3];
        } else if (pattern.source.includes('\\d+')) {
          // Pattern 2: "2 lbs chicken breast" or Pattern 3: "3lbs of rice"
          quantity = match[1];
          unit = match[2];
          name = match[3];
        } else {
          // Pattern 4: "chicken breast"
          name = match[1];
          quantity = '1';
          unit = '';
        }
        
        if (name && name.trim().length > 2) {
          const ingredient = {
            name: name.trim().toLowerCase(),
            quantity: quantity,
            unit: unit,
          };
          console.log('Extracted ingredient:', ingredient); // Debug log
          ingredients.push(ingredient);
        }
      }
    });

    // Remove duplicates
    const uniqueIngredients = ingredients.filter((ingredient, index, self) =>
      index === self.findIndex(i => i.name === ingredient.name)
    );

    console.log('Final ingredients:', uniqueIngredients); // Debug log
    return uniqueIngredients;
  }

  /**
   * Get user's current location
   */
  async getCurrentLocation(): Promise<{ latitude: number; longitude: number }> {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        console.warn('Geolocation not supported, using default location');
        resolve({ latitude: 33.748997, longitude: -84.387985 });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Got user location:', position.coords.latitude, position.coords.longitude);
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn(`Geolocation error: ${error.message}, using default location`);
          resolve({ latitude: 33.748997, longitude: -84.387985 });
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    });
  }

  /**
   * Convert zip code to coordinates using Google Geocoding API
   */
  async getLocationFromZipCode(zipCode: string): Promise<{ latitude: number; longitude: number }> {
    try {
      const url = `/api/google-maps/geocode?address=${zipCode}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        console.log(`Converted zip code ${zipCode} to coordinates:`, location);
        return {
          latitude: location.lat,
          longitude: location.lng,
        };
      } else {
        return { latitude: 33.748997, longitude: -84.387985 };
      }
    } catch (error) {
      console.error('Error geocoding zip code:', error);
      return { latitude: 33.748997, longitude: -84.387985 };
    }
  }

  /**
   * Search for nearby stores using Google Maps API
   */
  async searchNearbyStores(location: { latitude: number; longitude: number }): Promise<Store[]> {
    console.log('=== SEARCHING FOR STORES ===');
    console.log('Google Maps API Key:', process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? 'Present' : 'Missing');
    console.log('API Key length:', process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY?.length || 0);
    console.log('Search location:', location);

    if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) {
      console.warn('❌ Google Maps API key not found, using mock data');
      return this.getMockStores();
    }

    try {
      const stores: Store[] = [];
      
      // Search for Kroger stores
      console.log('🔍 Searching for Kroger stores...');
      const krogerStores = await this.searchStoresByChain(location, 'kroger');
      console.log('✅ Found Kroger stores:', krogerStores.length);
      stores.push(...krogerStores);
      
      // Search for Walmart stores
      console.log('🔍 Searching for Walmart stores...');
      const walmartStores = await this.searchStoresByChain(location, 'walmart');
      console.log('✅ Found Walmart stores:', walmartStores.length);
      stores.push(...walmartStores);
      
      console.log('📊 Total stores found:', stores.length);
      
      if (stores.length === 0) {
        console.warn('⚠️ No real stores found, using mock data');
        return this.getMockStores();
      }
      
      // Sort by distance and return top 10
      const sortedStores = stores
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 10);
      
      console.log('🎯 Returning stores:', sortedStores);
      return sortedStores;
        
    } catch (error) {
      console.error('❌ Error searching stores with Google Maps API:', error);
      console.log('🔄 Falling back to mock data');
      return this.getMockStores();
    }
  }

  /**
   * Search for stores of a specific chain using Google Maps Places API
   */
  private async searchStoresByChain(
    location: { latitude: number; longitude: number }, 
    chain: 'kroger' | 'walmart'
  ): Promise<Store[]> {
    const chainName = chain === 'kroger' ? 'Kroger' : 'Walmart';
    const radius = 50000; // 50km radius
    
    const url = `/api/google-maps/places?latitude=${location.latitude}&longitude=${location.longitude}&radius=${radius}&keyword=${chainName}`;

    console.log(`Searching for ${chainName} stores at:`, location);
    console.log('API URL:', url);

    try {
      console.log(`🌐 Making fetch request to: ${url}`);
      const response = await fetch(url);
      
      console.log(`📡 Response status: ${response.status} ${response.statusText}`);
      console.log(`📡 Response headers:`, Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        console.error(`❌ HTTP Error: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        console.error(`❌ Error response body:`, errorText);
        throw new Error(`Google Maps API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(`✅ Google Maps API response for ${chainName}:`, data);
      
      if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
        console.error(`API Error Status: ${data.status}`, data.error_message);
        throw new Error(`Google Maps API error: ${data.status} - ${data.error_message}`);
      }
      
      if (!data.results || data.results.length === 0) {
        console.log(`No ${chainName} stores found in the area`);
        return [];
      }
      
      const stores = data.results.map((place: any) => ({
        id: `${chain}_${place.place_id}`,
        name: place.name,
        address: place.vicinity,
        chain: chain,
        distance: this.calculateDistance(
          location.latitude, 
          location.longitude, 
          place.geometry.location.lat, 
          place.geometry.location.lng
        ),
      }));
      
      console.log(`Mapped ${chainName} stores:`, stores);
      return stores;
      
    } catch (error) {
      console.error(`Error searching for ${chainName} stores:`, error);
      throw error;
    }
  }

  /**
   * Calculate distance between two coordinates using Haversine formula
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 3959; // Earth's radius in miles
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Convert degrees to radians
   */
  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Get mock stores as fallback
   */
  private getMockStores(): Store[] {
    const mockStores: Store[] = [
      {
        id: 'kroger1',
        name: 'Kroger',
        address: '123 Main St, Anytown, USA',
        chain: 'kroger',
        distance: Math.random() * 5,
        latitude: 33.748997,
        longitude: -84.387985,
      },
      {
        id: 'walmart1',
        name: 'Walmart Supercenter',
        address: '456 Oak Ave, Anytown, USA',
        chain: 'walmart',
        distance: Math.random() * 5,
        latitude: 33.748997,
        longitude: -84.387985,
      },
    ];

    return mockStores.sort((a, b) => a.distance - b.distance);
  }

  /**
   * Get prices for ingredients from specific stores
   */
  async getIngredientPrices(ingredients: Ingredient[], stores: Store[]): Promise<StorePrice[]> {
    // For now, return mock data with realistic prices
    // In production, you would call Kroger and Walmart APIs here
    
    const prices: StorePrice[] = [];
    
    // Realistic price ranges for common ingredients
    const getRealisticPrice = (ingredientName: string, unit: string): number => {
      const name = ingredientName.toLowerCase();
      
      // Meat prices (per lb)
      if (name.includes('chicken') || name.includes('beef') || name.includes('pork')) {
        return Math.random() * 2 + 3; // $3-$5 per lb
      }
      
      // Seafood prices (per lb)
      if (name.includes('salmon') || name.includes('shrimp') || name.includes('seafood')) {
        return Math.random() * 3 + 6; // $6-$9 per lb
      }
      
      // Vegetables (per lb or unit)
      if (name.includes('onion') || name.includes('garlic') || name.includes('pepper') || 
          name.includes('broccoli') || name.includes('carrot') || name.includes('tomato')) {
        return Math.random() * 1.5 + 0.5; // $0.50-$2 per lb
      }
      
      // Grains and pasta
      if (name.includes('rice') || name.includes('pasta') || name.includes('spaghetti')) {
        return Math.random() * 1 + 1; // $1-$2 per lb
      }
      
      // Dairy
      if (name.includes('cheese') || name.includes('milk') || name.includes('butter')) {
        return Math.random() * 2 + 2; // $2-$4 per unit
      }
      
      // Oils and condiments
      if (name.includes('oil') || name.includes('vinegar') || name.includes('sauce')) {
        return Math.random() * 1.5 + 1; // $1-$2.50 per unit
      }
      
      // Herbs and spices
      if (name.includes('basil') || name.includes('parsley') || name.includes('cilantro') || 
          name.includes('saffron') || name.includes('seasoning')) {
        return Math.random() * 2 + 1; // $1-$3 per unit
      }
      
      // Tortillas and bread
      if (name.includes('tortilla') || name.includes('bread')) {
        return Math.random() * 1 + 1.5; // $1.50-$2.50 per package
      }
      
      // Default price for other items
      return Math.random() * 1.5 + 1; // $1-$2.50 per unit
    };
    
    ingredients.forEach(ingredient => {
      stores.forEach(store => {
        // Get realistic unit price based on ingredient type
        const baseUnitPrice = getRealisticPrice(ingredient.name, ingredient.unit || '');
        
        // Add small store variation (±10%)
        const variation = (Math.random() - 0.5) * 0.2; // ±10%
        const finalUnitPrice = Math.round((baseUnitPrice + variation) * 100) / 100;
        
        // Calculate total price based on quantity with proper unit conversion
        const quantityStr = ingredient.quantity || '1';
        const quantity = isNaN(parseFloat(quantityStr)) ? 1 : parseFloat(quantityStr);
        const unit = ingredient.unit || '';
        
        // Convert units to consistent pricing (per lb or per unit)
        let adjustedQuantity = quantity;
        let adjustedUnitPrice = finalUnitPrice;
        
        if (unit.toLowerCase().includes('g') || unit.toLowerCase().includes('gram')) {
          // Convert grams to pounds (1 lb = 453.592 g)
          adjustedQuantity = quantity / 453.592;
          adjustedUnitPrice = finalUnitPrice; // Price is already per lb
        } else if (unit.toLowerCase().includes('kg') || unit.toLowerCase().includes('kilogram')) {
          // Convert kg to pounds (1 kg = 2.20462 lbs)
          adjustedQuantity = quantity * 2.20462;
          adjustedUnitPrice = finalUnitPrice; // Price is already per lb
        } else if (unit.toLowerCase().includes('oz') || unit.toLowerCase().includes('ounce')) {
          // Convert oz to pounds (1 lb = 16 oz)
          adjustedQuantity = quantity / 16;
          adjustedUnitPrice = finalUnitPrice; // Price is already per lb
        } else if (unit.toLowerCase().includes('cup')) {
          // For cups, use a different pricing approach
          adjustedQuantity = quantity;
          adjustedUnitPrice = finalUnitPrice * 0.5; // Cups are typically smaller portions
        } else if (unit.toLowerCase().includes('tablespoon') || unit.toLowerCase().includes('tbsp')) {
          // For tablespoons, use even smaller pricing
          adjustedQuantity = quantity;
          adjustedUnitPrice = finalUnitPrice * 0.1; // Tablespoons are very small portions
        } else if (unit.toLowerCase().includes('teaspoon') || unit.toLowerCase().includes('tsp')) {
          // For teaspoons, use very small pricing
          adjustedQuantity = quantity;
          adjustedUnitPrice = finalUnitPrice * 0.05; // Teaspoons are tiny portions
        }
        
        const totalPrice = adjustedUnitPrice * adjustedQuantity;
        
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
   * Search for stores and prices using zip code
   */
  async searchStoresAndPricesWithZip(notes: string, zipCode: string): Promise<StoreSearchResult> {
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

      // Get location from zip code
      const location = await this.getLocationFromZipCode(zipCode);
      
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
      console.error('Error searching stores and prices with zip code:', error);
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
        if (!isNaN(cheapestTotalPrice)) {
          total += cheapestTotalPrice;
        }
      }
    });
    
    return Math.round(total * 100) / 100;
  }
}

export const storeService = new StoreService();

// Make storeService available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).storeService = storeService;
}