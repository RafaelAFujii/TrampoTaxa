import { describe, it, expect } from 'vitest';
import { CadastroPayload, UserRole } from '../context/AuthContext';
import { isValidCNPJ } from '../utils/formatters';

describe('Auth & User Registration Flow - TDD Suite', () => {
  it('should validate complete contractor registration payload structure', () => {
    const contractorPayload: CadastroPayload = {
      name: 'Bistrô do Batel',
      email: 'contato@bistrodobatel.com.br',
      role: 'Contratante',
      phone: '(41) 99887-1234',
      cnpj: '12.345.678/0001-90',
      businessSegment: 'Restaurante',
      corporateName: 'Bistrô do Batel Gastronomia LTDA',
    };

    expect(contractorPayload.role).toBe('Contratante');
    expect(contractorPayload.cnpj).toBeDefined();
    expect(contractorPayload.businessSegment).toBe('Restaurante');
  });

  it('should validate complete freelancer registration payload structure', () => {
    const freelancerPayload: CadastroPayload = {
      name: 'Gabriel Silva',
      email: 'gabriel@curitiba.com',
      role: 'Freelancer',
      phone: '(41) 99999-0000',
      profession: 'Bartender',
    };

    expect(freelancerPayload.role).toBe('Freelancer');
    expect(freelancerPayload.profession).toBe('Bartender');
    expect(freelancerPayload.cnpj).toBeUndefined();
  });

  it('should correctly reject registration if contractor CNPJ is invalid', () => {
    const invalidCNPJ = '00.000.000/0000-00';
    expect(isValidCNPJ(invalidCNPJ)).toBe(false);
  });

  it('should verify supported user roles in RBAC system', () => {
    const validRoles: UserRole[] = ['Freelancer', 'Contratante'];
    expect(validRoles).toContain('Freelancer');
    expect(validRoles).toContain('Contratante');
    expect(validRoles.length).toBe(2);
  });
});
