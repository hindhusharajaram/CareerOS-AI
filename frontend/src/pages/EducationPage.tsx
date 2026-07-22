import React, { useEffect, useState } from 'react';
import { GraduationCap, Plus, Trash2, Calendar, Award, AlertCircle } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { studentService, EducationItem } from '../services/studentService';

export default function EducationPage(): React.ReactElement {
  const [educationList, setEducationList] = useState<EducationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');

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
    setError('');
    try {
      const list = await studentService.getEducation();
      setEducationList(list);
    } catch (err) {
      setError('Could not fetch education entries.');
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
    } catch (err) {
      setError('Failed to add education entry.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id?: string) => {
    if (!id) return;
    try {
      await studentService.deleteEducation(id);
      setEducationList((prev) => prev.filter((e) => e.id !== id));
    } catch (err) {
      setError('Failed to delete education entry.');
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="border-b border-slate-800 pb-5">
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-indigo-400" />
            Academic Education
          </h2>
          <p className="text-xs text-slate-400 mt-1">Manage your academic degrees and educational milestones</p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Add Form */}
        <form onSubmit={handleAdd} className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Plus className="h-5 w-5 text-indigo-400" />
            Add Education Entry
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Institution Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Stanford University"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Degree Title</label>
              <input
                type="text"
                required
                placeholder="e.g. B.Tech, B.S., M.S."
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Specialization / Major</label>
              <input
                type="text"
                placeholder="e.g. Computer Science & AI"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Start Year</label>
                <input
                  type="number"
                  value={startYear}
                  onChange={(e) => setStartYear(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">End Year</label>
                <input
                  type="number"
                  value={endYear}
                  onChange={(e) => setEndYear(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">CGPA</label>
                <input
                  type="number"
                  step="0.1"
                  value={cgpa}
                  onChange={(e) => setCgpa(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isAdding}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:from-indigo-500 hover:to-purple-500 transition duration-300 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              {isAdding ? 'Saving...' : 'Add Education'}
            </button>
          </div>
        </form>

        {/* List */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">Education Timeline</h3>
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
            </div>
          ) : educationList.length === 0 ? (
            <div className="py-12 text-center text-slate-500 bg-slate-900/30 rounded-3xl border border-slate-800">
              <GraduationCap className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No education records added yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {educationList.map((edu) => (
                <div key={edu.id} className="flex items-start justify-between p-6 rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-md">
                  <div>
                    <h4 className="text-lg font-bold text-white">{edu.degree}</h4>
                    <p className="text-sm text-indigo-400 font-medium">{edu.institution}</p>
                    <p className="text-xs text-slate-400 mt-1">{edu.specialization}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {edu.startYear} - {edu.endYear || 'Present'}</span>
                      {edu.cgpa && <span className="flex items-center gap-1"><Award className="h-3.5 w-3.5" /> CGPA: {edu.cgpa}</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(edu.id)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
}
