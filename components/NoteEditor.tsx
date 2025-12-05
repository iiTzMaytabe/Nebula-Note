import React, { useEffect, useState } from 'react';
import { Note } from '../types';

interface NoteEditorProps {
  note: Note;
  onUpdate: (id: string, updates: Partial<Note>) => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({ note, onUpdate }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);

  // Sync internal state when note prop changes
  useEffect(() => {
    setTitle(note.title);
    setContent(note.content);
  }, [note.id]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    onUpdate(note.id, { title: newTitle, updatedAt: Date.now() });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);
    onUpdate(note.id, { content: newContent, updatedAt: Date.now() });
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/50 backdrop-blur-sm relative overflow-hidden">
      {/* HUD Corner Accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-500/50 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-500/50 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50 pointer-events-none"></div>

      <div className="p-6 md:p-10 flex flex-col h-full z-10">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="ENTER LOG TITLE..."
          className="bg-transparent text-3xl md:text-4xl font-display font-bold text-cyan-400 placeholder-cyan-900/50 border-none outline-none mb-6 w-full uppercase tracking-wider text-shadow-neon"
        />
        
        <div className="flex-1 relative">
           <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Begin data entry..."
            className="w-full h-full bg-transparent text-slate-300 font-mono text-base md:text-lg leading-relaxed resize-none border-none outline-none focus:ring-0 placeholder-slate-700 custom-scrollbar p-2"
            spellCheck={false}
          />
          {/* Animated typing cursor if needed, or simple texture */}
          <div className="absolute top-0 right-0 p-2 pointer-events-none opacity-20">
             <div className="flex flex-col gap-1 items-end">
                <div className="w-16 h-1 bg-cyan-500"></div>
                <div className="w-10 h-1 bg-cyan-500"></div>
                <div className="w-4 h-1 bg-cyan-500"></div>
             </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center text-xs font-mono-tech text-slate-500">
           <span>LOG_ID: {note.id.split('-')[0].toUpperCase()}</span>
           <span>BYTES: {new Blob([note.content]).size}</span>
        </div>
      </div>
    </div>
  );
};
