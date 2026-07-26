import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  TrendingUp,
  ChevronRight,
  Brain,
  Shield,
  Zap,
  Target,
  Award,
  FileText,
  Bot,
  CheckCircle,
  ArrowRight,
  Star,
  Globe,
  Lock,
  Cpu,
  Database,
  GitBranch,
} from 'lucide-react';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import { FeatureCard } from '../components/ui/Card';

const faqs = [
  {
    q: 'What is CareerOS AI?',
    a: 'CareerOS AI is a comprehensive career intelligence platform that uses AI to analyze your profile, score your career readiness, identify skill gaps, match you with opportunities, and generate personalized 90-day roadmaps.',
  },
  {
    q: 'How does the Career Score work?',
    a: 'The Career Score (0–1000) is computed using 9 weighted indicators: Projects (20%), Skills (20%), Experience (15%), Profile Completeness (15%), Education (10%), Certificates (10%), Goals (5%), Resume Quality (3%), and Engagement (2%).',
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. CareerOS AI uses JWT-based authentication, bcrypt password hashing, HTTPS enforcement with HSTS headers, rate limiting on auth endpoints, Content Security Policy, and role-based access control.',
  },
  {
    q: 'What AI models are used?',
    a: 'CareerOS AI features a local AI engine with fine-tuned modules for resume analysis, skill gap detection, ATS scoring, career roadmap generation, and explainable recommendations — all running on your infrastructure.',
  },
  {
    q: 'Can I export my data?',
    a: 'Yes. You can export your resume data, career score reports, and roadmap plans. The Resume Manager supports multi-version resume storage and ATS score comparison.',
  },
];

const testimonials = [
  {
    name: 'Aisha Patel',
    role: 'Software Engineer at Google',
    text: 'CareerOS AI completely transformed how I approached my job search. The Career Score gave me a clear picture of where I stood, and the 90-day roadmap helped me close every skill gap systematically.',
    stars: 5,
  },
  {
    name: 'Marcus Chen',
    role: 'ML Engineer at Stripe',
    text: 'The ATS analysis feature saved me countless rejections. I optimized my resume based on real scoring data and doubled my interview callback rate within 3 weeks.',
    stars: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Product Manager at Vercel',
    text: 'The AI Career Copilot is like having a senior mentor available 24/7. Personalized, grounded in my actual profile — not generic career advice.',
    stars: 5,
  },
];

const companies = [
  'Google', 'Stripe', 'Vercel', 'Linear', 'GitHub', 'Notion', 'Figma', 'Arc', 'Framer', 'Loom',
  'Google', 'Stripe', 'Vercel', 'Linear', 'GitHub', 'Notion', 'Figma', 'Arc', 'Framer', 'Loom',
];

const techStack = ['Spring Boot', 'PostgreSQL', 'React', 'TypeScript', 'Docker', 'GitHub Actions', 'JUnit 5', 'Vite', 'Recharts', 'Framer Motion'];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-800/80 rounded-2xl overflow-hidden bg-slate-900/30 transition-colors hover:border-slate-700/80">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left gap-4"
      >
        <span className="font-semibold text-slate-200 text-sm leading-relaxed">{q}</span>
        <ChevronRight className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-90' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

