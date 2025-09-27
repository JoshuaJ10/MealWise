import React, { useState } from 'react';
import { GroceryItem, GroceryCategory } from '@/types/grocery';
import { useGroceryStore } from '@/store/groceryStore';
import { Edit2, Trash2, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface GroceryItemCardProps {
  item: GroceryItem;
}

const CATEGORY_COLORS: Record<GroceryCategory, string> = {
  Produce: 'bg-green-100 text-green-800 border-green-200',
  Dairy: 'bg-blue-100 text-blue-800 border-blue-200',
  Frozen: 'bg-purple-100 text-purple-800 border-purple-200',
  Pantry: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  Meat: 'bg-red-100 text-red-800 border-red-200',
  Bakery: 'bg-orange-100 text-orange-800 border-orange-200',
  Beverages: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  Snacks: 'bg-pink-100 text-pink-800 border-pink-200',
  Other: 'bg-gray-100 text-gray-800 border-gray-200',
};

export const GroceryItemCard: React.FC<GroceryItemCardProps> = ({ item }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: item.name,
    quantity: item.quantity,
    price: item.price,
    category: item.category,
    brand: item.brand || '',
    notes: item.notes || '',
  });

  const { updateItem, removeItem, toggleItem } = useGroceryStore();

  const handleSave = () => {
    updateItem(item.id, editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      category: item.category,
      brand: item.brand || '',
      notes: item.notes || '',
    });
    setIsEditing(false);
  };

  const handleToggle = () => {
    toggleItem(item.id);
  };

  const handleDelete = () => {
    removeItem(item.id);
  };

  const categoryColor = CATEGORY_COLORS[item.category];

  if (isEditing) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 shadow-sm"
      >
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Item Name
            </label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Quantity
              </label>
              <input
                type="number"
                min="1"
                value={editForm.quantity}
                onChange={(e) => setEditForm({ ...editForm, quantity: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={editForm.price}
                onChange={(e) => setEditForm({ ...editForm, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              value={editForm.category}
              onChange={(e) => setEditForm({ ...editForm, category: e.target.value as GroceryCategory })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {Object.keys(CATEGORY_COLORS).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Brand (optional)
            </label>
            <input
              type="text"
              value={editForm.brand}
              onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Notes (optional)
            </label>
            <textarea
              value={editForm.notes}
              onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <Check className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`bg-white rounded-lg border border-amber-200 p-3 transition-all duration-200 ${
        item.isChecked ? 'opacity-50 line-through bg-amber-50' : 'hover:shadow-sm'
      }`}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={handleToggle}
          className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
            item.isChecked
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-gray-300 hover:border-green-400'
          }`}
        >
          {item.isChecked && <Check className="w-2.5 h-2.5" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`font-medium text-amber-900 truncate ${
              item.isChecked ? 'line-through' : ''
            }`}>
              {item.name}
            </h3>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${categoryColor}`}>
              {item.category}
            </span>
          </div>
          
          <div className="flex items-center gap-3 text-sm text-amber-600 mt-0.5">
            <span>{item.quantity}x</span>
            <span>${item.price.toFixed(2)} each</span>
            <span className="font-medium text-amber-900">
              ${(item.price * item.quantity).toFixed(2)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
