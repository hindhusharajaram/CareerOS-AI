import React, { useEffect, useState } from 'react';
import { Save, Sparkles, User, Camera, Mail, Phone, MapPin, GraduationCap, Link as LinkIcon, Building2, Calendar, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import StudentLayout from '../layouts/StudentLayout';
import { studentService, StudentProfileData } from '../services/studentService';
import SectionHeader from '../components/ui/SectionHeader';
import { GlassCard } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { SkeletonCard } from '../components/ui/Skeleton';

export default function ProfilePage(): React.ReactElement {
  const [profile, setProfile] = useState<StudentProfileData>({});
  const [isLoading, setIsLoading] = useState(true);
  

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const data = await studentService.getProfile();
      setProfile(data);
    } catch (err) {
      toast.error('Failed to load profile details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    
    try {
      await studentService.updateProfile(profile);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        <SectionHeader
          title="Student Profile"
          subtitle="Manage your personal information, academic details, and portfolio links."
          badge="Settings"
          icon={<User className="h-6 w-6" />}
          action={
            <Button
              onClick={handleSubmit}
              isLoading={isLoading}
              icon={<Save className="h-4 w-4" />}
            >
              Save Changes
            </Button>
          }
        />

        {isLoading ? (
          <div className="space-y-6">
            <SkeletonCard className="h-32" />
            <SkeletonCard className="h-64" />
            <SkeletonCard className="h-64" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Avatar & Hero Section */}
            <GlassCard padding="lg" className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group shrink-0">
                <div className="h-28 w-28 rounded-3xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-4xl font-black text-white shadow-xl shadow-indigo-500/20">
                  {profile.fullName?.charAt(0) || 'S'}
                </div>
                <div className="absolute inset-0 bg-black/50 rounded-3xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-sm">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="text-center sm:text-left flex-1 min-w-0">
                <h3 className="text-2xl font-black text-white truncate">{profile.fullName || 'Student Name'}</h3>
                <p className="text-sm text-slate-400 mt-1 flex items-center justify-center sm:justify-start gap-1.5 truncate">
                  <Mail className="h-4 w-4" /> {profile.email}
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 text-xs font-semibold text-indigo-400">
                  <Sparkles className="h-3.5 w-3.5" /> Photo Upload Ready
                </div>
              </div>
            </GlassCard>

            {/* Personal Information */}
            <GlassCard padding="lg">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <User className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-lg font-bold text-white">Personal Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">First Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      name="firstName"
                      value={profile.firstName || ''}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:bg-slate-900 focus:ring-1 focus:ring-indigo-500 transition-all"
                      placeholder="Jane"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Last Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      name="lastName"
                      value={profile.lastName || ''}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:bg-slate-900 focus:ring-1 focus:ring-indigo-500 transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      name="phone"
                      value={profile.phone || ''}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:bg-slate-900 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Gender</label>
                  <select
                    name="gender"
                    value={profile.gender || ''}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 px-4 text-sm text-white focus:border-indigo-500 focus:bg-slate-900 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">City</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      name="city"
                      value={profile.city || ''}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:bg-slate-900 focus:ring-1 focus:ring-indigo-500 transition-all"
                      placeholder="San Francisco"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Country</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      name="country"
                      value={profile.country || ''}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:bg-slate-900 focus:ring-1 focus:ring-indigo-500 transition-all"
                      placeholder="United States"
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">About / Bio</label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <textarea
                    name="about"
                    rows={4}
                    value={profile.about || ''}
                    onChange={handleChange}
                    placeholder="Tell us about yourself and your career passions..."
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:bg-slate-900 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                  />
                </div>
              </div>
            </GlassCard>

            {/* Academic Information */}
            <GlassCard padding="lg">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <GraduationCap className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-lg font-bold text-white">Academic Details</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">University Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      name="universityName"
                      value={profile.universityName || ''}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:bg-slate-900 focus:ring-1 focus:ring-emerald-500 transition-all"
                      placeholder="Stanford University"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Degree</label>
                  <div className="relative">
                    <GraduationCap className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      name="degree"
                      placeholder="B.S. Computer Science"
                      value={profile.degree || ''}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:bg-slate-900 focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Major / Branch</label>
                  <div className="relative">
                    <FileText className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      name="major"
                      value={profile.major || ''}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:bg-slate-900 focus:ring-1 focus:ring-emerald-500 transition-all"
                      placeholder="Computer Science"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Graduation Year</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="number"
                      name="graduationYear"
                      value={profile.graduationYear || 2026}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-emerald-500 focus:bg-slate-900 focus:ring-1 focus:ring-emerald-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Social & Portfolio Links */}
            <GlassCard padding="lg">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-8 rounded-lg bg-sky-500/20 flex items-center justify-center text-sky-400">
                  <LinkIcon className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-lg font-bold text-white">Social & Portfolio URLs</h3>
              </div>
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">LinkedIn URL</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 bg-slate-800/50 border-r border-slate-800 rounded-l-xl">
                      <svg className="h-4 w-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    </div>
                    <input
                      type="url"
                      name="linkedin"
                      placeholder="https://linkedin.com/in/username"
                      value={profile.linkedin || ''}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-16 pr-4 text-sm text-white placeholder-slate-600 focus:border-sky-500 focus:bg-slate-900 focus:ring-1 focus:ring-sky-500 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">GitHub URL</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 bg-slate-800/50 border-r border-slate-800 rounded-l-xl">
                      <svg className="h-4 w-4 text-slate-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    </div>
                    <input
                      type="url"
                      name="github"
                      placeholder="https://github.com/username"
                      value={profile.github || ''}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-16 pr-4 text-sm text-white placeholder-slate-600 focus:border-sky-500 focus:bg-slate-900 focus:ring-1 focus:ring-sky-500 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Portfolio URL</label>
                  <div className="relative flex items-center">
                    <div className="absolute left-0 top-0 bottom-0 flex items-center justify-center w-12 bg-slate-800/50 border-r border-slate-800 rounded-l-xl">
                      <LinkIcon className="h-4 w-4 text-slate-400" />
                    </div>
                    <input
                      type="url"
                      name="portfolio"
                      placeholder="https://myportfolio.com"
                      value={profile.portfolio || ''}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-16 pr-4 text-sm text-white placeholder-slate-600 focus:border-sky-500 focus:bg-slate-900 focus:ring-1 focus:ring-sky-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </GlassCard>
          </form>
        )}
      </div>
    </StudentLayout>
  );
}
