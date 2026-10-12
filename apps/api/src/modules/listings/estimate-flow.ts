import type { PropertyType } from '@sell-direct/shared';
import type { ReplyOptions } from '../messaging/interactive';
import {
  renderPropertyReport,
  renderQuickEstimate,
  type PriceEstimate,
  type ValuationAdapter,
} from '../valuation';
import {
  composeTitle,
  optionsFor,
  parseWholeNumber,
  validateField,
  type IntakeState,
} from './intake';
import { findRegion } from './suburbs';
import { BEGIN_RE, PRICE_GUIDANCE_RE, START_RE } from './welcome';
import { looksLikeAQuestion, soundsStuck } from './service';
import type { EstimateStore } from './estimate-store';

/**
 * The Quick Estimate: three taps (region/suburb, type, bedrooms) to a price
 * band from confirmed sales, then the optional Property Report, then — if
 * the seller wants — straight into listing intake with those facts already
 * filled in, so nothing is asked twice.
 *
 * Pure state machine + a thin orchestrator (same shape as intake.ts /
 * service.ts). Framing is legally load-bearing: this is market GUIDANCE from
 * confirmed sales, never a "valuation" (Property Valuers Profession Act), and
 * the asking price is always the seller's.
 */
export type EstimateStep =
  | 'awaiting_suburb'
  | 'awaiting_suburb_pick'
  | 'awaiting_property_type'
  | 'awaiting_bedrooms'
  | 'estimated';

export interface EstimateFacts {
  suburb?: string;
  propertyType?: PropertyType;
  bedrooms?: number;
}

export interface EstimateState {
  step: EstimateStep;
  facts: EstimateFacts;
  /** The region chosen while drilling into suburbs (picker state only). */
  pending?: { region?: string };
  /** `undefined` = not looked up; `null` = looked up, no data. */
  estimate?: PriceEstimate | null;
  /** ISO timestamp of the Property Report send, when it happened. */
  reportSentAt?: string;
}

export interface EstimateStepResult {
  state: EstimateState;
  reply: string;
  options?: ReplyOptions;
  /** The reply answered nothing; the step is unchanged. */
  rejected?: true;
}

/** "REPORT" — the Property Report button on the Quick Estimate. */
export const REPORT_RE = /^\s*report\s*$/i;

const REGION_RE = /^\s*region:([a-z]+)\s*$/i;
const OTHER_RE = /^\s*other\s*$/i;

const INTRO =
  '👋 Happy to help you see what your Cape Town home could be worth. A ' +
  '*Quick Estimate* takes three taps and comes from confirmed recent sales. ' +
  'It’s market guidance, not a formal valuation — the asking price is ' +
  'always yours.\n\nWhich part of Cape Town is the home in?';

const PROMPTS: Record<Exclude<EstimateStep, 'estimated'>, string> = {
  awaiting_suburb: 'Which part of Cape Town is the home in?',
  awaiting_suburb_pick: 'And which suburb?',
  awaiting_property_type: 'What kind of home is it?',
  awaiting_bedrooms: 'How many bedrooms?',
};

const REASKS: Record<Exclude<EstimateStep, 'estimated'>, string> = {
  awaiting_suburb: 'Please pick a region, or type the suburb.',
  awaiting_suburb_pick: 'Please pick a suburb, or type its name.',
  awaiting_property_type: 'Please pick the kind of home from the list.',
  awaiting_bedrooms: 'How many bedrooms? Please reply with a number.',
};

/** After the Quick Estimate: the report, listing, or a person. */
export const ESTIMATE_OPTIONS: ReplyOptions = {
  kind: 'buttons',
  options: [
    { id: 'REPORT', title: '📄 Property Report' },
    { id: 'START', title: 'List my property' },
    { id: 'CONSULT', title: 'Talk to our team' },
  ],
};

/** After the Property Report. */
export const REPORT_OPTIONS: ReplyOptions = {
  kind: 'buttons',
  options: [
    { id: 'START', title: 'List my property' },
    { id: 'CONSULT', title: 'Talk to our team' },
    { id: 'HOW', title: 'How it works' },
  ],
};

