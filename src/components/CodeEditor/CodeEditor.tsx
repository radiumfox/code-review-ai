'use client';

import CodeMirror from '@uiw/react-codemirror';
import { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { auraInit } from '@uiw/codemirror-theme-aura';
import { langs } from '@uiw/codemirror-extensions-langs';
import { ModelSelect } from '@/components/ModelSelect';
import { LanguageSelect } from '@/components/LanguageSelect';
import { LANGUAGES_NAMES_MAP } from '@/lib/config';
import { StarIcon } from '@/components/icons/StarIcon';
import ArrowRightIcon from '@/components/icons/ArrowRightIcon';
import {
  DEFAULT_EDITOR_VALUE,
  EDITOR_BASIC_SETUP,
  THEME_CUSTOM_SETTINGS
} from './config';
import { ButtonBase, ButtonBaseSizes } from '@/components/ButtonBase';
import { hoverIssueTooltip, issueDecorationsField, setIssuesEffect } from './plugins';
import { ReviewSummary } from '@/components/ReviewSummary';
import { SlideOutDrawer } from '@/components/SlideOutDrawer';
import { ButtonIcon } from '@/components/ButtonIcon';
import { NotificationType, useNotification } from '@/lib/notifications';
import { ReviewsList } from '@/components/ReviewsList';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/store';
import {
  createReview,
  selectCurrentReview,
  selectLang,
  selectModel,
  selectCreateReviewLoading,
  selectCreateReviewError,
  setLanguage,
  setModel,
} from '@/store/reviewsStore';

export function CodeEditor() {
  const [value, setValue] = useState(DEFAULT_EDITOR_VALUE);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const { showNotification } = useNotification();
  const currentReview = useSelector(selectCurrentReview);
  const language = useSelector(selectLang);
  const model = useSelector(selectModel);
  const reviewLoading = useSelector(selectCreateReviewLoading);
  const reviewError = useSelector(selectCreateReviewError);
  const dispatch = useDispatch<AppDispatch>();

  const viewRef = useRef<ReactCodeMirrorRef>(null);

  const issues = useMemo(() => currentReview?.issues ?? [], [currentReview]);

  useEffect(() => {
    if(reviewError) {
      showNotification({
        type: NotificationType.Error,
        message: reviewError,
      });
    }
  }, [reviewError, showNotification]);

  useEffect(() => {
    if(currentReview?.issues && viewRef.current) {
      viewRef.current.view?.dispatch({
        effects: setIssuesEffect.of(currentReview.issues)
      });
    }
  }, [currentReview]);

  const onValueChange = useCallback((val: string) => {
    setValue(val);
  }, []);

  const linesCount = useMemo(() => {
    const valueLength = value.split('\n').length;
    return `${valueLength} line${valueLength !== 1 ? 's' : ''}`;
  }, [value]);

  const extensions = useMemo(() => {
    return [
      langs[language](),
      issueDecorationsField,
      hoverIssueTooltip(issues)
    ];
  }, [language, issues]);

  const theme = useMemo(() => {
    return auraInit(THEME_CUSTOM_SETTINGS);
  }, []);

  const getReview = () => {
    dispatch(createReview({
      language: language,
      codeSnippet: value,
      model: model
    }));
  };

  useLayoutEffect(() => {
    if (currentReview && viewRef.current) {
      viewRef.current.view?.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.view.state.doc.length,
          insert: currentReview.codeSnippet
        },
      });

      if(currentReview.issues && viewRef.current) {
        viewRef.current.view?.dispatch({
          effects: setIssuesEffect.of(currentReview.issues)
        });
      }
    }
  }, [currentReview]);

  return (
    <div className="transition-all duration-300">
      <div className=" bg-[#0d0d2b] rounded-xl border border-[#1e1e4a] shadow-2xl shadow-black/50 overflow-hidden">
        {/* Toolbar */}
        <div className={
          `flex flex-col gap-2 sm:gap-3
          px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 transition-all duration-300
          bg-[#151540] border-b border-[#1e1e4a]`
        }>
          <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-between">
            <div className="flex items-center gap-2">
              <StarIcon className="text-[#6c6cff] w-5 h-5" />
              <span className="uppercase text-xs sm:text-sm transition-all duration-300 font-medium text-[#6c6cff]">Code Editor</span>
            </div>

            <div className="flex gap-x-5">
              <div className="flex lg:hidden gap-x-3 items-center">
                <span className="text-xs sm:text-sm text-gray-400 font-medium whitespace-nowrap">Reviews history</span>
                <ButtonIcon
                  onClick={() => setIsReviewsOpen(true)}
                  icon={<ArrowRightIcon className="w-3.5 h-3.5" />}
                  ariaLabel="Open reviews history"
                />
              </div>
              <div className="flex md:hidden gap-x-3 items-center">
                <span className="text-xs sm:text-sm text-gray-400 font-medium whitespace-nowrap">Summary</span>
                <ButtonIcon
                  onClick={() => setIsSummaryOpen(true)}
                  icon={<ArrowRightIcon className="w-3.5 h-3.5" />}
                  ariaLabel="Open summary"
                />
              </div>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
            {/* Model select */}
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <span className="text-xs sm:text-sm text-gray-400 font-medium whitespace-nowrap">Model:</span>
              <ModelSelect
                value={model}
                onChange={(value) => dispatch(setModel(value))}
              />
            </div>

            {/* Language select */}
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <span className="text-xs sm:text-sm text-gray-400 font-medium whitespace-nowrap">Language:</span>
              <LanguageSelect
                value={language}
                onChange={(value) => dispatch(setLanguage(value))}
              />
            </div>
          </div>
        </div>

        {/* Editor + Summary */}
        <div className="flex flex-col md:flex-row h-75 lg-y:h-150 xl-y:h-200">
          {/* Editor */}
          <CodeMirror
            ref={viewRef}
            value={value}
            height="100%"
            width="100%"
            extensions={extensions}
            onChange={onValueChange}
            basicSetup={EDITOR_BASIC_SETUP}
            theme={theme}
            className="flex-1"
          />

          {/* Divider */}
          <div className="hidden md:block w-px bg-[#1e1e4a]" />

          {/* Summary panel */}
          <ReviewSummary
            text={currentReview?.summary}
            className="hidden md:flex md:w-50 xl:w-75"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-3 sm:px-4 md:px-5 py-2 transition-all duration-300 bg-[#151540] border-t border-[#1e1e4a]">
          <span className="text-xs text-gray-500 truncate">
            {LANGUAGES_NAMES_MAP[language] ?? language}
          </span>
          <span className="text-xs text-gray-500">
            {linesCount}
          </span>
        </div>
      </div>

      {/* Review button */}
      <div className="mt-6 flex justify-center">
        <ButtonBase
          text={reviewLoading ? 'Reviewing...' : 'Get Review'}
          onClick={getReview}
          icon={<StarIcon />}
          size={ButtonBaseSizes.Md}
          isLoading={reviewLoading}
        />
      </div>

      {/* Mobile summary drawer */}
      <SlideOutDrawer
        isOpen={isSummaryOpen}
        onClose={() => setIsSummaryOpen(false)}
        title="Summary"
        buttonCloseAreaLabel="Close summary drawer"
        backdropClassName="md:hidden"
        panelClassName="md:hidden"
      >
        <ReviewSummary
          text={currentReview?.summary}
          className="flex-1 w-auto!"
        />
      </SlideOutDrawer>

      {/* Mobile reviews history drawer */}
      <SlideOutDrawer
        isOpen={isReviewsOpen}
        onClose={() => setIsReviewsOpen(false)}
        title="Reviews history"
        buttonCloseAreaLabel="Close reviews drawer"
        panelClassName="lg:hidden"
        backdropClassName="lg:hidden"
      >
        <ReviewsList
          showTitle={false}
          className="w-full"
        />
      </SlideOutDrawer>
    </div>
  );
}
