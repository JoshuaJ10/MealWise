import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, MessageSquare, ShoppingCart, DollarSign } from 'lucide-react';

export const DemoInstructions: React.FC = () => {
  const demoPrompts = [
    "Plan 5 dinners for $80",
    "Add snacks under $10", 
    "Set budget to $100",
    "Make this vegetarian",
    "Add milk and bread"
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <Lightbulb className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Try These Commands
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Click the chat button to open the AI copilot
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        {demoPrompts.map((prompt, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors text-left"
          >
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                "{prompt}"
              </span>
            </div>
          </motion.button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
          <ShoppingCart className="w-6 h-6 text-green-500 mx-auto mb-2" />
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            Smart Lists
          </div>
          <div className="text-xs text-gray-500">
            AI-powered meal planning
          </div>
        </div>
        
        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
          <DollarSign className="w-6 h-6 text-blue-500 mx-auto mb-2" />
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            Budget Tracking
          </div>
          <div className="text-xs text-gray-500">
            Real-time cost monitoring
          </div>
        </div>
        
        <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
          <MessageSquare className="w-6 h-6 text-purple-500 mx-auto mb-2" />
          <div className="text-sm font-medium text-gray-900 dark:text-white">
            Natural Language
          </div>
          <div className="text-xs text-gray-500">
            Talk to your shopping list
          </div>
        </div>
      </div>
    </motion.div>
  );
};
