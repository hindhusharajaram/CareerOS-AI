import React, { useEffect, useState } from 'react';
import { Cpu, Plus, Trash2, Search, AlertCircle } from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { studentService, StudentSkillItem, SkillItem } from '../services/studentService';

export default function SkillsPage(): React.ReactElement {
  const [studentSkills, setStudentSkills] = useState<StudentSkillItem[]>([]);
  const [availableSkills, setAvailableSkills] = useState<SkillItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [customSkillName, setCustomSkillName] = useState('');
  const [proficiency, setProficiency] = useState('INTERMEDIATE');
  const [yearsExp] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [userSkills, allSkills] = await Promise.all([
        studentService.getStudentSkills(),
        studentService.getAvailableSkills()
      ]);
      setStudentSkills(userSkills);
      setAvailableSkills(allSkills);
    } catch (err) {
      setError('Could not fetch skills list.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkill = async (skillName: string, category = 'General') => {
    if (!skillName.trim()) return;
    setIsAdding(true);
    setError('');
    try {
      const newSkill = await studentService.addStudentSkill(skillName.trim(), proficiency, category, yearsExp);
      setStudentSkills((prev) => [...prev.filter((s) => s.skillId !== newSkill.skillId), newSkill]);
      setCustomSkillName('');
      setSearchQuery('');
    } catch (err) {
      setError('Failed to add skill.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveSkill = async (skillId: string) => {
    try {
      await studentService.removeStudentSkill(skillId);
      setStudentSkills((prev) => prev.filter((s) => s.skillId !== skillId));
    } catch (err) {
      setError('Failed to remove skill.');
    }
  };

  const filteredAvailableSkills = availableSkills.filter((s) =>
    s.skillName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b border-slate-800 pb-5">
          <h2 className="text-2xl font-extrabold text-white flex items-center gap-2">
            <Cpu className="h-6 w-6 text-indigo-400" />
            Skills & Technical Competencies
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Build your skill matrix for automated AI matching and resume verification
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Add Skill Form & Search */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Plus className="h-5 w-5 text-indigo-400" />
            Add New Skill
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Skill Name</label>
              <div className="relative">
                <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="e.g. React, Python, Spring Boot, Machine Learning..."
                  value={customSkillName || searchQuery}
                  onChange={(e) => {
                    setCustomSkillName(e.target.value);
                    setSearchQuery(e.target.value);
                  }}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/70 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Proficiency Level</label>
              <select
                value={proficiency}
                onChange={(e) => setProficiency(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-sm text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
                <option value="EXPERT">Expert</option>
              </select>
            </div>
          </div>

          {/* Quick Skill Chips to add */}
          {searchQuery && filteredAvailableSkills.length > 0 && (
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
              <p className="text-xs text-slate-400">Available Suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {filteredAvailableSkills.map((sk) => (
                  <button
                    key={sk.id}
                    onClick={() => handleAddSkill(sk.skillName, sk.category)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-xs font-medium text-slate-200 hover:border-indigo-500 hover:text-white transition"
                  >
                    <Plus className="h-3.5 w-3.5 text-indigo-400" />
                    {sk.skillName} <span className="text-[10px] text-slate-500">({sk.category})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={() => handleAddSkill(customSkillName || searchQuery)}
              disabled={isAdding || !(customSkillName || searchQuery).trim()}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:from-indigo-500 hover:to-purple-500 transition duration-300 disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              {isAdding ? 'Adding...' : 'Add Skill'}
            </button>
          </div>
        </div>

        {/* Current Skills List */}
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">Your Skill Matrix ({studentSkills.length})</h3>
          </div>

          {isLoading ? (
            <div className="py-12 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
            </div>
          ) : studentSkills.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Cpu className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No skills added yet. Add your technical competencies above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {studentSkills.map((sk) => (
                <div
                  key={sk.id}
                  className="group relative flex items-center justify-between p-4 rounded-2xl border border-slate-800 bg-slate-950/60 hover:border-indigo-500/40 transition duration-200"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{sk.skillName}</span>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {sk.proficiency}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{sk.category}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveSkill(sk.skillId)}
                    title="Remove Skill"
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
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
