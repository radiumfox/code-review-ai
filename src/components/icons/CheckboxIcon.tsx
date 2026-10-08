interface CheckboxIconProps {
  className?: string;
}

export function CheckboxIcon({ className }: CheckboxIconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <path d="M8 12l3 3 5-6" />
    </svg>
  );
}
