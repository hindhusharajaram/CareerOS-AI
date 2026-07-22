import React, { useEffect, useState } from 'react';
import { FileText, Sparkles, CheckCircle2, AlertCircle, ArrowUpRight, Zap } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { aiService, AIResumeReview } from '../services/aiService';

export default function AiResumeReviewPage(): React.ReactElement {
  const [review, setReview] = useState<AIResumeReview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReview();
  }, []);

  const fetchReview = async () => {
    setIsLoading(true);
    try {
      const data = await aiService.reviewResume();
      setReview(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="border-b border-slate-800 pb-5">
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <FileText className="h-6 w-6 text-purple-400" />
            AI Resume Review & Bullet Optimizer
          </h2>
          <p className="text-xs text-slate-400 mt-1">Generates professional bio summaries, action bullet improvements, and ATS advice</p>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
          </div>
        ) : review ? (
          <div className="space-y-8">
            {/* Professional Summary */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-md space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-purple-400 flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> AI Generated Professional Summary
              </h3>
              <p className="text-base font-medium text-slate-200 leading-relaxed bg-slate-950/70 p-4 rounded-2xl border border-slate-800">
                "{review.professionalSummary}"
              </p>
            </div>

            {/* Bullet Point Suggestions */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-md space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Zap className="h-5 w-5 text-amber-400" />
                High-Impact Bullet Point Suggestions
              </h3>
              <div className="space-y-3">
                {review.strongBulletPointSuggestions.map((bullet, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-center gap-3 font-mono">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Improvements & ATS Advice */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-400" /> Improvement Suggestions
                </h3>
                <div className="space-y-2">
                  {review.improvementSuggestions.map((sug, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400">
                      • {sug}
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-4">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <ArrowUpRight className="h-5 w-5 text-purple-400" /> ATS Optimization Advice
                </h3>
                <div className="space-y-2">
                  {review.atsOptimizationAdvice.map((adv, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-300">
                      • {adv}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </StudentLayout>
  );
}
