import React, { useEffect, useState } from 'react';
import { useCedarStore } from '@/lib/cedarStore';
import { useGroceryStore } from '@/store/groceryStore';
import { openaiService } from '@/services/openaiService';
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
      content: `Planning ${servings} servings for $${budget}... Let me create a meal plan for you!`,
    });

    try {
      const response = await openaiService.getMealPlan(budget, servings);
      
      if (response.items.length > 0) {
        addItemsFromApi(response.items);
        
        addMessage({
          type: 'assistant',
          content: `✅ **Meal Plan Created!**\n\n${response.message}\n\n**Total Cost: $${response.totalCost.toFixed(2)}**\n**Budget: $${budget}**\n**Remaining: $${(budget - response.totalCost).toFixed(2)}**\n\nI've added ${response.items.length} items to your grocery list!`,
        });
      } else {
        addMessage({
          type: 'assistant',
          content: response.message || 'I created a meal plan for you, but no specific items were added to your list.',
        });
      }
    } catch (error) {
      addMessage({
        type: 'assistant',
        content: 'Sorry, I encountered an error while planning your meals. Please try again or check your API configuration.',
      });
    }
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
    try {
      const response = await openaiService.generateGroceryList(message, items);
      
      if (response.items.length > 0) {
        addItemsFromApi(response.items);
        addMessage({
          type: 'assistant',
          content: `🛒 **Added ${response.items.length} items to your list!**\n\n${response.message}\n\n${response.items.map(item => `• ${item.name} (${item.quantity}x) - $${item.price.toFixed(2)} each`).join('\n')}`,
        });
      } else {
        addMessage({
          type: 'assistant',
          content: response.message || 'I\'d be happy to add items to your list! Try saying something like:\n\n• "Add milk and bread"\n• "Get chicken and rice"\n• "Add some vegetables"',
        });
      }
    } catch (error) {
      addMessage({
        type: 'assistant',
        content: 'Sorry, I encountered an error while adding items. Please try again.',
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
    try {
      const response = await openaiService.modifyList(message, items);
      
      if (response.items.length > 0) {
        // Remove items that match the swap pattern
        const itemsToRemove = items.filter(item => 
          message.toLowerCase().includes(item.name.toLowerCase())
        );
        itemsToRemove.forEach(item => removeItem(item.id));
        
        // Add new items
        addItemsFromApi(response.items);
        
        addMessage({
          type: 'assistant',
          content: `🔄 **Items swapped!**\n\n${response.message}`,
        });
      } else {
        addMessage({
          type: 'assistant',
          content: response.message || 'I couldn\'t find items to swap. Please specify which items you\'d like to replace.',
        });
      }
    } catch (error) {
      addMessage({
        type: 'assistant',
        content: 'Sorry, I encountered an error while swapping items. Please try again.',
      });
    }
  };

  const handleDietaryRestrictions = async (message: string) => {
    try {
      const response = await openaiService.modifyList(message, items);
      
      if (response.items.length > 0) {
        // Remove non-compliant items
        const itemsToRemove = items.filter(item => 
          item.category === 'Meat' && (message.includes('vegetarian') || message.includes('vegan'))
        );
        itemsToRemove.forEach(item => removeItem(item.id));
        
        // Add compliant alternatives
        addItemsFromApi(response.items);
        
        addMessage({
          type: 'assistant',
          content: `🌱 **Dietary preferences applied!**\n\n${response.message}`,
        });
      } else {
        addMessage({
          type: 'assistant',
          content: response.message || 'Your list is already compliant with your dietary preferences!',
        });
      }
    } catch (error) {
      addMessage({
        type: 'assistant',
        content: 'Sorry, I encountered an error while applying dietary restrictions. Please try again.',
      });
    }
  };

  const handleSnacksRequest = async (message: string) => {
    try {
      const response = await openaiService.generateGroceryList(message, items);
      
      if (response.items.length > 0) {
        addItemsFromApi(response.items);
        
        addMessage({
          type: 'assistant',
          content: `🍿 **Added snacks to your list!**\n\n${response.message}\n\n${response.items.map(item => `• ${item.name} (${item.quantity}x) - $${item.price.toFixed(2)} each`).join('\n')}`,
        });
      } else {
        addMessage({
          type: 'assistant',
          content: response.message || 'I couldn\'t find suitable snacks. Try adjusting your budget or preferences!',
        });
      }
    } catch (error) {
      addMessage({
        type: 'assistant',
        content: 'Sorry, I encountered an error while adding snacks. Please try again.',
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
