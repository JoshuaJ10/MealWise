// Mock CedarOS utilities
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const useVoice = () => ({
  checkVoiceSupport: () => false,
  voicePermissionStatus: 'not-supported' as const,
  isListening: false,
  isSpeaking: false,
  voiceError: null,
  requestVoicePermission: async () => {},
  toggleVoice: () => {},
});

export const useCedarEditor = ({ onFocus, onBlur, stream }: any) => ({
  editor: null,
  isEditorEmpty: true,
  handleSubmit: () => {},
});

export const CedarEditorContent = ({ editor, className }: any) => (
  <div className={className}>Mock Editor</div>
);
