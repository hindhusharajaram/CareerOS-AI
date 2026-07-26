import React, { useEffect, useState } from 'react';
import { Compass, BookOpen, Clock, Calendar, ArrowRight, Layers, RefreshCw } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { aiService, AILearningPlan } from '../services/aiService';
import SectionHeader from '../components/ui/SectionHeader';
import { GlassCard } from '../components/ui/Card';
import { SkeletonCard } from '../components/ui/Skeleton';

const dayColors = [
  'bg-indigo-500/15 border-indigo-500/25 text-indigo-400',
  'bg-purple-500/15 border-purple-500/25 text-purple-400',
  'bg-violet-500/15 border-violet-500/25 text-violet-400',
  'bg-emerald-500/15 border-emerald-500/25 text-emerald-400',
  'bg-amber-500/15 border-amber-500/25 text-amber-400',
  'bg-sky-500/15 border-sky-500/25 text-sky-400',
  'bg-rose-500/15 border-rose-500/25 text-rose-400',
];

export default function AiLearningCoachPage(): React.ReactElement {
  const [plan, setPlan] = useState<AILearningPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { fetchPlan(); }, []);

  const fetchPlan = async () => {
    setIsLoading(true);
    try {
      const data = await aiService.generateLearningPlan();
      setPlan(data);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <SectionHeader
          title="AI Learning Coach"
          subtitle="AI-generated daily study routines and technology learning sequences tailored to your target role"
          badge="AI Suite"
          icon={<Compass className="h-6 w-6" />}
          action={
            <button
              onClick={fetchPlan}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 text-sm font-semibold hover:bg-teal-500/20 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              New Plan
            </button>
          }
        />

        {isLoading ? (
          <div className="space-y-4">
            <SkeletonCard className="h-24" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} className="h-32" />)}
            </div>
          </div>
        ) : plan ? (
          <div className="space-y-6">
            {/* Target Role */}
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-teal-500/8 border border-teal-500/20">
              <div className="h-10 w-10 rounded-xl bg-teal-500/20 flex items-center justify-center text-teal-400 shrink-0">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Study Plan For</p>
                <h3 className="text-lg font-black text-white">{plan.targetRole}</h3>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs text-slate-500">Difficulty</p>
                <p className="text-sm font-bold text-teal-400">{plan.difficultyProgression}</p>
              </div>
            </div>

            {/* Tech Sequence */}
            <GlassCard padding="lg">
              <h3 className="text-sm font-bold text-teal-400 uppercase tracking-wider flex items-center gap-2 mb-5">
                <Layers className="h-4 w-4" />
                Technology Learning Sequence
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                {plan.technologySequence.map((tech, idx) => (
                  <React.Fragment key={idx}>
                    <span className="px-3.5 py-2 rounded-xl bg-teal-500/10 text-teal-300 border border-teal-500/20 text-xs font-bold font-mono hover:bg-teal-500/20 transition-colors">
                      {tech}
                    </span>
                    {idx < plan.technologySequence.length - 1 && (
                      <ArrowRight className="h-3.5 w-3.5 text-slate-600" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </GlassCard>

            {/* Weekly Schedule */}
            <GlassCard padding="lg">
              <div className="flex items-center gap-2 mb-5">
                <Calendar className="h-5 w-5 text-teal-400" />
                <h3 className="text-base font-bold text-white">Weekly Study Schedule</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plan.weeklyPlan.map((day, idx) => {
                  const colorClass = dayColors[idx % dayColors.length];
                  return (
                    <div key={idx} className="p-5 rounded-2xl bg-slate-950/50 border border-slate-800/60 hover:border-slate-700/60 transition-colors space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${colorClass}`}>
                          {day.day}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                          <Clock className="h-3 w-3 text-teal-400" />
                          {day.durationMinutes} mins
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{day.topic}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{day.activity}</p>
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            {/* Resources */}
            <GlassCard padding="md">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-4.5 w-4.5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Recommended Learning Resources</h3>
              </div>
              <div className="space-y-2">
                {plan.recommendedResources.map((res, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800/60 text-sm text-slate-300">
                    <span className="text-indigo-400 shrink-0">📖</span>
                    {res}
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
