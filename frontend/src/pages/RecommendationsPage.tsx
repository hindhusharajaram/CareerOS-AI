import React, { useEffect, useState } from 'react';
import { Sparkles, Target, BookOpen, Layers } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { intelligenceService, RecommendationData } from '../services/intelligenceService';

export default function RecommendationsPage(): React.ReactElement {
  const [recs, setRecs] = useState<RecommendationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRecs();
  }, []);

  const fetchRecs = async () => {
    setIsLoading(true);
    try {
      const data = await intelligenceService.getRecommendations();
      setRecs(data);
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
            <Sparkles className="h-6 w-6 text-teal-400" />
            Career Recommendation Engine
          </h2>
          <p className="text-xs text-slate-400 mt-1">Explainable career recommendations with measurable reasons and confidence scores</p>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
          </div>
        ) : recs ? (
          <div className="space-y-8">
            {/* Roles & Domains */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Target className="h-4 w-4 text-teal-400" /> Suitable Roles
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recs.suitableRoles.map((role, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-xl bg-teal-500/10 text-teal-300 border border-teal-500/20 text-xs font-semibold">
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="h-4 w-4 text-indigo-400" /> Suitable Industry Domains
                </h3>
                <div className="flex flex-wrap gap-2">
                  {recs.suitableDomains.map((dom, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-xl bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-xs font-semibold">
                      {dom}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendations List with Confidence Scores & Reason Banners */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-md space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-teal-400" />
                Actionable Career & NPTEL Course Recommendations
              </h3>

              <div className="space-y-4">
                {recs.items.map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-base font-bold text-white">{item.title}</h4>
                        <span className="text-[11px] font-mono text-teal-400 uppercase">{item.category}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                          {item.priority} PRIORITY
                        </span>
                        <span className="px-3 py-1 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20 text-xs font-mono font-bold">
                          {(item.confidenceScore * 100).toFixed(0)}% Confidence
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                      💡 <strong>Reason:</strong> {item.reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </StudentLayout>
  );
}
