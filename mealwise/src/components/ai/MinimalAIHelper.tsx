import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Sparkles, MessageSquare } from 'lucide-react';
import { useCedarStore } from '@/lib/cedarStore';
import { useGroceryStore } from '@/store/groceryStore';
import { openaiService } from '@/services/openaiService';

export const MinimalAIHelper: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
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
      // Process the message with OpenAI
      const response = await openaiService.generateGroceryList(userMessage, items);
      
      if (response.items.length > 0) {
        // Add items to grocery list
        addItemsFromApi(response.items);
        
        // Add AI response to chat
        addMessage({
          type: 'assistant',
          content: `✅ **${response.message}**\n\n**Added ${response.items.length} items:**\n${response.items.map(item => `• ${item.name} (${item.quantity}x) - $${item.price.toFixed(2)} each`).join('\n')}\n\n**Total Cost: $${response.totalCost.toFixed(2)}**`,
        });
      } else {
        // Add AI response without items
        addMessage({
          type: 'assistant',
          content: response.message || 'I understand your request. How else can I help with your grocery list?',
        });
      }
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
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-96 max-h-96 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                </div>
                <span className="font-medium text-gray-900">AI Assistant</span>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-48">
              {messages.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 mb-3">How can I help with your shopping?</p>
                  <div className="grid grid-cols-2 gap-2">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={() => setInputValue(action.prompt)}
                        className="text-xs bg-gray-100 hover:bg-gray-200 rounded-lg px-3 py-2 text-gray-700"
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.slice(-4).map((message, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg text-sm ${
                      message.type === 'user'
                        ? 'bg-blue-50 text-blue-900 ml-8'
                        : 'bg-gray-50 text-gray-900 mr-8'
                    }`}
                  >
                    {message.content}
                  </div>
                ))
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isProcessing}
                />
                <button
                  onClick={handleSubmit}
                  disabled={!inputValue.trim() || isProcessing}
                  className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      {!isExpanded && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(true)}
          className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center"
        >
          <MessageSquare className="w-6 h-6" />
        </motion.button>
      )}
    </div>
  );
};
