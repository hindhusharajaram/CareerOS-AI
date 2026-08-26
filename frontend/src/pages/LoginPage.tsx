import React, { useState, useEffect } from 'react';
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
  const [loadingMessage, setLoadingMessage] = useState('Authenticating...');
  const [validationError, setValidationError] = useState('');
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    api.get('/health').catch(() => {
      // Silent catch for background spin-up
    });
  }, []);

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
    setLoadingMessage('Authenticating...');

    const slowServerTimer = setTimeout(() => {
      setLoadingMessage('Waking up the server — this can take up to a minute on the first login of the day.');
    }, 3000);

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
      if (err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else if (err.customUserMessage) {
        setServerError(err.customUserMessage);
      } else {
        setServerError('Cannot connect to the authorization server. Please check backend availability.');
      }
    } finally {
      clearTimeout(slowServerTimer);
      setIsLoading(false);
      setLoadingMessage('Authenticating...');
    }
  };

  return (
    <div className="relative flex min-h-screen bg-surface-base text-content-primary font-sans overflow-hidden">
      {/* Background dot pattern */}
      <div className="absolute inset-0 dot-pattern opacity-10 pointer-events-none" />

      {/* Left Brand Panel */}
      <div className="hidden lg:flex w-[45%] relative flex-col justify-between p-12 border-r border-surface-border bg-surface-card overflow-hidden">
        <div className="relative">
          <Link to="/" className="flex items-center gap-2.5 mb-16">
            <div className="h-10 w-10 rounded-xl bg-[#2E4CFF] flex items-center justify-center text-white shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-content-primary">CareerOS AI</span>
          </Link>

          <div className="space-y-6">
            <h2 className="text-4xl font-display font-extrabold text-content-primary leading-tight">
              Intelligence that<br />
              <span className="text-[#2E4CFF]">
                accelerates careers
              </span>
            </h2>
            <p className="text-content-secondary text-sm leading-relaxed max-w-sm">
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
                <div className="h-5 w-5 rounded-full bg-[#2E4CFF]/10 border border-[#2E4CFF]/20 flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-[#2E4CFF]" />
                </div>
                <span className="text-sm text-content-secondary">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-content-muted">© 2026 CareerOS AI · All rights reserved</p>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        {/* Back button */}
        <Link
          to="/"
          className="absolute top-8 left-8 flex items-center gap-2 text-sm text-content-secondary hover:text-content-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:block">Back to Home</span>
        </Link>

        <div className="w-full max-w-[380px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="h-9 w-9 rounded-xl bg-[#2E4CFF] flex items-center justify-center text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-bold text-content-primary">CareerOS AI</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-display font-extrabold text-content-primary mb-2">Welcome back</h1>
            <p className="text-sm text-content-secondary">Sign in to your career workspace</p>
          </div>

          {/* Error alerts */}
          {(validationError || serverError) && (
            <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-sm text-rose-500 animate-scale-in">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{validationError || serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-content-secondary mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-content-muted">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-surface-border bg-surface-card py-3 pl-10 pr-4 text-sm text-content-primary placeholder-content-muted focus:border-[#2E4CFF] focus:outline-none focus:ring-2 focus:ring-[#2E4CFF]/30 transition-all"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-content-secondary mb-2">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-content-muted">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-surface-border bg-surface-card py-3 pl-10 pr-11 text-sm text-content-primary placeholder-content-muted focus:border-[#2E4CFF] focus:outline-none focus:ring-2 focus:ring-[#2E4CFF]/30 transition-all"
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-content-muted hover:text-content-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-[#2E4CFF] hover:bg-[#1A32C7] text-white py-3.5 px-4 text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2 text-xs sm:text-sm text-center leading-tight">
                  <span className="h-4 w-4 shrink-0 rounded-full border-2 border-current border-t-transparent animate-spin" />
                  <span>{loadingMessage}</span>
                </span>
              ) : (
                'Sign In to Workspace'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-content-secondary">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-[#2E4CFF] hover:underline transition-colors">
              Create account
            </Link>
          </p>

          {/* Security note */}
          <div className="mt-8 flex items-center justify-center gap-1.5 text-xs text-content-muted">
            <Lock className="h-3 w-3" />
            Secured login
          </div>
        </div>
      </div>
    </div>
  );
}
