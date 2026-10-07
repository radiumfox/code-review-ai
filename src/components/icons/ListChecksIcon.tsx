interface ListChecksIconProps {
  className?: string;
}

export function ListChecksIcon({ className }: ListChecksIconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 6h10" />
      <path d="M11 12h10" />
      <path d="M11 18h10" />
      <path d="m3 5 1.5 1.5L7 4" />
      <path d="m3 11 1.5 1.5L7 10" />
      <path d="m3 17 1.5 1.5L7 16" />
    </svg>
  );
}
