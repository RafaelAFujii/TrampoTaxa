export const API_BASE_URL =
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_API_URL) || 'http://localhost:5000';

export function getApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (cleanEndpoint.startsWith('/api')) {
    return `${API_BASE_URL}${cleanEndpoint}`;
  }
  return `${API_BASE_URL}/api${cleanEndpoint}`;
}
