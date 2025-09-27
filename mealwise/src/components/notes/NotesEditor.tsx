import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGroceryStore } from '@/store/groceryStore';
import { useCedarStore } from '@/lib/cedarStore';
import { useNotesStore } from '@/store/notesStore';
import { GroceryItemCard } from '@/components/grocery/GroceryItemCard';
import { AddItemForm } from '@/components/grocery/AddItemForm';

export const NotesEditor: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { items, clearList, setBudget } = useGroceryStore();
  const { messages, addMessage } = useCedarStore();
  const { notes, setNotes, updateNotes } = useNotesStore();

  const totalCost = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isEditing]);

  // Listen for AI messages that should update notes
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    console.log('NotesEditor checking message:', lastMessage);
    if (lastMessage && lastMessage.type === 'assistant' && lastMessage.content.includes('NOTES_UPDATE:')) {
      const notesUpdate = lastMessage.content.replace('NOTES_UPDATE:', '').trim();
      console.log('Updating notes with:', notesUpdate);
      updateNotes(notesUpdate);
    }
  }, [messages, updateNotes]);

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNotes(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
    
    // Auto-format as list with dashes
    if (e.key === 'Enter') {
      e.preventDefault();
      const textarea = e.target as HTMLTextAreaElement;
      const cursorPos = textarea.selectionStart;
      const textBeforeCursor = notes.substring(0, cursorPos);
      const textAfterCursor = notes.substring(cursorPos);
      
      // Check if we're at the start of a line or after a dash
      const lines = textBeforeCursor.split('\n');
      const currentLine = lines[lines.length - 1];
      
      // If current line doesn't start with dash, add one
      if (!currentLine.trim().startsWith('-')) {
        const newText = textBeforeCursor + '- ' + textAfterCursor;
        setNotes(newText);
        
        // Set cursor position after the dash and space
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.setSelectionRange(cursorPos + 2, cursorPos + 2);
          }
        }, 0);
      } else {
        // Just add a new line with dash
        const newText = textBeforeCursor + '\n- ' + textAfterCursor;
        setNotes(newText);
        
        // Set cursor position after the new dash
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.setSelectionRange(cursorPos + 3, cursorPos + 3);
          }
        }, 0);
      }
    }
  };

  return (
    <div className="h-full flex">
      {/* Main Notes Area */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Notes Editor */}
          <div className="mb-8">
            <div className="bg-white rounded-lg border border-amber-200 shadow-sm">
              <div className="p-4 border-b border-amber-200">
                <h3 className="text-lg font-medium text-amber-900">Notes</h3>
              </div>
              <div className="p-4">
                {isEditing ? (
                  <textarea
                    ref={textareaRef}
                    value={notes}
                    onChange={handleNotesChange}
                    onKeyDown={handleKeyDown}
                    onBlur={() => setIsEditing(false)}
                    placeholder="Write your notes here..."
                    className="w-full h-64 resize-none border-none outline-none text-amber-900 placeholder-amber-500"
                    style={{ fontFamily: 'inherit' }}
                  />
                ) : (
                  <div
                    onClick={() => setIsEditing(true)}
                    className="w-full h-64 p-0 border-none outline-none text-amber-900 cursor-text"
                    style={{ fontFamily: 'inherit' }}
                  >
                    {notes || (
                      <span className="text-amber-500">Click to start writing your notes...</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Shopping List Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-amber-900">Shopping Items</h3>
              <div className="flex items-center gap-4">
                <span className="text-sm text-amber-700">
                  Total: <span className="font-semibold">${totalCost.toFixed(2)}</span>
                </span>
                <button
                  onClick={clearList}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Add Item Form */}
            <div className="bg-white rounded-lg border border-amber-200 shadow-sm">
              <AddItemForm />
            </div>

            {/* Items List */}
            <div className="space-y-2">
              {items.length === 0 ? (
                <div className="text-center py-12 text-amber-600">
                  <p>No items in your shopping list yet.</p>
                  <p className="text-sm">Add items manually or ask the AI assistant for help!</p>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    <GroceryItemCard item={item} />
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
