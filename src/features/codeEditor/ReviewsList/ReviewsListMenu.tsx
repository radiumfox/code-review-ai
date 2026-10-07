'use client';

import { ButtonIcon } from '@/components/ButtonIcon';
import { DropdownMenu } from '@/components/DropdownMenu';
import { MenuIcon } from '@/components/icons/MenuIcon';

const MENU_ITEMS = ['Select', 'Select all', 'Delete selected'];

export function ReviewsListMenu() {
  return (
    <DropdownMenu
      trigger={() => (
        <ButtonIcon
          icon={<MenuIcon className="w-4 h-4" />}
          onClick={() => {}}
          ariaLabel="Open reviews menu"
        />
      )}
      panelClassName={'w-[200px]'}
      position='bottomRight'
    >
      {MENU_ITEMS.map((item) => (
        <button
          key={item}
          type="button"
          className="block w-full px-3 py-2 text-left text-body text-[#dfdfe2] transition-colors hover:bg-[#151540]/50 cursor-pointer"
        >
          {item}
        </button>
      ))}
    </DropdownMenu>
  );
}
