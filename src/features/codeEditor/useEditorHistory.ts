'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { AppDispatch } from '@/store';
import { setCodeSnippet } from '@/store/reviewEditorStore';

interface UseEditorHistoryReturn {
  onValueChange: (val: string) => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
}

export function useEditorHistory(codeSnippet: string, dispatch: AppDispatch): UseEditorHistoryReturn {
  const undoStackRef = useRef<string[]>([]);
  const redoStackRef = useRef<string[]>([]);
  const codeSnippetRef = useRef(codeSnippet);

  useEffect(() => {
    codeSnippetRef.current = codeSnippet;
  }, [codeSnippet]);

  const onValueChange = useCallback((val: string) => {
    undoStackRef.current.push(codeSnippetRef.current);
    redoStackRef.current = [];
    dispatch(setCodeSnippet(val));
  }, [dispatch]);

  const undo = useCallback(() => {
    const previous = undoStackRef.current.pop();
    if (previous === undefined) return;
    redoStackRef.current.push(codeSnippetRef.current);
    dispatch(setCodeSnippet(previous));
  }, [dispatch]);

  const redo = useCallback(() => {
    const next = redoStackRef.current.pop();
    if (next === undefined) return;
    undoStackRef.current.push(codeSnippetRef.current);
    dispatch(setCodeSnippet(next));
  }, [dispatch]);

  const clearHistory = useCallback(() => {
    undoStackRef.current = [];
    redoStackRef.current = [];
  }, []);

  return {
    onValueChange,
    undo,
    redo,
    clearHistory,
  };
}