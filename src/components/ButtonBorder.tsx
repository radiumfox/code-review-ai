interface ButtonBorderProps {
    theme: 'default' | 'success';
    isLoading: boolean;
    disabled: boolean;
    text: string;
    loadingText?: string;
    onClick?: () => void;
}

export function ButtonBorder({ theme, isLoading, disabled, text, loadingText, onClick }: ButtonBorderProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
              flex items-center justify-center gap-2 px-6 py-2.5 text-sm
              uppercase tracking-widest rounded-lg border transition-all
              ${theme === 'success'
      ? 'border-[#4ade80] text-[#4ade80] bg-[#4ade80]/10'
      : 'border-[#6c6cff] text-[#6c6cff] hover:bg-[#6c6cff] hover:text-[#0a0a23]'
    }
              disabled:opacity-40 disabled:pointer-events-none cursor-pointer
              focus:outline-none
            `}
    >
      {isLoading ? (
        <>
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          { loadingText }
        </>
      ) : text}
    </button>
  );
}