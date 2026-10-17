import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

type Severity = 'critical' | 'high' | 'medium' | 'low';
type RiskStatus = 'open' | 'mitigated' | 'excepted' | 'closed';

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

const severities: Severity[] = ['critical', 'high', 'medium', 'low'];
const statuses: RiskStatus[] = ['open', 'mitigated', 'excepted', 'closed'];

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

function isFutureIsoDate(value: unknown, now: Date): value is string {
  if (
    typeof value !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/.test(value)
  ) {
    return false;
  }

  const expiry = Date.parse(value);
  return Number.isFinite(expiry) && expiry > now.getTime();
}

function parseException(
  value: unknown,
  riskId: string,
  now: Date,
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

  return { approvedBy, rationale, scope, expiresAt };
}

export function evaluateSecurityRisks(value: unknown, now: Date = new Date()): RiskEvaluation {
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
    if (!isRiskStatus(status)) {
      errors.push(`Risk ${id} has an invalid status.`);
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
      parseException(candidate.exception, id, now, errors);
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

  return { errors, blockingRiskIds: [...new Set(blockingRiskIds)] };
}

async function main(): Promise<void> {
  const riskFile = resolve(process.cwd(), 'docs/security-risks.json');
  let source: string;

  try {
    source = await readFile(riskFile, 'utf8');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Unable to read ${riskFile}: ${message}`);
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

  const result = evaluateSecurityRisks(riskData);
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
