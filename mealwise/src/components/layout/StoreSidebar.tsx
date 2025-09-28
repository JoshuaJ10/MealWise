'use client';

import React, { useState, useEffect } from 'react';
import { Store, StorePrice, StoreSearchResult } from '@/types/store';
import { storeService } from '@/services/storeService';
import { MapPin, DollarSign, ShoppingCart, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface StoreSidebarProps {
  notes: string;
  isVisible: boolean;
  onClose: () => void;
}

export const StoreSidebar: React.FC<StoreSidebarProps> = ({ notes, isVisible, onClose }) => {
  const [searchResult, setSearchResult] = useState<StoreSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [zipCode, setZipCode] = useState<string>('');
  const [useZipCode, setUseZipCode] = useState<boolean>(false);

  useEffect(() => {
    if (isVisible && notes.trim()) {
      searchStores();
    }
  }, [isVisible, notes]);

  const searchStores = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      let result;
      if (useZipCode && zipCode.trim()) {
        console.log('Using zip code:', zipCode);
        result = await storeService.searchStoresAndPricesWithZip(notes, zipCode);
      } else {
        console.log('Using geolocation');
        result = await storeService.searchStoresAndPrices(notes);
      }
      setSearchResult(result);
    } catch (err) {
      setError('Failed to find stores and prices');
      console.error('Store search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getIngredientPrices = (ingredient: string): StorePrice[] => {
    if (!searchResult) return [];
    return searchResult.prices.filter(p => p.ingredient === ingredient);
  };

  const getStorePrices = (storeId: string): StorePrice[] => {
    if (!searchResult) return [];
    return searchResult.prices.filter(p => p.storeId === storeId);
  };

  const getUniqueIngredients = (): string[] => {
    if (!searchResult) return [];
    return [...new Set(searchResult.prices.map(p => p.ingredient))];
  };

  const getParsedIngredients = (): string[] => {
    if (!notes.trim()) return [];
    const ingredients = storeService.extractIngredients(notes);
    return ingredients.map(ing => ing.name);
  };

  if (!isVisible) return null;

  return (
    <div className="w-64 sm:w-72 md:w-80 lg:w-96 bg-white border-l border-amber-200 flex flex-col h-full">
       {/* Header */}
       <div className="p-2 sm:p-4 border-b border-amber-200">
         <div className="flex items-center justify-between mb-3">
           <div className="flex items-center gap-2">
             <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
             <h2 className="text-base sm:text-lg font-semibold text-gray-900">Stores</h2>
           </div>
           <button
             onClick={onClose}
             className="text-gray-400 hover:text-gray-600 transition-colors"
           >
             <XCircle className="w-5 h-5" />
           </button>
         </div>
         
         {/* Location Options */}
         <div className="space-y-2">
           <div className="flex items-center gap-2">
             <input
               type="radio"
               id="useLocation"
               name="locationType"
               checked={!useZipCode}
               onChange={() => setUseZipCode(false)}
               className="text-green-600"
             />
             <label htmlFor="useLocation" className="text-sm text-gray-700">
               Use my location
             </label>
           </div>
           <div className="flex items-center gap-2">
             <input
               type="radio"
               id="useZipCode"
               name="locationType"
               checked={useZipCode}
               onChange={() => setUseZipCode(true)}
               className="text-green-600"
             />
             <label htmlFor="useZipCode" className="text-sm text-gray-700">
               Enter zip code
             </label>
           </div>
           {useZipCode && (
             <div className="flex items-center gap-2">
               <input
                 type="text"
                 placeholder="Enter zip code (e.g., 30309)"
                 value={zipCode}
                 onChange={(e) => setZipCode(e.target.value)}
                 className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                 maxLength={5}
               />
               <button
                 onClick={searchStores}
                 disabled={!zipCode.trim() || isLoading}
                 className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
               >
                 Search
               </button>
             </div>
           )}
         </div>
       </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-green-600" />
            <span className="ml-2 text-gray-600">Finding stores...</span>
          </div>
        ) : error ? (
          <div className="p-4 text-center text-red-600">
            <XCircle className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">{error}</p>
            <button
              onClick={searchStores}
              className="mt-2 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : searchResult && searchResult.stores.length > 0 ? (
          <div className="p-4 space-y-4">
            {/* Total Cost Summary */}
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <div className="flex items-center gap-2 mb-1">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">Estimated Total</span>
              </div>
              <div className="text-xl font-bold text-green-600">
                ${searchResult.totalEstimatedCost.toFixed(2)}
              </div>
              <div className="text-xs text-green-600">
                Using cheapest available prices
              </div>
            </div>

            {/* Stores */}
            {searchResult.stores.map((store) => {
              const storePrices = getStorePrices(store.id);
              const storeTotal = storePrices.reduce((sum, price) => sum + price.price, 0);
              
              return (
                <div key={store.id} className="border border-amber-200 rounded-lg p-3">
                  {/* Store Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{store.name}</h3>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="w-3 h-3" />
                        <span>{store.distance.toFixed(1)} mi</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{store.address}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        ${storeTotal.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">Store Total</div>
                    </div>
                  </div>

                  {/* Store Prices */}
                  <div className="space-y-1">
                    {getParsedIngredients().map((ingredient) => {
                      const storePrices = getIngredientPrices(ingredient);
                      const storePrice = storePrices.find(p => p.storeId === store.id);
                      
                      return (
                        <div key={ingredient} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-700 capitalize">
                              {ingredient}
                              {storePrice && storePrice.quantity > 1 && (
                                <span className="text-gray-500 ml-1">
                                  ({storePrice.quantity} {storePrice.unit})
                                </span>
                              )}
                            </span>
                            {storePrice ? (
                              storePrice.availability ? (
                                <CheckCircle className="w-3 h-3 text-green-500" />
                              ) : (
                                <XCircle className="w-3 h-3 text-red-500" />
                              )
                            ) : (
                              <XCircle className="w-3 h-3 text-gray-400" />
                            )}
                          </div>
                          <div className="text-right">
                            <span className={`font-medium ${
                              storePrice && storePrice.availability ? 'text-gray-900' : 'text-gray-500'
                            }`}>
                              {storePrice && storePrice.availability 
                                ? `$${storePrice.price.toFixed(2)}` 
                                : 'Not Found'
                              }
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Ingredient Summary */}
            <div className="border-t border-amber-200 pt-4">
              <h4 className="font-medium text-gray-900 mb-2">All Ingredients</h4>
              <div className="space-y-1">
                {getParsedIngredients().map((ingredient) => {
                  const prices = getIngredientPrices(ingredient);
                  const cheapestPrice = prices.length > 0 ? Math.min(...prices.map(p => p.price)) : null;
                  const cheapestStore = prices.find(p => p.price === cheapestPrice);
                  
                  return (
                    <div key={ingredient} className="flex items-center justify-between text-sm">
                      <span className="text-gray-700 capitalize">
                        {ingredient}
                        {cheapestStore && cheapestStore.quantity > 1 && (
                          <span className="text-gray-500 ml-1">
                            ({cheapestStore.quantity} {cheapestStore.unit})
                          </span>
                        )}
                      </span>
                      <div className="text-right">
                        <span className="font-medium text-gray-900">
                          {cheapestPrice ? `$${cheapestPrice.toFixed(2)}` : 'Not Found'}
                        </span>
                        <div className="text-xs text-gray-500">
                          {cheapestStore ? `at ${cheapestStore.storeName}` : 'No stores'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 text-center text-gray-500">
            <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No ingredients found in notes</p>
            <p className="text-xs mt-1">
              Try adding ingredients like "chicken breast" or "2 lbs rice"
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-amber-200 bg-gray-50">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock className="w-3 h-3" />
          <span>Prices updated just now</span>
        </div>
        <div className="text-xs text-gray-400 mt-1">
          Powered by Kroger & Walmart APIs
        </div>
      </div>
    </div>
  );
};
