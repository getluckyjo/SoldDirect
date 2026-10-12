import { type Prisma, type PrismaClient } from '@prisma/client';
import type { EstimateState } from './estimate-flow';

const FLOW = 'price_guidance';

/**
 * Persists the per-phone Quick Estimate conversation. Shares the
 * `conversation_states` table (unique per phone, flow-scoped reads — the
 * same pattern as the intake, prequal and onboarding stores). Starting a
 * listing replaces the row, which is exactly right: the estimate's facts are
 * carried into the draft first, so nothing is lost.
 */
export interface EstimateStore {
  get(phone: string): Promise<EstimateState | null>;
  set(phone: string, state: EstimateState): Promise<void>;
  clear(phone: string): Promise<void>;
}

export function createPrismaEstimateStore(prisma: PrismaClient): EstimateStore {
  return {
    async get(phone) {
      const row = await prisma.conversationState.findUnique({
        where: { phone },
      });
      if (!row || row.flow !== FLOW) return null;
      return row.data as unknown as EstimateState;
    },
    async set(phone, state) {
      const data = state as unknown as Prisma.InputJsonValue;
      await prisma.conversationState.upsert({
        where: { phone },
        create: { phone, flow: FLOW, step: state.step, data },
        update: { flow: FLOW, step: state.step, data },
      });
    },
    async clear(phone) {
      // Flow-scoped: never delete another flow's row (an intake draft that
      // replaced this estimate must survive).
      await prisma.conversationState.deleteMany({
        where: { phone, flow: FLOW },
      });
    },
  };
}

/** In-memory store for tests and single-process dev. */
export function createInMemoryEstimateStore(): EstimateStore {
  const map = new Map<string, EstimateState>();
  return {
    async get(phone) {
      return map.get(phone) ?? null;
    },
    async set(phone, state) {
      map.set(phone, state);
    },
    async clear(phone) {
      map.delete(phone);
    },
  };
}
