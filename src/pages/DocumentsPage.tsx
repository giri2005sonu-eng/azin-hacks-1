import React, { useState } from 'react';
import type { UserDocument, DocumentType } from '../types/scholarship.ts';
import {
  FileText,
  UploadCloud,
  Lock,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  AlertCircle,
  FileCheck2,
  Download,
  Info
} from 'lucide-react';

interface DocumentsPageProps {
  documents: UserDocument[];
  onUploadDocument: (doc: {
    title: string;
    docType: DocumentType;
    fileName: string;
    fileSize: number;
    mimeType: string;
    consentGiven: boolean;
  }) => void;
  onDeleteDocument: (id: string) => void;
  navigate: (path: string) => void;
}

export const DocumentsPage: React.FC<DocumentsPageProps> = ({
  documents,
  onUploadDocument,
  onDeleteDocument,
  navigate,
}) => {
  const [title, setTitle] = useState('');
  const [docType, setDocType] = useState<DocumentType>('marksheets');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState<number>(350000); // 350 KB default
  const [consentGiven, setConsentGiven] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileSimulate = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Validate file size (max 5 MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File size exceeds the 5MB maximum security limit.');
        return;
      }
      // Validate extension
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setUploadError('Only PDF, JPG, and PNG files are permitted.');
        return;
      }
      setUploadError(null);
      setFileName(file.name);
      setFileSize(file.size);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setUploadError('Please provide a descriptive document title.');
      return;
    }
    if (!consentGiven) {
      setUploadError('Please check the processing and private storage consent.');
      return;
    }

    onUploadDocument({
      title: title.trim(),
      docType,
      fileName: fileName || `${title.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      fileSize: fileSize || 280000,
      mimeType: 'application/pdf',
      consentGiven: true,
    });

    setTitle('');
    setFileName('');
    setConsentGiven(false);
    setShowUploadModal(false);
    setUploadError(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <Lock className="w-4 h-4" />
              <span>Encrypted Student Document Vault</span>
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Private Document Vault
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Store self-attested certificates securely to quickly upload on official government and university portals.
            </p>
          </div>

          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors self-start sm:self-auto"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Certificate</span>
          </button>
        </div>

        {/* Privacy Notice Card (CRITICAL REQUIREMENT) */}
        <div className="p-4 bg-emerald-50/80 border border-emerald-200/80 rounded-2xl text-xs text-emerald-950 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="font-bold text-emerald-900 text-xs">
              Privacy-First Guarantee: Document Uploads Are Never Mandatory
            </h3>
            <p className="text-[11px] text-emerald-800 leading-relaxed">
              You can search, compare, and receive explainable eligibility matches for 100% of scholarships without uploading any certificates. This vault is purely an optional personal locker. Uploaded documents are kept strictly private, encrypted, and are <strong>never sent to TinyFish, search indexers, or third parties</strong>.
            </p>
          </div>
        </div>

        {/* Documents Grid / List */}
        {documents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-base">Your Document Vault is Empty</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You don't need any documents to discover scholarships. If you'd like to keep copies of your Income Certificate or 12th Marksheet for easy application submission, upload them below.
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700"
            >
              Upload First Document
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-start justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {doc.docType.replace(/_/g, ' ')}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 truncate">
                    {doc.title}
                  </h3>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span>{doc.fileName}</span>
                    <span>•</span>
                    <span>{(doc.fileSize / 1024).toFixed(0)} KB</span>
                    <span>•</span>
                    <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => alert(`Opening secure authenticated stream for: ${doc.fileName}`)}
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                    title="Download / View"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteDocument(doc.id)}
                    className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-slate-50"
                    title="Delete document"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-blue-600" />
                <span>Upload to Secure Student Vault</span>
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Document Category
                </label>
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value as DocumentType)}
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="marksheets">Academic Marksheet (10th/12th/Semester)</option>
                  <option value="income_certificate">Income Certificate (Tehsildar/Revenue)</option>
                  <option value="domicile_certificate">Domicile / Residence Certificate</option>
                  <option value="caste_category_certificate">Caste / Category Certificate (SC/ST/OBC/EWS)</option>
                  <option value="bonafide_certificate">Bonafide / Enrollment Certificate from College</option>
                  <option value="disability_certificate">Disability / PwD Certificate</option>
                  <option value="other">Other Supporting Verification File</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Document Title / Label
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Class 12 Board Marksheet (UP Board 2024)"
                  className="w-full text-xs p-2.5 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Choose File (PDF, JPG, PNG &lt; 5MB)
                </label>
                <input
                  type="file"
                  onChange={handleFileSimulate}
                  accept=".pdf,.jpg,.jpeg,.png"
                  className="w-full text-xs p-2 border border-slate-300 rounded-lg file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              {/* Explicit Consent Checkbox */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="consent"
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded mt-0.5"
                />
                <label htmlFor="consent" className="text-[11px] leading-relaxed cursor-pointer">
                  I give explicit consent to store this document in my private student vault. I understand this document will never be shared publicly or transmitted in external search crawls.
                </label>
              </div>

              {uploadError && (
                <div className="text-xs text-rose-600 bg-rose-50 p-2 rounded-lg border border-rose-200">
                  {uploadError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700"
                >
                  Confirm & Save File
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
