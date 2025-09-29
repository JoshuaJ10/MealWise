// Mock CedarOS utilities and functions
import React from 'react';

// Mock utility functions
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const getShadedColor = (color: string, _amount: number): string => {
  // Simple mock implementation
  return color;
};

export const getLightenedColor = (color: string, _amount: number): string => {
  // Simple mock implementation
  return color;
};

export const createBorderColor = (color: string, _amount: number): string => {
  // Simple mock implementation
  return color;
};

export const getTextColorForBackground = (_backgroundColor: string): string => {
  // Simple mock implementation - return white for dark backgrounds, black for light
  return '#000000';
};

// Mock voice functionality
export const useVoice = () => ({
  checkVoiceSupport: () => false,
  voicePermissionStatus: 'denied' as 'denied' | 'granted' | 'prompt' | 'not-supported',
  isListening: false,
  isSpeaking: false,
  voiceError: null,
  requestVoicePermission: async () => {},
  toggleVoice: () => {},
});

// Real editor functionality
export const useCedarEditor = ({ onFocus: _onFocus, onBlur: _onBlur, stream: _stream, placeholder: _placeholder, onSubmit: _onSubmit, onEnterOverride: _onEnterOverride }: { onFocus?: () => void; onBlur?: () => void; stream?: unknown; placeholder?: string; onSubmit?: (text: string, editor: unknown, clearEditor?: () => void) => void; onEnterOverride?: (event: React.KeyboardEvent) => boolean }) => {
  const [editorValue, setEditorValue] = React.useState('');
  const [_isFocused, setIsFocused] = React.useState(false);

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
      clearContent: () => setEditorValue(''),
    },
    value: editorValue,
    setValue: setEditorValue,
  };

  const getEditorText = () => editorValue;

  return {
    editor,
    isEditorEmpty: !editorValue.trim(),
    handleSubmit,
    getEditorText,
  };
};

