import React, { useState } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  Lock,
  FileText,
  HelpCircle,
  Mail,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface InfoPageProps {
  pageType: 'about' | 'privacy' | 'terms' | 'help' | 'contact';
  navigate: (path: string) => void;
}

export const InfoPages: React.FC<InfoPageProps> = ({ pageType, navigate }) => {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [contactMessage, setContactMessage] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactSubject, setContactSubject] = useState('General Question');
  const [sentSuccess, setSentSuccess] = useState(false);

  const toggleFaq = (idx: number) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setContactMessage('');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Navigation Tabs between info pages */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
          {[
            { id: 'about', label: 'About Us' },
            { id: 'privacy', label: 'Privacy Policy' },
            { id: 'terms', label: 'Terms & Disclaimers' },
            { id: 'help', label: 'Help & FAQs' },
            { id: 'contact', label: 'Contact & Support' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => navigate(`/${tab.id}`)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                pageType === tab.id
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ABOUT PAGE */}
        {pageType === 'about' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Mission & Ethics</span>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                About BHAIYO KI PHADAI
              </h1>
              <p className="text-sm font-semibold text-slate-600 italic">
                "Har Student Ka Haq, Har Scholarship Ki Khabar."
              </p>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 space-y-4 leading-relaxed">
              <p>
                In India, over ₹18,000 Crores in central, state, and corporate CSR scholarships go unutilized or under-applied every year simply because students do not know what schemes exist, when portals open, or whether their specific degree meets the criteria.
              </p>
              <p>
                <strong>BHAIYO KI PHADAI</strong> is built by students, for students. We centralize scholarship discovery across National Scholarship Portal (NSP), state welfare departments (MahaDBT, West Bengal SVMCM, UP Scholarship), university grants (UGC, AICTE), and major philanthropic initiatives (Reliance Foundation, Tata Trusts, Kotak Education Foundation).
              </p>

              <h2 className="text-base font-bold text-slate-900 pt-2">Our Fundamental Commitments</h2>
              <ul className="list-disc list-inside space-y-2 text-slate-600">
                <li><strong>No Black-Box Matching:</strong> We explain the reasoning behind every match score: which eligibility criteria matched, which failed, and which need official verification.</li>
                <li><strong>Verified Deadlines:</strong> We don't mark a scholarship as open because a blog mentioned it. We cite official gazette notices and last verification dates.</li>
                <li><strong>Official Portal Redirection:</strong> When you're ready to apply, we send you directly to the authenticated government or foundation portal. We never charge application fees or store your bank credentials.</li>
              </ul>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                <strong>Legal Status:</strong> BHAIYO KI PHADAI is an independent technology platform. We have no formal government affiliation and do not claim official sponsorship. All scheme logos and trademarks belong to their respective ministries or foundations.
              </div>
            </div>
          </div>
        )}

        {/* PRIVACY POLICY */}
        {pageType === 'privacy' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Data Protection</span>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Privacy Constitution
              </h1>
              <p className="text-xs text-slate-500">
                Last updated: October 2026 • Compliant with Indian Digital Data Protection Principles
              </p>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 space-y-4 leading-relaxed">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-950 font-medium">
                <strong>Zero Mandatory Uploads:</strong> You can discover 100% of scholarships on BHAIYO KI PHADAI without ever uploading sensitive documents or identity proofs.
              </div>

              <h2 className="text-base font-bold text-slate-900">1. Information We Collect</h2>
              <p>
                When you create a student profile, you voluntarily declare academic and demographic information (e.g., current degree, previous marks, social reservation category, and household income). We collect this exclusively to evaluate eligibility against published scheme rules.
              </p>

              <h2 className="text-base font-bold text-slate-900">2. How We Handle Sensitive Documents</h2>
              <p>
                If you choose to use the optional <em>Private Document Vault</em> to store certificates for your personal convenience, those files are isolated in private, encrypted storage accessible only to your authenticated session.
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-600">
                <li>We <strong>never transmit</strong> your certificates or identity proofs to TinyFish or external web crawlers.</li>
                <li>We <strong>never sell</strong> student data to coaching centers, credit card issuers, or advertisers.</li>
                <li>Deleting a document immediately purges the stored object from disk.</li>
              </ul>

              <h2 className="text-base font-bold text-slate-900">3. TinyFish Search & Fetch Integration Security</h2>
              <p>
                Search queries sent to TinyFish APIs are generated anonymously using scheme names, academic degrees, and portal domains (e.g. <code>site:scholarships.gov.in 2026 eligibility</code>). No student names, marks, categories, or personal identifiers are ever included in external discovery queries.
              </p>
            </div>
          </div>
        )}

        {/* TERMS & DISCLAIMERS */}
        {pageType === 'terms' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Terms of Use</span>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Terms & Disclaimers
              </h1>
            </div>

            <div className="text-xs sm:text-sm text-slate-700 space-y-4 leading-relaxed">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-950">
                <strong>Important Notice:</strong> BHAIYO KI PHADAI does not award scholarships, approve applications, or disburse grant funds. We provide discovery intelligence and application organization tools.
              </div>

              <h2 className="text-base font-bold text-slate-900">1. Non-Guarantee of Official Award</h2>
              <p>
                An "Eligible" or "Strong Match" designation generated by our explainable matching algorithm indicates that your declared profile satisfies the publicly published conditions of the scheme. It does not constitute official selection, award confirmation, or guaranteed government funding. Final eligibility and document verification are performed exclusively by the awarding authority.
              </p>

              <h2 className="text-base font-bold text-slate-900">2. Third-Party Portals and Redirections</h2>
              <p>
                When clicking "Apply on Official Website", you will be redirected to an external government or institutional portal. BHAIYO KI PHADAI validates external links to protect against phishing domains, but does not control the server availability or policies of third-party websites.
              </p>

              <h2 className="text-base font-bold text-slate-900">3. Reporting Inaccuracies</h2>
              <p>
                If an official department issues an amended gazette modifying a deadline or income ceiling, you can submit an instant correction report via the "Report Discrepancy" button on any scholarship detail page.
              </p>
            </div>
          </div>
        )}

        {/* HELP & FAQS */}
        {pageType === 'help' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Assistance</span>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Help & Frequently Asked Questions
              </h1>
            </div>

            <div className="space-y-3">
              {[
                {
                  q: 'What is the National Scholarship Portal (NSP) and how does BHAIYO KI PHADAI integrate with it?',
                  a: 'The National Scholarship Portal (scholarships.gov.in) is the central government platform for welfare schemes across ministries. BHAIYO KI PHADAI crawls public NSP notifications via TinyFish Search to extract verified deadlines and eligibility criteria, and directs you to apply directly on the NSP portal.'
                },
                {
                  q: 'Why does my scholarship show "Verification Required"?',
                  a: 'We show "Verification Required" whenever our crawler detects contradictory dates between two sources, when an academic cycle year has not been explicitly re-notified, or when third-party reports require official department corroboration.'
                },
                {
                  q: 'Can I apply for more than one scholarship at a time?',
                  a: 'Yes, you can track multiple applications simultaneously. However, please check official government guidelines regarding receiving multiple financial benefits: most state and central rules permit only one government maintenance allowance at a time, although merit prizes or corporate CSR contingency grants may often be combined.'
                },
                {
                  q: 'What should I do if a link directs me to an outdated circular?',
                  a: 'Click the "Report Discrepancy" button on that scholarship page. Our team and automated crawlers re-index the provider domain to reflect the latest gazette.'
                }
              ].map((faq, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 bg-slate-50/50 hover:bg-slate-100/60 flex items-center justify-between gap-2"
                  >
                    <span>{faq.q}</span>
                    {activeFaq === idx ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                  </button>
                  {activeFaq === idx && (
                    <div className="p-4 text-xs text-slate-600 leading-relaxed bg-white border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CONTACT PAGE */}
        {pageType === 'contact' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Student Support</span>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Contact & Support
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Have a question, feedback, or a suggestion for a state scheme to index? Send us a message.
              </p>
            </div>

            {sentSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h3 className="font-bold text-emerald-950 text-base">Message Sent Successfully!</h3>
                <p className="text-xs text-emerald-800">
                  Thank you for reaching out. A student representative will review your inquiry.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Your Email</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="student@example.com"
                    required
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                  <select
                    value={contactSubject}
                    onChange={(e) => setContactSubject(e.target.value)}
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="General Question">General Question</option>
                    <option value="Scheme Recommendation">Suggest a Missing Scholarship Scheme</option>
                    <option value="Bug or Technical Issue">Technical or UI Issue</option>
                    <option value="Partnership / College Lead">College / Student Ambassador Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Message</label>
                  <textarea
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Write your query or scheme details here..."
                    rows={4}
                    required
                    className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
