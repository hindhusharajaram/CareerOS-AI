import React, { useEffect, useState } from 'react';
import { FileText, Upload, CheckCircle2, Trash2, Download, Eye, AlertCircle, FileCheck } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { resumeService, ResumeData } from '../services/resumeService';
import { fileService } from '../services/fileService';

export default function ResumeManagerPage(): React.ReactElement {
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [selectedResume, setSelectedResume] = useState<ResumeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    setIsLoading(true);
    setError('');
    try {
      const list = await resumeService.getResumes();
      setResumes(list);
      if (list.length > 0) {
        setSelectedResume(list.find((r) => r.isActive) || list[0]);
      }
    } catch (err) {
      setError('Could not fetch resume versions.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.pdf') && !file.name.endsWith('.docx') && !file.name.endsWith('.doc')) {
      setError('Only PDF and DOCX resume formats are supported.');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccessMsg('');
    try {
      const newResume = await resumeService.uploadResume(file);
      setResumes((prev) => [newResume, ...prev.map((r) => ({ ...r, isActive: false }))]);
      setSelectedResume(newResume);
      setSuccessMsg('Resume uploaded, parsed, and set as active version!');
    } catch (err) {
      setError('Failed to upload and parse resume file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSetActive = async (id: string) => {
    try {
      const updated = await resumeService.setActive(id);
      setResumes((prev) => prev.map((r) => ({ ...r, isActive: r.id === id })));
      setSelectedResume(updated);
      setSuccessMsg(`Version ${updated.version} set as active resume!`);
    } catch (err) {
      setError('Failed to update active resume version.');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await resumeService.deleteResume(id);
      setResumes((prev) => prev.filter((r) => r.id !== id));
      if (selectedResume?.id === id) {
        setSelectedResume(null);
      }
    } catch (err) {
      setError('Failed to delete resume version.');
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-slate-800 pb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <FileText className="h-6 w-6 text-indigo-400" />
              Resume Manager & Version Control
            </h2>
            <p className="text-xs text-slate-400 mt-1">Upload multiple resume iterations, mark active version, and view extracted ATS content</p>
          </div>

          <label className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:from-indigo-500 hover:to-purple-500 transition duration-300">
            <Upload className="h-4 w-4" />
            {isUploading ? 'Uploading & Parsing...' : 'Upload New Resume'}
            <input type="file" accept=".pdf,.docx,.doc" onChange={handleFileUpload} className="hidden" disabled={isUploading} />
          </label>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Main Grid: Version History & ATS Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Version History List */}
          <div className="lg:col-span-1 rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-indigo-400" />
              Version History ({resumes.length})
            </h3>

            {isLoading ? (
              <div className="py-12 flex justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
              </div>
            ) : resumes.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <FileText className="h-10 w-10 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No resumes uploaded yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {resumes.map((res) => (
                  <div
                    key={res.id}
                    onClick={() => setSelectedResume(res)}
                    className={`p-4 rounded-2xl border transition cursor-pointer ${
                      selectedResume?.id === res.id
                        ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-sm">Version {res.version}</span>
                      {res.isActive ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Active
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetActive(res.id);
                          }}
                          className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold underline"
                        >
                          Make Active
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-1">{res.file?.originalFilename}</p>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/80 text-[11px] text-slate-500">
                      <span>{(res.file?.fileSize / 1024).toFixed(1)} KB</span>
                      <div className="flex items-center gap-2">
                        <a
                          href={fileService.getDownloadUrl(res.file?.id)}
                          download
                          onClick={(e) => e.stopPropagation()}
                          className="text-slate-400 hover:text-white"
                          title="Download"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </a>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(res.id);
                          }}
                          className="text-slate-400 hover:text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ATS Extracted Preview Panel */}
          <div className="lg:col-span-2 rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md flex flex-col">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4">
              <Eye className="h-5 w-5 text-purple-400" />
              ATS Extracted Content & Preview
            </h3>

            {selectedResume ? (
              <div className="flex-1 flex flex-col space-y-4">
                <div className="p-4 rounded-2xl border border-slate-800 bg-slate-950/70 flex items-center justify-between text-xs text-slate-400">
                  <span>Filename: <strong className="text-white">{selectedResume.file?.originalFilename}</strong></span>
                  <span>Version: <strong className="text-white">v{selectedResume.version}</strong></span>
                </div>

                <div className="flex-1 bg-slate-950/90 rounded-2xl p-4 border border-slate-800 font-mono text-xs text-slate-300 overflow-y-auto max-h-[500px] leading-relaxed whitespace-pre-wrap">
                  {selectedResume.parsedContent || 'No extracted text content available.'}
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-500">
                <FileText className="h-12 w-12 opacity-40 mb-3" />
                <p className="text-sm">Select a resume version from the left panel to inspect parsed ATS content.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}
