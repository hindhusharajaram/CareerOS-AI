import React, { useEffect, useState } from 'react';
import {
  User,
  Save,
  Sparkles,
  Camera,
  Mail,
  GraduationCap,
  Link as LinkIcon,
  Lock,
  ShieldCheck,
  Cpu,
  Layers,
  Bot,
  Tag,
  X,
  Plus,
  CheckCircle2,
  RefreshCw,
  Zap,
  Key,
  Shield,
  Laptop
} from 'lucide-react';
import toast from 'react-hot-toast';
import StudentLayout from '../layouts/StudentLayout';
import { studentService, StudentProfileData } from '../services/studentService';
import SectionHeader from '../components/ui/SectionHeader';
import { SkeletonCard } from '../components/ui/Skeleton';

import { scoreService, CareerScoreData } from '../services/scoreService';

type TabType = 'profile' | 'career' | 'security' | 'integrations';

export default function ProfilePage(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [scoreData, setScoreData] = useState<CareerScoreData | null>(null);
  const [profile, setProfile] = useState<StudentProfileData>({
    firstName: 'Hindhusha',
    lastName: 'P R',
    fullName: 'Hindhusha P R',
    email: 'hindhusha@careeros.ai',
    phone: '+91 98765 43210',
    gender: 'Female',
    city: 'San Francisco',
    country: 'United States',
    universityName: 'Stanford University',
    degree: 'B.S. Computer Science',
    major: 'Software Engineering',
    graduationYear: 2026,
    about: 'Passionate full-stack & AI software engineer building cloud-native platforms with Java, Spring Boot, React, and PostgreSQL.',
    linkedin: 'https://linkedin.com/in/hindhushapr',
    github: 'https://github.com/hindhusharajaram',
    portfolio: 'https://hindhushapr.dev'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Career & AI Preferences State
  const [aiModel, setAiModel] = useState('Groq Llama 3.3 70B (Recommended)');
  const [careerFocus, setCareerFocus] = useState('Full-Stack Software Engineering');
  const [targetGraduation, setTargetGraduation] = useState('2026');
  const [skillTags, setSkillTags] = useState<string[]>(['Java', 'Spring Boot', 'React', 'PostgreSQL', 'Docker']);
  const [newSkillInput, setNewSkillInput] = useState('');

  // Security State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Integrations State
  const [githubConnected, setGithubConnected] = useState(true);
  const [linkedinConnected, setLinkedinConnected] = useState(true);
  const [unstopConnected, setUnstopConnected] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const [data, score] = await Promise.all([
        studentService.getProfile().catch(() => null),
        scoreService.getCareerScore().catch(() => null),
      ]);
      if (data && Object.keys(data).length > 0) {
        setProfile((prev) => ({ ...prev, ...data }));
      }
      if (score) {
        setScoreData(score);
      }
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

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setIsSaving(true);
    try {
      const payload: StudentProfileData = {
        ...profile,
        aiModelPreference: aiModel,
        primaryCareerFocus: careerFocus,
        atsSkills: skillTags,
      };
      await studentService.updateProfile(payload);
      const updatedScore = await scoreService.getCareerScore().catch(() => null);
      if (updatedScore) setScoreData(updatedScore);
      toast.success('Settings and profile updated successfully!');
    } catch (error: any) {
      const serverMessage = error?.response?.data?.message || error?.message || 'Failed to update profile';
      toast.error(serverMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddSkill = (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = newSkillInput.trim();
    if (trimmed && !skillTags.includes(trimmed)) {
      setSkillTags((prev) => [...prev, trimmed]);
      setNewSkillInput('');
      toast.success(`Added ${trimmed} to ATS Skill Tags`);
    }
  };

  const handleRemoveSkill = (tagToRemove: string) => {
    setSkillTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Please enter your current password.');
      return;
    }
    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match.');
      return;
    }
    toast.success('Security password updated successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        <SectionHeader
          title="Account Settings"
          subtitle="Manage your personal information, career preferences, security, and integrations."
          badge="Obsidian Settings"
          icon={<User className="h-6 w-6 text-emerald-500" />}
          action={
            <button
              onClick={() => handleSubmit()}
              disabled={isSaving || isLoading}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </button>
          }
        />

        {isLoading ? (
          <div className="space-y-6">
            <SkeletonCard className="h-40" />
            <SkeletonCard className="h-64" />
          </div>
        ) : (
          <>
            {/* Header Banner */}
            <div className="bg-surface-card border border-surface-border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                {/* Avatar with custom ring */}
                <div className="relative group shrink-0">
                  <div className="h-20 w-20 rounded-full bg-surface-base border-2 border-emerald-500/50 flex items-center justify-center text-2xl font-bold text-emerald-500 shadow-md">
                    {profile.firstName?.charAt(0) || profile.fullName?.charAt(0) || 'H'}
                    {profile.lastName?.charAt(0) || ''}
                  </div>
                  <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer backdrop-blur-sm">
                    <Camera className="h-6 w-6 text-emerald-400" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-content-primary font-bold text-xl">
                      {profile.fullName || `${profile.firstName || 'Hindhusha'} ${profile.lastName || 'P R'}`}
                    </h2>
                    <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3" />
                      STUDENT WORKSPACE
                    </span>
                  </div>
                  <p className="text-xs text-content-secondary flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-content-muted" /> {profile.email || 'hindhusha@careeros.ai'}
                  </p>
                  <p className="text-xs text-content-muted">
                    {profile.universityName || 'Stanford University'} • Class of {profile.graduationYear || 2026}
                  </p>
                </div>
              </div>

              {/* Profile Strength & ATS Meter */}
              <div className="w-full md:w-64 bg-surface-base border border-surface-border rounded-xl p-4 space-y-2 shrink-0">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-content-secondary flex items-center gap-1.5">
                    <Zap className="h-3.5 w-3.5 text-[#2E4CFF]" /> ATS Readiness
                  </span>
                  <span className="font-extrabold text-[#2E4CFF]">
                    {scoreData ? `${scoreData.atsReadinessPercentage}% ATS Ready` : '0% ATS Ready'}
                  </span>
                </div>
                <div className="h-2 w-full bg-surface-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2E4CFF] rounded-full transition-all duration-500"
                    style={{ width: `${scoreData ? scoreData.atsReadinessPercentage : 0}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[10px] text-content-muted pt-1">
                  <span>Profile: {scoreData ? scoreData.profileCompletenessPercentage : 0}%</span>
                  <span>Score: {scoreData ? scoreData.overallScore : 0}/1000</span>
                </div>
              </div>
            </div>

            {/* Tab Navigation Bar */}
            <div className="border-b border-surface-border flex gap-8 text-sm font-medium overflow-x-auto scrollable">
              <button
                onClick={() => setActiveTab('profile')}
                className={`pb-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'profile'
                    ? 'border-emerald-500 text-emerald-500 font-medium'
                    : 'border-transparent text-content-secondary hover:text-content-primary'
                }`}
              >
                <User className="h-4 w-4" />
                Profile Details
              </button>

              <button
                onClick={() => setActiveTab('career')}
                className={`pb-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'career'
                    ? 'border-emerald-500 text-emerald-500 font-medium'
                    : 'border-transparent text-content-secondary hover:text-content-primary'
                }`}
              >
                <Cpu className="h-4 w-4" />
                Career & AI Preferences
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`pb-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'security'
                    ? 'border-emerald-500 text-emerald-500 font-medium'
                    : 'border-transparent text-content-secondary hover:text-content-primary'
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                Security & Sessions
              </button>

              <button
                onClick={() => setActiveTab('integrations')}
                className={`pb-3 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
                  activeTab === 'integrations'
                    ? 'border-emerald-500 text-emerald-500 font-medium'
                    : 'border-transparent text-content-secondary hover:text-content-primary'
                }`}
              >
                <Layers className="h-4 w-4" />
                Integrations
              </button>
            </div>

            {/* TAB 1: PROFILE DETAILS */}
            {activeTab === 'profile' && (
              <form onSubmit={handleSubmit} className="space-y-6 animate-fade-up">
                {/* Personal Information Card */}
                <div className="bg-surface-card border border-surface-border rounded-xl p-6 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-surface-border">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                      <User className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-content-primary">Personal Details</h3>
                      <p className="text-xs text-content-muted">Your identity and contact details across the platform.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-content-secondary">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={profile.firstName || ''}
                        onChange={handleChange}
                        className="bg-surface-base border border-surface-border text-content-primary rounded-lg px-4 py-2.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm w-full transition-all"
                        placeholder="Hindhusha"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-content-secondary">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={profile.lastName || ''}
                        onChange={handleChange}
                        className="bg-surface-base border border-surface-border text-content-primary rounded-lg px-4 py-2.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm w-full transition-all"
                        placeholder="P R"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-content-secondary">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={profile.email || ''}
                        onChange={handleChange}
                        className="bg-surface-base border border-surface-border text-content-primary rounded-lg px-4 py-2.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm w-full transition-all"
                        placeholder="hindhusha@careeros.ai"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-content-secondary">Phone Number</label>
                      <input
                        type="text"
                        name="phone"
                        value={profile.phone || ''}
                        onChange={handleChange}
                        className="bg-surface-base border border-surface-border text-content-primary rounded-lg px-4 py-2.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm w-full transition-all"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-content-secondary">Gender</label>
                      <select
                        name="gender"
                        value={profile.gender || ''}
                        onChange={handleChange}
                        className="bg-surface-base border border-surface-border text-content-primary rounded-lg px-4 py-2.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm w-full transition-all"
                      >
                        <option value="">Select Gender</option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Non-binary">Non-binary</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-content-secondary">City & Country</label>
                      <input
                        type="text"
                        name="city"
                        value={profile.city || ''}
                        onChange={handleChange}
                        className="bg-surface-base border border-surface-border text-content-primary rounded-lg px-4 py-2.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm w-full transition-all"
                        placeholder="San Francisco, USA"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-content-secondary">Professional Bio</label>
                    <textarea
                      name="about"
                      rows={3}
                      value={profile.about || ''}
                      onChange={handleChange}
                      placeholder="Summary of your technical expertise, career ambitions, and project highlights..."
                      className="bg-surface-base border border-surface-border text-content-primary rounded-lg px-4 py-2.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm w-full transition-all resize-none"
                    />
                  </div>
                </div>

                {/* Academic Information Card */}
                <div className="bg-surface-card border border-surface-border rounded-xl p-6 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-surface-border">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                      <GraduationCap className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-content-primary">Academic Background</h3>
                      <p className="text-xs text-content-muted">University program, major, and graduation roadmap.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-content-secondary">University Name</label>
                      <input
                        type="text"
                        name="universityName"
                        value={profile.universityName || ''}
                        onChange={handleChange}
                        className="bg-surface-base border border-surface-border text-content-primary rounded-lg px-4 py-2.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm w-full transition-all"
                        placeholder="Stanford University"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-content-secondary">Degree</label>
                      <input
                        type="text"
                        name="degree"
                        value={profile.degree || ''}
                        onChange={handleChange}
                        className="bg-surface-base border border-surface-border text-content-primary rounded-lg px-4 py-2.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm w-full transition-all"
                        placeholder="B.S. Computer Science"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-content-secondary">Major / Branch</label>
                      <input
                        type="text"
                        name="major"
                        value={profile.major || ''}
                        onChange={handleChange}
                        className="bg-surface-base border border-surface-border text-content-primary rounded-lg px-4 py-2.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm w-full transition-all"
                        placeholder="Software Engineering"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-content-secondary">Graduation Year</label>
                      <input
                        type="number"
                        name="graduationYear"
                        value={profile.graduationYear || 2026}
                        onChange={handleChange}
                        className="bg-surface-base border border-surface-border text-content-primary rounded-lg px-4 py-2.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm w-full transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Portfolio Links Card */}
                <div className="bg-surface-card border border-surface-border rounded-xl p-6 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-surface-border">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                      <LinkIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-content-primary">Social & Portfolio URLs</h3>
                      <p className="text-xs text-content-muted">External profiles scanned by CareerOS ATS Engine.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-content-secondary">LinkedIn Profile</label>
                      <input
                        type="url"
                        name="linkedin"
                        value={profile.linkedin || ''}
                        onChange={handleChange}
                        className="bg-surface-base border border-surface-border text-content-primary rounded-lg px-4 py-2.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm w-full transition-all"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-content-secondary">GitHub Profile</label>
                      <input
                        type="url"
                        name="github"
                        value={profile.github || ''}
                        onChange={handleChange}
                        className="bg-surface-base border border-surface-border text-content-primary rounded-lg px-4 py-2.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm w-full transition-all"
                        placeholder="https://github.com/username"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-content-secondary">Personal Website / Portfolio</label>
                      <input
                        type="url"
                        name="portfolio"
                        value={profile.portfolio || ''}
                        onChange={handleChange}
                        className="bg-surface-base border border-surface-border text-content-primary rounded-lg px-4 py-2.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm w-full transition-all"
                        placeholder="https://myportfolio.dev"
                      />
                    </div>
                  </div>
                </div>
              </form>
            )}

            {/* TAB 2: CAREER & AI PREFERENCES */}
            {activeTab === 'career' && (
              <div className="space-y-6 animate-fade-up">
                <div className="bg-surface-card border border-surface-border rounded-xl p-6 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-surface-border">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-content-primary">AI Copilot Tuning</h3>
                      <p className="text-xs text-content-muted">Configure default LLM engine and prompt grounding settings.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-content-secondary">Default AI Model Selector</label>
                      <select
                        value={aiModel}
                        onChange={(e) => setAiModel(e.target.value)}
                        className="bg-surface-base border border-surface-border text-content-primary rounded-lg px-4 py-2.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm w-full transition-all"
                      >
                        <option value="Groq Llama 3.3 70B (Recommended)">Groq Llama 3.3 70B (Recommended)</option>
                        <option value="Groq Llama 3.1 8B (Speed Mode)">Groq Llama 3.1 8B (Speed Mode)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-content-secondary">Primary Career Focus</label>
                      <select
                        value={careerFocus}
                        onChange={(e) => setCareerFocus(e.target.value)}
                        className="bg-surface-base border border-surface-border text-content-primary rounded-lg px-4 py-2.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm w-full transition-all"
                      >
                        <option value="Full-Stack Software Engineering">Full-Stack Software Engineering</option>
                        <option value="AI/ML Systems">AI/ML Systems</option>
                        <option value="DevOps & Cloud Architect">DevOps & Cloud Architect</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-content-secondary">Target Graduation Year</label>
                      <select
                        value={targetGraduation}
                        onChange={(e) => setTargetGraduation(e.target.value)}
                        className="bg-surface-base border border-surface-border text-content-primary rounded-lg px-4 py-2.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm w-full transition-all"
                      >
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                        <option value="2028">2028</option>
                      </select>
                    </div>
                  </div>

                  {/* Interactive ATS Skill Tag Input */}
                  <div className="space-y-3 pt-2">
                    <label className="text-xs font-semibold text-content-secondary flex items-center gap-1.5">
                      <Tag className="h-3.5 w-3.5 text-emerald-500" />
                      ATS Key Skill Tags (Scanned by Career OS Intelligence Engine)
                    </label>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {skillTags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(tag)}
                            className="hover:text-red-400 text-emerald-500 transition-colors"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </span>
                      ))}
                    </div>

                    <form onSubmit={handleAddSkill} className="flex gap-2 max-w-md">
                      <input
                        type="text"
                        placeholder="Add a core skill tag (e.g., Docker, Kubernetes)..."
                        value={newSkillInput}
                        onChange={(e) => setNewSkillInput(e.target.value)}
                        className="bg-surface-base border border-surface-border text-content-primary rounded-lg px-4 py-2 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm flex-1 transition-all"
                      />
                      <button
                        type="submit"
                        disabled={!newSkillInput.trim()}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-4 py-2 rounded-lg text-sm transition-all disabled:opacity-50 flex items-center gap-1 shrink-0"
                      >
                        <Plus className="h-4 w-4" /> Add
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: SECURITY & SESSIONS */}
            {activeTab === 'security' && (
              <div className="space-y-6 animate-fade-up">
                {/* Password Update Card */}
                <div className="bg-surface-card border border-surface-border rounded-xl p-6 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-surface-border">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                      <Lock className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-content-primary">Update Password</h3>
                      <p className="text-xs text-content-muted">Ensure your account is using a strong security password.</p>
                    </div>
                  </div>

                  <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-content-secondary">Current Password</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="bg-surface-base border border-surface-border text-content-primary rounded-lg px-4 py-2.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm w-full transition-all"
                        placeholder="••••••••••••"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-content-secondary">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="bg-surface-base border border-surface-border text-content-primary rounded-lg px-4 py-2.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm w-full transition-all"
                        placeholder="At least 8 characters"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-content-secondary">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="bg-surface-base border border-surface-border text-content-primary rounded-lg px-4 py-2.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm w-full transition-all"
                        placeholder="Repeat new password"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-5 py-2.5 rounded-xl text-sm transition-all shadow-sm flex items-center gap-2"
                    >
                      <Key className="h-4 w-4" />
                      Update Password
                    </button>
                  </form>
                </div>

                {/* Active Sessions Card */}
                <div className="bg-surface-card border border-surface-border rounded-xl p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-surface-border">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                        <Shield className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-content-primary">JWT Active Sessions</h3>
                        <p className="text-xs text-content-muted">Devices and locations currently logged into your account.</p>
                      </div>
                    </div>
                    <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs px-2.5 py-1 rounded-full font-semibold">
                      1 Session Active
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-surface-base border border-surface-border rounded-xl">
                    <div className="flex items-center gap-3">
                      <Laptop className="h-5 w-5 text-emerald-500" />
                      <div>
                        <p className="text-sm font-semibold text-content-primary">Current Web Session (Windows / Chrome)</p>
                        <p className="text-xs text-content-muted">IP: 127.0.0.1 • Active Token Expiration in 24 Hours</p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
                      ACTIVE
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: INTEGRATIONS */}
            {activeTab === 'integrations' && (
              <div className="space-y-6 animate-fade-up">
                <div className="bg-surface-card border border-surface-border rounded-xl p-6 shadow-sm space-y-6">
                  <div className="flex items-center gap-3 pb-4 border-b border-surface-border">
                    <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500">
                      <Layers className="h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-content-primary">Connected Developer Platforms</h3>
                      <p className="text-xs text-content-muted">Sync external repositories, credentials, and competitive programming data.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* GitHub */}
                    <div className="p-5 bg-surface-base border border-surface-border rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center text-white font-bold">
                          GH
                        </div>
                        <div>
                          <p className="text-sm font-bold text-content-primary">GitHub Sync</p>
                          <p className="text-xs text-emerald-500 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Connected as @hindhusharajaram
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setGithubConnected(!githubConnected)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                          githubConnected
                            ? 'bg-surface-card text-content-secondary border-surface-border hover:text-content-primary'
                            : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-500'
                        }`}
                      >
                        {githubConnected ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>

                    {/* LinkedIn */}
                    <div className="p-5 bg-surface-base border border-surface-border rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-sky-600 flex items-center justify-center text-white font-bold">
                          IN
                        </div>
                        <div>
                          <p className="text-sm font-bold text-content-primary">LinkedIn Profile</p>
                          <p className="text-xs text-emerald-500 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Verified & Connected
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setLinkedinConnected(!linkedinConnected)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                          linkedinConnected
                            ? 'bg-surface-card text-content-secondary border-surface-border hover:text-content-primary'
                            : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-500'
                        }`}
                      >
                        {linkedinConnected ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>

                    {/* LeetCode Sync */}
                    <div className="p-5 bg-surface-base border border-surface-border rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-amber-600 flex items-center justify-center text-white font-bold">
                          LC
                        </div>
                        <div>
                          <p className="text-sm font-bold text-content-primary">LeetCode Metrics</p>
                          <p className="text-xs text-emerald-500 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> 250+ Solved • Synced
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => toast.success('LeetCode statistics refreshed!')}
                        className="text-xs px-3 py-1.5 rounded-lg bg-surface-card text-content-secondary border border-surface-border hover:text-content-primary font-medium transition-all flex items-center gap-1"
                      >
                        <RefreshCw className="h-3 w-3" /> Sync
                      </button>
                    </div>

                    {/* Unstop Sync */}
                    <div className="p-5 bg-surface-base border border-surface-border rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-teal-600 flex items-center justify-center text-white font-bold">
                          UN
                        </div>
                        <div>
                          <p className="text-sm font-bold text-content-primary">Unstop Campus Verification</p>
                          <p className="text-xs text-emerald-500 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" /> Verified Student Status
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setUnstopConnected(!unstopConnected)}
                        className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                          unstopConnected
                            ? 'bg-surface-card text-content-secondary border-surface-border hover:text-content-primary'
                            : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-500'
                        }`}
                      >
                        {unstopConnected ? 'Connected' : 'Verify'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </StudentLayout>
  );
}
