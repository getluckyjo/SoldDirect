import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { Dispatcher } from '../conversation';
import type { MessageRepository } from '../messaging';
import type { Notifier } from '../notifications';
import type { AgentRepository } from '../agent';
import type { ConversationStore, EstimateStore } from '../listings';
import {
  DEMO_PHONE_RE,
  type DemoMediaStore,
  type DemoRepository,
} from './types';
import { DEMO_PAGE_HTML } from './page';
import { isJourneyStep, runJourneyStep, type JourneyDeps } from './journey';

export interface DemoRouteDeps {
  /** Dispatcher wired with the demo notifier (persist-only transport). */
  dispatcher: Dispatcher;
  messages: MessageRepository;
  demo: DemoRepository;
  agentDrafts: AgentRepository;
  /** In-memory photo stash feeding the demo's fetchMedia. */
  media: DemoMediaStore;
  /** The demo's persist-only notifier (draft approvals send through it). */
  notifier: Notifier;
  /** When set, API endpoints require a matching `x-internal-token` header. */
  internalToken?: string;
  /**
   * A demo-scoped credential accepted alongside the internal token, so a
   * public front end (the investor site's proxy) can drive the simulator
   * without ever holding the key to the rest of the internal API.
   */
  demoToken?: string;
  /** The conversation stores, read back for the control-room state. */
  stores?: { intake: ConversationStore; estimate: EstimateStore };
  /** The "market responds" director (POST /api/demo/journey). */
  journey?: Omit<JourneyDeps, 'dispatcher' | 'notifier'>;
  /** Whether the AI concierge is on and its key accepted, for the control room. */
  ai?: () => { concierge: boolean; key: string };
  log?: (message: string, error?: unknown) => void;
}

const DATA_URL_RE = /^data:(image\/[a-z+.-]+);base64,(.+)$/i;

let demoInboundSeq = 0;

/**
 * The playable WhatsApp simulator. GET /demo serves the chat UI; the API
 * endpoints inject messages through the real production pipeline and read
 * the thread back from the message log. Demo numbers are restricted to the
 * reserved +2700xxxxxxx range so real user threads can never be touched.
 */
