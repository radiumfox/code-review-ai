"use client";

import React from "react";

interface ButtonSecondaryProps {
  onClick?: () => void;
  icon?: React.ReactNode;
  text: string;
}

export default function ButtonSecondary({ onClick, icon, text }: ButtonSecondaryProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 border border-[#8d8d92] bg-transparent px-4 py-2 text-sm uppercase tracking-[0.1em] text-[#8d8d92] transition-all duration-200 hover:bg-[#8d8d92] hover:text-[#0a0a23] focus:outline-none"
    >
      {icon}
      {text}
    </button>
  );
}
