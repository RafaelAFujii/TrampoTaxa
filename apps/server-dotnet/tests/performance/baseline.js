import http from 'k6/http';
import { check } from 'k6';

const baseUrl = __ENV.BASE_URL;

if (!baseUrl || !/^http:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?\/?$/.test(baseUrl)) {
  throw new Error('BASE_URL must be an HTTP loopback origin for the disposable local API.');
}

const gigsUrl = `${baseUrl.replace(/\/+$/, '')}/api/gigs`;

export const options = {
  vus: 10,
  duration: '30s',
};

export default function () {
  const response = http.get(gigsUrl);

  check(response, {
    'GET /api/gigs returns a successful response': (result) =>
      result.status >= 200 && result.status < 300,
  });
}