/** When the data partner has nothing for that suburb. */
const NO_DATA_OPTIONS: ReplyOptions = {
  kind: 'buttons',
  options: [
    { id: 'CONSULT', title: 'Free pricing chat' },
    { id: 'START', title: 'List my property' },
    { id: 'HOW', title: 'How it works' },
  ],
};

const NO_DATA_REPLY =
  'I don’t have enough confirmed recent sales for that home to give a ' +
  'reliable range yet. Our registered property practitioners can do a free, ' +
  'no-obligation pricing chat with the recent-sales data we do have — the ' +
  'asking price stays yours.';

/** The options for a step, reusing the intake pickers so the taps match. */
function optionsForStep(state: EstimateState): ReplyOptions | undefined {
  if (state.step === 'estimated') return undefined;
  const shadow: IntakeState = {
    step: state.step,
    data: {},
    pending: state.pending,
  };
  return optionsFor(state.step, shadow);
}

function ask(state: EstimateState): EstimateStepResult {
  return {
    state,
    reply: PROMPTS[state.step as Exclude<EstimateStep, 'estimated'>],
    options: optionsForStep(state),
  };
}

function reask(state: EstimateState, message?: string): EstimateStepResult {
  return {
    state,
    reply: message ?? REASKS[state.step as Exclude<EstimateStep, 'estimated'>],
    options: optionsForStep(state),
    rejected: true,
  };
}

/** The headline the estimate is about: "3-bed house in Claremont". */
export function estimateHeadline(facts: EstimateFacts): string {
  return (
    composeTitle({
      propertyType: facts.propertyType,
      suburb: facts.suburb,
      bedrooms: facts.bedrooms,
    }) ?? `home in ${facts.suburb ?? 'Cape Town'}`
  );
}

/** Begin the Quick Estimate: the intro plus the first question. */
export function startEstimate(): EstimateStepResult {
  const state: EstimateState = { step: 'awaiting_suburb', facts: {} };
  return { state, reply: INTRO, options: optionsForStep(state) };
}

/** The next unanswered question, or `estimated` once all three are in. */
function nextStep(facts: EstimateFacts): EstimateStep {
  if (facts.suburb === undefined) return 'awaiting_suburb';
  if (facts.propertyType === undefined) return 'awaiting_property_type';
  if (facts.bedrooms === undefined) return 'awaiting_bedrooms';
  return 'estimated';
}

/**
 * Advance the estimate conversation with the seller's reply (typed text or a
 * tapped option's id). Pure — the valuation lookup happens in the
 * orchestrator once the step reaches `estimated`.
 */
export function advanceEstimate(
  state: EstimateState,
  input: string,
): EstimateStepResult {
  const text = input.trim();
  const facts = { ...state.facts };

  switch (state.step) {
    case 'awaiting_suburb': {
      const region = REGION_RE.exec(text);
      if (region) {
        if (!findRegion(region[1])) return reask(state);
        return ask({
          ...state,
          step: 'awaiting_suburb_pick',
          pending: { region: region[1].toLowerCase() },
        });
      }
      if (OTHER_RE.test(text)) {
        return reask(state, 'No problem — type the suburb name.');
      }
      const suburb = validateField('suburb', text);
      if (suburb === null) return reask(state);
      facts.suburb = suburb;
      break;
    }
    case 'awaiting_suburb_pick': {
      if (/^\s*region:back\s*$/i.test(text)) {
        return ask({ ...state, step: 'awaiting_suburb', pending: undefined });
      }
      if (OTHER_RE.test(text)) {
        return reask(state, 'No problem — type the suburb name.');
      }
      const suburb = validateField('suburb', text);
      if (suburb === null) return reask(state);
      facts.suburb = suburb;
      break;
    }
    case 'awaiting_property_type': {
      const type = validateField('propertyType', text);
      if (type === null) return reask(state);
      facts.propertyType = type;
      break;
    }
    case 'awaiting_bedrooms': {
      const n = parseWholeNumber(text);
      const bedrooms = n === null ? null : validateField('bedrooms', n);
      if (bedrooms === null) return reask(state);
      facts.bedrooms = bedrooms;
      break;
    }
    case 'estimated':
      return reask(state, 'Tap one of the options above.');
  }

  const next: EstimateState = {
    step: nextStep(facts),
    facts,
    pending: undefined,
  };
  if (next.step === 'estimated') {
    // The orchestrator fills in the estimate and renders the reply.
    return { state: next, reply: '' };
  }
  return ask(next);
}

