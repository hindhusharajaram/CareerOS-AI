import React, { useEffect, useState } from 'react';
import { FileText, Upload, CheckCircle2, Trash2, Download, Eye, FileCheck, Info } from 'lucide-react';
import toast from 'react-hot-toast';
import StudentLayout from '../layouts/StudentLayout';
import { resumeService, ResumeData } from '../services/resumeService';
import { fileService } from '../services/fileService';
import SectionHeader from '../components/ui/SectionHeader';
import { GlassCard } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';

export default function ResumeManagerPage(): React.ReactElement {
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [selectedResume, setSelectedResume] = useState<ResumeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setIsLoading(true);
    try {
      const list = await resumeService.getResumes();
      setResumes(list);
      if (list.length > 0) {
        setSelectedResume(list.find((r) => r.isActive) || list[0]);
      }
    } catch (err) {
      toast.error('Could not fetch resume versions.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.pdf') && !file.name.endsWith('.docx') && !file.name.endsWith('.doc')) {
      toast.error('Only PDF and DOCX resume formats are supported.');
      return;
    }

    setIsUploading(true);
    const loadingToast = toast.loading('Uploading and parsing your resume...');
    
    try {
      const newResume = await resumeService.uploadResume(file);
      setResumes((prev) => [newResume, ...prev.map((r) => ({ ...r, isActive: false }))]);
      setSelectedResume(newResume);
      toast.success('Resume uploaded, parsed, and set as active version!', { id: loadingToast });
    } catch (err) {
      toast.error('Failed to upload and parse resume file.', { id: loadingToast });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSetActive = async (id: string) => {
    try {
      const updated = await resumeService.setActive(id);
      setResumes((prev) => prev.map((r) => ({ ...r, isActive: r.id === id })));
      setSelectedResume(updated);
      toast.success(`Version ${updated.version} set as active resume!`);
    } catch (err) {
      toast.error('Failed to update active resume version.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await resumeService.deleteResume(id);
      setResumes((prev) => prev.filter((r) => r.id !== id));
      if (selectedResume?.id === id) {
        setSelectedResume(null);
      }
      toast.success('Resume version deleted.');
    } catch (err) {
      toast.error('Failed to delete resume version.');
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-6xl mx-auto space-y-6 pb-20">
        <SectionHeader
          title="Resume Manager"
          subtitle="Version control for your resumes. Upload, parse, and track ATS extracted content."
          badge="Documents"
          icon={<FileText className="h-6 w-6" />}
          action={
            <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-purple-500 transition-all duration-300">
              <Upload className="h-4 w-4" />
              {isUploading ? 'Parsing...' : 'Upload New Resume'}
              <input type="file" accept=".pdf,.docx,.doc" onChange={handleFileUpload} className="hidden" disabled={isUploading} />
            </label>
          }
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Version History List */}
          <GlassCard padding="lg" className="lg:col-span-1 flex flex-col max-h-[800px]">
            <div className="flex items-center justify-between mb-6 shrink-0">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <FileCheck className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-lg font-bold text-white">Version History</h3>
              </div>
              <Badge variant="indigo">{resumes.length}</Badge>
            </div>

            {isLoading ? (
              <div className="py-12 flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
              </div>
            ) : resumes.length === 0 ? (
              <EmptyState
                icon={<FileText />}
                title="No resumes"
                description="Upload a resume to get started."
                className="py-12"
              />
            ) : (
              <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1 pb-4">
                {resumes.map((res) => (
                  <div
                    key={res.id}
                    onClick={() => setSelectedResume(res)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer group ${
                      selectedResume?.id === res.id
                        ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                        : 'border-slate-800/80 bg-slate-900/50 hover:bg-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="font-bold text-white text-sm">Version {res.version}</span>
                        <p className="text-xs text-slate-400 truncate mt-0.5 max-w-[160px]" title={res.file?.originalFilename}>
                          {res.file?.originalFilename}
                        </p>
                      </div>
                      {res.isActive ? (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 shrink-0">
                          <CheckCircle2 className="h-3 w-3" /> Active
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetActive(res.id);
                          }}
                          className="text-[11px] font-bold uppercase tracking-wider text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded-md hover:bg-indigo-500/10 transition-colors shrink-0"
                        >
                          Set Active
                        </button>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-800/60 text-[11px] text-slate-500">
                      <span className="font-mono">{(res.file?.fileSize / 1024).toFixed(1)} KB</span>
                      <div className="flex items-center gap-1">
                        <a
                          href={fileService.getDownloadUrl(res.file?.id)}
                          download
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                          title="Download PDF"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(res.id);
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                          title="Delete Version"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* ATS Extracted Preview Panel */}
          <GlassCard padding="lg" className="lg:col-span-2 flex flex-col h-[800px]">
            <div className="flex items-center gap-2 mb-6 shrink-0">
              <div className="h-8 w-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                <Eye className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-lg font-bold text-white">ATS Extracted Data</h3>
            </div>

            {selectedResume ? (
              <div className="flex-1 flex flex-col space-y-4 min-h-0">
                <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm shrink-0">
                  <div className="flex items-center gap-2 text-indigo-100">
                    <FileText className="h-4 w-4 text-indigo-400" />
                    <span className="font-medium truncate max-w-[200px] sm:max-w-xs">{selectedResume.file?.originalFilename}</span>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="indigo">v{selectedResume.version}</Badge>
                    <Badge variant="default">{selectedResume.isActive ? 'Active Profile Data' : 'Archived'}</Badge>
                  </div>
                </div>

                <div className="bg-slate-900/80 rounded-xl p-6 border border-slate-800/80 font-mono text-sm text-slate-300 overflow-y-auto custom-scrollbar leading-relaxed whitespace-pre-wrap flex-1 shadow-inner relative">
                  {selectedResume.parsedContent || (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500">
                      <Info className="h-8 w-8 mb-2 opacity-50" />
                      <p>No text could be extracted from this document.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <EmptyState
                icon={<Eye />}
                title="No preview available"
                description="Select a resume version from the left panel to inspect its extracted ATS content."
                className="flex-1"
              />
            )}
          </GlassCard>
        </div>
      </div>
    </StudentLayout>
  );
}
