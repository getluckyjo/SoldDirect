import type { DealStage } from '@sell-direct/shared';
import { InvalidTransitionError } from './state-machine';
import type { TransitionInput } from './service';
import type { DealRepository } from './repository';
import { buildStageNotifications } from './stage-notifications';
import type { Notifier } from '../notifications';
import type { TemplateConfig } from '../notifications/templates';
import { applyStageDeadlines } from '../deadlines';
import type { DeadlineRepository } from '../deadlines';

export interface AdvanceDealDeps {
  deals: Pick<DealRepository, 'getNotificationContext'>;
  /** Applies the state-machine transition atomically (see deals/service.ts). */
  transition: (
    input: TransitionInput,
  ) => Promise<{ id: string; status: string }>;
  /** Sends the stage updates — production BSP, or the demo's persist-only one. */
  notifier: Notifier;
  templates: TemplateConfig;
  /** When present, stage deadlines are created/resolved on each transition. */
  deadlines?: DeadlineRepository;
  log?: (message: string, error?: unknown) => void;
}

export interface AdvanceDealInput {
  dealId: string;
  to: DealStage;
  note?: string;
  bank?: string;
  amountZar?: string;
  actorType?: 'agent' | 'system';
}

export type AdvanceDealResult =
  | { ok: true; deal: { id: string; status: string }; notified: number }
  | { ok: false; error: 'not_found' | 'invalid_transition' };

/**
 * Advance a deal one stage and tell both parties on WhatsApp — the one code
 * path behind the internal transition endpoint and the demo's journey, so
 * the simulator never drifts from what the real tracker sends.
 *
 * Notification failures never roll back the transition: the status change
 * is the record; delivery is best-effort and logged.
 */
export async function advanceDeal(
  deps: AdvanceDealDeps,
  input: AdvanceDealInput,
): Promise<AdvanceDealResult> {
  const log = deps.log ?? (() => {});

  const context = await deps.deals.getNotificationContext(input.dealId);
  if (!context) return { ok: false, error: 'not_found' };

  let deal;
  try {
    deal = await deps.transition({
      dealId: input.dealId,
      to: input.to,
      actorType: input.actorType ?? 'agent',
      note: input.note,
    });
  } catch (error) {
    if (error instanceof InvalidTransitionError) {
      return { ok: false, error: 'invalid_transition' };
    }
    throw error;
  }

  // Countdown engine: create this stage's deadlines, resolve completed ones.
  if (deps.deadlines) {
    try {
      await applyStageDeadlines(deps.deadlines, input.dealId, input.to);
    } catch (error) {
      log('stage deadlines failed', error);
    }
  }

  const notifications = buildStageNotifications(input.to, {
    ...context,
    note: input.note,
    bank: input.bank,
    amountZar: input.amountZar,
  });

  let notified = 0;
  for (const n of notifications) {
    try {
      const templateId = n.templateKey
        ? deps.templates[n.templateKey]
        : undefined;
      await deps.notifier.send(n.to, n.text, {
        templateId,
        variables: templateId ? n.variables : undefined,
      });
      notified += 1;
    } catch (error) {
      log('stage notification failed', error);
    }
  }

  return { ok: true, deal: { id: deal.id, status: deal.status }, notified };
}
