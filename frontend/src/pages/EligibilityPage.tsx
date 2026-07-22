import React, { useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, Building2 } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { intelligenceService, EligibilityReportData } from '../services/intelligenceService';

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ELIGIBLE':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'NEARLY_ELIGIBLE':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default:
        return 'bg-red-500/10 text-red-400 border-red-500/20';
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="border-b border-slate-800 pb-5">
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-emerald-400" />
            Internship & Placement Eligibility Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">Deterministically checks eligibility criteria for Tier-1 programs and MNC hiring drives</p>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
          </div>
        ) : report ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {report.evaluations.map((comp, idx) => (
              <div key={idx} className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                        <Building2 className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-white">{comp.companyName}</h4>
                        <p className="text-xs text-indigo-400">{comp.programName}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${getStatusBadge(comp.status)}`}>
                      {comp.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800/80 pt-3">{comp.explanation}</p>

                  <div className="space-y-1.5 pt-2">
                    {comp.metCriteria.map((met, mIdx) => (
                      <div key={mIdx} className="text-xs text-emerald-400 flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                        <span>{met}</span>
                      </div>
                    ))}
                    {comp.missingCriteria.map((miss, msIdx) => (
                      <div key={msIdx} className="text-xs text-red-400 flex items-center gap-2">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{miss}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </StudentLayout>
  );
}
