import React, { useState } from 'react';
import { useGroceryStore } from '@/store/groceryStore';
import { GroceryItemCard } from './GroceryItemCard';
import { AddItemForm } from './AddItemForm';
import { GroceryCategory } from '@/types/grocery';
import { ShoppingCart, DollarSign, Target, Trash2, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORY_ORDER: GroceryCategory[] = [
  'Produce',
  'Dairy', 
  'Frozen',
  'Meat',
  'Bakery',
  'Pantry',
  'Beverages',
  'Snacks',
  'Other'
];

export const GroceryList: React.FC = () => {
  const { 
    items, 
    total, 
    budget, 
    getItemsByCategory, 
    getCheckedItems, 
    getUncheckedItems,
    clearList,
    setBudget 
  } = useGroceryStore();
  
  const [showCompleted, setShowCompleted] = useState(false);
  const [filterCategory, setFilterCategory] = useState<GroceryCategory | 'All'>('All');
  const [showBudgetInput, setShowBudgetInput] = useState(false);
  const [budgetValue, setBudgetValue] = useState(budget || 0);

  const checkedItems = getCheckedItems();
  const uncheckedItems = getUncheckedItems();
  const displayItems = showCompleted ? items : uncheckedItems;

  const filteredItems = filterCategory === 'All' 
    ? displayItems 
    : displayItems.filter(item => item.category === filterCategory);

  const itemsByCategory = CATEGORY_ORDER.map(category => ({
    category,
    items: filteredItems.filter(item => item.category === category)
  })).filter(group => group.items.length > 0);

  const handleSetBudget = () => {
    setBudget(budgetValue);
    setShowBudgetInput(false);
  };

  const isOverBudget = budget && total > budget;
  const remainingBudget = budget ? budget - total : null;

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Grocery List
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBudgetInput(!showBudgetInput)}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              <Target className="w-4 h-4" />
              {budget ? `Budget: $${budget}` : 'Set Budget'}
            </button>
            
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${
                showCompleted 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Filter className="w-4 h-4" />
              {showCompleted ? 'Hide Completed' : 'Show Completed'}
            </button>
          </div>
        </div>

        {/* Budget Input */}
        {showBudgetInput && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                step="0.01"
                value={budgetValue}
                onChange={(e) => setBudgetValue(parseFloat(e.target.value) || 0)}
                placeholder="Enter budget amount"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
              <button
                onClick={handleSetBudget}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Set
              </button>
            </div>
          </motion.div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {uncheckedItems.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Remaining
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {checkedItems.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Completed
            </div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${isOverBudget ? 'text-red-600' : 'text-gray-900 dark:text-white'}`}>
              ${total.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total
            </div>
          </div>
        </div>

        {/* Budget Status */}
        {budget && (
          <div className={`mt-3 p-3 rounded-lg ${
            isOverBudget 
              ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400' 
              : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
          }`}>
            <div className="flex items-center justify-between">
              <span className="font-medium">
                {isOverBudget ? 'Over Budget' : 'Within Budget'}
              </span>
              <span className="font-bold">
                {remainingBudget !== null && (
                  remainingBudget >= 0 
                    ? `$${remainingBudget.toFixed(2)} remaining`
                    : `$${Math.abs(remainingBudget).toFixed(2)} over`
                )}
              </span>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Filter by category:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterCategory('All')}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                filterCategory === 'All'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            {CATEGORY_ORDER.map((category) => (
              <button
                key={category}
                onClick={() => setFilterCategory(category)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  filterCategory === category
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Your grocery list is empty
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start adding items or ask Cedar to help plan your shopping!
            </p>
            <AddItemForm />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Add Item Form */}
            <AddItemForm />

            {/* Items by Category */}
            {itemsByCategory.length > 0 ? (
              itemsByCategory.map(({ category, items: categoryItems }) => (
                <div key={category} className="space-y-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    {category} ({categoryItems.length})
                  </h3>
                  <div className="space-y-3">
                    <AnimatePresence>
                      {categoryItems.map((item) => (
                        <GroceryItemCard key={item.id} item={item} />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No items found for the selected category
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      {items.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                Total: ${total.toFixed(2)}
              </div>
              {budget && (
                <div className={`text-sm ${
                  isOverBudget ? 'text-red-600' : 'text-green-600'
                }`}>
                  {isOverBudget ? 'Over budget' : 'Within budget'}
                </div>
              )}
            </div>
            
            <button
              onClick={clearList}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
