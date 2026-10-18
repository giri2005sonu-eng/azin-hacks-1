import type { ScholarshipStatus, SourceReliability } from '../types/scholarship.ts';

export interface DeadlineCheckResult {
  status: ScholarshipStatus;
  statusLabel: string;
  daysRemaining: number | null;
  urgency: 'critical' | 'moderate' | 'relaxed' | 'past' | 'unknown';
  formattedDeadline: string;
  evidenceNotes: string;
}

/**
 * Calculates deterministic status for a scholarship based on application window and source credibility.
 */
export function determineDeadlineStatus(
  deadlineStr: string | null | undefined,
  startDateStr?: string | null,
  sourceReliability: SourceReliability = 'official_government',
  lastVerifiedAt?: string | null
): DeadlineCheckResult {
  if (!deadlineStr || deadlineStr.trim() === '' || deadlineStr.toLowerCase() === 'unspecified') {
    return {
      status: 'verification_required',
      statusLabel: 'Verification Required',
      daysRemaining: null,
      urgency: 'unknown',
      formattedDeadline: 'Date unconfirmed in source',
      evidenceNotes: 'Published notice does not specify exact last date. Direct provider verification required.',
    };
  }

  const now = new Date();
  // Assume IST or standard day-end
  const deadlineDate = new Date(deadlineStr);
  
  if (isNaN(deadlineDate.getTime())) {
    return {
      status: 'verification_required',
      statusLabel: 'Verification Required',
      daysRemaining: null,
      urgency: 'unknown',
      formattedDeadline: deadlineStr,
      evidenceNotes: 'Deadline string could not be parsed as standard calendar date.',
    };
  }

  // End of deadline day (23:59:59.999)
  deadlineDate.setHours(23, 59, 59, 999);

  const diffMs = deadlineDate.getTime() - now.getTime();
  const daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  // Check if upcoming (start date is in future)
  if (startDateStr) {
    const startDate = new Date(startDateStr);
    if (!isNaN(startDate.getTime()) && startDate.getTime() > now.getTime()) {
      const daysUntilOpen = Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return {
        status: 'upcoming',
        statusLabel: 'Upcoming',
        daysRemaining: daysRemaining,
        urgency: 'relaxed',
        formattedDeadline: `Opens in ${daysUntilOpen} days (${startDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })})`,
        evidenceNotes: `Official application portal scheduled to activate on ${startDateStr}.`,
      };
    }
  }

  if (daysRemaining < 0) {
    return {
      status: 'closed',
      statusLabel: 'Closed',
      daysRemaining: daysRemaining,
      urgency: 'past',
      formattedDeadline: `Closed on ${deadlineDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`,
      evidenceNotes: `The published submission deadline has elapsed (${Math.abs(daysRemaining)} days ago).`,
    };
  }

  // Check source credibility: if community reported without recent verification, flag verification required
  if (sourceReliability === 'community_reported') {
    return {
      status: 'verification_required',
      statusLabel: 'Verification Required',
      daysRemaining,
      urgency: daysRemaining <= 7 ? 'critical' : 'moderate',
      formattedDeadline: `${deadlineDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} (${daysRemaining} days left)`,
      evidenceNotes: 'Reported by third-party source. Awaiting official department corroboration.',
    };
  }

  let urgency: 'critical' | 'moderate' | 'relaxed' = 'relaxed';
  if (daysRemaining <= 5) {
    urgency = 'critical';
  } else if (daysRemaining <= 15) {
    urgency = 'moderate';
  }

  return {
    status: 'verified_open',
    statusLabel: 'Verified Open',
    daysRemaining,
    urgency,
    formattedDeadline: `${deadlineDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} (${daysRemaining} days left)`,
    evidenceNotes: `Confirmed active via official portal. Verified on ${lastVerifiedAt || 'today'}.`,
  };
}

/**
 * Resolves conflicting evidence between two sources
 */
export function resolveEvidenceConflict(
  primarySource: { url: string; deadline: string; year: string; reliability: SourceReliability },
  secondarySource: { url: string; deadline: string; year: string; reliability: SourceReliability }
): {
  chosenDeadline: string;
  status: ScholarshipStatus;
  confidence: 'high' | 'medium' | 'low';
  explanation: string;
} {
  const reliabilityWeights: Record<SourceReliability, number> = {
    official_government: 4,
    official_institution: 3,
    verified_foundation: 2,
    community_reported: 1,
  };

  const primaryWeight = reliabilityWeights[primarySource.reliability] || 1;
  const secondaryWeight = reliabilityWeights[secondarySource.reliability] || 1;

  // Compare academic cycle year
  const pYear = parseInt(primarySource.year.split('-')[0] || primarySource.year, 10);
  const sYear = parseInt(secondarySource.year.split('-')[0] || secondarySource.year, 10);

  if (!isNaN(pYear) && !isNaN(sYear) && pYear !== sYear) {
    const newer = pYear > sYear ? primarySource : secondarySource;
    return {
      chosenDeadline: newer.deadline,
      status: 'verification_required',
      confidence: 'medium',
      explanation: `Sources reference differing academic cycles (${primarySource.year} vs ${secondarySource.year}). Newer cycle selected; verification advised.`,
    };
  }

  if (primaryWeight > secondaryWeight) {
    return {
      chosenDeadline: primarySource.deadline,
      status: 'verified_open',
      confidence: 'high',
      explanation: `Prioritized primary official source (${primarySource.reliability}) over secondary source.`,
    };
  }

  if (secondaryWeight > primaryWeight) {
    return {
      chosenDeadline: secondarySource.deadline,
      status: 'verified_open',
      confidence: 'high',
      explanation: `Prioritized secondary source due to higher institutional reliability (${secondarySource.reliability}).`,
    };
  }

  // Same weight but different dates
  if (primarySource.deadline !== secondarySource.deadline) {
    return {
      chosenDeadline: primarySource.deadline,
      status: 'verification_required',
      confidence: 'low',
      explanation: `Conflicting deadlines found across sources of equal weight (${primarySource.deadline} vs ${secondarySource.deadline}). Flagged for manual audit.`,
    };
  }

  return {
    chosenDeadline: primarySource.deadline,
    status: 'verified_open',
    confidence: 'high',
    explanation: 'Both independent sources agree on deadline and academic cycle.',
  };
}
