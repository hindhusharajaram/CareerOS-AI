import React, { useEffect, useState } from 'react';
import { FileText, Sparkles, CheckCircle2, AlertCircle, ArrowUpRight, Zap, Copy, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import StudentLayout from '../layouts/StudentLayout';
import { aiService, AIResumeReview } from '../services/aiService';
import SectionHeader from '../components/ui/SectionHeader';
import { GlassCard } from '../components/ui/Card';
import { SkeletonCard } from '../components/ui/Skeleton';

export default function AiResumeReviewPage(): React.ReactElement {
  const [review, setReview] = useState<AIResumeReview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { fetchReview(); }, []);

  const fetchReview = async () => {
    setIsLoading(true);
    try {
      const data = await aiService.reviewResume();
      setReview(data);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <SectionHeader
          title="AI Resume Review"
          subtitle="AI-generated professional summary, bullet point improvements, ATS optimization advice, and missing section detection"
          badge="AI Suite"
          icon={<FileText className="h-6 w-6" />}
          action={
            <button
              onClick={fetchReview}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-semibold hover:bg-purple-500/20 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Regenerate
            </button>
          }
        />

        {isLoading ? (
          <div className="space-y-4">
            <SkeletonCard className="h-36" />
            <SkeletonCard className="h-48" />
            <div className="grid grid-cols-2 gap-4">
              <SkeletonCard className="h-48" />
              <SkeletonCard className="h-48" />
            </div>
          </div>
        ) : review ? (
          <div className="space-y-6">
            {/* Professional Summary */}
            <GlassCard padding="lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-purple-400 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  AI-Generated Professional Summary
                </h3>
                <button
                  onClick={() => copyToClipboard(review.professionalSummary)}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/60 text-slate-400 hover:text-white text-xs transition-colors"
                >
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </button>
              </div>
              <div className="relative p-5 rounded-2xl bg-gradient-to-r from-purple-500/5 to-indigo-500/5 border border-purple-500/15">
                <div className="absolute top-3 left-3 text-purple-400/30 text-5xl font-serif leading-none">"</div>
                <p className="text-sm font-medium text-slate-200 leading-relaxed pl-4">
                  {review.professionalSummary}
                </p>
              </div>
            </GlassCard>

            {/* Bullet Point Suggestions */}
            <GlassCard padding="lg">
              <div className="flex items-center gap-2 mb-5">
                <Zap className="h-5 w-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">High-Impact Bullet Point Suggestions</h3>
              </div>
              <div className="space-y-2.5">
                {review.strongBulletPointSuggestions.map((bullet, idx) => (
                  <div
                    key={idx}
                    className="group flex items-start gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/60 hover:border-emerald-500/20 transition-colors"
                  >
                    <div className="h-5 w-5 rounded-full bg-emerald-500/15 flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    </div>
                    <span className="text-sm text-slate-300 font-mono leading-relaxed flex-1">{bullet}</span>
                    <button
                      onClick={() => copyToClipboard(bullet)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-500 hover:text-white"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Missing Sections */}
            {review.missingSections.length > 0 && (
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/8 border border-amber-500/20">
                <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-amber-300 mb-2">Missing Resume Sections</p>
                  <div className="flex flex-wrap gap-2">
                    {review.missingSections.map((sec, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400 font-semibold">
                        {sec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Improvements & ATS Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard padding="md">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="h-4.5 w-4.5 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">Improvement Areas</h3>
                </div>
                <div className="space-y-2">
                  {review.improvementSuggestions.map((sug, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-3 rounded-xl bg-slate-950/50 border border-slate-800/60 text-xs text-slate-300">
                      <span className="text-amber-500 shrink-0 mt-0.5">→</span>
                      {sug}
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard padding="md">
                <div className="flex items-center gap-2 mb-4">
                  <ArrowUpRight className="h-4.5 w-4.5 text-purple-400" />
                  <h3 className="text-sm font-bold text-white">ATS Optimization</h3>
                </div>
                <div className="space-y-2">
                  {review.atsOptimizationAdvice.map((adv, idx) => (
                    <div key={idx} className="flex items-start gap-2 p-3 rounded-xl bg-purple-500/8 border border-purple-500/15 text-xs text-purple-300">
                      <span className="shrink-0 mt-0.5">✓</span>
                      {adv}
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center text-slate-500">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No resume review available. Complete your profile to generate AI review.</p>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
