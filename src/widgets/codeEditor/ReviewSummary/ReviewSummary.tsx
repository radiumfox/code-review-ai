'use client';

import { memo, ReactNode } from 'react';

interface ReviewSummaryProps {
  text?: string;
  className?: string;
  children?: ReactNode;
}

const ReviewSummaryComponent = function ({ text, className = '', children }: ReviewSummaryProps) {
  return (
    <div className={`flex flex-col w-50 min-w-0 overflow-y-auto min-h-100 wrap-break-word ${className}`}>
      <div className="min-h-0 overflow-y-auto bg-[#0d0d2b] custom-scrollbar p-4 text-body space-y-5">
        <div>
          {text ? (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Overall</h3>
              <code className="text-gray-200 font-mono">
                {text}
              </code>
            </div>
          ) : (
            <div className="w-full flex justify-center items-center">
              <code className="text-gray-500 font-mono uppercase">
                {'/** Summary will appear here: */'}
              </code>
            </div>
          )}
        </div>

        { children }
      </div>
    </div>
  );
};

export const ReviewSummary = memo(ReviewSummaryComponent);
