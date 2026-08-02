import { ChangeEvent } from 'react';

interface RadioButtonProps {
    id: string;
    isActive: boolean;
    disabled?: boolean;
    label: string;
    onChange: (value: ChangeEvent<HTMLInputElement, HTMLInputElement>) => void;
    helpText?: string;
}

export function RadioButton({ id, isActive, disabled, label, onChange, helpText }: RadioButtonProps) {
  return (
    <label
      className={`
                flex items-center gap-4 px-5 py-4 rounded-lg border transition-all cursor-pointer
                ${isActive
      ? 'border-[#6c6cff] bg-[#6c6cff]/10'
      : !disabled
        ? 'border-[#2a2a5a] hover:border-[#6c6cff]/50'
        : 'border-[#2a2a5a] opacity-50 cursor-not-allowed'
    }
                ${disabled ? 'pointer-events-none' : ''}
              `}
    >
      <input
        type="radio"
        name="provider"
        value={id}
        checked={isActive}
        onChange={onChange}
        disabled={disabled}
        className="appearance-none w-4 h-4 rounded-full border-2 border-[#2a2a5a]
                  checked:border-[#6c6cff] checked:bg-[#6c6cff]
                  checked:shadow-[inset_0_0_0_3px_#0a0a23]
                  transition-all shrink-0"
      />
      <div className="flex flex-col">
        <span className="text-sm uppercase tracking-widest text-[#dfdfe2]">
          {label}
        </span>
        {helpText && (
          <span className="text-xs text-[#5a5a8a] mt-0.5">
            {helpText}
          </span>
        )}
      </div>
    </label>
  );
}