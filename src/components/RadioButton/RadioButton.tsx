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
      ? 'border-accent bg-accent/10'
      : !disabled
        ? 'border-[#2a2a5a] hover:border-accent/50'
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
                  checked:border-accent checked:bg-accent
                  checked:shadow-[inset_0_0_0_3px_#0a0a23]
                  transition-all shrink-0"
      />
      <div className="flex flex-col">
        <span className="text-body uppercase tracking-widest text-[#dfdfe2]">
          {label}
        </span>
        {helpText && (
          <span className="text-body text-[#5a5a8a] mt-0.5">
            {helpText}
          </span>
        )}
      </div>
    </label>
  );
}