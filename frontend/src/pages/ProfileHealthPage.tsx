import React, { useEffect, useState } from 'react';
import { Activity, ShieldCheck, AlertTriangle, ArrowUpRight, CheckCircle2, Sparkles } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { healthService, ProfileHealthData } from '../services/healthService';

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

  const getGradeBadgeColor = (grade?: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'from-emerald-500 to-teal-500 text-white shadow-emerald-500/20';
      case 'B+':
      case 'B':
        return 'from-indigo-500 to-purple-500 text-white shadow-indigo-500/20';
      case 'C':
        return 'from-amber-500 to-orange-500 text-white shadow-amber-500/20';
      default:
        return 'from-red-500 to-pink-500 text-white shadow-red-500/20';
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="border-b border-slate-800 pb-5">
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Activity className="h-6 w-6 text-indigo-400" />
            Profile Health Engine & AI Audit
          </h2>
          <p className="text-xs text-slate-400 mt-1">Deep analysis of data completeness, placement readiness, and priority recommendations</p>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          </div>
        ) : health ? (
          <div className="space-y-8">
            {/* Top Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Grade Badge Card */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Overall Profile Grade</p>
                  <h3 className="text-2xl font-extrabold text-white mt-1">Placement Grade</h3>
                  <p className="text-xs text-slate-500 mt-1">Audit Score Index</p>
                </div>
                <div className={`h-20 w-20 rounded-2xl bg-gradient-to-tr ${getGradeBadgeColor(health.grade)} flex items-center justify-center text-3xl font-black shadow-xl`}>
                  {health.grade}
                </div>
              </div>

              {/* Numerical Score Card */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Health Score</p>
                  <h3 className="text-3xl font-black text-white mt-1">{health.score} <span className="text-lg text-slate-500 font-normal">/ 100</span></h3>
                  <p className="text-xs text-indigo-400 mt-1 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" /> AI Ready Index
                  </p>
                </div>
                <div className="h-16 w-16 rounded-full border-4 border-indigo-500/30 flex items-center justify-center font-bold text-indigo-400 bg-indigo-500/10">
                  {health.score}%
                </div>
              </div>

              {/* Missing Sections Count */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase">Missing Modules</p>
                  <h3 className="text-3xl font-black text-white mt-1">{health.missingSections.length}</h3>
                  <p className="text-xs text-slate-500 mt-1">Action items needed</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6" />
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-md space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-indigo-400" />
                Category Health Scores
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(health.categoryScores || {}).map(([cat, score]) => (
                  <div key={cat} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300">{cat}</span>
                      <span className="font-mono font-bold text-indigo-400">{score} pts</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${(score / 20) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Priority Improvements */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-md space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <ArrowUpRight className="h-5 w-5 text-purple-400" />
                Priority Improvement Recommendations
              </h3>

              {health.priorityImprovements.length === 0 ? (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" /> Excellent job! No high priority improvements needed.
                </div>
              ) : (
                <div className="space-y-3">
                  {health.priorityImprovements.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-sm">
                      <div className="h-6 w-6 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                        {idx + 1}
                      </div>
                      <span className="text-slate-300 font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </StudentLayout>
  );
}
