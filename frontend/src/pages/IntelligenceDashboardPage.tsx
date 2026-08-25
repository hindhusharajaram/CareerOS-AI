import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Brain, Award, FileText, ArrowRight, ShieldCheck, TrendingUp, Compass, Target } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { intelligenceService, AtsScoreData, EligibilityReportData, RecommendationData } from '../services/intelligenceService';
import { scoreService, CareerScoreData } from '../services/scoreService';
import { GlassCard } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { SkeletonCard, SkeletonStatGrid } from '../components/ui/Skeleton';
import AnimatedCounter from '../components/ui/AnimatedCounter';

export default function IntelligenceDashboardPage(): React.ReactElement {
  const [score, setScore] = useState<CareerScoreData | null>(null);
  const [ats, setAts] = useState<AtsScoreData | null>(null);
  const [eligibility, setEligibility] = useState<EligibilityReportData | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [s, a, e, r] = await Promise.all([
        scoreService.getCareerScore(),
        intelligenceService.getAtsScore().catch(() => null),
        intelligenceService.getEligibility().catch(() => null),
        intelligenceService.getRecommendations().catch(() => null),
      ]);
      setScore(s);
      if (a) setAts(a);
      if (e) setEligibility(e);
      if (r) setRecommendations(r);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-6xl mx-auto space-y-6 pb-20">
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-[2rem] border border-emerald-500/30 bg-surface-card shadow-2xl shadow-emerald-500/10 group">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-teal-900/40 to-surface-card z-0"></div>
          
          {/* Decorative Orbs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none"></div>
          
          <div className="relative z-10 p-8 sm:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-6 backdrop-blur-sm">
                <Brain className="h-4 w-4 text-emerald-400" />
                Deterministic Career Decision Platform
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-content-primary mb-4 tracking-tight leading-tight">
                Career Intelligence <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Hub</span>
              </h1>
              <p className="text-base sm:text-lg text-content-secondary font-medium leading-relaxed max-w-xl">
                Explainable placement scoring, ATS resume analysis, skill gap detection, personal 90-day roadmaps, and internship eligibility evaluation.
              </p>
            </div>
            
            <div className="hidden lg:block shrink-0 opacity-80 group-hover:opacity-100 transition-opacity duration-700">
               <Brain className="w-48 h-48 text-emerald-500/20" />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <SkeletonStatGrid cols={3} />
            <SkeletonCard className="h-32" />
            <SkeletonCard className="h-[300px]" />
          </div>
        ) : (
          <div className="space-y-6 animate-fade-up">
            {/* Master Score Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Career Score */}
              <Link to="/intelligence/score" className="group rounded-3xl border border-surface-border bg-surface-card p-6 backdrop-blur-md hover:bg-surface-hover hover:border-emerald-500/40 transition-all duration-300 shadow-lg shadow-black/20 relative overflow-hidden flex flex-col h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:bg-emerald-500/10 transition-colors"></div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <span className="text-xs font-bold tracking-widest text-content-muted uppercase">Career Score</span>
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                    <Award className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 relative z-10 flex-1">
                  <span className="text-5xl font-black text-content-primary tracking-tighter">
                     <AnimatedCounter target={score?.overallScore || 0} />
                  </span>
                  <span className="text-sm text-content-muted font-medium">/ 1000 Pts</span>
                </div>
                <div className="mt-6 flex items-center justify-between text-sm text-emerald-400 font-bold relative z-10 pt-4 border-t border-surface-border">
                  <span>View Score Breakdown</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>

              {/* ATS Score */}
              <Link to="/intelligence/ats" className="group rounded-3xl border border-surface-border bg-surface-card p-6 backdrop-blur-md hover:bg-surface-hover hover:border-teal-500/40 transition-all duration-300 shadow-lg shadow-black/20 relative overflow-hidden flex flex-col h-full">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-bl-full pointer-events-none group-hover:bg-teal-500/10 transition-colors"></div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <span className="text-xs font-bold tracking-widest text-content-muted uppercase">ATS Resume</span>
                  <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400 group-hover:scale-110 transition-transform">
                    <FileText className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 relative z-10 flex-1">
                  <span className="text-5xl font-black text-content-primary tracking-tighter">
                     <AnimatedCounter target={ats?.atsScore || 0} />
                  </span>
                  <span className="text-sm text-content-muted font-medium">/ 100 ATS</span>
                </div>
                <div className="mt-6 flex items-center justify-between text-sm text-teal-400 font-bold relative z-10 pt-4 border-t border-surface-border">
                  <span>ATS Keyword Audit</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>

              {/* Interview Readiness */}
              <Link to="/intelligence/recommendations" className="group rounded-3xl border border-surface-border bg-surface-card p-6 backdrop-blur-md hover:bg-surface-hover hover:border-emerald-500/40 transition-all duration-300 shadow-lg shadow-black/20 relative overflow-hidden flex flex-col h-full">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:bg-emerald-500/10 transition-colors"></div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <span className="text-xs font-bold tracking-widest text-content-muted uppercase">Interview Ready</span>
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                    <Target className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex items-baseline gap-2 relative z-10 flex-1">
                  <span className="text-5xl font-black text-content-primary tracking-tighter flex items-baseline">
                     <AnimatedCounter target={recommendations?.interviewReadinessScore || 0} />%
                  </span>
                </div>
                <div className="mt-6 flex items-center justify-between text-sm text-emerald-400 font-bold relative z-10 pt-4 border-t border-surface-border">
                  <span>AI Recommendations</span>
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            </div>

            {/* Modules Shortcut Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Link to="/intelligence/skill-gap" className="group p-5 rounded-2xl border border-surface-border bg-surface-card hover:bg-surface-hover hover:border-emerald-500/40 transition-all text-center space-y-3 flex flex-col items-center justify-center min-h-[120px]">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                  <Brain className="h-6 w-6" />
                </div>
                <p className="text-sm font-bold text-content-primary tracking-tight">Skill Gap</p>
              </Link>
              <Link to="/intelligence/roadmap" className="group p-5 rounded-2xl border border-surface-border bg-surface-card hover:bg-surface-hover hover:border-teal-500/40 transition-all text-center space-y-3 flex flex-col items-center justify-center min-h-[120px]">
                <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 group-hover:scale-110 transition-transform">
                  <Compass className="h-6 w-6" />
                </div>
                <p className="text-sm font-bold text-content-primary tracking-tight">Roadmap</p>
              </Link>
              <Link to="/intelligence/eligibility" className="group p-5 rounded-2xl border border-surface-border bg-surface-card hover:bg-surface-hover hover:border-emerald-500/40 transition-all text-center space-y-3 flex flex-col items-center justify-center min-h-[120px]">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <p className="text-sm font-bold text-content-primary tracking-tight">Eligibility</p>
              </Link>
              <Link to="/intelligence/projects" className="group p-5 rounded-2xl border border-surface-border bg-surface-card hover:bg-surface-hover hover:border-amber-500/40 transition-all text-center space-y-3 flex flex-col items-center justify-center min-h-[120px]">
                 <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
                  <FileText className="h-6 w-6" />
                </div>
                <p className="text-sm font-bold text-content-primary tracking-tight">Projects</p>
              </Link>
              <Link to="/intelligence/recommendations" className="group p-5 rounded-2xl border border-surface-border bg-surface-card hover:bg-surface-hover hover:border-teal-500/40 transition-all text-center space-y-3 flex flex-col items-center justify-center min-h-[120px]">
                 <div className="p-3 rounded-xl bg-teal-500/10 text-teal-400 group-hover:scale-110 transition-transform">
                  <Sparkles className="h-6 w-6" />
                </div>
                <p className="text-sm font-bold text-content-primary tracking-tight">Actions</p>
              </Link>
              <Link to="/intelligence/trends" className="group p-5 rounded-2xl border border-surface-border bg-surface-card hover:bg-surface-hover hover:border-emerald-500/40 transition-all text-center space-y-3 flex flex-col items-center justify-center min-h-[120px]">
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <p className="text-sm font-bold text-content-primary tracking-tight">Trends</p>
              </Link>
            </div>

            {/* Company Eligibility Highlights */}
            <GlassCard padding="lg">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-content-primary">Eligibility Overview</h3>
                    <p className="text-xs text-content-muted">Snapshot of your hiring drive matches</p>
                  </div>
                </div>
                <Link to="/intelligence/eligibility" className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-sm font-bold">
                  View All <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {eligibility?.evaluations.slice(0, 4).map((comp, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-surface-card border border-surface-border hover:border-emerald-500/30 transition-colors flex flex-col justify-between h-[140px]">
                    <div>
                      <p className="text-base font-bold text-content-primary truncate">{comp.companyName}</p>
                      <p className="text-xs font-semibold text-content-secondary truncate mt-1">{comp.programName}</p>
                    </div>
                    <div className="flex justify-start mt-4">
                       <Badge variant={comp.status === 'ELIGIBLE' ? 'emerald' : 'amber'} size="sm">
                         {comp.status.replace(/_/g, ' ')}
                       </Badge>
                    </div>
                  </div>
                ))}
              </div>
              
              <Link to="/intelligence/eligibility" className="sm:hidden mt-4 w-full flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors text-sm font-bold">
                  View All Companies <ArrowRight className="h-4 w-4" />
              </Link>
            </GlassCard>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
