import type {
  Scholarship,
  StudentProfile,
  ApplicationTrackerItem,
  UserDocument,
  NotificationItem,
  IngestionRun,
  UserReport
} from '../src/types/scholarship.ts';

// Initial realistic Indian scholarships catalog
const INITIAL_SCHOLARSHIPS: Scholarship[] = [
  {
    id: 'nsp-csss-2026',
    name: 'Central Sector Scheme of Scholarships for College and University Students (PM-USP)',
    provider: 'Department of Higher Education, Ministry of Education, Govt. of India',
    providerType: 'central_gov',
    description: 'Provides financial support to meritorious students from economically weaker sections for day-to-day college and university degree expenses.',
    awardAmount: 20000,
    awardFormatted: '₹12,000/yr (UG) & ₹20,000/yr (PG)',
    awardType: 'merit_cum_need',
    educationLevels: ['undergraduate', 'postgraduate'],
    applicableCourses: ['All Regular Degree Programs (Engineering, Medicine, Arts, Science, Commerce, Law)'],
    applicableCategories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
    genderRestriction: 'all',
    maxAnnualFamilyIncome: 450000,
    minMarksPercentage: 80,
    domicileStates: ['All India'],
    requiredDocuments: [
      'Class 12th Board Marksheet with 80th percentile',
      'Income Certificate issued by Revenue Authority',
      'Aadhaar seeded bank account passbook copy',
      'College Bonafide Certificate and Fee Receipt'
    ],
    applicationStartDate: '2026-07-15',
    applicationDeadline: '2026-11-30',
    academicCycle: '2026-2027',
    renewalAvailable: true,
    status: 'verified_open',
    officialApplicationUrl: 'https://scholarships.gov.in',
    primarySourceUrl: 'https://scholarships.gov.in/public/schemeGuidelines/CSSS_Guidelines.pdf',
    sourceDomain: 'scholarships.gov.in',
    sourceReliability: 'official_government',
    lastCheckedAt: '2026-10-18T04:00:00.000Z',
    lastVerifiedAt: '2026-10-18',
    verificationEvidence: 'National Scholarship Portal 2026-27 active circular verified under Department of Higher Education.',
    isDemo: false,
    tags: ['NSP', 'Government', 'Merit-cum-Means', 'All India']
  },
  {
    id: 'aicte-pragati-2026',
    name: 'AICTE Pragati Scholarship Scheme for Girl Students',
    provider: 'All India Council for Technical Education (AICTE)',
    providerType: 'central_gov',
    description: 'Empowers girl students admitted into technical degree and diploma programs at AICTE-approved institutions with financial grants.',
    awardAmount: 50000,
    awardFormatted: '₹50,000 per annum',
    awardType: 'merit_cum_need',
    educationLevels: ['undergraduate', 'diploma'],
    applicableCourses: ['Engineering', 'Technology', 'Architecture', 'Pharmacy', 'Applied Arts'],
    applicableCategories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
    genderRestriction: 'female_only',
    maxAnnualFamilyIncome: 800000,
    minMarksPercentage: 60,
    domicileStates: ['All India'],
    requiredDocuments: [
      'Allotment letter for admission to 1st year degree/diploma',
      'Annual Family Income Certificate (< ₹8 Lakhs)',
      'Class 10th and 12th marksheet',
      'Parental declaration of max 2 girl children per family',
      'Tuition Fee receipt from AICTE approved institute'
    ],
    applicationStartDate: '2026-08-01',
    applicationDeadline: '2026-12-15',
    academicCycle: '2026-2027',
    renewalAvailable: true,
    status: 'verified_open',
    officialApplicationUrl: 'https://scholarships.gov.in',
    primarySourceUrl: 'https://www.aicte-india.org/schemes/students-development-schemes/pragati',
    sourceDomain: 'aicte-india.org',
    sourceReliability: 'official_government',
    lastCheckedAt: '2026-10-18T04:00:00.000Z',
    lastVerifiedAt: '2026-10-18',
    verificationEvidence: 'Verified against AICTE Scheme guidelines 2026-27 and NSP portal central notification.',
    isDemo: false,
    tags: ['AICTE', 'Girls In STEM', 'Engineering', 'NSP']
  },
  {
    id: 'post-matric-sc-2026',
    name: 'Centrally Sponsored Post-Matric Scholarship for SC Students',
    provider: 'Ministry of Social Justice and Empowerment, Govt. of India',
    providerType: 'central_gov',
    description: 'Comprehensive financial assistance covering compulsory non-refundable fees and academic allowance for Scheduled Caste students pursuing post-matriculation studies.',
    awardAmount: 120000,
    awardFormatted: 'Full Tuition Fee + up to ₹13,500/yr Academic Allowance',
    awardType: 'need',
    educationLevels: ['diploma', 'undergraduate', 'postgraduate', 'doctoral'],
    applicableCourses: ['All recognized Post-Matriculation Courses'],
    applicableCategories: ['SC'],
    genderRestriction: 'all',
    maxAnnualFamilyIncome: 250000,
    minMarksPercentage: 50,
    domicileStates: ['All India'],
    requiredDocuments: [
      'Caste Certificate issued by designated Revenue Authority',
      'Income Certificate issued by competent authority',
      'Previous examination Marksheet',
      'Valid Bank Account details mapped with Aadhaar',
      'Institute Fee structure and Bonafide letter'
    ],
    applicationStartDate: '2026-07-01',
    applicationDeadline: '2026-12-31',
    academicCycle: '2026-2027',
    renewalAvailable: true,
    status: 'verified_open',
    officialApplicationUrl: 'https://scholarships.gov.in',
    primarySourceUrl: 'https://socialjustice.gov.in/schemes/post-matric-sc',
    sourceDomain: 'socialjustice.gov.in',
    sourceReliability: 'official_government',
    lastCheckedAt: '2026-10-18T04:00:00.000Z',
    lastVerifiedAt: '2026-10-18',
    verificationEvidence: 'Direct DBT post-matric portal notice and state welfare department synchronization record.',
    isDemo: false,
    tags: ['SC Welfare', 'Central Govt', 'DBT', 'Full Tuition Support']
  },
  {
    id: 'reliance-ug-2026',
    name: 'Reliance Foundation Undergraduate Scholarship',
    provider: 'Reliance Foundation',
    providerType: 'corporate_csr',
    description: 'Prestigious scholarship supporting first-year undergraduate students in any stream with leadership training, mentorship, and financial grants.',
    awardAmount: 200000,
    awardFormatted: 'Up to ₹2,00,000 over course duration',
    awardType: 'merit_cum_need',
    educationLevels: ['undergraduate'],
    applicableCourses: ['All First-Year Regular Degree Streams'],
    applicableCategories: ['General', 'OBC', 'SC', 'ST', 'EWS', 'Minority'],
    genderRestriction: 'all',
    maxAnnualFamilyIncome: 1500000,
    minMarksPercentage: 60,
    domicileStates: ['All India'],
    requiredDocuments: [
      'Class 12th Board Marks (Minimum 60%)',
      'Proof of admission to 1st year of full-time undergraduate degree',
      'Household Income Proof (Income Tax Return or Salary Slips or Tehsildar certificate)',
      'Government Photo ID Proof',
      'Aptitude Test Score (Online computer-based test)'
    ],
    applicationStartDate: '2026-08-15',
    applicationDeadline: '2026-10-31',
    academicCycle: '2026-2027',
    renewalAvailable: true,
    status: 'verified_open',
    officialApplicationUrl: 'https://www.scholarships.reliancefoundation.org',
    primarySourceUrl: 'https://www.reliancefoundation.org/our-work/education/scholarships',
    sourceDomain: 'reliancefoundation.org',
    sourceReliability: 'verified_foundation',
    lastCheckedAt: '2026-10-18T04:00:00.000Z',
    lastVerifiedAt: '2026-10-18',
    verificationEvidence: 'Verified on Reliance Foundation official scholarship portal application guidelines FAQ 2026.',
    isDemo: false,
    tags: ['CSR', 'Undergraduate', 'Mentorship', 'Reliance']
  },
  {
    id: 'tata-pankh-2026',
    name: 'Tata Capital Pankh Scholarship Programme',
    provider: 'Tata Capital Ltd. & Tata Trusts',
    providerType: 'corporate_csr',
    description: 'Empowers students from economically vulnerable sections pursuing higher education, covering academic fees and learning resources.',
    awardAmount: 50000,
    awardFormatted: 'Up to ₹50,000 or 80% of course fee',
    awardType: 'need',
    educationLevels: ['school', 'diploma', 'undergraduate'],
    applicableCourses: ['General Graduation', 'Professional Courses', 'Class 11 & 12', 'Polytechnic'],
    applicableCategories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
    genderRestriction: 'all',
    maxAnnualFamilyIncome: 250000,
    minMarksPercentage: 60,
    domicileStates: ['All India'],
    requiredDocuments: [
      'Photo identity proof (Aadhaar Card)',
      'Passport size photograph',
      'Income proof (Form 16A/Income certificate from government authority)',
      'Proof of admission (college ID card/admission letter)',
      'Current academic year fee receipt',
      'Bank account details of applicant'
    ],
    applicationStartDate: '2026-09-01',
    applicationDeadline: '2026-11-15',
    academicCycle: '2026-2027',
    renewalAvailable: false,
    status: 'verified_open',
    officialApplicationUrl: 'https://www.tatacapital.com/sustainability/csr/pankh-scholarship.html',
    primarySourceUrl: 'https://www.tatacapital.com',
    sourceDomain: 'tatacapital.com',
    sourceReliability: 'verified_foundation',
    lastCheckedAt: '2026-10-18T04:00:00.000Z',
    lastVerifiedAt: '2026-10-18',
    verificationEvidence: 'Tata Capital CSR committee official portal release and criteria listing.',
    isDemo: false,
    tags: ['Tata', 'Need Based', 'School & College']
  },
  {
    id: 'kotak-kanya-2026',
    name: 'Kotak Kanya Scholarship Programme',
    provider: 'Kotak Education Foundation',
    providerType: 'private_foundation',
    description: 'Financial aid for meritorious girl students from underprivileged families pursuing first-year professional graduation degree courses.',
    awardAmount: 150000,
    awardFormatted: '₹1,50,000 per year until graduation',
    awardType: 'merit_cum_need',
    educationLevels: ['undergraduate'],
    applicableCourses: ['Engineering', 'MBBS', 'Architecture', 'Integrated Law (5-yr)', 'Design'],
    applicableCategories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
    genderRestriction: 'female_only',
    maxAnnualFamilyIncome: 600000,
    minMarksPercentage: 75,
    domicileStates: ['All India'],
    requiredDocuments: [
      'Class 12 mark sheet (Minimum 75% or equivalent CGPA)',
      'Income certificate showing annual family income <= ₹6,00,000',
      'Proof of admission to recognized professional graduation course',
      'College fee structure for the entire academic cycle',
      'Aadhaar card of student and parents'
    ],
    applicationStartDate: '2026-08-01',
    applicationDeadline: '2026-11-20',
    academicCycle: '2026-2027',
    renewalAvailable: true,
    status: 'verified_open',
    officialApplicationUrl: 'https://kotakeducation.org/kotak-kanya-scholarship',
    primarySourceUrl: 'https://kotakeducation.org',
    sourceDomain: 'kotakeducation.org',
    sourceReliability: 'verified_foundation',
    lastCheckedAt: '2026-10-18T04:00:00.000Z',
    lastVerifiedAt: '2026-10-18',
    verificationEvidence: 'Verified against Kotak Education Foundation 2026 portal admissions guidelines.',
    isDemo: false,
    tags: ['Girls Only', 'Professional Degrees', 'High Award']
  },
  {
    id: 'wb-svmcm-2026',
    name: 'Swami Vivekananda Merit-cum-Means Scholarship (SVMCM)',
    provider: 'Higher Education Department, Government of West Bengal',
    providerType: 'state_gov',
    description: 'State flagship scholarship supporting meritorious students of West Bengal pursuing HS, UG, PG, and Doctoral degrees in regular mode.',
    awardAmount: 60000,
    awardFormatted: '₹12,000 to ₹60,000 per annum',
    awardType: 'merit_cum_need',
    educationLevels: ['school', 'undergraduate', 'postgraduate', 'doctoral'],
    applicableCourses: ['All regular streams in recognized institutions in West Bengal'],
    applicableCategories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
    genderRestriction: 'all',
    maxAnnualFamilyIncome: 250000,
    minMarksPercentage: 60,
    domicileStates: ['West Bengal'],
    requiredDocuments: [
      'Madhyamik / Class 10th or 12th Examination Marksheet',
      'Income Certificate from BDO/SDO/DM or Municipal Commissioner',
      'Domicile Certificate (Proof of residency in West Bengal)',
      'Admission receipt of current course',
      'Bank passbook 1st page containing IFSC & Account Number'
    ],
    applicationStartDate: '2026-11-01',
    applicationDeadline: '2027-02-28',
    academicCycle: '2026-2027',
    renewalAvailable: true,
    status: 'upcoming',
    officialApplicationUrl: 'https://svmcm.wbhed.gov.in',
    primarySourceUrl: 'https://svmcm.wbhed.gov.in/page/guidelines.php',
    sourceDomain: 'svmcm.wbhed.gov.in',
    sourceReliability: 'official_government',
    lastCheckedAt: '2026-10-18T04:00:00.000Z',
    lastVerifiedAt: '2026-10-18',
    verificationEvidence: 'State Higher Education Dept notification for 2026-27 cycle slated for portal opening in Nov 2026.',
    isDemo: false,
    tags: ['State Govt', 'West Bengal Domicile', 'Upcoming Cycle']
  },
  {
    id: 'maha-dbt-obc-2026',
    name: 'Post-Matric Scholarship for VJNT, OBC & SBC Students (MahaDBT)',
    provider: 'Social Justice and Special Assistance Dept, Govt of Maharashtra',
    providerType: 'state_gov',
    description: 'Reimbursement of tuition fees and exam fees along with maintenance allowance for students belonging to OBC/VJNT/SBC categories studying in Maharashtra.',
    awardAmount: 85000,
    awardFormatted: '50% to 100% Tuition Fee Waiver + Allowance',
    awardType: 'need',
    educationLevels: ['diploma', 'undergraduate', 'postgraduate'],
    applicableCourses: ['All Approved Courses in Maharashtra'],
    applicableCategories: ['OBC'],
    genderRestriction: 'all',
    maxAnnualFamilyIncome: 150000,
    minMarksPercentage: 50,
    domicileStates: ['Maharashtra'],
    requiredDocuments: [
      'Caste Certificate & Caste Validity Certificate',
      'Tahsildar Income Certificate',
      'Maharashtra Domicile Certificate',
      'Ration Card / Family Declaration',
      'CAP Allotment letter (if admitted through Centralized Admission)'
    ],
    applicationStartDate: '2026-07-01',
    applicationDeadline: '2026-12-31',
    academicCycle: '2026-2027',
    renewalAvailable: true,
    status: 'verified_open',
    officialApplicationUrl: 'https://mahadbt.maharashtra.gov.in',
    primarySourceUrl: 'https://mahadbt.maharashtra.gov.in',
    sourceDomain: 'mahadbt.maharashtra.gov.in',
    sourceReliability: 'official_government',
    lastCheckedAt: '2026-10-18T04:00:00.000Z',
    lastVerifiedAt: '2026-10-18',
    verificationEvidence: 'MahaDBT live portal status verified active for Academic Year 2026-27.',
    isDemo: false,
    tags: ['Maharashtra', 'OBC', 'State Govt', 'MahaDBT']
  },
  {
    id: 'ongc-scholarship-scst',
    name: 'ONGC Foundation Scholarship Scheme for Meritorious SC/ST Students',
    provider: 'ONGC Foundation (Oil and Natural Gas Corporation CSR)',
    providerType: 'corporate_csr',
    description: 'Financial support for economically backward SC/ST students pursuing professional courses in Engineering, MBBS, Geology, Geophysics, or MBA.',
    awardAmount: 48000,
    awardFormatted: '₹48,000 per annum (₹4,000/month)',
    awardType: 'merit_cum_need',
    educationLevels: ['undergraduate', 'postgraduate'],
    applicableCourses: ['Engineering', 'MBBS', 'MBA', 'Geology', 'Geophysics'],
    applicableCategories: ['SC', 'ST'],
    genderRestriction: 'all',
    maxAnnualFamilyIncome: 450000,
    minMarksPercentage: 60,
    domicileStates: ['All India'],
    requiredDocuments: [
      'Caste Certificate in prescribed central government format',
      'Income Certificate issued by authorized revenue officer',
      'Class 12th marksheet for UG / Graduation marksheet for PG',
      'Proof of admission in full time professional degree course'
    ],
    applicationStartDate: '2026-06-01',
    applicationDeadline: '2026-09-30',
    academicCycle: '2026-2027',
    renewalAvailable: true,
    status: 'closed',
    officialApplicationUrl: 'https://www.ongcscholar.org',
    primarySourceUrl: 'https://www.ongcscholar.org/#/rules',
    sourceDomain: 'ongcscholar.org',
    sourceReliability: 'verified_foundation',
    lastCheckedAt: '2026-10-18T04:00:00.000Z',
    lastVerifiedAt: '2026-10-18',
    verificationEvidence: 'Portal notice indicates 2026-27 round 1 portal window closed on 30 Sept 2026.',
    isDemo: false,
    tags: ['ONGC', 'SC/ST', 'Closed Cycle', 'Professional Degrees']
  },
  {
    id: 'sitaram-jindal-2026',
    name: 'Sitaram Jindal Foundation Scholarship Scheme',
    provider: 'Sitaram Jindal Foundation',
    providerType: 'ngo',
    description: 'Charitable foundation stipend for underprivileged students from Class 11 up to Postgraduate and professional courses across India.',
    awardAmount: 38400,
    awardFormatted: '₹6,000 to ₹38,400 per annum',
    awardType: 'need',
    educationLevels: ['school', 'diploma', 'undergraduate', 'postgraduate'],
    applicableCourses: ['All Streams (General, ITI, Diploma, Engineering, Medicine, PG)'],
    applicableCategories: ['General', 'OBC', 'SC', 'ST', 'EWS', 'Minority'],
    genderRestriction: 'all',
    maxAnnualFamilyIncome: 400000,
    minMarksPercentage: 65,
    domicileStates: ['All India'],
    requiredDocuments: [
      'Marksheet of last passed examination',
      'Income Certificate from Tahsildar / BDO or Salary certificate',
      'Certificate regarding annual fees from Principal',
      'Hostel certificate if staying in recognized hostel',
      'Disability certificate (if applicable)'
    ],
    applicationStartDate: '2026-01-01',
    applicationDeadline: '2026-12-31',
    academicCycle: '2026-2027',
    renewalAvailable: true,
    status: 'verified_open',
    officialApplicationUrl: 'https://www.sitaramjindalfoundation.org/scholarships.php',
    primarySourceUrl: 'https://www.sitaramjindalfoundation.org',
    sourceDomain: 'sitaramjindalfoundation.org',
    sourceReliability: 'verified_foundation',
    lastCheckedAt: '2026-10-18T04:00:00.000Z',
    lastVerifiedAt: '2026-10-18',
    verificationEvidence: 'Year-round physical/postal submission window confirmed on official foundation website.',
    isDemo: false,
    tags: ['NGO', 'Continuous Window', 'All Education Levels']
  },
  // Sample labeled Demo Data for comparison
  {
    id: 'demo-state-tech-fellowship',
    name: '[DEMO DATA] National Innovation Tech Fellowship 2026',
    provider: 'Consortium of Indian Technical Universities (Sample Entry)',
    providerType: 'university',
    description: 'Simulated sample record used to demonstrate multi-tier ranking and eligibility breakdown with research grants.',
    awardAmount: 75000,
    awardFormatted: '₹75,000 Research Contingency Grant',
    awardType: 'fellowship',
    educationLevels: ['postgraduate', 'doctoral', 'research'],
    applicableCourses: ['Computer Science', 'Artificial Intelligence', 'Data Science', 'Electronics'],
    applicableCategories: ['General', 'OBC', 'SC', 'ST', 'EWS'],
    genderRestriction: 'all',
    maxAnnualFamilyIncome: 1000000,
    minMarksPercentage: 70,
    domicileStates: ['All India'],
    requiredDocuments: ['Research Proposal Summary', 'Faculty Recommendation Letter', 'Degree Transcript'],
    applicationStartDate: '2026-09-01',
    applicationDeadline: '2026-11-25',
    academicCycle: '2026-2027',
    renewalAvailable: false,
    status: 'verified_open',
    officialApplicationUrl: 'https://example.edu.in/fellowship-demo',
    primarySourceUrl: 'https://example.edu.in',
    sourceDomain: 'example.edu.in',
    sourceReliability: 'official_institution',
    lastCheckedAt: '2026-10-18T04:00:00.000Z',
    lastVerifiedAt: '2026-10-18',
    verificationEvidence: 'Sample demo record provided for testing filter variations.',
    isDemo: true,
    tags: ['DEMO DATA', 'Research', 'Tech Fellowship']
  }
];

