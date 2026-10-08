'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ExternalChange, type ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { auraInit } from '@uiw/codemirror-theme-aura';
import type { Extension } from '@codemirror/state';
import type { AppDispatch } from '@/store';
import {
  selectCodeSnippet,
  selectCurrentReview,
  selectSummary
} from '@/store/reviewEditorStore';
import { THEME_CUSTOM_SETTINGS } from './config';
import { hoverIssueTooltip, issueDecorationsField, issuesField, setIssuesEffect } from './plugins';
import { useLanguage } from './useLanguage';
import { useAIModel } from './useAIModel';
import { useEditorHistory } from './useEditorHistory';
import type { Comment } from './CommentsList/types';

export function useCodeEditor() {
  const codeSnippet = useSelector(selectCodeSnippet);
  const currentReview = useSelector(selectCurrentReview);
  const summary = useSelector(selectSummary);
  const dispatch = useDispatch<AppDispatch>();
  const viewRef = useRef<ReactCodeMirrorRef>(null);

  const {
    language,
    languageName,
    languageExtension,
    onLanguageChange,
  } = useLanguage();
  const {
    model,
    models,
    onModelChange,
    fetchingModels,
    fetchModelsError,
  } = useAIModel();

  const { onValueChange, undo, redo, clearHistory, undoAll } = useEditorHistory(codeSnippet, dispatch);

  const highlightIssues = useCallback(() => {
    viewRef.current?.view?.dispatch({
      effects: setIssuesEffect.of(currentReview?.issues ?? []),
    });
  }, [currentReview]);

  const resetEditor = useCallback(() => {
    const initial = undoAll();
    const view = viewRef.current?.view;
    if (initial === undefined || !view) return;
    view.dispatch({
      changes: {
        from: 0,
        to: view.state.doc.toString().length,
        insert: initial,
      },
      effects: setIssuesEffect.of(currentReview?.issues ?? []),
      annotations: [ExternalChange.of(true)],
    });
  }, [undoAll, currentReview]);

  useEffect(() => {
    clearHistory();
  }, [currentReview, clearHistory]);

  useEffect(() => {
    highlightIssues();
  }, [currentReview]);

  const linesCount = useMemo(() => {
    const valueLength = codeSnippet.split('\n').length;
    return `${valueLength} line${valueLength !== 1 ? 's' : ''}`;
  }, [codeSnippet]);

  const extensions = useMemo(() => {
    const list: Extension[] = [
      hoverIssueTooltip,
      issueDecorationsField,
      issuesField,
    ];
    if (languageExtension) list.push(languageExtension);
    return list;
  }, [languageExtension]);

  const theme = useMemo(() => {
    return auraInit(THEME_CUSTOM_SETTINGS);
  }, []);

  const comments: Comment[] = useMemo(() => {
    if (!currentReview?.issues) return [];

    return currentReview.issues.map((issue, index) => ({
      id: `${currentReview.id}-${index}`,
      line: issue.line,
      issue: issue.message,
      suggestedFix: issue.suggestion,
      category: issue.category,
      severity: issue.severity
    }));
  }, [currentReview]);

  return {
    codeSnippet,
    viewRef,
    language,
    languageName,
    model,
    models,
    currentReview,
    summary,
    onLanguageChange,
    onModelChange,
    onValueChange,
    fetchingModels,
    fetchModelsError,
    linesCount,
    extensions,
    theme,
    comments,
    undo,
    redo,
    resetEditor,
  };
}