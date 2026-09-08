'use client';

import CodeMirror from '@uiw/react-codemirror';
import { useCallback, useState } from 'react';
import { LanguageSelect } from './LanguageSelect';
import { StarIcon } from '@/components/icons/StarIcon';
import ArrowRightIcon from '@/components/icons/ArrowRightIcon';
import { EDITOR_BASIC_SETUP, EDITOR_TEST_IDS } from './config';
import { useCodeEditor } from './useCodeEditor';
import { useGetReview } from './useGetReview';
import { ReviewSummary } from './ReviewSummary';
import { SlideOutDrawer } from '@/components/SlideOutDrawer';
import { ButtonIcon } from '@/components/ButtonIcon';
import { ReviewsList } from './ReviewsList';
import { SpinnerBase } from '@/components/SpinnerBase';
import { CommentsList } from './CommentsList';
import { AIModelSelect } from './AIModelSelect';

export function CodeEditor() {
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const {
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
  } = useCodeEditor();

  const {
    reviewLoading,
    getReview,
  } = useGetReview();

  const closeSummary = useCallback(() => setIsSummaryOpen(false), []);

  const closeReviewList = useCallback(() => setIsReviewsOpen(false), []);

  return (
    <div className="transition-all duration-300 h-full flex flex-col">
      <div className="bg-[#0d0d2b] rounded-xl border border-[#1e1e4a] shadow-2xl shadow-black/50 overflow-hidden flex flex-col flex-1 min-h-0">
        {/* Toolbar */}
        <div className={
          `flex flex-col gap-2 sm:gap-3
          px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 transition-all duration-300
          bg-[#151540] border-b border-[#1e1e4a]`
        }>
          <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-between">
            <div className="flex items-center gap-2">
              <StarIcon className="text-[#6c6cff] w-5 h-5" />
              <span className="uppercase text-body transition-all duration-300 font-medium text-[#6c6cff]">Code Editor</span>
            </div>

            <div className="flex gap-x-5">
              <div className="flex lg:hidden gap-x-3 items-center">
                <span className="text-body text-gray-400 font-medium whitespace-nowrap">Reviews history</span>
                <ButtonIcon
                  onClick={() => setIsReviewsOpen(true)}
                  icon={<ArrowRightIcon className="w-3.5 h-3.5" />}
                  ariaLabel="Open reviews history"
                />
              </div>
              <div className="flex md:hidden gap-x-3 items-center">
                <span className="text-body text-gray-400 font-medium whitespace-nowrap">Summary</span>
                <ButtonIcon
                  onClick={() => setIsSummaryOpen(true)}
                  icon={<ArrowRightIcon className="w-3.5 h-3.5" />}
                  ariaLabel="Open summary"
                />
              </div>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 justify-start">
            {/* AI model select */}
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <span className="text-body text-gray-400 font-medium whitespace-nowrap">Model:</span>
              <AIModelSelect
                value={model}
                models={models}
                onChange={onModelChange}
                disabled={reviewLoading}
                isLoading={fetchingModels}
                error={fetchModelsError}
              />
            </div>
            {/* Language select */}
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <span className="text-body text-gray-400 font-medium whitespace-nowrap">Language:</span>
              <LanguageSelect
                value={language}
                onChange={onLanguageChange}
                disabled={reviewLoading}
              />
            </div>
          </div>
        </div>

        {/* Editor + Summary */}
        <div className="flex flex-col md:flex-row flex-1 min-h-0">
          {/* Editor */}
          <CodeMirror
            ref={viewRef}
            value={codeSnippet}
            height="100%"
            width="100%"
            extensions={extensions}
            onChange={onValueChange}
            basicSetup={EDITOR_BASIC_SETUP}
            theme={theme}
            className="flex-1 min-w-0 min-h-0"
            aria-description="Code editor"
            placeholder="Write your code here..."
            readOnly={reviewLoading}
          />

          {/* Divider */}
          <div className="hidden md:block w-px bg-[#1e1e4a]" />

          {/* Summary panel */}
          <ReviewSummary
            text={summary}
            className="hidden md:flex w-[40%]"
          >
            {comments.length > 0 && (
              <CommentsList comments={comments} />
            )}
          </ReviewSummary>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-2 px-3 sm:px-4 md:px-5 py-2 transition-all duration-300 bg-[#151540] border-t border-[#1e1e4a]">
          <div className="flex items-center justify-between">
            <span className="text-body text-gray-500 truncate" data-testid={EDITOR_TEST_IDS.languageName}>
              {languageName}
            </span>
            <span className="text-body text-gray-500">
              {linesCount}
            </span>
          </div>
          <div className="flex w-full justify-end">
            <button
              type="button"
              onClick={getReview}
              disabled={reviewLoading}
              className="max-w-[500px] w-full flex items-center justify-center gap-2 rounded-lg uppercase tracking-widest text-body font-medium py-2 bg-[#6c6cff] text-[#0a0a23] hover:bg-[#8282ff] transition-colors cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-default"
            >
              {reviewLoading ? <SpinnerBase /> : <StarIcon className="w-4 h-4" />}
              {reviewLoading ? 'Reviewing...' : 'Get Review'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile summary drawer */}
      <SlideOutDrawer
        isOpen={isSummaryOpen}
        onClose={closeSummary}
        title="Summary"
        buttonCloseAreaLabel="Close summary drawer"
        backdropClassName="md:hidden"
        panelClassName="md:hidden"
      >
        <ReviewSummary
          text={summary}
          className="flex-1 w-auto!"
        >
          {comments.length > 0 && (
            <CommentsList comments={comments} />
          )}
        </ReviewSummary>
      </SlideOutDrawer>

      {/* Mobile reviews history drawer */}
      <SlideOutDrawer
        isOpen={isReviewsOpen}
        onClose={closeReviewList}
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