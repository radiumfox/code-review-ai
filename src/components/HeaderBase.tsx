'use client';

import { HeaderMenu } from './HeaderMenu';

export function HeaderBase() {
  return (
    <header className="sticky top-0 left-0 flex items-center justify-between border-b border-[#8d8d92]/30 px-6 py-4 bg-[#0a0a23]">
      <span className="text-body uppercase tracking-[0.2em] text-[#dfdfe2]">
        Code Review AI
      </span>
      <HeaderMenu />
    </header>
  );
}