// In-Memory Database State
class ScholarshipDatabase {
  private scholarships: Map<string, Scholarship> = new Map();
  private profiles: Map<string, StudentProfile> = new Map();
  private applications: Map<string, ApplicationTrackerItem> = new Map();
  private savedScholarships: Map<string, Set<string>> = new Map(); // userId -> Set<scholarshipId>
  private documents: Map<string, UserDocument[]> = new Map(); // userId -> UserDocument[]
  private notifications: Map<string, NotificationItem[]> = new Map(); // userId -> NotificationItem[]
  private ingestionRuns: IngestionRun[] = [];
  private reports: UserReport[] = [];

  constructor() {
    // Seed scholarships
    for (const s of INITIAL_SCHOLARSHIPS) {
      this.scholarships.set(s.id, s);
    }

    // Default Seed Student Profile for quick demonstration
    const defaultProfile: StudentProfile = {
      id: 'demo-student-id',
      name: 'Sonu Giri',
      email: 'giri2005sonu@gmail.com',
      state: 'Uttar Pradesh',
      domicileState: 'Uttar Pradesh',
      city: 'Varanasi',
      educationLevel: 'undergraduate',
      course: 'B.Tech Computer Science & Engineering',
      institutionName: 'Banaras Hindu University (BHU)',
      institutionType: 'Government',
      currentYear: 2,
      academicYear: '2026-2027',
      previousMarksPercentage: 84.5,
      cgpa: 8.6,
      category: 'OBC',
      annualHouseholdIncome: 240000,
      gender: 'Male',
      preferredFields: ['Engineering', 'Technology', 'Science'],
      preferredProviders: ['central_gov', 'state_gov', 'corporate_csr'],
      preferredScholarshipTypes: ['merit_cum_need'],
      notificationFrequency: 'daily',
      deadlineReminders: true,
      profileCompletedPercentage: 100,
      createdAt: '2026-10-18T00:00:00.000Z',
      updatedAt: '2026-10-18T00:00:00.000Z',
    };
    this.profiles.set('default', defaultProfile);
    this.profiles.set(defaultProfile.id, defaultProfile);

    // Initial saved items for default user
    this.savedScholarships.set('default', new Set(['nsp-csss-2026', 'reliance-ug-2026']));
    this.savedScholarships.set(defaultProfile.id, new Set(['nsp-csss-2026', 'reliance-ug-2026']));

    // Initial application tracker items
    const initialApp: ApplicationTrackerItem = {
      id: 'app-1',
      userId: 'default',
      scholarshipId: 'nsp-csss-2026',
      scholarshipName: 'Central Sector Scheme of Scholarships for College and University Students (PM-USP)',
      provider: 'Department of Higher Education, Ministry of Education, Govt. of India',
      deadline: '2026-11-30',
      awardFormatted: '₹12,000/yr (UG) & ₹20,000/yr (PG)',
      officialUrl: 'https://scholarships.gov.in',
      status: 'preparing_documents',
      notes: 'Collected 12th marksheet; need to renew Tehsil income certificate next week.',
      applicationReference: 'NSP/2026/UP/849201',
      startedAt: '2026-10-01',
      createdAt: '2026-10-01T10:00:00.000Z',
      updatedAt: '2026-10-15T12:00:00.000Z',
    };
    this.applications.set(initialApp.id, initialApp);

    // Initial notifications
    const defaultNotifs: NotificationItem[] = [
      {
        id: 'notif-1',
        userId: 'default',
        type: 'match',
        title: 'New 95% Match Discovered',
        message: 'Reliance Foundation Undergraduate Scholarship aligns with your B.Tech course and family income ceiling.',
        scholarshipId: 'reliance-ug-2026',
        read: false,
        timestamp: '2026-10-18T02:30:00.000Z',
        actionUrl: '/scholarships/reliance-ug-2026',
      },
      {
        id: 'notif-2',
        userId: 'default',
        type: 'deadline',
        title: 'Deadline Alert: Central Sector Scheme',
        message: 'Your tracked application for PM-USP Central Sector Scheme has 43 days remaining.',
        scholarshipId: 'nsp-csss-2026',
        read: true,
        timestamp: '2026-10-16T09:00:00.000Z',
        actionUrl: '/applications',
      },
      {
        id: 'notif-3',
        userId: 'default',
        type: 'verification',
        title: 'Source Verified: AICTE Portal',
        message: 'AICTE Pragati guidelines for 2026-27 confirmed active on National Scholarship Portal.',
        scholarshipId: 'aicte-pragati-2026',
        read: false,
        timestamp: '2026-10-17T11:20:00.000Z',
        actionUrl: '/scholarships/aicte-pragati-2026',
      }
    ];
    this.notifications.set('default', defaultNotifs);

    // Initial Ingestion Run log
    this.ingestionRuns.push({
      id: 'ingest-init',
      query: 'site:scholarships.gov.in OR site:aicte-india.org 2026 scholarship schemes',
      startedAt: '2026-10-18T03:50:00.000Z',
      completedAt: '2026-10-18T03:52:15.000Z',
      candidatesFound: 14,
      successfullyFetched: 11,
      recordsAdded: 3,
      recordsUpdated: 8,
      recordsSkipped: 3,
      failedExtractions: 0,
      status: 'success',
      errors: [],
      trigger: 'manual_admin',
    });
  }

