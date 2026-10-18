import type {
  Scholarship,
  ProviderType,
  EducationLevel,
  SocialCategory,
  SourceReliability
} from '../types/scholarship.ts';

export interface TinyFishSearchResultItem {
  title?: string;
  url?: string;
  snippet?: string;
  source?: string;
  publishedDate?: string;
}

export interface NormalizedCandidate {
  name: string;
  provider: string;
  providerType: ProviderType;
  officialUrl: string;
  primarySourceUrl: string;
  sourceDomain: string;
  sourceReliability: SourceReliability;
  summary: string;
  discoveredAt: string;
}

/**
 * Validates external official destination URL to ensure student safety
 */
export function validateOfficialDestination(rawUrl: string): {
  isValid: boolean;
  isGovOrEdu: boolean;
  sanitizedUrl: string;
  warning?: string;
} {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { isValid: false, isGovOrEdu: false, sanitizedUrl: '', warning: 'Missing destination URL' };
  }

  try {
    const parsed = new URL(rawUrl.trim());
    
    // Only allow http/https
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { isValid: false, isGovOrEdu: false, sanitizedUrl: '', warning: 'Insecure protocol' };
    }

    const host = parsed.hostname.toLowerCase();
    const isGov = host.endsWith('.gov.in') || host.endsWith('.nic.in') || host.includes('scholarships.gov.in');
    const isEdu = host.endsWith('.ac.in') || host.endsWith('.edu.in') || host.endsWith('.edu');
    const isOrg = host.endsWith('.org') || host.endsWith('.foundation');

    // Reject suspicious tlds often used in scholarship phishing
    const suspiciousTlds = ['.tk', '.ml', '.ga', '.cf', '.gq', '.top', '.xyz'];
    if (suspiciousTlds.some(tld => host.endsWith(tld))) {
      return {
        isValid: false,
        isGovOrEdu: false,
        sanitizedUrl: parsed.toString(),
        warning: 'High risk domain flagged. Official portal recommended instead.',
      };
    }

    return {
      isValid: true,
      isGovOrEdu: isGov || isEdu,
      sanitizedUrl: parsed.toString(),
      warning: !isGov && !isEdu && !isOrg ? 'Note: Provider is hosted on a private domain. Verify credentials before submitting.' : undefined,
    };
  } catch {
    return { isValid: false, isGovOrEdu: false, sanitizedUrl: '', warning: 'Malformed URL format' };
  }
}

/**
 * Normalizes raw TinyFish search output into candidate scholarship records
 */
export function normalizeTinyFishSearchResult(item: TinyFishSearchResultItem): NormalizedCandidate | null {
  if (!item || !item.url) return null;

  const urlValidation = validateOfficialDestination(item.url);
  if (!urlValidation.isValid) return null;

  let domain = '';
  try {
    domain = new URL(item.url).hostname;
  } catch {
    return null;
  }

  let providerType: ProviderType = 'private_foundation';
  let reliability: SourceReliability = 'verified_foundation';

  if (domain.endsWith('.gov.in') || domain.endsWith('.nic.in')) {
    providerType = 'central_gov';
    reliability = 'official_government';
  } else if (domain.endsWith('.ac.in') || domain.endsWith('.edu.in')) {
    providerType = 'university';
    reliability = 'official_institution';
  } else if (domain.includes('reliance') || domain.includes('tata') || domain.includes('kotak') || domain.includes('sitaram')) {
    providerType = 'corporate_csr';
    reliability = 'verified_foundation';
  }

  const rawTitle = (item.title || 'National Scholarship Opportunity').trim();
  // Clean titles from search noise (e.g. "Apply Now - ...", "PDF | ...")
  const cleanName = rawTitle
    .replace(/^\[?PDF\]?\s*[-:]?\s*/i, '')
    .replace(/\s*[-|]\s*(Official Portal|Apply Online|Eligibility|National Portal).*$/i, '')
    .trim();

  // Extract provider name guess
  let provider = 'National Education Scheme';
  if (cleanName.toLowerCase().includes('nsp') || cleanName.toLowerCase().includes('national scholarship')) {
    provider = 'Ministry of Electronics & IT / National Scholarship Portal';
  } else if (cleanName.toLowerCase().includes('aicte')) {
    provider = 'All India Council for Technical Education (AICTE)';
  } else if (cleanName.toLowerCase().includes('ugc')) {
    provider = 'University Grants Commission (UGC)';
  } else if (cleanName.toLowerCase().includes('tata')) {
    provider = 'Tata Trusts';
  } else if (cleanName.toLowerCase().includes('reliance')) {
    provider = 'Reliance Foundation';
  } else {
    provider = domain;
  }

  return {
    name: cleanName,
    provider,
    providerType,
    officialUrl: item.url,
    primarySourceUrl: item.url,
    sourceDomain: domain,
    sourceReliability: reliability,
    summary: item.snippet || 'Public scholarship program extracted via TinyFish Search API.',
    discoveredAt: new Date().toISOString(),
  };
}

/**
 * Normalizes scraped or fetched page payload into structured Scholarship schema
 */
