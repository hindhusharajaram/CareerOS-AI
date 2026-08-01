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
  Globe,
  Lock,
  Cpu,
  Database,
  GitBranch,
  FlaskConical,
  Users,
} from 'lucide-react';
import { FeatureCard } from '../components/ui/Card';

const faqs = [
  {
    q: 'What is CareerOS AI?',
    a: 'CareerOS AI is an AI-powered career intelligence platform built for engineering students. It computes a structured Career Score, analyses resumes against ATS patterns, detects skill gaps relative to target roles, and generates 90-day learning roadmaps — all grounded in your actual profile data.',
  },
  {
    q: 'How does the Career Score work?',
    a: 'The Career Score (0–1000) is computed from 9 weighted indicators: Projects (20%), Skills (20%), Experience (15%), Profile Completeness (15%), Education (10%), Certificates (10%), Resume Quality (5%), GitHub Presence (3%), and LinkedIn Presence (2%). Each factor is calculated from data you enter in your profile.',
  },
  {
    q: 'Is my data secure?',
    a: 'Yes. CareerOS AI uses JWT-based authentication, bcrypt password hashing, HTTPS enforcement with HSTS headers, rate limiting on auth endpoints, Content Security Policy headers, and role-based access control. Security is implemented at the infrastructure level, not as an afterthought.',
  },
  {
    q: 'What AI modules does the platform include?',
    a: 'The platform ships with 6 AI-assisted modules: Career Copilot (explainability engine), AI Career Chat (contextual Q&A), Resume Review (ATS scoring), Learning Coach (personalised study plans), Mock Interview (structured practice), and Project Advisor (portfolio gap analysis). Each module reads from your actual profile — not generic templates.',
  },
  {
    q: 'Can I export my data?',
    a: 'Yes. You can export resume data, career score reports, and roadmap plans. The Resume Manager supports multi-version resume storage and ATS score comparison across versions.',
  },
  {
    q: 'Is this a student project?',
    a: 'Yes — CareerOS AI is an open-source platform built by a Computer Science student. It is built with production-grade technologies: Spring Boot 3, PostgreSQL, React 18, TypeScript, Docker, GitHub Actions CI/CD, JUnit 5 test coverage, and a Star Schema data warehouse with ETL pipelines.',
  },
];

const targetCompanies = [
  'Google', 'Stripe', 'Vercel', 'Linear', 'GitHub', 'Notion', 'Figma', 'Atlassian', 'Cloudflare', 'Supabase',
  'Google', 'Stripe', 'Vercel', 'Linear', 'GitHub', 'Notion', 'Figma', 'Atlassian', 'Cloudflare', 'Supabase',
];

const techStack = ['Spring Boot 3', 'PostgreSQL 17', 'React 18', 'TypeScript 5', 'Docker', 'GitHub Actions', 'JUnit 5', 'Vite', 'Apache Tika', 'JJWT'];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-800/80 rounded-2xl overflow-hidden bg-slate-900/30 transition-colors hover:border-slate-700/80">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left gap-4"
        aria-expanded={open}
      >
        <span className="font-semibold text-slate-200 text-sm leading-relaxed">{q}</span>
        <ChevronRight className={`h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-90' : ''}`} aria-hidden="true" />
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-slate-400 leading-relaxed border-t border-slate-800/60 pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

function CapabilityStat({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div className="glass-card rounded-2xl p-5 text-center">
      <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">{value}</p>
      <p className="text-sm font-semibold text-slate-300 mt-1">{label}</p>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
  );
}

