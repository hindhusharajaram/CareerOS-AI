import React, { useEffect, useState } from 'react';
import { Briefcase, Plus, Trash2, Calendar, Building2, AlignLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import StudentLayout from '../layouts/StudentLayout';
import { studentService, ExperienceItem } from '../services/studentService';
import SectionHeader from '../components/ui/SectionHeader';
import { GlassCard } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonCard } from '../components/ui/Skeleton';

export default function ExperiencePage(): React.ReactElement {
  const [experienceList, setExperienceList] = useState<ExperienceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    setIsLoading(true);
    try {
      const list = await studentService.getExperience();
      setExperienceList(list);
    } catch (err) {
      toast.error('Could not fetch experience records.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company || !role) return;
    setIsAdding(true);
    try {
      const created = await studentService.addExperience({
        company,
        role,
        description,
        startDate,
        endDate
      });
      setExperienceList((prev) => [created, ...prev]);
      setCompany('');
      setRole('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      toast.success('Experience record added successfully');
    } catch (err) {
      toast.error('Failed to add experience entry.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await studentService.deleteExperience(id);
      setExperienceList((prev) => prev.filter((e) => e.id !== id));
      toast.success('Experience record deleted');
    } catch (err) {
      toast.error('Failed to delete experience entry.');
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        <SectionHeader
          title="Work Experience"
          subtitle="Track your past internships, part-time jobs, and research experience."
          badge="Profile Data"
          icon={<Briefcase className="h-6 w-6" />}
        />

        {/* Add Form */}
        <GlassCard padding="lg">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400">
              <Plus className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-lg font-bold text-white">Add Experience Record</h3>
          </div>
          
          <form onSubmit={handleAdd} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Company / Organization</label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Google, Startup Inc"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-amber-500 focus:bg-slate-900 focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Role / Position</label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Software Engineer Intern"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-amber-500 focus:bg-slate-900 focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                </div>
              </div>
              
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Description & Responsibilities</label>
                <div className="relative">
                  <AlignLeft className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <textarea
                    rows={3}
                    placeholder="Key contributions, projects delivered, or tools used..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-amber-500 focus:bg-slate-900 focus:ring-1 focus:ring-amber-500 transition-all resize-none"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Start Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="e.g. Jun 2024"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-amber-500 focus:bg-slate-900 focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">End Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="e.g. Aug 2024 or Present"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-amber-500 focus:bg-slate-900 focus:ring-1 focus:ring-amber-500 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <Button
                type="submit"
                disabled={isAdding || !company || !role}
                isLoading={isAdding}
                variant="primary"
                icon={<Plus className="h-4 w-4" />}
                className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 border-none text-white shadow-lg shadow-amber-500/20"
              >
                Save Experience
              </Button>
            </div>
          </form>
        </GlassCard>

        {/* Timeline */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-amber-400" />
              Experience Timeline
            </h3>
            <Badge variant="amber">{experienceList.length} Roles</Badge>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} className="h-32" />)}
            </div>
          ) : experienceList.length === 0 ? (
            <EmptyState
              icon={<Briefcase />}
              title="No experience added yet"
              description="Add your internships or part-time roles to highlight your practical background."
            />
          ) : (
            <div className="space-y-4 relative">
              <div className="absolute top-8 bottom-8 left-[39px] w-px bg-slate-800/80 -z-10 hidden sm:block" />
              
              {experienceList.map((exp) => (
                <div key={exp.id} className="group relative flex flex-col sm:flex-row items-start gap-4 p-5 sm:p-6 rounded-2xl border border-slate-800/80 bg-slate-900/50 hover:bg-slate-900/80 hover:border-slate-700/80 transition-all duration-300">
                  <div className="h-14 w-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0 shadow-sm z-10 hidden sm:flex">
                    <Building2 className="h-6 w-6 text-amber-400" />
                  </div>
                  
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-start justify-between gap-4 mb-1">
                      <div>
                        <h4 className="text-lg font-bold text-white leading-tight">{exp.role}</h4>
                        <p className="text-sm text-amber-400 font-semibold mt-1">{exp.company}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0"
                        title="Delete Record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-1.5 mt-2 mb-3 text-xs font-semibold text-slate-400">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/50">
                        <Calendar className="h-3.5 w-3.5 text-slate-500" />
                        {exp.startDate || 'N/A'} - {exp.endDate || 'Present'}
                      </div>
                    </div>

                    {exp.description && (
                      <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/30 p-3 rounded-xl border border-slate-800/50">
                        {exp.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
