import React, { useState, useCallback } from 'react';
import { useCedarStore } from '@/lib/cedarStore';
import { useGroceryStore } from '@/store/groceryStore';
import { openaiService } from '@/services/openaiService';
import { SendHorizonal, Mic, Code, Image } from 'lucide-react';
import { motion } from 'framer-motion';
import Container3DButton from '@/cedar/components/containers/Container3DButton';

interface GroceryChatInputProps {
  onFocus?: () => void;
  onBlur?: () => void;
  isInputFocused?: boolean;
  className?: string;
}

export const GroceryChatInput: React.FC<GroceryChatInputProps> = ({
  onFocus,
  onBlur,
  isInputFocused,
  className = '',
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { addMessage } = useCedarStore();
  const { items, addItemsFromApi } = useGroceryStore();

  const handleSubmit = useCallback(async () => {
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
  }, [inputValue, isProcessing, items, addMessage, addItemsFromApi]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFocus = () => {
    onFocus?.();
  };

  const handleBlur = () => {
    onBlur?.();
  };

  return (
    <div className={`bg-gray-800/10 dark:bg-gray-600/80 rounded-lg p-3 text-sm ${className}`}>
      {/* Quick action buttons */}
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          onClick={() => setInputValue('Plan 5 dinners for $80')}
          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
        >
          Plan Meals
        </button>
        <button
          onClick={() => setInputValue('Add snacks under $10')}
          className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
        >
          Add Snacks
        </button>
        <button
          onClick={() => setInputValue('Make this vegetarian')}
          className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded-full hover:bg-purple-200 transition-colors"
        >
          Vegetarian
        </button>
        <button
          onClick={() => setInputValue('Add milk and bread')}
          className="px-3 py-1 text-xs bg-orange-100 text-orange-700 rounded-full hover:bg-orange-200 transition-colors"
        >
          Add Items
        </button>
      </div>

      {/* Input area */}
      <div className="relative w-full h-fit">
        <textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Ask me to plan your shopping... (e.g., 'Plan 5 dinners for $80', 'Add snacks under $10')"
          className="w-full min-h-[40px] max-h-[120px] resize-none border-none outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          style={{
            fontSize: '14px',
            lineHeight: '1.5',
          }}
          disabled={isProcessing}
        />
      </div>

      {/* Bottom toolbar */}
      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
            title="Voice input (coming soon)"
          >
            <Mic className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
            title="Add image (coming soon)"
          >
            <Image className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
            title="Code input (coming soon)"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>

        <Container3DButton
          onClick={handleSubmit}
          disabled={!inputValue.trim() || isProcessing}
          color={inputValue.trim() && !isProcessing ? '#3b82f6' : undefined}
          className="flex items-center flex-shrink-0 ml-auto -mt-0.5 rounded-full bg-white dark:bg-gray-800"
          childClassName="p-1.5"
        >
          <motion.div
            animate={{ 
              rotate: inputValue.trim() && !isProcessing ? -90 : 0,
              opacity: inputValue.trim() && !isProcessing ? 1 : 0.5 
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            {isProcessing ? (
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            ) : (
              <SendHorizonal className="w-4 h-4" />
            )}
          </motion.div>
        </Container3DButton>
      </div>
    </div>
  );
};
