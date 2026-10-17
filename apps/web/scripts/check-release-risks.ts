import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

type Severity = 'critical' | 'high' | 'medium' | 'low';
type RiskStatus = 'open' | 'mitigated' | 'excepted' | 'closed';
type RiskCategory =
  'web-authentication' | 'mobile-authentication' | 'server-authorization' | 'other';

interface RiskException {
  approvedBy: string;
  rationale: string;
  scope: string;
  expiresAt: string;
}

interface RiskEvaluation {
  errors: string[];
  blockingRiskIds: string[];
}

interface VerifiedExceptionApprovers {
  securityOwners: ReadonlySet<string>;
  designatedMaintainers: ReadonlySet<string>;
}

const severities: Severity[] = ['critical', 'high', 'medium', 'low'];
const statuses: RiskStatus[] = ['open', 'mitigated', 'excepted', 'closed'];
const categories: RiskCategory[] = [
  'web-authentication',
  'mobile-authentication',
  'server-authorization',
  'other',
];
const highMinimumCategories = new Set<RiskCategory>([
  'web-authentication',
  'mobile-authentication',
  'server-authorization',
]);
const requiredRiskCategories = new Map<string, RiskCategory>([
  ['WEB-AUTH-001', 'web-authentication'],
  ['MOBILE-AUTH-001', 'mobile-authentication'],
  ['SERVER-AUTHZ-001', 'server-authorization'],
]);
const githubIdentityPattern = /^@[A-Za-z0-9-]+(?:\/[A-Za-z0-9-]+)?$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function nonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isSeverity(value: unknown): value is Severity {
  return typeof value === 'string' && severities.some((severity) => severity === value);
}

function isRiskStatus(value: unknown): value is RiskStatus {
  return typeof value === 'string' && statuses.some((status) => status === value);
}

function isRiskCategory(value: unknown): value is RiskCategory {
  return typeof value === 'string' && categories.some((category) => category === value);
}

function isFutureIsoDate(value: unknown, now: Date): value is string {
  if (
    typeof value !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value)
  ) {
    return false;
  }

  const expiry = Date.parse(value);
  return (
    Number.isFinite(expiry) &&
    expiry > now.getTime() &&
    new Date(expiry).toISOString().slice(0, 19) === value.slice(0, 19)
  );
}

function parseException(
  value: unknown,
  riskId: string,
  now: Date,
  authorizedApprovers: VerifiedExceptionApprovers,
  errors: string[]
): RiskException | undefined {
  if (!isRecord(value)) {
    errors.push(`Risk ${riskId} exception must include approver, rationale, scope, and expiry.`);
    return undefined;
  }

  const { approvedBy, rationale, scope, expiresAt } = value;
  if (
    !nonEmptyString(approvedBy) ||
    !nonEmptyString(rationale) ||
    !nonEmptyString(scope) ||
    typeof expiresAt !== 'string'
  ) {
    errors.push(`Risk ${riskId} exception must include approver, rationale, scope, and expiry.`);
    return undefined;
  }

  if (!isFutureIsoDate(expiresAt, now)) {
    errors.push(`Risk ${riskId} exception expiry must be a future date.`);
    return undefined;
  }

  const normalizedApprover = approvedBy.trim().toLowerCase();
  const isSecurityOwner = authorizedApprovers.securityOwners.has(normalizedApprover);
  const isDesignatedFallback =
    authorizedApprovers.securityOwners.size === 0 &&
    authorizedApprovers.designatedMaintainers.has(normalizedApprover);
  if (!isSecurityOwner && !isDesignatedFallback) {
    errors.push(
      `Risk ${riskId} exception approver is not a verified security owner or designated maintainer.`
    );
    return undefined;
  }

  return { approvedBy: approvedBy.trim(), rationale, scope, expiresAt };
}

export function parseVerifiedExceptionApprovers(source: string): VerifiedExceptionApprovers {
  const approvers: {
    securityOwners: Set<string>;
    designatedMaintainers: Set<string>;
  } = {
    securityOwners: new Set(),
    designatedMaintainers: new Set(),
  };
  let inApproverSection = false;

  for (const line of source.split(/\r?\n/)) {
    const heading = line.match(/^##\s+(.+?)\s*$/);
    if (heading) {
      if (inApproverSection) {
        break;
      }
      inApproverSection = heading[1].toLowerCase() === 'exception approvers';
      continue;
    }
    if (!inApproverSection || !line.trim().startsWith('|')) {
      continue;
    }

    const [role, identity, verification] = line
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim());
    if (
      (role === 'Security owner' || role === 'Designated maintainer') &&
      identity &&
      githubIdentityPattern.test(identity) &&
      verification?.toLowerCase() === 'verified'
    ) {
      const target =
        role === 'Security owner' ? approvers.securityOwners : approvers.designatedMaintainers;
      target.add(identity.toLowerCase());
    }
  }

  return approvers;
}

