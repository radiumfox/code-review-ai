'use client';

import { signOut } from 'next-auth/react';
import { ButtonSecondary } from './ButtonSecondary';

export function HeaderBase() {
  return (
    <header className="flex items-center justify-between border-b border-[#8d8d92]/30 px-6 py-4">
      <span className="text-sm uppercase tracking-[0.2em] text-[#dfdfe2]">
        Code Review AI
      </span>
      <ButtonSecondary
        onClick={() => signOut()}
        text="Sign Out"
      />
    </header>
  );
}
