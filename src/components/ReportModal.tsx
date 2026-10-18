import React, { useState } from 'react';
import { AlertTriangle, X, CheckCircle2 } from 'lucide-react';

interface ReportModalProps {
  scholarshipId: string;
  scholarshipName: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  scholarshipId,
  scholarshipName,
  isOpen,
  onClose,
}) => {
  const [issueType, setIssueType] = useState<'expired_deadline' | 'wrong_eligibility' | 'broken_link' | 'wrong_amount' | 'other'>('expired_deadline');
  const [description, setDescription] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please provide details about the discrepancy.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scholarshipId,
          issueType,
          description,
          userEmail: userEmail.trim() || undefined,
        }),
      });

      if (!res.ok) throw new Error('Failed to submit report');
      setIsSubmitted(true);
    } catch {
      setError('Network error submitting report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2 text-amber-600 font-bold text-base">
            <AlertTriangle className="w-5 h-5" />
            <span>Report Discrepancy / Incorrect Listing</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            aria-label="Close report modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-lg">Thank You for Your Report!</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Your feedback helps ensure all students receive accurate deadlines and eligibility criteria. Our administrative team will verify the official notice.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition-colors"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Scholarship
              </label>
              <div className="text-xs font-semibold text-slate-900 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                {scholarshipName}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                What seems incorrect?
              </label>
              <select
                value={issueType}
                onChange={(e) => setIssueType(e.target.value as any)}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="expired_deadline">The published deadline has already passed / closed</option>
                <option value="wrong_eligibility">Eligibility conditions (income, marks, or course) are incorrect</option>
                <option value="broken_link">Official application portal URL is broken or misdirected</option>
                <option value="wrong_amount">Stipend or award amount doesn't match official notice</option>
                <option value="other">Other error or missing scheme detail</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Details & Official Source URL (if available)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe what changed, or paste the link to the latest official gazette/circular..."
                rows={3}
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Your Email (Optional, if you wish to be notified upon verification)
              </label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full text-xs p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {error && (
              <div className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
