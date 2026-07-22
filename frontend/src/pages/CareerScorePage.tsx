import React, { useEffect, useState } from 'react';
import { Award, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { intelligenceService, CareerScoreData } from '../services/intelligenceService';

export default function CareerScorePage(): React.ReactElement {
  const [score, setScore] = useState<CareerScoreData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchScore();
  }, []);

  const fetchScore = async () => {
    setIsLoading(true);
    try {
      const data = await intelligenceService.getCareerScore();
      setScore(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (val: number) => {
    if (val >= 800) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (val >= 600) return 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10';
    if (val >= 400) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-red-400 border-red-500/30 bg-red-500/10';
  };

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="border-b border-slate-800 pb-5">
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Award className="h-6 w-6 text-indigo-400" />
            Career Score Engine (0–1000 Score)
          </h2>
          <p className="text-xs text-slate-400 mt-1">Weighted scoring model evaluating candidate competitiveness for top placement drives</p>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          </div>
        ) : score ? (
          <div className="space-y-8">
            {/* Score Ring Header */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Overall Placement Index</p>
                <h3 className="text-4xl font-black text-white mt-1">Career Score</h3>
                <p className="text-xs text-slate-400 mt-2 max-w-md">
                  Calculated using 9 weighted indicators including Projects (20%), Skills (20%), Experience (15%), and Completeness (15%).
                </p>
              </div>

              <div className={`h-36 w-36 rounded-full border-8 flex flex-col items-center justify-center font-black ${getScoreColor(score.overallScore)}`}>
                <span className="text-4xl">{score.overallScore}</span>
                <span className="text-[10px] uppercase font-mono tracking-wider font-semibold opacity-80">/ 1000 Pts</span>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-md space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-400" />
                Category Weightage Breakdown
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(score.categoryScores || {}).map(([cat, val]) => (
                  <div key={cat} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-300">{cat}</span>
                      <span className="font-mono font-bold text-indigo-400">{val} pts</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, (val / 200) * 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  Key Candidate Strengths
                </h3>
                {score.strengths.length === 0 ? (
                  <p className="text-xs text-slate-500">Complete more profile sections to unlock strength indicators.</p>
                ) : (
                  <div className="space-y-2">
                    {score.strengths.map((str, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>{str}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Improvement Areas */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-amber-400" />
                  Priority Improvement Areas
                </h3>
                {score.improvementAreas.length === 0 ? (
                  <p className="text-xs text-slate-500">No major improvement flags detected!</p>
                ) : (
                  <div className="space-y-2">
                    {score.improvementAreas.map((imp, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{imp}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </StudentLayout>
  );
}
