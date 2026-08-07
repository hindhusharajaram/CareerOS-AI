import React, { useEffect, useState } from 'react';
import { Cpu, Plus, Trash2, Search, Code, CheckCircle2, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import StudentLayout from '../layouts/StudentLayout';
import { studentService, StudentSkillItem, SkillItem } from '../services/studentService';
import SectionHeader from '../components/ui/SectionHeader';
import { GlassCard } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import EmptyState from '../components/ui/EmptyState';
import { SkeletonCard } from '../components/ui/Skeleton';

const proficiencyColors: Record<string, 'default' | 'success' | 'warning' | 'emerald' | 'teal'> = {
  BEGINNER: 'default',
  INTERMEDIATE: 'emerald',
  ADVANCED: 'emerald',
  EXPERT: 'success',
};

export default function SkillsPage(): React.ReactElement {
  const [studentSkills, setStudentSkills] = useState<StudentSkillItem[]>([]);
  const [availableSkills, setAvailableSkills] = useState<SkillItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [customSkillName, setCustomSkillName] = useState('');
  const [proficiency, setProficiency] = useState('INTERMEDIATE');
  const [yearsExp] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [userSkills, allSkills] = await Promise.all([
        studentService.getStudentSkills(),
        studentService.getAvailableSkills()
      ]);
      setStudentSkills(userSkills);
      setAvailableSkills(allSkills);
    } catch (err) {
      toast.error('Could not fetch skills list.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkill = async (skillName: string, category = 'General') => {
    if (!skillName.trim()) return;
    setIsAdding(true);
    try {
      const newSkill = await studentService.addStudentSkill(skillName.trim(), proficiency, category, yearsExp);
      setStudentSkills((prev) => [...prev.filter((s) => s.skillId !== newSkill.skillId), newSkill]);
      setCustomSkillName('');
      setSearchQuery('');
      toast.success(`${skillName} added to your skills`);
    } catch (err) {
      toast.error('Failed to add skill.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemoveSkill = async (skillId: string, skillName: string) => {
    try {
      await studentService.removeStudentSkill(skillId);
      setStudentSkills((prev) => prev.filter((s) => s.skillId !== skillId));
      toast.success(`${skillName} removed`);
    } catch (err) {
      toast.error('Failed to remove skill.');
    }
  };

  const filteredAvailableSkills = availableSkills.filter((s) =>
    s.skillName.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 8); // limit suggestions

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        <SectionHeader
          title="Skills & Technologies"
          subtitle="Build your technical competency matrix for AI matching and resume optimization."
          badge="Profile Data"
          icon={<Cpu className="h-6 w-6" />}
        />

        {/* Add Skill Form */}
        <GlassCard padding="lg">
          <div className="flex items-center gap-2 mb-6">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Plus className="h-4.5 w-4.5" />
            </div>
            <h3 className="text-lg font-bold text-content-primary">Add New Skill</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-content-secondary">Skill Name</label>
              <div className="relative">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-content-muted" />
                <input
                  type="text"
                  placeholder="e.g. React, Python, Spring Boot..."
                  value={customSkillName || searchQuery}
                  onChange={(e) => {
                    setCustomSkillName(e.target.value);
                    setSearchQuery(e.target.value);
                  }}
                  className="w-full rounded-xl border border-surface-border bg-surface-card py-3 pl-10 pr-4 text-sm text-content-primary placeholder-content-muted focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-content-secondary">Proficiency Level</label>
              <div className="relative">
                <Zap className="absolute left-3.5 top-3.5 h-4 w-4 text-content-muted pointer-events-none" />
                <select
                  value={proficiency}
                  onChange={(e) => setProficiency(e.target.value)}
                  className="w-full rounded-xl border border-surface-border bg-surface-card py-3 pl-10 pr-10 text-sm text-content-primary focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                  <option value="EXPERT">Expert</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                  <svg className="w-4 h-4 text-content-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>

          {/* Smart Suggestions */}
          {searchQuery && filteredAvailableSkills.length > 0 && (
            <div className="mt-4 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
              <p className="text-xs font-semibold text-emerald-400 mb-3 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" /> Suggested Matches
              </p>
              <div className="flex flex-wrap gap-2">
                {filteredAvailableSkills.map((sk) => (
                  <button
                    key={sk.id}
                    onClick={() => handleAddSkill(sk.skillName, sk.category)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-border bg-surface-card text-xs font-medium text-content-secondary hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-content-primary transition-all shadow-sm group"
                  >
                    <Plus className="h-3 w-3 text-emerald-500 group-hover:text-emerald-400" />
                    {sk.skillName} <span className="opacity-50 font-normal">({sk.category})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end mt-5">
            <Button
              onClick={() => handleAddSkill(customSkillName || searchQuery)}
              disabled={isAdding || !(customSkillName || searchQuery).trim()}
              isLoading={isAdding}
              icon={<Plus className="h-4 w-4" />}
            >
              Add Skill
            </Button>
          </div>
        </GlassCard>

        {/* Current Skills Matrix */}
        <GlassCard padding="lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Code className="h-4.5 w-4.5" />
              </div>
              <h3 className="text-lg font-bold text-content-primary">Your Skill Matrix</h3>
            </div>
            <Badge variant="emerald">{studentSkills.length} Verified Skills</Badge>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} className="h-20" />)}
            </div>
          ) : studentSkills.length === 0 ? (
            <EmptyState
              icon={<Code />}
              title="No skills added yet"
              description="Start building your technical competency matrix above to unlock AI matching."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {studentSkills.map((sk) => (
                <div
                  key={sk.id}
                  className="group relative flex items-start justify-between p-4 rounded-xl border border-slate-800/80 bg-slate-900/50 hover:bg-slate-800/50 hover:border-slate-700 transition-all duration-200"
                >
                  <div className="flex-1 min-w-0 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                      <span className="font-bold text-white text-sm truncate">{sk.skillName}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={proficiencyColors[sk.proficiency] || 'default'} size="sm">
                        {sk.proficiency}
                      </Badge>
                      <span className="text-[10px] text-slate-500 truncate">{sk.category}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveSkill(sk.skillId, sk.skillName)}
                    title="Remove Skill"
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100 shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>
    </StudentLayout>
  );
}
