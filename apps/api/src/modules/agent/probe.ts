import Anthropic from '@anthropic-ai/sdk';

/**
 * Verifies that the configured Anthropic key is actually accepted — not just
 * present. A present-but-invalid key is the quietest failure in the stack:
 * every concierge turn errors, the dispatcher falls back to the scripted
 * reply, and nothing in the UI says why. The probe makes it visible on
 * /health and in the demo's control room.
 *
 * Cheap: one `models.list` call (no tokens), cached for a while, refreshed
 * lazily on read and once at boot.
 */
export type KeyStatus = 'missing' | 'unverified' | 'ok' | 'invalid' | 'error';

export interface KeyProbe {
  /** Last known status; triggers a background refresh when stale. */
  status(): KeyStatus;
  /** Force a check now. */
  check(): Promise<KeyStatus>;
  /** When the last check completed, if any. */
  checkedAt(): Date | null;
}

export interface KeyProbeConfig {
  apiKey?: string;
  /** How long a result is trusted before a background re-check. */
  ttlMs?: number;
  log?: (message: string, error?: unknown) => void;
}

export function createAnthropicKeyProbe(config: KeyProbeConfig = {}): KeyProbe {
  const ttl = config.ttlMs ?? 10 * 60 * 1000;
  const log = config.log ?? (() => {});
  let status: KeyStatus = config.apiKey ? 'unverified' : 'missing';
  let checkedAt: Date | null = null;
  let inflight: Promise<KeyStatus> | null = null;

  async function run(): Promise<KeyStatus> {
    if (!config.apiKey) {
      status = 'missing';
      return status;
    }
    try {
      const client = new Anthropic({ apiKey: config.apiKey, maxRetries: 0 });
      await client.models.list({ limit: 1 });
      status = 'ok';
    } catch (error) {
      const code = (error as { status?: number }).status;
      status = code === 401 || code === 403 ? 'invalid' : 'error';
      log(`anthropic key probe: ${status}`, error);
    }
    checkedAt = new Date();
    return status;
  }

  function check(): Promise<KeyStatus> {
    if (!inflight) {
      inflight = run().finally(() => {
        inflight = null;
      });
    }
    return inflight;
  }

  return {
    status() {
      const stale = !checkedAt || Date.now() - checkedAt.getTime() > ttl;
      if (stale && config.apiKey) void check();
      return status;
    },
    check,
    checkedAt: () => checkedAt,
  };
}

/** A probe that never calls out — for tests and the no-key case. */
export function createStaticKeyProbe(status: KeyStatus): KeyProbe {
  return {
    status: () => status,
    check: async () => status,
    checkedAt: () => null,
  };
}
