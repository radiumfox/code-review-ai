'use client';

import CodeMirror, { EditorView } from '@uiw/react-codemirror';
import { useCallback, useEffect, useState } from 'react';
import { undo, redo } from '@codemirror/commands';
import { LanguageSelect } from './LanguageSelect';
import { StarIcon } from '@/components/icons/StarIcon';
import ArrowRightIcon from '@/components/icons/ArrowRightIcon';
import { UndoIcon } from '@/components/icons/UndoIcon';
import { RedoIcon } from '@/components/icons/RedoIcon';
import { CopyIcon } from '@/components/icons/CopyIcon';
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
import { TooltipBase } from '@/components/TooltipBase';

export function CodeEditor() {
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [isReviewsOpen, setIsReviewsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const {
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
  } = useCodeEditor();

  const {
    reviewLoading,
    getReview,
  } = useGetReview();

  const closeSummary = useCallback(() => setIsSummaryOpen(false), []);

  const closeReviewList = useCallback(() => setIsReviewsOpen(false), []);

  const handleUndo = useCallback(() => {
    const view = viewRef.current?.view;
    if (!view) return;
    undo({ state: view.state, dispatch: view.dispatch });
  }, [viewRef]);

  const handleRedo = useCallback(() => {
    const view = viewRef.current?.view;
    if (!view) return;
    redo({ state: view.state, dispatch: view.dispatch });
  }, [viewRef]);

  const handleCopy = useCallback(() => {
    if (!navigator.clipboard) return;
    void navigator.clipboard.writeText(codeSnippet).catch(() => {});
    setIsCopied(true);
  }, [codeSnippet]);

  useEffect(() => {
    if (!isCopied) return;
    const timer = setTimeout(() => setIsCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [isCopied]);

  const handleCommentClick = useCallback((line: number) => {
    const view = viewRef.current?.view;
    if (!view) return;
    view.dispatch({
      selection: { anchor: view.state.doc.line(line).from },
      effects: EditorView.scrollIntoView(view.state.doc.line(line).from, { y: 'center' }),
      scrollIntoView: true
    });
    view.focus();

    closeSummary();
  }, [viewRef]);

  return (
    <div className="transition-all duration-300 h-full flex flex-col">
      <div className="bg-[#0d0d2b] rounded-xl border border-[#1e1e4a] shadow-2xl shadow-black/50 overflow-hidden flex flex-col flex-1 min-h-0">
        {/* Toolbar */}
        <div className={
          `flex flex-col gap-2 sm:gap-3
          px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 transition-all duration-300
          bg-[#151540] border-b border-[#1e1e4a]`
        }>
          <div className="flex flex-col gap-2 flex-1 justify-between xs:flex-row xs:items-center xs:gap-2">
            <div className="flex items-center gap-2 hidden xs:flex">
              <StarIcon className="text-[#6c6cff] w-5 h-5" />
              <span className="uppercase text-body transition-all duration-300 font-mono font-medium text-[#6c6cff]">Code Editor</span>
            </div>

            <div className="flex items-start gap-2">
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

          <div className="flex flex-col-reverse gap-2 sm:gap-3 2xl:flex-row 2xl:justify-between">
            <div className="flex items-center gap-2">
              <ButtonIcon
                onClick={handleUndo}
                icon={<UndoIcon className="w-5 h-5" />}
                ariaLabel="Undo"
                size="md"
              />
              <ButtonIcon
                onClick={handleRedo}
                icon={<RedoIcon className="w-5 h-5" />}
                ariaLabel="Redo"
                size="md"
              />
              <TooltipBase text="Copied!" position="top" hasArrow={false} isOpen={isCopied}>
                <ButtonIcon
                  onClick={handleCopy}
                  icon={<CopyIcon className="w-5 h-5" />}
                  ariaLabel="Copy code"
                  size="md"
                />
              </TooltipBase>
            </div>
            {/* AI model select */}
            <div className="flex flex-col gap-2 sm:gap-3 2xl:flex-row 2xl:gap-6 2xl:justify-start">
              <div className="flex items-center gap-2 sm:gap-3 w-full 2xl:w-auto">
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
              <div className="flex items-center gap-2 sm:gap-3 w-full 2xl:w-auto">
                <span className="text-body text-gray-400 font-medium whitespace-nowrap">Language:</span>
                <LanguageSelect
                  value={language}
                  onChange={onLanguageChange}
                  disabled={reviewLoading}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Editor + Summary */}
        <div className="flex flex-col md:flex-row flex-1 min-h-0">
          {/* Editor */}
          <CodeMirror
            key={currentReview?.id}
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
            className="hidden md:flex w-[40%] h-[calc(100%+50px)]"
          >
            {comments.length > 0 && (
              <CommentsList comments={comments} onCommentClick={handleCommentClick} />
            )}
          </ReviewSummary>
        </div>

        {/* Footer */}
        <div className="px-3 sm:px-4 md:px-5 py-2 transition-all duration-300 bg-[#151540] border-t border-[#1e1e4a]  md:w-[60%]">
          <div className="flex flex-col gap-2 xs:flex-row-reverse xs:items-center">
            <div className="flex w-full justify-end">
              <button
                type="button"
                onClick={getReview}
                disabled={reviewLoading}
                className="max-w-100 w-full flex items-center justify-center gap-2 rounded-lg uppercase tracking-widest text-body font-medium py-2 bg-[#6c6cff] text-[#0a0a23] hover:bg-[#8282ff] transition-colors cursor-pointer focus:outline-none disabled:opacity-50 disabled:cursor-default"
              >
                {reviewLoading ? <SpinnerBase className="border-[#0a0a23]" /> : <StarIcon className="w-4 h-4" />}
                {reviewLoading ? 'Reviewing...' : (currentReview ? 'Review again' : 'Review Code')}
              </button>
            </div>
            <p className="flex w-full text-body text-gray-500" data-testid={EDITOR_TEST_IDS.languageName}>
              {`${languageName} • ${linesCount}`}
            </p>
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
          className="flex-1 w-auto! h-full"
        >
          {comments.length > 0 && (
            <CommentsList comments={comments} onCommentClick={handleCommentClick} />
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
          onReviewClick={closeReviewList}
        />
      </SlideOutDrawer>
    </div>
  );
}