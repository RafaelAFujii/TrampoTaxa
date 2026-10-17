import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

type OpenApiObject = Record<string, unknown>;

const tagPattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const httpMethods = new Set([
  'get',
  'put',
  'post',
  'delete',
  'options',
  'head',
  'patch',
  'trace',
]);

function isObject(value: unknown): value is OpenApiObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function validateOpenApiTags(document: unknown): string[] {
  if (!isObject(document)) {
    return ['The OpenAPI document must be an object'];
  }

  const errors: string[] = [];
  const declaredTags = new Set<string>();
  const tagDefinitions = Array.isArray(document.tags) ? document.tags : [];

  for (const definition of tagDefinitions) {
    if (!isObject(definition) || typeof definition.name !== 'string') {
      errors.push('Every declared OpenAPI tag must have a string name');
      continue;
    }

    const name = definition.name;
    if (declaredTags.has(name)) {
      errors.push(`Duplicate OpenAPI tag name "${name}"`);
      continue;
    }
    declaredTags.add(name);

    if (!tagPattern.test(name)) {
      errors.push(`Invalid OpenAPI tag name "${name}"`);
    }
  }

  if (!isObject(document.paths)) {
    return errors;
  }

  for (const [path, pathItem] of Object.entries(document.paths)) {
    if (!isObject(pathItem)) {
      continue;
    }

    for (const [method, operation] of Object.entries(pathItem)) {
      if (!httpMethods.has(method.toLowerCase()) || !isObject(operation)) {
        continue;
      }

      if (!Array.isArray(operation.tags)) {
        continue;
      }

      for (const tag of operation.tags) {
        const methodLabel = method.toUpperCase();
        if (typeof tag !== 'string' || !tagPattern.test(tag)) {
          errors.push(
            `Invalid OpenAPI tag name "${String(tag)}" referenced by ${methodLabel} ${path}`
          );
          continue;
        }

        if (!declaredTags.has(tag)) {
          errors.push(
            `Undeclared OpenAPI tag "${tag}" referenced by ${methodLabel} ${path}`
          );
        }
      }
    }
  }

  return errors;
}

const scriptPath = fileURLToPath(import.meta.url);
if (process.argv[1] && resolve(process.argv[1]) === scriptPath) {
  const contractPath = resolve(dirname(scriptPath), '../openapi.yaml');
  const document = parse(readFileSync(contractPath, 'utf8'));
  const errors = validateOpenApiTags(document);

  if (errors.length > 0) {
    for (const error of errors) {
      console.error(error);
    }
    process.exitCode = 1;
  } else {
    console.log('All OpenAPI tag names are valid ASCII kebab-case.');
  }
}
