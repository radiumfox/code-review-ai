import { IssueCategory, IssueSeverity } from '@/lib/types/review';

export interface Comment {
  id: string;
  issue: string;
  suggestedFix: string;
  category: IssueCategory;
  severity: IssueSeverity;
}

export interface CommentBaseProps {
  issue: string;
  suggestedFix: string;
  category: IssueCategory;
}

export interface CommentsListProps {
  comments: Comment[];
}
