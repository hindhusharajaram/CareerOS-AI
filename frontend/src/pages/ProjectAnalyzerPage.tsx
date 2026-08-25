import React, { useEffect, useState } from 'react';
import { FolderGit2, ExternalLink, Github, BarChart, AlertCircle } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { intelligenceService, ProjectAnalysisData } from '../services/intelligenceService';
import SectionHeader from '../components/ui/SectionHeader';
import { GlassCard } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { SkeletonCard } from '../components/ui/Skeleton';
import { ProgressBar as Progress } from '../components/ui/Progress';
import AnimatedCounter from '../components/ui/AnimatedCounter';

export default function ProjectAnalyzerPage(): React.ReactElement {
  const [analysis, setAnalysis] = useState<ProjectAnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRepo, setSelectedRepo] = useState('hindhusharajaram/CareerOS-AI');

  const mockRepos: Record<string, { title: string; difficulty: string; qualityScore: number; suggestions: string[]; hasGithub: boolean; hasLiveDemo: boolean }> = {
    'hindhusharajaram/CareerOS-AI': {
      title: 'CareerOS-AI — AI Placement Engine Platform',
      difficulty: 'HARD',
      qualityScore: 92,
      hasGithub: true,
      hasLiveDemo: true,
      suggestions: [
        'Dockerfile detected — add multi-stage build optimization to shrink image size',
        'Spring Boot & React detected — add JWT token rotation strategy',
        'Add Testcontainers for isolated PostgreSQL database integration testing'
      ]
    },
    'hindhusharajaram/spring-microservices-demo': {
      title: 'Spring Microservices — Distributed Event Architecture',
      difficulty: 'HARD',
      qualityScore: 84,
      hasGithub: true,
      hasLiveDemo: false,
      suggestions: [
        'No Dockerfile detected — containerize each microservice with Docker Compose',
        'Add Resilience4j circuit breakers for Gateway service fault tolerance',
        'Configure Spring Cloud Config Server for centralized external config'
      ]
    },
    'hindhusharajaram/react-dashboard': {
      title: 'React Admin Dashboard — Realtime Analytics System',
      difficulty: 'INTERMEDIATE',
      qualityScore: 78,
      hasGithub: true,
      hasLiveDemo: true,
      suggestions: [
        'No test files detected — add Vitest & React Testing Library unit tests',
        'Add Nginx Dockerfile for production static artifact hosting',
        'Configure GitHub Actions workflow for automated PR lighthouse audits'
      ]
    }
  };

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

            {/* Repo Switcher Control */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 py-3 bg-surface-card rounded-2xl border border-surface-border">
              <div className="flex items-center gap-3">
                <Github className="h-5 w-5 text-[#2E4CFF]" />
                <div>
                  <h3 className="text-sm font-bold text-content-primary">Select Linked Repository</h3>
                  <p className="text-xs text-content-muted">Live inspection of architecture, Docker, CI/CD, & dependencies</p>
                </div>
              </div>
              <select
                value={selectedRepo}
                onChange={(e) => setSelectedRepo(e.target.value)}
                className="bg-surface-hover border border-surface-border rounded-xl text-xs font-semibold px-3.5 py-2 text-content-primary focus:outline-none focus:border-[#2E4CFF] cursor-pointer"
              >
                {Object.keys(mockRepos).map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {/* Selected Repo Card */}
            {(() => {
              const curRepo = mockRepos[selectedRepo] || mockRepos['hindhusharajaram/CareerOS-AI'];
              return (
                <GlassCard padding="lg" className="hover:border-[#2E4CFF]/30 transition-colors border-2 border-surface-border">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Github className="h-4 w-4 text-[#2E4CFF]" />
                        <span className="text-xs font-mono text-content-muted">{selectedRepo}</span>
                      </div>
                      <h4 className="text-xl font-bold text-content-primary mb-2">{curRepo.title}</h4>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-hover border border-surface-border text-xs font-semibold text-content-secondary">
                          Difficulty: <span className="text-amber-400 font-mono">{curRepo.difficulty}</span>
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-hover border border-surface-border text-xs font-semibold text-emerald-400">
                          <Github className="h-3.5 w-3.5" /> Repository Active
                        </span>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-surface-hover border border-surface-border text-xs font-semibold ${curRepo.hasLiveDemo ? 'text-emerald-400' : 'text-content-muted'}`}>
                          <ExternalLink className="h-3.5 w-3.5" /> {curRepo.hasLiveDemo ? 'Live Demo Online' : 'Local / CLI Only'}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0">
                      <div className="text-3xl font-black text-content-primary flex items-baseline gap-1">
                        {curRepo.qualityScore}
                        <span className="text-sm text-content-muted font-sans font-medium">/100</span>
                      </div>
                      <div className="w-32 mt-1">
                        <Progress value={curRepo.qualityScore} color={curRepo.qualityScore >= 80 ? 'emerald' : curRepo.qualityScore >= 60 ? 'amber' : 'rose'} size="sm" showValue={false} />
                      </div>
                    </div>
                  </div>

                  <div className="bg-surface-hover rounded-xl p-5 border border-surface-border">
                    <h5 className="text-xs font-bold uppercase tracking-widest text-[#2E4CFF] mb-3 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" /> Detected Code Signals & Recommendations
                    </h5>
                    <div className="space-y-2.5">
                      {curRepo.suggestions.map((sug, sIdx) => (
                        <div key={sIdx} className="text-xs text-content-secondary flex items-start gap-3">
                          <span className="text-[#2E4CFF] font-bold mt-0.5">•</span>
                          <span className="leading-relaxed font-medium">{sug}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </GlassCard>
              );
            })()}
          </div>
        ) : null}
      </div>
    </StudentLayout>
  );
}
