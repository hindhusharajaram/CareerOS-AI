import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, Sparkles, AlertCircle, ArrowLeft, Check, X } from 'lucide-react';
import api from '../api/axios';

export default function RegisterPage(): React.ReactElement {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('STUDENT'); // Default is Student
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Password criteria checks
  const hasMinLength = password.length >= 8 && password.length <= 64;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

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
      const response = await api.post('/api/auth/register', {
        fullName,
        email,
        password,
        role
      });

      const resBody = response.data;
      if (resBody.success) {
        setSuccessMsg('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setServerError(resBody.message || 'Registration failed.');
      }
    } catch (err: any) {
      if (err.response && err.response.data) {
        const errorData = err.response.data;
        if (errorData.data && Array.isArray(errorData.data)) {
          // Validation error list from GlobalExceptionHandler
          const messages = errorData.data.map((err: any) => err.message).join(' ');
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

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background radial glows */}
      <div className="absolute top-[10%] right-[10%] h-[400px] w-[400px] rounded-full bg-indigo-900/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[10%] h-[400px] w-[400px] rounded-full bg-purple-900/10 blur-[100px] pointer-events-none" />

      {/* Back to home */}
      <Link
        to="/"
        className="absolute top-8 left-8 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition duration-200"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-8">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-md shadow-indigo-500/20 mb-4">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-slate-400 font-medium">
            Join CareerOS AI to streamline your placement journeys
          </p>
        </div>

        {/* Card Frame */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8 shadow-xl backdrop-blur-md">
          {validationError && (
            <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-400">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{validationError}</span>
            </div>
          )}

          {serverError && (
            <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-red-500/30 bg-red-500/10 p-3.5 text-sm text-red-400">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-sm text-emerald-400">
              <Check className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <UserIcon className="h-5 w-5" />
                </span>
                <input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/70 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/70 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                Password
              </label>
              <div className="relative mb-3">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/70 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
                  required
                />
              </div>

              {/* Password strength checklist */}
              <div className="rounded-xl border border-slate-800/80 bg-slate-950/30 p-3.5 text-xs text-slate-400 space-y-2">
                <p className="font-semibold text-slate-300 border-b border-slate-900 pb-1 mb-2">Password Requirements:</p>
                <div className="grid grid-cols-2 gap-2">
                  <span className={`flex items-center gap-1.5 ${hasMinLength ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {hasMinLength ? <Check className="h-3.5 w-3.5 shrink-0" /> : <X className="h-3.5 w-3.5 shrink-0" />}
                    8 - 64 Characters
                  </span>
                  <span className={`flex items-center gap-1.5 ${hasUppercase ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {hasUppercase ? <Check className="h-3.5 w-3.5 shrink-0" /> : <X className="h-3.5 w-3.5 shrink-0" />}
                    Uppercase Letter [A-Z]
                  </span>
                  <span className={`flex items-center gap-1.5 ${hasLowercase ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {hasLowercase ? <Check className="h-3.5 w-3.5 shrink-0" /> : <X className="h-3.5 w-3.5 shrink-0" />}
                    Lowercase Letter [a-z]
                  </span>
                  <span className={`flex items-center gap-1.5 ${hasDigit ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {hasDigit ? <Check className="h-3.5 w-3.5 shrink-0" /> : <X className="h-3.5 w-3.5 shrink-0" />}
                    Numerical Digit [0-9]
                  </span>
                  <span className={`flex items-center gap-1.5 ${hasSpecial ? 'text-emerald-400' : 'text-slate-500'}`}>
                    {hasSpecial ? <Check className="h-3.5 w-3.5 shrink-0" /> : <X className="h-3.5 w-3.5 shrink-0" />}
                    Special Character
                  </span>
                </div>
              </div>
            </div>

            {/* Role Selection Tabs */}
            <div>
              <span className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Registering As
              </span>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('STUDENT')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${
                    role === 'STUDENT'
                      ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-md shadow-indigo-500/5'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <span className="text-sm font-bold">Student</span>
                  <span className="text-[10px] opacity-75 mt-0.5">Looking for internships</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole('COMPANY')}
                  className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-300 ${
                    role === 'COMPANY'
                      ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-md shadow-indigo-500/5'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                  }`}
                >
                  <span className="text-sm font-bold">Company Representative</span>
                  <span className="text-[10px] opacity-75 mt-0.5">Recruiting candidate talent</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3.5 text-sm font-semibold text-white shadow-md hover:from-indigo-500 hover:to-purple-500 focus:outline-none hover:shadow-indigo-500/20 transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition duration-200">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
