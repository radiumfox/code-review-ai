import { IssueSeverity } from '@/lib/types/review';

export const ISSUE_SEVERITY_COLOR_MAP = {
  [IssueSeverity.Error]: '#ff5555',
  [IssueSeverity.Warning]: '#ffb86c',
  [IssueSeverity.Suggestion]: '#8be9fd'
} as const;
