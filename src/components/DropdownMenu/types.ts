import type { ReactNode } from 'react';

export type DropdownMenuPosition = 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft' | 'right' | 'left';

export interface DropdownMenuTriggerProps {
  isOpen: boolean;
}

export interface DropdownMenuProps {
  trigger: (props: DropdownMenuTriggerProps) => ReactNode;
  children: ReactNode | ((close: () => void) => ReactNode);
  position?: DropdownMenuPosition;
  panelClassName?: string;
  className?: string;
}