// Real editor content component
export const CedarEditorContent = ({ editor, className }: { editor?: { value?: string; setValue?: (value: string) => void; commands?: { focus?: () => void; blur?: () => void } }; className?: string }) => {
  return React.createElement('textarea', {
    className: className,
    value: editor?.value || '',
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => editor?.setValue?.(e.target.value),
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
  sections: StorylineSection[];
}

export interface StorylineSection {
  id: string;
  title: string;
  content: string;
  type: 'storyline_section';
  icon?: React.ReactNode;
  description?: string;
}

export interface MultipleChoiceMessage {
  type: 'multiple-choice';
  content: string;
  id: string;
  timestamp: Date;
  choices: Array<{ label: string; value: string; icon?: React.ReactNode }>;
  multiselect: boolean;
  onChoice?: (choice: { label: string; value: string; icon?: React.ReactNode }, store: unknown) => void;
}

export interface TickerButton {
  label: string;
  title?: string;
  description?: string;
  colour?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export interface TickerMessage {
  type: 'ticker';
  content: string;
  id: string;
  timestamp: Date;
  buttons: TickerButton[];
  onChoice?: (store: unknown) => void;
}

// Mock activation types
export type ActivationEvent = string | {
  type: string;
  target: HTMLElement;
};

export interface ActivationMode {
  type: string;
  conditions: unknown[];
}

export const ActivationModeEnum = {
  TRIGGER: 'trigger',
  TOGGLE: 'toggle',
  HOLD: 'hold',
};

export type ActivationModeEnumType = typeof ActivationModeEnum;

// Mock message type
export interface CedarMessage {
	id: string;
	type: 'user' | 'assistant' | 'system' | 'humanInTheLoop' | 'text' | 'dialogue_options' | 'ticker' | 'multiple-choice' | 'slider' | 'todolist' | 'todoList' | 'storyline';
	content: string;
	timestamp: Date;
	role?: 'user' | 'assistant' | 'system';
}

// Alias for compatibility
export type Message = CedarMessage;
export type MessageRenderer<T = Message> = React.ComponentType<{ message: T }>;

// Mock context entry type
export interface ContextEntry {
  id: string;
  name?: string;
  type?: string;
  source?: string;
  data?: unknown;
  metadata?: {
    showInChat?: boolean;
    label?: string;
    color?: string;
    icon?: React.ComponentType<unknown>;
    order?: number;
    isCollapsed?: boolean;
    originalCount?: number;
  };
}

export interface DialogueOptionsMessage {
  type: 'dialogue_options';
  content: string;
  options: Array<{ label: string; value: string; icon?: React.ReactNode }>;
  onChoice?: (option: { label: string; value: string; icon?: React.ReactNode }, store: unknown) => void;
}

export interface DialogueOptionChoice {
  label: string;
  value: string;
  icon?: React.ReactNode;
  description?: string;
}

export interface SliderMessage {
  type: 'slider';
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange?: (value: number, store: unknown) => void;
}

export interface TodoListMessage {
  type: 'todoList';
  content: string;
  id: string;
  timestamp: Date;
  items: Array<{ id: string; text: string; completed: boolean; done: boolean; description?: string }>;
}

// Mock store interface
export interface CedarStore {
  showChat: boolean;
  messages: CedarMessage[];
  isProcessing: boolean;
  setShowChat: (show: boolean) => void;
  addMessage: (message: Omit<CedarMessage, 'id' | 'timestamp'>) => void;
  clearMessages: () => void;
  removeContextEntry: (key: string) => void;
  mentionProviders: Map<string, unknown>;
  additionalContext: Map<string, unknown>;
  collapsingConfigs: Map<string, unknown>;
  getMessageRenderers: () => Map<string, React.ComponentType<unknown>>;
  styling?: {
    darkMode: boolean;
    accentColor: string;
    color: string;
  };
}

// Mock store implementation
export const useCedarStore = (selector: (state: CedarStore) => unknown) => {
  // This would normally be a Zustand store
  // For now, return mock values
  return selector({
    showChat: false,
    messages: [],
    isProcessing: false,
    setShowChat: () => {},
    addMessage: () => {},
    clearMessages: () => {},
    removeContextEntry: () => {},
    mentionProviders: new Map(),
    additionalContext: new Map(),
    collapsingConfigs: new Map(),
    getMessageRenderers: () => new Map(),
    styling: {
      darkMode: false,
      accentColor: '#3b82f6',
      color: '#ffffff',
    },
  });
};

// Add getState method to the useCedarStore function
(useCedarStore as any).getState = () => ({
  showChat: false,
  messages: [],
  isProcessing: false,
  setShowChat: () => {},
  addMessage: () => {},
  clearMessages: () => {},
  removeContextEntry: () => {},
  mentionProviders: new Map(),
  additionalContext: new Map(),
  collapsingConfigs: new Map(),
  getMessageRenderers: () => new Map(),
  styling: {
    darkMode: false,
    accentColor: '#3b82f6',
    color: '#ffffff',
  },
});

// Mock additional functions
export const useMessages = () => ({ 
  messages: [] as CedarMessage[], 
  isProcessing: false,
  setMessages: (messages: CedarMessage[]) => {}
});

export const useThreadMessages = () => ({ 
  messages: [] as CedarMessage[], 
  isProcessing: false 
});
export const useSpell = (config: unknown) => ({ isActive: false });
export const useHotkey = (config: unknown) => ({});
export const useActivation = (config: unknown) => ({});
export const useMultipleSpells = (config: { spells?: unknown[] }) => ({ 
  spells: (config.spells || []).map(() => ({ isActive: false }))
});
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

export const withClassName = (Component: React.ComponentType<unknown>, className: string) => {
  const WrappedComponent = (props: unknown) => React.createElement(Component, { ...props, className });
  WrappedComponent.displayName = `withClassName(${Component.displayName || Component.name || 'Component'})`;
  return WrappedComponent;
};

export interface CedarEditor {
  commands: {
    focus: () => void;
    blur: () => void;
  };
  state?: {
    doc: unknown;
    tr: unknown;
  };
  view?: {
    dispatch: (tr: unknown) => void;
  };
}
