import { IssueCategory, IssueSeverity } from '@/lib/types/review';

export interface Comment {
  id: string;
  line: number;
  issue: string;
  suggestedFix: string;
  category: IssueCategory;
  severity: IssueSeverity;
}

export interface CommentBaseProps {
  line: number;
  issue: string;
  suggestedFix: string;
  category: IssueCategory;
}

export interface CommentsListProps {
  comments: Comment[];
}
