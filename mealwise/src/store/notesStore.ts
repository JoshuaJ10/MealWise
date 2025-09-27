import { create } from 'zustand';

interface NotesState {
  notes: string;
  setNotes: (notes: string) => void;
  updateNotes: (newNotes: string) => void;
}

export const useNotesStore = create<NotesState>((set) => ({
  notes: '',
  setNotes: (notes) => set({ notes }),
  updateNotes: (newNotes) => set({ notes: newNotes }),
}));
