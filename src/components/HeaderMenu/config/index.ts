import { ROUTES } from '@/lib/config';

export const HEADER_MENU_TEST_IDS = {
  menuButton: 'header-menu-button',
  menuPanel: 'header-menu-panel',
  mainPageLink: 'header-menu-main-page',
  logoutButton: 'header-menu-logout',
};

export const MENU_ITEMS = [
  { href: ROUTES.main, label: 'Main page', testId: HEADER_MENU_TEST_IDS.mainPageLink },
] as const;