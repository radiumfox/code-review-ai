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

const SEVERITY_TITLES: Record<IssueSeverity, string> = {
  [IssueSeverity.Error]: 'Errors',
  [IssueSeverity.Warning]: 'Warnings',
  [IssueSeverity.Suggestion]: 'Suggestions'
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
            <h3 className="text-sm font-semibold text-gray-400 mb-2">
              {SEVERITY_TITLES[severity]}
            </h3>
            <ol className="flex flex-col list-decimal list-inside">
              {items.map((comment) => (
                <CommentBase
                  key={comment.id}
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
