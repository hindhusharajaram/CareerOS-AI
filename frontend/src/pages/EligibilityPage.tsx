import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Building2, Target, CheckCircle2, AlertCircle } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { intelligenceService, EligibilityReportData } from '../services/intelligenceService';
import SectionHeader from '../components/ui/SectionHeader';
import { GlassCard } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { SkeletonCard } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';

export default function EligibilityPage(): React.ReactElement {
  const [report, setReport] = useState<EligibilityReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEligibility();
  }, []);

  const fetchEligibility = async () => {
    setIsLoading(true);
    try {
      const data = await intelligenceService.getEligibility();
      setReport(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColorClass = (status: string) => {
    switch (status) {
      case 'ELIGIBLE': return 'text-emerald-400';
      case 'PARTIALLY ELIGIBLE': return 'text-amber-400';
      default: return 'text-rose-400';
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-6xl mx-auto space-y-6 pb-20">
        <SectionHeader
          title="Placement Eligibility"
          subtitle="Deterministically checks your criteria against Tier-1 programs and MNC hiring drives."
          badge="Intelligence Engine"
          icon={<ShieldCheck className="h-6 w-6" />}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkeletonCard className="h-[400px]" />
            <SkeletonCard className="h-[400px]" />
          </div>
        ) : report ? (
          <div className="space-y-6 animate-fade-up">
            
            {report.evaluations.length === 0 ? (
               <EmptyState
                  icon={<Target />}
                  title="No evaluations found"
                  description="We haven't evaluated your profile against any active hiring drives yet."
               />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {report.evaluations.map((comp, idx) => (
                  <GlassCard key={idx} padding="lg" className="flex flex-col h-full hover:border-emerald-500/30 transition-colors group">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center group-hover:scale-105 transition-transform">
                          <Building2 className={`h-6 w-6 ${getStatusColorClass(comp.status)}`} />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-white leading-tight">{comp.companyName}</h4>
                          <p className="text-sm font-semibold text-slate-400 mt-0.5">{comp.programName}</p>
                          <div className="flex justify-start mt-4">
                            <Badge variant={comp.status === 'ELIGIBLE' ? 'emerald' : 'amber'} size="sm">
                              {comp.status.replace(/_/g, ' ')}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800/60 mb-6 flex-1 shadow-inner">
                      <p className="text-sm text-slate-300 leading-relaxed font-medium">
                        {comp.explanation}
                      </p>
                    </div>

                    <div className="space-y-4">
                      {comp.metCriteria.length > 0 && (
                        <div>
                          <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">Met Criteria</h5>
                          <div className="space-y-2">
                            {comp.metCriteria.map((met, mIdx) => (
                              <div key={mIdx} className="flex items-start gap-2.5 p-2 rounded-lg hover:bg-slate-800/40 transition-colors">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                                <span className="text-sm text-slate-300 font-medium">{met}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {comp.missingCriteria.length > 0 && (
                        <div>
                          <h5 className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 mt-4">Missing Requirements & Direct Actions</h5>
                          <div className="space-y-2">
                            {comp.missingCriteria.map((miss, msIdx) => (
                              <div key={msIdx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/15">
                                <div className="flex items-start gap-2.5">
                                  <AlertCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                                  <span className="text-xs text-amber-200 font-medium">{miss}</span>
                                </div>
                                <Link
                                  to={miss.toLowerCase().includes('skill') ? '/intelligence/skill-gap' : '/profile'}
                                  className="text-[11px] font-bold text-[#2E4CFF] hover:underline shrink-0"
                                >
                                  {miss.toLowerCase().includes('skill') ? 'Fix in Skill Gap →' : 'Fix in Profile →'}
                                </Link>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
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
