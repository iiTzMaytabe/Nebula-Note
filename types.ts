export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
  tags: string[];
  isFavorite: boolean;
  aiSummary?: string;
}

export enum ViewMode {
  LIST = 'LIST',
  EDIT = 'EDIT',
  GRID = 'GRID'
}

export enum AIActionType {
  SUMMARIZE = 'SUMMARIZE',
  EXPAND = 'EXPAND',
  REWRITE_SCIFI = 'REWRITE_SCIFI',
  FIX_GRAMMAR = 'FIX_GRAMMAR'
}
