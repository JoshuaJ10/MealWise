import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Sparkles, MessageSquare, Minimize2 } from 'lucide-react';
import { useCedarStore } from '@/lib/cedarStore';
import { useGroceryStore } from '@/store/groceryStore';
import { openaiService } from '@/services/openaiService';

interface AISidebarProps {
  currentNotes?: string;
}

export const AISidebar: React.FC<AISidebarProps> = ({ currentNotes = '' }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { messages, addMessage } = useCedarStore();
  const { items, addItemsFromApi } = useGroceryStore();

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSubmit = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setIsProcessing(true);

    // Add user message to chat
    addMessage({
      type: 'user',
      content: userMessage,
    });

    try {
      // Process the message with OpenAI for both notes and grocery list
      const response = await openaiService.processNotesAndGrocery(userMessage, items, currentNotes);
      
      console.log('AI Response:', response);
      
      // Update grocery list if items were added
      if (response.items && response.items.length > 0) {
        console.log('Adding items to grocery list:', response.items);
        addItemsFromApi(response.items);
      }
      
      // Update notes if there's a notes update
      if (response.notesUpdate) {
        console.log('Updating notes with:', response.notesUpdate);
        addMessage({
          type: 'assistant',
          content: `NOTES_UPDATE:${response.notesUpdate}`,
        });
      }
      
      // Add regular chat response
      addMessage({
        type: 'assistant',
        content: response.message || 'I understand your request. How else can I help?',
      });
      
    } catch (error) {
      console.error('Error processing message:', error);
      addMessage({
        type: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
      });
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

  return (
    <motion.div
      initial={false}
      animate={{ width: isExpanded ? 400 : 60 }}
      className="bg-amber-50 border-l border-amber-200 flex flex-col h-full"
    >
      {/* Header */}
      <div className="p-4 border-b border-amber-200">
        <div className="flex items-center justify-between">
          {isExpanded && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-green-600" />
              </div>
              <span className="font-medium text-amber-900">AI Assistant</span>
            </div>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-amber-100 rounded-lg"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4 text-amber-600" /> : <MessageSquare className="w-4 h-4 text-amber-600" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-sm text-amber-700 mb-3">How can I help with your shopping?</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => setInputValue(action.prompt)}
                      className="text-xs bg-green-100 hover:bg-green-200 rounded-lg px-3 py-2 text-green-800"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.slice(-6).map((message, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg text-sm ${
                    message.type === 'user'
                      ? 'bg-green-100 text-green-900 ml-8'
                      : 'bg-amber-100 text-amber-900 mr-8'
                  }`}
                >
                  {message.content}
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-amber-200">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 px-3 py-2 border border-amber-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                disabled={isProcessing}
              />
              <button
                onClick={handleSubmit}
                disabled={!inputValue.trim() || isProcessing}
                className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};
