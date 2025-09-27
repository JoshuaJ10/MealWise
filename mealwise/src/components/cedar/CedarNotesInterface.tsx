import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Sparkles, Save } from 'lucide-react';
import { useNotesStore } from '@/store/notesStore';

export const CedarNotesInterface: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { notes, updateNotes, currentNoteTitle, setCurrentNoteTitle, saveCurrentNote } = useNotesStore();

  const handleSubmit = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsProcessing(true);

    try {
      // Call the API directly and get the notes content
      const response = await fetch('/api/openai-notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userMessage,
          currentItems: [],
          currentNotes: notes,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // Get the plain text response (the notes content)
      const notesContent = await response.text();
      
      // Update the notes with the clean content
      updateNotes(notesContent);
      
    } catch (error) {
      console.error('Error processing message:', error);
      // Show error in notes
      updateNotes(notes + '\n\n[Error: ' + error.message + ']');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const quickActions = [
    { label: 'Plan meals', prompt: 'Plan 5 dinners for $80' },
    { label: 'Add snacks', prompt: 'Add healthy snacks under $15' },
    { label: 'Vegetarian', prompt: 'Make this vegetarian' },
    { label: 'Budget', prompt: 'Help me stay under $100' },
  ];

  const handleSaveNote = () => {
    if (notes.trim()) {
      saveCurrentNote();
    }
  };

  return (
    <div className="h-screen bg-amber-50 flex flex-col">
      {/* Main Content - Notes Area */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Notes Editor */}
          <div className="bg-white rounded-lg border border-amber-200 shadow-sm h-[calc(100vh-200px)]">
            <div className="p-4 border-b border-amber-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-medium text-amber-900">Notes</h3>
                <input
                  type="text"
                  value={currentNoteTitle}
                  onChange={(e) => setCurrentNoteTitle(e.target.value)}
                  className="px-3 py-1 text-sm border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                  placeholder="Note title..."
                />
              </div>
              <button
                onClick={handleSaveNote}
                disabled={!notes.trim()}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Save className="w-4 h-4" />
                Save Note
              </button>
            </div>
            <div className="p-4 h-full">
              <textarea
                value={notes}
                onChange={(e) => updateNotes(e.target.value)}
                placeholder="Your notes will be controlled by AI. Type a request below to get started..."
                className="w-full h-full resize-none border-none outline-none text-amber-900 placeholder-amber-500 text-sm leading-relaxed"
                style={{ 
                  fontFamily: 'inherit',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  whiteSpace: 'pre-wrap'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* AI Input - Fixed at bottom */}
      <div className="bg-white border-t border-amber-200 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Quick Actions */}
          <div className="flex flex-wrap gap-2 mb-3">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => setInputValue(action.prompt)}
                className="text-xs bg-green-100 hover:bg-green-200 rounded-lg px-3 py-2 text-green-800 transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>

          {/* Input Field */}
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask AI to control your notes... (e.g., 'Plan 5 dinners for $80', 'Add shopping list', 'Create meal plan')"
              className="flex-1 px-4 py-3 border border-amber-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
              disabled={isProcessing}
            />
            <button
              onClick={handleSubmit}
              disabled={!inputValue.trim() || isProcessing}
              className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
