export type ProviderType = 
  | 'central_gov' 
  | 'state_gov' 
  | 'university' 
  | 'private_foundation' 
  | 'ngo' 
  | 'corporate_csr';

export type EducationLevel = 
  | 'school' 
  | 'diploma' 
  | 'undergraduate' 
  | 'postgraduate' 
  | 'doctoral' 
  | 'research';

export type SocialCategory = 
  | 'General' 
  | 'OBC' 
  | 'SC' 
  | 'ST' 
  | 'EWS' 
  | 'Minority' 
  | 'All';

export type ScholarshipStatus = 
  | 'verified_open' 
  | 'upcoming' 
  | 'closed' 
  | 'verification_required';

export type SourceReliability = 
  | 'official_government' 
  | 'official_institution' 
  | 'verified_foundation' 
  | 'community_reported';

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  providerType: ProviderType;
  description: string;
  awardAmount: number; // in INR
  awardFormatted: string; // e.g. "₹50,000 per annum"
  awardType: 'merit' | 'need' | 'merit_cum_need' | 'fellowship';
  educationLevels: EducationLevel[];
  applicableCourses: string[]; // ["Engineering", "Medicine", "Arts", "Science", "Commerce", "Law", "All"]
  applicableCategories: SocialCategory[];
  genderRestriction?: 'female_only' | 'male_only' | 'all';
  maxAnnualFamilyIncome: number | null; // in INR; null if no limit
  minMarksPercentage: number | null; // e.g. 60 or 75
  minCGPA?: number | null;
  domicileStates: string[]; // e.g. ["All India"] or ["Maharashtra", "Bihar"]
  ageLimitMax?: number | null;
  requiredDocuments: string[];
  applicationStartDate: string; // ISO date string "YYYY-MM-DD"
  applicationDeadline: string; // ISO date string "YYYY-MM-DD"
  academicCycle: string; // "2026-2027"
  renewalAvailable: boolean;
  status: ScholarshipStatus;
  officialApplicationUrl: string;
  primarySourceUrl: string;
  sourceDomain: string;
  sourceReliability: SourceReliability;
  lastCheckedAt: string;
  lastVerifiedAt: string;
  verificationEvidence: string;
  isDemo: boolean;
  tags?: string[];
}

export interface StudentProfile {
  id: string;
  name: string;
  email: string;
  state: string;
  domicileState: string;
  city: string;
  educationLevel: EducationLevel;
  course: string;
  specialization?: string;
  institutionName: string;
  institutionType: 'Government' | 'Private' | 'Aided' | 'Autonomous';
  currentYear: number;
  academicYear: string;
  previousMarksPercentage: number;
  cgpa?: number;
  category: SocialCategory;
  annualHouseholdIncome: number; // in INR
  gender: 'Male' | 'Female' | 'Other';
  preferredFields: string[];
  preferredProviders: ProviderType[];
  preferredScholarshipTypes: string[];
  notificationFrequency: 'instant' | 'daily' | 'weekly';
  deadlineReminders: boolean;
  profileCompletedPercentage: number;
  createdAt: string;
  updatedAt: string;
}

export type CriterionMatchStatus = 'matches' | 'does_not_match' | 'needs_confirmation' | 'not_applicable';

export interface CriterionDetail {
  status: CriterionMatchStatus;
  title: string;
  reason: string;
  evidence?: string;
  isMandatory: boolean;
}

export interface EligibilityOutcome {
  scholarshipId: string;
  overallCategory: 'eligible' | 'potential_match' | 'additional_info_needed' | 'not_eligible';
  relevanceScore: number; // 0 to 100
  scoringFormula: string;
  criteria: {
    educationLevel: CriterionDetail;
    course: CriterionDetail;
    domicile: CriterionDetail;
    category: CriterionDetail;
    income: CriterionDetail;
    marks: CriterionDetail;
    gender: CriterionDetail;
  };
  whatMatches: string[];
  whatDoesNotMatch: string[];
  whatIsMissing: string[];
  nextSteps: string[];
  disclaimer: string;
}

export type ApplicationStatus = 
  | 'interested' 
  | 'not_started' 
  | 'preparing_documents' 
  | 'ready_to_apply' 
  | 'submitted' 
  | 'under_review' 
  | 'awarded' 
  | 'rejected' 
  | 'withdrawn';

export interface ApplicationTrackerItem {
  id: string;
  userId: string;
  scholarshipId: string;
  scholarshipName: string;
  provider: string;
  deadline: string;
  awardFormatted: string;
  officialUrl: string;
  status: ApplicationStatus;
  notes: string;
  applicationReference?: string;
  startedAt?: string;
  submittedAt?: string;
  reminderDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type DocumentType = 
  | 'marksheets' 
  | 'income_certificate' 
  | 'domicile_certificate' 
  | 'caste_category_certificate' 
  | 'bonafide_certificate' 
  | 'disability_certificate' 
  | 'other';

export interface UserDocument {
  id: string;
  userId: string;
  title: string;
  docType: DocumentType;
  fileName: string;
  fileSize: number; // in bytes
  mimeType: string;
  uploadedAt: string;
  consentGiven: boolean;
  verifiedMetadata?: {
    issueYear?: number;
    issuerAuthority?: string;
    validUntil?: string;
    notes?: string;
  };
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'match' | 'deadline' | 'verification' | 'system';
  title: string;
  message: string;
  scholarshipId?: string;
  read: boolean;
  timestamp: string;
  actionUrl?: string;
}

export interface IngestionRun {
  id: string;
  query: string;
  startedAt: string;
  completedAt: string;
  candidatesFound: number;
  successfullyFetched: number;
  recordsAdded: number;
  recordsUpdated: number;
  recordsSkipped: number;
  failedExtractions: number;
  status: 'success' | 'partial' | 'failed';
  errors: string[];
  trigger: 'manual_admin' | 'scheduled_job' | 'user_query';
}

export interface UserReport {
  id: string;
  scholarshipId: string;
  scholarshipName: string;
  issueType: 'expired_deadline' | 'wrong_eligibility' | 'broken_link' | 'wrong_amount' | 'other';
  description: string;
  reportedAt: string;
  resolved: boolean;
  userEmail?: string;
}
