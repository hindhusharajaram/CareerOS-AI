import React, { useEffect, useState } from 'react';
import { Target, CheckCircle2, ChevronRight, Sparkles, RefreshCw, Zap } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { aiService, AIMockInterview } from '../services/aiService';
import SectionHeader from '../components/ui/SectionHeader';
import { GlassCard } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { SkeletonCard } from '../components/ui/Skeleton';

const categoryColors: Record<string, any> = {
  TECHNICAL: 'indigo',
  BEHAVIORAL: 'purple',
  'SYSTEM DESIGN': 'emerald',
  CODING: 'amber',
  HR: 'sky',
};

export default function AiMockInterviewPage(): React.ReactElement {
  const [interview, setInterview] = useState<AIMockInterview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  useEffect(() => { fetchInterview(); }, []);

  const fetchInterview = async () => {
    setIsLoading(true);
    try {
      const data = await aiService.generateMockInterview();
      setInterview(data);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <SectionHeader
          title="AI Mock Interview Simulator"
          subtitle="Technical, behavioral, and system design questions with expected key points and follow-up questions"
          badge="AI Suite"
          icon={<Target className="h-6 w-6" />}
          action={
            <button
              onClick={fetchInterview}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/20 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              New Session
            </button>
          }
        />

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} className="h-40" />)}
          </div>
        ) : interview ? (
          <div className="space-y-6">
            {/* Session Info */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Interview Session · {interview.questions.length} Questions</p>
                <h3 className="text-xl font-black text-white">{interview.targetRole}</h3>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="success" size="lg" dot>{interview.difficultyLevel}</Badge>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Zap className="h-3.5 w-3.5 text-emerald-400" />
                  AI-Generated
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-4">
              {interview.questions.map((q, idx) => {
                const isExpanded = expandedIdx === idx;
                const catColor = categoryColors[q.category] || 'indigo';
                return (
                  <div
                    key={q.id}
                    className="rounded-2xl border border-slate-800/80 bg-slate-900/50 overflow-hidden transition-all duration-200 hover:border-slate-700/60"
                  >
                    <button
                      onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                      className="w-full flex items-start gap-4 p-5 text-left"
                    >
                      {/* Number */}
                      <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-sm shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Badge variant={catColor} size="sm">{q.category}</Badge>
                        </div>
                        <h4 className="text-sm font-bold text-white leading-relaxed">{q.questionText}</h4>
                      </div>
                      <ChevronRight className={`h-4 w-4 text-slate-500 shrink-0 mt-1 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 space-y-4 border-t border-slate-800/60 pt-4">
                        {/* Expected answer */}
                        <div className="p-4 rounded-xl bg-slate-950/60 border border-emerald-500/15">
                          <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Expected Key Points
                          </p>
                          <p className="text-sm text-slate-300 leading-relaxed">{q.expectedAnswerKeyPoints}</p>
                        </div>

                        {/* Follow-ups */}
                        {q.followUpQuestions.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Follow-up Questions</p>
                            <div className="space-y-1.5">
                              {q.followUpQuestions.map((f, fIdx) => (
                                <div key={fIdx} className="flex items-center gap-2 text-sm text-slate-400">
                                  <ChevronRight className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                                  {f}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Evaluation Rubric */}
            <GlassCard padding="md">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4.5 w-4.5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Evaluation Rubric</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {interview.evaluationRubric.map((rub, rIdx) => (
                  <div key={rIdx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs text-slate-300 font-semibold text-center">
                    {rub}
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        ) : null}
      </div>
    </StudentLayout>
  );
}
