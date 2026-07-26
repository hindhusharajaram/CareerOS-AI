import React, { useEffect, useState } from 'react';
import { FileText, XCircle, Sparkles, BarChart, CheckCircle2, AlertCircle } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { intelligenceService, AtsScoreData } from '../services/intelligenceService';
import SectionHeader from '../components/ui/SectionHeader';
import { GlassCard } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { SkeletonCard } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import AnimatedCounter from '../components/ui/AnimatedCounter';

export default function AtsAnalysisPage(): React.ReactElement {
  const [ats, setAts] = useState<AtsScoreData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAts();
  }, []);

  const fetchAts = async () => {
    setIsLoading(true);
    try {
      const data = await intelligenceService.getAtsScore();
      setAts(data);
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
          title="ATS Resume Analyzer"
          subtitle="Rule-based evaluation of keyword density, section headers, and machine readability."
          badge="Intelligence Engine"
          icon={<FileText className="h-6 w-6" />}
        />

        {isLoading ? (
          <div className="space-y-6">
            <SkeletonCard className="h-48" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkeletonCard className="h-[300px]" />
              <SkeletonCard className="h-[300px]" />
            </div>
          </div>
        ) : ats ? (
          <div className="space-y-6 animate-fade-up">
            {/* Header Score Card */}
            <GlassCard padding="none" className={`overflow-hidden border-2 transition-colors ${ats.atsScore >= 80 ? 'border-emerald-500/30 shadow-lg shadow-emerald-500/10' : ats.atsScore >= 60 ? 'border-amber-500/30' : 'border-rose-500/30'}`}>
              <div className={`bg-gradient-to-br ${getScoreGradient(ats.atsScore)} p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 relative`}>
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                  <BarChart className="w-64 h-64" />
                </div>
                
                <div className="relative z-10 text-center md:text-left flex-1 max-w-xl">
                  <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                    <Badge variant={ats.atsScore >= 80 ? 'emerald' : ats.atsScore >= 60 ? 'amber' : 'error'}>ATS Compatibility</Badge>
                  </div>
                  <h3 className="text-4xl sm:text-5xl font-black text-white mt-4 mb-3 tracking-tight">Resume Quality Score</h3>
                  <p className="text-base text-slate-300/90 leading-relaxed font-medium">
                    Measures whether applicant tracking systems (ATS) can parse your contact info, technical skills, and project history cleanly without data loss.
                  </p>
                </div>

                <div className="relative z-10 shrink-0">
                  <div className="relative flex items-center justify-center">
                    <svg className="w-48 h-48 transform -rotate-90">
                      <circle className="text-slate-800" strokeWidth="12" stroke="currentColor" fill="transparent" r="88" cx="96" cy="96" />
                      <circle 
                        className={ats.atsScore >= 80 ? 'text-emerald-500' : ats.atsScore >= 60 ? 'text-amber-500' : 'text-rose-500'} 
                        strokeWidth="12" 
                        strokeDasharray={88 * 2 * Math.PI} 
                        strokeDashoffset={88 * 2 * Math.PI - (ats.atsScore / 100) * 88 * 2 * Math.PI}
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
                        <AnimatedCounter target={ats.atsScore} />
                      </span>
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-1">/ 100</span>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Section Completeness */}
              <GlassCard padding="lg" className="flex flex-col h-full">
                <div className="flex items-center gap-2 mb-6 shrink-0">
                  <div className="h-8 w-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <Sparkles className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Section Completeness</h3>
                </div>

                <div className="grid grid-cols-1 gap-3 flex-1">
                  {Object.entries(ats.sectionCompleteness || {}).map(([sec, present]) => (
                    <div
                      key={sec}
                      className={`p-4 rounded-xl border flex items-center justify-between transition-colors group ${
                        present 
                          ? 'bg-emerald-500/5 border-emerald-500/20 hover:bg-emerald-500/10' 
                          : 'bg-rose-500/5 border-rose-500/20 hover:bg-rose-500/10'
                      }`}
                    >
                      <span className={`text-sm font-semibold capitalize tracking-tight ${present ? 'text-emerald-100' : 'text-rose-100'}`}>
                        {sec.replace(/_/g, ' ')}
                      </span>
                      {present ? (
                        <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                          <CheckCircle2 className="h-3.5 w-3.5" /> Found
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
                          <XCircle className="h-3.5 w-3.5" /> Missing
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Suggestions */}
              <GlassCard padding="lg" className="flex flex-col h-full">
                <div className="flex items-center gap-2 mb-6 shrink-0">
                  <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
                    <AlertCircle className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">Optimization Suggestions</h3>
                </div>

                {ats.suggestions.length === 0 ? (
                  <EmptyState
                    icon={<CheckCircle2 className="text-emerald-400" />}
                    title="Perfect Structure"
                    description="Your resume document passes all basic ATS criteria cleanly!"
                    className="flex-1"
                  />
                ) : (
                  <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-2 max-h-[400px]">
                    {ats.suggestions.map((sug, idx) => (
                      <div key={idx} className="group p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-slate-300 text-sm flex items-start gap-3 hover:bg-slate-800/60 hover:border-amber-500/30 transition-all">
                        <div className="h-6 w-6 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 text-xs font-bold font-mono mt-0.5 border border-amber-500/20">
                          {idx + 1}
                        </div>
                        <span className="leading-relaxed font-medium">{sug}</span>
                      </div>
                    ))}
                  </div>
                )}
              </GlassCard>
            </div>
          </div>
        ) : null}
      </div>
    </StudentLayout>
  );
}
