import React, { useState } from 'react';
import { Plus, Search, Settings, FileText, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AISidebar } from '@/components/ai/AISidebar';
import { useNotesStore } from '@/store/notesStore';

interface ShoppingList {
  id: string;
  name: string;
  items: any[];
  createdAt: Date;
}

interface NotesLayoutProps {
  children: React.ReactNode;
  currentNotes?: string;
}

export const NotesLayout: React.FC<NotesLayoutProps> = ({ children }) => {
  const [shoppingLists, setShoppingLists] = useState<ShoppingList[]>([
    { id: '1', name: 'Weekly Groceries', items: [], createdAt: new Date() },
    { id: '2', name: 'Party Supplies', items: [], createdAt: new Date() },
    { id: '3', name: 'Healthy Meals', items: [], createdAt: new Date() },
  ]);
  const [activeListId, setActiveListId] = useState('1');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { notes } = useNotesStore();

  const activeList = shoppingLists.find(list => list.id === activeListId);

  return (
    <div className="h-screen bg-amber-50 flex">
      {/* Left Sidebar - Shopping Lists */}
      <motion.div
        initial={false}
        animate={{ width: isSidebarCollapsed ? 60 : 280 }}
        className="bg-amber-100 border-r border-amber-200 flex flex-col"
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-amber-200">
          <div className="flex items-center justify-between">
            {!isSidebarCollapsed && (
              <h2 className="text-lg font-semibold text-amber-900">Shopping Lists</h2>
            )}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1 hover:bg-amber-200 rounded"
            >
              <Settings className="w-4 h-4 text-amber-700" />
            </button>
          </div>
        </div>

        {/* Search */}
        {!isSidebarCollapsed && (
          <div className="p-4 border-b border-amber-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-amber-500" />
              <input
                type="text"
                placeholder="Search lists..."
                className="w-full pl-10 pr-4 py-2 border border-amber-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
              />
            </div>
          </div>
        )}

        {/* Shopping Lists */}
        <div className="flex-1 overflow-y-auto">
          {!isSidebarCollapsed && (
            <div className="p-2">
              {shoppingLists.map((list) => (
                <motion.div
                  key={list.id}
                  whileHover={{ backgroundColor: '#fef3c7' }}
                  className={`p-3 rounded-lg cursor-pointer mb-1 ${
                    activeListId === list.id ? 'bg-green-100 border border-green-300' : 'hover:bg-amber-50'
                  }`}
                  onClick={() => setActiveListId(list.id)}
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="w-4 h-4 text-amber-700" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-amber-900 truncate">{list.name}</p>
                      <p className="text-xs text-amber-600">{list.items.length} items</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Add New List */}
        {!isSidebarCollapsed && (
          <div className="p-4 border-t border-amber-200">
            <button className="w-full flex items-center gap-2 p-2 text-sm text-amber-700 hover:bg-amber-200 rounded-lg">
              <Plus className="w-4 h-4" />
              New List
            </button>
          </div>
        )}
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-amber-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-amber-900">
                {activeList?.name || 'Shopping List'}
              </h1>
              <p className="text-sm text-amber-600">
                {activeList?.items.length || 0} items
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-amber-100 rounded-lg">
                <Search className="w-4 h-4 text-amber-600" />
              </button>
              <button className="p-2 hover:bg-amber-100 rounded-lg">
                <Settings className="w-4 h-4 text-amber-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Notes Editor Area */}
        <div className="flex-1 bg-amber-50">
          {children}
        </div>
      </div>

      {/* AI Sidebar */}
      <AISidebar currentNotes={notes} />
    </div>
  );
};
