"use client";

import React from "react";

interface ButtonBaseProps {
  onClick?: () => void;
  icon?: React.ReactNode;
  text: string;
}

export default function ButtonBase({ onClick, icon, text }: ButtonBaseProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 border-2 border-[#dfdfe2] bg-transparent px-8 py-4 text-lg uppercase tracking-[0.15em] text-[#dfdfe2] transition-all duration-200 hover:bg-[#dfdfe2] hover:text-[#0a0a23] focus:outline-none"
    >
      {icon}
      {text}
    </button>
  );
}
