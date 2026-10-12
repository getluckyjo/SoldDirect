import { readFile } from 'node:fs/promises';
import path from 'node:path';

// The hands-on demo is a generated, self-contained HTML page
// (content/try.html — built by
// `pnpm --filter @sell-direct/api build:demo:fundraising`). It lives outside
// public/ on purpose: a public/try/ directory shadows this URL and Next
// answers 404 instead of running the route. Rendered once at build time: the
// file is read from disk and the response is emitted as static output.
export const dynamic = 'force-static';

export async function GET(): Promise<Response> {
  const file = path.join(process.cwd(), 'content', 'try.html');
  const html = await readFile(file, 'utf8');
  return new Response(html, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'x-robots-tag': 'noindex',
    },
  });
}