// ── Orchestrator ────────────────────────────────────────────────────────

export interface EstimateFlowDeps {
  store: EstimateStore;
  /** Null (the production default without LOOM) → the no-data reply. */
  valuation?: ValuationAdapter;
  now?: () => Date;
}

export interface EstimateReply {
  handled: boolean;
  reply?: string;
  options?: ReplyOptions;
  /** Mid-flow question or frustration — the concierge may answer first. */
  needsConcierge?: boolean;
  /**
   * The seller tapped "List my property" after an estimate: start intake
   * with these facts (and the shown estimate) so nothing is asked twice.
   */
  startIntakeWith?: { facts: EstimateFacts; estimate?: PriceEstimate | null };
}

/**
 * One inbound message through the Quick Estimate flow. `handled: false`
 * means the message is not this flow's — the dispatcher carries on.
 */
export async function handleEstimateMessage(
  deps: EstimateFlowDeps,
  message: { phone: string; text: string },
): Promise<EstimateReply> {
  const text = message.text.trim();

  if (PRICE_GUIDANCE_RE.test(text)) {
    const started = startEstimate();
    await deps.store.set(message.phone, started.state);
    return { handled: true, reply: started.reply, options: started.options };
  }

  const state = await deps.store.get(message.phone);
  if (!state) return { handled: false };

  // "List my property" at any point: hand the facts to intake.
  if (BEGIN_RE.test(text) || START_RE.test(text)) {
    await deps.store.clear(message.phone);
    return {
      handled: false,
      startIntakeWith: { facts: state.facts, estimate: state.estimate },
    };
  }

  if (state.step === 'estimated') {
    if (REPORT_RE.test(text)) {
      if (!state.estimate) {
        return {
          handled: true,
          reply: NO_DATA_REPLY,
          options: NO_DATA_OPTIONS,
        };
      }
      const now = deps.now?.() ?? new Date();
      await deps.store.set(message.phone, {
        ...state,
        reportSentAt: now.toISOString(),
      });
      return {
        handled: true,
        reply: renderPropertyReport(
          state.estimate,
          estimateHeadline(state.facts),
          now,
        ),
        options: REPORT_OPTIONS,
      };
    }
    // Anything else after the estimate (a question, HOW, CONSULT…) belongs
    // to the other flows or the concierge; the estimate stays on file.
    return { handled: false };
  }

  const result = advanceEstimate(state, text);
  if (result.rejected) {
    return {
      handled: true,
      reply: result.reply,
      options: result.options,
      ...(looksLikeAQuestion(text) || soundsStuck(text)
        ? { needsConcierge: true }
        : {}),
    };
  }

  if (result.state.step === 'estimated') {
    let estimate: PriceEstimate | null = null;
    if (deps.valuation) {
      try {
        estimate = await deps.valuation.estimate({
          suburb: result.state.facts.suburb ?? '',
          bedrooms: result.state.facts.bedrooms,
          propertyType: result.state.facts.propertyType,
        });
      } catch {
        estimate = null;
      }
    }
    const next: EstimateState = { ...result.state, estimate };
    await deps.store.set(message.phone, next);
    if (!estimate) {
      return { handled: true, reply: NO_DATA_REPLY, options: NO_DATA_OPTIONS };
    }
    return {
      handled: true,
      reply: renderQuickEstimate(estimate, estimateHeadline(next.facts)),
      options: ESTIMATE_OPTIONS,
    };
  }

  await deps.store.set(message.phone, result.state);
  return { handled: true, reply: result.reply, options: result.options };
}
