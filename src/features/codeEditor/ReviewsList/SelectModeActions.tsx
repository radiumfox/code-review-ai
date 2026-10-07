'use client';

import { ButtonIcon } from '@/components/ButtonIcon';
import { TooltipBase } from '@/components/TooltipBase';
import { ListChecksIcon } from '@/components/icons/ListChecksIcon';
import { TrashIcon } from '@/components/icons/TrashIcon';
import { XIcon } from '@/components/icons/XIcon';

interface SelectModeActionsProps {
  selectedCount: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onDeleteSelected: () => void;
}

export function SelectModeActions({ selectedCount, onSelectAll, onDeselectAll, onDeleteSelected }: SelectModeActionsProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 border-b border-[#1e1e4a]">
      <TooltipBase text="Select all" position="bottom" hasArrow={false}>
        <ButtonIcon
          onClick={onSelectAll}
          icon={<ListChecksIcon className="w-4 h-4" />}
          ariaLabel="Select all"
        />
      </TooltipBase>
      {selectedCount > 0 && (
        <TooltipBase text="Deselect all" position="bottom" hasArrow={false}>
          <ButtonIcon
            onClick={onDeselectAll}
            icon={<XIcon className="w-4 h-4" />}
            ariaLabel="Deselect all"
          />
        </TooltipBase>
      )}
      <TooltipBase text="Delete selected" position="bottom" hasArrow={false}>
        <ButtonIcon
          onClick={onDeleteSelected}
          icon={<TrashIcon className="w-4 h-4" />}
          ariaLabel="Delete selected"
          className="text-destructive! disabled:opacity-50"
          disabled={selectedCount === 0}
        />
      </TooltipBase>
    </div>
  );
}
