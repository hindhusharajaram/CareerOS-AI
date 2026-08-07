import React, { useEffect, useState } from 'react';
import { UploadCloud, File, Download, Image as ImageIcon, FileText, Award, Folder } from 'lucide-react';
import toast from 'react-hot-toast';
import StudentLayout from '../layouts/StudentLayout';
import { fileService, FileMetadataData } from '../services/fileService';
import SectionHeader from '../components/ui/SectionHeader';
import { GlassCard } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';

export default function UploadCenterPage(): React.ReactElement {
  const [files, setFiles] = useState<FileMetadataData[]>([]);
  const [uploadType, setUploadType] = useState('RESUME');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const list = await fileService.listFiles();
      setFiles(list);
    } catch {
      toast.error('Could not fetch uploaded files.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size exceeds maximum limit of 10MB.');
      return;
    }

    setIsUploading(true);
    const loadingToast = toast.loading(`Uploading ${file.name}...`);
    try {
      const uploaded = await fileService.uploadFile(file, uploadType);
      setFiles((prev) => [uploaded, ...prev]);
      toast.success(`File uploaded successfully!`, { id: loadingToast });
    } catch {
      toast.error('Failed to upload file.', { id: loadingToast });
    } finally {
      setIsUploading(false);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'RESUME':
        return <FileText className="h-5 w-5 text-emerald-500" />;
      case 'CERTIFICATE':
        return <Award className="h-5 w-5 text-emerald-500" />;
      case 'PROFILE_PHOTO':
        return <ImageIcon className="h-5 w-5 text-emerald-500" />;
      default:
        return <File className="h-5 w-5 text-content-secondary" />;
    }
  };

  const getVariantForType = (type: string) => {
    switch (type) {
      case 'RESUME': return 'emerald';
      case 'CERTIFICATE': return 'emerald';
      case 'PROFILE_PHOTO': return 'emerald';
      default: return 'default';
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        <SectionHeader
          title="Document Hub"
          subtitle="Securely upload and manage resumes, certificates, and profile photos."
          badge="Cloud Storage"
          icon={<UploadCloud className="h-6 w-6 text-emerald-500" />}
        />

        {/* Upload Zone */}
        <GlassCard padding="lg" className="border-dashed border-2 border-surface-border hover:border-emerald-500/40 transition-colors">
          <div className="max-w-xl mx-auto space-y-8 py-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-content-secondary mb-2">Select Upload Purpose</label>
              <div className="relative">
                <Folder className="absolute left-3.5 top-3.5 h-4 w-4 text-content-muted pointer-events-none" />
                <select
                  value={uploadType}
                  onChange={(e) => setUploadType(e.target.value)}
                  className="w-full rounded-xl border border-surface-border bg-surface-card py-3 pl-10 pr-10 text-sm text-content-primary focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/40 transition-all appearance-none cursor-pointer"
                >
                  <option value="RESUME">Resume Document (PDF, DOCX)</option>
                  <option value="CERTIFICATE">Certificate (PDF, PNG, JPG)</option>
                  <option value="PROFILE_PHOTO">Profile Photo (PNG, JPG)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <svg className="w-4 h-4 text-content-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <label className="cursor-pointer rounded-2xl p-10 flex flex-col items-center justify-center bg-surface-card hover:bg-surface-hover transition-all duration-300 group relative overflow-hidden border border-surface-border">
              <div className="h-16 w-16 rounded-full bg-surface-hover flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-300 group-hover:bg-emerald-500/20 group-hover:text-emerald-500 text-content-secondary">
                <UploadCloud className="h-8 w-8" />
              </div>
              <p className="text-base font-bold text-content-primary mb-2">Click to select file or drag & drop</p>
              <p className="text-xs text-content-secondary font-medium bg-surface-hover px-3 py-1 rounded-full border border-surface-border">Maximum file size: 10 MB</p>
              <input type="file" onChange={handleFileChange} className="hidden" disabled={isUploading} />
            </label>
          </div>
        </GlassCard>

        {/* Document Repository List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-content-primary flex items-center gap-2">
              <Folder className="h-5 w-5 text-emerald-500" />
              Document Repository
            </h3>
            <Badge variant="emerald">{files.length} Files</Badge>
          </div>

          {isLoading ? (
            <div className="py-12 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
            </div>
          ) : files.length === 0 ? (
            <EmptyState
              icon={<File />}
              title="No files uploaded"
              description="Upload your first document above to store it securely in the cloud."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {files.map((file) => (
                <div key={file.id} className="group flex items-center justify-between p-4 rounded-2xl border border-surface-border bg-surface-card hover:bg-surface-hover transition-all duration-200 shadow-sm">
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className="p-3 rounded-xl bg-surface-hover border border-surface-border shrink-0 transition-colors">
                      {getIconForType(file.uploadType)}
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-bold text-content-primary truncate mb-1">{file.originalFilename}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant={getVariantForType(file.uploadType)} size="sm">
                          {file.uploadType}
                        </Badge>
                        <span className="text-[10px] font-mono text-content-secondary bg-surface-hover border border-surface-border px-1.5 py-0.5 rounded">
                          {(file.fileSize / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    </div>
                  </div>
                  <a
                    href={fileService.getDownloadUrl(file.id)}
                    download
                    className="p-2.5 text-content-secondary hover:text-content-primary hover:bg-surface-hover rounded-xl transition-all ml-4 shrink-0"
                    title="Download File"
                  >
                    <Download className="h-4.5 w-4.5" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
