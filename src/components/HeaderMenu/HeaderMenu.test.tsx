import { describe, expect, test, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { HeaderMenu } from './HeaderMenu';
import { HEADER_MENU_TEST_IDS } from './config';
import { ROUTES } from '@/lib/config';

const signOutMock = vi.fn();

vi.mock('next-auth/react', () => ({
  signOut: () => signOutMock(),
}));

const usePathnameMock = vi.fn(() => ROUTES.main);

vi.mock('next/navigation', () => ({
  usePathname: () => usePathnameMock(),
}));

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('HeaderMenu', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  test('Renders closed menu by default', () => {
    render(<HeaderMenu />);

    expect(screen.getByTestId(HEADER_MENU_TEST_IDS.menuButton)).toBeDefined();
    expect(screen.queryByTestId(HEADER_MENU_TEST_IDS.menuPanel)).toBeNull();
  });

  test('Opens menu on button click', () => {
    render(<HeaderMenu />);

    fireEvent.click(screen.getByTestId(HEADER_MENU_TEST_IDS.menuButton));

    expect(screen.getByTestId(HEADER_MENU_TEST_IDS.menuPanel)).toBeDefined();
    expect(screen.getByText('Main page')).toBeDefined();
    expect(screen.getByText('Log out')).toBeDefined();
  });

  test('Renders link to main page', () => {
    render(<HeaderMenu />);

    fireEvent.click(screen.getByTestId(HEADER_MENU_TEST_IDS.menuButton));

    expect(screen.getByTestId(HEADER_MENU_TEST_IDS.mainPageLink).getAttribute('href')).toBe('/');
  });

  test('Closes menu when a link is clicked', () => {
    render(<HeaderMenu />);

    fireEvent.click(screen.getByTestId(HEADER_MENU_TEST_IDS.menuButton));
    fireEvent.click(screen.getByTestId(HEADER_MENU_TEST_IDS.mainPageLink));

    expect(screen.queryByTestId(HEADER_MENU_TEST_IDS.menuPanel)).toBeNull();
  });

  test('Calls signOut on logout button click', () => {
    render(<HeaderMenu />);

    fireEvent.click(screen.getByTestId(HEADER_MENU_TEST_IDS.menuButton));
    fireEvent.click(screen.getByTestId(HEADER_MENU_TEST_IDS.logoutButton));

    expect(signOutMock).toHaveBeenCalledTimes(1);
  });

  test('Closes menu when clicking outside', () => {
    render(
      <div>
        <HeaderMenu />
        <span>Outside</span>
      </div>
    );

    fireEvent.click(screen.getByTestId(HEADER_MENU_TEST_IDS.menuButton));
    expect(screen.getByTestId(HEADER_MENU_TEST_IDS.menuPanel)).toBeDefined();

    fireEvent.mouseDown(screen.getByText('Outside'));

    expect(screen.queryByTestId(HEADER_MENU_TEST_IDS.menuPanel)).toBeNull();
  });

  test('Closes menu on Escape key press', () => {
    render(<HeaderMenu />);

    fireEvent.click(screen.getByTestId(HEADER_MENU_TEST_IDS.menuButton));
    expect(screen.getByTestId(HEADER_MENU_TEST_IDS.menuPanel)).toBeDefined();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByTestId(HEADER_MENU_TEST_IDS.menuPanel)).toBeNull();
  });
});
