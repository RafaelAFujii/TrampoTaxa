import { describe, expect, it } from 'vitest';
import { evaluateReleaseExceptions } from '../../scripts/check-release-exceptions';
import {
  nonWaivableGateIds,
  releaseGateIds,
  type ReleaseGateStatus,
} from '../../scripts/release-exception-policy';

const revision = 'a'.repeat(40);
const approvers = {
  securityOwners: new Set(['@security-owner']),
  designatedMaintainers: new Set(['@maintainer']),
};
const passingAndFailedGates: Array<{ gate: string; status: ReleaseGateStatus }> = [
  ...releaseGateIds.map((gate): { gate: string; status: ReleaseGateStatus } => ({
    gate,
    status: gate === 'sonar-debt-ratio' ? 'failed' : 'success',
  })),
  ...nonWaivableGateIds.map((gate): { gate: string; status: ReleaseGateStatus } => ({
    gate,
    status: 'success',
  })),
];

function gateResults(overrides: Array<{ gate: string; status: ReleaseGateStatus }> = []) {
  return passingAndFailedGates.map(
    (result) => overrides.find((override) => override.gate === result.gate) ?? result
  );
}

function register(overrides: Record<string, unknown> = {}) {
  return {
    exceptions: [
      {
        gate: 'sonar-debt-ratio',
        revision,
        approvedBy: '@security-owner',
        approvedAt: '2026-10-16T00:00:00.000Z',
        rationale: 'Temporary exception for one controlled release.',
        scope: 'The named release candidate only.',
        expiresAt: '2026-10-30T00:00:00.000Z',
        ...overrides,
      },
    ],
  };
}

describe('evaluateReleaseExceptions', () => {
  it('permits an available failed gate with a valid exception for the candidate revision', () => {
    const result = evaluateReleaseExceptions(register(), {
      revision,
      gateResults: gateResults(),
      now: new Date('2026-10-17T00:00:00.000Z'),
      authorizedApprovers: approvers,
    });

    expect(result.errors).toEqual([]);
    expect(result.blockedGateIds).toEqual([]);
  });

  it('rejects exceptions for unknown gates', () => {
    const value = register();
    value.exceptions.push({
      ...value.exceptions[0],
      gate: 'unrecognized-gate',
    });
    const result = evaluateReleaseExceptions(value, {
      revision,
      gateResults: [...gateResults(), { gate: 'unrecognized-gate', status: 'failed' }],
      now: new Date('2026-10-17T00:00:00.000Z'),
      authorizedApprovers: approvers,
    });

    expect(result.errors).toContain(
      'Exception identifies an unknown release gate: unrecognized-gate.'
    );
    expect(result.blockedGateIds).toEqual(['unrecognized-gate']);
  });

  it('rejects an exception bound to another candidate revision', () => {
    const result = evaluateReleaseExceptions(register({ revision: 'b'.repeat(40) }), {
      revision,
      gateResults: gateResults(),
      now: new Date('2026-10-17T00:00:00.000Z'),
      authorizedApprovers: approvers,
    });

    expect(result.errors).toContain(
      'Release exception for sonar-debt-ratio does not match the candidate revision.'
    );
    expect(result.blockedGateIds).toEqual(['sonar-debt-ratio']);
  });

  it('rejects expired and over-30-day exceptions', () => {
    const now = new Date('2026-10-17T00:00:00.000Z');
    const expired = evaluateReleaseExceptions(register({ expiresAt: '2026-10-16T00:00:00.000Z' }), {
      revision,
      gateResults: gateResults(),
      now,
      authorizedApprovers: approvers,
    });
    const overlong = evaluateReleaseExceptions(
      register({ expiresAt: '2026-11-16T00:00:00.000Z' }),
      { revision, gateResults: gateResults(), now, authorizedApprovers: approvers }
    );

    expect(expired.errors).toContain(
      'Release exception for sonar-debt-ratio must expire after now and no later than 30 calendar days after approval.'
    );
    expect(expired.blockedGateIds).toEqual(['sonar-debt-ratio']);
    expect(overlong.errors).toContain(
      'Release exception for sonar-debt-ratio must expire after now and no later than 30 calendar days after approval.'
    );
    expect(overlong.blockedGateIds).toEqual(['sonar-debt-ratio']);
  });

  it('rejects incomplete data and unauthorized approvers', () => {
    const incomplete = evaluateReleaseExceptions(
      { exceptions: [{ gate: 'sonar-debt-ratio' }] },
      {
        revision,
        gateResults: gateResults(),
        now: new Date('2026-10-17T00:00:00.000Z'),
        authorizedApprovers: approvers,
      }
    );
    const unauthorized = evaluateReleaseExceptions(register({ approvedBy: '@unverified-user' }), {
      revision,
      gateResults: gateResults(),
      now: new Date('2026-10-17T00:00:00.000Z'),
      authorizedApprovers: approvers,
    });

    expect(incomplete.errors).toContain('Release exception record is incomplete or malformed.');
    expect(incomplete.blockedGateIds).toEqual(['sonar-debt-ratio']);
    expect(unauthorized.errors).toContain(
      'Release exception approver is not a verified security owner or designated maintainer.'
    );
    expect(unauthorized.blockedGateIds).toEqual(['sonar-debt-ratio']);
  });

  it('does not waive missing or unavailable required checks', () => {
    const result = evaluateReleaseExceptions(register(), {
      revision,
      gateResults: gateResults([
        { gate: 'web-tests', status: 'unavailable' },
        { gate: 'mobile-tests', status: 'missing' },
      ]),
      now: new Date('2026-10-17T00:00:00.000Z'),
      authorizedApprovers: approvers,
    });

    expect(result.errors).toContain(
      'Required gate web-tests is unavailable and cannot be excepted.'
    );
    expect(result.errors).toContain(
      'Required gate mobile-tests is missing and cannot be excepted.'
    );
    expect(result.blockedGateIds).toEqual(['web-tests', 'mobile-tests']);
  });
});
