import React, { useEffect, useState } from 'react';
import { FolderGit2, AlertCircle, ExternalLink, Github } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { intelligenceService, ProjectAnalysisData } from '../services/intelligenceService';

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

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="border-b border-slate-800 pb-5">
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <FolderGit2 className="h-6 w-6 text-amber-400" />
            Project Quality & Portfolio Analyzer
          </h2>
          <p className="text-xs text-slate-400 mt-1">Evaluates technical complexity, live deployment links, and GitHub documentation</p>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          </div>
        ) : analysis ? (
          <div className="space-y-8">
            {/* Header Score */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-md flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase">Portfolio Index Score</p>
                <h3 className="text-3xl font-black text-white mt-1">{analysis.overallProjectScore} <span className="text-lg text-slate-500 font-normal">/ 100</span></h3>
                <p className="text-xs text-slate-400 mt-1">Evaluated across {analysis.projectAnalyses.length} submitted projects</p>
              </div>

              <div className="h-16 w-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-extrabold text-2xl">
                {analysis.overallProjectScore}%
              </div>
            </div>

            {/* Individual Projects List */}
            <div className="space-y-4">
              {analysis.projectAnalyses.map((p) => (
                <div key={p.projectId} className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-white">{p.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">Difficulty Rating: <strong className="text-amber-400 font-mono">{p.difficultyRating}</strong></p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold text-amber-400">
                        Score: {p.qualityScore}/100
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <span className={`flex items-center gap-1.5 ${p.hasGithub ? 'text-emerald-400' : 'text-slate-500'}`}>
                      <Github className="h-4 w-4" /> {p.hasGithub ? 'GitHub Repo Linked' : 'No GitHub Link'}
                    </span>
                    <span className={`flex items-center gap-1.5 ${p.hasLiveDemo ? 'text-emerald-400' : 'text-slate-500'}`}>
                      <ExternalLink className="h-4 w-4" /> {p.hasLiveDemo ? 'Live Demo Deployed' : 'No Live Demo'}
                    </span>
                  </div>

                  {p.suggestions.length > 0 && (
                    <div className="pt-3 border-t border-slate-800/80 space-y-1">
                      {p.suggestions.map((sug, sIdx) => (
                        <p key={sIdx} className="text-xs text-slate-400 flex items-center gap-2">
                          <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0" /> {sug}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </StudentLayout>
  );
}
