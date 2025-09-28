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
  currentNoteId: string | null;
  savedNotes: SavedNote[];
  setNotes: (notes: string) => void;
  updateNotes: (newNotes: string) => void;
  setCurrentNoteTitle: (title: string) => void;
  saveCurrentNote: () => void;
  loadNote: (noteId: string) => void;
  deleteNote: (noteId: string) => void;
  createNewNote: () => void;
  getNextNoteNumber: () => number;
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: '',
      currentNoteTitle: 'Note 1',
      currentNoteId: null,
      savedNotes: [],
      
      setNotes: (notes) => set({ notes }),
      updateNotes: (newNotes) => set({ notes: newNotes }),
      
      setCurrentNoteTitle: (title) => set({ currentNoteTitle: title }),
      
      saveCurrentNote: () => {
        const { notes, currentNoteTitle, currentNoteId, savedNotes } = get();
        if (!notes.trim()) return;
        
        if (currentNoteId) {
          // Update existing note
          const updatedNotes = savedNotes.map(note => 
            note.id === currentNoteId 
              ? { ...note, title: currentNoteTitle, content: notes, updatedAt: new Date() }
              : note
          );
          
          set({
            savedNotes: updatedNotes,
          });
        } else {
          // Create new note
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
            currentNoteId: null,
          });
        }
      },
      
      loadNote: (noteId) => {
        const { savedNotes } = get();
        const note = savedNotes.find(n => n.id === noteId);
        if (note) {
          set({
            notes: note.content,
            currentNoteTitle: note.title,
            currentNoteId: noteId,
          });
        }
      },
      
      deleteNote: (noteId) => {
        const { savedNotes } = get();
        set({
          savedNotes: savedNotes.filter(n => n.id !== noteId),
        });
      },
      
      createNewNote: () => {
        const { savedNotes } = get();
        set({
          notes: '',
          currentNoteTitle: `Note ${savedNotes.length + 1}`,
          currentNoteId: null,
        });
      },
      
      getNextNoteNumber: () => {
        const { savedNotes } = get();
        return savedNotes.length + 1;
      },
    }),
    {
      name: 'notes-storage',
      partialize: (state) => ({ 
        savedNotes: state.savedNotes,
        currentNoteId: state.currentNoteId,
        currentNoteTitle: state.currentNoteTitle,
        notes: state.notes,
      }),
    }
  )
);
