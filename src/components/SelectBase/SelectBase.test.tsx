import { describe, expect, test, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { SelectBase } from './SelectBase';
import type { SelectItem } from './types';

const items: SelectItem<string>[] = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Charlie' },
];

describe('SelectBase', () => {
  afterEach(() => {
    cleanup();
  });

  test('Renders placeholder when closed', () => {
    render(<SelectBase items={items} value={null} placeholder="Pick one" />);
    expect(screen.getByPlaceholderText('Pick one')).toBeDefined();
  });

  test('Opens dropdown on input focus', () => {
    render(<SelectBase items={items} value={null} />);
    fireEvent.focus(screen.getByRole('textbox'));

    expect(screen.getByText('Alpha')).toBeDefined();
    expect(screen.getByText('Beta')).toBeDefined();
    expect(screen.getByText('Charlie')).toBeDefined();
  });

  test('Closes dropdown when clicking outside', () => {
    render(
      <div>
        <SelectBase items={items} value={null} />
        <span>Outside</span>
      </div>
    );
    fireEvent.focus(screen.getByRole('textbox'));
    expect(screen.getByText('Alpha')).toBeDefined();

    fireEvent.mouseDown(screen.getByText('Outside'));

    expect(screen.queryByText('Alpha')).toBeNull();
  });

  test('Closes dropdown on Escape key', () => {
    render(<SelectBase items={items} value={null} />);
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    expect(screen.getByText('Alpha')).toBeDefined();

    fireEvent.keyDown(input, { key: 'Escape' });

    expect(screen.queryByText('Alpha')).toBeNull();
  });

  test('Filters items based on search input', () => {
    render(<SelectBase items={items} value={null} />);
    fireEvent.focus(screen.getByRole('textbox'));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'be' } });

    expect(screen.queryByText('Alpha')).toBeNull();
    expect(screen.getByText('Beta')).toBeDefined();
    expect(screen.queryByText('Charlie')).toBeNull();
  });

  test('Shows notFoundText when no items match', () => {
    render(<SelectBase items={items} value={null} notFoundText="Nothing here" />);
    fireEvent.focus(screen.getByRole('textbox'));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'zzz' } });

    expect(screen.getByText('Nothing here')).toBeDefined();
  });

  test('Calls onChange with item value and closes dropdown', () => {
    const onChange = vi.fn();
    render(<SelectBase items={items} value={null} onChange={onChange} />);
    fireEvent.focus(screen.getByRole('textbox'));

    fireEvent.click(screen.getByText('Beta'));

    expect(onChange).toHaveBeenCalledWith('b');
    expect(screen.queryByText('Alpha')).toBeNull();
  });

  test('Displays selected item label when closed', () => {
    render(<SelectBase items={items} value="b" />);
    expect(screen.getByDisplayValue('Beta')).toBeDefined();
  });

  test('Shows search input when open with existing selection', () => {
    render(<SelectBase items={items} value="b" />);
    fireEvent.focus(screen.getByRole('textbox'));

    expect(screen.getByDisplayValue('')).toBeDefined();
    expect(screen.getByText('Alpha')).toBeDefined();
  });

  test('Renders disabled input when disabled', () => {
    render(<SelectBase items={items} value={null} disabled />);
    expect(screen.getByRole('textbox')).toHaveProperty('disabled', true);
  });

  test('Shows notFoundText when items array is empty', () => {
    render(<SelectBase items={[]} value={null} notFoundText="No items" />);
    fireEvent.focus(screen.getByRole('textbox'));

    expect(screen.getByText('No items')).toBeDefined();
  });

  test('Search is case-insensitive', () => {
    render(<SelectBase items={items} value={null} />);
    fireEvent.focus(screen.getByRole('textbox'));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'ALPHA' } });

    expect(screen.getByText('Alpha')).toBeDefined();
    expect(screen.queryByText('Beta')).toBeNull();
  });

  test('Clears search when dropdown closes', () => {
    render(<SelectBase items={items} value={null} />);
    const input = screen.getByRole('textbox');
    fireEvent.focus(input);
    fireEvent.change(input, { target: { value: 'be' } });

    fireEvent.keyDown(input, { key: 'Escape' });
    fireEvent.focus(input);

    expect(screen.getByText('Alpha')).toBeDefined();
    expect(screen.getByText('Beta')).toBeDefined();
    expect(screen.getByText('Charlie')).toBeDefined();
  });
});
