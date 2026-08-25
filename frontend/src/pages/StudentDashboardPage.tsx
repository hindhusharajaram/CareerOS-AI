import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Cpu,
  FolderGit2,
  Award,
  Briefcase,
  Target,
  User,
  ArrowRight,
  AlertCircle,
  Bot,
  Brain,
  TrendingUp,
  Zap,
  ChevronRight,
  CheckCircle,
} from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { studentService, DashboardSummaryData } from '../services/studentService';
import { StatCard } from '../components/ui/Card';
import AnimatedCounter from '../components/ui/AnimatedCounter';
import { ProgressBar, ProgressRing } from '../components/ui/Progress';
import { SkeletonStatGrid, SkeletonCard } from '../components/ui/Skeleton';

const quickActions = [
  { label: 'View Career Score', href: '/intelligence/score', icon: Award, color: 'from-emerald-600 to-emerald-500', desc: 'Check your 0–1000 rating' },
  { label: 'Analyze Resume', href: '/intelligence/ats', icon: Brain, color: 'from-emerald-600 to-emerald-500', desc: 'ATS optimization' },
  { label: 'AI Career Chat', href: '/ai/chat', icon: Bot, color: 'from-emerald-600 to-emerald-500', desc: 'Ask anything' },
  { label: '90-Day Roadmap', href: '/intelligence/roadmap', icon: Target, color: 'from-emerald-600 to-emerald-500', desc: 'Your action plan' },
];

