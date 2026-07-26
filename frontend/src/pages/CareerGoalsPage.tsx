import React, { useEffect, useState } from 'react';
import { Save, Building2, MapPin, DollarSign, Briefcase, GraduationCap, Link2, Target } from 'lucide-react';
import toast from 'react-hot-toast';
import StudentLayout from '../layouts/StudentLayout';
import { studentService, CareerGoalData } from '../services/studentService';
import SectionHeader from '../components/ui/SectionHeader';
import { GlassCard } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { SkeletonCard } from '../components/ui/Skeleton';

export default function CareerGoalsPage(): React.ReactElement {
  const [goal, setGoal] = useState<CareerGoalData>({
    preferredRole: '',
    preferredDomain: '',
    preferredLocation: '',
    expectedSalary: 120000,
    higherStudies: false,
    targetCompanies: '',
    workMode: 'HYBRID'
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchGoal();
  }, []);

  const fetchGoal = async () => {
    setIsLoading(true);
    try {
      const data = await studentService.getCareerGoal();
      if (data) setGoal(data);
    } catch (err) {
      toast.error('Failed to load career goals.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setGoal((prev) => ({ ...prev, [name]: checked }));
    } else {
      setGoal((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const updated = await studentService.updateCareerGoal(goal);
      setGoal(updated);
      toast.success('Career goals saved successfully!');
    } catch (err) {
      toast.error('Failed to update career goals.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-20">
        <SectionHeader
          title="Career Aspirations"
          subtitle="Configure parameters used by our AI engine for matching and recommendations."
          badge="Profile Data"
          icon={<Target className="h-6 w-6" />}
          action={
            <Button
              onClick={handleSubmit}
              isLoading={isSaving}
              variant="primary"
              icon={<Save className="h-4 w-4" />}
            >
              Save Goals
            </Button>
          }
        />

        {isLoading ? (
          <div className="space-y-6">
            <SkeletonCard className="h-[400px]" />
            <SkeletonCard className="h-48" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <GlassCard padding="lg">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">
                  <Briefcase className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-lg font-bold text-white">Job Role & Work Preferences</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Preferred Role</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      name="preferredRole"
                      placeholder="e.g. Software Engineer"
                      value={goal.preferredRole || ''}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-purple-500 focus:bg-slate-900 focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Preferred Industry</label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      name="preferredDomain"
                      placeholder="e.g. AI, Fintech, Cloud"
                      value={goal.preferredDomain || ''}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-purple-500 focus:bg-slate-900 focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Preferred Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="text"
                      name="preferredLocation"
                      placeholder="e.g. San Francisco, CA"
                      value={goal.preferredLocation || ''}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-purple-500 focus:bg-slate-900 focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Work Mode</label>
                  <div className="relative">
                    <Link2 className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500 pointer-events-none" />
                    <select
                      name="workMode"
                      value={goal.workMode || 'HYBRID'}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-10 text-sm text-white focus:border-purple-500 focus:bg-slate-900 focus:ring-1 focus:ring-purple-500 transition-all appearance-none cursor-pointer"
                    >
                      <option value="REMOTE">Remote</option>
                      <option value="HYBRID">Hybrid</option>
                      <option value="ONSITE">Onsite</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                      <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 md:col-span-2 lg:col-span-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Expected Salary ($ USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="number"
                      name="expectedSalary"
                      value={goal.expectedSalary || ''}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white focus:border-purple-500 focus:bg-slate-900 focus:ring-1 focus:ring-purple-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/60 flex items-center gap-4">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="higherStudies"
                    checked={!!goal.higherStudies}
                    onChange={handleChange}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  <span className="ml-3 text-sm font-medium text-slate-300 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-purple-400" /> Planning for Higher Studies
                  </span>
                </label>
              </div>
            </GlassCard>

            {/* Target Companies */}
            <GlassCard padding="lg">
              <div className="flex items-center gap-2 mb-6">
                <div className="h-8 w-8 rounded-lg bg-pink-500/20 flex items-center justify-center text-pink-400">
                  <Target className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-lg font-bold text-white">Target Companies</h3>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Dream Companies (comma separated)</label>
                <div className="relative">
                  <Target className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    name="targetCompanies"
                    placeholder="e.g. Google, Apple, Stripe, Linear"
                    value={goal.targetCompanies || ''}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-pink-500 focus:bg-slate-900 focus:ring-1 focus:ring-pink-500 transition-all"
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2 ml-1">
                  We use these targets to tailor your interview prep and resume scoring.
                </p>
              </div>
            </GlassCard>
          </form>
        )}
      </div>
    </StudentLayout>
  );
}
