import React, { useEffect, useState } from 'react';
import { Bot, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, FileText, Brain, Award, Compass, Zap } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { aiService, AICopilotExplanation } from '../services/aiService';
import SectionHeader from '../components/ui/SectionHeader';
import { GlassCard } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { SkeletonCard } from '../components/ui/Skeleton';

const topics = [
  { id: 'CAREER_SCORE', label: 'Career Score', subtitle: '0–1000 Rating', icon: Award, color: 'from-indigo-500 to-purple-600' },
  { id: 'ATS_SCORE', label: 'ATS Resume', subtitle: 'Optimization', icon: FileText, color: 'from-purple-500 to-violet-600' },
  { id: 'SKILL_GAP', label: 'Skill Gap', subtitle: 'Role Alignment', icon: Brain, color: 'from-violet-500 to-indigo-600' },
  { id: 'ELIGIBILITY', label: 'Eligibility', subtitle: 'Placement Fit', icon: ShieldCheck, color: 'from-emerald-500 to-teal-600' },
  { id: 'ROADMAP', label: '90-Day Plan', subtitle: 'Execution', icon: Compass, color: 'from-amber-500 to-orange-600' },
];

export default function CareerCopilotPage(): React.ReactElement {
  const [topic, setTopic] = useState('CAREER_SCORE');
  const [explanation, setExplanation] = useState<AICopilotExplanation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { fetchExplanation(topic); }, [topic]);

  const fetchExplanation = async (selectedTopic: string) => {
    setIsLoading(true);
    try {
      const data = await aiService.explainTopic(selectedTopic);
      setExplanation(data);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <SectionHeader
          title="AI Career Copilot"
          subtitle="Explainability engine grounded in your verified profile, skills, score index, and target roles"
          badge="AI Suite"
          icon={<Bot className="h-6 w-6" />}
        />

        {/* Topic Selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {topics.map((t) => {
            const Icon = t.icon;
            const isActive = topic === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTopic(t.id)}
                className={`group relative overflow-hidden p-4 rounded-2xl border text-sm font-bold transition-all duration-200 flex flex-col items-center gap-2.5 ${
                  isActive
                    ? 'border-indigo-500/30 text-white shadow-lg shadow-indigo-500/10'
                    : 'bg-slate-900/50 text-slate-400 border-slate-800/60 hover:text-white hover:border-slate-700'
                }`}
              >
                {isActive && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${t.color} opacity-20`} />
                )}
                <div className={`relative h-11 w-11 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  isActive
                    ? `bg-gradient-to-br ${t.color} shadow-md`
                    : 'bg-slate-800/60 group-hover:bg-slate-700/60'
                }`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="relative text-center">
                  <p className={`text-xs font-bold ${isActive ? 'text-white' : ''}`}>{t.label}</p>
                  <p className={`text-[10px] mt-0.5 ${isActive ? 'text-slate-300' : 'text-slate-600'}`}>{t.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <SkeletonCard className="h-40" />
            <div className="grid grid-cols-2 gap-4">
              <SkeletonCard className="h-48" />
              <SkeletonCard className="h-48" />
            </div>
          </div>
        ) : explanation ? (
          <div className="space-y-5">
            {/* Explanation Banner */}
            <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 h-32 w-32 bg-indigo-500/10 blur-[50px] rounded-full" />
              <div className="relative space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="indigo" size="md" dot>
                    <Sparkles className="h-3 w-3 mr-1" />
                    Explainable AI Output
                  </Badge>
                  <Badge variant="default" size="sm">{explanation.topic}</Badge>
                </div>
                <p className="text-base font-bold text-slate-100 leading-relaxed">{explanation.explanationText}</p>
                <p className="text-xs text-slate-500 italic font-mono">{explanation.groundedContextSummary}</p>
              </div>
            </div>

            {/* Takeaways & Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Takeaways */}
              <GlassCard padding="lg">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <h4 className="text-sm font-bold text-white">Key Intelligence Takeaways</h4>
                </div>
                <div className="space-y-2.5">
                  {explanation.keyTakeaways.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/15">
                      <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                      </div>
                      <span className="text-sm text-emerald-300 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Actions */}
              <GlassCard padding="lg">
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="h-5 w-5 text-indigo-400" />
                  <h4 className="text-sm font-bold text-white">Immediate High-Impact Actions</h4>
                </div>
                <div className="space-y-2.5">
                  {explanation.immediateActionItems.map((act, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-indigo-500/8 border border-indigo-500/15">
                      <div className="h-5 w-5 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5">
                        <ArrowRight className="h-3 w-3 text-indigo-400" />
                      </div>
                      <span className="text-sm text-indigo-300 leading-relaxed">{act}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        ) : null}
      </div>
    </StudentLayout>
  );
}
