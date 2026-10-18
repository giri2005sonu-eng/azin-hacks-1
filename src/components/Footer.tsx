import React from 'react';
import { GraduationCap, ShieldCheck, ExternalLink, Heart, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  navigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-lg text-white">BHAIYO KI PHADAI</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              "Har Student Ka Haq, Har Scholarship Ki Khabar." Centralizing Indian scholarship discovery with explainable eligibility matching, verified deadlines, and zero dark patterns.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-1.5 rounded-md w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Independent & Student-First Platform</span>
            </div>
          </div>

          {/* Col 2: Scholarship Categories */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
              Explore Opportunities
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('/scholarships?openOnly=true')}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  Verified Open Scholarships
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/scholarships?category=SC')}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  SC / ST Post-Matric Schemes
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/scholarships?category=OBC')}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  OBC & EBC Central Assistance
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/scholarships?educationLevel=undergraduate')}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  Undergraduate & B.Tech Grants
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/scholarships?providerType=corporate_csr')}
                  className="hover:text-blue-400 text-left transition-colors"
                >
                  Corporate CSR Programs (Tata, Reliance)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Student Tools */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
              Student Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('/dashboard')} className="hover:text-blue-400 text-left transition-colors">
                  Personalized Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/applications')} className="hover:text-blue-400 text-left transition-colors">
                  Application Tracker
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/compare')} className="hover:text-blue-400 text-left transition-colors">
                  Multi-Scholarship Comparison
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/documents')} className="hover:text-blue-400 text-left transition-colors">
                  Private Document Vault
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/onboarding')} className="hover:text-blue-400 text-left transition-colors">
                  Update Eligibility Profile
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Transparency & Policies */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-3">
              Trust & Transparency
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => navigate('/about')} className="hover:text-blue-400 text-left transition-colors">
                  About Our Mission
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/privacy')} className="hover:text-blue-400 text-left transition-colors">
                  Privacy Policy & Vault Security
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/terms')} className="hover:text-blue-400 text-left transition-colors">
                  Terms of Service & Disclaimers
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/help')} className="hover:text-blue-400 text-left transition-colors">
                  Help & FAQs
                </button>
              </li>
              <li>
                <button onClick={() => navigate('/contact')} className="hover:text-blue-400 text-left transition-colors">
                  Contact & Report Incorrect Listing
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="pt-6 border-t border-slate-800 text-[11px] text-slate-500 space-y-2 leading-relaxed">
          <p>
            <strong className="text-slate-400">Important Disclaimer:</strong> BHAIYO KI PHADAI is an independent scholarship discovery and application tracking utility. We do not represent any government ministry, department, university, or corporate foundation. Final eligibility, award selection, document verification, and disbursement are strictly governed by the respective awarding body. When you apply, we redirect you directly to the verified official portal.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between pt-4 text-slate-400 gap-2">
            <div>
              © {new Date().getFullYear()} BHAIYO KI PHADAI. Built for Indian Students.
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for Bharat's aspiring scholars
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
