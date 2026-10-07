'use client';

import { useState } from 'react';
import { ButtonIcon } from '@/components/ButtonIcon';
import { TooltipBase } from '@/components/TooltipBase';
import { CheckboxIcon } from '@/components/icons/CheckboxIcon';

interface SelectModeButtonProps {
  isActive: boolean;
  onToggle: () => void;
}

export function SelectModeButton({ isActive, onToggle }: SelectModeButtonProps) {
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsTooltipOpen(true)}
      onMouseLeave={() => setIsTooltipOpen(false)}
    >
      <TooltipBase text="Select mode" position="bottom" hasArrow={false} isOpen={isTooltipOpen}>
        <ButtonIcon
          onClick={onToggle}
          icon={<CheckboxIcon className="w-4 h-4" />}
          ariaLabel={isActive ? 'Disable select mode' : 'Enable select mode'}
          className={isActive ? 'bg-[#1a1a3e]' : ''}
        />
      </TooltipBase>
    </div>
  );
}
