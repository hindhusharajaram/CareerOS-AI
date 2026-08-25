import React, { useState } from 'react';
import {
  Compass,
  BookOpen,
  Clock,
  Calendar,
  ArrowRight,
  Layers,
  RefreshCw,
  Search,
  Sparkles,
  AlertCircle,
  Cpu,
  Database,
  Shield,
  Cloud,
  Code2,
} from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { aiService, AILearningPlan } from '../services/aiService';
import SectionHeader from '../components/ui/SectionHeader';
import { GlassCard } from '../components/ui/Card';
import { SkeletonCard } from '../components/ui/Skeleton';

const dayColors = [
  'bg-[#2E4CFF]/10 border-[#2E4CFF]/30 text-[#2E4CFF]',
  'bg-purple-500/10 border-purple-500/30 text-purple-600',
  'bg-indigo-500/10 border-indigo-500/30 text-indigo-600',
  'bg-emerald-500/10 border-emerald-500/30 text-emerald-600',
  'bg-amber-500/10 border-amber-500/30 text-amber-600',
  'bg-sky-500/10 border-sky-500/30 text-sky-600',
  'bg-rose-500/10 border-rose-500/30 text-rose-600',
];

const SUGGESTION_CHIPS = [
  { label: 'Software Engineer', icon: Code2 },
  { label: 'Backend Engineer', icon: Database },
  { label: 'Data Science & AI', icon: Cpu },
  { label: 'DevOps & Cloud', icon: Cloud },
  { label: 'Frontend Developer', icon: Code2 },
  { label: 'Cybersecurity Analyst', icon: Shield },
];

