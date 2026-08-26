import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  TrendingUp,
  ChevronRight,
  Brain,
  Zap,
  Target,
  Award,
  FileText,
  Bot,
  CheckCircle,
  ArrowRight,
  Cpu,
  Database,
  GitBranch,
} from 'lucide-react';
import { FeatureCard } from '../components/ui/Card';
import { ThemeToggle } from '../components/ui/ThemeToggle';

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

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-surface-border rounded-2xl overflow-hidden bg-surface-card transition-colors hover:border-[#2E4CFF]/40">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left gap-4"
        aria-expanded={open}
      >
        <span className="font-semibold text-content-primary text-sm leading-relaxed">{q}</span>
        <ChevronRight className={`h-4 w-4 text-content-secondary shrink-0 transition-transform duration-200 ${open ? 'rotate-90 text-[#2E4CFF]' : ''}`} aria-hidden="true" />
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-content-secondary leading-relaxed border-t border-surface-border pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

function CapabilityStat({ value, label, sub }: { value: string; label: string; sub?: string }) {
  return (
    <div className="glass-card rounded-2xl p-5 text-center border border-surface-border bg-surface-card">
      <p className="text-3xl sm:text-4xl font-black text-content-primary tracking-tight">{value}</p>
      <p className="text-sm font-semibold text-content-primary mt-1">{label}</p>
      {sub && <p className="text-xs text-content-secondary mt-0.5">{sub}</p>}
    </div>
  );
}

export default function LandingPage(): React.ReactElement {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-surface-base text-content-primary font-sans">

      {/* === Background Ambience === */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-10" />
      </div>

      {/* === Navigation Header === */}
      <header className="relative z-20 border-b border-surface-border bg-surface-base/80 backdrop-blur-md sticky top-0">
        <nav
          className="mx-auto max-w-7xl px-6 lg:px-8 flex items-center justify-between h-16"
          role="navigation"
          aria-label="Main navigation"
        >
          <a href="/" className="flex items-center gap-2.5" aria-label="CareerOS AI home">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#2E4CFF] text-white shadow-sm">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            </div>
            <span className="text-lg font-bold tracking-tight text-content-primary">
              CareerOS AI
            </span>
          </a>

          <div className="hidden md:flex items-center gap-6 text-sm text-content-secondary">
            <a href="#features" className="hover:text-content-primary transition-colors nav-underline">Features</a>
            <a href="#ai" className="hover:text-content-primary transition-colors nav-underline">AI Suite</a>
            <a href="#faq" className="hover:text-content-primary transition-colors nav-underline">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle variant="icon-only" />
            <Link
              to="/login"
              className="text-sm font-medium text-content-secondary hover:text-content-primary px-3.5 py-2 rounded-xl transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="bg-zinc-900 hover:bg-zinc-800 text-white dark:bg-zinc-100 dark:hover:bg-white dark:text-zinc-900 text-sm font-medium px-4 py-2 rounded-xl transition-all shadow-sm inline-flex items-center gap-1.5"
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
          {/* Top Badge */}
          <div className="inline-flex items-center gap-2 bg-surface-card border border-surface-border text-content-secondary text-xs px-3.5 py-1.5 rounded-full mb-8 shadow-sm animate-fade-in">
            <span className="h-2 w-2 rounded-full bg-[#2E4CFF] animate-pulse" aria-hidden="true" />
            AI-Powered Career Intelligence · Open Beta
          </div>

          {/* Crisp Heading */}
          <h1
            id="hero-heading"
            className="text-5xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight leading-[1.08] mb-6 text-content-primary animate-fade-up"
          >
            Stop guessing if you're hireable.
            <br />
            <span className="text-[#2E4CFF]">Quantify your engineering readiness.</span>
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg sm:text-xl text-content-secondary leading-relaxed max-w-2xl mx-auto mb-10 animate-fade-up"
            style={{ animationDelay: '100ms' }}
          >
            CareerOS AI evaluates your real code repositories, ATS resume depth, and technical skills against verified recruiter benchmarks — computing a 0–1000 readiness score and 90-day execution flight plan.
          </p>

          {/* CTAs */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 animate-fade-up"
            style={{ animationDelay: '200ms' }}
          >
            <Link
              to="/register"
              className="bg-[#2E4CFF] hover:bg-[#1A32C7] text-white font-medium px-8 py-4 rounded-xl transition-all shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2 text-base"
            >
              <Sparkles className="h-5 w-5" aria-hidden="true" />
              Calculate My Score Free
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/login"
              className="bg-surface-card hover:bg-surface-hover text-content-primary border border-surface-border font-medium px-8 py-4 rounded-xl transition-all inline-flex items-center justify-center gap-2 text-base shadow-sm"
            >
              Sign In to Dashboard
            </Link>
          </div>

          {/* Real capability stats */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto animate-fade-up"
            style={{ animationDelay: '300ms' }}
            aria-label="Platform capabilities"
          >
            <CapabilityStat value="6" label="AI Modules" sub="Career · Resume · Chat · Interview · Coach · Advisor" />
            <CapabilityStat value="9" label="Score Indicators" sub="Weighted 0–1000 career score" />
            <CapabilityStat value="Free" label="To Use" sub="Instant access, no credit card" />
            <CapabilityStat value="<2 min" label="To Your Score" sub="Fast profile evaluation" />
          </div>
        </section>

        {/* === FEATURES SECTION === */}
        <section id="features" className="mx-auto max-w-7xl px-6 lg:px-8 py-24" aria-labelledby="features-heading">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface-card px-3 py-1 text-xs text-content-secondary font-semibold mb-4 uppercase tracking-wider">
              Platform Features
            </div>
            <h2 id="features-heading" className="text-3xl sm:text-4xl font-black text-content-primary mb-4">
              A complete toolkit for career-focused students
            </h2>
            <p className="text-content-secondary max-w-xl mx-auto text-base">
              From career score computation to AI-assisted mock interviews — each feature maps to a real gap in how students prepare for software engineering roles.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <Link to="/intelligence/score" className="block h-full">
              <FeatureCard
                icon={<Award className="h-6 w-6" />}
                title="Career Score Engine"
                description="0–1000 weighted score computed from 9 indicators including projects, skills, experience, education, and AI readiness."
                badge="Core"
              />
            </Link>
            <Link to="/intelligence/ats" className="block h-full">
              <FeatureCard
                icon={<FileText className="h-6 w-6" />}
                title="ATS Resume Analysis"
                description="Deep ATS scoring with keyword matching, formatting analysis, quantifiable achievements detection, and fix recommendations."
              />
            </Link>
            <Link to="/intelligence/skill-gap" className="block h-full">
              <FeatureCard
                icon={<Cpu className="h-6 w-6" />}
                title="Skill Gap Detection"
                description="AI-powered comparison of your current skills against role requirements with priority learning recommendations."
              />
            </Link>
            <Link to="/intelligence/roadmap" className="block h-full">
              <FeatureCard
                icon={<Target className="h-6 w-6" />}
                title="90-Day Roadmaps"
                description="Structured week-by-week execution plans for 30, 60, and 90-day windows tailored to your target role and domain."
              />
            </Link>
            <Link to="/intelligence" className="block h-full">
              <FeatureCard
                icon={<Brain className="h-6 w-6" />}
                title="Intelligence Dashboard"
                description="Unified intelligence hub with placement eligibility scoring, trend analytics, and project competitiveness analysis."
              />
            </Link>
            <Link to="/warehouse-dashboard" className="block h-full">
              <FeatureCard
                icon={<Database className="h-6 w-6" />}
                title="Data Engineering"
                description="Production-grade ETL pipelines, Star Schema warehouse, event-driven analytics, and real-time observability platform."
                badge="Enterprise"
              />
            </Link>
          </div>
        </section>

        {/* === AI SECTION === */}
        <section id="ai" className="mx-auto max-w-7xl px-6 lg:px-8 py-24" aria-labelledby="ai-heading">
          <div className="rounded-3xl border border-surface-border bg-surface-card p-10 lg:p-16 overflow-hidden relative shadow-sm">
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface-hover px-3 py-1 text-xs text-content-secondary font-semibold uppercase tracking-wider mb-6">
                  <Bot className="h-3.5 w-3.5" />
                  AI Suite
                </div>
                <h2 id="ai-heading" className="text-3xl sm:text-4xl font-black text-content-primary mb-5 leading-tight">
                  6 Specialised AI Modules
                </h2>
                <p className="text-content-secondary mb-8 leading-relaxed">
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
                    <div key={name} className="flex items-center gap-3 p-3 rounded-xl bg-surface-hover border border-surface-border hover:border-[#2E4CFF]/30 transition-colors">
                      <div className="h-8 w-8 rounded-lg bg-[#2E4CFF]/10 flex items-center justify-center text-[#2E4CFF]">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-content-primary">{name}</p>
                        <p className="text-xs text-content-secondary">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Visual */}
              <div className="relative flex items-center justify-center">
                <div className="relative h-64 w-64 lg:h-80 lg:w-80">
                  <div className="absolute inset-0 rounded-full border-2 border-[#2E4CFF]/20 animate-spin-slow" />
                  <div className="absolute inset-4 rounded-full border border-[#2E4CFF]/15 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '12s' }} />
                  <div className="absolute inset-12 rounded-full bg-[#2E4CFF]/10 blur-sm animate-pulse-glow" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Brain className="h-16 w-16 text-[#2E4CFF] animate-float" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* === CAREER INTELLIGENCE SECTION === */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8 py-24" aria-labelledby="intelligence-heading">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#2E4CFF]/20 bg-[#2E4CFF]/8 px-3 py-1 text-xs text-[#2E4CFF] font-semibold uppercase tracking-wider mb-6">
                <TrendingUp className="h-3.5 w-3.5" />
                Career Intelligence
              </div>
              <h2 id="intelligence-heading" className="text-3xl sm:text-4xl font-black text-content-primary mb-5 leading-tight">
                Structured career decisions, not guesswork
              </h2>
              <p className="text-content-secondary mb-8 leading-relaxed">
                The intelligence engine analyses your entire career profile to surface actionable insights that would otherwise require hours of manual self-assessment.
              </p>
              {[
                { label: 'Career Score Computation', desc: '9-factor weighted scoring model with trend tracking' },
                { label: 'Placement Eligibility', desc: 'Role-fit analysis against documented company requirements' },
                { label: 'Trend Analytics', desc: 'Technology demand and market context for your target domain' },
                { label: 'Project Competitiveness', desc: 'Portfolio gap analysis for recruiter readiness' },
              ].map(({ label, desc }) => (
                <div key={label} className="flex items-start gap-3 mb-4">
                  <CheckCircle className="h-5 w-5 text-[#2E4CFF] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-content-primary">{label}</p>
                    <p className="text-xs text-content-secondary mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
              <a
                href="#features"
                className="inline-flex items-center gap-2 mt-4 text-sm font-semibold text-[#2E4CFF] hover:underline transition-colors"
              >
                See all platform features <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>

            {/* Score Ring Preview */}
            <div className="flex flex-col items-center gap-6">
              <div className="glass-card rounded-3xl p-8 w-full max-w-sm border border-surface-border bg-surface-card shadow-sm">
                <p className="text-xs font-bold text-content-secondary uppercase tracking-wider mb-1">Career Score — Example Preview</p>
                <p className="text-[10px] text-content-muted mb-4">Illustrative data. Your score is computed from your own profile.</p>
                <div className="flex items-center gap-6">
                  <div className="relative shrink-0">
                    <svg className="transform -rotate-90" width="96" height="96" viewBox="0 0 96 96">
                      <circle cx="48" cy="48" r="38" fill="none" stroke="var(--surface-border)" strokeWidth="8" />
                      <circle
                        cx="48" cy="48" r="38" fill="none"
                        stroke="#2E4CFF" strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray="238.76"
                        strokeDashoffset="57"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-black text-content-primary">782</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-black text-content-primary">Strong</p>
                    <p className="text-xs text-content-secondary mt-0.5">out of 1,000</p>
                    <div className="mt-3 space-y-1.5">
                      {[['Projects', 78], ['Skills', 92], ['Experience', 65]].map(([k, v]) => (
                        <div key={k} className="flex items-center gap-2">
                          <span className="text-[10px] text-content-secondary w-16">{k}</span>
                          <div className="flex-1 h-1.5 bg-surface-hover rounded-full overflow-hidden">
                            <div className="h-full bg-[#2E4CFF] rounded-full" style={{ width: `${v}%` }} />
                          </div>
                          <span className="text-[10px] font-mono text-content-secondary">{v}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* === FAQ SECTION === */}
        <section id="faq" className="mx-auto max-w-3xl px-6 lg:px-8 py-24" aria-labelledby="faq-heading">
          <div className="text-center mb-12">
            <h2 id="faq-heading" className="text-3xl font-black text-content-primary mb-3">Frequently Asked Questions</h2>
            <p className="text-content-secondary">Honest answers about what CareerOS AI is and how it works.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq) => (
              <FAQItem key={faq.q} {...faq} />
            ))}
          </div>
        </section>

        {/* === CTA BANNER === */}
        <section className="mx-auto max-w-7xl px-6 lg:px-8 py-16" aria-labelledby="cta-heading">
          <div className="relative rounded-3xl border border-surface-border bg-surface-card p-12 text-center shadow-sm">
            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#2E4CFF]/25 bg-[#2E4CFF]/10 px-4 py-1.5 text-sm text-[#2E4CFF] mb-6 font-semibold">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Open Beta · Early Access
              </div>
              <h2 id="cta-heading" className="text-3xl sm:text-4xl font-black text-content-primary mb-4">
                Start building your career profile.
              </h2>
              <p className="text-content-secondary mb-8 max-w-xl mx-auto">
                Run CareerOS AI locally from the repository, or join the waitlist to be notified when the hosted platform launches.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/register"
                  className="bg-[#2E4CFF] hover:bg-[#1A32C7] text-white font-bold px-8 py-4 rounded-xl transition-all shadow-md inline-flex items-center justify-center gap-2 text-base"
                >
                  <Sparkles className="h-5 w-5" aria-hidden="true" />
                  Create Free Account
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  to="/login"
                  className="bg-surface-card hover:bg-surface-hover text-content-primary border border-surface-border font-medium px-8 py-4 rounded-xl transition-all inline-flex items-center justify-center gap-2 text-base"
                >
                  Sign In to Workspace
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* === FOOTER === */}
        <footer className="border-t border-surface-border py-12" role="contentinfo">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="h-8 w-8 rounded-lg bg-[#2E4CFF] flex items-center justify-center text-white">
                    <Sparkles className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <span className="font-bold text-content-primary">CareerOS AI</span>
                </div>
                <p className="text-sm text-content-secondary leading-relaxed max-w-xs">
                  An open-source AI-powered career intelligence platform built for engineering students.
                </p>
              </div>
              <div>
                <p className="text-xs font-bold text-content-secondary uppercase tracking-wider mb-4">Platform</p>
                <div className="space-y-3">
                  {['Career Score', 'ATS Analysis', 'Skill Gap', 'Roadmap', 'AI Copilot'].map((item) => (
                    <a key={item} href="#features" className="block text-sm text-content-secondary hover:text-content-primary transition-colors">{item}</a>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-content-secondary uppercase tracking-wider mb-4">Project</p>
                <div className="space-y-3">
                  <a href="#faq" className="block text-sm text-content-secondary hover:text-content-primary transition-colors">FAQ</a>
                  <a
                    href="https://github.com/hindhusharajaram/CareerOS-AI"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs text-content-muted hover:text-content-secondary transition-colors"
                  >
                    View on GitHub
                  </a>
                </div>
              </div>
            </div>


            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-surface-border pt-8">
              <p className="text-xs text-content-muted">© 2026 CareerOS AI. Open-source project. All rights reserved.</p>
              <div className="flex items-center gap-2 text-xs text-content-muted">
                <span className="h-2 w-2 rounded-full bg-[#2E4CFF] animate-pulse" aria-hidden="true" />
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
