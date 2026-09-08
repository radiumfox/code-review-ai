'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { auraInit } from '@uiw/codemirror-theme-aura';
import type { Extension } from '@codemirror/state';
import type { AppDispatch } from '@/store';
import {
  selectCodeSnippet,
  selectCurrentReview,
  selectSummary,
  setCodeSnippet
} from '@/store/reviewEditorStore';
import { THEME_CUSTOM_SETTINGS } from './config';
import { hoverIssueTooltip, issueDecorationsField, issuesField, setIssuesEffect } from './plugins';
import { useLanguage } from './useLanguage';
import { useAIModel } from './useAIModel';
import type { Comment } from './CommentsList/types';

export function useCodeEditor() {
  const codeSnippet = useSelector(selectCodeSnippet);
  const currentReview = useSelector(selectCurrentReview);
  const summary = useSelector(selectSummary);
  const dispatch = useDispatch<AppDispatch>();
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

  const viewRef = useRef<ReactCodeMirrorRef>(null);

  useEffect(() => {
    viewRef.current?.view?.dispatch({
      effects: setIssuesEffect.of(currentReview?.issues ?? []),
    });
  }, [currentReview]);

  const onValueChange = useCallback((val: string) => {
    dispatch(setCodeSnippet(val));
  }, [dispatch]);

  const linesCount = useMemo(() => {
    const valueLength = codeSnippet.split('\n').length;
    return `${valueLength} line${valueLength !== 1 ? 's' : ''}`;
  }, [codeSnippet]);

  const extensions = useMemo(() => {
    const list: Extension[] = [hoverIssueTooltip, issueDecorationsField, issuesField];
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
  };
}