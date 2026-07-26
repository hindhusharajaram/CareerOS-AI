import React, { useEffect, useState } from 'react';
import { TrendingUp, BarChart3, Cpu, Users, Target } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { intelligenceService, TrendAnalyticsData } from '../services/intelligenceService';
import SectionHeader from '../components/ui/SectionHeader';
import { GlassCard } from '../components/ui/Card';
import { SkeletonCard } from '../components/ui/Skeleton';
import { ProgressBar as Progress } from '../components/ui/Progress';
import AnimatedCounter from '../components/ui/AnimatedCounter';

export default function TrendAnalyticsPage(): React.ReactElement {
  const [trends, setTrends] = useState<TrendAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTrends();
  }, []);

  const fetchTrends = async () => {
    setIsLoading(true);
    try {
      const data = await intelligenceService.getTrends();
      setTrends(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-6xl mx-auto space-y-6 pb-20">
        <SectionHeader
          title="Macro Trend Analytics"
          subtitle="Aggregated platform statistics, high-demand skills, and benchmark distributions."
          badge="Global Trends"
          icon={<TrendingUp className="h-6 w-6" />}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SkeletonCard className="h-80" />
            <SkeletonCard className="h-80" />
            <SkeletonCard className="h-80" />
            <SkeletonCard className="h-80" />
          </div>
        ) : trends ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-up">
            
            {/* Most Common Skills */}
            <GlassCard padding="lg" className="flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Cpu className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-lg font-bold text-white">Most Common Skills</h3>
              </div>
              <div className="space-y-4 flex-1">
                {Object.entries(trends.mostCommonSkills || {}).map(([skill, val]) => (
                  <div key={skill} className="space-y-1.5">
                    <div className="flex justify-between items-end text-sm">
                      <span className="text-slate-300 font-semibold tracking-tight">{skill}</span>
                      <span className="text-indigo-400 font-mono font-bold flex items-baseline gap-0.5">
                        <AnimatedCounter target={val} />%
                      </span>
                    </div>
                    <Progress value={val} color="indigo" size="sm" showValue={false} />
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Missing Skills Distribution */}
            <GlassCard padding="lg" className="flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400">
                  <BarChart3 className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-lg font-bold text-white">Top Skill Gaps</h3>
              </div>
              <div className="space-y-4 flex-1">
                {Object.entries(trends.missingSkillsDistribution || {}).map(([skill, val]) => (
                  <div key={skill} className="space-y-1.5">
                    <div className="flex justify-between items-end text-sm">
                      <span className="text-slate-300 font-semibold tracking-tight">{skill}</span>
                      <span className="text-pink-400 font-mono font-bold flex items-baseline gap-0.5">
                        <AnimatedCounter target={val} />%
                      </span>
                    </div>
                    <Progress value={val} color="rose" size="sm" showValue={false} />
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Target Career Goal Trends */}
            <GlassCard padding="lg" className="flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Target className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-lg font-bold text-white">Candidate Target Roles</h3>
              </div>
              <div className="space-y-4 flex-1">
                {Object.entries(trends.careerGoalTrends || {}).map(([goal, val]) => (
                  <div key={goal} className="space-y-1.5">
                    <div className="flex justify-between items-end text-sm">
                      <span className="text-slate-300 font-semibold tracking-tight">{goal}</span>
                      <span className="text-emerald-400 font-mono font-bold flex items-baseline gap-0.5">
                        <AnimatedCounter target={val} />%
                      </span>
                    </div>
                    <Progress value={val} color="emerald" size="sm" showValue={false} />
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* Career Score Distribution */}
            <GlassCard padding="lg" className="flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <Users className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-lg font-bold text-white">Profile Score Distribution</h3>
              </div>
              <div className="space-y-4 flex-1">
                {Object.entries(trends.profileScoreDistribution || {}).map(([tier, val]) => (
                  <div key={tier} className="space-y-1.5">
                    <div className="flex justify-between items-end text-sm">
                      <span className="text-slate-300 font-semibold tracking-tight">{tier}</span>
                      <span className="text-purple-400 font-mono font-bold flex items-baseline gap-0.5">
                        <AnimatedCounter target={val} />%
                      </span>
                    </div>
                    <Progress value={val} color="purple" size="sm" showValue={false} />
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