  // Scholarship Queries
  getAllScholarships(): Scholarship[] {
    return Array.from(this.scholarships.values());
  }

  getScholarshipById(id: string): Scholarship | undefined {
    return this.scholarships.get(id);
  }

  upsertScholarship(scholarship: Scholarship): void {
    this.scholarships.set(scholarship.id, scholarship);
  }

  // Profile
  getProfile(userId: string = 'default'): StudentProfile {
    return this.profiles.get(userId) || this.profiles.get('default')!;
  }

  updateProfile(userId: string = 'default', update: Partial<StudentProfile>): StudentProfile {
    const current = this.getProfile(userId);
    const updated: StudentProfile = {
      ...current,
      ...update,
      updatedAt: new Date().toISOString(),
    };
    this.profiles.set(userId, updated);
    return updated;
  }

  // Saved Scholarships
  getSavedScholarshipIds(userId: string = 'default'): string[] {
    const set = this.savedScholarships.get(userId);
    return set ? Array.from(set) : [];
  }

  toggleSaveScholarship(userId: string = 'default', scholarshipId: string): boolean {
    if (!this.savedScholarships.has(userId)) {
      this.savedScholarships.set(userId, new Set());
    }
    const set = this.savedScholarships.get(userId)!;
    if (set.has(scholarshipId)) {
      set.delete(scholarshipId);
      return false; // un-saved
    } else {
      set.add(scholarshipId);
      return true; // saved
    }
  }

