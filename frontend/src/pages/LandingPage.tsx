import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Briefcase, GraduationCap, TrendingUp, ChevronRight } from 'lucide-react';

export default function LandingPage(): React.ReactElement {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] h-[600px] w-[600px] rounded-full bg-indigo-900/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-purple-900/20 blur-[120px] pointer-events-none" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Navigation Header */}
      <header className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <nav className="flex items-center justify-between py-6" aria-label="Global">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-400 tracking-tight">
              CareerOS AI
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="text-sm font-semibold leading-6 text-slate-300 hover:text-white transition duration-200"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-300 hover:shadow-indigo-500/20 shadow-md"
            >
              Register
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 mx-auto max-w-7xl px-6 py-20 lg:px-8 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300 mb-8 backdrop-blur-md animate-pulse">
            <Sparkles className="h-4 w-4" />
            <span>Next Gen Career Intelligence Platform</span>
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-white via-slate-100 to-slate-400 pb-2">
            Supercharge Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">Career Trajectory</span>
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-400 max-w-2xl mx-auto">
            CareerOS AI bridges the gap between students, companies, and academic institutions using state-of-the-art career planning dashboards, resume matching, and placement intelligence.
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/register"
              className="group relative inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              Get Started Free
              <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="text-sm font-semibold leading-6 text-slate-300 hover:text-white flex items-center gap-1 transition duration-200"
            >
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="mx-auto mt-24 max-w-5xl sm:mt-32">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {/* Card 1 */}
            <div className="group relative rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-left backdrop-blur-md hover:border-indigo-500/40 hover:bg-slate-900/80 transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 mb-6">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Student Insights</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Discover personalized opportunities, build optimized profiles, and follow guided career trajectories.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group relative rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-left backdrop-blur-md hover:border-indigo-500/40 hover:bg-slate-900/80 transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition-all duration-300 mb-6">
                <Briefcase className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Enterprise Portals</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Post internships, search talent pipelines, and manage recruiter dashboards seamlessly.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group relative rounded-2xl border border-slate-800 bg-slate-900/50 p-8 text-left backdrop-blur-md hover:border-indigo-500/40 hover:bg-slate-900/80 transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300 mb-6">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Analytics & Trackers</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Analyze student profiles and conversion rates with intelligent placement KPIs.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <footer className="mt-32 text-center text-xs text-slate-600 border-t border-slate-900 pt-8">
          <p>© 2026 CareerOS AI. All rights reserved. Designed for excellence.</p>
        </footer>
      </main>
    </div>
  );
}
