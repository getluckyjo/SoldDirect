import { describe, expect, it } from 'vitest';
import { parseDraft } from './drafter';

describe('parseDraft', () => {
  it('reads the description and the photo review from JSON', () => {
    const draft = parseDraft(
      JSON.stringify({
        description: 'A three-bedroom home in Mowbray.',
        photoReview: {
          quality: 'mixed',
          covered: ['exterior', 'living'],
          missing: ['kitchen', 'bathroom', 'living'],
          tips: [
            'The lounge photo is dark — open the curtains.',
            '',
            'x',
            'y',
            'z',
          ],
        },
      }),
    );
    expect(draft?.description).toBe('A three-bedroom home in Mowbray.');
    expect(draft?.photoReview).toEqual({
      quality: 'mixed',
      covered: ['exterior', 'living'],
      // "living" is covered, so it cannot also be missing; tips cap at three.
      missing: ['kitchen', 'bathroom'],
      tips: ['The lounge photo is dark — open the curtains.', 'x', 'y'],
    });
  });

  it('tolerates code fences and unknown review values', () => {
    const draft = parseDraft(
      '```json\n{"description":"Two bedrooms in Sea Point.","photoReview":{"quality":"great","covered":["attic"],"missing":[],"tips":"no"}}\n```',
    );
    expect(draft?.description).toBe('Two bedrooms in Sea Point.');
    expect(draft?.photoReview).toEqual({
      quality: 'mixed',
      covered: [],
      missing: [],
      tips: [],
    });
  });

  it('keeps plain prose as the description with no review', () => {
    expect(parseDraft('A sunny flat in Gardens.')).toEqual({
      description: 'A sunny flat in Gardens.',
      photoReview: null,
    });
  });

  it('returns null for empty or broken JSON output', () => {
    expect(parseDraft('')).toBeNull();
    expect(parseDraft('{"description": ""}')).toBeNull();
    expect(parseDraft('{"description": "x"')).toBeNull();
  });
});
