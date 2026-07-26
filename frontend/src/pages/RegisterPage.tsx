import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Mail,
  Lock,
  User as UserIcon,
  Sparkles,
  AlertCircle,
  ArrowLeft,
  Check,
  X,
  Eye,
  EyeOff,
  Shield,
  Brain,
  Award,
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api/axios';

export default function RegisterPage(): React.ReactElement {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('STUDENT');
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [serverError, setServerError] = useState('');

  // Password criteria checks
  const hasMinLength = password.length >= 8 && password.length <= 64;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const passwordStrength = [hasMinLength, hasUppercase, hasLowercase, hasDigit, hasSpecial].filter(Boolean).length;

  const validateForm = () => {
    setValidationError('');
    setServerError('');
    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setValidationError('All fields are required.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setValidationError('Please enter a valid email address.');
      return false;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}<>]{8,64}$/;
    if (!passwordRegex.test(password)) {
      setValidationError('Your password does not satisfy complexity requirements.');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const response = await api.post('/api/auth/register', { fullName, email, password, role });
      const resBody = response.data;
      if (resBody.success) {
        toast.success('Account created! Redirecting to sign in...');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setServerError(resBody.message || 'Registration failed.');
      }
    } catch (err: any) {
      if (err.response?.data) {
        const errorData = err.response.data;
        if (errorData.data && Array.isArray(errorData.data)) {
          const messages = errorData.data.map((e: any) => e.message).join(' ');
          setServerError(messages || errorData.message);
        } else {
          setServerError(errorData.message || 'Registration failed.');
        }
      } else {
        setServerError('Cannot connect to the authorization server.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const strengthColors = ['', 'bg-red-500', 'bg-orange-500', 'bg-amber-400', 'bg-lime-400', 'bg-emerald-500'];
  const strengthLabels = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];

  return (
    <div className="relative flex min-h-screen bg-[#020817] font-sans overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-[-10%] right-[30%] h-[600px] w-[600px] rounded-full bg-purple-900/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] h-[400px] w-[400px] rounded-full bg-indigo-900/15 blur-[100px] pointer-events-none" />

      {/* Left Brand Panel */}
      <div className="hidden lg:flex w-[45%] relative flex-col justify-between p-12 border-r border-slate-800/60 bg-slate-900/20 backdrop-blur-sm overflow-hidden">
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div className="absolute top-[-15%] right-[-15%] h-80 w-80 rounded-full border border-purple-500/15 animate-spin-slow" />
        <div className="absolute top-[-10%] right-[-10%] h-60 w-60 rounded-full border border-indigo-500/10 animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '15s' }} />

        <div className="relative">
          <Link to="/" className="flex items-center gap-2.5 mb-16">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">CareerOS AI</span>
          </Link>

          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/8 px-3 py-1 text-xs text-purple-300 font-semibold uppercase tracking-wider">
              Start your journey
            </div>
            <h2 className="text-4xl font-black text-white leading-tight">
              Build your career<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-violet-400">
                with intelligence
              </span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Join thousands of students who use CareerOS AI to get their career score, close skill gaps, and land dream roles at top companies.
            </p>
          </div>

          {/* Visual feature cards */}
          <div className="mt-12 space-y-4">
            {[
              { icon: Award, title: 'Career Score in minutes', desc: 'Instant 0–1000 score computed from your profile', color: 'indigo' },
              { icon: Brain, title: '6 AI Assistants included', desc: 'Copilot, Chat, Resume Review, Mock Interview & more', color: 'purple' },
              { icon: Shield, title: 'Enterprise-grade security', desc: 'JWT auth, HSTS, CSP, rate limiting built-in', color: 'emerald' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-900/40 border border-slate-800/60">
                <div className={`h-9 w-9 rounded-lg bg-${color}-500/10 flex items-center justify-center text-${color}-400 shrink-0`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative text-xs text-slate-600">© 2026 CareerOS AI · All rights reserved</p>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-y-auto">
        <Link
          to="/"
          className="absolute top-8 left-8 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:block">Back to Home</span>
        </Link>

        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-white">CareerOS AI</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-black text-white mb-2">Create your account</h1>
            <p className="text-sm text-slate-400">Start building your AI-powered career profile</p>
          </div>

          {/* Error alert */}
          {(validationError || serverError) && (
            <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/8 p-3.5 text-sm text-red-400 animate-scale-in">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{validationError || serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                  <UserIcon className="h-4 w-4" />
                </span>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  required
                  autoComplete="name"
                />
              </div>
            </div>

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
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/60 py-3 pl-10 pr-11 text-sm text-white placeholder-slate-600 focus:border-indigo-500/60 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Password strength */}
              {password.length > 0 && (
                <div className="mt-2 space-y-2 animate-fade-in">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${i < passwordStrength ? strengthColors[passwordStrength] : 'bg-slate-800'}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500">
                    Strength: <span className="font-semibold text-slate-300">{strengthLabels[passwordStrength]}</span>
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {[
                      { met: hasMinLength, label: '8–64 chars' },
                      { met: hasUppercase, label: 'Uppercase' },
                      { met: hasLowercase, label: 'Lowercase' },
                      { met: hasDigit, label: 'Number' },
                      { met: hasSpecial, label: 'Special char' },
                    ].map(({ met, label }) => (
                      <div key={label} className={`flex items-center gap-1.5 text-[10px] ${met ? 'text-emerald-400' : 'text-slate-600'}`}>
                        {met ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        {label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Role selector */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: 'STUDENT', label: 'Student', desc: 'Career workspace' },
                  { value: 'ADMIN', label: 'Admin', desc: 'Platform management' },
                ].map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      role === r.value
                        ? 'border-indigo-500/50 bg-indigo-500/10 text-white'
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <p className="text-sm font-semibold">{r.label}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">{r.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 hover:from-indigo-500 hover:to-purple-500 hover:shadow-indigo-500/30 hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Creating Account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
              Sign in
            </Link>
          </p>

          <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-slate-600">
            <Lock className="h-3 w-3" />
            Your data is encrypted and secure
          </div>
        </div>
      </div>
    </div>
  );
}
