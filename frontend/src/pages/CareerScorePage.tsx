import React, { useEffect, useState } from 'react';
import { Award, CheckCircle2, AlertCircle, TrendingUp, Star, Clock } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { scoreService, CareerScoreData } from '../services/scoreService';
import SectionHeader from '../components/ui/SectionHeader';
import { ProgressBar, ProgressRing } from '../components/ui/Progress';
import { GlassCard } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import { SkeletonCard, SkeletonStatGrid } from '../components/ui/Skeleton';

function getScoreTier(val: number) {
  if (val >= 850) return { label: 'Expert', color: 'emerald', desc: 'Top tier placement candidate', stars: 5 };
  if (val >= 600) return { label: 'Advanced', color: 'indigo', desc: 'High placement readiness', stars: 4 };
  if (val >= 300) return { label: 'Intermediate', color: 'amber', desc: 'Solid foundation established', stars: 3 };
  return { label: 'Beginner', color: 'error', desc: 'Building candidate profile', stars: 2 };
}

const ringColorMap: Record<string, 'emerald' | 'indigo' | 'amber' | 'purple'> = {
  Expert: 'emerald',
  Advanced: 'indigo',
  Intermediate: 'amber',
  Beginner: 'amber',
};

const categoryMaxPoints: Record<string, number> = {
  'Profile Completeness': 150,
  'Projects': 200,
  'Skills Matrix': 200,
  'Experience': 150,
  'Education': 100,
  'Certificates': 100,
  'Resume Quality': 50,
  'GitHub Presence': 30,
  'LinkedIn Presence': 20,
};

export default function CareerScorePage(): React.ReactElement {
  const [score, setScore] = useState<CareerScoreData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchScore();
  }, []);

  const fetchScore = async () => {
    setIsLoading(true);
    try {
      const data = await scoreService.getCareerScore();
      setScore(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <SectionHeader
          title="Career Score Engine"
          subtitle="Weighted scoring model evaluating candidate competitiveness across 9 indicators for top placement drives"
          badge="Intelligence"
          icon={<Award className="h-6 w-6" />}
        />

        {isLoading ? (
          <div className="space-y-6">
            <SkeletonCard className="h-48" />
            <SkeletonStatGrid cols={2} />
          </div>
        ) : score ? (
          <div className="space-y-6">

            {/* ===== SCORE HERO CARD ===== */}
            {(() => {
              const tier = getScoreTier(score.overallScore);
              const ringColor = ringColorMap[tier.label] || 'indigo';
              return (
                <div className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-slate-900 via-indigo-950/20 to-slate-900 p-8 overflow-hidden relative">
                  <div className="absolute top-0 right-0 h-48 w-48 bg-indigo-500/10 blur-[60px] rounded-full" />
                  <div className="relative flex flex-col md:flex-row items-center gap-8">
                    {/* Ring */}
                    <div className="shrink-0">
                      <ProgressRing
                        value={score.overallScore}
                        max={1000}
                        size={160}
                        strokeWidth={10}
                        color={ringColor}
                      >
                        <div className="text-center">
                          <span className="text-3xl font-black text-white">
                            <AnimatedCounter target={score.overallScore} duration={1800} />
                          </span>
                          <p className="text-[10px] text-slate-500 font-mono mt-0.5">/1000 pts</p>
                        </div>
                      </ProgressRing>
                    </div>

                    {/* Score Details */}
                    <div className="flex-1 text-center md:text-left">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Overall Placement Index</p>
                      <div className="flex items-center gap-3 justify-center md:justify-start mb-3">
                        <h3 className="text-4xl font-black text-white">{tier.label}</h3>
                        <Badge variant={tier.color as any} size="lg">{tier.label}</Badge>
                      </div>
                      <p className="text-sm text-slate-400 mb-4">{tier.desc}</p>

                      {/* Stars */}
                      <div className="flex items-center gap-1 justify-center md:justify-start mb-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${i < tier.stars ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`}
                          />
                        ))}
                      </div>

                      <p className="text-xs text-slate-500 max-w-md">
                        Calculated using 9 weighted indicators including Projects (20%), Skills (20%), Experience (15%), and Profile Completeness (15%).
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* ===== CATEGORY BREAKDOWN ===== */}
            <GlassCard padding="lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#2E4CFF]" />
                  <h3 className="text-base font-bold text-content-primary">Category Weightage Breakdown</h3>
                </div>
                {score.lastCalculated && (
                  <span className="text-[11px] font-mono text-content-muted flex items-center gap-1">
                    <Clock className="h-3 w-3 text-[#2E4CFF]" />
                    Updated: {new Date(score.lastCalculated).toLocaleTimeString()}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {Object.entries(score.categoryScores || {}).map(([cat, val]) => {
                  const maxPts = categoryMaxPoints[cat] || 100;
                  const weightStr = score.categoryWeights?.[cat] ? ` (${score.categoryWeights[cat]})` : '';
                  return (
                    <ProgressBar
                      key={cat}
                      label={`${cat}${weightStr}`}
                      value={val as number}
                      max={maxPts}
                      sublabel={`${val} / ${maxPts} pts`}
                      color="auto"
                      size="md"
                    />
                  );
                })}
              </div>
            </GlassCard>

            {/* ===== STRENGTHS & IMPROVEMENTS ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Strengths */}
              <GlassCard padding="lg">
                <div className="flex items-center gap-2 mb-5">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">Key Candidate Strengths</h3>
                </div>
                {score.strengths.length === 0 ? (
                  <p className="text-sm text-slate-500">Complete more sections to unlock strength indicators.</p>
                ) : (
                  <div className="space-y-2.5">
                    {score.strengths.map((str, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-500/8 border border-emerald-500/15">
                        <div className="h-6 w-6 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        </div>
                        <span className="text-sm text-emerald-300">{str}</span>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>

              {/* Improvements */}
              <GlassCard padding="lg">
                <div className="flex items-center gap-2 mb-5">
                  <AlertCircle className="h-5 w-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">Priority Improvement Areas</h3>
                </div>
                {score.improvementAreas.length === 0 ? (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/8 border border-emerald-500/15">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span className="text-sm text-emerald-300">No major improvement flags detected!</span>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {score.improvementAreas.map((imp, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-500/8 border border-amber-500/15">
                        <div className="h-6 w-6 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                          <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
                        </div>
                        <span className="text-sm text-amber-300">{imp}</span>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </div>
          </div>
        ) : (
          <div className="py-20 text-center text-slate-500">
            <Award className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No score data available. Complete your profile to compute your score.</p>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
