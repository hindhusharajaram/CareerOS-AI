import React, { useEffect, useState } from 'react';
import { GraduationCap, Plus, Trash2, Calendar, Award, Building2, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import StudentLayout from '../layouts/StudentLayout';
import { studentService, EducationItem } from '../services/studentService';
import SectionHeader from '../components/ui/SectionHeader';
import { GlassCard } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonCard } from '../components/ui/Skeleton';

export default function EducationPage(): React.ReactElement {
  const [educationList, setEducationList] = useState<EducationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [startYear, setStartYear] = useState<number>(2022);
  const [endYear, setEndYear] = useState<number>(2026);
  const [cgpa, setCgpa] = useState<number>(3.8);

  useEffect(() => {
    fetchEducation();
  }, []);

  const fetchEducation = async () => {
    setIsLoading(true);
    try {
      const list = await studentService.getEducation();
      setEducationList(list);
    } catch (err) {
      toast.error('Could not fetch education entries.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution || !degree) return;
    setIsAdding(true);
    try {
      const created = await studentService.addEducation({
        institution,
        degree,
        specialization,
        startYear,
        endYear,
        cgpa
      });
      setEducationList((prev) => [created, ...prev]);
      setInstitution('');
      setDegree('');
      setSpecialization('');
      toast.success('Education record added successfully');
    } catch (err) {
      toast.error('Failed to add education entry.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await studentService.deleteEducation(id);
      setEducationList((prev) => prev.filter((e) => e.id !== id));
      toast.success('Education record deleted');
    } catch (err) {
      toast.error('Failed to delete education entry.');
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        <SectionHeader
          title="Academic Education"
          subtitle="Manage your degrees and educational milestones to boost your career score."
          badge="Profile Data"
          icon={<GraduationCap className="h-6 w-6" />}
        />

        {/* Add Form */}
        <GlassCard padding="lg">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Plus className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-lg font-bold text-white">Add Education Entry</h3>
          </div>
          <form onSubmit={handleAdd} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Institution Name</label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stanford University"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:bg-slate-900 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Degree Title</label>
                <div className="relative">
                  <GraduationCap className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. B.Tech, B.S., M.S."
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:bg-slate-900 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Specialization / Major</label>
                <div className="relative">
                  <BookOpen className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="e.g. Computer Science"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:bg-slate-900 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:col-span-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Start Year</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="number"
                      value={startYear}
                      onChange={(e) => setStartYear(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white focus:border-indigo-500 focus:bg-slate-900 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">End Year</label>
                  <div className="relative">
                    <Calendar className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="number"
                      value={endYear}
                      onChange={(e) => setEndYear(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white focus:border-indigo-500 focus:bg-slate-900 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">CGPA (Optional)</label>
                  <div className="relative">
                    <Award className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      type="number"
                      step="0.01"
                      value={cgpa}
                      onChange={(e) => setCgpa(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-3 pl-10 pr-4 text-sm text-white focus:border-indigo-500 focus:bg-slate-900 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3">
              <Button
                type="submit"
                disabled={isAdding || !institution || !degree}
                isLoading={isLoading}
                icon={<Plus className="h-4 w-4" />}
              >
                Save Education
              </Button>
            </div>
          </form>
        </GlassCard>

        {/* List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-indigo-400" />
              Education Timeline
            </h3>
            <Badge variant="indigo">{educationList.length} Entries</Badge>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => <SkeletonCard key={i} className="h-32" />)}
            </div>
          ) : educationList.length === 0 ? (
            <EmptyState
              icon={<GraduationCap />}
              title="No education records added"
              description="Add your university degree above to start building your academic profile."
            />
          ) : (
            <div className="space-y-4 relative">
              <div className="absolute top-8 bottom-8 left-[39px] w-px bg-slate-800/80 -z-10 hidden sm:block" />
              {educationList.map((edu) => (
                <div key={edu.id} className="group relative flex flex-col sm:flex-row items-start gap-4 p-5 sm:p-6 rounded-2xl border border-slate-800/80 bg-slate-900/50 hover:bg-slate-900/80 hover:border-slate-700/80 transition-all duration-300">
                  <div className="flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                    <span className="text-sm font-black leading-none">'{edu.endYear ? edu.endYear.toString().slice(2) : 'Now'}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <h4 className="text-lg font-bold text-white leading-tight">{edu.degree}</h4>
                        <p className="text-sm text-indigo-400 font-semibold mt-1">{edu.institution}</p>
                      </div>
                      <button
                        onClick={() => handleDelete(edu.id)}
                        className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0"
                        title="Delete Record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <p className="text-sm text-slate-300">{edu.specialization}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 mt-4 text-xs font-semibold text-slate-400">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/50">
                        <Calendar className="h-3.5 w-3.5 text-slate-500" />
                        <span>{edu.startYear} - {edu.endYear || 'Present'}</span>
                      </div>
                      {edu.cgpa && (
                        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <Award className="h-3.5 w-3.5" />
                          CGPA: {edu.cgpa}
                        </div>
                      )}
                    </div>
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
