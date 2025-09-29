import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  username: string;
}

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
  saveCurrentNote: (user: User) => void;
  loadNote: (noteId: string) => void;
  deleteNote: (user: User, noteId: string) => void;
  createNewNote: () => void;
  getNextNoteNumber: () => number;
  fetchNotes: (user: User) => void;
}
const API_BASE = "/api/notes";
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
      fetchNotes: async (user: User) => {
        if (!user?.username) return;
        console.log("trying to fetch");
        try {
          const res = await fetch(`${API_BASE}?username=${user.username}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });

          if (!res.ok) throw new Error("Failed to fetch notes");

          const data: SavedNote[] = await res.json();

          // Update store with fetched notes - ensure it's always an array
          set({ savedNotes: Array.isArray(data) ? data : [] });
        } catch (err) {
          console.error("Error fetching notes:", err);
        }
      },

      saveCurrentNote: async (user: User) => {
        const { notes, currentNoteTitle, currentNoteId, savedNotes } = get();
        const currUpdatedAt = new Date();
        if (!notes.trim()) return;
        
        if (currentNoteId) {
          // Update existing note
          const updatedNotes = savedNotes.map(note => 
            note.id === currentNoteId 
              ? { ...note, title: currentNoteTitle, content: notes, updatedAt: currUpdatedAt }
              : note
          );
          
          set({
            savedNotes: updatedNotes,
          });
          if (user) {
            await fetch(`${API_BASE}`, {
              method: "PATCH",
              headers: { 
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                resource: "/notesdb",
                username: user?.username,
                noteid: currentNoteId,
                title: currentNoteTitle,
                content: notes,
                updatedAt: currUpdatedAt
              })
            });
          }
        } else {
          // Create new note
          const tempNoteId = Date.now().toString();
          const newNote: SavedNote = {
            id: tempNoteId,
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
          if (user) {
            await fetch(`${API_BASE}`, {
              method: "POST",
              headers: { 
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                resource: "/notesdb",
                username: user?.username,
                noteid: tempNoteId,
                title: currentNoteTitle,
                content: notes,
                updatedAt: currUpdatedAt,
                createdAt: currUpdatedAt
              })
            });
            // Fetch updated notes after creating
            get().fetchNotes(user);
          }
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
      
      deleteNote: async (user, noteId) => {
        const { savedNotes, currentNoteId } = get();
        
        // If the deleted note is currently being viewed, clear the main view
        if (currentNoteId === noteId) {
          set({
            notes: '',
            currentNoteTitle: 'Note 1',
            currentNoteId: null,
            savedNotes: savedNotes.filter(n => n.id !== noteId),
          });
        } else {
          set({
            savedNotes: savedNotes.filter(n => n.id !== noteId),
          });
        }
        
        if (user) {
            await fetch(`${API_BASE}`, {
              method: "DELETE",
              headers: { 
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                resource: "/notesdb",
                username: user?.username,
                noteid: noteId
              })
            });
            // Fetch updated notes after deletion
            get().fetchNotes(user);
        }
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
