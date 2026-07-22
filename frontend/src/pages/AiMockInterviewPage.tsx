import React, { useEffect, useState } from 'react';
import { Target, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { aiService, AIMockInterview } from '../services/aiService';

export default function AiMockInterviewPage(): React.ReactElement {
  const [interview, setInterview] = useState<AIMockInterview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInterview();
  }, []);

  const fetchInterview = async () => {
    setIsLoading(true);
    try {
      const data = await aiService.generateMockInterview();
      setInterview(data);
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
            <Target className="h-6 w-6 text-emerald-400" />
            AI Mock Interview Simulator & Question Bank
          </h2>
          <p className="text-xs text-slate-400 mt-1">Generates technical, behavioral, and system design questions with answer key points</p>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          </div>
        ) : interview ? (
          <div className="space-y-8">
            {/* Header */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Target Role Simulation</p>
                <h3 className="text-2xl font-extrabold text-white mt-1">{interview.targetRole}</h3>
              </div>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {interview.difficultyLevel} DIFFICULTY
              </span>
            </div>

            {/* Questions List */}
            <div className="space-y-6">
              {interview.questions.map((q, idx) => (
                <div key={q.id} className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      QUESTION {idx + 1} • {q.category}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-white leading-relaxed">{q.questionText}</h4>

                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                    <p className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" /> Expected Key Points
                    </p>
                    <p className="text-xs text-slate-300 leading-relaxed">{q.expectedAnswerKeyPoints}</p>
                  </div>

                  {q.followUpQuestions.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-[11px] font-semibold text-slate-400">Follow-up Questions:</p>
                      {q.followUpQuestions.map((f, fIdx) => (
                        <p key={fIdx} className="text-xs text-slate-400 flex items-center gap-1.5">
                          <ChevronRight className="h-3.5 w-3.5 text-indigo-400" /> {f}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Evaluation Rubric */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-emerald-400" /> Evaluation Rubric
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {interview.evaluationRubric.map((rub, rIdx) => (
                  <div key={rIdx} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 font-medium text-center">
                    {rub}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </StudentLayout>
  );
}
