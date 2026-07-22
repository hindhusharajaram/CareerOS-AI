import React, { useEffect, useState } from 'react';
import { TrendingUp, BarChart3, Cpu, Target, Users } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { intelligenceService, TrendAnalyticsData } from '../services/intelligenceService';

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
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="border-b border-slate-800 pb-5">
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-pink-400" />
            Macro Trend Analytics & Platform Distribution
          </h2>
          <p className="text-xs text-slate-400 mt-1">Aggregated candidate skill distributions, high-demand technologies, and benchmark scores</p>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-pink-500 border-t-transparent" />
          </div>
        ) : trends ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Most Common Skills */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Cpu className="h-4 w-4 text-indigo-400" /> Most Common Skills (%)
              </h3>
              <div className="space-y-3">
                {Object.entries(trends.mostCommonSkills || {}).map(([skill, val]) => (
                  <div key={skill} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">{skill}</span>
                      <span className="text-indigo-400 font-mono font-bold">{val}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Missing Skills Distribution */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-pink-400" /> Top Skill Gaps Across Platform (%)
              </h3>
              <div className="space-y-3">
                {Object.entries(trends.missingSkillsDistribution || {}).map(([skill, val]) => (
                  <div key={skill} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">{skill}</span>
                      <span className="text-pink-400 font-mono font-bold">{val}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div className="bg-pink-500 h-full rounded-full" style={{ width: `${val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Career Goal Trends */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="h-4 w-4 text-emerald-400" /> Candidate Target Role Aspirations (%)
              </h3>
              <div className="space-y-3">
                {Object.entries(trends.careerGoalTrends || {}).map(([goal, val]) => (
                  <div key={goal} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">{goal}</span>
                      <span className="text-emerald-400 font-mono font-bold">{val}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Career Score Distribution */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Users className="h-4 w-4 text-purple-400" /> Profile Career Score Tier Distribution
              </h3>
              <div className="space-y-3">
                {Object.entries(trends.profileScoreDistribution || {}).map(([tier, val]) => (
                  <div key={tier} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-300 font-medium">{tier}</span>
                      <span className="text-purple-400 font-mono font-bold">{val}%</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full rounded-full" style={{ width: `${val}%` }} />
                    </div>
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
