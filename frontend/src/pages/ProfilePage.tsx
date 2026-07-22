import React, { useEffect, useState } from 'react';
import { Save, Sparkles, CheckCircle2, AlertCircle, Camera } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { studentService, StudentProfileData } from '../services/studentService';

export default function ProfilePage(): React.ReactElement {
  const [profile, setProfile] = useState<StudentProfileData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const data = await studentService.getProfile();
      setProfile(data);
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to load profile details.' });
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
    setIsSaving(true);
    setMsg(null);
    try {
      const updated = await studentService.updateProfile(profile);
      setProfile(updated);
      setMsg({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to save profile changes.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div>
            <h2 className="text-2xl font-extrabold text-white">Student Profile Settings</h2>
            <p className="text-xs text-slate-400 mt-1">Manage your personal, academic, and social link details</p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:from-indigo-500 hover:to-purple-500 transition duration-300 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        {msg && (
          <div className={`p-4 rounded-xl border flex items-center gap-3 text-sm ${
            msg.type === 'success' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : 'border-red-500/30 bg-red-500/10 text-red-400'
          }`}>
            {msg.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span>{msg.text}</span>
          </div>
        )}

        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Avatar & Hero Section */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md flex items-center gap-6">
              <div className="relative group">
                <div className="h-24 w-24 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-indigo-500/20">
                  {profile.fullName?.charAt(0) || 'S'}
                </div>
                <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
                  <Camera className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">{profile.fullName || 'Student'}</h3>
                <p className="text-xs text-slate-400 mt-1">{profile.email}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs text-indigo-300">
                  <Sparkles className="h-3.5 w-3.5" /> Photo Upload Placeholder Ready
                </div>
              </div>
            </div>

            {/* Personal Information */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-4">
              <h3 className="text-lg font-bold text-white mb-4">Personal Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={profile.firstName || ''}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={profile.lastName || ''}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={profile.phone || ''}
                    onChange={handleChange}
                    placeholder="+1234567890"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={profile.gender || ''}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    value={profile.city || ''}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Country</label>
                  <input
                    type="text"
                    name="country"
                    value={profile.country || ''}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">About / Bio</label>
                <textarea
                  name="about"
                  rows={3}
                  value={profile.about || ''}
                  onChange={handleChange}
                  placeholder="Tell us about yourself and your career passions..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Academic Information */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-4">
              <h3 className="text-lg font-bold text-white mb-4">Academic Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">University Name</label>
                  <input
                    type="text"
                    name="universityName"
                    value={profile.universityName || ''}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Degree</label>
                  <input
                    type="text"
                    name="degree"
                    placeholder="B.Tech, M.S."
                    value={profile.degree || ''}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Major / Branch</label>
                  <input
                    type="text"
                    name="major"
                    value={profile.major || ''}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Graduation Year</label>
                  <input
                    type="number"
                    name="graduationYear"
                    value={profile.graduationYear || 2026}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Social & Portfolio Links */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-4">
              <h3 className="text-lg font-bold text-white mb-4">Social & Portfolio URLs</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">LinkedIn URL</label>
                  <input
                    type="url"
                    name="linkedin"
                    placeholder="https://linkedin.com/in/username"
                    value={profile.linkedin || ''}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">GitHub URL</label>
                  <input
                    type="url"
                    name="github"
                    placeholder="https://github.com/username"
                    value={profile.github || ''}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Portfolio URL</label>
                  <input
                    type="url"
                    name="portfolio"
                    placeholder="https://myportfolio.com"
                    value={profile.portfolio || ''}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </StudentLayout>
  );
}
