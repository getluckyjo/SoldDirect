import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { EmailSender } from '../email';
import { ndaSignedEmail, ndaTeamAlert } from './emails';
import type { NdaRepository } from './repository';
import type { NdaSignatureInput } from './types';

export interface DataroomRouteDeps {
  repository: NdaRepository;
  /** Null when email is not configured: signatures are stored, no link is sent. */
  sender: EmailSender | null;
  /** Founders alerted on each signature. */
  notifyTo: string[];
  replyTo?: string;
  dashboardUrl?: string;
  /** Base of the investor site; the personal link is built on it. */
  investUrl: string;
  /** Dashboard reads require this `x-internal-token` when set. */
  internalToken?: string;
  log: (message: string, error?: unknown) => void;
  now?: () => Date;
}

/**
 * Abuse brake on the public sign endpoint: each signature sends two emails,
 * so cap the hour well above any real investor traffic.
 */
const HOURLY_CAP = 60;

const signBodySchema = {
  type: 'object',
  required: ['name', 'email', 'ndaVersion'],
  additionalProperties: false,
  properties: {
    name: { type: 'string', minLength: 2, maxLength: 200 },
    email: {
      type: 'string',
      pattern: '^[^@\\s]+@[^@\\s]+\\.[^@\\s]+$',
      maxLength: 320,
    },
    firm: { type: 'string', maxLength: 200 },
    ndaVersion: { type: 'string', minLength: 1, maxLength: 40 },
    ip: { type: 'string', maxLength: 64 },
    userAgent: { type: 'string', maxLength: 1000 },
  },
} as const;

const redeemBodySchema = {
  type: 'object',
  required: ['token'],
  additionalProperties: false,
  properties: { token: { type: 'string', minLength: 20, maxLength: 200 } },
} as const;

/**
 * The investor NDA behind the data room. The investor site posts the
 * signature here; the API stores it, emails the investor their personal link
 * and alerts the founders. The site redeems the link server-side to open a
 * personal session. The list sits behind the internal token like every other
 * dashboard read: it is PII.
 */
export function registerDataroomRoutes(
  app: FastifyInstance,
  deps: DataroomRouteDeps,
): void {
  const now = deps.now ?? (() => new Date());
  let sentAt: number[] = [];
  function takeSlot(): boolean {
    const t = now().getTime();
    sentAt = sentAt.filter((s) => s > t - 60 * 60 * 1000);
    if (sentAt.length >= HOURLY_CAP) return false;
    sentAt.push(t);
    return true;
  }

  app.post(
    '/api/dataroom/nda',
    { schema: { body: signBodySchema } },
    async (request, reply) => {
      const input = request.body as NdaSignatureInput;
      const { id, token } = await deps.repository.create(input);
      const link = `${deps.investUrl.replace(/\/$/, '')}/dataroom/enter?t=${token}`;
      const signedAt = now();

      let emailed = false;
      if (deps.sender && takeSlot()) {
        const sender = deps.sender;
        const sends: Promise<void>[] = [
          sender
            .send(ndaSignedEmail(input, link, signedAt, deps.replyTo))
            .then(() => {
              emailed = true;
            })
            .catch((error) =>
              deps.log(`[dataroom] link email failed for nda ${id}`, error),
            ),
        ];
        if (deps.notifyTo.length > 0) {
          sends.push(
            sender
              .send(
                ndaTeamAlert(input, {
                  to: deps.notifyTo,
                  signedAt,
                  dashboardUrl: deps.dashboardUrl,
                }),
              )
              .then(() => undefined)
              .catch((error) =>
                deps.log(`[dataroom] team alert failed for nda ${id}`, error),
              ),
          );
        }
        await Promise.all(sends);
      } else if (deps.sender) {
        deps.log(`[dataroom] hourly cap reached — link not sent for nda ${id}`);
      }
      return reply.code(201).send({ id, emailed });
    },
  );

  app.post(
    '/api/dataroom/nda/redeem',
    { schema: { body: redeemBodySchema } },
    async (request, reply) => {
      const { token } = request.body as { token: string };
      const viewer = await deps.repository.redeem(token, now());
      if (!viewer) return reply.code(404).send({ error: 'invalid_link' });
      return { viewer };
    },
  );

  async function guard(request: FastifyRequest, reply: FastifyReply) {
    if (!deps.internalToken) return;
    if (request.headers['x-internal-token'] !== deps.internalToken) {
      return reply.code(401).send({ error: 'unauthorized' });
    }
  }

  app.get('/api/dataroom/nda', { preHandler: guard }, async () => ({
    signatures: await deps.repository.list(),
  }));
}