export default function AiLearningCoachPage(): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [plan, setPlan] = useState<AILearningPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async (overrideQuery?: string) => {
    const query = (overrideQuery !== undefined ? overrideQuery : searchQuery).trim();
    if (!query) {
      setErrorMsg('Please enter a role, technical domain, or target skill to generate a study plan.');
      return;
    }

    setSearchQuery(query);
    setErrorMsg('');
    setIsLoading(true);
    setHasSearched(true);

    try {
      const data = await aiService.generateLearningPlan(query);
      setPlan(data);
    } catch {
      setErrorMsg('Unable to generate learning plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setHasSearched(false);
    setPlan(null);
    setErrorMsg('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <StudentLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <SectionHeader
          title="AI Learning Coach"
          subtitle="Generate personalized daily study routines, technology roadmaps, and skill sequences tailored to your target role"
          badge="AI Suite"
          icon={<Compass className="h-6 w-6 text-[#2E4CFF]" />}
          action={
            hasSearched ? (
              <button
                onClick={handleReset}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-hover border border-surface-border text-content-primary text-sm font-semibold hover:border-[#2E4CFF] hover:text-[#2E4CFF] transition-all disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Reset & New Search
              </button>
            ) : null
          }
        />

        {/* ===== SEARCH CONTAINER ===== */}
        <div className={`transition-all duration-300 ${!hasSearched ? 'py-8' : ''}`}>
          <div className="rounded-3xl border border-surface-border bg-surface-card p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-content-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search a role, domain, or skill — e.g. 'Backend Engineer', 'Data Science', 'DevOps'"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-surface-border bg-surface-hover text-content-primary placeholder:text-content-muted text-sm font-medium focus:outline-none focus:border-[#2E4CFF] focus:ring-2 focus:ring-[#2E4CFF]/20 transition-all"
                />
              </div>
              <button
                onClick={() => handleSearch()}
                disabled={isLoading}
                className="w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#2E4CFF] text-white font-semibold text-sm shadow-sm hover:bg-[#2E4CFF]/90 transition-all disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isLoading ? 'Generating...' : 'Generate Plan'}</span>
              </button>
            </div>

            {/* Suggestion Chips */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-content-muted mb-2.5 uppercase tracking-wider">
                Popular Target Domains & Roles:
              </p>
              <div className="flex flex-wrap items-center gap-2">
                {SUGGESTION_CHIPS.map((chip) => {
                  const ChipIcon = chip.icon;
                  const isSelected = searchQuery.toLowerCase() === chip.label.toLowerCase();
                  return (
                    <button
                      key={chip.label}
                      onClick={() => handleSearch(chip.label)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                        isSelected
                          ? 'border-[#2E4CFF] bg-[#2E4CFF] text-white shadow-sm'
                          : 'border-surface-border bg-surface-hover text-content-secondary hover:border-[#2E4CFF]/50 hover:text-[#2E4CFF]'
                      }`}
                    >
                      <ChipIcon className="h-3.5 w-3.5" />
                      <span>{chip.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {errorMsg && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/8 p-3 text-red-500 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        </div>

        {/* ===== INITIAL EMPTY STATE (BEFORE SEARCH) ===== */}
        {!hasSearched && (
          <div className="text-center py-12 px-4 rounded-3xl border border-dashed border-surface-border bg-surface-hover/30 space-y-3">
            <div className="h-12 w-12 rounded-2xl bg-[#2E4CFF]/10 text-[#2E4CFF] flex items-center justify-center mx-auto">
              <Compass className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-content-primary">Ready to Map Your Learning Routine</h3>
            <p className="text-xs text-content-secondary max-w-md mx-auto leading-relaxed">
              Enter a target engineering role or select one of the suggestion chips above to dynamically generate a customized technology sequence, weekly study schedule, and resource guide.
            </p>
          </div>
        )}

        {/* ===== LOADING STATE ===== */}
        {isLoading && (
          <div className="space-y-6 animate-pulse">
            <div className="flex items-center justify-between p-4 rounded-2xl border border-surface-border bg-surface-card">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-surface-hover rounded" />
                <div className="h-6 w-48 bg-surface-hover rounded" />
              </div>
              <div className="h-8 w-24 bg-surface-hover rounded-xl" />
            </div>
            <SkeletonCard className="h-32" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonCard key={i} className="h-36" />
              ))}
            </div>
          </div>
        )}

        {/* ===== POPULATED STUDY PLAN ===== */}
        {hasSearched && !isLoading && plan && (
          <div className="space-y-6 animate-fade-in">
            {/* Target Role & Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#2E4CFF]/5 border border-[#2E4CFF]/20 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-[#2E4CFF] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Compass className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-content-muted font-bold uppercase tracking-wider">Study Plan For</p>
                  <h3 className="text-xl font-extrabold text-content-primary">{plan.targetRole}</h3>
                </div>
              </div>
              <div className="sm:text-right">
                <p className="text-xs text-content-muted font-medium">Difficulty Progression</p>
                <p className="text-xs font-bold text-[#2E4CFF] bg-[#2E4CFF]/10 px-3 py-1 rounded-full border border-[#2E4CFF]/30 inline-block mt-1">
                  {plan.difficultyProgression}
                </p>
              </div>
            </div>

            {/* Tech Sequence */}
            <GlassCard padding="lg">
              <h3 className="text-xs font-bold text-[#2E4CFF] uppercase tracking-wider flex items-center gap-2 mb-4">
                <Layers className="h-4 w-4" />
                Technology Learning Sequence
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                {plan.technologySequence.map((tech, idx) => (
                  <React.Fragment key={idx}>
                    <span className="px-3.5 py-2 rounded-xl bg-[#2E4CFF]/10 text-[#2E4CFF] border border-[#2E4CFF]/25 text-xs font-bold font-mono hover:bg-[#2E4CFF]/20 transition-colors">
                      {tech}
                    </span>
                    {idx < plan.technologySequence.length - 1 && (
                      <ArrowRight className="h-3.5 w-3.5 text-content-muted" />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </GlassCard>

            {/* Weekly Schedule */}
            <GlassCard padding="lg">
              <div className="flex items-center gap-2 mb-5">
                <Calendar className="h-5 w-5 text-[#2E4CFF]" />
                <h3 className="text-base font-bold text-content-primary">Weekly Study Schedule</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {plan.weeklyPlan.map((day, idx) => {
                  const colorClass = dayColors[idx % dayColors.length];
                  return (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl bg-surface-card border border-surface-border hover:border-[#2E4CFF]/30 transition-all space-y-3 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${colorClass}`}>
                          {day.day}
                        </span>
                        <span className="text-[11px] font-mono text-content-secondary flex items-center gap-1">
                          <Clock className="h-3 w-3 text-[#2E4CFF]" />
                          {day.durationMinutes} mins
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-content-primary">{day.topic}</h4>
                      <p className="text-xs text-content-secondary leading-relaxed">{day.activity}</p>
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            {/* Resources */}
            <GlassCard padding="md">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="h-4.5 w-4.5 text-[#2E4CFF]" />
                <h3 className="text-sm font-bold text-content-primary">Recommended Learning Resources</h3>
              </div>
              <div className="space-y-2">
                {plan.recommendedResources.map((res, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-xl bg-surface-hover border border-surface-border text-xs text-content-primary font-medium"
                  >
                    <span className="text-[#2E4CFF] shrink-0">📖</span>
                    {res}
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

