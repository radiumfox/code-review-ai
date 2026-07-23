export type SelectItem<T extends string> = { value: T; label: string };

export interface SelectBaseProps<T extends string> {
    items: readonly SelectItem<T>[];
    value: T | null;
    onChange?(value: T): void;
    placeholder?: string;
    notFoundText?: string;
    className?: string;
    onScrollEnd?(): void;
    isLoading?: boolean;
    hasMore?: boolean;
    disabled?: boolean;
}

export interface SelectBaseItemProps {
    text: string;
    isCurrent: boolean;
    onClick?: () => void
}