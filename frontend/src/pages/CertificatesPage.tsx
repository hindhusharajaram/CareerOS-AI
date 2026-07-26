import React, { useEffect, useState } from 'react';
import { Award, Plus, Trash2, ExternalLink, Calendar, Link as LinkIcon, Building2 } from 'lucide-react';
import toast from 'react-hot-toast';
import StudentLayout from '../layouts/StudentLayout';
import { studentService, CertificateItem } from '../services/studentService';
import SectionHeader from '../components/ui/SectionHeader';
import { GlassCard } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonCard } from '../components/ui/Skeleton';

export default function CertificatesPage(): React.ReactElement {
  const [certificates, setCertificates] = useState<CertificateItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const [title, setTitle] = useState('');
  const [provider, setProvider] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    setIsLoading(true);
    try {
      const list = await studentService.getCertificates();
      setCertificates(list);
    } catch (err) {
      toast.error('Could not fetch certificates.');
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
      toast.success('Certificate added successfully');
    } catch (err) {
      toast.error('Failed to add certificate.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await studentService.deleteCertificate(id);
      setCertificates((prev) => prev.filter((c) => c.id !== id));
      toast.success('Certificate deleted');
    } catch (err) {
      toast.error('Failed to delete certificate.');
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        <SectionHeader
          title="Certifications & Credentials"
          subtitle="Manage verified credentials from AWS, Coursera, Oracle, and more."
          badge="Profile Data"
          icon={<Award className="h-6 w-6" />}
        />

        {/* Add Certificate Form */}
        <GlassCard padding="lg">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Plus className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-lg font-bold text-white">Add Certification</h3>
          </div>
          
          <form onSubmit={handleAdd} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Certification Title</label>
                <div className="relative">
                  <Award className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. AWS Certified Solutions Architect"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:bg-slate-900 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Issuing Provider</label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amazon Web Services, Coursera"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:bg-slate-900 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Issue Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="e.g. Jan 2025"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:bg-slate-900 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Credential URL</label>
                <div className="relative">
                  <LinkIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="url"
                    placeholder="https://credly.com/org/certificate"
                    value={credentialUrl}
                    onChange={(e) => setCredentialUrl(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:bg-slate-900 focus:ring-1 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <Button
                type="submit"
                disabled={isAdding || !title || !provider}
                isLoading={isAdding}
                variant="primary"
                icon={<Plus className="h-4 w-4" />}
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border-none text-white shadow-lg shadow-emerald-500/20"
              >
                Save Certificate
              </Button>
            </div>
          </form>
        </GlassCard>

        {/* List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-emerald-400" />
              Earned Certifications
            </h3>
            <Badge variant="emerald">{certificates.length} Credentials</Badge>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} className="h-32" />)}
            </div>
          ) : certificates.length === 0 ? (
            <EmptyState
              icon={<Award />}
              title="No certifications added"
              description="Showcase your professional credentials to stand out to employers."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {certificates.map((cert) => (
                <div key={cert.id} className="group flex flex-col justify-between p-6 rounded-2xl border border-slate-800/80 bg-slate-900/50 hover:bg-slate-900/80 hover:border-slate-700 transition-all duration-300 card-interactive">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
                        {cert.provider}
                      </span>
                      <h4 className="text-lg font-bold text-white leading-tight">{cert.title}</h4>
                    </div>
                    <button
                      onClick={() => handleDelete(cert.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0"
                      title="Delete Record"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800/60">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                      {cert.issueDate && (
                        <>
                          <Calendar className="h-3.5 w-3.5" />
                          Issued: {cert.issueDate}
                        </>
                      )}
                    </div>
                    
                    {cert.credentialUrl && (
                      <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors bg-emerald-500/10 hover:bg-emerald-500/20 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                        <ExternalLink className="h-3.5 w-3.5" /> Verify
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