export default function StudentDashboardPage(): React.ReactElement {
  const [data, setData] = useState<DashboardSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setIsLoading(true);
    setError('');
    try {
      const summary = await studentService.getDashboard();
      setData(summary);
    } catch {
      setError('Could not fetch dashboard. Make sure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const isNewUser = data ? (
    (data.skillsCount + data.projectsCount + data.certificatesCount + data.experienceCount === 0) ||
    data.completionPercentage < 20
  ) : false;

  return (
    <StudentLayout>
      {isLoading ? (
        <div className="space-y-8">
          <div className="skeleton rounded-3xl h-36 w-full" />
          <SkeletonStatGrid cols={4} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SkeletonCard className="h-64" />
            <SkeletonCard className="h-64" />
          </div>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/8 p-6 text-red-400 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      ) : data ? (        <div className="space-y-6 max-w-7xl">

          {/* ===== UNIFIED WELCOME & SCORE HEADER ===== */}
          <div className="relative overflow-hidden rounded-3xl border border-surface-border bg-surface-card p-6 shadow-sm">
            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-surface-border bg-surface-hover px-3 py-1 text-xs text-[#2E4CFF] font-semibold">
                  <Sparkles className="h-3.5 w-3.5" />
                  {isNewUser ? 'Account Setup Needed' : 'AI Career Engine Active'}
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-content-primary">
                  Welcome,{' '}
                  <span className="text-[#2E4CFF]">
                    {data.profile?.fullName?.split(' ')[0] || 'Student'}
                  </span>
                  !
                </h2>
                <p className="text-sm text-content-secondary max-w-xl">
                  {isNewUser
                    ? 'Start by analyzing your resume below to activate your Career Score Engine (0–1000).'
                    : 'Your career workspace is active. Keep updating your skills and projects to maximize your placement score.'}
                </p>

                {/* Integrated Compact Stat Chips */}
                <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-content-muted font-medium mr-1">Current Profile Data:</span>
                  <span className="px-2.5 py-0.5 rounded-full border border-surface-border bg-surface-hover text-content-secondary font-medium">
                    Skills <strong className="text-content-primary">{data.skillsCount}</strong>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full border border-surface-border bg-surface-hover text-content-secondary font-medium">
                    Projects <strong className="text-content-primary">{data.projectsCount}</strong>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full border border-surface-border bg-surface-hover text-content-secondary font-medium">
                    Certs <strong className="text-content-primary">{data.certificatesCount}</strong>
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full border border-surface-border bg-surface-hover text-content-secondary font-medium">
                    Experience <strong className="text-content-primary">{data.experienceCount}</strong>
                  </span>
                </div>
              </div>

              {/* Single Consolidated Progress Ring */}
              <div className="shrink-0 flex items-center gap-4 bg-surface-hover p-4 rounded-2xl border border-surface-border self-start md:self-auto">
                <ProgressRing
                  value={data.completionPercentage}
                  max={100}
                  size={72}
                  strokeWidth={6}
                  color="blue"
                >
                  <span className="text-sm font-black text-content-primary">{data.completionPercentage}%</span>
                </ProgressRing>
                <div>
                  <h4 className="text-sm font-bold text-content-primary">Profile Score</h4>
                  <p className="text-xs text-content-muted mt-0.5">Completion Index</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-[#2E4CFF]" />
                    <span className="text-[11px] text-[#2E4CFF] font-semibold">
                      {data.completionPercentage >= 80 ? 'Excellent!' : data.completionPercentage >= 50 ? 'Good Progress' : 'Getting Started'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== NEW USER vs RETURNING USER VIEW ===== */}
          {isNewUser ? (
            /* ===== NEW USER: SEQUENTIAL FLIGHT PLAN ===== */
            <div className="space-y-5 animate-fade-in">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-display font-extrabold text-content-primary">
                    Quick Start Flight Plan
                  </h3>
                  <p className="text-xs text-content-secondary mt-0.5">
                    Follow step 01 to initialize your career readiness score
                  </p>
                </div>
              </div>

              {/* STEP 01: Hero Call-to-Action Card */}
              <div className="relative overflow-hidden rounded-2xl border-2 border-[#2E4CFF] bg-[#2E4CFF]/5 p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-2 max-w-xl">
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#2E4CFF] text-white text-[11px] font-bold tracking-wide uppercase">
                      <span>Step 01 of 04</span>
                      <span>·</span>
                      <span>Recommended Next Action</span>
                    </div>
                    <h4 className="text-xl font-bold text-content-primary flex items-center gap-2">
                      <Brain className="h-5 w-5 text-[#2E4CFF]" />
                      Analyze Resume
                    </h4>
                    <p className="text-sm text-content-secondary leading-relaxed">
                      Upload your PDF or Word resume to automatically extract your skills, past experiences, and contact details into your student profile.
                    </p>
                  </div>
                  <Link
                    to="/intelligence/ats"
                    className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#2E4CFF] text-white font-semibold text-sm shadow-sm hover:bg-[#2E4CFF]/90 transition-all hover:gap-3"
                  >
                    <span>Analyze Resume Now</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              {/* UPCOMING STEPS (02-04): Compact Sequential Preview Row */}
              <div>
                <p className="text-xs font-semibold text-content-muted mb-3 uppercase tracking-wider">
                  Upcoming Steps (Unlocked after Step 01)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { step: '02', label: 'Add Key Skills', href: '/skills', icon: Cpu, desc: 'Languages, frameworks & databases' },
                    { step: '03', label: 'Add Portfolio Projects', href: '/projects', icon: FolderGit2, desc: 'Link your GitHub repositories' },
                    { step: '04', label: 'Set Target Goals', href: '/career-goals', icon: Target, desc: 'Choose target engineering roles' },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        to={item.href}
                        className="group flex items-start gap-3 rounded-xl border border-surface-border bg-surface-card/60 p-3.5 opacity-75 hover:opacity-100 hover:border-[#2E4CFF]/40 transition-all"
                      >
                        <div className="h-8 w-8 rounded-lg bg-surface-hover border border-surface-border flex items-center justify-center shrink-0 text-content-muted group-hover:text-[#2E4CFF] transition-colors">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-content-primary truncate">{item.label}</span>
                            <span className="text-[10px] font-mono font-bold text-content-muted">{item.step}</span>
                          </div>
                          <p className="text-[11px] text-content-muted truncate mt-0.5">{item.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* ===== RETURNING USER: FULL STAT CARDS GRID ===== */
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <Link to="/skills">
                  <StatCard
                    title="Total Skills"
                    value={data.skillsCount}
                    subtitle="Verified competencies"
                    icon={<Cpu className="h-5 w-5 text-[#2E4CFF]" />}
                  />
                </Link>
                <Link to="/projects">
                  <StatCard
                    title="Projects"
                    value={data.projectsCount}
                    subtitle="Portfolio repositories"
                    icon={<FolderGit2 className="h-5 w-5 text-[#2E4CFF]" />}
                  />
                </Link>
                <Link to="/certificates">
                  <StatCard
                    title="Certificates"
                    value={data.certificatesCount}
                    subtitle="Earned credentials"
                    icon={<Award className="h-5 w-5 text-[#2E4CFF]" />}
                  />
                </Link>
                <Link to="/experience">
                  <StatCard
                    title="Experience"
                    value={data.experienceCount}
                    subtitle="Work & Internships"
                    icon={<Briefcase className="h-5 w-5 text-[#2E4CFF]" />}
                  />
                </Link>
              </div>

              {/* ===== QUICK ACTIONS ===== */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-content-primary">Quick Actions</h3>
                  <Link to="/intelligence" className="text-xs text-[#2E4CFF] hover:underline flex items-center gap-1 transition-colors">
                    Intelligence Hub <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <Link
                        key={action.href}
                        to={action.href}
                        className="group relative overflow-hidden rounded-2xl border border-surface-border bg-surface-card p-5 hover:border-[#2E4CFF]/40 transition-all duration-200 card-interactive shadow-sm"
                      >
                        <div className="h-10 w-10 rounded-xl bg-[#2E4CFF] flex items-center justify-center mb-4 text-white shadow-sm group-hover:scale-105 transition-transform duration-200">
                          <Icon className="h-5 w-5" />
                        </div>
                        <p className="text-sm font-bold text-content-primary mb-0.5">{action.label}</p>
                        <p className="text-xs text-content-secondary">{action.desc}</p>
                        <ChevronRight className="absolute top-4 right-4 h-4 w-4 text-content-muted group-hover:text-[#2E4CFF] group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* ===== PROFILE + GOAL SPLIT ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Profile Card */}
            <div className="rounded-3xl border border-surface-border bg-surface-card p-7 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-content-primary flex items-center gap-2">
                  <User className="h-4.5 w-4.5 text-[#2E4CFF]" />
                  Student Profile
                </h3>
                <Link to="/profile" className="text-xs text-[#2E4CFF] hover:underline font-semibold flex items-center gap-1 transition-colors">
                  Edit <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="flex items-center gap-4 mb-5 pb-5 border-b border-surface-border">
                <div className="h-14 w-14 rounded-2xl bg-[#2E4CFF] flex items-center justify-center text-xl font-black text-white shadow-sm shrink-0">
                  {data.profile?.fullName?.charAt(0) || 'S'}
                </div>
                <div className="min-w-0">
                  <h4 className="text-base font-bold text-content-primary truncate">{data.profile?.fullName || 'Student'}</h4>
                  <p className="text-sm text-content-secondary truncate">
                    {data.profile?.degree || 'Degree'} in {data.profile?.major || 'Major'}
                  </p>
                  <p className="text-xs text-emerald-500 mt-0.5 truncate">{data.profile?.universityName || 'University'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Email', value: data.profile?.email || 'N/A' },
                  { label: 'Phone', value: data.profile?.phone || 'Not provided' },
                  { label: 'Graduation', value: String(data.profile?.graduationYear || '2026') },
                  { label: 'Location', value: data.profile?.city ? `${data.profile.city}, ${data.profile.country || ''}` : 'Not provided' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-surface-hover p-3 rounded-xl border border-surface-border">
                    <p className="text-[10px] font-semibold text-content-muted uppercase tracking-wider">{label}</p>
                    <p className="text-xs font-semibold text-content-primary mt-1 truncate">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Career Goal Card */}
            <div className="rounded-3xl border border-surface-border bg-surface-card p-7 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-content-primary flex items-center gap-2">
                  <Target className="h-4.5 w-4.5 text-emerald-500" />
                  Career Goal
                </h3>
                <Link to="/career-goals" className="text-xs text-emerald-500 hover:underline font-semibold flex items-center gap-1 transition-colors">
                  Manage <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {data.careerGoal ? (
                <div className="space-y-3">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
                    <p className="text-[10px] font-semibold text-content-muted uppercase tracking-wider mb-1">Target Role</p>
                    <p className="text-lg font-black text-content-primary">{data.careerGoal.preferredRole || 'Not configured'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Domain', value: data.careerGoal.preferredDomain || 'Software' },
                      { label: 'Work Mode', value: data.careerGoal.workMode || 'Hybrid' },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-surface-hover p-3 rounded-xl border border-surface-border">
                        <p className="text-[10px] font-semibold text-content-muted uppercase tracking-wider">{label}</p>
                        <p className="text-xs font-semibold text-content-primary mt-1">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* AI suggestion chip */}
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <Zap className="h-4 w-4 text-emerald-500 shrink-0" />
                    <p className="text-xs text-content-secondary">
                      <span className="text-emerald-500 font-semibold">AI Tip:</span> Complete your Skills section to get personalized recommendations for your target role.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="h-12 w-12 rounded-2xl bg-surface-hover flex items-center justify-center mb-4 border border-surface-border">
                    <Target className="h-6 w-6 text-content-muted" />
                  </div>
                  <p className="text-sm text-content-muted mb-4">No career goals configured yet</p>
                  <Link
                    to="/career-goals"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-500 hover:underline transition-colors"
                  >
                    Configure career targets <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* ===== PROFILE COMPLETION BREAKDOWN ===== */}
          <div className="rounded-3xl border border-surface-border bg-surface-card p-7 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-content-primary flex items-center gap-2">
                  <TrendingUp className="h-4.5 w-4.5 text-emerald-500" />
                  Profile Completion Breakdown
                </h3>
                <p className="text-xs text-content-secondary mt-1">Weighted scoring across all workspace modules</p>
              </div>
              <span className="text-sm font-mono font-bold text-emerald-500">
                <AnimatedCounter target={data.completionPercentage} suffix="%" />
              </span>
            </div>

            <div className="space-y-4">
              {Object.entries(data.completionBreakdown || {}).map(([module, score]) => (
                <ProgressBar
                  key={module}
                  value={score as number}
                  max={100}
                  label={module}
                  color="emerald"
                  size="md"
                />
              ))}
            </div>
          </div>

        </div>
      ) : null}
    </StudentLayout>
  );
}
