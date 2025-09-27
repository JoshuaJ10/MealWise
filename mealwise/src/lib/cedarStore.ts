import { create } from 'zustand';

export interface CedarMessage {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface CedarStore {
  showChat: boolean;
  messages: CedarMessage[];
  setShowChat: (show: boolean) => void;
  addMessage: (message: Omit<CedarMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
}

export const useCedarStore = create<CedarStore>((set, get) => ({
  showChat: false,
  messages: [],
  
  setShowChat: (show) => set({ showChat: show }),
  
  addMessage: (message) => {
    const newMessage: CedarMessage = {
      ...message,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
    };
    
    set((state) => ({
      messages: [...state.messages, newMessage],
    }));
  },
  
  clearMessages: () => set({ messages: [] }),
}));
