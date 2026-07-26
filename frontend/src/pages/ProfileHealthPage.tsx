import React, { useEffect, useState } from 'react';
import { ShieldCheck, ArrowUpRight, Sparkles, Activity, AlertTriangle } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { healthService, ProfileHealthData } from '../services/healthService';
import SectionHeader from '../components/ui/SectionHeader';
import { GlassCard, StatCard } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { SkeletonStatGrid, SkeletonCard } from '../components/ui/Skeleton';
import { ProgressBar as Progress } from '../components/ui/Progress';
import AnimatedCounter from '../components/ui/AnimatedCounter';

export default function ProfileHealthPage(): React.ReactElement {
  const [health, setHealth] = useState<ProfileHealthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHealth();
  }, []);

  const fetchHealth = async () => {
    setIsLoading(true);
    try {
      const data = await healthService.getHealth();
      setHealth(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getGradeVariant = (grade?: string): 'emerald' | 'indigo' | 'amber' | 'rose' => {
    if (!grade) return 'rose';
    if (grade.startsWith('A')) return 'emerald';
    if (grade.startsWith('B')) return 'indigo';
    if (grade.startsWith('C')) return 'amber';
    return 'rose';
  };

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        <SectionHeader
          title="Profile Health Engine"
          subtitle="Deep AI audit of your data completeness and placement readiness."
          badge="Audit Engine"
          icon={<Activity className="h-6 w-6" />}
        />

        {isLoading ? (
          <div className="space-y-8">
            <SkeletonStatGrid cols={3} />
            <SkeletonCard className="h-[400px]" />
          </div>
        ) : health ? (
          <div className="space-y-6">
            {/* Top Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StatCard
                title="Overall Grade"
                value={health.grade || 'N/A'}
                subtitle="Placement Index"
                icon={<ShieldCheck className="h-5 w-5" />}
                color={getGradeVariant(health.grade)}
              />
              <StatCard
                title="Health Score"
                value={`${health.score}%`}
                subtitle="Overall Profile Quality"
                icon={<Activity className="h-5 w-5" />}
                color="emerald"
              />
              <StatCard
                title="Missing Modules"
                value={health.missingSections?.length.toString() || '0'}
                subtitle="Action items needed"
                icon={<AlertTriangle className="h-5 w-5" />}
                color="amber"
              />
            </div>

            {/* Category Breakdown */}
            <GlassCard padding="lg">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Sparkles className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Category Health Scores</h3>
                </div>
                <Badge variant="indigo">Verified Engine</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {Object.entries(health.categoryScores || {}).map(([cat, score]) => (
                  <div key={cat} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-300 capitalize text-sm">
                        {cat.replace(/_/g, ' ')}
                      </span>
                      <span className="font-mono font-bold text-white flex items-baseline gap-1">
                        <AnimatedCounter target={score} />
                        <span className="text-xs text-slate-500 font-sans">/ 20</span>
                      </span>
                    </div>
                    <Progress value={(score / 20) * 100} color="indigo" size="md" showValue={false} />
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Priority Improvements */}
            <GlassCard padding="lg">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <ArrowUpRight className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-xl font-bold text-white">Priority Recommendations</h3>
              </div>

              <div className="mt-8">
                <h4 className="text-sm font-bold text-slate-200 mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-400" />
                  Priority Improvements
                </h4>
                <div className="space-y-3">
                  {health.priorityImprovements?.map((suggestion, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-800/30 border border-slate-700/50 group hover:border-emerald-500/30 transition-colors">
                      <ArrowUpRight className="h-4 w-4 text-emerald-400 mt-0.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      <p className="text-sm text-slate-300 leading-snug">{suggestion}</p>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        ) : null}
      </div>
    </StudentLayout>
  );
}