export function evaluateSecurityRisks(
  value: unknown,
  now: Date = new Date(),
  authorizedApprovers: VerifiedExceptionApprovers = {
    securityOwners: new Set(),
    designatedMaintainers: new Set(),
  }
): RiskEvaluation {
  const errors: string[] = [];
  const blockingRiskIds: string[] = [];

  if (!isRecord(value) || !Array.isArray(value.risks) || value.risks.length === 0) {
    return {
      errors: ['Risk register must contain a non-empty risks array.'],
      blockingRiskIds: ['<invalid-register>'],
    };
  }

  const seenIds = new Set<string>();

  for (const candidate of value.risks) {
    const rowErrorCount = errors.length;
    if (!isRecord(candidate)) {
      errors.push('Each risk entry must be an object.');
      blockingRiskIds.push('<invalid-risk>');
      continue;
    }

    const id = nonEmptyString(candidate.id) ? candidate.id : '<missing-id>';
    const severity = candidate.severity;
    const status = candidate.status;
    const category = candidate.category;

    if (id === '<missing-id>') {
      errors.push('Each risk must have a non-empty ID.');
    } else if (seenIds.has(id)) {
      errors.push(`Risk register contains duplicate ID ${id}.`);
    } else {
      seenIds.add(id);
    }

    if (!isSeverity(severity)) {
      errors.push(`Risk ${id} has an invalid severity.`);
    }
    if (!isRiskCategory(category)) {
      errors.push(`Risk ${id} has an invalid category.`);
    }
    if (!isRiskStatus(status)) {
      errors.push(`Risk ${id} has an invalid status.`);
    }
    const requiredCategory = requiredRiskCategories.get(id);
    if (requiredCategory && category !== requiredCategory) {
      errors.push(`Risk ${id} must use the ${requiredCategory} category.`);
    }
    if (
      isRiskCategory(category) &&
      highMinimumCategories.has(category) &&
      status !== 'mitigated' &&
      status !== 'closed' &&
      isSeverity(severity) &&
      severity !== 'high' &&
      severity !== 'critical'
    ) {
      errors.push(`Risk ${id} must have HIGH or CRITICAL severity.`);
    }
    if (!nonEmptyString(candidate.affectedArea)) {
      errors.push(`Risk ${id} must identify an affected area.`);
    }
    if (!nonEmptyString(candidate.ownerRole)) {
      errors.push(`Risk ${id} must have an owner role.`);
    }
    if (!nonEmptyString(candidate.disposition)) {
      errors.push(`Risk ${id} must have a disposition.`);
    }

    const evidence = candidate.evidence;
    if (!Array.isArray(evidence) || evidence.some((item) => !nonEmptyString(item))) {
      errors.push(`Risk ${id} evidence must be an array of non-empty strings.`);
    } else if ((status === 'mitigated' || status === 'closed') && evidence.length === 0) {
      errors.push(`Risk ${id} must include verification evidence before resolution.`);
    }

    if (status === 'excepted') {
      parseException(candidate.exception, id, now, authorizedApprovers, errors);
    }

    const isBlockingSeverity = severity === 'critical' || severity === 'high';
    const hasValidState = isRiskStatus(status);
    const isUnresolved =
      status === 'open' ||
      (status === 'excepted' &&
        errors.length > rowErrorCount &&
        errors.some((error) => error.startsWith(`Risk ${id} exception`)));

    if (errors.length > rowErrorCount || (isBlockingSeverity && (isUnresolved || !hasValidState))) {
      blockingRiskIds.push(id);
    }
  }

  for (const [riskId, category] of requiredRiskCategories) {
    if (!seenIds.has(riskId)) {
      errors.push(`Risk register is missing required security risk ${riskId} (${category}).`);
      blockingRiskIds.push(riskId);
    }
  }

  return { errors, blockingRiskIds: [...new Set(blockingRiskIds)] };
}

async function main(): Promise<void> {
  const riskFile = resolve(process.cwd(), 'docs/security-risks.json');
  const ownershipFile = resolve(process.cwd(), 'docs/ownership.md');
  let source: string;
  let ownership: string;

  try {
    source = await readFile(riskFile, 'utf8');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Unable to read ${riskFile}: ${message}`);
    process.exitCode = 1;
    return;
  }

  try {
    ownership = await readFile(ownershipFile, 'utf8');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Unable to read ${ownershipFile}: ${message}`);
    process.exitCode = 1;
    return;
  }

  let riskData: unknown;
  try {
    riskData = JSON.parse(source);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Invalid JSON in ${riskFile}: ${message}`);
    process.exitCode = 1;
    return;
  }

  const result = evaluateSecurityRisks(
    riskData,
    new Date(),
    parseVerifiedExceptionApprovers(ownership)
  );
  if (result.errors.length > 0) {
    for (const error of result.errors) {
      console.error(error);
    }
  }
  if (result.blockingRiskIds.length > 0) {
    console.error(`Production release blocked by risks: ${result.blockingRiskIds.join(', ')}`);
  }
  if (result.errors.length > 0 || result.blockingRiskIds.length > 0) {
    process.exitCode = 1;
    return;
  }

  console.log('Security risk register passes the release gate.');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  void main();
}
