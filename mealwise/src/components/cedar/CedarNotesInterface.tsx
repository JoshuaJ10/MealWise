import React, { useState, useRef } from 'react';
import { Send, Save, ShoppingCart, FileText } from 'lucide-react';
import { useNotesStore } from '@/store/notesStore';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { StoreSidebar } from '@/components/layout/StoreSidebar';

export const CedarNotesInterface: React.FC = () => {
  const { user } = useAuthStore();
  const router = useRouter();
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isStoreSidebarOpen, setIsStoreSidebarOpen] = useState(false);
  const [isMobileNotesOpen, setIsMobileNotesOpen] = useState(false);
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
      if (user) {
        console.log("Saving Notes pt 1");
        saveCurrentNote(user);
      } else {
        console.log("Must be logged in to save notes");
        router.push('/?message=Login/Register to save notes!');
      }
    }
  };

  return (
    <div className="h-screen bg-amber-50 flex overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Main Content - Notes Area */}
        <div className={`flex-1 p-2 sm:p-6 transition-all duration-300 ${isStoreSidebarOpen ? 'mr-0' : ''}`}>
          <div className="max-w-4xl mx-auto h-full">
            {/* Notes Editor */}
            <div className="bg-white rounded-lg border border-amber-200 shadow-sm flex flex-col h-full">
              <div className="p-2 sm:p-4 border-b border-amber-200 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <h3 className="text-base sm:text-lg font-medium text-amber-900 whitespace-nowrap">Notes</h3>
                  <input
                    type="text"
                    value={currentNoteTitle}
                    onChange={(e) => setCurrentNoteTitle(e.target.value)}
                    className="hidden sm:block px-2 py-1 text-sm border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900 w-32 sm:w-40"
                    placeholder="Note title..."
                  />
                </div>
                <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                  {/* Mobile Notes Button */}
                  <button
                    onClick={() => setIsMobileNotesOpen(!isMobileNotesOpen)}
                    className={`sm:hidden flex items-center justify-center w-8 h-8 rounded-md transition-colors text-xs ${
                      isMobileNotesOpen 
                        ? 'bg-green-700 text-white' 
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => setIsStoreSidebarOpen(!isStoreSidebarOpen)}
                    className={`flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto sm:px-4 sm:py-2 rounded-md transition-colors text-xs sm:text-sm ${
                      isStoreSidebarOpen 
                        ? 'bg-blue-700 text-white' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span className="hidden sm:inline sm:ml-2">Find Stores</span>
                  </button>
                  <button
                    onClick={handleSaveNote}
                    disabled={!notes.trim()}
                    className="flex items-center justify-center w-8 h-8 sm:w-auto sm:h-auto sm:px-4 sm:py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-xs sm:text-sm"
                  >
                    <Save className="w-4 h-4" />
                    <span className="hidden sm:inline sm:ml-2">Save Note</span>
                  </button>
                </div>
              </div>
              <div className="flex-1 p-2 sm:p-4 overflow-hidden">
                <textarea
                  value={notes}
                  onChange={(e) => updateNotes(e.target.value)}
                  placeholder="Your notes will be controlled by AI. Type a request below to get started..."
                  className="w-full h-full resize-none border-none outline-none text-amber-900 placeholder-amber-500 text-sm leading-relaxed overflow-y-auto"
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
        <div className="bg-white border-t border-amber-200 p-1 sm:p-4 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            {/* Quick Actions - Hidden on mobile */}
            <div className="hidden sm:flex flex-wrap gap-2 mb-3">
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
            <div className="flex items-center gap-1 sm:gap-2">
              <input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask AI..."
                className="flex-1 px-2 sm:px-4 py-2 sm:py-3 border border-amber-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                disabled={isProcessing}
              />
              <button
                onClick={handleSubmit}
                disabled={!inputValue.trim() || isProcessing}
                className="p-2 sm:p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex-shrink-0"
              >
                {isProcessing ? (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Store Sidebar */}
      <StoreSidebar
        notes={notes}
        isVisible={isStoreSidebarOpen}
        onClose={() => setIsStoreSidebarOpen(false)}
      />

      {/* Mobile Notes Overlay */}
      {isMobileNotesOpen && (
        <div className="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-sm max-h-[80vh] flex flex-col">
            <div className="p-4 border-b border-amber-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                Saved Notes
              </h2>
              <button
                onClick={() => setIsMobileNotesOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {/* Mobile Notes List - simplified version */}
              <div className="space-y-2">
                {useNotesStore.getState().savedNotes.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No saved notes yet</p>
                  </div>
                ) : (
                  useNotesStore.getState().savedNotes
                    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                    .map((note) => (
                      <div
                        key={note.id}
                        onClick={() => {
                          useNotesStore.getState().loadNote(note.id);
                          setIsMobileNotesOpen(false);
                        }}
                        className="p-3 rounded-lg border border-amber-200 hover:border-green-300 hover:bg-green-50 cursor-pointer transition-colors"
                      >
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {note.title}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {note.content.substring(0, 60)}
                          {note.content.length > 60 && '...'}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(note.updatedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
