import React, { useEffect, useState } from 'react';
import { FolderGit2, Cloud, Database, Cpu, Lock, RefreshCw, TrendingUp, GitBranch } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { aiService, AIProjectAdvice } from '../services/aiService';
import SectionHeader from '../components/ui/SectionHeader';
import { GlassCard } from '../components/ui/Card';
import { SkeletonCard } from '../components/ui/Skeleton';

interface AdviceSection {
  icon: React.ElementType;
  title: string;
  items: string[];
  color: string;
  bg: string;
  border: string;
}

export default function AiProjectAdvisorPage(): React.ReactElement {
  const [advice, setAdvice] = useState<AIProjectAdvice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { fetchAdvice(); }, []);

  const fetchAdvice = async () => {
    setIsLoading(true);
    try {
      const data = await aiService.analyzeProject();
      setAdvice(data);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  const sections: AdviceSection[] = advice ? [
    { icon: Cpu, title: 'Architecture', items: advice.architectureImprovements, color: 'text-indigo-400', bg: 'bg-indigo-500/8', border: 'border-indigo-500/15' },
    { icon: Lock, title: 'Security', items: advice.securityImprovements, color: 'text-red-400', bg: 'bg-red-500/8', border: 'border-red-500/15' },
    { icon: Cloud, title: 'Cloud & Deployment', items: advice.cloudImprovements, color: 'text-teal-400', bg: 'bg-teal-500/8', border: 'border-teal-500/15' },
    { icon: Database, title: 'Database', items: advice.databaseImprovements, color: 'text-purple-400', bg: 'bg-purple-500/8', border: 'border-purple-500/15' },
    { icon: TrendingUp, title: 'Scalability', items: advice.scalabilityImprovements, color: 'text-emerald-400', bg: 'bg-emerald-500/8', border: 'border-emerald-500/15' },
    { icon: GitBranch, title: 'Tech Upgrades', items: advice.technologyUpgrades, color: 'text-amber-400', bg: 'bg-amber-500/8', border: 'border-amber-500/15' },
  ] : [];

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <SectionHeader
          title="AI Project Advisor"
          subtitle="Deep architecture analysis with security, cloud deployment, database, and scalability recommendations"
          badge="AI Suite"
          icon={<FolderGit2 className="h-6 w-6" />}
          action={
            <button
              onClick={fetchAdvice}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm font-semibold hover:bg-amber-500/20 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Reanalyze
            </button>
          }
        />

        {isLoading ? (
          <div className="space-y-4">
            <SkeletonCard className="h-24" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} className="h-40" />)}
            </div>
          </div>
        ) : advice ? (
          <div className="space-y-6">
            {/* Project Header */}
            <div className="flex items-center gap-4 p-5 rounded-2xl border border-amber-500/20 bg-amber-500/5">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 shrink-0">
                <FolderGit2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Project Architecture Analysis</p>
                <h3 className="text-xl font-black text-white mt-0.5">{advice.projectTitle}</h3>
                <p className="text-xs text-slate-500 mt-1">Project ID: {advice.projectId}</p>
              </div>
            </div>

            {/* Advice Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {sections.map(({ icon: Icon, title, items, color, bg, border }) => (
                items.length > 0 && (
                  <GlassCard key={title} padding="md">
                    <div className="flex items-center gap-2 mb-4">
                      <Icon className={`h-4.5 w-4.5 ${color}`} />
                      <h4 className="text-sm font-bold text-white">{title}</h4>
                    </div>
                    <div className="space-y-2">
                      {items.map((item, idx) => (
                        <div key={idx} className={`flex items-start gap-2 p-3 rounded-xl ${bg} border ${border} text-xs`}>
                          <span className={`${color} shrink-0 mt-0.5`}>→</span>
                          <span className="text-slate-300">{item}</span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                )
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </StudentLayout>
  );
}
