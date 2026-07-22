import React, { useEffect, useState } from 'react';
import { FolderGit2, Cloud, Database, Cpu, Lock } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { aiService, AIProjectAdvice } from '../services/aiService';

export default function AiProjectAdvisorPage(): React.ReactElement {
  const [advice, setAdvice] = useState<AIProjectAdvice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdvice();
  }, []);

  const fetchAdvice = async () => {
    setIsLoading(true);
    try {
      const data = await aiService.analyzeProject();
      setAdvice(data);
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
            AI Project & Architecture Advisor
          </h2>
          <p className="text-xs text-slate-400 mt-1">Deep code architecture, security, cloud deployment, and database recommendations</p>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          </div>
        ) : advice ? (
          <div className="space-y-8">
            {/* Header */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md">
              <p className="text-xs font-semibold text-slate-400 uppercase">Project Architecture Analysis</p>
              <h3 className="text-2xl font-black text-white mt-1">{advice.projectTitle}</h3>
            </div>

            {/* Architecture & Security Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Architecture */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-3">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-indigo-400" /> Architecture Improvements
                </h4>
                <div className="space-y-2">
                  {advice.architectureImprovements.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                      • {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Security */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-3">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Lock className="h-5 w-5 text-red-400" /> Security Improvements
                </h4>
                <div className="space-y-2">
                  {advice.securityImprovements.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300">
                      • {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Cloud & Deployment */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-3">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-teal-400" /> Cloud & Deployment
                </h4>
                <div className="space-y-2">
                  {advice.cloudImprovements.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                      • {item}
                    </div>
                  ))}
                </div>
              </div>

              {/* Database & Scalability */}
              <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-3">
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Database className="h-5 w-5 text-purple-400" /> Database Optimization
                </h4>
                <div className="space-y-2">
                  {advice.databaseImprovements.map((item, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                      • {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </StudentLayout>
  );
}
