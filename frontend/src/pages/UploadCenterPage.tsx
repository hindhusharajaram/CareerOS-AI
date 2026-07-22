import React, { useEffect, useState } from 'react';
import { UploadCloud, File, Download, AlertCircle, CheckCircle2, Image, FileText, Award } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { fileService, FileMetadataData } from '../services/fileService';

export default function UploadCenterPage(): React.ReactElement {
  const [files, setFiles] = useState<FileMetadataData[]>([]);
  const [uploadType, setUploadType] = useState('RESUME');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setIsLoading(true);
    setError('');
    try {
      const list = await fileService.listFiles();
      setFiles(list);
    } catch (err) {
      setError('Could not fetch uploaded files.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Size Validation (Max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File size exceeds maximum limit of 10MB.');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccessMsg('');
    try {
      const uploaded = await fileService.uploadFile(file, uploadType);
      setFiles((prev) => [uploaded, ...prev]);
      setSuccessMsg(`File "${file.name}" uploaded successfully!`);
    } catch (err) {
      setError('Failed to upload file.');
    } finally {
      setIsUploading(false);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'RESUME':
        return <FileText className="h-5 w-5 text-indigo-400" />;
      case 'CERTIFICATE':
        return <Award className="h-5 w-5 text-emerald-400" />;
      case 'PROFILE_PHOTO':
        return <Image className="h-5 w-5 text-purple-400" />;
      default:
        return <File className="h-5 w-5 text-slate-400" />;
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="border-b border-slate-800 pb-5">
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <UploadCloud className="h-6 w-6 text-indigo-400" />
            File Upload Center & Document Hub
          </h2>
          <p className="text-xs text-slate-400 mt-1">Upload resumes, certificates, and photos with format and size validation</p>
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

        {/* Upload Zone */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-md space-y-6 text-center">
          <div className="max-w-md mx-auto space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-2">Select Upload Purpose</label>
              <select
                value={uploadType}
                onChange={(e) => setUploadType(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="RESUME">Resume Document (PDF, DOCX)</option>
                <option value="CERTIFICATE">Certificate (PDF, PNG, JPG)</option>
                <option value="PROFILE_PHOTO">Profile Photo (PNG, JPG)</option>
              </select>
            </div>

            <label className="cursor-pointer border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-3xl p-8 flex flex-col items-center justify-center bg-slate-950/40 transition duration-300 group">
              <UploadCloud className="h-12 w-12 text-slate-500 group-hover:text-indigo-400 transition" />
              <p className="mt-3 text-sm font-bold text-white">Click to select file or drag & drop</p>
              <p className="text-xs text-slate-500 mt-1">Maximum file size: 10 MB</p>
              <input type="file" onChange={handleFileChange} className="hidden" disabled={isUploading} />
            </label>
          </div>
        </div>

        {/* Document Repository List */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-4">
          <h3 className="text-lg font-bold text-white">Document Repository ({files.length})</h3>

          {isLoading ? (
            <div className="py-12 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
            </div>
          ) : files.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <File className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No files uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-800 bg-slate-950/60">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 shrink-0">
                      {getIconForType(file.uploadType)}
                    </div>
                    <div className="truncate">
                      <p className="text-sm font-bold text-white truncate">{file.originalFilename}</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {file.uploadType} • {(file.fileSize / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <a
                    href={fileService.getDownloadUrl(file.id)}
                    download
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
                    title="Download File"
                  >
                    <Download className="h-4 w-4" />
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
