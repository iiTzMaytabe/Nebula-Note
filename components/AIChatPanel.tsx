import React, { useState } from 'react';
import { AIActionType } from '../types';
import { CyberButton } from './ui/CyberButton';
import { Sparkles, Zap, Expand, FileText, CheckCircle, AlertTriangle } from 'lucide-react';

interface AIChatPanelProps {
  onAction: (action: AIActionType) => void;
  isProcessing: boolean;
  lastResult: string | null;
  onApplyResult: () => void;
  onClearResult: () => void;
  error: string | null;
}

export const AIChatPanel: React.FC<AIChatPanelProps> = ({ 
  onAction, 
  isProcessing, 
  lastResult, 
  onApplyResult,
  onClearResult,
  error
}) => {
  return (
    <div className="h-full flex flex-col bg-slate-900/80 border-l border-cyan-900/50 backdrop-blur-sm relative">
      <div className="p-4 border-b border-cyan-900/50 flex items-center gap-2">
        <Sparkles className="text-purple-400" size={18} />
        <h2 className="font-display font-bold text-lg text-purple-400 tracking-wider">NEURAL UPLINK</h2>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-4 custom-scrollbar">
        <div className="text-xs font-mono-tech text-slate-500 mb-4">
          // SELECT NEURAL PROTOCOL //
        </div>

        <div className="grid grid-cols-1 gap-3">
          <CyberButton variant="secondary" onClick={() => onAction(AIActionType.REWRITE_SCIFI)} disabled={isProcessing} icon={<Zap size={16} />}>
            SCI-FI ENCRYPT
          </CyberButton>
          <CyberButton variant="ghost" onClick={() => onAction(AIActionType.SUMMARIZE)} disabled={isProcessing} icon={<FileText size={16} />}>
            TACTICAL SUMMARY
          </CyberButton>
          <CyberButton variant="ghost" onClick={() => onAction(AIActionType.EXPAND)} disabled={isProcessing} icon={<Expand size={16} />}>
            EXTRAPOLATE DATA
          </CyberButton>
          <CyberButton variant="ghost" onClick={() => onAction(AIActionType.FIX_GRAMMAR)} disabled={isProcessing} icon={<CheckCircle size={16} />}>
            DEBUG SYNTAX
          </CyberButton>
        </div>

        {error && (
            <div className="mt-6 p-4 border border-red-500/50 bg-red-900/10 text-red-400 text-sm font-mono-tech flex gap-2 items-start animate-pulse">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                <div>
                    <strong className="block mb-1">SYSTEM FAILURE</strong>
                    {error}
                </div>
            </div>
        )}

        {lastResult && (
          <div className="mt-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-mono-tech text-purple-400 uppercase">// OUTPUT STREAM //</span>
              <button onClick={onClearResult} className="text-xs text-slate-500 hover:text-slate-300">CLEAR</button>
            </div>
            <div className="p-4 bg-black/40 border border-purple-500/30 text-slate-200 text-sm leading-relaxed font-light shadow-[inset_0_0_15px_rgba(139,92,246,0.1)]">
              {lastResult}
            </div>
            <div className="mt-3 flex justify-end">
              <CyberButton variant="primary" onClick={onApplyResult} icon={<CheckCircle size={16} />}>
                OVERWRITE LOG
              </CyberButton>
            </div>
          </div>
        )}
      </div>
      
      {/* Decorative HUD Elements */}
      <div className="absolute bottom-4 right-4 text-[10px] font-mono-tech text-slate-700 pointer-events-none">
        SYS_READY <br/>
        CPU_TEMP: NORMAL <br/>
        UPLINK_STABLE
      </div>
    </div>
  );
};
