import React, { useState } from 'react';
import { useGroceryStore } from '@/store/groceryStore';
import { GroceryCategory } from '@/types/grocery';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

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

export const AddItemForm: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    quantity: 1,
    price: 0,
    category: 'Other' as GroceryCategory,
    brand: '',
    notes: '',
  });

  const { addItem } = useGroceryStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim()) {
      addItem(formData);
      setFormData({
        name: '',
        quantity: 1,
        price: 0,
        category: 'Other',
        brand: '',
        notes: '',
      });
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      quantity: 1,
      price: 0,
      category: 'Other',
      brand: '',
      notes: '',
    });
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-amber-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors"
      >
        <Plus className="w-4 h-4 text-amber-500" />
        <span className="text-amber-700 font-medium text-sm">
          Add New Item
        </span>
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-white rounded-lg border border-amber-200 p-4"
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Item name"
            className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
            autoFocus
          />
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <input
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
            placeholder="Qty"
            className="px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            placeholder="Price"
            className="px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as GroceryCategory })}
            className="px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            {Object.keys(CATEGORY_COLORS).map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            Add
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="px-3 py-2 bg-amber-200 text-amber-700 rounded-md hover:bg-amber-300 transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  );
};
