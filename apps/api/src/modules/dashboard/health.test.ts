import { afterEach, describe, expect, it, vi } from 'vitest';
import { buildServer } from '../../app';

/**
 * /health is how we answer "is the live API running the code I merged, and is
 * the AI layer actually on?" from a browser. Both answers are load-bearing
 * during a deploy, so they are pinned here.
 */
const AI_ENV = [
  'ANTHROPIC_API_KEY',
  'AGENT_ENABLED',
  'DESCRIPTION_DRAFTING',
  'INTAKE_EXTRACTION',
  'RAILWAY_GIT_COMMIT_SHA',
  'RENDER_GIT_COMMIT',
  'VERCEL_GIT_COMMIT_SHA',
  'GIT_COMMIT_SHA',
  'RESEND_API_KEY',
  'EMAIL_FROM',
] as const;

afterEach(() => {
  for (const key of AI_ENV) delete process.env[key];
  vi.restoreAllMocks();
});

async function health() {
  const app = buildServer({
    listingRepository: {} as never,
    dealRepository: {} as never,
  });
  const res = await app.inject({ method: 'GET', url: '/health' });
  await app.close();
  return res.json();
}

describe('GET /health', () => {
  it('reports ok and the service name', async () => {
    const body = await health();
    expect(body.status).toBe('ok');
    expect(body.service).toBeTruthy();
  });

  it('shortens the deployed commit, and says "unknown" when unset', async () => {
    expect((await health()).commit).toBe('unknown');

    process.env.RAILWAY_GIT_COMMIT_SHA = 'dff05b906cb87bf10b464cbddbf28dbe203f';
    expect((await health()).commit).toBe('dff05b9');
  });

  it('reports every AI feature off when there is no API key', async () => {
    // The common deploy surprise: the service is healthy, the AI is not on.
    process.env.AGENT_ENABLED = 'true';
    expect((await health()).features).toEqual({
      estateAgent: false,
      descriptionWriter: false,
      fieldExtraction: false,
      waitlistEmails: false,
    });
  });

  it('an API key alone enables writing and extraction, but not the WhatsApp estate agent', async () => {
    process.env.ANTHROPIC_API_KEY = 'sk-ant-test';
    expect((await health()).features).toEqual({
      estateAgent: false, // still needs AGENT_ENABLED
      descriptionWriter: true,
      fieldExtraction: true,
      waitlistEmails: false,
    });
  });

  it('reports the WhatsApp estate agent on only with both the key and the flag', async () => {
    process.env.ANTHROPIC_API_KEY = 'sk-ant-test';
    process.env.AGENT_ENABLED = 'true';
    expect((await health()).features.estateAgent).toBe(true);
  });

  it('honours the explicit opt-outs', async () => {
    process.env.ANTHROPIC_API_KEY = 'sk-ant-test';
    process.env.DESCRIPTION_DRAFTING = 'false';
    process.env.INTAKE_EXTRACTION = 'false';
    const { features } = await health();
    expect(features.descriptionWriter).toBe(false);
    expect(features.fieldExtraction).toBe(false);
  });

  it('reports waitlist emails on only with both the Resend key and a from-address', async () => {
    process.env.RESEND_API_KEY = 're_test';
    expect((await health()).features.waitlistEmails).toBe(false);
    process.env.EMAIL_FROM = 'Sold Direct <hello@solddirect.co.za>';
    expect((await health()).features.waitlistEmails).toBe(true);
    expect(JSON.stringify(await health())).not.toContain('re_test');
  });

  it('never leaks the API key itself', async () => {
    process.env.ANTHROPIC_API_KEY = 'sk-ant-super-secret';
    expect(JSON.stringify(await health())).not.toContain('super-secret');
  });
});
