import { ChangeEvent } from 'react';

interface InputBaseProps {
    id: string;
    label: string;
    value?: string;
    onChange?: (value: ChangeEvent<HTMLInputElement, HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
}

export function InputBase({ label, id, value, onChange, placeholder, type }: InputBaseProps) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="text-body uppercase tracking-widest text-[#8d8d92]"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full text-body rounded-lg border border-[#2a2a5a]
                bg-transparent px-3 py-2.5 outline-none
                placeholder:text-[#5a5a8a] transition-colors
                focus:border-[#6c6cff] focus:ring-1 focus:ring-[#6c6cff]/40
                text-[#dfdfe2]"
      />
    </div>
  );
}