  // Applications
  getApplications(userId: string = 'default'): ApplicationTrackerItem[] {
    return Array.from(this.applications.values()).filter(a => a.userId === userId || a.userId === 'default');
  }

  addApplication(item: Omit<ApplicationTrackerItem, 'id' | 'createdAt' | 'updatedAt'>): ApplicationTrackerItem {
    const id = `app-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const now = new Date().toISOString();
    const app: ApplicationTrackerItem = {
      ...item,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.applications.set(id, app);
    return app;
  }

  updateApplication(id: string, updates: Partial<ApplicationTrackerItem>): ApplicationTrackerItem | null {
    const existing = this.applications.get(id);
    if (!existing) return null;
    const updated: ApplicationTrackerItem = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.applications.set(id, updated);
    return updated;
  }

  deleteApplication(id: string): boolean {
    return this.applications.delete(id);
  }

  // Documents
  getDocuments(userId: string = 'default'): UserDocument[] {
    return this.documents.get(userId) || [];
  }

  addDocument(userId: string = 'default', doc: Omit<UserDocument, 'id' | 'uploadedAt'>): UserDocument {
    if (!this.documents.has(userId)) {
      this.documents.set(userId, []);
    }
    const newDoc: UserDocument = {
      ...doc,
      id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      uploadedAt: new Date().toISOString(),
    };
    this.documents.get(userId)!.push(newDoc);
    return newDoc;
  }

  deleteDocument(userId: string = 'default', docId: string): boolean {
    const docs = this.documents.get(userId);
    if (!docs) return false;
    const filtered = docs.filter(d => d.id !== docId);
    this.documents.set(userId, filtered);
    return docs.length !== filtered.length;
  }

  // Notifications
  getNotifications(userId: string = 'default'): NotificationItem[] {
    return this.notifications.get(userId) || [];
  }

  markNotificationAsRead(userId: string = 'default', notificationId: string): boolean {
    const notifs = this.notifications.get(userId);
    if (!notifs) return false;
    const item = notifs.find(n => n.id === notificationId);
    if (item) {
      item.read = true;
      return true;
    }
    return false;
  }

  addNotification(userId: string = 'default', notif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): NotificationItem {
    if (!this.notifications.has(userId)) {
      this.notifications.set(userId, []);
    }
    const item: NotificationItem = {
      ...notif,
      id: `notif-${Date.now()}`,
      read: false,
      timestamp: new Date().toISOString(),
    };
    this.notifications.get(userId)!.unshift(item);
    return item;
  }

  // Ingestion runs & Reports
  getIngestionRuns(): IngestionRun[] {
    return [...this.ingestionRuns].reverse();
  }

  addIngestionRun(run: IngestionRun): void {
    this.ingestionRuns.push(run);
  }

  getReports(): UserReport[] {
    return [...this.reports].reverse();
  }

  addReport(report: Omit<UserReport, 'id' | 'reportedAt' | 'resolved'>): UserReport {
    const newReport: UserReport = {
      ...report,
      id: `rep-${Date.now()}`,
      reportedAt: new Date().toISOString(),
      resolved: false,
    };
    this.reports.push(newReport);
    return newReport;
  }
}

export const db = new ScholarshipDatabase();
