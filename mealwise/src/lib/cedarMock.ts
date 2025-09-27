// Mock CedarOS utilities and functions
import React from 'react';

// Mock utility functions
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const getShadedColor = (color: string, amount: number): string => {
  // Simple mock implementation
  return color;
};

export const getLightenedColor = (color: string, amount: number): string => {
  // Simple mock implementation
  return color;
};

export const createBorderColor = (color: string, amount: number): string => {
  // Simple mock implementation
  return color;
};

export const getTextColorForBackground = (backgroundColor: string): string => {
  // Simple mock implementation - return white for dark backgrounds, black for light
  return '#000000';
};

// Mock voice functionality
export const useVoice = () => ({
  checkVoiceSupport: () => false,
  voicePermissionStatus: 'not-supported' as const,
  isListening: false,
  isSpeaking: false,
  voiceError: null,
  requestVoicePermission: async () => {},
  toggleVoice: () => {},
});

// Real editor functionality
export const useCedarEditor = ({ onFocus, onBlur, stream }: any) => {
  const [editorValue, setEditorValue] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);

  const handleSubmit = () => {
    if (editorValue.trim()) {
      // This will be handled by the parent component
      console.log('Editor submit:', editorValue);
    }
  };

  const editor = {
    commands: {
      focus: () => setIsFocused(true),
      blur: () => setIsFocused(false),
    },
    value: editorValue,
    setValue: setEditorValue,
  };

  return {
    editor,
    isEditorEmpty: !editorValue.trim(),
    handleSubmit,
  };
};

// Real editor content component
export const CedarEditorContent = ({ editor, className }: any) => {
  return React.createElement('textarea', {
    className: className,
    value: editor?.value || '',
    onChange: (e: any) => editor?.setValue?.(e.target.value),
    onFocus: () => editor?.commands?.focus?.(),
    onBlur: () => editor?.commands?.blur?.(),
    placeholder: 'Ask me to plan your shopping...',
    style: {
      width: '100%',
      minHeight: '40px',
      resize: 'none',
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontSize: '14px',
      lineHeight: '1.5',
    },
  });
};

// Mock voice state type
export interface VoiceState {
  isListening: boolean;
  isSpeaking: boolean;
  voiceError: string | null;
  voicePermissionStatus: 'granted' | 'denied' | 'prompt' | 'not-supported';
}

// Mock human in the loop message type
export interface HumanInTheLoopMessage {
  type: 'humanInTheLoop';
  state: 'suspended' | 'active';
  content: string;
  id: string;
  timestamp: Date;
}

// Mock message types
export interface TodoListMessage {
  type: 'todoList';
  content: string;
  id: string;
  timestamp: Date;
}

export interface StorylineMessage {
  type: 'storyline';
  content: string;
  id: string;
  timestamp: Date;
}

export interface StorylineSection {
  id: string;
  title: string;
  content: string;
}

export interface MultipleChoiceMessage {
  type: 'multipleChoice';
  content: string;
  id: string;
  timestamp: Date;
}

export interface TickerMessage {
  type: 'ticker';
  content: string;
  id: string;
  timestamp: Date;
  buttons: any[];
  onChoice?: (store: any) => void;
}

// Mock activation types
export interface ActivationEvent {
  type: string;
  target: HTMLElement;
}

export interface ActivationMode {
  type: string;
  conditions: any[];
}

// Mock message type
export interface CedarMessage {
  id: string;
  type: 'user' | 'assistant' | 'system' | 'humanInTheLoop';
  content: string;
  timestamp: Date;
}

// Mock store interface
export interface CedarStore {
  showChat: boolean;
  messages: CedarMessage[];
  setShowChat: (show: boolean) => void;
  addMessage: (message: Omit<CedarMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
}

// Mock store implementation
export const useCedarStore = (selector: (state: CedarStore) => any) => {
  // This would normally be a Zustand store
  // For now, return mock values
  return selector({
    showChat: false,
    messages: [],
    setShowChat: () => {},
    addMessage: () => {},
    clearMessages: () => {},
  });
};

// Mock additional functions
export const useMessages = () => [];
export const useThreadMessages = () => [];
export const useSpell = (config: any) => ({ isActive: false });
export const useHotkey = (config: any) => ({});
export const useActivation = (config: any) => ({});
export const useStyling = () => ({
  styling: {
    darkMode: false,
    accentColor: '#3b82f6',
    color: '#ffffff',
  },
});

// Mock additional types and functions
export interface ContextEntry {
  id: string;
  name: string;
  type: string;
}

export const withClassName = (Component: any, className: string) => {
  return (props: any) => React.createElement(Component, { ...props, className });
};

export interface CedarEditor {
  commands: {
    focus: () => void;
    blur: () => void;
  };
}
