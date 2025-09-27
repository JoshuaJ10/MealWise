import React, { useEffect, useState } from 'react';
import { useCedarStore } from '@/lib/cedarStore';
import { useGroceryStore } from '@/store/groceryStore';
import { groceryApi } from '@/services/groceryApi';
import { GroceryCategory } from '@/types/grocery';
import { motion } from 'framer-motion';
import { ShoppingCart, DollarSign, Target, ChefHat, Sparkles } from 'lucide-react';

interface GroceryCedarChatProps {
  className?: string;
}

export const GroceryCedarChat: React.FC<GroceryCedarChatProps> = ({ className = '' }) => {
  const { messages, addMessage } = useCedarStore();
  const { 
    items, 
    total, 
    budget, 
    addItemsFromApi, 
    replaceList, 
    addItem, 
    updateItem, 
    removeItem,
    setBudget,
    getItemsByCategory 
  } = useGroceryStore();
  
  const [isProcessing, setIsProcessing] = useState(false);

  // Process messages and handle grocery-related commands
  useEffect(() => {
    const latestMessage = messages[messages.length - 1];
    if (!latestMessage || latestMessage.type !== 'user') return;

    const userMessage = latestMessage.content.toLowerCase();
    setIsProcessing(true);

    // Handle different types of requests
    const handleGroceryRequest = async () => {
      try {
        // Meal planning requests
        if (userMessage.includes('plan') && (userMessage.includes('meal') || userMessage.includes('dinner') || userMessage.includes('lunch'))) {
          await handleMealPlanning(userMessage);
        }
        // Budget-related requests
        else if (userMessage.includes('budget') || userMessage.includes('$')) {
          await handleBudgetRequest(userMessage);
        }
        // Add specific items
        else if (userMessage.includes('add') || userMessage.includes('get')) {
          await handleAddItems(userMessage);
        }
        // Remove items
        else if (userMessage.includes('remove') || userMessage.includes('delete')) {
          await handleRemoveItems(userMessage);
        }
        // Swap items
        else if (userMessage.includes('swap') || userMessage.includes('replace')) {
          await handleSwapItems(userMessage);
        }
        // Vegetarian/vegan requests
        else if (userMessage.includes('vegetarian') || userMessage.includes('vegan')) {
          await handleDietaryRestrictions(userMessage);
        }
        // Snacks requests
        else if (userMessage.includes('snack')) {
          await handleSnacksRequest(userMessage);
        }
        // General help
        else if (userMessage.includes('help') || userMessage.includes('what can you do')) {
          await handleHelpRequest();
        }
        else {
          await handleGeneralRequest(userMessage);
        }
      } catch (error) {
        console.error('Error processing grocery request:', error);
        addMessage({
          type: 'assistant',
          content: 'Sorry, I encountered an error processing your request. Please try again.',
        });
      } finally {
        setIsProcessing(false);
      }
    };

    handleGroceryRequest();
  }, [messages]);

  const handleMealPlanning = async (message: string) => {
    // Extract budget and servings from message
    const budgetMatch = message.match(/\$(\d+)/);
    const servingsMatch = message.match(/(\d+)\s*(servings?|people)/);
    
    const budget = budgetMatch ? parseInt(budgetMatch[1]) : 60;
    const servings = servingsMatch ? parseInt(servingsMatch[1]) : 4;

    addMessage({
      type: 'assistant',
      content: `Planning ${servings} servings for $${budget}... Let me find some great meal options for you!`,
    });

    const mealProducts = await groceryApi.getMealPlanProducts({
      budget,
      servings,
    });

    const groceryItems = groceryApi.convertToGroceryItems(mealProducts, [1, 1, 1, 1, 1, 1, 1, 1]);
    const totalCost = groceryItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    addItemsFromApi(groceryItems);

    addMessage({
      type: 'assistant',
      content: `✅ **Meal Plan Created!**\n\nI've added ${groceryItems.length} items to your list for ${servings} servings.\n\n**Total Cost: $${totalCost.toFixed(2)}**\n**Budget: $${budget}**\n**Remaining: $${(budget - totalCost).toFixed(2)}**\n\nItems include proteins, vegetables, grains, and pantry staples for a complete meal!`,
    });
  };

  const handleBudgetRequest = async (message: string) => {
    const budgetMatch = message.match(/\$(\d+)/);
    if (budgetMatch) {
      const newBudget = parseInt(budgetMatch[1]);
      setBudget(newBudget);
      
      addMessage({
        type: 'assistant',
        content: `💰 **Budget Set to $${newBudget}**\n\nYour grocery list total is currently $${total.toFixed(2)}.\n\n${total > newBudget ? `⚠️ You're over budget by $${(total - newBudget).toFixed(2)}` : `✅ You have $${(newBudget - total).toFixed(2)} remaining`}`,
      });
    } else {
      addMessage({
        type: 'assistant',
        content: `💰 **Current Budget Status**\n\n**Budget:** ${budget ? `$${budget}` : 'Not set'}\n**Current Total:** $${total.toFixed(2)}\n\n${budget ? (total > budget ? `⚠️ Over budget by $${(total - budget).toFixed(2)}` : `✅ $${(budget - total).toFixed(2)} remaining`) : 'Set a budget to track your spending!'}`,
      });
    }
  };

  const handleAddItems = async (message: string) => {
    // Extract item names from the message
    const itemsToAdd = [];
    
    // Common grocery items to look for
    const commonItems = [
      'milk', 'bread', 'eggs', 'chicken', 'beef', 'fish', 'rice', 'pasta',
      'apples', 'bananas', 'carrots', 'onions', 'potatoes', 'cheese',
      'yogurt', 'butter', 'oil', 'salt', 'pepper', 'garlic'
    ];

    for (const item of commonItems) {
      if (message.includes(item)) {
        const products = await groceryApi.searchProducts(item, { maxPrice: 10 });
        if (products.length > 0) {
          const groceryItem = groceryApi.convertToGroceryItems([products[0]])[0];
          itemsToAdd.push(groceryItem);
        }
      }
    }

    if (itemsToAdd.length > 0) {
      addItemsFromApi(itemsToAdd);
      addMessage({
        type: 'assistant',
        content: `🛒 **Added ${itemsToAdd.length} items to your list!**\n\n${itemsToAdd.map(item => `• ${item.name} - $${item.price.toFixed(2)}`).join('\n')}`,
      });
    } else {
      addMessage({
        type: 'assistant',
        content: `I'd be happy to add items to your list! Try saying something like:\n\n• "Add milk and bread"\n• "Get chicken and rice"\n• "Add some vegetables"`,
      });
    }
  };

  const handleRemoveItems = async (message: string) => {
    const itemsToRemove = items.filter(item => 
      message.toLowerCase().includes(item.name.toLowerCase())
    );

    if (itemsToRemove.length > 0) {
      itemsToRemove.forEach(item => removeItem(item.id));
      addMessage({
        type: 'assistant',
        content: `🗑️ **Removed ${itemsToRemove.length} items from your list**\n\n${itemsToRemove.map(item => `• ${item.name}`).join('\n')}`,
      });
    } else {
      addMessage({
        type: 'assistant',
        content: `I couldn't find those items in your list. Current items:\n\n${items.map(item => `• ${item.name}`).join('\n')}`,
      });
    }
  };

  const handleSwapItems = async (message: string) => {
    // Extract items to swap
    const swapMatch = message.match(/swap\s+(\w+)\s+for\s+(\w+)/i);
    if (swapMatch) {
      const [, fromItem, toItem] = swapMatch;
      const existingItem = items.find(item => 
        item.name.toLowerCase().includes(fromItem.toLowerCase())
      );

      if (existingItem) {
        const newProducts = await groceryApi.searchProducts(toItem, { maxPrice: existingItem.price * 1.5 });
        if (newProducts.length > 0) {
          const newItem = groceryApi.convertToGroceryItems([newProducts[0]])[0];
          removeItem(existingItem.id);
          addItem(newItem);
          
          addMessage({
            type: 'assistant',
            content: `🔄 **Swapped items!**\n\n**Removed:** ${existingItem.name}\n**Added:** ${newItem.name} - $${newItem.price.toFixed(2)}`,
          });
        }
      }
    }
  };

  const handleDietaryRestrictions = async (message: string) => {
    const isVegetarian = message.includes('vegetarian');
    const isVegan = message.includes('vegan');

    // Remove meat items for vegetarian/vegan
    const meatItems = items.filter(item => item.category === 'Meat');
    if (meatItems.length > 0) {
      meatItems.forEach(item => removeItem(item.id));
    }

    // Add vegetarian alternatives
    const alternatives = await groceryApi.searchProducts('tofu', { maxPrice: 5 });
    if (alternatives.length > 0) {
      const tofuItem = groceryApi.convertToGroceryItems([alternatives[0]])[0];
      addItem(tofuItem);
    }

    addMessage({
      type: 'assistant',
      content: `🌱 **Made your list ${isVegan ? 'vegan' : 'vegetarian'}!**\n\n${meatItems.length > 0 ? `Removed ${meatItems.length} meat items and added vegetarian alternatives.` : 'Your list is already vegetarian-friendly!'}`,
    });
  };

  const handleSnacksRequest = async (message: string) => {
    const budgetMatch = message.match(/\$(\d+)/);
    const maxPrice = budgetMatch ? parseInt(budgetMatch[1]) : 10;

    const snackProducts = await groceryApi.getProductsByCategory('Snacks');
    const affordableSnacks = snackProducts.filter(p => p.price <= maxPrice).slice(0, 3);
    
    if (affordableSnacks.length > 0) {
      const snackItems = groceryApi.convertToGroceryItems(affordableSnacks);
      addItemsFromApi(snackItems);
      
      addMessage({
        type: 'assistant',
        content: `🍿 **Added snacks under $${maxPrice}!**\n\n${snackItems.map(item => `• ${item.name} - $${item.price.toFixed(2)}`).join('\n')}`,
      });
    } else {
      addMessage({
        type: 'assistant',
        content: `I couldn't find snacks under $${maxPrice}. Try increasing your budget or I can suggest some cheaper alternatives!`,
      });
    }
  };

  const handleHelpRequest = async () => {
    addMessage({
      type: 'assistant',
      content: `🛒 **Grocery Copilot Commands**\n\n**Meal Planning:**\n• "Plan 5 dinners for $80"\n• "Plan meals for 4 people under $60"\n\n**Budget Management:**\n• "Set budget to $100"\n• "How am I doing on budget?"\n\n**Adding Items:**\n• "Add milk and bread"\n• "Get chicken and vegetables"\n\n**Modifications:**\n• "Remove chicken"\n• "Swap beef for tofu"\n• "Make this vegetarian"\n\n**Snacks & Extras:**\n• "Add snacks under $10"\n• "Find budget alternatives"\n\nI can help you plan meals, manage your budget, and find the best deals!`,
    });
  };

  const handleGeneralRequest = async (message: string) => {
    addMessage({
      type: 'assistant',
      content: `I'm your grocery shopping copilot! I can help you:\n\n• Plan meals and create shopping lists\n• Manage your budget and find deals\n• Add, remove, or swap items\n• Find vegetarian/vegan alternatives\n• Suggest snacks and extras\n\nTry saying "Plan a week of meals for $80" or "Add some snacks under $10"!`,
    });
  };

  return (
    <div className={`h-full flex flex-col ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Grocery Copilot</h2>
            <p className="text-blue-100 text-sm">Your AI shopping assistant</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => addMessage({ type: 'user', content: 'Plan 5 dinners for $80' })}
            className="flex items-center gap-2 p-3 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-left"
          >
            <ChefHat className="w-4 h-4 text-orange-500" />
            <div>
              <div className="font-medium text-sm">Meal Planning</div>
              <div className="text-xs text-gray-500">Plan dinners</div>
            </div>
          </button>
          
          <button
            onClick={() => addMessage({ type: 'user', content: 'Add snacks under $10' })}
            className="flex items-center gap-2 p-3 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-left"
          >
            <ShoppingCart className="w-4 h-4 text-green-500" />
            <div>
              <div className="font-medium text-sm">Add Snacks</div>
              <div className="text-xs text-gray-500">Budget friendly</div>
            </div>
          </button>
          
          <button
            onClick={() => addMessage({ type: 'user', content: 'Set budget to $100' })}
            className="flex items-center gap-2 p-3 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-left"
          >
            <DollarSign className="w-4 h-4 text-green-500" />
            <div>
              <div className="font-medium text-sm">Set Budget</div>
              <div className="text-xs text-gray-500">Track spending</div>
            </div>
          </button>
          
          <button
            onClick={() => addMessage({ type: 'user', content: 'Make this vegetarian' })}
            className="flex items-center gap-2 p-3 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-left"
          >
            <Target className="w-4 h-4 text-purple-500" />
            <div>
              <div className="font-medium text-sm">Dietary</div>
              <div className="text-xs text-gray-500">Vegetarian/vegan</div>
            </div>
          </button>
        </div>
      </div>

      {/* Processing Indicator */}
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium">Processing your request...</span>
          </div>
        </motion.div>
      )}

      {/* List Summary */}
      <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {items.length}
            </div>
            <div className="text-xs text-gray-500">Items</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              ${total.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">Total</div>
          </div>
          <div>
            <div className={`text-2xl font-bold ${budget && total > budget ? 'text-red-600' : 'text-blue-600'}`}>
              {budget ? `$${budget}` : '--'}
            </div>
            <div className="text-xs text-gray-500">Budget</div>
          </div>
        </div>
      </div>
    </div>
  );
};
