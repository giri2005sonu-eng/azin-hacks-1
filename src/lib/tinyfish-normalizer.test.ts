import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateOfficialDestination,
  normalizeTinyFishSearchResult,
  normalizeFetchedScholarship
} from './tinyfish-normalizer.ts';

test('validateOfficialDestination recognizes valid government and edu portals', () => {
  const gov = validateOfficialDestination('https://scholarships.gov.in/schemes');
  assert.equal(gov.isValid, true);
  assert.equal(gov.isGovOrEdu, true);

  const edu = validateOfficialDestination('https://iitb.ac.in/scholarships');
  assert.equal(edu.isValid, true);
  assert.equal(edu.isGovOrEdu, true);
});

test('validateOfficialDestination flags suspicious phishing domains', () => {
  const bad = validateOfficialDestination('http://free-scholarship-win.tk');
  assert.equal(bad.isValid, false);
});

test('normalizeTinyFishSearchResult transforms raw search result into structured candidate', () => {
  const raw = {
    title: 'Post-Matric Scholarship Scheme for SC Students - Official Portal',
    url: 'https://socialjustice.gov.in/schemes/post-matric-sc',
    snippet: 'Complete educational assistance for Scheduled Caste students.',
  };

  const normalized = normalizeTinyFishSearchResult(raw);
  assert.ok(normalized);
  assert.equal(normalized.providerType, 'central_gov');
  assert.equal(normalized.sourceReliability, 'official_government');
  assert.equal(normalized.officialUrl, 'https://socialjustice.gov.in/schemes/post-matric-sc');
});

test('normalizeFetchedScholarship parses amount and categories cleanly', () => {
  const candidate = {
    name: 'Pragati Scholarship Scheme for Girls',
    provider: 'AICTE',
    providerType: 'central_gov' as const,
    officialUrl: 'https://www.aicte-india.org/schemes/students-development-schemes/pragati',
    primarySourceUrl: 'https://www.aicte-india.org',
    sourceDomain: 'aicte-india.org',
    sourceReliability: 'official_government' as const,
    summary: 'Scholarship of ₹50,000 per year for technical degree girl students',
    discoveredAt: new Date().toISOString(),
  };

  const parsed = normalizeFetchedScholarship(candidate, {
    amount: '₹50,000 per annum',
    incomeLimit: '₹8,00,000',
    minMarks: '60%',
    categories: ['All'],
    educationLevels: ['undergraduate', 'diploma'],
    evidenceSnippet: 'Clause 4: Selected girl students receive ₹50,000 per annum towards tuition and incidentals.',
  });

  assert.equal(parsed.awardAmount, 50000);
  assert.equal(parsed.maxAnnualFamilyIncome, 800000);
  assert.equal(parsed.minMarksPercentage, 60);
  assert.ok(parsed.educationLevels.includes('undergraduate'));
  assert.ok(parsed.educationLevels.includes('diploma'));
});
