import React, { useEffect, useState } from 'react';
import { Brain, Cpu, Clock, AlertCircle, ArrowUpRight } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { intelligenceService, SkillGapData } from '../services/intelligenceService';

export default function SkillGapPage(): React.ReactElement {
  const [gap, setGap] = useState<SkillGapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchGap();
  }, []);

  const fetchGap = async () => {
    setIsLoading(true);
    try {
      const data = await intelligenceService.getSkillGap();
      setGap(data);
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
            <Brain className="h-6 w-6 text-indigo-400" />
            Skill Gap Engine & Role Alignment
          </h2>
          <p className="text-xs text-slate-400 mt-1">Calculates missing skills and estimated learning hours for target career roles</p>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          </div>
        ) : gap ? (
          <div className="space-y-8">
            {/* Role Header Banner */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-md flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Target Role Objective</p>
                <h3 className="text-3xl font-black text-white mt-1">{gap.preferredRole}</h3>
                <p className="text-xs text-slate-400 mt-2">
                  Currently Verified Skills: <strong className="text-white">{gap.currentSkills.length}</strong>
                </p>
              </div>

              <div className="px-5 py-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold flex items-center gap-2">
                <Cpu className="h-4 w-4 text-indigo-400" />
                Missing Competencies: {gap.missingSkills.length}
              </div>
            </div>

            {/* Missing Skills Grid */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-md space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <ArrowUpRight className="h-5 w-5 text-indigo-400" />
                Required Skill Gap Breakdown
              </h3>

              {gap.missingSkills.length === 0 ? (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                  Awesome! You hold all core skills required for {gap.preferredRole}.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gap.missingSkills.map((item, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-base font-bold text-white">{item.skillName}</h4>
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {item.priorityLevel} PRIORITY
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                        <span className="flex items-center gap-1">
                          <AlertCircle className="h-3.5 w-3.5 text-amber-400" /> Difficulty: {item.learningDifficulty}
                        </span>
                        <span className="flex items-center gap-1 text-slate-300 font-mono">
                          <Clock className="h-3.5 w-3.5 text-indigo-400" /> ~{item.estimatedLearningHours} Hours
                        </span>
                      </div>
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
