import { describe, expect, it } from 'vitest';
import { evaluateSecurityRisks } from '../../scripts/check-release-risks';

const validOpenHighRisk = {
  id: 'WEB-AUTH-001',
  severity: 'high',
  affectedArea: 'Web authentication',
  ownerRole: 'Web maintainer',
  status: 'open',
  disposition: 'Authentication remains simulated.',
  evidence: [],
};

describe('evaluateSecurityRisks', () => {
  it('blocks unresolved critical and high risks', () => {
    const result = evaluateSecurityRisks(
      {
        risks: [
          validOpenHighRisk,
          {
            ...validOpenHighRisk,
            id: 'SERVER-AUTHZ-001',
            severity: 'critical',
            affectedArea: 'Server authorization',
          },
        ],
      },
      new Date('2026-10-17T00:00:00.000Z')
    );

    expect(result.errors).toEqual([]);
    expect(result.blockingRiskIds).toEqual(['WEB-AUTH-001', 'SERVER-AUTHZ-001']);
  });

  it('allows a documented, approved, non-expired exception', () => {
    const result = evaluateSecurityRisks(
      {
        risks: [
          {
            ...validOpenHighRisk,
            status: 'excepted',
            exception: {
              approvedBy: 'security-maintainer',
              rationale: 'Temporary exception for a controlled release.',
              scope: 'Preview deployment only.',
              expiresAt: '2026-10-20T00:00:00.000Z',
            },
          },
        ],
      },
      new Date('2026-10-17T00:00:00.000Z')
    );

    expect(result.errors).toEqual([]);
    expect(result.blockingRiskIds).toEqual([]);
  });

  it('blocks expired or incomplete exceptions', () => {
    const expired = evaluateSecurityRisks(
      {
        risks: [
          {
            ...validOpenHighRisk,
            status: 'excepted',
            exception: {
              approvedBy: 'security-maintainer',
              rationale: 'Temporary exception.',
              scope: 'Preview only.',
              expiresAt: '2026-10-16T00:00:00.000Z',
            },
          },
        ],
      },
      new Date('2026-10-17T00:00:00.000Z')
    );
    const incomplete = evaluateSecurityRisks({
      risks: [
        {
          ...validOpenHighRisk,
          status: 'excepted',
          exception: { approvedBy: 'security-maintainer' },
        },
      ],
    });

    expect(expired.blockingRiskIds).toEqual(['WEB-AUTH-001']);
    expect(expired.errors).toContain('Risk WEB-AUTH-001 exception expiry must be a future date.');
    expect(incomplete.errors).toContain(
      'Risk WEB-AUTH-001 exception must include approver, rationale, scope, and expiry.'
    );
    expect(incomplete.blockingRiskIds).toEqual(['WEB-AUTH-001']);
  });

  it('accepts resolved risks only when verification evidence is recorded', () => {
    const result = evaluateSecurityRisks({
      risks: [
        {
          ...validOpenHighRisk,
          status: 'mitigated',
          disposition: 'A verified login flow replaced simulated authentication.',
          evidence: ['PR #42', 'End-to-end authentication test passed.'],
        },
      ],
    });

    expect(result.errors).toEqual([]);
    expect(result.blockingRiskIds).toEqual([]);
  });

  it('fails closed for missing or malformed risk data', () => {
    expect(evaluateSecurityRisks(null).errors).toContain(
      'Risk register must contain a non-empty risks array.'
    );
    expect(evaluateSecurityRisks({ risks: [] }).errors).toContain(
      'Risk register must contain a non-empty risks array.'
    );

    const malformed = evaluateSecurityRisks({
      risks: [{ ...validOpenHighRisk, severity: 'urgent', ownerRole: '' }],
    });

    expect(malformed.errors).toContain('Risk WEB-AUTH-001 has an invalid severity.');
    expect(malformed.errors).toContain('Risk WEB-AUTH-001 must have an owner role.');
    expect(malformed.blockingRiskIds).toEqual(['WEB-AUTH-001']);
  });

  it('rejects duplicate risk identifiers', () => {
    const result = evaluateSecurityRisks({
      risks: [validOpenHighRisk, validOpenHighRisk],
    });

    expect(result.errors).toContain('Risk register contains duplicate ID WEB-AUTH-001.');
  });
});
