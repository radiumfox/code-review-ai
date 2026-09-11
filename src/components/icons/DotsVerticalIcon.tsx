interface DotsVerticalIconProps {
  className?: string;
}

export function DotsVerticalIcon({ className }: DotsVerticalIconProps) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v.01" />
      <path d="M12 12v.01" />
      <path d="M12 19v.01" />
    </svg>
  );
}