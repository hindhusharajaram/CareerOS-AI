import React, { useEffect, useState } from 'react';
import { Bot, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, FileText, Brain, Award, Compass } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { aiService, AICopilotExplanation } from '../services/aiService';

export default function CareerCopilotPage(): React.ReactElement {
  const [topic, setTopic] = useState('CAREER_SCORE');
  const [explanation, setExplanation] = useState<AICopilotExplanation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchExplanation(topic);
  }, [topic]);

  const fetchExplanation = async (selectedTopic: string) => {
    setIsLoading(true);
    try {
      const data = await aiService.explainTopic(selectedTopic);
      setExplanation(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const topics = [
    { id: 'CAREER_SCORE', label: 'Career Score (0-1000)', icon: Award },
    { id: 'ATS_SCORE', label: 'ATS Resume Audit', icon: FileText },
    { id: 'SKILL_GAP', label: 'Skill Gap & Role', icon: Brain },
    { id: 'ELIGIBILITY', label: 'Placement Eligibility', icon: ShieldCheck },
    { id: 'ROADMAP', label: '90-Day Execution', icon: Compass },
  ];

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="border-b border-slate-800 pb-5">
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Bot className="h-6 w-6 text-indigo-400" />
            AI Career Copilot & Explainability Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">Grounds AI explanations directly in your verified profile, skills, score index, and target roles</p>
        </div>

        {/* Topic Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {topics.map((t) => {
            const Icon = t.icon;
            const isActive = topic === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTopic(t.id)}
                className={`p-3.5 rounded-2xl border text-xs font-bold transition flex flex-col items-center gap-2 ${
                  isActive
                    ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 text-white border-indigo-500 shadow-lg shadow-indigo-500/20'
                    : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          </div>
        ) : explanation ? (
          <div className="space-y-8">
            {/* Explanation Summary Banner */}
            <div className="rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 p-8 backdrop-blur-md space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                Explainable AI Copilot Output
              </div>
              <h3 className="text-xl font-bold text-white leading-relaxed">{explanation.explanationText}</h3>
              <p className="text-xs text-slate-500 font-mono italic">{explanation.groundedContextSummary}</p>
            </div>

            {/* Takeaways & Action Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Takeaways */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-4">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  Key Intelligence Takeaways
                </h4>
                <div className="space-y-2">
                  {explanation.keyTakeaways.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 flex items-center gap-2.5">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Immediate Action Items */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-4">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <ArrowRight className="h-5 w-5 text-indigo-400" />
                  Immediate High-Impact Actions
                </h4>
                <div className="space-y-2">
                  {explanation.immediateActionItems.map((act, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-xs text-indigo-300 flex items-center gap-2.5">
                      <ArrowRight className="h-4 w-4 shrink-0 text-indigo-400" />
                      <span>{act}</span>
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
