import { test } from 'node:test';
import assert from 'node:assert/strict';
import { opportunityStatus, isFeaturedOpportunity } from '../src/lib/opportunity-status.ts';

test('deadline stays open through the Sydney closing day and closes at midnight', () => {
  assert.equal(opportunityStatus('available', '2027-02-14', new Date('2027-02-14T12:59:59Z')), 'available');
  assert.equal(opportunityStatus('available', '2027-02-14', new Date('2027-02-14T13:00:00Z')), 'closed');
  assert.equal(opportunityStatus('available', '2026-07-14', new Date('2026-07-14T14:00:00Z')), 'closed');
});
test('expired upcoming entries are not featured; manual closure is preserved', () => {
  const now = new Date('2027-02-15T00:00:00Z');
  assert.equal(isFeaturedOpportunity('upcoming', '2027-02-14', now), false);
  assert.equal(isFeaturedOpportunity('upcoming', '2027-02-16', now), true);
  assert.equal(opportunityStatus('closed', '2027-02-16', now), 'closed');
});
test('ongoing entries and invalid dates retain manual availability', () => {
  for (const deadline of [undefined, '', 'invalid', '2027-02-30']) {
    assert.equal(opportunityStatus('available', deadline), 'available');
  }
});
