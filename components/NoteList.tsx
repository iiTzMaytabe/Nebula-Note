import React from 'react';
import { Note } from '../types';
import { Trash2, Star, FileText, Cpu } from 'lucide-react';

interface NoteListProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (id: string) => void;
  onDeleteNote: (id: string, e: React.MouseEvent) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

export const NoteList: React.FC<NoteListProps> = ({ 
  notes, 
  activeNoteId, 
  onSelectNote, 
  onDeleteNote,
  onToggleFavorite
}) => {
  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-60">
        <Cpu size={48} className="mb-4 animate-pulse" />
        <p className="font-mono-tech uppercase tracking-widest">No Data Logs Found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-20">
      {notes.map((note) => (
        <div 
          key={note.id}
          onClick={() => onSelectNote(note.id)}
          className={`
            group relative p-4 border-l-4 transition-all duration-300 cursor-pointer overflow-hidden
            ${activeNoteId === note.id 
              ? 'bg-cyan-950/30 border-cyan-400 shadow-[inset_0_0_20px_rgba(6,182,212,0.1)]' 
              : 'bg-slate-900/40 border-slate-700 hover:border-cyan-700 hover:bg-slate-800/50'}
          `}
        >
          {/* Animated background line on active */}
          {activeNoteId === note.id && (
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-cyan-500/5 to-transparent pointer-events-none" />
          )}

          <div className="flex justify-between items-start mb-1 relative z-10">
            <h3 className={`font-display font-bold truncate pr-4 ${activeNoteId === note.id ? 'text-cyan-300' : 'text-slate-300'}`}>
              {note.title || 'Untitled Log'}
            </h3>
            <button 
              onClick={(e) => onToggleFavorite(note.id, e)}
              className={`transition-colors ${note.isFavorite ? 'text-yellow-400' : 'text-slate-600 hover:text-yellow-400'}`}
            >
              <Star size={14} fill={note.isFavorite ? "currentColor" : "none"} />
            </button>
          </div>

          <p className="text-xs text-slate-500 font-mono-tech mb-3 truncate">
            {new Date(note.updatedAt).toLocaleString()}
          </p>

          <p className="text-sm text-slate-400 line-clamp-2 h-10 font-light leading-relaxed">
            {note.content || <span className="italic opacity-50">Empty data stream...</span>}
          </p>

          <div className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
            <button 
              onClick={(e) => onDeleteNote(note.id, e)}
              className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded"
              title="Purge Log"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