function BetaPlaceholderCard({ icon: Icon, title, body }: { icon: React.ElementType; title: string; body: string }) {
  return (
    <div className="glass-card rounded-3xl p-7 card-interactive flex flex-col gap-4 border border-dashed border-indigo-500/20">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
          <Icon className="h-4 w-4 text-indigo-400" aria-hidden="true" />
        </div>
        <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Open Beta</span>
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-200 mb-1">{title}</p>
        <p className="text-sm text-slate-400 leading-relaxed">{body}</p>
      </div>
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
        <nav
          className="mx-auto max-w-7xl px-6 lg:px-8 flex items-center justify-between h-16"
          role="navigation"
          aria-label="Main navigation"
        >
          <a href="/" className="flex items-center gap-2.5" aria-label="CareerOS AI home">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
              <Sparkles className="h-4 w-4 text-white" aria-hidden="true" />
            </div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-300 tracking-tight">
              CareerOS AI
            </span>
          </a>

          <div className="hidden md:flex items-center gap-6 text-sm text-slate-400">
            <a href="#features" className="hover:text-white transition-colors nav-underline">Features</a>
            <a href="#ai" className="hover:text-white transition-colors nav-underline">AI Suite</a>
            <a href="#security" className="hover:text-white transition-colors nav-underline">Security</a>
            <a href="#faq" className="hover:text-white transition-colors nav-underline">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-semibold text-slate-300 hover:text-white px-4 py-2 rounded-xl transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Get Started
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </nav>
      </header>

      <main className="relative z-10">

        {/* === HERO SECTION === */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8 pt-20 pb-24 text-center" aria-labelledby="hero-heading">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/8 px-4 py-1.5 text-sm text-indigo-300 mb-8 animate-fade-in">
            <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" aria-hidden="true" />
            AI-Powered Career Intelligence · Open Beta
          </div>

          <h1
            id="hero-heading"
            className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08] mb-6 animate-fade-up"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-400">
              Your Career,
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-violet-400">
              Intelligently Engineered.
            </span>
          </h1>

          <p
            className="text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-up"
            style={{ animationDelay: '100ms' }}
          >
            CareerOS AI helps engineering students measure career readiness with a structured score engine,
            ATS resume analysis, skill gap detection, and AI-assisted 90-day roadmaps — all grounded in
            your actual profile data.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4 animate-fade-up"
            style={{ animationDelay: '200ms' }}
          >
            <Link
              to="/register"
              className="group relative inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Sparkles className="h-5 w-5" aria-hidden="true" />
              Get Started Now
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-700/60 bg-slate-900/40 px-8 py-4 text-base font-semibold text-slate-300 hover:text-white hover:border-slate-600 hover:bg-slate-800/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              Sign In to Dashboard
            </Link>
          </div>

          <p className="text-xs text-emerald-400 font-medium mb-14 animate-fade-up flex items-center justify-center gap-1.5" style={{ animationDelay: '250ms' }}>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
            Hosted backend live on Render & Neon PostgreSQL
          </p>

          {/* Real capability stats — verifiable from the codebase */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto animate-fade-up"
            style={{ animationDelay: '300ms' }}
            aria-label="Platform capabilities"
          >
            <CapabilityStat value="6" label="AI Modules" sub="Career · Resume · Chat · Interview · Coach · Advisor" />
            <CapabilityStat value="9" label="Score Indicators" sub="Weighted 0–1000 career score" />
            <CapabilityStat value="1,000" label="Score Range" sub="Structured readiness scale" />
            <CapabilityStat value="6+" label="Security Layers" sub="JWT · HSTS · CSP · RBAC · Rate Limit · bcrypt" />
          </div>
        </section>

        {/* === FEATURES SECTION === */}
        <section id="features" className="mx-auto max-w-7xl px-6 lg:px-8 py-24" aria-labelledby="features-heading">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/8 px-3 py-1 text-xs text-indigo-300 font-semibold mb-4 uppercase tracking-wider">
              Platform Features
            </div>
            <h2 id="features-heading" className="text-3xl sm:text-4xl font-black text-white mb-4">
              A complete toolkit for{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                career-focused students
              </span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base">
              From career score computation to AI-assisted mock interviews — each feature maps to a real gap in how students prepare for software engineering roles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Link to="/intelligence/score" className="block h-full">
              <FeatureCard
                icon={<Award className="h-6 w-6" />}
                title="Career Score Engine"
                description="0–1000 weighted score computed from 9 indicators including projects, skills, experience, education, and AI readiness."
                color="indigo"
                badge="Core"
              />
            </Link>
            <Link to="/intelligence/ats" className="block h-full">
              <FeatureCard
                icon={<FileText className="h-6 w-6" />}
                title="ATS Resume Analysis"
                description="Deep ATS scoring with keyword matching, formatting analysis, quantifiable achievements detection, and fix recommendations."
                color="purple"
              />
            </Link>
            <Link to="/intelligence/skill-gap" className="block h-full">
              <FeatureCard
                icon={<Cpu className="h-6 w-6" />}
                title="Skill Gap Detection"
                description="AI-powered comparison of your current skills against role requirements with priority learning recommendations."
                color="emerald"
              />
            </Link>
            <Link to="/intelligence/roadmap" className="block h-full">
              <FeatureCard
                icon={<Target className="h-6 w-6" />}
                title="90-Day Roadmaps"
                description="Structured week-by-week execution plans for 30, 60, and 90-day windows tailored to your target role and domain."
                color="amber"
              />
            </Link>
            <Link to="/intelligence" className="block h-full">
              <FeatureCard
                icon={<Brain className="h-6 w-6" />}
                title="Intelligence Dashboard"
                description="Unified intelligence hub with placement eligibility scoring, trend analytics, and project competitiveness analysis."
                color="sky"
              />
            </Link>
            <Link to="/warehouse-dashboard" className="block h-full">
              <FeatureCard
                icon={<Database className="h-6 w-6" />}
                title="Data Engineering"
                description="Production-grade ETL pipelines, Star Schema warehouse, event-driven analytics, and real-time observability platform."
                color="violet"
                badge="Enterprise"
              />
            </Link>
          </div>
        </section>

        {/* === AI SECTION === */}
        <section id="ai" className="mx-auto max-w-7xl px-6 lg:px-8 py-24" aria-labelledby="ai-heading">
          <div className="rounded-3xl border border-indigo-500/15 bg-gradient-to-br from-slate-900 via-indigo-950/20 to-slate-900 p-10 lg:p-16 overflow-hidden relative">
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-indigo-500/10 blur-[80px]" />
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300 font-semibold uppercase tracking-wider mb-6">
                  <Bot className="h-3.5 w-3.5" />
                  AI Suite
                </div>
                <h2 id="ai-heading" className="text-3xl sm:text-4xl font-black text-white mb-5 leading-tight">
                  6 Specialised AI Modules
                </h2>
                <p className="text-slate-400 mb-8 leading-relaxed">
                  Each module reads from your actual profile — not generic templates. Recommendations are grounded in what you have built, studied, and experienced.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { icon: Bot, name: 'Career Copilot', desc: 'Score explainability engine' },
                    { icon: MessageSquare, name: 'AI Career Chat', desc: 'Profile-aware Q&A' },
                    { icon: FileText, name: 'Resume Review', desc: 'ATS scoring & feedback' },
                    { icon: Brain, name: 'Learning Coach', desc: 'Personalised study plans' },
                    { icon: Zap, name: 'Mock Interview', desc: 'Structured practice & feedback' },
                    { icon: GitBranch, name: 'Project Advisor', desc: 'Portfolio gap analysis' },
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
        <section className="mx-auto max-w-7xl px-6 lg:px-8 py-24" aria-labelledby="intelligence-heading">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/8 px-3 py-1 text-xs text-emerald-300 font-semibold uppercase tracking-wider mb-6">
                <TrendingUp className="h-3.5 w-3.5" />
                Career Intelligence
              </div>
              <h2 id="intelligence-heading" className="text-3xl sm:text-4xl font-black text-white mb-5 leading-tight">
                Structured career decisions,{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
                  not guesswork
                </span>
              </h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                The intelligence engine analyses your entire career profile to surface actionable insights that would otherwise require hours of manual self-assessment.
              </p>
              {[
                { label: 'Career Score Computation', desc: '9-factor weighted scoring model with trend tracking' },
                { label: 'Placement Eligibility', desc: 'Role-fit analysis against documented company requirements' },
                { label: 'Trend Analytics', desc: 'Technology demand and market context for your target domain' },
                { label: 'Project Competitiveness', desc: 'Portfolio gap analysis for recruiter readiness' },
              ].map(({ label, desc }) => (
                <div key={label} className="flex items-start gap-3 mb-4">
                  <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-slate-200">{label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
              <a
                href="#features"
                className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/50 rounded"
              >
                See all platform features <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            {/* Score Ring Visualization */}
            <div className="flex flex-col items-center gap-6">
              <div className="glass-card rounded-3xl p-8 w-full max-w-sm">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Career Score — Example Preview</p>
                <p className="text-[10px] text-slate-600 mb-3">Illustrative data. Your score is computed from your own profile.</p>
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
                    <p className="text-xs text-slate-400 mt-0.5">out of 1,000</p>
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
        <section id="security" className="mx-auto max-w-7xl px-6 lg:px-8 py-24" aria-labelledby="security-heading">
          <div className="rounded-3xl border border-slate-800/60 bg-slate-900/30 p-10 lg:p-14">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/8 px-3 py-1 text-xs text-emerald-300 font-semibold uppercase tracking-wider mb-4">
                <Shield className="h-3.5 w-3.5" aria-hidden="true" />
                Security Architecture
              </div>
              <h2 id="security-heading" className="text-3xl font-black text-white mb-3">
                Production-grade security. Built in.
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto">
                Security is implemented at the infrastructure level — not retrofitted. Every layer is verifiable in the open-source codebase.
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

        {/* === TECH STACK === */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8 py-16" aria-labelledby="stack-heading">
          <div className="text-center mb-8">
            <p id="stack-heading" className="text-sm font-semibold text-slate-500 mb-1 uppercase tracking-wider">Tech Stack</p>
            <p className="text-xs text-slate-600">All technologies used in this project — verifiable in the repository.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3" role="list" aria-label="Technologies used">
            {techStack.map((tech) => (
              <span
                key={tech}
                role="listitem"
                className="px-4 py-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-sm text-slate-300 font-medium hover:border-indigo-500/30 hover:text-indigo-300 transition-all duration-200"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* === BETA / EARLY ACCESS (replaces fake testimonials) === */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8 py-24" aria-labelledby="beta-heading">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/8 px-3 py-1 text-xs text-amber-300 font-semibold uppercase tracking-wider mb-4">
              <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
              Open Beta
            </div>
            <h2 id="beta-heading" className="text-3xl font-black text-white mb-3">
              Built for students targeting{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">world-class engineering roles</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              CareerOS AI is in open beta. Early access testers help shape the product. User feedback
              and case studies will be featured here as they are collected.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <BetaPlaceholderCard
              icon={Users}
              title="Looking for early access testers"
              body="If you are an engineering student preparing for internship or full-time roles, your feedback directly shapes the platform. Reach out via GitHub."
            />
            <BetaPlaceholderCard
              icon={FlaskConical}
              title="Student feedback coming soon"
              body="This platform is currently being tested. Real user experiences and outcomes will be published here as the beta progresses."
            />
            <BetaPlaceholderCard
              icon={GitBranch}
              title="Open-source contributions welcome"
              body="CareerOS AI is open source. Engineers who contribute to the codebase are acknowledged in the repository and this page."
            />
          </div>
        </section>

        {/* === TARGET COMPANIES — aspirational context, not placement claims === */}
        <section className="py-16 border-y border-slate-800/40 overflow-hidden" aria-label="Target companies context">
          <p className="text-center text-xs font-semibold text-slate-600 uppercase tracking-widest mb-1">
            Built to prepare you for engineering careers at companies like
          </p>
          <p className="text-center text-[10px] text-slate-700 mb-8">
            CareerOS AI does not have a partnership with any of these organisations. This is aspirational context only.
          </p>
          <div className="flex gap-12 animate-marquee whitespace-nowrap" aria-hidden="true">
            {targetCompanies.map((company, i) => (
              <span
                key={`${company}-${i}`}
                className="text-slate-700 font-bold text-sm hover:text-slate-500 transition-colors shrink-0"
              >
                {company}
              </span>
            ))}
          </div>
        </section>

        {/* === FAQ SECTION === */}
        <section id="faq" className="mx-auto max-w-3xl px-6 lg:px-8 py-24" aria-labelledby="faq-heading">
          <div className="text-center mb-12">
            <h2 id="faq-heading" className="text-3xl font-black text-white mb-3">Frequently Asked Questions</h2>
            <p className="text-slate-400">Honest answers about what CareerOS AI is and how it works.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} {...faq} />
            ))}
          </div>
        </section>

        {/* === CTA BANNER === */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8 py-16" aria-labelledby="cta-heading">
          <div className="relative rounded-3xl overflow-hidden border border-indigo-500/20 bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-violet-900/40 p-12 text-center">
            <div className="absolute inset-0 dot-pattern opacity-20" aria-hidden="true" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-300 mb-6">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Open Beta · Early Access
              </div>
              <h2 id="cta-heading" className="text-3xl sm:text-4xl font-black text-white mb-4">
                Start building your career profile.
              </h2>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto">
                Run CareerOS AI locally from the repository, or join the waitlist to be notified when the hosted platform launches.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://github.com/hindhusharajaram/CareerOS-AI"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  aria-label="View CareerOS AI on GitHub (opens in a new tab)"
                >
                  <GitBranch className="h-5 w-5" aria-hidden="true" />
                  View on GitHub
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-2xl border border-indigo-500/30 bg-indigo-500/10 px-8 py-4 text-base font-semibold text-indigo-300 hover:bg-indigo-500/20 hover:text-white transition-all"
                >
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                  Create Free Account
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* === FOOTER === */}
        <footer className="border-t border-slate-800/60 py-12" role="contentinfo">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" aria-hidden="true" />
                  </div>
                  <span className="font-bold text-white">CareerOS AI</span>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                  An open-source AI-powered career intelligence platform built for engineering students.
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Platform</p>
                <div className="space-y-3">
                  {['Career Score', 'ATS Analysis', 'Skill Gap', 'Roadmap', 'AI Copilot'].map((item) => (
                    <a key={item} href="#features" className="block text-sm text-slate-500 hover:text-slate-300 transition-colors">{item}</a>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Project</p>
                <div className="space-y-3">
                  {['GitHub', 'Security', 'Open Beta', 'FAQ'].map((item) => (
                    <span key={item} className="block text-sm text-slate-500 cursor-default">{item}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800/60 pt-8">
              <p className="text-xs text-slate-600">© 2026 CareerOS AI. Open-source project. All rights reserved.</p>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" aria-hidden="true" />
                Open Beta — Hosted backend launching soon
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function MessageSquare({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
