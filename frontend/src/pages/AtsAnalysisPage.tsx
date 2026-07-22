import React, { useEffect, useState } from 'react';
import { FileText, CheckCircle2, XCircle, Sparkles, AlertCircle } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { intelligenceService, AtsScoreData } from '../services/intelligenceService';

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

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="border-b border-slate-800 pb-5">
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <FileText className="h-6 w-6 text-purple-400" />
            ATS Resume Analyzer & Keyword Audit
          </h2>
          <p className="text-xs text-slate-400 mt-1">Rule-based ATS evaluation verifying keyword density, section headers, and formatting</p>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
          </div>
        ) : ats ? (
          <div className="space-y-8">
            {/* Header Score Card */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">ATS Compatibility Score</p>
                <h3 className="text-4xl font-black text-white mt-1">Resume Quality</h3>
                <p className="text-xs text-slate-400 mt-2 max-w-md">
                  Measures whether applicant tracking systems (ATS) can parse contact info, technical skills, and project history cleanly.
                </p>
              </div>

              <div className="h-32 w-32 rounded-full border-8 border-purple-500/30 bg-purple-500/10 flex flex-col items-center justify-center font-black text-purple-400">
                <span className="text-4xl">{ats.atsScore}</span>
                <span className="text-[10px] uppercase font-mono tracking-wider opacity-80">/ 100 ATS</span>
              </div>
            </div>

            {/* Section Completeness Grid */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-md space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-400" />
                Required ATS Section Completeness
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(ats.sectionCompleteness || {}).map(([sec, present]) => (
                  <div
                    key={sec}
                    className={`p-4 rounded-2xl border flex items-center justify-between ${
                      present ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-red-500/10 border-red-500/20 text-red-300'
                    }`}
                  >
                    <span className="text-xs font-semibold">{sec}</span>
                    {present ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : <XCircle className="h-4 w-4 text-red-400" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Suggestions & Missing Sections */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-md space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-amber-400" />
                ATS Optimization Suggestions
              </h3>

              {ats.suggestions.length === 0 ? (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
                  Resume document passes all basic ATS criteria cleanly!
                </div>
              ) : (
                <div className="space-y-3">
                  {ats.suggestions.map((sug, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-slate-300 text-xs flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 text-xs font-bold">
                        {idx + 1}
                      </div>
                      <span>{sug}</span>
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
