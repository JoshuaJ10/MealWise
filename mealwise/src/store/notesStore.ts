import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SavedNote {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

interface NotesState {
  notes: string;
  currentNoteTitle: string;
  savedNotes: SavedNote[];
  setNotes: (notes: string) => void;
  updateNotes: (newNotes: string) => void;
  setCurrentNoteTitle: (title: string) => void;
  saveCurrentNote: () => void;
  loadNote: (noteId: string) => void;
  deleteNote: (noteId: string) => void;
  getNextNoteNumber: () => number;
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: '',
      currentNoteTitle: 'Note 1',
      savedNotes: [],
      
      setNotes: (notes) => set({ notes }),
      updateNotes: (newNotes) => set({ notes: newNotes }),
      
      setCurrentNoteTitle: (title) => set({ currentNoteTitle: title }),
      
      saveCurrentNote: () => {
        const { notes, currentNoteTitle, savedNotes } = get();
        if (!notes.trim()) return;
        
        const newNote: SavedNote = {
          id: Date.now().toString(),
          title: currentNoteTitle,
          content: notes,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set({
          savedNotes: [...savedNotes, newNote],
          currentNoteTitle: `Note ${savedNotes.length + 2}`,
          notes: '',
        });
      },
      
      loadNote: (noteId) => {
        const { savedNotes } = get();
        const note = savedNotes.find(n => n.id === noteId);
        if (note) {
          set({
            notes: note.content,
            currentNoteTitle: note.title,
          });
        }
      },
      
      deleteNote: (noteId) => {
        const { savedNotes } = get();
        set({
          savedNotes: savedNotes.filter(n => n.id !== noteId),
        });
      },
      
      getNextNoteNumber: () => {
        const { savedNotes } = get();
        return savedNotes.length + 1;
      },
    }),
    {
      name: 'notes-storage',
      partialize: (state) => ({ savedNotes: state.savedNotes }),
    }
  )
);