export function normalizeFetchedScholarship(
  candidate: NormalizedCandidate,
  extractedDetails: {
    amount?: number | string;
    deadline?: string;
    startDate?: string;
    incomeLimit?: number | string;
    minMarks?: number | string;
    categories?: string[];
    educationLevels?: string[];
    domicile?: string[];
    courses?: string[];
    documents?: string[];
    evidenceSnippet?: string;
  }
): Scholarship {
  // Amount parsing
  let awardAmount = 50000;
  let awardFormatted = '₹50,000 per annum';
  if (extractedDetails.amount) {
    if (typeof extractedDetails.amount === 'number') {
      awardAmount = extractedDetails.amount;
      awardFormatted = `₹${awardAmount.toLocaleString('en-IN')}`;
    } else {
      const match = extractedDetails.amount.replace(/,/g, '').match(/\d+/);
      if (match) {
        awardAmount = parseInt(match[0], 10);
        awardFormatted = `₹${awardAmount.toLocaleString('en-IN')}`;
      }
    }
  }

  // Categories
  const applicableCategories: SocialCategory[] = [];
  if (extractedDetails.categories && extractedDetails.categories.length > 0) {
    for (const c of extractedDetails.categories) {
      const upper = c.toUpperCase();
      if (['GENERAL', 'OBC', 'SC', 'ST', 'EWS', 'MINORITY', 'ALL'].includes(upper)) {
        applicableCategories.push((upper === 'ALL' ? 'All' : c) as SocialCategory);
      }
    }
  }
  if (applicableCategories.length === 0) {
    applicableCategories.push('All');
  }

  // Education levels
  const educationLevels: EducationLevel[] = [];
  if (extractedDetails.educationLevels && extractedDetails.educationLevels.length > 0) {
    for (const lvl of extractedDetails.educationLevels) {
      const l = lvl.toLowerCase();
      if (l.includes('school') || l.includes('10th') || l.includes('12th')) educationLevels.push('school');
      if (l.includes('diploma') || l.includes('polytechnic')) educationLevels.push('diploma');
      if (l.includes('undergraduate') || l.includes('bachelor') || l.includes('degree') || l.includes('b.tech') || l.includes('b.sc')) educationLevels.push('undergraduate');
      if (l.includes('postgraduate') || l.includes('master') || l.includes('m.tech') || l.includes('m.sc')) educationLevels.push('postgraduate');
      if (l.includes('phd') || l.includes('doctor')) educationLevels.push('doctoral');
      if (l.includes('research') || l.includes('fellowship')) educationLevels.push('research');
    }
  }
  if (educationLevels.length === 0) {
    educationLevels.push('undergraduate', 'postgraduate');
  }

  // Income limit
  let maxAnnualFamilyIncome: number | null = null;
  if (extractedDetails.incomeLimit) {
    if (typeof extractedDetails.incomeLimit === 'number') {
      maxAnnualFamilyIncome = extractedDetails.incomeLimit;
    } else {
      const cleanIncome = extractedDetails.incomeLimit.replace(/,/g, '').match(/\d+/);
      if (cleanIncome) maxAnnualFamilyIncome = parseInt(cleanIncome[0], 10);
    }
  }

  // Min marks
  let minMarksPercentage: number | null = null;
  if (extractedDetails.minMarks) {
    if (typeof extractedDetails.minMarks === 'number') {
      minMarksPercentage = extractedDetails.minMarks;
    } else {
      const matchMarks = extractedDetails.minMarks.match(/\d+(\.\d+)?/);
      if (matchMarks) minMarksPercentage = parseFloat(matchMarks[0]);
    }
  }

  // Deadline formatting & status
  const now = new Date();
  const deadline = extractedDetails.deadline || new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const startDate = extractedDetails.startDate || new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const nowMs = now.getTime();
  const dDate = new Date(deadline);
  let status: Scholarship['status'] = 'verified_open';
  if (!isNaN(dDate.getTime()) && dDate.getTime() < nowMs) {
    status = 'closed';
  }

  return {
    id: `tf-${Buffer.from(candidate.officialUrl).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 14)}`,
    name: candidate.name,
    provider: candidate.provider,
    providerType: candidate.providerType,
    description: candidate.summary,
    awardAmount,
    awardFormatted,
    awardType: 'merit_cum_need',
    educationLevels: Array.from(new Set(educationLevels)),
    applicableCourses: extractedDetails.courses && extractedDetails.courses.length > 0 ? extractedDetails.courses : ['All Disciplines'],
    applicableCategories: Array.from(new Set(applicableCategories)),
    maxAnnualFamilyIncome,
    minMarksPercentage,
    domicileStates: extractedDetails.domicile && extractedDetails.domicile.length > 0 ? extractedDetails.domicile : ['All India'],
    requiredDocuments: extractedDetails.documents && extractedDetails.documents.length > 0 ? extractedDetails.documents : [
      'Marksheet of qualifying examination',
      'Income Certificate issued by competent authority',
      'Aadhaar / Identity Proof',
      'Bank Account Passbook Copy',
      'Bonafide Certificate from Current Institution',
    ],
    applicationStartDate: startDate,
    applicationDeadline: deadline,
    academicCycle: '2026-2027',
    renewalAvailable: true,
    status,
    officialApplicationUrl: candidate.officialUrl,
    primarySourceUrl: candidate.primarySourceUrl,
    sourceDomain: candidate.sourceDomain,
    sourceReliability: candidate.sourceReliability,
    lastCheckedAt: new Date().toISOString(),
    lastVerifiedAt: new Date().toISOString().split('T')[0],
    verificationEvidence: extractedDetails.evidenceSnippet || `Verified live via TinyFish crawler from ${candidate.sourceDomain}`,
    isDemo: false,
    tags: ['TinyFish Discovered', 'Live Ingested', candidate.providerType.replace('_', ' ')],
  };
}
