import test from 'node:test';
import assert from 'node:assert/strict';
import { determineDeadlineStatus, resolveEvidenceConflict } from './verification.ts';

test('determineDeadlineStatus correctly marks upcoming scholarship', () => {
  const futureStart = '2030-01-01';
  const futureEnd = '2030-03-31';
  const result = determineDeadlineStatus(futureEnd, futureStart, 'official_government');
  assert.equal(result.status, 'upcoming');
  assert.equal(result.urgency, 'relaxed');
});

test('determineDeadlineStatus correctly marks closed scholarship', () => {
  const pastEnd = '2020-01-01';
  const result = determineDeadlineStatus(pastEnd, '2019-10-01', 'official_government');
  assert.equal(result.status, 'closed');
  assert.equal(result.urgency, 'past');
  assert.ok(result.daysRemaining !== null && result.daysRemaining < 0);
});

test('determineDeadlineStatus flags unconfirmed date with verification_required', () => {
  const result = determineDeadlineStatus('', undefined, 'official_government');
  assert.equal(result.status, 'verification_required');
  assert.equal(result.daysRemaining, null);
});

test('resolveEvidenceConflict gives priority to official government source', () => {
  const govSource = {
    url: 'https://scholarships.gov.in',
    deadline: '2026-11-30',
    year: '2026-2027',
    reliability: 'official_government' as const,
  };
  const blogSource = {
    url: 'https://scholarshipblog.com/post',
    deadline: '2026-10-15',
    year: '2026-2027',
    reliability: 'community_reported' as const,
  };

  const resolution = resolveEvidenceConflict(govSource, blogSource);
  assert.equal(resolution.chosenDeadline, '2026-11-30');
  assert.equal(resolution.confidence, 'high');
  assert.equal(resolution.status, 'verified_open');
});
