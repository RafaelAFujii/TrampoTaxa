import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseVerifiedExceptionApprovers } from './check-release-risks';
import {
  nonWaivableGateIds,
  parseReleaseGateException,
  releaseGateIds,
  type ReleaseGateStatus,
  type VerifiedExceptionApprovers,
} from './release-exception-policy';

interface ReleaseExceptionContext {
  revision: string;
  gateResults: readonly unknown[];
  now: Date;
  authorizedApprovers: VerifiedExceptionApprovers;
}

interface ReleaseExceptionEvaluation {
  errors: string[];
  blockedGateIds: string[];
}

const knownGateIds = new Set<string>([...releaseGateIds, ...nonWaivableGateIds]);
const allRequiredGateIds = [...releaseGateIds, ...nonWaivableGateIds];
const nonWaivableGates = new Set<string>(nonWaivableGateIds);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isGateStatus(value: unknown): value is ReleaseGateStatus {
  return (
    value === 'success' || value === 'failed' || value === 'missing' || value === 'unavailable'
  );
}

export function evaluateReleaseExceptions(
  value: unknown,
  context: ReleaseExceptionContext
): ReleaseExceptionEvaluation {
  const errors: string[] = [];
  const blockedGateIds: string[] = [];
  if (
    !isRecord(value) ||
    !Array.isArray(value.exceptions) ||
    !/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/i.test(context.revision)
  ) {
    return {
      errors: ['Release exception register or candidate revision is invalid.'],
      blockedGateIds: ['<invalid-release-exceptions>'],
    };
  }

  const results = new Map<string, ReleaseGateStatus>();
  for (const candidate of context.gateResults) {
    if (
      !isRecord(candidate) ||
      typeof candidate.gate !== 'string' ||
      !isGateStatus(candidate.status)
    ) {
      errors.push('Release gate results contain a malformed entry.');
      blockedGateIds.push('<invalid-gate-result>');
      continue;
    }
    if (!knownGateIds.has(candidate.gate)) {
      errors.push(`Release gate result identifies an unknown gate: ${candidate.gate}.`);
      blockedGateIds.push(candidate.gate);
      continue;
    }
    if (results.has(candidate.gate)) {
      errors.push(`Release gate results contain duplicate gate ${candidate.gate}.`);
      blockedGateIds.push(candidate.gate);
      continue;
    }
    results.set(candidate.gate, candidate.status);
  }

  for (const gate of allRequiredGateIds) {
    if (!results.has(gate)) {
      errors.push(`Required gate ${gate} is missing and cannot be excepted.`);
      blockedGateIds.push(gate);
    }
  }

  for (const [gate, status] of results) {
    if (status === 'missing' || status === 'unavailable') {
      errors.push(`Required gate ${gate} is ${status} and cannot be excepted.`);
      blockedGateIds.push(gate);
    }
  }

  const failedGates = new Set(
    [...results].filter(([, status]) => status === 'failed').map(([gate]) => gate)
  );
  const exceptionsByGate = new Map<string, unknown[]>();
  for (const exception of value.exceptions) {
    if (!isRecord(exception) || typeof exception.gate !== 'string') {
      errors.push('Release exception record is incomplete or malformed.');
      blockedGateIds.push('<invalid-exception>');
      continue;
    }
    const existing = exceptionsByGate.get(exception.gate) ?? [];
    existing.push(exception);
    exceptionsByGate.set(exception.gate, existing);
  }

  for (const gate of failedGates) {
    if (nonWaivableGates.has(gate)) {
      errors.push(`Required gate ${gate} failed and cannot be excepted.`);
      blockedGateIds.push(gate);
      continue;
    }
    const exceptions = exceptionsByGate.get(gate) ?? [];
    if (exceptions.length !== 1) {
      errors.push(
        exceptions.length === 0
          ? `Failed gate ${gate} has no approved exception.`
          : `Failed gate ${gate} has more than one exception.`
      );
      blockedGateIds.push(gate);
      continue;
    }
    const exceptionErrors: string[] = [];
    const parsed = parseReleaseGateException(
      exceptions[0],
      {
        gate,
        revision: context.revision,
        now: context.now,
        authorizedApprovers: context.authorizedApprovers,
      },
      exceptionErrors,
      'Release exception'
    );
    errors.push(...exceptionErrors);
    if (!parsed) {
      blockedGateIds.push(gate);
    }
  }

  for (const gate of exceptionsByGate.keys()) {
    if (!knownGateIds.has(gate)) {
      errors.push(`Exception identifies an unknown release gate: ${gate}.`);
      blockedGateIds.push(gate);
    } else if (!failedGates.has(gate)) {
      errors.push(`Exception for ${gate} does not correspond to an available failed gate.`);
      blockedGateIds.push(gate);
    }
  }

  return { errors, blockedGateIds: [...new Set(blockedGateIds)] };
}

async function main(): Promise<void> {
  const exceptionFile = resolve(process.cwd(), 'docs/release-exceptions.json');
  const ownershipFile = resolve(process.cwd(), 'docs/ownership.md');
  const gateResultsJson = process.env.RELEASE_GATE_RESULTS;
  const revision = process.env.GITHUB_SHA;
  let exceptionSource: string;
  let ownershipSource: string;

  if (!gateResultsJson || !revision) {
    console.error(
      'RELEASE_GATE_RESULTS and GITHUB_SHA are required for release exception validation.'
    );
    process.exitCode = 1;
    return;
  }

  try {
    exceptionSource = await readFile(exceptionFile, 'utf8');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Unable to read ${exceptionFile}: ${message}`);
    process.exitCode = 1;
    return;
  }
  try {
    ownershipSource = await readFile(ownershipFile, 'utf8');
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Unable to read ${ownershipFile}: ${message}`);
    process.exitCode = 1;
    return;
  }

  let exceptionData: unknown;
  let gateResults: unknown;
  try {
    exceptionData = JSON.parse(exceptionSource);
    gateResults = JSON.parse(gateResultsJson);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Invalid release exception or gate result JSON: ${message}`);
    process.exitCode = 1;
    return;
  }

  const evaluation = evaluateReleaseExceptions(exceptionData, {
    revision,
    gateResults: Array.isArray(gateResults) ? gateResults : [],
    now: new Date(),
    authorizedApprovers: parseVerifiedExceptionApprovers(ownershipSource),
  });
  if (evaluation.errors.length > 0) {
    for (const error of evaluation.errors) {
      console.error(error);
    }
  }
  if (evaluation.blockedGateIds.length > 0) {
    console.error(`Production release blocked by gates: ${evaluation.blockedGateIds.join(', ')}`);
  }
  if (evaluation.errors.length > 0 || evaluation.blockedGateIds.length > 0) {
    process.exitCode = 1;
    return;
  }

  console.log('Release exceptions cover all available failed gates.');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  void main();
}
