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
  { label: 'View Career Score', href: '/intelligence/score', icon: Award, color: 'from-indigo-500 to-purple-600', desc: 'Check your 0–1000 rating' },
  { label: 'Analyze Resume', href: '/intelligence/ats', icon: Brain, color: 'from-purple-500 to-violet-600', desc: 'ATS optimization' },
  { label: 'AI Career Chat', href: '/ai/chat', icon: Bot, color: 'from-violet-500 to-indigo-600', desc: 'Ask anything' },
  { label: '90-Day Roadmap', href: '/intelligence/roadmap', icon: Target, color: 'from-emerald-500 to-teal-600', desc: 'Your action plan' },
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

  return (
    <StudentLayout>
      {isLoading ? (
        <div className="space-y-8">
          {/* Skeleton welcome banner */}
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
      ) : data ? (
        <div className="space-y-8 max-w-7xl">

          {/* ===== WELCOME BANNER ===== */}
          <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 p-7 shadow-2xl shadow-black/20">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 h-48 w-48 bg-indigo-500/10 rounded-full blur-[60px]" />
            <div className="absolute bottom-0 left-[30%] h-32 w-32 bg-purple-500/10 rounded-full blur-[40px]" />

            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/25 bg-indigo-500/10 px-3 py-1 text-xs text-indigo-300 font-semibold mb-3">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Career Engine Active
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Welcome back,{' '}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
                    {data.profile?.fullName?.split(' ')[0] || 'Student'}
                  </span>
                  !
                </h2>
                <p className="mt-2 text-sm text-slate-400 max-w-lg">
                  Your career workspace is ready. Complete your profile to unlock personalized AI recommendations and maximize your placement score.
                </p>

                {/* Progress bar */}
                <div className="mt-5 max-w-sm">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-400">Profile Completion</span>
                    <span className="text-xs font-bold text-indigo-400">{data.completionPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-900/80 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${data.completionPercentage}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Score Ring */}
              <div className="shrink-0 flex items-center gap-4 bg-slate-900/60 p-4 rounded-2xl border border-slate-800/60">
                <ProgressRing
                  value={data.completionPercentage}
                  max={100}
                  size={80}
                  strokeWidth={7}
                  color="indigo"
                >
                  <span className="text-sm font-black text-white">{data.completionPercentage}%</span>
                </ProgressRing>
                <div>
                  <h4 className="text-sm font-bold text-white">Profile Score</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Completion Index</p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                    <span className="text-[11px] text-emerald-400 font-semibold">
                      {data.completionPercentage >= 80 ? 'Excellent!' : data.completionPercentage >= 50 ? 'Good Progress' : 'Getting Started'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ===== STAT CARDS ===== */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Link to="/skills">
              <StatCard
                title="Total Skills"
                value={data.skillsCount}
                subtitle="Verified competencies"
                icon={<Cpu className="h-5 w-5" />}
                color="indigo"
              />
            </Link>
            <Link to="/projects">
              <StatCard
                title="Projects"
                value={data.projectsCount}
                subtitle="Portfolio repositories"
                icon={<FolderGit2 className="h-5 w-5" />}
                color="purple"
              />
            </Link>
            <Link to="/certificates">
              <StatCard
                title="Certificates"
                value={data.certificatesCount}
                subtitle="Earned credentials"
                icon={<Award className="h-5 w-5" />}
                color="emerald"
              />
            </Link>
            <Link to="/experience">
              <StatCard
                title="Experience"
                value={data.experienceCount}
                subtitle="Work & Internships"
                icon={<Briefcase className="h-5 w-5" />}
                color="amber"
              />
            </Link>
          </div>

          {/* ===== QUICK ACTIONS ===== */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Quick Actions</h3>
              <Link to="/intelligence" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors">
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
                    className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 hover:border-slate-700/60 hover:bg-slate-900/80 transition-all duration-200 card-interactive"
                  >
                    <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <p className="text-sm font-bold text-white mb-0.5">{action.label}</p>
                    <p className="text-xs text-slate-500">{action.desc}</p>
                    <ChevronRight className="absolute top-4 right-4 h-4 w-4 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all" />
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ===== PROFILE + GOAL SPLIT ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Profile Card */}
            <div className="rounded-3xl border border-slate-800/80 bg-slate-900/50 p-7 backdrop-blur-md">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <User className="h-4.5 w-4.5 text-indigo-400" />
                  Student Profile
                </h3>
                <Link to="/profile" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors">
                  Edit <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-800/60">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-xl font-black text-white shadow-lg shadow-indigo-500/20 shrink-0">
                  {data.profile?.fullName?.charAt(0) || 'S'}
                </div>
                <div className="min-w-0">
                  <h4 className="text-base font-bold text-white truncate">{data.profile?.fullName || 'Student'}</h4>
                  <p className="text-sm text-slate-400 truncate">
                    {data.profile?.degree || 'Degree'} in {data.profile?.major || 'Major'}
                  </p>
                  <p className="text-xs text-indigo-400 mt-0.5 truncate">{data.profile?.universityName || 'University'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Email', value: data.profile?.email || 'N/A' },
                  { label: 'Phone', value: data.profile?.phone || 'Not provided' },
                  { label: 'Graduation', value: String(data.profile?.graduationYear || '2026') },
                  { label: 'Location', value: data.profile?.city ? `${data.profile.city}, ${data.profile.country || ''}` : 'Not provided' },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
                    <p className="text-xs font-semibold text-slate-200 mt-1 truncate">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Career Goal Card */}
            <div className="rounded-3xl border border-slate-800/80 bg-slate-900/50 p-7 backdrop-blur-md">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Target className="h-4.5 w-4.5 text-purple-400" />
                  Career Goal
                </h3>
                <Link to="/career-goals" className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 transition-colors">
                  Manage <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              {data.careerGoal ? (
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/15 p-4 rounded-2xl">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Target Role</p>
                    <p className="text-lg font-black text-white">{data.careerGoal.preferredRole || 'Not configured'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: 'Domain', value: data.careerGoal.preferredDomain || 'Software' },
                      { label: 'Work Mode', value: data.careerGoal.workMode || 'Hybrid' },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                        <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
                        <p className="text-xs font-semibold text-slate-200 mt-1">{value}</p>
                      </div>
                    ))}
                  </div>

                  {/* AI suggestion chip */}
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-indigo-500/8 border border-indigo-500/15">
                    <Zap className="h-4 w-4 text-indigo-400 shrink-0" />
                    <p className="text-xs text-slate-400">
                      <span className="text-indigo-300 font-semibold">AI Tip:</span> Complete your Skills section to get personalized recommendations for your target role.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="h-12 w-12 rounded-2xl bg-slate-800/60 flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-slate-600" />
                  </div>
                  <p className="text-sm text-slate-500 mb-4">No career goals configured yet</p>
                  <Link
                    to="/career-goals"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Configure career targets <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* ===== PROFILE COMPLETION BREAKDOWN ===== */}
          <div className="rounded-3xl border border-slate-800/80 bg-slate-900/50 p-7 backdrop-blur-md">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <TrendingUp className="h-4.5 w-4.5 text-indigo-400" />
                  Profile Completion Breakdown
                </h3>
                <p className="text-xs text-slate-500 mt-1">Weighted scoring across all workspace modules</p>
              </div>
              <span className="text-sm font-mono font-bold text-indigo-400">
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
                  color="auto"
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
