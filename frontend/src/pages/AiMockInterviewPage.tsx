import React, { useState } from 'react';
import {
  Target,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Zap,
  Search,
  AlertCircle,
  Cpu,
  Database,
  Cloud,
  Code2,
  SlidersHorizontal,
} from 'lucide-react';
import StudentLayout from '../layouts/StudentLayout';
import { aiService, AIMockInterview } from '../services/aiService';
import SectionHeader from '../components/ui/SectionHeader';
import { GlassCard } from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import { SkeletonCard } from '../components/ui/Skeleton';

const categoryColors: Record<string, any> = {
  TECHNICAL: 'indigo',
  BEHAVIORAL: 'purple',
  'SYSTEM DESIGN': 'emerald',
  CODING: 'amber',
  HR: 'sky',
};

const SUGGESTION_CHIPS = [
  { label: 'Software Engineer', icon: Code2 },
  { label: 'Backend Engineer', icon: Database },
  { label: 'Data Scientist', icon: Cpu },
  { label: 'DevOps Engineer', icon: Cloud },
  { label: 'Frontend Developer', icon: Code2 },
  { label: 'Product Manager', icon: Target },
];

const DIFFICULTY_LEVELS = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

export default function AiMockInterviewPage(): React.ReactElement {
  const [searchQuery, setSearchQuery] = useState('');
  const [difficulty, setDifficulty] = useState('INTERMEDIATE');
  const [hasSearched, setHasSearched] = useState(false);
  const [interview, setInterview] = useState<AIMockInterview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSearch = async (overrideQuery?: string, overrideDiff?: string) => {
    const query = (overrideQuery !== undefined ? overrideQuery : searchQuery).trim();
    const activeDiff = overrideDiff !== undefined ? overrideDiff : difficulty;

    if (!query) {
      setErrorMsg('Please enter a target role or domain to generate a mock interview session.');
      return;
    }

    setSearchQuery(query);
    setDifficulty(activeDiff);
    setErrorMsg('');
    setIsLoading(true);
    setHasSearched(true);
    setExpandedIdx(null);

    try {
      const data = await aiService.generateMockInterview(query, activeDiff);
      setInterview(data);
    } catch {
      setErrorMsg('Unable to generate mock interview. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSearchQuery('');
    setDifficulty('INTERMEDIATE');
    setHasSearched(false);
    setInterview(null);
    setExpandedIdx(null);
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
          title="AI Mock Interview Simulator"
          subtitle="Simulate domain-tailored technical, behavioral, and system design interviews with expected answer key points"
          badge="AI Suite"
          icon={<Target className="h-6 w-6 text-[#2E4CFF]" />}
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

        {/* ===== SEARCH & DIFFICULTY CONTAINER ===== */}
        <div className={`transition-all duration-300 ${!hasSearched ? 'py-8' : ''}`}>
          <div className="rounded-3xl border border-surface-border bg-surface-card p-6 shadow-sm space-y-4">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-content-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search a role or domain to start your mock interview — e.g. 'Backend Engineer', 'Data Scientist', 'Product Manager'"
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-surface-border bg-surface-hover text-content-primary placeholder:text-content-muted text-sm font-medium focus:outline-none focus:border-[#2E4CFF] focus:ring-2 focus:ring-[#2E4CFF]/20 transition-all"
                />
              </div>

              {/* Difficulty Selector */}
              <div className="flex items-center gap-1.5 p-1.5 rounded-2xl border border-surface-border bg-surface-hover shrink-0">
                <div className="flex items-center gap-1.5 px-2 text-xs font-semibold text-content-muted">
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Difficulty:</span>
                </div>
                {DIFFICULTY_LEVELS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDifficulty(level)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      difficulty === level
                        ? 'bg-[#2E4CFF] text-white shadow-sm'
                        : 'text-content-secondary hover:text-content-primary'
                    }`}
                  >
                    {level.charAt(0) + level.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>

              {/* Submit Button */}
              <button
                onClick={() => handleSearch()}
                disabled={isLoading}
                className="w-full lg:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#2E4CFF] text-white font-semibold text-sm shadow-sm hover:bg-[#2E4CFF]/90 transition-all disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isLoading ? 'Generating...' : 'Start Interview'}</span>
              </button>
            </div>

            {/* Suggestion Chips */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-content-muted mb-2.5 uppercase tracking-wider">
                Popular Target Roles:
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
              <Target className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-content-primary">Ready to Simulate Your Technical Interview</h3>
            <p className="text-xs text-content-secondary max-w-md mx-auto leading-relaxed">
              Enter any engineering role or select a popular target chip above to generate realistic technical questions, key answer points, and follow-up prompts.
            </p>
          </div>
        )}

        {/* ===== LOADING STATE ===== */}
        {isLoading && (
          <div className="space-y-4 animate-pulse">
            <div className="flex items-center justify-between p-4 rounded-2xl border border-surface-border bg-surface-card">
              <div className="space-y-2">
                <div className="h-4 w-32 bg-surface-hover rounded" />
                <div className="h-6 w-48 bg-surface-hover rounded" />
              </div>
              <div className="h-8 w-24 bg-surface-hover rounded-xl" />
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonCard key={i} className="h-36" />
            ))}
          </div>
        )}

        {/* ===== POPULATED INTERVIEW SESSION ===== */}
        {hasSearched && !isLoading && interview && (
          <div className="space-y-6 animate-fade-in">
            {/* Session Info Header */}
            <div className="rounded-2xl border border-[#2E4CFF]/20 bg-[#2E4CFF]/5 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <p className="text-xs font-bold text-content-muted uppercase tracking-wider mb-1">
                  Interview Session · {interview.questions.length} Questions
                </p>
                <h3 className="text-xl font-black text-content-primary">{interview.targetRole}</h3>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="success" size="lg" dot>
                  {interview.difficultyLevel}
                </Badge>
                <div className="flex items-center gap-1.5 text-xs text-content-secondary font-medium">
                  <Zap className="h-3.5 w-3.5 text-[#2E4CFF]" />
                  AI-Generated
                </div>
              </div>
            </div>

            {/* Questions Sequence */}
            <div className="space-y-4">
              {interview.questions.map((q, idx) => {
                const isExpanded = expandedIdx === idx;
                const catColor = categoryColors[q.category] || 'indigo';
                return (
                  <div
                    key={q.id}
                    className="rounded-2xl border border-surface-border bg-surface-card overflow-hidden transition-all duration-200 hover:border-[#2E4CFF]/30 shadow-sm"
                  >
                    <button
                      onClick={() => setExpandedIdx(isExpanded ? null : idx)}
                      className="w-full flex items-start gap-4 p-5 text-left"
                    >
                      {/* Question Index Badge */}
                      <div className="h-8 w-8 rounded-xl bg-[#2E4CFF] flex items-center justify-center text-white font-black text-sm shrink-0 mt-0.5 shadow-sm">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Badge variant={catColor} size="sm">
                            {q.category}
                          </Badge>
                        </div>
                        <h4 className="text-sm font-bold text-content-primary leading-relaxed">
                          {q.questionText}
                        </h4>
                      </div>
                      <ChevronRight
                        className={`h-4 w-4 text-content-muted shrink-0 mt-1 transition-transform duration-200 ${
                          isExpanded ? 'rotate-90 text-[#2E4CFF]' : ''
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 space-y-4 border-t border-surface-border pt-4 bg-surface-hover/30">
                        {/* Expected Key Points */}
                        <div className="p-4 rounded-xl bg-surface-card border border-[#2E4CFF]/20 shadow-sm">
                          <p className="text-xs font-bold text-[#2E4CFF] flex items-center gap-1.5 mb-2">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Expected Key Points
                          </p>
                          <p className="text-xs text-content-secondary leading-relaxed font-medium">
                            {q.expectedAnswerKeyPoints}
                          </p>
                        </div>

                        {/* Follow-up Questions */}
                        {q.followUpQuestions.length > 0 && (
                          <div>
                            <p className="text-xs font-bold text-content-muted mb-2 uppercase tracking-wider">
                              Follow-up Questions
                            </p>
                            <div className="space-y-1.5">
                              {q.followUpQuestions.map((f, fIdx) => (
                                <div
                                  key={fIdx}
                                  className="flex items-center gap-2 text-xs text-content-secondary font-medium"
                                >
                                  <ChevronRight className="h-3.5 w-3.5 text-[#2E4CFF] shrink-0" />
                                  {f}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Evaluation Rubric */}
            <GlassCard padding="md">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-4.5 w-4.5 text-[#2E4CFF]" />
                <h3 className="text-sm font-bold text-content-primary">Evaluation Rubric</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {interview.evaluationRubric.map((rub, rIdx) => (
                  <div
                    key={rIdx}
                    className="p-3 rounded-xl bg-surface-hover border border-surface-border text-xs text-content-primary font-semibold text-center"
                  >
                    {rub}
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