export function registerDemoRoutes(
  app: FastifyInstance,
  deps: DemoRouteDeps,
): void {
  const accepted = [deps.internalToken, deps.demoToken].filter(
    (t): t is string => !!t,
  );
  const gated = accepted.length > 0;

  function authorised(token: unknown): boolean {
    if (!gated) return true;
    return typeof token === 'string' && accepted.includes(token);
  }

  async function guard(request: FastifyRequest, reply: FastifyReply) {
    if (!authorised(request.headers['x-internal-token'])) {
      return reply.code(401).send({ error: 'unauthorized' });
    }
  }

  async function threadState(phone: string) {
    const [messages, allPending] = await Promise.all([
      deps.demo.conversation(phone),
      deps.agentDrafts.listDrafts('pending'),
    ]);
    return {
      messages,
      drafts: allPending.filter((d) => d.phone === phone),
    };
  }

  app.get('/demo', async (_request, reply) => {
    return reply.type('text/html; charset=utf-8').send(DEMO_PAGE_HTML);
  });

  app.get(
    '/api/demo/conversation',
    { preHandler: guard },
    async (request, reply) => {
      const { phone } = request.query as { phone?: string };
      if (!phone || !DEMO_PHONE_RE.test(phone)) {
        return reply.code(400).send({ error: 'invalid_demo_phone' });
      }
      return threadState(phone);
    },
  );

  /**
   * The control-room view beside the phone: where the seller's conversation
   * stands (estimate, draft), their newest listing and its deal timeline —
   * all read from the same rows the production dashboard reads.
   */
  app.get('/api/demo/state', { preHandler: guard }, async (request, reply) => {
    const { phone } = request.query as { phone?: string };
    if (!phone || !DEMO_PHONE_RE.test(phone)) {
      return reply.code(400).send({ error: 'invalid_demo_phone' });
    }
    const [estimate, intake, listing, deal] = await Promise.all([
      deps.stores?.estimate.get(phone) ?? null,
      deps.stores?.intake.get(phone) ?? null,
      deps.demo.latestListing(phone),
      deps.demo.latestDeal(phone),
    ]);
    return {
      phone,
      estimate,
      intake,
      listing,
      deal,
      ai: deps.ai?.() ?? { concierge: false, key: 'missing' },
    };
  });

  app.post(
    '/api/demo/messages',
    { preHandler: guard },
    async (request, reply) => {
      const body = (request.body ?? {}) as {
        phone?: string;
        text?: string;
        replyId?: string;
      };
      const phone = body.phone ?? '';
      const text = (body.text ?? '').trim();
      // A tapped chip posts the option's id alongside its label, exactly like
      // a real interactive reply — so the demo exercises the production path.
      const replyId = (body.replyId ?? '').trim() || undefined;
      if (!DEMO_PHONE_RE.test(phone)) {
        return reply.code(400).send({ error: 'invalid_demo_phone' });
      }
      if (!text) {
        return reply.code(400).send({ error: 'empty_message' });
      }

      demoInboundSeq += 1;
      const message = {
        waMessageId: `wamid.demo.in.${Date.now()}.${demoInboundSeq}`,
        from: phone,
        to: 'demo',
        type: replyId ? 'interactive' : 'text',
        text,
        replyId,
        raw: { demo: true },
      };
      await deps.messages.recordInbound(message);
      // Same call the webhook makes — the dispatcher never throws.
      await deps.dispatcher.handle(message);

      return threadState(phone);
    },
  );

  /**
   * The market responds: a simulated buyer (on a paired demo number) runs
   * through the real enquiry and pre-qualification flows, and the real deal
   * state machine carries the sale to registration — every message the
   * seller receives comes from the production code paths.
   */
  app.post(
    '/api/demo/journey',
    { preHandler: guard },
    async (request, reply) => {
      if (!deps.journey) return reply.code(404).send({ error: 'not_found' });
      const body = (request.body ?? {}) as { phone?: string; step?: string };
      const phone = body.phone ?? '';
      if (!DEMO_PHONE_RE.test(phone)) {
        return reply.code(400).send({ error: 'invalid_demo_phone' });
      }
      if (!isJourneyStep(body.step)) {
        return reply.code(400).send({ error: 'invalid_step' });
      }
      const result = await runJourneyStep(
        {
          ...deps.journey,
          dispatcher: deps.dispatcher,
          notifier: deps.notifier,
        },
        phone,
        body.step,
      );
      if (!result.ok) {
        const status =
          result.error === 'invalid_transition'
            ? 409
            : result.error === 'not_found'
              ? 404
              : 400;
        return reply.code(status).send({ error: result.error });
      }
      return { ...result, ...(await threadState(phone)) };
    },
  );

  // Photo upload: base64 data-URL JSON (bodyLimit raised — Fastify's default
  // 1 MiB is too small for a phone photo, and base64 inflates ~33%).
  app.post(
    '/api/demo/photo',
    { preHandler: guard, bodyLimit: 12 * 1024 * 1024 },
    async (request, reply) => {
      const body = (request.body ?? {}) as { phone?: string; dataUrl?: string };
      const phone = body.phone ?? '';
      if (!DEMO_PHONE_RE.test(phone)) {
        return reply.code(400).send({ error: 'invalid_demo_phone' });
      }
      const match = DATA_URL_RE.exec(body.dataUrl ?? '');
      if (!match) {
        return reply.code(400).send({ error: 'not_an_image' });
      }
      const [, mimeType, payload] = match;
      let bytes: Buffer;
      try {
        bytes = Buffer.from(payload, 'base64');
      } catch {
        return reply.code(400).send({ error: 'bad_base64' });
      }
      if (bytes.length === 0) {
        return reply.code(400).send({ error: 'empty_image' });
      }

      const mediaId = deps.media.put(bytes, mimeType);
      demoInboundSeq += 1;
      const message = {
        waMessageId: `wamid.demo.in.${Date.now()}.${demoInboundSeq}`,
        from: phone,
        to: 'demo',
        type: 'image',
        text: undefined,
        media: { id: mediaId, mimeType },
        raw: { demo: true, demoMediaId: mediaId },
      };
      await deps.messages.recordInbound(message);
      await deps.dispatcher.handle(message);

      return threadState(phone);
    },
  );

  // Image bubbles load via <img>, which can't send headers — the token rides
  // the query string instead. Bytes are gone after a restart (404), which the
  // UI renders as a placeholder.
  app.get('/api/demo/media/:id', async (request, reply) => {
    const { token } = request.query as { token?: string };
    if (!authorised(token)) {
      return reply.code(401).send({ error: 'unauthorized' });
    }
    const { id } = request.params as { id: string };
    const item = deps.media.get(id);
    if (!item) return reply.code(404).send({ error: 'not_found' });
    return reply.type(item.mimeType).send(item.bytes);
  });

  app.post(
    '/api/demo/drafts/:id/approve',
    { preHandler: guard },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const body = (request.body ?? {}) as { text?: string };
      const draft = await deps.agentDrafts.getDraft(id);
      if (!draft) return reply.code(404).send({ error: 'not_found' });
      if (!DEMO_PHONE_RE.test(draft.phone)) {
        // Real-user drafts must go through the production approve endpoint.
        return reply.code(400).send({ error: 'not_a_demo_thread' });
      }
      if (draft.status !== 'pending') {
        return reply.code(409).send({ error: 'already_reviewed' });
      }
      await deps.notifier.send(draft.phone, body.text?.trim() || draft.draft);
      await deps.agentDrafts.markReviewed(id, 'approved');
      return threadState(draft.phone);
    },
  );

  app.post(
    '/api/demo/drafts/:id/dismiss',
    { preHandler: guard },
    async (request, reply) => {
      const { id } = request.params as { id: string };
      const draft = await deps.agentDrafts.getDraft(id);
      if (!draft) return reply.code(404).send({ error: 'not_found' });
      if (!DEMO_PHONE_RE.test(draft.phone)) {
        return reply.code(400).send({ error: 'not_a_demo_thread' });
      }
      if (draft.status !== 'pending') {
        return reply.code(409).send({ error: 'already_reviewed' });
      }
      await deps.agentDrafts.markReviewed(id, 'dismissed');
      return threadState(draft.phone);
    },
  );
}
