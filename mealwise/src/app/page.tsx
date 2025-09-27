'use client';

import React from 'react';
import { GrocerySidePanel } from '@/components/cedar/GrocerySidePanel';
import { GroceryList } from '@/components/grocery/GroceryList';
import { DemoInstructions } from '@/components/demo/DemoInstructions';
import { ShoppingCart, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <GrocerySidePanel
      side="right"
      title="Grocery Copilot"
      collapsedLabel="Ask me to plan your shopping!"
      dimensions={{
        width: 500,
        minWidth: 400,
        maxWidth: 600,
      }}
      className="h-screen"
    >
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  MealWise
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  AI-powered grocery shopping copilot
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Sparkles className="w-4 h-4" />
              <span>Powered by CedarOS</span>
            </div>
          </div>
        </div>

        {/* Demo Instructions */}
        <div className="p-6">
          <DemoInstructions />
        </div>

        {/* Main Content */}
        <div className="h-[calc(100vh-200px)]">
          <GroceryList />
        </div>
      </div>
    </GrocerySidePanel>
  );
}
