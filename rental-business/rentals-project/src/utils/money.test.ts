import { describe, expect, it } from 'vitest';
import { formatMoney } from './money';

describe('formatMoney', () => {
  it('formats cents into dollars', () => {
    expect(formatMoney(1234)).toBe('$12.34');
  });

  it('formats zero correctly', () => {
    expect(formatMoney(0)).toBe('$0.00');
  });

  it('formats whole dollar amounts correctly', () => {
    expect(formatMoney(500)).toBe('$5.00');
  });
});