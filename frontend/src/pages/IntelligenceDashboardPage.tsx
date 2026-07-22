import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Brain, Award, Target, FileText, ArrowRight, ShieldCheck, TrendingUp, Compass } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { intelligenceService, CareerScoreData, AtsScoreData, EligibilityReportData, RecommendationData } from '../services/intelligenceService';

export default function IntelligenceDashboardPage(): React.ReactElement {
  const [score, setScore] = useState<CareerScoreData | null>(null);
  const [ats, setAts] = useState<AtsScoreData | null>(null);
  const [eligibility, setEligibility] = useState<EligibilityReportData | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [s, a, e, r] = await Promise.all([
        intelligenceService.getCareerScore(),
        intelligenceService.getAtsScore(),
        intelligenceService.getEligibility(),
        intelligenceService.getRecommendations()
      ]);
      setScore(s);
      setAts(a);
      setEligibility(e);
      setRecommendations(r);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-900 p-8 shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs text-indigo-300 mb-3">
                <Brain className="h-3.5 w-3.5 text-indigo-400" />
                Deterministic Career Decision Platform
              </div>
              <h2 className="text-3xl font-extrabold text-white">Career Intelligence Hub</h2>
              <p className="mt-2 text-sm text-slate-400 max-w-xl">
                Explainable placement scoring, ATS resume analysis, skill gap detection, personal 90-day roadmaps, and internship eligibility evaluation.
              </p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Master Score Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Career Score */}
              <Link to="/intelligence/score" className="group rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md hover:border-indigo-500/40 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Career Score</span>
                  <Award className="h-5 w-5 text-indigo-400" />
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white">{score?.overallScore || 0}</span>
                  <span className="text-xs text-slate-500 font-mono">/ 1000 Pts</span>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-indigo-400 font-semibold">
                  <span>View Score Breakdown</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
                </div>
              </Link>

              {/* ATS Score */}
              <Link to="/intelligence/ats" className="group rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md hover:border-purple-500/40 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase">ATS Resume Score</span>
                  <FileText className="h-5 w-5 text-purple-400" />
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white">{ats?.atsScore || 0}</span>
                  <span className="text-xs text-slate-500 font-mono">/ 100 Score</span>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-purple-400 font-semibold">
                  <span>ATS Keyword Audit</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
                </div>
              </Link>

              {/* Interview Readiness */}
              <Link to="/intelligence/recommendations" className="group rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md hover:border-emerald-500/40 transition">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Interview Readiness</span>
                  <Target className="h-5 w-5 text-emerald-400" />
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white">{recommendations?.interviewReadinessScore || 0}%</span>
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-emerald-400 font-semibold">
                  <span>AI Placement Recommendations</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
                </div>
              </Link>
            </div>

            {/* Modules Shortcut Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              <Link to="/intelligence/skill-gap" className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 hover:border-indigo-500/40 transition text-center space-y-2">
                <Brain className="h-6 w-6 text-indigo-400 mx-auto" />
                <p className="text-xs font-bold text-white">Skill Gap</p>
              </Link>
              <Link to="/intelligence/roadmap" className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 hover:border-purple-500/40 transition text-center space-y-2">
                <Compass className="h-6 w-6 text-purple-400 mx-auto" />
                <p className="text-xs font-bold text-white">90-Day Roadmap</p>
              </Link>
              <Link to="/intelligence/eligibility" className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 hover:border-emerald-500/40 transition text-center space-y-2">
                <ShieldCheck className="h-6 w-6 text-emerald-400 mx-auto" />
                <p className="text-xs font-bold text-white">Eligibility</p>
              </Link>
              <Link to="/intelligence/projects" className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 hover:border-amber-500/40 transition text-center space-y-2">
                <FileText className="h-6 w-6 text-amber-400 mx-auto" />
                <p className="text-xs font-bold text-white">Project Analyzer</p>
              </Link>
              <Link to="/intelligence/recommendations" className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 hover:border-teal-500/40 transition text-center space-y-2">
                <Sparkles className="h-6 w-6 text-teal-400 mx-auto" />
                <p className="text-xs font-bold text-white">Recommendations</p>
              </Link>
              <Link to="/intelligence/trends" className="p-4 rounded-2xl border border-slate-800 bg-slate-950/60 hover:border-pink-500/40 transition text-center space-y-2">
                <TrendingUp className="h-6 w-6 text-pink-400 mx-auto" />
                <p className="text-xs font-bold text-white">Trends Analytics</p>
              </Link>
            </div>

            {/* Company Eligibility Highlights */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  Internship Eligibility Overview
                </h3>
                <Link to="/intelligence/eligibility" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">
                  View All Companies →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {eligibility?.evaluations.slice(0, 4).map((comp, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">{comp.companyName}</p>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">{comp.programName}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      comp.status === 'ELIGIBLE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {comp.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}
