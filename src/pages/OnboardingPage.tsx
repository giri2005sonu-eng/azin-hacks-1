import React, { useState } from 'react';
import type { StudentProfile, EducationLevel, SocialCategory, ProviderType } from '../types/scholarship.ts';
import { calculateProfileCompletion } from '../lib/matching.ts';
import {
  User,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  ArrowRight,
  ArrowLeft,
  Lock,
  Save,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

interface OnboardingPageProps {
  initialProfile: StudentProfile | null;
  onSaveProfile: (profile: StudentProfile) => void;
  navigate: (path: string) => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({
  initialProfile,
  onSaveProfile,
  navigate,
}) => {
  const [step, setStep] = useState<number>(1);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Form states
  const [formData, setFormData] = useState<Partial<StudentProfile>>(initialProfile || {
    name: 'Sonu Giri',
    email: 'giri2005sonu@gmail.com',
    state: 'Uttar Pradesh',
    domicileState: 'Uttar Pradesh',
    city: 'Varanasi',
    educationLevel: 'undergraduate',
    course: 'B.Tech Computer Science',
    institutionName: 'Banaras Hindu University (BHU)',
    institutionType: 'Government',
    currentYear: 2,
    academicYear: '2026-2027',
    previousMarksPercentage: 84.5,
    category: 'OBC',
    annualHouseholdIncome: 240000,
    gender: 'Male',
    preferredFields: ['Engineering', 'Technology'],
    preferredProviders: ['central_gov', 'corporate_csr'],
    notificationFrequency: 'daily',
    deadlineReminders: true,
  });

  const updateField = (key: keyof StudentProfile, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFinish = async () => {
    const completion = calculateProfileCompletion(formData);
    const completeProfile: StudentProfile = {
      id: initialProfile?.id || 'profile-default',
      name: formData.name || 'Student',
      email: formData.email || '',
      state: formData.state || 'Uttar Pradesh',
      domicileState: formData.domicileState || formData.state || 'Uttar Pradesh',
      city: formData.city || '',
      educationLevel: (formData.educationLevel as EducationLevel) || 'undergraduate',
      course: formData.course || 'Undergraduate Degree',
      specialization: formData.specialization || '',
      institutionName: formData.institutionName || '',
      institutionType: formData.institutionType || 'Government',
      currentYear: formData.currentYear || 1,
      academicYear: formData.academicYear || '2026-2027',
      previousMarksPercentage: formData.previousMarksPercentage || 75,
      cgpa: formData.cgpa,
      category: (formData.category as SocialCategory) || 'General',
      annualHouseholdIncome: formData.annualHouseholdIncome || 300000,
      gender: formData.gender || 'Male',
      preferredFields: formData.preferredFields || ['All'],
      preferredProviders: formData.preferredProviders || ['central_gov', 'state_gov'],
      preferredScholarshipTypes: formData.preferredScholarshipTypes || ['merit_cum_need'],
      notificationFrequency: formData.notificationFrequency || 'daily',
      deadlineReminders: Boolean(formData.deadlineReminders),
      profileCompletedPercentage: completion,
      createdAt: initialProfile?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSaveProfile(completeProfile);
    setSaveSuccess(true);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Wizard Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
            <Lock className="w-3.5 h-3.5" />
            <span>Private & Transparent Profile Setup</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Student Eligibility Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Provide your academic and eligibility details to generate explainable recommendations. We collect only what is strictly required for matching.
          </p>
        </div>

        {/* Wizard Steps Bar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <button
              onClick={() => setStep(1)}
              className={`flex items-center gap-1.5 ${step === 1 ? 'text-blue-600' : ''}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === 1 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}>1</span>
              <span>Basic Info</span>
            </button>
            <div className="flex-1 h-0.5 mx-2 bg-slate-100"></div>

            <button
              onClick={() => setStep(2)}
              className={`flex items-center gap-1.5 ${step === 2 ? 'text-blue-600' : ''}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === 2 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}>2</span>
              <span>Academics</span>
            </button>
            <div className="flex-1 h-0.5 mx-2 bg-slate-100"></div>

            <button
              onClick={() => setStep(3)}
              className={`flex items-center gap-1.5 ${step === 3 ? 'text-blue-600' : ''}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === 3 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}>3</span>
              <span>Eligibility</span>
            </button>
            <div className="flex-1 h-0.5 mx-2 bg-slate-100"></div>

            <button
              onClick={() => setStep(4)}
              className={`flex items-center gap-1.5 ${step === 4 ? 'text-blue-600' : ''}`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                step === 4 ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
              }`}>4</span>
              <span>Preferences</span>
            </button>
          </div>
        </div>

        {/* Step Body */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          {/* STEP 1: Basic Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-base">Step 1: Basic Information</h3>
                <p className="text-xs text-slate-500">Your identity and resident domicile details.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="e.g. Sonu Giri"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="student@example.com"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Domicile State (Bona Fide Residency)</label>
                  <select
                    value={formData.domicileState || ''}
                    onChange={(e) => updateField('domicileState', e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="West Bengal">West Bengal</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Rajasthan">Rajasthan</option>
                    <option value="Madhya Pradesh">Madhya Pradesh</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Other">Other State / UT</option>
                  </select>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Used to match state-specific higher education grants (e.g. MahaDBT, SVMCM).
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City / District</label>
                  <input
                    type="text"
                    value={formData.city || ''}
                    onChange={(e) => updateField('city', e.target.value)}
                    placeholder="e.g. Varanasi"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Academic Details */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-base">Step 2: Academic Program Details</h3>
                <p className="text-xs text-slate-500">Matched against college/university level restrictions.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Current Education Level</label>
                  <select
                    value={formData.educationLevel || 'undergraduate'}
                    onChange={(e) => updateField('educationLevel', e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="school">School (10th/11th/12th)</option>
                    <option value="diploma">Diploma / Polytechnic</option>
                    <option value="undergraduate">Undergraduate Degree (B.Tech, B.Sc, B.Com, MBBS)</option>
                    <option value="postgraduate">Postgraduate Degree (M.Tech, M.Sc, MBA)</option>
                    <option value="doctoral">Doctoral / PhD</option>
                    <option value="research">Postdoctoral / Research</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Enrolled Course / Stream</label>
                  <input
                    type="text"
                    value={formData.course || ''}
                    onChange={(e) => updateField('course', e.target.value)}
                    placeholder="e.g. B.Tech Computer Science & Engineering"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Institution Name</label>
                  <input
                    type="text"
                    value={formData.institutionName || ''}
                    onChange={(e) => updateField('institutionName', e.target.value)}
                    placeholder="e.g. Banaras Hindu University"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Institution Classification</label>
                  <select
                    value={formData.institutionType || 'Government'}
                    onChange={(e) => updateField('institutionType', e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Government">Government / Central University / IIT / NIT</option>
                    <option value="Private">Private Recognized University</option>
                    <option value="Aided">Government Aided College</option>
                    <option value="Autonomous">Autonomous College</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Previous Qualifying Marks Percentage (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="35"
                    max="100"
                    value={formData.previousMarksPercentage || ''}
                    onChange={(e) => updateField('previousMarksPercentage', parseFloat(e.target.value))}
                    placeholder="e.g. 84.5"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Used to compare against minimum merit cutoffs (e.g. 60% or 80th percentile).
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Current Academic Year / Semester</label>
                  <select
                    value={formData.currentYear || 1}
                    onChange={(e) => updateField('currentYear', parseInt(e.target.value, 10))}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value={1}>1st Year (Fresher)</option>
                    <option value={2}>2nd Year</option>
                    <option value={3}>3rd Year</option>
                    <option value={4}>4th Year</option>
                    <option value={5}>5th Year (Dual/Law)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Eligibility Details (Sensitive fields handled with explicit privacy explanations) */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-base">Step 3: Eligibility & Welfare Criteria</h3>
                <p className="text-xs text-slate-500">
                  Indian government and corporate schemes have statutory reservation criteria.
                </p>
              </div>

              {/* Privacy Explanation Banner */}
              <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-xs text-blue-900 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed">
                  <strong>Why we ask this:</strong> Schemes like Post-Matric SC/ST, MahaDBT OBC, and EWS Fee Waivers require specific category and income ceiling verification. We never share your category or income with third-party advertisers or in public search queries.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Social / Reservation Category</label>
                  <select
                    value={formData.category || 'General'}
                    onChange={(e) => updateField('category', e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="General">General / Open Category</option>
                    <option value="OBC">OBC (Other Backward Classes)</option>
                    <option value="SC">SC (Scheduled Caste)</option>
                    <option value="ST">ST (Scheduled Tribe)</option>
                    <option value="EWS">EWS (Economically Weaker Section)</option>
                    <option value="Minority">Minority (Muslim, Christian, Sikh, Buddhist, Jain, Parsi)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender || 'Male'}
                    onChange={(e) => updateField('gender', e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female (Unlocks AICTE Pragati, Kotak Kanya & L'Oréal schemes)</option>
                    <option value="Other">Other / Transgender</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Annual Gross Household Income (INR ₹)
                  </label>
                  <input
                    type="number"
                    step="10000"
                    value={formData.annualHouseholdIncome || ''}
                    onChange={(e) => updateField('annualHouseholdIncome', parseInt(e.target.value, 10))}
                    placeholder="e.g. 240000"
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                  />
                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Current: ₹{(formData.annualHouseholdIncome || 0).toLocaleString('en-IN')} / year</span>
                    <span>Common limits: ₹2.5L (SC/ST/Need), ₹4.5L (Central Sector), ₹8L (AICTE/EWS)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Preferences & Review */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-base">Step 4: Discovery Preferences & Notifications</h3>
                <p className="text-xs text-slate-500">Configure deadline alerts and preferred awarding sources.</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Notification Frequency
                  </label>
                  <select
                    value={formData.notificationFrequency || 'daily'}
                    onChange={(e) => updateField('notificationFrequency', e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="instant">Instant (As soon as verified open portals trigger)</option>
                    <option value="daily">Daily Digest</option>
                    <option value="weekly">Weekly Summary</option>
                  </select>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50/60 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-slate-800">Deadline Reminders</div>
                    <div className="text-[11px] text-slate-500">
                      Notify me at 7 days, 3 days, and 24 hours prior to closing dates.
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.deadlineReminders !== false}
                    onChange={(e) => updateField('deadlineReminders', e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Review Card */}
              <div className="mt-6 p-4 rounded-xl bg-slate-900 text-white space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                    Profile Summary Review
                  </span>
                  <span className="text-xs font-semibold bg-blue-600 px-2.5 py-0.5 rounded-full">
                    {calculateProfileCompletion(formData)}% Complete
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
                  <div><strong>Name:</strong> {formData.name}</div>
                  <div><strong>Course:</strong> {formData.course}</div>
                  <div><strong>Domicile:</strong> {formData.domicileState}</div>
                  <div><strong>Category:</strong> {formData.category}</div>
                  <div><strong>Qualifying Marks:</strong> {formData.previousMarksPercentage}%</div>
                  <div><strong>Annual Income:</strong> ₹{(formData.annualHouseholdIncome || 0).toLocaleString('en-IN')}</div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : <div></div>}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>Continue to Step {step + 1}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition-colors flex items-center gap-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saveSuccess ? 'Saved! Redirecting...' : 'Save & Unlock Matches'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
