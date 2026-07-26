import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Sparkles, ArrowLeft, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function LoginPage(): React.ReactElement {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [serverError, setServerError] = useState('');

  const validateForm = () => {
    setValidationError('');
    setServerError('');
    if (!email.trim() || !password.trim()) {
      setValidationError('All fields are required.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('Please enter a valid email address.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const resBody = response.data;

      if (resBody.success) {
        const authData = resBody.data;
        localStorage.setItem('token', authData.accessToken);
        localStorage.setItem('user', JSON.stringify(authData.user));
        toast.success(`Welcome back, ${authData.user.fullName || 'User'}!`);
        setTimeout(() => navigate('/dashboard'), 1200);
      } else {
        setServerError(resBody.message || 'Login failed.');
      }
    } catch (err: any) {
      if (err.response?.data) {
        setServerError(err.response.data.message || 'Invalid email or password.');
      } else {
        setServerError('Cannot connect to the authorization server.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen bg-[#020817] font-sans overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-[-10%] left-[30%] h-[600px] w-[600px] rounded-full bg-indigo-900/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[20%] h-[400px] w-[400px] rounded-full bg-purple-900/15 blur-[100px] pointer-events-none" />

      {/* Left Brand Panel */}
      <div className="hidden lg:flex w-[45%] relative flex-col justify-between p-12 border-r border-slate-800/60 bg-slate-900/20 backdrop-blur-sm overflow-hidden">
        {/* Dot pattern */}
        <div className="absolute inset-0 dot-pattern opacity-30" />
        {/* Spinning ring decoration */}
        <div className="absolute bottom-[10%] right-[-15%] h-80 w-80 rounded-full border border-indigo-500/15 animate-spin-slow" />
        <div className="absolute bottom-[15%] right-[-10%] h-60 w-60 rounded-full border border-purple-500/10 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '15s' }} />

        <div className="relative">
          <Link to="/" className="flex items-center gap-2.5 mb-16">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">CareerOS AI</span>
          </Link>

          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/8 px-3 py-1 text-xs text-indigo-300 font-semibold uppercase tracking-wider">
              v1.0 Production Ready
            </div>
            <h2 className="text-4xl font-black text-white leading-tight">
              Intelligence that<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                accelerates careers
              </span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Your AI-powered career workspace. Career scoring, ATS analysis, skill gap detection, personalized roadmaps, and 6 AI assistants — all in one platform.
            </p>
          </div>

          {/* Feature list */}
          <div className="mt-12 space-y-4">
            {[
              'Career Score Engine (0–1000)',
              '6 AI Copilot Assistants',
              'ATS Resume Analyzer',
              '90-Day Roadmap Generator',
              'Real-time Skill Gap Detection',
            ].map((feature) => (
              <div key={feature} className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-indigo-400" />
                </div>
                <span className="text-sm text-slate-400">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-slate-600">© 2026 CareerOS AI · All rights reserved</p>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        {/* Back button */}
        <Link
          to="/"
          className="absolute top-8 left-8 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:block">Back to Home</span>
        </Link>

        <div className="w-full max-w-[380px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-white">CareerOS AI</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-black text-white mb-2">Welcome back</h1>
            <p className="text-sm text-slate-400">Sign in to your career workspace</p>
          </div>

          {/* Error alerts */}
          {(validationError || serverError) && (
            <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/8 p-3.5 text-sm text-red-400 animate-scale-in">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{validationError || serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 py-3 pl-10 pr-11 text-sm text-white placeholder-slate-600 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-500/30 hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Authenticating...
                </span>
              ) : (
                'Sign In to Workspace'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              Create account
            </Link>
          </p>

          {/* Security note */}
          <div className="mt-8 flex items-center justify-center gap-1.5 text-xs text-slate-600">
            <Lock className="h-3 w-3" />
            Secured with JWT · TLS · Rate Limiting
          </div>
        </div>
      </div>
    </div>
  );
}
