import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Cpu,
  GraduationCap,
  FolderGit2,
  Award,
  Briefcase,
  Target,
  FileText,
  Activity,
  UploadCloud,
  Search,
  Brain,
  Bot,
  MessageSquare,
  BarChart2,
  Settings,
  LogOut,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface StudentLayoutProps {
  children: React.ReactNode;
}

export default function StudentLayout({ children }: StudentLayoutProps): React.ReactElement {
  const location = useLocation();
  const navigate = useNavigate();

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const userName = user?.fullName || 'Student User';
  const userRole = user?.role || 'STUDENT';

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'AI Career Copilot', path: '/ai/copilot', icon: Bot },
    { name: 'AI Career Chat', path: '/ai/chat', icon: MessageSquare },
    { name: 'Career Intelligence', path: '/intelligence', icon: Brain },
    { name: 'Analytics Admin', path: '/analytics-admin', icon: BarChart2 },
    { name: 'My Profile', path: '/profile', icon: User },
    { name: 'Resumes', path: '/resumes', icon: FileText },
    { name: 'Profile Health', path: '/health', icon: Activity },
    { name: 'Skills', path: '/skills', icon: Cpu },
    { name: 'Education', path: '/education', icon: GraduationCap },
    { name: 'Projects', path: '/projects', icon: FolderGit2 },
    { name: 'Certificates', path: '/certificates', icon: Award },
    { name: 'Experience', path: '/experience', icon: Briefcase },
    { name: 'Career Goals', path: '/career-goals', icon: Target },
    { name: 'Upload Center', path: '/upload-center', icon: UploadCloud },
    { name: 'Search Engine', path: '/search', icon: Search },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex selection:bg-indigo-500 selection:text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800/80 bg-slate-900/60 backdrop-blur-md flex flex-col justify-between p-4 sticky top-0 h-screen z-20">
        <div>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 px-3 py-3 mb-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-md shadow-indigo-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-400">
              CareerOS AI
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white shadow-md shadow-indigo-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="h-4 w-4 opacity-70" />}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="border-t border-slate-800/80 pt-4">
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{userName}</p>
                <p className="text-[10px] text-indigo-400 font-mono tracking-wider">{userRole}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition duration-200"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-white">
              {navItems.find((n) => n.path === location.pathname)?.name || 'Workspace'}
            </h1>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-indigo-300 font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              AI Foundation Engine Active
            </span>
          </div>
        </header>

        {/* Page Content View */}
        <main className="p-8 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
