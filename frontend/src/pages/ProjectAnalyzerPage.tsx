import React, { useEffect, useState } from 'react';
import { FolderGit2, ExternalLink, Github, BarChart, AlertCircle, CheckCircle2 } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { intelligenceService, ProjectAnalysisData } from '../services/intelligenceService';
import SectionHeader from '../components/ui/SectionHeader';
import { GlassCard } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { SkeletonCard } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { ProgressBar as Progress } from '../components/ui/Progress';
import AnimatedCounter from '../components/ui/AnimatedCounter';

export default function ProjectAnalyzerPage(): React.ReactElement {
  const [analysis, setAnalysis] = useState<ProjectAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    setIsLoading(true);
    try {
      const data = await intelligenceService.getProjectAnalysis();
      setAnalysis(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

    const getScoreGradient = (score: number) => {
    if (score >= 80) return 'from-emerald-500/20 to-teal-500/5';
    if (score >= 60) return 'from-amber-500/20 to-orange-500/5';
    return 'from-rose-500/20 to-pink-500/5';
  };

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        <SectionHeader
          title="Project Quality Analyzer"
          subtitle="AI evaluation of technical complexity, live deployments, and GitHub repository health."
          badge="Portfolio Audit"
          icon={<FolderGit2 className="h-6 w-6" />}
        />

        {isLoading ? (
          <div className="space-y-6">
            <SkeletonCard className="h-48" />
            <div className="space-y-4">
               <SkeletonCard className="h-32" />
               <SkeletonCard className="h-32" />
            </div>
          </div>
        ) : analysis ? (
          <div className="space-y-6 animate-fade-up">
            {/* Header Score */}
            <GlassCard padding="none" className={`overflow-hidden border-2 transition-colors ${analysis.overallProjectScore >= 80 ? 'border-emerald-500/30 shadow-lg shadow-emerald-500/10' : analysis.overallProjectScore >= 60 ? 'border-amber-500/30' : 'border-rose-500/30'}`}>
              <div className={`bg-gradient-to-br ${getScoreGradient(analysis.overallProjectScore)} p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative`}>
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                  <BarChart className="w-64 h-64" />
                </div>
                
                <div className="relative z-10 text-center md:text-left flex-1 max-w-xl">
                  <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                    <Badge variant={analysis.overallProjectScore >= 80 ? 'emerald' : analysis.overallProjectScore >= 60 ? 'amber' : 'error'}>Portfolio Index Score</Badge>
                  </div>
                  <h3 className="text-4xl sm:text-5xl font-black text-white mt-4 mb-3 tracking-tight">Project Portfolio Quality</h3>
                  <p className="text-base text-slate-300/90 leading-relaxed font-medium">
                    Evaluated across {analysis.projectAnalyses.length} submitted projects. High scores indicate strong technical complexity, well-documented code, and accessible live deployments.
                  </p>
                </div>

                <div className="relative z-10 shrink-0">
                  <div className="relative flex items-center justify-center">
                    <svg className="w-48 h-48 transform -rotate-90">
                      <circle className="text-slate-800" strokeWidth="12" stroke="currentColor" fill="transparent" r="88" cx="96" cy="96" />
                      <circle 
                        className={analysis.overallProjectScore >= 80 ? 'text-emerald-500' : analysis.overallProjectScore >= 60 ? 'text-amber-500' : 'text-rose-500'} 
                        strokeWidth="12" 
                        strokeDasharray={88 * 2 * Math.PI} 
                        strokeDashoffset={88 * 2 * Math.PI - (analysis.overallProjectScore / 100) * 88 * 2 * Math.PI}
                        strokeLinecap="round" 
                        stroke="currentColor" 
                        fill="transparent" 
                        r="88" 
                        cx="96" 
                        cy="96"
                        style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="text-5xl font-black text-white tabular-nums tracking-tighter">
                        <AnimatedCounter target={analysis.overallProjectScore} />
                      </span>
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">/ 100</span>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            <div className="flex items-center justify-between px-2 pt-2">
               <h3 className="text-lg font-bold text-white flex items-center gap-2">
                 <FolderGit2 className="h-5 w-5 text-amber-400" />
                 Individual Project Analysis
               </h3>
               <Badge variant="amber">{analysis.projectAnalyses.length} Projects</Badge>
            </div>

            {/* Individual Projects List */}
            {analysis.projectAnalyses.length === 0 ? (
               <EmptyState
                  icon={<FolderGit2 />}
                  title="No projects analyzed"
                  description="Add projects to your profile to get a detailed AI analysis of your portfolio."
               />
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {analysis.projectAnalyses.map((p) => (
                  <GlassCard key={p.projectId} padding="lg" className="hover:border-amber-500/30 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
                      <div>
                        <h4 className="text-xl font-bold text-white mb-2">{p.title}</h4>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-xs font-semibold text-slate-300">
                             Difficulty: <span className="text-amber-400 font-mono">{p.difficultyRating}</span>
                          </span>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-xs font-semibold ${p.hasGithub ? 'text-emerald-400' : 'text-slate-400'}`}>
                            <Github className="h-3.5 w-3.5" /> {p.hasGithub ? 'GitHub Linked' : 'No Repo'}
                          </span>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 text-xs font-semibold ${p.hasLiveDemo ? 'text-emerald-400' : 'text-slate-400'}`}>
                            <ExternalLink className="h-3.5 w-3.5" /> {p.hasLiveDemo ? 'Live Demo' : 'No Demo'}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end shrink-0">
                         <div className="text-3xl font-black text-white flex items-baseline gap-1">
                            {p.qualityScore}
                            <span className="text-sm text-slate-500 font-sans font-medium">/100</span>
                         </div>
                         <div className="w-32 mt-1">
                            <Progress value={p.qualityScore} color={p.qualityScore >= 80 ? 'emerald' : p.qualityScore >= 60 ? 'amber' : 'rose'} size="sm" showValue={false} />
                         </div>
                      </div>
                    </div>

                    {p.suggestions.length > 0 ? (
                      <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-800/80">
                         <h5 className="text-xs font-bold uppercase tracking-widest text-amber-400/80 mb-3 flex items-center gap-2">
                           <AlertCircle className="h-4 w-4" /> Areas for Improvement
                         </h5>
                         <div className="space-y-2.5">
                          {p.suggestions.map((sug, sIdx) => (
                            <div key={sIdx} className="text-sm text-slate-300 flex items-start gap-3">
                              <span className="text-amber-500/50 mt-1 flex-shrink-0">•</span>
                              <span className="leading-relaxed font-medium">{sug}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                       <div className="bg-emerald-500/5 rounded-xl p-4 border border-emerald-500/10 flex items-center gap-3">
                          <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                          <p className="text-sm text-emerald-200 font-medium">This project is perfectly optimized and well-documented.</p>
                       </div>
                    )}
                  </GlassCard>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </StudentLayout>
  );
}
