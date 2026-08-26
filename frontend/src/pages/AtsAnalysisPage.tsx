import React, { useEffect, useState } from 'react';
import {
  FileText,
  XCircle,
  Sparkles,
  BarChart,
  CheckCircle2,
  AlertCircle,
  Upload,
  FileCheck,
  RefreshCw,
  Search,
  Activity,
  Copy,
} from 'lucide-react';
import toast from 'react-hot-toast';
import StudentLayout from '../layouts/StudentLayout';
import { intelligenceService, AtsScoreData } from '../services/intelligenceService';
import { fetchGroqResumeReview } from '../services/aiService';
import SectionHeader from '../components/ui/SectionHeader';
import { GlassCard } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { SkeletonCard } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import AnimatedCounter from '../components/ui/AnimatedCounter';

export default function AtsAnalysisPage(): React.ReactElement {
  const [ats, setAts] = useState<AtsScoreData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Interactive Upload & Analysis State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [detailedReview, setDetailedReview] = useState<any | null>(null);

  useEffect(() => {
    fetchAts();
  }, []);

  const fetchAts = async () => {
    setIsLoading(true);
    try {
      const data = await intelligenceService.getAtsScore();
      setAts(data);
    } catch (err: any) {
      console.error('Failed to load initial ATS score:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const validateAndSetFile = (file: File) => {
    setUploadError(null);
    const maxSizeBytes = 5 * 1024 * 1024; // 5 MB
    const validExtensions = ['.pdf', '.docx', '.doc'];
    const fileNameLower = file.name.toLowerCase();

    const isValidExt = validExtensions.some((ext) => fileNameLower.endsWith(ext));
    if (!isValidExt) {
      const err = 'Invalid file format. Please select a PDF, DOC, or DOCX document.';
      setUploadError(err);
      toast.error(err);
      setSelectedFile(null);
      return;
    }

    if (file.size > maxSizeBytes) {
      const err = `File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds the 5 MB limit.`;
      setUploadError(err);
      toast.error(err);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    toast.success(`Loaded ${file.name}`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndSetFile(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleUploadResume = async () => {
    if (!selectedFile) {
      toast.error('Please select a PDF or DOCX resume to upload.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(25);
    setUploadError(null);

    try {
      setUploadProgress(60);
      let result: any = null;
      try {
        result = await intelligenceService.analyzeAtsResume(selectedFile);
      } catch (backendErr) {
        console.warn('Backend resume review failed, attempting direct Groq AI ATS parser:', backendErr);
      }

      if (!result) {
        let textContent = '';
        try {
          textContent = await selectedFile.text();
        } catch {
          textContent = selectedFile.name;
        }
        result = await fetchGroqResumeReview(textContent, selectedFile.name);
      }

      setUploadProgress(100);
      setDetailedReview(result);

      if (result) {
        const sectionMap: Record<string, boolean> = {};
        if (result.heatmap && Array.isArray(result.heatmap)) {
          result.heatmap.forEach((item: any) => {
            sectionMap[String(item.section)] = item.status === 'Present' || item.status === 'Partial';
          });
        }

        const updatedAtsData: AtsScoreData = {
          atsScore: result.score || 0,
          sectionCompleteness: Object.keys(sectionMap).length > 0 ? (sectionMap as any) : ats?.sectionCompleteness || {},
          keywordDensityScore: result.keywords?.coveragePercentage || 0,
          suggestions: result.insights && Array.isArray(result.insights)
            ? result.insights.map((i: any) => typeof i === 'string' ? i : i.description)
            : ats?.suggestions || [],
          missingSections: result.heatmap && Array.isArray(result.heatmap)
            ? result.heatmap.filter((i: any) => i.status === 'Missing').map((i: any) => i.section)
            : ats?.missingSections || [],
        };

        setAts(updatedAtsData);
        toast.success(`Resume analyzed! Quality Score: ${result.score}/100`);
      } else {
        throw new Error('Failed to analyze resume file.');
      }
    } catch (err: any) {
      console.error(err);
      const errorMsg = err.response?.data?.message || err.customUserMessage || err.message || 'Failed to analyze resume.';
      setUploadError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied suggestion to clipboard!');
  };

  const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-emerald-500/20 to-emerald-500/5';
    if (score >= 60) return 'from-amber-500/20 to-amber-500/5';
    return 'from-rose-500/20 to-rose-500/5';
  };

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        <SectionHeader
          title="ATS Resume Analyzer"
          subtitle="Deterministic ATS compatibility evaluation of keyword density, section headers, formatting, and machine readability."
          badge="Intelligence Engine"
          icon={<FileText className="h-6 w-6 text-emerald-500" />}
        />

        {/* INTERACTIVE RESUME UPLOADER ZONE */}
        <GlassCard padding="lg" className="border-surface-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                <Upload className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-content-primary">Upload Resume for Real-time ATS Parsing</h3>
                <p className="text-xs text-content-secondary">Upload PDF or DOCX format (Max 5 MB)</p>
              </div>
            </div>
            {selectedFile && (
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setDetailedReview(null);
                }}
                className="text-xs text-content-secondary hover:text-rose-500 transition-colors"
              >
                Clear file
              </button>
            )}
          </div>

          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
              selectedFile
                ? 'border-emerald-500/50 bg-emerald-500/5'
                : 'border-surface-border hover:border-emerald-500/30 bg-surface-card hover:bg-surface-hover'
            }`}
          >
            <input
              type="file"
              id="ats-resume-input"
              accept=".pdf,.docx,.doc"
              onChange={handleFileChange}
              className="hidden"
            />

            {selectedFile ? (
              <div className="space-y-3">
                <div className="h-12 w-12 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                  <FileCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-content-primary">{selectedFile.name}</p>
                  <p className="text-xs text-content-secondary font-mono mt-0.5">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || 'Document'}
                  </p>
                </div>
                <label
                  htmlFor="ats-resume-input"
                  className="inline-block text-xs text-emerald-500 hover:underline cursor-pointer font-medium"
                >
                  Change file
                </label>
              </div>
            ) : (
              <label htmlFor="ats-resume-input" className="cursor-pointer space-y-3 block">
                <div className="h-12 w-12 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <Upload className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-content-primary">
                    Click to upload or drag & drop your resume file
                  </p>
                  <p className="text-xs text-content-secondary mt-1">PDF or DOCX documents up to 5 MB</p>
                </div>
              </label>
            )}
          </div>

          {uploadError && (
            <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-rose-500 text-xs font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {isUploading && (
            <div className="mt-4 space-y-1.5">
              <div className="flex justify-between text-xs text-emerald-500 font-medium">
                <span>Analyzing document with Apache Tika...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 bg-surface-hover rounded-full overflow-hidden border border-surface-border">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          <div className="mt-5 flex justify-end">
            <button
              onClick={handleUploadResume}
              disabled={!selectedFile || isUploading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Analyzing Resume...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Upload & Analyze ATS Resume
                </>
              )}
            </button>
          </div>
        </GlassCard>

        {isLoading ? (
          <div className="space-y-6">
            <SkeletonCard className="h-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkeletonCard className="h-[300px]" />
              <SkeletonCard className="h-[300px]" />
            </div>
          </div>
        ) : ats ? (
          <div className="space-y-6 animate-fade-up">
            {/* Header Score Card */}
            <GlassCard
              padding="none"
              className={`overflow-hidden border-2 transition-colors ${
                ats.atsScore >= 80
                  ? 'border-emerald-500/30 shadow-sm'
                  : ats.atsScore >= 60
                  ? 'border-amber-500/30'
                  : 'border-rose-500/30'
              }`}
            >
              <div
                className={`bg-gradient-to-br ${getScoreGradient(
                  ats.atsScore
                )} p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative`}
              >
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                  <BarChart className="w-64 h-64" />
                </div>

                <div className="relative z-10 text-center md:text-left flex-1 max-w-xl">
                  <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                    <Badge variant={ats.atsScore >= 80 ? 'emerald' : ats.atsScore >= 60 ? 'warning' : 'error'}>
                      ATS Compatibility
                    </Badge>
                    {detailedReview?.grade && (
                      <Badge variant="emerald" size="md">
                        Grade: {detailedReview.grade}
                      </Badge>
                    )}
                  </div>
                  <h3 className="text-4xl sm:text-5xl font-black text-content-primary mt-4 mb-3 tracking-tight">
                    Resume Quality Score
                  </h3>
                  <p className="text-base text-content-secondary leading-relaxed font-medium">
                    Measures whether applicant tracking systems (ATS) can parse your contact info, technical skills, and project history cleanly without data loss.
                  </p>
                </div>

                <div className="relative z-10 shrink-0">
                  <div className="relative flex items-center justify-center">
                    <svg className="w-48 h-48 transform -rotate-90">
                      <circle
                        className="text-surface-hover"
                        strokeWidth="12"
                        stroke="currentColor"
                        fill="transparent"
                        r="88"
                        cx="96"
                        cy="96"
                      />
                      <circle
                        className={
                          ats.atsScore >= 80
                            ? 'text-emerald-500'
                            : ats.atsScore >= 60
                            ? 'text-amber-500'
                            : 'text-rose-500'
                        }
                        strokeWidth="12"
                        strokeDasharray={88 * 2 * Math.PI}
                        strokeDashoffset={88 * 2 * Math.PI - (ats.atsScore / 100) * 88 * 2 * Math.PI}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="88"
                        cx="96"
                        cy="96"
                        style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="text-5xl font-black text-content-primary tabular-nums tracking-tighter">
                        <AnimatedCounter target={ats.atsScore} />
                      </span>
                      <span className="text-xs font-bold uppercase tracking-widest text-content-secondary mt-1">/ 100</span>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* DETAILED CATEGORY BREAKDOWN (IF AVAILABLE) */}
            {detailedReview?.atsCategoryBreakdown && (
              <GlassCard padding="lg" className="border-surface-border shadow-sm space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="h-5 w-5 text-emerald-500" />
                  <h3 className="text-lg font-bold text-content-primary">Detailed Category Breakdown</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {detailedReview.atsCategoryBreakdown.map((cat: any) => {
                    const pct = Math.round((cat.currentScore / cat.maxScore) * 100);
                    return (
                      <div key={cat.category} className="p-3.5 rounded-xl bg-surface-hover border border-surface-border space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="font-bold text-content-primary">{cat.category}</span>
                          <span className="font-mono font-bold text-emerald-500">{cat.currentScore} / {cat.maxScore}</span>
                        </div>
                        <div className="w-full h-2 bg-surface-base rounded-full overflow-hidden border border-surface-border">
                          <div
                            className={`h-full rounded-full ${pct >= 80 ? 'bg-emerald-500' : pct >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className="text-[11px] text-content-secondary">{cat.explanation}</p>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            )}

            {/* DETAILED KEYWORD ANALYSIS (IF AVAILABLE) */}
            {detailedReview?.keywords && (
              <GlassCard padding="lg" className="border-surface-border shadow-sm space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Search className="h-5 w-5 text-emerald-500" />
                    <h3 className="text-lg font-bold text-content-primary">Software Engineering Keywords Analysis</h3>
                  </div>
                  <span className="text-sm font-bold text-emerald-500">
                    Coverage: {detailedReview.keywords.coveragePercentage}%
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                      Matched Keywords ({detailedReview.keywords.matchedKeywords.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {detailedReview.keywords.matchedKeywords.map((kw: string) => (
                        <span key={kw} className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-600 dark:text-emerald-400">
                          ✓ {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 space-y-2">
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                      Missing Keywords ({detailedReview.keywords.missingKeywords.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {detailedReview.keywords.missingKeywords.map((kw: string) => (
                        <span key={kw} className="px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400">
                          + {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </GlassCard>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Section Completeness */}
              <GlassCard padding="lg" className="flex flex-col h-full border border-surface-border">
                <div className="flex items-center gap-2 mb-6 shrink-0">
                  <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <Sparkles className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-lg font-bold text-content-primary">Section Completeness</h3>
                </div>

                <div className="grid grid-cols-1 gap-3 flex-1">
                  {Object.entries(ats.sectionCompleteness || {}).map(([sec, present]) => (
                    <div
                      key={sec}
                      className={`p-4 rounded-xl border flex items-center justify-between transition-colors group ${
                        present
                          ? 'bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10'
                          : 'bg-rose-500/5 border-rose-500/20 hover:bg-rose-500/10'
                      }`}
                    >
                      <span className={`text-sm font-semibold capitalize tracking-tight ${present ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {sec.replace(/_/g, ' ')}
                      </span>
                      {present ? (
                        <div className="flex items-center gap-2 text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Found
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-rose-500 bg-rose-500/10 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                          <XCircle className="h-3.5 w-3.5" /> Missing
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Optimization Suggestions */}
              <GlassCard padding="lg" className="flex flex-col h-full border border-surface-border">
                <div className="flex items-center gap-2 mb-6 shrink-0">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <AlertCircle className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-lg font-bold text-content-primary">Optimization Suggestions</h3>
                </div>

                {ats.suggestions.length === 0 ? (
                  <EmptyState
                    icon={<CheckCircle2 className="text-emerald-500" />}
                    title="Perfect Structure"
                    description="Your resume document passes all basic ATS criteria cleanly!"
                    className="flex-1"
                  />
                ) : (
                  <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2 max-h-[400px]">
                    {ats.suggestions.map((sug, idx) => (
                      <div
                        key={idx}
                        className="group p-4 rounded-xl bg-surface-hover border border-surface-border text-content-primary text-sm flex items-start justify-between gap-3 hover:border-emerald-500/30 transition-all"
                      >
                        <div className="flex items-start gap-3">
                          <div className="h-6 w-6 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 text-xs font-bold font-mono mt-0.5 border border-emerald-500/20">
                            {idx + 1}
                          </div>
                          <span className="leading-relaxed font-medium">{sug}</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(sug)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-content-secondary hover:text-content-primary"
                          title="Copy suggestion"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </div>
          </div>
        ) : null}
      </div>
    </StudentLayout>
  );
}
