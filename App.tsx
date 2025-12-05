import React, { useState, useEffect } from 'react';
import { Note, AIActionType } from './types';
import { NoteList } from './components/NoteList';
import { NoteEditor } from './components/NoteEditor';
import { AIChatPanel } from './components/AIChatPanel';
import { CyberButton } from './components/ui/CyberButton';
import { enhanceNoteContent, generateTitle } from './services/geminiService';
import { Plus, Menu, X, BrainCircuit, Save } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

// Simple UUID generator fallback if package not available (though standard envs usually have crypto.randomUUID)
const generateId = () => crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2) + Date.now().toString(36);

const STORAGE_KEY = 'nebula-notes-data';

const App: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  // Load from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotes(parsed);
        if (parsed.length > 0) setActiveNoteId(parsed[0].id);
      } catch (e) {
        console.error("Data corruption detected in local storage.");
      }
    } else {
        // Create a welcome note
        const welcomeNote: Note = {
            id: generateId(),
            title: "WELCOME TO NEBULA",
            content: "System initialization complete.\n\nThis is your personal secure data log. Use the Neural Uplink (Top Right) to enhance your notes with AI processing.\n\nEnd of line.",
            createdAt: Date.now(),
            updatedAt: Date.now(),
            tags: [],
            isFavorite: false
        };
        setNotes([welcomeNote]);
        setActiveNoteId(welcomeNote.id);
    }
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  const activeNote = notes.find(n => n.id === activeNoteId);

  const handleCreateNote = () => {
    const newNote: Note = {
      id: generateId(),
      title: '',
      content: '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tags: [],
      isFavorite: false,
    };
    setNotes([newNote, ...notes]);
    setActiveNoteId(newNote.id);
    // On mobile, close sidebar after creating
    if (window.innerWidth < 768) setShowSidebar(false);
  };

  const handleUpdateNote = (id: string, updates: Partial<Note>) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, ...updates } : n));
  };

  const handleDeleteNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = window.confirm("CONFIRM DELETION: Purge this log permanently?");
    if (confirmed) {
      setNotes(prev => prev.filter(n => n.id !== id));
      if (activeNoteId === id) setActiveNoteId(null);
    }
  };

  const handleToggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotes(prev => prev.map(n => n.id === id ? { ...n, isFavorite: !n.isFavorite } : n));
  };

  // AI Handlers
  const handleAIAction = async (action: AIActionType) => {
    if (!activeNote) return;
    if (!activeNote.content.trim()) {
        setAiError("INPUT DATA EMPTY");
        return;
    }

    setIsProcessingAI(true);
    setAiResult(null);
    setAiError(null);

    try {
      const result = await enhanceNoteContent(activeNote.content, action, activeNote.title);
      setAiResult(result);
    } catch (error) {
      setAiError(error instanceof Error ? error.message : "Unknown Error");
    } finally {
      setIsProcessingAI(false);
    }
  };

  const handleApplyAIResult = () => {
    if (activeNoteId && aiResult) {
      handleUpdateNote(activeNoteId, { content: aiResult, updatedAt: Date.now() });
      setAiResult(null);
      // Auto generate title if it was empty
      if (!activeNote?.title) {
          generateTitle(aiResult).then(t => handleUpdateNote(activeNoteId, { title: t }));
      }
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden text-slate-200">
      
      {/* Sidebar Mobile Toggle Overlay */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed md:relative z-40 h-full w-80 bg-slate-950/90 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-out
          ${showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-80'}
          ${!showSidebar && 'md:w-0 md:overflow-hidden md:border-none'}
        `}
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-black/40">
          <h1 className="font-display font-bold text-xl text-cyan-400 tracking-wider flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_10px_#22d3ee]" />
            NEBULA
          </h1>
          <button onClick={handleCreateNote} className="p-2 bg-cyan-900/30 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all rounded-sm border border-cyan-500/30">
            <Plus size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <NoteList 
            notes={notes}
            activeNoteId={activeNoteId}
            onSelectNote={(id) => {
              setActiveNoteId(id);
              if (window.innerWidth < 768) setShowSidebar(false);
            }}
            onDeleteNote={handleDeleteNote}
            onToggleFavorite={handleToggleFavorite}
          />
        </div>

        <div className="p-2 border-t border-slate-800 text-[10px] text-slate-600 font-mono-tech text-center">
            SECURE CONNECTION ESTABLISHED
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative min-w-0 bg-transparent">
        {/* Top Header Bar */}
        <header className="h-14 border-b border-slate-800/50 bg-slate-900/40 backdrop-blur-md flex items-center justify-between px-4 z-20">
          <div className="flex items-center gap-4">
             <button onClick={() => setShowSidebar(!showSidebar)} className="text-slate-400 hover:text-cyan-400 transition-colors">
               <Menu size={24} />
             </button>
             <span className="text-xs font-mono-tech text-cyan-500/50 hidden md:inline-block">
                // SYSTEM_STATUS: ONLINE
             </span>
          </div>

          <div className="flex items-center gap-2">
             <button 
               onClick={() => setShowAIPanel(!showAIPanel)}
               className={`
                 flex items-center gap-2 px-4 py-1.5 rounded-sm border transition-all duration-300 font-mono-tech text-xs font-bold
                 ${showAIPanel 
                    ? 'bg-purple-500 text-black border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]' 
                    : 'bg-purple-900/20 text-purple-300 border-purple-500/30 hover:bg-purple-900/40'}
               `}
             >
                <BrainCircuit size={16} />
                <span className="hidden sm:inline">NEURAL UPLINK</span>
             </button>
          </div>
        </header>

        {/* Editor Wrapper */}
        <div className="flex-1 relative flex overflow-hidden">
          <div className="flex-1 overflow-y-auto custom-scrollbar h-full">
            {activeNote ? (
              <NoteEditor note={activeNote} onUpdate={handleUpdateNote} />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600">
                <div className="w-16 h-16 border-2 border-slate-800 rounded-full flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-full animate-ping opacity-20" />
                </div>
                <p className="font-mono-tech">SELECT A LOG OR INITIALIZE NEW ENTRY</p>
              </div>
            )}
          </div>

          {/* AI Panel (Right Side) */}
          <div 
             className={`
               absolute inset-y-0 right-0 w-80 md:w-96 transform transition-transform duration-300 ease-in-out z-30
               ${showAIPanel ? 'translate-x-0' : 'translate-x-full'}
             `}
          >
             <AIChatPanel 
               onAction={handleAIAction}
               isProcessing={isProcessingAI}
               lastResult={aiResult}
               onApplyResult={handleApplyAIResult}
               onClearResult={() => setAiResult(null)}
               error={aiError}
             />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
