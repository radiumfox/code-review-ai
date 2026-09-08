export interface AIModelSelectProps {
  value: string | null;
  models: readonly { value: string; label: string }[];
  onChange(value: string): void;
  disabled?: boolean;
  isLoading?: boolean;
  error?: string;
}