export default function LandingPage(): React.ReactElement {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#020817] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-white">

      {/* === Background Ambience === */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] h-[700px] w-[700px] rounded-full bg-indigo-900/15 blur-[140px]" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[700px] w-[700px] rounded-full bg-purple-900/15 blur-[140px]" />
        <div className="absolute top-[40%] left-[50%] h-[400px] w-[400px] rounded-full bg-violet-900/10 blur-[100px] -translate-x-1/2" />
        {/* Dot pattern */}
        <div className="absolute inset-0 dot-pattern opacity-30" />
      </div>

      {/* === Navigation === */}
      <header className="relative z-20 border-b border-slate-800/40 bg-[#020817]/60 backdrop-blur-xl sticky top-0">
        <nav className="mx-auto max-w-7xl px-6 lg:px-8 flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
              <Sparkles className="h-4.5 w-4.5 text-white" />
            </div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-300 tracking-tight">
              CareerOS AI
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            <a href="#features" className="hover:text-white transition-colors nav-underline">Features</a>
            <a href="#ai" className="hover:text-white transition-colors nav-underline">AI Suite</a>
            <a href="#security" className="hover:text-white transition-colors nav-underline">Security</a>
            <a href="#faq" className="hover:text-white transition-colors nav-underline">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-300 hover:text-white transition-colors px-3 py-1.5"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="group relative inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              Get Started
              <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </nav>
      </header>

      <main className="relative z-10">

        {/* === HERO SECTION === */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8 pt-20 pb-24 text-center">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/8 px-4 py-1.5 text-sm text-indigo-300 mb-8 animate-fade-in">
            <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
            Next-Gen Career Intelligence Platform · v1.0 GA
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] mb-6 animate-fade-up">
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-400">
              Your Career,
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-400">
              Intelligently Engineered.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-up" style={{ animationDelay: '100ms' }}>
            CareerOS AI bridges the gap between students and career success using AI-powered score engines, ATS analysis, personalized roadmaps, and 6 specialized AI assistants.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up" style={{ animationDelay: '200ms' }}>
            <Link
              to="/register"
              className="group relative inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              <Sparkles className="h-5 w-5" />
              Start for Free
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-700/60 bg-slate-900/40 px-8 py-4 text-base font-semibold text-slate-300 hover:text-white hover:border-slate-600 hover:bg-slate-800/50 transition-all duration-200"
            >
              Sign In to Dashboard
            </Link>
          </div>

          {/* Animated Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto animate-fade-up" style={{ animationDelay: '300ms' }}>
            {[
              { value: 10000, suffix: '+', label: 'Students Active', decimals: 0 },
              { value: 98, suffix: '%', label: 'ATS Pass Rate', decimals: 0 },
              { value: 4.9, suffix: '/5', label: 'Avg Career Score', decimals: 1 },
              { value: 500, suffix: '+', label: 'Companies Hiring', decimals: 0 },
            ].map((stat) => (
              <div key={stat.label} className="glass-card rounded-2xl p-4 text-center">
                <p className="text-2xl sm:text-3xl font-black text-white">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
                </p>
                <p className="text-xs text-slate-500 mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* === FEATURES SECTION === */}
        <section id="features" className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/8 px-3 py-1 text-xs text-indigo-300 font-semibold mb-4 uppercase tracking-wider">
              Platform Features
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Everything You Need to{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                Land Your Dream Role
              </span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base">
              From Career Score computation to AI-powered mock interviews, CareerOS AI is your complete career operating system.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <FeatureCard
              icon={<Award className="h-6 w-6" />}
              title="Career Score Engine"
              description="0–1000 weighted score computed from 9 indicators including projects, skills, experience, education, and AI readiness."
              color="indigo"
              badge="Core"
            />
            <FeatureCard
              icon={<FileText className="h-6 w-6" />}
              title="ATS Resume Analysis"
              description="Deep ATS scoring with keyword matching, formatting analysis, quantifiable achievements detection, and fix recommendations."
              color="purple"
            />
            <FeatureCard
              icon={<Cpu className="h-6 w-6" />}
              title="Skill Gap Detection"
              description="AI-powered comparison of your current skills against role requirements with priority learning recommendations."
              color="emerald"
            />
            <FeatureCard
              icon={<Target className="h-6 w-6" />}
              title="90-Day Roadmaps"
              description="Structured week-by-week execution plans for 30, 60, and 90-day windows tailored to your target role and domain."
              color="amber"
            />
            <FeatureCard
              icon={<Brain className="h-6 w-6" />}
              title="Intelligence Dashboard"
              description="Unified intelligence hub with placement eligibility scoring, trend analytics, and project competitiveness analysis."
              color="sky"
            />
            <FeatureCard
              icon={<Database className="h-6 w-6" />}
              title="Data Engineering"
              description="Production-grade ETL pipelines, Star Schema warehouse, event-driven analytics, and real-time observability platform."
              color="violet"
              badge="Enterprise"
            />
          </div>
        </section>

        {/* === AI SECTION === */}
        <section id="ai" className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
          <div className="rounded-3xl border border-indigo-500/15 bg-gradient-to-br from-slate-900 via-indigo-950/20 to-slate-900 p-10 lg:p-16 overflow-hidden relative">
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-indigo-500/10 blur-[80px]" />
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300 font-semibold uppercase tracking-wider mb-6">
                  <Bot className="h-3.5 w-3.5" />
                  AI Suite
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-5 leading-tight">
                  6 Specialized AI Assistants Working For You
                </h2>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  Each AI module is grounded in your actual profile data — not generic advice. Get explainable, actionable insights that directly improve your career trajectory.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: Bot, name: 'Career Copilot', desc: 'Explainability engine' },
                    { icon: MessageSquare, name: 'AI Career Chat', desc: 'Contextual conversations' },
                    { icon: FileText, name: 'Resume Review', desc: 'ATS optimization' },
                    { icon: Brain, name: 'Learning Coach', desc: 'Personalized paths' },
                    { icon: Zap, name: 'Mock Interview', desc: 'Real-time feedback' },
                    { icon: GitBranch, name: 'Project Advisor', desc: 'Portfolio analysis' },
                  ].map(({ icon: Icon, name, desc }) => (
                    <div key={name} className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800/60 hover:border-indigo-500/30 transition-colors">
                      <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{name}</p>
                        <p className="text-xs text-slate-500">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Visual */}
              <div className="relative flex items-center justify-center">
                <div className="relative h-64 w-64 lg:h-80 lg:w-80">
                  {/* Spinning rings */}
                  <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20 animate-spin-slow" />
                  <div className="absolute inset-4 rounded-full border border-purple-500/20 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '12s' }} />
                  <div className="absolute inset-8 rounded-full border border-violet-500/15 animate-spin-slow" style={{ animationDuration: '20s' }} />
                  {/* Center orb */}
                  <div className="absolute inset-12 rounded-full bg-gradient-to-br from-indigo-600/60 to-purple-600/60 blur-sm animate-pulse-glow" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="h-16 w-16 text-indigo-300 animate-float" />
                  </div>
                  {/* Floating feature bubbles */}
                  {[
                    { angle: 0, label: 'ATS', color: 'bg-indigo-500' },
                    { angle: 60, label: 'Score', color: 'bg-purple-500' },
                    { angle: 120, label: 'Road', color: 'bg-violet-500' },
                    { angle: 180, label: 'Gap', color: 'bg-sky-500' },
                    { angle: 240, label: 'Chat', color: 'bg-emerald-500' },
                    { angle: 300, label: 'Mock', color: 'bg-amber-500' },
                  ].map(({ angle, label, color }) => {
                    const rad = (angle * Math.PI) / 180;
                    const r = 120;
                    const x = Math.cos(rad) * r;
                    const y = Math.sin(rad) * r;
                    return (
                      <div
                        key={label}
                        className="absolute flex items-center justify-center"
                        style={{
                          left: `calc(50% + ${x}px - 20px)`,
                          top: `calc(50% + ${y}px - 20px)`,
                        }}
                      >
                        <div className={`h-10 w-10 rounded-full ${color}/20 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white backdrop-blur-sm`}>
                          {label}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* === CAREER INTELLIGENCE SECTION === */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/8 px-3 py-1 text-xs text-emerald-300 font-semibold uppercase tracking-wider mb-6">
                <TrendingUp className="h-3.5 w-3.5" />
                Career Intelligence
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-5 leading-tight">
                Data-Driven Career Decisions,{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
                  Not Guesswork
                </span>
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                CareerOS AI's intelligence engine analyzes your entire career profile in real-time to surface insights that would take hours of manual research.
              </p>
              {[
                { label: 'Career Score Computation', desc: '9-factor weighted scoring model with trend analysis' },
                { label: 'Placement Eligibility', desc: 'Role-fit analysis against top company requirements' },
                { label: 'Trend Analytics', desc: 'Real-time technology demand and salary insights' },
                { label: 'Project Competitiveness', desc: 'GitHub portfolio analysis for recruiter readiness' },
              ].map(({ label, desc }) => (
                <div key={label} className="flex items-start gap-3 mb-4">
                  <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
              <Link
                to="/register"
                className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                See Your Career Score <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Score Ring Visualization */}
            <div className="flex flex-col items-center gap-6">
              <div className="glass-card rounded-3xl p-8 w-full max-w-sm">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Career Score Preview</p>
                <div className="flex items-center gap-6">
                  {/* SVG Ring */}
                  <div className="relative shrink-0">
                    <svg className="transform -rotate-90" width="96" height="96" viewBox="0 0 96 96">
                      <circle cx="48" cy="48" r="38" fill="none" stroke="rgba(99,102,241,0.1)" strokeWidth="8" />
                      <circle
                        cx="48" cy="48" r="38" fill="none"
                        stroke="url(#scoreGrad)" strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray="238.76"
                        strokeDashoffset="57"
                      />
                      <defs>
                        <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#6366f1" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-black text-white">782</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-black text-white">Strong</p>
                    <p className="text-xs text-slate-400 mt-0.5">Top 15% of candidates</p>
                    <div className="mt-3 space-y-1.5">
                      {[['Projects', 78], ['Skills', 92], ['Experience', 65]].map(([k, v]) => (
                        <div key={k} className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-500 w-16">{k}</span>
                          <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${v}%` }} />
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">{v}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* === SECURITY SECTION === */}
        <section id="security" className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
          <div className="rounded-3xl border border-slate-800/60 bg-slate-900/30 p-10 lg:p-14">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/8 px-3 py-1 text-xs text-emerald-300 font-semibold uppercase tracking-wider mb-4">
                <Shield className="h-3.5 w-3.5" />
                Enterprise Security
              </div>
              <h2 className="text-3xl font-black text-white mb-3">
                Production-Grade Security. Built-In.
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto">
                CareerOS AI is built with enterprise security standards from the ground up.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { icon: Lock, label: 'JWT Auth' },
                { icon: Shield, label: 'HSTS' },
                { icon: Globe, label: 'CSP Headers' },
                { icon: Zap, label: 'Rate Limiting' },
                { icon: CheckCircle, label: 'bcrypt Hashing' },
                { icon: Database, label: 'RBAC' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 hover:border-emerald-500/25 transition-colors text-center">
                  <Icon className="h-6 w-6 text-emerald-400" />
                  <span className="text-xs font-semibold text-slate-300">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* === ARCHITECTURE SECTION === */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Tech Stack</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {techStack.map((tech) => (
              <span
                key={tech}
                className="px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-sm text-slate-300 font-medium hover:border-indigo-500/30 hover:text-indigo-300 transition-all duration-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* === TESTIMONIALS === */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-3">
              Trusted by Students at{' '}
              <span className="gradient-text">World-Class Companies</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="glass-card rounded-3xl p-7 card-interactive">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3 border-t border-slate-800/60 pt-4">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* === COMPANY LOGOS MARQUEE === */}
        <section className="py-16 border-y border-slate-800/40 overflow-hidden">
          <p className="text-center text-xs font-semibold text-slate-600 uppercase tracking-widest mb-8">
            Graduates placed at leading companies
          </p>
          <div className="flex gap-12 animate-marquee whitespace-nowrap">
            {companies.map((company, i) => (
              <span
                key={`${company}-${i}`}
                className="text-slate-600 font-bold text-sm hover:text-slate-400 transition-colors shrink-0"
              >
                {company}
              </span>
            ))}
          </div>
        </section>

        {/* === FAQ SECTION === */}
        <section id="faq" className="mx-auto max-w-3xl px-6 lg:px-8 py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-3">Frequently Asked Questions</h2>
            <p className="text-slate-400">Everything you need to know about CareerOS AI.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} {...faq} />
            ))}
          </div>
        </section>

        {/* === CTA BANNER === */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
          <div className="relative rounded-3xl overflow-hidden border border-indigo-500/20 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-violet-900/40 p-12 text-center">
            <div className="absolute inset-0 dot-pattern opacity-20" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300 mb-6">
                <Sparkles className="h-4 w-4" />
                Begin Your Career Transformation
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Ready to Engineer Your Dream Career?
              </h2>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                Join thousands of students using CareerOS AI to land their dream roles at top companies.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Sparkles className="h-5 w-5" />
                Get Started — It's Free
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* === FOOTER === */}
        <footer className="border-t border-slate-800/60 py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-bold text-white">CareerOS AI</span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                  AI-powered career intelligence platform for students, companies, and academic institutions.
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Platform</p>
                <div className="space-y-3">
                  {['Career Score', 'ATS Analysis', 'Skill Gap', 'Roadmap', 'AI Copilot'].map((item) => (
                    <Link key={item} to="/register" className="block text-sm text-slate-500 hover:text-slate-300 transition-colors">{item}</Link>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Company</p>
                <div className="space-y-3">
                  {['About', 'Security', 'Privacy', 'Terms', 'Contact'].map((item) => (
                    <span key={item} className="block text-sm text-slate-500 cursor-default">{item}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/60 pt-8">
              <p className="text-xs text-slate-600">© 2026 CareerOS AI. All rights reserved.</p>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                All Systems Operational
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

// Add missing import
function MessageSquare({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
