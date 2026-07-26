import React, { useState } from 'react';
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
  Database,
  ShieldCheck,
  Settings,
  LogOut,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  Bell,
  Zap,
} from 'lucide-react';

interface StudentLayoutProps {
  children: React.ReactNode;
}

interface NavGroup {
  label: string;
  items: NavItem[];
  defaultOpen?: boolean;
}

interface NavItem {
  name: string;
  path: string;
  icon: React.ElementType;
}

const navGroups: NavGroup[] = [
  {
    label: 'Main',
    defaultOpen: true,
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Search', path: '/search', icon: Search },
    ],
  },
  {
    label: 'AI Workspace',
    defaultOpen: true,
    items: [
      { name: 'Career Copilot', path: '/ai/copilot', icon: Bot },
      { name: 'AI Career Chat', path: '/ai/chat', icon: MessageSquare },
      { name: 'Resume Review', path: '/ai/resume-review', icon: FileText },
      { name: 'Learning Coach', path: '/ai/learning-coach', icon: Brain },
      { name: 'Mock Interview', path: '/ai/mock-interview', icon: Zap },
      { name: 'Project Advisor', path: '/ai/project-advisor', icon: FolderGit2 },
    ],
  },
  {
    label: 'Career Intelligence',
    defaultOpen: true,
    items: [
      { name: 'Intelligence Hub', path: '/intelligence', icon: Brain },
      { name: 'Career Score', path: '/intelligence/score', icon: Award },
      { name: 'Skill Gap', path: '/intelligence/skill-gap', icon: Cpu },
      { name: 'Roadmap', path: '/intelligence/roadmap', icon: Target },
      { name: 'ATS Analysis', path: '/intelligence/ats', icon: FileText },
      { name: 'Recommendations', path: '/intelligence/recommendations', icon: Sparkles },
    ],
  },
  {
    label: 'My Profile',
    defaultOpen: false,
    items: [
      { name: 'Profile', path: '/profile', icon: User },
      { name: 'Resumes', path: '/resumes', icon: FileText },
      { name: 'Skills', path: '/skills', icon: Cpu },
      { name: 'Education', path: '/education', icon: GraduationCap },
      { name: 'Projects', path: '/projects', icon: FolderGit2 },
      { name: 'Certificates', path: '/certificates', icon: Award },
      { name: 'Experience', path: '/experience', icon: Briefcase },
      { name: 'Career Goals', path: '/career-goals', icon: Target },
      { name: 'Profile Health', path: '/health', icon: Activity },
      { name: 'Upload Center', path: '/upload-center', icon: UploadCloud },
    ],
  },
  {
    label: 'Data Platform',
    defaultOpen: false,
    items: [
      { name: 'Analytics Admin', path: '/analytics-admin', icon: BarChart2 },
      { name: 'Warehouse', path: '/warehouse-dashboard', icon: Database },
      { name: 'System Monitor', path: '/system-monitor', icon: ShieldCheck },
    ],
  },
];

function NavGroupSection({
  group,
  currentPath,
}: {
  group: NavGroup;
  currentPath: string;
}) {
  const [open, setOpen] = useState(group.defaultOpen ?? false);
  const isAnyActive = group.items.some((i) => currentPath === i.path);

  return (
    <div className="mb-1">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between px-3 py-1.5 mb-1 rounded-lg transition-colors ${
          isAnyActive ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'
        }`}
      >
        <span className="text-[10px] font-bold uppercase tracking-widest">{group.label}</span>
        <ChevronDown
          className={`h-3 w-3 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="space-y-0.5">
          {group.items.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600/80 to-purple-600/80 text-white shadow-sm shadow-indigo-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-300'}`} />
                <span className="truncate">{item.name}</span>
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-300" />
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function StudentLayout({ children }: StudentLayoutProps): React.ReactElement {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const userString = localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const userName = user?.fullName || 'Student User';
  const userRole = user?.role || 'STUDENT';
  const initials = userName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  const currentPage = navGroups
    .flatMap((g) => g.items)
    .find((n) => n.path === location.pathname)?.name || 'Workspace';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 px-4 py-4 mb-4 shrink-0">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
          <Sparkles className="h-4.5 w-4.5 text-white" />
        </div>
        <div>
          <span className="text-base font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-300">
            CareerOS AI
          </span>
          <p className="text-[9px] text-slate-500 font-mono tracking-widest uppercase -mt-0.5">
            v1.0 · Production
          </p>
        </div>
      </Link>

      {/* Nav Groups — scrollable */}
      <nav className="flex-1 px-2 overflow-y-auto scrollable pb-4">
        {navGroups.map((group) => (
          <NavGroupSection key={group.label} group={group} currentPath={location.pathname} />
        ))}

        {/* Settings */}
        <div className="mt-2 space-y-0.5 px-1">
          <Link
            to="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all"
          >
            <Settings className="h-4 w-4 text-slate-500" />
            Settings
          </Link>
        </div>
      </nav>

      {/* User Footer */}
      <div className="shrink-0 border-t border-slate-800/80 p-3 mt-2">
        <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/40 transition-colors group cursor-default">
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{userName}</p>
            <p className="text-[10px] text-indigo-400/80 font-mono tracking-wider">{userRole}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign Out"
            className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
          >
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020817] text-slate-100 font-sans flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 border-r border-slate-800/60 bg-slate-900/40 backdrop-blur-xl flex-col sticky top-0 h-screen z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-60 z-50 bg-slate-900 border-r border-slate-800/80 flex flex-col
          transition-transform duration-300 ease-out lg:hidden
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-white">CareerOS AI</span>
          </div>
          <button onClick={() => setMobileOpen(false)} className="p-1.5 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-hidden">
          <SidebarContent />
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-14 border-b border-slate-800/60 bg-slate-900/30 backdrop-blur-xl px-4 lg:px-6 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-500 hidden sm:block">Workspace</span>
              <span className="text-slate-600 hidden sm:block">/</span>
              <h1 className="font-bold text-white">{currentPage}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* AI status badge */}
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/8 px-2.5 py-1 text-[11px] text-indigo-300 font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
              AI Engine Active
            </span>

            {/* Notifications */}
            <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-xl transition-colors">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-indigo-500" />
            </button>

            {/* Avatar */}
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs hover:shadow-lg hover:shadow-indigo-500/20 transition-all"
            >
              {initials}
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
