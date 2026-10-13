import { describe, it, expect } from 'vitest';
import {
  formatCNPJ,
  isValidCNPJ,
  formatPhone,
  formatCurrency,
  formatCurrencyInput,
} from './formatters';

describe('formatters - TDD Validation Suite', () => {
  describe('formatCNPJ', () => {
    it('should format a 14-digit raw string into CNPJ mask', () => {
      const raw = '12345678000190';
      const formatted = formatCNPJ(raw);
      expect(formatted).toBe('12.345.678/0001-90');
    });

    it('should strip non-digits before formatting', () => {
      const input = '12.345-678/0001-90';
      const formatted = formatCNPJ(input);
      expect(formatted).toBe('12.345.678/0001-90');
    });

    it('should handle partial input gracefully', () => {
      expect(formatCNPJ('12')).toBe('12');
      expect(formatCNPJ('12345')).toBe('12.345');
      expect(formatCNPJ('12345678')).toBe('12.345.678');
    });
  });

  describe('isValidCNPJ', () => {
    it('should validate valid known CNPJs correctly', () => {
      // 11.222.333/0001-81 is mathematically valid
      expect(isValidCNPJ('11.222.333/0001-81')).toBe(true);
      expect(isValidCNPJ('11222333000181')).toBe(true);
    });

    it('should reject invalid CNPJs', () => {
      expect(isValidCNPJ('00.000.000/0000-00')).toBe(false);
      expect(isValidCNPJ('11.111.111/1111-11')).toBe(false);
      expect(isValidCNPJ('12.345.678/0001-00')).toBe(false);
      expect(isValidCNPJ('123')).toBe(false);
    });
  });

  describe('formatPhone', () => {
    it('should format mobile phone with 11 digits', () => {
      expect(formatPhone('41999990000')).toBe('(41) 99999-0000');
    });

    it('should format landline phone with 10 digits', () => {
      expect(formatPhone('4133334444')).toBe('(41) 3333-4444');
    });
  });

  describe('formatCurrency', () => {
    it('should format number into BRL currency string', () => {
      const result = formatCurrency(250);
      expect(result).toContain('250,00');
      expect(result).toMatch(/R\$\s?250,00/);
    });
  });

  describe('formatCurrencyInput', () => {
    it('should parse cents and format currency input', () => {
      const { raw, formatted } = formatCurrencyInput('25000');
      expect(raw).toBe(250);
      expect(formatted).toContain('250,00');
    });
  });
});
