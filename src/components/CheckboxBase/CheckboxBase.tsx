import { type ChangeEvent } from 'react';

interface CheckboxBaseProps {
  id: string;
  label?: string;
  isChecked: boolean;
  onChange: (value: ChangeEvent<HTMLInputElement>) => void;
}

export function CheckboxBase({ id, label, isChecked, onChange }: CheckboxBaseProps) {
  return (
    <label htmlFor={id} className="flex items-center gap-2 cursor-pointer select-none">
      <input
        id={id}
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="appearance-none w-5 h-5 rounded border-2 border-[#2a2a5a] bg-[#12123a] relative
          checked:border-accent/50 checked:bg-accent/50 transition-all shrink-0
          checked:after:content-[''] checked:after:absolute checked:after:left-1 checked:after:top-0.5
          checked:after:w-1.5 checked:after:h-2.5 checked:after:border-white
          checked:after:border-r-2 checked:after:border-b-2 checked:after:rotate-45"
      />
      { label && (<span className="text-body text-[#dfdfe2]">{label}</span>) }
    </label>
  );
}