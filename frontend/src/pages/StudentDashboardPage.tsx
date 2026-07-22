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
  AlertCircle
} from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { studentService, DashboardSummaryData } from '../services/studentService';

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
    } catch (err: any) {
      setError('Could not fetch student dashboard. Make sure the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StudentLayout>
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
            <p className="text-sm text-slate-400">Loading Student Career Workspace...</p>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-400 flex items-center gap-3">
          <AlertCircle className="h-6 w-6 shrink-0" />
          <span>{error}</span>
        </div>
      ) : data ? (
        <div className="space-y-8">
          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-8 shadow-xl">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs text-indigo-300 mb-3">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Career Engine Ready
                </div>
                <h2 className="text-3xl font-extrabold text-white">
                  Welcome back, {data.profile?.fullName || 'Student'}!
                </h2>
                <p className="mt-2 text-sm text-slate-400 max-w-xl">
                  Build your career data foundation. Complete your skills, projects, and goals to unlock intelligent placement recommendations and AI resume matching.
                </p>
              </div>

              {/* Progress Circle Badge */}
              <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shrink-0">
                <div className="relative h-16 w-16 flex items-center justify-center">
                  <svg className="h-full w-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-800"
                      strokeWidth="4"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-indigo-500 transition-all duration-1000"
                      strokeDasharray={`${data.completionPercentage}, 100`}
                      strokeWidth="4"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-sm font-extrabold text-white">{data.completionPercentage}%</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Profile Score</h4>
                  <p className="text-xs text-slate-400">Completion Index</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Statistics Grid */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              to="/skills"
              className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md hover:border-indigo-500/40 hover:bg-slate-900/80 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition duration-300">
                  <Cpu className="h-6 w-6" />
                </div>
                <span className="text-3xl font-extrabold text-white">{data.skillsCount}</span>
              </div>
              <h3 className="mt-4 text-sm font-semibold text-slate-300">Total Skills</h3>
              <p className="text-xs text-slate-500 mt-1">Verified competencies</p>
            </Link>

            <Link
              to="/projects"
              className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md hover:border-purple-500/40 hover:bg-slate-900/80 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 group-hover:bg-purple-500 group-hover:text-white transition duration-300">
                  <FolderGit2 className="h-6 w-6" />
                </div>
                <span className="text-3xl font-extrabold text-white">{data.projectsCount}</span>
              </div>
              <h3 className="mt-4 text-sm font-semibold text-slate-300">Projects</h3>
              <p className="text-xs text-slate-500 mt-1">Portfolio repositories</p>
            </Link>

            <Link
              to="/certificates"
              className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md hover:border-emerald-500/40 hover:bg-slate-900/80 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition duration-300">
                  <Award className="h-6 w-6" />
                </div>
                <span className="text-3xl font-extrabold text-white">{data.certificatesCount}</span>
              </div>
              <h3 className="mt-4 text-sm font-semibold text-slate-300">Certificates</h3>
              <p className="text-xs text-slate-500 mt-1">Earned credentials</p>
            </Link>

            <Link
              to="/experience"
              className="group rounded-2xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md hover:border-amber-500/40 hover:bg-slate-900/80 transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition duration-300">
                  <Briefcase className="h-6 w-6" />
                </div>
                <span className="text-3xl font-extrabold text-white">{data.experienceCount}</span>
              </div>
              <h3 className="mt-4 text-sm font-semibold text-slate-300">Experience</h3>
              <p className="text-xs text-slate-500 mt-1">Work & Internships</p>
            </Link>
          </div>

          {/* Profile Completion Breakdown */}
          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-md space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Profile Completion Engine</h3>
                <p className="text-xs text-slate-400 mt-1">Weighted scoring across workspace modules</p>
              </div>
              <span className="text-sm font-mono font-bold text-indigo-400">{data.completionPercentage}% Completed</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-950 h-3.5 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 h-full rounded-full transition-all duration-1000"
                style={{ width: `${data.completionPercentage}%` }}
              />
            </div>

            {/* Modules Grid Breakdown */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 pt-2">
              {Object.entries(data.completionBreakdown || {}).map(([module, score]) => (
                <div key={module} className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 text-center">
                  <p className="text-[11px] font-semibold text-slate-400 truncate">{module}</p>
                  <p className="text-lg font-bold text-white mt-1">{score}%</p>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Card & Career Goal Split */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Student Profile Overview Card */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <User className="h-5 w-5 text-indigo-400" />
                    Student Profile Snapshot
                  </h3>
                  <Link to="/profile" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
                    Edit Profile <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="flex items-center gap-5 mb-6">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-indigo-500/20">
                    {data.profile?.fullName?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">{data.profile?.fullName || 'Student'}</h4>
                    <p className="text-sm text-slate-400">{data.profile?.degree || 'Degree Not Set'} in {data.profile?.major || 'Major Not Set'}</p>
                    <p className="text-xs text-indigo-400 mt-1">{data.profile?.universityName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs text-slate-400 border-t border-slate-800/80 pt-4">
                  <div><span className="text-slate-500">Email:</span> <p className="font-medium text-slate-200 mt-0.5">{data.profile?.email || 'N/A'}</p></div>
                  <div><span className="text-slate-500">Phone:</span> <p className="font-medium text-slate-200 mt-0.5">{data.profile?.phone || 'Not provided'}</p></div>
                  <div><span className="text-slate-500">Graduation:</span> <p className="font-medium text-slate-200 mt-0.5">{data.profile?.graduationYear || '2026'}</p></div>
                  <div><span className="text-slate-500">Location:</span> <p className="font-medium text-slate-200 mt-0.5">{data.profile?.city ? `${data.profile.city}, ${data.profile.country || ''}` : 'Not provided'}</p></div>
                </div>
              </div>
            </div>

            {/* Career Goal Snapshot */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-8 backdrop-blur-md flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-400" />
                    Career Goal & Aspiration
                  </h3>
                  <Link to="/career-goals" className="text-xs text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1">
                    Manage Goals <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                {data.careerGoal ? (
                  <div className="space-y-4">
                    <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
                      <p className="text-xs text-slate-500">Target Role</p>
                      <p className="text-lg font-bold text-white mt-1">{data.careerGoal.preferredRole || 'Not configured'}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                        <span className="text-slate-500">Domain</span>
                        <p className="font-semibold text-slate-200 mt-1">{data.careerGoal.preferredDomain || 'Software'}</p>
                      </div>
                      <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                        <span className="text-slate-500">Work Mode</span>
                        <p className="font-semibold text-slate-200 mt-1">{data.careerGoal.workMode || 'Hybrid'}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <Target className="h-10 w-10 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No career goals set yet.</p>
                    <Link to="/career-goals" className="mt-3 inline-block text-xs text-purple-400 font-semibold underline">
                      Configure your career targets
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </StudentLayout>
  );
}
