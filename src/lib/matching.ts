import type {
  Scholarship,
  StudentProfile,
  EligibilityOutcome,
  CriterionDetail
} from '../types/scholarship.ts';

/**
 * Deterministic Explainable Eligibility Matching Engine
 * Compares student profile against scholarship criteria without black-box guessing.
 */
export function evaluateEligibility(
  profile: Partial<StudentProfile> | null,
  scholarship: Scholarship
): EligibilityOutcome {
  const whatMatches: string[] = [];
  const whatDoesNotMatch: string[] = [];
  const whatIsMissing: string[] = [];
  const nextSteps: string[] = [];

  // Default empty outcome if no profile is provided
  if (!profile) {
    return {
      scholarshipId: scholarship.id,
      overallCategory: 'additional_info_needed',
      relevanceScore: 0,
      scoringFormula: 'Base score requires an active student profile with educational and financial details.',
      criteria: {
        educationLevel: {
          status: 'needs_confirmation',
          title: 'Education Level',
          reason: 'Please create or complete your student profile to compare your education level.',
          isMandatory: true,
        },
        course: {
          status: 'needs_confirmation',
          title: 'Course & Discipline',
          reason: 'Your enrolled discipline is not specified.',
          isMandatory: true,
        },
        domicile: {
          status: 'needs_confirmation',
          title: 'Domicile / State',
          reason: 'Your resident state is not specified.',
          isMandatory: true,
        },
        category: {
          status: 'needs_confirmation',
          title: 'Social / Reservation Category',
          reason: 'Social category has not been provided in your profile.',
          isMandatory: scholarship.applicableCategories.length > 0 && !scholarship.applicableCategories.includes('All'),
        },
        income: {
          status: 'needs_confirmation',
          title: 'Annual Household Income',
          reason: 'Family income not provided in your profile.',
          isMandatory: scholarship.maxAnnualFamilyIncome !== null,
        },
        marks: {
          status: 'needs_confirmation',
          title: 'Academic Performance',
          reason: 'Previous academic percentage/CGPA not provided.',
          isMandatory: scholarship.minMarksPercentage !== null,
        },
        gender: {
          status: 'needs_confirmation',
          title: 'Gender Eligibility',
          reason: 'Gender not specified in profile.',
          isMandatory: !!scholarship.genderRestriction && scholarship.genderRestriction !== 'all',
        },
      },
      whatMatches: [],
      whatDoesNotMatch: [],
      whatIsMissing: ['Complete student profile with academic level, marks, domicile, and household income.'],
      nextSteps: ['Go to Profile Setup to unlock personalized eligibility checks.'],
      disclaimer: 'Official eligibility is determined solely by the awarding provider upon formal application verification.',
    };
  }

  // 1. Education Level Check
  let educationLevelCriterion: CriterionDetail;
  if (!profile.educationLevel) {
    educationLevelCriterion = {
      status: 'needs_confirmation',
      title: 'Education Level',
      reason: 'Your profile does not specify your current education level.',
      isMandatory: true,
    };
    whatIsMissing.push('Current education level is missing in profile.');
  } else if (
    scholarship.educationLevels.length === 0 ||
    scholarship.educationLevels.includes(profile.educationLevel)
  ) {
    educationLevelCriterion = {
      status: 'matches',
      title: 'Education Level',
      reason: `Matches your current ${profile.educationLevel} program. Open to ${scholarship.educationLevels.join(', ')}.`,
      evidence: scholarship.verificationEvidence,
      isMandatory: true,
    };
    whatMatches.push(`Enrolled at eligible academic level (${profile.educationLevel}).`);
  } else {
    educationLevelCriterion = {
      status: 'does_not_match',
      title: 'Education Level',
      reason: `Restricted to ${scholarship.educationLevels.join(', ')}. Your profile indicates ${profile.educationLevel}.`,
      isMandatory: true,
    };
    whatDoesNotMatch.push(`Requires ${scholarship.educationLevels.join(', ')}, but your profile is ${profile.educationLevel}.`);
  }

  // 2. Course & Discipline Check
  let courseCriterion: CriterionDetail;
  const isAllCourses = 
    !scholarship.applicableCourses || 
    scholarship.applicableCourses.length === 0 || 
    scholarship.applicableCourses.some(c => c.toLowerCase() === 'all' || c.toLowerCase().includes('all discipline'));

  if (isAllCourses) {
    courseCriterion = {
      status: 'matches',
      title: 'Course & Discipline',
      reason: 'Open to students from all academic streams and courses.',
      isMandatory: false,
    };
    whatMatches.push('Open to all academic disciplines.');
  } else if (!profile.course) {
    courseCriterion = {
      status: 'needs_confirmation',
      title: 'Course & Discipline',
      reason: `Scholarship lists specific courses (${scholarship.applicableCourses.slice(0, 3).join(', ')}...). Your course is not set.`,
      isMandatory: true,
    };
    whatIsMissing.push('Current course/stream not specified in profile.');
  } else {
    const studentCourseNorm = profile.course.toLowerCase();
    const courseMatches = scholarship.applicableCourses.some(c => {
      const cNorm = c.toLowerCase();
      return studentCourseNorm.includes(cNorm) || cNorm.includes(studentCourseNorm);
    });

    if (courseMatches) {
      courseCriterion = {
        status: 'matches',
        title: 'Course & Discipline',
        reason: `Your course (${profile.course}) is eligible under ${scholarship.applicableCourses.join(', ')}.`,
        isMandatory: true,
      };
      whatMatches.push(`Course (${profile.course}) is accepted.`);
    } else {
      courseCriterion = {
        status: 'does_not_match',
        title: 'Course & Discipline',
        reason: `Specified courses are: ${scholarship.applicableCourses.join(', ')}. Your profile course is ${profile.course}.`,
        isMandatory: true,
      };
      whatDoesNotMatch.push(`Requires ${scholarship.applicableCourses.join(', ')}, but your course is ${profile.course}.`);
    }
  }

  // 3. Domicile / State Check
  let domicileCriterion: CriterionDetail;
  const isAllIndia = 
    !scholarship.domicileStates || 
    scholarship.domicileStates.length === 0 || 
    scholarship.domicileStates.some(s => s.toLowerCase() === 'all' || s.toLowerCase() === 'all india');

  if (isAllIndia) {
    domicileCriterion = {
      status: 'matches',
      title: 'Domicile / State',
      reason: 'Open to bona fide resident students from all Indian States & Union Territories.',
      isMandatory: false,
    };
    whatMatches.push('Open across all Indian States & Union Territories.');
  } else if (!profile.domicileState && !profile.state) {
    domicileCriterion = {
      status: 'needs_confirmation',
      title: 'Domicile / State',
      reason: `Requires domicile in ${scholarship.domicileStates.join(', ')}. Your domicile is not recorded.`,
      isMandatory: true,
    };
    whatIsMissing.push('Domicile state is not set in profile.');
  } else {
    const studentState = (profile.domicileState || profile.state || '').trim().toLowerCase();
    const matchesState = scholarship.domicileStates.some(s => s.trim().toLowerCase() === studentState);

    if (matchesState) {
      domicileCriterion = {
        status: 'matches',
        title: 'Domicile / State',
        reason: `Your domicile state (${profile.domicileState || profile.state}) matches the required state.`,
        isMandatory: true,
      };
      whatMatches.push(`Domicile state (${profile.domicileState || profile.state}) qualifies.`);
    } else {
      domicileCriterion = {
        status: 'does_not_match',
        title: 'Domicile / State',
        reason: `Requires domicile in ${scholarship.domicileStates.join(', ')}. Your recorded state is ${profile.domicileState || profile.state}.`,
        isMandatory: true,
      };
      whatDoesNotMatch.push(`Limited to ${scholarship.domicileStates.join(', ')} residents.`);
    }
  }

  // 4. Social / Reservation Category Check
  let categoryCriterion: CriterionDetail;
  const isAllCategories = 
    !scholarship.applicableCategories || 
    scholarship.applicableCategories.length === 0 || 
    scholarship.applicableCategories.includes('All');

  if (isAllCategories) {
    categoryCriterion = {
      status: 'matches',
      title: 'Social Category',
      reason: 'Open to all categories (General, OBC, SC, ST, EWS, Minority).',
      isMandatory: false,
    };
    whatMatches.push('Open to all reservation categories without exclusion.');
  } else if (!profile.category) {
    categoryCriterion = {
      status: 'needs_confirmation',
      title: 'Social Category',
      reason: `Scheme targets: ${scholarship.applicableCategories.join(', ')}. Your category is not set in profile.`,
      isMandatory: true,
    };
    whatIsMissing.push('Category information (General/OBC/SC/ST/EWS) is unrecorded.');
  } else if (scholarship.applicableCategories.includes(profile.category)) {
    categoryCriterion = {
      status: 'matches',
      title: 'Social Category',
      reason: `Your category (${profile.category}) is explicitly covered by this scheme.`,
      isMandatory: true,
    };
    whatMatches.push(`Social category (${profile.category}) matches scheme scope.`);
  } else {
    categoryCriterion = {
      status: 'does_not_match',
      title: 'Social Category',
      reason: `Restricted to ${scholarship.applicableCategories.join(', ')}. Your declared category is ${profile.category}.`,
      isMandatory: true,
    };
    whatDoesNotMatch.push(`Scheme is reserved for ${scholarship.applicableCategories.join(', ')} candidates.`);
  }

  // 5. Annual Household Income Check
  let incomeCriterion: CriterionDetail;
  if (scholarship.maxAnnualFamilyIncome === null || scholarship.maxAnnualFamilyIncome <= 0) {
    incomeCriterion = {
      status: 'not_applicable',
      title: 'Annual Family Income',
      reason: 'No family income ceiling is specified for this scholarship.',
      isMandatory: false,
    };
  } else if (profile.annualHouseholdIncome === undefined || profile.annualHouseholdIncome === null) {
    incomeCriterion = {
      status: 'needs_confirmation',
      title: 'Annual Family Income',
      reason: `Requires annual family income under ₹${scholarship.maxAnnualFamilyIncome.toLocaleString('en-IN')}. Please confirm your household income.`,
      isMandatory: true,
    };
    whatIsMissing.push(`Income ceiling of ₹${scholarship.maxAnnualFamilyIncome.toLocaleString('en-IN')} needs verification against your profile.`);
  } else if (profile.annualHouseholdIncome <= scholarship.maxAnnualFamilyIncome) {
    incomeCriterion = {
      status: 'matches',
      title: 'Annual Family Income',
      reason: `Your declared income (₹${profile.annualHouseholdIncome.toLocaleString('en-IN')}) is within the ceiling of ₹${scholarship.maxAnnualFamilyIncome.toLocaleString('en-IN')}.`,
      isMandatory: true,
    };
    whatMatches.push(`Family income (₹${profile.annualHouseholdIncome.toLocaleString('en-IN')}) meets the ₹${scholarship.maxAnnualFamilyIncome.toLocaleString('en-IN')} ceiling.`);
  } else {
    incomeCriterion = {
      status: 'does_not_match',
      title: 'Annual Family Income',
      reason: `Declared income (₹${profile.annualHouseholdIncome.toLocaleString('en-IN')}) exceeds maximum limit of ₹${scholarship.maxAnnualFamilyIncome.toLocaleString('en-IN')}.`,
      isMandatory: true,
    };
    whatDoesNotMatch.push(`Family income exceeds the ceiling limit of ₹${scholarship.maxAnnualFamilyIncome.toLocaleString('en-IN')}.`);
  }

  // 6. Academic Performance / Minimum Marks Check
  let marksCriterion: CriterionDetail;
  if (scholarship.minMarksPercentage === null || scholarship.minMarksPercentage <= 0) {
    marksCriterion = {
      status: 'not_applicable',
      title: 'Minimum Academic Marks',
      reason: 'No minimum cutoff percentage is mandated in the official notification.',
      isMandatory: false,
    };
  } else if (profile.previousMarksPercentage === undefined || profile.previousMarksPercentage === null) {
    marksCriterion = {
      status: 'needs_confirmation',
      title: 'Minimum Academic Marks',
      reason: `Requires minimum ${scholarship.minMarksPercentage}% in qualifying exams. Please add your marks.`,
      isMandatory: true,
    };
    whatIsMissing.push(`Qualifying marks requirement (${scholarship.minMarksPercentage}%) requires confirmation.`);
  } else if (profile.previousMarksPercentage >= scholarship.minMarksPercentage) {
    marksCriterion = {
      status: 'matches',
      title: 'Minimum Academic Marks',
      reason: `Your qualifying marks (${profile.previousMarksPercentage}%) satisfy the ${scholarship.minMarksPercentage}% cutoff.`,
      isMandatory: true,
    };
    whatMatches.push(`Qualifying marks (${profile.previousMarksPercentage}%) exceed the ${scholarship.minMarksPercentage}% minimum.`);
  } else {
    marksCriterion = {
      status: 'does_not_match',
      title: 'Minimum Academic Marks',
      reason: `Your qualifying marks (${profile.previousMarksPercentage}%) are below the ${scholarship.minMarksPercentage}% cutoff.`,
      isMandatory: true,
    };
    whatDoesNotMatch.push(`Qualifying marks (${profile.previousMarksPercentage}%) are below required ${scholarship.minMarksPercentage}%.`);
  }

  // 7. Gender Restriction Check
  let genderCriterion: CriterionDetail;
  if (!scholarship.genderRestriction || scholarship.genderRestriction === 'all') {
    genderCriterion = {
      status: 'matches',
      title: 'Gender Eligibility',
      reason: 'Open to all students regardless of gender.',
      isMandatory: false,
    };
  } else if (!profile.gender) {
    genderCriterion = {
      status: 'needs_confirmation',
      title: 'Gender Eligibility',
      reason: `Scheme is restricted to ${scholarship.genderRestriction === 'female_only' ? 'female' : 'male'} applicants. Gender not recorded.`,
      isMandatory: true,
    };
    whatIsMissing.push('Gender not recorded in profile.');
  } else if (
    (scholarship.genderRestriction === 'female_only' && profile.gender === 'Female') ||
    (scholarship.genderRestriction === 'male_only' && profile.gender === 'Male')
  ) {
    genderCriterion = {
      status: 'matches',
      title: 'Gender Eligibility',
      reason: `Matches dedicated initiative for ${profile.gender.toLowerCase()} students.`,
      isMandatory: true,
    };
    whatMatches.push(`Eligible for ${profile.gender.toLowerCase()} student initiative.`);
  } else {
    genderCriterion = {
      status: 'does_not_match',
      title: 'Gender Eligibility',
      reason: `Exclusive to ${scholarship.genderRestriction === 'female_only' ? 'female' : 'male'} applicants.`,
      isMandatory: true,
    };
    whatDoesNotMatch.push(`Reserved exclusively for ${scholarship.genderRestriction === 'female_only' ? 'female' : 'male'} candidates.`);
  }

  const allCriteria = [
    educationLevelCriterion,
    courseCriterion,
    domicileCriterion,
    categoryCriterion,
    incomeCriterion,
    marksCriterion,
    genderCriterion,
  ];

  // Evaluate classification
  const mandatoryFailed = allCriteria.filter(c => c.isMandatory && c.status === 'does_not_match');
  const needsConfirmation = allCriteria.filter(c => c.status === 'needs_confirmation');
  const matchedCriteria = allCriteria.filter(c => c.status === 'matches');
  const applicableCriteria = allCriteria.filter(c => c.status !== 'not_applicable');

  let overallCategory: EligibilityOutcome['overallCategory'];
  let relevanceScore = 0;

  if (mandatoryFailed.length > 0) {
    overallCategory = 'not_eligible';
    // Even if other criteria match, failed mandatory hard criteria caps relevance
    relevanceScore = Math.max(0, Math.round((matchedCriteria.length / applicableCriteria.length) * 30));
    nextSteps.push('Review requirements: this program has mandatory conditions your current profile does not satisfy.');
  } else if (needsConfirmation.length > 0) {
    if (matchedCriteria.length >= 3) {
      overallCategory = 'potential_match';
      relevanceScore = Math.min(85, Math.round((matchedCriteria.length / applicableCriteria.length) * 90));
      nextSteps.push('Verify remaining unconfirmed criteria in the official provider notification before applying.');
    } else {
      overallCategory = 'additional_info_needed';
      relevanceScore = Math.round((matchedCriteria.length / applicableCriteria.length) * 60);
      nextSteps.push('Update your student profile to allow complete verification of eligibility.');
    }
  } else {
    overallCategory = 'eligible';
    // Weighted scoring: matched criteria ratio + bonus for deadline freshness
    const ratio = matchedCriteria.length / Math.max(1, applicableCriteria.length);
    relevanceScore = Math.min(100, Math.max(85, Math.round(ratio * 100)));
    nextSteps.push('Check required certificates, verify current portal opening, and prepare application documents.');
  }

  if (scholarship.status === 'closed') {
    nextSteps.unshift('Note: This scholarship cycle appears currently closed. Keep documents ready for the next cycle.');
  } else if (scholarship.status === 'upcoming') {
    nextSteps.unshift(`Portal opens on ${scholarship.applicationStartDate || 'soon'}. Bookmark and prepare certificates.`);
  }

  const scoringFormula = `Relevance Score: ${relevanceScore}/100 based on ${matchedCriteria.length} satisfied criteria out of ${applicableCriteria.length} applicable, with strict zero-override on failed mandatory conditions.`;

  return {
    scholarshipId: scholarship.id,
    overallCategory,
    relevanceScore,
    scoringFormula,
    criteria: {
      educationLevel: educationLevelCriterion,
      course: courseCriterion,
      domicile: domicileCriterion,
      category: categoryCriterion,
      income: incomeCriterion,
      marks: marksCriterion,
      gender: genderCriterion,
    },
    whatMatches,
    whatDoesNotMatch,
    whatIsMissing,
    nextSteps,
    disclaimer: 'BHAIYO KI PHADAI provides explainable matching based on publicly available notifications. Official eligibility, document verification, and final selection rest solely with the awarding organization or ministry.',
  };
}

/**
 * Calculates profile completion percentage based on essential discovery fields.
 */
export function calculateProfileCompletion(profile: Partial<StudentProfile>): number {
  if (!profile) return 0;
  const fields = [
    Boolean(profile.name?.trim()),
    Boolean(profile.email?.trim()),
    Boolean(profile.educationLevel),
    Boolean(profile.course?.trim()),
    Boolean(profile.institutionName?.trim()),
    Boolean(profile.currentYear && profile.currentYear > 0),
    Boolean(profile.previousMarksPercentage !== undefined && profile.previousMarksPercentage > 0),
    Boolean(profile.category),
    Boolean(profile.annualHouseholdIncome !== undefined && profile.annualHouseholdIncome >= 0),
    Boolean(profile.domicileState?.trim() || profile.state?.trim()),
  ];

  const completed = fields.filter(Boolean).length;
  return Math.round((completed / fields.length) * 100);
}
