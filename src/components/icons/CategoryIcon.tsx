import { IssueCategory } from '@/lib/types/review';
import { BugIcon } from './BugIcon';
import { StyleIcon } from './StyleIcon';
import { PerformanceIcon } from './PerformanceIcon';
import { SecurityIcon } from './SecurityIcon';

interface CategoryIconProps {
  category: IssueCategory;
  className?: string;
}

const CATEGORY_ICONS = {
  [IssueCategory.Bug]: BugIcon,
  [IssueCategory.Style]: StyleIcon,
  [IssueCategory.Performance]: PerformanceIcon,
  [IssueCategory.Security]: SecurityIcon
} as const;

export function CategoryIcon({ category, className }: CategoryIconProps) {
  const Icon = CATEGORY_ICONS[category];
  return <Icon className={className} />;
}
