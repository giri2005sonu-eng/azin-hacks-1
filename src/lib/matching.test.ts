import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateEligibility, calculateProfileCompletion } from './matching.ts';
import type { Scholarship, StudentProfile } from '../types/scholarship.ts';

const mockScholarship: Scholarship = {
  id: 'nsp-central-sector',
  name: 'Central Sector Scheme of Scholarships for College and University Students',
  provider: 'Department of Higher Education, MoE',
  providerType: 'central_gov',
  description: 'Financial assistance to meritorious students from low-income families.',
  awardAmount: 20000,
  awardFormatted: '₹20,000 / year',
  awardType: 'merit_cum_need',
  educationLevels: ['undergraduate', 'postgraduate'],
  applicableCourses: ['All'],
  applicableCategories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
  maxAnnualFamilyIncome: 450000,
  minMarksPercentage: 80,
  domicileStates: ['All India'],
  requiredDocuments: ['Class 12 Marksheet', 'Income Certificate', 'Aadhaar Card'],
  applicationStartDate: '2026-08-01',
  applicationDeadline: '2026-12-31',
  academicCycle: '2026-2027',
  renewalAvailable: true,
  status: 'verified_open',
  officialApplicationUrl: 'https://scholarships.gov.in',
  primarySourceUrl: 'https://scholarships.gov.in',
  sourceDomain: 'scholarships.gov.in',
  sourceReliability: 'official_government',
  lastCheckedAt: '2026-10-18T00:00:00.000Z',
  lastVerifiedAt: '2026-10-18',
  verificationEvidence: 'Published on National Scholarship Portal guidelines PDF clause 3.1',
  isDemo: false,
};

const eligibleStudent: StudentProfile = {
  id: 'student-1',
  name: 'Aarav Sharma',
  email: 'aarav@example.com',
  state: 'Uttar Pradesh',
  domicileState: 'Uttar Pradesh',
  city: 'Lucknow',
  educationLevel: 'undergraduate',
  course: 'B.Tech Computer Science',
  institutionName: 'IIT Roorkee',
  institutionType: 'Government',
  currentYear: 1,
  academicYear: '2026-2027',
  previousMarksPercentage: 88,
  category: 'General',
  annualHouseholdIncome: 250000,
  gender: 'Male',
  preferredFields: ['Engineering'],
  preferredProviders: ['central_gov'],
  preferredScholarshipTypes: ['merit_cum_need'],
  notificationFrequency: 'daily',
  deadlineReminders: true,
  profileCompletedPercentage: 100,
  createdAt: '2026-10-18T00:00:00.000Z',
  updatedAt: '2026-10-18T00:00:00.000Z',
};

test('evaluateEligibility identifies fully eligible student', () => {
  const outcome = evaluateEligibility(eligibleStudent, mockScholarship);
  assert.equal(outcome.overallCategory, 'eligible');
  assert.ok(outcome.relevanceScore >= 85, 'Relevance score should be high for matching student');
  assert.equal(outcome.criteria.educationLevel.status, 'matches');
  assert.equal(outcome.criteria.income.status, 'matches');
  assert.equal(outcome.criteria.marks.status, 'matches');
  assert.equal(outcome.whatDoesNotMatch.length, 0);
  assert.ok(outcome.whatMatches.length >= 3);
});

test('evaluateEligibility flags student when income exceeds ceiling limit', () => {
  const overIncomeStudent: StudentProfile = {
    ...eligibleStudent,
    annualHouseholdIncome: 650000, // exceeds 4,50,000 ceiling
  };

  const outcome = evaluateEligibility(overIncomeStudent, mockScholarship);
  assert.equal(outcome.overallCategory, 'not_eligible');
  assert.equal(outcome.criteria.income.status, 'does_not_match');
  assert.ok(outcome.whatDoesNotMatch.some(msg => msg.includes('ceiling')));
  // Score should be strictly capped despite other criteria matching
  assert.ok(outcome.relevanceScore <= 30);
});

test('evaluateEligibility flags student when marks are below cutoff', () => {
  const lowerMarksStudent: StudentProfile = {
    ...eligibleStudent,
    previousMarksPercentage: 72, // below 80% cutoff
  };

  const outcome = evaluateEligibility(lowerMarksStudent, mockScholarship);
  assert.equal(outcome.overallCategory, 'not_eligible');
  assert.equal(outcome.criteria.marks.status, 'does_not_match');
  assert.ok(outcome.whatDoesNotMatch.some(msg => msg.includes('80%')));
});

test('evaluateEligibility returns additional_info_needed when profile is missing key fields', () => {
  const partialProfile: Partial<StudentProfile> = {
    name: 'Sonu',
    educationLevel: 'undergraduate',
  };

  const outcome = evaluateEligibility(partialProfile, mockScholarship);
  assert.ok(
    outcome.overallCategory === 'additional_info_needed' || outcome.overallCategory === 'potential_match',
    'Should flag unconfirmed fields'
  );
  assert.equal(outcome.criteria.income.status, 'needs_confirmation');
  assert.equal(outcome.criteria.marks.status, 'needs_confirmation');
  assert.ok(outcome.whatIsMissing.length > 0);
});

test('calculateProfileCompletion calculates percentage accurately', () => {
  const emptyCompletion = calculateProfileCompletion({});
  assert.equal(emptyCompletion, 0);

  const fullCompletion = calculateProfileCompletion(eligibleStudent);
  assert.equal(fullCompletion, 100);

  const halfProfile: Partial<StudentProfile> = {
    name: 'Sonu',
    email: 'sonu@example.com',
    educationLevel: 'undergraduate',
    course: 'B.Com',
    institutionName: 'Delhi University',
  };
  const halfCompletion = calculateProfileCompletion(halfProfile);
  assert.equal(halfCompletion, 50);
});
