export interface VerifiedExceptionApprovers {
  securityOwners: ReadonlySet<string>;
  designatedMaintainers: ReadonlySet<string>;
}

export interface ReleaseGateException {
  gate: string;
  revision: string;
  approvedBy: string;
  approvedAt: string;
  rationale: string;
  scope: string;
  expiresAt: string;
}

export interface ExceptionValidationContext {
  gate: string;
  revision: string;
  now: Date;
  authorizedApprovers: VerifiedExceptionApprovers;
}

export const releaseGateIds = [
  'root-tests',
  'web-tests',
  'eslint-errors',
  'web-build',
  'mobile-tests',
  'mobile-typecheck',
  'expo-public-config',
  'shared-tests',
  'api-generation',
  'generated-api-clean',
  'sonar-quality-gate',
  'sonar-debt-ratio',
] as const;

export type ReleaseGateId = (typeof releaseGateIds)[number];
export type ReleaseGateStatus = 'success' | 'failed' | 'missing' | 'unavailable';

export const nonWaivableGateIds = ['ci-prerequisites', 'sonar-prerequisites'] as const;

const revisionPattern = /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/i;
const timestampPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function isValidUtcTimestamp(value: unknown): value is string {
  if (typeof value !== 'string' || !timestampPattern.test(value)) {
    return false;
  }

  const timestamp = Date.parse(value);
  return (
    Number.isFinite(timestamp) &&
    new Date(timestamp).toISOString().slice(0, 19) === value.slice(0, 19)
  );
}

function addCalendarDays(timestamp: string, days: number): number {
  const limit = new Date(timestamp);
  limit.setUTCDate(limit.getUTCDate() + days);
  return limit.getTime();
}

export function isAuthorizedExceptionApprover(
  approver: string,
  authorizedApprovers: VerifiedExceptionApprovers
): boolean {
  const normalizedApprover = approver.trim().toLowerCase();
  return (
    authorizedApprovers.securityOwners.has(normalizedApprover) ||
    (authorizedApprovers.securityOwners.size === 0 &&
      authorizedApprovers.designatedMaintainers.has(normalizedApprover))
  );
}

export function parseReleaseGateException(
  value: unknown,
  context: ExceptionValidationContext,
  errors: string[],
  errorPrefix = 'Exception'
): ReleaseGateException | undefined {
  if (!isRecord(value)) {
    errors.push(`${errorPrefix} record is incomplete or malformed.`);
    return undefined;
  }

  const { gate, revision, approvedBy, approvedAt, rationale, scope, expiresAt } = value;
  if (
    typeof gate !== 'string' ||
    typeof revision !== 'string' ||
    typeof approvedBy !== 'string' ||
    !approvedBy.trim() ||
    typeof approvedAt !== 'string' ||
    typeof rationale !== 'string' ||
    !rationale.trim() ||
    typeof scope !== 'string' ||
    !scope.trim() ||
    typeof expiresAt !== 'string'
  ) {
    errors.push(`${errorPrefix} record is incomplete or malformed.`);
    return undefined;
  }

  if (
    !revisionPattern.test(revision) ||
    !revisionPattern.test(context.revision) ||
    revision.toLowerCase() !== context.revision.toLowerCase()
  ) {
    errors.push(`${errorPrefix} for ${context.gate} does not match the candidate revision.`);
    return undefined;
  }

  if (gate !== context.gate) {
    errors.push(`${errorPrefix} for ${context.gate} identifies a different release gate.`);
    return undefined;
  }

  if (
    !isValidUtcTimestamp(approvedAt) ||
    Date.parse(approvedAt) > context.now.getTime() ||
    !isValidUtcTimestamp(expiresAt) ||
    Date.parse(expiresAt) <= context.now.getTime() ||
    Date.parse(expiresAt) > addCalendarDays(approvedAt, 30)
  ) {
    errors.push(
      `${errorPrefix} for ${context.gate} must expire after now and no later than 30 calendar days after approval.`
    );
    return undefined;
  }

  if (!isAuthorizedExceptionApprover(approvedBy, context.authorizedApprovers)) {
    errors.push(
      `${errorPrefix} approver is not a verified security owner or designated maintainer.`
    );
    return undefined;
  }

  return {
    gate,
    revision,
    approvedBy: approvedBy.trim(),
    approvedAt,
    rationale,
    scope,
    expiresAt,
  };
}
