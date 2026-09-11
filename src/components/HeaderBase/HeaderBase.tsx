'use client';

import { HeaderMenu } from '@/components/HeaderMenu';

export function HeaderBase() {
  return (
    <header className="sticky z-50 top-0 left-0 flex items-center justify-between border-b border-[#8d8d92]/30 px-6 py-4 bg-[#0a0a23]">
      <span className="text-body font-mono uppercase tracking-[0.2em] text-[#dfdfe2] cursor-default">
        Code Review AI
      </span>
      <HeaderMenu />
    </header>
  );
}
