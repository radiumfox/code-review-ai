'use client';

import { memo, ReactNode } from 'react';

interface ReviewSummaryProps {
  text?: string;
  className?: string;
  children?: ReactNode;
}

const ReviewSummaryComponent = function ({ text, className = '', children }: ReviewSummaryProps) {
  return (
    <div className={`flex flex-col w-50 min-w-0 overflow-y-auto min-h-100 wrap-break-word h-full ${className}`}>
      <div className="min-h-0 overflow-y-auto bg-[#0d0d2b] custom-scrollbar p-4 text-body space-y-5">
        <div>
          {text ? (
            <code className="text-gray-200">
              {text}
            </code>
          ) : (
            <code className="text-gray-500">
              {'/** Summary will appear here: */'}
            </code>
          )}
        </div>

        { children }
      </div>
    </div>
  );
};

export const ReviewSummary = memo(ReviewSummaryComponent);
