import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Brain, Cpu, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { intelligenceService, SkillGapData } from '../services/intelligenceService';
import SectionHeader from '../components/ui/SectionHeader';
import { GlassCard } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { SkeletonCard } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

const priorityConfig: Record<string, { variant: any; color: string; bg: string; border: string }> = {
  HIGH: { variant: 'error', color: 'text-red-400', bg: 'bg-red-500/8', border: 'border-red-500/20' },
  MEDIUM: { variant: 'warning', color: 'text-amber-400', bg: 'bg-amber-500/8', border: 'border-amber-500/20' },
  LOW: { variant: 'info', color: 'text-sky-400', bg: 'bg-sky-500/8', border: 'border-sky-500/20' },
};

const difficultyConfig: Record<string, { label: string; color: string }> = {
  HIGH: { label: 'Advanced', color: 'text-red-400' },
  MEDIUM: { label: 'Intermediate', color: 'text-amber-400' },
  LOW: { label: 'Beginner', color: 'text-emerald-400' },
};

export default function SkillGapPage(): React.ReactElement {
  const [gap, setGap] = useState<SkillGapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');

  useEffect(() => { fetchGap(); }, []);

  const fetchGap = async () => {
    setIsLoading(true);
    try {
      const data = await intelligenceService.getSkillGap();
      setGap(data);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  const filteredSkills = gap?.missingSkills.filter(
    (s) => filter === 'ALL' || s.priorityLevel === filter
  ) || [];

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <SectionHeader
          title="Skill Gap Engine"
          subtitle="AI-powered analysis of missing competencies and learning hours for your target career role"
          badge="Intelligence"
          icon={<Brain className="h-6 w-6" />}
        />

        {isLoading ? (
          <div className="space-y-4">
            <SkeletonCard className="h-36" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} className="h-40" />)}
            </div>
          </div>
        ) : gap ? (
          <div className="space-y-6">
            {/* Role Banner */}
            <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-surface-card via-emerald-950/20 to-surface-card p-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold text-content-muted uppercase tracking-widest mb-2">Target Role Objective</p>
                <h3 className="text-3xl font-black text-content-primary">{gap.preferredRole}</h3>
                <p className="text-sm text-content-secondary mt-2">
                  Verified Skills: <strong className="text-content-primary">{gap.currentSkills.length}</strong>
                  {' '}·{' '}
                  Missing Skills: <strong className="text-amber-400">{gap.missingSkills.length}</strong>
                </p>
              </div>
              <div className="flex items-center gap-3">
                {[
                  { label: 'High Priority', count: gap.missingSkills.filter(s => s.priorityLevel === 'HIGH').length, color: 'text-red-400 bg-red-500/10 border-red-500/20' },
                  { label: 'Medium', count: gap.missingSkills.filter(s => s.priorityLevel === 'MEDIUM').length, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
                  { label: 'Low', count: gap.missingSkills.filter(s => s.priorityLevel === 'LOW').length, color: 'text-sky-400 bg-sky-500/10 border-sky-500/20' },
                ].map(({ label, count, color }) => (
                  <div key={label} className={`text-center px-3 py-2 rounded-xl border text-xs font-bold ${color}`}>
                    <p className="text-xl font-black">{count}</p>
                    <p className="opacity-80">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2">
              {(['ALL', 'HIGH', 'MEDIUM', 'LOW'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    filter === f
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                      : 'bg-surface-card text-content-secondary border border-surface-border hover:text-content-primary hover:border-surface-hover'
                  }`}
                >
                  {f === 'ALL' ? `All (${gap.missingSkills.length})` : f}
                </button>
              ))}
            </div>

            {/* Missing Skills Grid */}
            {filteredSkills.length === 0 ? (
              <GlassCard>
                <div className="flex items-center gap-3 p-2 text-emerald-400">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span className="text-sm font-semibold">You have all core skills for {gap.preferredRole}!</span>
                </div>
              </GlassCard>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSkills.map((item, idx) => {
                  const priority = priorityConfig[item.priorityLevel] || priorityConfig.LOW;
                  const difficulty = difficultyConfig[item.learningDifficulty] || difficultyConfig.MEDIUM;
                  return (
                    <div
                      key={idx}
                      className={`group rounded-2xl border p-5 transition-all duration-200 hover:shadow-lg hover:shadow-black/20 ${priority.bg} ${priority.border}`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`h-8 w-8 rounded-lg ${priority.bg} border ${priority.border} flex items-center justify-center`}>
                            <Cpu className={`h-4 w-4 ${priority.color}`} />
                          </div>
                          <h4 className="text-base font-bold text-content-primary">{item.skillName}</h4>
                        </div>
                        <Badge variant={priority.variant} size="sm">
                          {item.priorityLevel}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-3 border-t border-surface-border">
                        <span className={`flex items-center gap-1.5 font-semibold ${difficulty.color}`}>
                          <AlertCircle className="h-3.5 w-3.5" />
                          {difficulty.label}
                        </span>
                        <span className="flex items-center gap-1.5 text-content-muted font-mono">
                          <Clock className="h-3.5 w-3.5 text-[#2E4CFF]" />
                          ~{item.estimatedLearningHours}h to learn
                        </span>
                      </div>

                      <div className="mt-3 pt-2 text-right border-t border-dashed border-surface-border">
                        <Link
                          to="/ai/learning-coach"
                          className="inline-flex items-center gap-1 text-xs font-bold text-[#2E4CFF] hover:underline"
                        >
                          <span>Generate Learning Plan for {item.skillName}</span>
                          <span>→</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Total Hours Summary */}
            {gap.missingSkills.length > 0 && (
              <div className="glass-card rounded-2xl p-5 flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-content-muted font-semibold uppercase tracking-wider">Total Estimated Learning Time</p>
                  <p className="text-2xl font-black text-content-primary">
                    {gap.missingSkills.reduce((sum, s) => sum + s.estimatedLearningHours, 0)} Hours
                  </p>
                </div>
                <div className="ml-auto">
                  <div className="text-right">
                    <p className="text-xs text-content-muted">At 2 hrs/day</p>
                    <p className="text-sm font-bold text-emerald-500">
                      ~{Math.ceil(gap.missingSkills.reduce((sum, s) => sum + s.estimatedLearningHours, 0) / 2 / 30)} months
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <EmptyState
            icon={<Brain className="h-7 w-7" />}
            title="No skill gap data available"
            description="Set your career goal and verify your skills to see personalized gap analysis."
          />
        )}
      </div>
    </StudentLayout>
  );
}
