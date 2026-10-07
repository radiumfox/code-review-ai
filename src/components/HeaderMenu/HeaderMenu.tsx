'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { DropdownMenu } from '@/components/DropdownMenu';
import { MenuIcon } from '@/components/icons/MenuIcon';
import { HEADER_MENU_TEST_IDS, MENU_ITEMS } from './config';
import { ROUTES } from '@/lib/config';

export function HeaderMenu() {
  const pathname = usePathname();

  return (
    <DropdownMenu
      position="bottomRight"
      panelClassName="z-60 min-w-52"
      trigger={({ isOpen }) => (
        <button
          aria-label="Toggle navigation menu"
          aria-haspopup="menu"
          aria-expanded={isOpen}
          data-testid={HEADER_MENU_TEST_IDS.menuButton}
          className="flex items-center justify-center p-2 border border-[#8d8d92] text-[#8d8d92] transition-all duration-200 hover:bg-[#8d8d92] hover:text-[#0a0a23] focus:outline-none cursor-pointer"
        >
          <MenuIcon className="w-5 h-5" />
        </button>
      )}
    >
      {(close) => (
        <nav
          aria-label="Navigation menu"
          data-testid={HEADER_MENU_TEST_IDS.menuPanel}
          className="flex flex-col"
        >
          {MENU_ITEMS.map((item) => {
            const isActive =
              item.href === ROUTES.main ? pathname === ROUTES.main : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                data-testid={item.testId}
                className={
                  `px-4 py-3 text-body uppercase tracking-[0.15em] transition-colors
                  ${isActive ? 'bg-[#1a1a3e] text-accent' : 'text-[#dfdfe2] hover:bg-[#1a1a3e]'}`
                }
              >
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={() => {
              close();
              signOut();
            }}
            data-testid={HEADER_MENU_TEST_IDS.logoutButton}
            className="px-4 py-3 text-body uppercase tracking-[0.15em] text-destructive text-left transition-colors hover:bg-[#1a1a3e] focus:outline-none cursor-pointer border-t border-[#1e1e4a]"
          >
            Log out
          </button>
        </nav>
      )}
    </DropdownMenu>
  );
}
