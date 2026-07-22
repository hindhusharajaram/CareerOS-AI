import React, { useEffect, useState } from 'react';
import { Award, Plus, Trash2, ExternalLink, Calendar, AlertCircle } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { studentService, CertificateItem } from '../services/studentService';

export default function CertificatesPage(): React.ReactElement {
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [provider, setProvider] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    setIsLoading(true);
    setError('');
    try {
      const list = await studentService.getCertificates();
      setCertificates(list);
    } catch (err) {
      setError('Could not fetch certificates.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !provider) return;
    setIsAdding(true);
    try {
      const created = await studentService.addCertificate({
        title,
        provider,
        issueDate,
        credentialUrl
      });
      setCertificates((prev) => [created, ...prev]);
      setTitle('');
      setProvider('');
      setIssueDate('');
      setCredentialUrl('');
    } catch (err) {
      setError('Failed to add certificate.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await studentService.deleteCertificate(id);
      setCertificates((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError('Failed to delete certificate.');
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="border-b border-slate-800 pb-5">
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Award className="h-6 w-6 text-emerald-400" />
            Certifications & Credentials
          </h2>
          <p className="text-xs text-slate-400 mt-1">Manage verified credentials from AWS, Coursera, Oracle, and educational bodies</p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Add Certificate Form */}
        <form onSubmit={handleAdd} className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Plus className="h-5 w-5 text-emerald-400" />
            Add Certification
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Certification Title</label>
              <input
                type="text"
                required
                placeholder="e.g. AWS Certified Solutions Architect"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Issuing Provider</label>
              <input
                type="text"
                required
                placeholder="e.g. Amazon Web Services, Coursera"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Issue Date</label>
              <input
                type="text"
                placeholder="e.g. Jan 2025"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Credential URL</label>
              <input
                type="url"
                placeholder="https://credly.com/org/certificate"
                value={credentialUrl}
                onChange={(e) => setCredentialUrl(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isAdding}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:from-emerald-500 hover:to-teal-500 transition duration-300 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              {isAdding ? 'Adding...' : 'Add Certificate'}
            </button>
          </div>
        </form>

        {/* List */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Earned Certifications ({certificates.length})</h3>
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
            </div>
          ) : certificates.length === 0 ? (
            <div className="py-12 text-center text-slate-500 bg-slate-900/30 rounded-3xl border border-slate-800">
              <Award className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No certifications added yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {certificates.map((cert) => (
                <div key={cert.id} className="flex items-start justify-between p-6 rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-md">
                  <div>
                    <span className="px-2.5 py-0.5 rounded text-[10px] uppercase font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {cert.provider}
                    </span>
                    <h4 className="text-lg font-bold text-white mt-2">{cert.title}</h4>
                    {cert.issueDate && (
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-2">
                        <Calendar className="h-3.5 w-3.5" /> Issued: {cert.issueDate}
                      </p>
                    )}
                    {cert.credentialUrl && (
                      <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 mt-3 font-semibold">
                        <ExternalLink className="h-3.5 w-3.5" /> Verify Credential
                      </a>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(cert.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
