import { describe, expect, it } from 'vitest';
import {
  evaluateSecurityRisks,
  parseVerifiedExceptionApprovers,
} from '../../scripts/check-release-risks';

const webRisk = {
  id: 'WEB-AUTH-001',
  category: 'web-authentication',
  severity: 'high',
  affectedArea: 'Web authentication',
  ownerRole: 'Web maintainer',
  status: 'open',
  disposition: 'Authentication remains simulated.',
  evidence: [],
};

const requiredRiskIds = new Set(['WEB-AUTH-001', 'MOBILE-AUTH-001', 'SERVER-AUTHZ-001']);
const baselineRisks = [
  webRisk,
  {
    ...webRisk,
    id: 'MOBILE-AUTH-001',
    category: 'mobile-authentication',
    affectedArea: 'Mobile end-to-end login and token issuance',
  },
  {
    ...webRisk,
    id: 'SERVER-AUTHZ-001',
    category: 'server-authorization',
    affectedArea: 'Server-side authorization',
  },
];
const verifiedSecurityOwner = {
  securityOwners: new Set(['@security-owner']),
  designatedMaintainers: new Set(['@maintainer']),
};

function riskRegister(overrides: Record<string, unknown>[] = []) {
  const risks = baselineRisks.map((risk) => {
    const override = overrides.find((candidate) => candidate.id === risk.id);
    return override ? { ...risk, ...override } : risk;
  });
  const additionalRisks = overrides.filter(
    (risk) => typeof risk.id === 'string' && !requiredRiskIds.has(risk.id)
  );
  return { risks: [...risks, ...additionalRisks] };
}

