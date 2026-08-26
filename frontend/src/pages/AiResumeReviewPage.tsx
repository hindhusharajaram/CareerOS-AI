import React, { useState } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  BarChart2,
  Search,
  Sparkles,
  FileCheck,
  Copy,
  ShieldCheck,
  RefreshCw,
  Activity,
  Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';
import StudentLayout from '../layouts/StudentLayout';
import {
  resumeService,
  ResumeReviewData,
  InsightData,
  AtsCategoryScoreData,
  SectionHeatmapData,
  QuantificationBulletData,
} from '../services/resumeService';
import { fetchGroqResumeReview } from '../services/aiService';
import SectionHeader from '../components/ui/SectionHeader';
import { GlassCard } from '../components/ui/Card';
import Badge from '../components/ui/Badge';

export default function AiResumeReviewPage(): React.ReactElement {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [review, setReview] = useState<ResumeReviewData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file: File) => {
    setErrorMessage(null);
    const maxSizeBytes = 5 * 1024 * 1024; // 5 MB
    const validExtensions = ['.pdf', '.docx', '.doc'];
    const fileNameLower = file.name.toLowerCase();

    const isValidExt = validExtensions.some((ext) => fileNameLower.endsWith(ext));
    if (!isValidExt) {
      const err = 'Invalid file format. Please upload a PDF, DOC, or DOCX resume document.';
      setErrorMessage(err);
      toast.error(err);
      setSelectedFile(null);
      return;
    }

    if (file.size > maxSizeBytes) {
      const err = `File size (${(file.size / (1024 * 1024)).toFixed(2)} MB) exceeds the maximum 5 MB limit.`;
      setErrorMessage(err);
      toast.error(err);
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
    toast.success(`Selected ${file.name}`);
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

  const handleUploadAndAnalyze = async () => {
    if (!selectedFile) {
      toast.error('Please select a PDF or DOCX file to analyze.');
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    try {
      let result: any = null;
      try {
        result = await resumeService.reviewResume(selectedFile);
      } catch (backendErr) {
        console.warn('Backend resume review endpoint failed, attempting direct Groq AI ATS parser:', backendErr);
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

      if (result) {
        setReview(result);
        toast.success('Resume analysis completed successfully!');
      } else {
        throw new Error('Failed to parse or analyze resume file.');
      }
    } catch (err: any) {
      console.error(err);
      const apiErr = err.response?.data?.message || err.message || 'Failed to review resume.';
      setErrorMessage(apiErr);
      toast.error(apiErr);
    } finally {
      setIsUploading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied suggestion to clipboard!');
  };

  const getGradeVariant = (grade: string) => {
    switch (grade) {
      case 'Excellent':
        return 'emerald';
      case 'Good':
      case 'Very Good':
        return 'indigo';
      case 'Needs Improvement':
        return 'amber';
      case 'Poor':
      default:
        return 'error';
    }
  };

  const getHeatmapBadgeVariant = (status: string) => {
    switch (status) {
      case 'Present':
        return 'emerald';
      case 'Partial':
        return 'amber';
      case 'Missing':
      default:
        return 'error';
    }
  };

  const getPriorityBadgeVariant = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'error';
      case 'MEDIUM':
        return 'amber';
      case 'LOW':
      default:
        return 'indigo';
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-8 pb-20">
        <SectionHeader
          title="Resume Review & ATS Analyzer"
          subtitle="Production-grade, single-pass ATS parsing engine with Resume Health, Heatmap, Quantification Audit, and Categorized Insights."
          badge="Enterprise Intelligence"
          icon={<FileText className="h-6 w-6 text-purple-400" />}
        />

        {/* 1. CARD 1: UPLOAD RESUME CARD */}
        <GlassCard padding="lg" className="border-purple-500/20 shadow-xl shadow-purple-950/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Upload className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">1. Upload Resume</h2>
                <p className="text-xs text-slate-400">Supports PDF, DOC, and DOCX formats (Max 5 MB)</p>
              </div>
            </div>
            {selectedFile && (
              <button
                onClick={() => setSelectedFile(null)}
                className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
              >
                Clear file
              </button>
            )}
          </div>

          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
              selectedFile
                ? 'border-purple-500/50 bg-purple-500/5'
                : 'border-slate-800 hover:border-purple-500/30 bg-slate-950/40 hover:bg-slate-950/80'
            }`}
          >
            <input
              type="file"
              id="resume-upload-input"
              accept=".pdf,.docx,.doc"
              onChange={handleFileChange}
              className="hidden"
            />

            {selectedFile ? (
              <div className="space-y-3">
                <div className="h-12 w-12 mx-auto rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <FileCheck className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{selectedFile.name}</p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • {selectedFile.type || 'Document'}
                  </p>
                </div>
                <label
                  htmlFor="resume-upload-input"
                  className="inline-block text-xs text-purple-400 hover:underline cursor-pointer font-medium"
                >
                  Change selected file
                </label>
              </div>
            ) : (
              <label htmlFor="resume-upload-input" className="cursor-pointer space-y-3 block">
                <div className="h-12 w-12 mx-auto rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                  <Upload className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">
                    Click to browse or drag & drop your resume file here
                  </p>
                  <p className="text-xs text-slate-500 mt-1">PDF, DOC, or DOCX documents up to 5 MB</p>
                </div>
              </label>
            )}
          </div>

          {errorMessage && (
            <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-rose-300 text-xs font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="mt-5 flex justify-end">
            <button
              onClick={handleUploadAndAnalyze}
              disabled={!selectedFile || isUploading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm transition-all shadow-lg shadow-purple-600/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Processing Apache Tika Ingestion...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Analyze Resume
                </>
              )}
            </button>
          </div>
        </GlassCard>

        {/* 2. CARD 2: RESUME HEALTH CARD */}
        {review && review.health && (
          <GlassCard padding="lg" className="border-emerald-500/20 shadow-xl space-y-6 animate-fade-up">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Activity className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">2. Resume Health</h2>
                  <p className="text-xs text-slate-400">Executive readiness summary and benchmarking</p>
                </div>
              </div>
              <Badge variant="emerald" size="lg">
                {review.health.readinessStatus}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Star Rating */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Overall Rating
                </span>
                <span className="text-2xl font-black text-amber-400 tracking-widest block">
                  {review.health.stars}
                </span>
                <span className="text-[11px] font-bold text-slate-300 block mt-1">
                  {review.health.label}
                </span>
              </div>

              {/* Health Score */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Health Index
                </span>
                <span className="text-3xl font-black text-emerald-400 tabular-nums">
                  {review.health.score}
                </span>
                <span className="text-xs font-bold text-slate-400"> / 100</span>
              </div>

              {/* Percentile Rank */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Applicant Rank
                </span>
                <span className="text-2xl font-black text-purple-400">
                  {review.health.percentile}
                </span>
                <span className="text-[11px] text-slate-400 block mt-1">vs SE Benchmarks</span>
              </div>

              {/* File Reference */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                  Analyzed File
                </span>
                <span className="text-xs font-bold text-white truncate block">
                  {review.fileName || 'Resume Document'}
                </span>
                <span className="text-[11px] text-emerald-400 font-semibold block mt-1">
                  In-Memory Scope
                </span>
              </div>
            </div>
          </GlassCard>
        )}

        {/* 3. CARD 3: ATS SCORE CARD */}
        {review && (
          <GlassCard padding="lg" className="border-indigo-500/20 shadow-xl space-y-6 animate-fade-up">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <BarChart2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">3. ATS Score</h2>
                  <p className="text-xs text-slate-400">Deterministic ATS compatibility rating out of 100</p>
                </div>
              </div>
              <Badge variant={getGradeVariant(review.grade)} size="lg">
                Grade: {review.grade}
              </Badge>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between gap-8 p-6 rounded-2xl bg-gradient-to-r from-indigo-500/5 to-purple-500/5 border border-indigo-500/15">
              <div className="text-center md:text-left space-y-2 max-w-lg">
                <h3 className="text-2xl font-black text-white">ATS System Parser Compatibility</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  Measures whether Applicant Tracking Systems can parse your contact information, engineering experience, technical skills, and projects without information loss.
                </p>
              </div>

              {/* Score Circular Gauge */}
              <div className="relative flex items-center justify-center shrink-0">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle
                    className="text-slate-800"
                    strokeWidth="10"
                    stroke="currentColor"
                    fill="transparent"
                    r="70"
                    cx="80"
                    cy="80"
                  />
                  <circle
                    className={
                      review.score >= 85
                        ? 'text-emerald-500'
                        : review.score >= 70
                        ? 'text-indigo-500'
                        : review.score >= 50
                        ? 'text-amber-500'
                        : 'text-rose-500'
                    }
                    strokeWidth="10"
                    strokeDasharray={70 * 2 * Math.PI}
                    strokeDashoffset={70 * 2 * Math.PI - (review.score / 100) * (70 * 2 * Math.PI)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="70"
                    cx="80"
                    cy="80"
                    style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-black text-white tabular-nums tracking-tighter">
                    {review.score}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">/ 100</span>
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {/* 4. CARD 4: RESUME HEATMAP CARD */}
        {review && review.heatmap && (
          <GlassCard padding="lg" className="border-teal-500/20 shadow-xl space-y-6 animate-fade-up">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">4. Resume Heatmap</h2>
                <p className="text-xs text-slate-400">Audit of 10 standard resume section headers and content completeness</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {review.heatmap.map((item: SectionHeatmapData) => (
                <div
                  key={item.section}
                  className={`p-4 rounded-xl border flex flex-col justify-between space-y-2 transition-all ${
                    item.status === 'Present'
                      ? 'bg-emerald-500/5 border-emerald-500/20'
                      : item.status === 'Partial'
                      ? 'bg-amber-500/5 border-amber-500/20'
                      : 'bg-rose-500/5 border-rose-500/20'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{item.section}</span>
                    <Badge variant={getHeatmapBadgeVariant(item.status)} size="sm">
                      {item.status}
                    </Badge>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{item.details}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* 5. CARD 5: ATS BREAKDOWN CARD */}
        {review && review.atsCategoryBreakdown && (
          <GlassCard padding="lg" className="border-indigo-500/20 shadow-xl space-y-6 animate-fade-up">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">5. ATS Score Category Breakdown</h2>
                <p className="text-xs text-slate-400">Category-by-category scores and detailed explanations</p>
              </div>
            </div>

            <div className="space-y-4">
              {review.atsCategoryBreakdown.map((cat: AtsCategoryScoreData) => {
                const percentage = Math.round((cat.currentScore / cat.maxScore) * 100);
                return (
                  <div key={cat.category} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{cat.category}</span>
                      <span className="font-mono font-bold text-indigo-400">
                        {cat.currentScore} / {cat.maxScore} pts
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-750 ${
                          percentage >= 80 ? 'bg-emerald-400' : percentage >= 50 ? 'bg-amber-400' : 'bg-rose-400'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-medium">{cat.explanation}</p>
                  </div>
                );
              })}
            </div>
          </GlassCard>
        )}

        {/* 6. CARD 6: KEYWORD ANALYSIS CARD */}
        {review && review.keywords && (
          <GlassCard padding="lg" className="border-teal-500/20 shadow-xl space-y-6 animate-fade-up">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">6. Software Engineering Keyword Analysis</h2>
                  <p className="text-xs text-slate-400">Industry keyword taxonomy matching</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Coverage</span>
                <span className="text-lg font-extrabold text-teal-400">{review.keywords.coveragePercentage}%</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-medium text-slate-400">
                <span>Taxonomy Match Progress</span>
                <span>
                  {review.keywords.matchedKeywords.length} Matched / {review.keywords.missingKeywords.length} Missing
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-900 overflow-hidden p-0.5 border border-slate-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-1000"
                  style={{ width: `${Math.min(100, review.keywords.coveragePercentage)}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <CheckCircle2 className="h-4 w-4" />
                  Matched Keywords ({review.keywords.matchedKeywords.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {review.keywords.matchedKeywords.length > 0 ? (
                    review.keywords.matchedKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs font-medium text-emerald-300"
                      >
                        ✓ {kw}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-slate-500 italic">No direct matches found in text.</p>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
                <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                  <AlertCircle className="h-4 w-4" />
                  Missing Recommended Keywords ({review.keywords.missingKeywords.length})
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {review.keywords.missingKeywords.length > 0 ? (
                    review.keywords.missingKeywords.map((kw) => (
                      <span
                        key={kw}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs font-medium text-amber-300"
                      >
                        + {kw}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-emerald-400 font-semibold">Comprehensive keyword coverage achieved!</p>
                  )}
                </div>
              </div>
            </div>
          </GlassCard>
        )}

        {/* 7. CARD 7: QUANTIFICATION DETECTOR CARD */}
        {review && review.quantification && (
          <GlassCard padding="lg" className="border-amber-500/20 shadow-xl space-y-6 animate-fade-up">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">7. Quantification Detector</h2>
                <p className="text-xs text-slate-400">
                  Audits experience bullet points for metrics (%, numbers, users, requests, latency, time, placeholders)
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {review.quantification.map((item: QuantificationBulletData, idx: number) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 hover:border-amber-500/30 transition-all"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-500">#{idx + 1}</span>
                      <p className="text-xs sm:text-sm text-slate-200 font-medium font-mono leading-relaxed">
                        {item.currentBullet}
                      </p>
                    </div>
                    <Badge variant={item.status === 'Quantified' ? 'emerald' : 'amber'} size="sm">
                      {item.status}
                    </Badge>
                  </div>
                  {item.status !== 'Quantified' && (
                    <div className="p-3 rounded-lg bg-amber-500/8 border border-amber-500/15 text-xs text-amber-300 flex items-center justify-between gap-3 mt-2">
                      <span className="font-medium">{item.suggestion}</span>
                      <button
                        onClick={() => copyToClipboard(item.suggestion)}
                        className="p-1 text-slate-400 hover:text-white shrink-0"
                        title="Copy placeholder template"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* 8. CARD 8: RESUME INSIGHTS CARD */}
        {review && review.insights && (
          <GlassCard padding="lg" className="border-indigo-500/20 shadow-xl space-y-5 animate-fade-up">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">8. Actionable Resume Insights</h2>
                  <p className="text-xs text-slate-400">Categorized recommendations prioritized by impact</p>
                </div>
              </div>

              {/* Priority Filters */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950/80 border border-slate-800">
                {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((priority) => (
                  <button
                    key={priority}
                    onClick={() => setSelectedPriorityFilter(priority)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedPriorityFilter === priority
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {priority}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {review.insights
                .map((insightItem) => {
                  if (typeof insightItem === 'string') {
                    return { category: 'General', description: insightItem, priority: 'MEDIUM' } as InsightData;
                  }
                  return insightItem as InsightData;
                })
                .filter(
                  (item) => selectedPriorityFilter === 'ALL' || item.priority === selectedPriorityFilter
                )
                .map((insight, idx) => (
                  <div
                    key={idx}
                    className="group flex items-start justify-between gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-indigo-500/30 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 font-mono">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-white">{insight.category}</span>
                          <Badge variant={getPriorityBadgeVariant(insight.priority)} size="sm">
                            {insight.priority} PRIORITY
                          </Badge>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                          {insight.description}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(insight.description)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 shrink-0"
                      title="Copy suggestion"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </div>
                ))}
            </div>
          </GlassCard>
        )}
      </div>
    </StudentLayout>
  );
}
