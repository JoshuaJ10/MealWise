'use client';

import React from 'react';
import { useEffect } from 'react';
import { useNotesStore, SavedNote } from '@/store/notesStore';
import { Trash2, FileText, Plus } from 'lucide-react';

interface NotesSidebarProps {
  className?: string;
  user?: { username: string };
}

export const NotesSidebar: React.FC<NotesSidebarProps> = ({ className = '', user }) => {
  const { savedNotes, loadNote, deleteNote, createNewNote, fetchNotes } = useNotesStore();

  useEffect(() => {
    if (user?.username) {
      fetchNotes(user); // fetch notes from DynamoDB via API Gateway
    }
  }, [user?.username]); // Only fetch when username changes
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleNoteClick = (note: SavedNote) => {
    loadNote(note.id);
  };

  const handleDeleteNote = (e: React.MouseEvent, noteId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this note?') && user) {
      deleteNote(user, noteId);
    }
  };

  const handleNewNote = () => {
    createNewNote();
  };

  return (
    <div className={`hidden sm:block sm:w-80 bg-white border-r border-amber-200 flex flex-col h-screen ${className}`}>
      {/* Sidebar Header */}
      <div className="p-4 border-b border-amber-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-green-600" />
            Saved Notes
          </h2>
          <button
            onClick={handleNewNote}
            className="w-8 h-8 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center transition-colors shadow-sm hover:shadow-md"
            title="Create new note"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {Array.isArray(savedNotes) ? savedNotes.length : 0} note{Array.isArray(savedNotes) && savedNotes.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Notes List */}
      <div className="flex-1 overflow-y-auto">
        {!Array.isArray(savedNotes) || savedNotes.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No saved notes yet</p>
            <p className="text-xs text-gray-400 mt-1">
              Create and save your first note
            </p>
          </div>
        ) : (
          <div className="p-2">
            {Array.isArray(savedNotes) && savedNotes
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .map((note) => (
                <div
                  key={note.id}
                  onClick={() => handleNoteClick(note)}
                  className="p-3 mb-2 rounded-lg border border-amber-200 hover:border-green-300 hover:bg-green-50 cursor-pointer transition-colors group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 truncate">
                        {note.title}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {note.content.substring(0, 100)}
                        {note.content.length > 100 && '...'}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {formatDate(note.updatedAt)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDeleteNote(e, note.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
