'use client';

import { ButtonIcon } from '@/components/ButtonIcon';
import { TooltipBase } from '@/components/TooltipBase';
import { CheckboxIcon } from '@/components/icons/CheckboxIcon';

interface SelectModeButtonProps {
  isActive: boolean;
  onToggle: () => void;
}

export function SelectModeButton({ isActive, onToggle }: SelectModeButtonProps) {
  return (
    <TooltipBase text="Select mode" position="bottom" hasArrow={false}>
      <ButtonIcon
        onClick={onToggle}
        icon={<CheckboxIcon className="w-4 h-4" />}
        ariaLabel={isActive ? 'Disable select mode' : 'Enable select mode'}
        className={isActive ? 'bg-[#1a1a3e]' : ''}
      />
    </TooltipBase>
  );
}
