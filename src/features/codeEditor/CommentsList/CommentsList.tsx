'use client';

import { useMemo } from 'react';
import { CommentBase } from './CommentBase';
import { IssueSeverity } from '@/lib/types/review';
import type { Comment, CommentsListProps } from './types';

interface GroupedComments {
  [IssueSeverity.Error]: Comment[];
  [IssueSeverity.Warning]: Comment[];
  [IssueSeverity.Suggestion]: Comment[];
}

const SEVERITY_TITLES: Record<IssueSeverity, (count: number) => string> = {
  [IssueSeverity.Error]: (count) => `${count} Issue${count === 1 ? '' : 's'}:`,
  [IssueSeverity.Warning]: (count) => `${count} Warning${count === 1 ? '' : 's'}:`,
  [IssueSeverity.Suggestion]: (count) => `${count} Suggestion${count === 1 ? '' : 's'}:`
};

const SEVERITY_TITLE_COLORS: Record<IssueSeverity, string> = {
  [IssueSeverity.Error]: 'text-destructive',
  [IssueSeverity.Warning]: 'text-warning',
  [IssueSeverity.Suggestion]: 'text-suggestion'
};

const SEVERITY_ORDER: IssueSeverity[] = [
  IssueSeverity.Error,
  IssueSeverity.Warning,
  IssueSeverity.Suggestion
];

function groupBySeverity(comments: Comment[]): GroupedComments {
  return comments.reduce<GroupedComments>(
    (groups, comment) => {
      groups[comment.severity].push(comment);
      return groups;
    },
    {
      [IssueSeverity.Error]: [],
      [IssueSeverity.Warning]: [],
      [IssueSeverity.Suggestion]: []
    }
  );
}

export function CommentsList({ comments }: CommentsListProps) {
  const groupedComments = useMemo(() => groupBySeverity(comments), [comments]);

  return (
    <div className="flex flex-col gap-4">
      {SEVERITY_ORDER.map((severity) => {
        const items = groupedComments[severity];
        if (items.length === 0) return null;

        return (
          <section key={severity}>
            <h4 className={`text-md font-semibold mb-2 uppercase ${SEVERITY_TITLE_COLORS[severity]}`}>
              {SEVERITY_TITLES[severity](items.length)}
            </h4>
            <ol className="flex flex-col">
              {items.map((comment) => (
                <CommentBase
                  key={comment.id}
                  line={comment.line}
                  issue={comment.issue}
                  suggestedFix={comment.suggestedFix}
                  category={comment.category}
                />
              ))}
            </ol>
          </section>
        );
      })}
    </div>
  );
}