describe('evaluateSecurityRisks', () => {
  it('blocks all unresolved critical and high risks', () => {
    const result = evaluateSecurityRisks(
      riskRegister([
        webRisk,
        {
          ...baselineRisks[2],
          severity: 'critical',
        },
      ]),
      new Date('2026-10-17T00:00:00.000Z')
    );

    expect(result.errors).toEqual([]);
    expect(result.blockingRiskIds).toEqual(['WEB-AUTH-001', 'MOBILE-AUTH-001', 'SERVER-AUTHZ-001']);
  });

  it('requires HIGH or CRITICAL severity for every unresolved authentication category', () => {
    const result = evaluateSecurityRisks(
      riskRegister([
        { ...webRisk, severity: 'low' },
        { ...baselineRisks[1], severity: 'medium' },
        { ...baselineRisks[2], severity: 'low' },
      ]),
      new Date('2026-10-17T00:00:00.000Z')
    );

    expect(result.errors).toEqual([
      'Risk WEB-AUTH-001 must have HIGH or CRITICAL severity.',
      'Risk MOBILE-AUTH-001 must have HIGH or CRITICAL severity.',
      'Risk SERVER-AUTHZ-001 must have HIGH or CRITICAL severity.',
    ]);
    expect(result.blockingRiskIds).toEqual(['WEB-AUTH-001', 'MOBILE-AUTH-001', 'SERVER-AUTHZ-001']);
  });

  it('rejects a missing required risk record', () => {
    const result = evaluateSecurityRisks({ risks: [webRisk] });

    expect(result.errors).toContain(
      'Risk register is missing required security risk MOBILE-AUTH-001 (mobile-authentication).'
    );
    expect(result.errors).toContain(
      'Risk register is missing required security risk SERVER-AUTHZ-001 (server-authorization).'
    );
    expect(result.blockingRiskIds).toEqual(['WEB-AUTH-001', 'MOBILE-AUTH-001', 'SERVER-AUTHZ-001']);
  });

  it('allows an exception approved by a verified security owner', () => {
    const result = evaluateSecurityRisks(
      riskRegister([
        {
          ...webRisk,
          status: 'excepted',
          exception: {
            gate: 'security-risk:WEB-AUTH-001',
            revision: 'a'.repeat(40),
            approvedBy: '@security-owner',
            approvedAt: '2026-10-16T00:00:00.000Z',
            rationale: 'Temporary exception for a controlled release.',
            scope: 'Preview deployment only.',
            expiresAt: '2026-10-20T00:00:00.000Z',
          },
        },
      ]),
      new Date('2026-10-17T00:00:00.000Z'),
      verifiedSecurityOwner,
      'a'.repeat(40)
    );

    expect(result.errors).toEqual([]);
    expect(result.blockingRiskIds).toEqual(['MOBILE-AUTH-001', 'SERVER-AUTHZ-001']);
  });

  it('allows a designated maintainer only when no verified security owner exists', () => {
    const exception = {
      ...webRisk,
      status: 'excepted',
      exception: {
        gate: 'security-risk:WEB-AUTH-001',
        revision: 'a'.repeat(40),
        approvedBy: '@maintainer',
        approvedAt: '2026-10-16T00:00:00.000Z',
        rationale: 'Security owner unavailable.',
        scope: 'Preview deployment only.',
        expiresAt: '2026-10-20T00:00:00.000Z',
      },
    };
    const noSecurityOwner = evaluateSecurityRisks(
      riskRegister([exception]),
      new Date('2026-10-17T00:00:00.000Z'),
      { securityOwners: new Set(), designatedMaintainers: new Set(['@maintainer']) },
      'a'.repeat(40)
    );
    const securityOwnerAvailable = evaluateSecurityRisks(
      riskRegister([exception]),
      new Date('2026-10-17T00:00:00.000Z'),
      verifiedSecurityOwner,
      'a'.repeat(40)
    );

    expect(noSecurityOwner.errors).toEqual([]);
    expect(noSecurityOwner.blockingRiskIds).toEqual(['MOBILE-AUTH-001', 'SERVER-AUTHZ-001']);
    expect(securityOwnerAvailable.errors).toContain(
      'Risk WEB-AUTH-001 exception approver is not a verified security owner or designated maintainer.'
    );
    expect(securityOwnerAvailable.blockingRiskIds).toContain('WEB-AUTH-001');
  });

  it('rejects unverified approvers and exceptions when no verified approver exists', () => {
    const exceptionRisk = {
      ...webRisk,
      status: 'excepted',
      exception: {
        gate: 'security-risk:WEB-AUTH-001',
        revision: 'a'.repeat(40),
        approvedBy: '@unverified-user',
        approvedAt: '2026-10-16T00:00:00.000Z',
        rationale: 'Temporary exception.',
        scope: 'Preview only.',
        expiresAt: '2026-10-20T00:00:00.000Z',
      },
    };
    const result = evaluateSecurityRisks(
      riskRegister([exceptionRisk]),
      new Date('2026-10-17T00:00:00.000Z'),
      undefined,
      'a'.repeat(40)
    );

    expect(result.errors).toContain(
      'Risk WEB-AUTH-001 exception approver is not a verified security owner or designated maintainer.'
    );
    expect(result.blockingRiskIds).toContain('WEB-AUTH-001');
  });

  it('blocks expired, malformed, and incomplete exceptions', () => {
    const now = new Date('2026-10-17T00:00:00.000Z');
    const makeException = (expiresAt: string) => ({
      ...webRisk,
      status: 'excepted',
      exception: {
        gate: 'security-risk:WEB-AUTH-001',
        revision: 'a'.repeat(40),
        approvedBy: '@security-owner',
        approvedAt: '2026-10-16T00:00:00.000Z',
        rationale: 'Temporary exception.',
        scope: 'Preview only.',
        expiresAt,
      },
    });
    const expired = evaluateSecurityRisks(
      riskRegister([makeException('2026-10-16T00:00:00.000Z')]),
      now,
      verifiedSecurityOwner,
      'a'.repeat(40)
    );
    const malformed = evaluateSecurityRisks(
      riskRegister([makeException('2027-02-30T00:00:00.000Z')]),
      now,
      verifiedSecurityOwner,
      'a'.repeat(40)
    );
    const incomplete = evaluateSecurityRisks(
      riskRegister([
        {
          ...webRisk,
          status: 'excepted',
          exception: {
            gate: 'security-risk:WEB-AUTH-001',
            revision: 'a'.repeat(40),
            approvedBy: '@security-owner',
            approvedAt: '2026-10-16T00:00:00.000Z',
          },
        },
      ]),
      now,
      verifiedSecurityOwner,
      'a'.repeat(40)
    );

    expect(expired.errors).toContain(
      'Risk WEB-AUTH-001 exception for security-risk:WEB-AUTH-001 must expire after now and no later than 30 calendar days after approval.'
    );
    expect(expired.blockingRiskIds).toContain('WEB-AUTH-001');
    expect(malformed.errors).toContain(
      'Risk WEB-AUTH-001 exception for security-risk:WEB-AUTH-001 must expire after now and no later than 30 calendar days after approval.'
    );
    expect(malformed.blockingRiskIds).toContain('WEB-AUTH-001');
    expect(incomplete.errors).toContain(
      'Risk WEB-AUTH-001 exception record is incomplete or malformed.'
    );
    expect(incomplete.blockingRiskIds).toContain('WEB-AUTH-001');
  });

  it('accepts expiry exactly 30 calendar days after approval and rejects a longer exception', () => {
    const now = new Date('2026-10-17T00:00:00.000Z');
    const makeException = (expiresAt: string) => ({
      ...webRisk,
      status: 'excepted',
      exception: {
        gate: 'security-risk:WEB-AUTH-001',
        revision: 'a'.repeat(40),
        approvedBy: '@security-owner',
        approvedAt: '2026-10-01T00:00:00.000Z',
        rationale: 'Time-bounded production exception.',
        scope: 'One release candidate.',
        expiresAt,
      },
    });
    const atLimit = evaluateSecurityRisks(
      riskRegister([makeException('2026-10-31T00:00:00.000Z')]),
      now,
      verifiedSecurityOwner,
      'a'.repeat(40)
    );
    const overLimit = evaluateSecurityRisks(
      riskRegister([makeException('2026-11-01T00:00:00.000Z')]),
      now,
      verifiedSecurityOwner,
      'a'.repeat(40)
    );

    expect(atLimit.errors).toEqual([]);
    expect(atLimit.blockingRiskIds).toEqual(['MOBILE-AUTH-001', 'SERVER-AUTHZ-001']);
    expect(overLimit.errors).toContain(
      'Risk WEB-AUTH-001 exception for security-risk:WEB-AUTH-001 must expire after now and no later than 30 calendar days after approval.'
    );
    expect(overLimit.blockingRiskIds).toContain('WEB-AUTH-001');
  });

  it('rejects an exception whose approval date is invalid or after its expiry', () => {
    const result = evaluateSecurityRisks(
      riskRegister([
        {
          ...webRisk,
          status: 'excepted',
          exception: {
            gate: 'security-risk:WEB-AUTH-001',
            revision: 'a'.repeat(40),
            approvedBy: '@security-owner',
            approvedAt: '2026-10-31T00:00:00.000Z',
            rationale: 'Invalid approval window.',
            scope: 'One release candidate.',
            expiresAt: '2026-10-30T00:00:00.000Z',
          },
        },
      ]),
      new Date('2026-10-17T00:00:00.000Z'),
      verifiedSecurityOwner,
      'a'.repeat(40)
    );

    expect(result.errors).toContain(
      'Risk WEB-AUTH-001 exception for security-risk:WEB-AUTH-001 must expire after now and no later than 30 calendar days after approval.'
    );
    expect(result.blockingRiskIds).toContain('WEB-AUTH-001');
  });

  it('accepts resolved risks only when verification evidence is recorded', () => {
    const result = evaluateSecurityRisks(
      riskRegister([
        {
          ...webRisk,
          status: 'mitigated',
          disposition: 'Verified sign-in replaced simulated authentication.',
          evidence: ['PR #42', 'End-to-end authentication test passed.'],
        },
      ])
    );

    expect(result.errors).toEqual([]);
    expect(result.blockingRiskIds).toEqual(['MOBILE-AUTH-001', 'SERVER-AUTHZ-001']);
  });

  it('loads only verified exception approvers from the ownership document', () => {
    const approvers = parseVerifiedExceptionApprovers(`
## Exception approvers
| Role | GitHub identity | Verification |
| --- | --- | --- |
| Security owner | @security-owner | Verified |
| Designated maintainer | @maintainer | Verified |
| Designated maintainer | @pending-user | Pending |
`);

    expect(approvers).toEqual({
      securityOwners: new Set(['@security-owner']),
      designatedMaintainers: new Set(['@maintainer']),
    });
  });

  it('fails closed for missing or malformed data and duplicate IDs', () => {
    expect(evaluateSecurityRisks(null).errors).toContain(
      'Risk register must contain a non-empty risks array.'
    );
    expect(evaluateSecurityRisks({ risks: [] }).errors).toContain(
      'Risk register must contain a non-empty risks array.'
    );

    const malformed = evaluateSecurityRisks(
      riskRegister([{ ...webRisk, category: 'unknown', severity: 'urgent', ownerRole: '' }])
    );
    expect(malformed.errors).toContain('Risk WEB-AUTH-001 has an invalid category.');
    expect(malformed.errors).toContain('Risk WEB-AUTH-001 has an invalid severity.');
    expect(malformed.errors).toContain('Risk WEB-AUTH-001 must have an owner role.');
    expect(malformed.blockingRiskIds).toContain('WEB-AUTH-001');

    const duplicate = evaluateSecurityRisks({ risks: [...baselineRisks, webRisk] });
    expect(duplicate.errors).toContain('Risk register contains duplicate ID WEB-AUTH-001.');
  });
});
