export interface AuthenticatedFetchOptions {
  token: string | null;
  onUnauthorized?: () => void | Promise<void>;
  fetchImpl?: typeof fetch;
}

const privateOperations: Array<{ method: string; path: RegExp }> = [
  { method: 'GET', path: /^\/auth\/me$/ },
  { method: 'POST', path: /^\/gigs$/ },
  { method: 'POST', path: /^\/gigs\/[^/]+\/apply$/ },
  { method: 'GET', path: /^\/gigs\/[^/]+\/applicants$/ },
  { method: 'POST', path: /^\/gigs\/[^/]+\/applicants\/[^/]+\/(?:approve|reject)$/ },
  { method: 'POST', path: /^\/gigs\/[^/]+\/evaluation$/ },
  { method: 'GET', path: /^\/chat\/[^/]+\/messages$/ },
  { method: 'POST', path: /^\/chat\/[^/]+\/messages$/ },
  { method: 'GET', path: /^\/contractor\/reports$/ },
];

function isPrivateOperation(input: RequestInfo | URL, method: string): boolean {
  const url =
    input instanceof Request
      ? new URL(input.url)
      : new URL(typeof input === 'string' ? input : input.toString(), 'https://trampotaxa.invalid');
  return privateOperations.some(
    (operation) => operation.method === method.toUpperCase() && operation.path.test(url.pathname)
  );
}

export async function authenticatedFetch(
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  options: AuthenticatedFetchOptions
): Promise<Response> {
  const method =
    init?.method ?? (input instanceof Request ? input.method : 'GET');
  const isPrivate = isPrivateOperation(input, method);
  if (isPrivate && !options.token) {
    throw new Error('Cannot call a private API operation without an authenticated session');
  }

  const requestHeaders = input instanceof Request ? new Headers(input.headers) : new Headers();
  new Headers(init?.headers).forEach((value, name) => requestHeaders.set(name, value));

  requestHeaders.delete('Authorization');
  if (isPrivate && options.token) {
    requestHeaders.set('Authorization', `Bearer ${options.token}`);
  }

  const response = await (options.fetchImpl ?? fetch)(input, {
    ...init,
    headers: requestHeaders,
  });

  if (isPrivate && response.status === 401) {
    if (!options.onUnauthorized) {
      throw new Error('A private API 401 response requires a session invalidation handler');
    }
    await options.onUnauthorized();
  }

  return response;
}
