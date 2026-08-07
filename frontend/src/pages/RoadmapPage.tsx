import React, { useEffect, useState } from 'react';
import { Compass, Calendar, ChevronRight, Target, Zap } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { intelligenceService, CareerRoadmapData, RoadmapTask } from '../services/intelligenceService';
import SectionHeader from '../components/ui/SectionHeader';
import { GlassCard } from '../components/ui/Card';
import { SkeletonCard } from '../components/ui/Skeleton';

const categoryColors: Record<string, string> = {
  SKILLS: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  PROJECTS: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  NETWORKING: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  PREPARATION: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  APPLICATIONS: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  CERTIFICATIONS: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  INTERVIEW: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

const weekColors = [
  'from-emerald-600 to-teal-500',
  'from-teal-600 to-emerald-500',
  'from-emerald-500 to-teal-600',
  'from-emerald-600 to-emerald-400',
  'from-amber-500 to-orange-500',
  'from-sky-500 to-cyan-500',
  'from-rose-500 to-pink-500',
  'from-teal-600 to-emerald-600',
  'from-emerald-600 to-green-500',
  'from-emerald-600 to-teal-500',
  'from-amber-600 to-yellow-500',
  'from-sky-600 to-blue-500',
  'from-emerald-600 to-teal-600',
];

export default function RoadmapPage(): React.ReactElement {
  const [roadmap, setRoadmap] = useState<CareerRoadmapData | null>(null);
  const [activeTab, setActiveTab] = useState<'30' | '60' | '90'>('30');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { fetchRoadmap(); }, []);

  const fetchRoadmap = async () => {
    setIsLoading(true);
    try {
      const data = await intelligenceService.getRoadmap();
      setRoadmap(data);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  const getTasks = (): RoadmapTask[] => {
    if (!roadmap) return [];
    if (activeTab === '30') return roadmap.day30Roadmap;
    if (activeTab === '60') return roadmap.day60Roadmap;
    return roadmap.day90Roadmap;
  };

  const tasks = getTasks();

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <SectionHeader
          title="Career Roadmap Generator"
          subtitle={`Structured week-by-week execution plan for ${roadmap?.targetRole || 'your target role'}`}
          badge="Intelligence"
          icon={<Compass className="h-6 w-6" />}
          action={
            <div className="flex bg-surface-card p-1 rounded-2xl border border-surface-border shrink-0 gap-1">
              {(['30', '60', '90'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                    activeTab === tab
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/20'
                      : 'text-content-secondary hover:text-content-primary'
                  }`}
                >
                  {tab} Days
                </button>
              ))}
            </div>
          }
        />

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} className="h-28" />)}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary Banner */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shrink-0">
                <Target className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-content-muted uppercase tracking-wider">Target Role · {activeTab}-Day Execution Plan</p>
                <h3 className="text-lg font-black text-content-primary mt-0.5 truncate">{roadmap?.targetRole || 'Software Engineering'}</h3>
              </div>
              <div className="text-right shrink-0">
                <p className="text-2xl font-black text-content-primary">{tasks.length}</p>
                <p className="text-xs text-content-muted">Tasks</p>
              </div>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
              {tasks.length === 0 ? (
                <GlassCard>
                  <div className="py-8 text-center text-content-muted">
                    <Calendar className="h-10 w-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No tasks found for this timeline. Set your career goal to generate a roadmap.</p>
                  </div>
                </GlassCard>
              ) : tasks.map((task, idx) => {
                const gradient = weekColors[idx % weekColors.length];
                const catStyle = categoryColors[task.category] || 'bg-surface-hover text-content-muted border-surface-border';

                return (
                  <div
                    key={idx}
                    className="group relative flex items-start gap-4 p-5 rounded-2xl border border-surface-border bg-surface-card backdrop-blur-sm hover:border-surface-hover transition-all duration-200 card-interactive"
                  >
                    {/* Week badge */}
                    <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${gradient} flex flex-col items-center justify-center shrink-0 shadow-lg text-white`}>
                      <span className="text-[9px] font-bold uppercase opacity-70">Wk</span>
                      <span className="text-sm font-black leading-none">{task.week}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <h4 className="text-sm font-bold text-content-primary group-hover:text-emerald-500 transition-colors">{task.title}</h4>
                        <span className={`shrink-0 px-2 py-0.5 rounded-lg text-[10px] font-bold border ${catStyle}`}>
                          {task.category}
                        </span>
                      </div>
                      <p className="text-xs text-content-secondary leading-relaxed">{task.description}</p>
                    </div>

                    <ChevronRight className="h-4 w-4 text-content-muted group-hover:text-content-primary group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                  </div>
                );
              })}
            </div>

            {tasks.length > 0 && (
              <div className="glass-card rounded-2xl p-4 flex items-center gap-3">
                <Zap className="h-5 w-5 text-emerald-500 shrink-0" />
                <p className="text-sm text-content-secondary">
                  <span className="text-content-primary font-semibold">Pro Tip:</span> Complete high-priority tasks first. Aim for 2–3 tasks per week for maximum career velocity.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
