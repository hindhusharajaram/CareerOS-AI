import React, { useEffect, useState } from 'react';
import { Target, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { studentService, CareerGoalData } from '../services/studentService';

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
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchGoal();
  }, []);

  const fetchGoal = async () => {
    setIsLoading(true);
    try {
      const data = await studentService.getCareerGoal();
      if (data) setGoal(data);
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to load career goals.' });
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
    setMsg(null);
    try {
      const updated = await studentService.updateCareerGoal(goal);
      setGoal(updated);
      setMsg({ type: 'success', text: 'Career goals saved successfully!' });
    } catch (err) {
      setMsg({ type: 'error', text: 'Failed to update career goals.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-5">
          <div>
            <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <Target className="h-6 w-6 text-purple-400" />
              Career Aspirations & Target Goals
            </h2>
            <p className="text-xs text-slate-400 mt-1">Configure parameters used by our AI matching engine for placement recommendations</p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:from-purple-500 hover:to-indigo-500 transition duration-300 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Goals'}
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
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-4">
              <h3 className="text-lg font-bold text-white mb-4">Job Role & Work Preferences</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Preferred Role</label>
                  <input
                    type="text"
                    name="preferredRole"
                    placeholder="e.g. Software Engineer, Machine Learning Engineer"
                    value={goal.preferredRole || ''}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Preferred Industry / Domain</label>
                  <input
                    type="text"
                    name="preferredDomain"
                    placeholder="e.g. Artificial Intelligence, Fintech, Cloud Computing"
                    value={goal.preferredDomain || ''}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Preferred Location</label>
                  <input
                    type="text"
                    name="preferredLocation"
                    placeholder="e.g. San Francisco, CA or Remote"
                    value={goal.preferredLocation || ''}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Work Mode</label>
                  <select
                    name="workMode"
                    value={goal.workMode || 'HYBRID'}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-white focus:border-purple-500 focus:outline-none"
                  >
                    <option value="REMOTE">Remote</option>
                    <option value="HYBRID">Hybrid</option>
                    <option value="ONSITE">Onsite</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Expected Annual Salary ($ USD)</label>
                  <input
                    type="number"
                    name="expectedSalary"
                    value={goal.expectedSalary || 100000}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="higherStudies"
                    name="higherStudies"
                    checked={!!goal.higherStudies}
                    onChange={handleChange}
                    className="h-5 w-5 rounded border-slate-800 bg-slate-950 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="higherStudies" className="text-sm text-slate-300 font-medium cursor-pointer">
                    Planning for Higher Studies (Master's / Ph.D.)
                  </label>
                </div>
              </div>
            </div>

            {/* Target Companies */}
            <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-4">
              <h3 className="text-lg font-bold text-white mb-4">Target & Dream Companies</h3>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Target Companies (comma separated)</label>
                <input
                  type="text"
                  name="targetCompanies"
                  placeholder="e.g. Google, Microsoft, Apple, NVIDIA, OpenAI"
                  value={goal.targetCompanies || ''}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>
          </form>
        )}
      </div>
    </StudentLayout>
  );
}
